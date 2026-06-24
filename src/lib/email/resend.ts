import { Resend } from 'resend';

const apiKey = process.env.RESEND_API_KEY;
const fromEmail = process.env.RESEND_FROM_EMAIL || 'SWV Meubel <onboarding@resend.dev>';
const replyTo = process.env.RESEND_REPLY_TO || 'samenwerkingsverband@cbm.nl';

const client = apiKey ? new Resend(apiKey) : null;

type SendInput = {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
  replyTo?: string;
};

/**
 * Veilige email send. Zonder RESEND_API_KEY logt het naar console
 * (zodat dev/preview werkt). Met key wordt het echt verstuurd.
 */
export async function sendEmail(input: SendInput): Promise<{ ok: boolean; id?: string; error?: string }> {
  if (!client) {
    // eslint-disable-next-line no-console
    console.warn('[email] RESEND_API_KEY niet gezet — email niet verstuurd (dry-run):', {
      to: input.to,
      subject: input.subject,
    });
    return { ok: true, id: 'dry-run' };
  }

  try {
    const result = await client.emails.send({
      from: fromEmail,
      to: Array.isArray(input.to) ? input.to : [input.to],
      subject: input.subject,
      html: input.html,
      text: input.text,
      replyTo: input.replyTo ?? replyTo,
    });
    if (result.error) {
      console.error('[email] Resend error', result.error);
      return { ok: false, error: result.error.message };
    }
    return { ok: true, id: result.data?.id };
  } catch (err) {
    console.error('[email] send failed', err);
    return { ok: false, error: String(err) };
  }
}
