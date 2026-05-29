import { db } from '@/lib/db';

export async function listCompanies(regionId?: string) {
  return db.company.findMany({
    where: regionId ? { regionId } : undefined,
    include: {
      region: true,
      contacts: { include: { user: true }, where: { primary: true }, take: 1 },
      _count: { select: { students: true } },
    },
    orderBy: { name: 'asc' },
  });
}

export async function getCompanyById(id: string) {
  return db.company.findUnique({
    where: { id },
    include: {
      region: true,
      contacts: { include: { user: true } },
      students: { include: { user: true, program: true } },
      contracts: { include: { student: { include: { user: true } } } },
    },
  });
}
