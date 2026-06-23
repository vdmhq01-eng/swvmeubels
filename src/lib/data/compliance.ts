import { db } from '@/lib/db';
import type { SessionContext } from '@/lib/security/rbac';
import { safe } from './safe';

function studentScope(ctx: SessionContext) {
  if (ctx.role === 'COORDINATOR' && ctx.coordinatorId) return { coordinatorId: ctx.coordinatorId };
  if (ctx.role === 'COMPANY' && ctx.companyId) return { companyId: ctx.companyId };
  if (ctx.role === 'STUDENT' && ctx.studentId) return { id: ctx.studentId };
  return {};
}

export async function listContracts(ctx: SessionContext) {
  return safe(
    () =>
      db.contract.findMany({
        where: { student: studentScope(ctx) },
        include: { student: { include: { user: true } }, company: true },
        orderBy: { endDate: 'asc' },
      }),
    [] as never[],
  );
}

export async function listAbsences(ctx: SessionContext) {
  return safe(
    () =>
      db.absence.findMany({
        where: { student: studentScope(ctx) },
        include: { student: { include: { user: true } } },
        orderBy: { startDate: 'desc' },
      }),
    [] as never[],
  );
}

export async function listDocuments(filter: { studentId?: string; companyId?: string } = {}) {
  return safe(
    () =>
      db.document.findMany({
        where: filter,
        include: { student: { include: { user: true } } },
        orderBy: { uploadedAt: 'desc' },
      }),
    [] as never[],
  );
}

export async function listHolidayBalances(ctx: SessionContext) {
  return safe(
    () =>
      db.holidayBalance.findMany({
        where: { student: studentScope(ctx) },
        include: { student: { include: { user: true } } },
      }),
    [] as never[],
  );
}
