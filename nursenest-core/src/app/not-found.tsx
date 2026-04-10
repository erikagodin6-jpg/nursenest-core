import type { Metadata } from "next";
import { auth } from "@/lib/auth";
import { NotFoundClient } from "@/components/errors/not-found-client";
import { loadResumeStudyingForNotFound } from "@/lib/ui/not-found-resume";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false, follow: true },
};

export default async function NotFound() {
  const session = await auth();
  const userId = (session?.user as { id?: string } | undefined)?.id ?? "";
  const isAuthenticated = Boolean(userId);
  const resumeStudying = isAuthenticated ? await loadResumeStudyingForNotFound() : null;

  return <NotFoundClient isAuthenticated={isAuthenticated} resumeStudying={resumeStudying} />;
}
