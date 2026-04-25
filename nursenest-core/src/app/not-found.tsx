import type { Metadata } from "next";
import { headers } from "next/headers";
import { NotFoundClient } from "@/components/errors/not-found-client";

export const metadata: Metadata = {
  title: "Page Not Found",
  robots: { index: false, follow: true },
};

const BUILD_PHASE = "phase-production-build";

type ResumeStudyingForNotFound =
  Awaited<ReturnType<typeof import("@/lib/ui/not-found-resume")["loadResumeStudyingForNotFound"]>>;

function pathnameForNotFoundFromHeaders(h: Headers | null): string {
  if (!h) return "/";

  const candidates = [h.get("x-nn-request-pathname"), h.get("x-invoke-path"), h.get("next-url")];

  for (const c of candidates) {
    if (!c) continue;

    try {
      const pathOnly = (c.includes("://") ? new URL(c).pathname : c.split("?")[0] ?? c).trim();

      if (pathOnly.startsWith("/")) {
        return pathOnly.length > 2048 ? pathOnly.slice(0, 2048) : pathOnly;
      }
    } catch {
      /* ignore malformed header values */
    }
  }

  return "/";
}

async function readHeadersSafe(): Promise<Headers | null> {
  try {
    return await headers();
  } catch {
    return null;
  }
}

async function buildNotFoundRecoverySuggestionsSafe(pathnameSnapshot: string) {
  if (process.env.NEXT_PHASE === BUILD_PHASE) return [];

  try {
    const mod = await import("@/lib/ui/not-found-recovery-suggestions");
    return await mod.buildNotFoundRecoverySuggestions(pathnameSnapshot);
  } catch {
    return [];
  }
}

async function loadNotFoundAuthContextSafe(): Promise<{
  isAuthenticated: boolean;
  resumeStudying: ResumeStudyingForNotFound | null;
}> {
  if (process.env.NEXT_PHASE === BUILD_PHASE) {
    return { isAuthenticated: false, resumeStudying: null };
  }

  try {
    const [{ auth }, { loadResumeStudyingForNotFound }] = await Promise.all([
      import("@/lib/auth"),
      import("@/lib/ui/not-found-resume"),
    ]);

    const session = await auth();
    const userId = (session?.user as { id?: string } | undefined)?.id ?? "";
    const isAuthenticated = Boolean(userId);

    if (!userId) {
      return { isAuthenticated, resumeStudying: null };
    }

    try {
      const resumeStudying = await loadResumeStudyingForNotFound(userId);
      return { isAuthenticated, resumeStudying };
    } catch {
      return { isAuthenticated, resumeStudying: null };
    }
  } catch {
    return { isAuthenticated: false, resumeStudying: null };
  }
}

export default async function NotFound() {
  const h = await readHeadersSafe();
  const pathnameSnapshot = pathnameForNotFoundFromHeaders(h);
  const registryRecoveryLinks = await buildNotFoundRecoverySuggestionsSafe(pathnameSnapshot);
  const { isAuthenticated, resumeStudying } = await loadNotFoundAuthContextSafe();

  return (
    <NotFoundClient
      isAuthenticated={isAuthenticated}
      resumeStudying={resumeStudying}
      notFoundPathnameSnapshot={pathnameSnapshot}
      registryRecoveryLinks={registryRecoveryLinks}
    />
  );
}