/**
 * Standard API Response format
 */
const successResponse = (res, data, message = 'Success', statusCode = 200) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};

const errorResponse = (res, message = 'Internal Server Error', statusCode = 500, error = null) => {
  return res.status(statusCode).json({
    success: false,
    message,
    error: error ? error.message || error : null,
    stack: process.env.NODE_ENV === 'development' ? (error ? error.stack : null) : null,
  });
};

module.exports = {
  successResponse,
  errorResponse,
};
