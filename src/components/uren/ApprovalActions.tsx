'use client';

import { useState } from 'react';
import { Icon } from '@/components/ui/Icon';
import { useToast } from '@/components/ui/Toast';

export function ApprovalActions({
  timesheetId,
  studentName,
  withReasonInput,
}: {
  timesheetId: string;
  studentName: string;
  withReasonInput?: boolean;
}) {
  const { toast } = useToast();
  const [reason, setReason] = useState('');
  const [decided, setDecided] = useState<'GOEDGEKEURD' | 'AFGEKEURD' | null>(null);

  if (decided === 'GOEDGEKEURD') {
    return (
      <div className="inline-flex items-center gap-2 rounded-xl bg-emerald-50 px-3 py-2 text-sm text-emerald-700 ring-1 ring-emerald-100">
        <Icon.Check className="h-4 w-4" /> Goedgekeurd
      </div>
    );
  }

  if (decided === 'AFGEKEURD') {
    return (
      <div className="inline-flex items-center gap-2 rounded-xl bg-rose-50 px-3 py-2 text-sm text-rose-700 ring-1 ring-rose-100">
        <Icon.X className="h-4 w-4" /> Afgekeurd
      </div>
    );
  }

  return (
    <div className="flex flex-wrap items-center justify-end gap-2">
      {withReasonInput ? (
        <input
          type="text"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          className="input h-10 w-56"
          placeholder="Reden (verplicht bij afkeur)"
        />
      ) : null}
      <button
        type="button"
        className="btn-secondary"
        onClick={() => {
          if (withReasonInput && reason.trim().length < 5) {
            toast({ variant: 'error', title: 'Reden ontbreekt', description: 'Geef minimaal vijf tekens toelichting bij afkeur.' });
            return;
          }
          setDecided('AFGEKEURD');
          toast({ variant: 'info', title: `Weekstaat ${studentName} afgekeurd`, description: 'De student ontvangt een melding met de reden.' });
        }}
      >
        <Icon.X className="h-4 w-4" /> Afkeuren
      </button>
      <button
        type="button"
        className="btn-primary"
        onClick={() => {
          setDecided('GOEDGEKEURD');
          toast({ variant: 'success', title: `Weekstaat ${studentName} goedgekeurd`, description: 'Goedkeuring wordt naar Cleverdesk verzonden.' });
        }}
      >
        <Icon.Check className="h-4 w-4" /> Goedkeuren
      </button>
    </div>
  );
}
