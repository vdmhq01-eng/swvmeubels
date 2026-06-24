import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

/**
 * AVG art. 5(1)(e): Storage limitation.
 * Verwijdert data die de bewaartermijn voorbij is.
 *
 * Draait dagelijks via Vercel Cron (zie vercel.json).
 * Beveiligd via CRON_SECRET header (Vercel auto-set).
 */
export async function GET(req: Request) {
  // Vercel cron auth
  const authHeader = req.headers.get('authorization') ?? '';
  const cronSecret = process.env.CRON_SECRET ?? '';
  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 });
  }

  const now = new Date();
  const sevenYearsAgo = new Date(now.getTime() - 7 * 365 * 86400_000);
  const ninetyDaysAgo = new Date(now.getTime() - 90 * 86400_000);

  const stats: Record<string, number> = {};

  try {
    // 1. Documenten waarvan retentionUntil voorbij is
    const expiredDocs = await db.document.deleteMany({
      where: { retentionUntil: { lt: now } },
    });
    stats.expired_documents = expiredDocs.count;

    // 2. Audit logs ouder dan 7 jaar (max wettelijke termijn)
    const oldAudit = await db.auditLog.deleteMany({
      where: { at: { lt: sevenYearsAgo } },
    });
    stats.old_audit_logs = oldAudit.count;

    // 3. Sync logs ouder dan 90 dagen (operationeel, geen wettelijke termijn)
    const oldSync = await db.syncLog.deleteMany({
      where: { startedAt: { lt: ninetyDaysAgo } },
    });
    stats.old_sync_logs = oldSync.count;

    // 4. Notifications ouder dan 90 dagen
    const oldNotifs = await db.notification.deleteMany({
      where: { createdAt: { lt: ninetyDaysAgo }, read: true },
    });
    stats.old_notifications = oldNotifs.count;

    // 5. Security logs ouder dan 90 dagen (behalve CRITICAL)
    const oldSecurity = await db.securityLog.deleteMany({
      where: { at: { lt: ninetyDaysAgo }, severity: { not: 'CRITICAL' } },
    });
    stats.old_security_logs = oldSecurity.count;

    return NextResponse.json({ ok: true, runAt: now.toISOString(), stats });
  } catch (err) {
    console.error('[cron/retention]', err);
    return NextResponse.json({ ok: false, error: String(err), stats }, { status: 500 });
  }
}
