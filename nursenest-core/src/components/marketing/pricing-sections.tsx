/**
 * Pricing Sections — the product-education layer of the pricing page.
 *
 * Components:
 *   FeatureComparisonTable  — Free vs Premium, mapped to REAL gated features (spec §5)
 *   UnlockFeatureBlock      — single "what you unlock" block with visual preview (spec §6)
 *   PricingUnlockSection    — the full "What you unlock" section with all 4 blocks
 *   ProductPreviewGrid      — visual cards of product areas (spec §7)
 *   PricingTrustReassurance — short trust / reassurance section (spec §8)
 *   PricingCTA              — final CTA card (spec §9)
 *
 * All content maps exactly to features gated in:
 *   - premium-gate.tsx (PremiumLockCard / LockedPreviewCard)
 *   - study-plan.tsx (days 2+, focus areas, retest strategy)
 *   - smart-review-screen.tsx (groups 2–4, filters)
 *   - confidence-analytics.tsx (pattern cards, review priority)
 *   - cat-results-summary.tsx (advanced readiness reporting)
 *
 * No generic SaaS copy. No invented features. Palette uses CSS vars throughout.
 */

import Link from "next/link";
import { Check, Lock, Sparkles } from "lucide-react";
import {
  MARKETING_PRIMARY_CTA_CLASS,
  MARKETING_SECONDARY_CTA_CLASS,
} from "@/lib/theme/marketing-hero-pattern";

// ── Shared token aliases (CSS custom properties) ──────────────────────────────

const SURFACE = "var(--semantic-surface)";
const SURFACE_ELEVATED = "color-mix(in srgb, var(--theme-primary) 4%, var(--semantic-surface))";
const SOFT_A = "color-mix(in srgb, var(--theme-primary) 6%, var(--semantic-surface))";
const SOFT_B = "color-mix(in srgb, var(--theme-primary) 10%, var(--semantic-surface))";
const WARNING_SOFT = "color-mix(in srgb, var(--semantic-warning) 8%, var(--semantic-surface))";
const INFO_SOFT = "color-mix(in srgb, var(--semantic-info) 8%, var(--semantic-surface))";
const SUCCESS_SOFT = "color-mix(in srgb, var(--role-success, var(--semantic-success)) 8%, var(--semantic-surface))";
const NEUTRAL_MUTED = "color-mix(in srgb, var(--semantic-border-soft) 42%, var(--semantic-surface))";
const BORDER = "var(--semantic-border-soft)";
const TEXT_PRIMARY = "var(--semantic-text-primary)";
const TEXT_SECONDARY = "var(--semantic-text-secondary)";
const TEXT_MUTED = "var(--semantic-text-muted)";

// ── FeatureComparisonTable ────────────────────────────────────────────────────

/**
 * FeatureComparisonTable — Free vs Premium comparison (spec §5).
 *
 * Every row maps to a real gated feature in the product.
 * "Preview only" means the feature exists with gating applied.
 * No invented feature rows.
 */
const COMPARISON_ROWS: {
  feature: string;
  free: { label: string; indicator: "partial" | "none" };
  premium: string;
}[] = [
  {
    feature: "Adaptive Study Plan",
    free: { label: "Day 1 preview only", indicator: "partial" },
    premium: "Full 3–5 day personalized plan with lesson + practice links",
  },
  {
    feature: "Smart Review (confidence grouping)",
    free: { label: "High Priority Fixes only, 3 items", indicator: "partial" },
    premium: "All 4 groups: High Priority, Needs Review, Uncertain, Strong Areas",
  },
  {
    feature: "Confidence Analytics",
    free: { label: "Summary strip + 1 metric", indicator: "partial" },
    premium: "Full Confidence Patterns + Where to Focus Next",
  },
  {
    feature: "CAT Exam Simulation",
    free: { label: "Limited access", indicator: "partial" },
    premium: "Unlimited CAT sessions + full readiness reporting",
  },
  {
    feature: "Lesson Interlinking",
    free: { label: "Limited lesson links", indicator: "partial" },
    premium: "Full topic → lesson routing from analytics and review",
  },
  {
    feature: "Review Priority System",
    free: { label: "Partial (first group only)", indicator: "partial" },
    premium: "Full Where to Focus Next with grouped question list",
  },
  {
    feature: "Practice Sessions",
    free: { label: "Limited", indicator: "partial" },
    premium: "Unlimited targeted and mixed practice",
  },
  {
    feature: "Retest Strategy",
    free: { label: "Not included", indicator: "none" },
    premium: "Personalized retest timing and readiness guidance",
  },
];

