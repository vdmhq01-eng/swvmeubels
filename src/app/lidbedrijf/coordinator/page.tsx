import { PortalShell } from '@/components/portal/PortalShell';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { Avatar } from '@/components/ui/Avatar';
import { Icon } from '@/components/ui/Icon';
import { currentCompany } from '@/lib/mock/users';
import { coordinators } from '@/lib/mock/users';

export default function LidbedrijfCoordinatorPage() {
  const c = coordinators[0];
  return (
    <PortalShell
      role="COMPANY"
      activeHref="/lidbedrijf/coordinator"
      userName={currentCompany.name}
      userSubtitle="Lidbedrijf"
      greeting={{ title: 'Contact coördinator', subtitle: 'Jouw vaste aanspreekpunt bij SWV.' }}
    >
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardBody>
            <div className="flex items-start gap-4">
              <Avatar name={c.name} size="lg" tone="green" />
              <div className="flex-1">
                <h2 className="font-display text-2xl font-semibold text-ink-900">{c.name}</h2>
                <div className="text-sm text-ink-500">Coördinator regio Noord</div>
                <dl className="mt-4 grid grid-cols-2 gap-x-6 gap-y-3 text-sm">
                  <Field label="E-mail" value={c.email} />
                  <Field label="Telefoon" value={c.phone} />
                  <Field label="Studenten in regio" value={c.studentCount.toString()} />
                  <Field label="Reactietijd" value="Binnen 1 werkdag" />
                </dl>
              </div>
            </div>
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
