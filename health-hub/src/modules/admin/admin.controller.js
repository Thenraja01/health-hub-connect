const adminService = require('./admin.service');
const { successResponse, errorResponse } = require('../../utils/response');
const prisma = require('../../config/database');
const fs = require('fs');

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

const getSettings = async (req, res) => {
  try {
    let settings = await prisma.appSettings.findFirst();
    if (!settings) {
      settings = await prisma.appSettings.create({
        data: {
          appName: 'Health Hub',
          commissionRate: 20
        }
      });
    }
    successResponse(res, settings, 'Settings fetched successfully');
  } catch (error) {
    errorResponse(res, error.message, 500, error);
  }
};

const updateSettings = async (req, res) => {
  try {
    const { appName, commissionRate, brandingColor } = req.body;
    let settings = await prisma.appSettings.findFirst();
    
    if (settings) {
      settings = await prisma.appSettings.update({
        where: { id: settings.id },
        data: { appName, commissionRate: parseFloat(commissionRate), brandingColor }
      });
    } else {
      settings = await prisma.appSettings.create({
        data: { appName, commissionRate: parseFloat(commissionRate), brandingColor }
      });
    }
    successResponse(res, settings, 'Settings updated successfully');
  } catch (error) {
    errorResponse(res, error.message, 500, error);
  }
};

const uploadLogo = async (req, res) => {
  try {
    if (!req.file) throw new Error('No file uploaded');

    const fileContent = fs.readFileSync(req.file.path);
    let settings = await prisma.appSettings.findFirst();

    if (settings) {
      settings = await prisma.appSettings.update({
        where: { id: settings.id },
        data: { appLogo: fileContent }
      });
    } else {
      settings = await prisma.appSettings.create({
        data: { appLogo: fileContent }
      });
    }

    // Clean up temporary file
    fs.unlinkSync(req.file.path);

    successResponse(res, settings, 'Logo uploaded successfully');
  } catch (error) {
    if (req.file) fs.unlinkSync(req.file.path);
    errorResponse(res, error.message, 500, error);
  }
};

const createSlot = async (req, res) => {
  try {
    const { doctorId, startsAt, endsAt, consultationType } = req.body;
    const slot = await prisma.appointmentSlot.create({
      data: {
        doctorId,
        startsAt: new Date(startsAt),
        endsAt: new Date(endsAt),
        consultationType,
        slotStatus: 'AVAILABLE'
      }
    });
    successResponse(res, slot, 'Slot created successfully', 201);
  } catch (error) {
    errorResponse(res, error.message, 400, error);
  }
};

const deleteSlot = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.appointmentSlot.delete({ where: { id } });
    successResponse(res, null, 'Slot deleted successfully');
  } catch (error) {
    errorResponse(res, error.message, 400, error);
  }
};

const getLogo = async (req, res) => {
  try {
    const settings = await prisma.appSettings.findFirst();
    if (!settings || !settings.appLogo) {
      return res.status(404).send('Logo not found');
    }

    res.set('Content-Type', 'image/png'); 
    res.send(settings.appLogo);
  } catch (error) {
    res.status(500).send('Internal Server Error');
  }
};

const getPublicSettings = async (req, res) => {
  try {
    const settings = await prisma.appSettings.findFirst({
      select: {
        appName: true,
        brandingColor: true
      }
    });
    successResponse(res, settings, 'Public settings fetched successfully');
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
  getSettings,
  updateSettings,
  uploadLogo,
  getLogo,
  getPublicSettings,
  createSlot,
  deleteSlot,
};

