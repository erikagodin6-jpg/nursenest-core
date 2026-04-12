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
import { FadeUp } from "@/lib/motion";

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
  { icon: Target, label: "Personalized Study Plan" },
  { icon: Eye, label: "Smart Review of Mistakes" },
  { icon: ClipboardCheck, label: "Real Exam-Style Questions" },
  { icon: TrendingUp, label: "Readiness Tracking" },
] as const;

export function ValuePropsStrip() {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
      {VALUE_PROPS.map(({ icon: Icon, label }) => (
        <div
          key={label}
          className="nn-elevation-panel flex flex-col items-center gap-2.5 rounded-xl px-4 py-5 text-center"
          style={{
            background: SURFACE_ELEVATED,
            border: `1px solid ${BORDER}`,
          }}
        >
          <Icon
            className="h-5 w-5"
            style={{ color: "var(--palette-primary)" }}
            aria-hidden
          />
          <span
            className="text-xs font-semibold leading-tight"
            style={{ color: TEXT_PRIMARY }}
          >
            {label}
          </span>
        </div>
      ))}
    </div>
  );
}

// ── Section 6: What You Get (Features Grid) ─────────────────────────────────

const FEATURES = [
  {
    icon: Layers,
    title: "Unlimited Questions",
    desc: "Thousands of exam-style questions with detailed rationales for every answer",
    accent: "var(--palette-primary)",
  },
  {
    icon: Eye,
    title: "Smart Review System",
    desc: "Questions grouped by urgency so you fix your weakest areas first",
    accent: "var(--semantic-warning)",
  },
  {
    icon: Target,
    title: "Adaptive Study Plan",
    desc: "A personalized daily plan built from your readiness score and weak areas",
    accent: "var(--semantic-info)",
  },
  {
    icon: TrendingUp,
    title: "Readiness Score",
    desc: "Know exactly where you stand on a 0 to 100 scale before your exam",
    accent: "var(--semantic-success)",
  },
  {
    icon: ClipboardCheck,
    title: "Practice Tests and CAT Exams",
    desc: "Adaptive exams that adjust difficulty in real time, just like the real thing",
    accent: "var(--palette-primary)",
  },
  {
    icon: BarChart3,
    title: "Detailed Performance Tracking",
    desc: "Confidence patterns, accuracy trends, and focused review recommendations",
    accent: "var(--semantic-info)",
  },
] as const;

