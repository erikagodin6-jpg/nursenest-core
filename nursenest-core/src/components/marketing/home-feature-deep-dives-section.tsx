"use client";

/**
 * HomeFeatureDeepDivesSection — spec §7
 *
 * Three alternating feature blocks tied directly to the REAL premium features
 * already gated in the product:
 *   1. Adaptive Study Plan   → study-plan.tsx
 *   2. Smart Review          → smart-review-screen.tsx
 *   3. CAT Exam Simulation   → cat results + readiness scoring
 *
 * Every CTA routes correctly:
 *   - Primary: /pricing (conversion layer)
 *   - Secondary: regional study-mode entry (experience value)
 *
 * No generic copy. No invented features. Palette uses CSS custom properties
 * throughout — theme-aware, no hardcoded colors.
 */

import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { useMemo } from "react";
import { useNursenestRegion } from "@/lib/region/use-nursenest-region";
import { useMarketingI18n } from "@/lib/marketing-i18n";
import { withMarketingLocale } from "@/lib/i18n/marketing-path";
import { rnQuestions, HUB } from "@/lib/marketing/marketing-entry-routes";
import { publicMarketingCatHrefForOffering } from "@/lib/marketing/marketing-exam-navigation";
import { MarketingTrackedLink } from "@/components/marketing/marketing-tracked-link";
import { PH } from "@/lib/observability/posthog-conversion-events";
import {
  MARKETING_PRIMARY_CTA_CLASS,
  MARKETING_SECONDARY_CTA_CLASS,
} from "@/lib/theme/marketing-hero-pattern";
import { MarketingChainScreenshot } from "@/components/marketing/marketing-screenshot-stack";
import {
  SCREENSHOT_REGISTRY,
  type ScreenshotId,
} from "@/lib/marketing/screenshot-registry";
import { formatEyebrow, formatSentenceCase, formatTitleCase } from "@/lib/format/text-case";
import { PRIMARY_CTA, SECONDARY_CTA, VIEW_PRICING_CTA } from "@/lib/copy/cta-copy";

// ── Shared token helpers ───────────────────────────────────────────────────────

const SURFACE = "var(--page-bg)";
const SURFACE_ELEVATED = "color-mix(in srgb, var(--theme-primary) 4%, var(--card-bg))";
const SOFT_A = "color-mix(in srgb, var(--theme-primary) 6%, var(--card-bg))";
const SOFT_B = "color-mix(in srgb, var(--theme-primary) 10%, var(--card-bg))";
const WARNING_SOFT = "color-mix(in srgb, var(--semantic-warning) 8%, var(--card-bg))";
const INFO_SOFT = "color-mix(in srgb, var(--semantic-info) 8%, var(--card-bg))";
const SUCCESS_SOFT = "color-mix(in srgb, var(--semantic-success) 8%, var(--card-bg))";
const NEUTRAL_MUTED = "color-mix(in srgb, var(--border) 42%, var(--card-bg))";
const BORDER = "var(--border)";
const TEXT_PRIMARY = "var(--theme-heading-text)";
const TEXT_SECONDARY = "var(--theme-body-text)";
const TEXT_MUTED = "var(--theme-muted-text)";

// ── Feature screenshot component ──────────────────────────────────────────────

/**
 * Renders a real CDN screenshot from the registry.
 * Replaces JSX-only mock previews with actual product screenshots (spec §2, §6).
 * Falls back to null (renders nothing) if the ID is not in the registry.
 */
function FeatureScreenshot({ id }: { id: ScreenshotId }) {
  const record = SCREENSHOT_REGISTRY.find((s) => s.id === id);
  if (!record) return null;
  return (
    <MarketingChainScreenshot
      objectKey={record.objectKey}
      publicUrl={record.publicUrl}
      alt={record.alt ?? record.label}
      aspectRatio="16 / 10"
      fit="contain"
      rounded="rounded-xl"
      imgClassName="object-top"
    />
  );
}

// ── Visual previews (legacy JSX mockups — kept for reference, no longer rendered) ─

