import cron from 'node-cron';
import { query } from '../db/client';
import { syncGithubDataForUser } from './githubSync';
import { syncJiraDataForUser } from './jiraSync';
import { computeAndStore } from '../engine/scorer';
import { buildRelationships } from '../engine/graph';

export async function runSyncJob() {
  console.log('[Sync] Starting full sync job...');
  try {
    const usersRes = await query('SELECT id, email, github_login, jira_account_id FROM users');
    const users = usersRes.rows;

    const windowDays = parseInt(process.env.SCORE_WINDOW_DAYS || '90', 10);

    // Run users sequentially, NOT in parallel — GitHub rate limits
    for (const user of users) {
      console.log(`[Sync] Processing user ${user.email}...`);

      if (user.github_login) {
        try {
          await syncGithubDataForUser(user.id, user.github_login, windowDays);
          await logSync(user.id, 'github', 'ok');
        } catch (error) {
          console.error(`[Sync] Error syncing GitHub for ${user.email}:`, error);
          await logSync(user.id, 'github', 'error', error instanceof Error ? error.message : 'Unknown error');
        }
      }

      /*
      if (user.email) {
        try {
          await syncJiraDataForUser(user.id, user.email, windowDays);
          await logSync(user.id, 'jira', 'ok');
        } catch (error) {
          console.error(`[Sync] Error syncing Jira for ${user.email}:`, error);
          await logSync(user.id, 'jira', 'error', error instanceof Error ? error.message : 'Unknown error');
        }
      }
      */
    }

    console.log('[Sync] Constructing global topology matching relationships...');
    await buildRelationships(windowDays);

    console.log('[Sync] Aggregating subscores and unified metric telemetry payload...');
    for (const user of users) {
      try {
        await computeAndStore(user.id);
      } catch (error) {
        console.error(`[Sync] Failed to compute score for ${user.email}:`, error);
      }
    }

    console.log('[Sync] Full sync job completed.');
  } catch (error) {
    console.error('[Sync] Sync job failed to retrieve users:', error);
  }
}

async function logSync(userId: string, source: string, status: string, errorMsg?: string) {
  try {
    const text = `
      INSERT INTO sync_log (user_id, source, status, error_msg, synced_at)
      VALUES ($1, $2, $3, $4, NOW())
    `;
    await query(text, [userId, source, status, errorMsg || null]);
  } catch (error) {
    console.error(`[Sync] Failed to insert sync log for user ${userId}`, error);
  }
}

export function startScheduler() {
  const schedule = process.env.SYNC_CRON_SCHEDULE || '0 */6 * * *';
  console.log(`[Sync] Starting scheduler with cron: ${schedule}`);
  cron.schedule(schedule, () => {
    runSyncJob().catch(err => console.error('[Sync] Job failed entirely:', err));
  });
}
