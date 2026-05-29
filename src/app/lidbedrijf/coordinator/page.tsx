import { PortalShell } from '@/components/portal/PortalShell';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { Avatar } from '@/components/ui/Avatar';
import { Icon } from '@/components/ui/Icon';
import { getDemoSession } from '@/lib/data/session';
import { db } from '@/lib/db';

export const dynamic = 'force-dynamic';

export default async function LidbedrijfCoordinatorPage() {
  const ctx = getDemoSession('COMPANY');
  const [contact, anyStudent] = await Promise.all([
    db.companyContact.findFirst({ where: { companyId: ctx.companyId! }, include: { user: true, company: true } }),
    db.student.findFirst({
      where: { companyId: ctx.companyId! },
      include: { coordinator: { include: { user: true, region: true, _count: { select: { students: true } } } } },
    }),
  ]);
  const coord = anyStudent?.coordinator;

  return (
    <PortalShell
      role="COMPANY"
      activeHref="/lidbedrijf/coordinator"
      userName={contact?.user.name ?? 'Lidbedrijf'}
      userSubtitle={contact?.company.name ?? 'Lidbedrijf'}
      greeting={{ title: 'Contact coördinator', subtitle: 'Jouw vaste aanspreekpunt bij SWV.' }}
    >
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardBody>
            {coord ? (
              <div className="flex items-start gap-4">
                <Avatar name={coord.user.name} size="lg" tone="green" />
                <div className="flex-1">
                  <h2 className="font-display text-2xl font-semibold text-ink-900">{coord.user.name}</h2>
                  <div className="text-sm text-ink-500">Coördinator regio {coord.region.name}</div>
                  <dl className="mt-4 grid grid-cols-2 gap-x-6 gap-y-3 text-sm">
                    <Field label="E-mail" value={coord.user.email} />
                    <Field label="Studenten in regio" value={`${coord._count.students}`} />
                    <Field label="Reactietijd" value="Binnen 1 werkdag" />
                    <Field label="Regio" value={coord.region.name} />
                  </dl>
                </div>
              </div>
            ) : (
              <div className="text-sm text-ink-500">Geen coördinator gekoppeld.</div>
            )}
          </CardBody>
        </Card>

        <Card>
          <CardHeader title="Stuur bericht" />
          <CardBody className="space-y-3">
            <input className="input" placeholder="Onderwerp" />
            <textarea rows={5} className="input" placeholder="Bericht…" />
            <button className="btn-primary w-full">
              <Icon.Check className="h-4 w-4" />
              Verstuur
            </button>
          </CardBody>
        </Card>
      </div>
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
