const CryptoJS = require('crypto-js');
const { JWT_SECRET } = require('../config/env');

const encrypt = (text) => {
  return CryptoJS.AES.encrypt(text, JWT_SECRET).toString();
};

const decrypt = (hash) => {
  const bytes = CryptoJS.AES.decrypt(hash, JWT_SECRET);
  return bytes.toString(CryptoJS.enc.Utf8);
};

module.exports = {
  encrypt,
  decrypt,
};
