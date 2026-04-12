import { NextResponse } from "next/server";
import { loadRaffleHistoryTable } from "@/src/lib/raffleHistoryRead";

export async function GET() {
  const result = await loadRaffleHistoryTable();

  if (!result.ok) {
    return NextResponse.json(
      { error: result.error, detail: result.detail },
      { status: 422 },
    );
  }

  return NextResponse.json({
    headers: result.headers,
    rows: result.rows,
  });
}
