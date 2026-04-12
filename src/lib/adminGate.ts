import "server-only";
import crypto from "crypto";

export const ADMIN_GATE_COOKIE = "dl_admin_gate";

const GATE_PAYLOAD = "dashboard-live:admin-gate:v1";

export function createAdminGateToken(secret: string): string {
  return crypto
    .createHmac("sha256", secret)
    .update(GATE_PAYLOAD)
    .digest("base64url");
}

export function verifyAdminGateCookie(
  cookieValue: string | undefined,
  secret: string | undefined,
): boolean {
  if (!secret || !cookieValue) return false;
  try {
    const expected = createAdminGateToken(secret);
    const a = Buffer.from(cookieValue, "utf8");
    const b = Buffer.from(expected, "utf8");
    if (a.length !== b.length) return false;
    return crypto.timingSafeEqual(a, b);
  } catch {
    return false;
  }
}

export function timingSafeEqualUtf8(a: string, b: string): boolean {
  const bufA = Buffer.from(a, "utf8");
  const bufB = Buffer.from(b, "utf8");
  if (bufA.length !== bufB.length) return false;
  return crypto.timingSafeEqual(bufA, bufB);
}
