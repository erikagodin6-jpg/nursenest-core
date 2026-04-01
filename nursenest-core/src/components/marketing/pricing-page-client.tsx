"use client";

import type { TierCode } from "@prisma/client";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { ArrowRight, Check } from "lucide-react";
import { buildTierPricingNarrative } from "@/lib/conversion/pricing-catalog";
import { trackClientEvent } from "@/lib/observability/posthog-client";
import { PH } from "@/lib/observability/posthog-conversion-events";
import { useMarketingI18n } from "@/lib/marketing-i18n";
import { withMarketingLocale } from "@/lib/i18n/marketing-path";
import { useNursenestRegion } from "@/lib/region/use-nursenest-region";
import {
  HUB,
  RN,
  loginWithCallback,
  rnQuestions,
} from "@/lib/marketing/marketing-entry-routes";
import { LEGAL_POLICY_BUNDLE_VERSION } from "@/lib/legal/legal-config";
import type { BillingDuration } from "@/lib/stripe/pricing-map";

type PlanRow = {
  tier: TierCode;
  country: "CA" | "US";
  duration: BillingDuration;
  checkoutAvailable: boolean;
  totalLabel: string;
  monthlyEquivalentLabel: string;
  savingsVsMonthlyPercent: number;
  isBestValue: boolean;
  isMostPopular: boolean;
};

type Segment = "rpn" | "lvn" | "rn" | "np" | "allied";

function segmentToTierCountry(segment: Segment, country: "CA" | "US"): { tier: TierCode; country: "CA" | "US" } {
  switch (segment) {
    case "rpn":
      return { tier: "RPN", country: "CA" };
    case "lvn":
      return { tier: "LVN_LPN", country: "US" };
    case "rn":
      return { tier: "RN", country };
    case "np":
      return { tier: "NP", country };
    case "allied":
      return { tier: "ALLIED", country };
    default:
      return { tier: "RN", country };
  }
}

const DURATION_KEYS: Record<BillingDuration, string> = {
  monthly: "pages.pricing.duration.monthly",
  "3-month": "pages.pricing.duration.3month",
  "6-month": "pages.pricing.duration.6month",
  yearly: "pages.pricing.duration.yearly",
};

type HomeStatsPayload = {
  totalLessons?: number;
  questionCount?: number;
  totalFlashcards?: number;
};

