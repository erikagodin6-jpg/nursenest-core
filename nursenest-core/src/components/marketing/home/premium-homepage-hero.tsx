"use client";

/**
 * Premium homepage hero (Phase 4) — replaces the visual treatment of the
 * existing `HomeConversionHero` on the live public homepage.
 *
 * What this preserves (and intentionally does not change):
 *   - i18n keys for the existing copy column. Headline + sub use new
 *     premium-only keys (`*.headlinePremium`, `*.subheadingPremium`) so
 *     existing translations of `pages.home.hero.headline` /
 *     `pages.home.hero.subheading` are not silently overwritten.
 *   - CTA destinations (HUB.questionBank for primary, HUB.examLessons for
 *     secondary), analytics events (PH.marketingHomeHeroPrimaryCta /
 *     SecondaryCta), region + locale wiring, fallback paths, ShieldCheck
 *     trust line, and the dynamic `q questions · lessons` stats line.
 *   - The outer wrapper class `nn-home-marketing-rich-hero` so the
 *     production CSS in `src/app/premium-redesign-2026.css` (already
 *     imported by `globals.css`) styles this hero with no new CSS.
 *
 * What is new:
 *   - A 2-column premium-hero-grid layout on lg+, mobile stacks naturally.
 *   - Right-side clinical dashboard panel composed of:
 *       * Illustrative sinus-style rhythm strip (inline SVG, educational only)
 *       * Readiness / streak / mastered semantic stat tiles
 *       * Two semantic mini lesson cards with mastery progress bars
 *   - Trust pills row directly under the CTAs.
 *
 * What this component intentionally does NOT do:
 *   - Render or modify any other homepage section (handled by Phase 5).
 *   - Touch SEO/JSON-LD/canonical/sitemap/robots/server pages.
 *   - Replace `HomeConversionHero` (kept in tree for emergency fallback).
 */

import { ArrowRight, BookMarked, Flame, ShieldCheck, Target } from "lucide-react";
import { safeHomepageMarketingT, useMarketingI18n } from "@/lib/marketing-i18n";
import { withMarketingLocale } from "@/lib/i18n/marketing-path";
import { HUB } from "@/lib/marketing/marketing-entry-routes";
import { useNursenestRegion } from "@/lib/region/use-nursenest-region";
import { MarketingTrackedLink } from "@/components/marketing/marketing-tracked-link";
import { PH } from "@/lib/observability/posthog-conversion-events";
import {
  MARKETING_PRIMARY_CTA_CLASS,
  MARKETING_SECONDARY_CTA_CLASS,
} from "@/lib/theme/marketing-hero-pattern";
import { formatSentenceCase, formatTitleCase } from "@/lib/format/text-case";

function safeLocale(locale?: string) {
  return locale || "en";
}
function safeRegion(r?: string) {
  return r || "CA";
}
function safePath(locale: string, path: string) {
  try {
    return withMarketingLocale(locale, path);
  } catch {
    return path;
  }
}

/** Thousands separators for hero statistics (matches active locale). */
function formatMarketingInteger(n: number, locale: string): string {
  try {
    const tag = locale.includes("_") ? locale.replace("_", "-") : locale;
    return new Intl.NumberFormat(tag, { maximumFractionDigits: 0, useGrouping: true }).format(n);
  } catch {
    return String(n);
  }
}

/** If translations omit interpolation, never surface raw `{{count}}` tokens in marketing UI. */
function stripMustachePlaceholders(value: string): string {
  if (!value.includes("{{")) return value;
  return value
    .replace(/\{\{[^}]+\}\}/g, "")
    .replace(/\s*·\s*·\s*/g, " · ")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Single-beat path for one RR interval — stylized Lead II–like NSR (upright P, narrow QRS, upright T).
 * Proportions are exaggerated for legibility at marketing scale; not for measurement or diagnosis.
 */
function singleNsrBeatPath(offset: number, baselineY: number, beatWidth: number): string {
  const y = baselineY;
  const o = offset;
  // Baseline → small rounded P → isoelectric PR → QRS (qR pattern) → ST → asymmetric T → baseline
  return [
    `M${o},${y}`,
    `L${o + 12},${y}`,
    `C${o + 16},${y} ${o + 18},${y - 4} ${o + 22},${y - 4.5}`,
    `C${o + 26},${y - 5} ${o + 30},${y} ${o + 34},${y}`,
    `L${o + 44},${y}`,
    `L${o + 46},${y + 2.5}`,
    `L${o + 48},${y}`,
    `L${o + 50},${y - 3}`,
    `L${o + 52},${y - 22}`,
    `L${o + 54},${y + 8}`,
    `L${o + 57},${y}`,
    `L${o + 62},${y}`,
    `C${o + 68},${y} ${o + 74},${y - 10} ${o + 82},${y - 2}`,
    `C${o + 90},${y + 4} ${o + 98},${y} ${o + 108},${y}`,
    `L${o + beatWidth},${y}`,
  ].join(" ");
}

