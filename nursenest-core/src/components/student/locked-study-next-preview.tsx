"use client";

import Link from "next/link";
import { AdaptiveStudyOverview } from "@/components/student/adaptive-study-overview";
import { buildSimulatedAdaptiveRecommendationsForConversionPreview } from "@/lib/learner/adaptive-recommendations";
import { useMarketingI18n } from "@/lib/marketing-i18n";

/**
 * Blurred Study Next preview for non-subscribers. Uses simulated engine output, clearly not user-specific.
 */
export function LockedStudyNextPreview({ className }: { className?: string }) {
  const { t } = useMarketingI18n();
  const adaptive = buildSimulatedAdaptiveRecommendationsForConversionPreview();

  return (
    <section className={className} aria-label={t("conversion.lockedStudyNext.ariaLabel")}>
      <p className="text-xs text-muted-foreground">{t("conversion.lockedStudyNext.previewHint")}</p>
      <div className="relative mt-2 overflow-hidden rounded-2xl border border-border/80">
        <div className="pointer-events-none select-none blur-[6px] opacity-[0.88]" aria-hidden="true">
          <AdaptiveStudyOverview adaptive={adaptive} showHeading subscriber={false} />
        </div>
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-background/60 px-5 py-8 backdrop-blur-[2px]">
          <p className="max-w-sm text-center text-base font-semibold leading-snug text-[var(--theme-heading-text)] sm:text-lg">
            {t("cta.unlockPlan")}
          </p>
          <Link
            href="/pricing"
            className="inline-flex min-h-[2.75rem] w-full max-w-xs items-center justify-center rounded-full bg-primary px-5 py-2.5 text-center text-sm font-semibold text-primary-foreground sm:w-auto"
          >
            {t("cta.seePlansPricing")}
          </Link>
        </div>
      </div>
    </section>
  );
}
