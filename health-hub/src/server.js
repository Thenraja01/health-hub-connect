const app = require('./app');
const { PORT } = require('./config/env');
const logger = require('./config/logger');
const prisma = require('./config/database');

const server = app.listen(PORT, async () => {
  try {
    await prisma.$connect();
    logger.info(`✅ Database connected successfully`);
    logger.info(`🚀 Server running on port ${PORT}`);
  } catch (error) {
    logger.error(`❌ Database connection failed: ${error.message}`);
    process.exit(1);
  }
});

// Initialize WebSockets
const { initSocket } = require('./websocket/socket');
const { initVideoSocket } = require('./websocket/video.socket');

initSocket(server);
initVideoSocket();

// Initialize Event Listeners
require('./events/appointment.events');
require('./events/payment.events');
require('./events/notification.events');

// Initialize Scheduled Jobs
const initSlotCleanupJob = require('./jobs/slot.cleanup.job');
const initReminderJob = require('./jobs/reminder.job');
const initFollowupJob = require('./jobs/followup.job');
const initAnalyticsJob = require('./jobs/analytics.job');

initSlotCleanupJob();
initReminderJob();
initFollowupJob();
initAnalyticsJob();

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  logger.error(`Unhandled Rejection: ${err.message}`);
  server.close(() => process.exit(1));
});
