# SWV Meubel Portaal

Een professioneel onderwijs-, begeleidings- en urenregistratieplatform voor de meubelbranche, gebouwd met Next.js (App Router), TypeScript, Tailwind, Prisma + PostgreSQL en integraties met Exact Synergy en Cleverdesk.

Deze repo bevat een werkende visuele mockup (mockdata) plus het architectuurfundament: types, Zod-schemas, Prisma datamodel, RBAC/ABAC, AVG-document upload flow en integratielagen voor Exact en Cleverdesk.

---

## 1. Productconcept

Vier portalen onder één SWV Meubel huis-stijl:

| Portaal       | Doel                                                                 |
| ------------- | -------------------------------------------------------------------- |
| Student       | Eigen omgeving: uren, vakantie, verzuim, opleiding, documenten, taken |
| Coördinator   | Begeleiding van studenten in eigen regio, signalen, planning, FAQ    |
| Lidbedrijf    | Weekstaten goedkeuren, eigen studenten, verzuim, planning            |
| Admin         | Gebruikersbeheer, integraties, sync- en auditlogs, security signalen |

Centrale concepten:

- **Bronsystemen**: Exact Synergy voor stamgegevens, Cleverdesk voor uren.
- **Portaal als middleware**: cache, autorisatie, UI; nooit zelfstandig source of truth voor stamdata.
- **AVG-by-design**: dataminimalisatie, versleutelde documenten, audit trail, bewaartermijnen, signed URLs.

## 2. Informatiearchitectuur

```
/                          Landingspagina met portaalkeuze
/student                   Studentdashboard
  /uren                    Urenregistratie + weekstaat
  /profiel /opleiding /leerbedrijf /planning /vakantie /verzuim
  /contracten /documenten /taken /berichten /kennisbank /faq
/coordinator               Coördinator dashboard
  /studenten               Lijst studenten in regio
  /studenten/[id]          Student detail (profiel, uren, contract, documenten, tijdlijn, notities)
  /uren /goedkeuringen /verzuim /vakantie /lidbedrijven /contracten
  /planning /diploma /rapportages /kennisbank /faq
/lidbedrijf                Lidbedrijfsdashboard
  /studenten /goedkeuren /uren /verzuim /planning /contracten /documenten /coordinator
/admin                     Admin dashboard
  /gebruikers /rollen /regios /lidbedrijven /studenten
  /integraties             Integratiebeheer (Exact + Cleverdesk)
  /sync-logs /audit-logs /security-logs /documenten /faq /kennisbank
```

## 3. UX / design

- Warm, professioneel, modern.
- Crème/wit achtergrond (`bone-50`), houttinten als hoofdkleur (`wood-500`).
- Subtiele schaduwen, ruime card-radius (2xl), veel witruimte.
- Status badges in zachte tinten (emerald / amber / rose / sky).
- Tabellen met `bone-50` headers en zachte rij-scheiders.
- Volledig Nederlands. Geen emoji's. Geen schreeuwerige kleuren.
- Mobile-first waar relevant: weekstaat is responsive met horizontale scroll op kleine schermen.

## 4. Projectstructuur

```
src/
  app/                     Next.js App Router pages
    page.tsx               Landing
    student/               Student portaal
    coordinator/           Coördinator portaal
    lidbedrijf/            Lidbedrijf portaal
    admin/                 Admin portaal
    globals.css            Tailwind + brand utilities
    layout.tsx             Root layout (nl)
  components/
    ui/                    Building blocks (Card, Badge, Avatar, Icon, StatCard, Logo)
    portal/                Sidebar, Topbar, PortalShell
    uren/                  WeeksheetEditor (client component)
  lib/
    types.ts               Centrale TS types
    validation.ts          Zod schemas voor server actions / API
    utils.ts               Datum/geld/uur formatters
    navigation.ts          Navigatie per rol
    mock/                  Mockdata (vervang door Prisma queries)
    security/
      rbac.ts              Role + Attribute Based Access Control
      audit.ts             Auditlog helper (verplichte route voor alle gevoelige acties)
      upload.ts            AVG-proof signed upload flow + bewaartermijnen
    integrations/
      exact.ts             Exact Synergy client + webhook verify + sync orchestrator
      cleverdesk.ts        Cleverdesk client + idempotency + retry + ontbrekende-uren detectie
  middleware.ts            Auth + security headers + rol-routing
prisma/
  schema.prisma            Volledig datamodel
```

## 5. Datamodel (Prisma)

Zie [`prisma/schema.prisma`](prisma/schema.prisma). Belangrijkste entiteiten:

