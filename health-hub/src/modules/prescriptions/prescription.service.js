const prisma = require('../../config/database');
const { generatePrescriptionPDF } = require('./pdf.generator');

/**
 * Create a new prescription
 * @param {Object} prescriptionData 
 * @returns {Promise<Object>}
 */
const createPrescription = async (prescriptionData) => {
  const { appointmentId, doctorId, patientId, medicines, doctorNotes, recommendedTests, nextFollowupDate } = prescriptionData;

  // Fetch data for PDF
  const appointment = await prisma.appointment.findUnique({
    where: { id: appointmentId },
    include: {
      doctor: { include: { hospital: true } },
      patient: true,
    },
  });

  if (!appointment) throw new Error('Appointment not found');

  const pdfData = {
    doctorName: appointment.doctor.doctorName,
    doctorQualification: appointment.doctor.qualification,
    licenseNumber: appointment.doctor.licenseNumber,
    hospitalName: appointment.doctor.hospital?.hospitalName,
    hospitalAddress: appointment.doctor.hospital?.address,
    patientName: appointment.patient.fullName,
    patientAge: appointment.patient.age,
    patientGender: appointment.patient.gender,
    patientCode: appointment.patient.patientCode,
    medicines,
    doctorNotes,
  };

  const pdfBuffer = await generatePrescriptionPDF(pdfData);

  const prescription = await prisma.prescription.create({
    data: {
      appointmentId,
      doctorId,
      patientId,
      medicines, // Stored as JSON
      doctorNotes,
      recommendedTests,
      nextFollowupDate: nextFollowupDate ? new Date(nextFollowupDate) : null,
      prescriptionPdf: pdfBuffer,
    },
  });

  // Update appointment status to COMPLETED if it wasn't already
  await prisma.appointment.update({
    where: { id: appointmentId },
    data: { bookingStatus: 'COMPLETED' },
  });

  return prescription;
};

/**
 * Get prescription by appointment ID
 * @param {string} appointmentId 
 * @returns {Promise<Object>}
 */
const getPrescriptionByAppointment = async (appointmentId) => {
  return await prisma.prescription.findUnique({
    where: { appointmentId },
  });
};

/**
 * Get prescription by ID
 * @param {string} id 
 * @returns {Promise<Object>}
 */
const getPrescriptionById = async (id) => {
  return await prisma.prescription.findUnique({
    where: { id },
  });
};

module.exports = {
  createPrescription,
  getPrescriptionByAppointment,
  getPrescriptionById,
};
