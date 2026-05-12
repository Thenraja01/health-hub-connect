const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkPatients() {
  const patients = await prisma.patient.findMany();
  console.log('Patients count:', patients.length);
  if (patients.length > 0) {
    console.log('Sample Patient:', JSON.stringify(patients[0], null, 2));
  }
  await prisma.$disconnect();
}

checkPatients();
