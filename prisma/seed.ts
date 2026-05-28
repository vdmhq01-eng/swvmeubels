/*
 * SWV Meubel - database seed.
 * Idempotent: gebruik herhaaldelijk (`npm run prisma:seed`) zonder duplicates.
 *
 * Volgorde respecteert foreign keys:
 *   Region → EducationProgram → User → Coordinator → Company → CompanyContact
 *   → Student → Contract → Absence → HolidayBalance
 *   → Timesheet/TimeEntry → Document → Planning → Task → Message
 *   → FAQ → Knowledge → Integration → AuditLog/SecurityLog.
 */
import { PrismaClient, ProgramLevel, ContractStatus, TimesheetStatus, TimeEntryType, AbsenceType, DocumentCategory, PlanningType, PlanningStatus, TaskStatus, TaskPriority, PublishStatus, IntegrationKey, SyncStatus, Role } from '@prisma/client';

import { regions } from '../src/lib/mock/regions';
import { programs } from '../src/lib/mock/programs';
import { coordinators } from '../src/lib/mock/users';
import { companies } from '../src/lib/mock/companies';
import { students } from '../src/lib/mock/students';
import { contracts, absences, holidayBalances, documents, planningItems, tasks, messages } from '../src/lib/mock/misc';
import { currentWeekTimesheet, previousTimesheets, pendingApprovals } from '../src/lib/mock/timesheets';
import { faqItems, knowledgeArticles } from '../src/lib/mock/faq';
import { integrations, recentSyncLogs, recentAuditLogs } from '../src/lib/mock/integrations';
import { allUsers, securityLogs, extraAuditLogs } from '../src/lib/mock/admin';

const db = new PrismaClient();

const levelMap: Record<string, ProgramLevel> = {
  'BBL 2': ProgramLevel.BBL_2,
  'BBL 3': ProgramLevel.BBL_3,
  'BBL 4': ProgramLevel.BBL_4,
};

const contractStatusMap: Record<string, ContractStatus> = {
  Actief: ContractStatus.ACTIEF,
  Aflopend: ContractStatus.AFLOPEND,
  Verlopen: ContractStatus.VERLOPEN,
  Concept: ContractStatus.CONCEPT,
};

