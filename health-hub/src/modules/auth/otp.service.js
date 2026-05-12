const prisma = require('../../config/database');
const crypto = require('crypto');
const { addMinutes, isAfter } = require('date-fns');
const { sendOTPEmail } = require('../notifications/email.service');

/**
 * Generate a 6-digit numeric OTP
 * @returns {string}
 */
const generateOTPCode = () => {
  return crypto.randomInt(100000, 999999).toString();
};


const createOTP = async (email, type) => {
  if (!email) throw new Error('Email is required for OTP generation');
  const code = generateOTPCode();
  const expiresAt = addMinutes(new Date(), 5);

  await prisma.oTP.upsert({
    where: { email },
    update: {
      code,
      type,
      expiresAt,
      createdAt: new Date(),
    },
    create: {
      email,
      code,
      type,
      expiresAt,
    },
  });


  // Send the OTP via Email
  await sendOTPEmail(email, code);
  
  return code;
};

/**
 * Verify OTP for an email
 * @param {string} email 
 * @param {string} code 
 * @param {string} type 
 * @returns {Promise<boolean>}
 */
const verifyOTP = async (email, code, type) => {
  if (!email) throw new Error('Email is required for OTP verification');
  const otpRecord = await prisma.oTP.findUnique({
    where: { email },
  });

  if (!otpRecord) {
    throw new Error('OTP not found');
  }

  if (otpRecord.code !== code) {
    throw new Error('Invalid OTP');
  }

  if (otpRecord.type !== type) {
    throw new Error('OTP type mismatch');
  }

  if (isAfter(new Date(), otpRecord.expiresAt)) {
    throw new Error('OTP expired');
  }

  // Delete OTP after successful verification
  await prisma.oTP.delete({
    where: { email },
  });

  return true;
};

module.exports = {
  createOTP,
  verifyOTP,
};
