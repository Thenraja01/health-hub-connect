const nodemailer = require('nodemailer');

/**
 * Email Service
 * Handles sending emails for OTP verification, appointments, and prescriptions.
 */

const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE || 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendEmail = async (options) => {
  const { to, subject, text, html } = options;

  try {
    const info = await transporter.sendMail({
      from: `"Health Hub" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text,
      html,
    });

    console.log('--- EMAIL SENT ---');
    console.log(`To: ${to}`);
    console.log(`MessageId: ${info.messageId}`);
    console.log('------------------');
    
    return true;
  } catch (error) {
    console.error('Email Sending Failed:', error);
    // Log details but don't crash the server, though the service depends on this.
    return false;
  }
};

const sendOTPEmail = async (email, code) => {
  return await sendEmail({
    to: email,
    subject: 'Verification Code - Health Hub',
    text: `Your verification code is: ${code}. This code will expire in 5 minutes.`,
    html: `
      <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px; max-width: 500px; margin: 0 auto;">
        <h2 style="color: #0d9488; text-align: center;">Health Hub Verification</h2>
        <p>Use the following code to verify your identity:</p>
        <div style="font-size: 32px; font-weight: bold; padding: 20px; background: #f0fdfa; color: #0d9488; text-align: center; border-radius: 12px; margin: 20px 0; border: 2px dashed #0d9488;">
          ${code}
        </div>
        <p style="font-size: 14px; color: #666;">This code will expire in 5 minutes. If you didn't request this, please ignore this email.</p>
        <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
        <p style="font-size: 12px; color: #999; text-align: center;">&copy; 2026 Health Hub Platform. Secure healthcare for everyone.</p>
      </div>
    `,
  });
};

module.exports = {
  sendEmail,
  sendOTPEmail,
};
