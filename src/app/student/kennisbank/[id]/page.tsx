import Link from 'next/link';
import { notFound } from 'next/navigation';
import { PortalShell } from '@/components/portal/PortalShell';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Icon } from '@/components/ui/Icon';
import { getDemoSession } from '@/lib/data/session';
import { getKnowledgeArticleById, listKnowledgeForRole } from '@/lib/data/content';
import { db } from '@/lib/db';
import { formatDate } from '@/lib/utils';

export const dynamic = 'force-dynamic';

export default async function Page({ params }: { params: { id: string } }) {
  const ctx = getDemoSession('STUDENT');
  const [article, s, related] = await Promise.all([
    getKnowledgeArticleById(params.id),
    db.student.findUnique({ where: { id: ctx.studentId! }, include: { user: true } }),
    listKnowledgeForRole('STUDENT'),
  ]);
  if (!article || !s) notFound();
  const relatedSame = related.filter((a) => a.id !== article.id && a.category === article.category).slice(0, 3);

  return (
    <PortalShell
      role="STUDENT"
      activeHref="/student/kennisbank"
      userName={s.user.name}
      userSubtitle="Student"
      greeting={{ title: article.title, subtitle: `${article.category} · v${article.version}` }}
    >
      <div className="mb-4">
        <Link href="/student/kennisbank" className="btn-ghost">
          ← Terug naar kennisbank
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardBody>
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="wood">{article.category}</Badge>
              {article.tags.map((t) => (
                <span key={t} className="rounded-full bg-bone-100 px-2 py-0.5 text-[11px] text-ink-600">#{t}</span>
              ))}
            </div>

            <h1 className="mt-4 font-display text-3xl font-semibold text-ink-900">{article.title}</h1>

            <div className="mt-6 prose prose-sm max-w-none text-ink-800">
              <p className="whitespace-pre-wrap">{article.body}</p>
              <h2 className="font-display text-lg font-semibold text-ink-900 mt-6">Stappenplan</h2>
              <ol className="mt-2 list-decimal space-y-2 pl-5 text-ink-700">
                <li>Lees de toelichting op de eerste pagina van dit artikel.</li>
                <li>Controleer welke documenten je nodig hebt.</li>
                <li>Volg het stappenplan zoals beschreven.</li>
                <li>Vraag bij twijfel hulp aan je coördinator of leerbedrijf.</li>
              </ol>
            </div>

            <div className="mt-8 flex items-center justify-between border-t border-bone-100 pt-4 text-xs text-ink-500">
              <div>v{article.version} · Laatst bijgewerkt {formatDate(article.updatedAt)} door {article.updatedBy}</div>
              <button className="btn-ghost">
                <Icon.Check className="h-4 w-4" /> Was dit nuttig?
              </button>
            </div>
          </CardBody>
        </Card>

        <div className="space-y-5">
          <Card>
            <CardHeader title="Inhoud" />
            <CardBody>
              <ol className="space-y-2 text-sm">
                <li><a href="#" className="text-wood-700 hover:text-wood-800">Inleiding</a></li>
                <li><a href="#" className="text-wood-700 hover:text-wood-800">Stappenplan</a></li>
              </ol>
            </CardBody>
          </Card>

          {relatedSame.length > 0 ? (
            <Card>
              <CardHeader title="Gerelateerd" />
              <CardBody>
                <ul className="space-y-2">
                  {relatedSame.map((r) => (
                    <li key={r.id}>
                      <Link href={`/student/kennisbank/${r.id}`} className="flex items-start gap-2 rounded-xl border border-bone-200 p-3 text-sm hover:bg-bone-50">
                        <Icon.BookOpen className="mt-0.5 h-4 w-4 text-wood-500" />
                        <div>
                          <div className="font-medium text-ink-900">{r.title}</div>
                          <div className="text-xs text-ink-500">{r.category}</div>
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
              </CardBody>
            </Card>
          ) : null}
        </div>
      </div>
    </PortalShell>
  );
}
