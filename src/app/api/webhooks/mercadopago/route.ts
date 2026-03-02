import { NextRequest, NextResponse } from 'next/server';

/**
 * Webhook de MercadoPago.
 *
 * Flujo:
 * 1. Verificar firma HMAC con crypto.timingSafeEqual
 * 2. Si inválida → 401
 * 3. Si válida → responder 200 INMEDIATAMENTE
 * 4. Procesar en background (setImmediate-like en Edge)
 *
 * Se implementa en la fase de suscripciones.
 */
export async function POST(request: NextRequest) {
  // Verificar secret del header
  const signature = request.headers.get('x-signature');

  if (!signature) {
    return NextResponse.json(
      { error: 'Missing signature' },
      { status: 401 },
    );
  }

  // TODO: Implementar verificación HMAC y procesamiento
  // Por ahora, responder 200 para no bloquear MP en tests
  return NextResponse.json({ received: true }, { status: 200 });
}
