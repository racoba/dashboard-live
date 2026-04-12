/** Treats "true", "1", "yes" (case-insensitive) as enabled. */
export function envIsTruthy(value: string | undefined): boolean {
  if (value == null || value === "") return false;
  const v = value.toLowerCase().trim();
  return v === "true" || v === "1" || v === "yes";
}
