import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const password = await bcrypt.hash('password123', 10);

  // 1. Create Admin
  const admin = await prisma.admin.create({
    data: {
      name: 'System Admin',
      email: 'admin@healthhub.com',
      password: password,
      role: 'SUPER_ADMIN',
    },
  });

  // 2. Create Hospital
  const hospital = await prisma.hospital.create({
    data: {
      hospitalName: 'City General Hospital',
      city: 'Bengaluru',
      state: 'Karnataka',
      status: 'ACTIVE',
    },
  });

  // 3. Create Doctor Type
  const docType = await prisma.doctorType.create({
    data: {
      typeName: 'Cardiologist',
      description: 'Heart specialist',
    },
  });

  // 4. Create Doctor
  const doctor = await prisma.doctor.create({
    data: {
      doctorName: 'Dr. John Doe',
      email: 'doctor@healthhub.com',
      phone: '9876543210',
      password: password,
      consultationFee: 500,
      consultationType: 'VIDEO',
      specializationId: docType.id,
      hospitalId: hospital.id,
    },
  });

  // 5. Create Patient
  const patient = await prisma.patient.create({
    data: {
      fullName: 'Jane Smith',
      email: 'patient@healthhub.com',
      phone: '1234567890',
      password: password,
      patientCode: 'PHH-1001',
    },
  });

  console.log('Seed data created successfully');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
