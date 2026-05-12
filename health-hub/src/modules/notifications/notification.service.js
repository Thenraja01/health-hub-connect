const nodemailer = require('nodemailer');

// Mock transporter for demonstration
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.ethereal.email',
  port: process.env.SMTP_PORT || 587,
  auth: {
    user: process.env.SMTP_USER || 'mock_user',
    pass: process.env.SMTP_PASS || 'mock_pass',
  },
});

/**
 * Send Email Notification
 * @param {string} to 
 * @param {string} subject 
 * @param {string} text 
 * @param {string} html 
 */
const sendEmail = async (to, subject, text, html) => {
  try {
    const info = await transporter.sendMail({
      from: '"Health Hub" <noreply@healthhub.com>',
      to,
      subject,
      text,
      html,
    });
    console.log('Email sent: %s', info.messageId);
    return info;
  } catch (error) {
    console.error('Email Error:', error);
  }
};

/**
 * Send SMS Notification
 * @param {string} phone 
 * @param {string} message 
 */
const sendSMS = async (phone, message) => {
  // Placeholder for Twilio/MessageBird integration
  console.log(`[SMS to ${phone}]: ${message}`);
  return true;
};

/**
 * Send Push Notification
 * @param {string} userId 
 * @param {Object} data 
 */
const sendPush = async (userId, data) => {
  // Placeholder for Firebase/Socket.io integration
  console.log(`[PUSH to User ${userId}]:`, data);
  return true;
};

module.exports = {
  sendEmail,
  sendSMS,
  sendPush,
};
