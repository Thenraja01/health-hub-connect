const BaseRepository = require('../../utils/base.repository');

class AppointmentRepository extends BaseRepository {
  constructor() {
    super('appointment');
  }

  async findByPatient(patientId) {
    return await this.model.findMany({
      where: { patientId },
      include: { doctor: true, slot: true },
      orderBy: { startsAt: 'desc' },
    });
  }

  async findByDoctor(doctorId) {
    return await this.model.findMany({
      where: { doctorId },
      include: { patient: true, slot: true, prescription: true },
      orderBy: { startsAt: 'asc' },
    });
  }
}

module.exports = new AppointmentRepository();
