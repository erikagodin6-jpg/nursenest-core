/**
 * Guards for same-origin relative navigation targets (404 recovery, resume CTAs, empty-state links).
 * Does not allow protocol-relative URLs, parent traversal, or control characters.
 */
export function isSafeRelativeNavHref(href: string): boolean {
  if (typeof href !== "string") return false;
  const t = href.trim();
  if (t.length === 0 || t.length > 2048) return false;
  if (!t.startsWith("/") || t.startsWith("//")) return false;
  if (t.includes("..") || t.includes("\\")) return false;
  if (/[\u0000-\u001f\u007f]/.test(t)) return false;
  return true;
}

export function sanitizeRelativeNavHrefOrFallback(href: string, fallback = "/"): string {
  return isSafeRelativeNavHref(href) ? href.trim() : fallback;
}
