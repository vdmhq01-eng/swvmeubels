import { db } from '@/lib/db';
import { safe } from './safe';

export async function listAllUsers() {
  return safe(
    () =>
      db.user.findMany({
        include: { region: true },
        orderBy: [{ role: 'asc' }, { name: 'asc' }],
      }),
    [] as never[],
  );
}

export async function listRegions() {
  return safe(
    () =>
      db.region.findMany({
        include: {
          coordinators: { include: { user: true } },
          _count: { select: { students: true, companies: true } },
        },
        orderBy: { name: 'asc' },
      }),
    [] as never[],
  );
}

export async function listCoordinators() {
  return safe(
    () =>
      db.coordinator.findMany({
        include: { user: true, region: true, _count: { select: { students: true } } },
      }),
    [] as never[],
  );
}

export async function listIntegrations() {
  return safe(() => db.integration.findMany({ orderBy: { key: 'asc' } }), [] as never[]);
}

export async function listSyncLogs(limit = 50) {
  return safe(
    () => db.syncLog.findMany({ orderBy: { startedAt: 'desc' }, take: limit }),
    [] as never[],
  );
}

export async function listAuditLogs(limit = 100) {
  return safe(
    () => db.auditLog.findMany({ orderBy: { at: 'desc' }, take: limit }),
    [] as never[],
  );
}

export async function listSecurityLogs(limit = 100) {
  return safe(
    () => db.securityLog.findMany({ orderBy: { at: 'desc' }, take: limit }),
    [] as never[],
  );
}

export async function countAuditByAction(action: string, sinceHoursAgo: number) {
  return safe(async () => {
    const since = new Date(Date.now() - sinceHoursAgo * 3600_000);
    return db.auditLog.count({ where: { action, at: { gte: since } } });
  }, 0);
}
