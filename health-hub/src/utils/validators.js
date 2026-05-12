/**
 * Common regex and validation functions
 */
const isValidEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

const isValidPhone = (phone) => {
  const re = /^\+?[1-9]\d{1,14}$/; // E.164 format
  return re.test(phone);
};

const isValidObjectId = (id) => {
  const re = /^[0-9a-fA-F]{24}$/;
  return re.test(id);
};

module.exports = {
  isValidEmail,
  isValidPhone,
  isValidObjectId,
};
