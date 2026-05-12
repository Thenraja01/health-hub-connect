const express = require('express');
const router = express.Router();
const paymentController = require('./payment.controller');
const stripeController = require('./stripe.controller');
const auth = require('../../middlewares/auth.middleware');

router.use(auth);

router.get('/history', paymentController.getHistory);
router.post('/stripe/onboard', stripeController.onboardDoctor);
router.get('/stripe/status', stripeController.checkOnboardingStatus);
router.get('/:id', paymentController.getDetails);

module.exports = router;
