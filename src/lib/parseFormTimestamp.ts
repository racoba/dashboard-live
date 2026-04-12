/**
 * Best-effort parse for Google Sheets / Forms timestamp cells.
 *
 * Google Forms em PT-BR usa `DD/MM/AAAA HH:MM:SS`. `Date.parse` no JS trata
 * `MM/DD/AAAA` (EUA), o que quebra o filtro “ontem” (ex.: 11/04 vira 4 de nov).
 */
export function parseFormTimestamp(raw: string): Date | null {
  const s = raw.trim();
  if (!s) return null;

  const br = s.match(
    /^(\d{1,2})\/(\d{1,2})\/(\d{4})(?:\s+(\d{1,2}):(\d{2})(?::(\d{2}))?)?/,
  );
  if (br) {
    const dd = parseInt(br[1], 10);
    const mm = parseInt(br[2], 10);
    const yyyy = parseInt(br[3], 10);
    const hh = br[4] ? parseInt(br[4], 10) : 0;
    const mi = br[5] ? parseInt(br[5], 10) : 0;
    const sc = br[6] ? parseInt(br[6], 10) : 0;
    if (mm < 1 || mm > 12 || dd < 1 || dd > 31) return null;
    return new Date(yyyy, mm - 1, dd, hh, mi, sc);
  }

  const iso = Date.parse(s);
  if (!Number.isNaN(iso)) return new Date(iso);

  return null;
}
