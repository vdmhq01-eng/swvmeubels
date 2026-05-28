import { NextResponse } from 'next/server';
import { audit } from '@/lib/security/audit';

export async function POST() {
  await audit({
    actorUserId: 'mock-admin',
    actorName: 'Mock Admin',
    actorRole: 'ADMIN',
    action: 'integratie.resync_gestart',
    objectType: 'Integration',
    objectId: 'CLEVERDESK',
  });
  return NextResponse.json({ ok: true, jobId: 'sync-cd-' + Date.now() });
}
