const eventEmitter = require('./index');
const { createNotification } = require('../modules/notifications/notification.service');
const { sendLiveNotification } = require('../websocket/notification.socket');
const logger = require('../config/logger');

// Listen for successful payments
eventEmitter.on('payment:success', async (payment) => {
  try {
    const title = 'Payment Successful';
    const message = `Your payment of ₹${payment.amount} for appointment ${payment.appointmentId} has been received.`;
    
    // Logic to notify patient
    const notification = await createNotification(
      payment.patientId, // Need to ensure payment object has patientId or fetch it
      title,
      message,
      'PAYMENT'
    );

    sendLiveNotification(payment.patientId, notification);
    logger.info(`Payment notification sent for transaction ${payment.transactionId}`);
  } catch (error) {
    logger.error('Error handling payment:success event:', error);
  }
});

module.exports = eventEmitter;
