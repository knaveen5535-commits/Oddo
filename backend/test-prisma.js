const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    const traveler = await prisma.user.upsert({
      where: { email: 'test@example.com' },
      update: {
        id: 'new-id-123',
        name: 'Test'
      },
      create: {
        id: 'new-id-123',
        email: 'test@example.com',
        name: 'Test',
        password: 'pass'
      }
    });
    console.log(traveler);
  } catch (e) {
    console.error(e);
  }
}
main();
