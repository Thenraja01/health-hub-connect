const authService = require('./auth.service');
const { successResponse, errorResponse } = require('../../utils/response');

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await authService.login(email, password);
    successResponse(res, result, 'Login initiated, OTP sent');
  } catch (error) {
    errorResponse(res, error.message, 401, error);
  }
};

const verifyLoginOTP = async (req, res) => {
  try {
    const { email, code, role } = req.body;
    if (!email || !code || !role) {
      return errorResponse(res, 'Email, code and role are required', 400);
    }
    const result = await authService.verifyLoginOTP(email, code, role);
    successResponse(res, result, 'Login successful');
  } catch (error) {
    errorResponse(res, error.message, 401, error);
  }
};

const signup = async (req, res) => {
  try {
    const result = await authService.signup(req.body);
    successResponse(res, result, 'Registration initiated, OTP sent');
  } catch (error) {
    errorResponse(res, error.message, 400, error);
  }
};

const completeSignup = async (req, res) => {
  try {
    const { email, code, userData } = req.body;
    if (!email || !code || !userData) {
      return errorResponse(res, 'Email, code and userData are required', 400);
    }
    const result = await authService.completeSignup(email, code, userData);
    successResponse(res, result, 'Registration successful');
  } catch (error) {
    errorResponse(res, error.message, 400, error);
  }
};

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const result = await authService.forgotPassword(email);
    successResponse(res, result, 'Reset OTP sent');
  } catch (error) {
    errorResponse(res, error.message, 400, error);
  }
};

const resetPassword = async (req, res) => {
  try {
    const { email, code, newPassword } = req.body;
    if (!email || !code || !newPassword) {
      return errorResponse(res, 'Email, code and newPassword are required', 400);
    }
    const result = await authService.resetPassword(email, code, newPassword);
    successResponse(res, result, 'Password reset successful');
  } catch (error) {
    errorResponse(res, error.message, 400, error);
  }
};

module.exports = {
  login,
  verifyLoginOTP,
  signup,
  completeSignup,
  forgotPassword,
  resetPassword,
};

