const cron = require('node-cron');
const prisma = require('../config/database');
const eventEmitter = require('../events/index');
const logger = require('../config/logger');
const initReminderJob = () => {
  cron.schedule('*/30 * * * *', async () => {
    logger.info('Running Appointment Reminder Job...');
    try {
      const oneHourFromNow = new Date(Date.now() + 60 * 60 * 1000);
      const oneHourAndThirtyFromNow = new Date(Date.now() + 90 * 60 * 1000);

      const appointments = await prisma.appointment.findMany({
        where: {
          startsAt: {
            gte: oneHourFromNow,
            lt: oneHourAndThirtyFromNow,
          },
          bookingStatus: 'CONFIRMED',
        },
      });

      for (const apt of appointments) {
        eventEmitter.emit('notification:send', {
          userId: apt.patientId,
          title: 'Appointment Reminder',
          message: 'You have an appointment in 1 hour.',
          type: 'APPOINTMENT',
        });
      }

      logger.info(`Sent reminders for ${appointments.length} appointments`);
    } catch (error) {
      logger.error('Reminder Job Failed:', error);
    }
  });
};

module.exports = initReminderJob;
