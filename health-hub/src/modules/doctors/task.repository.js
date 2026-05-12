const BaseRepository = require('../../utils/base.repository');

class TaskRepository extends BaseRepository {
  constructor() {
    super('task');
  }

  async findByDoctor(doctorId) {
    return await this.model.findMany({
      where: { doctorId },
      orderBy: { createdAt: 'desc' }
    });
  }
}

module.exports = new TaskRepository();
