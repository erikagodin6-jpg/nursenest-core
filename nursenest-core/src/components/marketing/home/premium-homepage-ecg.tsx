"use client";

import { Activity, CheckCircle2, Sparkles } from "lucide-react";

import { MarketingTrackedLink } from "@/components/marketing/marketing-tracked-link";
import { MarketingHomepageEcgStripIllustration } from "@/components/marketing/home/premium-homepage-hero";
import { safeHomepageMarketingT, useMarketingI18n } from "@/lib/marketing-i18n";
import { PH } from "@/lib/observability/posthog-conversion-events";
import { formatSentenceCase, formatTitleCase } from "@/lib/format/text-case";
import {
  MARKETING_PRIMARY_CTA_CLASS,
  MARKETING_TERTIARY_LINK_CLASS,
} from "@/lib/theme/marketing-hero-pattern";

import { usePremiumHomepageRoutes } from "./premium-homepage-routes";

const CORE_FEATURES = [
  { key: "telemetry", fallback: "Telemetry interpretation — rhythm recognition at the bedside" },
  { key: "arrhythmia", fallback: "Arrhythmia recognition integrated with clinical reasoning" },
  { key: "strips", fallback: "Rhythm strip analysis with mechanism-based rationales" },
  { key: "waveform", fallback: "Waveform literacy built into your NCLEX/CNPLE study loop" },
] as const;

const ADVANCED_TEASERS = [
  { key: "lead12", fallback: "12-lead ECG interpretation & axis analysis" },
  { key: "icu", fallback: "ICU telemetry & deterioration recognition scenarios" },
  { key: "advancedStemi", fallback: "Advanced STEMI localization & ischemia patterns" },
] as const;

/**
 * Homepage marketing: **Core ECG** (integrated nursing telemetry education) +
 * **Advanced ECG & Telemetry Mastery** teaser (separate future premium program — not bundled).
 */
