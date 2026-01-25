const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Health route
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    service: 'DevPulse API'
  });
});

// Default route
app.get('/', (req, res) => {
  res.json({
    message: 'DevPulse API is running',
    version: '0.1.0',
    endpoints: {
      health: '/api/health',
      docs: 'Coming soon'
    }
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 DevPulse backend running on http://localhost:${PORT}`);
  console.log(`📡 Health check: http://localhost:${PORT}/api/health`);
});
