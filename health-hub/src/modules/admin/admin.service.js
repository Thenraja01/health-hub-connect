const adminRepository = require('./admin.repository');
const prisma = require('../../config/database');

const getDashboardData = async () => {
  const [patientCount, doctorCount, appointmentCount, revenue, adminRevenue, logs] = await Promise.all([
    prisma.patient.count(),
    prisma.doctor.count(),
    prisma.appointment.count({ where: { bookingStatus: 'CONFIRMED' } }),
    prisma.payment.aggregate({ _sum: { amount: true }, where: { paymentStatus: 'PAID' } }),
    prisma.adminRevenue.findUnique({ where: { id: 'admin_revenue_global' } }),
    prisma.auditLog.findMany({ take: 10, orderBy: { createdAt: 'desc' } })
  ]);

  return {
    stats: {
      patients: patientCount,
      doctors: doctorCount,
      appointments: appointmentCount,
      totalRevenue: revenue._sum.amount || 0,
      totalCommission: adminRevenue?.totalCommission || 0,
      pendingWithdrawals: adminRevenue?.pendingWithdrawals || 0
    },
    logs
  };
};

const approveDoctor = async (doctorId) => {
  return await prisma.doctor.update({
    where: { id: doctorId },
    data: { 
      kycStatus: 'APPROVED',
      isApproved: true,
      status: 'ACTIVE'
    },
  });
};

const rejectDoctor = async (doctorId, reason) => {
  return await prisma.doctor.update({
    where: { id: doctorId },
    data: { 
      kycStatus: 'REJECTED',
      isApproved: false,
      bio: reason // Storing rejection reason in bio or a new field
    },
  });
};

const getRevenueAnalytics = async () => {
  const payments = await prisma.payment.findMany({
    where: { paymentStatus: 'PAID' },
    select: {
      amount: true,
      commissionAmount: true,
      createdAt: true
    },
    orderBy: { createdAt: 'desc' }
  });

  return payments;
};

const getPayoutTracking = async () => {
  return await prisma.withdrawal.findMany({
    include: { doctor: true },
    orderBy: { createdAt: 'desc' }
  });
};

const getRecentLogs = async () => {
  return await prisma.auditLog.findMany({
    orderBy: { createdAt: 'desc' },
    take: 50
  });
};

module.exports = {
  getDashboardData,
  approveDoctor,
  rejectDoctor,
  getRevenueAnalytics,
  getPayoutTracking,
  getRecentLogs,
};

