const reviewService = require('./review.service');
const { successResponse, errorResponse } = require('../../utils/response');

const addReview = async (req, res) => {
  try {
    const { doctorId, appointmentId, rating, comment } = req.body;
    const review = await reviewService.createReview(
      req.user.id,
      doctorId,
      appointmentId,
      rating,
      comment
    );
    successResponse(res, review, 'Review submitted successfully', 201);
  } catch (error) {
    errorResponse(res, error.message, 400, error);
  }
};

const getReviews = async (req, res) => {
  try {
    const reviews = await reviewService.getDoctorReviews(req.params.doctorId);
    successResponse(res, reviews, 'Reviews fetched successfully');
  } catch (error) {
    errorResponse(res, error.message, 500, error);
  }
};

module.exports = {
  addReview,
  getReviews,
};
