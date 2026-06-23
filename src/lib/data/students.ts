import { db } from '@/lib/db';
import type { SessionContext } from '@/lib/security/rbac';
import { studentScopeFilter } from '@/lib/security/rbac';
import { safe } from './safe';

export async function listStudents(ctx: SessionContext) {
  return safe(
    () =>
      db.student.findMany({
        where: studentScopeFilter(ctx),
        include: {
          user: { select: { name: true, email: true } },
          program: true,
          company: { select: { id: true, name: true, region: true } },
          coordinator: { include: { user: { select: { name: true } } } },
        },
        orderBy: { user: { name: 'asc' } },
      }),
    [] as never[],
  );
}

export async function getStudentByIdScoped(ctx: SessionContext, id: string) {
  return safe(
    () =>
      db.student.findFirst({
        where: { id, ...studentScopeFilter(ctx) },
        include: {
          user: true,
          program: true,
          region: true,
          company: true,
          coordinator: { include: { user: true } },
          contracts: { orderBy: { startDate: 'desc' } },
          absences: { orderBy: { startDate: 'desc' } },
          holidayBalance: true,
          documents: { orderBy: { uploadedAt: 'desc' } },
          tasks: { orderBy: { dueDate: 'asc' } },
        },
      }),
    null,
  );
}

export async function listStudentsForCompany(companyId: string) {
  return safe(
    () =>
      db.student.findMany({
        where: { companyId },
        include: {
          user: { select: { name: true, email: true } },
          program: true,
        },
        orderBy: { user: { name: 'asc' } },
      }),
    [] as never[],
  );
}
