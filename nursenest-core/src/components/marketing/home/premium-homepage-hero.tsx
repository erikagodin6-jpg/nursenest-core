/**
 * Premium homepage hero (Phase 4) — server component island.
 *
 * Converted from "use client" to RSC so the hero HTML is static (no
 * hydration). Client islands inside it (MarketingTrackedLink, LeafWatermark)
 * still hydrate independently — they are the only interactive/dynamic parts.
 *
 * Props replace the removed hooks:
 *   locale, region  — passed from the parent RSC (replaces useMarketingI18n /
 *                     useNursenestRegion).
 *   messages        — flat i18n record from the server-side message loader.
 *   questionCount, lessonCount — stats from the DB, pre-resolved in the RSC.
 */

import { ArrowRight, BookMarked, Flame, ShieldCheck, Target } from "lucide-react";
import { safeHomepageMarketingT } from "@/lib/marketing/homepage-marketing-visible-copy";
import { withMarketingLocale } from "@/lib/i18n/marketing-path";
import { HUB } from "@/lib/marketing/marketing-entry-routes";
import { MarketingTrackedLink } from "@/components/marketing/marketing-tracked-link";
import { PH } from "@/lib/observability/posthog-conversion-events";
import {
  MARKETING_PRIMARY_CTA_CLASS,
  MARKETING_SECONDARY_CTA_CLASS,
} from "@/lib/theme/marketing-hero-pattern";
import { LeafWatermark } from "@/components/brand/leaf-watermark";
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

/** Derive a translation lookup from a flat messages record (server-side equivalent of the i18n hook). */
function makeT(messages: Record<string, string> | undefined) {
  return (key: string, params?: Record<string, string | number | undefined>): string => {
    if (!messages) return "";
    const template = messages[key] ?? "";
    if (!template) return "";
    if (!params) return template;
    return template.replace(/\{\{(\w+)\}\}/g, (_, k) => String(params[k] ?? ""));
  };
}

/**
 * Split headline into solid lead + gradient emphasis for locales that use a
 * natural bridge word (with / avec / mit / con). Falls back to full solid headline.
 */
