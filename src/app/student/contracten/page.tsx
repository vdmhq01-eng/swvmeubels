import { PortalShell } from '@/components/portal/PortalShell';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Icon } from '@/components/ui/Icon';
import { getDemoSession } from '@/lib/data/session';
import { db } from '@/lib/db';
import { formatDate } from '@/lib/utils';

export const dynamic = 'force-dynamic';

export default async function StudentContractenPage() {
  const ctx = getDemoSession('STUDENT');
  const [s, contracts, docs] = await Promise.all([
    db.student.findUnique({ where: { id: ctx.studentId! }, include: { user: true } }),
    db.contract.findMany({ where: { studentId: ctx.studentId! }, include: { company: true }, orderBy: { startDate: 'desc' } }),
    db.document.findMany({ where: { studentId: ctx.studentId!, category: 'CONTRACT' }, orderBy: { uploadedAt: 'desc' } }),
  ]);
  if (!s) return null;

  return (
    <PortalShell
      role="STUDENT"
      activeHref="/student/contracten"
      userName={s.user.name}
      userSubtitle="Student"
      greeting={{ title: 'Mijn contracten', subtitle: 'Praktijkovereenkomsten en wijzigingen.' }}
    >
      {contracts.length === 0 ? (
        <Card>
          <CardBody>
            <div className="text-sm text-ink-500">Nog geen contracten.</div>
          </CardBody>
        </Card>
      ) : contracts.map((c) => (
        <Card key={c.id} className="mb-5">
          <CardBody>
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="grid h-12 w-12 place-items-center rounded-2xl bg-wood-50 text-wood-700 ring-1 ring-wood-100">
                  <Icon.Doc className="h-5 w-5" />
                </div>
                <div>
                  <div className="font-display text-lg font-semibold text-ink-900">{c.company.name}</div>
                  <div className="text-xs text-ink-500">
                    {formatDate(c.startDate)} – {formatDate(c.endDate)}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant={c.status === 'ACTIEF' ? 'success' : c.status === 'AFLOPEND' ? 'warning' : 'neutral'}>{c.status}</Badge>
                <button className="btn-secondary">
                  <Icon.Doc className="h-4 w-4" /> Open document
                </button>
              </div>
            </div>
            <dl className="mt-5 grid grid-cols-2 gap-x-6 gap-y-3 text-sm md:grid-cols-4">
              <Field label="Uren / week" value={`${c.hoursPerWeek} u`} />
              <Field label="Startdatum" value={formatDate(c.startDate)} />
              <Field label="Einddatum" value={formatDate(c.endDate)} />
              <Field label="Contract ID" value={c.id.slice(-8).toUpperCase()} />
            </dl>
          </CardBody>
        </Card>
      ))}

      <Card>
        <CardHeader title="Contractdocumenten" subtitle="Beveiligde, versleutelde opslag" />
        <CardBody>
          {docs.length === 0 ? (
            <div className="text-sm text-ink-500">Geen documenten beschikbaar.</div>
          ) : (
            <ul className="flex flex-col gap-2">
              {docs.map((d) => (
                <li key={d.id} className="flex items-center justify-between rounded-xl border border-bone-200 px-3 py-2 text-sm">
                  <div className="flex items-center gap-3 min-w-0">
                    <Icon.Doc className="h-4 w-4 text-wood-500" />
                    <div className="min-w-0">
                      <div className="truncate font-medium text-ink-900">{d.fileName}</div>
                      <div className="text-xs text-ink-500">Bewaartermijn tot {formatDate(d.retentionUntil)}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Icon.Lock className="h-4 w-4 text-ink-400" />
                    <button className="btn-ghost">Bekijk</button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </CardBody>
      </Card>
    </PortalShell>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-[11px] font-medium uppercase tracking-wider text-ink-500">{label}</dt>
      <dd className="text-sm text-ink-900">{value}</dd>
    </div>
  );
}
