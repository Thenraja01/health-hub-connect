const BaseRepository = require('../../utils/base.repository');

class HospitalRepository extends BaseRepository {
  constructor() {
    super('hospital');
  }

  async findWithDoctors(id) {
    return await this.model.findUnique({
      where: { id },
      include: { doctors: true },
    });
  }
}

module.exports = new HospitalRepository();
