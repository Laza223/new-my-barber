/**
 * Email templates — plain HTML for maximum compatibility (Gmail, Outlook, etc.)
 * No React Email dependency needed.
 */

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000';

/** Shared email layout wrapper */
function layout(content: string) {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;background:#f4f4f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <div style="max-width:560px;margin:40px auto;background:#ffffff;border-radius:12px;overflow:hidden;border:1px solid #e4e4e7;">
    <!-- Header -->
    <div style="background:#18181b;padding:24px 32px;text-align:center;">
      <h1 style="margin:0;color:#ffffff;font-size:20px;font-weight:700;">✂️ My Barber</h1>
    </div>
    <!-- Content -->
    <div style="padding:32px;">
      ${content}
    </div>
    <!-- Footer -->
    <div style="padding:16px 32px;background:#f4f4f5;text-align:center;font-size:12px;color:#71717a;">
      <p style="margin:0;">My Barber — Gestión para barberías</p>
      <p style="margin:4px 0 0;">Este email fue enviado automáticamente.</p>
    </div>
  </div>
</body>
</html>`;
}

/** Welcome email — sent after completing onboarding */
export function welcomeEmail(userName: string) {
  return {
    subject: '¡Bienvenido a My Barber! 🎉',
    html: layout(`
      <h2 style="margin:0 0 16px;font-size:22px;color:#18181b;">¡Hola ${userName}!</h2>
      <p style="color:#3f3f46;line-height:1.6;margin:0 0 16px;">
        Tu barbería ya está configurada y lista para usar. Empezá a registrar
        ventas y seguí tu facturación en tiempo real.
      </p>
      <p style="color:#3f3f46;line-height:1.6;margin:0 0 24px;">
        Tenés <strong>14 días de prueba gratuita</strong> con todas las funciones
        desbloqueadas. Después, podés continuar con el plan Free o elegir un plan
        que se ajuste a tu barbería.
      </p>
      <div style="text-align:center;margin:24px 0;">
        <a href="${BASE_URL}/inicio"
           style="display:inline-block;padding:12px 32px;background:#18181b;color:#ffffff;text-decoration:none;border-radius:8px;font-weight:600;font-size:14px;">
          Ir a mi barbería →
        </a>
      </div>
      <p style="color:#71717a;font-size:13px;margin:24px 0 0;">
        Si tenés preguntas, respondé a este email.
      </p>
    `),
  };
}

/** Trial warning — sent 3 days before trial ends */
export function trialWarningEmail(userName: string, daysLeft: number) {
  return {
    subject: `⏰ Tu prueba gratuita vence en ${daysLeft} día${daysLeft === 1 ? '' : 's'}`,
    html: layout(`
      <h2 style="margin:0 0 16px;font-size:22px;color:#18181b;">Hola ${userName},</h2>
      <p style="color:#3f3f46;line-height:1.6;margin:0 0 16px;">
        Tu período de prueba gratuita vence en
        <strong style="color:#f59e0b;">${daysLeft} día${daysLeft === 1 ? '' : 's'}</strong>.
      </p>
      <p style="color:#3f3f46;line-height:1.6;margin:0 0 16px;">
        Cuando termine, tu cuenta pasará al plan <strong>Free</strong> con estas limitaciones:
      </p>
      <ul style="color:#3f3f46;line-height:1.8;margin:0 0 24px;padding-left:20px;">
        <li>Máximo 10 ventas por día</li>
        <li>1 profesional</li>
        <li>3 servicios</li>
        <li>Historial de 7 días</li>
      </ul>
      <p style="color:#3f3f46;line-height:1.6;margin:0 0 24px;">
        Para mantener todas las funciones, elegí un plan desde Ajustes.
      </p>
      <div style="text-align:center;margin:24px 0;">
        <a href="${BASE_URL}/settings"
           style="display:inline-block;padding:12px 32px;background:#f59e0b;color:#18181b;text-decoration:none;border-radius:8px;font-weight:600;font-size:14px;">
          Ver planes →
        </a>
      </div>
    `),
  };
}

/** Plan activated — sent after successful payment */
export function planActivatedEmail(userName: string, planName: string) {
  return {
    subject: `✅ Plan ${planName} activado`,
    html: layout(`
      <h2 style="margin:0 0 16px;font-size:22px;color:#18181b;">¡Hola ${userName}!</h2>
      <p style="color:#3f3f46;line-height:1.6;margin:0 0 16px;">
        Tu plan <strong style="color:#22c55e;">${planName}</strong> fue activado correctamente.
        Ya tenés acceso a todas las funciones incluidas.
      </p>
      <p style="color:#3f3f46;line-height:1.6;margin:0 0 24px;">
        Podés ver los detalles de tu plan en cualquier momento desde Ajustes.
      </p>
      <div style="text-align:center;margin:24px 0;">
        <a href="${BASE_URL}/inicio"
           style="display:inline-block;padding:12px 32px;background:#22c55e;color:#ffffff;text-decoration:none;border-radius:8px;font-weight:600;font-size:14px;">
          Ir a mi barbería →
        </a>
      </div>
    `),
  };
}

/** Cancellation confirmation — sent when user cancels */
export function cancellationEmail(
  userName: string,
  planName: string,
  periodEnd: string,
) {
  return {
    subject: '😔 Suscripción cancelada',
    html: layout(`
      <h2 style="margin:0 0 16px;font-size:22px;color:#18181b;">Hola ${userName},</h2>
      <p style="color:#3f3f46;line-height:1.6;margin:0 0 16px;">
        Tu suscripción al plan <strong>${planName}</strong> fue cancelada.
      </p>
      <p style="color:#3f3f46;line-height:1.6;margin:0 0 16px;">
        Vas a mantener el acceso a todas las funciones hasta el
        <strong>${periodEnd}</strong>. Después, tu cuenta pasará al plan Free.
      </p>
      <p style="color:#3f3f46;line-height:1.6;margin:0 0 24px;">
        Si cambiás de idea, podés reactivar tu plan desde Ajustes en cualquier momento.
      </p>
      <div style="text-align:center;margin:24px 0;">
        <a href="${BASE_URL}/settings"
           style="display:inline-block;padding:12px 32px;background:#18181b;color:#ffffff;text-decoration:none;border-radius:8px;font-weight:600;font-size:14px;">
          Ir a Ajustes →
        </a>
      </div>
    `),
  };
}
