import { db } from '@/lib/db';

export type SignalSeverity = 'INFO' | 'WARNING' | 'CRITICAL';
export type SignalType =
  | 'STUDENT_GEEN_UREN'
  | 'WEEKSTAAT_OPEN'
  | 'CONTRACT_VERLOOPT'
  | 'SOLLICITATIE_GEEN_REACTIE'
  | 'VERLOPEN_RIE'
  | 'VERLOPEN_VOG'
  | 'STUDENT_GEEN_CONTRACT'
  | 'CLEVERDESK_SYNC_ONTBREEKT'
  | 'SYNERGY_ID_ONTBREEKT'
  | 'DOCUSIGN_HANGT'
  | 'ZIEK_GEEN_HERSTEL'
  | 'DIPLOMA_GEPLAND';

export type SignalRole = 'STUDENT' | 'COORDINATOR' | 'COMPANY' | 'ADMIN';

export type Signal = {
  id: string;
  type: SignalType;
  severity: SignalSeverity;
  title: string;
  body: string;
  href: string;
  forRoles: SignalRole[];
  scope?: { studentId?: string; companyId?: string; regionId?: string; coordinatorId?: string };
  detectedAt: string;
};

const DAY = 86400_000;

/**
 * Centrale signaleringen-engine. Scant de DB op condities die menselijke
 * actie vereisen en geeft een platte lijst Signal-items terug.
 * Gebruikt door coordinator/inbox, admin dashboard, en notification systeem.
 */
