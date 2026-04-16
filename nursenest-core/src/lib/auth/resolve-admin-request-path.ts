import "server-only";
import { headers } from "next/headers";
import { safeServerLog } from "@/lib/observability/safe-server-log";

let adminPathUnresolvedLogged = false;

function logAdminPathUnresolvedOnce(): void {
  if (adminPathUnresolvedLogged) return;
  adminPathUnresolvedLogged = true;
  safeServerLog("admin_access", "admin_request_path_unresolved", { fallback: "/" });
}

/** Guarantees a non-empty path string starting with `/` for RBAC (never `""`). */
function finalizeAdminPathForRbac(path: string): string {
  const t = path.trim();
  if (!t || !t.startsWith("/")) return "/";
  return t;
}

function normalizeToPathname(raw: string): string | null {
  const t = raw.trim();
  if (!t) return null;
  try {
    let pathOnly = (t.includes("://") ? new URL(t).pathname : t.split("?")[0] ?? t).trim();
    if (!pathOnly) return null;
    if (!pathOnly.startsWith("/")) pathOnly = `/${pathOnly}`;
    if (
      pathOnly.startsWith("/admin") ||
      pathOnly.startsWith("/api/admin") ||
      pathOnly.startsWith("/api/debug")
    ) {
      const trimmed = pathOnly.replace(/\/$/, "");
      return finalizeAdminPathForRbac(trimmed.length > 0 ? trimmed : pathOnly);
    }
  } catch {
    return null;
  }
  return null;
}

/**
 * Path for RBAC checks on admin UI, `/api/admin/*`, and `/api/debug/*` (super-only tools).
 * Prefer `x-nn-admin-path` / `x-nn-request-pathname` from `src/proxy.ts` (set before NextAuth middleware runs).
 * Falls back to other same-request URL headers (never `Referer` — it can point at the previous page).
 * Never returns empty string: unresolved → `"/"` (denied for non-super in {@link isPathAllowedForStaffTier}).
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
    if (p) return finalizeAdminPathForRbac(p);
  }
  logAdminPathUnresolvedOnce();
  return finalizeAdminPathForRbac("/");
}
