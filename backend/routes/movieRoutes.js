// Movie Routes - Created Jan 18, 2026
const express = require('express');
const router = express.Router();
const {
  getMovies,
  getMovie,
  createMovie,
  updateMovie,
  deleteMovie
} = require('../controllers/movieController');
const { protect, authorize } = require('../middleware/auth');

// Public routes
router.route('/')
  .get(getMovies);

router.route('/:id')
  .get(getMovie);

// Protected routes (require authentication)
router.route('/')
  .post(protect, authorize('admin'), createMovie);

router.route('/:id')
  .put(protect, authorize('admin'), updateMovie)
  .delete(protect, authorize('admin'), deleteMovie);

// Search route
router.get('/search/:query', (req, res) => {
  res.json({ 
    message: 'Search functionality - to be implemented',
    query: req.params.query 
  });
});

module.exports = router;
