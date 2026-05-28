// Centrale TypeScript types - vormen het contract tussen UI, server actions en database.
// Deze types lopen 1-op-1 met het Prisma schema (zie prisma/schema.prisma) en met de
// Zod schemas in src/lib/validation.ts.

export type Role = 'STUDENT' | 'COORDINATOR' | 'COMPANY' | 'ADMIN';

export type Region = {
  id: string;
  name: string;
  code: string;
};

export type Contact = {
  email: string;
  phone?: string;
};

export type User = {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatarUrl?: string;
  regionId?: string;
  twoFactorEnabled?: boolean;
  lastLoginAt?: string;
};

export type EducationProgram = {
  id: string;
  name: string;
  level: 'BBL 2' | 'BBL 3' | 'BBL 4';
  durationMonths: number;
};

export type Company = {
  id: string;
  name: string;
  region: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  activeStudents: number;
  membership: 'CBM' | 'Geen';
};

export type Coordinator = {
  id: string;
  name: string;
  email: string;
  phone: string;
  regionId: string;
  studentCount: number;
  avatarUrl?: string;
};

export type ContractStatus = 'Actief' | 'Aflopend' | 'Verlopen' | 'Concept';

export type Contract = {
  id: string;
  studentId: string;
  companyId: string;
  startDate: string;
  endDate: string;
  status: ContractStatus;
  hoursPerWeek: number;
};

export type StudentSignal = 'Goed' | 'Aandacht' | 'Risico';

export type Student = {
  id: string;
  externalId: string; // mapping Exact Synergy
  cleverdeskId?: string; // mapping Cleverdesk
  name: string;
  email: string;
  phone: string;
  birthDate: string; // intern voor leeftijd, niet tonen in overzichten
  programId: string;
  yearOfStudy: 1 | 2 | 3 | 4;
  regionId: string;
  companyId: string;
  coordinatorId: string;
  startDate: string;
  expectedDiplomaDate?: string;
  signal: StudentSignal;
  avatarUrl?: string;
  legitimationUploaded: boolean;
};

export type TimesheetStatus =
  | 'CONCEPT'
  | 'INGEDIEND'
  | 'GOEDGEKEURD'
  | 'AFGEKEURD'
  | 'CORRECTIE_GEVRAAGD';

export type TimeEntryType =
  | 'PRAKTIJK'
  | 'SCHOOL'
  | 'ZIEKTE'
  | 'VERLOF'
  | 'AFWEZIG';

export type TimeEntry = {
  id: string;
  date: string;
  type: TimeEntryType;
  hours: number;
  note?: string;
};

export type Timesheet = {
  id: string;
  studentId: string;
  weekNumber: number;
  year: number;
  weekStartDate: string;
  status: TimesheetStatus;
  submittedAt?: string;
  approvedAt?: string;
  approvedByUserId?: string;
  rejectionReason?: string;
  entries: TimeEntry[];
  totals: {
    praktijk: number;
    school: number;
    ziekte: number;
    verlof: number;
    afwezig: number;
    totaal: number;
    norm: number;
    ontbrekend: number;
  };
};

export type AbsenceStatus = 'OPEN' | 'GESLOTEN';

export type Absence = {
  id: string;
  studentId: string;
  type: 'ZIEKTE' | 'VERLOF';
  startDate: string;
  endDate?: string;
  status: AbsenceStatus;
  reportedAt: string;
};

export type HolidayBalance = {
  studentId: string;
  totalDays: number;
  usedDays: number;
  remainingDays: number;
  holidayMoneyCents: number;
  lastUpdated: string;
};

export type DocumentCategory =
  | 'CONTRACT'
  | 'LEGITIMATIE'
  | 'BEOORDELING'
  | 'BPV'
  | 'OVERIG';

export type DocumentRecord = {
  id: string;
  studentId?: string;
  companyId?: string;
  category: DocumentCategory;
  fileName: string;
  mimeType: string;
  sizeBytes: number;
  uploadedAt: string;
  uploadedByUserId: string;
  retentionUntil: string;
  encrypted: true;
  // Geen URL hier - downloads gaan altijd via signed URL endpoint.
};

export type PlanningItem = {
  id: string;
  title: string;
  type:
    | 'SCHOOLDAG'
    | 'BPV'
    | 'EVALUATIE'
    | 'PRAKTIJKBEOORDELING'
    | 'EXAMEN'
    | 'DIPLOMA'
    | 'UITSTROOM'
    | 'NIEUWE_OPLEIDING';
  startDate: string;
  endDate?: string;
  regionId?: string;
  programId?: string;
  status: 'GEPLAND' | 'BEVESTIGD' | 'AFGEROND' | 'GEANNULEERD';
};

export type Task = {
  id: string;
  studentId?: string;
  title: string;
  dueDate?: string;
  status: 'OPEN' | 'IN_BEHANDELING' | 'AFGEROND';
  priority: 'LAAG' | 'NORMAAL' | 'HOOG';
  assignedToUserId?: string;
};

export type Message = {
  id: string;
  fromUserId: string;
  fromName: string;
  toUserId: string;
  subject: string;
  preview: string;
  sentAt: string;
  read: boolean;
};

export type IntegrationKey = 'EXACT_SYNERGY' | 'CLEVERDESK';

export type IntegrationStatus = 'ACTIEF' | 'DEGRADED' | 'OFFLINE' | 'INACTIEF';

export type Integration = {
  key: IntegrationKey;
  name: string;
  status: IntegrationStatus;
  lastSyncAt?: string;
  nextSyncAt?: string;
  webhookEnabled: boolean;
  scope: string[];
  errorCount24h: number;
};

export type SyncLogEntry = {
  id: string;
  integration: IntegrationKey;
  direction: 'IN' | 'OUT';
  object: string;
  externalId?: string;
  status: 'OK' | 'FOUT' | 'GENEGEERD';
  startedAt: string;
  durationMs: number;
  message?: string;
};

export type AuditLogEntry = {
  id: string;
  at: string;
  actorUserId: string;
  actorName: string;
  actorRole: Role;
  action: string;
  objectType: string;
  objectId: string;
  ip?: string;
  userAgent?: string;
  context?: Record<string, string>;
};

export type SecurityLogEntry = {
  id: string;
  at: string;
  severity: 'INFO' | 'WAARSCHUWING' | 'KRITIEK';
  event: string;
  userId?: string;
  ip?: string;
  message: string;
};

export type FaqItem = {
  id: string;
  question: string;
  category: string;
  status: 'CONCEPT' | 'GEPUBLICEERD' | 'GEARCHIVEERD';
  roles: Role[];
  order: number;
  updatedAt: string;
  updatedByName: string;
};

export type KnowledgeArticle = {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  tags: string[];
  roles: Role[];
  status: 'CONCEPT' | 'GEPUBLICEERD';
  version: number;
  updatedAt: string;
  updatedByName: string;
};
