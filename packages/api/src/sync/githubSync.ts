import { fetchUserCommits, fetchUserPRs } from '../connectors/github';
import { query } from '../db/client';
import { resolveOrCreateUser } from '../engine/identity';
import { extractKeywords } from '../engine/nlp';

export async function syncGithubDataForUser(userId: string, githubLogin: string, days: number = 90) {
  // 1. Fetch GitHub commits
  const commits = await fetchUserCommits(githubLogin, days);
  for (const commit of commits) {
    // Identity resolution for any new email addresses encountered
    if (commit.authorEmail) {
       await resolveOrCreateUser(commit.authorEmail, githubLogin, undefined);
    }

    const keywords = extractKeywords(commit.message);
    const text = `
      INSERT INTO github_commits (user_id, sha, repo, message, additions, deletions, files_changed, committed_at, keywords)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      ON CONFLICT (sha) DO NOTHING;
    `;
    const values = [
      userId, commit.sha, commit.repo, commit.message, 
      commit.additions, commit.deletions, commit.filesChanged, commit.committedAt,
      keywords
    ];
    await query(text, values);
  }

  // 2. Fetch GitHub PRs
  const prs = await fetchUserPRs(githubLogin, days);
  for (const pr of prs) {
    if (pr.authorEmail) {
       await resolveOrCreateUser(pr.authorEmail, githubLogin, undefined);
    }

    const text = `
      INSERT INTO github_prs (user_id, pr_number, repo, title, state, review_count, comments_count, additions, deletions, opened_at, merged_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      ON CONFLICT (repo, pr_number) DO UPDATE SET
        state = EXCLUDED.state,
        review_count = EXCLUDED.review_count,
        comments_count = EXCLUDED.comments_count,
        merged_at = EXCLUDED.merged_at,
        fetched_at = NOW();
    `;
    const values = [
      userId, pr.prNumber, pr.repo, pr.title, pr.state, 
      pr.reviewCount, pr.commentsCount, pr.additions, pr.deletions, 
      pr.openedAt, pr.mergedAt
    ];
    await query(text, values);
  }
}
