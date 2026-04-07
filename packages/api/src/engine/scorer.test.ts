import {
  computeActivityScore,
  computeConsistencyScore,
  computeEfficiencyScore,
  computePRQualityScore,
  RawMetrics
} from './scorer';

describe('Scorer Sub-functions', () => {
  const baseMetrics: RawMetrics = {
    commitCount: 0, totalAdditions: 0, totalDeletions: 0, activeWeeks: 0, reposTouched: 0,
    prCount: 0, mergedPRs: 0, avgReviewRounds: 1, avgHoursToMerge: 10,
    totalIssues: 0, completedIssues: 0, avgTimeRatio: 1, allLabels: []
  };

  test('computeActivityScore calculates volume metrics correctly', () => {
    // Baseline scenario where all activity brackets are maxed
    expect(computeActivityScore({ ...baseMetrics, commitCount: 60, prCount: 12, reposTouched: 4 })).toBe(100);
    // Lower spectrum validation
    expect(computeActivityScore({ ...baseMetrics, commitCount: 30, prCount: 6, reposTouched: 2 })).toBe(50);
    // Zero scenario validation
    expect(computeActivityScore({ ...baseMetrics })).toBe(0);
  });

  test('computeConsistencyScore measures regularity logic correctly', () => {
    // Max weeks active in window validates 100
    expect(computeConsistencyScore({ ...baseMetrics, activeWeeks: 13 })).toBeGreaterThan(98);
    // 50% of the weeks validates around the median threshold
    const score50 = computeConsistencyScore({ ...baseMetrics, activeWeeks: 6.5 });
    expect(score50).toBeGreaterThan(45);
    expect(score50).toBeLessThan(55);
  });

  test('computeEfficiencyScore verifies task delivery ratios', () => {
    // 100% completion rate without estimate overrun returns max points
    expect(computeEfficiencyScore({ ...baseMetrics, totalIssues: 10, completedIssues: 10, avgTimeRatio: 1.0 })).toBe(100);
    // 50% completed running significantly over ratio returns exact mapping
    expect(computeEfficiencyScore({ ...baseMetrics, totalIssues: 10, completedIssues: 5, avgTimeRatio: 1.5 })).toBe(50); // 30 completion + 20 ratio
  });

  test('computePRQualityScore evaluates PR throughput precisely', () => {
    // High-grade PR submission merging first attempt maps to perfect curve
    expect(computePRQualityScore({ ...baseMetrics, prCount: 10, mergedPRs: 10, avgReviewRounds: 1 })).toBe(100);
    // Rough draft PRs going through several iterations
    expect(computePRQualityScore({ ...baseMetrics, prCount: 10, mergedPRs: 5, avgReviewRounds: 3 })).toBe(47); // 25 merge + 22 review rounds
  });
});
