'use client';

import { useState } from 'react';
import { Icon } from '@/components/ui/Icon';

const ALLOWED = ['application/pdf', 'image/jpeg', 'image/png'];
const MAX = 10 * 1024 * 1024;

export function UploadDropzone({
  category,
  description,
}: {
  category: string;
  description: string;
}) {
  const [consent, setConsent] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);

  function onFile(f: File | undefined) {
    setError(null);
    if (!f) {
      setFile(null);
      return;
    }
    if (!ALLOWED.includes(f.type)) {
      setError('Alleen PDF, JPG of PNG toegestaan.');
      return;
    }
    if (f.size > MAX) {
      setError('Bestand is groter dan 10 MB.');
      return;
    }
    setFile(f);
  }

  return (
    <div className="rounded-2xl border border-dashed border-bone-300 bg-bone-50 p-5">
      <div className="flex items-center gap-3">
        <div className="grid h-10 w-10 place-items-center rounded-xl bg-white text-wood-700 ring-1 ring-wood-100">
          <Icon.Upload className="h-5 w-5" />
        </div>
        <div>
          <div className="text-sm font-medium text-ink-900">Upload {category.toLowerCase()}</div>
          <p className="text-xs text-ink-500">{description}</p>
        </div>
      </div>

      <label className="mt-4 flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-bone-200 bg-white px-4 py-3 text-sm text-ink-700 hover:bg-bone-100">
        <Icon.Plus className="h-4 w-4" />
        <span>{file ? file.name : 'Kies bestand'}</span>
        <input
          type="file"
          accept=".pdf,.jpg,.jpeg,.png"
          className="hidden"
          onChange={(e) => onFile(e.target.files?.[0])}
        />
      </label>

      {error ? <div className="mt-3 text-xs text-rose-700">{error}</div> : null}

      <label className="mt-4 flex items-start gap-2 text-xs text-ink-600">
        <input
          type="checkbox"
          className="mt-0.5 h-4 w-4 rounded border-bone-300"
          checked={consent}
          onChange={(e) => setConsent(e.target.checked)}
        />
        <span>
          Ik geef toestemming voor verwerking volgens de privacyverklaring. Bestanden worden
          versleuteld opgeslagen en automatisch verwijderd na het bewaartermijn.
        </span>
      </label>

      <button
        type="button"
        disabled={!file || !consent}
        className="btn-primary mt-4 w-full disabled:cursor-not-allowed disabled:opacity-50"
      >
        <Icon.Upload className="h-4 w-4" />
        Veilig uploaden
      </button>
    </div>
  );
}
