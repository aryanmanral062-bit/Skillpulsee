import { query } from '../db/client';

export async function computeTelemetryModifier(userId: string, windowDays: number): Promise<number> {
  const eventsRes = await query(`
    SELECT event_type
    FROM telemetry_events
    WHERE user_id = $1 AND timestamp >= NOW() - ('1 day'::interval * $2)
  `, [userId, windowDays]);

  if (eventsRes.rowCount === 0) return 0;

  const events = eventsRes.rows;
  let deploys = 0;
  let failures = 0;

  for (const event of events) {
    if (event.event_type === 'deploy') deploys++;
    else if (event.event_type === 'error' || event.event_type === 'rollback') failures++;
  }

  // Purely errors/rollbacks without deploys -> penalized explicitly incrementally
  if (deploys === 0 && failures > 0) return Math.max(-10, failures * -2);
  
  if (deploys === 0 && failures === 0) return 0;

  const successRate = deploys / (deploys + failures);
  
  // Base modifier defaults to max 10
  // Formula: Map successRate [0, 1] to [-10, 10]
  // 100% success -> +10
  // 50% success -> 0
  // 0% success -> -10
  const modifier = (successRate * 20) - 10;
  
  // Discard decimals, clamp [-10, 10] safely
  return Math.min(Math.max(Math.round(modifier), -10), 10);
}
