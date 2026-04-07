import { query } from '../db/client';

export async function buildRelationships(windowDays: number) {
  // Strategy:
  // Build edges natively between users structurally tied to identical repositories

  const repoPairsRes = await query(`
    SELECT a.user_id as user_a, b.user_id as user_b, a.repo
    FROM github_commits a
    JOIN github_commits b ON a.repo = b.repo AND a.user_id != b.user_id
    WHERE a.committed_at >= NOW() - ('1 day'::interval * $1)
      AND b.committed_at >= NOW() - ('1 day'::interval * $1)
    GROUP BY a.user_id, b.user_id, a.repo
  `, [windowDays]);

  for (const row of repoPairsRes.rows) {
    await query(`
      INSERT INTO user_relations (user_id, related_user_id, relation_type, weight)
      VALUES ($1, $2, 'collaborated', 1)
      ON CONFLICT (user_id, related_user_id, relation_type) 
      DO UPDATE SET weight = user_relations.weight + 1, last_interaction = NOW()
    `, [row.user_a, row.user_b]);
  }
}

export async function computeCollaborationMetric(userId: string): Promise<number> {
  const relationsRes = await query(`
    SELECT SUM(weight) as total_interactions, COUNT(DISTINCT related_user_id) as connections
    FROM user_relations
    WHERE user_id = $1 AND relation_type = 'collaborated'
  `, [userId]);

  if (relationsRes.rowCount === 0) return 0;

  const row = relationsRes.rows[0];
  const connections = parseInt(row.connections, 10) || 0;
  
  // A centrality score formula: +2 per unique connection mapped logically
  const bonus = connections * 2;
  return Math.min(bonus, 10);
}
