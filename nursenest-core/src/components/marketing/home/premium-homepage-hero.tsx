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

import { ArrowRight, ShieldCheck } from "lucide-react";
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

function HeroClinicalPanel() {
  const decisionCards = [
    ["Rhythm", "Normal Sinus Rhythm"],
    ["Lead", "Lead II strip"],
    ["Clinical cue", "Stable baseline; continue assessment"],
    ["Next step", "Escalate if rhythm or perfusion changes"],
  ] as const;

  return (
    <aside
      className="nn-premium-hero-panel nn-premium-hero-clinical-brief"
      aria-label="NurseNest clinical learning brief"
    >
      <header className="nn-premium-hero-panel__header">
        <span className="nn-premium-hero-panel__tag">Today · Clinical Brief</span>
        <span className="nn-premium-hero-panel__status">Study-ready</span>
      </header>

      <div className="nn-premium-hero-ecg" aria-label="Lead II normal sinus rhythm at approximately 72 beats per minute">
        <div className="nn-premium-hero-ecg__row">
          <span>Lead II · Normal Sinus Rhythm</span>
          <span className="nn-premium-hero-ecg__bpm">72 BPM</span>
        </div>
        <MarketingHomepageEcgStripIllustration ariaLabel="Clinically accurate Lead II normal sinus rhythm strip with visible P waves, narrow QRS complexes, normal T waves, and consistent PR intervals" />
      </div>

      <div className="nn-premium-hero-clinical-brief__grid">
        {decisionCards.map(([label, value]) => (
          <div key={label} className="nn-premium-hero-clinical-brief__card">
            <span>{label}</span>
            <strong>{value}</strong>
          </div>
        ))}
      </div>
    </aside>
  );
}

