import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

import { regions } from '@/lib/mock/regions';
import { programs } from '@/lib/mock/programs';
import { coordinators } from '@/lib/mock/users';
import { companies } from '@/lib/mock/companies';
import { students } from '@/lib/mock/students';
import { contracts, absences, holidayBalances, documents, planningItems, tasks, messages } from '@/lib/mock/misc';
import { currentWeekTimesheet, previousTimesheets, pendingApprovals } from '@/lib/mock/timesheets';
import { faqItems, knowledgeArticles } from '@/lib/mock/faq';
import { integrations, recentSyncLogs, recentAuditLogs } from '@/lib/mock/integrations';
import { allUsers, securityLogs, extraAuditLogs } from '@/lib/mock/admin';

import type {
  ProgramLevel as ProgramLevelType,
  ContractStatus as ContractStatusType,
  TimesheetStatus as TimesheetStatusType,
  TimeEntryType as TimeEntryTypeType,
  AbsenceType as AbsenceTypeType,
  DocumentCategory as DocumentCategoryType,
  PlanningType as PlanningTypeType,
  PlanningStatus as PlanningStatusType,
  TaskStatus as TaskStatusType,
  TaskPriority as TaskPriorityType,
  PublishStatus as PublishStatusType,
  IntegrationKey as IntegrationKeyType,
  SyncStatus as SyncStatusType,
  Role as RoleType,
} from '@prisma/client';

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

const levelMap: Record<string, ProgramLevelType> = {
  'BBL 2': 'BBL_2' as ProgramLevelType,
  'BBL 3': 'BBL_3' as ProgramLevelType,
  'BBL 4': 'BBL_4' as ProgramLevelType,
};

const contractStatusMap: Record<string, ContractStatusType> = {
  Actief: 'ACTIEF' as ContractStatusType,
  Aflopend: 'AFLOPEND' as ContractStatusType,
  Verlopen: 'VERLOPEN' as ContractStatusType,
  Concept: 'CONCEPT' as ContractStatusType,
};

