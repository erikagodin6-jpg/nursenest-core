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
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-background/60 px-5 py-10 backdrop-blur-[2px]">
          <p className="max-w-sm text-center text-lg font-semibold text-[var(--theme-heading-text)]">
            {t("cta.unlockPlan")}
          </p>
          <div className="flex flex-col items-stretch gap-2 sm:flex-row sm:items-center">
            <Link
              href="/pricing"
              className="inline-flex items-center justify-center rounded-full bg-primary px-5 py-2.5 text-center text-sm font-semibold text-primary-foreground"
            >
              {t("cta.continuePlan")}
            </Link>
            <Link
              href="/pricing"
              className="inline-flex items-center justify-center rounded-full border border-border bg-card px-5 py-2.5 text-center text-sm font-semibold hover:bg-muted/80"
            >
              {t("cta.improveWeakAreas")}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
