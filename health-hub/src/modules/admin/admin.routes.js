const express = require('express');
const router = express.Router();
const adminController = require('./admin.controller');
const auth = require('../../middlewares/auth.middleware');
const authorize = require('../../middlewares/role.middleware');

router.use(auth);
router.use(authorize('ADMIN'));

router.get('/dashboard', adminController.getDashboard);
router.get('/doctors/pending', adminController.getPendingDoctors);
router.post('/doctors/:id/approve', adminController.approveDoctor);
router.post('/doctors/:id/reject', adminController.rejectDoctor);
router.get('/revenue', adminController.getRevenue);
router.get('/logs', adminController.getLogs);
router.get('/users', adminController.getUsers);

module.exports = router;

