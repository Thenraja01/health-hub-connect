const { errorResponse } = require('../utils/response');

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.role)) {
      return errorResponse(res, `Role ${req.role} is not authorized to access this route`, 403);
    }
    next();
  };
};

module.exports = authorize;
