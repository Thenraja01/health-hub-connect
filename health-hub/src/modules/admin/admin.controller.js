const adminService = require('./admin.service');
const { successResponse, errorResponse } = require('../../utils/response');
const prisma = require('../../config/database');

const getDashboard = async (req, res) => {
  try {
    const data = await adminService.getDashboardData();
    successResponse(res, data, 'Dashboard data fetched successfully');
  } catch (error) {
    errorResponse(res, error.message, 500, error);
  }
};

const getPendingDoctors = async (req, res) => {
  try {
    const doctors = await prisma.doctor.findMany({
      where: { kycStatus: 'PENDING' }
    });
    successResponse(res, doctors, 'Pending doctors fetched successfully');
  } catch (error) {
    errorResponse(res, error.message, 500, error);
  }
};

const approveDoctor = async (req, res) => {
  try {
    const doctor = await adminService.approveDoctor(req.params.id);
    successResponse(res, doctor, 'Doctor approved successfully');
  } catch (error) {
    errorResponse(res, error.message, 400, error);
  }
};

const rejectDoctor = async (req, res) => {
  try {
    const { reason } = req.body;
    const doctor = await adminService.rejectDoctor(req.params.id, reason);
    successResponse(res, doctor, 'Doctor rejected successfully');
  } catch (error) {
    errorResponse(res, error.message, 400, error);
  }
};

const getRevenue = async (req, res) => {
  try {
    const data = await adminService.getRevenueAnalytics();
    successResponse(res, data, 'Revenue analytics fetched successfully');
  } catch (error) {
    errorResponse(res, error.message, 500, error);
  }
};

const getLogs = async (req, res) => {
  try {
    const logs = await adminService.getRecentLogs();
    successResponse(res, logs, 'Audit logs fetched successfully');
  } catch (error) {
    errorResponse(res, error.message, 500, error);
  }
};

const getUsers = async (req, res) => {
  try {
    const doctors = await prisma.doctor.findMany();
    const patients = await prisma.patient.findMany();
    successResponse(res, { doctors, patients }, 'Users fetched successfully');
  } catch (error) {
    errorResponse(res, error.message, 500, error);
  }
};

module.exports = {
  getDashboard,
  getPendingDoctors,
  approveDoctor,
  rejectDoctor,
  getRevenue,
  getLogs,
  getUsers,
};

