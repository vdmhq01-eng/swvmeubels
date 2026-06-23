import { PrismaClient } from '@prisma/client';

declare global {
  // eslint-disable-next-line no-var
  var _prisma: PrismaClient | undefined;
}

/**
 * Bouwt de DATABASE_URL op uit:
 *  1. eigen DATABASE_URL (handmatig op Vercel)
 *  2. POSTGRES_PRISMA_URL (Vercel-Neon integratie, recommended)
 *  3. POSTGRES_URL (fallback van Vercel-Neon)
 * Voegt pgbouncer=true toe voor Neon pooled-connecties zodat Prisma geen
 * "prepared statement already exists" errors gooit met transaction-pooled mode.
 */
function getDatabaseUrl(): string {
  const raw =
    process.env.DATABASE_URL ||
    process.env.POSTGRES_PRISMA_URL ||
    process.env.POSTGRES_URL ||
    '';
  if (!raw) return '';
  if (raw.includes('pgbouncer=')) return raw;
  if (!raw.includes('-pooler.')) return raw;
  const sep = raw.includes('?') ? '&' : '?';
  return `${raw}${sep}pgbouncer=true&connect_timeout=15`;
}

const url = getDatabaseUrl();

export const db =
  globalThis._prisma ??
  new PrismaClient({
    datasources: url ? { db: { url } } : undefined,
    log: process.env.NODE_ENV === 'development' ? ['warn', 'error'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') {
  globalThis._prisma = db;
}
