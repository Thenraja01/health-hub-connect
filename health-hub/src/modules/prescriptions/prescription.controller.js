const prescriptionService = require('./prescription.service');
const { successResponse, errorResponse } = require('../../utils/response');

const create = async (req, res) => {
  try {
    const prescription = await prescriptionService.createPrescription({
      ...req.body,
      doctorId: req.user.id,
    });
    successResponse(res, prescription, 'Prescription created successfully', 201);
  } catch (error) {
    errorResponse(res, error.message, 400, error);
  }
};

const getByAppointment = async (req, res) => {
  try {
    const prescription = await prescriptionService.getPrescriptionByAppointment(req.params.appointmentId);
    if (!prescription) return errorResponse(res, 'Prescription not found', 404);
    successResponse(res, prescription, 'Prescription fetched successfully');
  } catch (error) {
    errorResponse(res, error.message, 500, error);
  }
};

const downloadPDF = async (req, res) => {
  try {
    const prescription = await prescriptionService.getPrescriptionById(req.params.id);
    if (!prescription || !prescription.prescriptionPdf) {
      return errorResponse(res, 'Prescription PDF not found', 404);
    }

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=prescription-${prescription.id}.pdf`);
    res.send(prescription.prescriptionPdf);
  } catch (error) {
    errorResponse(res, error.message, 500, error);
  }
};

module.exports = {
  create,
  getByAppointment,
  downloadPDF,
};
