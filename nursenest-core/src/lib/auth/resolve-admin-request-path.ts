import "server-only";
import { headers } from "next/headers";

/**
 * Path for RBAC checks on admin UI + `/api/admin/*`.
 * Prefer `x-nn-admin-path` from `src/proxy.ts` (set before NextAuth middleware runs).
 */
export async function resolveAdminRequestPath(): Promise<string> {
  const h = await headers();
  const direct = h.get("x-nn-admin-path")?.trim();
  if (direct) {
    const pathOnly = direct.split("?")[0] ?? direct;
    return pathOnly || "";
  }
  return "";
}
