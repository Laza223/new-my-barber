import { NextRequest, NextResponse } from 'next/server';

/**
 * Cron: Resumen diario.
 * Se ejecuta todos los días a las 7:00 UTC (4:00 AR).
 * Protegido por CRON_SECRET.
 */
export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization');

  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 },
    );
  }

  // TODO: Implementar generación de resumen diario
  return NextResponse.json({
    success: true,
    message: 'Daily summary cron — not implemented yet',
  });
}
