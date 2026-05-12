const prisma = require('../../config/database');

/**
 * Get doctor earnings report
 * @param {string} doctorId 
 */
const getDoctorEarnings = async (doctorId) => {
  const appointments = await prisma.appointment.findMany({
    where: {
      doctorId,
      bookingStatus: 'COMPLETED',
      paymentStatus: 'PAID',
    },
    include: { payment: true },
  });

  const totalRevenue = appointments.reduce((sum, apt) => sum + apt.totalAmount, 0);
  const totalCommission = appointments.reduce((sum, apt) => sum + (apt.payment?.commissionAmount || 0), 0);
  const netEarnings = totalRevenue - totalCommission;

  // Recent payouts
  const withdrawals = await prisma.withdrawal.findMany({
    where: { doctorId },
    orderBy: { createdAt: 'desc' },
  });

  const totalWithdrawn = withdrawals
    .filter(w => w.status === 'PAID')
    .reduce((sum, w) => sum + w.amount, 0);

  return {
    summary: {
      totalRevenue,
      totalCommission,
      netEarnings,
      totalWithdrawn,
      availableBalance: netEarnings - totalWithdrawn,
    },
    transactions: appointments.map(apt => ({
      id: apt.id,
      date: apt.createdAt,
      amount: apt.totalAmount,
      commission: apt.payment?.commissionAmount || 0,
      net: apt.totalAmount - (apt.payment?.commissionAmount || 0),
      patientName: apt.patientId, // Should populate in real query
    })),
    withdrawals,
  };
};

/**
 * Request withdrawal
 * @param {string} doctorId 
 * @param {number} amount 
 * @param {Object} bankDetails 
 */
const requestWithdrawal = async (doctorId, amount, bankDetails) => {
  const earnings = await getDoctorEarnings(doctorId);
  
  if (amount > earnings.summary.availableBalance) {
    throw new Error('Insufficient balance for withdrawal');
  }

  return await prisma.withdrawal.create({
    data: {
      doctorId,
      amount,
      bankDetails,
      status: 'PENDING',
    },
  });
};

module.exports = {
  getDoctorEarnings,
  requestWithdrawal,
};
