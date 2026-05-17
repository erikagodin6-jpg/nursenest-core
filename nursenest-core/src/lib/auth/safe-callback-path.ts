export type SafeCallbackPathOptions = {
  /**
   * When true, reject only the generic learner-shell roots (`/app`, `/app/`).
   * Deep learner URLs are valid forced-login resume targets.
   */
  rejectLearnerAppShell?: boolean;
};

export function isLearnerAppShellCallbackPathname(pathname: string): boolean {
  return pathname === "/app" || pathname === "/app/";
}

export function safeCallbackPath(raw: string | null, opts?: SafeCallbackPathOptions): string | null {
  if (!raw?.trim()) return null;
  try {
    const origin = typeof window !== "undefined" ? window.location.origin : "http://localhost";
    const u = new URL(raw, origin);
    if (u.origin !== new URL(origin).origin) return null;
    if (!u.pathname.startsWith("/")) return null;
    if (u.pathname === "/api" || u.pathname.startsWith("/api/")) return null;
    if (opts?.rejectLearnerAppShell && isLearnerAppShellCallbackPathname(u.pathname)) {
      return null;
    }
    return `${u.pathname}${u.search}${u.hash}`;
  } catch {
    return null;
  }
}
