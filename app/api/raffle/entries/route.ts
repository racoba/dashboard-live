import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import {
  ADMIN_GATE_COOKIE,
  verifyAdminGateCookie,
} from "@/src/lib/adminGate";
import { loadRaffleParticipantsFromSheet } from "@/src/lib/raffleSheet";

function isValidYmd(ymd: string): boolean {
  return /^\d{4}-\d{2}-\d{2}$/.test(ymd);
}

export async function GET(req: Request) {
  const secret = process.env.NEXT_ADMIN_HASH;
  const store = await cookies();
  const token = store.get(ADMIN_GATE_COOKIE)?.value;
  if (!verifyAdminGateCookie(token, secret)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const timeZone = process.env.NEXT_RAFFLE_TIMEZONE ?? "America/Sao_Paulo";
  const gid = process.env.NEXT_RAFFLE_SHEET_GID?.trim() || undefined;

  const url = new URL(req.url);
  const rawDate = url.searchParams.get("date")?.trim() || "";
  const targetYmd = rawDate && isValidYmd(rawDate) ? rawDate : undefined;

  const result = await loadRaffleParticipantsFromSheet(timeZone, gid, targetYmd);

  if (!result.ok) {
    return NextResponse.json(
      { error: result.error, detail: result.detail },
      { status: 422 },
    );
  }

  return NextResponse.json({
    timeZone: result.timeZone,
    targetYmd: result.targetYmd,
    totalTickets: result.totalTickets,
    participants: result.participants,
  });
}
