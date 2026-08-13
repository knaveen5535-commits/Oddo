const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    const traveler = await prisma.user.upsert({
      where: { email: 'test@example.com' },
      update: {
        id: 'different-id-456',
      },
      create: {
        id: 'different-id-456',
        email: 'test@example.com',
        name: 'Test',
        password: 'pass'
      }
    });
    console.log(traveler);
  } catch (e) {
    console.error(e.message);
  }
}
main();
