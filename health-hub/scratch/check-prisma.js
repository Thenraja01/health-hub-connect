const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Models in prisma:', Object.keys(prisma).filter(k => !k.startsWith('_')));
  try {
    console.log('Testing prisma.oTP...');
    await prisma.oTP.findMany();
    console.log('prisma.oTP works');
  } catch (e) {
    console.log('prisma.oTP failed:', e.message);
  }
  
  try {
    console.log('Testing prisma.otp...');
    await prisma.otp.findMany();
    console.log('prisma.otp works');
  } catch (e) {
    console.log('prisma.otp failed:', e.message);
  }
}

main().finally(() => prisma.$disconnect());
