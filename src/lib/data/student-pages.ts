import { db } from '@/lib/db';
import { safe } from './safe';

/**
 * Lichte wrappers voor student-portal pagina's die direct uit de DB lezen.
 * Alle queries crashen NIET als de DB niet beschikbaar is.
 */

export async function getStudentBasic(studentId: string) {
  return safe(
    () =>
      db.student.findUnique({
        where: { id: studentId },
        include: { user: true, program: true, region: true },
      }),
    null,
  );
}

export async function getStudentWithCompany(studentId: string) {
  return safe(
    () =>
      db.student.findUnique({
        where: { id: studentId },
        include: {
          user: true,
          company: {
            include: {
              region: true,
              contacts: { include: { user: true }, where: { primary: true }, take: 1 },
            },
          },
        },
      }),
    null,
  );
}

export async function getCoordinatorWithUser(coordinatorId: string) {
  return safe(
    () =>
      db.coordinator.findUnique({
        where: { id: coordinatorId },
        include: { user: true, region: true },
      }),
    null,
  );
}

export async function getCompanyContact(companyId: string) {
  return safe(
    () =>
      db.companyContact.findFirst({
        where: { companyId },
        include: { user: true, company: true },
      }),
    null,
  );
}

export async function listContractsForStudent(studentId: string) {
  return safe(
    () =>
      db.contract.findMany({
        where: { studentId },
        include: { company: true },
        orderBy: { startDate: 'desc' },
      }),
    [] as never[],
  );
}

export async function listDocumentsForStudent(studentId: string, category?: string) {
  return safe(
    () =>
      db.document.findMany({
        where: { studentId, ...(category ? { category: category as 'CONTRACT' | 'LEGITIMATIE' | 'BEOORDELING' | 'BPV' | 'OVERIG' } : {}) },
        orderBy: { uploadedAt: 'desc' },
      }),
    [] as never[],
  );
}

export async function listAbsencesForStudent(studentId: string, type?: 'ZIEKTE' | 'VERLOF') {
  return safe(
    () =>
      db.absence.findMany({
        where: { studentId, ...(type ? { type } : {}) },
        orderBy: { startDate: 'desc' },
      }),
    [] as never[],
  );
}

export async function getHolidayBalance(studentId: string) {
  return safe(() => db.holidayBalance.findUnique({ where: { studentId } }), null);
}
