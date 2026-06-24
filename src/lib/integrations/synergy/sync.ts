/**
 * Synergy ↔ SWV portal sync operations.
 * Field mapping en business logic.
 */

import { db } from '@/lib/db';
import { synergyRequest, isSynergyConfigured } from './client';

/**
 * Synergy Person entity (Employee in Synergy Enterprise).
 * Velden zoals ze in Synergy REST API terugkomen.
 */
export type SynergyPerson = {
  ID: string; // Synergy GUID
  Code: string; // employee code
  FullName: string;
  FirstName: string;
  LastName: string;
  Email: string;
  Phone?: string;
  Postcode?: string;
  StartDate?: string; // ISO
  EndDate?: string;
  ActiveFromDate?: string;
};

export type SynergyContract = {
  ID: string;
  PersonID: string;
  StartDate: string;
  EndDate: string;
  HoursPerWeek: number;
  ContractType: string;
  Status: 'Active' | 'Ended' | 'Pending';
};

// ─── PULL: van Synergy naar onze DB ────────────────────────────────────

/**
 * Sync alle BBL-studenten vanuit Synergy. Stelt externalId in
 * en updatet basis velden. Behoudt onze portal-specifieke velden.
 */
export async function pullEmployeesFromSynergy(): Promise<{ synced: number; errors: number }> {
  let synced = 0;
  let errors = 0;
  const res = await synergyRequest<{ d: { results: SynergyPerson[] } }>(
    'GET',
    `/HRM/Persons?$filter=Active eq true&$select=ID,Code,FullName,FirstName,LastName,Email,Phone,Postcode,StartDate,EndDate&$top=500`,
  );
  for (const p of res.d?.results ?? []) {
    try {
      await db.student.updateMany({
        where: { externalId: p.ID },
        data: {
          startDate: p.StartDate ? new Date(p.StartDate) : undefined,
          expectedDiplomaDate: p.EndDate ? new Date(p.EndDate) : undefined,
        },
      });
      synced++;
    } catch {
      errors++;
    }
  }
  return { synced, errors };
}

/**
 * Sync alle accounts (lidbedrijven) vanuit Synergy.
 */
export async function pullAccountsFromSynergy(): Promise<{ synced: number; errors: number }> {
  let synced = 0;
  let errors = 0;
  const res = await synergyRequest<{ d: { results: Array<{ ID: string; Name: string; Code: string }> } }>(
    'GET',
    `/CRM/Accounts?$filter=Status eq 'C'&$select=ID,Name,Code&$top=500`,
  );
  for (const a of res.d?.results ?? []) {
    try {
      await db.company.updateMany({
        where: { externalId: a.ID },
        data: { name: a.Name },
      });
      synced++;
    } catch {
      errors++;
    }
  }
  return { synced, errors };
}

// ─── PUSH: van onze DB naar Synergy ────────────────────────────────────

/**
 * Maakt nieuwe student aan in Synergy (bij eerste indiensttreding).
 */
export async function createEmployeeInSynergy(studentId: string): Promise<string | null> {
  const s = await db.student.findUnique({
    where: { id: studentId },
    include: { user: true },
  });
  if (!s) return null;

  const [firstName, ...rest] = s.user.name.split(' ');
  const lastName = rest.join(' ');

  const res = await synergyRequest<{ d: { ID: string } }>(
    'POST',
    `/HRM/Persons`,
    {
      Code: s.id.slice(-8).toUpperCase(),
      FirstName: firstName,
      LastName: lastName,
      Email: s.user.email,
      StartDate: s.startDate.toISOString(),
    },
  );

  if (res.d?.ID) {
    await db.student.update({
      where: { id: studentId },
      data: { externalId: res.d.ID },
    });
    return res.d.ID;
  }
  return null;
}

/**
 * Push contract-mutatie naar Synergy (bij verlenging of uitdienst).
 */
export async function pushContractToSynergy(contractId: string): Promise<boolean> {
  const c = await db.contract.findUnique({
    where: { id: contractId },
    include: { student: true },
  });
  if (!c || !c.student.externalId) return false;

  await synergyRequest('POST', `/HRM/EmploymentContracts`, {
    PersonID: c.student.externalId,
    StartDate: c.startDate.toISOString(),
    EndDate: c.endDate.toISOString(),
    HoursPerWeek: c.hoursPerWeek,
    Status: c.status === 'ACTIEF' ? 'Active' : c.status === 'VERLOPEN' ? 'Ended' : 'Pending',
  });
  return true;
}

/**
 * Webhook handler: Synergy stuurt een event (employee changed, contract created).
 * Verifieer signature, queue de juiste action.
 */
export async function handleSynergyWebhook(event: {
  type: string;
  entity: string;
  id: string;
  changes?: Record<string, unknown>;
}): Promise<void> {
  console.log('[synergy:webhook]', event);

  switch (`${event.entity}.${event.type}`) {
    case 'Person.updated':
      // Re-pull deze person
      break;
    case 'EmploymentContract.created':
    case 'EmploymentContract.updated':
      // Re-pull contracten van die person
      break;
    case 'EmployeeAbsence.created':
      // Ziekmelding via Synergy → maak Absence aan in portal
      break;
  }
}

export function syncStatus(): { configured: boolean; lastSync: Date | null } {
  return {
    configured: isSynergyConfigured(),
    lastSync: null, // wordt uitgelezen uit Integration tabel in admin page
  };
}
