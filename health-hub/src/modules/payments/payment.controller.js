const paymentService = require('./payment.service');
const { successResponse, errorResponse } = require('../../utils/response');

const getHistory = async (req, res) => {
  try {
    const history = await paymentService.getPaymentHistory(req.user.id, req.user.role);
    successResponse(res, history, 'Payment history fetched successfully');
  } catch (error) {
    errorResponse(res, error.message, 500, error);
  }
};

const getDetails = async (req, res) => {
  try {
    const details = await paymentService.getPaymentById(req.params.id);
    if (!details) return errorResponse(res, 'Payment not found', 404);
    successResponse(res, details, 'Payment details fetched successfully');
  } catch (error) {
    errorResponse(res, error.message, 500, error);
  }
};

module.exports = {
  getHistory,
  getDetails,
};
