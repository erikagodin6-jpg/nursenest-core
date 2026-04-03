"use client";

import Link from "next/link";
import { SiteBrandLogoMark } from "@/components/brand/site-brand-logo";
import { LearnerShellLanguageControl } from "@/components/student/learner-shell-language-control";
import { useMarketingI18n } from "@/lib/marketing-i18n";

export function LearnerUnauthenticatedGate() {
  const { t } = useMarketingI18n();
  return (
    <div className="mx-auto w-full max-w-6xl px-6 py-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <Link href="/" className="inline-flex overflow-visible bg-transparent" aria-label={t("brand.homeAriaLabel")}>
          <SiteBrandLogoMark />
        </Link>
        <LearnerShellLanguageControl />
      </div>
      <p className="text-sm text-[var(--theme-muted-text)]">
        <Link className="font-medium text-primary underline" href="/login">
          {t("learner.gate.signIn")}
        </Link>{" "}
        {t("learner.gate.toAccessApp")}
      </p>
    </div>
  );
}