export async function detectSignals(
  filter: { coordinatorId?: string; regionId?: string; companyId?: string } = {},
): Promise<Signal[]> {
  const signals: Signal[] = [];
  const now = new Date();

  try {
    // 1. Contracten die binnen 90 dagen aflopen
    const aflopendThreshold = new Date(now.getTime() + 90 * DAY);
    const contracten = await db.contract
      .findMany({
        where: {
          status: { in: ['ACTIEF', 'AFLOPEND'] },
          endDate: { lte: aflopendThreshold, gte: now },
          ...(filter.coordinatorId ? { student: { coordinatorId: filter.coordinatorId } } : {}),
          ...(filter.companyId ? { companyId: filter.companyId } : {}),
        },
        include: { student: { include: { user: true, coordinator: true } } },
        take: 50,
      })
      .catch(() => []);

    for (const c of contracten) {
      const days = Math.ceil((c.endDate.getTime() - now.getTime()) / DAY);
      signals.push({
        id: `contract-${c.id}`,
        type: 'CONTRACT_VERLOOPT',
        severity: days < 30 ? 'CRITICAL' : days < 60 ? 'WARNING' : 'INFO',
        title: `Contract van ${c.student.user.name} loopt af`,
        body: `Nog ${days} dagen tot ${c.endDate.toLocaleDateString('nl-NL')}. Beslis: verlengen of beëindigen.`,
        href: `/coordinator/studenten/${c.student.id}`,
        forRoles: ['COORDINATOR', 'ADMIN'],
        scope: { studentId: c.student.id, coordinatorId: c.student.coordinatorId },
        detectedAt: now.toISOString(),
      });
    }

    // 2. Open verzuim (>7 dagen)
    const oudeVerzuim = await db.absence
      .findMany({
        where: {
          closedAt: null,
          type: 'ZIEKTE',
          startDate: { lt: new Date(now.getTime() - 7 * DAY) },
          ...(filter.coordinatorId ? { student: { coordinatorId: filter.coordinatorId } } : {}),
        },
        include: { student: { include: { user: true, coordinator: true } } },
        take: 20,
      })
      .catch(() => []);

    for (const a of oudeVerzuim) {
      const dagen = Math.ceil((now.getTime() - a.startDate.getTime()) / DAY);
      signals.push({
        id: `absence-${a.id}`,
        type: 'ZIEK_GEEN_HERSTEL',
        severity: dagen > 14 ? 'CRITICAL' : 'WARNING',
        title: `${a.student.user.name} al ${dagen} dagen ziek`,
        body: 'Geen beter-melding ontvangen. Tijd voor contact of bedrijfsarts.',
        href: '/coordinator/verzuim',
        forRoles: ['COORDINATOR', 'ADMIN'],
        scope: { studentId: a.student.id, coordinatorId: a.student.coordinatorId },
        detectedAt: now.toISOString(),
      });
    }

    // 3. Sollicitaties >3 dagen geen reactie
    const trageSollicitaties = await db.application
      .findMany({
        where: {
          status: { in: ['NIEUW', 'TOEGEWEZEN'] },
          createdAt: { lt: new Date(now.getTime() - 3 * DAY) },
          ...(filter.coordinatorId ? { assignedTo: { coordinatorProfile: { id: filter.coordinatorId } } } : {}),
        },
        include: { assignedTo: true, region: true },
        take: 20,
      })
      .catch(() => []);

    for (const a of trageSollicitaties) {
      const dagen = Math.ceil((now.getTime() - a.createdAt.getTime()) / DAY);
      signals.push({
        id: `app-${a.id}`,
        type: 'SOLLICITATIE_GEEN_REACTIE',
        severity: dagen > 7 ? 'CRITICAL' : 'WARNING',
        title: `Sollicitatie ${a.firstName} ${a.lastName} wacht ${dagen} dagen`,
        body: `Postcode ${a.postcode} · regio ${a.region?.name ?? '-'}. Coördinator: reageer binnen 3 werkdagen.`,
        href: `/coordinator/sollicitaties/${a.id}`,
        forRoles: ['COORDINATOR', 'ADMIN'],
        scope: { regionId: a.regionId ?? undefined },
        detectedAt: now.toISOString(),
      });
    }

    // 4. Studenten zonder Cleverdesk ID
    const zonderCleverdesk = await db.student
      .findMany({
        where: {
          cleverdeskId: null,
          ...(filter.coordinatorId ? { coordinatorId: filter.coordinatorId } : {}),
        },
        include: { user: true, coordinator: true, company: true },
        take: 20,
      })
      .catch(() => []);

    for (const s of zonderCleverdesk) {
      signals.push({
        id: `cd-${s.id}`,
        type: 'CLEVERDESK_SYNC_ONTBREEKT',
        severity: 'WARNING',
        title: `${s.user.name} heeft geen Cleverdesk ID`,
        body: `Uren kunnen niet automatisch gesynchroniseerd worden. Koppel via Synergy kaartenbak.`,
        href: '/admin/kaartenbak',
        forRoles: ['ADMIN'],
        scope: { studentId: s.id, coordinatorId: s.coordinatorId },
        detectedAt: now.toISOString(),
      });
    }

    // 5. Weekstaten ingediend, niet goedgekeurd >5 dagen
    const hangendeWeekstaten = await db.timesheet
      .findMany({
        where: {
          status: 'INGEDIEND',
          submittedAt: { lt: new Date(now.getTime() - 5 * DAY) },
          ...(filter.companyId ? { student: { companyId: filter.companyId } } : {}),
          ...(filter.coordinatorId ? { student: { coordinatorId: filter.coordinatorId } } : {}),
        },
        include: { student: { include: { user: true, company: true } } },
        take: 20,
      })
      .catch(() => []);

    for (const t of hangendeWeekstaten) {
      const dagen = Math.ceil((now.getTime() - (t.submittedAt?.getTime() ?? now.getTime())) / DAY);
      signals.push({
        id: `ts-${t.id}`,
        type: 'WEEKSTAAT_OPEN',
        severity: dagen > 10 ? 'CRITICAL' : 'WARNING',
        title: `Weekstaat W${t.weekNumber} van ${t.student.user.name} wacht ${dagen} dagen`,
        body: `Lidbedrijf ${t.student.company.name} heeft nog niet gereageerd op de ingediende weekstaat.`,
        href: '/lidbedrijf/goedkeuren',
        forRoles: ['COMPANY', 'COORDINATOR', 'ADMIN'],
        detectedAt: now.toISOString(),
      });
    }

    // 6. Diploma kandidaten gepland
    const kandidaten = await db.student
      .findMany({
        where: {
          yearOfStudy: 3,
          expectedDiplomaDate: { lte: new Date(now.getTime() + 180 * DAY), gte: now },
          ...(filter.coordinatorId ? { coordinatorId: filter.coordinatorId } : {}),
        },
        include: { user: true, coordinator: true },
        take: 10,
      })
      .catch(() => []);

    for (const k of kandidaten) {
      if (!k.expectedDiplomaDate) continue;
      const dagen = Math.ceil((k.expectedDiplomaDate.getTime() - now.getTime()) / DAY);
      signals.push({
        id: `dip-${k.id}`,
        type: 'DIPLOMA_GEPLAND',
        severity: 'INFO',
        title: `${k.user.name} diplomeert binnen ${dagen} dagen`,
        body: `Plan: examens, PvB, uitstroomgesprek, eindafrekening.`,
        href: '/coordinator/diploma',
        forRoles: ['COORDINATOR', 'ADMIN'],
        scope: { studentId: k.id, coordinatorId: k.coordinatorId },
        detectedAt: now.toISOString(),
      });
    }
  } catch (err) {
    console.error('[signals.detect]', err);
  }

  // Sorteer op severity (CRITICAL eerst), dan op detectedAt
  return signals.sort((a, b) => {
    const w = { CRITICAL: 0, WARNING: 1, INFO: 2 };
    return w[a.severity] - w[b.severity];
  });
}

export function signalTone(severity: SignalSeverity) {
  return severity === 'CRITICAL'
    ? { color: 'rose', label: 'Kritiek' }
    : severity === 'WARNING'
    ? { color: 'amber', label: 'Aandacht' }
    : { color: 'sky', label: 'Info' };
}
