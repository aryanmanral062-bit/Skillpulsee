import { Router } from 'express';
import { query } from '../db/client';
import { asyncHandler } from '../middleware/asyncHandler';

export const teamRouter = Router();

teamRouter.get('/summary', asyncHandler(async (req, res) => {
  const activeScoresRes = await query(`
    SELECT u.id, u.name, u.email, s.skill_score, s.skill_gaps, s.computed_at
    FROM users u
    JOIN LATERAL (
      SELECT skill_score, skill_gaps, computed_at 
      FROM skill_scores 
      WHERE user_id = u.id AND skill_score IS NOT NULL
      ORDER BY computed_at DESC LIMIT 1
    ) s ON true
  `);

  const scores = activeScoresRes.rows;
  const teamSize = scores.length;

  if (teamSize === 0) {
    return res.json({
      teamSize: 0,
      avgSkillScore: 0,
      topPerformers: [],
      improvementNeeded: [],
      commonGaps: [],
      computedAt: new Date().toISOString()
    });
  }

  const sorted = [...scores].sort((a, b) => parseFloat(b.skill_score) - parseFloat(a.skill_score));
  
  const sum = sorted.reduce((acc, val) => acc + parseFloat(val.skill_score), 0);
  const avgSkillScore = Math.round((sum / teamSize) * 10) / 10;

  const topPerformers = sorted.slice(0, 3).map(r => ({ id: r.id, name: r.name, email: r.email, skillScore: parseFloat(r.skill_score) }));
  
  const bottomSlice = sorted.length > 3 ? sorted.slice(-3) : sorted;
  const improvementNeeded = bottomSlice.sort((a, b) => parseFloat(a.skill_score) - parseFloat(b.skill_score))
      .map(r => ({ id: r.id, name: r.name, email: r.email, skillScore: parseFloat(r.skill_score) }));

  const gapFreq: Record<string, number> = {};
  for (const s of scores) {
     const gaps = s.skill_gaps || [];
     for (const g of gaps) {
        gapFreq[g] = (gapFreq[g] || 0) + 1;
     }
  }
  
  const commonGaps = Object.entries(gapFreq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(e => e[0]);

  res.json({
    teamSize,
    avgSkillScore,
    topPerformers,
    improvementNeeded,
    commonGaps,
    computedAt: new Date().toISOString()
  });
}));
