import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import {
  ADMIN_GATE_COOKIE,
  verifyAdminGateCookie,
} from "@/src/lib/adminGate";

export async function GET() {
  const secret = process.env.NEXT_ADMIN_HASH;
  const store = await cookies();
  const token = store.get(ADMIN_GATE_COOKIE)?.value;
  const unlocked = verifyAdminGateCookie(token, secret);
  return NextResponse.json({ unlocked });
}
