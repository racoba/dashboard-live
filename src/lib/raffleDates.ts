/** Calendar yyyy-MM-dd in `timeZone` for this instant. */
export function getInstantCalendarYmd(
  instant: Date,
  timeZone: string,
): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(instant);
}

function addCalendarDaysToYmd(ymd: string, deltaDays: number): string {
  const [y, m, d] = ymd.split("-").map((x) => parseInt(x, 10));
  const t = Date.UTC(y, m - 1, d + deltaDays);
  const dt = new Date(t);
  const yy = dt.getUTCFullYear();
  const mm = dt.getUTCMonth() + 1;
  const dd = dt.getUTCDate();
  return `${yy}-${String(mm).padStart(2, "0")}-${String(dd).padStart(2, "0")}`;
}

/** Full calendar day before “today” in `timeZone` (not necessarily UTC “yesterday”). */
export function getYesterdayYmd(
  timeZone: string,
  now: Date = new Date(),
): string {
  const todayYmd = getInstantCalendarYmd(now, timeZone);
  return addCalendarDaysToYmd(todayYmd, -1);
}