/** @deprecated Use <FeatureScreenshot id={8} /> instead. */
function StudyPlanPreview() {
  return (
    <div className="space-y-2 text-sm">
      <div
        className="rounded-xl p-3.5"
        style={{ background: SOFT_B, border: `1px solid ${BORDER}` }}
      >
        <div className="mb-2.5 flex items-center gap-2">
          <span
            className="inline-flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold"
            style={{
              background: "color-mix(in srgb, var(--theme-primary) 15%, var(--card-bg))",
              color: TEXT_PRIMARY,
            }}
          >
            1
          </span>
          <span className="text-xs font-bold" style={{ color: TEXT_PRIMARY }}>
            Day 1: Core Weak Area Repair
          </span>
        </div>
        <div className="space-y-1.5 pl-9">
          {["📖 Study: Cardiac Rhythm Basics", "✏️ 10 targeted practice questions", "🔍 Review incorrect answers"].map(
            (line) => (
              <p key={line} className="text-xs" style={{ color: TEXT_SECONDARY }}>
                {line}
              </p>
            ),
          )}
        </div>
      </div>

      {["Day 2: Second Focus Area", "Day 3: Timed Practice + Review", "Day 4: CAT Simulation"].map(
        (title, i) => (
          <div
            key={i}
            className="flex items-center gap-2.5 rounded-xl px-3 py-2.5"
            style={{
              background: NEUTRAL_MUTED,
              border: `1px dashed ${BORDER}`,
            }}
          >
            <span
              className="inline-flex h-6 w-6 items-center justify-center rounded-full text-[11px] font-bold"
              style={{ background: BORDER, color: TEXT_MUTED }}
            >
              {i + 2}
            </span>
            <span className="flex-1 text-xs font-semibold" style={{ color: TEXT_MUTED }}>
              {title}
            </span>
            <span className="text-xs" style={{ color: TEXT_MUTED }} aria-hidden>
              🔒
            </span>
          </div>
        ),
      )}

      <div
        className="rounded-xl px-3 py-2.5 text-center"
        style={{
          background: "color-mix(in srgb, var(--theme-primary) 8%, var(--card-bg))",
          border: `1px solid color-mix(in srgb, var(--theme-primary) 20%, ${BORDER})`,
        }}
      >
        <p className="text-xs font-semibold" style={{ color: TEXT_SECONDARY }}>
          Readiness Score: 68 · Building Readiness
        </p>
        <p className="mt-0.5 text-[11px]" style={{ color: TEXT_MUTED }}>
          After completing 2–3 sessions, retest with CAT
        </p>
      </div>
    </div>
  );
}

/** Smart Review mini-preview: 4 grouped rows with surface variation */
function SmartReviewPreview() {
  const groups = [
    {
      label: "High Priority Fixes",
      count: 4,
      bg: WARNING_SOFT,
      accent: "var(--semantic-warning, #f59e0b)",
      desc: "Incorrect + high confidence",
    },
    {
      label: "Needs Review",
      count: 6,
      bg: NEUTRAL_MUTED,
      accent: TEXT_MUTED,
      desc: "Incorrect + low/medium confidence",
    },
    {
      label: "Uncertain Knowledge",
      count: 5,
      bg: INFO_SOFT,
      accent: "var(--semantic-info, #3b82f6)",
      desc: "Correct + low confidence",
    },
    {
      label: "Established knowledge",
      count: 8,
      bg: SUCCESS_SOFT,
      accent: "var(--semantic-success, #22c55e)",
      desc: "Correct + high confidence",
    },
  ] as const;

  return (
    <div className="space-y-2">
      {/* Summary strip */}
      <div
        className="rounded-lg px-3 py-2 text-center"
        style={{
          background: "color-mix(in srgb, var(--theme-primary) 8%, var(--card-bg))",
          border: `1px solid color-mix(in srgb, var(--theme-primary) 18%, ${BORDER})`,
        }}
      >
        <p className="text-[11px] font-semibold" style={{ color: TEXT_SECONDARY }}>
          Review Your Performance · 23 questions
        </p>
      </div>
      {/* 4 group rows */}
      {groups.map((g) => (
        <div
          key={g.label}
          className="flex items-center justify-between rounded-lg px-3 py-2.5"
          style={{
            background: g.bg,
            border: `1px solid color-mix(in srgb, ${g.accent} 20%, ${BORDER})`,
          }}
        >
          <div>
            <p className="text-xs font-bold" style={{ color: TEXT_PRIMARY }}>
              {g.label}
            </p>
            <p className="text-[10px]" style={{ color: TEXT_MUTED }}>
              {g.desc}
            </p>
          </div>
          <span
            className="rounded-full px-2 py-0.5 text-[11px] font-bold"
            style={{
              background: `color-mix(in srgb, ${g.accent} 18%, ${SURFACE})`,
              color: TEXT_SECONDARY,
              border: `1px solid color-mix(in srgb, ${g.accent} 22%, ${BORDER})`,
            }}
          >
            {g.count}
          </span>
        </div>
      ))}
    </div>
  );
}

