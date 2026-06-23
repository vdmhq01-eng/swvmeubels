import Link from 'next/link';
import { PortalShell } from '@/components/portal/PortalShell';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { Avatar } from '@/components/ui/Avatar';
import { Icon } from '@/components/ui/Icon';
import { EmptyState } from '@/components/ui/EmptyState';
import { getDemoSession } from '@/lib/data/session';
import { getStudentWithCompany } from '@/lib/data/student-pages';

export const dynamic = 'force-dynamic';

export default async function StudentLeerbedrijfPage() {
  const ctx = getDemoSession('STUDENT');
  const s = await getStudentWithCompany(ctx.studentId!);

  if (!s) {
    return (
      <PortalShell role="STUDENT" activeHref="/student/leerbedrijf" userName="Demo" userSubtitle="Student">
        <EmptyState
          icon={<Icon.Briefcase className="h-5 w-5" />}
          title="Geen leerbedrijf gegevens"
          description="Geen verbinding met de database, of seed nog niet uitgevoerd."
        />
      </PortalShell>
    );
  }

  const contact = s.company.contacts[0];

  return (
    <PortalShell
      role="STUDENT"
      activeHref="/student/leerbedrijf"
      userName={s.user.name}
      userSubtitle="Student"
      greeting={{ title: 'Mijn leerbedrijf', subtitle: s.company.name }}
    >
      <Card>
        <CardBody>
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="grid h-14 w-14 place-items-center rounded-2xl bg-primary-50 text-primary-700 ring-1 ring-primary-100">
                <Icon.Briefcase className="h-6 w-6" />
              </div>
              <div>
                <h2 className="font-display text-2xl font-bold text-ink-900">{s.company.name}</h2>
                <p className="text-sm text-ink-500">Regio {s.company.region.name} · {s.company.membership}-lid</p>
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
            {contact ? (
              <>
                <div className="flex items-center gap-3">
                  <Avatar name={contact.user.name} tone="wood" />
                  <div>
                    <div className="text-sm font-medium text-ink-900">{contact.user.name}</div>
                    <div className="text-xs text-ink-500">{contact.role}</div>
                  </div>
                </div>
                <dl className="mt-4 space-y-2 text-sm">
                  <RowDef icon={<Icon.Bell className="h-4 w-4 text-ink-500" />} label="E-mail" value={contact.user.email} />
                  <RowDef icon={<Icon.Briefcase className="h-4 w-4 text-ink-500" />} label="Regio" value={s.company.region.name} />
                </dl>
              </>
            ) : (
              <div className="text-sm text-ink-500">Geen contactpersoon bekend.</div>
            )}
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
                      ? 'border-primary-100 bg-primary-50 text-primary-700'
                      : 'border-bone-200 bg-bone-50 text-ink-400'
                  }`}
                >
                  <div className="font-medium">{d}</div>
                  <div className="mt-1 text-[11px] opacity-80">{i === 2 ? 'School' : i < 5 ? 'Werk' : '-'}</div>
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

function RowDef({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
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
