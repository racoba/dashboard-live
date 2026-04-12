import { NextResponse } from "next/server";
import {
  ADMIN_GATE_COOKIE,
  createAdminGateToken,
  timingSafeEqualUtf8,
} from "@/src/lib/adminGate";

const COOKIE_MAX_AGE = 60 * 60 * 24 * 7;

export async function POST(request: Request) {
  const secret = process.env.NEXT_ADMIN_HASH;
  if (!secret) {
    return NextResponse.json(
      { ok: false, error: "not_configured" },
      { status: 503 },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_body" }, { status: 400 });
  }

  const hash =
    typeof body === "object" &&
    body !== null &&
    "hash" in body &&
    typeof (body as { hash: unknown }).hash === "string"
      ? (body as { hash: string }).hash
      : "";

  if (!timingSafeEqualUtf8(hash, secret)) {
    return NextResponse.json({ ok: false, error: "invalid_hash" }, { status: 401 });
  }

  const token = createAdminGateToken(secret);
  const res = NextResponse.json({ ok: true });
  res.cookies.set(ADMIN_GATE_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: COOKIE_MAX_AGE,
  });
  return res;
}
