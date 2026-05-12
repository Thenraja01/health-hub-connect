const appointmentRepository = require('./appointment.repository');
const prisma = require('../../config/database');
const stripeService = require('../payments/stripe.service');
const emailService = require('../../utils/email');

const bookAppointment = async (patientId, data) => {
  const { doctorId, slotId, symptoms, consultationType } = data;

  return await prisma.$transaction(async (tx) => {
    // 1. Check if slot is available
    const slot = await tx.appointmentSlot.findUnique({
      where: { id: slotId },
    });

    if (!slot || slot.slotStatus !== 'AVAILABLE') {
      throw new Error('This slot is no longer available');
    }

    // 2. Fetch doctor and patient
    const [doctor, patient] = await Promise.all([
      tx.doctor.findUnique({ where: { id: doctorId } }),
      tx.patient.findUnique({ where: { id: patientId } }),
    ]);

    const totalAmount = doctor.consultationFee || 500;
    const commissionRate = doctor.commissionRate || 20;

    // 3. Create appointment
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

    // 4. Update slot status to BLOCKED
    await tx.appointmentSlot.update({
      where: { id: slotId },
      data: {
        slotStatus: 'BLOCKED',
        bookedPatientId: patientId,
        appointmentId: appointment.id,
      },
    });

    // 5. Create Stripe Checkout Session with Connect
    const session = await stripeService.createCheckoutSession(
        totalAmount, 
        appointment.id, 
        patient.email, 
        doctor.stripeAccountId,
        commissionRate
    );
    
    // 6. Update payment with session ID
    await tx.payment.create({
        data: {
            appointmentId: appointment.id,
            transactionId: `pend_${Date.now()}`,
            paymentType: 'CREDIT_CARD',
            amount: totalAmount,
            stripeSessionId: session.id,
            paymentStatus: 'PENDING'
        }
    });

    return { 
      appointment,
      stripeSession: session 
    };
  });
};

const confirmAppointment = async (appointmentId, stripeDetails) => {
  const { sessionId, paymentIntentId } = stripeDetails;

  let paymentIntent;
  let totalAmount;
  let applicationFee;

  if (sessionId) {
    const session = await stripeService.verifySession(sessionId);
    if (session.payment_status !== 'paid') throw new Error('Payment verification failed');
    paymentIntent = session.payment_intent;
    totalAmount = session.amount_total / 100;
  } else if (paymentIntentId) {
    // This is likely from a webhook
    const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
    paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    if (paymentIntent.status !== 'succeeded') throw new Error('Payment not successful');
    totalAmount = paymentIntent.amount / 100;
  } else {
    throw new Error('No payment identifier provided');
  }

  applicationFee = paymentIntent.application_fee_amount ? paymentIntent.application_fee_amount / 100 : 0;
  const doctorAmount = totalAmount - applicationFee;

  return await prisma.$transaction(async (tx) => {
    const appointment = await tx.appointment.findUnique({
      where: { id: appointmentId },
      include: { doctor: true }
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

    // 4. Update Payment Record
    await tx.payment.update({
      where: { appointmentId },
      data: {
        transactionId: paymentIntent.id,
        stripePaymentIntentId: paymentIntent.id,
        applicationFeeId: paymentIntent.application_fee,
        transferId: paymentIntent.transfer,
        paymentStatus: 'PAID',
        paidAt: new Date(),
        commissionAmount: applicationFee,
        doctorAmount: doctorAmount
      },
    });

    // 5. Update Doctor Wallet
    await tx.doctorWallet.upsert({
        where: { doctorId: appointment.doctorId },
        create: {
            doctorId: appointment.doctorId,
            availableBalance: doctorAmount,
            totalEarned: doctorAmount
        },
        update: {
            availableBalance: { increment: doctorAmount },
            totalEarned: { increment: doctorAmount }
        }
    });

    // 6. Update Admin Revenue
    await tx.adminRevenue.upsert({
        where: { id: 'admin_revenue_global' }, // Use a constant ID for global stats
        create: {
            id: 'admin_revenue_global',
            totalRevenue: totalAmount,
            totalCommission: applicationFee
        },
        update: {
            totalRevenue: { increment: totalAmount },
            totalCommission: { increment: applicationFee }
        }
    });

    const result = await tx.appointment.update({
        where: { id: appointmentId },
        include: { patient: true, doctor: true }
    });

    // 7. Send Emails
    // Notify Patient
    emailService.sendBookingSuccess(result.patient.email, {
        doctorName: result.doctor.doctorName,
        time: result.startsAt.toLocaleString(),
        id: result.appointmentNumber
    }).catch(err => console.error('Patient email error:', err));

    // Notify Doctor
    emailService.sendBookingSuccessDoctor(result.doctor.email, {
        doctorName: result.doctor.doctorName,
        patientName: result.patient.fullName,
        time: result.startsAt.toLocaleString(),
        type: result.consultationType
    }).catch(err => console.error('Doctor email error:', err));

    return updatedAppointment;
  });
};

const cancelAppointment = async (appointmentId) => {
  return await prisma.$transaction(async (tx) => {
    const appointment = await tx.appointment.findUnique({
      where: { id: appointmentId },
    });

    if (!appointment) throw new Error('Appointment not found');

    // Only allow cancelling if it's still PENDING
    if (appointment.bookingStatus !== 'PENDING') {
      throw new Error('Only pending appointments can be cancelled');
    }

    // 1. Delete appointment (or mark as CANCELLED)
    // Here we delete it to fully release the slot and appointment ID
    await tx.appointment.delete({
      where: { id: appointmentId },
    });

    // 2. Update Slot status back to AVAILABLE
    await tx.appointmentSlot.update({
      where: { id: appointment.slotId },
      data: {
        slotStatus: 'AVAILABLE',
        bookedPatientId: null,
        appointmentId: null,
      },
    });

    // 3. Send cancellation email
    const patient = await tx.patient.findUnique({ where: { id: appointment.patientId } });
    if (patient && patient.email) {
      emailService.sendBookingCancelled(patient.email, appointment.appointmentNumber).catch(err => console.error('Cancellation email error:', err));
    }

    return { message: 'Appointment cancelled and slot released' };
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
  cancelAppointment,
  getPatientAppointments,
  getDoctorAppointments,
};

