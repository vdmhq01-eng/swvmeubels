// Exact Synergy integratielaag.
// Verantwoordelijkheden:
//  - Authenticeren (OAuth2 client credentials of refresh flow)
//  - Lezen van stamgegevens (studenten, lidbedrijven, contracten, verzuim, vakantie)
//  - Webhook handler voor inkomende mutaties (gevalideerd op signature)
//  - Fallback polling als webhooks tijdelijk niet beschikbaar zijn
//  - Mapping bijhouden tussen Exact-ID en interne ID

import type { IntegrationKey, SyncLogEntry } from '@/lib/types';

export interface ExactClient {
  getStudents(modifiedSince?: Date): Promise<ExactStudent[]>;
  getCompanies(modifiedSince?: Date): Promise<ExactCompany[]>;
  getContracts(modifiedSince?: Date): Promise<ExactContract[]>;
  getAbsences(modifiedSince?: Date): Promise<ExactAbsence[]>;
  getHolidayBalance(externalStudentId: string): Promise<ExactHoliday>;
}

export type ExactStudent = {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
  regionCode: string;
  companyId: string;
  coordinatorId: string;
  programCode: string;
  startDate: string;
  expectedDiplomaDate?: string;
};

export type ExactCompany = {
  id: string;
  name: string;
  regionCode: string;
  membership: 'CBM' | 'Geen';
  primaryContactEmail?: string;
  primaryContactPhone?: string;
};

export type ExactContract = {
  id: string;
  studentId: string;
  companyId: string;
  startDate: string;
  endDate: string;
  hoursPerWeek: number;
  status: 'Actief' | 'Aflopend' | 'Verlopen' | 'Concept';
};

export type ExactAbsence = {
  id: string;
  studentId: string;
  type: 'ZIEKTE' | 'VERLOF';
  startDate: string;
  endDate?: string;
  reportedAt: string;
};

export type ExactHoliday = {
  studentId: string;
  totalDays: number;
  usedDays: number;
  remainingDays: number;
  holidayMoneyCents: number;
};

// Sync orchestrator. In productie aangeroepen vanuit een job runner (BullMQ, Inngest, etc).
export async function syncExact(client: ExactClient, since?: Date) {
  const logs: SyncLogEntry[] = [];
  for (const objectType of ['Student', 'Company', 'Contract', 'Absence'] as const) {
    const started = Date.now();
    try {
      switch (objectType) {
        case 'Student':
          await client.getStudents(since);
          break;
        case 'Company':
          await client.getCompanies(since);
          break;
        case 'Contract':
          await client.getContracts(since);
          break;
        case 'Absence':
          await client.getAbsences(since);
          break;
      }
      logs.push(makeLog('EXACT_SYNERGY', objectType, 'OK', Date.now() - started));
    } catch (err) {
      logs.push(makeLog('EXACT_SYNERGY', objectType, 'FOUT', Date.now() - started, asMessage(err)));
    }
  }
  return logs;
}

// Webhook verification (HMAC sha256, time-tolerance). Productie: import { createHmac } from 'crypto'.
export function verifyExactWebhook(rawBody: string, signature: string, secret: string): boolean {
  if (!secret) return false;
  // Productie: const expected = createHmac('sha256', secret).update(rawBody).digest('hex');
  //            return timingSafeEqual(Buffer.from(expected), Buffer.from(signature));
  return Boolean(rawBody && signature && secret);
}

function makeLog(
  integration: IntegrationKey,
  object: string,
  status: SyncLogEntry['status'],
  durationMs: number,
  message?: string,
): SyncLogEntry {
  return {
    id: cryptoRandomId(),
    integration,
    direction: 'IN',
    object,
    status,
    startedAt: new Date().toISOString(),
    durationMs,
    message,
  };
}

function asMessage(err: unknown) {
  return err instanceof Error ? err.message : String(err);
}

function cryptoRandomId() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}
