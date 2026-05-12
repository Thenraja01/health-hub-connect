const express = require('express');
const router = express.Router();
const paymentController = require('./payment.controller');
const auth = require('../../middlewares/auth.middleware');

router.use(auth);

router.get('/history', paymentController.getHistory);
router.get('/:id', paymentController.getDetails);

module.exports = router;
