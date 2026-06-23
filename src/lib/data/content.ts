import { db } from '@/lib/db';
import type { Role } from '@prisma/client';
import { safe } from './safe';

export async function listFaqForRole(role: Role) {
  return safe(
    () =>
      db.faqItem.findMany({
        where: { status: 'GEPUBLICEERD', roles: { has: role } },
        orderBy: { order: 'asc' },
      }),
    [] as never[],
  );
}

export async function listAllFaq() {
  return safe(() => db.faqItem.findMany({ orderBy: { order: 'asc' } }), [] as never[]);
}

export async function listKnowledgeForRole(role: Role) {
  return safe(
    () =>
      db.knowledgeArticle.findMany({
        where: { status: 'GEPUBLICEERD', roles: { has: role } },
        orderBy: { updatedAt: 'desc' },
      }),
    [] as never[],
  );
}

export async function listAllKnowledge() {
  return safe(
    () => db.knowledgeArticle.findMany({ orderBy: { updatedAt: 'desc' } }),
    [] as never[],
  );
}

export async function getKnowledgeArticleById(id: string) {
  return safe(() => db.knowledgeArticle.findUnique({ where: { id } }), null);
}

export async function listPlanning() {
  return safe(() => db.planningItem.findMany({ orderBy: { startDate: 'asc' } }), [] as never[]);
}

export async function listUpcomingPlanning(limit = 10) {
  return safe(
    () =>
      db.planningItem.findMany({
        where: { startDate: { gte: new Date() } },
        orderBy: { startDate: 'asc' },
        take: limit,
      }),
    [] as never[],
  );
}

export async function listMessagesForUser(userId: string) {
  return safe(
    () =>
      db.message.findMany({
        where: { toUserId: userId },
        include: { fromUser: { select: { name: true, email: true } } },
        orderBy: { sentAt: 'desc' },
      }),
    [] as never[],
  );
}

export async function listTasksForStudent(studentId: string) {
  return safe(
    () => db.task.findMany({ where: { studentId }, orderBy: { dueDate: 'asc' } }),
    [] as never[],
  );
}
