const Joi = require('joi');

const hospitalSchema = Joi.object({
  hospitalName: Joi.string().min(3).required(),
  hospitalType: Joi.string(),
  address: Joi.string(),
  city: Joi.string().required(),
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
  hospitalSchema,
};
