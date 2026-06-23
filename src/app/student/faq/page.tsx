import { PortalShell } from '@/components/portal/PortalShell';
import { StudentNotLoaded } from '@/components/portal/StudentNotLoaded';
import { Card, CardBody } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Toolbar, FilterChip } from '@/components/ui/Toolbar';
import { getDemoSession } from '@/lib/data/session';
import { listFaqForRole } from '@/lib/data/content';
import { db } from '@/lib/db';

export const dynamic = 'force-dynamic';

export default async function StudentFAQPage() {
  const ctx = getDemoSession('STUDENT');
  const [items, s] = await Promise.all([
    listFaqForRole('STUDENT'),
    db.student.findUnique({ where: { id: ctx.studentId! }, include: { user: true } }).catch(() => null),
  ]);
  if (!s) return <StudentNotLoaded activeHref="/student/faq" />;
  const categories = Array.from(new Set(items.map((f) => f.category)));

  return (
    <PortalShell
      role="STUDENT"
      activeHref="/student/faq"
      userName={s.user.name}
      userSubtitle="Student"
      greeting={{ title: 'FAQ', subtitle: 'Veelgestelde vragen voor studenten.' }}
    >
      <Card>
        <CardBody>
          <Toolbar placeholder="Zoek vraag…">
            {categories.map((c) => (
              <FilterChip key={c} label={c} />
            ))}
          </Toolbar>
        </CardBody>
      </Card>

      <div className="mt-6 space-y-3">
        {items.map((f) => (
          <Card key={f.id}>
            <CardBody>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-base font-semibold text-ink-900">{f.question}</div>
                  <p className="mt-2 max-w-3xl text-sm leading-relaxed text-ink-700 whitespace-pre-wrap">{f.answer}</p>
                </div>
                <Badge variant="wood">{f.category}</Badge>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>
    </PortalShell>
  );
}
