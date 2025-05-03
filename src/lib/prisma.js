// src/lib/prisma.js
import { PrismaClient } from '@prisma/client';

let prisma;

if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient();
} else {
  // Ensure the prisma instance is re-used during hot-reloading
  // Prevents exhausting database connection limit in development.
  if (!global.prisma) {
    global.prisma = new PrismaClient({
      // Optional: Add logging in development
      // log: ['query', 'info', 'warn', 'error'],
    });
  }
  prisma = global.prisma;
}

export default prisma;