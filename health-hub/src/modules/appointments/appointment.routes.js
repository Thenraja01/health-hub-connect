const express = require('express');
const router = express.Router();
const appointmentController = require('./appointment.controller');
const auth = require('../../middlewares/auth.middleware');
const authorize = require('../../middlewares/role.middleware');

router.use(auth);

router.post(
  '/',
  authorize('PATIENT'),
  appointmentController.book
);

router.post(
  '/confirm',
  authorize('PATIENT'),
  appointmentController.confirm
);

router.post(
  '/cancel',
  authorize('PATIENT'),
  appointmentController.cancel
);

router.post(
  '/reschedule',
  authorize('PATIENT'),
  appointmentController.reschedule
);

router.get(
  '/my-appointments',
  authorize('PATIENT'),
  appointmentController.getMyAppointments
);

router.get(
  '/doctor',
  authorize('DOCTOR'),
  appointmentController.getDoctorAppointments
);

module.exports = router;

