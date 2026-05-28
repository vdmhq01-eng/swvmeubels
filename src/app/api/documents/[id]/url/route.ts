import { NextResponse } from 'next/server';
import { audit } from '@/lib/security/audit';

// GET /api/documents/:id/url - levert tijdelijke signed URL voor download.
// TTL bewust kort (default 5 minuten) zodat lekken minimale impact heeft.

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  const ttl = Number(process.env.SIGNED_URL_TTL_SECONDS ?? '300');
  const expiresAt = new Date(Date.now() + ttl * 1000).toISOString();

  await audit({
    actorUserId: 'mock-user',
    actorName: 'Mock User',
    actorRole: 'STUDENT',
    action: 'document.gedownload',
    objectType: 'Document',
    objectId: params.id,
  });

  return NextResponse.json({
    documentId: params.id,
    downloadUrl: `https://storage.example.com/signed/${params.id}?ttl=${ttl}`,
    expiresAt,
  });
}
