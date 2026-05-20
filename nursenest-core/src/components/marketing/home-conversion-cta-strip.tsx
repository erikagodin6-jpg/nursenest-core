"use client";

import { ArrowRight } from "lucide-react";
import { useMarketingI18n } from "@/lib/marketing-i18n";
import { withMarketingLocale } from "@/lib/i18n/marketing-path";
import { HUB } from "@/lib/marketing/marketing-entry-routes";
import { useNursenestRegion } from "@/lib/region/use-nursenest-region";
import { MarketingTrackedLink } from "@/components/marketing/marketing-tracked-link";
import { PH } from "@/lib/observability/posthog-conversion-events";
import {
  MARKETING_PRIMARY_CTA_COMPACT_CLASS,
  MARKETING_SECONDARY_CTA_COMPACT_CLASS,
} from "@/lib/theme/marketing-hero-pattern";
import { formatTitleCase } from "@/lib/format/text-case";
import { PRIMARY_CTA, SECONDARY_CTA, TERTIARY_CTA } from "@/lib/copy/cta-copy";

export type HomeConversionCtaStripPlacement =
  | "after_exam_paths"
  | "after_pillars"
  | "after_platform_preview"
  | "after_how_it_works";

function safeT(t: ((key: string) => string) | undefined, key: string, fallback: string): string {
  try {
    const value = t?.(key);
    return typeof value === "string" && value.trim() ? value : fallback;
  } catch {
    return fallback;
  }
}

function safeTitle(value: string, locale: string): string {
  try {
    return formatTitleCase(value, locale);
  } catch {
    return value;
  }
}

function safeLocalizedPath(locale: string, path: string): string {
  try {
    return withMarketingLocale(locale, path);
  } catch {
    return path;
  }
}

export function HomeConversionCtaStrip({ placement }: { placement: HomeConversionCtaStripPlacement }) {
  let locale = "en";
  let t: ((key: string) => string) | undefined;

  try {
    const i18n = useMarketingI18n();
    locale = i18n.locale || "en";
    t = i18n.t;
  } catch {}

  let region = "CA";

  try {
    region = useNursenestRegion().region || "CA";
  } catch {}

  return (
    <div
      className="flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-center"
      role="group"
      aria-label={safeT(t, "home.conversion.inlineCta.aria", "Homepage calls to action")}
      data-testid={`home-cta-strip-${placement}`}
    >
      <MarketingTrackedLink
        href={safeLocalizedPath(locale, HUB.signup)}
        event={PH.marketingHomeHeroSecondaryCta}
        eventProps={{ region, destination: "signup", surface: "inline_cta", placement }}
        className={`${MARKETING_PRIMARY_CTA_COMPACT_CLASS} rounded-xl`}
      >
        {safeTitle(PRIMARY_CTA, locale)}
        <ArrowRight className="ml-1.5 h-4 w-4 shrink-0" aria-hidden />
      </MarketingTrackedLink>

      <MarketingTrackedLink
        href={safeLocalizedPath(locale, HUB.questionBank)}
        event={PH.marketingHomeHeroSecondaryCta}
        eventProps={{ region, destination: "question_bank", surface: "inline_cta", placement }}
        className={`${MARKETING_SECONDARY_CTA_COMPACT_CLASS} rounded-xl border border-[var(--border-subtle)]`}
      >
        {safeTitle(SECONDARY_CTA, locale)}
      </MarketingTrackedLink>

      <MarketingTrackedLink
        href={safeLocalizedPath(locale, HUB.examLessons)}
        event={PH.marketingHomeHeroSecondaryCta}
        eventProps={{ region, destination: "lessons", surface: "inline_cta", placement }}
        className={`${MARKETING_SECONDARY_CTA_COMPACT_CLASS} rounded-xl border border-[var(--border-subtle)]`}
      >
        {safeTitle(TERTIARY_CTA, locale)}
      </MarketingTrackedLink>
    </div>
  );
}