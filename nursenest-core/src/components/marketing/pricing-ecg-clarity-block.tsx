"use client";

import { Waves } from "lucide-react";
import { useMarketingI18n } from "@/lib/marketing-i18n";
import { FadeUp } from "@/lib/motion";

/**
 * Distinguishes integrated Core ECG learning from the future Advanced ECG premium line — no entitlement overclaims.
 */
export function PricingEcgClarityBlock() {
  const { t } = useMarketingI18n();

  return (
    <section
      aria-labelledby="pricing-ecg-clarity-heading"
      className="scroll-mt-20"
      data-testid="section-pricing-ecg-clarity"
    >
      <FadeUp whenInView once viewMargin="-28px" className="text-center">
        <div className="mx-auto mb-3 flex justify-center text-[var(--semantic-info)]">
          <Waves className="h-6 w-6" aria-hidden />
        </div>
        <p className="text-xs font-semibold uppercase tracking-wide text-[var(--semantic-brand)]">
          {t("pages.pricing.ecg.eyebrow")}
        </p>
        <h2 id="pricing-ecg-clarity-heading" className="nn-marketing-h2 mt-2 text-balance text-[var(--semantic-text-primary)]">
          {t("pages.pricing.ecg.title")}
        </h2>
      </FadeUp>

      <div className="mt-8 grid gap-5 md:grid-cols-2 md:gap-6">
        <div
          className="rounded-2xl border border-[color-mix(in_srgb,var(--semantic-success)_24%,var(--semantic-border-soft))] bg-[var(--semantic-panel-positive)] p-6"
          role="region"
          aria-label={t("pages.pricing.ecg.core.title")}
        >
          <h3 className="text-lg font-semibold text-[var(--semantic-text-primary)]">{t("pages.pricing.ecg.core.title")}</h3>
          <p className="mt-3 text-sm leading-relaxed text-[var(--semantic-text-secondary)]">{t("pages.pricing.ecg.core.body")}</p>
        </div>
        <div
          className="rounded-2xl border border-[color-mix(in_srgb,var(--semantic-warning)_26%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-warning)_10%,var(--semantic-surface))] p-6"
          role="region"
          aria-label={t("pages.pricing.ecg.advanced.title")}
        >
          <h3 className="text-lg font-semibold text-[var(--semantic-text-primary)]">{t("pages.pricing.ecg.advanced.title")}</h3>
          <p className="mt-3 text-sm leading-relaxed text-[var(--semantic-text-secondary)]">{t("pages.pricing.ecg.advanced.body")}</p>
        </div>
      </div>
    </section>
  );
}
