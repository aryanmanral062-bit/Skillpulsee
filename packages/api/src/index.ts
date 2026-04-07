import express from 'express';
import cors from 'cors';
import { employeesRouter } from './routes/employees';
import { teamRouter } from './routes/team';
import { syncRouter } from './routes/sync';
import { telemetryRouter } from './routes/telemetry';
import { requireApiKey } from './middleware/auth';
import { errorHandler } from './middleware/asyncHandler';
import { startScheduler } from './sync/scheduler';

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Protect all /api routes with API key
// app.use('/api', requireApiKey);

// Mount API routers
app.use('/api/v1/employees', employeesRouter);
app.use('/api/v1/team', teamRouter);
app.use('/api/v1/sync', syncRouter);
app.use('/api/v1/telemetry', telemetryRouter);

// Global Error Catcher
app.use(errorHandler);

app.listen(port, () => {
  console.log(`[Server] SkillPulse API listening on port ${port}`);
  
  // Kick off background CRON loop
  startScheduler();
});
