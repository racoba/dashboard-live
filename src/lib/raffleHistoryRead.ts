import "server-only";
import {
  buildRaffleHistoryCsvUrl,
  getRaffleHistorySpreadsheetId,
} from "@/src/resources/links";
import { parseCsv } from "@/src/lib/csvParse";
import type { RaffleHistoryTableResult } from "@/src/resources/types";

/** Mesma ideia que `raffleSheet.ts`: cabeçalho na linha 0, dados abaixo; ignora linhas vazias. */
function tableFromExportCsvRows(parsed: string[][]): {
  headers: string[];
  rows: string[][];
} {
  if (parsed.length === 0) {
    return { headers: [], rows: [] };
  }
  const headers = (parsed[0] ?? []).map((c) => c.trim());
  if (headers.length === 0 || headers.every((h) => h === "")) {
    return { headers: [], rows: [] };
  }
  const colCount = headers.length;
  const rows: string[][] = [];
  for (let r = 1; r < parsed.length; r++) {
    const raw = parsed[r];
    if (!raw?.length || !raw.some((c) => (c?.trim() ?? "") !== "")) continue;
    const cells = raw.map((c) => c.trim());
    while (cells.length < colCount) cells.push("");
    rows.push(cells.slice(0, colCount));
  }
  return { headers, rows };
}

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
      detail: `HTTP ${res.status}. A planilha precisa estar acessível (ex.: “Qualquer pessoa com o link” como leitor) para exportação CSV, como na aba do sorteio.`,
    };
  }

  const text = await res.text();
  const parsed = parseCsv(text);
  const { headers, rows } = tableFromExportCsvRows(parsed);
  return { ok: true, headers, rows };
}
