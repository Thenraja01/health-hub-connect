const express = require('express');
const router = express.Router();
const authController = require('./auth.controller');

router.post('/login', authController.login);
router.post('/verify-login', authController.verifyLoginOTP);
router.post('/signup', authController.signup);
router.post('/complete-signup', authController.completeSignup);
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password', authController.resetPassword);

module.exports = router;