function splitPremiumHeroHeadline(headline: string): { lead: string; emphasis: string | null } {
  const bridges = [/\s+with\s+/i, /\s+avec\s+/i, /\s+mit\s+/i, /\s+con\s+/i];
  for (const re of bridges) {
    const match = headline.match(re);
    if (match && match.index != null) {
      return {
        lead: headline.slice(0, match.index),
        emphasis: headline.slice(match.index),
      };
    }
  }
  const sentenceBreak = headline.match(/([.!?])\s+/);
  if (sentenceBreak && sentenceBreak.index != null) {
    const splitAt = sentenceBreak.index + sentenceBreak[0].length;
    return {
      lead: headline.slice(0, splitAt).trimEnd(),
      emphasis: headline.slice(splitAt).trimStart(),
    };
  }
  return { lead: headline, emphasis: null };
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

const _ECG_BEAT_W = 138;
const _ECG_BEAT_COUNT = 3;
const _ECG_BASELINE = 46;
const _ECG_PATH = buildSinusRhythmPath(_ECG_BEAT_COUNT, _ECG_BEAT_W, _ECG_BASELINE);
const _ECG_VIEWBOX_W = _ECG_BEAT_W * _ECG_BEAT_COUNT;

/** Reusable illustrative NSR-style strip for homepage marketing (not diagnostic). */
export function MarketingHomepageEcgStripIllustration({ ariaLabel }: { ariaLabel: string }) {
  return (
    <svg
      role="img"
      aria-label={ariaLabel}
      viewBox={`0 0 ${_ECG_VIEWBOX_W} 72`}
      preserveAspectRatio="xMidYMid meet"
      className="nn-premium-hero-ecg__svg block w-full text-[var(--semantic-success)]"
      style={{ height: 52 }}
    >
      <g className="nn-premium-hero-ecg__trace">
        <path
          d={_ECG_PATH}
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
   Premium homepage hero — server component.
   Props replace the removed i18n and region hooks (see file header).
   ────────────────────────────────────────────────────────────────── */
export function PremiumHomepageHero(props: {
  questionCount?: number;
  lessonCount?: number;
  /** Flat i18n message record from the server-side shard loader. Falls back to English defaults. */
  messages?: Record<string, string>;
  /** BCP-47 locale string (e.g. "en", "fr"). Defaults to "en". */
  locale?: string;
  /** Marketing region slug ("CA" | "US"). Defaults to "CA". */
  region?: string;
}) {
  const locale = safeLocale(props.locale);
  const region = safeRegion(props.region);
  const t = makeT(props.messages);

  const q = props.questionCount ?? 0;
  const lessons = props.lessonCount ?? 0;

  const eyebrow = formatTitleCase(
    safeHomepageMarketingT(t, "pages.home.hero.eyebrowAdaptive", "Adaptive Clinical Readiness"),
    locale,
  );
  const headline = formatTitleCase(
    safeHomepageMarketingT(
      t,
      "pages.home.hero.headlineAdaptive",
      "Master Nursing. Think Like a Clinician.",
    ),
    locale,
  );
  const subheading = formatSentenceCase(
    safeHomepageMarketingT(
      t,
      "pages.home.hero.subheadingAdaptive",
      "Study with lessons, flashcards, rationales, CAT readiness, ECG, labs, and clinical reasoning tools built for RN, PN or RPN, NP, allied health, and pre-nursing learners.",
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

  const { lead: heroHeadlineLead, emphasis: heroHeadlineEmphasis } = splitPremiumHeroHeadline(headline);

  const panelCopy = {
    panelTag: safeHomepageMarketingT(t, "pages.home.hero.panel.tag", "Adaptive Readiness Preview"),
    panelLive: safeHomepageMarketingT(t, "pages.home.hero.panel.live", "Live Clinical Readiness Preview"),
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
      "Lead II · Normal Sinus Rhythm",
    ),
    ecgBpm: safeHomepageMarketingT(t, "pages.home.hero.panel.ecgBpm", "72 bpm"),
    mini1Title: safeHomepageMarketingT(
      t,
      "pages.home.hero.panel.mini1.title",
      "Labs and Clinical Interpretation",
    ),
    mini1Sub: safeHomepageMarketingT(
      t,
      "pages.home.hero.panel.mini1.sub",
      "79% readiness · weak areas detected",
    ),
    mini2Title: safeHomepageMarketingT(
      t,
      "pages.home.hero.panel.mini2.title",
      "Medication Safety and Med Math",
    ),
    mini2Sub: safeHomepageMarketingT(
      t,
      "pages.home.hero.panel.mini2.sub",
      "54% readiness · focused review queued",
    ),
  };

  return (
    <section
      className="nn-hero-bridge nn-home-marketing-rich-hero border-b border-[var(--header-nav-border)]"
      aria-labelledby="home-conversion-hero-heading"
      data-testid="hero-section"
    >
      <div className="relative mx-auto max-w-6xl overflow-hidden px-4 py-[calc(var(--nn-rhythm-page-y)*0.9)] sm:px-6 md:py-[calc(var(--nn-rhythm-section-y)*0.92)] lg:px-8">
        <LeafWatermark
          className="-right-24 top-4 hidden h-[24rem] w-[24rem] items-center justify-center opacity-70 md:flex lg:-right-28 lg:top-0"
          imageClassName="max-h-[22rem] opacity-[0.035] lg:max-h-[24rem]"
          size={460}
        />
        <div className="nn-premium-hero-grid relative z-[1]">
          {/* ── Copy column ───────────────────────────────────────── */}
          <div>
            <span className="nn-premium-hero-eyebrow">{eyebrow}</span>

            <div className="nn-hero-headline-visual">
              <h1
                id="home-conversion-hero-heading"
                className="nn-marketing-h1 nn-hero-headline--premium mt-3 min-w-0 max-w-[min(100%,36ch)] text-balance text-[var(--palette-heading)]"
                data-testid="text-hero-heading"
              >
                {heroHeadlineEmphasis ? (
                  <>
                    {heroHeadlineLead}
                    <span className="nn-hero-headline-emphasis">{heroHeadlineEmphasis}</span>
                  </>
                ) : (
                  headline
                )}
              </h1>
            </div>

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

          {/* ── Clinical dashboard panel — desktop only ───────────── */}
          {/* Hidden on mobile: single-column stack adds ~300px to hero height
              and hydrates Lucide icons + ECG SVG above the fold. Desktop shows
              the full two-column clinical dashboard layout. */}
          <div className="hidden lg:block">
            <HeroClinicalPanel copy={panelCopy} />
          </div>
        </div>
      </div>
    </section>
  );
}

export default PremiumHomepageHero;
