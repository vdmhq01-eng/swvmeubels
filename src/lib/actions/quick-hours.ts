'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { db } from '@/lib/db';
import { audit } from '@/lib/security/audit';
import { sendEmail } from '@/lib/email/resend';
import { timesheetSubmittedForCompanyEmail } from '@/lib/email/templates';

const quickEntrySchema = z.object({
  studentId: z.string().min(1),
  year: z.number().int().min(2024).max(2030),
  weekNumber: z.number().int().min(1).max(53),
  weekStartDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  entries: z
    .array(
      z.object({
        date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
        type: z.enum(['PRAKTIJK', 'SCHOOL', 'ZIEKTE', 'VERLOF', 'AFWEZIG']),
        hours: z.number().min(0).max(16),
        note: z.string().max(280).optional(),
      }),
    )
    .min(1)
    .max(7),
  submit: z.boolean().optional().default(false),
});

export type QuickEntryInput = z.infer<typeof quickEntrySchema>;

export async function submitQuickWeek(input: QuickEntryInput) {
  const parsed = quickEntrySchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false as const, error: 'Ongeldige invoer' };
  }
  const data = parsed.data;

  try {
    // Upsert timesheet voor deze student + week
    const timesheet = await db.timesheet.upsert({
      where: {
        studentId_year_weekNumber: {
          studentId: data.studentId,
          year: data.year,
          weekNumber: data.weekNumber,
        },
      },
      update: {
        status: data.submit ? 'INGEDIEND' : 'CONCEPT',
        submittedAt: data.submit ? new Date() : null,
      },
      create: {
        studentId: data.studentId,
        year: data.year,
        weekNumber: data.weekNumber,
        weekStartDate: new Date(data.weekStartDate),
        status: data.submit ? 'INGEDIEND' : 'CONCEPT',
        submittedAt: data.submit ? new Date() : null,
      },
    });

    // Replace entries (delete + insert)
    await db.timeEntry.deleteMany({ where: { timesheetId: timesheet.id } });
    for (const e of data.entries) {
      if (e.hours <= 0) continue;
      await db.timeEntry.create({
        data: {
          timesheetId: timesheet.id,
          date: new Date(e.date),
          type: e.type,
          hours: e.hours,
          note: e.note ?? null,
        },
      });
    }

    // Notificeer lidbedrijf + coördinator bij indienen
    if (data.submit) {
      const student = await db.student.findUnique({
        where: { id: data.studentId },
        include: {
          user: true,
          coordinator: { include: { user: true } },
          company: { include: { contacts: { include: { user: true }, where: { primary: true }, take: 1 } } },
        },
      });
      if (student) {
        const targets = [
          student.company.contacts[0]?.userId,
          student.coordinator.userId,
        ].filter(Boolean) as string[];
        for (const userId of targets) {
          await db.notification.create({
            data: {
              userId,
              type: 'TIMESHEET',
              title: `Weekstaat W${data.weekNumber} ingediend`,
              body: `${student.user.name} heeft de weekstaat van week ${data.weekNumber} ingediend voor goedkeuring.`,
              href: '/lidbedrijf/goedkeuren',
            },
          });
        }

        // Email naar lidbedrijf praktijkopleider (fire-and-forget)
        const contact = student.company.contacts[0];
        if (contact?.user.email) {
          const totalHours = data.entries.reduce((s, e) => s + e.hours, 0);
          const email = timesheetSubmittedForCompanyEmail({
            contactName: contact.user.name,
            studentName: student.user.name,
            weekNumber: data.weekNumber,
            totalHours,
          });
          sendEmail({
            to: contact.user.email,
            subject: email.subject,
            html: email.html,
            text: email.text,
          }).catch((err) => console.error('[email timesheet]', err));
        }
      }
    }

    await audit({
      actorUserId: data.studentId,
      actorName: 'Student (session)',
      actorRole: 'STUDENT',
      action: data.submit ? 'weekstaat.ingediend' : 'weekstaat.ingediend',
      objectType: 'Timesheet',
      objectId: timesheet.id,
      context: { week: data.weekNumber, year: data.year, totaal: data.entries.reduce((s, e) => s + e.hours, 0) },
    });

    revalidatePath('/student');
    revalidatePath('/student/uren');
    revalidatePath('/lidbedrijf/goedkeuren');
    revalidatePath('/coordinator/goedkeuringen');

    return { ok: true as const, status: data.submit ? 'INGEDIEND' : 'CONCEPT', timesheetId: timesheet.id };
  } catch (err) {
    console.error('[submitQuickWeek]', err);
    return { ok: false as const, error: 'Opslaan mislukt' };
  }
}

export async function copyPreviousWeek(studentId: string, currentWeek: number, currentYear: number) {
  try {
    const prev = await db.timesheet.findFirst({
      where: {
        studentId,
        OR: [
          { year: currentYear, weekNumber: currentWeek - 1 },
          { year: currentYear - 1, weekNumber: 52 },
        ],
      },
      orderBy: [{ year: 'desc' }, { weekNumber: 'desc' }],
      include: { entries: true },
    });
    if (!prev) return { ok: false as const, error: 'Geen vorige week gevonden' };
    return {
      ok: true as const,
      entries: prev.entries.map((e) => ({
        type: e.type,
        hours: typeof e.hours === 'object' && 'toNumber' in e.hours ? (e.hours as { toNumber: () => number }).toNumber() : Number(e.hours),
        note: e.note,
      })),
    };
  } catch (err) {
    console.error('[copyPreviousWeek]', err);
    return { ok: false as const, error: 'Kon vorige week niet ophalen' };
  }
}
