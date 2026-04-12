import "server-only";
import {
  buildRaffleHistoryCsvUrl,
  getRaffleHistorySpreadsheetId,
} from "@/src/resources/links";
import { parseCsv } from "@/src/lib/csvParse";

export type RaffleHistoryTableResult =
  | { ok: true; headers: string[]; rows: string[][] }
  | { ok: false; error: string; detail?: string };

export async function loadRaffleHistoryTable(): Promise<RaffleHistoryTableResult> {
  let spreadsheetId: string;
  try {
    spreadsheetId = getRaffleHistorySpreadsheetId();
  } catch (e) {
    return {
      ok: false,
      error: "invalid_history_url",
      detail: e instanceof Error ? e.message : undefined,
    };
  }

  const gid = process.env.NEXT_RAFFLE_HISTORY_TAB_GID?.trim();
  const sheetName = process.env.NEXT_RAFFLE_HISTORY_TAB_NAME?.trim();

  const csvUrl = buildRaffleHistoryCsvUrl(spreadsheetId, {
    gid: gid || undefined,
    sheetName: sheetName || undefined,
  });

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
      detail: `HTTP ${res.status}. Confirme que a planilha está partilhada (leitura) e que o nome da aba ou o GID está correto.`,
    };
  }

  const text = await res.text();
  const parsed = parseCsv(text);
  if (parsed.length === 0) {
    return { ok: true, headers: [], rows: [] };
  }

  const headers = (parsed[0] ?? []).map((c) => c.trim());
  const rows = parsed
    .slice(1)
    .filter((row) => row.some((cell) => cell.trim() !== ""));

  return { ok: true, headers, rows };
}
