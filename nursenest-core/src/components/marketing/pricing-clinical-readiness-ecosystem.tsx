"use client";

import { Activity, Beaker, BookOpen, HeartPulse, Pill, Stethoscope } from "lucide-react";
import { useMarketingI18n } from "@/lib/marketing-i18n";
import { FadeUp, StaggerGroup, StaggerItem } from "@/lib/motion";

const BULLET_ICONS = [BookOpen, HeartPulse, Activity, Beaker, Pill, Stethoscope] as const;
const BULLET_KEYS = [
  "pages.pricing.ecosystem.bullet1",
  "pages.pricing.ecosystem.bullet2",
  "pages.pricing.ecosystem.bullet3",
  "pages.pricing.ecosystem.bullet4",
  "pages.pricing.ecosystem.bullet5",
  "pages.pricing.ecosystem.bullet6",
] as const;

/**
 * High-level, entitlement-safe description of how exam prep connects to clinical readiness modules.
 */
export function PricingClinicalReadinessEcosystem() {
  const { t } = useMarketingI18n();

  return (
    <section
      aria-labelledby="pricing-ecosystem-heading"
      className="scroll-mt-20 rounded-2xl border border-[color-mix(in_srgb,var(--semantic-brand)_18%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-panel-cool)_65%,var(--semantic-surface))] px-5 py-10 shadow-[var(--semantic-shadow-soft)] md:px-8 md:py-12"
      data-testid="section-pricing-clinical-readiness"
    >
      <FadeUp whenInView once viewMargin="-28px" className="mx-auto max-w-3xl text-center">
        <p className="text-xs font-semibold uppercase tracking-wide text-[var(--semantic-brand)]">
          {t("pages.pricing.ecosystem.eyebrow")}
        </p>
        <h2 id="pricing-ecosystem-heading" className="nn-marketing-h2 mt-2 text-balance text-[var(--semantic-text-primary)]">
          {t("pages.pricing.ecosystem.title")}
        </h2>
        <p className="nn-marketing-body-sm mx-auto mt-3 max-w-2xl text-[var(--semantic-text-secondary)]">
          {t("pages.pricing.ecosystem.lead")}
        </p>
      </FadeUp>

      <StaggerGroup
        className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5"
        staggerMs={55}
        whenInView
        once
      >
        {BULLET_KEYS.map((key, i) => {
          const Icon = BULLET_ICONS[i] ?? BookOpen;
          const hue =
            i % 4 === 0
              ? "var(--semantic-info)"
              : i % 4 === 1
                ? "var(--semantic-success)"
                : i % 4 === 2
                  ? "var(--semantic-warning)"
                  : "var(--semantic-chart-3)";
          return (
            <StaggerItem key={key} variant="softReveal">
              <div
                className="nn-elevation-panel flex h-full gap-3 rounded-xl border p-4 text-left"
                style={{
                  borderColor: `color-mix(in srgb, ${hue} 22%, var(--semantic-border-soft))`,
                  background: `color-mix(in srgb, ${hue} 7%, var(--semantic-surface))`,
                }}
              >
                <div
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg"
                  style={{
                    background: `color-mix(in srgb, ${hue} 14%, var(--semantic-surface))`,
                    border: `1px solid color-mix(in srgb, ${hue} 28%, var(--semantic-border-soft))`,
                  }}
                >
                  <Icon className="h-5 w-5" style={{ color: hue }} aria-hidden />
                </div>
                <p className="text-sm leading-snug text-[var(--semantic-text-primary)]">{t(key)}</p>
              </div>
            </StaggerItem>
          );
        })}
      </StaggerGroup>

      <p className="nn-marketing-body-sm mx-auto mt-8 max-w-2xl text-center text-[var(--semantic-text-muted)]">
        {t("pages.pricing.ecosystem.footer")}
      </p>
    </section>
  );
}
