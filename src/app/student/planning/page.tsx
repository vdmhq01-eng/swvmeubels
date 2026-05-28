import { PortalShell } from '@/components/portal/PortalShell';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Icon } from '@/components/ui/Icon';
import { currentStudent } from '@/lib/mock/users';
import { planningItems } from '@/lib/mock/misc';
import { formatDate } from '@/lib/utils';

const labels: Record<string, string> = {
  SCHOOLDAG: 'Schooldag',
  BPV: 'BPV',
  EVALUATIE: 'Evaluatie',
  PRAKTIJKBEOORDELING: 'Praktijkbeoordeling',
  EXAMEN: 'Examen',
  DIPLOMA: 'Diploma',
  UITSTROOM: 'Uitstroom',
  NIEUWE_OPLEIDING: 'Nieuwe opleiding',
};

export default function StudentPlanningPage() {
  return (
    <PortalShell
      role="STUDENT"
      activeHref="/student/planning"
      userName={currentStudent.name}
      userSubtitle="Student"
      greeting={{ title: 'Planning schooljaar', subtitle: 'Schooldagen, BPV, evaluaties en examens.' }}
    >
      <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
        <KPI icon={<Icon.Calendar className="h-5 w-5" />} label="Komende week" value="2 items" />
        <KPI icon={<Icon.BookOpen className="h-5 w-5" />} label="Examens" value="1 gepland" />
        <KPI icon={<Icon.Briefcase className="h-5 w-5" />} label="BPV periodes" value="1 actief" />
      </div>

      <Card className="mt-6">
        <CardHeader title="Komende maanden" subtitle="Alle items op tijdlijn" />
        <CardBody>
          <ol className="relative ml-3 border-l border-bone-200">
            {planningItems.map((p) => (
              <li key={p.id} className="mb-5 pl-4 last:mb-0">
                <span className="absolute -left-[7px] grid h-3.5 w-3.5 place-items-center rounded-full bg-wood-500 ring-2 ring-white" />
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <div className="text-sm font-medium text-ink-900">{p.title}</div>
                    <div className="text-xs text-ink-500">
                      {p.endDate ? `${formatDate(p.startDate)} – ${formatDate(p.endDate)}` : formatDate(p.startDate)}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="wood">{labels[p.type] ?? p.type}</Badge>
                    <Badge variant={p.status === 'BEVESTIGD' ? 'success' : 'neutral'}>
                      {p.status === 'BEVESTIGD' ? 'Bevestigd' : 'Gepland'}
                    </Badge>
                  </div>
                </div>
              </li>
            ))}
          </ol>
        </CardBody>
      </Card>
    </PortalShell>
  );
}

function KPI({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="card-padded">
      <div className="grid h-10 w-10 place-items-center rounded-xl bg-wood-50 text-wood-700 ring-1 ring-wood-100">
        {icon}
      </div>
      <div className="mt-3 text-xs font-medium uppercase tracking-wider text-ink-500">{label}</div>
      <div className="mt-1 font-display text-2xl font-semibold text-ink-900">{value}</div>
    </div>
  );
}
