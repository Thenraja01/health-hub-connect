const appointmentRepository = require('./appointment.repository');
const prisma = require('../../config/database');
const stripeService = require('../payments/stripe.service');

const bookAppointment = async (patientId, data) => {
  const { doctorId, slotId, symptoms, consultationType } = data;

  // Use a transaction to ensure slot availability and booking
  return await prisma.$transaction(async (tx) => {
    // 1. Check if slot is available
    const slot = await tx.appointmentSlot.findUnique({
      where: { id: slotId },
    });

    if (!slot || slot.slotStatus !== 'AVAILABLE') {
      throw new Error('This slot is no longer available');
    }

    // 2. Fetch doctor for consultation fee and patient for email
    const [doctor, patient] = await Promise.all([
      tx.doctor.findUnique({ where: { id: doctorId } }),
      tx.patient.findUnique({ where: { id: patientId } }),
    ]);

    const totalAmount = doctor.consultationFee || 500;

    // 3. Create appointment (status PENDING)
    const appointmentNumber = `APT-${Date.now()}`;
    const appointment = await tx.appointment.create({
      data: {
        appointmentNumber,
        patientId,
        doctorId,
        slotId,
        consultationType,
        startsAt: slot.startsAt,
        endsAt: slot.endsAt,
        symptoms,
        totalAmount,
        bookingStatus: 'PENDING',
        paymentStatus: 'PENDING',
      },
    });

    // 4. Update slot status to BLOCKED (temporary until payment)
    await tx.appointmentSlot.update({
      where: { id: slotId },
      data: {
        slotStatus: 'BLOCKED',
        bookedPatientId: patientId,
        appointmentId: appointment.id,
      },
    });

    // 5. Create Stripe Checkout Session
    const session = await stripeService.createCheckoutSession(totalAmount, appointment.id, patient.email);
    
    return { 
      appointment,
      stripeSession: session 
    };
  });
};

const confirmAppointment = async (appointmentId, stripeDetails) => {
  const { sessionId } = stripeDetails;

  // 1. Verify Payment
  const session = await stripeService.verifySession(sessionId);
  if (session.payment_status !== 'paid') throw new Error('Payment verification failed');

  return await prisma.$transaction(async (tx) => {
    const appointment = await tx.appointment.findUnique({
      where: { id: appointmentId },
    });

    if (!appointment) throw new Error('Appointment not found');

    // 2. Update Appointment
    const updatedAppointment = await tx.appointment.update({
      where: { id: appointmentId },
      data: {
        bookingStatus: 'CONFIRMED',
        paymentStatus: 'PAID',
      },
    });

    // 3. Update Slot
    await tx.appointmentSlot.update({
      where: { id: appointment.slotId },
      data: { slotStatus: 'BOOKED' },
    });

    // 4. Create Payment Record
    await tx.payment.create({
      data: {
        appointmentId,
        transactionId: session.payment_intent,
        paymentType: 'CARD',
        paymentGateway: 'STRIPE',
        amount: appointment.totalAmount,
        paymentStatus: 'PAID',
        paidAt: new Date(),
      },
    });

    return updatedAppointment;
  });
};

const getPatientAppointments = async (patientId) => {
  return await appointmentRepository.findByPatient(patientId);
};

const getDoctorAppointments = async (doctorId) => {
  return await appointmentRepository.findByDoctor(doctorId);
};

module.exports = {
  bookAppointment,
  confirmAppointment,
  getPatientAppointments,
  getDoctorAppointments,
};

