import axios, { AxiosError } from 'axios';
import { ConnectorError } from '../errors';

export interface GithubCommit {
  sha: string;
  repo: string;
  message: string;
  additions: number;
  deletions: number;
  filesChanged: number;
  committedAt: string;
  authorEmail: string;
}

export interface GithubPR {
  prNumber: number;
  repo: string;
  title: string;
  state: string;
  reviewCount: number;
  commentsCount: number;
  additions: number;
  deletions: number;
  openedAt: string;
  mergedAt: string | null;
  authorEmail: string;
}

const GITHUB_API_URL = 'https://api.github.com';

const apiClient = axios.create({
  baseURL: GITHUB_API_URL,
  headers: {
    Accept: 'application/vnd.github.v3+json',
  },
});

let rateLimitWaitPromise: Promise<void> | null = null;

apiClient.interceptors.request.use(async (config) => {
  if (rateLimitWaitPromise) {
    await rateLimitWaitPromise;
  }
  const token = process.env.GITHUB_TOKEN;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => {
    const remaining = Number(response.headers['x-ratelimit-remaining']);
    const reset = Number(response.headers['x-ratelimit-reset']);
    
    if (remaining < 10 && reset) {
      const waitTime = Math.max(0, (reset * 1000) - Date.now());
      if (waitTime > 0 && !rateLimitWaitPromise) {
        console.warn(`[GitHub] Rate limit remaining: ${remaining}. Waiting ${waitTime}ms...`);
        rateLimitWaitPromise = new Promise(resolve => setTimeout(() => {
          rateLimitWaitPromise = null;
          resolve(); 
        }, waitTime));
      }
    }
    return response;
  },
  async (error: AxiosError) => {
    if (error.response?.status === 429 || error.response?.status === 403) {
      // 403 can also be rate limit (API rate limit exceeded)
      const reset = Number(error.response.headers['x-ratelimit-reset']);
      if (reset && !rateLimitWaitPromise) {
        const waitTime = Math.max(0, (reset * 1000) - Date.now());
        console.warn(`[GitHub] Rate limit exceeded (429/403). Waiting ${waitTime}ms...`);
        if (waitTime > 0) {
          rateLimitWaitPromise = new Promise(resolve => setTimeout(() => {
            rateLimitWaitPromise = null;
            resolve();
          }, waitTime + 5000)); // buffer 5 seconds
        }
      }
      
      if (rateLimitWaitPromise) {
        await rateLimitWaitPromise;
        // Retry original request
        if (error.config) {
          return apiClient.request(error.config);
        }
      }
    }
    throw error;
  }
);

function handleError(error: any, contextMsg: string): never {
  if (axios.isAxiosError(error)) {
    throw new ConnectorError(
      'github',
      error.response?.status,
      `${contextMsg}: ${error.message}`
    );
  }
  throw new ConnectorError('github', 500, error instanceof Error ? error.message : 'Unknown error');
}

async function fetchAllPages(url: string, params: Record<string, any> = {}): Promise<any[]> {
  let results: any[] = [];
  try {
    params.per_page = 100;
    let nextUrl: string | null = url;

    while (nextUrl) {
      const response = await apiClient.get(nextUrl, { params: nextUrl === url ? params : undefined });
      results = results.concat(response.data);

      const linkHeader = response.headers['link'] as string;
      nextUrl = null;
      if (linkHeader) {
        const links = linkHeader.split(',').map((part: string) => part.split(';'));
        const nextLink = links.find((link: string[]) => link[1].includes('rel="next"'));
        if (nextLink) {
          // Extract URL between <>
          nextUrl = nextLink[0].trim().slice(1, -1);
        }
      }
    }
  } catch (error) {
    handleError(error, `Failed to fetch pagination for ${url}`);
  }
  return results;
}

function getGithubOwner(): string {
  if (process.env.GITHUB_ORG) return process.env.GITHUB_ORG;
  if (process.env.GITHUB_USERNAME) return process.env.GITHUB_USERNAME;
  throw new Error('No GitHub source configured');
}

export async function listRepos(): Promise<string[]> {
  if (process.env.GITHUB_ORG) {
    const repos = await fetchAllPages(`/orgs/${process.env.GITHUB_ORG}/repos`);
    return repos.map((repo: any) => repo.name);
  } else if (process.env.GITHUB_USERNAME) {
    const repos = await fetchAllPages(`/users/${process.env.GITHUB_USERNAME}/repos`);
    return repos.map((repo: any) => repo.name);
  }
  throw new Error('No GitHub source configured');
}

export async function fetchUserCommits(githubLogin: string, days: number): Promise<GithubCommit[]> {
  const owner = getGithubOwner();

  const since = new Date();
  since.setDate(since.getDate() - days);
  const sinceIso = since.toISOString();

  let repos: string[] = [];
  try {
    repos = await listRepos();
  } catch (error) {
    handleError(error, 'Failed to list repos');
  }

  const allCommits: GithubCommit[] = [];

  for (const repo of repos) {
    try {
      const commits = await fetchAllPages(`/repos/${owner}/${repo}/commits`, {
        author: githubLogin,
        since: sinceIso,
      });

      for (const commitData of commits) {
        try {
          const detailRes = await apiClient.get(`/repos/${owner}/${repo}/commits/${commitData.sha}`);
          const detail = detailRes.data;

          allCommits.push({
            sha: detail.sha,
            repo,
            message: detail.commit.message,
            additions: detail.stats?.additions || 0,
            deletions: detail.stats?.deletions || 0,
            filesChanged: detail.files?.length || 0,
            committedAt: detail.commit.author.date,
            authorEmail: detail.commit.author.email
          });
        } catch (detailError) {
          // Log and continue if a specific commit fails to load
          console.error(`[GitHub] Failed to get detail for commit ${commitData.sha}:`, detailError);
        }
      }
    } catch (error) {
      console.error(`[GitHub] Failed to get commits for repo ${repo}:`, error);
      // We don't throw; we just continue to other repos to fetch what we can.
    }
  }

  return allCommits;
}

export async function fetchUserPRs(githubLogin: string, days: number): Promise<GithubPR[]> {
  const owner = getGithubOwner();

  const since = new Date();
  since.setDate(since.getDate() - days);

  let repos: string[] = [];
  try {
    repos = await listRepos();
  } catch (error) {
    handleError(error, 'Failed to list repos');
  }
  
  const allPRs: GithubPR[] = [];

  for (const repo of repos) {
    try {
      const prs = await fetchAllPages(`/repos/${owner}/${repo}/pulls`, {
        state: 'all',
        sort: 'created',
        direction: 'desc'
      });

      for (const pr of prs) {
        if (pr.user.login !== githubLogin) continue;
        
        const openedAt = new Date(pr.created_at);
        if (openedAt < since) {
          // PRs are sorted completely by created (desc), so we're past the timeframe
          break;
        }

        try {
          const reviewRes = await fetchAllPages(`/repos/${owner}/${repo}/pulls/${pr.number}/reviews`);
          const reviewCount = reviewRes.length;
          
          const detailRes = await apiClient.get(`/repos/${owner}/${repo}/pulls/${pr.number}`);
          const detail = detailRes.data;

          // Attempt to fetch email from PR commits if needed, or fallback to user profile / empty string
          let authorEmail = '';
          try {
            const prCommitsRes = await apiClient.get(detail.commits_url, { params: { per_page: 1 } });
            if (prCommitsRes.data && prCommitsRes.data.length > 0) {
              authorEmail = prCommitsRes.data[0].commit.author.email;
            }
          } catch (e) {
             // ignore email fetch failure
          }

          allPRs.push({
            prNumber: pr.number,
            repo,
            title: pr.title,
            state: pr.state === 'closed' && pr.merged_at ? 'merged' : pr.state,
            reviewCount,
            commentsCount: detail.comments || 0,
            additions: detail.additions || 0,
            deletions: detail.deletions || 0,
            openedAt: pr.created_at,
            mergedAt: pr.merged_at || null,
            authorEmail
          });
        } catch (prDetailError) {
           console.error(`[GitHub] Failed to get detail for PR #${pr.number} in ${repo}:`, prDetailError);
        }
      }
    } catch (error) {
      console.error(`[GitHub] Failed to get PRs for repo ${repo}:`, error);
    }
  }

  return allPRs;
}
