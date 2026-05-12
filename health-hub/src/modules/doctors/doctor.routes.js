const express = require('express');
const router = express.Router();
const doctorController = require('./doctor.controller');
const auth = require('../../middlewares/auth.middleware');
const authorize = require('../../middlewares/role.middleware');

router.get('/', doctorController.getDoctors);
router.get('/specialties', doctorController.getSpecialties);

router.get(
  '/profile',
  auth,
  authorize('DOCTOR'),
  doctorController.getProfile
);

router.get(
  '/patients',
  auth,
  authorize('DOCTOR'),
  doctorController.getPatients
);

router.get(
  '/earnings',
  auth,
  authorize('DOCTOR'),
  doctorController.getEarnings
);

router.get(
  '/schedule',
  auth,
  authorize('DOCTOR'),
  doctorController.getSchedule
);

router.get(
  '/slots',
  auth,
  authorize('DOCTOR'),
  doctorController.getSlots
);

router.post(
  '/schedule',
  auth,
  authorize('DOCTOR'),
  doctorController.createSchedule
);

router.get(
  '/tasks',
  auth,
  authorize('DOCTOR'),
  doctorController.getTasks
);

router.post(
  '/tasks',
  auth,
  authorize('DOCTOR'),
  doctorController.createTask
);

router.get('/:id', doctorController.getDoctor);
router.get('/:id/slots', doctorController.getPublicSlots);

router.put(
  '/status',
  auth,
  authorize('DOCTOR'),
  doctorController.toggleStatus
);

router.put(
  '/profile',
  auth,
  authorize('DOCTOR'),
  doctorController.updateProfile
);

module.exports = router;
