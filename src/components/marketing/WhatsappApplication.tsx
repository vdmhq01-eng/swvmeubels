'use client';

import { useState } from 'react';
import { Icon } from '@/components/ui/Icon';
import { whatsappUrl, WhatsAppIcon } from '@/components/portal/WhatsAppButton';

type Step = 'naam' | 'postcode' | 'opleiding' | 'leeftijd' | 'vraag' | 'klaar';

const opleidingen = [
  { label: 'Meubelmaker', emoji: '🪑', value: 'Meubelmaker BBL 2/3' },
  { label: 'Interieurbouwer', emoji: '🏠', value: 'Interieurbouwer BBL 3' },
  { label: 'Houtbewerker', emoji: '🪵', value: 'Machinaal houtbewerker BBL 2' },
  { label: 'Weet ik nog niet', emoji: '🤔', value: 'Weet nog niet' },
];

const leeftijden = ['16-18', '19-21', '22-25', '26+'];

const stepOrder: Step[] = ['naam', 'postcode', 'leeftijd', 'opleiding', 'vraag', 'klaar'];

/**
 * Step-by-step WhatsApp sollicitatie — chat-stijl flow.
 * Modern, mobile-first, voelt aan als Typeform meets WhatsApp.
 * Geen klassiek formulier maar conversational.
 */
