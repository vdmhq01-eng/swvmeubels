import { documentUploadSchema, type DocumentUploadInput } from '@/lib/validation';
import { audit } from '@/lib/security/audit';
import type { SessionContext } from '@/lib/security/rbac';

// AVG-proof upload flow.
// Stappen:
// 1. Server action ontvangt metadata (geen file) en geeft signed upload URL terug.
// 2. Client uploadt direct naar object storage met die signed URL (encrypted at rest).
// 3. Client meldt success terug; server bevestigt + maakt Document record (status PENDING_SCAN).
// 4. Asynchrone scanner controleert virus + MIME-type magic bytes; pas dan ACTIVE.
// 5. Bewaartermijn wordt gezet aan de hand van categorie.
// Downloads gaan altijd via een tijdelijke signed URL (TTL < 5 minuten).

const RETENTION_DAYS: Record<DocumentUploadInput['category'], number> = {
  CONTRACT: 365 * 7,         // 7 jaar fiscale bewaartermijn
  LEGITIMATIE: 365 * 3,      // 3 jaar - in lijn met AVG dataminimalisatie
  BEOORDELING: 365 * 7,
  BPV: 365 * 5,
  OVERIG: 365 * 2,
};

export function calculateRetentionDate(category: DocumentUploadInput['category'], from = new Date()) {
  const d = new Date(from);
  d.setDate(d.getDate() + RETENTION_DAYS[category]);
  return d;
}

export type SignedUploadResponse = {
  uploadUrl: string;
  storageKey: string;
  expiresAt: string;
  encryptionKeyId: string;
};

export async function startUpload(
  ctx: SessionContext,
  input: DocumentUploadInput,
): Promise<SignedUploadResponse> {
  // 1. Validatie - werpt ZodError bij ongeldige input
  documentUploadSchema.parse(input);

  // 2. Storage key bepalen - bevat geen persoonsdata
  const storageKey = `documents/${input.category.toLowerCase()}/${cryptoRandomId()}`;

  // 3. Bewaartermijn berekenen
  const retention = calculateRetentionDate(input.category);

  // 4. Signed URL aanmaken (mock - in productie via S3 presign of vergelijkbaar)
  const ttlSeconds = Number(process.env.SIGNED_URL_TTL_SECONDS ?? '300');
  const expiresAt = new Date(Date.now() + ttlSeconds * 1000).toISOString();
  const encryptionKeyId = process.env.STORAGE_KMS_KEY_ID ?? 'kms-default';

  await audit({
    actorUserId: ctx.userId,
    actorName: 'session',
    actorRole: ctx.role,
    action: 'document.geupload',
    objectType: 'Document',
    objectId: storageKey,
    context: {
      category: input.category,
      sizeBytes: input.sizeBytes,
      retentionUntil: retention.toISOString(),
    },
  });

  return {
    uploadUrl: `https://storage.example.com/signed/${storageKey}?ttl=${ttlSeconds}`,
    storageKey,
    expiresAt,
    encryptionKeyId,
  };
}

function cryptoRandomId() {
  // Mock - in productie: crypto.randomUUID()
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}