`User`, `Session`, `Role` · `Region`, `EducationProgram` · `Student`, `Coordinator`, `Company`, `CompanyContact` · `Contract`, `Absence`, `HolidayBalance` · `Timesheet`, `TimeEntry`, `TimesheetApproval` · `Document`, `DocumentAccessLog` · `PlanningItem`, `Task`, `Message` · `FaqItem`, `KnowledgeArticle` · `Integration`, `IntegrationMapping`, `SyncLog`, `AuditLog`, `SecurityLog`.

Indexen op alle veel-bevraagde combinaties (`studentId+year+week`, `objectType+objectId`, `severity+at`).

## 6. RBAC + ABAC

In `src/lib/security/rbac.ts`:

- **RBAC** via `rolePermissions: Record<Role, Permission[]>` en `hasPermission()`.
- **ABAC** via `canAccessStudent()` en `canApproveTimesheet()`. Coördinator ziet alleen eigen studenten, lidbedrijf alleen eigen, student alleen zichzelf, admin alles.
- `studentScopeFilter(ctx)` levert direct een Prisma-where filter passend bij de sessierol.

## 7. AVG-proof documenten

`src/lib/security/upload.ts` regelt:

1. Server action ontvangt **metadata, geen file**.
2. Validatie via `documentUploadSchema` (max 10 MB, alleen PDF/JPG/PNG, expliciete `consent: true`).
3. Server geeft **signed upload URL** terug; client uploadt direct naar versleutelde object storage.
4. Bewaartermijn automatisch gezet (`CONTRACT` 7 jaar, `LEGITIMATIE` 3 jaar, etc.).
5. Asynchrone scan op MIME-magic bytes + virus voor activatie.
6. Downloads altijd via tijdelijke signed URL (`SIGNED_URL_TTL_SECONDS`, default 300s).
7. Iedere actie (`upload`, `view`, `download`, `delete`) wordt geaudit via `audit()` + losse `DocumentAccessLog`.

## 8. Exact Synergy integratie

`src/lib/integrations/exact.ts`:

- `ExactClient` interface: studenten, lidbedrijven, contracten, verzuim, vakantie.
- `syncExact(client, since)` orchestreert delta-sync per objecttype en levert `SyncLogEntry[]` op.
- `verifyExactWebhook(rawBody, signature, secret)` placeholder voor HMAC-SHA256 verificatie.
- Fallback polling als webhooks niet beschikbaar zijn.
- Mapping bewaard in `IntegrationMapping` per `objectType + externalId`.

## 9. Cleverdesk integratie

`src/lib/integrations/cleverdesk.ts`:

- `CleverdeskClient`: lezen, indienen en goedkeuren van weekstaten.
- `withRetry(fn)` met exponential backoff (4 pogingen, 250 ms basis).
- `makeIdempotencyKey(parts)` voor exactly-once writes.
- `ontbrekendeUren(weeksheet, norm)` voor signalen.

## 10. API / Server actions structuur

Beoogde endpoints (allemaal achter middleware + RBAC):

```
/api/auth/*                login, logout, refresh
/api/students              GET (scope), POST (admin)
/api/students/:id          GET (ABAC), PATCH (admin)
/api/coordinators          GET (admin)
/api/companies             GET (scope), POST (admin)
/api/contracts             GET (scope)
/api/absences              GET (scope), POST (student → sick report)
/api/holidays              GET (scope)
/api/timesheets            GET (scope), POST (student concept/submit)
/api/timesheets/:id        GET (ABAC), PATCH (concept), POST /submit
/api/approvals             POST (company/coordinator) - approve/reject
/api/documents             POST → signed URL, GET → list (scope)
/api/documents/:id/url     GET → signed download URL (audit logged)
/api/faq, /api/knowledge   CRUD (admin/coord)
/api/planning              GET (scope), POST (coord/admin)
/api/integrations/exact    POST /resync, POST /webhook
/api/integrations/cleverdesk POST /resync, POST /webhook
/api/sync-logs             GET (admin)
/api/audit-logs            GET (admin)
```

## 11. Security checklist

