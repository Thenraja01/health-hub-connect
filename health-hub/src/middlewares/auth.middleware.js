const { verifyToken } = require('../modules/auth/jwt.service');
const { errorResponse } = require('../utils/response');
const prisma = require('../config/database');

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      throw new Error('Authentication required');
    }

    const decoded = verifyToken(token);
    let user = null;

    if (decoded.role === 'PATIENT') {
      user = await prisma.patient.findUnique({ where: { id: decoded.id } });
    } else if (decoded.role === 'DOCTOR') {
      user = await prisma.doctor.findUnique({ where: { id: decoded.id } });
    } else if (decoded.role === 'ADMIN') {
      user = await prisma.admin.findUnique({ where: { id: decoded.id } });
    }

    if (!user || user.status !== 'ACTIVE') {
      throw new Error('User not found or inactive');
    }

    req.user = user;
    req.role = decoded.role;
    req.token = token;
    next();
  } catch (error) {
    errorResponse(res, 'Please authenticate', 401, error);
  }
};

module.exports = auth;
