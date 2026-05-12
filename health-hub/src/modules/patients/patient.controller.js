const patientService = require('./patient.service');
const { successResponse, errorResponse } = require('../../utils/response');

const register = async (req, res) => {
  try {
    const patient = await patientService.registerPatient(req.body);
    successResponse(res, patient, 'Registration successful', 201);
  } catch (error) {
    errorResponse(res, error.message, 400, error);
  }
};

const getProfile = async (req, res) => {
  try {
    const patient = await patientService.getPatientProfile(req.user.id);
    successResponse(res, patient, 'Profile fetched successfully');
  } catch (error) {
    errorResponse(res, error.message, 404, error);
  }
};

const updateProfile = async (req, res) => {
  try {
    const data = req.body;
    if (req.file) {
      data.profileImage = req.file.buffer;
    }
    const patient = await patientService.updatePatientProfile(req.user.id, data);
    successResponse(res, patient, 'Profile updated successfully');
  } catch (error) {
    errorResponse(res, error.message, 400, error);
  }
};

module.exports = {
  register,
  getProfile,
  updateProfile,
};
