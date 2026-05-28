"use client";

import { Calculator, Droplets, Gauge, ShieldAlert, Syringe, Timer } from "lucide-react";
import { useMarketingI18n } from "@/lib/marketing-i18n";

const BULLETS = [
  { key: "pages.pricing.medCalcWorkstation.bullet1", Icon: Calculator },
  { key: "pages.pricing.medCalcWorkstation.bullet2", Icon: Syringe },
  { key: "pages.pricing.medCalcWorkstation.bullet3", Icon: Droplets },
  { key: "pages.pricing.medCalcWorkstation.bullet4", Icon: Gauge },
  { key: "pages.pricing.medCalcWorkstation.bullet5", Icon: Timer },
  { key: "pages.pricing.medCalcWorkstation.bullet6", Icon: ShieldAlert },
] as const;

export function PricingMedCalcWorkstationFeature() {
  const { t } = useMarketingI18n();

  return (
    <section
      aria-labelledby="pricing-med-calc-workstation-heading"
      className="scroll-mt-20 rounded-2xl border border-[color-mix(in_srgb,var(--semantic-chart-5)_22%,var(--semantic-border-soft))] bg-[linear-gradient(165deg,color-mix(in_srgb,var(--semantic-panel-warm)_40%,var(--semantic-surface)),var(--semantic-surface))] px-5 py-10 shadow-[var(--semantic-shadow-soft)] md:px-8 md:py-12"
      data-testid="section-pricing-med-calc-workstation"
    >
      <div className="mx-auto max-w-3xl text-center">
        <p className="text-xs font-semibold tracking-wide text-[color-mix(in_srgb,var(--semantic-chart-5)_88%,var(--semantic-text-primary))]">
          {t("pages.pricing.medCalcWorkstation.eyebrow")}
        </p>
        <h2 id="pricing-med-calc-workstation-heading" className="nn-marketing-h2 mt-2 text-balance text-[var(--semantic-text-primary)]">
          {t("pages.pricing.medCalcWorkstation.title")}
        </h2>
        <p className="nn-marketing-body-sm mx-auto mt-3 max-w-2xl text-[var(--semantic-text-secondary)]">
          {t("pages.pricing.medCalcWorkstation.lead")}
        </p>
      </div>

      <ul className="mx-auto mt-8 grid max-w-4xl gap-3 sm:grid-cols-2">
        {BULLETS.map(({ key, Icon }, i) => {
          const hue =
            i % 3 === 0 ? "var(--semantic-chart-5)" : i % 3 === 1 ? "var(--semantic-warning)" : "var(--semantic-info)";
          return (
            <li
              key={key}
              className="flex gap-3 rounded-xl border p-4 text-left"
              style={{
                borderColor: `color-mix(in srgb, ${hue} 22%, var(--semantic-border-soft))`,
                background: `color-mix(in srgb, ${hue} 6%, var(--semantic-surface))`,
              }}
            >
              <div
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg"
                style={{
                  background: `color-mix(in srgb, ${hue} 12%, var(--semantic-surface))`,
                  border: `1px solid color-mix(in srgb, ${hue} 28%, var(--semantic-border-soft))`,
                }}
              >
                <Icon className="h-5 w-5" style={{ color: hue }} aria-hidden />
              </div>
              <p className="text-sm leading-snug text-[var(--semantic-text-primary)]">{t(key)}</p>
            </li>
          );
        })}
      </ul>

      <p className="nn-marketing-body-sm mx-auto mt-8 max-w-2xl text-center text-[var(--semantic-text-muted)]">
        {t("pages.pricing.medCalcWorkstation.footer")}
      </p>
    </section>
  );
}