export async function GET(req: Request) {
  const url = new URL(req.url);
  const key = url.searchParams.get('key') ?? '';
  const expected = process.env.SEED_KEY ?? '';
  if (!expected || key !== expected) {
    return NextResponse.json({ ok: false, error: 'Ongeldige seed key' }, { status: 401 });
  }

  const log: string[] = [];
  const t0 = Date.now();

  try {
    // 1. Delete bestaande data in juiste volgorde (FK dependencies)
    await db.$transaction([
      db.timeEntry.deleteMany({}),
      db.notification.deleteMany({}),
      db.application.deleteMany({}),
      db.securityLog.deleteMany({}),
      db.syncLog.deleteMany({}),
      db.auditLog.deleteMany({}),
      db.task.deleteMany({}),
      db.message.deleteMany({}),
      db.document.deleteMany({}),
      db.planningItem.deleteMany({}),
      db.absence.deleteMany({}),
      db.holidayBalance.deleteMany({}),
      db.timesheet.deleteMany({}),
      db.contract.deleteMany({}),
      db.knowledgeArticle.deleteMany({}),
      db.faqItem.deleteMany({}),
      db.companyContact.deleteMany({}),
      db.student.deleteMany({}),
      db.coordinator.deleteMany({}),
      db.company.deleteMany({}),
      db.educationProgram.deleteMany({}),
      db.integration.deleteMany({}),
      db.user.deleteMany({}),
      db.region.deleteMany({}),
    ]);
    log.push('cleared');

    // 2. Bulk insert lookup tables in parallel
    await Promise.all([
      db.region.createMany({ data: regions.map((r) => ({ id: r.id, code: r.code, name: r.name })) }),
      db.educationProgram.createMany({
        data: programs.map((p) => ({ id: p.id, name: p.name, level: levelMap[p.level], durationMonths: p.durationMonths })),
      }),
      db.integration.createMany({
        data: integrations.map((i) => ({
          key: i.key as IntegrationKeyType,
          name: i.name,
          status: i.status,
          webhookEnabled: i.webhookEnabled,
          scopes: i.scope,
          lastSyncAt: i.lastSyncAt ? new Date(i.lastSyncAt) : null,
          nextSyncAt: i.nextSyncAt ? new Date(i.nextSyncAt) : null,
        })),
      }),
    ]);
    log.push(`${regions.length} regio's, ${programs.length} opleidingen, ${integrations.length} integraties`);

    // 3. Users (alle in één call)
    await db.user.createMany({
      data: allUsers.map((u) => ({
        id: u.id,
        email: u.email,
        name: u.name,
        role: u.role as RoleType,
        twoFactorEnabled: u.twoFactorEnabled ?? false,
        regionId: u.regionId,
        lastLoginAt: u.lastLoginAt ? new Date(u.lastLoginAt) : null,
        createdAt: new Date(u.createdAt),
      })),
    });
    log.push(`${allUsers.length} users`);

    // 4. Student-users (apart van allUsers in mock data)
    await db.user.createMany({
      data: students.map((s) => ({
        id: `user-stu-${s.id.replace('stu-', '')}`,
        email: s.email,
        name: s.name,
        role: 'STUDENT' as RoleType,
        regionId: s.regionId,
      })),
      skipDuplicates: true,
    });

    // 5. Companies + coordinators + students parallel
    await Promise.all([
      db.coordinator.createMany({
        data: coordinators.map((c) => ({ id: c.id, userId: `user-coord-${c.id.replace('coord-', '')}`, regionId: c.regionId })),
      }),
      db.company.createMany({
        data: companies.map((c) => ({
          id: c.id,
          name: c.name,
          regionId: regions.find((r) => r.name === c.region)?.id ?? 'reg-noord',
          membership: c.membership,
        })),
      }),
    ]);
    log.push(`${coordinators.length} coördinator-profielen, ${companies.length} lidbedrijven`);

    await db.student.createMany({
      data: students.map((s) => ({
        id: s.id,
        externalId: s.externalId,
        cleverdeskId: s.cleverdeskId,
        userId: `user-stu-${s.id.replace('stu-', '')}`,
        regionId: s.regionId,
        companyId: s.companyId,
        coordinatorId: s.coordinatorId,
        programId: s.programId,
        yearOfStudy: s.yearOfStudy,
        startDate: new Date(s.startDate),
        expectedDiplomaDate: s.expectedDiplomaDate ? new Date(s.expectedDiplomaDate) : null,
        signal: s.signal,
      })),
    });
    log.push(`${students.length} studenten`);

    // 6. Company contacts
    await db.companyContact.createMany({
      data: [
        { companyId: 'comp-001', userId: 'user-bedr-001', role: 'Praktijkopleider', primary: true },
        { companyId: 'comp-002', userId: 'user-bedr-002', role: 'Praktijkopleider', primary: true },
        { companyId: 'comp-003', userId: 'user-bedr-003', role: 'Praktijkopleider', primary: true },
      ],
    });

    // 7. Contracts, absences, holidayBalances parallel
    await Promise.all([
      db.contract.createMany({
        data: contracts.map((c) => ({
          id: c.id,
          studentId: c.studentId,
          companyId: c.companyId,
          startDate: new Date(c.startDate),
          endDate: new Date(c.endDate),
          hoursPerWeek: c.hoursPerWeek,
          status: contractStatusMap[c.status],
        })),
      }),
      db.absence.createMany({
        data: absences.map((a) => ({
          id: a.id,
          studentId: a.studentId,
          type: a.type as AbsenceTypeType,
          startDate: new Date(a.startDate),
          endDate: a.endDate ? new Date(a.endDate) : null,
          reportedAt: new Date(a.reportedAt),
          closedAt: a.status === 'GESLOTEN' && a.endDate ? new Date(a.endDate) : null,
        })),
      }),
      db.holidayBalance.createMany({
        data: holidayBalances.map((h) => ({
          studentId: h.studentId,
          totalDays: h.totalDays,
          usedDays: h.usedDays,
          remainingDays: h.remainingDays,
          holidayMoneyCents: h.holidayMoneyCents,
          lastUpdated: new Date(h.lastUpdated),
        })),
      }),
    ]);
    log.push(`${contracts.length} contracten, ${absences.length} verzuim, ${holidayBalances.length} vakanties`);

    // 8. Timesheets eerst (parent), dan entries
    const allTs = [currentWeekTimesheet, ...previousTimesheets, ...pendingApprovals.map((p) => p.timesheet)];
    await db.timesheet.createMany({
      data: allTs.map((t) => ({
        id: t.id,
        studentId: t.studentId,
        weekNumber: t.weekNumber,
        year: t.year,
        weekStartDate: new Date(t.weekStartDate),
        status: t.status as TimesheetStatusType,
        submittedAt: t.submittedAt ? new Date(t.submittedAt) : null,
        rejectionReason: t.rejectionReason ?? null,
      })),
      skipDuplicates: true,
    });
    await db.timeEntry.createMany({
      data: allTs.flatMap((t) =>
        t.entries.map((e) => ({
          timesheetId: t.id,
          date: new Date(e.date),
          type: e.type as TimeEntryTypeType,
          hours: e.hours,
          note: e.note ?? null,
        })),
      ),
    });
    log.push(`${allTs.length} weekstaten`);

    // 9. Documents, planning, tasks, messages parallel
    await Promise.all([
      db.document.createMany({
        data: documents.map((d) => ({
          id: d.id,
          studentId: d.studentId ?? null,
          companyId: d.companyId ?? null,
          category: d.category as DocumentCategoryType,
          fileName: d.fileName,
          storageKey: `documents/${d.category.toLowerCase()}/${d.id}`,
          mimeType: d.mimeType,
          sizeBytes: d.sizeBytes,
          checksum: 'seed-placeholder',
          encryptionKeyId: 'kms-default',
          uploadedByUserId: d.uploadedByUserId,
          uploadedAt: new Date(d.uploadedAt),
          retentionUntil: new Date(d.retentionUntil),
        })),
      }),
      db.planningItem.createMany({
        data: planningItems.map((p) => ({
          id: p.id,
          title: p.title,
          type: p.type as PlanningTypeType,
          startDate: new Date(p.startDate),
          endDate: p.endDate ? new Date(p.endDate) : null,
          regionId: p.regionId ?? null,
          programId: p.programId ?? null,
          status: p.status as PlanningStatusType,
        })),
      }),
      db.task.createMany({
        data: tasks.map((t) => ({
          id: t.id,
          title: t.title,
          studentId: t.studentId ?? null,
          dueDate: t.dueDate ? new Date(t.dueDate) : null,
          status: t.status as TaskStatusType,
          priority: t.priority as TaskPriorityType,
        })),
      }),
      db.message.createMany({
        data: messages
          .filter((m) => m.fromUserId !== 'user-system')
          .map((m) => ({
            id: m.id,
            fromUserId: m.fromUserId,
            toUserId: m.toUserId,
            subject: m.subject,
            body: m.preview,
            sentAt: new Date(m.sentAt),
            readAt: m.read ? new Date(m.sentAt) : null,
          })),
      }),
    ]);
    log.push(`${documents.length} docs, ${planningItems.length} planning, ${tasks.length} taken, ${messages.length} berichten`);

    // 10. Content + logs parallel
    await Promise.all([
      db.faqItem.createMany({
        data: faqItems.map((f) => ({
          id: f.id,
          question: f.question,
          answer: 'Antwoord wordt later geredigeerd.',
          category: f.category,
          roles: f.roles as RoleType[],
          status: f.status as PublishStatusType,
          order: f.order,
          updatedBy: f.updatedByName,
        })),
      }),
      db.knowledgeArticle.createMany({
        data: knowledgeArticles.map((a) => ({
          id: a.id,
          title: a.title,
          body: a.excerpt,
          category: a.category,
          tags: a.tags,
          roles: a.roles as RoleType[],
          status: a.status as PublishStatusType,
          version: a.version,
          updatedBy: a.updatedByName,
        })),
      }),
      db.syncLog.createMany({
        data: recentSyncLogs.map((l) => ({
          id: l.id,
          integration: l.integration as IntegrationKeyType,
          direction: l.direction,
          objectType: l.object,
          externalId: l.externalId ?? null,
          status: l.status as SyncStatusType,
          startedAt: new Date(l.startedAt),
          durationMs: l.durationMs,
          message: l.message ?? null,
        })),
      }),
      db.auditLog.createMany({
        data: [...recentAuditLogs, ...extraAuditLogs].map((a) => ({
          id: a.id,
          at: new Date(a.at),
          actorUserId: a.actorUserId,
          actorRole: a.actorRole as RoleType,
          action: a.action,
          objectType: a.objectType,
          objectId: a.objectId,
          ip: a.ip ?? null,
          userAgent: a.userAgent ?? null,
          context: a.context ?? undefined,
        })),
      }),
      db.securityLog.createMany({
        data: securityLogs.map((s) => ({
          id: s.id,
          at: new Date(s.at),
          severity: s.severity,
          event: s.event,
          userId: s.userId ?? null,
          ip: s.ip ?? null,
          message: s.message,
        })),
      }),
    ]);
    log.push(`logs + content gesynced`);

    return NextResponse.json({ ok: true, duration: Date.now() - t0, log });
  } catch (err) {
    console.error('[seed]', err);
    return NextResponse.json({ ok: false, error: String(err), duration: Date.now() - t0, log }, { status: 500 });
  }
}
