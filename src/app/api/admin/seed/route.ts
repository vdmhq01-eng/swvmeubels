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

/**
 * Bulk seed endpoint. Trigger eenmalig via:
 *   GET /api/admin/seed?key=<SEED_KEY>
 * Productie: zet SEED_KEY env var. Endpoint weigert zonder key match.
 */
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
  try {
    for (const r of regions) {
      await db.region.upsert({ where: { id: r.id }, update: { name: r.name, code: r.code }, create: r });
    }
    log.push(`${regions.length} regio's`);

    for (const p of programs) {
      await db.educationProgram.upsert({
        where: { id: p.id },
        update: { name: p.name, level: levelMap[p.level], durationMonths: p.durationMonths },
        create: { id: p.id, name: p.name, level: levelMap[p.level], durationMonths: p.durationMonths },
      });
    }
    log.push(`${programs.length} opleidingen`);

    for (const u of allUsers) {
      await db.user.upsert({
        where: { id: u.id },
        update: {
          email: u.email,
          name: u.name,
          role: u.role as RoleType,
          twoFactorEnabled: u.twoFactorEnabled ?? false,
          regionId: u.regionId,
          lastLoginAt: u.lastLoginAt ? new Date(u.lastLoginAt) : null,
        },
        create: {
          id: u.id,
          email: u.email,
          name: u.name,
          role: u.role as RoleType,
          twoFactorEnabled: u.twoFactorEnabled ?? false,
          regionId: u.regionId,
          lastLoginAt: u.lastLoginAt ? new Date(u.lastLoginAt) : null,
          createdAt: new Date(u.createdAt),
        },
      });
    }
    log.push(`${allUsers.length} users`);

    for (const c of coordinators) {
      const userId = `user-coord-${c.id.replace('coord-', '')}`;
      await db.coordinator.upsert({
        where: { id: c.id },
        update: { userId, regionId: c.regionId },
        create: { id: c.id, userId, regionId: c.regionId },
      });
    }
    log.push(`${coordinators.length} coördinator-profielen`);

    for (const c of companies) {
      const regionId = regions.find((r) => r.name === c.region)?.id ?? 'reg-noord';
      await db.company.upsert({
        where: { id: c.id },
        update: { name: c.name, regionId, membership: c.membership },
        create: { id: c.id, name: c.name, regionId, membership: c.membership },
      });
    }
    log.push(`${companies.length} lidbedrijven`);

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

    for (const s of students) {
      const userId = `user-stu-${s.id.replace('stu-', '')}`;
      await db.user.upsert({
        where: { id: userId },
        update: {},
        create: { id: userId, email: s.email, name: s.name, role: 'STUDENT' as RoleType, regionId: s.regionId },
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
    log.push(`${students.length} studenten`);

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
    log.push(`${contracts.length} contracten`);

    for (const a of absences) {
      await db.absence.upsert({
        where: { id: a.id },
        update: {
          studentId: a.studentId,
          type: a.type as AbsenceTypeType,
          startDate: new Date(a.startDate),
          endDate: a.endDate ? new Date(a.endDate) : null,
          reportedAt: new Date(a.reportedAt),
          closedAt: a.status === 'GESLOTEN' && a.endDate ? new Date(a.endDate) : null,
        },
        create: {
          id: a.id,
          studentId: a.studentId,
          type: a.type as AbsenceTypeType,
          startDate: new Date(a.startDate),
          endDate: a.endDate ? new Date(a.endDate) : null,
          reportedAt: new Date(a.reportedAt),
          closedAt: a.status === 'GESLOTEN' && a.endDate ? new Date(a.endDate) : null,
        },
      });
    }
    log.push(`${absences.length} verzuim meldingen`);

    for (const h of holidayBalances) {
      await db.holidayBalance.upsert({
        where: { studentId: h.studentId },
        update: { totalDays: h.totalDays, usedDays: h.usedDays, remainingDays: h.remainingDays, holidayMoneyCents: h.holidayMoneyCents, lastUpdated: new Date(h.lastUpdated) },
        create: { studentId: h.studentId, totalDays: h.totalDays, usedDays: h.usedDays, remainingDays: h.remainingDays, holidayMoneyCents: h.holidayMoneyCents, lastUpdated: new Date(h.lastUpdated) },
      });
    }

    const allTs = [currentWeekTimesheet, ...previousTimesheets, ...pendingApprovals.map((p) => p.timesheet)];
    // Verwijder ALLE entries eerst om id-collisions tussen timesheets te voorkomen
    await db.timeEntry.deleteMany({});
    for (const t of allTs) {
      await db.timesheet.upsert({
        where: { id: t.id },
        update: { studentId: t.studentId, weekNumber: t.weekNumber, year: t.year, weekStartDate: new Date(t.weekStartDate), status: t.status as TimesheetStatusType, submittedAt: t.submittedAt ? new Date(t.submittedAt) : null, rejectionReason: t.rejectionReason ?? null },
        create: { id: t.id, studentId: t.studentId, weekNumber: t.weekNumber, year: t.year, weekStartDate: new Date(t.weekStartDate), status: t.status as TimesheetStatusType, submittedAt: t.submittedAt ? new Date(t.submittedAt) : null, rejectionReason: t.rejectionReason ?? null },
      });
      for (const e of t.entries) {
        // Geen expliciete id — Prisma cuid() voorkomt collisions
        await db.timeEntry.create({ data: { timesheetId: t.id, date: new Date(e.date), type: e.type as TimeEntryTypeType, hours: e.hours, note: e.note ?? null } });
      }
    }
    log.push(`${allTs.length} weekstaten`);

    for (const d of documents) {
      await db.document.upsert({
        where: { id: d.id },
        update: { studentId: d.studentId ?? null, companyId: d.companyId ?? null, category: d.category as DocumentCategoryType, fileName: d.fileName, mimeType: d.mimeType, sizeBytes: d.sizeBytes, uploadedByUserId: d.uploadedByUserId, retentionUntil: new Date(d.retentionUntil) },
        create: { id: d.id, studentId: d.studentId ?? null, companyId: d.companyId ?? null, category: d.category as DocumentCategoryType, fileName: d.fileName, storageKey: `documents/${d.category.toLowerCase()}/${d.id}`, mimeType: d.mimeType, sizeBytes: d.sizeBytes, checksum: 'seed-placeholder', encryptionKeyId: 'kms-default', uploadedByUserId: d.uploadedByUserId, uploadedAt: new Date(d.uploadedAt), retentionUntil: new Date(d.retentionUntil) },
      });
    }
    log.push(`${documents.length} documenten`);

    for (const p of planningItems) {
      await db.planningItem.upsert({
        where: { id: p.id },
        update: { title: p.title, type: p.type as PlanningTypeType, startDate: new Date(p.startDate), endDate: p.endDate ? new Date(p.endDate) : null, regionId: p.regionId ?? null, programId: p.programId ?? null, status: p.status as PlanningStatusType },
        create: { id: p.id, title: p.title, type: p.type as PlanningTypeType, startDate: new Date(p.startDate), endDate: p.endDate ? new Date(p.endDate) : null, regionId: p.regionId ?? null, programId: p.programId ?? null, status: p.status as PlanningStatusType },
      });
    }
    log.push(`${planningItems.length} planningsitems`);

    for (const t of tasks) {
      await db.task.upsert({
        where: { id: t.id },
        update: { title: t.title, studentId: t.studentId ?? null, dueDate: t.dueDate ? new Date(t.dueDate) : null, status: t.status as TaskStatusType, priority: t.priority as TaskPriorityType },
        create: { id: t.id, title: t.title, studentId: t.studentId ?? null, dueDate: t.dueDate ? new Date(t.dueDate) : null, status: t.status as TaskStatusType, priority: t.priority as TaskPriorityType },
      });
    }
    log.push(`${tasks.length} taken`);

    for (const m of messages) {
      if (m.fromUserId === 'user-system') continue;
      await db.message.upsert({
        where: { id: m.id },
        update: { fromUserId: m.fromUserId, toUserId: m.toUserId, subject: m.subject, body: m.preview, sentAt: new Date(m.sentAt), readAt: m.read ? new Date(m.sentAt) : null },
        create: { id: m.id, fromUserId: m.fromUserId, toUserId: m.toUserId, subject: m.subject, body: m.preview, sentAt: new Date(m.sentAt), readAt: m.read ? new Date(m.sentAt) : null },
      });
    }
    log.push(`${messages.length} berichten`);

    for (const f of faqItems) {
      await db.faqItem.upsert({
        where: { id: f.id },
        update: { question: f.question, answer: 'Antwoord wordt later geredigeerd.', category: f.category, roles: f.roles as RoleType[], status: f.status as PublishStatusType, order: f.order, updatedBy: f.updatedByName },
        create: { id: f.id, question: f.question, answer: 'Antwoord wordt later geredigeerd.', category: f.category, roles: f.roles as RoleType[], status: f.status as PublishStatusType, order: f.order, updatedBy: f.updatedByName },
      });
    }
    log.push(`${faqItems.length} FAQ items`);

    for (const a of knowledgeArticles) {
      await db.knowledgeArticle.upsert({
        where: { id: a.id },
        update: { title: a.title, body: a.excerpt, category: a.category, tags: a.tags, roles: a.roles as RoleType[], status: a.status as PublishStatusType, version: a.version, updatedBy: a.updatedByName },
        create: { id: a.id, title: a.title, body: a.excerpt, category: a.category, tags: a.tags, roles: a.roles as RoleType[], status: a.status as PublishStatusType, version: a.version, updatedBy: a.updatedByName },
      });
    }
    log.push(`${knowledgeArticles.length} kennisartikelen`);

    for (const i of integrations) {
      await db.integration.upsert({
        where: { key: i.key as IntegrationKeyType },
        update: { name: i.name, status: i.status, webhookEnabled: i.webhookEnabled, scopes: i.scope, lastSyncAt: i.lastSyncAt ? new Date(i.lastSyncAt) : null, nextSyncAt: i.nextSyncAt ? new Date(i.nextSyncAt) : null },
        create: { key: i.key as IntegrationKeyType, name: i.name, status: i.status, webhookEnabled: i.webhookEnabled, scopes: i.scope, lastSyncAt: i.lastSyncAt ? new Date(i.lastSyncAt) : null, nextSyncAt: i.nextSyncAt ? new Date(i.nextSyncAt) : null },
      });
    }

    await db.syncLog.deleteMany({});
    for (const l of recentSyncLogs) {
      await db.syncLog.create({ data: { id: l.id, integration: l.integration as IntegrationKeyType, direction: l.direction, objectType: l.object, externalId: l.externalId ?? null, status: l.status as SyncStatusType, startedAt: new Date(l.startedAt), durationMs: l.durationMs, message: l.message ?? null } });
    }

    await db.auditLog.deleteMany({});
    for (const a of [...recentAuditLogs, ...extraAuditLogs]) {
      await db.auditLog.create({ data: { id: a.id, at: new Date(a.at), actorUserId: a.actorUserId, actorRole: a.actorRole as RoleType, action: a.action, objectType: a.objectType, objectId: a.objectId, ip: a.ip ?? null, userAgent: a.userAgent ?? null, context: a.context ?? undefined } });
    }

    await db.securityLog.deleteMany({});
    for (const s of securityLogs) {
      await db.securityLog.create({ data: { id: s.id, at: new Date(s.at), severity: s.severity, event: s.event, userId: s.userId ?? null, ip: s.ip ?? null, message: s.message } });
    }
    log.push(`logs gesynced`);

    return NextResponse.json({ ok: true, log });
  } catch (err) {
    console.error('[seed]', err);
    return NextResponse.json({ ok: false, error: String(err), log }, { status: 500 });
  }
}