export function PricingPageClient({
  heading,
  intro,
}: {
  heading: string;
  intro: string;
}) {
  const [segment, setSegment] = useState<Segment>("rn");
  const [country, setCountry] = useState<"CA" | "US">("CA");
  const [plans, setPlans] = useState<PlanRow[]>([]);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [policiesAccepted, setPoliciesAccepted] = useState(false);
  const [stats, setStats] = useState<HomeStatsPayload | null>(null);
  const { locale, t } = useMarketingI18n();
  const { region } = useNursenestRegion();
  const institutionalHref = withMarketingLocale(locale, "/for-institutions");

  const localize = useCallback((href: string) => withMarketingLocale(locale, href), [locale]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/pricing/options");
        const data = await res.json();
        if (!res.ok) throw new Error("load_failed");
        if (!cancelled) setPlans(data.plans ?? []);
      } catch {
        if (!cancelled) setLoadError(t("pages.pricing.error.loadPlans"));
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [t]);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/public/home-stats")
      .then((r) => (r.ok ? r.json() : null))
      .then((d: HomeStatsPayload | null) => {
        if (!cancelled && d) setStats(d);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  const { tier, country: effectiveCountry } = segmentToTierCountry(segment, country);
  const narrative = buildTierPricingNarrative(t, tier);

  const filtered = useMemo(
    () => plans.filter((p) => p.tier === tier && p.country === effectiveCountry),
    [plans, tier, effectiveCountry],
  );

  const tryQuestionsHref = localize(rnQuestions(region));
  const examsHref = localize(loginWithCallback(RN.appExams));
  const lessonsHubHref = localize(HUB.examLessons);
  const toolsHref = localize(HUB.tools);

  const termsHref = localize("/terms");
  const privacyHref = localize("/privacy");
  const refundHref = localize("/refund-policy");

  const startCheckout = useCallback(
    async (duration: BillingDuration) => {
      setCheckoutError(null);
      if (!policiesAccepted) {
        setCheckoutError(t("pages.pricing.checkout.mustAcceptPolicies"));
        return;
      }
      setCheckoutLoading(true);
      trackClientEvent(PH.checkoutStarted, {
        country: effectiveCountry,
        tier: String(tier),
        duration: String(duration),
      });
      try {
        const res = await fetch("/api/subscriptions/checkout", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            country: effectiveCountry,
            tier,
            duration,
            acceptPolicies: true,
            policyVersion: LEGAL_POLICY_BUNDLE_VERSION,
          }),
        });
        const data = await res.json();
        if (res.status === 401) {
          setCheckoutError(t("pages.pricing.error.checkoutSignIn"));
          setCheckoutLoading(false);
          return;
        }
        if (!res.ok || !data.url) {
          setCheckoutError(
            typeof data.error === "string" && data.error.length > 0
              ? data.error
              : t("pages.pricing.error.checkoutUnavailable"),
          );
          setCheckoutLoading(false);
          return;
        }
        window.location.href = data.url as string;
      } catch {
        setCheckoutError(t("pages.pricing.error.checkoutNetwork"));
        setCheckoutLoading(false);
      }
    },
    [effectiveCountry, policiesAccepted, tier, t],
  );

  const compareRows = useMemo(
    () => [
      { label: t("pages.pricing.compare.row0"), nn: t("pages.pricing.compare.nn0"), ty: t("pages.pricing.compare.ty0") },
      { label: t("pages.pricing.compare.row1"), nn: t("pages.pricing.compare.nn1"), ty: t("pages.pricing.compare.ty1") },
      { label: t("pages.pricing.compare.row2"), nn: t("pages.pricing.compare.nn2"), ty: t("pages.pricing.compare.ty2") },
      { label: t("pages.pricing.compare.row3"), nn: t("pages.pricing.compare.nn3"), ty: t("pages.pricing.compare.ty3") },
      { label: t("pages.pricing.compare.row4"), nn: t("pages.pricing.compare.nn4"), ty: t("pages.pricing.compare.ty4") },
    ],
    [t],
  );

  const heroHeadline = "Pass with a plan, not guesswork";
  const heroSubheadline =
    "NurseNest adapts to your weak areas, tracks readiness, and tells you what to do next so your final weeks are focused and calm.";

  const planPositioning: Record<BillingDuration, string> = {
    monthly: "Most popular",
    "3-month": "Best for final weeks",
    "6-month": "Best for quick review",
    yearly: "Best for comprehensive prep",
  };

  const planPersona: Record<BillingDuration, string> = {
    monthly: "For students who want flexibility while building consistent weekly momentum.",
    "3-month": "For learners in the last 8-12 weeks who need focused, high-yield readiness work.",
    "6-month": "For busy schedules that need a practical runway without rushing.",
    yearly: "For comprehensive prep across lessons, question bank depth, and exam-day confidence.",
  };

  const planOutcomeLines: Record<BillingDuration, string[]> = {
    monthly: [
      "Start today and get immediate weak-area targeting.",
      "Build confidence with realistic question flow and rationales.",
      "Keep pressure low with a month-to-month commitment.",
    ],
    "3-month": [
      "Tighten your weakest topics before exam day.",
      "Use readiness trends to prioritize the next best study block.",
      "Convert study time into exam-style decision speed.",
    ],
    "6-month": [
      "Cover fundamentals thoroughly, then sharpen with mocks.",
      "Improve consistency before entering final exam stretch.",
      "Reduce last-minute cramming with a structured timeline.",
    ],
    yearly: [
      "Build deep clinical reasoning over a full prep cycle.",
      "Track progress from baseline to exam-ready readiness bands.",
      "Study with a complete system, not disconnected resources.",
    ],
  };

  const pricingFaqs = [
    {
      q: "Can I cancel anytime?",
      a: "Yes. You can cancel from your billing portal anytime. Your access remains active until the end of the current paid period.",
    },
    {
      q: "What if I choose the wrong plan length?",
      a: "Choose based on your timeline: final weeks = shorter plans, broader prep runway = longer plans. All plans use the same core study system.",
    },
    {
      q: "Do you offer refunds?",
      a: "Please review the refund policy before checkout. We keep pricing and billing terms transparent so you can choose with confidence.",
    },
    {
      q: "What is the difference between plans?",
      a: "The core platform is the same; plan duration changes your runway. Longer plans are best when you need deeper coverage and repetition before exam day.",
    },
    {
      q: "How long do I keep access?",
      a: "Access lasts for your selected billing period and renews automatically unless cancelled.",
    },
  ];

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <header className="border-b border-[var(--theme-card-border)] pb-10">
        <p className="sr-only">{heading}</p>
        <p className="text-xs font-semibold uppercase tracking-wide text-primary">{t("pages.pricing.title")}</p>
        <h1 className="mt-2 text-balance text-3xl font-bold leading-tight text-[var(--theme-heading-text)] sm:text-4xl">
          {heroHeadline}
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground">{heroSubheadline}</p>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">{intro}</p>

        <p className="mt-4 text-sm text-[var(--theme-body-text)]">{t("pages.pricing.hero.trustLine")}</p>
        <p className="mt-2 inline-flex rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
          Most students choose a plan that matches their time-to-exam window.
        </p>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
          <Link
            href={tryQuestionsHref}
            className="inline-flex min-h-[48px] items-center justify-center rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-sm transition hover:brightness-110"
          >
            Start today
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
          <Link href={tryQuestionsHref} className="inline-flex items-center text-sm font-semibold text-primary hover:underline">
            See weak-area targeting first
          </Link>
        </div>
        <p className="mt-3 text-xs font-medium text-muted-foreground">No pressure: secure checkout, cancel anytime.</p>
        <p className="mt-2 text-xs text-muted-foreground">{t("pages.pricing.hero.regionHint")}</p>
      </header>

      <section className="mt-12 rounded-2xl border border-[var(--theme-card-border)] bg-[var(--theme-muted-surface)]/50 p-5 sm:p-6">
        <h2 className="text-lg font-bold text-[var(--theme-heading-text)]">{t("pages.pricing.proof.title")}</h2>
        <ul className="mt-4 space-y-3 text-sm leading-relaxed text-[var(--theme-body-text)]">
          <li className="flex gap-2">
            <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden />
            <span>{t("pages.pricing.proof.line1")}</span>
          </li>
          <li className="flex gap-2">
            <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden />
            <span>{t("pages.pricing.proof.line2")}</span>
          </li>
          <li className="flex gap-2">
            <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden />
            <span>{t("pages.pricing.proof.line3")}</span>
          </li>
        </ul>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-[var(--theme-card-border)] bg-card p-4 shadow-sm">
            <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Score preview</p>
            <p className="mt-2 text-2xl font-bold tabular-nums text-[var(--theme-heading-text)]">68%</p>
            <p className="text-xs text-muted-foreground">Last session · Pharmacology (example)</p>
            <div className="mt-3 flex flex-wrap gap-1.5">
              <span className="rounded-full bg-amber-500/15 px-2 py-0.5 text-[11px] font-medium text-amber-900 dark:text-amber-100">
                Priority
              </span>
              <span className="rounded-full bg-muted px-2 py-0.5 text-[11px] text-muted-foreground">Safety</span>
            </div>
          </div>
          <div className="rounded-xl border border-[var(--theme-card-border)] bg-card p-4 shadow-sm">
            <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Categories</p>
            <ul className="mt-2 space-y-1.5 text-sm">
              <li className="flex justify-between border-b border-dashed border-border pb-1">
                <span>Fluid balance</span>
                <span className="font-medium text-primary">Review</span>
              </li>
              <li className="flex justify-between border-b border-dashed border-border pb-1">
                <span>Infection control</span>
                <span className="text-muted-foreground">Stable</span>
              </li>
              <li className="flex justify-between pt-0.5">
                <span>Med admin</span>
                <span className="font-medium text-primary">Review</span>
              </li>
            </ul>
            <p className="mt-2 text-[11px] text-muted-foreground">Illustrative breakdown. Your report uses live data.</p>
          </div>
        </div>
      </section>

      <div className="nn-accent-soft-ring mt-10 rounded-xl border border-[var(--theme-card-border)] px-4 py-3 text-sm text-muted-foreground">
        <p>{t("pages.pricing.institutionalBanner")}</p>
        <Link href={institutionalHref} className="mt-2 inline-block font-semibold text-primary hover:underline">
          {t("pages.pricing.institutionalLink")} →
        </Link>
      </div>

      <div className="mt-6 space-y-1 text-sm italic text-muted-foreground">
        <p>{t("pages.pricing.micro.worry")}</p>
        <p>{t("pages.pricing.micro.marks")}</p>
        <p>{t("pages.pricing.micro.lift")}</p>
      </div>

      <p className="mt-6 text-sm text-muted-foreground">{t("pages.pricing.social.passRateLine")}</p>

      <div className="mt-8 flex flex-wrap gap-2">
        {(
          [
            ["rpn", "pages.pricing.segment.rpn"],
            ["lvn", "pages.pricing.segment.lvn"],
            ["rn", "pages.pricing.segment.rn"],
            ["np", "pages.pricing.segment.np"],
            ["allied", "pages.pricing.segment.allied"],
          ] as const
        ).map(([id, labelKey]) => (
          <button
            key={id}
            type="button"
            onClick={() => setSegment(id)}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
              id === "rn"
                ? segment === id
                  ? "bg-primary px-5 py-2.5 text-base text-primary-foreground shadow-md ring-2 ring-primary/30"
                  : "border-2 border-primary/25 bg-card px-5 py-2.5 text-base hover:bg-muted/80"
                : segment === id
                  ? "bg-primary text-primary-foreground"
                  : "border border-border bg-card hover:bg-muted/80"
            }`}
          >
            {t(labelKey)}
          </button>
        ))}
      </div>

      {(segment === "rn" || segment === "np" || segment === "allied") && (
        <div className="mt-4 flex flex-wrap gap-2">
          <span className="text-sm text-muted-foreground">{t("pages.pricing.countryLabel")}</span>
          <button
            type="button"
            className={`rounded-full px-3 py-1 text-xs font-semibold ${country === "CA" ? "bg-primary/15 text-primary" : "border border-border"}`}
            onClick={() => setCountry("CA")}
          >
            {t("pages.pricing.country.ca")}
          </button>
          <button
            type="button"
            className={`rounded-full px-3 py-1 text-xs font-semibold ${country === "US" ? "bg-primary/15 text-primary" : "border border-border"}`}
            onClick={() => setCountry("US")}
          >
            {t("pages.pricing.country.us")}
          </button>
        </div>
      )}

      <section className="mt-10 grid gap-10 lg:grid-cols-2 lg:items-start">
        <div className="lg:max-w-xl lg:pr-2">
          <h2 className="text-2xl font-bold text-[var(--theme-heading-text)]">{narrative.headline}</h2>
          {narrative.urgencyLine ? <p className="mt-2 text-sm font-medium text-primary">{narrative.urgencyLine}</p> : null}
          <p className="mt-3 text-muted-foreground">{narrative.subhead}</p>

          <h3 className="mt-6 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            {t("pages.pricing.section.outcomesHeading")}
          </h3>
          <ul className="mt-2 list-inside list-disc space-y-2 text-sm text-[var(--theme-body-text)]">
            {narrative.outcomes.map((o) => (
              <li key={o}>{o}</li>
            ))}
          </ul>
          <h3 className="mt-6 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            {t("pages.pricing.section.includedHeading")}
          </h3>
          <ul className="mt-2 list-inside list-disc space-y-2 text-sm text-muted-foreground">
            {narrative.included.map((o) => (
              <li key={o}>{o}</li>
            ))}
          </ul>
          {stats?.questionCount != null && stats.questionCount > 0 ? (
            <p className="mt-4 text-sm text-muted-foreground">
              Library scale (platform-wide): {stats.questionCount.toLocaleString()}+ items in rotation, plus lessons and cards. Exact pool depends on your tier.
            </p>
          ) : null}
          <p className="mt-4 text-sm text-muted-foreground">{narrative.proofLine}</p>
        </div>

        <div className="space-y-4 lg:pl-2">
          <div className="overflow-hidden rounded-2xl border border-[var(--theme-card-border)] bg-card shadow-sm">
            <div className="border-b border-border/60 bg-muted/30 px-4 py-3 text-left">
              <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">{t("pages.pricing.preview.metricsLabel")}</p>
              <div className="mt-2 grid grid-cols-3 gap-2 text-center">
                <div className="rounded-lg bg-card px-2 py-2 shadow-sm">
                  <p className="text-lg font-bold text-[var(--theme-heading-text)]">{t("pages.pricing.preview.metricAccuracy")}</p>
                  <p className="text-[10px] text-muted-foreground">{t("pages.pricing.preview.metricAccuracyCaption")}</p>
                </div>
                <div className="rounded-lg bg-card px-2 py-2 shadow-sm">
                  <p className="text-lg font-bold text-[var(--theme-heading-text)]">{t("pages.pricing.preview.metricWeak")}</p>
                  <p className="text-[10px] text-muted-foreground">{t("pages.pricing.preview.metricWeakCaption")}</p>
                </div>
                <div className="rounded-lg bg-card px-2 py-2 shadow-sm">
                  <p className="text-lg font-bold text-[var(--theme-heading-text)]">{t("pages.pricing.preview.metricStreak")}</p>
                  <p className="text-[10px] text-muted-foreground">{t("pages.pricing.preview.metricStreakCaption")}</p>
                </div>
              </div>
            </div>
            <div className="border-t border-border/40 bg-muted/20 px-4 py-5 text-left">
              <p className="text-xs font-semibold uppercase tracking-wide text-primary">{t("pages.pricing.preview.badge")}</p>
              <p className="mt-2 text-sm text-muted-foreground">{t("pages.pricing.preview.body")}</p>
            </div>
          </div>
          <div className="rounded-2xl border border-[var(--theme-card-border)] bg-card p-4 shadow-sm">
            <p className="text-sm font-semibold text-[var(--theme-heading-text)]">{t("pages.pricing.trust.guaranteeTitle")}</p>
            <p className="mt-2 text-sm text-muted-foreground">{t("pages.pricing.trust.guaranteeBody")}</p>
            <ul className="mt-3 list-inside list-disc text-sm text-muted-foreground">
              <li>{t("pages.pricing.trust.bullet0")}</li>
              <li>{t("pages.pricing.trust.bullet1")}</li>
              <li>{t("pages.pricing.trust.bullet2")}</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="mt-14">
        <h2 className="text-xl font-bold text-[var(--theme-heading-text)]">{t("pages.pricing.get.title")}</h2>
        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-muted-foreground">{t("pages.pricing.get.lead")}</p>
        <ul className="mt-4 list-inside list-disc space-y-2 text-sm text-[var(--theme-body-text)]">
          <li>{t("pages.pricing.get.b0")}</li>
          <li>{t("pages.pricing.get.b1")}</li>
          <li>{t("pages.pricing.get.b2")}</li>
          <li>{t("pages.pricing.get.b3")}</li>
        </ul>
        <div className="mt-6 space-y-3 rounded-2xl border border-[var(--theme-card-border)] bg-[var(--theme-muted-surface)]/40 p-5 text-sm leading-relaxed text-[var(--theme-body-text)]">
          <p>
            {t("pages.pricing.get.afterLesson")}{" "}
            <Link href={lessonsHubHref} className="font-semibold text-primary underline-offset-4 hover:underline">
              {t("pages.pricing.get.linkLessons")}
            </Link>
            .{" "}
            <Link href={tryQuestionsHref} className="font-semibold text-primary underline-offset-4 hover:underline">
              {t("pages.pricing.get.linkQuestions")}
            </Link>
          </p>
          <p>
            {t("pages.pricing.get.afterQuestions")}{" "}
            <Link href={examsHref} className="font-semibold text-primary underline-offset-4 hover:underline">
              {t("pages.pricing.get.linkExams")}
            </Link>
            .{" "}
            <Link href={toolsHref} className="font-semibold text-primary underline-offset-4 hover:underline">
              {t("pages.pricing.get.linkTools")}
            </Link>
          </p>
        </div>
      </section>

      <section className="mt-14 grid gap-8 md:grid-cols-2">
        <div>
          <h2 className="text-xl font-bold text-[var(--theme-heading-text)]">{t("pages.pricing.use.title")}</h2>
          <div className="mt-4 rounded-2xl border border-[var(--theme-card-border)] bg-card p-5">
            <p className="text-sm font-semibold text-primary">{t("pages.pricing.use.afterShiftTitle")}</p>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{t("pages.pricing.use.afterShiftBody")}</p>
          </div>
          <div className="mt-4 rounded-2xl border border-dashed border-primary/30 bg-primary/[0.04] p-5">
            <p className="text-sm font-semibold text-[var(--theme-heading-text)]">{t("pages.pricing.use.weekendTitle")}</p>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{t("pages.pricing.use.weekendBody")}</p>
          </div>
        </div>
        <div>
          <h2 className="text-xl font-bold text-[var(--theme-heading-text)]">{t("pages.pricing.risk.title")}</h2>
          <ul className="mt-4 space-y-3 text-sm text-[var(--theme-body-text)]">
            <li className="flex gap-2">
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden />
              {t("pages.pricing.risk.b0")}
            </li>
            <li className="flex gap-2">
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden />
              {t("pages.pricing.risk.b1")}
            </li>
            <li className="flex gap-2">
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden />
              {t("pages.pricing.risk.b2")}
            </li>
          </ul>
        </div>
      </section>

      <section className="mt-14 rounded-2xl border border-[var(--theme-card-border)] bg-[var(--theme-muted-surface)]/40 p-6">
        <h2 className="text-xl font-bold text-[var(--theme-heading-text)]">Student outcomes and trust</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Built for realistic nursing decision-making with clinically grounded rationales and targeted review loops.
        </p>
        <div className="mt-5 grid gap-4 md:grid-cols-3">
          <blockquote className="rounded-xl border border-[var(--theme-card-border)] bg-card p-4 text-sm">
            “I stopped random reviewing and finally knew what to focus on each week.”
          </blockquote>
          <blockquote className="rounded-xl border border-[var(--theme-card-border)] bg-card p-4 text-sm">
            “The readiness trend helped me decide when to switch from content review to timed sets.”
          </blockquote>
          <blockquote className="rounded-xl border border-[var(--theme-card-border)] bg-card p-4 text-sm">
            “Questions felt close to exam pressure, but with clearer next steps after every session.”
          </blockquote>
        </div>
      </section>

      <section className="mt-14">
        <h2 className="text-xl font-bold text-[var(--theme-heading-text)]">Pricing FAQ</h2>
        <dl className="mt-6 space-y-6">
          {pricingFaqs.map((item) => (
            <div key={item.q} className="border-b border-[var(--theme-card-border)] pb-6 last:border-0 last:pb-0">
              <dt className="font-semibold text-[var(--theme-heading-text)]">{item.q}</dt>
              <dd className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.a}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="mt-14 overflow-x-auto rounded-2xl border border-[var(--theme-card-border)] bg-card">
        <h2 className="sr-only">{t("pages.pricing.compare.title")}</h2>
        <table className="w-full min-w-[520px] text-left text-sm">
          <caption className="border-b border-[var(--theme-card-border)] px-4 py-3 text-left text-base font-bold text-[var(--theme-heading-text)]">
            NurseNest vs UWorld-style qbank
          </caption>
          <thead>
            <tr className="border-b border-[var(--theme-card-border)] bg-muted/40">
              <th className="px-4 py-3 font-semibold" scope="col">
                {" "}
              </th>
              <th className="px-4 py-3 font-semibold text-primary" scope="col">
                NurseNest
              </th>
              <th className="px-4 py-3 font-semibold text-muted-foreground" scope="col">
                UWorld-style qbank
              </th>
            </tr>
          </thead>
          <tbody>
            {compareRows.map((row) => (
              <tr key={row.label} className="border-b border-[var(--theme-card-border)] last:border-0">
                <th scope="row" className="px-4 py-3 font-medium text-[var(--theme-heading-text)]">
                  {row.label}
                </th>
                <td className="px-4 py-3 text-[var(--theme-body-text)]">{row.nn}</td>
                <td className="px-4 py-3 text-muted-foreground">{row.ty}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="mt-14">
        <h2 className="text-xl font-bold text-[var(--theme-heading-text)]">{t("pages.pricing.billing.heading")}</h2>
        <p className="mt-2 text-sm text-muted-foreground">{t("pages.pricing.billing.helper")}</p>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{t("pages.pricing.billing.recurringDisclosure")}</p>
        <p className="mt-2 text-xs text-muted-foreground">{t("pages.pricing.checkout.recurringShort")}</p>
        <p className="mt-2 text-xs font-medium text-primary">Choose the shortest plan that matches your exam timeline and comfort level.</p>
        {loadError ? <p className="mt-4 text-sm text-red-600">{loadError}</p> : null}
        {checkoutError ? <p className="mt-4 text-sm text-red-600">{checkoutError}</p> : null}

        <div className="mt-6 rounded-2xl border border-[var(--theme-card-border)] bg-[var(--theme-muted-surface)]/40 p-4 text-sm leading-relaxed text-[var(--theme-body-text)]">
          <label className="flex cursor-pointer gap-3">
            <input
              type="checkbox"
              className="mt-1 h-4 w-4 shrink-0 rounded border-border"
              checked={policiesAccepted}
              onChange={(e) => setPoliciesAccepted(e.target.checked)}
            />
            <span>
              {t("pages.pricing.checkout.policyAckStart")}
              <Link href={termsHref} className="font-semibold text-primary underline-offset-4 hover:underline">
                {t("pages.pricing.checkout.policyTermsLabel")}
              </Link>
              {t("pages.pricing.checkout.policyAckBetween1")}
              <Link href={privacyHref} className="font-semibold text-primary underline-offset-4 hover:underline">
                {t("pages.pricing.checkout.policyPrivacyLabel")}
              </Link>
              {t("pages.pricing.checkout.policyAckBetween2")}
              <Link href={refundHref} className="font-semibold text-primary underline-offset-4 hover:underline">
                {t("pages.pricing.checkout.policyRefundLabel")}
              </Link>
              {t("pages.pricing.checkout.policyAckEnd")}
            </span>
          </label>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {(["monthly", "3-month", "6-month", "yearly"] as BillingDuration[]).map((dur) => {
            const row = filtered.find((p) => p.duration === dur);
            return (
              <article
                key={dur}
                className={`flex flex-col rounded-2xl border border-[var(--theme-card-border)] bg-card p-5 shadow-sm ${
                  row?.isBestValue ? "ring-2 ring-primary md:scale-[1.02]" : row?.isMostPopular ? "ring-2 ring-primary/40" : ""
                }`}
              >
                <p className="mb-2 inline-block w-fit rounded-full bg-primary/15 px-2 py-0.5 text-xs font-bold text-primary">
                  {planPositioning[dur]}
                </p>
                <h3 className="text-lg font-semibold text-[var(--theme-heading-text)]">{t(DURATION_KEYS[dur])}</h3>
                <p className="mt-2 text-xs leading-snug text-muted-foreground">{planPersona[dur]}</p>
                <ul className="mt-3 space-y-1.5 text-xs text-[var(--theme-body-text)]">
                  {planOutcomeLines[dur].map((line) => (
                    <li key={line} className="flex gap-1.5">
                      <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" aria-hidden />
                      {line}
                    </li>
                  ))}
                </ul>
                {row ? (
                  <>
                    <p className="mt-4 text-2xl font-bold">{row.totalLabel}</p>
                    <p className="text-sm text-muted-foreground">
                      {row.monthlyEquivalentLabel} {t("pages.pricing.plan.avgSuffix")}
                    </p>
                    {row.savingsVsMonthlyPercent > 0 ? (
                      <p className="mt-2 text-xs font-semibold text-primary">
                        {t("pages.pricing.plan.saveVsMonthly", { pct: row.savingsVsMonthlyPercent })}
                      </p>
                    ) : null}
                    <button
                      type="button"
                      disabled={checkoutLoading || !row.checkoutAvailable || !policiesAccepted}
                      onClick={() => startCheckout(dur)}
                      className="mt-4 w-full rounded-full bg-primary py-2.5 text-sm font-semibold text-primary-foreground disabled:opacity-60"
                    >
                      {row.checkoutAvailable ? "Start this plan" : t("pages.pricing.checkout.comingSoon")}
                    </button>
                  </>
                ) : (
                  <>
                    <p className="mt-3 text-sm font-medium text-muted-foreground">{t("pages.pricing.checkout.comingSoon")}</p>
                    <button
                      type="button"
                      disabled
                      className="mt-4 w-full rounded-full border border-border bg-muted/50 py-2.5 text-sm font-semibold text-muted-foreground"
                    >
                      {t("pages.pricing.checkout.comingSoon")}
                    </button>
                  </>
                )}
              </article>
            );
          })}
        </div>
      </section>

      <div className="mt-12 flex justify-center">
        <Link
          href={tryQuestionsHref}
          className="inline-flex min-h-[48px] items-center justify-center rounded-full border border-primary/30 bg-primary/5 px-8 py-3 text-sm font-semibold text-primary hover:bg-primary/10"
        >
          {t("pages.pricing.cta.startPractice")}
        </Link>
      </div>

      <p className="mt-10 text-center text-xs text-muted-foreground">{t("pages.pricing.social.pricingFooterLine")}</p>
    </main>
  );
}
