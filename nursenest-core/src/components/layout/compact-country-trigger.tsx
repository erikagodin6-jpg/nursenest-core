"use client";

import { ChevronDown, Globe } from "lucide-react";
import { REGION_CONFIG, type GlobalRegionSlug } from "@/lib/i18n/global-regions";
import { useMarketingI18n } from "@/lib/marketing-i18n";
import { getRegionFlag } from "@/lib/navigation/context-switch-helpers";

type CompactCountryTriggerProps = {
  region: GlobalRegionSlug;
  onClick: () => void;
  className?: string;
};

/**
 * Small standalone trigger for the marketing header utility row.
 * Kept out of global-context-switcher.tsx so the header does not eagerly load
 * the full country/search/profession/exam selector bundle on first paint.
 */
export function CompactCountryTrigger({ region, onClick, className }: CompactCountryTriggerProps) {
  const { t } = useMarketingI18n();
  const flag = getRegionFlag(region);
  const regionCfg = REGION_CONFIG[region];

  const defaultTriggerClass =
    "flex min-h-[32px] items-center gap-1 rounded-full bg-transparent px-3 py-1 text-[0.8125rem] font-medium tracking-normal text-[var(--header-utility-text)] transition-colors hover:bg-[var(--nav-hover)] hover:text-[var(--nav-fg)]";

  return (
    <button
      type="button"
      onClick={onClick}
      className={className?.trim() ? className : defaultTriggerClass}
      aria-label={`${t("nav.selectCountry")}: ${regionCfg.displayName}`}
      title={`${t("nav.selectCountry")} — ${regionCfg.displayName}`}
    >
      <Globe className="h-3 w-3 shrink-0 opacity-60" aria-hidden />
      <span className="hidden min-[900px]:inline text-[10px] font-normal opacity-75">
        {t("nav.selectCountry")}
      </span>
      <span className="hidden sm:inline">{flag}</span>
      <span className="max-w-[80px] truncate">{regionCfg.displayName}</span>
      <ChevronDown className="h-3 w-3 shrink-0 opacity-50" aria-hidden />
    </button>
  );
}
