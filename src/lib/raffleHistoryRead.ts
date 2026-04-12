import "server-only";
import {
  buildRaffleHistoryCsvUrlCandidates,
  getRaffleHistorySpreadsheetId,
} from "@/src/resources/links";
import { parseCsv } from "@/src/lib/csvParse";
import type { RaffleHistoryTableResult } from "@/src/resources/types";

function resolveHistorySpreadsheetId(): string {
  const id = process.env.NEXT_RAFFLE_HISTORY_SPREADSHEET_ID?.trim();
  if (id && /^[a-zA-Z0-9_-]+$/.test(id)) return id;
  return getRaffleHistorySpreadsheetId();
}

function stripCsvBom(text: string): string {
  return text.replace(/^\uFEFF/, "");
}

function bodyLooksLikeCsv(text: string): boolean {
  const s = text.trimStart();
  if (!s.length) return false;
  if (s.startsWith("<") || s.toLowerCase().startsWith("<!doctype")) return false;
  if (s.startsWith("{") || s.startsWith("/*")) return false;
  return true;
}

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
    spreadsheetId = resolveHistorySpreadsheetId();
  } catch (e) {
    return {
      ok: false,
      error: "invalid_history_url",
      detail: e instanceof Error ? e.message : undefined,
    };
  }

  const gid = process.env.NEXT_RAFFLE_HISTORY_TAB_GID?.trim();
  const sheetName = process.env.NEXT_RAFFLE_HISTORY_TAB_NAME?.trim();

  const urls = buildRaffleHistoryCsvUrlCandidates(spreadsheetId, {
    gid: gid || undefined,
    sheetName: sheetName || undefined,
  });

  const fetchInit: RequestInit = {
    next: { revalidate: 30 },
    headers: {
      "User-Agent": "dashboard-live/1.0 (+https://github.com/vercel/next.js)",
    },
  };

  let lastDetail = "";

  for (const csvUrl of urls) {
    let res: Response;
    try {
      res = await fetch(csvUrl, fetchInit);
    } catch (e) {
      lastDetail = e instanceof Error ? e.message : "fetch_failed";
      continue;
    }

    if (!res.ok) {
      lastDetail = `HTTP ${res.status}`;
      continue;
    }

    const text = stripCsvBom(await res.text());
    if (!bodyLooksLikeCsv(text)) {
      lastDetail = "Resposta não é CSV (ficheiro privado, ID errado ou sem permissão de leitura).";
      continue;
    }

    const parsed = parseCsv(text);
    const { headers, rows } = tableFromExportCsvRows(parsed);
    const hasHeader = headers.length > 0 && headers.some((h) => h.length > 0);
    if (hasHeader) {
      return { ok: true, headers, rows };
    }
    lastDetail = "CSV sem cabeçalho reconhecível.";
  }

  return {
    ok: false,
    error: "sheet_not_accessible",
    detail: `${lastDetail} Confirme partilha “qualquer pessoa com o link” como leitor, GID/nome da aba, ou defina NEXT_RAFFLE_HISTORY_SPREADSHEET_ID se o histórico estiver noutro documento.`,
  };
}
