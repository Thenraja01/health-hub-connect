const prisma = require('../../config/database');

/**
 * Executes a transactional appointment booking
 * Includes creating appointment, updating slot, and potentially creating a payment record
 */
const executeBookingTransaction = async (patientId, doctorId, slot, consultationType, symptoms) => {
  return await prisma.$transaction(async (tx) => {
    // 1. Double check slot status within transaction
    const currentSlot = await tx.appointmentSlot.findUnique({
      where: { id: slot.id },
    });

    if (currentSlot.slotStatus !== 'AVAILABLE') {
      throw new Error('Slot was just booked by someone else');
    }

    // 2. Create the Appointment
    const appointmentNumber = `APT-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
    const appointment = await tx.appointment.create({
      data: {
        appointmentNumber,
        patientId,
        doctorId,
        slotId: slot.id,
        consultationType,
        startsAt: slot.startsAt,
        endsAt: slot.endsAt,
        symptoms,
        totalAmount: 500, // This should come from doctor's fee in real logic
      },
    });

    // 3. Update the Slot
    await tx.appointmentSlot.update({
      where: { id: slot.id },
      data: {
        slotStatus: 'BOOKED',
        bookedPatientId: patientId,
        appointmentId: appointment.id,
      },
    });

    // 4. Create initial Payment record
    await tx.payment.create({
      data: {
        appointmentId: appointment.id,
        transactionId: `TXN-${appointmentNumber}`,
        paymentType: 'UPI', // Default for now
        amount: 500,
        paymentStatus: 'PENDING',
      },
    });

    return appointment;
  });
};

module.exports = { executeBookingTransaction };
