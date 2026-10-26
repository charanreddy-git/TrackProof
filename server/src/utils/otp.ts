import crypto from "crypto";

const OTP_SECRET = process.env.OTP_SECRET || process.env.JWT_SECRET;

if (!OTP_SECRET) {
  throw new Error("OTP_SECRET or JWT_SECRET must be configured");
}

export const OTP_TTL_SECONDS = Number(process.env.OTP_TTL_SECONDS || 300);
export const OTP_RESEND_SECONDS = Number(process.env.OTP_RESEND_SECONDS || 30);
export const OTP_MAX_SENDS_PER_HOUR = Number(
  process.env.OTP_MAX_SENDS_PER_HOUR || 5
);
export const OTP_MAX_ATTEMPTS = 5;

export function generateOtp(): string {
  return crypto.randomInt(0, 1_000_000).toString().padStart(6, "0");
}

export function hashOtp(phone: string, code: string): string {
  return crypto
    .createHmac("sha256", OTP_SECRET as string)
    .update(`${phone}:${code}`)
    .digest("hex");
}

export function otpMatches(phone: string, code: string, storedHash: string): boolean {
  const expected = Buffer.from(hashOtp(phone, code), "hex");
  const stored = Buffer.from(storedHash, "hex");
  return expected.length === stored.length && crypto.timingSafeEqual(expected, stored);
}
