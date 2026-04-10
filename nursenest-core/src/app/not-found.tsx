import { PremiumEmptyState } from "@/components/ui/premium-empty-state";
import { SiteBrandLogoMark } from "@/components/brand/site-brand-logo";
import { loadNotFoundRecovery } from "@/lib/routing/not-found-recovery";

export default async function NotFoundPage() {
  const recovery = await loadNotFoundRecovery();

  return (
    <PremiumEmptyState
      data-nn-empty="global-not-found"
      tone="default"
      headingLevel="h1"
      visualLayout="stack"
      ctaLayout="stack"
      density="comfortable"
      containerClassName="mx-auto flex min-h-[68vh] w-full max-w-5xl items-center justify-center px-4 py-10 sm:px-6 lg:px-8"
      className="w-full max-w-2xl text-center sm:text-left"
      visual={
        <div
          aria-hidden="true"
          className="mx-auto mb-2 flex min-h-[5.5rem] items-center justify-center rounded-[1.75rem] px-4 sm:mx-0"
        >
          <SiteBrandLogoMark
            variant="footer"
            className="!h-[4.5rem] !max-h-[4.5rem] !max-w-[14rem] sm:!h-[5.25rem] sm:!max-h-[5.25rem] sm:!max-w-[16rem]"
          />
        </div>
      }
      headline={recovery.headline}
      body={recovery.body}
      hint={recovery.hint}
      primaryCta={recovery.primaryCta}
      secondaryCtas={recovery.secondaryCtas}
    />
  );
}
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
  /** Single auth read: resume helper does not call `auth()` again. */
  const resumeStudying = userId ? await loadResumeStudyingForNotFound(userId) : null;

  return <NotFoundClient isAuthenticated={isAuthenticated} resumeStudying={resumeStudying} />;
}
