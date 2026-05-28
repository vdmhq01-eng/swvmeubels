import { NextResponse } from 'next/server';
import { documentUploadSchema } from '@/lib/validation';
import { startUpload } from '@/lib/security/upload';
import { documents } from '@/lib/mock/misc';

// GET /api/documents - list (scope-aware in productie)
export async function GET() {
  // Productie: filter op rol+scope via studentScopeFilter(ctx)
  // We retourneren géén URL's; client moet aparte /url endpoint aanroepen.
  const safe = documents.map(({ ...d }) => d);
  return NextResponse.json({ documents: safe });
}

// POST /api/documents - initieer upload (krijg signed URL terug)
export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const parsed = documentUploadSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Ongeldige upload', issues: parsed.error.issues }, { status: 400 });
  }
  const signed = await startUpload(
    { userId: 'mock-user', role: 'STUDENT' },
    parsed.data,
  );
  return NextResponse.json(signed);
}
