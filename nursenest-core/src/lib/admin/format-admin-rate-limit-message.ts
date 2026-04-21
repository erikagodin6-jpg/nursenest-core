/**
 * Turns structured 429 JSON from admin proxies into a short operator-facing string.
 * Safe on arbitrary bodies — never throws.
 */
export function formatAdminRateLimitMessageFromJson(body: unknown): string {
  const o = body && typeof body === "object" ? (body as Record<string, unknown>) : null;
  if (!o) {
    return "Too many requests. If you are signed in, refresh the page and retry.";
  }
  const isRl = o.code === "rate_limit_exceeded" || o.error === "Too many requests";
  if (!isRl) {
    if (typeof o.error === "string" && o.error.trim()) return o.error.trim();
    return "Too many requests. If you are signed in, refresh the page and retry.";
  }

  const scope = typeof o.scope === "string" && o.scope ? o.scope : "rate_limited";
  const limiter = typeof o.limiter === "string" && o.limiter ? o.limiter : scope;
  const action = typeof o.action === "string" && o.action ? o.action : "";
  const path = typeof o.path === "string" && o.path ? o.path : "";
  const bucketKeyType =
    typeof o.bucketKeyType === "string" && o.bucketKeyType
      ? o.bucketKeyType
      : typeof o.bucketType === "string" && o.bucketType
        ? o.bucketType
        : "";
  const retry =
    typeof o.retryAfterSec === "number" && Number.isFinite(o.retryAfterSec) ? Math.round(o.retryAfterSec) : null;
  const cap =
    typeof o.max === "number" && typeof o.windowMs === "number"
      ? `${o.max}/${Math.max(1, Math.round(o.windowMs / 1000))}s`
      : null;

  const parts: string[] = ["Too many requests"];
  parts.push(`[${limiter}${action ? ` · ${action}` : ""}]`);
  if (bucketKeyType) parts.push(`bucket: ${bucketKeyType}`);
  if (path) parts.push(`path: ${path}`);
  if (cap) parts.push(`cap: ${cap}`);
  if (retry != null && retry > 0) parts.push(`retry ~${retry}s`);
  return parts.join(" ");
}
