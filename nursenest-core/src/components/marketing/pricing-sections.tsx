"use client";

/**
 * Pricing page sections: value communication, trust, features, and CTAs.
 *
 * Sections:
 *   ValuePropsStrip        — Section 2: short horizontal trust/value strip
 *   FeatureComparisonTable — Free vs Premium comparison
 *   PricingFeaturesGrid    — Section 6: what you get (scannable feature blocks)
 *   WhyItWorks             — Section 7: differentiation
 *   AlliedHealthClarity    — Section 8: career-specific plan note
 *   PricingUnlockSection   — full unlock showcase with visual previews
 *   ProductPreviewGrid     — visual product screenshots
 *   PricingTrustReassurance — short trust signals
 *   PricingCTA             — Section 9: final CTA
 */

import Link from "next/link";
import type { ComponentType } from "react";
import { useMarketingI18n } from "@/lib/marketing-i18n";
import {
  BarChart3,
  BookOpen,
  Check,
  ClipboardCheck,
  Crosshair,
  Eye,
  Layers,
  Lock,
  ShieldCheck,
  Sparkles,
  Target,
  TrendingUp,
} from "lucide-react";
import {
  MARKETING_PRIMARY_CTA_CLASS,
  MARKETING_SECONDARY_CTA_CLASS,
} from "@/lib/theme/marketing-hero-pattern";
import { FadeUp, StaggerGroup, StaggerItem } from "@/lib/motion";

const SURFACE = "var(--semantic-surface)";
const SURFACE_ELEVATED = "color-mix(in srgb, var(--palette-primary) 4%, var(--semantic-surface))";
const SOFT_A = "color-mix(in srgb, var(--palette-primary) 6%, var(--semantic-surface))";
const SOFT_B = "color-mix(in srgb, var(--palette-primary) 10%, var(--semantic-surface))";
const WARNING_SOFT = "color-mix(in srgb, var(--semantic-warning) 8%, var(--semantic-surface))";
const INFO_SOFT = "color-mix(in srgb, var(--semantic-info) 8%, var(--semantic-surface))";
const SUCCESS_SOFT = "color-mix(in srgb, var(--role-success, var(--semantic-success)) 8%, var(--semantic-surface))";
const NEUTRAL_MUTED = "color-mix(in srgb, var(--semantic-border-soft) 42%, var(--semantic-surface))";
const BORDER = "var(--semantic-border-soft)";
const TEXT_PRIMARY = "var(--semantic-text-primary)";
const TEXT_SECONDARY = "var(--semantic-text-secondary)";
const TEXT_MUTED = "var(--semantic-text-muted)";

// ── Section 2: Value Props Strip ────────────────────────────────────────────

const VALUE_PROPS = [
  { icon: Target, label: "Exam + Bedside Study Plan", accent: "var(--palette-primary)" },
  { icon: Eye, label: "Strengthen Weak Areas Fast", accent: "var(--semantic-warning)" },
  { icon: ClipboardCheck, label: "Clinical Decision Questions", accent: "var(--semantic-info)" },
  { icon: TrendingUp, label: "Clinical Readiness Tracking", accent: "var(--semantic-success)" },
] as const;

export function ValuePropsStrip() {
  return (
    <StaggerGroup className="grid grid-cols-2 gap-4 sm:grid-cols-4 sm:gap-5" staggerMs={65} whenInView once>
      {VALUE_PROPS.map(({ icon: Icon, label, accent }) => (
        <StaggerItem key={label} variant="softReveal">
          <div
            className="nn-elevation-panel nn-motion-standard flex h-full flex-col items-center gap-3 rounded-2xl px-5 py-6 text-center"
            style={{
              background: `color-mix(in srgb, ${accent} 4%, var(--semantic-surface))`,
              border: `1px solid color-mix(in srgb, ${accent} 14%, ${BORDER})`,
            }}
          >
            <div
              className="flex h-10 w-10 items-center justify-center rounded-xl"
              style={{
                background: `color-mix(in srgb, ${accent} 12%, ${SURFACE})`,
              }}
            >
              <Icon
                className="h-5 w-5"
                style={{ color: accent }}
                aria-hidden
              />
            </div>
            <span
              className="text-sm font-semibold leading-tight"
              style={{ color: TEXT_PRIMARY }}
            >
              {label}
            </span>
          </div>
        </StaggerItem>
      ))}
    </StaggerGroup>
  );
}

