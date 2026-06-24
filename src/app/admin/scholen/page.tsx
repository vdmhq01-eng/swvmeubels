import { PortalShell } from '@/components/portal/PortalShell';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Icon } from '@/components/ui/Icon';
import { currentAdmin } from '@/lib/mock/users';

export const dynamic = 'force-dynamic';

type School = {
  id: string;
  naam: string;
  plaats: string;
  regio: string;
  opleidingen: string[];
  contact: string;
  email: string;
  telefoon: string;
  studenten: number;
};

const scholen: School[] = [
  { id: 'sch-noorderpoort', naam: 'Noorderpoort', plaats: 'Groningen', regio: 'Noord-Nederland', opleidingen: ['Meubelmaker BBL 2', 'Interieurbouwer BBL 3'], contact: 'Erik Kamp', email: 'e.kamp@noorderpoort.nl', telefoon: '050 595 0000', studenten: 24 },
  { id: 'sch-friesepoort', naam: 'Friese Poort', plaats: 'Leeuwarden', regio: 'Noord-Nederland', opleidingen: ['Houtbewerker BBL 2'], contact: 'Marieke Tjerks', email: 'm.tjerks@friesepoort.nl', telefoon: '058 233 8000', studenten: 12 },
  { id: 'sch-roc-twente', naam: 'ROC van Twente', plaats: 'Hengelo', regio: 'Twente-Salland', opleidingen: ['Meubelmaker BBL 2', 'Interieurbouwer BBL 3', 'Houtbewerker BBL 2'], contact: 'Bart Wesselink', email: 'b.wesselink@rocvantwente.nl', telefoon: '074 852 5252', studenten: 31 },
  { id: 'sch-deltion', naam: 'Deltion College', plaats: 'Zwolle', regio: 'Twente-Salland', opleidingen: ['Meubelmaker BBL 2'], contact: 'Annelies Boer', email: 'a.boer@deltion.nl', telefoon: '038 850 0000', studenten: 18 },
  { id: 'sch-roc-amsterdam', naam: 'ROC van Amsterdam', plaats: 'Amsterdam', regio: 'Noord-Holland', opleidingen: ['Interieurbouwer BBL 3'], contact: 'Daan de Bruin', email: 'd.debruin@rocva.nl', telefoon: '020 579 2222', studenten: 27 },
  { id: 'sch-da-vinci', naam: 'Da Vinci College', plaats: 'Dordrecht', regio: 'Rotterdam', opleidingen: ['Meubelmaker BBL 2', 'Scheepsinterieurbouwer'], contact: 'Frank Visser', email: 'f.visser@davinci.nl', telefoon: '078 750 0100', studenten: 22 },
];

export default async function ScholenPage() {
  const totaalStudenten = scholen.reduce((s, sc) => s + sc.studenten, 0);
  const regios = Array.from(new Set(scholen.map((s) => s.regio)));

  return (
    <PortalShell
      role="ADMIN"
      activeHref="/admin/scholen"
      userName={currentAdmin.name}
      userSubtitle="Binnendienst"
      greeting={{
        title: 'Scholen',
        subtitle: 'Onderwijspartners — opleidingen, contactgegevens, studenten per school.',
      }}
    >
      {/* KPIs */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <Stat label="Scholen" value={`${scholen.length}`} tone="navy" icon={<Icon.BookOpen className="h-5 w-5" />} />
        <Stat label="Studenten op school" value={`${totaalStudenten}`} tone="primary" icon={<Icon.Users className="h-5 w-5" />} />
        <Stat label="Regio's gedekt" value={`${regios.length}`} tone="emerald" icon={<Icon.Activity className="h-5 w-5" />} />
        <Stat label="Doel demo" value="100" tone="amber" icon={<Icon.AlertTriangle className="h-5 w-5" />} />
      </div>

      <Card className="mt-6">
        <CardHeader
          title="Onderwijspartners"
          subtitle="Vervangt Excel-lijst en losse Outlook-contacten"
          action={
            <button className="btn-primary">
              <Icon.Plus className="h-4 w-4" /> School toevoegen
            </button>
          }
        />
        <CardBody>
          <div className="overflow-x-auto rounded-xl border border-bone-200">
            <table className="w-full min-w-[760px] border-collapse text-sm">
              <thead>
                <tr>
                  <th className="table-head">School</th>
                  <th className="table-head">Regio</th>
                  <th className="table-head">Contactpersoon</th>
                  <th className="table-head">Opleidingen</th>
                  <th className="table-head text-right">Studenten</th>
                  <th className="table-head"></th>
                </tr>
              </thead>
              <tbody>
                {scholen.map((s) => (
                  <tr key={s.id} className="table-row">
                    <td className="table-cell">
                      <div className="font-medium text-ink-900">{s.naam}</div>
                      <div className="text-xs text-ink-500">{s.plaats}</div>
                    </td>
                    <td className="table-cell text-ink-600">{s.regio}</td>
                    <td className="table-cell">
                      <div className="text-ink-900">{s.contact}</div>
                      <div className="text-xs text-ink-500">
                        <a href={`mailto:${s.email}`} className="hover:text-primary-600">{s.email}</a>
                      </div>
                    </td>
                    <td className="table-cell">
                      <div className="flex flex-wrap gap-1">
                        {s.opleidingen.map((o) => (
                          <Badge key={o} variant="wood">{o}</Badge>
                        ))}
                      </div>
                    </td>
                    <td className="table-cell text-right font-semibold">{s.studenten}</td>
                    <td className="table-cell text-right">
                      <button className="btn-ghost">
                        Open<Icon.ArrowRight className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardBody>
      </Card>
    </PortalShell>
  );
}

function Stat({ label, value, tone, icon }: { label: string; value: string; tone: 'navy' | 'primary' | 'emerald' | 'amber'; icon: React.ReactNode }) {
  const cls = {
    navy: 'bg-navy-600 text-white',
    primary: 'bg-primary-500 text-white',
    emerald: 'bg-emerald-600 text-white',
    amber: 'bg-amber-500 text-white',
  }[tone];
  return (
    <div className="card-padded">
      <div className={`grid h-10 w-10 place-items-center rounded-md ${cls}`}>{icon}</div>
      <div className="mt-3 font-display text-2xl font-bold text-ink-900">{value}</div>
      <div className="text-xs font-semibold uppercase tracking-wider text-ink-500">{label}</div>
    </div>
  );
}
