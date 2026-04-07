import { query } from '../db/client';

export const SKILL_TAGS = [
  'nodejs','node','python','typescript','react','vue','angular',
  'postgresql','mysql','mongodb','redis','elasticsearch',
  'docker','kubernetes','k8s','terraform','aws','gcp','azure',
  'testing','tdd','jest','cypress','playwright',
  'ci-cd','github-actions','jenkins',
  'rest-api','graphql','grpc',
  'security','oauth','jwt',
  'performance','optimization','caching',
  'machine-learning','data-analysis',
  'frontend','backend','fullstack','devops','mobile'
];

function normalizeTags(labels: string[]): string[] {
  return labels
    .map(t => t.toLowerCase().trim())
    .filter(t => SKILL_TAGS.includes(t));
}

export async function analyzeGaps(userId: string, windowDays: number): Promise<{
  topSkills: string[];
  skillGaps: string[];
}> {
  // 1. Get all labels & keywords for user
  const userIssuesRes = await query(`
    SELECT labels, keywords FROM jira_issues
    WHERE user_id = $1 AND created_at >= NOW() - ('1 day'::interval * $2)
  `, [userId, windowDays]);
  
  const userTagFreq: Record<string, number> = {};
  for (const row of userIssuesRes.rows) {
    const tags = normalizeTags(row.labels || []);
    const allTags = [...new Set([...tags, ...(row.keywords || [])])];
    for (const t of allTags) {
      userTagFreq[t] = (userTagFreq[t] || 0) + 1;
    }
  }

  // Read github commit keywords
  const userCommitsRes = await query(`
    SELECT keywords FROM github_commits
    WHERE user_id = $1 AND committed_at >= NOW() - ('1 day'::interval * $2)
  `, [userId, windowDays]);

  for (const row of userCommitsRes.rows) {
    const kws = row.keywords || [];
    for (const kw of kws) {
      userTagFreq[kw] = (userTagFreq[kw] || 0) + 1;
    }
  }

  // 2. Get all labels & keywords from ALL users' issues in window
  const allIssuesRes = await query(`
    SELECT labels, keywords FROM jira_issues
    WHERE created_at >= NOW() - ('1 day'::interval * $1)
  `, [windowDays]);

  const teamTagFreq: Record<string, number> = {};
  for (const row of allIssuesRes.rows) {
    const tags = normalizeTags(row.labels || []);
    const allTags = [...new Set([...tags, ...(row.keywords || [])])];
    for (const t of allTags) {
      teamTagFreq[t] = (teamTagFreq[t] || 0) + 1;
    }
  }

  // Count team members for average
  const activeUsersRes = await query(`
    SELECT COUNT(DISTINCT user_id) as count FROM jira_issues 
    WHERE created_at >= NOW() - ('1 day'::interval * $1)
  `, [windowDays]);
  const teamSize = parseInt(activeUsersRes.rows[0].count, 10) || 1;

  // 3. Detect Gaps
  const gapsWithMagnitude: { tag: string; mag: number }[] = [];
  
  // threshold for team frequency to be considered a team skill
  const threshold = Math.max(Math.ceil(teamSize * 0.5), 2); 

  for (const tag of Object.keys(teamTagFreq)) {
    if (teamTagFreq[tag] >= threshold) {
      const teamAvg = teamTagFreq[tag] / teamSize;
      const userFreq = userTagFreq[tag] || 0;

      if (userFreq === 0 || userFreq < 0.3 * teamAvg) {
        const magnitude = teamAvg - userFreq; // how far below team average
        gapsWithMagnitude.push({ tag, mag: magnitude });
      }
    }
  }

  // Sort and pick top 3
  gapsWithMagnitude.sort((a, b) => b.mag - a.mag);
  const skillGaps = gapsWithMagnitude.slice(0, 3).map(g => g.tag);

  // Top Skills
  const topSkillsEntries = Object.entries(userTagFreq).sort((a, b) => b[1] - a[1]);
  const topSkills = topSkillsEntries.slice(0, 3).map(e => e[0]);

  return { topSkills, skillGaps };
}
