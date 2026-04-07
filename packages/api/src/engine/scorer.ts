import { query } from '../db/client';
import { analyzeGaps } from './gaps';
import { generateLearningPath } from './learning';
import { computeTelemetryModifier } from './telemetry';
import { computeCollaborationMetric } from './graph';

export interface RawMetrics {
  commitCount: number;
  totalAdditions: number;
  totalDeletions: number;
  activeWeeks: number;
  reposTouched: number;
  
  prCount: number;
  mergedPRs: number;
  avgReviewRounds: number;
  avgHoursToMerge: number;

  totalIssues: number;
  completedIssues: number;
  avgTimeRatio: number;
  allLabels: string[];
}

// ACTIVITY SCORE (30% weight)
// Measures volume and breadth of contribution
export function computeActivityScore(metrics: RawMetrics): number {
  const commitPoints = Math.min(metrics.commitCount / 60, 1) * 40;
  // 60 commits in 90 days = max points (≈5 per week baseline)
  const prPoints = Math.min(metrics.prCount / 12, 1) * 35;
  // 12 PRs in 90 days = max points (≈1 per week baseline)
  const breadthPoints = Math.min(metrics.reposTouched / 4, 1) * 25;
  // touching 4+ repos shows breadth
  return Math.round(commitPoints + prPoints + breadthPoints);
}

// CONSISTENCY SCORE (20% weight)
// Measures regularity — no burst-and-disappear pattern
export function computeConsistencyScore(metrics: RawMetrics): number {
  const totalWeeks = 13; // 90 days ≈ 13 weeks
  const activeRatio = metrics.activeWeeks / totalWeeks;
  // Sigmoid-style: reward consistency, penalize gaps
  // 100% of weeks = 100, 50% = 62, 30% = ~35
  return Math.round(100 / (1 + Math.exp(-10 * (activeRatio - 0.5))));
}

// EFFICIENCY SCORE (20% weight)
// Measures task completion vs estimate accuracy
export function computeEfficiencyScore(metrics: RawMetrics): number {
  const completionRate = metrics.completedIssues / Math.max(metrics.totalIssues, 1);
  const completionPoints = completionRate * 60; // 60% of score = did you finish?

  // timeRatio: 1.0 = exactly on estimate, 1.5 = 50% over, 0.8 = 20% under
  // Score higher if close to 1.0 (accurate estimator), lower if far above 1.0
  const timeRatio = metrics.avgTimeRatio ?? 1.0;
  const estimateAccuracy = Math.max(0, 1 - Math.abs(timeRatio - 1.0)) * 40;
  return Math.round(completionPoints + estimateAccuracy);
}

// PR QUALITY SCORE (30% weight)
// Measures code review feedback — fewer rounds = cleaner initial work
export function computePRQualityScore(metrics: RawMetrics): number {
  const mergeRate = metrics.mergedPRs / Math.max(metrics.prCount, 1);
  const mergePoints = mergeRate * 50;

  // avgReviewRounds: 1 = landed first time (great), 4+ = lots of iteration
  const rounds = metrics.avgReviewRounds ?? 1;
  const reviewPoints = Math.max(0, 50 - (rounds - 1) * 14);
  // 1 round → 50, 2 rounds → 36, 3 rounds → 22, 4+ rounds → ~8
  return Math.round(mergePoints + reviewPoints);
}

// FINAL SKILL SCORE — weighted composite
export function computeSkillScore(
  activityScore: number,
  consistencyScore: number,
  efficiencyScore: number,
  prQualityScore: number
): number {
  return Math.round(
    activityScore * 0.30 +
    consistencyScore * 0.20 +
    efficiencyScore * 0.20 +
    prQualityScore * 0.30
  );
}

