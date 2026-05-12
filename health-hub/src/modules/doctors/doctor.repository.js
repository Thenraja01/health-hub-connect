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
    const { specializationId, city, consultationType } = filters;
    return await this.model.findMany({
      where: {
        status: 'ACTIVE',
        specializationId,
        consultationType,
        hospital: city ? { city } : undefined,
      },
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
