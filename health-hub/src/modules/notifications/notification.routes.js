const express = require('express');
const router = express.Router();
const notificationService = require('./notification.service');
const { successResponse, errorResponse } = require('../../utils/response');
const auth = require('../../middlewares/auth.middleware');
const authorize = require('../../middlewares/role.middleware');

router.use(auth);
router.use(authorize('PATIENT'));

// Get all notifications for the current patient
router.get('/', async (req, res) => {
  try {
    const notifications = await notificationService.getPatientNotifications(req.user.id);
    successResponse(res, notifications, 'Notifications fetched successfully');
  } catch (error) {
    errorResponse(res, error.message, 500, error);
  }
});

// Mark a notification as read
router.patch('/:id/read', async (req, res) => {
  try {
    const notification = await notificationService.markAsRead(req.params.id);
    successResponse(res, notification, 'Notification marked as read');
  } catch (error) {
    errorResponse(res, error.message, 400, error);
  }
});

module.exports = router;
