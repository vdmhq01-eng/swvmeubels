import { PortalShell } from '@/components/portal/PortalShell';
import { StudentNotLoaded } from '@/components/portal/StudentNotLoaded';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { Avatar } from '@/components/ui/Avatar';
import { Icon } from '@/components/ui/Icon';
import { getDemoSession } from '@/lib/data/session';
import { listMessagesForUser } from '@/lib/data/content';
import { db } from '@/lib/db';
import { formatDate } from '@/lib/utils';

export const dynamic = 'force-dynamic';

export default async function StudentBerichtenPage() {
  const ctx = getDemoSession('STUDENT');
  const [s, messages] = await Promise.all([
    db.student.findUnique({ where: { id: ctx.studentId! }, include: { user: true } }).catch(() => null),
    listMessagesForUser(ctx.userId),
  ]);
  if (!s) return <StudentNotLoaded activeHref="/student/berichten" />;
  const first = messages[0];

  return (
    <PortalShell
      role="STUDENT"
      activeHref="/student/berichten"
      userName={s.user.name}
      userSubtitle="Student"
      greeting={{ title: 'Berichten', subtitle: 'Communicatie met je coördinator en leerbedrijf.' }}
    >
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <CardHeader title="Inbox" subtitle={`${messages.filter((m) => !m.readAt).length} ongelezen`} />
          <CardBody>
            {messages.length === 0 ? (
              <div className="text-sm text-ink-500">Geen berichten.</div>
            ) : (
              <ul className="divide-y divide-bone-100">
                {messages.map((m) => (
                  <li key={m.id} className={`flex items-start gap-3 py-3 first:pt-0 last:pb-0 ${!m.readAt ? 'opacity-100' : 'opacity-80'}`}>
                    <Avatar name={m.fromUser.name} size="sm" tone="stone" />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <div className="truncate text-sm font-medium text-ink-900">{m.fromUser.name}</div>
                        <div className="text-xs text-ink-500">{formatDate(m.sentAt)}</div>
                      </div>
                      <div className="truncate text-sm text-ink-700">{m.subject}</div>
                      <div className="truncate text-xs text-ink-500">{m.body}</div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </CardBody>
        </Card>

        <Card className="lg:col-span-2">
          <CardBody>
            {first ? (
              <>
                <div className="flex items-start justify-between gap-3 border-b border-bone-100 pb-4">
                  <div className="flex items-center gap-3">
                    <Avatar name={first.fromUser.name} tone="green" />
                    <div>
                      <div className="font-display text-base font-semibold text-ink-900">{first.subject}</div>
                      <div className="text-xs text-ink-500">Van {first.fromUser.name} · {formatDate(first.sentAt)}</div>
                    </div>
                  </div>
                  <button className="btn-ghost"><Icon.X className="h-4 w-4" /></button>
                </div>
                <p className="mt-5 whitespace-pre-line text-sm leading-relaxed text-ink-800">{first.body}</p>

                <div className="mt-5 rounded-2xl border border-bone-200 bg-bone-50 p-4">
                  <label className="label mb-2 block">Reageer</label>
                  <textarea rows={4} className="input bg-white" placeholder="Schrijf een bericht…" />
                  <div className="mt-3 flex justify-end gap-2">
                    <button className="btn-secondary">Concept</button>
                    <button className="btn-primary">
                      <Icon.Check className="h-4 w-4" /> Verstuur
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="text-sm text-ink-500">Geen berichten om te tonen.</div>
            )}
          </CardBody>
        </Card>
      </div>
    </PortalShell>
  );
}
