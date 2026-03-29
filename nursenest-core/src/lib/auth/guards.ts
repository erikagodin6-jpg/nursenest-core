import { notFound, redirect } from "next/navigation";
import { auth } from "@/lib/auth";

/**
 * Server-only session check. Unauthenticated `/app/*` and `/admin/*` requests are turned away in
 * `src/proxy.ts` Edge auth middleware (HTTP redirect) before RSC runs — do not use `redirect("/login")` here for missing
 * session: it interacted with Next.js 16 streaming and surfaced raw Flight payloads in the document.
 */
export async function requireUser() {
  const session = await auth();
  if (!session?.user || !(session.user as any).id) {
    notFound();
  }
  return session;
}

export async function requireAdmin() {
  const session = await requireUser();
  if ((session.user as any).role !== "ADMIN") {
    redirect("/app");
  }
  return session;
}
