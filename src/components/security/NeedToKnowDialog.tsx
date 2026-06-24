'use client';

import { useState } from 'react';
import { Icon } from '@/components/ui/Icon';
import { accessReasons, type AccessReason } from '@/lib/security/access-log';

type Props = {
  targetName: string;
  targetType: 'STUDENT' | 'COMPANY' | 'DOCUMENT';
  outsideScope?: boolean;
  onConfirm: (reason: AccessReason, note: string) => void | Promise<void>;
  onCancel: () => void;
};

/**
 * Wordt getoond wanneer een coördinator data van een student buiten
 * eigen regio wil inzien. Vraagt om expliciete reden + bevestiging.
 * Logged als 'outsideScope: true' in DocumentAccessLog.
 */
export function NeedToKnowDialog({ targetName, targetType, outsideScope, onConfirm, onCancel }: Props) {
  const [reason, setReason] = useState<AccessReason>('VERVANGING_COLLEGA');
  const [note, setNote] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function handleConfirm() {
    if (!note.trim()) return;
    setSubmitting(true);
    await onConfirm(reason, note.trim());
    setSubmitting(false);
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-ink-900/60 p-4 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl">
        <div className="flex items-start gap-4 border-b border-bone-100 p-5">
          <div className={`grid h-10 w-10 shrink-0 place-items-center rounded-md text-white ${
            outsideScope ? 'bg-amber-500' : 'bg-primary-500'
          }`}>
            {outsideScope ? <Icon.AlertTriangle className="h-5 w-5" /> : <Icon.Lock className="h-5 w-5" />}
          </div>
          <div>
            <h3 className="font-display text-lg font-bold text-ink-900">
              {outsideScope ? 'Toegang buiten jouw scope' : 'Bevestig toegang'}
            </h3>
            <p className="mt-1 text-sm text-ink-600">
              Je gaat <strong>{targetType.toLowerCase()}</strong> &lsquo;{targetName}&rsquo; openen.
              {outsideScope ? ' Dit valt buiten je standaard regio.' : ''} Geef een reden voor compliance-log.
            </p>
          </div>
        </div>

        <div className="space-y-4 p-5">
          <div>
            <label className="label mb-1.5 block">Reden</label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value as AccessReason)}
              className="input"
            >
              {accessReasons.map((r) => (
                <option key={r.value} value={r.value}>{r.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="label mb-1.5 block">Toelichting (verplicht)</label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={3}
              className="input"
              placeholder="Bv. 'Vervang Sanne tijdens vakantie, behandel sollicitatie van Jamie'"
            />
            <p className="mt-1 text-[11px] text-ink-500">
              Deze reden wordt gelogd in het toegangslog en is zichtbaar voor de privacy officer.
            </p>
          </div>

          {outsideScope ? (
            <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs text-amber-800">
              <Icon.AlertTriangle className="mr-1 inline h-3.5 w-3.5" />
              Inzage buiten eigen regio wordt gemarkeerd als &lsquo;Buiten scope&rsquo; in het audit-log.
            </div>
          ) : null}
        </div>

        <div className="flex items-center justify-end gap-2 border-t border-bone-100 bg-bone-50 px-5 py-3">
          <button onClick={onCancel} className="btn-secondary">
            Annuleren
          </button>
          <button
            onClick={handleConfirm}
            disabled={!note.trim() || submitting}
            className="btn-primary disabled:opacity-50"
          >
            {submitting ? (
              <><Icon.Refresh className="h-4 w-4 animate-spin" /> Loggen…</>
            ) : (
              <><Icon.Check className="h-4 w-4" /> Open met reden</>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
