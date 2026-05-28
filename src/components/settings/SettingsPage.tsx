'use client';

import { useState } from 'react';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import { Icon } from '@/components/ui/Icon';
import { Tabs } from '@/components/ui/Tabs';
import type { Role } from '@/lib/types';

const sectionTabs = [
  { key: 'profiel', label: 'Profiel' },
  { key: 'beveiliging', label: 'Beveiliging' },
  { key: 'meldingen', label: 'Meldingen' },
  { key: 'privacy', label: 'Privacy' },
];

export function SettingsPage({
  userName,
  userEmail,
  role,
  twoFactorEnabled,
}: {
  userName: string;
  userEmail: string;
  role: Role;
  twoFactorEnabled?: boolean;
}) {
  const [active, setActive] = useState('profiel');
  const [twoFa, setTwoFa] = useState(Boolean(twoFactorEnabled));
  const [emailNotif, setEmailNotif] = useState(true);
  const [pushNotif, setPushNotif] = useState(false);
  const [marketing, setMarketing] = useState(false);

  return (
    <div className="space-y-6">
      <Tabs items={sectionTabs} active={active} onChange={setActive} />

      {active === 'profiel' ? (
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <CardHeader title="Profiel" subtitle="Persoonlijke informatie" />
            <CardBody className="space-y-4">
              <div className="flex items-center gap-4">
                <Avatar name={userName} size="lg" tone="wood" />
                <div>
                  <button className="btn-secondary">
                    <Icon.Upload className="h-4 w-4" /> Wijzig foto
                  </button>
                  <div className="mt-1 text-xs text-ink-500">JPG of PNG · max 2 MB</div>
                </div>
              </div>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <Input label="Volledige naam" defaultValue={userName} />
                <Input label="E-mailadres" defaultValue={userEmail} type="email" />
                <Input label="Telefoon" defaultValue="06 12345678" />
                <Input label="Functie / rol" defaultValue={role} disabled />
              </div>
              <div className="flex justify-end gap-2">
                <button className="btn-secondary">Annuleer</button>
                <button className="btn-primary">
                  <Icon.Check className="h-4 w-4" /> Opslaan
                </button>
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardHeader title="Voorkeuren" />
            <CardBody className="space-y-3">
              <Input label="Taal" defaultValue="Nederlands" disabled />
              <Input label="Tijdzone" defaultValue="Europe/Amsterdam" disabled />
              <Input label="Datumformaat" defaultValue="dd-mm-yyyy" disabled />
            </CardBody>
          </Card>
        </div>
      ) : null}

      {active === 'beveiliging' ? (
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          <Card>
            <CardHeader title="Wachtwoord wijzigen" />
            <CardBody className="space-y-4">
              <Input label="Huidig wachtwoord" type="password" />
              <Input label="Nieuw wachtwoord" type="password" />
              <Input label="Herhaal nieuw wachtwoord" type="password" />
              <ul className="text-xs text-ink-500 space-y-1">
                <li>· Minimaal 12 tekens</li>
                <li>· Combinatie van hoofdletters, kleine letters en cijfers</li>
                <li>· Mag niet hetzelfde zijn als de laatste 5 wachtwoorden</li>
              </ul>
              <button className="btn-primary">
                <Icon.Lock className="h-4 w-4" /> Wachtwoord wijzigen
              </button>
            </CardBody>
          </Card>

          <Card>
            <CardHeader title="Tweefactor authenticatie" subtitle="Extra beveiliging via authenticator-app" />
            <CardBody className="space-y-4">
              <div className="flex items-center justify-between rounded-xl border border-bone-200 p-4">
                <div className="flex items-center gap-3">
                  <div className="grid h-10 w-10 place-items-center rounded-xl bg-wood-50 text-wood-700 ring-1 ring-wood-100">
                    <Icon.Shield className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-ink-900">Authenticator-app</div>
                    <div className="text-xs text-ink-500">Bijv. Google Authenticator of Authy</div>
                  </div>
                </div>
                <Toggle checked={twoFa} onChange={setTwoFa} />
              </div>
              {role === 'ADMIN' && !twoFa ? (
                <div className="rounded-xl border border-rose-100 bg-rose-50 p-3 text-xs text-rose-700">
                  Admin-accounts moeten 2FA verplicht hebben. Activeer dit zo snel mogelijk.
                </div>
              ) : null}
              <div>
                <div className="text-sm font-medium text-ink-900">Actieve sessies</div>
                <ul className="mt-2 space-y-2">
                  <SessionRow device="MacBook Pro · Chrome" location="Groningen · NL" current />
                  <SessionRow device="iPhone · Safari" location="Groningen · NL" />
                </ul>
              </div>
            </CardBody>
          </Card>
        </div>
      ) : null}

      {active === 'meldingen' ? (
        <Card>
          <CardHeader title="Meldingen" subtitle="Bepaal hoe je wordt geïnformeerd" />
          <CardBody>
            <ul className="divide-y divide-bone-100">
              <NotifRow
                title="E-mail meldingen"
                desc="Belangrijke updates per e-mail"
                checked={emailNotif}
                onChange={setEmailNotif}
              />
              <NotifRow
                title="Push-meldingen"
                desc="Direct in je browser of mobiel"
                checked={pushNotif}
                onChange={setPushNotif}
              />
              <NotifRow
                title="Nieuwsbrief"
                desc="Periodieke updates over SWV Meubel"
                checked={marketing}
                onChange={setMarketing}
              />
            </ul>
            <div className="mt-4 text-xs text-ink-500">
              Kritieke beveiligingsmeldingen ontvang je altijd, ongeacht je voorkeuren.
            </div>
          </CardBody>
        </Card>
      ) : null}

      {active === 'privacy' ? (
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          <Card>
            <CardHeader title="Mijn data" subtitle="Inzage en export volgens AVG" />
            <CardBody className="space-y-3">
              <p className="text-sm text-ink-700">
                Je hebt het recht om al je persoonsgegevens in te zien en te downloaden. We
                versturen je binnen 30 dagen een complete export.
              </p>
              <button className="btn-secondary">
                <Icon.Doc className="h-4 w-4" /> Vraag data export aan
              </button>
              <Badge variant="info">Vorige aanvraag: nog niet gedaan</Badge>
            </CardBody>
          </Card>
          <Card>
            <CardHeader title="Verwijdering" subtitle="Recht op vergetelheid" />
            <CardBody className="space-y-3">
              <p className="text-sm text-ink-700">
                Verwijdering is mogelijk voor zover juridisch toegestaan. Sommige gegevens moeten
                we bewaren in verband met fiscale en arbeidsrechtelijke termijnen.
              </p>
              <button className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-2 text-sm font-medium text-rose-700 hover:bg-rose-100">
                Verwijderverzoek indienen
              </button>
              <div className="text-xs text-ink-500">Verzoek wordt eerst beoordeeld door de privacy officer.</div>
            </CardBody>
          </Card>
        </div>
      ) : null}
    </div>
  );
}