export async function computeAndStore(userId: string): Promise<void> {
  const windowDays = parseInt(process.env.SCORE_WINDOW_DAYS || '90', 10);
  
  const commitRes = await query(`
    SELECT COUNT(*) as commit_count,
           COALESCE(SUM(additions), 0) as total_additions,
           COALESCE(SUM(deletions), 0) as total_deletions,
           COUNT(DISTINCT DATE_TRUNC('week', committed_at)) as active_weeks,
           COUNT(DISTINCT repo) as repos_touched
    FROM github_commits
    WHERE user_id = $1
      AND committed_at >= NOW() - ('1 day'::interval * $2)
  `, [userId, windowDays]);

  const prRes = await query(`
    SELECT COUNT(*) as pr_count,
           COUNT(*) FILTER (WHERE state = 'merged') as merged_prs,
           AVG(review_count) as avg_review_rounds,
           AVG(EXTRACT(EPOCH FROM (merged_at - opened_at))/3600) as avg_hours_to_merge
    FROM github_prs
    WHERE user_id = $1
      AND opened_at >= NOW() - ('1 day'::interval * $2)
  `, [userId, windowDays]);

  const jiraRes = await query(`
    SELECT COUNT(*) as total_issues,
           COUNT(*) FILTER (WHERE status = 'Done') as completed_issues,
           AVG(time_spent_hours / NULLIF(original_estimate_hours, 0)) as avg_time_ratio
    FROM jira_issues
    WHERE user_id = $1
      AND created_at >= NOW() - ('1 day'::interval * $2)
  `, [userId, windowDays]);

  // Handle ARRAY_AGG(DISTINCT UNNEST(labels)) logic cleanly without postgres errors
  const labelsRes = await query(`
    SELECT labels
    FROM jira_issues
    WHERE user_id = $1
      AND created_at >= NOW() - ('1 day'::interval * $2)
  `, [userId, windowDays]);
  
  const allLabels = [...new Set(labelsRes.rows.flatMap((r: any) => r.labels || []))] as string[];

  const cRow = commitRes.rows[0];
  const pRow = prRes.rows[0];
  const jRow = jiraRes.rows[0];

  const metrics: RawMetrics = {
    commitCount: parseInt(cRow.commit_count, 10) || 0,
    totalAdditions: parseInt(cRow.total_additions, 10) || 0,
    totalDeletions: parseInt(cRow.total_deletions, 10) || 0,
    activeWeeks: parseInt(cRow.active_weeks, 10) || 0,
    reposTouched: parseInt(cRow.repos_touched, 10) || 0,
    
    prCount: parseInt(pRow.pr_count, 10) || 0,
    mergedPRs: parseInt(pRow.merged_prs, 10) || 0,
    avgReviewRounds: parseFloat(pRow.avg_review_rounds) || 1.0,
    avgHoursToMerge: parseFloat(pRow.avg_hours_to_merge) || 0,

    totalIssues: parseInt(jRow.total_issues, 10) || 0,
    completedIssues: parseInt(jRow.completed_issues, 10) || 0,
    avgTimeRatio: parseFloat(jRow.avg_time_ratio) || 1.0,
    allLabels
  };

  const hasData = metrics.commitCount > 0 || metrics.prCount > 0 || metrics.totalIssues > 0;

  let activityScore = null;
  let consistencyScore = null;
  let efficiencyScore = null;
  let prQualityScore = null;
  let finalScore = null;

  if (hasData) {
    activityScore = computeActivityScore(metrics);
    consistencyScore = computeConsistencyScore(metrics);
    efficiencyScore = computeEfficiencyScore(metrics);
    prQualityScore = computePRQualityScore(metrics);
    finalScore = computeSkillScore(activityScore, consistencyScore, efficiencyScore, prQualityScore);
  }

  const { topSkills, skillGaps } = await analyzeGaps(userId, windowDays);
  const learningPath = generateLearningPath(skillGaps, windowDays);
  
  const telemetryMod = await computeTelemetryModifier(userId, windowDays);
  const collabMod = await computeCollaborationMetric(userId);

  if (finalScore !== null) {
    finalScore = finalScore + telemetryMod + collabMod;
    finalScore = Math.min(Math.max(finalScore, 0), 100);
  }

  const text = `
    INSERT INTO skill_scores (
      user_id, window_days, skill_score, activity_score, consistency_score, 
      efficiency_score, pr_quality_score, top_skills, skill_gaps, 
      learning_path, raw_metrics, telemetry_modifier, collaboration_score
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
  `;

  await query(text, [
    userId, windowDays, finalScore, activityScore, consistencyScore,
    efficiencyScore, prQualityScore, topSkills, skillGaps,
    JSON.stringify(learningPath), JSON.stringify(metrics),
    telemetryMod, collabMod
  ]);
}
