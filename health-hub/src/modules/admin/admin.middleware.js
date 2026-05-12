const prisma = require('../../config/database');
const logger = require('../../config/logger');

/**
 * Middleware to log admin actions to the AuditLog table
 */
const auditLog = (module) => {
  return async (req, res, next) => {
    const originalJson = res.json;
    
    res.json = function (data) {
      res.locals.body = data;
      return originalJson.apply(res, arguments);
    };

    res.on('finish', async () => {
      if (res.statusCode >= 200 && res.statusCode < 300 && ['POST', 'PUT', 'DELETE', 'PATCH'].includes(req.method)) {
        try {
          await prisma.auditLog.create({
            data: {
              userId: req.user?.id,
              action: `${req.method} ${req.originalUrl}`,
              module: module,
              ipAddress: req.ip,
              userAgent: req.get('user-agent'),
            },
          });
        } catch (error) {
          logger.error('Failed to create audit log:', error);
        }
      }
    });
    
    next();
  };
};

module.exports = { auditLog };
