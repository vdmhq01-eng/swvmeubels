import { db } from '@/lib/db';
import type { SessionContext } from '@/lib/security/rbac';

function studentScope(ctx: SessionContext) {
  if (ctx.role === 'COORDINATOR' && ctx.coordinatorId) return { coordinatorId: ctx.coordinatorId };
  if (ctx.role === 'COMPANY' && ctx.companyId) return { companyId: ctx.companyId };
  if (ctx.role === 'STUDENT' && ctx.studentId) return { id: ctx.studentId };
  return {};
}

export async function listContracts(ctx: SessionContext) {
  return db.contract.findMany({
    where: { student: studentScope(ctx) },
    include: { student: { include: { user: true } }, company: true },
    orderBy: { endDate: 'asc' },
  });
}

export async function listAbsences(ctx: SessionContext) {
  return db.absence.findMany({
    where: { student: studentScope(ctx) },
    include: { student: { include: { user: true } } },
    orderBy: { startDate: 'desc' },
  });
}

export async function listDocuments(filter: { studentId?: string; companyId?: string } = {}) {
  return db.document.findMany({
    where: filter,
    include: { student: { include: { user: true } } },
    orderBy: { uploadedAt: 'desc' },
  });
}

export async function listHolidayBalances(ctx: SessionContext) {
  return db.holidayBalance.findMany({
    where: { student: studentScope(ctx) },
    include: { student: { include: { user: true } } },
  });
}
