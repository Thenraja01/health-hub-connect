const Joi = require('joi');

const bookAppointmentSchema = Joi.object({
  doctorId: Joi.string().required(),
  slotId: Joi.string().required(),
  consultationType: Joi.string().valid('VIDEO', 'AUDIO', 'CHAT', 'IN_PERSON', 'INSTANT', 'FOLLOWUP').required(),
  symptoms: Joi.string(),
  notes: Joi.string(),
});

const updateAppointmentStatusSchema = Joi.object({
  status: Joi.string().valid('PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED', 'RESCHEDULED', 'MISSED').required(),
});

module.exports = {
  bookAppointmentSchema,
  updateAppointmentStatusSchema,
};
