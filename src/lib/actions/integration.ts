'use server';

import { revalidatePath } from 'next/cache';
import { audit } from '@/lib/security/audit';
import type { IntegrationKey } from '@/lib/types';

export async function triggerResync(integration: IntegrationKey) {
  // Productie: ABAC check (ADMIN only), start background job
  await audit({
    actorUserId: 'session',
    actorName: 'session',
    actorRole: 'ADMIN',
    action: 'integratie.resync_gestart',
    objectType: 'Integration',
    objectId: integration,
  });
  revalidatePath('/admin/integraties');
  revalidatePath('/admin/sync-logs');
  return { ok: true as const, jobId: `${integration.toLowerCase()}-${Date.now()}` };
}
