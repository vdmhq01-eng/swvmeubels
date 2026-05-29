import { db } from '@/lib/db';
import type { Role } from '@prisma/client';

export async function listFaqForRole(role: Role) {
  return db.faqItem.findMany({
    where: { status: 'GEPUBLICEERD', roles: { has: role } },
    orderBy: { order: 'asc' },
  });
}

export async function listAllFaq() {
  return db.faqItem.findMany({ orderBy: { order: 'asc' } });
}

export async function listKnowledgeForRole(role: Role) {
  return db.knowledgeArticle.findMany({
    where: { status: 'GEPUBLICEERD', roles: { has: role } },
    orderBy: { updatedAt: 'desc' },
  });
}

export async function listAllKnowledge() {
  return db.knowledgeArticle.findMany({ orderBy: { updatedAt: 'desc' } });
}

export async function getKnowledgeArticleById(id: string) {
  return db.knowledgeArticle.findUnique({ where: { id } });
}

export async function listPlanning() {
  return db.planningItem.findMany({ orderBy: { startDate: 'asc' } });
}

export async function listUpcomingPlanning(limit = 10) {
  return db.planningItem.findMany({
    where: { startDate: { gte: new Date() } },
    orderBy: { startDate: 'asc' },
    take: limit,
  });
}

export async function listMessagesForUser(userId: string) {
  return db.message.findMany({
    where: { toUserId: userId },
    include: { fromUser: { select: { name: true, email: true } } },
    orderBy: { sentAt: 'desc' },
  });
}

export async function listTasksForStudent(studentId: string) {
  return db.task.findMany({
    where: { studentId },
    orderBy: { dueDate: 'asc' },
  });
}
