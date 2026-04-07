import { analyzeGaps } from './gaps';
import * as db from '../db/client';

jest.mock('../db/client', () => ({
  query: jest.fn()
}));

describe('analyzeGaps algorithm', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('identifies skill gaps when user activity is significantly below team average', async () => {
    const mockQuery = db.query as jest.Mock;

    mockQuery.mockImplementation(async (sql: string) => {
      // MOCK DB READ: 1. Filtered User Issues -> user touches Node.js and Postgres
      if (sql.includes('user_id = $1') && sql.includes('jira_issues')) {
        return { rows: [{ labels: ['nodejs', 'postgresql'] }] };
      }
      // MOCK DB READ: 2. Iterating github text -> User is coding nodejs commits
      if (sql.includes('github_commits')) {
        return { rows: [{ message: 'fixed massive bug in nodejs instance' }] };
      }
      // MOCK DB READ: 3. Cross organizational team habits -> everyone writes docker/react exclusively
      if (sql.includes('ALL') || (!sql.includes('user_id = $1') && sql.includes('labels'))) {
         return { rows: [
           { labels: ['docker', 'react', 'nodejs'] },
           { labels: ['docker', 'react'] },
           { labels: ['docker'] }
         ] };
      }
      // MOCK DB READ: 4. Team context -> Organization pool exists of three people
      if (sql.includes('COUNT(DISTINCT user_id)')) {
        return { rows: [{ count: '3' }] };
      }
      
      return { rows: [] };
    });

    const result = await analyzeGaps('placeholder-uuid', 90);
    
    // Asserts: The user exclusively did node.js work while the team pounded out docker.
    expect(result.topSkills).toContain('nodejs');
    expect(result.skillGaps).toContain('docker');
    expect(result.skillGaps).toContain('react');
    
    // Verifies Postgres is not receiving unsupported queries
    expect(mockQuery).toHaveBeenCalledTimes(4);
  });
});
