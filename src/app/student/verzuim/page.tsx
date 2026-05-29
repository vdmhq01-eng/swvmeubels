import { PortalShell } from '@/components/portal/PortalShell';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Icon } from '@/components/ui/Icon';
import { getDemoSession } from '@/lib/data/session';
import { db } from '@/lib/db';
import { formatDate } from '@/lib/utils';

export const dynamic = 'force-dynamic';

export default async function StudentVerzuimPage() {
  const ctx = getDemoSession('STUDENT');
  const [s, absences] = await Promise.all([
    db.student.findUnique({ where: { id: ctx.studentId! }, include: { user: true } }),
    db.absence.findMany({ where: { studentId: ctx.studentId! }, orderBy: { startDate: 'desc' } }),
  ]);
  if (!s) return null;
  const open = absences.filter((a) => !a.closedAt).length;

  return (
    <PortalShell
      role="STUDENT"
      activeHref="/student/verzuim"
      userName={s.user.name}
      userSubtitle="Student"
      greeting={{ title: 'Verzuim', subtitle: 'Ziekmelden, betermelden en historie.' }}
    >
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader title="Ziekmelden" subtitle="Doe dit zo vroeg mogelijk op je werkdag" />
          <CardBody className="space-y-3">
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <div>
                <label className="label mb-1 block">Eerste ziektedag</label>
                <input type="date" className="input" />
              </div>
              <div>
                <label className="label mb-1 block">Verwacht beter (optioneel)</label>
                <input type="date" className="input" />
              </div>
            </div>
            <div>
              <label className="label mb-1 block">Toelichting (zichtbaar voor coördinator)</label>
              <textarea rows={3} className="input" placeholder="Bijvoorbeeld: verkouden, blijf vandaag thuis." />
            </div>
            <div className="flex items-start gap-2 rounded-xl bg-bone-50 p-3 text-xs text-ink-600">
              <Icon.Shield className="h-4 w-4 shrink-0 text-wood-500" />
              <span>
                Je medische gegevens worden niet opgeslagen. Alleen je leerbedrijf en coördinator
                zien dat je ziek bent gemeld.
              </span>
            </div>
            <button className="btn-primary w-full">
              <Icon.Heart className="h-4 w-4" />
              Meld ziek
            </button>
          </CardBody>
        </Card>

        <Card>
          <CardHeader title="Status" />
          <CardBody>
            <div className="grid place-items-center rounded-2xl border border-rose-100 bg-rose-50 p-6 text-center">
              <Icon.Heart className="h-9 w-9 text-rose-700" />
              <div className="mt-3 text-xs font-semibold uppercase tracking-wider text-rose-700">
                Open meldingen
              </div>
              <div className="font-display text-3xl font-semibold text-ink-900">{open}</div>
            </div>
            <button className="btn-secondary mt-4 w-full">
              <Icon.CheckCircle className="h-4 w-4" /> Beter melden
            </button>
          </CardBody>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader title="Historie" />
        <CardBody>
          {absences.length === 0 ? (
            <div className="text-sm text-ink-500">Geen verzuim meldingen.</div>
          ) : (
            <ul className="divide-y divide-bone-100">
              {absences.map((a) => (
                <li key={a.id} className="flex items-center justify-between gap-3 py-3 first:pt-0 last:pb-0">
                  <div className="flex items-center gap-3">
                    <div className="grid h-9 w-9 place-items-center rounded-xl bg-rose-50 text-rose-700 ring-1 ring-rose-100">
                      <Icon.Heart className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-ink-900">
                        {a.type === 'ZIEKTE' ? 'Ziekmelding' : 'Verlof'}
                      </div>
                      <div className="text-xs text-ink-500">
                        {formatDate(a.startDate)}{a.endDate ? ` – ${formatDate(a.endDate)}` : ' – open'}
                      </div>
                    </div>
                  </div>
                  <Badge variant={a.closedAt ? 'success' : 'warning'}>
                    {a.closedAt ? 'Gesloten' : 'Open'}
                  </Badge>
                </li>
              ))}
            </ul>
          )}
        </CardBody>
      </Card>
    </PortalShell>
  );
}
