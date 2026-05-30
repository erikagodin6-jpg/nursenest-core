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

import type { CSSProperties } from "react";
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

/* ──────────────────────────────────────────────────────────────────
   Clinical dashboard panel — uses the `.nn-premium-hero-panel*`
   class vocabulary already shipped in `premium-redesign-2026.css`.
   ────────────────────────────────────────────────────────────────── */
const HERO_CAROUSEL_SLIDES = [
  {
    label: "Answered Question",
    src: "/images/homepage/question-bank-demo.png",
    alt: "Answered NCLEX-style question showing selected answer, correct answer, rationale, and clinical pearl.",
  },
  {
    label: "CAT Exam",
    src: "/images/homepage/cat-exam-demo.png",
    alt: "Computer adaptive testing screen showing a question in progress with adaptive exam interface.",
  },
  {
    label: "ECG Detective Mode",
    src: "/images/homepage/ecg-demo.png",
    alt: "ECG detective mode showing rhythm strip interpretation and clinical reasoning.",
  },
] as const;

function HeroClinicalPanel() {
  return (
    <aside
      className="nn-premium-hero-panel nn-premium-hero-carousel"
      aria-label="NurseNest product screenshot carousel"
    >
      <header className="nn-premium-hero-panel__header nn-premium-hero-carousel__header">
        <span className="nn-premium-hero-panel__tag">Live Product Preview</span>
        <span className="nn-premium-hero-panel__live">Real learning workflows</span>
      </header>

      <div className="nn-premium-hero-carousel__stage">
        {HERO_CAROUSEL_SLIDES.map((slide, index) => (
          <figure key={slide.label} className="nn-premium-hero-carousel__slide" style={{ "--nn-hero-slide-index": index } as CSSProperties}>
            <img src={slide.src} alt={slide.alt} width={1600} height={936} loading={index === 0 ? "eager" : "lazy"} decoding="async" />
            <figcaption>{slide.label}</figcaption>
          </figure>
        ))}
      </div>

      <div className="nn-premium-hero-carousel__dots" aria-hidden>
        {HERO_CAROUSEL_SLIDES.map((slide, index) => (
          <span key={slide.label} style={{ "--nn-hero-slide-index": index } as CSSProperties} />
        ))}
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
      "Study with lessons, NGN practice, simulations, ECG, telemetry, labs, competency tracking, and CAT readiness—built for RN, PN or RPN, NP, allied health, and pre-nursing learners.",
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
                href={safePath(locale, HUB.examLessons)}
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