export function FeatureComparisonTable() {
  return (
    <section className="mt-16" aria-labelledby="real-compare-heading">
      <div className="mb-6 text-center">
        <h2 id="real-compare-heading" className="nn-marketing-h2">
          What changes when you unlock Premium
        </h2>
        <p className="nn-marketing-body-sm mx-auto mt-2 max-w-2xl text-muted-foreground">
          Every feature below is built into the platform. See exactly what you get with full access.
        </p>
      </div>

      <div
        className="overflow-x-auto rounded-2xl shadow-sm"
        style={{
          border: `1px solid ${BORDER}`,
          background: SURFACE,
        }}
      >
        <table className="w-full min-w-[min(100%,600px)] border-collapse text-left text-sm">
          <thead>
            <tr
              style={{
                borderBottom: `1px solid ${BORDER}`,
                background: SOFT_A,
              }}
            >
              <th scope="col" className="px-4 py-3.5 font-semibold" style={{ color: TEXT_PRIMARY }}>
                Feature
              </th>
              <th scope="col" className="px-4 py-3.5 font-semibold" style={{ color: TEXT_MUTED }}>
                Free account
              </th>
              <th
                scope="col"
                className="px-4 py-3.5 font-semibold"
                style={{ color: "var(--theme-primary)" }}
              >
                Premium
              </th>
            </tr>
          </thead>
          <tbody>
            {COMPARISON_ROWS.map((row, i) => (
              <tr
                key={row.feature}
                style={{
                  borderBottom: i < COMPARISON_ROWS.length - 1 ? `1px solid ${BORDER}` : "none",
                }}
              >
                <th
                  scope="row"
                  className="px-4 py-3.5 align-top font-semibold"
                  style={{ color: TEXT_PRIMARY }}
                >
                  {row.feature}
                </th>
                <td className="px-4 py-3.5 align-top" style={{ color: TEXT_MUTED }}>
                  <span className="flex gap-2">
                    {row.free.indicator === "partial" ? (
                      <Sparkles
                        className="mt-0.5 h-4 w-4 shrink-0"
                        style={{ color: "var(--semantic-info)" }}
                        aria-hidden
                      />
                    ) : (
                      <Lock
                        className="mt-0.5 h-4 w-4 shrink-0"
                        style={{ color: "var(--semantic-warning)" }}
                        aria-hidden
                      />
                    )}
                    <span>{row.free.label}</span>
                  </span>
                </td>
                <td className="px-4 py-3.5 align-top" style={{ color: TEXT_SECONDARY }}>
                  <span className="flex gap-2">
                    <Check
                      className="mt-0.5 h-4 w-4 shrink-0"
                      style={{ color: "var(--semantic-success)" }}
                      aria-hidden
                    />
                    <span>{row.premium}</span>
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

// ── UnlockFeatureBlock ────────────────────────────────────────────────────────

/**
 * UnlockFeatureBlock — single "What you unlock" block (spec §6).
 *
 * Shows: title, bullets, visual preview card.
 * Visual preview uses real CSS tokens to mirror the actual product UI.
 */
export function UnlockFeatureBlock({
  label,
  title,
  bullets,
  accentColor,
  preview,
}: {
  label: string;
  title: string;
  bullets: string[];
  accentColor: string;
  preview: React.ReactNode;
}) {
  return (
    <div
      className="flex flex-col gap-0 overflow-hidden rounded-2xl shadow-sm lg:flex-row"
      style={{ border: `1px solid ${BORDER}` }}
    >
      {/* Left: text content */}
      <div
        className="flex flex-1 flex-col justify-center gap-5 p-8 lg:max-w-[42%]"
        style={{ background: SURFACE_ELEVATED }}
      >
        <p
          className="inline-flex w-fit items-center rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider"
          style={{
            background: `color-mix(in srgb, ${accentColor} 12%, ${SURFACE})`,
            border: `1px solid color-mix(in srgb, ${accentColor} 24%, ${BORDER})`,
            color: TEXT_MUTED,
          }}
        >
          {label}
        </p>
        <div>
          <h3 className="nn-marketing-h3 mb-3">{title}</h3>
          <ul className="space-y-2.5">
            {bullets.map((b) => (
              <li key={b} className="flex items-start gap-2.5 text-sm" style={{ color: TEXT_SECONDARY }}>
                <Check
                  className="mt-0.5 h-4 w-4 shrink-0"
                  style={{ color: "var(--semantic-success)" }}
                  aria-hidden
                />
                {b}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Right: visual preview */}
      <div
        className="flex flex-1 items-center justify-center p-6 lg:p-8"
        style={{
          background: `color-mix(in srgb, ${accentColor} 5%, ${SOFT_A})`,
          borderLeft: `1px solid ${BORDER}`,
        }}
      >
        <div className="w-full max-w-sm">{preview}</div>
      </div>
    </div>
  );
}

// ── Visual preview sub-components ─────────────────────────────────────────────

/** Mini study plan preview — shows Day 1 card + 2 locked shells */
function StudyPlanPreview() {
  return (
    <div className="space-y-2 text-sm">
      {/* Day 1 — real */}
      <div
        className="rounded-xl p-3"
        style={{ background: SOFT_B, border: `1px solid ${BORDER}` }}
      >
        <div className="mb-2 flex items-center gap-2">
          <span
            className="inline-flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold"
            style={{
              background: "color-mix(in srgb, var(--theme-primary) 15%, var(--semantic-surface))",
              color: TEXT_PRIMARY,
            }}
          >
            1
          </span>
          <span className="text-xs font-bold" style={{ color: TEXT_PRIMARY }}>
            Day 1 — Core Weak Area Repair
          </span>
        </div>
        <div className="space-y-1.5 pl-8">
          {["📖 Study lesson", "✏️ 10 targeted questions", "🔍 Review incorrect answers"].map((b) => (
            <p key={b} className="text-xs" style={{ color: TEXT_SECONDARY }}>
              {b}
            </p>
          ))}
        </div>
      </div>
      {/* Locked shells */}
      {["Day 2 — Second Focus Area", "Day 3 — Timed Practice"].map((title, i) => (
        <div
          key={i}
          className="flex items-center gap-2.5 rounded-xl px-3 py-2.5"
          style={{
            background: NEUTRAL_MUTED,
            border: `1px dashed ${BORDER}`,
          }}
        >
          <span
            className="inline-flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold"
            style={{ background: BORDER, color: TEXT_MUTED }}
          >
            {i + 2}
          </span>
          <span className="text-xs font-semibold" style={{ color: TEXT_MUTED }}>
            {title}
          </span>
          <Lock className="ml-auto h-3.5 w-3.5" style={{ color: TEXT_MUTED }} aria-hidden />
        </div>
      ))}
      {/* Summary card */}
      <div
        className="rounded-xl px-3 py-2 text-center text-xs font-semibold"
        style={{
          background: "color-mix(in srgb, var(--theme-primary) 8%, var(--semantic-surface))",
          border: `1px solid color-mix(in srgb, var(--theme-primary) 20%, ${BORDER})`,
          color: TEXT_SECONDARY,
        }}
      >
        Readiness Score: 68 · Building Readiness
      </div>
    </div>
  );
}

/** Mini smart review preview — 4 grouped sections */
function SmartReviewPreview() {
  const groups = [
    { label: "High Priority Fixes", count: 4, bg: WARNING_SOFT, accent: "var(--semantic-warning)" },
    { label: "Needs Review", count: 6, bg: NEUTRAL_MUTED, accent: TEXT_MUTED },
    { label: "Uncertain Knowledge", count: 5, bg: INFO_SOFT, accent: "var(--semantic-info)" },
    { label: "Strong Areas", count: 8, bg: SUCCESS_SOFT, accent: "var(--role-success, var(--semantic-success))" },
  ];

  return (
    <div className="space-y-2 text-xs">
      {groups.map((g) => (
        <div
          key={g.label}
          className="flex items-center justify-between rounded-lg px-3 py-2.5"
          style={{
            background: g.bg,
            border: `1px solid color-mix(in srgb, ${g.accent} 20%, ${BORDER})`,
          }}
        >
          <span className="font-semibold" style={{ color: TEXT_PRIMARY }}>
            {g.label}
          </span>
          <span
            className="rounded-full px-2 py-0.5 text-[11px] font-bold"
            style={{
              background: `color-mix(in srgb, ${g.accent} 18%, ${SURFACE})`,
              color: TEXT_SECONDARY,
            }}
          >
            {g.count} questions
          </span>
        </div>
      ))}
    </div>
  );
}

/** Mini confidence analytics preview — 3 metric cards */
function ConfidenceAnalyticsPreview() {
  const cards = [
    { label: "Overconfident Errors", value: "4", bg: WARNING_SOFT, accent: "var(--semantic-warning)" },
    { label: "Uncertain Correct", value: "7", bg: INFO_SOFT, accent: "var(--semantic-info)" },
    { label: "Strong Knowledge", value: "11", bg: SUCCESS_SOFT, accent: "var(--role-success, var(--semantic-success))" },
  ];

  return (
    <div className="space-y-2.5 text-xs">
      {/* Summary strip */}
      <div
        className="rounded-lg px-3 py-2 text-center text-xs font-semibold"
        style={{
          background: "color-mix(in srgb, var(--theme-primary) 8%, var(--semantic-surface))",
          border: `1px solid color-mix(in srgb, var(--theme-primary) 20%, ${BORDER})`,
          color: TEXT_SECONDARY,
        }}
      >
        High-confidence answers were correct 78% of the time
      </div>
      {/* 3 cards */}
      <div className="grid grid-cols-3 gap-2">
        {cards.map((c) => (
          <div
            key={c.label}
            className="rounded-lg p-2.5 text-center"
            style={{
              background: c.bg,
              border: `1px solid color-mix(in srgb, ${c.accent} 20%, ${BORDER})`,
            }}
          >
            <p className="text-[11px] font-medium" style={{ color: TEXT_MUTED }}>
              {c.label}
            </p>
            <p
              className="mt-1 text-xl font-black tabular-nums"
              style={{ color: TEXT_PRIMARY }}
            >
              {c.value}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

/** Mini CAT results preview — score + band + thin bar */
function CatExamPreview() {
  return (
    <div className="space-y-3 text-sm">
      <div
        className="rounded-xl p-4"
        style={{ background: SURFACE_ELEVATED, border: `1px solid ${BORDER}` }}
      >
        <p className="text-xs font-bold uppercase tracking-wider" style={{ color: TEXT_MUTED }}>
          Readiness Score
        </p>
        <div className="my-2 flex items-center gap-3">
          <span
            className="text-4xl font-black tabular-nums"
            style={{ color: TEXT_PRIMARY }}
          >
            68
          </span>
          <span
            className="rounded-full px-3 py-1 text-xs font-bold"
            style={{
              background: INFO_SOFT,
              border: `1px solid color-mix(in srgb, var(--semantic-info) 22%, ${BORDER})`,
              color: TEXT_SECONDARY,
            }}
          >
            Approaching Readiness
          </span>
        </div>
        <p className="text-xs" style={{ color: TEXT_SECONDARY }}>
          You are close, but a few weak areas are still limiting consistency.
        </p>
        {/* Progress bar */}
        <div
          className="mt-3 h-1.5 overflow-hidden rounded-full"
          style={{ background: NEUTRAL_MUTED }}
        >
          <div
            className="h-full rounded-full"
            style={{
              width: "68%",
              background: "var(--theme-primary, var(--semantic-info))",
            }}
          />
        </div>
      </div>
      <div className="grid grid-cols-3 gap-2 text-center text-[11px]">
        {[
          { label: "Accuracy", value: "72%" },
          { label: "Difficulty", value: "Medium+" },
          { label: "Consistency", value: "Improving" },
        ].map((s) => (
          <div
            key={s.label}
            className="rounded-lg p-2"
            style={{ background: SOFT_A, border: `1px solid ${BORDER}` }}
          >
            <p style={{ color: TEXT_MUTED }}>{s.label}</p>
            <p className="mt-0.5 font-bold" style={{ color: TEXT_PRIMARY }}>
              {s.value}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── PricingUnlockSection ──────────────────────────────────────────────────────

const UNLOCK_BLOCKS = [
  {
    label: "Adaptive Study Plan",
    title: "Know exactly what to study every day",
    bullets: [
      "3–5 day plan built from your readiness score and weak areas",
      "Daily tasks: lessons, targeted practice, and review sessions",
      "Direct links to every lesson and question — no searching",
      "Retest strategy so you know when to take the exam",
    ],
    accentColor: "var(--theme-primary)",
    preview: <StudyPlanPreview />,
  },
  {
    label: "Smart Review",
    title: "Fix your weak areas faster",
    bullets: [
      "Questions grouped by urgency: High Priority, Needs Review, Uncertain, and Strong",
      "See which mistakes matter most and fix them first",
      "Filter by topic, confidence, or correctness to focus your time",
      "Direct lesson links from every question — study what you got wrong",
    ],
    accentColor: "var(--semantic-warning)",
    preview: <SmartReviewPreview />,
  },
  {
    label: "Confidence Analytics",
    title: "See exactly where you stand",
    bullets: [
      "Catch overconfident errors — answers you got wrong but thought you knew",
      "Identify uncertain correct answers so you can reinforce guessed knowledge",
      "Track strong mastery — what you truly know under exam conditions",
      "Prioritised review queue: Where to Focus Next",
    ],
    accentColor: "var(--semantic-info)",
    preview: <ConfidenceAnalyticsPreview />,
  },
  {
    label: "Full Practice Exams",
    title: "Simulate the real exam and track your readiness",
    bullets: [
      "Adaptive CAT exams that adjust difficulty to your level in real time",
      "Readiness score (0–100) with a clear band: Not Ready → Exam Ready",
      "Detailed performance analysis by topic and category",
      "Real exam-style questions with full rationales",
    ],
    accentColor: "var(--semantic-success)",
    preview: <CatExamPreview />,
  },
];

/**
 * PricingUnlockSection — the "What you unlock" section (spec §6).
 * 4 blocks, each tied directly to a real gated feature.
 */
export function PricingUnlockSection() {
  return (
    <section className="mt-20" aria-labelledby="what-you-unlock-heading">
      <div className="mb-10 text-center">
        <h2 id="what-you-unlock-heading" className="nn-marketing-h2">
          Everything you need to pass — in one system
        </h2>
        <p className="nn-marketing-body-sm mx-auto mt-2 max-w-2xl text-muted-foreground">
          Start your free trial and get instant access to all of these — no setup, no delay.
        </p>
      </div>
      <div className="space-y-6">
        {UNLOCK_BLOCKS.map((block) => (
          <UnlockFeatureBlock key={block.label} {...block} />
        ))}
      </div>
    </section>
  );
}

// ── ProductPreviewGrid ────────────────────────────────────────────────────────

import { ScreenshotProductCard } from "@/components/marketing/screenshot-feature-grid";
import type { ScreenshotId } from "@/lib/marketing/screenshot-registry";

/**
 * ProductPreviewGrid — 3-card visual overview of the product surfaces (spec §7).
 *
 * Each card shows a real CDN screenshot from the registry plus a short title,
 * description, and detail line. The screenshot IDs are sourced from
 * SCREENSHOT_GROUPS.pricingPreview (screenshot1, screenshot6, screenshot7).
 */
const PRODUCT_AREAS: {
  screenshotId: ScreenshotId;
  icon: string;
  title: string;
  desc: string;
  detail: string;
}[] = [
  {
    screenshotId: 1,
    icon: "✏️",
    title: "Practice interface",
    desc: "Question stem, answer options, and full rationale — all visible at once. No scrolling to see why you were wrong.",
    detail: "Correct answer · Why this is correct · Why other options are wrong · Key Takeaway · Related Lessons",
  },
  {
    screenshotId: 6,
    icon: "🎯",
    title: "CAT exam mode",
    desc: "An adaptive exam that adjusts difficulty item-by-item, scoring your readiness on a 0–100 scale.",
    detail: "Adaptive difficulty · Readiness scoring · Category breakdown · Historical trend",
  },
  {
    screenshotId: 7,
    icon: "📊",
    title: "Results + remediation",
    desc: "Structured results with weak areas, strengths, confidence patterns, and a personalised study plan generated from your data.",
    detail: "Smart review · Study plan · Confidence analytics · Retest strategy",
  },
];

export function ProductPreviewGrid() {
  return (
    <section className="mt-20" aria-labelledby="product-preview-heading">
      <div className="mb-8 text-center">
        <h2 id="product-preview-heading" className="nn-marketing-h2">
          Practice, test, and review — all connected
        </h2>
        <p className="nn-marketing-body-sm mx-auto mt-2 max-w-2xl text-muted-foreground">
          One system that shows you exactly what to study, tests your readiness, and helps you fix weak areas.
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        {PRODUCT_AREAS.map((area) => (
          <ScreenshotProductCard
            key={area.title}
            screenshotId={area.screenshotId}
            icon={area.icon}
            title={area.title}
            description={area.desc}
            detail={area.detail}
          />
        ))}
      </div>
    </section>
  );
}

// ── PricingTrustReassurance ───────────────────────────────────────────────────

/**
 * PricingTrustReassurance — short trust signals section (spec §8).
 * No long paragraphs. Specific, product-based.
 */
const TRUST_POINTS = [
  {
    icon: "🎯",
    headline: "Designed to help you pass on your first attempt",
    body: "Structured around real exam blueprints — NCLEX, REx-PN, and specialty exams. Not generic nursing content.",
  },
  {
    icon: "📐",
    headline: "Your study is structured, not random",
    body: "Every session connects to your weak areas and confidence data. You always know what to study next.",
  },
  {
    icon: "📈",
    headline: "You'll know when you're ready",
    body: "Readiness scoring, weak area tracking, and confidence analytics show your progress clearly — so you can walk into the exam feeling prepared.",
  },
];

export function PricingTrustReassurance() {
  return (
    <section className="mt-20" aria-labelledby="trust-heading">
      <div className="mb-8 text-center">
        <h2 id="trust-heading" className="nn-marketing-h2">
          Built for students who want to pass
        </h2>
        <p className="nn-marketing-body-sm mx-auto mt-2 max-w-lg text-muted-foreground">
          Used by nursing students preparing for NCLEX and REx-PN across Canada and the US.
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        {TRUST_POINTS.map((p) => (
          <div
            key={p.headline}
            className="rounded-2xl p-6"
            style={{ background: SURFACE_ELEVATED, border: `1px solid ${BORDER}` }}
          >
            <span className="mb-3 block text-2xl" aria-hidden>
              {p.icon}
            </span>
            <h3 className="nn-marketing-h4 mb-2">{p.headline}</h3>
            <p className="text-sm leading-relaxed" style={{ color: TEXT_SECONDARY }}>
              {p.body}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

// ── PricingCTA ────────────────────────────────────────────────────────────────

/**
 * PricingCTA — final CTA card (spec §9).
 *
 * One primary CTA. Clean. No urgency pressure language.
 */
export function PricingCTA({ plansHref }: { plansHref: string }) {
  return (
    <section
      className="mt-20 rounded-2xl p-10 text-center shadow-sm"
      style={{
        background: "color-mix(in srgb, var(--theme-primary) 7%, var(--semantic-surface))",
        border: `1px solid color-mix(in srgb, var(--theme-primary) 20%, ${BORDER})`,
      }}
    >
      <h2 className="nn-marketing-h2 mb-3">Start studying smarter today</h2>
      <p className="nn-marketing-body-sm mx-auto mb-8 max-w-lg text-muted-foreground">
        Try everything free. No charge today — cancel anytime before your trial ends.
      </p>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <Link href={plansHref} className={MARKETING_PRIMARY_CTA_CLASS}>
          Start Free Trial
        </Link>
        <Link href="#pricing-plans-heading" className={MARKETING_SECONDARY_CTA_CLASS}>
          View Plans
        </Link>
      </div>
    </section>
  );
}
