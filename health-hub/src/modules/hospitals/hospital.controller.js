const hospitalService = require('./hospital.service');
const { successResponse, errorResponse } = require('../../utils/response');

const getHospitals = async (req, res) => {
  try {
    const hospitals = await hospitalService.getAllHospitals();
    successResponse(res, hospitals, 'Hospitals fetched successfully');
  } catch (error) {
    errorResponse(res, error.message, 500, error);
  }
};

const getHospital = async (req, res) => {
  try {
    const hospital = await hospitalService.getHospitalById(req.params.id);
    if (!hospital) {
      return errorResponse(res, 'Hospital not found', 404);
    }
    successResponse(res, hospital, 'Hospital fetched successfully');
  } catch (error) {
    errorResponse(res, error.message, 500, error);
  }
};

const addHospital = async (req, res) => {
  try {
    const hospital = await hospitalService.createHospital(req.body);
    successResponse(res, hospital, 'Hospital added successfully', 201);
  } catch (error) {
    errorResponse(res, error.message, 400, error);
  }
};

const updateHospital = async (req, res) => {
  try {
    const hospital = await hospitalService.updateHospital(req.params.id, req.body);
    successResponse(res, hospital, 'Hospital updated successfully');
  } catch (error) {
    errorResponse(res, error.message, 400, error);
  }
};

module.exports = {
  getHospitals,
  getHospital,
  addHospital,
  updateHospital,
};
