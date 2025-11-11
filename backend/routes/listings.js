const express = require('express');
const router = express.Router();
const multer = require('multer');
const listingController = require('../controllers/listingController');
const authMiddleware = require('../utils/authMiddleware');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage });

// Create a listing (seller only)
router.post('/', authMiddleware, upload.array('images', 12), listingController.createListing);

// Search with filters
router.get('/search', listingController.searchListings);

// Get listing by id
router.get('/:id', listingController.getListing);

// Compare multiple ids
router.post('/compare', listingController.compareListings);

// Trade-in estimate
router.post('/tradein', listingController.tradeInEstimate);

// Price suggestion
router.post('/price-suggestion', listingController.priceSuggestion);

module.exports = router;