const express = require('express');
const router = express.Router();
const prescriptionController = require('./prescription.controller');
const auth = require('../../middlewares/auth.middleware');
const authorize = require('../../middlewares/role.middleware');

router.use(auth);

router.post(
  '/',
  authorize('DOCTOR'),
  prescriptionController.create
);

router.get(
  '/appointment/:appointmentId',
  prescriptionController.getByAppointment
);

router.get(
  '/download/:id',
  prescriptionController.downloadPDF
);

module.exports = router;
