import { PortalShell } from '@/components/portal/PortalShell';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { Avatar } from '@/components/ui/Avatar';
import { Icon } from '@/components/ui/Icon';
import { currentStudent } from '@/lib/mock/users';
import { messages } from '@/lib/mock/misc';
import { formatDate } from '@/lib/utils';

export default function StudentBerichtenPage() {
  return (
    <PortalShell
      role="STUDENT"
      activeHref="/student/berichten"
      userName={currentStudent.name}
      userSubtitle="Student"
      greeting={{ title: 'Berichten', subtitle: 'Communicatie met je coördinator en leerbedrijf.' }}
    >
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <CardHeader title="Inbox" subtitle={`${messages.filter((m) => !m.read).length} ongelezen`} />
          <CardBody>
            <ul className="divide-y divide-bone-100">
              {messages.map((m) => (
                <li key={m.id} className={`flex items-start gap-3 py-3 first:pt-0 last:pb-0 ${!m.read ? 'opacity-100' : 'opacity-80'}`}>
                  <Avatar name={m.fromName} size="sm" tone="stone" />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <div className="truncate text-sm font-medium text-ink-900">{m.fromName}</div>
                      <div className="text-xs text-ink-500">{formatDate(m.sentAt)}</div>
                    </div>
                    <div className="truncate text-sm text-ink-700">{m.subject}</div>
                    <div className="truncate text-xs text-ink-500">{m.preview}</div>
                  </div>
                </li>
              ))}
            </ul>
          </CardBody>
        </Card>

        <Card className="lg:col-span-2">
          <CardBody>
            <div className="flex items-start justify-between gap-3 border-b border-bone-100 pb-4">
              <div className="flex items-center gap-3">
                <Avatar name={messages[0].fromName} tone="green" />
                <div>
                  <div className="font-display text-base font-semibold text-ink-900">
                    {messages[0].subject}
                  </div>
                  <div className="text-xs text-ink-500">
                    Van {messages[0].fromName} · {formatDate(messages[0].sentAt)}
                  </div>
                </div>
              </div>
              <button className="btn-ghost">
                <Icon.X className="h-4 w-4" />
              </button>
            </div>
            <p className="mt-5 whitespace-pre-line text-sm leading-relaxed text-ink-800">
              Hoi Jamie,{'\n\n'}
              Je evaluatiegesprek staat gepland op 11 juni om 10:00. Laat even weten of dit jou lukt.
              We bespreken dan je voortgang in periode 4, je BPV-verslag en de eerstvolgende
              praktijkbeoordeling.{'\n\n'}
              Groet,{'\n'}
              Sanne
            </p>

            <div className="mt-5 rounded-2xl border border-bone-200 bg-bone-50 p-4">
              <label className="label mb-2 block">Reageer</label>
              <textarea rows={4} className="input bg-white" placeholder="Schrijf een bericht…" />
              <div className="mt-3 flex justify-end gap-2">
                <button className="btn-secondary">Concept</button>
                <button className="btn-primary">
                  <Icon.Check className="h-4 w-4" /> Verstuur
                </button>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>
    </PortalShell>
  );
}
