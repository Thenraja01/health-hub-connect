const Joi = require('joi');

const registerPatientSchema = Joi.object({
  fullName: Joi.string().min(3).required(),
  email: Joi.string().email().required(),
  phone: Joi.string().min(10).required(),
  password: Joi.string().min(6).required(),
  gender: Joi.string().valid('MALE', 'FEMALE', 'OTHER'),
  dob: Joi.date(),
  bloodGroup: Joi.string(),
});

const updatePatientSchema = Joi.object({
  fullName: Joi.string().min(3),
  phone: Joi.string().min(10),
  gender: Joi.string().valid('MALE', 'FEMALE', 'OTHER'),
  dob: Joi.date(),
  bloodGroup: Joi.string(),
  weight: Joi.number(),
  height: Joi.number(),
  allergies: Joi.string(),
  chronicDiseases: Joi.string(),
  address: Joi.string(),
  city: Joi.string(),
  state: Joi.string(),
  pincode: Joi.string(),
  emergencyContactName: Joi.string(),
  emergencyContactPhone: Joi.string(),
});

module.exports = {
  registerPatientSchema,
  updatePatientSchema,
};
