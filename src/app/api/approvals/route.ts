import { NextResponse } from 'next/server';
import { approvalSchema } from '@/lib/validation';
import { audit } from '@/lib/security/audit';

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const parsed = approvalSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Ongeldige goedkeuring', issues: parsed.error.issues }, { status: 400 });
  }

  // Productie:
  // 1. ABAC: alleen eigen leerbedrijf/regio mag (zie canApproveTimesheet)
  // 2. Cleverdesk write voor approval
  // 3. AuditLog + notification voor student

  await audit({
    actorUserId: 'mock-user',
    actorName: 'Mock Approver',
    actorRole: 'COMPANY',
    action: parsed.data.decision === 'GOEDGEKEURD' ? 'weekstaat.goedgekeurd' : 'weekstaat.afgekeurd',
    objectType: 'Timesheet',
    objectId: parsed.data.timesheetId,
    context: parsed.data.reason ? { reden: parsed.data.reason } : undefined,
  });

  return NextResponse.json({ ok: true });
}
