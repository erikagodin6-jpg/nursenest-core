import type { Metadata } from "next";
import { NotFoundClient } from "@/components/errors/not-found-client";

export const metadata: Metadata = {
  title: "Page Not Found",
  robots: { index: false, follow: true },
};

const BUILD_PHASE = "phase-production-build";

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
  if (process.env.NEXT_PHASE === BUILD_PHASE) {
    return <NotFoundClient isAuthenticated={false} resumeStudying={null} />;
  }

  /** Single auth read: resume helper does not call `auth()` again. */
  const { isAuthenticated, resumeStudying } = await loadNotFoundAuthContext();

  return <NotFoundClient isAuthenticated={isAuthenticated} resumeStudying={resumeStudying} />;
}
