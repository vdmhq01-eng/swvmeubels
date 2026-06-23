'use client';

import { useState } from 'react';
import { Icon } from '@/components/ui/Icon';
import { useToast } from '@/components/ui/Toast';
import { submitApplication, type ApplicationInput } from '@/lib/actions/application';

export function SollicitatieForm() {
  const { toast } = useToast();
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState<{ regionName?: string; coordinatorName?: string } | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    const form = e.currentTarget;
    const fd = new FormData(form);

    const input: ApplicationInput = {
      firstName: String(fd.get('firstName') ?? '').trim(),
      lastName: String(fd.get('lastName') ?? '').trim(),
      email: String(fd.get('email') ?? '').trim(),
      phone: String(fd.get('phone') ?? '').trim(),
      postcode: String(fd.get('postcode') ?? '').trim(),
      applicantType: String(fd.get('applicantType') ?? 'Student') as ApplicationInput['applicantType'],
      programInterest: String(fd.get('programInterest') ?? '').trim() || undefined,
      message: String(fd.get('message') ?? '').trim() || undefined,
      consent: fd.get('consent') === 'on' ? (true as const) : (false as never),
    };

    if (!input.consent) {
      setError('Je moet toestemming geven voor verwerking van je gegevens.');
      setSubmitting(false);
      return;
    }

    const result = await submitApplication(input);
    setSubmitting(false);

    if (!result.ok) {
      setError(result.error);
      toast({ variant: 'error', title: 'Versturen mislukt', description: result.error });
      return;
    }

    setSuccess({ regionName: result.regionName, coordinatorName: result.coordinatorName });
    toast({
      variant: 'success',
      title: 'Sollicitatie verstuurd!',
      description: result.coordinatorName
        ? `Toegewezen aan ${result.coordinatorName} (regio ${result.regionName}).`
        : 'We nemen binnen 3 werkdagen contact op.',
    });
    form.reset();
  }

  if (success) {
    return (
      <div className="card-padded">
        <div className="grid h-12 w-12 place-items-center rounded-md bg-emerald-500 text-white">
          <Icon.Check className="h-6 w-6" />
        </div>
        <h2 className="mt-4 font-display text-2xl font-bold">Sollicitatie verstuurd!</h2>
        <p className="mt-3 text-base text-ink-700">
          Bedankt voor je sollicitatie. We hebben deze direct doorgezet naar{' '}
          {success.coordinatorName ? (
            <>
              <strong>{success.coordinatorName}</strong>, de coördinator van regio{' '}
              <strong>{success.regionName}</strong>.
            </>
          ) : (
            <>de juiste coördinator op basis van je postcode.</>
          )}
        </p>
        <div className="mt-6 rounded-2xl border border-bone-200 bg-bone-50 p-5">
          <h3 className="font-display text-base font-bold">Wat gebeurt er nu?</h3>
          <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm text-ink-700">
            <li>Je ontvangt direct een bevestigingsmail op het opgegeven adres.</li>
            <li>De coördinator neemt binnen <strong>3 werkdagen</strong> contact op.</li>
            <li>Kennismakingsgesprek (telefoon of bij ons op kantoor).</li>
            <li>Match met een lidbedrijf in jouw regio — vaak binnen 2 weken aan het werk.</li>
          </ol>
        </div>
        <button
          onClick={() => setSuccess(null)}
          className="btn-secondary mt-6"
        >
          Nieuwe sollicitatie
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="card-padded space-y-5">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <label className="label mb-1.5 block">Voornaam</label>
          <input name="firstName" required className="input" />
        </div>
        <div>
          <label className="label mb-1.5 block">Achternaam</label>
          <input name="lastName" required className="input" />
        </div>
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <label className="label mb-1.5 block">E-mailadres</label>
          <input name="email" type="email" required className="input" />
        </div>
        <div>
          <label className="label mb-1.5 block">Telefoonnummer</label>
          <input name="phone" required className="input" />
        </div>
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <label className="label mb-1.5 block">Postcode</label>
          <input name="postcode" required className="input" placeholder="1234 AB" />
          <p className="mt-1 text-[11px] text-ink-500">
            Op basis van postcode koppelen we je aan de juiste regionale coördinator.
          </p>
        </div>
        <div>
          <label className="label mb-1.5 block">Ik ben</label>
          <select name="applicantType" defaultValue="Student" className="input">
            <option>Student</option>
            <option>Bedrijf</option>
            <option>Ouder / verzorger</option>
          </select>
        </div>
      </div>
      <div>
        <label className="label mb-1.5 block">Welke opleiding heeft je interesse?</label>
        <select name="programInterest" className="input">
          <option>Meubelmaker / Interieurbouwer (BBL 2/3)</option>
          <option>Scheepsinterieurbouwer (BBL 3)</option>
          <option>Machinaal houtbewerker (BBL 2)</option>
          <option>Weet ik nog niet</option>
        </select>
      </div>
      <div>
        <label className="label mb-1.5 block">Vertel iets over jezelf</label>
        <textarea
          name="message"
          rows={5}
          className="input"
          placeholder="Bijvoorbeeld: ervaring, motivatie, vragen…"
        />
      </div>
      <label className="flex items-start gap-2 text-xs text-ink-600">
        <input name="consent" type="checkbox" className="mt-0.5 h-4 w-4 rounded border-bone-300" />
        <span>
          Ik geef toestemming voor verwerking van mijn gegevens volgens de{' '}
          <a href="/privacy" className="font-semibold text-primary-600">privacyverklaring</a>.
        </span>
      </label>
      {error ? (
        <div className="rounded-xl border border-rose-100 bg-rose-50 p-3 text-sm text-rose-700">
          {error}
        </div>
      ) : null}
      <button
        type="submit"
        disabled={submitting}
        className="btn-primary w-full disabled:opacity-60"
      >
        {submitting ? (
          <>
            <Icon.Refresh className="h-4 w-4 animate-spin" />
            Bezig met versturen…
          </>
        ) : (
          <>
            <Icon.Check className="h-4 w-4" />
            Verstuur sollicitatie
          </>
        )}
      </button>
    </form>
  );
}
