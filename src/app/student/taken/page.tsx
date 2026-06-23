import { PortalShell } from '@/components/portal/PortalShell';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Icon } from '@/components/ui/Icon';
import { getDemoSession } from '@/lib/data/session';
import { listTasksForStudent } from '@/lib/data/content';
import { db } from '@/lib/db';
import { formatDate } from '@/lib/utils';

export const dynamic = 'force-dynamic';

export default async function StudentTakenPage() {
  const ctx = getDemoSession('STUDENT');
  const [s, tasks] = await Promise.all([
    db.student.findUnique({ where: { id: ctx.studentId! }, include: { user: true } }).catch(() => null),
    listTasksForStudent(ctx.studentId!),
  ]);
  if (!s) return null;
  const open = tasks.filter((t) => t.status === 'OPEN').length;
  const inProgress = tasks.filter((t) => t.status === 'IN_BEHANDELING').length;
  const done = tasks.filter((t) => t.status === 'AFGEROND').length;

  return (
    <PortalShell
      role="STUDENT"
      activeHref="/student/taken"
      userName={s.user.name}
      userSubtitle="Student"
      greeting={{ title: 'Taken', subtitle: 'Wat moet je nog doen?' }}
    >
      <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
        <KPI tone="amber" label="Open" value={`${open}`} />
        <KPI tone="wood" label="In behandeling" value={`${inProgress}`} />
        <KPI tone="green" label="Afgerond" value={`${done}`} />
      </div>

      <Card className="mt-6">
        <CardHeader title="Alle taken" subtitle="Filter op status, prioriteit of einddatum" />
        <CardBody>
          {tasks.length === 0 ? (
            <div className="text-sm text-ink-500">Geen taken.</div>
          ) : (
            <ul className="flex flex-col gap-2">
              {tasks.map((t) => (
                <li key={t.id} className="flex items-start gap-3 rounded-xl border border-bone-200 p-4">
                  <input type="checkbox" className="mt-0.5 h-4 w-4 rounded border-bone-300" />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <div className="text-sm font-medium text-ink-900">{t.title}</div>
                      <Badge variant={t.priority === 'HOOG' ? 'danger' : 'neutral'}>{t.priority}</Badge>
                    </div>
                    <div className="mt-0.5 text-xs text-ink-500">Voor {t.dueDate ? formatDate(t.dueDate) : '-'}</div>
                  </div>
                  <button className="btn-ghost"><Icon.ArrowRight className="h-4 w-4" /></button>
                </li>
              ))}
            </ul>
          )}
        </CardBody>
      </Card>
    </PortalShell>
  );
}

function KPI({ tone, label, value }: { tone: 'wood' | 'green' | 'amber'; label: string; value: string }) {
  const cls = {
    wood: 'bg-wood-50 text-wood-700 ring-wood-100',
    green: 'bg-emerald-50 text-emerald-700 ring-emerald-100',
    amber: 'bg-amber-50 text-amber-700 ring-amber-100',
  }[tone];
  return (
    <div className={`rounded-2xl px-4 py-4 ring-1 ${cls}`}>
      <div className="text-[11px] font-medium uppercase tracking-wider opacity-80">{label}</div>
      <div className="mt-1 font-display text-3xl font-semibold">{value}</div>
    </div>
  );
}
