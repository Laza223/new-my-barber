/**
 * Resend email client.
 * Used for transactional emails (welcome, trial warning, etc.).
 */
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

const EMAIL_FROM = process.env.EMAIL_FROM ?? 'My Barber <noreply@mybarber.com>';

export async function sendEmail(params: {
  to: string;
  subject: string;
  html: string;
}) {
  if (!process.env.RESEND_API_KEY) {
    console.warn(
      '[EMAIL] RESEND_API_KEY not set, skipping email:',
      params.subject,
    );
    return;
  }

  try {
    const result = await resend.emails.send({
      from: EMAIL_FROM,
      to: params.to,
      subject: params.subject,
      html: params.html,
    });

    console.log('[EMAIL] Sent:', params.subject, 'to:', params.to, result);
    return result;
  } catch (error) {
    console.error('[EMAIL] Failed to send:', params.subject, error);
    // Fire-and-forget: don't throw, just log
  }
}
