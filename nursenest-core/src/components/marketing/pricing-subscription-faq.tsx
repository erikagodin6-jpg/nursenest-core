"use client";

import { ChevronDown, Shield } from "lucide-react";
import { useMarketingI18n } from "@/lib/marketing-i18n";
import { FadeUp } from "@/lib/motion";

const PAIRS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] as const;

/**
 * Subscription scope, add-ons, and legal safety — answers stay short and entitlement-aligned.
 */
export function PricingSubscriptionFaq() {
  const { t } = useMarketingI18n();

  return (
    <section
      aria-labelledby="pricing-subscription-faq-heading"
      className="scroll-mt-20 border-y border-[color-mix(in_srgb,var(--semantic-success)_16%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-success)_05%,var(--semantic-surface))] py-10 md:py-12"
      data-testid="section-pricing-subscription-faq"
    >
      <div className="mx-auto max-w-3xl px-4 sm:px-0">
        <FadeUp whenInView once viewMargin="-28px" className="mb-6 text-center">
          <div className="mx-auto mb-3 flex justify-center">
            <span
              className="inline-flex items-center gap-2 rounded-full border border-[color-mix(in_srgb,var(--semantic-success)_28%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-success)_10%,var(--semantic-surface))] px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-[var(--role-success-foreground,var(--semantic-success))]"
            >
              <Shield className="h-3.5 w-3.5" aria-hidden />
              {t("pages.pricing.subscriptionFaq.eyebrow")}
            </span>
          </div>
          <h2 id="pricing-subscription-faq-heading" className="nn-marketing-h2 text-balance text-[var(--semantic-text-primary)]">
            {t("pages.pricing.subscriptionFaq.heading")}
          </h2>
          <p className="nn-marketing-body-sm mx-auto mt-2 max-w-xl text-[var(--semantic-text-secondary)]">
            {t("pages.pricing.subscriptionFaq.subheading")}
          </p>
        </FadeUp>

        <div className="space-y-2">
          {PAIRS.map((n) => (
            <details
              key={n}
              className="nn-pricing-faq-card group rounded-xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] px-4 py-3.5 shadow-[var(--elevation-rest)]"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-3 text-left marker:content-none [&::-webkit-details-marker]:hidden">
                <span className="text-sm font-semibold text-[var(--semantic-text-primary)]">
                  {t(`pages.pricing.subscriptionFaq.q${n}`)}
                </span>
                <ChevronDown
                  className="h-4 w-4 shrink-0 text-[var(--semantic-text-muted)] transition group-open:rotate-180"
                  aria-hidden
                />
              </summary>
              <p className="nn-marketing-body-sm mt-3 border-t border-[var(--semantic-border-soft)] pt-3 text-[var(--semantic-text-secondary)]">
                {t(`pages.pricing.subscriptionFaq.a${n}`)}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
