import { NextRequest, NextResponse } from 'next/server';

/**
 * Cron: Verificar suscripciones.
 * Se ejecuta todos los días a las 3:05 UTC (0:05 AR).
 * Protegido por CRON_SECRET.
 *
 * Acciones:
 * - Expirar trials vencidos → expired
 * - Cancelar past_due > 3 días → cancelled
 * - Notificar trials que expiran en 3 días
 */
export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization');

  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 },
    );
  }

  // TODO: Implementar lógica de suscripciones
  return NextResponse.json({
    success: true,
    message: 'Check subscriptions cron — not implemented yet',
  });
}
