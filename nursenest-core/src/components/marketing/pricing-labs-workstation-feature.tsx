"use client";

import { Activity, Beaker, FlaskConical, LineChart, ShieldAlert } from "lucide-react";
import { useMarketingI18n } from "@/lib/marketing-i18n";

const BULLETS = [
  { key: "pages.pricing.labsWorkstation.bullet1", Icon: Beaker },
  { key: "pages.pricing.labsWorkstation.bullet2", Icon: ShieldAlert },
  { key: "pages.pricing.labsWorkstation.bullet3", Icon: LineChart },
  { key: "pages.pricing.labsWorkstation.bullet4", Icon: FlaskConical },
  { key: "pages.pricing.labsWorkstation.bullet5", Icon: Activity },
] as const;

/**
 * Flagship Labs workstation positioning on pricing — entitlement-safe copy.
 */
export function PricingLabsWorkstationFeature() {
  const { t } = useMarketingI18n();

  return (
    <section
      aria-labelledby="pricing-labs-workstation-heading"
      className="scroll-mt-20 rounded-2xl border border-[color-mix(in_srgb,var(--semantic-info)_22%,var(--semantic-border-soft))] bg-[linear-gradient(165deg,color-mix(in_srgb,var(--semantic-panel-cool)_55%,var(--semantic-surface)),var(--semantic-surface))] px-5 py-10 shadow-[var(--semantic-shadow-soft)] md:px-8 md:py-12"
      data-testid="section-pricing-labs-workstation"
    >
      <div className="mx-auto max-w-3xl text-center">
        <p className="text-xs font-semibold uppercase tracking-wide text-[var(--semantic-info)]">
          {t("pages.pricing.labsWorkstation.eyebrow")}
        </p>
        <h2 id="pricing-labs-workstation-heading" className="nn-marketing-h2 mt-2 text-balance text-[var(--semantic-text-primary)]">
          {t("pages.pricing.labsWorkstation.title")}
        </h2>
        <p className="nn-marketing-body-sm mx-auto mt-3 max-w-2xl text-[var(--semantic-text-secondary)]">
          {t("pages.pricing.labsWorkstation.lead")}
        </p>
      </div>

      <ul className="mx-auto mt-8 grid max-w-4xl gap-3 sm:grid-cols-2">
        {BULLETS.map(({ key, Icon }, i) => {
          const hue =
            i % 3 === 0 ? "var(--semantic-info)" : i % 3 === 1 ? "var(--semantic-success)" : "var(--semantic-warning)";
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
        {t("pages.pricing.labsWorkstation.footer")}
      </p>
    </section>
  );
}
