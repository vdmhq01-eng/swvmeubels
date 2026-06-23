import { PortalShell } from '@/components/portal/PortalShell';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Icon } from '@/components/ui/Icon';
import { UploadDropzone } from '@/components/uren/UploadDropzone';
import { getDemoSession } from '@/lib/data/session';
import { db } from '@/lib/db';
import { formatDate } from '@/lib/utils';

export const dynamic = 'force-dynamic';

export default async function StudentDocumentenPage() {
  const ctx = getDemoSession('STUDENT');
  const [s, documents] = await Promise.all([
    db.student.findUnique({ where: { id: ctx.studentId! }, include: { user: true } }).catch(() => null),
    db.document.findMany({ where: { studentId: ctx.studentId! }, orderBy: { uploadedAt: 'desc' } }).catch(() => []),
  ]);
  if (!s) return null;

  return (
    <PortalShell
      role="STUDENT"
      activeHref="/student/documenten"
      userName={s.user.name}
      userSubtitle="Student"
      greeting={{ title: 'Documenten', subtitle: 'Bekijk, upload en download je documenten veilig.' }}
    >
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader title="Mijn documenten" subtitle="Versleutelde opslag · downloads via signed URL" />
          <CardBody>
            {documents.length === 0 ? (
              <div className="text-sm text-ink-500">Nog geen documenten geüpload.</div>
            ) : (
              <ul className="flex flex-col gap-2">
                {documents.map((d) => (
                  <li key={d.id} className="flex items-center justify-between rounded-xl border border-bone-200 px-3 py-3">
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="grid h-10 w-10 place-items-center rounded-xl bg-wood-50 text-wood-700 ring-1 ring-wood-100">
                        <Icon.Doc className="h-4 w-4" />
                      </div>
                      <div className="min-w-0">
                        <div className="truncate text-sm font-medium text-ink-900">{d.fileName}</div>
                        <div className="text-xs text-ink-500">
                          {d.category} · {(d.sizeBytes / 1024).toFixed(0)} KB · bewaartermijn tot {formatDate(d.retentionUntil)}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="info">
                        <Icon.Lock className="h-3 w-3" /> AVG
                      </Badge>
                      <button className="btn-secondary">Bekijk</button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </CardBody>
        </Card>

        <div className="space-y-5">
          <UploadDropzone
            category="Legitimatie"
            description="PDF, JPG of PNG. Max 10 MB. Wordt 3 jaar bewaard en daarna automatisch verwijderd."
          />
          <UploadDropzone
            category="Overig"
            description="Bijvoorbeeld portfolio, beoordelingsformulier, certificaat."
          />
        </div>
      </div>
    </PortalShell>
  );
}
