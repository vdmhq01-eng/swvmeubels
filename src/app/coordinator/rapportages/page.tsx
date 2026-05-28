import { PortalShell } from '@/components/portal/PortalShell';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { Icon } from '@/components/ui/Icon';
import { currentCoordinator } from '@/lib/mock/users';

const reports = [
  { title: 'Urentotalen per student', sub: 'Per maand / kwartaal / schooljaar' },
  { title: 'Verzuim ontwikkeling', sub: 'Per regio, per opleiding' },
  { title: 'Contractstatus', sub: 'Aflopend, verlopen, nieuwe' },
  { title: 'Diploma kandidaten', sub: 'Per schooljaar' },
  { title: 'Uitstroom', sub: 'Reden van uitstroom' },
  { title: 'Praktijkbeoordelingen', sub: 'Verdeling resultaten' },
];

export default function CoordinatorRapportagesPage() {
  return (
    <PortalShell
      role="COORDINATOR"
      activeHref="/coordinator/rapportages"
      userName={currentCoordinator.name}
      userSubtitle="Coördinator regio Noord"
      greeting={{ title: 'Rapportages', subtitle: 'Genereer en exporteer rapportages.' }}
    >
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
        {reports.map((r) => (
          <Card key={r.title}>
            <CardBody>
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-wood-50 text-wood-700 ring-1 ring-wood-100">
                <Icon.Activity className="h-5 w-5" />
              </div>
              <h3 className="mt-3 font-display text-lg font-semibold text-ink-900">{r.title}</h3>
              <p className="mt-1 text-sm text-ink-500">{r.sub}</p>
              <div className="mt-4 flex gap-2">
                <button className="btn-secondary">Bekijken</button>
                <button className="btn-primary">
                  <Icon.Doc className="h-4 w-4" /> Exporteer
                </button>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>

      <Card className="mt-6">
        <CardHeader title="Gepland & terugkerend" subtitle="Automatische verzending per e-mail" />
        <CardBody>
          <ul className="divide-y divide-bone-100">
            {[
              { name: 'Maandelijks urenoverzicht', schedule: 'Eerste maandag · 08:00' },
              { name: 'Wekelijkse signalen', schedule: 'Maandag · 09:00' },
            ].map((r) => (
              <li key={r.name} className="flex items-center justify-between py-3 first:pt-0 last:pb-0">
                <div className="flex items-center gap-3">
                  <Icon.Refresh className="h-4 w-4 text-ink-500" />
                  <div>
                    <div className="text-sm font-medium text-ink-900">{r.name}</div>
                    <div className="text-xs text-ink-500">{r.schedule}</div>
                  </div>
                </div>
                <button className="btn-ghost">Beheer</button>
              </li>
            ))}
          </ul>
        </CardBody>
      </Card>
    </PortalShell>
  );
}
