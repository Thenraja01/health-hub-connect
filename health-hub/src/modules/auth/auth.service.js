const prisma = require('../../config/database');
const { hashPassword, comparePassword } = require('./password.service');
const { generateToken, generateRefreshToken } = require('./jwt.service');
const otpService = require('./otp.service');

const login = async (email, password) => {
  // Validate input
  if (!email || !password) {
    throw new Error('Email and password are required');
  }

  // Check Patient table
  let user = await prisma.patient.findUnique({ where: { email } });
  let role = 'PATIENT';

  // Check Doctor table if not found in Patient
  if (!user) {
    user = await prisma.doctor.findUnique({ where: { email } });
    role = 'DOCTOR';
  }

  // Check Admin table if not found in Doctor
  if (!user) {
    user = await prisma.admin.findUnique({ where: { email } });
    role = 'ADMIN';
  }

  if (!user) {
    throw new Error('Invalid email or password');
  }

  // Always use bcrypt comparison (encrypted passwords only)
  const isMatch = await comparePassword(password, user.password);

  if (!isMatch) {
    throw new Error('Invalid email or password');
  }

  // Generate OTP for login (2FA-like flow as requested)
  await otpService.createOTP(email, 'LOGIN');

  return { 
    message: 'OTP sent to your email',
    email,
    role,
    otpRequired: true 
  };
};

const verifyLoginOTP = async (email, code, role) => {
  await otpService.verifyOTP(email, code, 'LOGIN');

  let user;
  if (role === 'PATIENT') user = await prisma.patient.findUnique({ where: { email } });
  else if (role === 'DOCTOR') user = await prisma.doctor.findUnique({ where: { email } });
  else if (role === 'ADMIN') user = await prisma.admin.findUnique({ where: { email } });

  const token = generateToken({ id: user.id, role });
  const refreshToken = generateRefreshToken({ id: user.id, role });

  // Update refresh token in DB
  const updateData = { refreshToken };
  if (role === 'PATIENT') await prisma.patient.update({ where: { id: user.id }, data: updateData });
  else if (role === 'DOCTOR') await prisma.doctor.update({ where: { id: user.id }, data: updateData });
  else if (role === 'ADMIN') await prisma.admin.update({ where: { id: user.id }, data: updateData });

  const userData = {
    id: user.id,
    name: user.fullName || user.doctorName || user.name,
    email: user.email,
    role: role
  };

  return { user: userData, token, refreshToken };
};

const signup = async (userData) => {
  const { email, phone, password, fullName, role } = userData;

  // Check if user already exists
  const existingPatient = await prisma.patient.findUnique({ where: { email } });
  const existingDoctor = await prisma.doctor.findUnique({ where: { email } });
  const existingAdmin = await prisma.admin.findUnique({ where: { email } });

  if (existingPatient || existingDoctor || existingAdmin) {
    throw new Error('User with this email already exists');
  }

  // Pre-validate phone
  const existingPatientPhone = await prisma.patient.findFirst({ where: { phone } });
  if (existingPatientPhone) throw new Error('Phone number already in use');

  // Instead of creating user now, send OTP
  await otpService.createOTP(email, 'SIGNUP');

  return {
    message: 'Verification OTP sent',
    email,
    tempData: { ...userData, password: await hashPassword(password) }, // In real app, store this in Redis or temp DB
    otpRequired: true
  };
};

const completeSignup = async (email, code, userData) => {
  await otpService.verifyOTP(email, code, 'SIGNUP');

  const { fullName, phone, password, role } = userData;
  let newUser;

  if (role === 'PATIENT') {
    const patientCode = 'PAT-' + Math.random().toString(36).substr(2, 6).toUpperCase();
    newUser = await prisma.patient.create({
      data: { fullName, email, phone, password, patientCode, status: 'ACTIVE' },
    });
  } else if (role === 'DOCTOR') {
    newUser = await prisma.doctor.create({
      data: { doctorName: fullName, email, phone, password, status: 'ACTIVE' },
    });
  } else if (role === 'ADMIN') {
    newUser = await prisma.admin.create({
      data: { name: fullName, email, phone, password, role: 'ADMIN', status: 'ACTIVE' },
    });
  }

  const token = generateToken({ id: newUser.id, role });
  const refreshToken = generateRefreshToken({ id: newUser.id, role });

  // Save refresh token
  const updateData = { refreshToken };
  if (role === 'PATIENT') await prisma.patient.update({ where: { id: newUser.id }, data: updateData });
  else if (role === 'DOCTOR') await prisma.doctor.update({ where: { id: newUser.id }, data: updateData });
  else if (role === 'ADMIN') await prisma.admin.update({ where: { id: newUser.id }, data: updateData });

  return {
    user: {
      id: newUser.id,
      name: newUser.fullName || newUser.doctorName || newUser.name,
      email: newUser.email,
      role
    },
    token,
    refreshToken
  };
};

const forgotPassword = async (email) => {
  // Check if user exists
  const patient = await prisma.patient.findUnique({ where: { email } });
  const doctor = await prisma.doctor.findUnique({ where: { email } });
  const admin = await prisma.admin.findUnique({ where: { email } });

  if (!patient && !doctor && !admin) {
    throw new Error('User not found');
  }

  await otpService.createOTP(email, 'RESET_PASSWORD');
  return { 
    message: 'Password reset OTP sent',
    email
  };
};

const resetPassword = async (email, code, newPassword) => {
  await otpService.verifyOTP(email, code, 'RESET_PASSWORD');

  const hashedPassword = await hashPassword(newPassword);

  const patient = await prisma.patient.findUnique({ where: { email } });
  const doctor = await prisma.doctor.findUnique({ where: { email } });
  const admin = await prisma.admin.findUnique({ where: { email } });

  if (patient) await prisma.patient.update({ where: { id: patient.id }, data: { password: hashedPassword } });
  else if (doctor) await prisma.doctor.update({ where: { id: doctor.id }, data: { password: hashedPassword } });
  else if (admin) await prisma.admin.update({ where: { id: admin.id }, data: { password: hashedPassword } });

  return { message: 'Password reset successful' };
};

module.exports = {
  login,
  verifyLoginOTP,
  signup,
  completeSignup,
  forgotPassword,
  resetPassword,
};

