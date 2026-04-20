export type SafeCallbackPathOptions = {
  /**
   * When true, reject learner-shell callback targets: `/app`, `/app/`, and any `/app/…` path.
   * Marketing auth flows should not deep-link into subscriber chrome via `callbackUrl`.
   */
  rejectLearnerAppShell?: boolean;
};

/** Learner shell root or any route under it (`/app`, `/app/`, `/app/lessons`, …). */
export function isLearnerAppShellCallbackPathname(pathname: string): boolean {
  return pathname === "/app" || pathname === "/app/" || pathname.startsWith("/app/");
}

/**
 * Validates `callbackUrl` for auth flows — same-origin, path-only (with query/hash).
 */
export function safeCallbackPath(raw: string | null, opts?: SafeCallbackPathOptions): string | null {
  if (!raw?.trim()) return null;
  try {
    const origin = typeof window !== "undefined" ? window.location.origin : "http://localhost";
    const u = new URL(raw, origin);
    if (u.origin !== new URL(origin).origin) return null;
    if (!u.pathname.startsWith("/")) return null;
    /** Never post-login navigate to API routes — `router.push` to `/api/*` can render a raw JSON body in the document. */
    if (u.pathname === "/api" || u.pathname.startsWith("/api/")) return null;
    if (opts?.rejectLearnerAppShell && isLearnerAppShellCallbackPathname(u.pathname)) {
      return null;
    }
    return `${u.pathname}${u.search}${u.hash}`;
  } catch {
    return null;
  }
}
