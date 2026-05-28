import { NextResponse } from 'next/server';
import { sickReportSchema } from '@/lib/validation';
import { audit } from '@/lib/security/audit';
import { absences } from '@/lib/mock/misc';

export async function GET() {
  return NextResponse.json({ absences });
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const parsed = sickReportSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Ongeldige melding', issues: parsed.error.issues }, { status: 400 });
  }

  await audit({
    actorUserId: 'mock-user',
    actorName: 'Mock Student',
    actorRole: 'STUDENT',
    action: 'weekstaat.ingediend', // ziektemeldingen apart loggen in productie
    objectType: 'Absence',
    objectId: 'new',
    context: { startDate: parsed.data.startDate },
  });

  return NextResponse.json({ ok: true, id: 'mock-' + Date.now() });
}
