import Link from 'next/link';
import { PortalShell } from '@/components/portal/PortalShell';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import { Icon } from '@/components/ui/Icon';
import { currentAdmin } from '@/lib/mock/users';
import { db } from '@/lib/db';
import { detectAccessAnomalies } from '@/lib/security/access-log';

export const dynamic = 'force-dynamic';

function formatTime(d: Date) {
  return new Intl.DateTimeFormat('nl-NL', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  }).format(d);
}

export default async function ToegangslogPage() {
  const [recentAccess, anomalies, exports, scopeViolations] = await Promise.all([
    db.documentAccessLog
      .findMany({
        orderBy: { accessedAt: 'desc' },
        take: 50,
        include: { user: { select: { name: true, email: true, role: true } } },
      })
      .catch(() => []),
    detectAccessAnomalies(50),
    db.auditLog
      .findMany({
        where: { action: 'document.gedownload' },
        orderBy: { at: 'desc' },
        take: 20,
      })
      .catch(() => []),
    db.auditLog
      .findMany({
        where: { action: { contains: 'buiten_scope' } },
        orderBy: { at: 'desc' },
        take: 10,
      })
      .catch(() => []),
  ]);

  const totaal24h = recentAccess.length;
  const uniqueUsers = new Set(recentAccess.map((r) => r.userId)).size;

  return (
    <PortalShell
      role="ADMIN"
      activeHref="/admin/toegangslog"
      userName={currentAdmin.name}
      userSubtitle="Binnendienst · Privacy officer"
      greeting={{
        title: 'Toegangslog persoonsgegevens',
        subtitle: 'Wie heeft welke data ingezien — voor AVG-compliance en anomalie-detectie.',
      }}
    >
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <Stat label="Inzages 24u" value={`${totaal24h}`} tone="primary" icon={<Icon.Activity className="h-5 w-5" />} />
        <Stat label="Unieke gebruikers" value={`${uniqueUsers}`} tone="navy" icon={<Icon.Users className="h-5 w-5" />} />
        <Stat label="Anomalieën" value={`${anomalies.length}`} tone={anomalies.length > 0 ? 'rose' : 'emerald'} icon={<Icon.AlertTriangle className="h-5 w-5" />} />
        <Stat label="Data exports" value={`${exports.length}`} tone="amber" icon={<Icon.Doc className="h-5 w-5" />} />
      </div>

      {/* Anomaly alert */}
      {anomalies.length > 0 ? (
        <Card className="mt-6 border-rose-200 bg-rose-50">
          <CardBody>
            <div className="flex items-start gap-4">
              <div className="grid h-10 w-10 shrink-0 place-items-center rounded-md bg-rose-500 text-white">
                <Icon.AlertTriangle className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <h3 className="font-display text-base font-bold text-rose-900">
                  Verdacht hoge toegang — {anomalies.length} gebruiker{anomalies.length === 1 ? '' : 's'}
                </h3>
                <p className="mt-1 text-sm text-rose-800">
                  De volgende gebruikers hebben meer dan 50 records ingezien in de laatste 24 uur.
                  Verifieer of dit klopt voor hun functie.
                </p>
                <ul className="mt-3 space-y-1">
                  {anomalies.map((a) => (
                    <li key={a.userId} className="flex items-center justify-between rounded-md bg-white px-3 py-2 text-sm">
                      <span className="font-mono text-xs text-ink-700">{a.userId}</span>
                      <span className="font-bold text-rose-700">{a.count} inzages</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </CardBody>
        </Card>
      ) : null}

      {/* Recent access log */}
      <Card className="mt-6">
        <CardHeader
          title="Laatste 50 inzages"
          subtitle="Live log van persoonsgegevens-toegang"
          action={
            <div className="flex gap-2">
              <button className="btn-secondary">
                <Icon.Doc className="h-4 w-4" /> Export CSV
              </button>
              <button className="btn-secondary">
                <Icon.Settings className="h-4 w-4" /> Filters
              </button>
            </div>
          }
        />
        <CardBody>
          {recentAccess.length === 0 ? (
            <div className="text-sm text-ink-500">
              Nog geen toegangslogs geregistreerd. Worden gevuld vanaf eerste view in productie.
            </div>
          ) : (
            <div className="overflow-x-auto rounded-xl border border-bone-200">
              <table className="w-full min-w-[720px] border-collapse text-sm">
                <thead>
                  <tr>
                    <th className="table-head">Tijd</th>
                    <th className="table-head">Gebruiker</th>
                    <th className="table-head">Rol</th>
                    <th className="table-head">Actie</th>
                    <th className="table-head">Doel</th>
                    <th className="table-head">Reden</th>
                  </tr>
                </thead>
                <tbody>
                  {recentAccess.map((r) => {
                    const ctx = (r.context ?? {}) as Record<string, unknown>;
                    const outside = ctx.outsideScope === true;
                    return (
                      <tr key={r.id} className="table-row">
                        <td className="table-cell text-xs text-ink-500">{formatTime(r.accessedAt)}</td>
                        <td className="table-cell">
                          <div className="flex items-center gap-2">
                            <Avatar name={r.user.name} size="sm" tone="wood" />
                            <span className="text-ink-900">{r.user.name}</span>
                          </div>
                        </td>
                        <td className="table-cell">
                          <Badge variant="wood">{r.user.role}</Badge>
                        </td>
                        <td className="table-cell font-mono text-xs">{r.action}</td>
                        <td className="table-cell text-xs">{String(ctx.targetType ?? '-')}</td>
                        <td className="table-cell">
                          {outside ? (
                            <Badge variant="warning">Buiten scope</Badge>
                          ) : (
                            <span className="text-xs text-ink-500">{String(ctx.reason ?? 'NORMAAL')}</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardBody>
      </Card>

      {/* Scope violations */}
      <Card className="mt-6">
        <CardHeader
          title="Toegang buiten eigen scope"
          subtitle="Coördinator die student buiten eigen regio bekijkt vereist 'need-to-know' reden"
        />
        <CardBody>
          {scopeViolations.length === 0 ? (
            <div className="rounded-xl border border-emerald-100 bg-emerald-50 p-3 text-sm text-emerald-700">
              ✓ Geen overschrijdingen van scope geregistreerd.
            </div>
          ) : (
            <ul className="divide-y divide-bone-100">
              {scopeViolations.map((s) => (
                <li key={s.id} className="flex items-center justify-between py-2 text-sm">
                  <span>{s.actorUserId} → {s.objectType}/{s.objectId}</span>
                  <span className="text-xs text-ink-500">{formatTime(s.at)}</span>
                </li>
              ))}
            </ul>
          )}
        </CardBody>
      </Card>

      {/* AVG uitleg */}
      <Card className="mt-6">
        <CardHeader title="Hoe we ongeoorloofd delen voorkomen" />
        <CardBody>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Explainer
              icon={<Icon.Shield className="h-5 w-5" />}
              title="Need-to-know per rol"
              body="Coördinator ziet alleen eigen regio. Lidbedrijf alleen eigen studenten. Hardcoded in elke DB-query via studentScopeFilter."
            />
            <Explainer
              icon={<Icon.Activity className="h-5 w-5" />}
              title="Elke inzage gelogd"
              body="Iedere view van persoonsgegevens komt in DocumentAccessLog: wie, wat, wanneer, waarom. 7 jaar bewaartermijn."
            />
            <Explainer
              icon={<Icon.AlertTriangle className="h-5 w-5" />}
              title="Anomalie-detectie"
              body=">50 inzages in 24u door één gebruiker triggert automatisch een alert hier op deze pagina. Privacy officer onderzoekt."
            />
            <Explainer
              icon={<Icon.Lock className="h-5 w-5" />}
              title="Need-to-know dialog"
              body="Wanneer iemand buiten eigen scope wil kijken, moet eerst een reden worden opgegeven. Wordt apart geaudit."
            />
            <Explainer
              icon={<Icon.Doc className="h-5 w-5" />}
              title="Geen bulk-export buiten admin"
              body="Coördinator kan alleen eigen regio exporteren. Bulk-export over alle regio's vereist admin-rol + 2FA-bevestiging."
            />
            <Explainer
              icon={<Icon.Heart className="h-5 w-5" />}
              title="Geheimhoudingsplicht"
              body="Elke medewerker tekent bij indiensttreding een verklaring. Schending = wettelijke + arbeidsrechtelijke gevolgen."
            />
          </div>
        </CardBody>
      </Card>
    </PortalShell>
  );
}

function Stat({ label, value, tone, icon }: { label: string; value: string; tone: 'primary' | 'navy' | 'rose' | 'emerald' | 'amber'; icon: React.ReactNode }) {
  const cls = {
    primary: 'bg-primary-500 text-white',
    navy: 'bg-navy-600 text-white',
    rose: 'bg-rose-500 text-white',
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

function Explainer({ icon, title, body }: { icon: React.ReactNode; title: string; body: string }) {
  return (
    <div className="rounded-xl border border-bone-200 bg-bone-50 p-4">
      <div className="flex items-center gap-2">
        <span className="grid h-8 w-8 place-items-center rounded-md bg-primary-500 text-white">{icon}</span>
        <h4 className="font-display text-sm font-bold text-ink-900">{title}</h4>
      </div>
      <p className="mt-2 text-xs leading-relaxed text-ink-700">{body}</p>
    </div>
  );
}