async function main() {
  console.log('Seeden van SWV Meubel database…');

  // -- Regio's --
  for (const r of regions) {
    await db.region.upsert({
      where: { id: r.id },
      update: { name: r.name, code: r.code },
      create: { id: r.id, name: r.name, code: r.code },
    });
  }
  console.log(`  ${regions.length} regio's`);

  // -- Opleidingen --
  for (const p of programs) {
    await db.educationProgram.upsert({
      where: { id: p.id },
      update: { name: p.name, level: levelMap[p.level], durationMonths: p.durationMonths },
      create: { id: p.id, name: p.name, level: levelMap[p.level], durationMonths: p.durationMonths },
    });
  }
  console.log(`  ${programs.length} opleidingen`);

  // -- Users (admins, coördinatoren, lidbedrijven, studenten) --
  for (const u of allUsers) {
    await db.user.upsert({
      where: { id: u.id },
      update: {
        email: u.email,
        name: u.name,
        role: u.role as Role,
        twoFactorEnabled: u.twoFactorEnabled ?? false,
        regionId: u.regionId,
        lastLoginAt: u.lastLoginAt ? new Date(u.lastLoginAt) : null,
      },
      create: {
        id: u.id,
        email: u.email,
        name: u.name,
        role: u.role as Role,
        twoFactorEnabled: u.twoFactorEnabled ?? false,
        regionId: u.regionId,
        lastLoginAt: u.lastLoginAt ? new Date(u.lastLoginAt) : null,
        createdAt: new Date(u.createdAt),
      },
    });
  }
  console.log(`  ${allUsers.length} users`);

  // -- Coordinator profielen --
  for (const c of coordinators) {
    const userId = `user-coord-${c.id.replace('coord-', '')}`;
    await db.coordinator.upsert({
      where: { id: c.id },
      update: { userId, regionId: c.regionId },
      create: { id: c.id, userId, regionId: c.regionId },
    });
  }
  console.log(`  ${coordinators.length} coordinator profielen`);

  // -- Companies --
  for (const c of companies) {
    const regionId = regions.find((r) => r.name === c.region)?.id ?? 'reg-noord';
    await db.company.upsert({
      where: { id: c.id },
      update: { name: c.name, regionId, membership: c.membership },
      create: { id: c.id, name: c.name, regionId, membership: c.membership },
    });
  }
  console.log(`  ${companies.length} lidbedrijven`);

  // -- CompanyContact (mock: koppel eerste company aan user-bedr-001 etc.) --
  const contactMap = [
    { companyId: 'comp-001', userId: 'user-bedr-001' },
    { companyId: 'comp-002', userId: 'user-bedr-002' },
    { companyId: 'comp-003', userId: 'user-bedr-003' },
  ];
  for (const cc of contactMap) {
    await db.companyContact.upsert({
      where: { companyId_userId: cc },
      update: { role: 'Praktijkopleider', primary: true },
      create: { ...cc, role: 'Praktijkopleider', primary: true },
    });
  }

  // -- Students --
  for (const s of students) {
    const userId = `user-stu-${s.id.replace('stu-', '')}`;
    // userId may not exist in allUsers (only first 4 students in admin mock); maak desnoods aan
    await db.user.upsert({
      where: { id: userId },
      update: {},
      create: {
        id: userId,
        email: s.email,
        name: s.name,
        role: Role.STUDENT,
        regionId: s.regionId,
      },
    });

    await db.student.upsert({
      where: { id: s.id },
      update: {
        externalId: s.externalId,
        cleverdeskId: s.cleverdeskId,
        userId,
        regionId: s.regionId,
        companyId: s.companyId,
        coordinatorId: s.coordinatorId,
        programId: s.programId,
        yearOfStudy: s.yearOfStudy,
        startDate: new Date(s.startDate),
        expectedDiplomaDate: s.expectedDiplomaDate ? new Date(s.expectedDiplomaDate) : null,
        signal: s.signal,
      },
      create: {
        id: s.id,
        externalId: s.externalId,
        cleverdeskId: s.cleverdeskId,
        userId,
        regionId: s.regionId,
        companyId: s.companyId,
        coordinatorId: s.coordinatorId,
        programId: s.programId,
        yearOfStudy: s.yearOfStudy,
        startDate: new Date(s.startDate),
        expectedDiplomaDate: s.expectedDiplomaDate ? new Date(s.expectedDiplomaDate) : null,
        signal: s.signal,
      },
    });
  }
  console.log(`  ${students.length} studenten`);

  // -- Contracts --
  for (const c of contracts) {
    await db.contract.upsert({
      where: { id: c.id },
      update: {
        studentId: c.studentId,
        companyId: c.companyId,
        startDate: new Date(c.startDate),
        endDate: new Date(c.endDate),
        hoursPerWeek: c.hoursPerWeek,
        status: contractStatusMap[c.status],
      },
      create: {
        id: c.id,
        studentId: c.studentId,
        companyId: c.companyId,
        startDate: new Date(c.startDate),
        endDate: new Date(c.endDate),
        hoursPerWeek: c.hoursPerWeek,
        status: contractStatusMap[c.status],
      },
    });
  }
  console.log(`  ${contracts.length} contracten`);

  // -- Absences --
  for (const a of absences) {
    await db.absence.upsert({
      where: { id: a.id },
      update: {
        studentId: a.studentId,
        type: a.type as AbsenceType,
        startDate: new Date(a.startDate),
        endDate: a.endDate ? new Date(a.endDate) : null,
        reportedAt: new Date(a.reportedAt),
        closedAt: a.status === 'GESLOTEN' && a.endDate ? new Date(a.endDate) : null,
      },
      create: {
        id: a.id,
        studentId: a.studentId,
        type: a.type as AbsenceType,
        startDate: new Date(a.startDate),
        endDate: a.endDate ? new Date(a.endDate) : null,
        reportedAt: new Date(a.reportedAt),
        closedAt: a.status === 'GESLOTEN' && a.endDate ? new Date(a.endDate) : null,
      },
    });
  }
  console.log(`  ${absences.length} verzuim meldingen`);

  // -- Holiday balances --
  for (const h of holidayBalances) {
    await db.holidayBalance.upsert({
      where: { studentId: h.studentId },
      update: {
        totalDays: h.totalDays,
        usedDays: h.usedDays,
        remainingDays: h.remainingDays,
        holidayMoneyCents: h.holidayMoneyCents,
        lastUpdated: new Date(h.lastUpdated),
      },
      create: {
        studentId: h.studentId,
        totalDays: h.totalDays,
        usedDays: h.usedDays,
        remainingDays: h.remainingDays,
        holidayMoneyCents: h.holidayMoneyCents,
        lastUpdated: new Date(h.lastUpdated),
      },
    });
  }

  // -- Timesheets + Entries --
  const allTimesheets = [
    currentWeekTimesheet,
    ...previousTimesheets,
    ...pendingApprovals.map((p) => p.timesheet),
  ];
  for (const t of allTimesheets) {
    await db.timesheet.upsert({
      where: { id: t.id },
      update: {
        studentId: t.studentId,
        weekNumber: t.weekNumber,
        year: t.year,
        weekStartDate: new Date(t.weekStartDate),
        status: t.status as TimesheetStatus,
        submittedAt: t.submittedAt ? new Date(t.submittedAt) : null,
        rejectionReason: t.rejectionReason ?? null,
      },
      create: {
        id: t.id,
        studentId: t.studentId,
        weekNumber: t.weekNumber,
        year: t.year,
        weekStartDate: new Date(t.weekStartDate),
        status: t.status as TimesheetStatus,
        submittedAt: t.submittedAt ? new Date(t.submittedAt) : null,
        rejectionReason: t.rejectionReason ?? null,
      },
    });

    // Vervang entries idempotent (delete + insert is acceptabel voor seed)
    await db.timeEntry.deleteMany({ where: { timesheetId: t.id } });
    for (const e of t.entries) {
      await db.timeEntry.create({
        data: {
          id: e.id,
          timesheetId: t.id,
          date: new Date(e.date),
          type: e.type as TimeEntryType,
          hours: e.hours,
          note: e.note ?? null,
        },
      });
    }
  }
  console.log(`  ${allTimesheets.length} weekstaten`);

  // -- Documents --
  for (const d of documents) {
    await db.document.upsert({
      where: { id: d.id },
      update: {
        studentId: d.studentId ?? null,
        companyId: d.companyId ?? null,
        category: d.category as DocumentCategory,
        fileName: d.fileName,
        mimeType: d.mimeType,
        sizeBytes: d.sizeBytes,
        uploadedByUserId: d.uploadedByUserId,
        retentionUntil: new Date(d.retentionUntil),
      },
      create: {
        id: d.id,
        studentId: d.studentId ?? null,
        companyId: d.companyId ?? null,
        category: d.category as DocumentCategory,
        fileName: d.fileName,
        storageKey: `documents/${d.category.toLowerCase()}/${d.id}`,
        mimeType: d.mimeType,
        sizeBytes: d.sizeBytes,
        checksum: 'seed-placeholder',
        encryptionKeyId: 'kms-default',
        uploadedByUserId: d.uploadedByUserId,
        uploadedAt: new Date(d.uploadedAt),
        retentionUntil: new Date(d.retentionUntil),
      },
    });
  }
  console.log(`  ${documents.length} documenten`);

  // -- Planning --
  for (const p of planningItems) {
    await db.planningItem.upsert({
      where: { id: p.id },
      update: {
        title: p.title,
        type: p.type as PlanningType,
        startDate: new Date(p.startDate),
        endDate: p.endDate ? new Date(p.endDate) : null,
        regionId: p.regionId ?? null,
        programId: p.programId ?? null,
        status: p.status as PlanningStatus,
      },
      create: {
        id: p.id,
        title: p.title,
        type: p.type as PlanningType,
        startDate: new Date(p.startDate),
        endDate: p.endDate ? new Date(p.endDate) : null,
        regionId: p.regionId ?? null,
        programId: p.programId ?? null,
        status: p.status as PlanningStatus,
      },
    });
  }
  console.log(`  ${planningItems.length} planningsitems`);

  // -- Tasks --
  for (const t of tasks) {
    await db.task.upsert({
      where: { id: t.id },
      update: {
        title: t.title,
        studentId: t.studentId ?? null,
        dueDate: t.dueDate ? new Date(t.dueDate) : null,
        status: t.status as TaskStatus,
        priority: t.priority as TaskPriority,
      },
      create: {
        id: t.id,
        title: t.title,
        studentId: t.studentId ?? null,
        dueDate: t.dueDate ? new Date(t.dueDate) : null,
        status: t.status as TaskStatus,
        priority: t.priority as TaskPriority,
      },
    });
  }
  console.log(`  ${tasks.length} taken`);

  // -- Messages --
  for (const m of messages) {
    if (m.fromUserId === 'user-system') continue; // sla synthetische system messages over
    await db.message.upsert({
      where: { id: m.id },
      update: {
        fromUserId: m.fromUserId,
        toUserId: m.toUserId,
        subject: m.subject,
        body: m.preview,
        sentAt: new Date(m.sentAt),
        readAt: m.read ? new Date(m.sentAt) : null,
      },
      create: {
        id: m.id,
        fromUserId: m.fromUserId,
        toUserId: m.toUserId,
        subject: m.subject,
        body: m.preview,
        sentAt: new Date(m.sentAt),
        readAt: m.read ? new Date(m.sentAt) : null,
      },
    });
  }

  // -- FAQ --
  for (const f of faqItems) {
    await db.faqItem.upsert({
      where: { id: f.id },
      update: {
        question: f.question,
        answer: 'Antwoord wordt later geredigeerd.',
        category: f.category,
        roles: f.roles as Role[],
        status: f.status as PublishStatus,
        order: f.order,
        updatedBy: f.updatedByName,
      },
      create: {
        id: f.id,
        question: f.question,
        answer: 'Antwoord wordt later geredigeerd.',
        category: f.category,
        roles: f.roles as Role[],
        status: f.status as PublishStatus,
        order: f.order,
        updatedBy: f.updatedByName,
      },
    });
  }
  console.log(`  ${faqItems.length} FAQ items`);

  // -- Knowledge --
  for (const a of knowledgeArticles) {
    await db.knowledgeArticle.upsert({
      where: { id: a.id },
      update: {
        title: a.title,
        body: a.excerpt,
        category: a.category,
        tags: a.tags,
        roles: a.roles as Role[],
        status: a.status as PublishStatus,
        version: a.version,
        updatedBy: a.updatedByName,
      },
      create: {
        id: a.id,
        title: a.title,
        body: a.excerpt,
        category: a.category,
        tags: a.tags,
        roles: a.roles as Role[],
        status: a.status as PublishStatus,
        version: a.version,
        updatedBy: a.updatedByName,
      },
    });
  }
  console.log(`  ${knowledgeArticles.length} kennisartikelen`);

  // -- Integrations --
  for (const i of integrations) {
    await db.integration.upsert({
      where: { key: i.key as IntegrationKey },
      update: {
        name: i.name,
        status: i.status,
        webhookEnabled: i.webhookEnabled,
        scopes: i.scope,
        lastSyncAt: i.lastSyncAt ? new Date(i.lastSyncAt) : null,
        nextSyncAt: i.nextSyncAt ? new Date(i.nextSyncAt) : null,
      },
      create: {
        key: i.key as IntegrationKey,
        name: i.name,
        status: i.status,
        webhookEnabled: i.webhookEnabled,
        scopes: i.scope,
        lastSyncAt: i.lastSyncAt ? new Date(i.lastSyncAt) : null,
        nextSyncAt: i.nextSyncAt ? new Date(i.nextSyncAt) : null,
      },
    });
  }

  // -- Sync logs (insert-only) --
  await db.syncLog.deleteMany({});
  for (const l of recentSyncLogs) {
    await db.syncLog.create({
      data: {
        id: l.id,
        integration: l.integration as IntegrationKey,
        direction: l.direction,
        objectType: l.object,
        externalId: l.externalId ?? null,
        status: l.status as SyncStatus,
        startedAt: new Date(l.startedAt),
        durationMs: l.durationMs,
        message: l.message ?? null,
      },
    });
  }
  console.log(`  ${recentSyncLogs.length} sync log entries`);

  // -- Audit logs (insert-only) --
  await db.auditLog.deleteMany({});
  for (const a of [...recentAuditLogs, ...extraAuditLogs]) {
    await db.auditLog.create({
      data: {
        id: a.id,
        at: new Date(a.at),
        actorUserId: a.actorUserId,
        actorRole: a.actorRole as Role,
        action: a.action,
        objectType: a.objectType,
        objectId: a.objectId,
        ip: a.ip ?? null,
        userAgent: a.userAgent ?? null,
        context: a.context ?? undefined,
      },
    });
  }
  console.log(`  ${recentAuditLogs.length + extraAuditLogs.length} audit entries`);

  // -- Security logs --
  await db.securityLog.deleteMany({});
  for (const s of securityLogs) {
    await db.securityLog.create({
      data: {
        id: s.id,
        at: new Date(s.at),
        severity: s.severity,
        event: s.event,
        userId: s.userId ?? null,
        ip: s.ip ?? null,
        message: s.message,
      },
    });
  }
  console.log(`  ${securityLogs.length} security entries`);

  console.log('Seed compleet.');
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
