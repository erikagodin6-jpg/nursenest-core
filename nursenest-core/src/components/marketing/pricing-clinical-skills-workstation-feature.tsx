"use client";

import { ClipboardCheck, HeartPulse, ShieldAlert, Stethoscope, Syringe, Timer } from "lucide-react";
import { useMarketingI18n } from "@/lib/marketing-i18n";
import { MarketingProductProofBand } from "@/components/marketing/marketing-product-proof-band";
import { marketingProofFromCoreKey } from "@/lib/marketing/marketing-proof-screenshots";

const BULLETS = [
  { key: "pages.pricing.clinicalSkillsWorkstation.bullet1", Icon: HeartPulse },
  { key: "pages.pricing.clinicalSkillsWorkstation.bullet2", Icon: Syringe },
  { key: "pages.pricing.clinicalSkillsWorkstation.bullet3", Icon: Stethoscope },
  { key: "pages.pricing.clinicalSkillsWorkstation.bullet4", Icon: ShieldAlert },
  { key: "pages.pricing.clinicalSkillsWorkstation.bullet5", Icon: ClipboardCheck },
  { key: "pages.pricing.clinicalSkillsWorkstation.bullet6", Icon: Timer },
] as const;

export function PricingClinicalSkillsWorkstationFeature() {
  const { t } = useMarketingI18n();

  return (
    <section
      aria-labelledby="pricing-clinical-skills-workstation-heading"
      className="scroll-mt-20 rounded-2xl border border-[color-mix(in_srgb,var(--semantic-chart-1)_22%,var(--semantic-border-soft))] bg-[linear-gradient(165deg,color-mix(in_srgb,var(--semantic-panel-warm)_45%,var(--semantic-surface)),var(--semantic-surface))] px-5 py-10 shadow-[var(--semantic-shadow-soft)] md:px-8 md:py-12"
      data-testid="section-pricing-clinical-skills-workstation"
    >
      <div className="mx-auto max-w-3xl text-center">
        <p className="text-xs font-semibold tracking-wide text-[color-mix(in_srgb,var(--semantic-chart-1)_88%,var(--semantic-text-primary))]">
          {t("pages.pricing.clinicalSkillsWorkstation.eyebrow")}
        </p>
        <h2 id="pricing-clinical-skills-workstation-heading" className="nn-marketing-h2 mt-2 text-balance text-[var(--semantic-text-primary)]">
          {t("pages.pricing.clinicalSkillsWorkstation.title")}
        </h2>
        <p className="nn-marketing-body-sm mx-auto mt-3 max-w-2xl text-[var(--semantic-text-secondary)]">
          {t("pages.pricing.clinicalSkillsWorkstation.lead")}
        </p>
      </div>

      <ul className="mx-auto mt-8 grid max-w-4xl gap-3 sm:grid-cols-2">
        {BULLETS.map(({ key, Icon }, i) => {
          const hue =
            i % 3 === 0 ? "var(--semantic-chart-1)" : i % 3 === 1 ? "var(--semantic-info)" : "var(--semantic-success)";
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

      <div className="mx-auto mt-8 max-w-4xl">
        <MarketingProductProofBand
          shot={marketingProofFromCoreKey("lesson-detail", {
            alt: "Clinical skills lesson with competency progression and safety checkpoints",
            theme: "blossom",
          })}
        />
      </div>

      <p className="nn-marketing-body-sm mx-auto mt-8 max-w-2xl text-center text-[var(--semantic-text-muted)]">
        {t("pages.pricing.clinicalSkillsWorkstation.footer")}
      </p>
    </section>
  );
}
