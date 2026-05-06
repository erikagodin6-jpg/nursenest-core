/**
 * Flags flat i18n keys that must never be bundled for anonymous / learner / marketing surfaces.
 * Admin-only copy (CMS, analytics, kill switches, internal ops) stays in the `admin` shard and
 * is loaded only from server-side private paths.
 */

function isPagesAdminSecondSegment(seg: string): boolean {
  if (seg === "administrator") return false;
  if (seg === "admin" || seg === "contentEditor") return true;
  if (seg.startsWith("admin")) return true;
  return false;
}

export function isAdminOnlyFlatI18nKey(key: string): boolean {
  if (key.startsWith("allied.")) {
    const second = key.split(".")[1] ?? "";
    if (second.includes("Admin")) return true;
  }
  if (key.startsWith("pages.")) {
    const parts = key.split(".");
    const second = parts[1] ?? "";
    if (isPagesAdminSecondSegment(second)) return true;
  }
  if (key.startsWith("components.")) {
    const parts = key.split(".");
    const second = parts[1] ?? "";
    if (second.startsWith("admin")) return true;
  }
  return false;
}
