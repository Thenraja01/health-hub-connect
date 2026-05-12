const logger = require('../config/logger');
const { errorResponse } = require('../utils/response');

const errorHandler = (err, req, res, next) => {
  logger.error(`${err.status || 500} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
  
  // Prisma specific errors
  if (err.code === 'P2002') {
    return errorResponse(res, 'Unique constraint failed on the database', 400, err);
  }
  
  if (err.code === 'P2025') {
    return errorResponse(res, 'Record not found', 404, err);
  }

  const statusCode = err.status || 500;
  const message = err.message || 'Internal Server Error';

  errorResponse(res, message, statusCode, err);
};

module.exports = errorHandler;