export function MarketingHomepageEcgStripIllustration({ ariaLabel }: { ariaLabel: string }) {
  return (
    <svg
      className="nn-premium-hero-ecg__wave"
      viewBox="0 0 560 96"
      role="img"
      aria-label={ariaLabel}
      focusable="false"
    >
      <defs>
        <linearGradient id="nn-home-ecg-wave" x1="0" x2="1" y1="0" y2="0">
          <stop offset="0%" stopColor="var(--semantic-info)" />
          <stop offset="48%" stopColor="var(--theme-primary)" />
          <stop offset="100%" stopColor="var(--semantic-success)" />
        </linearGradient>
      </defs>
      <rect x="0" y="0" width="560" height="96" rx="16" fill="var(--semantic-surface)" />
      {Array.from({ length: 13 }).map((_, i) => (
        <line
          key={`v-${i}`}
          x1={i * 48}
          x2={i * 48}
          y1="0"
          y2="96"
          stroke="var(--semantic-border-soft)"
          strokeWidth="1"
          opacity="0.42"
        />
      ))}
      {Array.from({ length: 5 }).map((_, i) => (
        <line
          key={`h-${i}`}
          x1="0"
          x2="560"
          y1={16 + i * 16}
          y2={16 + i * 16}
          stroke="var(--semantic-border-soft)"
          strokeWidth="1"
          opacity="0.34"
        />
      ))}
      <path
        d="M0 52 H36
           C42 52 45 51 49 49
           C53 47 57 47 61 49
           C65 51 68 52 74 52
           H92
           L98 28 L104 78 L111 52
           H126
           C136 52 142 47 148 43
           C156 38 166 39 174 45
           C181 50 188 52 198 52
           H246
           C252 52 255 51 259 49
           C263 47 267 47 271 49
           C275 51 278 52 284 52
           H302
           L308 28 L314 78 L321 52
           H336
           C346 52 352 47 358 43
           C366 38 376 39 384 45
           C391 50 398 52 408 52
           H456
           C462 52 465 51 469 49
           C473 47 477 47 481 49
           C485 51 488 52 494 52
           H512
           L518 28 L524 78 L531 52
           H560"
        fill="none"
        stroke="color-mix(in srgb, var(--semantic-text-muted) 48%, transparent)"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M0 52 H36
           C42 52 45 51 49 49
           C53 47 57 47 61 49
           C65 51 68 52 74 52
           H92
           L98 28 L104 78 L111 52
           H126
           C136 52 142 47 148 43
           C156 38 166 39 174 45
           C181 50 188 52 198 52
           H246
           C252 52 255 51 259 49
           C263 47 267 47 271 49
           C275 51 278 52 284 52
           H302
           L308 28 L314 78 L321 52
           H336
           C346 52 352 47 358 43
           C366 38 376 39 384 45
           C391 50 398 52 408 52
           H456
           C462 52 465 51 469 49
           C473 47 477 47 481 49
           C485 51 488 52 494 52
           H512
           L518 28 L524 78 L531 52
           H560"
        fill="none"
        stroke="url(#nn-home-ecg-wave)"
        strokeWidth="3"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
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
    safeHomepageMarketingT(t, "pages.home.hero.eyebrowAdaptive", "For RN, RPN, NP, Pre-Nursing & New Graduate Learners"),
    locale,
  );
  const headline = formatTitleCase(
    safeHomepageMarketingT(
      t,
      "pages.home.hero.headlineAdaptive",
      "Master Nursing. Pass With Confidence.",
    ),
    locale,
  );
  const subheading = formatSentenceCase(
    safeHomepageMarketingT(
      t,
      "pages.home.hero.subheadingAdaptive",
      "Lessons, NGN practice, CAT exams, ECG, labs, medication math, clinical skills, and simulations—built for NCLEX-RN, REx-PN, CNPLE, and pre-nursing in one connected ecosystem.",
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

  return (
    <section
      className="nn-hero-bridge nn-home-marketing-rich-hero border-b border-[color-mix(in_srgb,var(--header-nav-border)_58%,transparent)]"
      aria-labelledby="home-conversion-hero-heading"
      data-testid="hero-section"
    >
      <div className="relative mx-auto max-w-6xl overflow-hidden px-4 py-[clamp(4.5rem,9vw,6.5rem)] sm:px-6 md:py-[clamp(6rem,10vw,8.5rem)] lg:px-8">
        <LeafWatermark
          className="-right-24 top-4 hidden h-[24rem] w-[24rem] items-center justify-center opacity-70 md:flex lg:-right-28 lg:top-0"
          imageClassName="max-h-[22rem] opacity-[0.035] lg:max-h-[24rem]"
          size={460}
        />
        <div className="nn-premium-hero-grid relative z-[1]">
          {/* ── Copy column ───────────────────────────────────────── */}
          <div className="max-w-[43rem]">
            <span className="nn-premium-hero-eyebrow">{eyebrow}</span>

            <div className="nn-hero-headline-visual">
              <h1
                id="home-conversion-hero-heading"
                className="nn-marketing-h1 nn-hero-headline--premium mt-7 min-w-0 max-w-[min(100%,36ch)] text-balance text-[var(--palette-heading)]"
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

            <p className="nn-marketing-body mt-[clamp(1.35rem,2.5vw,1.85rem)] max-w-[44ch] text-pretty text-[var(--palette-text-muted)]">
              {subheading}
            </p>

            <div className="mt-[clamp(1.75rem,3vw,2.5rem)] flex flex-wrap gap-[clamp(0.75rem,1.6vw,1rem)]">
              <MarketingTrackedLink
                href={safePath(locale, HUB.questionBank)}
                event={PH.marketingHomeHeroPrimaryCta}
                eventProps={{ region }}
                className={`${MARKETING_PRIMARY_CTA_CLASS} rounded-full`}
              >
                {primaryCtaLabel}
                <ArrowRight className="ml-2 h-4 w-4 shrink-0" />
              </MarketingTrackedLink>

              <MarketingTrackedLink
                href={safePath(locale, HUB.pricing)}
                event={PH.marketingHomeHeroSecondaryCta}
                eventProps={{ region }}
                className={`${MARKETING_SECONDARY_CTA_CLASS} rounded-full`}
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
              className="nn-marketing-body-sm mt-4 text-[var(--palette-text-muted)]"
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
            <HeroClinicalPanel />
          </div>
        </div>
      </div>
    </section>
  );
}

export default PremiumHomepageHero;
