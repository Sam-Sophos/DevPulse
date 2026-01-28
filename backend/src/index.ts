import express, { Request, Response } from 'express';
import cors from 'cors';
import sessionRoutes from './sessions';
import devLogRoutes from './devlogs';
import db from './lib/database';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Health check with database connection test
app.get('/api/health', (req: Request, res: Response) => {
  try {
    // Test database connection
    const testQuery = db.prepare('SELECT 1 as test').get();
    
    // Get some stats
    const sessionCount = db.prepare('SELECT COUNT(*) as count FROM sessions').get().count;
    const logCount = db.prepare('SELECT COUNT(*) as count FROM dev_logs').get().count;
    
    res.status(200).json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      service: 'DevPulse API',
      version: '1.2.0',
      database: {
        type: 'SQLite',
        connected: true,
        path: 'devpulse.db'
      },
      stats: {
        sessions: sessionCount,
        devLogs: logCount
      },
      endpoints: [
        '/api/sessions',
        '/api/devlogs', 
        '/api/health'
      ]
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

// Session routes
app.use('/api/sessions', sessionRoutes);

// Dev log routes
app.use('/api/devlogs', devLogRoutes);

// Insert sample data endpoint (for testing)
app.post('/api/sample-data', (req: Request, res: Response) => {
  try {
    const userId = 'test-user-id';
    
    // Insert sample session
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    
    const sampleSessionId = 'sample-' + Date.now();
    db.prepare(`
      INSERT INTO sessions (id, user_id, start_time, end_time, duration, project, tags, notes, is_active)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      sampleSessionId,
      userId,
      yesterday.toISOString(),
      new Date(yesterday.getTime() + 45 * 60000).toISOString(),
      45,
      'Sample Project',
      JSON.stringify(['sample', 'testing']),
      'This is a sample session for testing',
      false
    );

    // Insert sample dev log
    const sampleLogId = 'log-' + Date.now();
    db.prepare(`
      INSERT INTO dev_logs (id, user_id, date, content, tags, mood)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(
      sampleLogId,
      userId,
      new Date().toISOString(),
      'Added sample data to test the DevPulse API functionality. Everything is working well!',
      JSON.stringify(['testing', 'progress']),
      4
    );

    res.status(201).json({
      success: true,
      message: 'Sample data inserted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to insert sample data',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Root
app.get('/', (req: Request, res: Response) => {
  res.json({
    message: 'DevPulse API v1.2.0',
    description: 'Developer productivity tracking API with SQLite database',
    endpoints: {
      health: '/api/health',
      sessions: '/api/sessions',
      devlogs: '/api/devlogs',
      sampleData: '/api/sample-data (POST)'
    }
  });
});

app.listen(PORT, () => {
  console.log(`DevPulse API server running on http://localhost:${PORT}`);
  console.log(`Database: SQLite (devpulse.db)`);
  console.log(`Available endpoints:`);
  console.log(`  GET    /api/health`);
  console.log(`  GET    /api/sessions`);
  console.log(`  POST   /api/sessions`);
  console.log(`  PATCH  /api/sessions/:id/end`);
  console.log(`  GET    /api/sessions/today`);
  console.log(`  GET    /api/devlogs`);
  console.log(`  POST   /api/devlogs`);
  console.log(`  GET    /api/devlogs/today`);
  console.log(`  POST   /api/sample-data`);
});
