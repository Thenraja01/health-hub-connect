const cron = require('node-cron');
const prisma = require('../config/database');
const eventEmitter = require('../events/index');
const logger = require('../config/logger');
const initFollowupJob = () => {
  cron.schedule('0 9 * * *', async () => {
    logger.info('Running Follow-up Job...');
    try {
      const today = new Date();
      
      const prescriptions = await prisma.prescription.findMany({
        where: {
          nextFollowupDate: {
            equals: today,
          },
        },
      });

      for (const pr of prescriptions) {
        eventEmitter.emit('notification:send', {
          userId: pr.patientId,
          title: 'Follow-up Reminder',
          message: 'It is time for your scheduled follow-up consultation.',
          type: 'FOLLOWUP',
        });
      }

      logger.info(`Processed ${prescriptions.length} follow-up reminders`);
    } catch (error) {
      logger.error('Follow-up Job Failed:', error);
    }
  });
};

module.exports = initFollowupJob;
