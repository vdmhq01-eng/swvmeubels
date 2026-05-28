import { NextResponse } from 'next/server';
import { students } from '@/lib/mock/students';

// GET /api/students?coordinatorId=&companyId=
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const coordId = searchParams.get('coordinatorId');
  const compId = searchParams.get('companyId');
  // In productie: studentScopeFilter(ctx) toepassen op Prisma where
  let list = students;
  if (coordId) list = list.filter((s) => s.coordinatorId === coordId);
  if (compId) list = list.filter((s) => s.companyId === compId);
  // Geen geboortedatum of BSN in API response - dataminimalisatie
  const safe = list.map(({ birthDate: _bd, ...rest }) => rest);
  return NextResponse.json({ students: safe });
}
