import { PortalShell } from '@/components/portal/PortalShell';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Icon } from '@/components/ui/Icon';
import { currentAdmin } from '@/lib/mock/users';
import { rolePermissions } from '@/lib/security/rbac';

const allPermissions = Array.from(new Set(Object.values(rolePermissions).flat()));

const roleMeta = {
  STUDENT: { name: 'Student', desc: 'Eigen omgeving voor uren, vakantie, documenten en opleiding.' },
  COMPANY: { name: 'Lidbedrijf', desc: 'Eigen studenten, weekstaten goedkeuren en verzuim.' },
  COORDINATOR: { name: 'Coördinator', desc: 'Begeleiding van studenten in eigen regio.' },
  ADMIN: { name: 'Admin', desc: 'Beheer van gebruikers, integraties en logging.' },
} as const;

export default function AdminRollenPage() {
  return (
    <PortalShell
      role="ADMIN"
      activeHref="/admin/rollen"
      userName={currentAdmin.name}
      userSubtitle="Admin"
      greeting={{ title: 'Rollen & rechten', subtitle: 'Permissies per rol (RBAC) + ABAC voor scope.' }}
    >
      <Card>
        <CardBody>
          <div className="overflow-x-auto rounded-xl border border-bone-200">
            <table className="w-full min-w-[840px] border-collapse text-sm">
              <thead>
                <tr>
                  <th className="table-head w-72">Permissie</th>
                  {(['STUDENT', 'COMPANY', 'COORDINATOR', 'ADMIN'] as const).map((r) => (
                    <th key={r} className="table-head text-center">{roleMeta[r].name}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {allPermissions.map((perm) => (
                  <tr key={perm} className="table-row">
                    <td className="table-cell font-mono text-xs">{perm}</td>
                    {(['STUDENT', 'COMPANY', 'COORDINATOR', 'ADMIN'] as const).map((r) => {
                      const has = rolePermissions[r].includes(perm);
                      return (
                        <td key={r} className="table-cell text-center">
                          {has ? (
                            <Icon.CheckCircle className="mx-auto h-5 w-5 text-emerald-600" />
                          ) : (
                            <span className="text-ink-300">–</span>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardBody>
      </Card>

      <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
        {(['STUDENT', 'COMPANY', 'COORDINATOR', 'ADMIN'] as const).map((r) => (
          <Card key={r}>
            <CardBody>
              <div className="flex items-center justify-between">
                <Badge variant={r === 'ADMIN' ? 'wood' : 'neutral'}>{roleMeta[r].name}</Badge>
                <span className="text-xs text-ink-500">{rolePermissions[r].length} rechten</span>
              </div>
              <h3 className="mt-3 font-display text-base font-semibold text-ink-900">{roleMeta[r].name}</h3>
              <p className="mt-1 text-sm text-ink-600">{roleMeta[r].desc}</p>
            </CardBody>
          </Card>
        ))}
      </div>

      <Card className="mt-6">
        <CardHeader title="ABAC scope" subtitle="Attribute Based Access Control" />
        <CardBody>
          <ul className="grid grid-cols-1 gap-3 md:grid-cols-2">
            <Rule label="Student" rule="Mag alleen eigen gegevens zien" />
            <Rule label="Lidbedrijf" rule="Mag alleen studenten met companyId = eigen company zien" />
            <Rule label="Coördinator" rule="Mag alleen studenten met coordinatorId = eigen ID zien" />
            <Rule label="Admin" rule="Mag alles zien — alle acties worden geaudit" />
          </ul>
        </CardBody>
      </Card>
    </PortalShell>
  );
}

function Rule({ label, rule }: { label: string; rule: string }) {
  return (
    <li className="rounded-xl border border-bone-200 px-4 py-3">
      <div className="text-xs font-semibold uppercase tracking-wider text-wood-700">{label}</div>
      <div className="mt-1 text-sm text-ink-700">{rule}</div>
    </li>
  );
}
