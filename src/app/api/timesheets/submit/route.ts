import { NextResponse } from 'next/server';
import { weeksheetSubmitSchema } from '@/lib/validation';
import { audit } from '@/lib/security/audit';

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const parsed = weeksheetSubmitSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Ongeldige weekstaat', issues: parsed.error.issues }, { status: 400 });
  }

  // Productie:
  // 1. ABAC: alleen eigen weekstaat mogen indienen
  // 2. Status update naar CONCEPT of INGEDIEND
  // 3. Schrijven naar Cleverdesk met idempotency-key
  // 4. AuditLog entry

  await audit({
    actorUserId: 'mock-user',
    actorName: 'Mock User',
    actorRole: 'STUDENT',
    action: 'weekstaat.ingediend',
    objectType: 'Timesheet',
    objectId: parsed.data.timesheetId,
  });

  return NextResponse.json({ ok: true, status: parsed.data.asConcept ? 'CONCEPT' : 'INGEDIEND' });
}