// ── Section 6: What You Get (Features Grid) ─────────────────────────────────

const FEATURE_GRID_META = [
  { icon: Layers, titleKey: "pages.pricing.featuresGrid.f1.title", bodyKey: "pages.pricing.featuresGrid.f1.body", accent: "var(--palette-primary)" },
  { icon: Eye, titleKey: "pages.pricing.featuresGrid.f2.title", bodyKey: "pages.pricing.featuresGrid.f2.body", accent: "var(--semantic-warning)" },
  { icon: Target, titleKey: "pages.pricing.featuresGrid.f3.title", bodyKey: "pages.pricing.featuresGrid.f3.body", accent: "var(--semantic-info)" },
  { icon: TrendingUp, titleKey: "pages.pricing.featuresGrid.f4.title", bodyKey: "pages.pricing.featuresGrid.f4.body", accent: "var(--semantic-success)" },
  { icon: ClipboardCheck, titleKey: "pages.pricing.featuresGrid.f5.title", bodyKey: "pages.pricing.featuresGrid.f5.body", accent: "var(--palette-primary)" },
  { icon: BarChart3, titleKey: "pages.pricing.featuresGrid.f6.title", bodyKey: "pages.pricing.featuresGrid.f6.body", accent: "var(--semantic-info)" },
] as const;

export function PricingFeaturesGrid() {
  const { t } = useMarketingI18n();

  return (
    <section aria-labelledby="features-heading" data-testid="section-pricing-features-grid">
      <FadeUp className="mb-8 text-center">
        <h2 id="features-heading" className="nn-marketing-h2">
          {t("pages.pricing.featuresGrid.title")}
        </h2>
        <p className="nn-marketing-body-sm mx-auto mt-2 max-w-2xl text-muted-foreground">
          {t("pages.pricing.featuresGrid.subtitle")}
        </p>
      </FadeUp>
      <StaggerGroup className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6" staggerMs={65} whenInView once>
        {FEATURE_GRID_META.map((f) => (
          <StaggerItem key={f.titleKey} variant="softReveal">
            <div
              className="nn-elevation-panel nn-motion-standard flex h-full flex-col gap-4 rounded-2xl p-7"
              style={{
                background: SURFACE_ELEVATED,
                border: `1px solid ${BORDER}`,
              }}
            >
              <div
                className="flex h-11 w-11 items-center justify-center rounded-xl"
                style={{
                  background: `color-mix(in srgb, ${f.accent} 12%, ${SURFACE})`,
                  border: `1px solid color-mix(in srgb, ${f.accent} 18%, ${BORDER})`,
                }}
              >
                <f.icon className="h-5 w-5" style={{ color: f.accent }} aria-hidden />
              </div>
              <h3 className="nn-marketing-h4">{t(f.titleKey)}</h3>
              <p className="text-sm leading-relaxed" style={{ color: TEXT_SECONDARY }}>
                {t(f.bodyKey)}
              </p>
            </div>
          </StaggerItem>
        ))}
      </StaggerGroup>
    </section>
  );
}

// ── Section 7: Why NurseNest Works ──────────────────────────────────────────

const WHY_POINTS = [
  {
    icon: Crosshair,
    title: "Most platforms teach you what to memorize.",
    desc: "We train you how to think — with scenarios that mirror real judgment calls, prioritization, and safety.",
    accent: "var(--palette-primary)",
  },
  {
    icon: Eye,
    title: "Prioritize safely under pressure",
    desc: "Recognize early deterioration, sequence interventions, and understand why each option is right or risky — not just the keyed answer.",
    accent: "var(--semantic-warning)",
  },
  {
    icon: ShieldCheck,
    title: "Pass the exam. Be ready for the bedside.",
    desc: "Because passing the exam is step one. Practicing safely is what matters next.",
    accent: "var(--semantic-success)",
  },
] as const;

