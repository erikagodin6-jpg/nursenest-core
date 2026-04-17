import type { Page, Request } from "@playwright/test";

/** Exact pathnames we treat as “heavy” dashboard loaders (no subpaths). */
export const HEAVY_API_PATHS = ["/api/lessons", "/api/dashboard", "/api/progress"] as const;

export type HeavyApiRequestLogEntry = {
  /** Monotonic ms since collection start (performance.now). */
  atMs: number;
  method: string;
  url: string;
  pathname: string;
  resourceType: string;
};

function normalizePathname(pathname: string): string {
  if (pathname.length > 1 && pathname.endsWith("/")) return pathname.slice(0, -1);
  return pathname;
}

/**
 * Records same-origin HTTP(S) requests while active. Call `dispose()` when done.
 * Use for one navigation + settle window (e.g. `/app` after `networkidle`).
 */
export function attachHeavyApiRequestTracker(page: Page, appOrigin: string) {
  const t0 = performance.now();
  const entries: HeavyApiRequestLogEntry[] = [];

  const onRequest = (req: Request) => {
    let u: URL;
    try {
      u = new URL(req.url());
    } catch {
      return;
    }
    if (u.origin !== appOrigin) return;
    const pathname = normalizePathname(u.pathname);
    entries.push({
      atMs: Math.round(performance.now() - t0),
      method: req.method(),
      url: req.url(),
      pathname,
      resourceType: req.resourceType(),
    });
  };

  page.on("request", onRequest);

  return {
    entries,
    dispose: () => {
      page.off("request", onRequest);
    },
  };
}

export function countByHeavyPath(entries: HeavyApiRequestLogEntry[]): Record<(typeof HEAVY_API_PATHS)[number], number> {
  const counts = {
    "/api/lessons": 0,
    "/api/dashboard": 0,
    "/api/progress": 0,
  } satisfies Record<(typeof HEAVY_API_PATHS)[number], number>;

  for (const e of entries) {
    for (const p of HEAVY_API_PATHS) {
      if (e.pathname === p) counts[p] += 1;
    }
  }
  return counts;
}

/**
 * Duplicate = same HTTP method + exact URL string (includes query), seen more than once.
 * Scoped to `/api/*` (excludes `/api/auth/*` — NextAuth session traffic can legitimately repeat during hydration).
 */
export function findDuplicateIdenticalApiRequests(entries: HeavyApiRequestLogEntry[]): string[] {
  const seen = new Map<string, number>();
  const dupes: string[] = [];
  for (const e of entries) {
    if (!e.pathname.startsWith("/api/")) continue;
    if (e.pathname.startsWith("/api/auth")) continue;
    const key = `${e.method}\t${e.url}`;
    const n = (seen.get(key) ?? 0) + 1;
    seen.set(key, n);
    if (n === 2) dupes.push(key);
  }
  return dupes;
}
