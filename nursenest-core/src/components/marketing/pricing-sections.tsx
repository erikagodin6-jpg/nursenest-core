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
  Brain,
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
import { SI_CONV_MARKETING } from "@/lib/marketing/si-conv-clinical-reasoning";

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

const VALUE_PROP_META = [
  { icon: Target, labelKey: "pages.pricing.valueProps.0", accent: "var(--palette-primary)" },
  { icon: Eye, labelKey: "pages.pricing.valueProps.1", accent: "var(--semantic-warning)" },
  { icon: ClipboardCheck, labelKey: "pages.pricing.valueProps.2", accent: "var(--semantic-info)" },
  { icon: TrendingUp, labelKey: "pages.pricing.valueProps.3", accent: "var(--semantic-success)" },
] as const;

export function ValuePropsStrip() {
  const { t } = useMarketingI18n();

  return (
    <StaggerGroup className="grid grid-cols-2 gap-4 sm:grid-cols-4 sm:gap-5" staggerMs={65} whenInView once>
      {VALUE_PROP_META.map(({ icon: Icon, labelKey, accent }) => (
        <StaggerItem key={labelKey} variant="softReveal">
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
              {t(labelKey)}
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

const WHY_POINT_META = [
  {
    icon: Crosshair,
    titleKey: "pages.pricing.why.0.title",
    descKey: "pages.pricing.why.0.body",
    accent: "var(--palette-primary)",
  },
  {
    icon: Eye,
    titleKey: "pages.pricing.why.1.title",
    descKey: "pages.pricing.why.1.body",
    accent: "var(--semantic-warning)",
  },
  {
    icon: ShieldCheck,
    titleKey: "pages.pricing.why.2.title",
    descKey: "pages.pricing.why.2.body",
    accent: "var(--semantic-success)",
  },
] as const;

export function WhyItWorks() {
  const { t } = useMarketingI18n();

  return (
    <section aria-labelledby="why-heading">
      <FadeUp className="mb-10 text-center">
        <h2 id="why-heading" className="nn-marketing-h2">
          {t("pages.pricing.why.heading")}
        </h2>
      </FadeUp>
      <StaggerGroup className="grid gap-5 sm:grid-cols-3 sm:gap-6" staggerMs={65} whenInView once>
        {WHY_POINT_META.map((p) => (
          <StaggerItem key={p.titleKey} variant="softReveal">
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
              <h3 className="nn-marketing-h4">{t(p.titleKey)}</h3>
              <p className="text-sm leading-relaxed" style={{ color: TEXT_SECONDARY }}>
                {t(p.descKey)}
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
  const { t } = useMarketingI18n();

  return (
    <div
      className="nn-elevation-panel rounded-xl px-6 py-5 text-center"
      style={{
        background: `color-mix(in srgb, var(--semantic-info) 5%, ${SURFACE})`,
        border: `1px solid color-mix(in srgb, var(--semantic-info) 18%, ${BORDER})`,
      }}
    >
      <p className="text-sm font-semibold" style={{ color: TEXT_PRIMARY }}>
        {t("pages.pricing.alliedClarity.title")}
      </p>
      <p className="mt-1.5 text-xs" style={{ color: TEXT_SECONDARY }}>
        {t("pages.pricing.alliedClarity.body")}
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
      <div
        className="mt-4 rounded-2xl border p-4"
        style={{
          borderColor: `color-mix(in srgb, var(--semantic-brand) 20%, ${BORDER})`,
          background: `color-mix(in srgb, var(--semantic-brand) 5%, ${SURFACE})`,
        }}
      >
        <div className="flex gap-3">
          <Brain className="mt-0.5 h-5 w-5 shrink-0" style={{ color: "var(--semantic-brand)" }} aria-hidden />
          <div>
            <p className="text-sm font-bold" style={{ color: TEXT_PRIMARY }}>
              Feature comparison: {SI_CONV_MARKETING.shortLabel}
            </p>
            <p className="mt-1 text-sm leading-6" style={{ color: TEXT_SECONDARY }}>
              Included for RN, RPN/PN, NP, Allied Health, RT, and New Grad supported questions. SI/CONV helps learners move from answer checking to nursing clinical judgment by naming the patient situation, important cues, likely issue, and reasoning behind the answer.
            </p>
          </div>
        </div>
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
  const { t } = useMarketingI18n();

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
          <span className="text-xs font-bold" style={{ color: TEXT_PRIMARY }}>
            {t("pages.pricing.unlock.preview.studyPlan.day1")}
          </span>
        </div>
        <div className="space-y-1.5 pl-8">
          {[
            t("pages.pricing.unlock.preview.studyPlan.day1Item0"),
            t("pages.pricing.unlock.preview.studyPlan.day1Item1"),
            t("pages.pricing.unlock.preview.studyPlan.day1Item2"),
          ].map((b) => (
            <p key={b} className="text-xs" style={{ color: TEXT_SECONDARY }}>{b}</p>
          ))}
        </div>
      </div>
      {[
        t("pages.pricing.unlock.preview.studyPlan.day2"),
        t("pages.pricing.unlock.preview.studyPlan.day3"),
      ].map((title, i) => (
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
  const { t } = useMarketingI18n();
  const groups = [
    { label: t("pages.pricing.unlock.preview.smartReview.group0"), count: 4, bg: WARNING_SOFT, accent: "var(--semantic-warning)" },
    { label: t("pages.pricing.unlock.preview.smartReview.group1"), count: 6, bg: NEUTRAL_MUTED, accent: TEXT_MUTED },
    { label: t("pages.pricing.unlock.preview.smartReview.group2"), count: 5, bg: INFO_SOFT, accent: "var(--semantic-info)" },
    { label: t("pages.pricing.unlock.preview.smartReview.group3"), count: 8, bg: SUCCESS_SOFT, accent: "var(--role-success, var(--semantic-success))" },
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
            {t("pages.pricing.unlock.preview.smartReview.count", { count: g.count })}
          </span>
        </div>
      ))}
    </div>
  );
}

function ConfidenceAnalyticsPreview() {
  const { t } = useMarketingI18n();
  const cards = [
    { label: t("pages.pricing.unlock.preview.analytics.card0"), value: "4", bg: WARNING_SOFT, accent: "var(--semantic-warning)" },
    { label: t("pages.pricing.unlock.preview.analytics.card1"), value: "7", bg: INFO_SOFT, accent: "var(--semantic-info)" },
    { label: t("pages.pricing.unlock.preview.analytics.card2"), value: "11", bg: SUCCESS_SOFT, accent: "var(--role-success, var(--semantic-success))" },
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
        {t("pages.pricing.unlock.preview.analytics.summary")}
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
  const { t } = useMarketingI18n();
  return (
    <div className="space-y-3 text-sm">
      <div
        className="rounded-xl p-4"
        style={{ background: SURFACE_ELEVATED, border: `1px solid ${BORDER}` }}
      >
        <p className="text-xs font-bold uppercase tracking-wider" style={{ color: TEXT_MUTED }}>
          {t("pages.pricing.unlock.preview.cat.readinessLabel")}
        </p>
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
            {t("pages.pricing.unlock.preview.cat.readinessBand")}
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
          { label: t("pages.pricing.unlock.preview.cat.stat0"), value: "72%" },
          { label: t("pages.pricing.unlock.preview.cat.stat1"), value: "Medium+" },
          { label: t("pages.pricing.unlock.preview.cat.stat2"), value: "Improving" },
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

export function PricingUnlockSection() {
  const { t } = useMarketingI18n();
  const unlockBlocks = [
    {
      label: t("pages.pricing.unlock.block0.label"),
      title: t("pages.pricing.unlock.block0.title"),
      bullets: [
        t("pages.pricing.unlock.block0.bullet0"),
        t("pages.pricing.unlock.block0.bullet1"),
        t("pages.pricing.unlock.block0.bullet2"),
        t("pages.pricing.unlock.block0.bullet3"),
      ],
      accentColor: "var(--palette-primary)",
      preview: <StudyPlanPreview />,
    },
    {
      label: t("pages.pricing.unlock.block1.label"),
      title: t("pages.pricing.unlock.block1.title"),
      bullets: [
        t("pages.pricing.unlock.block1.bullet0"),
        t("pages.pricing.unlock.block1.bullet1"),
        t("pages.pricing.unlock.block1.bullet2"),
        t("pages.pricing.unlock.block1.bullet3"),
      ],
      accentColor: "var(--semantic-warning)",
      preview: <SmartReviewPreview />,
    },
    {
      label: t("pages.pricing.unlock.block2.label"),
      title: t("pages.pricing.unlock.block2.title"),
      bullets: [
        t("pages.pricing.unlock.block2.bullet0"),
        t("pages.pricing.unlock.block2.bullet1"),
        t("pages.pricing.unlock.block2.bullet2"),
        t("pages.pricing.unlock.block2.bullet3"),
      ],
      accentColor: "var(--semantic-info)",
      preview: <ConfidenceAnalyticsPreview />,
    },
    {
      label: t("pages.pricing.unlock.block3.label"),
      title: t("pages.pricing.unlock.block3.title"),
      bullets: [
        t("pages.pricing.unlock.block3.bullet0"),
        t("pages.pricing.unlock.block3.bullet1"),
        t("pages.pricing.unlock.block3.bullet2"),
        t("pages.pricing.unlock.block3.bullet3"),
      ],
      accentColor: "var(--semantic-success)",
      preview: <CatExamPreview />,
    },
  ];

  return (
    <section aria-labelledby="what-you-unlock-heading">
      <FadeUp className="mb-10 text-center">
        <h2 id="what-you-unlock-heading" className="nn-marketing-h2">
          {t("pages.pricing.unlock.heading")}
        </h2>
        <p className="nn-marketing-body-sm mx-auto mt-2 max-w-2xl text-muted-foreground">
          {t("pages.pricing.unlock.lead")}
        </p>
      </FadeUp>
      <div className="space-y-6">
        {unlockBlocks.map((block) => (
          <UnlockFeatureBlock key={block.label} {...block} />
        ))}
      </div>
    </section>
  );
}

// ── Product Preview Grid ────────────────────────────────────────────────────

import { ScreenshotProductCard } from "@/components/marketing/screenshot-feature-grid";
import type { ScreenshotId } from "@/lib/marketing/screenshot-registry";

const PRODUCT_AREA_META: {
  screenshotId: ScreenshotId;
  icon: ComponentType<{ className?: string }>;
  titleKey: string;
  descKey: string;
  detailKey: string;
}[] = [
  {
    screenshotId: 1,
    icon: BookOpen,
    titleKey: "pages.pricing.productPreview.card0.title",
    descKey: "pages.pricing.productPreview.card0.body",
    detailKey: "pages.pricing.productPreview.card0.detail",
  },
  {
    screenshotId: 6,
    icon: Target,
    titleKey: "pages.pricing.productPreview.card1.title",
    descKey: "pages.pricing.productPreview.card1.body",
    detailKey: "pages.pricing.productPreview.card1.detail",
  },
  {
    screenshotId: 7,
    icon: BarChart3,
    titleKey: "pages.pricing.productPreview.card2.title",
    descKey: "pages.pricing.productPreview.card2.body",
    detailKey: "pages.pricing.productPreview.card2.detail",
  },
];

export function ProductPreviewGrid() {
  const { t } = useMarketingI18n();

  return (
    <section aria-labelledby="product-preview-heading">
      <FadeUp className="mb-8 text-center">
        <h2 id="product-preview-heading" className="nn-marketing-h2">
          {t("pages.pricing.productPreview.heading")}
        </h2>
        <p className="nn-marketing-body-sm mx-auto mt-2 max-w-2xl text-muted-foreground">
          {t("pages.pricing.productPreview.lead")}
        </p>
      </FadeUp>
      <div className="grid gap-4 sm:grid-cols-3">
        {PRODUCT_AREA_META.map((area) => (
          <ScreenshotProductCard
            key={area.titleKey}
            screenshotId={area.screenshotId}
            icon={<area.icon className="nn-icon-md" />}
            title={t(area.titleKey)}
            description={t(area.descKey)}
            detail={t(area.detailKey)}
          />
        ))}
      </div>
    </section>
  );
}

// ── Trust Reassurance ───────────────────────────────────────────────────────

const TRUST_POINT_META = [
  {
    icon: Target,
    headlineKey: "pages.pricing.trust.point0.title",
    bodyKey: "pages.pricing.trust.point0.body",
  },
  {
    icon: ShieldCheck,
    headlineKey: "pages.pricing.trust.point1.title",
    bodyKey: "pages.pricing.trust.point1.body",
  },
  {
    icon: BarChart3,
    headlineKey: "pages.pricing.trust.point2.title",
    bodyKey: "pages.pricing.trust.point2.body",
  },
];

export function PricingTrustReassurance() {
  const { t } = useMarketingI18n();

  return (
    <section aria-labelledby="trust-heading">
      <FadeUp className="mb-8 text-center">
        <h2 id="trust-heading" className="nn-marketing-h2">
          {t("pages.pricing.trust.heading")}
        </h2>
      </FadeUp>
      <div className="grid gap-5 sm:grid-cols-3 sm:gap-6">
        {TRUST_POINT_META.map((p) => (
          <div
            key={p.headlineKey}
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
            <h3 className="nn-marketing-h4 mb-2">{t(p.headlineKey)}</h3>
            <p className="text-sm leading-relaxed" style={{ color: TEXT_SECONDARY }}>
              {t(p.bodyKey)}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

// ── Final CTA ───────────────────────────────────────────────────────────────

export function PricingCTA({ plansHref }: { plansHref: string }) {
  const { t } = useMarketingI18n();

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
        <h2 className="nn-marketing-h2 mb-3">{t("pages.pricing.finalCta.heading")}</h2>
        <p className="nn-marketing-body-sm mx-auto mb-8 max-w-lg text-muted-foreground">
          {t("pages.pricing.finalCta.body")}
        </p>
      </FadeUp>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <Link href={plansHref} className={MARKETING_PRIMARY_CTA_CLASS}>
          {t("pages.pricing.finalCta.primary")}
        </Link>
        <Link href="#pricing-plans-heading" className={MARKETING_SECONDARY_CTA_CLASS}>
          {t("pages.pricing.finalCta.secondary")}
        </Link>
      </div>
      <p className="mt-3 text-xs text-muted-foreground">
        {t("pages.pricing.trial.shortLead")}
      </p>
      <p className="mt-1 text-[11px] text-muted-foreground">
        {t("pages.pricing.trial.shortFinePrint")}
      </p>
    </section>
  );
}
