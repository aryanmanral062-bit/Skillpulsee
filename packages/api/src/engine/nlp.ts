export const KEYWORD_DICTIONARY = [
  // Tech tags
  'nodejs', 'node', 'python', 'typescript', 'react', 'vue', 'angular',
  'postgresql', 'mysql', 'mongodb', 'redis', 'elasticsearch',
  'docker', 'kubernetes', 'k8s', 'terraform', 'aws', 'gcp', 'azure',
  'testing', 'tdd', 'jest', 'cypress', 'playwright',
  'ci-cd', 'github-actions', 'jenkins',
  'rest-api', 'graphql', 'grpc',
  'security', 'oauth', 'jwt',
  'performance', 'optimization', 'caching',
  'machine-learning', 'data-analysis',
  'frontend', 'backend', 'fullstack', 'devops', 'mobile',
  // Complexity signals
  'refactor', 'optimize', 'architecture', 'scalability',
  'migration', 'infrastructure', 'concurrency', 'memory-leak'
];

export function extractKeywords(text: string): string[] {
  if (!text) return [];
  
  const found = new Set<string>();
  
  for (const keyword of KEYWORD_DICTIONARY) {
    // Escape regex characters cleanly
    const escapedKeyword = keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`\\b${escapedKeyword}\\b`, 'i');
    if (regex.test(text)) {
      found.add(keyword);
    }
  }

  return Array.from(found);
}