export function WhyItWorks() {
  return (
    <section aria-labelledby="why-heading">
      <FadeUp className="mb-10 text-center">
        <h2 id="why-heading" className="nn-marketing-h2">
          Why we are different
        </h2>
      </FadeUp>
      <StaggerGroup className="grid gap-5 sm:grid-cols-3 sm:gap-6" staggerMs={65} whenInView once>
        {WHY_POINTS.map((p) => (
          <StaggerItem key={p.title} variant="softReveal">
            <div
              className="nn-elevation-panel nn-motion-standard flex h-full flex-col gap-4 overflow-hidden rounded-2xl p-7"
              style={{
                background: SURFACE_ELEVATED,
                border: `1px solid ${BORDER}`,
                borderLeft: `3px solid ${p.accent}`,
              }}
            >
              <div
                className="flex h-10 w-10 items-center justify-center rounded-xl"
                style={{
                  background: `color-mix(in srgb, ${p.accent} 10%, ${SURFACE})`,
                }}
              >
                <p.icon className="h-5 w-5" style={{ color: p.accent }} aria-hidden />
              </div>
              <h3 className="nn-marketing-h4">{p.title}</h3>
              <p className="text-sm leading-relaxed" style={{ color: TEXT_SECONDARY }}>
                {p.desc}
              </p>
            </div>
          </StaggerItem>
        ))}
      </StaggerGroup>
    </section>
  );
}

// ── Section 8: Allied Health Clarity ─────────────────────────────────────────

export function AlliedHealthClarity() {
  return (
    <div
      className="nn-elevation-panel rounded-xl px-6 py-5 text-center"
      style={{
        background: `color-mix(in srgb, var(--semantic-info) 5%, ${SURFACE})`,
        border: `1px solid color-mix(in srgb, var(--semantic-info) 18%, ${BORDER})`,
      }}
    >
      <p className="text-sm font-semibold" style={{ color: TEXT_PRIMARY }}>
        Allied Health Plans Are Career-Specific
      </p>
      <p className="mt-1.5 text-xs" style={{ color: TEXT_SECONDARY }}>
        Each plan delivers role-specific clinical application — the protocols, calculations, and judgment calls your
        certification expects — without mixing unrelated scopes.
      </p>
    </div>
  );
}

// ── Feature Comparison Table ────────────────────────────────────────────────

/** Marketing compare rows — canonical strings live in `pages.pricing.compare.row.*` (pathway-safe). */
const COMPARE_ROW_KEYS = [
  {
    label: "pages.pricing.compare.row.sample.label",
    free: "pages.pricing.compare.row.sample.free",
    paid: "pages.pricing.compare.row.sample.paid",
    partialFree: true,
  },
  {
    label: "pages.pricing.compare.row.lessons.label",
    free: "pages.pricing.compare.row.lessons.free",
    paid: "pages.pricing.compare.row.lessons.paid",
    partialFree: true,
  },
  {
    label: "pages.pricing.compare.row.rationale.label",
    free: "pages.pricing.compare.row.rationale.free",
    paid: "pages.pricing.compare.row.rationale.paid",
    partialFree: true,
  },
  {
    label: "pages.pricing.compare.row.cat.label",
    free: "pages.pricing.compare.row.cat.free",
    paid: "pages.pricing.compare.row.cat.paid",
    partialFree: true,
  },
  {
    label: "pages.pricing.compare.row.analytics.label",
    free: "pages.pricing.compare.row.analytics.free",
    paid: "pages.pricing.compare.row.analytics.paid",
    partialFree: true,
  },
] as const;

