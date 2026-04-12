/**
 * Best-effort parse for Google Sheets / Forms timestamp cells.
 */
export function parseFormTimestamp(raw: string): Date | null {
  const s = raw.trim();
  if (!s) return null;

  const iso = Date.parse(s);
  if (!Number.isNaN(iso)) return new Date(iso);

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
    return new Date(yyyy, mm - 1, dd, hh, mi, sc);
  }

  return null;
}
