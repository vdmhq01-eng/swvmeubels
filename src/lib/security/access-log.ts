import { db } from '@/lib/db';

export type AccessReason =
  | 'NORMAAL'
  | 'BEGELEIDING'
  | 'GOEDKEURING_WEEKSTAAT'
  | 'GOEDKEURING_VERZUIM'
  | 'INCIDENT'
  | 'VERVANGING_COLLEGA'
  | 'EXPORT_AVG'
  | 'AUDIT';

/**
 * Log iedere toegang tot persoonsgegevens van een student of bedrijf.
 * AVG-compliance: "wie zag wat, wanneer, waarom".
 * Gebruik bij elke read-actie buiten de basis-scope.
 */
export async function recordAccess(args: {
  actorUserId: string;
  actorRole: string;
  targetType: 'STUDENT' | 'COMPANY' | 'CONTRACT' | 'DOCUMENT' | 'ABSENCE';
  targetId: string;
  reason?: AccessReason;
  outsideScope?: boolean; // true = was buiten coordinator-eigen regio
  context?: Record<string, unknown>;
}) {
  try {
    await db.documentAccessLog.create({
      data: {
        documentId: args.targetType === 'DOCUMENT' ? args.targetId : 'NA',
        userId: args.actorUserId,
        action: `view.${args.targetType.toLowerCase()}`,
        ip: '',
        context: {
          role: args.actorRole,
          targetType: args.targetType,
          targetId: args.targetId,
          reason: args.reason ?? 'NORMAAL',
          outsideScope: !!args.outsideScope,
          ...args.context,
        },
      },
    });
  } catch (err) {
    console.error('[recordAccess]', err);
  }
}

/**
 * Tel hoeveel records een gebruiker vandaag heeft ingezien.
 * Anomaly check: > drempel → alert.
 */
export async function dailyAccessCount(userId: string): Promise<number> {
  try {
    const since = new Date(Date.now() - 86400_000);
    return await db.documentAccessLog.count({
      where: { userId, accessedAt: { gte: since } },
    });
  } catch {
    return 0;
  }
}

/**
 * Detecteert verdacht hoge toegang (>50 inzages in 24u door één persoon).
 * Wordt gebruikt door signals/engine.
 */
export async function detectAccessAnomalies(thresholdPerDay = 50) {
  try {
    const since = new Date(Date.now() - 86400_000);
    const grouped = await db.documentAccessLog.groupBy({
      by: ['userId'],
      where: { accessedAt: { gte: since } },
      _count: { _all: true },
    });
    return grouped
      .filter((g) => g._count._all > thresholdPerDay)
      .map((g) => ({ userId: g.userId, count: g._count._all }));
  } catch {
    return [];
  }
}

export const accessReasons: { value: AccessReason; label: string }[] = [
  { value: 'NORMAAL', label: 'Reguliere taak' },
  { value: 'BEGELEIDING', label: 'Begeleiding student' },
  { value: 'GOEDKEURING_WEEKSTAAT', label: 'Weekstaat goedkeuren' },
  { value: 'GOEDKEURING_VERZUIM', label: 'Verzuim verwerken' },
  { value: 'INCIDENT', label: 'Incident / klacht' },
  { value: 'VERVANGING_COLLEGA', label: 'Vervanging collega' },
  { value: 'EXPORT_AVG', label: 'AVG export verzoek' },
  { value: 'AUDIT', label: 'Audit / controle' },
];
