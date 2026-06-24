import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getDemoSession } from '@/lib/data/session';
import { audit } from '@/lib/security/audit';

export const dynamic = 'force-dynamic';

/**
 * AVG art. 15: Recht op inzage.
 * Geeft alle persoonsgegevens van de ingelogde gebruiker terug als JSON-bestand.
 *
 * In productie: vervang getDemoSession door echte session uit auth.
 * Optioneel: limit rate (max 1 export per uur per gebruiker).
 */
export async function GET() {
  const ctx = getDemoSession('STUDENT');
  try {
    const user = await db.user.findUnique({
      where: { id: ctx.userId },
      include: {
        studentProfile: {
          include: {
            program: true,
            region: true,
            company: true,
            coordinator: { include: { user: { select: { name: true, email: true } } } },
            contracts: true,
            absences: true,
            holidayBalance: true,
            documents: { select: { id: true, fileName: true, category: true, uploadedAt: true, retentionUntil: true } },
            tasks: true,
          },
        },
        messagesTo: {
          select: { id: true, subject: true, body: true, sentAt: true, readAt: true, fromUser: { select: { name: true } } },
        },
        messagesFrom: {
          select: { id: true, subject: true, body: true, sentAt: true, toUser: { select: { name: true } } },
        },
        notifications: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'Geen profiel gevonden' }, { status: 404 });
    }

    const auditLogs = await db.auditLog
      .findMany({ where: { actorUserId: ctx.userId }, orderBy: { at: 'desc' }, take: 1000 })
      .catch(() => []);

    const exportData = {
      _meta: {
        generated: new Date().toISOString(),
        format: 'JSON',
        legalBasis: 'AVG art. 15 — Recht op inzage',
        controller: 'SWV Meubel · Westerhoutpark 10, 2012 JM Haarlem',
        contact: 'samenwerkingsverband@cbm.nl',
        retention: 'Wettelijk fiscaal 7 jaar voor contracten, 5 jaar voor identificatie na uitdienst',
      },
      account: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        twoFactorEnabled: user.twoFactorEnabled,
        createdAt: user.createdAt,
        lastLoginAt: user.lastLoginAt,
      },
      studentProfile: user.studentProfile ?? null,
      messages: { received: user.messagesTo, sent: user.messagesFrom },
      notifications: user.notifications,
      auditLog: auditLogs.map((l) => ({
        action: l.action,
        objectType: l.objectType,
        objectId: l.objectId,
        at: l.at,
        ip: l.ip,
        userAgent: l.userAgent,
        context: l.context,
      })),
    };

    await audit({
      actorUserId: ctx.userId,
      actorName: user.name,
      actorRole: user.role,
      action: 'document.gedownload',
      objectType: 'AVG_EXPORT',
      objectId: user.id,
      context: { recordCount: auditLogs.length },
    }).catch(() => {});

    return new NextResponse(JSON.stringify(exportData, null, 2), {
      headers: {
        'content-type': 'application/json',
        'content-disposition': `attachment; filename="swv-data-export-${user.id}-${new Date().toISOString().slice(0, 10)}.json"`,
      },
    });
  } catch (err) {
    console.error('[me/export]', err);
    return NextResponse.json({ error: 'Export mislukt' }, { status: 500 });
  }
}
