export const RAFFLE_FORM_URL =
  "https://forms.gle/YpKpXVmAQMyJ39AA7" as const;

export const RAFFLE_SHEET_URL =
  "https://docs.google.com/spreadsheets/d/1LSYBDkUeZoMEWEp9pSQdI-dx8t-3q6ZkQp9bKI-pG8A/edit?usp=sharing" as const;

export const RAFFLE_HISTORY_URL =
  "https://docs.google.com/spreadsheets/d/1f4OTbxUYzCEoTjjQatz4Vv5RmkmZv0rqNJfsp86JePY/edit?usp=sharing" as const;

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
 * CSV público da planilha de histórico.
 * Preferir `gid` (copiar da URL ao abrir a aba); senão usa o nome da aba no endpoint gviz.
 */
export function buildRaffleHistoryCsvUrl(
  spreadsheetId: string,
  opts?: { gid?: string; sheetName?: string },
): string {
  const gid = opts?.gid?.trim();
  if (gid) {
    return buildRaffleSheetCsvExportUrl(spreadsheetId, gid);
  }
  const sheet = encodeURIComponent(
    opts?.sheetName?.trim() || RAFFLE_HISTORY_SHEET_TAB_NAME,
  );
  return `https://docs.google.com/spreadsheets/d/${spreadsheetId}/gviz/tq?tqx=out:csv&sheet=${sheet}`;
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