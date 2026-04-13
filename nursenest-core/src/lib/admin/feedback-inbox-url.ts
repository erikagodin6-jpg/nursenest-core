/**
 * Build `/admin/feedback` URLs while preserving filters and optional detail selection (`r`).
 */
export function adminFeedbackInboxHref(
  base: Record<string, string | undefined>,
  patch: Record<string, string | undefined | null>,
): string {
  const u = new URLSearchParams();
  for (const [k, v] of Object.entries(base)) {
    if (v != null && v !== "") u.set(k, v);
  }
  for (const [k, v] of Object.entries(patch)) {
    if (v === null || v === "") u.delete(k);
    else u.set(k, v);
  }
  const s = u.toString();
  return s ? `/admin/feedback?${s}` : "/admin/feedback";
}
