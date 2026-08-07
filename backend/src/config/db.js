const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});

const connectDB = async () => {
  try {
    await prisma.$connect();
    console.log('PostgreSQL Database connected via Prisma');
  } catch (error) {
    console.warn('Database connection error (server will run without DB):', error.message);
  }
};

module.exports = { prisma, connectDB };
