const hospitalRepository = require('./hospital.repository');

const getAllHospitals = async () => {
  return await hospitalRepository.findAll({ where: { status: 'ACTIVE' } });
};

const getHospitalById = async (id) => {
  return await hospitalRepository.findWithDoctors(id);
};

const createHospital = async (data) => {
  return await hospitalRepository.create(data);
};

const updateHospital = async (id, data) => {
  return await hospitalRepository.update(id, data);
};

module.exports = {
  getAllHospitals,
  getHospitalById,
  createHospital,
  updateHospital,
};
