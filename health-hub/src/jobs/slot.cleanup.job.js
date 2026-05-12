const cron = require('node-cron');
const prisma = require('../config/database');
const logger = require('../config/logger');

const initSlotCleanupJob = () => {
  cron.schedule('0 * * * *', async () => {
    logger.info('Running Slot Cleanup Job...');
    try {
      const now = new Date();
      
      // Mark past available slots as COMPLETED or EXPIRED if needed
      const result = await prisma.appointmentSlot.updateMany({
        where: {
          endsAt: { lt: now },
          slotStatus: 'AVAILABLE',
        },
        data: {
          slotStatus: 'CANCELLED', // Or EXPIRED if you add that status
        },
      });

      logger.info(`Cleaned up ${result.count} expired slots`);
    } catch (error) {
      logger.error('Slot Cleanup Job Failed:', error);
    }
  });
};

module.exports = initSlotCleanupJob;
