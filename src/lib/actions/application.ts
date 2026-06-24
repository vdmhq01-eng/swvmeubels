'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { db } from '@/lib/db';
import { audit } from '@/lib/security/audit';
import { sendEmail } from '@/lib/email/resend';
import { applicationConfirmationEmail, newApplicationForCoordinatorEmail } from '@/lib/email/templates';

const applicationSchema = z.object({
  firstName: z.string().min(2).max(60),
  lastName: z.string().min(2).max(60),
  email: z.string().email(),
  phone: z.string().min(8).max(20),
  postcode: z.string().min(4).max(8),
  applicantType: z.enum(['Student', 'Bedrijf', 'Ouder / verzorger']),
  programInterest: z.string().min(1).max(80).optional(),
  message: z.string().max(2000).optional(),
  consent: z.literal(true),
});

export type ApplicationInput = z.infer<typeof applicationSchema>;

// Postcode → regio mapping. Op basis van de eerste 4 cijfers van postcode
// kunnen we de juiste regionale coördinator vinden.
function postcodeToRegionName(postcode: string): string | null {
  const num = parseInt(postcode.replace(/\D/g, '').slice(0, 4), 10);
  if (!num) return null;
  if (num >= 9000 && num <= 9999) return 'Noord-Nederland';
  if (num >= 8000 && num <= 8999) return 'Twente-Salland';
  if (num >= 7000 && num <= 7999) return 'Achterhoek-Liemers';
  if (num >= 6000 && num <= 6999) return 'Limburg';
  if (num >= 5000 && num <= 5999) return 'Brabant';
  if (num >= 3000 && num <= 3999) return 'Rotterdam';
  if (num >= 2000 && num <= 2999) return 'Noord-Holland';
  if (num >= 1000 && num <= 1999) return 'AAA';
  return null;
}

export async function submitApplication(
  input: ApplicationInput,
): Promise<{ ok: true; id: string; regionName?: string; coordinatorName?: string } | { ok: false; error: string }> {
  const parsed = applicationSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: 'Ongeldige invoer: ' + parsed.error.issues.map((i) => i.message).join(', ') };
  }
  const data = parsed.data;

  try {
    const regionName = postcodeToRegionName(data.postcode);
    let region = null;
    let coordinator = null;

    if (regionName) {
      region = await db.region.findFirst({ where: { name: regionName } });
      if (region) {
        coordinator = await db.coordinator.findFirst({
          where: { regionId: region.id },
          include: { user: true },
        });
      }
    }

    const application = await db.application.create({
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        postcode: data.postcode,
        applicantType: data.applicantType,
        programInterest: data.programInterest,
        message: data.message,
        regionId: region?.id,
        assignedToId: coordinator?.userId,
        status: coordinator ? 'TOEGEWEZEN' : 'NIEUW',
      },
    });

    // Maak notification voor coördinator
    if (coordinator) {
      await db.notification.create({
        data: {
          userId: coordinator.userId,
          type: 'APPLICATION',
          title: `Nieuwe sollicitatie van ${data.firstName} ${data.lastName}`,
          body: `${data.applicantType} uit postcode ${data.postcode} · ${data.programInterest ?? 'Geen specifieke opleiding'}`,
          href: `/coordinator/sollicitaties/${application.id}`,
        },
      });
    }

    await audit({
      actorUserId: 'public',
      actorName: `${data.firstName} ${data.lastName}`,
      actorRole: 'STUDENT',
      action: 'weekstaat.ingediend',
      objectType: 'Application',
      objectId: application.id,
      context: {
        regio: regionName ?? 'onbekend',
        toegewezen: coordinator?.user.name ?? 'geen',
      },
    });

    // Stuur emails parallel — faalt stilletjes (logs naar console) als
    // RESEND_API_KEY ontbreekt, blokkeert nooit de hoofdflow.
    const confirmation = applicationConfirmationEmail({
      firstName: data.firstName,
      coordinatorName: coordinator?.user.name,
      regionName: region?.name,
    });
    const emailPromises: Promise<unknown>[] = [
      sendEmail({
        to: data.email,
        subject: confirmation.subject,
        html: confirmation.html,
        text: confirmation.text,
      }),
    ];
    if (coordinator?.user.email) {
      const coordEmail = newApplicationForCoordinatorEmail({
        coordinatorName: coordinator.user.name,
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        postcode: data.postcode,
        applicantType: data.applicantType,
        programInterest: data.programInterest,
        message: data.message,
        applicationId: application.id,
      });
      emailPromises.push(
        sendEmail({
          to: coordinator.user.email,
          subject: coordEmail.subject,
          html: coordEmail.html,
          text: coordEmail.text,
          replyTo: data.email,
        }),
      );
    }
    // Fire-and-forget — wachten kost extra latency
    Promise.all(emailPromises).catch((err) => console.error('[email batch]', err));

    revalidatePath('/coordinator/sollicitaties');
    revalidatePath('/coordinator/meldingen');

    return {
      ok: true,
      id: application.id,
      regionName: region?.name,
      coordinatorName: coordinator?.user.name,
    };
  } catch (err) {
    console.error('[submitApplication]', err);
    return { ok: false, error: 'Er ging iets mis bij het opslaan. Probeer het opnieuw of mail ons direct.' };
  }
}

export async function listUnreadNotifications(userId: string) {
  try {
    return await db.notification.findMany({
      where: { userId, read: false },
      orderBy: { createdAt: 'desc' },
      take: 20,
    });
  } catch {
    return [];
  }
}

export async function markNotificationRead(id: string) {
  try {
    await db.notification.update({ where: { id }, data: { read: true } });
    revalidatePath('/coordinator/meldingen');
  } catch (err) {
    console.error('[markNotificationRead]', err);
  }
}
