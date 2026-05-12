const { getIO } = require('./socket');

/**
 * Sends a real-time notification to a specific user
 */
const sendLiveNotification = (userId, notification) => {
  try {
    const io = getIO();
    io.to(userId).emit('notification', notification);
  } catch (error) {
    // Socket might not be initialized yet or user not connected
  }
};

module.exports = { sendLiveNotification };
