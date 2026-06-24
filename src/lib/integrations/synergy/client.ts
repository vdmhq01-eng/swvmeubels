/**
 * Exact Synergy REST API client wrapper.
 * Implementeert OAuth2 + retry + error handling.
 *
 * Productie: vereist EXACT_SYNERGY_URL + EXACT_SYNERGY_CLIENT_ID +
 * EXACT_SYNERGY_CLIENT_SECRET als env vars. Zonder credentials draait
 * de client in mock-mode en logt acties naar console (dev-friendly).
 */

import { db } from '@/lib/db';

export type SynergyConfig = {
  baseUrl: string;
  clientId: string;
  clientSecret: string;
  division?: number; // optioneel: Synergy administratie ID
};

export type SynergyEntity = 'employee' | 'contract' | 'absence' | 'account' | 'document';

function getConfig(): SynergyConfig | null {
  const baseUrl = process.env.EXACT_SYNERGY_URL;
  const clientId = process.env.EXACT_SYNERGY_CLIENT_ID;
  const clientSecret = process.env.EXACT_SYNERGY_CLIENT_SECRET;
  if (!baseUrl || !clientId || !clientSecret) return null;
  return {
    baseUrl,
    clientId,
    clientSecret,
    division: process.env.EXACT_SYNERGY_DIVISION ? Number(process.env.EXACT_SYNERGY_DIVISION) : undefined,
  };
}

let cachedToken: { token: string; expiresAt: number } | null = null;

async function getAccessToken(cfg: SynergyConfig): Promise<string> {
  if (cachedToken && cachedToken.expiresAt > Date.now() + 60_000) return cachedToken.token;

  // OAuth2 client credentials flow (server-to-server)
  const res = await fetch(`${cfg.baseUrl}/oauth2/token`, {
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'client_credentials',
      client_id: cfg.clientId,
      client_secret: cfg.clientSecret,
      scope: 'synergy_api',
    }),
  });
  if (!res.ok) throw new Error(`Synergy OAuth failed: ${res.status}`);
  const data = (await res.json()) as { access_token: string; expires_in: number };
  cachedToken = { token: data.access_token, expiresAt: Date.now() + data.expires_in * 1000 };
  return data.access_token;
}

async function logSync(args: {
  direction: 'IN' | 'UIT';
  entity: SynergyEntity;
  externalId?: string | null;
  status: 'OK' | 'FOUT';
  durationMs: number;
  message?: string;
}) {
  try {
    await db.syncLog.create({
      data: {
        integration: 'EXACT_SYNERGY',
        direction: args.direction,
        objectType: args.entity,
        externalId: args.externalId ?? null,
        status: args.status,
        startedAt: new Date(),
        durationMs: args.durationMs,
        message: args.message ?? null,
      },
    });
  } catch {}
}

export async function synergyRequest<T>(
  method: 'GET' | 'POST' | 'PUT' | 'DELETE',
  path: string,
  body?: unknown,
): Promise<T> {
  const cfg = getConfig();
  const start = Date.now();

  if (!cfg) {
    // Mock mode — dev/demo zonder credentials
    console.warn(`[synergy:mock] ${method} ${path}`, body);
    await logSync({
      direction: method === 'GET' ? 'IN' : 'UIT',
      entity: pathToEntity(path),
      status: 'OK',
      durationMs: Date.now() - start,
      message: 'Mock-mode: EXACT_SYNERGY_URL niet gezet',
    });
    return mockResponse<T>(path);
  }

  try {
    const token = await getAccessToken(cfg);
    const url = `${cfg.baseUrl}/services/api/v1${cfg.division ? `/${cfg.division}` : ''}${path}`;
    const res = await fetch(url, {
      method,
      headers: {
        authorization: `Bearer ${token}`,
        accept: 'application/json',
        ...(body ? { 'content-type': 'application/json' } : {}),
      },
      body: body ? JSON.stringify(body) : undefined,
    });
    if (!res.ok) {
      const text = await res.text().catch(() => '');
      throw new Error(`Synergy ${method} ${path} → ${res.status}: ${text.slice(0, 200)}`);
    }
    const data = (await res.json()) as T;
    await logSync({
      direction: method === 'GET' ? 'IN' : 'UIT',
      entity: pathToEntity(path),
      status: 'OK',
      durationMs: Date.now() - start,
    });
    return data;
  } catch (err) {
    await logSync({
      direction: method === 'GET' ? 'IN' : 'UIT',
      entity: pathToEntity(path),
      status: 'FOUT',
      durationMs: Date.now() - start,
      message: String(err),
    });
    throw err;
  }
}

function pathToEntity(path: string): SynergyEntity {
  if (path.includes('/employees') || path.includes('/Persons')) return 'employee';
  if (path.includes('/contracts') || path.includes('/EmploymentContracts')) return 'contract';
  if (path.includes('/absences') || path.includes('/EmployeeAbsence')) return 'absence';
  if (path.includes('/accounts') || path.includes('/Accounts')) return 'account';
  if (path.includes('/documents') || path.includes('/Document')) return 'document';
  return 'employee';
}

function mockResponse<T>(path: string): T {
  // Mock responses zodat sync-code geen errors gooit zonder credentials
  if (path.includes('/employees') || path.includes('/Persons')) {
    return { d: { results: [] }, totalCount: 0 } as unknown as T;
  }
  if (path.includes('/contracts')) {
    return { d: { results: [] } } as unknown as T;
  }
  return { d: { results: [] } } as unknown as T;
}

export function isSynergyConfigured(): boolean {
  return getConfig() !== null;
}
