const eventEmitter = require('./index');
const { createNotification } = require('../modules/notifications/notification.service');
const { sendLiveNotification } = require('../websocket/notification.socket');

eventEmitter.on('notification:send', async ({ userId, title, message, type }) => {
  const notification = await createNotification(userId, title, message, type);
  sendLiveNotification(userId, notification);
});

module.exports = eventEmitter;
