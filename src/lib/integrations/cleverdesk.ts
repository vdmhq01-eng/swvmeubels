// Cleverdesk integratielaag.
// Verantwoordelijkheden:
//  - Weekstaten ophalen (read) en indienen/goedkeuren (write)
//  - Mapping student/lidbedrijf/coördinator bewaken
//  - Idempotency keys gebruiken bij writes (Cleverdesk garandeert dan exactly-once)
//  - Retry met exponential backoff bij 5xx / netwerkfouten
//  - Ontbrekende uren detecteren

import type { IntegrationKey, SyncLogEntry, TimesheetStatus, TimeEntryType } from '@/lib/types';

export interface CleverdeskClient {
  listWeeksheets(params: { studentId?: string; year: number; week?: number }): Promise<CDWeeksheet[]>;
  submitWeeksheet(input: CDWeeksheetSubmit, idempotencyKey: string): Promise<CDWeeksheet>;
  decideWeeksheet(input: CDDecision, idempotencyKey: string): Promise<CDWeeksheet>;
}

export type CDEntry = {
  date: string;
  type: TimeEntryType;
  hours: number;
  note?: string;
};

export type CDWeeksheet = {
  id: string;            // Cleverdesk ID
  studentId: string;     // mapping naar interne student
  year: number;
  week: number;
  status: TimesheetStatus;
  entries: CDEntry[];
};

export type CDWeeksheetSubmit = {
  studentId: string;
  year: number;
  week: number;
  entries: CDEntry[];
};

export type CDDecision = {
  weeksheetId: string;
  decision: 'GOEDGEKEURD' | 'AFGEKEURD' | 'CORRECTIE_GEVRAAGD';
  reason?: string;
};

// Retry wrapper voor schrijfacties met idempotency.
export async function withRetry<T>(
  fn: () => Promise<T>,
  opts: { attempts?: number; baseMs?: number } = {},
): Promise<T> {
  const attempts = opts.attempts ?? 4;
  const base = opts.baseMs ?? 250;
  let lastErr: unknown;
  for (let i = 0; i < attempts; i++) {
    try {
      return await fn();
    } catch (err) {
      lastErr = err;
      if (i === attempts - 1) break;
      await new Promise((r) => setTimeout(r, base * Math.pow(2, i)));
    }
  }
  throw lastErr;
}

export function ontbrekendeUren(weeksheet: CDWeeksheet, normPerWeek = 38): number {
  const total = weeksheet.entries.reduce((a, e) => a + e.hours, 0);
  return Math.max(0, normPerWeek - total);
}

export function makeIdempotencyKey(parts: Array<string | number>) {
  return parts.join(':');
}

export async function pullWeeksheets(
  client: CleverdeskClient,
  studentIds: string[],
  year: number,
): Promise<SyncLogEntry[]> {
  const logs: SyncLogEntry[] = [];
  for (const studentId of studentIds) {
    const started = Date.now();
    try {
      await client.listWeeksheets({ studentId, year });
      logs.push(makeLog('CLEVERDESK', 'Weekstaat', 'OK', Date.now() - started, studentId));
    } catch (err) {
      logs.push(
        makeLog(
          'CLEVERDESK',
          'Weekstaat',
          'FOUT',
          Date.now() - started,
          studentId,
          err instanceof Error ? err.message : String(err),
        ),
      );
    }
  }
  return logs;
}

function makeLog(
  integration: IntegrationKey,
  object: string,
  status: SyncLogEntry['status'],
  durationMs: number,
  externalId?: string,
  message?: string,
): SyncLogEntry {
  return {
    id: Math.random().toString(36).slice(2),
    integration,
    direction: 'IN',
    object,
    externalId,
    status,
    startedAt: new Date().toISOString(),
    durationMs,
    message,
  };
}
