import { PortalShell } from '@/components/portal/PortalShell';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Icon } from '@/components/ui/Icon';
import { UploadDropzone } from '@/components/uren/UploadDropzone';
import { getDemoSession } from '@/lib/data/session';
import { db } from '@/lib/db';
import { formatDate } from '@/lib/utils';

export const dynamic = 'force-dynamic';

export default async function LidbedrijfDocumentenPage() {
  const ctx = getDemoSession('COMPANY');
  const [documents, contact] = await Promise.all([
    db.document.findMany({
      where: { OR: [{ companyId: ctx.companyId! }, { student: { companyId: ctx.companyId! } }] },
      include: { student: { include: { user: true } } },
      orderBy: { uploadedAt: 'desc' },
    }),
    db.companyContact.findFirst({ where: { companyId: ctx.companyId! }, include: { user: true, company: true } }),
  ]);

  return (
    <PortalShell
      role="COMPANY"
      activeHref="/lidbedrijf/documenten"
      userName={contact?.user.name ?? 'Lidbedrijf'}
      userSubtitle={contact?.company.name ?? 'Lidbedrijf'}
      greeting={{ title: 'Documenten', subtitle: 'Praktijkovereenkomsten en beoordelingen.' }}
    >
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader title="Documenten" subtitle="Beveiligde, versleutelde opslag" />
          <CardBody>
            {documents.length === 0 ? (
              <div className="text-sm text-ink-500">Geen documenten.</div>
            ) : (
              <ul className="flex flex-col gap-2">
                {documents.map((d) => (
                  <li key={d.id} className="flex items-center justify-between rounded-xl border border-bone-200 px-3 py-3">
                    <div className="flex min-w-0 items-center gap-3">
                      <Icon.Doc className="h-4 w-4 text-wood-500" />
                      <div className="min-w-0">
                        <div className="truncate font-medium text-ink-900">{d.fileName}</div>
                        <div className="text-xs text-ink-500">{d.category} · bewaartermijn tot {formatDate(d.retentionUntil)}</div>
                      </div>
                    </div>
                    <Badge variant="info">
                      <Icon.Lock className="h-3 w-3" /> AVG
                    </Badge>
                  </li>
                ))}
              </ul>
            )}
          </CardBody>
        </Card>

        <UploadDropzone
          category="Beoordeling"
          description="Praktijkbeoordeling van een student. PDF, JPG of PNG. Max 10 MB."
        />
      </div>
    </PortalShell>
  );
}
