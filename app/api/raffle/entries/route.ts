import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import {
  ADMIN_GATE_COOKIE,
  verifyAdminGateCookie,
} from "@/src/lib/adminGate";
import { loadRaffleParticipantsFromSheet } from "@/src/lib/raffleSheet";

export async function GET() {
  const secret = process.env.NEXT_ADMIN_HASH;
  const store = await cookies();
  const token = store.get(ADMIN_GATE_COOKIE)?.value;
  if (!verifyAdminGateCookie(token, secret)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const timeZone = process.env.NEXT_RAFFLE_TIMEZONE ?? "America/Sao_Paulo";
  const gid = process.env.NEXT_RAFFLE_SHEET_GID?.trim() || undefined;

  const result = await loadRaffleParticipantsFromSheet(timeZone, gid);

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
