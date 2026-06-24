import { generateSecret as otpGenerateSecret, generateURI, verifySync } from 'otplib';
import QRCode from 'qrcode';

const ISSUER = 'SWV Meubel';

export function generateSecret(): string {
  return otpGenerateSecret();
}

export function buildOtpAuthUrl(email: string, secret: string): string {
  return generateURI({ label: email, issuer: ISSUER, secret });
}

export async function buildQrDataUrl(email: string, secret: string): Promise<string> {
  const uri = buildOtpAuthUrl(email, secret);
  return QRCode.toDataURL(uri, { margin: 1, width: 240 });
}

export function verifyToken(token: string, secret: string): boolean {
  try {
    const result = verifySync({ token: token.replace(/\s/g, ''), secret });
    return result.valid;
  } catch {
    return false;
  }
}
