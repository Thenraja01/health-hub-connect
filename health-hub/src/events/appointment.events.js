const eventEmitter = require('./index');
const { createNotification } = require('../modules/notifications/notification.service');
const { sendLiveNotification } = require('../websocket/notification.socket');
const logger = require('../config/logger');

// Listen for new appointment bookings
eventEmitter.on('appointment:booked', async (appointment) => {
  try {
    const title = 'Appointment Booked';
    const message = `Your appointment with Dr. ${appointment.doctorId} is confirmed for ${appointment.startsAt}.`;
    
    // 1. Save to database
    const notification = await createNotification(
      appointment.patientId,
      title,
      message,
      'APPOINTMENT'
    );

    // 2. Send real-time socket notification
    sendLiveNotification(appointment.patientId, notification);

    logger.info(`Notification sent for appointment ${appointment.id}`);
  } catch (error) {
    logger.error('Error handling appointment:booked event:', error);
  }
});

module.exports = eventEmitter;