function buildSinusRhythmPath(beats: number, beatWidth: number, baselineY: number): string {
  const parts: string[] = [];
  for (let b = 0; b < beats; b++) {
    parts.push(singleNsrBeatPath(b * beatWidth, baselineY, beatWidth));
  }
  return parts.join(" ");
}

/* ──────────────────────────────────────────────────────────────────
   Inline rhythm strip — educational / illustrative only (not diagnostic).
   Decorative NSR-style silhouette (Lead II–like): upright P, narrow QRS,
   upright T; rates/shapes are not calibrated. Not a substitute for
   clinical ECG interpretation. Static (no animation).
   ────────────────────────────────────────────────────────────────── */
/** Reusable illustrative NSR-style strip for homepage marketing (not diagnostic). */
export function MarketingHomepageEcgStripIllustration({ ariaLabel }: { ariaLabel: string }) {
  const beatW = 138;
  const beatCount = 3;
  const baseline = 46;
  const width = beatW * beatCount;
  const d = buildSinusRhythmPath(beatCount, beatW, baseline);
  return (
    <svg
      role="img"
      aria-label={ariaLabel}
      viewBox={`0 0 ${width} 72`}
      preserveAspectRatio="xMidYMid meet"
      className="nn-premium-hero-ecg__svg block w-full text-[var(--semantic-success)]"
      style={{ height: 52 }}
    >
      <g className="nn-premium-hero-ecg__trace">
        <path
          d={d}
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
        />
      </g>
    </svg>
  );
}

/* ──────────────────────────────────────────────────────────────────
   Clinical dashboard panel — uses the `.nn-premium-hero-panel*`
   class vocabulary already shipped in `premium-redesign-2026.css`.
   ────────────────────────────────────────────────────────────────── */
function HeroClinicalPanel({
  copy,
}: {
  copy: {
    panelTag: string;
    panelLive: string;
    readinessLabel: string;
    readinessValue: string;
    streakLabel: string;
    streakValue: string;
    masteredLabel: string;
    masteredValue: string;
    masteredUnit: string;
    ecgLabel: string;
    ecgBpm: string;
    mini1Title: string;
    mini1Sub: string;
    mini2Title: string;
    mini2Sub: string;
  };
}) {
  return (
    <aside
      className="nn-premium-hero-panel"
      aria-label="Illustrative readiness preview for marketing (not a live monitor)"
    >
      <header className="nn-premium-hero-panel__header">
        <span className="nn-premium-hero-panel__tag">{copy.panelTag}</span>
        <span className="nn-premium-hero-panel__live">{copy.panelLive}</span>
      </header>

      <div className="nn-premium-hero-stats">
        <div className="nn-premium-hero-stat nn-premium-hero-stat--readiness">
          <Target className="nn-premium-hero-stat__glyph" aria-hidden />
          <span className="nn-premium-hero-stat__label">{copy.readinessLabel}</span>
          <div className="nn-premium-hero-stat__figure">
            <span className="nn-premium-hero-stat__value">{copy.readinessValue}</span>
          </div>
        </div>
        <div className="nn-premium-hero-stat nn-premium-hero-stat--streak">
          <Flame className="nn-premium-hero-stat__glyph" aria-hidden />
          <span className="nn-premium-hero-stat__label">{copy.streakLabel}</span>
          <div className="nn-premium-hero-stat__figure">
            <span className="nn-premium-hero-stat__value">{copy.streakValue}</span>
          </div>
        </div>
        <div className="nn-premium-hero-stat nn-premium-hero-stat--mastery">
          <BookMarked className="nn-premium-hero-stat__glyph" aria-hidden />
          <span className="nn-premium-hero-stat__label">{copy.masteredLabel}</span>
          <div className="nn-premium-hero-stat__figure">
            <span className="nn-premium-hero-stat__value">{copy.masteredValue}</span>
            <span className="nn-premium-hero-stat__unit">{copy.masteredUnit}</span>
          </div>
        </div>
      </div>

      <div className="nn-premium-hero-ecg" aria-hidden={false}>
        <div className="nn-premium-hero-ecg__row">
          <span>{copy.ecgLabel}</span>
          <span className="nn-premium-hero-ecg__bpm">{copy.ecgBpm}</span>
        </div>
        <MarketingHomepageEcgStripIllustration ariaLabel={copy.ecgLabel} />
      </div>

      <div className="nn-premium-hero-mini">
        <div className="nn-premium-hero-mini__card" data-nn-hero-mini-topic="cardiovascular">
          <span className="nn-premium-hero-mini__title">{copy.mini1Title}</span>
          <span className="nn-premium-hero-mini__sub">{copy.mini1Sub}</span>
          <div className="nn-premium-hero-mini__bar nn-progress-track-semantic" aria-hidden>
            <span className="h-full rounded-full nn-progress-fill-semantic-readiness" style={{ width: "79%" }} />
          </div>
        </div>
        <div className="nn-premium-hero-mini__card" data-nn-hero-mini-topic="pharmacology">
          <span className="nn-premium-hero-mini__title">{copy.mini2Title}</span>
          <span className="nn-premium-hero-mini__sub">{copy.mini2Sub}</span>
          <div className="nn-premium-hero-mini__bar nn-progress-track-semantic" aria-hidden>
            <span className="h-full rounded-full nn-progress-fill-semantic-info" style={{ width: "54%" }} />
          </div>
        </div>
      </div>
    </aside>
  );
}