/** CAT exam mini-preview: score + band + stat grid */
function CatExamPreview() {
  return (
    <div className="space-y-2.5">
      <div
        className="rounded-xl p-4"
        style={{ background: SURFACE_ELEVATED, border: `1px solid ${BORDER}` }}
      >
        <p className="mb-1 text-[10px] font-bold uppercase tracking-wider" style={{ color: TEXT_MUTED }}>
          CAT Readiness Score
        </p>
        <div className="flex items-center gap-3">
          <span className="text-4xl font-black tabular-nums" style={{ color: TEXT_PRIMARY }}>
            68
          </span>
          <span
            className="rounded-full px-3 py-1 text-xs font-bold"
            style={{
              background: INFO_SOFT,
              border: `1px solid color-mix(in srgb, var(--semantic-info, #3b82f6) 22%, ${BORDER})`,
              color: TEXT_SECONDARY,
            }}
          >
            Approaching Readiness
          </span>
        </div>
        <p className="mt-2 text-xs" style={{ color: TEXT_SECONDARY }}>
          You are close. Cardiac and Pharmacology are limiting your score.
        </p>
        <div
          className="mt-3 h-1.5 overflow-hidden rounded-full"
          style={{ background: NEUTRAL_MUTED }}
        >
          <div
            className="h-full rounded-full transition-all"
            style={{
              width: "68%",
              background: "var(--theme-primary, var(--semantic-info, #3b82f6))",
            }}
          />
        </div>
      </div>

      {/* 3 stat cards */}
      <div className="grid grid-cols-3 gap-2 text-center">
        {[
          { label: "Accuracy", value: "72%", bg: SOFT_A },
          { label: "Difficulty", value: "Med+", bg: SOFT_B },
          { label: "Trend", value: "↑ +6", bg: SUCCESS_SOFT },
        ].map((s) => (
          <div
            key={s.label}
            className="rounded-lg p-2"
            style={{ background: s.bg, border: `1px solid ${BORDER}` }}
          >
            <p className="text-[10px]" style={{ color: TEXT_MUTED }}>
              {s.label}
            </p>
            <p className="mt-0.5 text-sm font-black" style={{ color: TEXT_PRIMARY }}>
              {s.value}
            </p>
          </div>
        ))}
      </div>

      {/* Next steps */}
      <div
        className="rounded-lg px-3 py-2 text-[11px]"
        style={{ background: NEUTRAL_MUTED, border: `1px solid ${BORDER}` }}
      >
        <p className="font-semibold" style={{ color: TEXT_PRIMARY }}>
          What To Do Next
        </p>
        <p className="mt-0.5" style={{ color: TEXT_MUTED }}>
          Review missed questions → Study Cardiac → Retest in 2 sessions
        </p>
      </div>
    </div>
  );
}

// ── Feature block ──────────────────────────────────────────────────────────────

