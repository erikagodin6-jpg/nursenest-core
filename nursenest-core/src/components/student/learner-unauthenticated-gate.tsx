"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { SiteBrandLogoMark } from "@/components/brand/site-brand-logo";
import { LearnerShellLanguageControl } from "@/components/student/learner-shell-language-control";
import { buildLearnerResumePathFromParts } from "@/lib/auth/auth-flow-governance";
import { loginWithCallback } from "@/lib/marketing/marketing-entry-routes";
import { useMarketingI18n } from "@/lib/marketing-i18n";

export function LearnerUnauthenticatedGate() {
  const { t } = useMarketingI18n();
  const pathname = usePathname() ?? "/app";
  const searchParams = useSearchParams();
  const resume = buildLearnerResumePathFromParts(pathname, searchParams.toString() ? `?${searchParams.toString()}` : "", "");
  const signInHref = loginWithCallback(resume);

  return (
    <div data-nn-learner-auth-gate className="mx-auto w-full max-w-6xl px-6 py-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <Link href="/" className="inline-flex overflow-visible bg-transparent" aria-label={t("brand.homeAriaLabel")}>
          <SiteBrandLogoMark variant="auth" />
        </Link>
        <LearnerShellLanguageControl />
      </div>
      <p className="text-sm text-[var(--theme-muted-text)]">
        <Link className="font-medium text-primary underline" href={signInHref}>
          {t("learner.gate.signIn")}
        </Link>{" "}
        {t("learner.gate.toAccessApp")}
      </p>
    </div>
  );
}
