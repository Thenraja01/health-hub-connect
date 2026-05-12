const Joi = require('joi');

const userSchema = Joi.object({
  email: Joi.string().email().required(),
  name: Joi.string().min(3).max(30),
});

const validateUser = (data) => {
  return userSchema.validate(data);
};

module.exports = {
  validateUser,
};
