/**
 * Values for `<input type="datetime-local">` must be a local, timezone-naive
 * `yyyy-MM-ddTHH:mm` string. Do not use `toISOString().slice(0, 16)` — that is UTC
 * and can confuse strict parsers or show the wrong wall clock.
 */
export function dateToDatetimeLocalInputValue(d: Date): string {
  if (Number.isNaN(d.getTime())) return "";
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

/** Parse an ISO-ish instant and format for `datetime-local` in the user's local zone. */
export function iso8601ToDatetimeLocalInputValue(iso: string | null | undefined): string {
  if (!iso) return "";
  return dateToDatetimeLocalInputValue(new Date(iso));
}