export function PremiumHomepageEcg() {
  const { hrefs, region } = usePremiumHomepageRoutes();
  const { t, locale } = useMarketingI18n();
  const tr = (key: string, fallback: string) => safeHomepageMarketingT(t, key, fallback);

  return (
    <section
      className="nn-premium-home-section nn-premium-home-section--ecg nn-marketing-brand-leaf-band border-b border-[var(--border-subtle)]"
      aria-labelledby="premium-home-ecg-core-heading"
      data-testid="section-premium-home-ecg"
    >
      <div className="nn-section-shell">
        <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-12">
          {/* Core ECG — integrated capability */}
          <div className="min-w-0">
            <p className="nn-premium-home-eyebrow">
              {formatTitleCase(tr("pages.home.premium.ecg.coreEyebrow", "ECG Interpretation & Telemetry Training"), locale)}
            </p>
            <h2
              id="premium-home-ecg-core-heading"
              className="nn-marketing-h2 mt-4 text-balance text-[var(--palette-heading)]"
            >
              {formatTitleCase(
                tr(
                  "pages.home.premium.ecg.coreHeading",
                  "Learn ECG Interpretation, Telemetry Monitoring, and Arrhythmia Recognition.",
                ),
                locale,
              )}
            </h2>
            <p className="nn-marketing-body mt-3 max-w-xl text-pretty text-[var(--palette-text-muted)]">
              {formatSentenceCase(
                tr(
                  "pages.home.premium.ecg.coreBody",
                  "Interactive waveform-based clinical training for rhythm strip interpretation, telemetry monitoring, and arrhythmia recognition — built into your NurseNest study loop for RN and NP learners.",
                ),
                locale,
              )}
            </p>

            <ul className="mt-6 grid gap-3 sm:grid-cols-2" aria-label={tr("pages.home.premium.ecg.coreFeaturesLabel", "Core ECG highlights")}>
              {CORE_FEATURES.map((item) => (
                <li key={item.key} className="flex gap-2 text-sm text-[var(--palette-text-muted)]">
                  <CheckCircle2
                    className="mt-0.5 h-4 w-4 shrink-0 text-[var(--semantic-info)]"
                    aria-hidden
                  />
                  <span>{tr(`pages.home.premium.ecg.coreFeatures.${item.key}`, item.fallback)}</span>
                </li>
              ))}
            </ul>

            <div className="nn-premium-hero-ecg mt-8 max-w-lg">
              <div className="nn-premium-hero-ecg__row">
                <span>{tr("pages.home.premium.ecg.stripLabel", "Lead II · Normal Sinus Rhythm")}</span>
                <span className="nn-premium-hero-ecg__bpm">{tr("pages.home.premium.ecg.stripBpm", "72 bpm")}</span>
              </div>
              <MarketingHomepageEcgStripIllustration
                ariaLabel={tr("pages.home.premium.ecg.stripAria", "Illustrative sinus rhythm strip for marketing")}
              />
            </div>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <MarketingTrackedLink
                href="/ecg-interpretation"
                event={PH.marketingHomeExploreHubClick}
                eventProps={{ region, surface: "premium_home_ecg", lane: "core", choice: "ecg_interpretation" }}
                className={MARKETING_PRIMARY_CTA_CLASS}
                data-testid="premium-ecg-core-interpretation"
              >
                {tr("pages.home.premium.ecg.coreCtaInterpretation", "Start ECG Interpretation")}
              </MarketingTrackedLink>
              <MarketingTrackedLink
                href="/ecg-practice-questions"
                event={PH.marketingHomeExploreHubClick}
                eventProps={{ region, surface: "premium_home_ecg", lane: "core", choice: "ecg_practice" }}
                className={MARKETING_TERTIARY_LINK_CLASS}
                data-testid="premium-ecg-core-practice"
              >
                {tr("pages.home.premium.ecg.coreCtaPractice", "Practice rhythm recognition")}
              </MarketingTrackedLink>
            </div>
            <p className="nn-marketing-body-sm mt-4 max-w-xl text-pretty text-[var(--palette-text-muted)]">
              {tr(
                "pages.home.premium.ecg.coreFootnote",
                "ECG interpretation training is integrated with your RN/NP study pathway — rhythm strips, adaptive drills, and telemetry practice tied to your clinical weak areas.",
              )}
            </p>
          </div>

          {/* Advanced program — separate premium vertical (teaser only) */}
          <aside
            className="nn-premium-ecg-advanced relative min-w-0 overflow-hidden rounded-2xl border border-[color-mix(in_srgb,var(--semantic-chart-3)_35%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-chart-3)_09%,var(--semantic-surface))] p-6 sm:p-7 shadow-[var(--shadow-card)]"
            aria-labelledby="premium-home-ecg-advanced-heading"
            data-testid="premium-ecg-advanced-teaser"
          >
            <div
              className="pointer-events-none absolute inset-0 opacity-[0.14]"
              aria-hidden
              style={{
                background:
                  "radial-gradient(120% 80% at 90% 10%, color-mix(in srgb, var(--semantic-chart-1) 55%, transparent), transparent 55%)",
              }}
            />
            <div className="relative">
              <p className="inline-flex items-center gap-1.5 rounded-full border border-[color-mix(in_srgb,var(--semantic-warning)_40%,transparent)] bg-[color-mix(in_srgb,var(--semantic-warning)_12%,var(--semantic-surface))] px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-[var(--semantic-warning-contrast)]">
                <Sparkles className="h-3.5 w-3.5" aria-hidden />
                {tr("pages.home.premium.ecg.advancedBadge", "Add-On Module")}
              </p>
              <h3
                id="premium-home-ecg-advanced-heading"
                className="nn-marketing-h3 mt-5 text-balance text-[var(--palette-heading)]"
              >
                {tr("pages.home.premium.ecg.advancedHeading", "Advanced ECG Interpretation for Critical Care")}
              </h3>
              <p className="nn-marketing-body-sm mt-3 text-pretty text-[var(--palette-text-muted)]">
                {tr(
                  "pages.home.premium.ecg.advancedBody",
                  "Deep ECG interpretation for ICU, CCU, ER, and telemetry nurses: STEMI localization, advanced arrhythmia recognition, pacemaker interpretation, electrolyte ECG changes, and critical care telemetry scenarios.",
                )}
              </p>
              <ul className="mt-5 space-y-2 text-sm text-[var(--palette-text-muted)]">
                {ADVANCED_TEASERS.map((item) => (
                  <li key={item.key} className="flex gap-2">
                    <Activity className="mt-0.5 h-4 w-4 shrink-0 text-[var(--semantic-chart-3)]" aria-hidden />
                    <span>{tr(`pages.home.premium.ecg.advancedTeasers.${item.key}`, item.fallback)}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-6 flex flex-wrap gap-3">
                <MarketingTrackedLink
                  href="/advanced-ecg-nursing"
                  event={PH.marketingHomeExploreHubClick}
                  eventProps={{ region, surface: "premium_home_ecg", lane: "advanced_teaser", choice: "module" }}
                  className={`${MARKETING_TERTIARY_LINK_CLASS} inline-flex`}
                  data-testid="premium-ecg-advanced-module"
                >
                  {tr("pages.home.premium.ecg.advancedCtaModule", "Advanced ECG Interpretation")}
                </MarketingTrackedLink>
                <MarketingTrackedLink
                  href={hrefs.pricing}
                  event={PH.marketingHomeExploreHubClick}
                  eventProps={{ region, surface: "premium_home_ecg", lane: "advanced_teaser", choice: "pricing" }}
                  className={`${MARKETING_TERTIARY_LINK_CLASS} inline-flex`}
                  data-testid="premium-ecg-advanced-pricing"
                >
                  {tr("pages.home.premium.ecg.advancedCta", "View add-on pricing")}
                </MarketingTrackedLink>
              </div>
              <p className="nn-marketing-caption mt-4 border-t border-[var(--semantic-border-soft)] pt-4 text-[var(--palette-text-muted)]">
                {tr(
                  "pages.home.premium.ecg.advancedDisclaimer",
                  "Advanced ECG & Telemetry Mastery is a separate paid add-on and is not included with standard RN/PN/NP/allied subscriptions.",
                )}
              </p>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
