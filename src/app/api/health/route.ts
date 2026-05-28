import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    status: 'ok',
    service: 'swv-meubel-portal',
    time: new Date().toISOString(),
  });
}
