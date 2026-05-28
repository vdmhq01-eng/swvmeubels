import type { Role, Student } from '@/lib/types';

// RBAC + ABAC voor SWV Meubel portaal.
// RBAC: welke rollen mogen wat aanroepen.
// ABAC: extra controle op relatie (student van mij, lidbedrijf van mij, regio van mij).

export type Permission =
  | 'student:read:any'
  | 'student:read:self'
  | 'student:read:assigned'
  | 'student:read:companyScoped'
  | 'student:write:any'
  | 'timesheet:write:self'
  | 'timesheet:read:assigned'
  | 'timesheet:approve:companyScoped'
  | 'timesheet:approve:any'
  | 'document:read:self'
  | 'document:read:any'
  | 'document:upload:self'
  | 'document:upload:any'
  | 'integration:manage'
  | 'audit:read'
  | 'security:read';

export const rolePermissions: Record<Role, Permission[]> = {
  STUDENT: [
    'student:read:self',
    'timesheet:write:self',
    'document:read:self',
    'document:upload:self',
  ],
  COMPANY: [
    'student:read:companyScoped',
    'timesheet:read:assigned',
    'timesheet:approve:companyScoped',
    'document:read:any',
  ],
  COORDINATOR: [
    'student:read:assigned',
    'timesheet:read:assigned',
    'timesheet:approve:companyScoped',
    'document:read:any',
    'document:upload:any',
  ],
  ADMIN: [
    'student:read:any',
    'student:write:any',
    'timesheet:read:assigned',
    'timesheet:approve:any',
    'document:read:any',
    'document:upload:any',
    'integration:manage',
    'audit:read',
    'security:read',
  ],
};

export function hasPermission(role: Role, permission: Permission): boolean {
  return rolePermissions[role].includes(permission);
}

export type SessionContext = {
  userId: string;
  role: Role;
  regionId?: string;
  companyId?: string;
  coordinatorId?: string;
  studentId?: string; // alleen voor STUDENT
};

// Centrale ABAC check. Wordt aangeroepen door server actions, API routes en page-level guards.
export function canAccessStudent(ctx: SessionContext, student: Pick<Student, 'id' | 'regionId' | 'companyId' | 'coordinatorId'>): boolean {
  switch (ctx.role) {
    case 'ADMIN':
      return true;
    case 'COORDINATOR':
      return Boolean(ctx.coordinatorId && student.coordinatorId === ctx.coordinatorId);
    case 'COMPANY':
      return Boolean(ctx.companyId && student.companyId === ctx.companyId);
    case 'STUDENT':
      return ctx.studentId === student.id;
    default:
      return false;
  }
}

export function canApproveTimesheet(
  ctx: SessionContext,
  timesheet: { studentId: string },
  student: Pick<Student, 'companyId' | 'coordinatorId'>,
): boolean {
  if (ctx.role === 'ADMIN') return true;
  if (ctx.role === 'COMPANY') return student.companyId === ctx.companyId;
  if (ctx.role === 'COORDINATOR') return student.coordinatorId === ctx.coordinatorId;
  return false;
}

// Hulpmiddel: zet een werkbaar where-filter klaar voor Prisma op basis van rol.
// Voor STUDENT en COMPANY is dat smal; voor COORDINATOR ook smal; voor ADMIN open.
export function studentScopeFilter(ctx: SessionContext) {
  switch (ctx.role) {
    case 'ADMIN':
      return {};
    case 'COORDINATOR':
      return { coordinatorId: ctx.coordinatorId };
    case 'COMPANY':
      return { companyId: ctx.companyId };
    case 'STUDENT':
      return { id: ctx.studentId };
  }
}
