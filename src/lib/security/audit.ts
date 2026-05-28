import type { Role } from '@/lib/types';

// Auditlog helper. Gebruik altijd dit pad voor gevoelige acties; nooit direct prisma.auditLog.create
// vanuit een page/component. Zo blijft logging consistent en compleet.

export type AuditAction =
  | 'login.gelukt'
  | 'login.mislukt'
  | 'logout'
  | 'document.geupload'
  | 'document.bekeken'
  | 'document.gedownload'
  | 'document.verwijderd'
  | 'weekstaat.ingediend'
  | 'weekstaat.goedgekeurd'
  | 'weekstaat.afgekeurd'
  | 'student.gewijzigd'
  | 'integratie.resync_gestart'
  | 'integratie.config_gewijzigd'
  | 'security.toegang_geweigerd';

export type AuditPayload = {
  actorUserId: string;
  actorName: string;
  actorRole: Role;
  action: AuditAction;
  objectType: string;
  objectId: string;
  ip?: string;
  userAgent?: string;
  context?: Record<string, string | number | boolean>;
};

// Bewust gescheiden van de Prisma-call zodat we het kunnen mocken in tests
// en kunnen routen naar zowel database als externe log-sink.
export async function audit(payload: AuditPayload): Promise<void> {
  // In productie: prisma.auditLog.create + asynchroon push naar SIEM/object storage.
  // We voorkomen dat gevoelige velden in context terechtkomen (BSN, geboortedatum).
  const safeContext = stripSensitive(payload.context);
  // eslint-disable-next-line no-console
  console.info('[audit]', {
    at: new Date().toISOString(),
    ...payload,
    context: safeContext,
  });
}

const SENSITIVE_KEYS = new Set(['bsn', 'birthDate', 'birthdate', 'iban', 'token', 'password']);

function stripSensitive(ctx?: Record<string, unknown>) {
  if (!ctx) return undefined;
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(ctx)) {
    if (SENSITIVE_KEYS.has(k.toLowerCase())) continue;
    out[k] = v;
  }
  return out;
}
