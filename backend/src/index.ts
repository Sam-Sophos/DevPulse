import express, { Request, Response } from 'express';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.get('/api/health', (req: Request, res: Response) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'DevPulse API',
    version: '1.0.0'
  });
});

app.listen(PORT, () => {
  console.log(`DevPulse API server running on http://localhost:${PORT}`);
});
