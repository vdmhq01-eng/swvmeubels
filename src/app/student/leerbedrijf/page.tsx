import Link from 'next/link';
import { PortalShell } from '@/components/portal/PortalShell';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { Avatar } from '@/components/ui/Avatar';
import { Icon } from '@/components/ui/Icon';
import { currentStudent } from '@/lib/mock/users';
import { students } from '@/lib/mock/students';
import { companies } from '@/lib/mock/companies';

export default function StudentLeerbedrijfPage() {
  const s = students[0];
  const company = companies.find((c) => c.id === s.companyId)!;
  return (
    <PortalShell
      role="STUDENT"
      activeHref="/student/leerbedrijf"
      userName={currentStudent.name}
      userSubtitle="Student"
      greeting={{ title: 'Mijn leerbedrijf', subtitle: company.name }}
    >
      <Card>
        <CardBody>
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="grid h-14 w-14 place-items-center rounded-2xl bg-wood-50 text-wood-700 ring-1 ring-wood-100">
                <Icon.Briefcase className="h-6 w-6" />
              </div>
              <div>
                <h2 className="font-display text-2xl font-semibold text-ink-900">{company.name}</h2>
                <p className="text-sm text-ink-500">Regio {company.region} · CBM-lid</p>
              </div>
            </div>
            <Link href="/student/berichten" className="btn-primary">
              <Icon.Bell className="h-4 w-4" />
              Stuur bericht
            </Link>
          </div>
        </CardBody>
      </Card>

      <div className="mt-6 grid grid-cols-1 gap-5 lg:grid-cols-2">
        <Card>
          <CardHeader title="Praktijkopleider" subtitle="Jouw eerste aanspreekpunt" />
          <CardBody>
            <div className="flex items-center gap-3">
              <Avatar name={company.contactName} tone="wood" />
              <div>
                <div className="text-sm font-medium text-ink-900">{company.contactName}</div>
                <div className="text-xs text-ink-500">Praktijkopleider</div>
              </div>
            </div>
            <dl className="mt-4 space-y-2 text-sm">
              <Row icon={<Icon.Bell className="h-4 w-4 text-ink-500" />} label="E-mail" value={company.contactEmail} />
              <Row icon={<Icon.Clock className="h-4 w-4 text-ink-500" />} label="Telefoon" value={company.contactPhone} />
              <Row icon={<Icon.Briefcase className="h-4 w-4 text-ink-500" />} label="Regio" value={company.region} />
            </dl>
          </CardBody>
        </Card>

        <Card>
          <CardHeader title="Werkdagen & uren" subtitle="Afspraken volgens contract" />
          <CardBody>
            <ul className="grid grid-cols-7 gap-2 text-center text-sm">
              {['Ma', 'Di', 'Wo', 'Do', 'Vr', 'Za', 'Zo'].map((d, i) => (
                <li
                  key={d}
                  className={`rounded-xl border px-1 py-3 ${
                    i === 2
                      ? 'border-sky-100 bg-sky-50 text-sky-700'
                      : i < 5
                      ? 'border-wood-100 bg-wood-50 text-wood-700'
                      : 'border-bone-200 bg-bone-50 text-ink-400'
                  }`}
                >
                  <div className="font-medium">{d}</div>
                  <div className="mt-1 text-[11px] opacity-80">
                    {i === 2 ? 'School' : i < 5 ? 'Werk' : '-'}
                  </div>
                </li>
              ))}
            </ul>
            <div className="mt-4 grid grid-cols-3 gap-3 text-sm">
              <Mini label="Praktijk" value="32 u" />
              <Mini label="School" value="7 u" />
              <Mini label="Norm" value="38 u" />
            </div>
          </CardBody>
        </Card>
      </div>
    </PortalShell>
  );
}

function Row({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3">
      {icon}
      <div className="flex-1">
        <div className="text-[11px] uppercase tracking-wider text-ink-500">{label}</div>
        <div className="text-ink-900">{value}</div>
      </div>
    </div>
  );
}

function Mini({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-bone-200 bg-bone-50 px-3 py-2 text-center">
      <div className="text-[11px] uppercase tracking-wider text-ink-500">{label}</div>
      <div className="text-base font-semibold text-ink-900">{value}</div>
    </div>
  );
}
