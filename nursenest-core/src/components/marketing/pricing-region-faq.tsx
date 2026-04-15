"use client";

import { ChevronDown, Globe2 } from "lucide-react";
import { useMarketingI18n } from "@/lib/marketing-i18n";
import { useNursenestRegion } from "@/lib/region/use-nursenest-region";
import { FadeUp } from "@/lib/motion";

const DETAIL_KEYS = ["usCanada", "correctExam", "switchCountry"] as const;

/**
 * US vs Canada scope, exam alignment, and region switching — isolated band to avoid pricing confusion.
 */
export function PricingRegionFaq() {
  const { t } = useMarketingI18n();
  const { region } = useNursenestRegion();

  return (
    <section
      aria-labelledby="pricing-region-faq-heading"
      className="scroll-mt-20 border-y border-[color-mix(in_srgb,var(--semantic-info)_18%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-info)_06%,var(--semantic-surface))] py-10 md:py-12"
      data-testid="section-pricing-region-faq"
    >
      <div className="mx-auto max-w-3xl px-4 sm:px-0">
        <FadeUp whenInView once viewMargin="-28px" className="mb-6 text-center">
          <div className="mx-auto mb-3 flex justify-center">
            <span
              className="inline-flex items-center gap-2 rounded-full border border-[color-mix(in_srgb,var(--semantic-info)_28%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-info)_10%,var(--semantic-surface))] px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-[var(--semantic-info)]"
            >
              <Globe2 className="h-3.5 w-3.5" aria-hidden />
              {t("pages.pricing.regionFaq.eyebrow")}
            </span>
          </div>
          <h2 id="pricing-region-faq-heading" className="nn-marketing-h2 text-balance text-[var(--semantic-text-primary)]">
            {t("pages.pricing.regionFaq.heading")}
          </h2>
          <p className="nn-marketing-body-sm mx-auto mt-2 max-w-xl text-[var(--semantic-text-secondary)]">
            {t("pages.pricing.regionFaq.subheading")}
          </p>
          <p className="mt-3 text-xs font-medium text-[var(--semantic-brand)]">
            {region === "US" ? t("pages.pricing.regionFaq.badgeUs") : t("pages.pricing.regionFaq.badgeCa")}
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
                  {t(`pages.pricing.regionFaq.${key}Question`)}
                </span>
                <ChevronDown
                  className="h-4 w-4 shrink-0 text-[var(--semantic-text-muted)] transition group-open:rotate-180"
                  aria-hidden
                />
              </summary>
              <p className="nn-marketing-body-sm mt-3 border-t border-[var(--semantic-border-soft)] pt-3 text-[var(--semantic-text-secondary)]">
                {t(`pages.pricing.regionFaq.${key}Answer`)}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
