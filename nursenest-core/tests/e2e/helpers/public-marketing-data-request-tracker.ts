import type { Page, Response } from "@playwright/test";

/**
 * Tracks same-origin “data” HTTP(S) GETs on public marketing pages: `/api/*` (minus auth) and `/_next/data/*`.
 * Excludes RSC flight fetches (`_rsc` query) — full reloads legitimately refetch those; this guard targets JSON/API caches.
 */

export type PublicDataResponseEntry = {
  loadIndex: number;
  method: string;
  url: string;
  /** Stable grouping key (pathname + normalized query or pathname-only). */
  key: string;
  status: number;
  resourceType: string;
  cacheControl: string | null;
  etag: string | null;
  age: string | null;
  lastModified: string | null;
  classification: PublicDataResponseClassification;
};

export type PublicDataResponseClassification = "cache_hit" | "revalidated" | "full_fetch";

const EXACT_API_SKIP = new Set([
  "/api/health",
  "/api/health/ready",
  "/api/healthz",
]);

function normalizePathname(pathname: string): string {
  if (pathname.length > 1 && pathname.endsWith("/")) return pathname.slice(0, -1);
  return pathname;
}

/** Grouping key: pathname + non-RSC query (sorted) so `/api/x?a=1` stays distinct from `a=2`. */
export function stableDataEndpointKey(url: URL): string {
  const pathname = normalizePathname(url.pathname);
  const sp = new URLSearchParams(url.search);
  sp.delete("_rsc");
  sp.delete("_next");
  const keys = [...new Set([...sp.keys()])].sort();
  if (keys.length === 0) return pathname;
  const pairs = keys.flatMap((k) => sp.getAll(k).sort().map((v) => [k, v] as const));
  const q = new URLSearchParams();
  for (const [k, v] of pairs) q.append(k, v);
  const qs = q.toString();
  return qs ? `${pathname}?${qs}` : pathname;
}

export function shouldTrackPublicDataGet(url: URL, method: string): boolean {
  if (method !== "GET") return false;
  if (url.searchParams.has("_rsc")) return false;
  const p = normalizePathname(url.pathname);
  if (p.startsWith("/api/auth")) return false;
  if (p.startsWith("/api/cron")) return false;
  if (EXACT_API_SKIP.has(p) || p.startsWith("/api/health/")) return false;
  if (p.startsWith("/api/")) return true;
  if (p.startsWith("/_next/data/")) return true;
  return false;
}

export function parseCacheControlDirectives(cacheControl: string | null | undefined): Record<string, string | boolean> {
  if (!cacheControl) return {};
  const directives: Record<string, string | boolean> = {};
  for (const rawPart of cacheControl.split(",")) {
    const part = rawPart.trim();
    if (!part) continue;
    const eqIdx = part.indexOf("=");
    if (eqIdx === -1) {
      directives[part.toLowerCase()] = true;
      continue;
    }
    const key = part.slice(0, eqIdx).trim().toLowerCase();
    const value = part.slice(eqIdx + 1).trim();
    directives[key] = value;
  }
  return directives;
}

