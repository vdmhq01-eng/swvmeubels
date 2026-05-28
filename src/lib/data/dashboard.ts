import { db } from '@/lib/db';
import type { SessionContext } from '@/lib/security/rbac';
import { studentScopeFilter } from '@/lib/security/rbac';

export async function getStudentDashboard(ctx: SessionContext) {
  if (!ctx.studentId) return null;
  const [student, currentWeek, openTasks, recentMessages, planning] = await Promise.all([
    db.student.findUnique({
      where: { id: ctx.studentId },
      include: {
        user: true,
        program: true,
        region: true,
        company: { include: { contacts: { include: { user: true }, where: { primary: true }, take: 1 } } },
        coordinator: { include: { user: true } },
        contracts: { where: { status: { in: ['ACTIEF', 'AFLOPEND'] } }, orderBy: { startDate: 'desc' }, take: 1 },
        holidayBalance: true,
        absences: { where: { closedAt: null } },
      },
    }),
    db.timesheet.findFirst({
      where: { studentId: ctx.studentId },
      orderBy: [{ year: 'desc' }, { weekNumber: 'desc' }],
      include: { entries: true },
    }),
    db.task.findMany({
      where: { studentId: ctx.studentId, status: 'OPEN' },
      orderBy: { dueDate: 'asc' },
      take: 5,
    }),
    db.message.findMany({
      where: { toUserId: ctx.userId },
      orderBy: { sentAt: 'desc' },
      take: 3,
      include: { fromUser: { select: { name: true } } },
    }),
    db.planningItem.findMany({
      where: { startDate: { gte: new Date() } },
      orderBy: { startDate: 'asc' },
      take: 4,
    }),
  ]);

  return { student, currentWeek, openTasks, recentMessages, planning };
}

export async function getCoordinatorDashboard(ctx: SessionContext) {
  if (!ctx.coordinatorId) return null;
  const [students, aflopend, diplomaKandidaten, planning, companies, openVerzuim] = await Promise.all([
    db.student.findMany({
      where: { coordinatorId: ctx.coordinatorId },
      include: { user: true, program: true },
      orderBy: { user: { name: 'asc' } },
      take: 5,
    }),
    db.contract.count({ where: { status: 'AFLOPEND', student: { coordinatorId: ctx.coordinatorId } } }),
    db.student.count({ where: { coordinatorId: ctx.coordinatorId, yearOfStudy: 3 } }),
    db.planningItem.findMany({
      where: { startDate: { gte: new Date() } },
      orderBy: { startDate: 'asc' },
      take: 5,
    }),
    ctx.regionId
      ? db.company.findMany({
          where: { regionId: ctx.regionId },
          include: { _count: { select: { students: true } } },
          take: 5,
        })
      : Promise.resolve([]),
    db.absence.count({
      where: { closedAt: null, student: { coordinatorId: ctx.coordinatorId } },
    }),
  ]);

  const totalStudents = await db.student.count({ where: { coordinatorId: ctx.coordinatorId } });

  return { students, aflopend, diplomaKandidaten, planning, companies, openVerzuim, totalStudents };
}

export async function getCompanyDashboard(ctx: SessionContext) {
  if (!ctx.companyId) return null;
  const [studentCount, pending, openVerzuim, students] = await Promise.all([
    db.student.count({ where: { companyId: ctx.companyId } }),
    db.timesheet.findMany({
      where: { status: 'INGEDIEND', student: { companyId: ctx.companyId } },
      include: { student: { include: { user: true, company: true } }, entries: true },
      orderBy: { submittedAt: 'desc' },
    }),
    db.absence.count({
      where: { closedAt: null, student: { companyId: ctx.companyId } },
    }),
    db.student.findMany({
      where: { companyId: ctx.companyId },
      include: { user: true, program: true },
    }),
  ]);
  return { studentCount, pending, openVerzuim, students };
}

export async function getAdminDashboardData() {
  const [integrations, recentAudit, recentSyncErrors] = await Promise.all([
    db.integration.findMany({ orderBy: { key: 'asc' } }),
    db.auditLog.findMany({ orderBy: { at: 'desc' }, take: 5 }),
    db.syncLog.findMany({ where: { status: 'FOUT' }, orderBy: { startedAt: 'desc' }, take: 10 }),
  ]);
  return { integrations, recentAudit, recentSyncErrors };
}
