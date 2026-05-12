const Joi = require('joi');

const updateDoctorStatusSchema = Joi.object({
  doctorId: Joi.string().required(),
  status: Joi.string().valid('ACTIVE', 'INACTIVE', 'BLOCKED', 'DELETED').required(),
});

const createHospitalSchema = Joi.object({
  hospitalName: Joi.string().required(),
  hospitalType: Joi.string(),
  address: Joi.string(),
  city: Joi.string(),
  state: Joi.string(),
  country: Joi.string(),
  pincode: Joi.string(),
  latitude: Joi.number(),
  longitude: Joi.number(),
  contactNumber: Joi.string(),
  email: Joi.string().email(),
  openingTime: Joi.string(),
  closingTime: Joi.string(),
});

module.exports = {
  updateDoctorStatusSchema,
  createHospitalSchema,
};