export function PricingFeaturesGrid() {
  return (
    <section aria-labelledby="features-heading">
      <FadeUp className="mb-8 text-center">
        <h2 id="features-heading" className="nn-marketing-h2">
          Everything You Need to Pass
        </h2>
        <p className="nn-marketing-body-sm mx-auto mt-2 max-w-2xl text-muted-foreground">
          Every plan includes full access to all of these features
        </p>
      </FadeUp>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {FEATURES.map((f) => (
          <div
            key={f.title}
            className="nn-elevation-panel nn-motion-standard flex flex-col gap-3 rounded-2xl p-6"
            style={{
              background: SURFACE_ELEVATED,
              border: `1px solid ${BORDER}`,
            }}
          >
            <div
              className="flex h-10 w-10 items-center justify-center rounded-xl"
              style={{
                background: `color-mix(in srgb, ${f.accent} 10%, ${SURFACE})`,
                border: `1px solid color-mix(in srgb, ${f.accent} 20%, ${BORDER})`,
              }}
            >
              <f.icon className="h-5 w-5" style={{ color: f.accent }} aria-hidden />
            </div>
            <h3 className="nn-marketing-h4">{f.title}</h3>
            <p className="text-sm leading-relaxed" style={{ color: TEXT_SECONDARY }}>
              {f.desc}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

// ── Section 7: Why NurseNest Works ──────────────────────────────────────────

const WHY_POINTS = [
  {
    icon: Crosshair,
    title: "You Are Guided, Not Guessing",
    desc: "Your study plan is built from your actual performance data, not a generic syllabus.",
  },
  {
    icon: Eye,
    title: "Focus on Weak Areas",
    desc: "The system identifies where you struggle and prioritizes those topics automatically.",
  },
  {
    icon: ShieldCheck,
    title: "Know When You Are Ready",
    desc: "Readiness scoring tells you when your weak areas are resolved and you can walk into your exam with confidence.",
  },
] as const;

export function WhyItWorks() {
  return (
    <section aria-labelledby="why-heading">
      <FadeUp className="mb-8 text-center">
        <h2 id="why-heading" className="nn-marketing-h2">
          Why NurseNest Works
        </h2>
      </FadeUp>
      <div className="grid gap-4 sm:grid-cols-3">
        {WHY_POINTS.map((p) => (
          <div
            key={p.title}
            className="nn-elevation-panel nn-motion-standard flex flex-col gap-3 rounded-2xl p-6"
            style={{ background: SURFACE_ELEVATED, border: `1px solid ${BORDER}` }}
          >
            <p.icon className="h-6 w-6" style={{ color: "var(--palette-primary)" }} aria-hidden />
            <h3 className="nn-marketing-h4">{p.title}</h3>
            <p className="text-sm leading-relaxed" style={{ color: TEXT_SECONDARY }}>
              {p.desc}
            </p>
          </div>
        ))}
      </div>
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
        A Paramedic Plan Includes Paramedic Content Only.
        Each career line is a separate plan with its own focused content.
      </p>
    </div>
  );
}

// ── Feature Comparison Table ────────────────────────────────────────────────

const COMPARISON_ROWS: {
  feature: string;
  free: { label: string; indicator: "partial" | "none" };
  premium: string;
}[] = [
  {
    feature: "Adaptive Study Plan",
    free: { label: "Day 1 preview only", indicator: "partial" },
    premium: "Full personalized plan with lesson and practice links",
  },
  {
    feature: "Smart Review",
    free: { label: "High Priority Fixes only", indicator: "partial" },
    premium: "All 4 groups with filters and lesson links",
  },
  {
    feature: "Confidence Analytics",
    free: { label: "Summary strip only", indicator: "partial" },
    premium: "Full patterns, focus areas, and review priority",
  },
  {
    feature: "CAT Exam Simulation",
    free: { label: "Limited access", indicator: "partial" },
    premium: "Unlimited sessions with full readiness reporting",
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
    <section aria-labelledby="real-compare-heading">
      <FadeUp className="mb-6 text-center">
        <h2 id="real-compare-heading" className="nn-marketing-h2">
          What Changes When You Unlock Premium
        </h2>
        <p className="nn-marketing-body-sm mx-auto mt-2 max-w-2xl text-muted-foreground">
          Every feature below is built into the platform. See exactly what you get with full access.
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
                Feature
              </th>
              <th scope="col" className="px-4 py-3.5 font-semibold" style={{ color: TEXT_MUTED }}>
                Free
              </th>
              <th
                scope="col"
                className="px-4 py-3.5 font-semibold"
                style={{ color: "var(--palette-primary)" }}
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
                <th scope="row" className="px-4 py-3.5 align-top font-semibold" style={{ color: TEXT_PRIMARY }}>
                  {row.feature}
                </th>
                <td className="px-4 py-3.5 align-top" style={{ color: TEXT_MUTED }}>
                  <span className="flex gap-2">
                    {row.free.indicator === "partial" ? (
                      <Sparkles className="mt-0.5 h-4 w-4 shrink-0" style={{ color: "var(--semantic-info)" }} aria-hidden />
                    ) : (
                      <Lock className="mt-0.5 h-4 w-4 shrink-0" style={{ color: "var(--semantic-warning)" }} aria-hidden />
                    )}
                    <span>{row.free.label}</span>
                  </span>
                </td>
                <td className="px-4 py-3.5 align-top" style={{ color: TEXT_SECONDARY }}>
                  <span className="flex gap-2">
                    <Check className="mt-0.5 h-4 w-4 shrink-0" style={{ color: "var(--semantic-success)" }} aria-hidden />
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
    { label: "Strong Knowledge", value: "11", bg: SUCCESS_SOFT, accent: "var(--role-success, var(--semantic-success))" },
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
      "Personalized plan built from your readiness score and weak areas",
      "Daily tasks: lessons, targeted practice, and review sessions",
      "Direct links to every lesson and question",
      "Retest strategy so you know when to take the exam",
    ],
    accentColor: "var(--palette-primary)",
    preview: <StudyPlanPreview />,
  },
  {
    label: "Smart Review",
    title: "Fix your weak areas faster",
    bullets: [
      "Questions grouped by urgency: High Priority, Needs Review, Uncertain, and Strong",
      "See which mistakes matter most and fix them first",
      "Filter by topic, confidence, or correctness",
      "Direct lesson links from every question",
    ],
    accentColor: "var(--semantic-warning)",
    preview: <SmartReviewPreview />,
  },
  {
    label: "Confidence Analytics",
    title: "See exactly where you stand",
    bullets: [
      "Catch overconfident errors: answers you got wrong but thought you knew",
      "Identify uncertain correct answers to reinforce guessed knowledge",
      "Track strong mastery under exam conditions",
      "Prioritized review queue: Where to Focus Next",
    ],
    accentColor: "var(--semantic-info)",
    preview: <ConfidenceAnalyticsPreview />,
  },
  {
    label: "Full Practice Exams",
    title: "Simulate the real exam and track your readiness",
    bullets: [
      "Adaptive CAT exams that adjust difficulty in real time",
      "Readiness score with a clear band from Not Ready to Exam Ready",
      "Detailed performance analysis by topic and category",
      "Real exam-style questions with full rationales",
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
          Everything You Need to Pass, in One System
        </h2>
        <p className="nn-marketing-body-sm mx-auto mt-2 max-w-2xl text-muted-foreground">
          Start your free trial and get instant access to all of these
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
    title: "Practice Interface",
    desc: "Question stem, answer options, and full rationale, all visible at once.",
    detail: "Correct answer, why this is correct, why other options are wrong, key takeaway, related lessons",
  },
  {
    screenshotId: 6,
    icon: Target,
    title: "CAT Exam Mode",
    desc: "An adaptive exam that adjusts difficulty item by item, scoring your readiness on a 0 to 100 scale.",
    detail: "Adaptive difficulty, readiness scoring, category breakdown, historical trend",
  },
  {
    screenshotId: 7,
    icon: BarChart3,
    title: "Results and Remediation",
    desc: "Structured results with weak areas, strengths, confidence patterns, and a personalized study plan.",
    detail: "Smart review, study plan, confidence analytics, retest strategy",
  },
];

export function ProductPreviewGrid() {
  return (
    <section aria-labelledby="product-preview-heading">
      <FadeUp className="mb-8 text-center">
        <h2 id="product-preview-heading" className="nn-marketing-h2">
          Practice, Test, and Review: All Connected
        </h2>
        <p className="nn-marketing-body-sm mx-auto mt-2 max-w-2xl text-muted-foreground">
          One system that shows you exactly what to study, tests your readiness, and helps you fix weak areas
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
    headline: "Designed to Help You Pass on Your First Attempt",
    body: "Structured around real exam blueprints: NCLEX, REx-PN, and specialty exams. Not generic nursing content.",
  },
  {
    icon: ShieldCheck,
    headline: "Your Study Is Structured, Not Random",
    body: "Every session connects to your weak areas and confidence data. You always know what to study next.",
  },
  {
    icon: BarChart3,
    headline: "You Will Know When You Are Ready",
    body: "Readiness scoring, weak area tracking, and confidence analytics show your progress clearly.",
  },
];

export function PricingTrustReassurance() {
  return (
    <section aria-labelledby="trust-heading">
      <FadeUp className="mb-8 text-center">
        <h2 id="trust-heading" className="nn-marketing-h2">
          Built for Students Who Want to Pass
        </h2>
      </FadeUp>
      <div className="grid gap-4 sm:grid-cols-3">
        {TRUST_POINTS.map((p) => (
          <div
            key={p.headline}
            className="nn-elevation-panel nn-motion-standard rounded-2xl p-6"
            style={{ background: SURFACE_ELEVATED, border: `1px solid ${BORDER}` }}
          >
            <p.icon className="nn-icon-lg mb-3 text-[var(--semantic-info)]" aria-hidden />
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
      className="rounded-2xl p-10 text-center shadow-[var(--elevation-rest)]"
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
        <h2 className="nn-marketing-h2 mb-3">Start Studying Smarter Today</h2>
        <p className="nn-marketing-body-sm mx-auto mb-8 max-w-lg text-muted-foreground">
          Try everything free. No charge today. Cancel anytime before your trial ends.
        </p>
      </FadeUp>
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
