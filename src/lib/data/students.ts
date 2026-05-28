import { db } from '@/lib/db';
import type { SessionContext } from '@/lib/security/rbac';
import { studentScopeFilter } from '@/lib/security/rbac';

// Queries voor studenten. Alle reads passen automatisch de juiste
// scope-filter toe op basis van de sessierol (RBAC + ABAC).

export async function listStudents(ctx: SessionContext) {
  return db.student.findMany({
    where: studentScopeFilter(ctx),
    include: {
      user: { select: { name: true, email: true } },
      program: true,
      company: { select: { id: true, name: true, region: true } },
      coordinator: { include: { user: { select: { name: true } } } },
    },
    orderBy: { user: { name: 'asc' } },
  });
}

export async function getStudentByIdScoped(ctx: SessionContext, id: string) {
  const student = await db.student.findFirst({
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
  });
  return student;
}

export async function listStudentsForCompany(companyId: string) {
  return db.student.findMany({
    where: { companyId },
    include: {
      user: { select: { name: true, email: true } },
      program: true,
    },
    orderBy: { user: { name: 'asc' } },
  });
}
