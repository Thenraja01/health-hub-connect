const patientRepository = require('./patient.repository');
const { hashPassword } = require('../auth/password.service');

const registerPatient = async (data) => {
  const hashedPassword = await hashPassword(data.password);
  
  // Generate a unique patient code
  const patientCount = await patientRepository.count();
  const patientCode = `PHH-${(patientCount + 1000).toString()}`;

  return await patientRepository.create({
    ...data,
    password: hashedPassword,
    patientCode,
  });
};

const getPatientProfile = async (id) => {
  return await patientRepository.findWithHistory(id);
};

const updatePatientProfile = async (id, data) => {
  return await patientRepository.update(id, data);
};

module.exports = {
  registerPatient,
  getPatientProfile,
  updatePatientProfile,
};
