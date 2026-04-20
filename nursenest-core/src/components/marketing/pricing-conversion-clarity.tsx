"use client";

import Link from "next/link";
import { Ban, Check, CreditCard, Lock, ShieldCheck, Sparkles, X } from "lucide-react";
import { useMarketingI18n } from "@/lib/marketing-i18n";
import { withMarketingLocale } from "@/lib/i18n/marketing-path";
import { FadeUp, StaggerGroup, StaggerItem } from "@/lib/motion";

const VALUE_ACCENTS = [
  "var(--semantic-success)",
  "var(--semantic-info)",
  "var(--semantic-brand)",
] as const;

/**
 * High-intent clarity: what you pay for, what is / isn’t included, payment safety, post-checkout expectations.
 *
 * All `pages.pricing.conversionClarity.*` keys used here are listed in
 * `scripts/contracts/pricing-conversion-clarity-keys.json` and validated at build time
 * (`scripts/validate-marketing-production-surface.mjs`).
 */
export function PricingConversionClarity() {
  const { t, locale } = useMarketingI18n();
  const refundHref = withMarketingLocale(locale, "/refund-policy");
  const termsHref = withMarketingLocale(locale, "/terms");

  const valueRows = [
    { titleKey: "pages.pricing.conversionClarity.value1Title", bodyKey: "pages.pricing.conversionClarity.value1Body" },
    { titleKey: "pages.pricing.conversionClarity.value2Title", bodyKey: "pages.pricing.conversionClarity.value2Body" },
    { titleKey: "pages.pricing.conversionClarity.value3Title", bodyKey: "pages.pricing.conversionClarity.value3Body" },
  ] as const;

  const includedKeys = [
    "pages.pricing.conversionClarity.included1",
    "pages.pricing.conversionClarity.included2",
    "pages.pricing.conversionClarity.included3",
    "pages.pricing.conversionClarity.included4",
    "pages.pricing.conversionClarity.included5",
  ] as const;

  const notIncludedKeys = [
    "pages.pricing.conversionClarity.notIncluded1",
    "pages.pricing.conversionClarity.notIncluded2",
    "pages.pricing.conversionClarity.notIncluded3",
  ] as const;

  const reassurance = [
    {
      icon: Ban,
      titleKey: "pages.pricing.conversionClarity.reassureCancelTitle",
      bodyKey: "pages.pricing.conversionClarity.reassureCancelBody",
      accent: "var(--semantic-chart-3)",
    },
    {
      icon: CreditCard,
      titleKey: "pages.pricing.conversionClarity.reassureFeesTitle",
      bodyKey: "pages.pricing.conversionClarity.reassureFeesBody",
      accent: "var(--semantic-warning)",
    },
    {
      icon: Lock,
      titleKey: "pages.pricing.conversionClarity.reassureSecureTitle",
      bodyKey: "pages.pricing.conversionClarity.reassureSecureBody",
      accent: "var(--semantic-success)",
    },
  ] as const;

  return (
    <section
      aria-labelledby="pricing-conversion-clarity-heading"
      className="scroll-mt-20 space-y-10"
      data-testid="section-pricing-conversion-clarity"
    >
      <FadeUp whenInView once viewMargin="-32px" className="mx-auto max-w-3xl text-center">
        <p className="text-xs font-semibold uppercase tracking-wide text-[var(--semantic-brand)]">
          {t("pages.pricing.conversionClarity.eyebrow")}
        </p>
        <h2 id="pricing-conversion-clarity-heading" className="nn-marketing-h2 mt-2 text-balance">
          {t("pages.pricing.conversionClarity.heading")}
        </h2>
        <p className="nn-marketing-body-sm mx-auto mt-3 max-w-2xl text-[var(--semantic-text-secondary)]">
          {t("pages.pricing.conversionClarity.intro")}
        </p>
      </FadeUp>

      {/* Value breakdown */}
      <StaggerGroup className="grid gap-4 md:grid-cols-3" whenInView once viewMargin="-28px">
        {valueRows.map((row, i) => (
          <StaggerItem key={row.titleKey} variant="fadeUp">
            <div
              className="nn-elevation-panel h-full rounded-2xl border p-5"
              style={{
                borderColor: `color-mix(in srgb, ${VALUE_ACCENTS[i % VALUE_ACCENTS.length]} 22%, var(--semantic-border-soft))`,
                background: `color-mix(in srgb, ${VALUE_ACCENTS[i % VALUE_ACCENTS.length]} 6%, var(--semantic-surface))`,
              }}
            >
              <Sparkles className="h-5 w-5" style={{ color: VALUE_ACCENTS[i % VALUE_ACCENTS.length] }} aria-hidden />
              <h3 className="nn-marketing-h4 mt-3 text-[var(--semantic-text-primary)]">{t(row.titleKey)}</h3>
              <p className="mt-2 text-sm leading-relaxed text-[var(--semantic-text-secondary)]">{t(row.bodyKey)}</p>
            </div>
          </StaggerItem>
        ))}
      </StaggerGroup>

      {/* Included vs not */}
      <div className="grid gap-6 lg:grid-cols-2">
        <div
          className="rounded-2xl border border-[color-mix(in_srgb,var(--semantic-success)_24%,var(--semantic-border-soft))] bg-[var(--semantic-panel-positive)] p-6"
          aria-labelledby="pricing-included-heading"
        >
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-[var(--semantic-success)]" aria-hidden />
            <h3 id="pricing-included-heading" className="text-lg font-semibold text-[var(--semantic-text-primary)]">
              {t("pages.pricing.conversionClarity.includedHeading")}
            </h3>
          </div>
          <ul className="mt-4 space-y-2.5">
            {includedKeys.map((key) => (
              <li key={key} className="flex gap-2.5 text-sm text-[var(--semantic-text-primary)]">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-[var(--semantic-success)]" aria-hidden />
                <span>{t(key)}</span>
              </li>
            ))}
          </ul>
        </div>
        <div
          className="rounded-2xl border border-[color-mix(in_srgb,var(--semantic-warning)_22%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-warning)_07%,var(--semantic-surface))] p-6"
          aria-labelledby="pricing-not-included-heading"
        >
          <div className="flex items-center gap-2">
            <X className="h-5 w-5 text-[var(--semantic-warning)]" aria-hidden />
            <h3 id="pricing-not-included-heading" className="text-lg font-semibold text-[var(--semantic-text-primary)]">
              {t("pages.pricing.conversionClarity.notIncludedHeading")}
            </h3>
          </div>
          <p className="mt-1 text-xs text-[var(--semantic-text-secondary)]">{t("pages.pricing.conversionClarity.notIncludedLead")}</p>
          <ul className="mt-3 space-y-2.5">
            {notIncludedKeys.map((key) => (
              <li key={key} className="flex gap-2.5 text-sm text-[var(--semantic-text-secondary)]">
                <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[color-mix(in_srgb,var(--semantic-warning)_18%,var(--semantic-surface))]" aria-hidden>
                  <span className="h-1.5 w-1.5 rounded-full bg-[var(--semantic-warning)]" />
                </span>
                <span>{t(key)}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Reassurance */}
      <div className="grid gap-4 sm:grid-cols-3">
        {reassurance.map(({ icon: Icon, titleKey, bodyKey, accent }) => (
          <div
            key={titleKey}
            className="rounded-xl border border-[color-mix(in_srgb,var(--semantic-border-soft)_1,var(--border))] bg-[var(--semantic-surface)] p-4 text-center shadow-[var(--elevation-rest)]"
          >
            <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-lg" style={{ background: `color-mix(in srgb, ${accent} 14%, var(--semantic-surface))` }}>
              <Icon className="h-5 w-5" style={{ color: accent }} aria-hidden />
            </div>
            <p className="mt-2 text-sm font-semibold text-[var(--semantic-text-primary)]">{t(titleKey)}</p>
            <p className="mt-1 text-xs leading-relaxed text-[var(--semantic-text-secondary)]">{t(bodyKey)}</p>
          </div>
        ))}
      </div>

      {/* Objections */}
      <div className="grid gap-5 md:grid-cols-2">
        <div className="rounded-2xl border border-[color-mix(in_srgb,var(--semantic-info)_22%,var(--semantic-border-soft))] bg-[var(--semantic-panel-cool)] p-6">
          <h3 className="text-base font-semibold text-[var(--semantic-text-primary)]">{t("pages.pricing.conversionClarity.worthItQuestion")}</h3>
          <p className="mt-2 text-sm leading-relaxed text-[var(--semantic-text-secondary)]">{t("pages.pricing.conversionClarity.worthItAnswer")}</p>
        </div>
        <div className="rounded-2xl border border-[color-mix(in_srgb,var(--semantic-brand)_20%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-brand)_06%,var(--semantic-surface))] p-6">
          <h3 className="text-base font-semibold text-[var(--semantic-text-primary)]">{t("pages.pricing.conversionClarity.afterPayQuestion")}</h3>
          <p className="mt-2 text-sm leading-relaxed text-[var(--semantic-text-secondary)]">{t("pages.pricing.conversionClarity.afterPayAnswer")}</p>
          <p className="mt-3 text-xs text-[var(--semantic-text-secondary)]">
            <Link href={refundHref} className="font-semibold text-[var(--semantic-brand)] underline-offset-2 hover:underline">
              {t("pages.pricing.conversionClarity.afterPayRefundLink")}
            </Link>
            {t("pages.pricing.conversionClarity.afterPayRefundSuffix")}
            <Link href={termsHref} className="font-semibold text-[var(--semantic-brand)] underline-offset-2 hover:underline">
              {t("pages.pricing.conversionClarity.afterPayTermsLink")}
            </Link>
            {t("pages.pricing.conversionClarity.afterPayTermsSuffix")}
          </p>
        </div>
      </div>
    </section>
  );
}
