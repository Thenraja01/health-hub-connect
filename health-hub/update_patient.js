const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function updatePatient() {
  await prisma.patient.update({
    where: { email: "then@gmail.com" },
    data: {
      gender: "Male",
      age: 28,
      bloodGroup: "O+",
      weight: 72,
      height: 175,
      allergies: "Peanuts",
      chronicDiseases: "None",
      city: "Chennai",
      state: "Tamil Nadu"
    }
  });
  console.log('Patient updated successfully');
  await prisma.$disconnect();
}

updatePatient();
