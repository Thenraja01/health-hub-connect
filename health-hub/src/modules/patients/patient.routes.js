const express = require('express');
const router = express.Router();
const patientController = require('./patient.controller');
const auth = require('../../middlewares/auth.middleware');
const authorize = require('../../middlewares/role.middleware');

const upload = require('../../middlewares/upload.middleware');

router.post('/register', patientController.register);

router.get(
  '/profile',
  auth,
  authorize('PATIENT'),
  patientController.getProfile
);

router.put(
  '/profile',
  auth,
  authorize('PATIENT'),
  upload.single('profileImage'),
  patientController.updateProfile
);

module.exports = router;
