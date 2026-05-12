const express = require('express');
const router = express.Router();
const reviewController = require('./review.controller');
const auth = require('../../middlewares/auth.middleware');

router.get('/doctor/:doctorId', reviewController.getReviews);
router.post('/', auth, reviewController.addReview);

module.exports = router;
