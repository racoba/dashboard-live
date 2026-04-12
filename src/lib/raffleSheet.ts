import "server-only";
import { getRaffleSpreadsheetId, buildRaffleSheetCsvExportUrl } from "@/src/resources/links";
import { parseCsv } from "@/src/lib/csvParse";
import { parseDepositUsd } from "@/src/lib/parseDeposit";
import { parseFormTimestamp } from "@/src/lib/parseFormTimestamp";
import { getInstantCalendarYmd, getYesterdayYmd } from "@/src/lib/raffleDates";

export type RaffleParticipant = {
  key: string;
  label: string;
  tickets: number;
};

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

function participantKey(name: string, instagram: string): string {
  const ig = instagram.trim().replace(/^@/, "").toLowerCase();
  if (ig) return `ig:${ig}`;
  return `name:${name.trim().toLowerCase()}`;
}

function displayLabel(name: string, instagram: string): string {
  const n = name.trim();
  const ig = instagram.trim();
  if (!n && !ig) return "Participante";
  if (ig) {
    const handle = ig.startsWith("@") ? ig : `@${ig}`;
    return n ? `${n} (${handle})` : handle;
  }
  return n;
}

export type RaffleSheetResult =
  | {
      ok: true;
      timeZone: string;
      targetYmd: string;
      participants: RaffleParticipant[];
      totalTickets: number;
    }
  | { ok: false; error: string; detail?: string };

export async function loadRaffleParticipantsFromSheet(
  timeZone: string,
  sheetGid?: string,
): Promise<RaffleSheetResult> {
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

  const csvUrl = buildRaffleSheetCsvExportUrl(spreadsheetId, sheetGid);

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
      detail: `HTTP ${res.status}. A planilha precisa estar acessível (ex.: “Qualquer pessoa com o link” como leitor) para exportação CSV.`,
    };
  }

  const text = await res.text();
  const rows = parseCsv(text);
  if (rows.length < 2) {
    return {
      ok: false,
      error: "empty_sheet",
      detail: "Nenhuma linha de resposta encontrada.",
    };
  }

  const header = rows[0].map((c) => c.trim());
  const iTs = findCol(
    header,
    (h) =>
      h.includes("carimbo") ||
      h.includes("timestamp") ||
      h.includes("data/hora") ||
      h === "hora" ||
      h.includes("submetido"),
  );
  const iName = findCol(header, (h) => h.includes("nome"));
  const iIg = findCol(header, (h) => h.includes("instagram"));
  const iVal = findCol(
    header,
    (h) =>
      (h.includes("valor") && h.includes("deposit")) ||
      h.includes("valor depositado") ||
      h.includes("quantia"),
  );

  if (iTs < 0 || iVal < 0) {
    return {
      ok: false,
      error: "missing_columns",
      detail:
        "Não encontrei colunas de carimbo de data/hora ou valor depositado. Verifique o cabeçalho da aba de respostas.",
    };
  }

  const targetYmd = getYesterdayYmd(timeZone);
  const map = new Map<string, { label: string; tickets: number }>();

  for (let r = 1; r < rows.length; r++) {
    const row = rows[r];
    const requiredIdx = [iTs, iVal, ...(iName >= 0 ? [iName] : []), ...(iIg >= 0 ? [iIg] : [])];
    const need = Math.max(...requiredIdx);
    if (!row || row.length <= need) continue;

    const tsRaw = row[iTs] ?? "";
    const submitted = parseFormTimestamp(tsRaw);
    if (!submitted) continue;

    const rowYmd = getInstantCalendarYmd(submitted, timeZone);
    if (rowYmd !== targetYmd) continue;

    const name = iName >= 0 ? (row[iName] ?? "").trim() : "";
    const instagram = iIg >= 0 ? (row[iIg] ?? "").trim() : "";
    const amount = parseDepositUsd(row[iVal] ?? "");
    const tickets = Math.max(0, Math.floor(amount));
    if (tickets < 1) continue;

    const key = participantKey(name, instagram);
    const label = displayLabel(name, instagram);
    const prev = map.get(key);
    if (prev) {
      map.set(key, { label, tickets: prev.tickets + tickets });
    } else {
      map.set(key, { label, tickets });
    }
  }

  const participants = [...map.entries()]
    .map(([key, v]) => ({ key, label: v.label, tickets: v.tickets }))
    .sort((a, b) => b.tickets - a.tickets);

  const totalTickets = participants.reduce((s, p) => s + p.tickets, 0);

  return {
    ok: true,
    timeZone,
    targetYmd,
    participants,
    totalTickets,
  };
}