function readHeader(headers: Record<string, string>, name: string): string | null {
  const value = headers[name];
  if (!value) return null;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

function parseAgeSeconds(age: string | null): number | null {
  if (!age) return null;
  const parsed = Number(age);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : null;
}

export function classifyPublicDataResponseEntry(entry: Pick<PublicDataResponseEntry, "status" | "age">): PublicDataResponseClassification {
  if (entry.status === 304) return "revalidated";
  if (entry.status === 200 && (parseAgeSeconds(entry.age) ?? 0) > 0) return "cache_hit";
  return "full_fetch";
}

/**
 * Records responses for tracked data endpoints. Set `currentLoadIndex` before each navigation / reload.
 */
export function attachPublicMarketingDataResponseTracker(page: Page, appOrigin: string) {
  const entries: PublicDataResponseEntry[] = [];
  let currentLoadIndex = 0;

  const onResponse = (response: Response) => {
    const req = response.request();
    if (req.serviceWorker()) return;
    let u: URL;
    try {
      u = new URL(response.url());
    } catch {
      return;
    }
    if (u.origin !== appOrigin) return;
    if (!shouldTrackPublicDataGet(u, req.method())) return;
    const status = response.status();
    if (status === 0) return;
    const headers = response.headers();
    const entry: PublicDataResponseEntry = {
      loadIndex: currentLoadIndex,
      method: req.method(),
      url: response.url(),
      key: stableDataEndpointKey(u),
      status,
      resourceType: req.resourceType(),
      cacheControl: readHeader(headers, "cache-control"),
      etag: readHeader(headers, "etag"),
      age: readHeader(headers, "age"),
      lastModified: readHeader(headers, "last-modified"),
      classification: "full_fetch",
    };
    entry.classification = classifyPublicDataResponseEntry(entry);
    entries.push(entry);
  };

  page.on("response", onResponse);

  return {
    entries,
    setLoadIndex: (i: number) => {
      currentLoadIndex = i;
    },
    dispose: () => {
      page.off("response", onResponse);
    },
  };
}

/**
 * On reload navigations (loadIndex >= 1), repeated **200** responses for the same data endpoint imply
 * full refetches without HTTP caching — fail the guard. 304 / missing rows (memory cache) are OK.
 */
export function findReloadFullFetchViolations(entries: PublicDataResponseEntry[]): string[] {
  const reload200Counts = new Map<string, number>();
  for (const e of entries) {
    if (e.loadIndex < 1) continue;
    if (e.status !== 200) continue;
    if (e.classification !== "full_fetch") continue;
    const k = `${e.method}\t${e.key}`;
    reload200Counts.set(k, (reload200Counts.get(k) ?? 0) + 1);
  }
  const violations: string[] = [];
  for (const [k, n] of reload200Counts) {
    if (n >= 2) violations.push(`${k} — ${n} full fetch 200 response(s) across reload navigations (expected ≤1; prefer 304, disk cache, or no refetch)`);
  }
  return violations;
}

export function findMissingCachingHeaderViolations(entries: PublicDataResponseEntry[]): string[] {
  const violations: string[] = [];
  for (const entry of entries) {
    const reasons: string[] = [];
    const directives = parseCacheControlDirectives(entry.cacheControl);
    if (!entry.cacheControl) {
      reasons.push("missing Cache-Control");
    } else {
      const sMaxAge = directives["s-maxage"];
      const parsedSMaxAge = typeof sMaxAge === "string" ? Number(sMaxAge) : NaN;
      if (!Number.isFinite(parsedSMaxAge) || parsedSMaxAge <= 0) {
        reasons.push("missing positive s-maxage");
      }
    }
    if (!entry.etag && !entry.lastModified) {
      reasons.push("missing ETag or Last-Modified");
    }
    if (reasons.length === 0) continue;
    violations.push(
      `load ${entry.loadIndex}: ${entry.method}\t${entry.url} — ${reasons.join("; ")}`,
    );
  }
  return violations;
}

/** Same method + full URL seen more than once within a single load (duplicate parallel fetches). */
export function findDuplicateIdenticalDataRequestsInLoad(entries: PublicDataResponseEntry[]): string[] {
  const byLoad = new Map<number, Map<string, number>>();
  const dupes: string[] = [];
  for (const e of entries) {
    if (!e.url.includes("/api/") && !e.url.includes("/_next/data/")) continue;
    if (e.url.includes("/api/auth")) continue;
    const perLoad = byLoad.get(e.loadIndex) ?? new Map<string, number>();
    byLoad.set(e.loadIndex, perLoad);
    const key = `${e.method}\t${e.url}`;
    const n = (perLoad.get(key) ?? 0) + 1;
    perLoad.set(key, n);
    if (n === 2) dupes.push(`load ${e.loadIndex}: ${key}`);
  }
  return dupes;
}
