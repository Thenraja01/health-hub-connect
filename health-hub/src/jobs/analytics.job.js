const cron = require('node-cron');
const prisma = require('../config/database');
const logger = require('../config/logger');
   
const initAnalyticsJob = () => {
  cron.schedule('0 0 * * *', async () => {
    logger.info('Running Daily Analytics Job...');
    try {
      const yesterday = new Date(); 
      yesterday.setDate(yesterday.getDate() - 1);
      
      const [newPatients, newAppointments, dailyRevenue] = await Promise.all([
        prisma.patient.count({ where: { createdAt: { gte: yesterday } } }),
        prisma.appointment.count({ where: { createdAt: { gte: yesterday } } }),
        prisma.payment.aggregate({
          _sum: { amount: true },
          where: { paidAt: { gte: yesterday }, paymentStatus: 'PAID' },
        }),
      ]);

      // In a real app, you would save these to a DailyMetric table
      logger.info('Daily Stats:', {
        date: yesterday.toISOString().split('T')[0],
        newPatients,
        newAppointments,
        revenue: dailyRevenue._sum.amount || 0,
      });
    } catch (error) {
      logger.error('Analytics Job Failed:', error);
    }
  });
};

module.exports = initAnalyticsJob;
