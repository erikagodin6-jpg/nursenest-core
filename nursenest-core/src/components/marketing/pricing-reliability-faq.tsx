"use client";

import { ChevronDown, ShieldCheck } from "lucide-react";
import { useMarketingI18n } from "@/lib/marketing-i18n";
import { FadeUp } from "@/lib/motion";

const DETAIL_KEYS = ["siteCrash", "slowExperience", "studyReliability"] as const;

/**
 * Uptime, performance, and study continuity — separate band so trust is explicit before checkout.
 */
export function PricingReliabilityFaq() {
  const { t } = useMarketingI18n();

  return (
    <section
      aria-labelledby="pricing-reliability-faq-heading"
      className="scroll-mt-20 border-y border-[color-mix(in_srgb,var(--semantic-success)_20%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-success)_07%,var(--semantic-surface))] py-10 md:py-12"
      data-testid="section-pricing-reliability-faq"
    >
      <div className="mx-auto max-w-3xl px-4 sm:px-0">
        <FadeUp whenInView once viewMargin="-28px" className="mb-6 text-center">
          <div className="mx-auto mb-3 flex justify-center">
            <span
              className="inline-flex items-center gap-2 rounded-full border border-[color-mix(in_srgb,var(--semantic-success)_30%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-success)_12%,var(--semantic-surface))] px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-[var(--semantic-success)]"
            >
              <ShieldCheck className="h-3.5 w-3.5" aria-hidden />
              {t("pages.pricing.reliabilityFaq.eyebrow")}
            </span>
          </div>
          <h2 id="pricing-reliability-faq-heading" className="nn-marketing-h2 text-balance text-[var(--semantic-text-primary)]">
            {t("pages.pricing.reliabilityFaq.heading")}
          </h2>
          <p className="nn-marketing-body-sm mx-auto mt-2 max-w-xl text-[var(--semantic-text-secondary)]">
            {t("pages.pricing.reliabilityFaq.subheading")}
          </p>
        </FadeUp>

        <div className="space-y-2">
          {DETAIL_KEYS.map((key) => (
            <details
              key={key}
              className="group rounded-xl border border-[color-mix(in_srgb,var(--semantic-border-soft)_1,var(--border))] bg-[var(--semantic-surface)] px-4 py-3.5 shadow-[var(--elevation-rest)]"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-3 text-left marker:content-none [&::-webkit-details-marker]:hidden">
                <span className="text-sm font-semibold text-[var(--semantic-text-primary)]">
                  {t(`pages.pricing.reliabilityFaq.${key}Question`)}
                </span>
                <ChevronDown
                  className="h-4 w-4 shrink-0 text-[var(--semantic-text-muted)] transition group-open:rotate-180"
                  aria-hidden
                />
              </summary>
              <p className="nn-marketing-body-sm mt-3 border-t border-[var(--semantic-border-soft)] pt-3 text-[var(--semantic-text-secondary)]">
                {t(`pages.pricing.reliabilityFaq.${key}Answer`)}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
