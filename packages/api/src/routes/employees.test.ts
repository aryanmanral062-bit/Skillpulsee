import request from 'supertest';
import express from 'express';
import { employeesRouter } from './employees';
import * as db from '../db/client';
import { errorHandler } from '../middleware/asyncHandler';

jest.mock('../db/client', () => ({
  query: jest.fn()
}));

const app = express();
app.use(express.json());

// Bypass auth middleware
app.use((req, res, next) => next());

app.use('/api/v1/employees', employeesRouter);
app.use(errorHandler);

describe('Employees API Endpoints', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('GET /api/v1/employees resolves team compilation array explicitly', async () => {
    const mockQuery = db.query as jest.Mock;
    
    mockQuery.mockResolvedValueOnce({
      rows: [
        { id: '1', email: 'alice@company.com', name: 'Alice', github_login: 'al', skill_score: '95', computed_at: '2025-01-01' },
         { id: '2', email: 'bob@company.com', name: 'Bob', github_login: 'bob', skill_score: '45', computed_at: '2025-01-01' }
      ]
    });

    const res = await request(app).get('/api/v1/employees');
    
    expect(res.status).toBe(200);
    expect(res.body.employees.length).toBe(2);
    expect(res.body.employees[0].name).toBe('Alice');
    expect(res.body.employees[0].latestScore.skillScore).toBe(95);
    expect(mockQuery).toHaveBeenCalledTimes(1);
  });

  test('Global Express Handler catches synchronous database connectivity drops with 500 mapping', async () => {
    const mockQuery = db.query as jest.Mock;
    mockQuery.mockRejectedValueOnce(new Error('Connection dropped organically'));

    const res = await request(app).get('/api/v1/employees');
    expect(res.status).toBe(500);
    expect(res.body.error).toBe('internal_error');
  });
});
