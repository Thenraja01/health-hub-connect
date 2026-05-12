const express = require('express');
const router = express.Router();
const doctorController = require('./doctor.controller');
const auth = require('../../middlewares/auth.middleware');
const authorize = require('../../middlewares/role.middleware');
const upload = require('../../middlewares/upload.middleware');

// ─── Public Routes (no auth) ────────────────────────────────────
router.get('/', doctorController.getDoctors);
router.get('/specialties', doctorController.getSpecialties);

// ─── Protected Routes (auth + DOCTOR role) ──────────────────────
router.get(
  '/profile',
  auth,
  authorize('DOCTOR'),
  doctorController.getProfile
);

router.put(
  '/profile',
  auth,
  authorize('DOCTOR'),
  doctorController.updateProfile
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

router.post(
  '/schedule',
  auth,
  authorize('DOCTOR'),
  doctorController.createSchedule
);

router.get(
  '/slots',
  auth,
  authorize('DOCTOR'),
  doctorController.getSlots
);

router.patch(
  '/slots/:slotId',
  auth,
  authorize('DOCTOR'),
  doctorController.updateSlotStatus
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

router.put(
  '/status',
  auth,
  authorize('DOCTOR'),
  doctorController.toggleStatus
);

router.get(
  '/wallet',
  auth,
  authorize('DOCTOR'),
  doctorController.getWallet
);

router.post(
  '/withdraw',
  auth,
  authorize('DOCTOR'),
  doctorController.withdrawBalance
);

router.post(
  '/upload-certification',
  auth,
  authorize('DOCTOR'),
  upload.single('certification'),
  doctorController.uploadCertification
);

// ─── Parameterized Routes (MUST be last to avoid catching named routes) ─
router.get('/:id', doctorController.getDoctor);
router.get('/:id/slots', doctorController.getPublicSlots);

module.exports = router;
