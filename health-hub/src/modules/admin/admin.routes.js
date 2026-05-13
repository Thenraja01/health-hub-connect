const express = require('express');
const router = express.Router();
const adminController = require('./admin.controller');
const auth = require('../../middlewares/auth.middleware');
const authorize = require('../../middlewares/role.middleware');
const upload = require('../../middlewares/upload.middleware');

router.get('/settings/logo', adminController.getLogo);
router.get('/settings/public', adminController.getPublicSettings);
router.use(auth);
router.use(authorize('ADMIN'));

router.get('/dashboard', adminController.getDashboard);
router.get('/doctors/pending', adminController.getPendingDoctors);
router.post('/doctors/:id/approve', adminController.approveDoctor);
router.post('/doctors/:id/reject', adminController.rejectDoctor);
router.get('/revenue', adminController.getRevenue);
router.get('/logs', adminController.getLogs);
router.get('/users', adminController.getUsers);
router.get('/settings', adminController.getSettings);
router.put('/settings', adminController.updateSettings);
router.post('/settings/logo', upload.single('logo'), adminController.uploadLogo);
router.post('/slots', adminController.createSlot);
router.delete('/slots/:id', adminController.deleteSlot);

module.exports = router;

