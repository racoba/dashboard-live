/** Parses “Valor depositado” style cells (R$, $, 1.234,56 / 1,234.56). */
export function parseDepositUsd(raw: string): number {
  let s = raw.trim();
  if (!s) return 0;
  s = s.replace(/R\$\s*/gi, "").replace(/\$/g, "").replace(/\s/g, "");

  const comma = s.lastIndexOf(",");
  const dot = s.lastIndexOf(".");
  let normalized = s;

  if (comma !== -1 && dot !== -1) {
    if (comma > dot) {
      normalized = s.replace(/\./g, "").replace(",", ".");
    } else {
      normalized = s.replace(/,/g, "");
    }
  } else if (comma !== -1) {
    const after = s.slice(comma + 1);
    if (after.length <= 2) normalized = s.replace(",", ".");
    else normalized = s.replace(/,/g, "");
  }

  const n = parseFloat(normalized);
  return Number.isFinite(n) ? n : 0;
}