type FeatureBlock = {
  label: string;
  title: string;
  bullets: string[];
  primaryCta: string;
  primaryHref: string;
  secondaryCta: string;
  secondaryHref: string;
  accentColor: string;
  preview: React.ReactNode;
  /** flip = visual on left, text on right */
  flip?: boolean;
  testId: string;
  locale: string;
};

function FeatureBlockRow({
  label,
  title,
  bullets,
  primaryCta,
  primaryHref,
  secondaryCta,
  secondaryHref,
  accentColor,
  preview,
  flip = false,
  testId,
  locale,
}: FeatureBlock) {
  return (
    <div
      className={`flex flex-col gap-0 overflow-hidden rounded-2xl ${flip ? "lg:flex-row-reverse" : "lg:flex-row"}`}
      style={{ border: `1px solid ${BORDER}` }}
      data-testid={testId}
    >
      {/* Text column */}
      <div
        className="flex flex-1 flex-col justify-center gap-6 p-8 lg:max-w-[48%]"
        style={{ background: SURFACE_ELEVATED }}
      >
        <p
          className="inline-flex w-fit items-center rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider"
          style={{
            background: `color-mix(in srgb, ${accentColor} 10%, ${SURFACE})`,
            border: `1px solid color-mix(in srgb, ${accentColor} 22%, ${BORDER})`,
            color: TEXT_MUTED,
          }}
        >
          {formatEyebrow(label, locale)}
        </p>

        <h3
          className="nn-marketing-h2 text-balance"
          style={{ color: TEXT_PRIMARY }}
        >
          {formatTitleCase(title, locale)}
        </h3>

        <ul className="space-y-3">
          {bullets.map((b) => (
            <li key={b} className="flex items-start gap-2.5 text-sm" style={{ color: TEXT_SECONDARY }}>
              <Check
                className="mt-0.5 h-4 w-4 shrink-0"
                style={{ color: "var(--semantic-success, #22c55e)" }}
                aria-hidden
              />
              {formatSentenceCase(b, locale)}
            </li>
          ))}
        </ul>

        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <Link
            href={primaryHref}
            className={`${MARKETING_PRIMARY_CTA_CLASS} sm:w-auto`}
          >
            {formatTitleCase(primaryCta, locale)}
            <ArrowRight className="ml-2 h-4 w-4 shrink-0" aria-hidden />
          </Link>
          <Link href={secondaryHref} className={`${MARKETING_SECONDARY_CTA_CLASS} sm:w-auto`}>
            {formatTitleCase(secondaryCta, locale)}
          </Link>
        </div>
      </div>

      {/* Preview column */}
      <div
        className="flex flex-1 items-center justify-center p-6 lg:p-8"
        style={{
          background: `color-mix(in srgb, ${accentColor} 4%, ${SOFT_A})`,
          borderLeft: flip ? "none" : `1px solid ${BORDER}`,
          borderRight: flip ? `1px solid ${BORDER}` : "none",
        }}
      >
        <div className="w-full max-w-sm">{preview}</div>
      </div>
    </div>
  );
}

// ── Section ────────────────────────────────────────────────────────────────────

/**
 * HomeFeatureDeepDivesSection — three alternating blocks showing the real
 * premium system features. Routes to pricing (conversion) + study mode entry
 * (experience value). Adapts routes to user region.
 */
