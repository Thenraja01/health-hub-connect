const BaseRepository = require('../../utils/base.repository');

class PatientRepository extends BaseRepository {
  constructor() {
    super('patient');
  }

  async findWithHistory(id) {
    return await this.model.findUnique({
      where: { id },
      include: {
        appointments: {
          include: { doctor: true },
          orderBy: { startsAt: 'desc' },
        },
        prescriptions: true,
        wellnessReports: true,
      },
    });
  }
}

module.exports = new PatientRepository();
