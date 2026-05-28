import Link from 'next/link';
import { PortalShell } from '@/components/portal/PortalShell';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import { Toolbar, FilterChip } from '@/components/ui/Toolbar';
import { Icon } from '@/components/ui/Icon';
import { currentCompany } from '@/lib/mock/users';
import { students } from '@/lib/mock/students';
import { programs } from '@/lib/mock/programs';

export default function LidbedrijfStudentenPage() {
  const mine = students.filter((s) => s.companyId === 'comp-001' || s.companyId === 'comp-002');
  return (
    <PortalShell
      role="COMPANY"
      activeHref="/lidbedrijf/studenten"
      userName={currentCompany.name}
      userSubtitle="Lidbedrijf"
      greeting={{ title: 'Mijn studenten', subtitle: 'Studenten die bij ons in de leer zijn.' }}
    >
      <Card>
        <CardBody>
          <Toolbar placeholder="Zoek student…">
            <FilterChip label="Alle" active />
            <FilterChip label="Aandacht" />
            <FilterChip label="Risico" />
          </Toolbar>
        </CardBody>
      </Card>

      <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2">
        {mine.map((s) => {
          const p = programs.find((x) => x.id === s.programId)!;
          return (
            <Card key={s.id}>
              <CardBody>
                <div className="flex items-start gap-3">
                  <Avatar name={s.name} tone="wood" />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div className="font-display text-lg font-semibold text-ink-900">{s.name}</div>
                      <Badge variant={s.signal === 'Goed' ? 'success' : s.signal === 'Aandacht' ? 'warning' : 'danger'}>
                        {s.signal}
                      </Badge>
                    </div>
                    <div className="text-sm text-ink-500">{p.name} {p.level} · jaar {s.yearOfStudy}</div>
                    <div className="mt-3 grid grid-cols-3 gap-2 text-xs text-ink-600">
                      <Mini label="Uren wk" value="35 u" />
                      <Mini label="Verzuim" value="0" />
                      <Mini label="Taken" value="2" />
                    </div>
                    <div className="mt-3 flex justify-end">
                      <Link href="/lidbedrijf/uren" className="btn-ghost">
                        Bekijk uren <Icon.ArrowRight className="h-4 w-4" />
                      </Link>
                    </div>
                  </div>
                </div>
              </CardBody>
            </Card>
          );
        })}
      </div>
    </PortalShell>
  );
}

function Mini({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-bone-200 bg-bone-50 px-2 py-1 text-center">
      <div className="text-[10px] uppercase tracking-wider text-ink-500">{label}</div>
      <div className="text-sm font-semibold text-ink-900">{value}</div>
    </div>
  );
}
