const prisma = require('../../config/database');


const getPaymentHistory = async (userId, role) => {
  if (role === 'PATIENT') {
    return await prisma.payment.findMany({
      where: { appointment: { patientId: userId } },
      include: { appointment: { include: { doctor: true } } },
      orderBy: { createdAt: 'desc' }
    });
  } else if (role === 'DOCTOR') {
    return await prisma.payment.findMany({
      where: { appointment: { doctorId: userId } },
      include: { appointment: { include: { patient: true } } },
      orderBy: { createdAt: 'desc' }
    });
  }
  return [];
};

const getPaymentById = async (paymentId) => {
  return await prisma.payment.findUnique({
    where: { id: paymentId },
    include: { appointment: true }
  });
};

module.exports = {
  getPaymentHistory,
  getPaymentById,
};
