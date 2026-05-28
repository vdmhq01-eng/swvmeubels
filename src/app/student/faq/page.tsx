import { PortalShell } from '@/components/portal/PortalShell';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Toolbar, FilterChip } from '@/components/ui/Toolbar';
import { currentStudent } from '@/lib/mock/users';
import { faqItems } from '@/lib/mock/faq';

export default function StudentFAQPage() {
  const items = faqItems.filter((f) => f.roles.includes('STUDENT') && f.status === 'GEPUBLICEERD');
  const categories = Array.from(new Set(items.map((f) => f.category)));

  return (
    <PortalShell
      role="STUDENT"
      activeHref="/student/faq"
      userName={currentStudent.name}
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
                  <p className="mt-2 max-w-3xl text-sm leading-relaxed text-ink-700">
                    Antwoord op deze vraag staat hier in productie. In de mockup tonen we
                    placeholder-tekst zodat de structuur en typografie zichtbaar zijn. Klik om
                    uit te klappen of zoek via de balk hierboven.
                  </p>
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
