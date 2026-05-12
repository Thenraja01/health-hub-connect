require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const errorHandler = require('./middlewares/error.middleware');
const logger = require('./config/logger');

const app = express();

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN || process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}));

// Webhook route needs raw body for Stripe signature verification
const stripeController = require('./modules/payments/stripe.controller');
app.post('/api/payments/webhook', express.raw({type: 'application/json'}), stripeController.handleWebhook);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('combined', { stream: { write: (message) => logger.info(message.trim()) } }));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});
app.use('/api/', limiter);

// Root Route - API Information
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to Health Hub API',
    version: '1.0.0',
    status: 'Running',
    endpoints: {
      auth: '/api/auth',
      admin: '/api/admin',
      patients: '/api/patients',
      doctors: '/api/doctors',
      appointments: '/api/appointments',
      payments: '/api/payments',
      hospitals: '/api/hospitals',
      prescriptions: '/api/prescriptions',
      notifications: '/api/notifications',
      reviews: '/api/reviews',
      wellness: '/api/wellness',
      analytics: '/api/analytics'
    },
    documentation: '/docs/api-docs.md'
  });
});

// Import Routes
const authRoutes = require('./modules/auth/auth.routes');
const doctorRoutes = require('./modules/doctors/doctor.routes');
const patientRoutes = require('./modules/patients/patient.routes');
const appointmentRoutes = require('./modules/appointments/appointment.routes');
const adminRoutes = require('./modules/admin/admin.routes');
const hospitalRoutes = require('./modules/hospitals/hospital.routes');
const notificationRoutes = require('./modules/notifications/notification.routes');
const prescriptionRoutes = require('./modules/prescriptions/prescription.routes');
const reviewRoutes = require('./modules/reviews/review.routes');
const paymentRoutes = require('./modules/payments/payment.routes');

app.use('/api/auth', authRoutes);
app.use('/api/doctors', doctorRoutes);
app.use('/api/patients', patientRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/hospitals', hospitalRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/prescriptions', prescriptionRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/payments', paymentRoutes);

// Error Handling
app.use(errorHandler);

module.exports = app;
