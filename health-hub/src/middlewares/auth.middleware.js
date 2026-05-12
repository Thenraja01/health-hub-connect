const { verifyToken } = require('../modules/auth/jwt.service');
const { errorResponse } = require('../utils/response');
const prisma = require('../config/database');

// Cache for user lookups (in-memory, should be moved to Redis in production)
const userCache = new Map();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

const getUserFromCache = (userId, role) => {
  const key = `${userId}:${role}`;
  const cached = userCache.get(key);
  
  if (cached && cached.expiry > Date.now()) {
    return cached.user;
  }
  
  userCache.delete(key);
  return null;
};

const setUserCache = (userId, role, user) => {
  const key = `${userId}:${role}`;
  userCache.set(key, {
    user,
    expiry: Date.now() + CACHE_TTL
  });
};

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      throw new Error('Authentication required');
    }

    const decoded = verifyToken(token);
    let user = null;

    // Check cache first
    user = getUserFromCache(decoded.id, decoded.role);

    // If not in cache, fetch from DB
    if (!user) {
      if (decoded.role === 'PATIENT') {
        user = await prisma.patient.findUnique({ where: { id: decoded.id } });
      } else if (decoded.role === 'DOCTOR') {
        user = await prisma.doctor.findUnique({ where: { id: decoded.id } });
      } else if (decoded.role === 'ADMIN') {
        user = await prisma.admin.findUnique({ where: { id: decoded.id } });
      }

      if (user) {
        setUserCache(decoded.id, decoded.role, user);
      }
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
