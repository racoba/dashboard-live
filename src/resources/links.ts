export const RAFFLE_FORM_URL =
  "https://forms.gle/YpKpXVmAQMyJ39AA7" as const;

export const RAFFLE_SHEET_URL =
  "https://docs.google.com/spreadsheets/d/1LSYBDkUeZoMEWEp9pSQdI-dx8t-3q6ZkQp9bKI-pG8A/edit?usp=sharing" as const;

/** Mesmo livro que `RAFFLE_SHEET_URL` (aba `historico`). Só muda se usares outra planilha + `NEXT_RAFFLE_HISTORY_SPREADSHEET_ID`. */
export const RAFFLE_HISTORY_URL = RAFFLE_SHEET_URL;

/** Nome da aba com os sorteios gravados (usado no export CSV via gviz se não houver GID). */
export const RAFFLE_HISTORY_SHEET_TAB_NAME = "historico" as const;

export function getRaffleHistorySpreadsheetId(): string {
  const m = RAFFLE_HISTORY_URL.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
  if (!m?.[1]) {
    throw new Error("RAFFLE_HISTORY_URL não contém um ID de planilha válido.");
  }
  return m[1];
}

/**
 * Normaliza o GID copiado da barra de endereço (só dígitos, `gid=…`, fragmento `#gid=…`).
 * O GID do Google Sheets é numérico; valores que não parecem um GID devolvem `undefined`.
 */
export function normalizeGoogleSheetGid(raw: string | undefined): string | undefined {
  if (!raw) return undefined;
  let s = raw.trim().replace(/^["']|["']$/g, "");
  if (!s) return undefined;
  const fromParam = s.match(/(?:^|[?#&])gid=(\d+)/i);
  if (fromParam) return fromParam[1];
  return /^\d+$/.test(s) ? s : undefined;
}

/**
 * URLs a tentar por ordem: export+gid (como o sorteio), gviz+gid, gviz+nome da aba, export sem gid (só 1.ª aba).
 * Ajuda quando um dos endpoints devolve HTML vazio ou erro.
 */
export function buildRaffleHistoryCsvUrlCandidates(
  spreadsheetId: string,
  opts?: { gid?: string; sheetName?: string },
): string[] {
  const gid = normalizeGoogleSheetGid(opts?.gid);
  const sheet = opts?.sheetName?.trim() || RAFFLE_HISTORY_SHEET_TAB_NAME;
  const urls: string[] = [];
  if (gid) {
    urls.push(buildRaffleSheetCsvExportUrl(spreadsheetId, gid));
    urls.push(
      `https://docs.google.com/spreadsheets/d/${spreadsheetId}/gviz/tq?tqx=out:csv&gid=${encodeURIComponent(gid)}`,
    );
  }
  urls.push(
    `https://docs.google.com/spreadsheets/d/${spreadsheetId}/gviz/tq?tqx=out:csv&sheet=${encodeURIComponent(sheet)}`,
  );
  if (!gid) {
    urls.push(buildRaffleSheetCsvExportUrl(spreadsheetId));
  }
  return [...new Set(urls)];
}

export function getRaffleSpreadsheetId(): string {
  const m = RAFFLE_SHEET_URL.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
  if (!m?.[1]) {
    throw new Error("RAFFLE_SHEET_URL não contém um ID de planilha válido.");
  }
  return m[1];
}

/** Exportação CSV pública (planilha precisa permitir leitura por link). */
export function buildRaffleSheetCsvExportUrl(
  spreadsheetId: string,
  gid?: string,
): string {
  let url = `https://docs.google.com/spreadsheets/d/${spreadsheetId}/export?format=csv`;
  if (gid) {
    url += `&gid=${encodeURIComponent(gid)}`;
  }
  return url;
}