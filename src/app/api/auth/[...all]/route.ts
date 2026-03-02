/**
 * Better-Auth catch-all handler.
 * Maneja /api/auth/sign-in, /api/auth/sign-up, /api/auth/session, etc.
 *
 * Se configura en la fase de auth cuando se implemente better-auth.
 */
import { NextResponse } from 'next/server';

// Placeholder hasta que se configure better-auth
export async function GET() {
  return NextResponse.json(
    { error: 'Auth not configured yet' },
    { status: 501 },
  );
}

export async function POST() {
  return NextResponse.json(
    { error: 'Auth not configured yet' },
    { status: 501 },
  );
}
