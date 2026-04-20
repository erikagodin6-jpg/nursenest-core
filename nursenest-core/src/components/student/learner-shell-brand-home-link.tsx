"use client";

import Link from "next/link";
import { SiteBrandLogoMark } from "@/components/brand/site-brand-logo";
import { useMarketingI18n } from "@/lib/marketing-i18n";

export function LearnerShellBrandHomeLink() {
  const { t } = useMarketingI18n();
  return (
    <Link
      href="/"
      className="nn-marketing-body-sm inline-flex min-h-[44px] min-w-0 shrink-0 items-center gap-2 overflow-visible bg-transparent text-[var(--semantic-text-primary)] hover:opacity-90"
      aria-label={t("brand.homeAriaLabel")}
    >
      <SiteBrandLogoMark variant="learner" />
      <span className="hidden font-medium sm:inline">{t("brand.nurseNest")}</span>
    </Link>
  );
}
