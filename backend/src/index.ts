import express, { Request, Response } from 'express';
import cors from 'cors';
import sessionRoutes from './sessions';
import devLogRoutes from './devlogs';
import statsRoutes from './stats';
import exportRoutes from './export';
import db from './lib/database';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json({ limit: '10mb' })); // Increase limit for imports

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
      version: '1.5.0',
      database: {
        type: 'SQLite',
        connected: true,
        sessions: sessionCount,
        logs: logCount
      },
      features: [
        'Session tracking',
        'Dev logs',
        'Statistics',
        'Data export/import',
        'File downloads'
      ],
      endpoints: {
        sessions: '/api/sessions',
        devlogs: '/api/devlogs',
        stats: '/api/stats',
        export: '/api/export',
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
app.use('/api/export', exportRoutes);

// Root
app.get('/', (req: Request, res: Response) => {
  res.json({
    message: 'DevPulse API v1.5.0',
    description: 'Developer productivity tracking with data export/import',
    features: [
      'Session tracking',
      'Dev logs with mood tracking',
      'Productivity statistics',
      'Data export to JSON',
      'Data import from backups',
      'SQLite database'
    ],
    endpoints: {
      sessions: '/api/sessions',
      devlogs: '/api/devlogs',
      stats: '/api/stats',
      export: '/api/export',
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
  console.log(`  GET    /api/stats/*`);
  console.log(`  POST   /api/export/export`);
  console.log(`  GET    /api/export/download/:filename`);
  console.log(`  GET    /api/export/history`);
  console.log(`  POST   /api/export/import`);
  console.log(`  POST   /api/export/validate`);
});
