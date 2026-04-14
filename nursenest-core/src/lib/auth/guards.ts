import { headers } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { adminRouteGateDecision } from "@/lib/auth/admin-path-policy";
import { getStaffSession } from "@/lib/auth/staff-session";

/**
 * Server-only session check. Unauthenticated `/app/*` and `/admin/*` requests are turned away in
 * `src/proxy.ts` Edge auth middleware (HTTP redirect) before RSC runs — do not use `redirect("/login")` here for missing
 * session: it interacted with Next.js 16 streaming and surfaced raw Flight payloads in the document.
 *
 * Must agree with `authorized()` in `src/lib/auth-middleware.ts`, which treats `id` **or** `email` as signed-in.
 */
export async function requireUser() {
  const session = await auth();
  const u = session?.user as { id?: string; email?: string | null } | undefined;
  if (!session?.user || (!u?.id && !u?.email)) {
    notFound();
  }
  return session;
}

/**
 * Admin UI: database is source of truth for staff role (JWT may lag after promotion/demotion).
 */
export async function requireAdmin() {
  const session = await requireUser();
  const staff = await getStaffSession();
  const path = (await headers()).get("x-nn-admin-path") ?? "";
  const gate = adminRouteGateDecision(staff, path);
  if (!gate.allow) {
    redirect(gate.redirectTo);
  }
  return session;
}
