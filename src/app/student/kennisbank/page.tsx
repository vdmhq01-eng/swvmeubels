import Link from 'next/link';
import { PortalShell } from '@/components/portal/PortalShell';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Toolbar, FilterChip } from '@/components/ui/Toolbar';
import { Icon } from '@/components/ui/Icon';
import { currentStudent } from '@/lib/mock/users';
import { knowledgeArticles } from '@/lib/mock/faq';
import { formatDate } from '@/lib/utils';

export default function StudentKennisbankPage() {
  const articles = knowledgeArticles.filter((a) => a.roles.includes('STUDENT') && a.status === 'GEPUBLICEERD');
  const categories = Array.from(new Set(articles.map((a) => a.category)));

  return (
    <PortalShell
      role="STUDENT"
      activeHref="/student/kennisbank"
      userName={currentStudent.name}
      userSubtitle="Student"
      greeting={{ title: 'Kennisbank', subtitle: 'Alle informatie op één plek.' }}
    >
      <Card>
        <CardBody>
          <Toolbar placeholder="Zoek in kennisbank…">
            {categories.map((c) => (
              <FilterChip key={c} label={c} />
            ))}
          </Toolbar>
        </CardBody>
      </Card>

      <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2">
        {articles.map((a) => (
          <Link
            key={a.id}
            href={`/student/kennisbank/${a.id}`}
            className="card-padded block transition hover:-translate-y-0.5 hover:shadow-lg"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-wood-50 text-wood-700 ring-1 ring-wood-100">
                <Icon.BookOpen className="h-5 w-5" />
              </div>
              <Badge variant="wood">{a.category}</Badge>
            </div>
            <h3 className="mt-3 font-display text-lg font-semibold text-ink-900">{a.title}</h3>
            <p className="mt-1 text-sm text-ink-600">{a.excerpt}</p>
            <div className="mt-4 flex items-center justify-between text-xs text-ink-500">
              <span>v{a.version} · {formatDate(a.updatedAt)}</span>
              <span className="inline-flex items-center gap-1 font-medium text-wood-700">
                Lees verder <Icon.ArrowRight className="h-4 w-4" />
              </span>
            </div>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {a.tags.map((t) => (
                <span key={t} className="rounded-full bg-bone-100 px-2 py-0.5 text-[11px] text-ink-600">
                  #{t}
                </span>
              ))}
            </div>
          </Link>
        ))}
      </div>
    </PortalShell>
  );
}