export function WhatsappApplication() {
  const [step, setStep] = useState<Step>('naam');
  const [naam, setNaam] = useState('');
  const [postcode, setPostcode] = useState('');
  const [leeftijd, setLeeftijd] = useState('');
  const [opleiding, setOpleiding] = useState('');
  const [vraag, setVraag] = useState('');

  const stepIndex = stepOrder.indexOf(step);
  const progress = ((stepIndex + 1) / stepOrder.length) * 100;

  function next(target: Step) {
    setStep(target);
  }

  const message = [
    'Hoi SWV Meubel! Ik wil solliciteren via WhatsApp.',
    '',
    `🧑 Naam: ${naam}`,
    `📍 Postcode: ${postcode}`,
    `🎂 Leeftijd: ${leeftijd}`,
    `🎓 Opleiding: ${opleiding}`,
    vraag.trim() ? `💬 Vraag: ${vraag.trim()}` : '',
    '',
    'Wil graag dat een coördinator contact opneemt. Bedankt!',
  ].filter(Boolean).join('\n');

  return (
    <div className="overflow-hidden rounded-3xl bg-[#0f1419] shadow-2xl">
      {/* WhatsApp-style header */}
      <div className="flex items-center gap-3 border-b border-white/10 bg-[#1F2C34] px-4 py-3">
        <div className="grid h-10 w-10 place-items-center rounded-full bg-[#25D366] text-white">
          <WhatsAppIcon className="h-5 w-5" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="text-sm font-bold text-white">SWV Meubel</div>
          <div className="flex items-center gap-1.5 text-[10px] text-emerald-400">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            online — antwoordt binnen 1 dag
          </div>
        </div>
        <div className="text-[10px] text-white/40">
          {stepIndex + 1} / {stepOrder.length}
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-0.5 bg-white/5">
        <div
          className="h-full bg-[#25D366] transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Chat area */}
      <div className="min-h-[420px] space-y-3 bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%22100%22 height=%22100%22><rect width=%22100%22 height=%22100%22 fill=%22%230b141a%22/></svg>')] bg-[#0b141a] p-4">
        {/* Question bubbles altijd zichtbaar */}
        <Bubble who="them">Hoi 👋 Wat is je voornaam?</Bubble>
        {naam ? <Bubble who="me">{naam}</Bubble> : null}

        {stepIndex >= 1 ? <Bubble who="them">Top, {naam}! Wat is je postcode?</Bubble> : null}
        {postcode ? <Bubble who="me">{postcode}</Bubble> : null}

        {stepIndex >= 2 ? <Bubble who="them">En je leeftijd?</Bubble> : null}
        {leeftijd ? <Bubble who="me">{leeftijd}</Bubble> : null}

        {stepIndex >= 3 ? <Bubble who="them">Welke opleiding lijkt je leuk?</Bubble> : null}
        {opleiding ? <Bubble who="me">{opleiding}</Bubble> : null}

        {stepIndex >= 4 ? <Bubble who="them">Laatste — heb je nog een vraag voor ons?</Bubble> : null}
        {vraag ? <Bubble who="me">{vraag}</Bubble> : null}

        {step === 'klaar' ? (
          <Bubble who="them">
            Top! Klik hieronder en we openen WhatsApp met je info. 🚀
          </Bubble>
        ) : null}
      </div>

      {/* Input area */}
      <div className="border-t border-white/10 bg-[#1F2C34] p-3">
        {step === 'naam' ? (
          <TextStep
            placeholder="Type je voornaam…"
            value={naam}
            onChange={setNaam}
            onNext={() => naam.trim().length > 1 && next('postcode')}
            cta="Volgende"
          />
        ) : null}

        {step === 'postcode' ? (
          <TextStep
            placeholder="1234 AB"
            value={postcode}
            onChange={(v) => setPostcode(v.toUpperCase())}
            onNext={() => postcode.trim().length >= 4 && next('leeftijd')}
            cta="Volgende"
            inputMode="text"
            maxLength={7}
          />
        ) : null}

        {step === 'leeftijd' ? (
          <QuickPicks
            options={leeftijden.map((l) => ({ label: l, value: l }))}
            onPick={(v) => {
              setLeeftijd(v);
              next('opleiding');
            }}
          />
        ) : null}

        {step === 'opleiding' ? (
          <QuickPicks
            options={opleidingen.map((o) => ({ label: `${o.emoji} ${o.label}`, value: o.value }))}
            onPick={(v) => {
              setOpleiding(v);
              next('vraag');
            }}
          />
        ) : null}

        {step === 'vraag' ? (
          <div className="space-y-2">
            <TextStep
              placeholder="Vraag of opmerking (optioneel)…"
              value={vraag}
              onChange={setVraag}
              onNext={() => next('klaar')}
              cta="Klaar"
            />
            <button
              onClick={() => next('klaar')}
              className="w-full text-xs font-semibold text-white/60 hover:text-white"
            >
              Sla over →
            </button>
          </div>
        ) : null}

        {step === 'klaar' ? (
          <a
            href={whatsappUrl(undefined, message)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#25D366] px-5 py-4 text-base font-bold uppercase tracking-wide text-white hover:bg-[#1DAA52] transition shadow-lg"
          >
            <WhatsAppIcon className="h-5 w-5" />
            Open WhatsApp & verstuur
          </a>
        ) : null}
      </div>

      {/* Footer */}
      <div className="grid grid-cols-3 gap-2 bg-[#0f1419] px-4 py-3 text-center text-[10px] text-white/50">
        <div className="flex flex-col items-center gap-0.5">
          <Icon.Clock className="h-3 w-3" />
          Reactie &lt; 24u
        </div>
        <div className="flex flex-col items-center gap-0.5">
          <Icon.User className="h-3 w-3" />
          Echte coördinator
        </div>
        <div className="flex flex-col items-center gap-0.5">
          <Icon.Lock className="h-3 w-3" />
          AVG-veilig
        </div>
      </div>
    </div>
  );
}

function Bubble({ who, children }: { who: 'me' | 'them'; children: React.ReactNode }) {
  const isMe = who === 'me';
  return (
    <div className={`flex ${isMe ? 'justify-end' : 'justify-start'} animate-[fadeIn_0.3s_ease-out]`}>
      <div
        className={`max-w-[80%] rounded-2xl px-3 py-2 text-sm shadow ${
          isMe
            ? 'rounded-br-sm bg-[#005C4B] text-white'
            : 'rounded-bl-sm bg-[#202C33] text-white'
        }`}
      >
        {children}
      </div>
    </div>
  );
}

function TextStep({
  placeholder,
  value,
  onChange,
  onNext,
  cta,
  inputMode,
  maxLength,
}: {
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  onNext: () => void;
  cta: string;
  inputMode?: 'text' | 'numeric';
  maxLength?: number;
}) {
  return (
    <div className="flex items-center gap-2">
      <input
        autoFocus
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && onNext()}
        placeholder={placeholder}
        inputMode={inputMode}
        maxLength={maxLength}
        className="flex-1 rounded-full border-0 bg-[#2A3942] px-4 py-2.5 text-sm text-white placeholder-white/50 focus:bg-[#374248] focus:outline-none"
      />
      <button
        onClick={onNext}
        className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[#25D366] text-white hover:bg-[#1DAA52] transition"
        aria-label={cta}
      >
        <Icon.ArrowRight className="h-5 w-5" />
      </button>
    </div>
  );
}

function QuickPicks({
  options,
  onPick,
}: {
  options: Array<{ label: string; value: string }>;
  onPick: (v: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((o) => (
        <button
          key={o.value}
          onClick={() => onPick(o.value)}
          className="rounded-full border border-[#25D366]/40 bg-[#25D366]/10 px-4 py-2 text-sm font-semibold text-white hover:bg-[#25D366]/20 hover:scale-[1.03] transition"
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}
