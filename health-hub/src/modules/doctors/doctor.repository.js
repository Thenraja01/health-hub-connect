const BaseRepository = require('../../utils/base.repository');
const prisma = require('../../config/database');

class DoctorRepository extends BaseRepository {
  constructor() {
    super('doctor');
  }

  async findWithSpecialization(id) {
    return await this.model.findUnique({
      where: { id },
      include: {
        specialization: true,
        hospital: true,
        languages: true,
      },
    });
  }

  async update(id, data) {
    const { languages, ...otherData } = data;

    // Handle languages separately if provided
    if (languages) {
      await prisma.doctorLanguage.deleteMany({
        where: { doctorId: id }
      });
      
      await prisma.doctorLanguage.createMany({
        data: languages.map((l) => ({
          doctorId: id,
          language: l.language
        }))
      });
    }

    return await this.model.update({
      where: { id },
      data: otherData,
      include: {
        languages: true,
        specialization: true,
        hospital: true
      }
    });
  }

  async searchDoctors(filters = {}) {
    const { specializationId, city, consultationType, search, location } = filters;
    
    const where = {
      status: 'ACTIVE',
      AND: []
    };

    if (specializationId) where.AND.push({ specializationId });
    if (consultationType) where.AND.push({ consultationType });

    if (search) {
      where.AND.push({
        OR: [
          { doctorName: { contains: search, mode: 'insensitive' } },
          { specialization: { typeName: { contains: search, mode: 'insensitive' } } }
        ]
      });
    }

    if (location || city) {
      const locTerm = location || city;
      where.AND.push({
        OR: [
          { location: { contains: locTerm, mode: 'insensitive' } },
          { hospital: { city: { contains: locTerm, mode: 'insensitive' } } },
          { hospital: { state: { contains: locTerm, mode: 'insensitive' } } }
        ]
      });
    }

    if (where.AND.length === 0) delete where.AND;

    return await this.model.findMany({
      where,
      include: {
        specialization: true,
        hospital: true,
      },
    });
  }

  async getAllSpecialties() {
    const specialties = await prisma.doctorType.findMany({
      include: {
        _count: {
          select: { doctors: true }
        }
      }
    });
    
    return specialties.map(s => ({
      ...s,
      count: s._count.doctors
    }));
  }
}

module.exports = new DoctorRepository();
