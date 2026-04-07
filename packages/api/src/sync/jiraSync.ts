import { fetchUserIssues } from '../connectors/jira';
import { query } from '../db/client';
import { resolveOrCreateUser } from '../engine/identity';
import { extractKeywords } from '../engine/nlp';

export async function syncJiraDataForUser(userId: string, email: string, days: number = 90) {
  // 3. Fetch Jira issues
  const issues = await fetchUserIssues(email, days);

  for (const issue of issues) {
     // Identity resolution for any new email addresses encountered
     if (issue.assigneeEmail) {
        await resolveOrCreateUser(issue.assigneeEmail, undefined, undefined);
     }

     const keywords = extractKeywords(issue.summary);
     const text = `
       INSERT INTO jira_issues (user_id, issue_key, summary, issue_type, status, priority, story_points, original_estimate_hours, time_spent_hours, labels, created_at, resolved_at, keywords)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
       ON CONFLICT (issue_key) DO UPDATE SET
         summary = EXCLUDED.summary,
         status = EXCLUDED.status,
         story_points = EXCLUDED.story_points,
         time_spent_hours = EXCLUDED.time_spent_hours,
         labels = EXCLUDED.labels,
         resolved_at = EXCLUDED.resolved_at,
         keywords = EXCLUDED.keywords,
         fetched_at = NOW();
     `;
     const values = [
       userId, issue.issueKey, issue.summary, issue.issueType, issue.status,
       issue.priority, issue.storyPoints, issue.originalEstimateHours,
       issue.timeSpentHours, issue.labels, issue.createdAt, issue.resolvedAt,
       keywords
     ];
     await query(text, values);
  }
}
