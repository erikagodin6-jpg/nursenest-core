import "server-only";
import { headers } from "next/headers";

function normalizeToPathname(raw: string): string | null {
  const t = raw.trim();
  if (!t) return null;
  try {
    let pathOnly = (t.includes("://") ? new URL(t).pathname : t.split("?")[0] ?? t).trim();
    if (!pathOnly) return null;
    if (!pathOnly.startsWith("/")) pathOnly = `/${pathOnly}`;
    if (pathOnly.startsWith("/admin") || pathOnly.startsWith("/api/admin")) {
      const trimmed = pathOnly.replace(/\/$/, "");
      return trimmed.length > 0 ? trimmed : pathOnly;
    }
  } catch {
    return null;
  }
  return null;
}

/**
 * Path for RBAC checks on admin UI + `/api/admin/*`.
 * Prefer `x-nn-admin-path` / `x-nn-request-pathname` from `src/proxy.ts` (set before NextAuth middleware runs).
 * Falls back to other same-request URL headers (never `Referer` — it can point at the previous page).
 */
export async function resolveAdminRequestPath(): Promise<string> {
  const h = await headers();
  const headerCandidates = [
    h.get("x-nn-admin-path"),
    h.get("x-nn-request-pathname"),
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
  return "";
}
