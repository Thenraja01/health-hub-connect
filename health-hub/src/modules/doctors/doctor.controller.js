const doctorService = require('./doctor.service');
const { successResponse, errorResponse } = require('../../utils/response');

const getDoctors = async (req, res) => {
  try {
    const doctors = await doctorService.getAllDoctors(req.query);
    successResponse(res, doctors, 'Doctors fetched successfully');
  } catch (error) {
    errorResponse(res, error.message, 500, error);
  }
};

const getDoctor = async (req, res) => {
  try {
    const doctor = await doctorService.getDoctorById(req.params.id);
    successResponse(res, doctor, 'Doctor profile fetched successfully');
  } catch (error) {
    errorResponse(res, error.message, 404, error);
  }
};

const getProfile = async (req, res) => {
  try {
    const doctor = await doctorService.getDoctorById(req.user.id);
    successResponse(res, doctor, 'Profile fetched successfully');
  } catch (error) {
    errorResponse(res, error.message, 404, error);
  }
};

const updateProfile = async (req, res) => {
  try {
    const doctor = await doctorService.updateDoctorProfile(req.user.id, req.body);
    successResponse(res, doctor, 'Profile updated successfully');
  } catch (error) {
    errorResponse(res, error.message, 400, error);
  }
};

const toggleStatus = async (req, res) => {
  try {
    const { isOnline } = req.body;
    const doctor = await doctorService.updateDoctorStatus(req.user.id, isOnline);
    successResponse(res, doctor, `Status updated to ${isOnline ? 'Online' : 'Offline'}`);
  } catch (error) {
    errorResponse(res, error.message, 400, error);
  }
};

const getSpecialties = async (req, res) => {
  try {
    const specialties = await doctorService.getAllSpecialties();
    successResponse(res, specialties, 'Specialties fetched successfully');
  } catch (error) {
    errorResponse(res, error.message, 500, error);
  }
};

const getPatients = async (req, res) => {
  try {
    const patients = await doctorService.getDoctorPatients(req.user.id);
    successResponse(res, patients, 'Patients fetched successfully');
  } catch (error) {
    errorResponse(res, error.message, 500, error);
  }
};

const getEarnings = async (req, res) => {
  try {
    const earnings = await doctorService.getDoctorEarnings(req.user.id);
    successResponse(res, earnings, 'Earnings fetched successfully');
  } catch (error) {
    errorResponse(res, error.message, 500, error);
  }
};

const getSchedule = async (req, res) => {
  try {
    const schedule = await doctorService.getDoctorSchedule(req.user.id);
    successResponse(res, schedule, 'Schedule fetched successfully');
  } catch (error) {
    errorResponse(res, error.message, 500, error);
  }
};

const getSlots = async (req, res) => {
  try {
    const slots = await doctorService.getDoctorSlots(req.user.id);
    successResponse(res, slots, 'Slots fetched successfully');
  } catch (error) {
    errorResponse(res, error.message, 500, error);
  }
};

const createSchedule = async (req, res) => {
  try {
    const schedule = await doctorService.createDoctorSchedule(req.user.id, req.body);
    successResponse(res, schedule, 'Schedule slot added successfully');
  } catch (error) {
    errorResponse(res, error.message, 500, error);
  }
};

const getPublicSlots = async (req, res) => {
  try {
    const slots = await doctorService.getDoctorSlots(req.params.id, true); // true for available only
    successResponse(res, slots, 'Slots fetched successfully');
  } catch (error) {
    errorResponse(res, error.message, 500, error);
  }
};

const getTasks = async (req, res) => {
  try {
    const tasks = await doctorService.getDoctorTasks(req.user.id);
    successResponse(res, tasks, 'Tasks fetched successfully');
  } catch (error) {
    errorResponse(res, error.message, 500, error);
  }
};

const createTask = async (req, res) => {
  try {
    const task = await doctorService.createDoctorTask(req.user.id, req.body);
    successResponse(res, task, 'Task created successfully');
  } catch (error) {
    errorResponse(res, error.message, 500, error);
  }
};

module.exports = {
  getDoctors,
  getDoctor,
  getPublicSlots,
  getProfile,
  updateProfile,
  toggleStatus,
  getSpecialties,
  getPatients,
  getEarnings,
  getSchedule,
  getSlots,
  createSchedule,
  getTasks,
  createTask,
};