export function HomeFeatureDeepDivesSection() {
  const { locale } = useMarketingI18n();
  const { region } = useNursenestRegion();
  const loc = (path: string) => withMarketingLocale(locale, path);

  const pricingHref = loc(HUB.pricing);
  const questionsHref = loc(rnQuestions(region));
  const catHref = useMemo(() => loc(publicMarketingCatHrefForOffering(region, "rn")), [region, locale]);

  const blocks: FeatureBlock[] = [
    {
      label: "Adaptive Study Plan",
      title: "Your personalized study plan",
      bullets: [
        "3–5 day structured plan built from your CAT readiness score and weak areas",
        "Daily tasks: lessons, targeted practice questions, and review sessions",
        "Direct links to relevant lessons and question sets, no searching",
        "Retest strategy: exact timing and recommended next steps",
      ],
      primaryCta: VIEW_PRICING_CTA,
      primaryHref: pricingHref,
      secondaryCta: SECONDARY_CTA,
      secondaryHref: questionsHref,
      accentColor: "var(--theme-primary)",
      preview: <FeatureScreenshot id={8} />,
      flip: false,
      testId: "feature-block-study-plan",
      locale,
    },
    {
      label: "Smart Review",
      title: "Know exactly what to fix",
      bullets: [
        "Every completed question grouped by correctness and confidence level",
        "High Priority Fixes: questions you got wrong but rated as confident",
        "Needs Review, Uncertain Knowledge, and Strong Areas, all clearly separated",
        "Direct lesson links from every question row in the review list",
      ],
      primaryCta: VIEW_PRICING_CTA,
      primaryHref: pricingHref,
      secondaryCta: PRIMARY_CTA,
      secondaryHref: questionsHref,
      accentColor: "var(--semantic-warning, #f59e0b)",
      preview: <FeatureScreenshot id={9} />,
      flip: true,
      testId: "feature-block-smart-review",
      locale,
    },
    {
      label: "CAT Exam Simulation",
      title: "Train like the real exam",
      bullets: [
        "Adaptive difficulty adjusts item-by-item based on your ability",
        "0–100 readiness score with band label: Not Ready → Exam Ready",
        "Category-level breakdown shows which body systems are weakest",
        "Tracks improvement across sessions so you know when you're ready to retest",
      ],
      primaryCta: PRIMARY_CTA,
      primaryHref: catHref,
      secondaryCta: VIEW_PRICING_CTA,
      secondaryHref: pricingHref,
      accentColor: "var(--semantic-success, #22c55e)",
      preview: <FeatureScreenshot id={6} />,
      flip: false,
      testId: "feature-block-cat",
      locale,
    },
  ];

  return (
    <section
      className="nn-section-block border-b border-[var(--border)] bg-[var(--page-bg)]"
      aria-labelledby="home-features-heading"
      data-testid="section-feature-deep-dives"
    >
      <div className="nn-section-shell">
        <header className="mx-auto mb-14 max-w-2xl text-center">
          <h2
            id="home-features-heading"
            className="nn-marketing-h2 text-balance"
            style={{ color: TEXT_PRIMARY }}
          >
            {formatTitleCase("The full readiness system", locale)}
          </h2>
          <p className="nn-marketing-body mt-3 text-pretty" style={{ color: TEXT_MUTED }}>
            {formatSentenceCase("Everything connects: practice, test, review, and improve. Built around your weak areas and confidence patterns.", locale)}
          </p>
        </header>

        <div className="space-y-8">
          {blocks.map((block) => (
            <FeatureBlockRow key={block.label} {...block} />
          ))}
        </div>

        {/* Section-level CTA bridge */}
        <div className="mt-12 flex flex-col items-center gap-3 text-center sm:flex-row sm:justify-center">
          <MarketingTrackedLink
            href={pricingHref}
            event={PH.marketingHomeExploreHubClick}
            eventProps={{ surface: "feature_dives_section_cta", destination: "pricing" }}
            className={MARKETING_PRIMARY_CTA_CLASS}
            data-testid="feature-section-pricing-cta"
          >
            {formatTitleCase(VIEW_PRICING_CTA, locale)}
            <ArrowRight className="ml-2 h-5 w-5 shrink-0" aria-hidden />
          </MarketingTrackedLink>
          <MarketingTrackedLink
            href={questionsHref}
            event={PH.marketingHomeExploreHubClick}
            eventProps={{ surface: "feature_dives_section_cta", destination: "questions" }}
            className={MARKETING_SECONDARY_CTA_CLASS}
            data-testid="feature-section-questions-cta"
          >
            {formatTitleCase(SECONDARY_CTA, locale)}
          </MarketingTrackedLink>
        </div>
      </div>
    </section>
  );
}
