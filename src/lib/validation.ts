import { z } from 'zod';

// Zod schemas voor server actions en API endpoints.
// Validatie staat altijd aan de server-zijde. Frontend mag dezelfde schemas
// hergebruiken voor optimistische form-checks, maar mag nooit als enige
// validatie dienen.

export const RoleEnum = z.enum(['STUDENT', 'COORDINATOR', 'COMPANY', 'ADMIN']);

export const TimeEntryTypeEnum = z.enum([
  'PRAKTIJK',
  'SCHOOL',
  'ZIEKTE',
  'VERLOF',
  'AFWEZIG',
]);

export const TimesheetStatusEnum = z.enum([
  'CONCEPT',
  'INGEDIEND',
  'GOEDGEKEURD',
  'AFGEKEURD',
  'CORRECTIE_GEVRAAGD',
]);

export const timeEntrySchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  type: TimeEntryTypeEnum,
  hours: z.number().min(0).max(16),
  note: z.string().max(280).optional(),
});

export const weeksheetSubmitSchema = z.object({
  timesheetId: z.string().min(1),
  entries: z.array(timeEntrySchema).min(1).max(7 * 5),
  asConcept: z.boolean().optional().default(false),
});

export const approvalSchema = z
  .object({
    timesheetId: z.string().min(1),
    decision: z.enum(['GOEDGEKEURD', 'AFGEKEURD', 'CORRECTIE_GEVRAAGD']),
    reason: z.string().max(500).optional(),
  })
  .refine(
    (val) => val.decision === 'GOEDGEKEURD' || (val.reason && val.reason.length >= 5),
    {
      message: 'Reden is verplicht bij afkeuring of correctie',
      path: ['reason'],
    },
  );

export const sickReportSchema = z.object({
  studentId: z.string().min(1),
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  note: z.string().max(280).optional(),
});

const ALLOWED_MIME = ['application/pdf', 'image/jpeg', 'image/png'] as const;
const MAX_UPLOAD = 10 * 1024 * 1024;

export const documentUploadSchema = z.object({
  studentId: z.string().min(1).optional(),
  companyId: z.string().min(1).optional(),
  category: z.enum(['CONTRACT', 'LEGITIMATIE', 'BEOORDELING', 'BPV', 'OVERIG']),
  fileName: z.string().min(1).max(200),
  mimeType: z.enum(ALLOWED_MIME),
  sizeBytes: z.number().int().positive().max(MAX_UPLOAD),
  consent: z.literal(true, {
    errorMap: () => ({ message: 'Toestemming voor verwerking is verplicht' }),
  }),
});

export const faqSchema = z.object({
  id: z.string().optional(),
  question: z.string().min(5).max(280),
  answer: z.string().min(5).max(4000),
  category: z.string().min(1).max(80),
  roles: z.array(RoleEnum).min(1),
  status: z.enum(['CONCEPT', 'GEPUBLICEERD', 'GEARCHIVEERD']),
  order: z.number().int().min(0).max(1000),
});

export const knowledgeArticleSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(3).max(200),
  body: z.string().min(10),
  category: z.string().min(1),
  tags: z.array(z.string().min(1)).max(20),
  roles: z.array(RoleEnum).min(1),
  status: z.enum(['CONCEPT', 'GEPUBLICEERD']),
});

export const integrationSettingsSchema = z.object({
  key: z.enum(['EXACT_SYNERGY', 'CLEVERDESK']),
  webhookEnabled: z.boolean(),
  pollIntervalMinutes: z.number().int().min(5).max(1440),
  scopes: z.array(z.string().min(1)),
});

export type DocumentUploadInput = z.infer<typeof documentUploadSchema>;
export type WeeksheetSubmitInput = z.infer<typeof weeksheetSubmitSchema>;
export type ApprovalInput = z.infer<typeof approvalSchema>;
