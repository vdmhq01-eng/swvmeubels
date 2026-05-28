'use server';

import { revalidatePath } from 'next/cache';
import { sickReportSchema } from '@/lib/validation';
import { audit } from '@/lib/security/audit';

export async function reportSick(input: { studentId: string; startDate: string; note?: string }) {
  const parsed = sickReportSchema.parse(input);
  // Productie: write naar Absence (+ async naar Exact Synergy)
  await audit({
    actorUserId: 'session',
    actorName: 'session',
    actorRole: 'STUDENT',
    action: 'weekstaat.ingediend',
    objectType: 'Absence',
    objectId: 'new',
    context: { startDate: parsed.startDate },
  });
  revalidatePath('/student/verzuim');
  return { ok: true as const, absenceId: 'mock-' + Date.now() };
}

export async function reportBetter(absenceId: string, endDate: string) {
  // Productie: Absence.closedAt zetten + endDate, async naar Exact
  await audit({
    actorUserId: 'session',
    actorName: 'session',
    actorRole: 'STUDENT',
    action: 'weekstaat.ingediend',
    objectType: 'Absence',
    objectId: absenceId,
    context: { endDate },
  });
  revalidatePath('/student/verzuim');
  return { ok: true as const };
}
