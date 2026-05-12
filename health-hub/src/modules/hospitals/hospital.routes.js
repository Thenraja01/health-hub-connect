const express = require('express');
const router = express.Router();
const hospitalController = require('./hospital.controller');
const auth = require('../../middlewares/auth.middleware');
const authorize = require('../../middlewares/role.middleware');

router.get('/', hospitalController.getHospitals);
router.get('/:id', hospitalController.getHospital);

router.post(
  '/',
  auth,
  authorize('ADMIN'),
  hospitalController.addHospital
);

router.put(
  '/:id',
  auth,
  authorize('ADMIN'),
  hospitalController.updateHospital
);

module.exports = router;
