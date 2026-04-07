import { Router } from 'express';
import { query } from '../db/client';
import { asyncHandler } from '../middleware/asyncHandler';

export const employeesRouter = Router();

employeesRouter.get('/', asyncHandler(async (req, res) => {
  const usersRes = await query(`
    SELECT u.id, u.email, u.name, u.github_login,
           s.skill_score, s.activity_score, s.consistency_score, 
           s.efficiency_score, s.pr_quality_score, s.top_skills, s.skill_gaps, s.computed_at,
           s.telemetry_modifier, s.collaboration_score
    FROM users u
    LEFT JOIN LATERAL (
      SELECT * FROM skill_scores 
      WHERE user_id = u.id 
      ORDER BY computed_at DESC LIMIT 1
    ) s ON true
  `);

  const employees = usersRes.rows.map(row => {
    let latestScore = null;
    if (row.computed_at) {
      latestScore = {
        skillScore: parseFloat(row.skill_score),
        activityScore: row.activity_score ? parseFloat(row.activity_score) : null,
        consistencyScore: row.consistency_score ? parseFloat(row.consistency_score) : null,
        efficiencyScore: row.efficiency_score ? parseFloat(row.efficiency_score) : null,
        prQualityScore: row.pr_quality_score ? parseFloat(row.pr_quality_score) : null,
        topSkills: row.top_skills || [],
        skillGaps: row.skill_gaps || [],
        telemetryImpact: row.telemetry_modifier ? parseFloat(row.telemetry_modifier) : 0,
        collaborationScore: row.collaboration_score ? parseFloat(row.collaboration_score) : 0,
        computedAt: row.computed_at
      };
    }
    
    return {
      id: row.id,
      email: row.email,
      name: row.name,
      githubLogin: row.github_login,
      latestScore
    };
  });

  res.json({ employees });
}));

employeesRouter.get('/:id/score', asyncHandler(async (req, res) => {
  const { id } = req.params;
  
  const userRes = await query('SELECT id, email, name FROM users WHERE id = $1', [id]);
  if (userRes.rowCount === 0) return res.status(404).json({ error: 'not_found' });
  const user = userRes.rows[0];

  const scoreRes = await query(`
    SELECT * FROM skill_scores 
    WHERE user_id = $1 
    ORDER BY computed_at DESC LIMIT 1
  `, [id]);

  let scoreObj: any = null;
  if (scoreRes.rowCount && scoreRes.rowCount > 0) {
    const s = scoreRes.rows[0];
    if (s.raw_metrics && Object.keys(s.raw_metrics).length > 0 && s.skill_score !== null) {
      scoreObj = {
        skillScore: parseFloat(s.skill_score),
        activityScore: s.activity_score ? parseFloat(s.activity_score) : null,
        consistencyScore: s.consistency_score ? parseFloat(s.consistency_score) : null,
        efficiencyScore: s.efficiency_score ? parseFloat(s.efficiency_score) : null,
        prQualityScore: s.pr_quality_score ? parseFloat(s.pr_quality_score) : null,
        topSkills: s.top_skills || [],
        skillGaps: s.skill_gaps || [],
        telemetryImpact: s.telemetry_modifier ? parseFloat(s.telemetry_modifier) : 0,
        collaborationScore: s.collaboration_score ? parseFloat(s.collaboration_score) : 0,
        learningPath: s.learning_path || [],
        rawMetrics: s.raw_metrics || {},
        windowDays: s.window_days,
        computedAt: s.computed_at
      };
    } else {
      scoreObj = { reason: 'insufficient_data' };
    }
  } else {
    scoreObj = { reason: 'insufficient_data' };
  }

  res.json({
    employee: { id: user.id, email: user.email, name: user.name },
    score: scoreObj
  });
}));

employeesRouter.get('/:id/history', asyncHandler(async (req, res) => {
  const { id } = req.params;
  const historyRes = await query(`
    SELECT computed_at, skill_score
    FROM skill_scores
    WHERE user_id = $1 AND skill_score IS NOT NULL
    ORDER BY computed_at DESC
    LIMIT 12
  `, [id]);

  const history = historyRes.rows.map(row => ({
    computedAt: row.computed_at,
    skillScore: parseFloat(row.skill_score)
  })).reverse(); 

  res.json({ history });
}));

employeesRouter.get('/:id/submissions', asyncHandler(async (req, res) => {
  const { id } = req.params;
  const githubOwner = process.env.GITHUB_ORG || process.env.GITHUB_USERNAME || 'unknown';

  const commitsRes = await query(`
    SELECT sha, repo, message, additions, deletions, committed_at 
    FROM github_commits 
    WHERE user_id = $1 
    ORDER BY committed_at DESC
  `, [id]);
  
  const prsRes = await query(`
    SELECT pr_number, repo, title, state, review_count, comments_count, opened_at, merged_at 
    FROM github_prs 
    WHERE user_id = $1 
    ORDER BY opened_at DESC
  `, [id]);
  
  const submissions: any[] = [];
  
  for (const c of commitsRes.rows) {
     const confidence = Math.max(0, Math.min(100, Math.round(((c.additions || 0) + (c.deletions || 0)) / 10)));
     submissions.push({
       id: c.sha,
       type: 'Commit',
       repository: c.repo,
       title: c.message || 'No commit message',
       date: c.committed_at,
       confidence: confidence === 0 ? 5 : confidence, 
       status: 'Merged',
       url: `https://github.com/${githubOwner}/${c.repo}/commit/${c.sha}`
     });
  }

  for (const p of prsRes.rows) {
     const confidence = Math.max(0, Math.min(100, 70 + ((p.review_count || 0) * 5) - ((p.comments_count || 0) * 2)));
     let statusStr = 'Open';
     if (p.state === 'merged' || p.merged_at) statusStr = 'Merged';
     else if (p.state === 'closed') statusStr = 'Closed';

     submissions.push({
       id: p.pr_number.toString(),
       type: 'PR',
       repository: p.repo,
       title: p.title || 'Untitled PR',
       date: p.opened_at,
       confidence,
       status: statusStr,
       url: `https://github.com/${githubOwner}/${p.repo}/pull/${p.pr_number}`
     });
  }

  submissions.sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  res.json({ submissions });
}));

employeesRouter.post('/', asyncHandler(async (req, res) => {
  const { email, name, githubLogin, jiraAccountId } = req.body;
  const insertRes = await query(`
    INSERT INTO users (email, name, github_login, jira_account_id)
    VALUES ($1, $2, $3, $4)
    RETURNING id, email, name, github_login as "githubLogin", jira_account_id as "jiraAccountId"
  `, [email, name || null, githubLogin || null, jiraAccountId || null]);
  
  res.status(201).json(insertRes.rows[0]);
}));

employeesRouter.patch('/:id', asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name, githubLogin, jiraAccountId } = req.body;
  
  const updateRes = await query(`
    UPDATE users SET 
      name = COALESCE($1, name),
      github_login = COALESCE($2, github_login),
      jira_account_id = COALESCE($3, jira_account_id)
    WHERE id = $4
    RETURNING id, email, name, github_login as "githubLogin", jira_account_id as "jiraAccountId"
  `, [name, githubLogin, jiraAccountId, id]);
  
  if (updateRes.rowCount === 0) return res.status(404).json({ error: 'not_found' });
  res.json(updateRes.rows[0]);
}));
