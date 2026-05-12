const Joi = require('joi');

const updateDoctorProfileSchema = Joi.object({
  doctorName: Joi.string().min(3),
  qualification: Joi.string(),
  experienceYears: Joi.number().integer().min(0),
  consultationFee: Joi.number().min(0),
  followupFee: Joi.number().min(0),
  bio: Joi.string(),
  consultationType: Joi.string().valid('VIDEO', 'AUDIO', 'CHAT', 'IN_PERSON', 'INSTANT', 'FOLLOWUP'),
  specializationId: Joi.string(),
  hospitalId: Joi.string(),
});

const doctorScheduleSchema = Joi.object({
  dayOfWeek: Joi.number().integer().min(0).max(6).required(),
  startTime: Joi.string().regex(/^([0-9]{2}):([0-9]{2})$/).required(),
  endTime: Joi.string().regex(/^([0-9]{2}):([0-9]{2})$/).required(),
  slotDuration: Joi.number().integer().min(10).max(120).required(),
  breakStartTime: Joi.string().regex(/^([0-9]{2}):([0-9]{2})$/),
  breakEndTime: Joi.string().regex(/^([0-9]{2}):([0-9]{2})$/),
  maxPatients: Joi.number().integer().min(1),
});

module.exports = {
  updateDoctorProfileSchema,
  doctorScheduleSchema,
};
