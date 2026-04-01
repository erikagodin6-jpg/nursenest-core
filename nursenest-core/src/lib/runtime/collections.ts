/** Avoid `.map` on null/undefined from JSON or optional APIs. */
export function asArray<T>(value: T[] | null | undefined): T[] {
  return Array.isArray(value) ? value : [];
}

/** Non-empty string or fallback (null/undefined safe). */
export function asNonEmptyString(value: string | null | undefined, fallback = ""): string {
  if (typeof value !== "string") return fallback;
  return value;
}
