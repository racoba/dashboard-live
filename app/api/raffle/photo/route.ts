import { NextResponse } from "next/server";
import { loadRafflePhotoFromSheet } from "@/src/lib/rafflePhotosSheet";

function isValidYmd(ymd: string): boolean {
  return /^\d{4}-\d{2}-\d{2}$/.test(ymd);
}

export async function GET(req: Request) {
  const timeZone = process.env.NEXT_RAFFLE_TIMEZONE ?? "America/Sao_Paulo";

  const url = new URL(req.url);
  const rawDate = url.searchParams.get("date")?.trim() || "";
  const targetYmd = rawDate && isValidYmd(rawDate) ? rawDate : undefined;

  const result = await loadRafflePhotoFromSheet({
    timeZone,
    targetYmd,
  });

  if (!result.ok) {
    return NextResponse.json(
      { error: result.error, detail: result.detail },
      { status: 422 },
    );
  }

  return NextResponse.json({
    timeZone: result.timeZone,
    targetYmd: result.targetYmd,
    imageUrl: result.imageUrl,
  });
}

