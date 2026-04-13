import type { Metadata } from "next";
import { auth } from "@/lib/auth";
import { NotFoundClient } from "@/components/errors/not-found-client";
import { loadResumeStudyingForNotFound } from "@/lib/ui/not-found-resume";

export const metadata: Metadata = {
  title: "Page Not Found",
  robots: { index: false, follow: true },
};

export default async function NotFound() {
  const session = await auth();
  const userId = (session?.user as { id?: string } | undefined)?.id ?? "";
  const isAuthenticated = Boolean(userId);
  /** Single auth read: resume helper does not call `auth()` again. */
  const resumeStudying = userId ? await loadResumeStudyingForNotFound(userId) : null;

  return <NotFoundClient isAuthenticated={isAuthenticated} resumeStudying={resumeStudying} />;
}
