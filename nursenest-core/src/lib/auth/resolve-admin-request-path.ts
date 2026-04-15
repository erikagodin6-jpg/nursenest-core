import "server-only";
import { headers } from "next/headers";

function normalizeToPathname(raw: string): string | null {
  const t = raw.trim();
  if (!t) return null;
  try {
    const pathOnly = (t.includes("://") ? new URL(t).pathname : t.split("?")[0] ?? t).trim();
    if (!pathOnly) return null;
    if (pathOnly.startsWith("/admin") || pathOnly.startsWith("/api/admin")) {
      return pathOnly.replace(/\/$/, "") || pathOnly;
    }
  } catch {
    return null;
  }
  return null;
}

/**
 * Path for RBAC checks on admin UI + `/api/admin/*`.
 * Prefer `x-nn-admin-path` from `src/proxy.ts` (set before NextAuth middleware runs).
 * Falls back to other forwarded URL headers or `Referer` when the proxy header is missing in RSC.
 */
export async function resolveAdminRequestPath(): Promise<string> {
  const h = await headers();
  const headerCandidates = [
    h.get("x-nn-admin-path"),
    h.get("x-invoke-path"),
    h.get("next-url"),
    h.get("x-forwarded-uri"),
    h.get("x-original-uri"),
    h.get("x-middleware-request-url"),
  ];
  for (const c of headerCandidates) {
    const p = c ? normalizeToPathname(c) : null;
    if (p) return p;
  }
  const referer = h.get("referer");
  if (referer) {
    try {
      const p = normalizeToPathname(new URL(referer).pathname);
      if (p) return p;
    } catch {
      /* ignore */
    }
  }
  return "";
}
