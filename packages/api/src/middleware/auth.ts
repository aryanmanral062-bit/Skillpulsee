import { Request, Response, NextFunction } from 'express';

export function requireApiKey(req: Request, res: Response, next: NextFunction) {
  const apiKey = req.header('X-API-Key');
  const validKey = process.env.API_KEY;

  if (!validKey) {
    console.error('[Auth] API_KEY environment variable is not configured');
    return res.status(500).json({ error: 'internal_error' });
  }

  if (!apiKey || apiKey !== validKey) {
    return res.status(401).json({ error: 'unauthorized' });
  }

  next();
}
