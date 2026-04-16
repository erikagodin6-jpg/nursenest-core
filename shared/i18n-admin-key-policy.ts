/**
 * Flags flat i18n keys that must never be bundled for anonymous / learner / marketing surfaces.
 * Admin-only copy (CMS, analytics, kill switches, internal ops) stays in the `admin` shard and
 * is loaded only from server-side private paths (see `nursenest-core/i18n-admin-only/`).
 */

/** Second segment of `pages.*` keys that are staff-only tools (not public marketing pages). */
function isPagesAdminSecondSegment(seg: string): boolean {
  if (seg === "administrator") return false;
  if (seg === "admin" || seg === "contentEditor") return true;
  if (seg.startsWith("admin")) return true;
  return false;
}

/**
 * Returns true if the key is operational / staff UI and must not ship in public i18n shards.
 */
export function isAdminOnlyFlatI18nKey(key: string): boolean {
  /** `nav.admin` is public chrome (signed-in staff nav label) — must live in the `nav` shard, not staff-only. */
  if (key.startsWith("allied.")) {
    const second = key.split(".")[1] ?? "";
    /** e.g. alliedAdmin, articleAdmin, encyclopediaAdmin — staff tooling, not public marketing body copy. */
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