function Input({ label, type = 'text', defaultValue, disabled }: { label: string; type?: string; defaultValue?: string; disabled?: boolean }) {
  return (
    <div>
      <label className="label mb-1.5 block">{label}</label>
      <input
        type={type}
        defaultValue={defaultValue}
        disabled={disabled}
        className={`input ${disabled ? 'bg-bone-50 text-ink-500' : ''}`}
      />
    </div>
  );
}

function Toggle({ checked, onChange }: { checked: boolean; onChange: (b: boolean) => void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
        checked ? 'bg-wood-500' : 'bg-bone-200'
      }`}
    >
      <span
        className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-sm transition ${
          checked ? 'translate-x-5' : 'translate-x-1'
        }`}
      />
    </button>
  );
}

function NotifRow({ title, desc, checked, onChange }: { title: string; desc: string; checked: boolean; onChange: (b: boolean) => void }) {
  return (
    <li className="flex items-start justify-between gap-4 py-3 first:pt-0 last:pb-0">
      <div>
        <div className="text-sm font-medium text-ink-900">{title}</div>
        <div className="text-xs text-ink-500">{desc}</div>
      </div>
      <Toggle checked={checked} onChange={onChange} />
    </li>
  );
}

function SessionRow({ device, location, current }: { device: string; location: string; current?: boolean }) {
  return (
    <li className="flex items-center justify-between rounded-xl border border-bone-200 px-3 py-2 text-sm">
      <div>
        <div className="font-medium text-ink-900">{device}</div>
        <div className="text-xs text-ink-500">{location}</div>
      </div>
      {current ? (
        <Badge variant="success">Deze sessie</Badge>
      ) : (
        <button className="btn-ghost text-rose-700 hover:text-rose-800">Uitloggen</button>
      )}
    </li>
  );
}
