import { PrismaClient } from '@prisma/client';

// Singleton Prisma client. In dev hergebruiken we de instance om "too many clients"
// errors te voorkomen bij hot reload. In productie elke instance is fine.
declare global {
  // eslint-disable-next-line no-var
  var _prisma: PrismaClient | undefined;
}

export const db =
  globalThis._prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['warn', 'error'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') {
  globalThis._prisma = db;
}
