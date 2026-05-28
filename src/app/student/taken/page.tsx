import { PortalShell } from '@/components/portal/PortalShell';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Icon } from '@/components/ui/Icon';
import { currentStudent } from '@/lib/mock/users';
import { tasks } from '@/lib/mock/misc';
import { formatDate } from '@/lib/utils';

export default function StudentTakenPage() {
  const mine = tasks.filter((t) => t.studentId === 'stu-001');
  const open = mine.filter((t) => t.status === 'OPEN').length;
  return (
    <PortalShell
      role="STUDENT"
      activeHref="/student/taken"
      userName={currentStudent.name}
      userSubtitle="Student"
      greeting={{ title: 'Taken', subtitle: 'Wat moet je nog doen?' }}
    >
      <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
        <KPI tone="amber" label="Open" value={open.toString()} />
        <KPI tone="wood" label="In behandeling" value="0" />
        <KPI tone="green" label="Afgerond" value="12" />
      </div>

      <Card className="mt-6">
        <CardHeader title="Alle taken" subtitle="Filter op status, prioriteit of einddatum" />
        <CardBody>
          <ul className="flex flex-col gap-2">
            {mine.map((t) => (
              <li key={t.id} className="flex items-start gap-3 rounded-xl border border-bone-200 p-4">
                <input type="checkbox" className="mt-0.5 h-4 w-4 rounded border-bone-300" />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <div className="text-sm font-medium text-ink-900">{t.title}</div>
                    <Badge variant={t.priority === 'HOOG' ? 'danger' : 'neutral'}>{t.priority}</Badge>
                  </div>
                  <div className="mt-0.5 text-xs text-ink-500">
                    Voor {t.dueDate ? formatDate(t.dueDate) : '-'}
                  </div>
                </div>
                <button className="btn-ghost">
                  <Icon.ArrowRight className="h-4 w-4" />
                </button>
              </li>
            ))}
          </ul>
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
