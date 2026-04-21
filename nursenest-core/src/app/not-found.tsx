import type { Metadata } from "next";
import { headers } from "next/headers";
import { NotFoundClient } from "@/components/errors/not-found-client";

export const metadata: Metadata = {
  title: "Page Not Found",
  robots: { index: false, follow: true },
};

const BUILD_PHASE = "phase-production-build";

function pathnameForNotFoundFromHeaders(h: Headers): string {
  const candidates = [
    h.get("x-nn-request-pathname"),
    h.get("x-invoke-path"),
    h.get("next-url"),
  ];
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

async function loadNotFoundAuthContext(): Promise<{
  isAuthenticated: boolean;
  resumeStudying: Awaited<ReturnType<typeof import("@/lib/ui/not-found-resume")["loadResumeStudyingForNotFound"]>>;
}> {
  const [{ auth }, { loadResumeStudyingForNotFound }] = await Promise.all([
    import("@/lib/auth"),
    import("@/lib/ui/not-found-resume"),
  ]);

  const session = await auth();
  const userId = (session?.user as { id?: string } | undefined)?.id ?? "";
  const isAuthenticated = Boolean(userId);
  const resumeStudying = userId ? await loadResumeStudyingForNotFound(userId) : null;

  return { isAuthenticated, resumeStudying };
}

export default async function NotFound() {
  const h = await headers();
  const pathnameSnapshot = pathnameForNotFoundFromHeaders(h);
  const registryRecoveryLinks =
    process.env.NEXT_PHASE === BUILD_PHASE
      ? []
      : await (await import("@/lib/ui/not-found-recovery-suggestions")).buildNotFoundRecoverySuggestions(
          pathnameSnapshot,
        );

  if (process.env.NEXT_PHASE === BUILD_PHASE) {
    return (
      <NotFoundClient
        isAuthenticated={false}
        resumeStudying={null}
        notFoundPathnameSnapshot={pathnameSnapshot}
        registryRecoveryLinks={registryRecoveryLinks}
      />
    );
  }

  /** Single auth read: resume helper does not call `auth()` again. */
  const { isAuthenticated, resumeStudying } = await loadNotFoundAuthContext();

  return (
    <NotFoundClient
      isAuthenticated={isAuthenticated}
      resumeStudying={resumeStudying}
      notFoundPathnameSnapshot={pathnameSnapshot}
      registryRecoveryLinks={registryRecoveryLinks}
    />
  );
}
