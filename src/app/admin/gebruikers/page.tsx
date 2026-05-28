import { PortalShell } from '@/components/portal/PortalShell';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import { Toolbar, FilterChip } from '@/components/ui/Toolbar';
import { Icon } from '@/components/ui/Icon';
import { currentAdmin } from '@/lib/mock/users';
import { allUsers } from '@/lib/mock/admin';
import { formatDate } from '@/lib/utils';

const roleLabel: Record<string, string> = {
  ADMIN: 'Admin',
  COORDINATOR: 'Coördinator',
  COMPANY: 'Lidbedrijf',
  STUDENT: 'Student',
};

export default function AdminGebruikersPage() {
  return (
    <PortalShell
      role="ADMIN"
      activeHref="/admin/gebruikers"
      userName={currentAdmin.name}
      userSubtitle="Admin"
      greeting={{ title: 'Gebruikersbeheer', subtitle: `${allUsers.length} accounts in het systeem` }}
    >
      <Card>
        <CardBody>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <Toolbar placeholder="Zoek op naam of e-mail…">
              <FilterChip label="Alle" active />
              <FilterChip label="Admins" />
              <FilterChip label="Coördinatoren" />
              <FilterChip label="Lidbedrijven" />
              <FilterChip label="Studenten" />
            </Toolbar>
            <button className="btn-primary">
              <Icon.Plus className="h-4 w-4" /> Nieuwe gebruiker
            </button>
          </div>
        </CardBody>
      </Card>

      <Card className="mt-6">
        <CardHeader title="Accounts" />
        <CardBody>
          <div className="overflow-x-auto rounded-xl border border-bone-200">
            <table className="w-full min-w-[760px] border-collapse text-sm">
              <thead>
                <tr>
                  <th className="table-head">Gebruiker</th>
                  <th className="table-head">Rol</th>
                  <th className="table-head">2FA</th>
                  <th className="table-head">Laatste login</th>
                  <th className="table-head">Aangemaakt</th>
                  <th className="table-head"></th>
                </tr>
              </thead>
              <tbody>
                {allUsers.map((u) => (
                  <tr key={u.id} className="table-row">
                    <td className="table-cell">
                      <div className="flex items-center gap-3">
                        <Avatar name={u.name} size="sm" tone="wood" />
                        <div>
                          <div className="font-medium text-ink-900">{u.name}</div>
                          <div className="text-xs text-ink-500">{u.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="table-cell">
                      <Badge variant={u.role === 'ADMIN' ? 'wood' : 'neutral'}>{roleLabel[u.role]}</Badge>
                    </td>
                    <td className="table-cell">
                      {u.twoFactorEnabled ? (
                        <Badge variant="success">Actief</Badge>
                      ) : u.role === 'ADMIN' ? (
                        <Badge variant="danger">Verplicht</Badge>
                      ) : (
                        <Badge variant="neutral">Optioneel</Badge>
                      )}
                    </td>
                    <td className="table-cell text-xs text-ink-500">
                      {u.lastLoginAt ? formatDate(u.lastLoginAt) : '-'}
                    </td>
                    <td className="table-cell text-xs text-ink-500">{formatDate(u.createdAt)}</td>
                    <td className="table-cell text-right">
                      <button className="btn-ghost">
                        <Icon.Settings className="h-4 w-4" />
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
