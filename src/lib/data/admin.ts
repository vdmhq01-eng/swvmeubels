import { db } from '@/lib/db';

export async function listAllUsers() {
  return db.user.findMany({
    include: { region: true },
    orderBy: [{ role: 'asc' }, { name: 'asc' }],
  });
}

export async function listRegions() {
  return db.region.findMany({
    include: {
      coordinators: { include: { user: true } },
      _count: { select: { students: true, companies: true } },
    },
    orderBy: { name: 'asc' },
  });
}

export async function listCoordinators() {
  return db.coordinator.findMany({
    include: { user: true, region: true, _count: { select: { students: true } } },
  });
}

export async function listIntegrations() {
  return db.integration.findMany({ orderBy: { key: 'asc' } });
}

export async function listSyncLogs(limit = 50) {
  return db.syncLog.findMany({
    orderBy: { startedAt: 'desc' },
    take: limit,
  });
}

export async function listAuditLogs(limit = 100) {
  return db.auditLog.findMany({
    orderBy: { at: 'desc' },
    take: limit,
  });
}

export async function listSecurityLogs(limit = 100) {
  return db.securityLog.findMany({
    orderBy: { at: 'desc' },
    take: limit,
  });
}

export async function countAuditByAction(action: string, sinceHoursAgo: number) {
  const since = new Date(Date.now() - sinceHoursAgo * 3600_000);
  return db.auditLog.count({ where: { action, at: { gte: since } } });
}