export function FeatureComparisonTable() {
  const { t } = useMarketingI18n();

  return (
    <section aria-labelledby="real-compare-heading" data-testid="section-pricing-feature-compare">
      <FadeUp className="mb-6 text-center">
        <h2 id="real-compare-heading" className="nn-marketing-h2">
          {t("pages.pricing.compare.unlockPremium.title")}
        </h2>
        <p className="nn-marketing-body-sm mx-auto mt-2 max-w-2xl text-muted-foreground">
          {t("pages.pricing.compare.unlockPremium.lead")}
        </p>
      </FadeUp>

      <div
        className="nn-elevation-panel overflow-x-auto rounded-2xl"
        style={{ border: `1px solid ${BORDER}`, background: SURFACE }}
      >
        <table className="w-full min-w-[min(100%,560px)] border-collapse text-left text-sm">
          <thead>
            <tr
              style={{
                borderBottom: `1px solid ${BORDER}`,
                background: SOFT_A,
              }}
            >
              <th scope="col" className="px-4 py-3.5 font-semibold" style={{ color: TEXT_PRIMARY }}>
                {t("pages.pricing.compare.colFeature")}
              </th>
              <th scope="col" className="px-4 py-3.5 font-semibold" style={{ color: TEXT_MUTED }}>
                {t("pages.pricing.compare.colFree")}
              </th>
              <th
                scope="col"
                className="px-4 py-3.5 font-semibold"
                style={{ color: "var(--palette-primary)" }}
              >
                {t("pages.pricing.compare.colPaid")}
              </th>
            </tr>
          </thead>
          <tbody>
            {COMPARE_ROW_KEYS.map((row, i) => (
              <tr
                key={row.label}
                style={{
                  borderBottom: i < COMPARE_ROW_KEYS.length - 1 ? `1px solid ${BORDER}` : "none",
                }}
              >
                <th scope="row" className="px-4 py-3.5 align-top font-semibold" style={{ color: TEXT_PRIMARY }}>
                  {t(row.label)}
                </th>
                <td className="px-4 py-3.5 align-top" style={{ color: TEXT_MUTED }}>
                  <span className="flex gap-2">
                    {row.partialFree ? (
                      <Sparkles className="mt-0.5 h-4 w-4 shrink-0" style={{ color: "var(--semantic-info)" }} aria-hidden />
                    ) : (
                      <Lock className="mt-0.5 h-4 w-4 shrink-0" style={{ color: "var(--semantic-warning)" }} aria-hidden />
                    )}
                    <span>{t(row.free)}</span>
                  </span>
                </td>
                <td className="px-4 py-3.5 align-top" style={{ color: TEXT_SECONDARY }}>
                  <span className="flex gap-2">
                    <Check className="mt-0.5 h-4 w-4 shrink-0" style={{ color: "var(--semantic-success)" }} aria-hidden />
                    <span>{t(row.paid)}</span>
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

// ── UnlockFeatureBlock + visual previews ────────────────────────────────────

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
      className="nn-elevation-panel nn-motion-standard flex flex-col gap-0 overflow-hidden rounded-2xl lg:flex-row"
      style={{ border: `1px solid ${BORDER}` }}
    >
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
                <Check className="mt-0.5 h-4 w-4 shrink-0" style={{ color: "var(--semantic-success)" }} aria-hidden />
                {b}
              </li>
            ))}
          </ul>
        </div>
      </div>
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

function StudyPlanPreview() {
  return (
    <div className="space-y-2 text-sm">
      <div className="rounded-xl p-3" style={{ background: SOFT_B, border: `1px solid ${BORDER}` }}>
        <div className="mb-2 flex items-center gap-2">
          <span
            className="inline-flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold"
            style={{
              background: "color-mix(in srgb, var(--palette-primary) 15%, var(--semantic-surface))",
              color: TEXT_PRIMARY,
            }}
          >
            1
          </span>
          <span className="text-xs font-bold" style={{ color: TEXT_PRIMARY }}>Day 1: Core Weak Area Repair</span>
        </div>
        <div className="space-y-1.5 pl-8">
          {["Study lesson", "10 targeted questions", "Review incorrect answers"].map((b) => (
            <p key={b} className="text-xs" style={{ color: TEXT_SECONDARY }}>{b}</p>
          ))}
        </div>
      </div>
      {["Day 2: Second Focus Area", "Day 3: Timed Practice"].map((title, i) => (
        <div
          key={i}
          className="flex items-center gap-2.5 rounded-xl px-3 py-2.5"
          style={{ background: NEUTRAL_MUTED, border: `1px dashed ${BORDER}` }}
        >
          <span
            className="inline-flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold"
            style={{ background: BORDER, color: TEXT_MUTED }}
          >
            {i + 2}
          </span>
          <span className="text-xs font-semibold" style={{ color: TEXT_MUTED }}>{title}</span>
          <Lock className="ml-auto h-3.5 w-3.5" style={{ color: TEXT_MUTED }} aria-hidden />
        </div>
      ))}
    </div>
  );
}

function SmartReviewPreview() {
  const groups = [
    { label: "High Priority Fixes", count: 4, bg: WARNING_SOFT, accent: "var(--semantic-warning)" },
    { label: "Needs Review", count: 6, bg: NEUTRAL_MUTED, accent: TEXT_MUTED },
    { label: "Uncertain Knowledge", count: 5, bg: INFO_SOFT, accent: "var(--semantic-info)" },
    { label: "Established knowledge", count: 8, bg: SUCCESS_SOFT, accent: "var(--role-success, var(--semantic-success))" },
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
          <span className="font-semibold" style={{ color: TEXT_PRIMARY }}>{g.label}</span>
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

function ConfidenceAnalyticsPreview() {
  const cards = [
    { label: "Overconfident Errors", value: "4", bg: WARNING_SOFT, accent: "var(--semantic-warning)" },
    { label: "Uncertain Correct", value: "7", bg: INFO_SOFT, accent: "var(--semantic-info)" },
    { label: "Established knowledge", value: "11", bg: SUCCESS_SOFT, accent: "var(--role-success, var(--semantic-success))" },
  ];
  return (
    <div className="space-y-2.5 text-xs">
      <div
        className="rounded-lg px-3 py-2 text-center text-xs font-semibold"
        style={{
          background: "color-mix(in srgb, var(--palette-primary) 8%, var(--semantic-surface))",
          border: `1px solid color-mix(in srgb, var(--palette-primary) 20%, ${BORDER})`,
          color: TEXT_SECONDARY,
        }}
      >
        High-confidence answers were correct 78% of the time
      </div>
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
            <p className="text-[11px] font-medium" style={{ color: TEXT_MUTED }}>{c.label}</p>
            <p className="mt-1 text-xl font-black tabular-nums" style={{ color: TEXT_PRIMARY }}>{c.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function CatExamPreview() {
  return (
    <div className="space-y-3 text-sm">
      <div
        className="rounded-xl p-4"
        style={{ background: SURFACE_ELEVATED, border: `1px solid ${BORDER}` }}
      >
        <p className="text-xs font-bold uppercase tracking-wider" style={{ color: TEXT_MUTED }}>Readiness Score</p>
        <div className="my-2 flex items-center gap-3">
          <span className="text-4xl font-black tabular-nums" style={{ color: TEXT_PRIMARY }}>68</span>
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
        <div className="mt-3 h-1.5 overflow-hidden rounded-full" style={{ background: NEUTRAL_MUTED }}>
          <div
            className="h-full rounded-full"
            style={{ width: "68%", background: "var(--palette-primary, var(--semantic-info))" }}
          />
        </div>
      </div>
      <div className="grid grid-cols-3 gap-2 text-center text-[11px]">
        {[
          { label: "Clinical accuracy", value: "72%" },
          { label: "Difficulty", value: "Medium+" },
          { label: "Consistency", value: "Improving" },
        ].map((s) => (
          <div
            key={s.label}
            className="rounded-lg p-2"
            style={{ background: SOFT_A, border: `1px solid ${BORDER}` }}
          >
            <p style={{ color: TEXT_MUTED }}>{s.label}</p>
            <p className="mt-0.5 font-bold" style={{ color: TEXT_PRIMARY }}>{s.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

const UNLOCK_BLOCKS = [
  {
    label: "Adaptive Study Plan",
    title: "Know exactly what to study every day",
    bullets: [
      "Personalized plan built from your clinical readiness score and weak areas",
      "Daily tasks: clinical mastery lessons, targeted clinical decision practice, and review sessions",
      "Direct links to every lesson and question",
      "Retest strategy so you know when to take the exam — and when you are safe to practice",
    ],
    accentColor: "var(--palette-primary)",
    preview: <StudyPlanPreview />,
  },
  {
    label: "Strengthen Weak Areas",
    title: "Close the judgment gaps that hurt you most",
    bullets: [
      "Questions grouped by urgency: High Priority, Needs Review, Uncertain, and Strong",
      "See which mistakes matter most for safety and prioritization",
      "Filter by topic, confidence, or correctness",
      "Direct lesson links from every question",
    ],
    accentColor: "var(--semantic-warning)",
    preview: <SmartReviewPreview />,
  },
  {
    label: "Clinical Performance Analytics",
    title: "See exactly where you stand clinically",
    bullets: [
      "Catch overconfident errors: answers you got wrong but thought you knew",
      "Identify uncertain correct answers to reinforce guessed knowledge",
      "Track strong mastery under exam conditions",
      "Prioritized review queue: Where to Focus Next for real shifts",
    ],
    accentColor: "var(--semantic-info)",
    preview: <ConfidenceAnalyticsPreview />,
  },
  {
    label: "Adaptive NCLEX Simulation",
    title: "Simulate the real exam and track readiness",
    bullets: [
      "Adaptive sessions that adjust difficulty in real time",
      "Readiness score with a clear band from Not Ready to Exam Ready",
      "Clinical performance analysis by topic and category",
      "Clinical decision questions with full rationales",
    ],
    accentColor: "var(--semantic-success)",
    preview: <CatExamPreview />,
  },
];

export function PricingUnlockSection() {
  return (
    <section aria-labelledby="what-you-unlock-heading">
      <FadeUp className="mb-10 text-center">
        <h2 id="what-you-unlock-heading" className="nn-marketing-h2">
          Train your brain for the NCLEX and the bedside
        </h2>
        <p className="nn-marketing-body-sm mx-auto mt-2 max-w-2xl text-muted-foreground">
          Start your free trial and get instant access to exam prep, clinical thinking drills, and early-career support
        </p>
      </FadeUp>
      <div className="space-y-6">
        {UNLOCK_BLOCKS.map((block) => (
          <UnlockFeatureBlock key={block.label} {...block} />
        ))}
      </div>
    </section>
  );
}

// ── Product Preview Grid ────────────────────────────────────────────────────

import { ScreenshotProductCard } from "@/components/marketing/screenshot-feature-grid";
import type { ScreenshotId } from "@/lib/marketing/screenshot-registry";

const PRODUCT_AREAS: {
  screenshotId: ScreenshotId;
  icon: ComponentType<{ className?: string }>;
  title: string;
  desc: string;
  detail: string;
}[] = [
  {
    screenshotId: 1,
    icon: BookOpen,
    title: "Clinical Decision Practice",
    desc: "Real-world patient scenarios with stems, options, and a Clinical Thinking Breakdown in one view.",
    detail: "Why the safest answer is correct, why distractors fail, key takeaway, and linked Clinical Mastery Lessons",
  },
  {
    screenshotId: 6,
    icon: Target,
    title: "Adaptive NCLEX Simulation",
    desc: "Adaptive sessions that adjust difficulty item by item while scoring readiness on a 0 to 100 scale.",
    detail: "Adaptive difficulty, readiness scoring, category breakdown, historical trend",
  },
  {
    screenshotId: 7,
    icon: BarChart3,
    title: "Clinical Performance & Remediation",
    desc: "Structured results with weak areas, strengths, confidence patterns, and a plan that closes bedside gaps.",
    detail: "Strengthen weak areas, study plan, clinical performance analytics, retest strategy",
  },
];

export function ProductPreviewGrid() {
  return (
    <section aria-labelledby="product-preview-heading">
      <FadeUp className="mb-8 text-center">
        <h2 id="product-preview-heading" className="nn-marketing-h2">
          Exam prep, simulation, and remediation — connected
        </h2>
        <p className="nn-marketing-body-sm mx-auto mt-2 max-w-2xl text-muted-foreground">
          One system that shows you what to study, stress-tests clinical judgment, and helps you strengthen weak areas before your first shift
        </p>
      </FadeUp>
      <div className="grid gap-4 sm:grid-cols-3">
        {PRODUCT_AREAS.map((area) => (
          <ScreenshotProductCard
            key={area.title}
            screenshotId={area.screenshotId}
            icon={<area.icon className="nn-icon-md" />}
            title={area.title}
            description={area.desc}
            detail={area.detail}
          />
        ))}
      </div>
    </section>
  );
}

// ── Trust Reassurance ───────────────────────────────────────────────────────

const TRUST_POINTS = [
  {
    icon: Target,
    headline: "From student to practicing nurse",
    body: "You are not just preparing for a test — you are preparing for real patients. NurseNest helps you build confidence for your first year, strengthen clinical judgment under pressure, and transition from student to practicing clinician.",
  },
  {
    icon: ShieldCheck,
    headline: "Recognize, prioritize, and act safely",
    body: "Drills emphasize early deterioration, safe prioritization, and the delegation decisions new grads face — because the goal is not only to pass, but to practice safely.",
  },
  {
    icon: BarChart3,
    headline: "Avoid common new-grad mistakes",
    body: "Because passing the exam is step one. Practicing confidently — without freezing on your first shifts — is what matters next.",
  },
];

export function PricingTrustReassurance() {
  return (
    <section aria-labelledby="trust-heading">
      <FadeUp className="mb-8 text-center">
        <h2 id="trust-heading" className="nn-marketing-h2">
          Support Beyond the Exam
        </h2>
      </FadeUp>
      <div className="grid gap-5 sm:grid-cols-3 sm:gap-6">
        {TRUST_POINTS.map((p) => (
          <div
            key={p.headline}
            className="nn-elevation-panel nn-motion-standard rounded-2xl p-7"
            style={{ background: SURFACE_ELEVATED, border: `1px solid ${BORDER}` }}
          >
            <div
              className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl"
              style={{
                background: `color-mix(in srgb, var(--semantic-info) 10%, ${SURFACE})`,
                border: `1px solid color-mix(in srgb, var(--semantic-info) 18%, ${BORDER})`,
              }}
            >
              <p.icon className="h-5 w-5" style={{ color: "var(--semantic-info)" }} aria-hidden />
            </div>
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

// ── Final CTA ───────────────────────────────────────────────────────────────

export function PricingCTA({ plansHref }: { plansHref: string }) {
  return (
    <section
      className="nn-gradient-safe rounded-3xl px-8 py-14 text-center shadow-[var(--elevation-rest)] sm:px-12 sm:py-16"
      style={{
        background: `
          linear-gradient(
            160deg,
            color-mix(in srgb, var(--palette-primary) 7%, ${SURFACE}) 0%,
            color-mix(in srgb, var(--semantic-panel-cool) 20%, ${SURFACE}) 100%
          )`,
        border: `1px solid color-mix(in srgb, var(--palette-primary) 20%, ${BORDER})`,
      }}
    >
      <FadeUp>
        <h2 className="nn-marketing-h2 mb-3">Do not just pass the exam.</h2>
        <p className="nn-marketing-body-sm mx-auto mb-8 max-w-lg text-muted-foreground">
          Be ready for the responsibility that comes after it. Choose a plan above, then continue to secure checkout.
          Eligible plans may still include a short trial at checkout. Start your training today.
        </p>
      </FadeUp>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <Link href={plansHref} className={MARKETING_PRIMARY_CTA_CLASS}>
          Continue to checkout
        </Link>
        <Link href="#pricing-plans-heading" className={MARKETING_SECONDARY_CTA_CLASS}>
          View Plans
        </Link>
      </div>
      <p className="mt-3 text-xs text-muted-foreground">
        No charge today. Cancel anytime before your trial ends.
      </p>
      <p className="mt-1 text-[11px] text-muted-foreground">
        Billing begins automatically after 3 days unless cancelled.
      </p>
    </section>
  );
}
