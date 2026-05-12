const prisma = require('../../config/database');
const doctorRepository = require('./doctor.repository');
const appointmentRepository = require('../appointments/appointment.repository');
const taskRepository = require('./task.repository');

const getAllDoctors = async (filters) => {
  return await doctorRepository.searchDoctors(filters);
};

const getDoctorById = async (id) => {
  const doctor = await doctorRepository.findWithSpecialization(id);
  if (!doctor) {
    throw new Error('Doctor not found');
  }
  return doctor;
};

const updateDoctorProfile = async (doctorId, data) => {
  return await doctorRepository.update(doctorId, data);
};

const updateDoctorStatus = async (doctorId, isOnline) => {
  return await doctorRepository.update(doctorId, { isOnline });
};

const getAllSpecialties = async () => {
  return await doctorRepository.getAllSpecialties();
};

const getDoctorPatients = async (doctorId) => {
  const appointments = await appointmentRepository.findByDoctor(doctorId);
  // Extract unique patients from appointments
  const patientsMap = new Map();
  appointments.forEach(apt => {
    if (apt.patient) {
      const patient = { ...apt.patient, prescriptions: [] };
      if (!patientsMap.has(patient.id)) {
        patientsMap.set(patient.id, patient);
      }
      if (apt.prescription) {
        patientsMap.get(patient.id).prescriptions.push(apt.prescription);
      }
    }
  });
  return Array.from(patientsMap.values());
};

const getDoctorEarnings = async (doctorId) => {
  const payments = await prisma.payment.findMany({
    where: { 
      appointment: { 
        doctorId: doctorId,
        paymentStatus: 'PAID'
      } 
    },
    include: { appointment: { include: { patient: true } } }
  });

  const totalAmount = payments.reduce((sum, p) => sum + p.amount, 0);
  const commission = totalAmount * 0.1; // 10% platform fee
  const netEarnings = totalAmount - commission;

  return {
    totalEarnings: totalAmount,
    netEarnings,
    commission,
    paymentCount: payments.length,
    recentTransactions: payments.slice(0, 5).map(p => ({
      id: p.id,
      amount: p.amount,
      date: p.createdAt,
      patientName: p.appointment.patient.fullName,
      status: p.paymentStatus
    }))
  };
};

const getDoctorSchedule = async (doctorId) => {
  return await prisma.doctorSchedule.findMany({
    where: { doctorId },
    orderBy: { dayOfWeek: 'asc' }
  });
};

const getDoctorSlots = async (doctorId, availableOnly = false) => {
  const where = { doctorId };
  if (availableOnly) {
    where.slotStatus = 'AVAILABLE';
    where.startsAt = { gte: new Date() }; // Only future slots
  }

  return await prisma.appointmentSlot.findMany({
    where,
    include: { appointment: true },
    orderBy: { startsAt: 'asc' }
  });
};

const { generateSlots } = require('../appointments/slot.generator');

const createDoctorSchedule = async (doctorId, scheduleData) => {
  const schedule = await prisma.doctorSchedule.create({
    data: {
      ...scheduleData,
      doctorId
    }
  });

  // Automatically generate slots for the next 7 days based on the new schedule
  await generateSlots(doctorId, new Date(), 7);

  return schedule;
};

const getDoctorTasks = async (doctorId) => {
  return await taskRepository.findByDoctor(doctorId);
};

const createDoctorTask = async (doctorId, taskData) => {
  return await taskRepository.create({
    ...taskData,
    doctorId,
    status: 'pending'
  });
};

const updateSlotStatus = async (doctorId, slotId, status) => {
  const slot = await prisma.appointmentSlot.findFirst({
    where: { id: slotId, doctorId }
  });

  if (!slot) throw new Error('Slot not found or unauthorized');

  return await prisma.appointmentSlot.update({
    where: { id: slotId },
    data: { slotStatus: status }
  });
};

const addCertification = async (doctorId, certData) => {
  const doctor = await prisma.doctor.findUnique({ where: { id: doctorId } });
  if (!doctor) throw new Error('Doctor not found');

  let kycDocuments = doctor.kycDocuments || [];
  if (!Array.isArray(kycDocuments)) kycDocuments = [];
  
  kycDocuments.push({
    ...certData,
    uploadedAt: new Date()
  });

  return await prisma.doctor.update({
    where: { id: doctorId },
    data: { kycDocuments }
  });
};

module.exports = {
  getAllDoctors,
  getDoctorById,
  updateDoctorProfile,
  updateDoctorStatus,
  getAllSpecialties,
  getDoctorPatients,
  getDoctorEarnings,
  getDoctorSchedule,
  getDoctorSlots,
  createDoctorSchedule,
  getDoctorTasks,
  createDoctorTask,
  updateSlotStatus,
  addCertification,
};
