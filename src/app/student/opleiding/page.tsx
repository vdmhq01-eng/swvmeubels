import { PortalShell } from '@/components/portal/PortalShell';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Icon } from '@/components/ui/Icon';
import { currentStudent } from '@/lib/mock/users';
import { students } from '@/lib/mock/students';
import { programs } from '@/lib/mock/programs';

export default function OpleidingPage() {
  const s = students[0];
  const program = programs.find((p) => p.id === s.programId)!;
  return (
    <PortalShell
      role="STUDENT"
      activeHref="/student/opleiding"
      userName={currentStudent.name}
      userSubtitle="Student"
      greeting={{ title: 'Mijn opleiding', subtitle: `${program.name} ${program.level}` }}
    >
      <Card>
        <CardBody>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <div className="text-xs font-medium uppercase tracking-wider text-ink-500">Voortgang</div>
              <div className="mt-1 font-display text-3xl font-semibold text-ink-900">65%</div>
              <div className="mt-1 text-sm text-ink-500">Je bent halverwege niveau 3.</div>
            </div>
            <div className="flex gap-2">
              <Badge variant="info">Jaar {s.yearOfStudy}</Badge>
              <Badge variant="success">Goed</Badge>
            </div>
          </div>
          <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-bone-100">
            <div className="h-full rounded-full bg-wood-500" style={{ width: '65%' }} />
          </div>
        </CardBody>
      </Card>

      <div className="mt-6 grid grid-cols-1 gap-5 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader title="Modules" subtitle="Status per moduleblok" />
          <CardBody>
            <ul className="flex flex-col gap-2">
              {modules.map((m) => (
                <li key={m.title} className="flex items-center justify-between rounded-xl border border-bone-200 px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="grid h-9 w-9 place-items-center rounded-xl bg-wood-50 text-wood-700 ring-1 ring-wood-100">
                      <Icon.BookOpen className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-ink-900">{m.title}</div>
                      <div className="text-xs text-ink-500">{m.sub}</div>
                    </div>
                  </div>
                  <Badge variant={m.variant}>{m.status}</Badge>
                </li>
              ))}
            </ul>
          </CardBody>
        </Card>

        <Card>
          <CardHeader title="Diploma" subtitle="Verwachte uitreiking" />
          <CardBody>
            <div className="grid place-items-center rounded-2xl border border-wood-100 bg-wood-50 p-6 text-center">
              <Icon.BookOpen className="h-10 w-10 text-wood-700" />
              <div className="mt-3 text-xs font-semibold uppercase tracking-wider text-wood-700">
                Diploma-uitreiking
              </div>
              <div className="font-display text-2xl font-semibold text-ink-900">25 juni 2026</div>
              <div className="mt-1 text-xs text-ink-600">Reserveer 2 plaatsen voor familie.</div>
            </div>
            <div className="mt-4 space-y-2 text-sm">
              <Row label="Praktijkbeoordeling N3" status="Gepland" tone="info" />
              <Row label="Examen theorie" status="Gepland" tone="info" />
              <Row label="Portfolio compleet" status="Open" tone="warning" />
            </div>
          </CardBody>
        </Card>
      </div>
    </PortalShell>
  );
}

const modules: { title: string; sub: string; status: string; variant: 'success' | 'warning' | 'info' }[] = [
  { title: 'Materialenkennis', sub: 'Periode 1', status: 'Voldoende', variant: 'success' },
  { title: 'Maatvoering en tekenen', sub: 'Periode 1', status: 'Goed', variant: 'success' },
  { title: 'Constructiewerk', sub: 'Periode 2', status: 'Voldoende', variant: 'success' },
  { title: 'Werkvoorbereiding', sub: 'Periode 3', status: 'In behandeling', variant: 'info' },
  { title: 'Afwerktechnieken', sub: 'Periode 4', status: 'Open', variant: 'warning' },
];

function Row({ label, status, tone }: { label: string; status: string; tone: 'success' | 'warning' | 'info' }) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-bone-200 px-3 py-2">
      <span className="text-ink-700">{label}</span>
      <Badge variant={tone}>{status}</Badge>
    </div>
  );
}
