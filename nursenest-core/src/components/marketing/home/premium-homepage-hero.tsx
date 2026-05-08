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

function buildSinusRhythmPath(beats: number, beatWidth: number, baselineY: number): string {
  const parts: string[] = [];
  for (let b = 0; b < beats; b++) {
    const o = b * beatWidth;
    const y = baselineY;
    parts.push(
      `M${o},${y} L${o + 10},${y} C${o + 14},${y} ${o + 16},${y - 5.5} ${o + 21},${y - 5.5} C${o + 25},${y - 5.5} ${o + 27},${y} ${o + 33},${y} L${o + 42},${y} L${o + 44},${y + 1.2} L${o + 46},${y} L${o + 49},${y - 30} L${o + 53},${y + 5} L${o + 57},${y} L${o + 66},${y} C${o + 70},${y} ${o + 74},${y - 9} ${o + 83},${y} L${o + beatWidth},${y}`,
    );
  }
  return parts.join(" ");
}

/* ──────────────────────────────────────────────────────────────────
   Inline rhythm strip — educational / illustrative only (not diagnostic).
   Simplified normal sinus–style P–QRS–T pattern for marketing context; not
   a substitute for clinical ECG interpretation. No animation.
   ────────────────────────────────────────────────────────────────── */
function HeroEcgStrip({ ariaLabel }: { ariaLabel: string }) {
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
          <span className="nn-premium-hero-stat__value">{copy.readinessValue}</span>
        </div>
        <div className="nn-premium-hero-stat nn-premium-hero-stat--streak">
          <Flame className="nn-premium-hero-stat__glyph" aria-hidden />
          <span className="nn-premium-hero-stat__label">{copy.streakLabel}</span>
          <span className="nn-premium-hero-stat__value">{copy.streakValue}</span>
        </div>
        <div className="nn-premium-hero-stat nn-premium-hero-stat--mastery">
          <BookMarked className="nn-premium-hero-stat__glyph" aria-hidden />
          <span className="nn-premium-hero-stat__label">{copy.masteredLabel}</span>
          <span className="nn-premium-hero-stat__value">{copy.masteredValue}</span>
        </div>
      </div>

      <div className="nn-premium-hero-ecg" aria-hidden={false}>
        <div className="nn-premium-hero-ecg__row">
          <span>{copy.ecgLabel}</span>
          <span className="nn-premium-hero-ecg__bpm">{copy.ecgBpm}</span>
        </div>
        <HeroEcgStrip ariaLabel={copy.ecgLabel} />
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
  // Region + i18n are wrapped in try/catch so the hero never crashes the
  // homepage shell (mirrors the production behavior of `HomeConversionHero`).
  let locale = "en";
  let t: ((k: string) => string) | undefined;
  try {
    const ctx = useMarketingI18n();
    locale = safeLocale(ctx.locale);
    t = ctx.t;
  } catch {
    /* fall through to defaults */
  }

  let region = "CA";
  try {
    region = safeRegion(useNursenestRegion().region);
  } catch {
    /* fall through to default region */
  }

  const q = props.questionCount ?? 0;
  const lessons = props.lessonCount ?? 0;

  // Premium hero copy. Headline + sub use NEW i18n keys so existing
  // translations of `pages.home.hero.headline` are not silently changed.
  const eyebrow = formatTitleCase(
    safeHomepageMarketingT(t, "pages.home.hero.eyebrow", "Clinical nursing exam preparation"),
    locale,
  );
  const headline = formatSentenceCase(
    safeHomepageMarketingT(
      t,
      "pages.home.hero.headlinePremium",
      "Build exam-day readiness with clinical judgment, not cram lists.",
    ),
    locale,
  );
  const subheading = formatSentenceCase(
    safeHomepageMarketingT(
      t,
      "pages.home.hero.subheadingPremium",
      "Structured lessons, flashcards, and item-level practice with rationales that follow real nursing priorities—safety, assessment, and therapeutic decisions—across RN, PN, NP, and allied health pathways.",
    ),
    locale,
  );

  const primaryCtaLabel = formatTitleCase(
    safeHomepageMarketingT(t, "pages.home.hero.primaryCta", "Start Practice Questions"),
    locale,
  );
  const secondaryCtaLabel = formatTitleCase(
    safeHomepageMarketingT(t, "pages.home.hero.secondaryCta", "Browse Lessons"),
    locale,
  );

  const trustNoCard = safeHomepageMarketingT(
    t,
    "pages.home.hero.noCreditCard",
    "No credit card required",
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
      ? safeHomepageMarketingT(t, "pages.home.hero.statsLine.questions", "{{count}} practice questions", {
          count: formatMarketingInteger(q, locale),
        })
      : "";
  const lPart =
    lessons > 0
      ? safeHomepageMarketingT(t, "pages.home.hero.statsLine.lessons", "{{count}} clinical lessons", {
          count: formatMarketingInteger(lessons, locale),
        })
      : "";
  const statsLine =
    q > 0 || lessons > 0
      ? [qPart, lPart].filter(Boolean).join(statsSep)
      : safeHomepageMarketingT(t, "pages.home.hero.statsFallback", "Updated regularly");

  // Right-panel copy — all overridable via i18n, with safe defaults that
  // never claim a specific learner / outcome / institution.
  const panelCopy = {
    panelTag: safeHomepageMarketingT(t, "pages.home.hero.panel.tag", "Readiness preview"),
    panelLive: safeHomepageMarketingT(t, "pages.home.hero.panel.live", "Live"),
    readinessLabel: safeHomepageMarketingT(t, "pages.home.hero.panel.readinessLabel", "Pass probability"),
    readinessValue: safeHomepageMarketingT(t, "pages.home.hero.panel.readinessValue", "78%"),
    streakLabel: safeHomepageMarketingT(t, "pages.home.hero.panel.streakLabel", "Study streak"),
    streakValue: safeHomepageMarketingT(t, "pages.home.hero.panel.streakValue", "9 days"),
    masteredLabel: safeHomepageMarketingT(t, "pages.home.hero.panel.masteredLabel", "Items mastered"),
    masteredValue: safeHomepageMarketingT(t, "pages.home.hero.panel.masteredValue", "{{count}} cards", {
      count: formatMarketingInteger(1240, locale),
    }),
    ecgLabel: safeHomepageMarketingT(
      t,
      "pages.home.hero.panel.ecgLabel",
      "Lead II · normal sinus rhythm",
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
    >
      <div className="mx-auto max-w-6xl px-4 py-[var(--nn-rhythm-page-y)] sm:px-6 md:py-[var(--nn-rhythm-section-y)] lg:px-8">
        <div className="nn-premium-hero-grid">
          {/* ── Copy column ───────────────────────────────────────── */}
          <div>
            <span className="nn-premium-hero-eyebrow">{eyebrow}</span>

            <h1
              id="home-conversion-hero-heading"
              className="nn-marketing-h1 mt-3 min-w-0 max-w-[min(100%,36ch)] text-balance text-[var(--palette-heading)]"
            >
              {headline}
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