- [x] CSP, HSTS, X-Frame-Options, X-Content-Type-Options, Referrer-Policy
- [x] HTTPS only (Vercel default)
- [x] Validatie via Zod aan server-zijde
- [x] Output via React (XSS-safe), geen `dangerouslySetInnerHTML`
- [x] RBAC + ABAC voor elke gevoelige read/write
- [x] Auditlog via helper – nooit direct in components
- [x] AVG: dataminimalisatie, geen BSN in overzichten, encrypted storage
- [x] Signed URLs voor documenten, korte TTL
- [x] Geen gevoelige data in localStorage of logs
- [ ] Rate limiting op login en uploads (in middleware via edge KV)
- [ ] 2FA voor admins (`ENFORCE_2FA_ADMIN=true`)
- [ ] Virus scan voor uploads (S3 → Lambda → ClamAV)
- [ ] Webhook signature verificatie volledig (HMAC-SHA256 + timing-safe compare)
- [ ] Session timeout (30 min default, configurable)
- [ ] IP / device logging voor admin acties
- [ ] Audit trail immutability (append-only of write-once storage)

## 12. MVP roadmap

| Fase | Inhoud                                                                                                 |
| ---- | ------------------------------------------------------------------------------------------------------ |
| 0    | UI mockup (klaar) – screens + design system                                                            |
| 1    | Auth: NextAuth + roles + 2FA voorbereiding                                                             |
| 2    | Prisma migrations + seed; student/coördinator dashboards uit DB                                        |
| 3    | Urenregistratie end-to-end: student invullen, lidbedrijf goedkeuren, audit + Cleverdesk write          |
| 4    | Document upload AVG-flow: signed upload + scan + bewaartermijn                                         |
| 5    | Exact Synergy sync: studenten, lidbedrijven, contracten, verzuim, vakantie                             |
| 6    | Cleverdesk pull/push voor weekstaten, mapping management                                               |
| 7    | Planning, taken, berichten, kennisbank, FAQ                                                            |
| 8    | Admin: sync logs, audit logs, security logs, integratiebeheer                                          |
| 9    | Rapportages + signalen voor coördinatoren (ontbrekende uren, aflopende contracten, diploma kandidaten) |
| 10   | Hardening: rate limits, virus scan, sessie timeouts, penetratietest                                    |

## 13. Lokaal draaien

```bash
npm install
cp .env.example .env
npm run dev
```

Open http://localhost:3000 en kies een portaal vanaf de landing.

## 13b. Database opzetten

De UI draait nu nog op mockdata uit `src/lib/mock/*`. Voor de productie-werking volg je deze stappen.

### Stap 1 — Database hosting kiezen

Drie redelijke opties:

| Provider | Voordeel | Aanbevolen voor |
| --- | --- | --- |
| **Neon** | Serverless Postgres, gratis tier, Vercel-integratie | Productie + dev |
| **Supabase** | Postgres + auth + storage in één | Wie auth wil hergebruiken |
| **Vercel Postgres** | Native Vercel storage | Wie alles in Vercel wil houden |
| **Local PostgreSQL** | Volledig lokaal | Pure dev |

Snelste pad: in je Vercel project → **Storage** tab → **Create Database → Neon**. Vercel zet `DATABASE_URL` automatisch in je project envs.

### Stap 2 — `.env` vullen

Kopieer de connection string naar je lokale `.env`:

```bash
DATABASE_URL="postgresql://user:pass@host/db?sslmode=require"
```

### Stap 3 — Schema toepassen + seeden

```bash
npm run prisma:generate     # Prisma client genereren
npm run prisma:migrate      # tabellen aanmaken op de DB
npm run prisma:seed         # mockdata in de DB laden
```

Daarna heb je 13 users, 7 studenten, 6 lidbedrijven, contracten, weekstaten, planning, FAQ, kennisartikelen en alle log-entiteiten in je database.

### Stap 4 — Inspecteren

```bash
npm run prisma:studio
```

Opent een UI op http://localhost:5555 om de data te bekijken en te bewerken.

### Stap 5 — Mockdata vervangen door queries

In de pagina-bestanden vervang je imports zoals:

```ts
import { students } from '@/lib/mock/students';
```

door:

```ts
import { db } from '@/lib/db';
const students = await db.student.findMany({ where: studentScopeFilter(ctx) });
```

`studentScopeFilter(ctx)` zit al klaar in `src/lib/security/rbac.ts`.

### Stap 6 — Schema wijzigen

Schema staat in `prisma/schema.prisma`. Wijziging? Run:

```bash
npm run prisma:migrate -- --name beschrijving_van_wijziging
```

Productie: gebruik `prisma migrate deploy` in je Vercel build (niet `migrate dev`).

## 14. Vercel deploy

- **Framework Preset**: Next.js (auto-detected)
- **Root Directory**: `./`
- **Build / Output / Install Command**: leeg laten (Next.js defaults)
- **Environment Variables**: voor de mockup niet vereist. Voor productie: gebruik "Import .env" met `.env.example` als template en vul de waarden in.

---

© SWV Meubel – productconcept en architectuurmockup.
