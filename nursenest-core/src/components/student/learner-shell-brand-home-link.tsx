"use client";

import Link from "next/link";
import { SiteBrandLogoMark } from "@/components/brand/site-brand-logo";
import { useMarketingI18n } from "@/lib/marketing-i18n";

export function LearnerShellBrandHomeLink() {
  const { t } = useMarketingI18n();
  return (
    <Link href="/" className="inline-flex shrink-0 overflow-visible bg-transparent" aria-label={t("brand.homeAriaLabel")}>
      <SiteBrandLogoMark />
    </Link>
  );
}
