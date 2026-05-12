const prisma = require('../../config/database');

const createReview = async (patientId, doctorId, appointmentId, rating, comment) => {
  // Check if appointment is completed
  const appointment = await prisma.appointment.findUnique({
    where: { id: appointmentId }
  });

  if (!appointment || appointment.bookingStatus !== 'COMPLETED') {
    throw new Error('Can only review completed appointments');
  }

  // Create review
  const review = await prisma.patientReview.create({
    data: {
      patientId,
      doctorId,
      appointmentId,
      rating,
      comment
    }
  });

  // Update doctor average rating
  const reviews = await prisma.patientReview.findMany({
    where: { doctorId }
  });

  const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;

  await prisma.doctor.update({
    where: { id: doctorId },
    data: {
      averageRating: avgRating,
      totalReviews: reviews.length
    }
  });

  return review;
};

const getDoctorReviews = async (doctorId) => {
  return await prisma.patientReview.findMany({
    where: { doctorId },
    include: { patient: true },
    orderBy: { createdAt: 'desc' }
  });
};

module.exports = {
  createReview,
  getDoctorReviews,
};
