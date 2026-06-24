/**
 * Email templates voor SWV Meubel.
 * Inline CSS (HTML email vereist) met brand kleuren.
 */

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://swvmeubels.vercel.app';

function shell(title: string, body: string, footerNote?: string): string {
  return `<!DOCTYPE html>
<html lang="nl">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${escape(title)}</title>
</head>
<body style="margin:0;padding:0;background:#FBF8F3;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;color:#1A1A1A;">
  <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background:#FBF8F3;padding:32px 16px;">
    <tr><td align="center">
      <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="600" style="max-width:600px;background:#FFFFFF;border-radius:16px;overflow:hidden;box-shadow:0 4px 12px rgba(0,0,0,0.05);">

        <!-- Header met logo -->
        <tr><td style="padding:24px 32px;background:#FFFFFF;border-bottom:1px solid #EFE7DC;">
          <table role="presentation" cellpadding="0" cellspacing="0" border="0">
            <tr>
              <td style="padding-right:12px;">
                <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="44">
                  <tr>
                    <td width="22" height="22" style="background:#0FA9A4;border-radius:3px;"></td>
                    <td width="2"></td>
                    <td width="22" height="22" style="background:#2D8FC6;border-radius:3px;"></td>
                  </tr>
                  <tr><td colspan="3" height="2"></td></tr>
                  <tr>
                    <td width="22" height="22" style="background:#86BC2F;border-radius:3px;"></td>
                    <td width="2"></td>
                    <td width="22" height="22" style="background:#EC6806;border-radius:3px;"></td>
                  </tr>
                </table>
              </td>
              <td style="vertical-align:middle;">
                <div style="font-size:15px;font-weight:700;line-height:1.1;color:#1A1A1A;">Samenwerkingsverband</div>
                <div style="font-size:10px;font-weight:600;letter-spacing:0.15em;text-transform:uppercase;color:#6B6B6B;">Meubel</div>
              </td>
            </tr>
          </table>
        </td></tr>

        <!-- Content -->
        <tr><td style="padding:32px;">
          ${body}
        </td></tr>

        <!-- Footer -->
        <tr><td style="padding:24px 32px;background:#FBF8F3;border-top:1px solid #EFE7DC;font-size:12px;color:#6B6B6B;line-height:1.5;">
          ${footerNote ? `<p style="margin:0 0 12px 0;">${footerNote}</p>` : ''}
          <p style="margin:0;">
            <strong>SWV Meubel</strong> · Westerhoutpark 10, 2012 JM Haarlem<br>
            T 023 515 88 30 · <a href="mailto:samenwerkingsverband@cbm.nl" style="color:#EC6806;text-decoration:none;">samenwerkingsverband@cbm.nl</a>
          </p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

function escape(s: string): string {
  return s.replace(/[&<>"']/g, (c) => (
    { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c] as string
  ));
}

function btn(href: string, label: string): string {
  return `<a href="${href}" style="display:inline-block;background:#EC6806;color:#FFFFFF;text-decoration:none;padding:12px 24px;border-radius:8px;font-weight:700;text-transform:uppercase;letter-spacing:0.05em;font-size:13px;">${escape(label)}</a>`;
}

// ─── 1. Sollicitant bevestiging ───────────────────────────────────────

export function applicationConfirmationEmail(args: {
  firstName: string;
  coordinatorName?: string;
  regionName?: string;
}) {
  const greeting = `Hoi ${escape(args.firstName)},`;
  const matched = args.coordinatorName && args.regionName
    ? `<p style="margin:0 0 16px 0;font-size:15px;line-height:1.55;">We hebben je sollicitatie ontvangen en doorgezet naar <strong>${escape(args.coordinatorName)}</strong>, de coördinator van regio <strong>${escape(args.regionName)}</strong>.</p>`
    : `<p style="margin:0 0 16px 0;font-size:15px;line-height:1.55;">We hebben je sollicitatie ontvangen. Een coördinator neemt binnen 3 werkdagen contact op.</p>`;

  const html = shell(
    'Sollicitatie ontvangen',
    `
      <h1 style="margin:0 0 12px 0;font-size:24px;line-height:1.2;color:#1A1A1A;font-weight:700;">Bedankt voor je sollicitatie!</h1>
      <p style="margin:0 0 20px 0;font-size:15px;color:#6B6B6B;">${greeting}</p>
      ${matched}
      <div style="background:#FBF8F3;border:1px solid #EFE7DC;border-radius:12px;padding:18px;margin:24px 0;">
        <p style="margin:0 0 12px 0;font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;color:#1A1A1A;">Wat gebeurt er nu?</p>
        <ol style="margin:0;padding-left:20px;font-size:14px;color:#1A1A1A;line-height:1.6;">
          <li>De coördinator neemt binnen 3 werkdagen contact op</li>
          <li>Kennismakingsgesprek (telefoon of bij ons)</li>
          <li>We matchen je aan een lidbedrijf in jouw regio</li>
          <li>Vaak binnen 2 weken aan het werk</li>
        </ol>
      </div>
      <p style="margin:24px 0;">${btn(`${baseUrl}/studenten`, 'Lees meer over de opleiding')}</p>
      <p style="margin:0;font-size:14px;color:#6B6B6B;">Vragen? App ons direct via <a href="https://wa.me/31611908304" style="color:#EC6806;text-decoration:none;">WhatsApp</a> of mail naar samenwerkingsverband@cbm.nl.</p>
    `,
    'Je ontvangt deze mail omdat je een sollicitatie hebt ingestuurd via swvmeubel.nl.',
  );

  const text = `Bedankt voor je sollicitatie!

${greeting}

${args.coordinatorName && args.regionName
  ? `We hebben je sollicitatie doorgezet naar ${args.coordinatorName}, coördinator van regio ${args.regionName}.`
  : 'Een coördinator neemt binnen 3 werkdagen contact op.'}

Wat gebeurt er nu?
1. De coördinator neemt binnen 3 werkdagen contact op
2. Kennismakingsgesprek
3. We matchen je aan een lidbedrijf
4. Vaak binnen 2 weken aan het werk

Meer weten: ${baseUrl}/studenten
WhatsApp: https://wa.me/31611908304
Mail: samenwerkingsverband@cbm.nl

SWV Meubel
`;

  return { subject: 'Bedankt voor je sollicitatie bij SWV Meubel', html, text };
}

// ─── 2. Coördinator notificatie nieuwe sollicitatie ───────────────────

export function newApplicationForCoordinatorEmail(args: {
  coordinatorName: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  postcode: string;
  applicantType: string;
  programInterest?: string | null;
  message?: string | null;
  applicationId: string;
}) {
  const fullName = `${args.firstName} ${args.lastName}`;
  const html = shell(
    `Nieuwe sollicitatie: ${fullName}`,
    `
      <h1 style="margin:0 0 12px 0;font-size:22px;line-height:1.2;color:#1A1A1A;font-weight:700;">Nieuwe sollicitatie</h1>
      <p style="margin:0 0 16px 0;font-size:15px;color:#6B6B6B;">Hoi ${escape(args.coordinatorName.split(' ')[0])},</p>
      <p style="margin:0 0 20px 0;font-size:15px;line-height:1.55;">Er is een nieuwe sollicitatie binnengekomen die automatisch aan jou is toegewezen op basis van postcode.</p>

      <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background:#FBF8F3;border-radius:12px;margin:16px 0;">
        <tr><td style="padding:18px;">
          <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="font-size:14px;">
            <tr><td style="padding:6px 0;color:#6B6B6B;width:140px;">Naam</td><td style="padding:6px 0;color:#1A1A1A;font-weight:600;">${escape(fullName)}</td></tr>
            <tr><td style="padding:6px 0;color:#6B6B6B;">E-mail</td><td style="padding:6px 0;color:#1A1A1A;"><a href="mailto:${escape(args.email)}" style="color:#EC6806;text-decoration:none;">${escape(args.email)}</a></td></tr>
            <tr><td style="padding:6px 0;color:#6B6B6B;">Telefoon</td><td style="padding:6px 0;color:#1A1A1A;"><a href="tel:${escape(args.phone)}" style="color:#EC6806;text-decoration:none;">${escape(args.phone)}</a></td></tr>
            <tr><td style="padding:6px 0;color:#6B6B6B;">Postcode</td><td style="padding:6px 0;color:#1A1A1A;font-family:monospace;">${escape(args.postcode)}</td></tr>
            <tr><td style="padding:6px 0;color:#6B6B6B;">Type</td><td style="padding:6px 0;color:#1A1A1A;">${escape(args.applicantType)}</td></tr>
            ${args.programInterest ? `<tr><td style="padding:6px 0;color:#6B6B6B;">Interesse</td><td style="padding:6px 0;color:#1A1A1A;">${escape(args.programInterest)}</td></tr>` : ''}
          </table>
        </td></tr>
      </table>

      ${args.message ? `
      <div style="background:#FFFFFF;border-left:3px solid #EC6806;padding:12px 16px;margin:16px 0;">
        <p style="margin:0 0 6px 0;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;color:#6B6B6B;">Bericht van sollicitant</p>
        <p style="margin:0;font-size:14px;line-height:1.5;color:#1A1A1A;white-space:pre-wrap;">${escape(args.message)}</p>
      </div>
      ` : ''}

      <p style="margin:24px 0;">${btn(`${baseUrl}/coordinator/sollicitaties/${args.applicationId}`, 'Open in portaal')}</p>

      <p style="margin:0;font-size:13px;color:#6B6B6B;">Reageer binnen 3 werkdagen. Bel of mail rechtstreeks vanuit deze e-mail of via het portaal.</p>
    `,
    'Je ontvangt deze mail omdat je coördinator bent in de regio waar de sollicitant woont.',
  );

  const text = `Nieuwe sollicitatie

Hoi ${args.coordinatorName.split(' ')[0]},

${fullName} (${args.applicantType}) heeft gesolliciteerd. Postcode ${args.postcode}.

E-mail: ${args.email}
Telefoon: ${args.phone}
${args.programInterest ? `Interesse: ${args.programInterest}\n` : ''}${args.message ? `\nBericht:\n${args.message}\n` : ''}
Open in portaal: ${baseUrl}/coordinator/sollicitaties/${args.applicationId}

SWV Meubel
`;

  return { subject: `Nieuwe sollicitatie: ${fullName}`, html, text };
}

// ─── 3. Weekstaat ingediend (lidbedrijf) ──────────────────────────────

export function timesheetSubmittedForCompanyEmail(args: {
  contactName: string;
  studentName: string;
  weekNumber: number;
  totalHours: number;
  approveUrl?: string;
}) {
  const html = shell(
    `Weekstaat W${args.weekNumber} ingediend door ${args.studentName}`,
    `
      <h1 style="margin:0 0 12px 0;font-size:22px;line-height:1.2;color:#1A1A1A;font-weight:700;">Weekstaat wacht op goedkeuring</h1>
      <p style="margin:0 0 16px 0;font-size:15px;color:#6B6B6B;">Hoi ${escape(args.contactName.split(' ')[0])},</p>
      <p style="margin:0 0 20px 0;font-size:15px;line-height:1.55;">
        <strong>${escape(args.studentName)}</strong> heeft de weekstaat van <strong>week ${args.weekNumber}</strong> ingediend
        (totaal ${args.totalHours.toFixed(1)} uur). Goedkeuren of afkeuren met één tik via het portaal.
      </p>
      <p style="margin:24px 0;">${btn(args.approveUrl ?? `${baseUrl}/lidbedrijf/goedkeuren`, 'Goedkeuren')}</p>
    `,
  );

  const text = `${args.studentName} heeft de weekstaat van week ${args.weekNumber} ingediend (totaal ${args.totalHours.toFixed(1)} uur). Goedkeuren: ${args.approveUrl ?? `${baseUrl}/lidbedrijf/goedkeuren`}`;

  return { subject: `Weekstaat W${args.weekNumber} ingediend door ${args.studentName}`, html, text };
}
