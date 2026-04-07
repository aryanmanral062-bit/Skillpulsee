import { Router } from 'express';
import { runSyncJob } from '../sync/scheduler';

export const syncRouter = Router();

syncRouter.post('/trigger', (req, res) => {
  // Runs asynchronously — returns 202 immediately, logs progress to console.
  runSyncJob().catch(err => console.error('[Manual Sync]', err));
  
  res.status(202).json({
    status: 'sync_started',
    triggeredAt: new Date().toISOString()
  });
});
