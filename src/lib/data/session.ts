import type { Role } from '@/lib/types';
import type { SessionContext } from '@/lib/security/rbac';

// Tijdelijke "demo sessie" helper voor zolang er nog geen echte auth is.
// Geeft een sessiecontext terug die de RBAC/ABAC helpers verwachten.
// Wanneer NextAuth/Auth.js wordt toegevoegd vervang je deze functie door
// een echte getServerSession()-wrapper. De rest van de codebase blijft gelijk.

export function getDemoSession(role: Role): SessionContext {
  switch (role) {
    case 'STUDENT':
      return { userId: 'user-stu-001', role, studentId: 'stu-001', regionId: 'reg-noord' };
    case 'COORDINATOR':
      return { userId: 'user-coord-001', role, coordinatorId: 'coord-001', regionId: 'reg-noord' };
    case 'COMPANY':
      return { userId: 'user-bedr-001', role, companyId: 'comp-001' };
    case 'ADMIN':
      return { userId: 'user-adm-001', role };
  }
}
