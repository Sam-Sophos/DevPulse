import express, { Request, Response } from 'express';
import cors from 'cors';
import sessionRoutes from './sessions';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Health check
app.get('/api/health', (req: Request, res: Response) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'DevPulse API',
    version: '1.0.0',
    endpoints: ['/api/sessions', '/api/health']
  });
});

// Session routes
app.use('/api/sessions', sessionRoutes);

// Root
app.get('/', (req: Request, res: Response) => {
  res.json({
    message: 'DevPulse API is running',
    endpoints: {
      health: '/api/health',
      sessions: '/api/sessions'
    }
  });
});

app.listen(PORT, () => {
  console.log(`DevPulse API server running on http://localhost:${PORT}`);
  console.log(`Available endpoints:`);
  console.log(`  GET  /api/health`);
  console.log(`  GET  /api/sessions`);
  console.log(`  POST /api/sessions`);
  console.log(`  GET  /api/sessions/today`);
});
