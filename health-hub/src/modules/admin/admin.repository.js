const BaseRepository = require('../../utils/base.repository');
const prisma = require('../../config/database');

class AdminRepository extends BaseRepository {
  constructor() {
    super('admin');
  }

  async getDashboardStats() {
    const [doctorCount, patientCount, appointmentCount, revenue] = await Promise.all([
      prisma.doctor.count(),
      prisma.patient.count(),
      prisma.appointment.count(),
      prisma.payment.aggregate({
        _sum: { amount: true },
        where: { paymentStatus: 'PAID' },
      }),
    ]);

    return {
      doctors: doctorCount,
      patients: patientCount,
      appointments: appointmentCount,
      totalRevenue: revenue._sum.amount || 0,
    };
  }

  async getAuditLogs(limit = 50) {
    return await prisma.auditLog.findMany({
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
  }
}

module.exports = new AdminRepository();
