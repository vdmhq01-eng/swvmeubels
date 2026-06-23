import { db } from '@/lib/db';
import type { SessionContext } from '@/lib/security/rbac';
import { safe } from './safe';

export async function getTimesheetsForStudent(studentId: string, limit = 10) {
  return safe(
    () =>
      db.timesheet.findMany({
        where: { studentId },
        orderBy: [{ year: 'desc' }, { weekNumber: 'desc' }],
        take: limit,
        include: { entries: true },
      }),
    [] as never[],
  );
}

export async function getCurrentWeekTimesheet(studentId: string) {
  return safe(
    () =>
      db.timesheet.findFirst({
        where: { studentId },
        orderBy: [{ year: 'desc' }, { weekNumber: 'desc' }],
        include: { entries: { orderBy: { date: 'asc' } } },
      }),
    null,
  );
}

export async function getPendingApprovals(ctx: SessionContext) {
  return safe(async () => {
    const studentFilter =
      ctx.role === 'COMPANY' && ctx.companyId
        ? { companyId: ctx.companyId }
        : ctx.role === 'COORDINATOR' && ctx.coordinatorId
        ? { coordinatorId: ctx.coordinatorId }
        : {};
    return db.timesheet.findMany({
      where: { status: 'INGEDIEND', student: studentFilter },
      include: {
        student: { include: { user: true, company: true } },
        entries: { orderBy: { date: 'asc' } },
      },
      orderBy: { submittedAt: 'desc' },
    });
  }, [] as never[]);
}

export async function getRecentWeekStatsForCompany(companyId: string) {
  return safe(
    () =>
      db.timesheet.findMany({
        where: { student: { companyId } },
        orderBy: [{ year: 'desc' }, { weekNumber: 'desc' }],
        take: 30,
        include: { student: { include: { user: true } }, entries: true },
      }),
    [] as never[],
  );
}

export function decimalToNumber(value: unknown): number {
  if (value && typeof value === 'object' && 'toNumber' in value) {
    return (value as { toNumber: () => number }).toNumber();
  }
  return Number(value ?? 0);
}

export function sumEntries(entries: { type: string; hours: unknown }[]) {
  const t = { PRAKTIJK: 0, SCHOOL: 0, ZIEKTE: 0, VERLOF: 0, AFWEZIG: 0 };
  for (const e of entries) {
    const h = decimalToNumber(e.hours);
    if (e.type in t) (t as Record<string, number>)[e.type] += h;
  }
  const totaal = t.PRAKTIJK + t.SCHOOL + t.ZIEKTE + t.VERLOF + t.AFWEZIG;
  return { ...t, totaal, ontbrekend: Math.max(0, 38 - totaal) };
}
