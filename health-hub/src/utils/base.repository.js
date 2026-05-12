const prisma = require('../config/database');

class BaseRepository {
  constructor(modelName) {
    this.model = prisma[modelName];
  }

  async findAll(options = {}) {
    return await this.model.findMany(options);
  }

  async findById(id, options = {}) {
    return await this.model.findUnique({
      where: { id },
      ...options,
    });
  }

  async findOne(where, options = {}) {
    return await this.model.findFirst({
      where,
      ...options,
    });
  }

  async create(data) {
    return await this.model.create({ data });
  }

  async update(id, data) {
   
    const sanitizedData = { ...data };
    const fieldsToRemove = ['id', 'createdAt', 'updatedAt', 'deletedAt'];
    fieldsToRemove.forEach(field => delete sanitizedData[field]);
    Object.keys(sanitizedData).forEach(key => {
      if (sanitizedData[key] && typeof sanitizedData[key] === 'object' && !(sanitizedData[key] instanceof Date)) {
        delete sanitizedData[key];
      }
    });

    return await this.model.update({
      where: { id },
      data: sanitizedData,
    });
  }

  async delete(id) {
    return await this.model.update({
      where: { id },
      data: { deletedAt: new Date(), status: 'DELETED' }, // Soft delete pattern
    });
  }

  async count(where = {}) {
    return await this.model.count({ where });
  }
}

module.exports = BaseRepository;
