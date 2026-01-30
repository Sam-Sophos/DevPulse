import express, { Request, Response } from 'express';
import cors from 'cors';
import sessionRoutes from './sessions';
import devLogRoutes from './devlogs';
import statsRoutes from './stats';
import db from './lib/database';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Health check
app.get('/api/health', (req: Request, res: Response) => {
  try {
    const testQuery = db.prepare('SELECT 1 as test').get();
    
    const sessionCount = db.prepare('SELECT COUNT(*) as count FROM sessions').get().count;
    const logCount = db.prepare('SELECT COUNT(*) as count FROM dev_logs').get().count;
    
    res.status(200).json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      service: 'DevPulse API',
      version: '1.4.0',
      database: {
        type: 'SQLite',
        connected: true,
        sessions: sessionCount,
        logs: logCount
      },
      endpoints: {
        sessions: '/api/sessions',
        devlogs: '/api/devlogs',
        stats: '/api/stats',
        health: '/api/health'
      }
    });
  } catch (error) {
    res.status(500).json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      service: 'DevPulse API',
      database: 'disconnected',
      error: error instanceof Error ? error.message : 'Database connection failed'
    });
  }
});

// Routes
app.use('/api/sessions', sessionRoutes);
app.use('/api/devlogs', devLogRoutes);
app.use('/api/stats', statsRoutes);

// Root
app.get('/', (req: Request, res: Response) => {
  res.json({
    message: 'DevPulse API v1.4.0',
    description: 'Developer productivity tracking with statistics',
    features: [
      'Session tracking',
      'Dev logs with mood tracking',
      'Productivity statistics',
      'Progress insights',
      'SQLite database'
    ],
    endpoints: {
      sessions: '/api/sessions',
      devlogs: '/api/devlogs',
      stats: '/api/stats',
      health: '/api/health'
    }
  });
});

app.listen(PORT, () => {
  console.log(`DevPulse API server running on http://localhost:${PORT}`);
  console.log(`Database: SQLite (devpulse.db)`);
  console.log(`\nAvailable endpoints:`);
  console.log(`  GET    /api/health`);
  console.log(`  GET    /api/sessions`);
  console.log(`  POST   /api/sessions`);
  console.log(`  GET    /api/devlogs`);
  console.log(`  POST   /api/devlogs`);
  console.log(`  GET    /api/stats/time`);
  console.log(`  GET    /api/stats/projects`);
  console.log(`  GET    /api/stats/daily-progress`);
  console.log(`  GET    /api/stats/weekly-summary`);
  console.log(`  GET    /api/stats/insights`);
});
