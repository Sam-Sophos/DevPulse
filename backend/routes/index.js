// Main Routes - Updated Jan 18, 2026
const express = require('express');
const router = express.Router();

// Import route files
const movieRoutes = require('./movieRoutes');
const authRoutes = require('./authRoutes');

// Mount routes
router.use('/movies', movieRoutes);
router.use('/auth', authRoutes);

// Health check
router.get('/health', (req, res) => {
  res.json({ 
    success: true, 
    message: 'API is running',
    timestamp: new Date().toISOString()
  });
});

module.exports = router;
