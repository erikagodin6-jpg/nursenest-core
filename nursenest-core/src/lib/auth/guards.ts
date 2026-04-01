import { notFound, redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { userHasAdminRoleInDatabase } from "@/lib/auth/admin-authority";

/**
 * Server-only session check. Unauthenticated `/app/*` and `/admin/*` requests are turned away in
 * `src/proxy.ts` Edge auth middleware (HTTP redirect) before RSC runs — do not use `redirect("/login")` here for missing
 * session: it interacted with Next.js 16 streaming and surfaced raw Flight payloads in the document.
 *
 * Must agree with `authorized()` in `src/lib/auth-middleware.ts`, which treats `id` **or** `email` as signed-in.
 * Requiring `id` alone caused 404 on `/admin` when the session had email but `id` was not yet hydrated.
 */
export async function requireUser() {
  const session = await auth();
  const u = session?.user as { id?: string; email?: string | null } | undefined;
  if (!session?.user || (!u?.id && !u?.email)) {
    notFound();
  }
  return session;
}

export async function requireAdmin() {
  const session = await requireUser();
  const u = session.user as { id?: string; email?: string | null; role?: string };
  if (u.role === "ADMIN") {
    return session;
  }
  if (u.id && (await userHasAdminRoleInDatabase(u.id))) {
    return session;
  }
  redirect("/app");
}
