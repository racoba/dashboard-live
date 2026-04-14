import "server-only";

import { getRaffleSpreadsheetId } from "@/src/resources/links";
import { parseCsv } from "@/src/lib/csvParse";
import { getInstantCalendarYmd } from "@/src/lib/raffleDates";
import { toGoogleDriveDirectImageUrl } from "@/src/lib/googleDriveImageUrl";

export type RafflePhotoResult =
  | {
      ok: true;
      timeZone: string;
      targetYmd: string;
      imageUrl: string | null;
      rawUrl?: string;
    }
  | { ok: false; error: string; detail?: string };

function normalizeHeader(h: string): string {
  return h
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .trim();
}

function findCol(header: string[], predicate: (h: string) => boolean): number {
  return header.findIndex((cell) => predicate(normalizeHeader(cell)));
}

function isValidYmd(ymd: string): boolean {
  return /^\d{4}-\d{2}-\d{2}$/.test(ymd);
}

function parseDayToYmd(dayCell: string, targetYmd: string): string | null {
  const s = dayCell.trim();
  if (!s) return null;

  const y = parseInt(targetYmd.slice(0, 4), 10);
  if (!y) return null;

  // Accept DD/MM/YYYY
  const full = s.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (full) {
    const dd = parseInt(full[1], 10);
    const mm = parseInt(full[2], 10);
    const yy = parseInt(full[3], 10);
    if (!yy || mm < 1 || mm > 12 || dd < 1 || dd > 31) return null;
    return `${yy}-${String(mm).padStart(2, "0")}-${String(dd).padStart(2, "0")}`;
  }

  // Accept DD/MM (assume same year as targetYmd)
  const short = s.match(/^(\d{1,2})\/(\d{1,2})$/);
  if (short) {
    const dd = parseInt(short[1], 10);
    const mm = parseInt(short[2], 10);
    if (mm < 1 || mm > 12 || dd < 1 || dd > 31) return null;
    return `${y}-${String(mm).padStart(2, "0")}-${String(dd).padStart(2, "0")}`;
  }

  return null;
}

function buildPhotosCsvUrl(spreadsheetId: string, sheetName: string): string {
  return `https://docs.google.com/spreadsheets/d/${spreadsheetId}/gviz/tq?tqx=out:csv&sheet=${encodeURIComponent(
    sheetName,
  )}`;
}

export async function loadRafflePhotoFromSheet(opts: {
  timeZone: string;
  targetYmd?: string;
  sheetName?: string;
}): Promise<RafflePhotoResult> {
  const timeZone = opts.timeZone;
  const sheetName = opts.sheetName?.trim() || "fotos sorteio";

  const targetYmdRaw = opts.targetYmd?.trim() || "";
  const targetYmd = targetYmdRaw && isValidYmd(targetYmdRaw)
    ? targetYmdRaw
    : getInstantCalendarYmd(new Date(), timeZone);

  let spreadsheetId: string;
  try {
    spreadsheetId = getRaffleSpreadsheetId();
  } catch (e) {
    return {
      ok: false,
      error: "invalid_sheet_url",
      detail: e instanceof Error ? e.message : undefined,
    };
  }

  const csvUrl = buildPhotosCsvUrl(spreadsheetId, sheetName);

  let res: Response;
  try {
    res = await fetch(csvUrl, {
      next: { revalidate: 30 },
      headers: {
        "User-Agent": "dashboard-live/1.0 (+https://github.com/vercel/next.js)",
      },
    });
  } catch (e) {
    return {
      ok: false,
      error: "fetch_failed",
      detail: e instanceof Error ? e.message : undefined,
    };
  }

  if (!res.ok) {
    return {
      ok: false,
      error: "sheet_not_accessible",
      detail: `HTTP ${res.status}. A aba "${sheetName}" precisa estar acessível (ex.: “Qualquer pessoa com o link” como leitor) para exportação CSV.`,
    };
  }

  const text = await res.text();
  const rows = parseCsv(text);
  if (rows.length < 2) {
    return {
      ok: true,
      timeZone,
      targetYmd,
      imageUrl: null,
    };
  }

  const header = rows[0].map((c) => c.trim());
  const iDay = findCol(header, (h) => h === "dia" || h.includes("dia"));
  const iPhoto = findCol(
    header,
    (h) =>
      h.includes("foto") ||
      (h.includes("imagem") && h.includes("sorte")) ||
      h.includes("foto sorteio"),
  );

  if (iDay < 0 || iPhoto < 0) {
    return {
      ok: false,
      error: "missing_columns",
      detail:
        'Não encontrei as colunas "Dia" e "Foto Sorteio" na aba "fotos sorteio".',
    };
  }

  let bestRaw: string | null = null;
  for (let r = 1; r < rows.length; r++) {
    const row = rows[r];
    const need = Math.max(iDay, iPhoto);
    if (!row || row.length <= need) continue;

    const dayRaw = (row[iDay] ?? "").trim();
    const rowYmd = parseDayToYmd(dayRaw, targetYmd);
    if (!rowYmd || rowYmd !== targetYmd) continue;

    const photoRaw = (row[iPhoto] ?? "").trim();
    if (photoRaw) bestRaw = photoRaw;
  }

  const direct = bestRaw ? toGoogleDriveDirectImageUrl(bestRaw) : null;
  return {
    ok: true,
    timeZone,
    targetYmd,
    imageUrl: direct,
    rawUrl: bestRaw ?? undefined,
  };
}

