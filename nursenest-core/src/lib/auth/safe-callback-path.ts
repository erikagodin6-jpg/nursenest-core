export type SafeCallbackPathOptions = {
  /**
   * When true, reject only the bare learner shell root (`/app`, `/app/`) so generic marketing auth does not
   * swap shells. Deep links such as `/app/lessons` remain valid explicit study targets.
   */
  rejectLearnerAppShell?: boolean;
};

/** True for `/app` or `/app/` (optional trailing slash), not `/app/lessons` or deeper. */
export function isLearnerAppShellRootPathname(pathname: string): boolean {
  return pathname === "/app" || pathname === "/app/";
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
    if (opts?.rejectLearnerAppShell && isLearnerAppShellRootPathname(u.pathname)) {
      return null;
    }
    return `${u.pathname}${u.search}${u.hash}`;
  } catch {
    return null;
  }
}
