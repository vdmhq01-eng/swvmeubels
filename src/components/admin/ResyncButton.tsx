'use client';

import { useState } from 'react';
import { Icon } from '@/components/ui/Icon';
import { useToast } from '@/components/ui/Toast';
import type { IntegrationKey } from '@/lib/types';

export function ResyncButton({ integration, label = 'Resync nu' }: { integration: IntegrationKey; label?: string }) {
  const { toast } = useToast();
  const [busy, setBusy] = useState(false);

  return (
    <button
      type="button"
      disabled={busy}
      className="btn-primary disabled:opacity-60"
      onClick={async () => {
        setBusy(true);
        // Productie: call POST /api/integrations/<key>/resync
        await new Promise((r) => setTimeout(r, 800));
        toast({
          variant: 'success',
          title: `${integration === 'EXACT_SYNERGY' ? 'Exact' : 'Cleverdesk'} sync gestart`,
          description: 'Status volg je in het sync log.',
        });
        setBusy(false);
      }}
    >
      <Icon.Refresh className={`h-4 w-4 ${busy ? 'animate-spin' : ''}`} />
      {busy ? 'Bezig…' : label}
    </button>
  );
}
