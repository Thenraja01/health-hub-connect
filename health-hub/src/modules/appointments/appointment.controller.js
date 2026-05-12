const appointmentService = require('./appointment.service');
const { successResponse, errorResponse } = require('../../utils/response');

const book = async (req, res) => {
  try {
    const result = await appointmentService.bookAppointment(req.user.id, req.body);
    successResponse(res, result, 'Appointment booking initiated', 201);
  } catch (error) {
    errorResponse(res, error.message, 400, error);
  }
};

const confirm = async (req, res) => {
  try {
    const { appointmentId, razorpayDetails } = req.body;
    const appointment = await appointmentService.confirmAppointment(appointmentId, razorpayDetails);
    successResponse(res, appointment, 'Appointment confirmed successfully');
  } catch (error) {
    errorResponse(res, error.message, 400, error);
  }
};

const getMyAppointments = async (req, res) => {
  try {
    const appointments = await appointmentService.getPatientAppointments(req.user.id);
    successResponse(res, appointments, 'Appointments fetched successfully');
  } catch (error) {
    errorResponse(res, error.message, 500, error);
  }
};

const getDoctorAppointments = async (req, res) => {
  try {
    const appointments = await appointmentService.getDoctorAppointments(req.user.id);
    successResponse(res, appointments, 'Doctor appointments fetched successfully');
  } catch (error) {
    errorResponse(res, error.message, 500, error);
  }
};

module.exports = {
  book,
  confirm,
  getMyAppointments,
  getDoctorAppointments,
};