/* ──────────────────────────────────────────────────────────────────
   Premium homepage hero — public component.
   ────────────────────────────────────────────────────────────────── */
export function PremiumHomepageHero(props: {
  questionCount?: number;
  lessonCount?: number;
}) {
  // Hooks must run unconditionally at top level (never inside try/catch).
  // Marketing layout wraps this tree with `MarketingI18nProvider` +
  // `NursenestRegionRoot`; `useMarketingI18n` degrades safely outside provider.
  const { locale: rawLocale, t } = useMarketingI18n();
  const { region: rawRegion } = useNursenestRegion();
  const locale = safeLocale(rawLocale);
  const region = safeRegion(rawRegion);

  const q = props.questionCount ?? 0;
  const lessons = props.lessonCount ?? 0;

  // Premium hero copy. Headline + sub use NEW i18n keys so existing
  // translations of `pages.home.hero.headline` are not silently changed.
  const eyebrow = formatTitleCase(
    safeHomepageMarketingT(t, "pages.home.hero.eyebrow", "Global study platform · Canada-first exam depth"),
    locale,
  );
  const headline = formatSentenceCase(
    safeHomepageMarketingT(
      t,
      "pages.home.hero.headlinePremium",
      "Pass the boards with a calm, clinical study plan.",
    ),
    locale,
  );
  const subheading = formatSentenceCase(
    safeHomepageMarketingT(
      t,
      "pages.home.hero.subheadingPremium",
      "Study with lessons, flashcards, rationales, and readiness tools built for RN, RPN, NP, and allied health learners worldwide.",
    ),
    locale,
  );

  const primaryCtaLabel = formatTitleCase(
    safeHomepageMarketingT(t, "pages.home.hero.premiumPrimaryCta", "Start free"),
    locale,
  );
  const secondaryCtaLabel = formatTitleCase(
    safeHomepageMarketingT(t, "pages.home.hero.premiumSecondaryCta", "View pricing"),
    locale,
  );

  const trustNoCard = safeHomepageMarketingT(
    t,
    "pages.home.hero.noCreditCard",
    "No payment required",
  );
  const trustEvidence = safeHomepageMarketingT(
    t,
    "pages.home.hero.trust.evidence",
    "NCSBN-style rationales and references",
  );
  const trustCat = safeHomepageMarketingT(
    t,
    "pages.home.hero.trust.cat",
    "Computerized adaptive practice tests",
  );

  const statsSep = safeHomepageMarketingT(t, "pages.home.hero.statsLine.separator", " · ");
  const qPart =
    q > 0
      ? stripMustachePlaceholders(
          safeHomepageMarketingT(t, "pages.home.hero.statsLine.questions", "{{count}} practice questions", {
            count: formatMarketingInteger(q, locale),
          }),
        )
      : "";
  const lPart =
    lessons > 0
      ? stripMustachePlaceholders(
          safeHomepageMarketingT(t, "pages.home.hero.statsLine.lessons", "{{count}} clinical lessons", {
            count: formatMarketingInteger(lessons, locale),
          }),
        )
      : "";
  const statsLine =
    q > 0 || lessons > 0
      ? stripMustachePlaceholders([qPart, lPart].filter(Boolean).join(statsSep))
      : stripMustachePlaceholders(safeHomepageMarketingT(t, "pages.home.hero.statsFallback", "Updated regularly"));

  // Right-panel copy — all overridable via i18n, with safe defaults that
  // never claim a specific learner / outcome / institution.
  const panelCopy = {
    panelTag: safeHomepageMarketingT(t, "pages.home.hero.panel.tag", "Readiness preview"),
    panelLive: safeHomepageMarketingT(t, "pages.home.hero.panel.live", "Live readiness preview"),
    readinessLabel: safeHomepageMarketingT(t, "pages.home.hero.panel.readinessLabel", "Readiness"),
    readinessValue: safeHomepageMarketingT(t, "pages.home.hero.panel.readinessValue", "78%"),
    streakLabel: safeHomepageMarketingT(t, "pages.home.hero.panel.streakLabel", "Study streak"),
    streakValue: safeHomepageMarketingT(t, "pages.home.hero.panel.streakValue", "9 days"),
    masteredLabel: safeHomepageMarketingT(t, "pages.home.hero.panel.masteredLabel", "Mastered"),
    masteredValue: formatMarketingInteger(124, locale),
    masteredUnit: safeHomepageMarketingT(t, "pages.home.hero.panel.masteredUnit", "cards"),
    ecgLabel: safeHomepageMarketingT(
      t,
      "pages.home.hero.panel.ecgLabel",
      "ECG practice",
    ),
    ecgBpm: safeHomepageMarketingT(t, "pages.home.hero.panel.ecgBpm", "72 bpm"),
    mini1Title: safeHomepageMarketingT(
      t,
      "pages.home.hero.panel.mini1.title",
      "Heart failure · hemodynamics & safety",
    ),
    mini1Sub: safeHomepageMarketingT(
      t,
      "pages.home.hero.panel.mini1.sub",
      "79% mastery · 6 questions remaining",
    ),
    mini2Title: safeHomepageMarketingT(
      t,
      "pages.home.hero.panel.mini2.title",
      "Pharmacology · high-alert medications",
    ),
    mini2Sub: safeHomepageMarketingT(
      t,
      "pages.home.hero.panel.mini2.sub",
      "54% mastery · 11 questions remaining",
    ),
  };

  return (
    <section
      className="nn-hero-bridge nn-home-marketing-rich-hero border-b border-[var(--header-nav-border)]"
      aria-labelledby="home-conversion-hero-heading"
      data-testid="hero-section"
    >
      <div className="mx-auto max-w-6xl px-4 py-[calc(var(--nn-rhythm-page-y)*0.9)] sm:px-6 md:py-[calc(var(--nn-rhythm-section-y)*0.92)] lg:px-8">
        <div className="nn-premium-hero-grid min-h-[min(22rem,72dvh)] md:min-h-[19rem]">
          {/* ── Copy column ───────────────────────────────────────── */}
          <div>
            <span className="nn-premium-hero-eyebrow">{eyebrow}</span>

            <h1
              id="home-conversion-hero-heading"
              className="nn-marketing-h1 mt-3 min-w-0 max-w-[min(100%,36ch)] text-balance text-[var(--palette-heading)]"
              data-testid="text-hero-heading"
            >
              {headline.includes(" with ") ? (
                <>
                  {headline.slice(0, headline.indexOf(" with "))}
                  <span className="nn-blossom-hero-gradient-copy">
                    {headline.slice(headline.indexOf(" with "))}
                  </span>
                </>
              ) : (
                headline
              )}
            </h1>

            <p className="nn-marketing-body mt-[var(--nn-rhythm-heading-sub)] max-w-[42ch] text-pretty text-[var(--palette-text-muted)]">
              {subheading}
            </p>

            <div className="mt-[var(--nn-rhythm-text-to-cta)] flex flex-wrap gap-[var(--nn-rhythm-btn-group-gap)]">
              <MarketingTrackedLink
                href={safePath(locale, HUB.questionBank)}
                event={PH.marketingHomeHeroPrimaryCta}
                eventProps={{ region }}
                className={`${MARKETING_PRIMARY_CTA_CLASS} rounded-xl`}
              >
                {primaryCtaLabel}
                <ArrowRight className="ml-2 h-4 w-4 shrink-0" />
              </MarketingTrackedLink>

              <MarketingTrackedLink
                href={safePath(locale, HUB.examLessons)}
                event={PH.marketingHomeHeroSecondaryCta}
                eventProps={{ region }}
                className={`${MARKETING_SECONDARY_CTA_CLASS} rounded-xl`}
              >
                {secondaryCtaLabel}
              </MarketingTrackedLink>
            </div>

            {/* Trust pills row — under CTAs */}
            <div className="nn-premium-hero-trust" aria-label="Trust signals">
              <span className="nn-premium-hero-trust__pill">
                <ShieldCheck
                  className="h-3.5 w-3.5 shrink-0 text-[var(--semantic-success)]"
                  aria-hidden
                />
                {trustNoCard}
              </span>
              <span className="nn-premium-hero-trust__pill">{trustCat}</span>
              <span className="nn-premium-hero-trust__pill">{trustEvidence}</span>
            </div>

            <p
              className="nn-marketing-body-sm mt-3 text-[var(--palette-text-muted)]"
              data-testid="premium-hero-stats-line"
            >
              {statsLine}
            </p>
          </div>

          {/* ── Clinical dashboard panel ──────────────────────────── */}
          <HeroClinicalPanel copy={panelCopy} />
        </div>
      </div>
    </section>
  );
}

export default PremiumHomepageHero;
