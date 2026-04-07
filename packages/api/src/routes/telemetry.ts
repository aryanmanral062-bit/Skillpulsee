import { Router } from 'express';
import { query } from '../db/client';
import { asyncHandler } from '../middleware/asyncHandler';

export const telemetryRouter = Router();

telemetryRouter.post('/', asyncHandler(async (req, res) => {
  const { userId, serviceName, eventType, severity, metadata } = req.body;

  if (!userId || !serviceName || !eventType || !severity) {
    return res.status(400).json({ error: 'missing_fields' });
  }

  const insertRes = await query(`
    INSERT INTO telemetry_events (user_id, service_name, event_type, severity, metadata)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING id
  `, [userId, serviceName, eventType, severity, metadata || {}]);

  res.status(201).json({ status: 'inserted', id: insertRes.rows[0].id });
}));
