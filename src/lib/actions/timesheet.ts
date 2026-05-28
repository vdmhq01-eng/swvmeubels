'use server';

import { revalidatePath } from 'next/cache';
import { weeksheetSubmitSchema, approvalSchema, type WeeksheetSubmitInput, type ApprovalInput } from '@/lib/validation';
import { audit } from '@/lib/security/audit';

// Server actions voor weekstaten. Worden vanuit forms/buttons aangeroepen.
// In productie: ABAC-check, schrijven naar Cleverdesk met idempotency, revalidate.

export async function submitWeeksheet(input: WeeksheetSubmitInput) {
  const parsed = weeksheetSubmitSchema.parse(input);
  await audit({
    actorUserId: 'session',
    actorName: 'session',
    actorRole: 'STUDENT',
    action: 'weekstaat.ingediend',
    objectType: 'Timesheet',
    objectId: parsed.timesheetId,
  });
  revalidatePath('/student/uren');
  return { ok: true as const, status: parsed.asConcept ? 'CONCEPT' : 'INGEDIEND' };
}

export async function decideOnWeeksheet(input: ApprovalInput) {
  const parsed = approvalSchema.parse(input);
  await audit({
    actorUserId: 'session',
    actorName: 'session',
    actorRole: 'COMPANY',
    action: parsed.decision === 'GOEDGEKEURD' ? 'weekstaat.goedgekeurd' : 'weekstaat.afgekeurd',
    objectType: 'Timesheet',
    objectId: parsed.timesheetId,
    context: parsed.reason ? { reden: parsed.reason } : undefined,
  });
  revalidatePath('/lidbedrijf/goedkeuren');
  revalidatePath('/coordinator/goedkeuringen');
  return { ok: true as const };
}
