"use client";

import type { TierCode } from "@prisma/client";
import Link from "next/link";
import { MarketingTrackedLink } from "@/components/marketing/marketing-tracked-link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { ArrowRight, Check } from "lucide-react";
import { buildTierPricingNarrative } from "@/lib/conversion/pricing-catalog";
import { trackClientEvent } from "@/lib/observability/posthog-client";
import { PH } from "@/lib/observability/posthog-conversion-events";
import { useMarketingI18n } from "@/lib/marketing-i18n";
import { withMarketingLocale } from "@/lib/i18n/marketing-path";
import { useNursenestRegion } from "@/lib/region/use-nursenest-region";
import {
  ALLIED,
  HUB,
  NP,
  RN,
  loginWithCallback,
  pnQuestions,
  rnQuestions,
} from "@/lib/marketing/marketing-entry-routes";
import { LEGAL_POLICY_BUNDLE_VERSION } from "@/lib/legal/legal-config";
import {
  CHECKOUT_INVALID_PAYLOAD_CODE,
  CHECKOUT_POLICY_VERSION_MISMATCH_CODE,
  CHECKOUT_SESSION_FAILED_CODE,
  CHECKOUT_STRIPE_UNAVAILABLE_CODE,
  CHECKOUT_UNAUTHORIZED_CODE,
  parseCheckoutApiErrorBody,
  showStripePriceEnvKeyOnCheckoutError,
  STRIPE_PRICE_NOT_CONFIGURED_CODE,
  type ParsedCheckoutErrorBody,
} from "@/lib/stripe/checkout-api-diagnostics";
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

function checkoutErrorUserMessage(
  parsed: ParsedCheckoutErrorBody,
  httpStatus: number,
  t: (key: string, params?: Record<string, string | number>) => string,
): string {
  const { code, message } = parsed;
  if (code === STRIPE_PRICE_NOT_CONFIGURED_CODE) return t("pages.pricing.error.checkoutPlanNotConfigured");
  if (code === CHECKOUT_UNAUTHORIZED_CODE || httpStatus === 401) return t("pages.pricing.error.checkoutSignIn");
  if (code === CHECKOUT_POLICY_VERSION_MISMATCH_CODE) return t("pages.pricing.error.checkoutPolicyStale");
  if (code === CHECKOUT_INVALID_PAYLOAD_CODE) return t("pages.pricing.error.checkoutInvalidRequest");
  if (code === CHECKOUT_STRIPE_UNAVAILABLE_CODE || code === CHECKOUT_SESSION_FAILED_CODE) {
    return t("pages.pricing.error.checkoutTemporarilyUnavailable");
  }
  if (message.length > 0) return message;
  return t("pages.pricing.error.checkoutUnavailable");
}

export function PricingPageClient({
  heading,
  intro,
  heroSub,
}: {
  heading: string;
  intro: string;
  heroSub: string;
}) {
  const [segment, setSegment] = useState<Segment>("rn");
  const [country, setCountry] = useState<"CA" | "US">("CA");
  const [plans, setPlans] = useState<PlanRow[]>([]);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);
  const [checkoutOpsHint, setCheckoutOpsHint] = useState<string | null>(null);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [policiesAccepted, setPoliciesAccepted] = useState(false);
  const [stats, setStats] = useState<HomeStatsPayload | null>(null);
  const { locale, t } = useMarketingI18n();
  const { region } = useNursenestRegion();
  const institutionalHref = withMarketingLocale(locale, "/for-institutions");

  const planPersona = useMemo(
    () =>
      ({
        monthly: t("pages.pricing.persona.monthly"),
        "3-month": t("pages.pricing.persona.3-month"),
        "6-month": t("pages.pricing.persona.6-month"),
        yearly: t("pages.pricing.persona.yearly"),
      }) satisfies Record<BillingDuration, string>,
    [t],
  );

  const planOutcomeLines = useMemo(
    () =>
      ({
        monthly: [0, 1, 2].map((i) => t(`pages.pricing.outcomes.monthly.${i}`)),
        "3-month": [0, 1, 2].map((i) => t(`pages.pricing.outcomes.3-month.${i}`)),
        "6-month": [0, 1, 2].map((i) => t(`pages.pricing.outcomes.6-month.${i}`)),
        yearly: [0, 1, 2].map((i) => t(`pages.pricing.outcomes.yearly.${i}`)),
      }) satisfies Record<BillingDuration, string[]>,
    [t],
  );

  const pricingFaqs = useMemo(
    () =>
      [0, 1, 2, 3, 4].map((i) => ({
        q: t(`pages.pricing.faq.${i}.q`),
        a: t(`pages.pricing.faq.${i}.a`),
      })),
    [t],
  );

  const matrixRows = useMemo(
    () =>
      [0, 1, 2, 3, 4, 5, 6, 7].map((i) => [
        t(`pages.pricing.matrix.r${i}.f`),
        t(`pages.pricing.matrix.r${i}.free`),
        t(`pages.pricing.matrix.r${i}.core`),
        t(`pages.pricing.matrix.r${i}.premium`),
      ]),
    [t],
  );

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
  const availableRows = useMemo(
    () =>
      filtered.filter((p) => p.checkoutAvailable).sort((a, b) => {
        const order: BillingDuration[] = ["monthly", "3-month", "6-month", "yearly"];
        return order.indexOf(a.duration) - order.indexOf(b.duration);
      }),
    [filtered],
  );
  const coreRow = availableRows.find((r) => r.duration === "monthly") ?? availableRows[0] ?? null;
  const premiumRow =
    availableRows.find((r) => r.isBestValue) ??
    availableRows.find((r) => r.duration === "yearly") ??
    availableRows[availableRows.length - 1] ??
    null;

  const tryQuestionsHref = localize(rnQuestions(region));
  const examsHref = localize(loginWithCallback(RN.appExams));
  const lessonsHubHref = localize(HUB.examLessons);
  const toolsHref = localize(HUB.tools);
  const examLinks = useMemo(() => {
    const rc = country === "US" ? "US" : "CA";
    return {
      rn: {
        labelKey: `pages.pricing.examCard.rn${rc}`,
        blurbKey: `pages.pricing.examBlurb.rn${rc}`,
        href: localize(rnQuestions(country)),
      },
      pn: {
        labelKey: `pages.pricing.examCard.pn${rc}`,
        blurbKey: `pages.pricing.examBlurb.pn${rc}`,
        href: localize(pnQuestions(country)),
      },
      np: {
        labelKey: `pages.pricing.examCard.np${rc}`,
        blurbKey: `pages.pricing.examBlurb.np${rc}`,
        href: localize(country === "US" ? NP.fnpQuestions : NP.caNpQuestions),
      },
      allied: {
        labelKey: `pages.pricing.examCard.allied${rc}`,
        blurbKey: `pages.pricing.examBlurb.allied${rc}`,
        href: localize(country === "US" ? ALLIED.usQuestions : ALLIED.caQuestions),
      },
    } as const;
  }, [country, localize]);

  const termsHref = localize("/terms");
  const privacyHref = localize("/privacy");
  const refundHref = localize("/refund-policy");

  const startCheckout = useCallback(
    async (duration: BillingDuration) => {
      setCheckoutError(null);
      setCheckoutOpsHint(null);
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
        const data: unknown = await res.json();
        if (!res.ok || !(data && typeof data === "object" && "url" in data && (data as { url?: unknown }).url)) {
          const parsed = parseCheckoutApiErrorBody(data);
          setCheckoutOpsHint(null);
          if (parsed.code === STRIPE_PRICE_NOT_CONFIGURED_CODE) {
            setCheckoutError(t("pages.pricing.error.checkoutPlanNotConfigured"));
            if (showStripePriceEnvKeyOnCheckoutError() && parsed.envKey) {
              setCheckoutOpsHint(t("pages.pricing.error.checkoutOpsStripePrice", { envKey: parsed.envKey }));
            }
          } else {
            setCheckoutError(checkoutErrorUserMessage(parsed, res.status, t));
          }
          setCheckoutLoading(false);
          return;
        }
        const url = (data as { url: string }).url;
        window.location.href = url;
      } catch {
        setCheckoutOpsHint(null);
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

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <header className="border-b border-[var(--theme-card-border)] pb-10">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{t("pages.pricing.title")}</p>
        <h1 className="mt-2 text-balance text-3xl font-bold leading-tight text-[var(--theme-heading-text)] sm:text-4xl">
          {heading}
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground">{heroSub}</p>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">{intro}</p>

        <p className="mt-4 text-sm text-[var(--theme-body-text)]">{t("pages.pricing.hero.trustLine")}</p>
        <p className="mt-2 inline-flex rounded-full border border-[var(--border-subtle)] bg-[var(--bg-inset)] px-3 py-1 text-xs font-medium text-[var(--theme-body-text)]">
          {t("pages.pricing.hero.choicePill")}
        </p>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
          <Link
            href={tryQuestionsHref}
            className="nn-btn-primary inline-flex min-h-[48px] items-center justify-center px-6 py-3 text-sm font-semibold transition"
          >
            {t("pages.pricing.hero.ctaStartStudying")}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
          <Link href={tryQuestionsHref} className="nn-link-quiet inline-flex items-center text-sm font-semibold">
            {t("pages.pricing.hero.ctaSeeWeakAreas")}
          </Link>
        </div>
        <p className="mt-3 text-xs font-medium text-muted-foreground">{t("pages.pricing.hero.checkoutHint")}</p>
        <p className="mt-2 text-xs text-muted-foreground">{t("pages.pricing.hero.regionHint")}</p>
      </header>

      <section className="mt-12 rounded-2xl border border-[var(--border-subtle,var(--theme-card-border))] bg-[var(--bg-section-alt)] p-5 sm:p-6 shadow-[var(--shadow-card)]">
        <h2 className="text-lg font-bold text-[var(--theme-heading-text)]">{t("pages.pricing.proof.title")}</h2>
        <ul className="mt-4 space-y-3 text-sm leading-relaxed text-[var(--theme-body-text)]">
          <li className="flex gap-2">
            <Check className="nn-trust-mark mt-0.5 h-4 w-4 shrink-0" aria-hidden />
            <span>{t("pages.pricing.proof.line1")}</span>
          </li>
          <li className="flex gap-2">
            <Check className="nn-trust-mark mt-0.5 h-4 w-4 shrink-0" aria-hidden />
            <span>{t("pages.pricing.proof.line2")}</span>
          </li>
          <li className="flex gap-2">
            <Check className="nn-trust-mark mt-0.5 h-4 w-4 shrink-0" aria-hidden />
            <span>{t("pages.pricing.proof.line3")}</span>
          </li>
        </ul>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-[var(--border-subtle,var(--theme-card-border))] bg-card p-4 shadow-[var(--shadow-card)]">
            <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
              {t("pages.pricing.demo.scorePreview")}
            </p>
            <p className="mt-2 text-2xl font-bold tabular-nums text-[var(--theme-heading-text)]">
              {t("pages.pricing.demo.scoreExamplePct")}
            </p>
            <p className="text-xs text-muted-foreground">{t("pages.pricing.demo.lastSessionExample")}</p>
            <div className="mt-3 flex flex-wrap gap-1.5">
              <span className="rounded-full border border-role-warning-border bg-role-warning-soft px-2 py-0.5 text-[11px] font-medium text-role-warning-text">
                {t("pages.pricing.demo.priorityChip")}
              </span>
              <span className="rounded-full bg-[var(--surface-chip)] px-2 py-0.5 text-[11px] text-muted-foreground ring-1 ring-[var(--border-subtle)]">
                {t("pages.pricing.demo.safetyChip")}
              </span>
            </div>
          </div>
          <div className="rounded-xl border border-[var(--border-subtle,var(--theme-card-border))] bg-card p-4 shadow-[var(--shadow-card)]">
            <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
              {t("pages.pricing.demo.categoriesTitle")}
            </p>
            <ul className="mt-2 space-y-1.5 text-sm">
              <li className="flex justify-between border-b border-dashed border-border pb-1">
                <span>{t("pages.pricing.demo.rowFluid")}</span>
                <span className="font-medium text-[var(--role-heat-text)]">{t("pages.pricing.demo.reviewLabel")}</span>
              </li>
              <li className="flex justify-between border-b border-dashed border-border pb-1">
                <span>{t("pages.pricing.demo.rowInfection")}</span>
                <span className="text-muted-foreground">{t("pages.pricing.demo.stableLabel")}</span>
              </li>
              <li className="flex justify-between pt-0.5">
                <span>{t("pages.pricing.demo.rowMedAdmin")}</span>
                <span className="font-medium text-[var(--role-heat-text)]">{t("pages.pricing.demo.reviewLabel")}</span>
              </li>
            </ul>
            <p className="mt-2 text-[11px] text-muted-foreground">{t("pages.pricing.demo.illusNote")}</p>
          </div>
        </div>
      </section>

      <section className="mt-12 overflow-x-auto rounded-2xl border border-[var(--border-subtle,var(--theme-card-border))] bg-card shadow-[var(--shadow-card)]">
        <h2 className="px-4 pt-4 text-xl font-bold text-[var(--theme-heading-text)] sm:px-6">{t("pages.pricing.matrix.title")}</h2>
        <p className="px-4 pb-2 text-sm text-muted-foreground sm:px-6">{t("pages.pricing.matrix.lead")}</p>
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead>
            <tr className="border-y border-[var(--border-subtle,var(--theme-card-border))] bg-[var(--bg-inset)]">
              <th className="px-4 py-3 sm:px-6">{t("pages.pricing.matrix.thFeature")}</th>
              <th className="px-4 py-3">{t("pages.pricing.matrix.thFree")}</th>
              <th className="px-4 py-3">{t("pages.pricing.matrix.thCore")}</th>
              <th className="px-4 py-3">{t("pages.pricing.matrix.thPremium")}</th>
            </tr>
          </thead>
          <tbody>
            {matrixRows.map((row) => (
              <tr key={row[0]} className="border-b border-[var(--theme-card-border)] last:border-0">
                <th scope="row" className="px-4 py-3 font-medium text-[var(--theme-heading-text)] sm:px-6">
                  {row[0]}
                </th>
                <td className="px-4 py-3 text-muted-foreground">{row[1]}</td>
                <td className="px-4 py-3 text-[var(--theme-body-text)]">{row[2]}</td>
                <td className="px-4 py-3 text-[var(--theme-body-text)]">{row[3]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <div className="nn-accent-soft-ring mt-10 rounded-xl border border-[var(--border-subtle,var(--theme-card-border))] px-4 py-3 text-sm text-muted-foreground">
        <p>{t("pages.pricing.institutionalBanner")}</p>
        <Link href={institutionalHref} className="nn-link-quiet mt-2 inline-block font-semibold">
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
              segment === id
                ? "bg-role-cta text-role-cta-foreground shadow-[0_4px_14px_var(--role-cta-shadow)]"
                : "border border-[var(--border-medium)] bg-card text-[var(--theme-body-text)] hover:bg-[var(--surface-interactive-hover)]"
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
            className={`rounded-full px-3 py-1 text-xs font-semibold ${
              country === "CA"
                ? "bg-[var(--surface-selected)] text-[var(--theme-heading-text)] ring-1 ring-[var(--border-medium)]"
                : "border border-border text-[var(--theme-body-text)]"
            }`}
            onClick={() => setCountry("CA")}
          >
            {t("pages.pricing.country.ca")}
          </button>
          <button
            type="button"
            className={`rounded-full px-3 py-1 text-xs font-semibold ${
              country === "US"
                ? "bg-[var(--surface-selected)] text-[var(--theme-heading-text)] ring-1 ring-[var(--border-medium)]"
                : "border border-border text-[var(--theme-body-text)]"
            }`}
            onClick={() => setCountry("US")}
          >
            {t("pages.pricing.country.us")}
          </button>
        </div>
      )}

      <section className="mt-10 grid gap-10 lg:grid-cols-2 lg:items-start">
        <div className="lg:max-w-xl lg:pr-2">
          <h2 className="text-2xl font-bold text-[var(--theme-heading-text)]">{narrative.headline}</h2>
          {narrative.urgencyLine ? (
            <p className="mt-2 text-sm font-medium text-[var(--role-heat-text)]">{narrative.urgencyLine}</p>
          ) : null}
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
              {t("pages.pricing.libraryScale", { count: stats.questionCount.toLocaleString() })}
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
            <div className="border-t border-[var(--border-subtle)] bg-[var(--bg-inset)] px-4 py-5 text-left">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{t("pages.pricing.preview.badge")}</p>
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
        <div className="mt-6 space-y-3 rounded-2xl border border-[var(--border-subtle,var(--theme-card-border))] bg-[var(--bg-section-alt)] p-5 text-sm leading-relaxed text-[var(--theme-body-text)] shadow-[var(--shadow-card)]">
          <p>
            {t("pages.pricing.get.afterLesson")}{" "}
            <Link href={lessonsHubHref} className="nn-link-quiet font-semibold">
              {t("pages.pricing.get.linkLessons")}
            </Link>
            .{" "}
            <Link href={tryQuestionsHref} className="nn-link-quiet font-semibold">
              {t("pages.pricing.get.linkQuestions")}
            </Link>
          </p>
          <p>
            {t("pages.pricing.get.afterQuestions")}{" "}
            <Link href={examsHref} className="nn-link-quiet font-semibold">
              {t("pages.pricing.get.linkExams")}
            </Link>
            .{" "}
            <Link href={toolsHref} className="nn-link-quiet font-semibold">
              {t("pages.pricing.get.linkTools")}
            </Link>
          </p>
        </div>
      </section>

      <section className="mt-14 grid gap-8 md:grid-cols-2">
        <div>
          <h2 className="text-xl font-bold text-[var(--theme-heading-text)]">{t("pages.pricing.use.title")}</h2>
          <div className="mt-4 rounded-2xl border border-[var(--theme-card-border)] bg-card p-5">
            <p className="text-sm font-semibold text-[var(--theme-heading-text)]">{t("pages.pricing.use.afterShiftTitle")}</p>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{t("pages.pricing.use.afterShiftBody")}</p>
          </div>
          <div className="mt-4 rounded-2xl border border-dashed border-[var(--border-medium)] bg-[var(--accent-soft)] p-5">
            <p className="text-sm font-semibold text-[var(--theme-heading-text)]">{t("pages.pricing.use.weekendTitle")}</p>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{t("pages.pricing.use.weekendBody")}</p>
          </div>
        </div>
        <div>
          <h2 className="text-xl font-bold text-[var(--theme-heading-text)]">{t("pages.pricing.risk.title")}</h2>
          <ul className="mt-4 space-y-3 text-sm text-[var(--theme-body-text)]">
            <li className="flex gap-2">
              <Check className="nn-trust-mark mt-0.5 h-4 w-4 shrink-0" aria-hidden />
              {t("pages.pricing.risk.b0")}
            </li>
            <li className="flex gap-2">
              <Check className="nn-trust-mark mt-0.5 h-4 w-4 shrink-0" aria-hidden />
              {t("pages.pricing.risk.b1")}
            </li>
            <li className="flex gap-2">
              <Check className="nn-trust-mark mt-0.5 h-4 w-4 shrink-0" aria-hidden />
              {t("pages.pricing.risk.b2")}
            </li>
          </ul>
        </div>
      </section>

      <section className="mt-14 rounded-2xl border border-[var(--border-subtle,var(--theme-card-border))] bg-[var(--bg-section-alt)] p-6 shadow-[var(--shadow-card)]">
        <h2 className="text-xl font-bold text-[var(--theme-heading-text)]">{t("pages.pricing.trustSection.title")}</h2>
        <p className="mt-2 text-sm text-muted-foreground">{t("pages.pricing.trustSection.lead")}</p>
        <div className="mt-5 grid gap-4 md:grid-cols-3">
          <blockquote className="rounded-xl border border-[var(--theme-card-border)] bg-card p-4 text-sm">
            “{t("pages.pricing.trustSection.quote0")}”
          </blockquote>
          <blockquote className="rounded-xl border border-[var(--theme-card-border)] bg-card p-4 text-sm">
            “{t("pages.pricing.trustSection.quote1")}”
          </blockquote>
          <blockquote className="rounded-xl border border-[var(--theme-card-border)] bg-card p-4 text-sm">
            “{t("pages.pricing.trustSection.quote2")}”
          </blockquote>
        </div>
      </section>

      <section className="mt-14">
        <h2 className="text-xl font-bold text-[var(--theme-heading-text)]">{t("pages.pricing.faqSection.title")}</h2>
        <dl className="mt-6 space-y-6">
          {pricingFaqs.map((item) => (
            <div key={item.q} className="border-b border-[var(--theme-card-border)] pb-6 last:border-0 last:pb-0">
              <dt className="font-semibold text-[var(--theme-heading-text)]">{item.q}</dt>
              <dd className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.a}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="mt-14 overflow-x-auto rounded-2xl border border-[var(--border-subtle,var(--theme-card-border))] bg-card shadow-[var(--shadow-card)]">
        <h2 className="sr-only">{t("pages.pricing.compare.title")}</h2>
        <table className="w-full min-w-[520px] text-left text-sm">
          <caption className="border-b border-[var(--theme-card-border)] px-4 py-3 text-left text-base font-bold text-[var(--theme-heading-text)]">
            {t("pages.pricing.compare.uworldCaption")}
          </caption>
          <thead>
            <tr className="border-b border-[var(--border-subtle,var(--theme-card-border))] bg-[var(--bg-inset)]">
              <th className="px-4 py-3 font-semibold" scope="col">
                {" "}
              </th>
              <th className="px-4 py-3 font-semibold text-[var(--theme-heading-text)]" scope="col">
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
        <p className="mt-2 text-xs font-medium text-[var(--role-heat-text)]">{t("pages.pricing.billing.cancelComfort")}</p>
        {loadError ? <p className="mt-4 text-sm text-red-600">{loadError}</p> : null}
        {checkoutError ? <p className="mt-4 text-sm text-red-600">{checkoutError}</p> : null}
        {checkoutOpsHint ? (
          <p className="mt-2 rounded-md border border-border/80 bg-muted/40 px-3 py-2 font-mono text-xs text-muted-foreground">
            {checkoutOpsHint}
          </p>
        ) : null}

        <div className="mt-6 rounded-2xl border border-[var(--border-subtle,var(--theme-card-border))] bg-[var(--bg-section-alt)] p-4 text-sm leading-relaxed text-[var(--theme-body-text)]">
          <label className="flex cursor-pointer gap-3">
            <input
              type="checkbox"
              className="mt-1 h-4 w-4 shrink-0 rounded border-border"
              checked={policiesAccepted}
              onChange={(e) => setPoliciesAccepted(e.target.checked)}
            />
            <span>
              {t("pages.pricing.checkout.policyAckStart")}
              <Link href={termsHref} className="nn-link-quiet font-semibold">
                {t("pages.pricing.checkout.policyTermsLabel")}
              </Link>
              {t("pages.pricing.checkout.policyAckBetween1")}
              <Link href={privacyHref} className="nn-link-quiet font-semibold">
                {t("pages.pricing.checkout.policyPrivacyLabel")}
              </Link>
              {t("pages.pricing.checkout.policyAckBetween2")}
              <Link href={refundHref} className="nn-link-quiet font-semibold">
                {t("pages.pricing.checkout.policyRefundLabel")}
              </Link>
              {t("pages.pricing.checkout.policyAckEnd")}
            </span>
          </label>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <article className="flex flex-col rounded-2xl border border-[var(--theme-card-border)] bg-card p-5 shadow-sm">
            <p className="mb-2 inline-block w-fit rounded-full bg-muted px-2 py-0.5 text-xs font-bold text-muted-foreground">
              {t("pages.pricing.tier.freeBadge")}
            </p>
            <h3 className="text-lg font-semibold text-[var(--theme-heading-text)]">{t("pages.pricing.tier.freeTitle")}</h3>
            <p className="mt-2 text-xs leading-snug text-muted-foreground">{t("pages.pricing.tier.freeDesc")}</p>
            <ul className="mt-3 space-y-1.5 text-xs text-[var(--theme-body-text)]">
              <li className="flex gap-1.5">
                <Check className="nn-trust-mark mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden />
                {t("pages.pricing.tier.freeB0")}
              </li>
              <li className="flex gap-1.5">
                <Check className="nn-trust-mark mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden />
                {t("pages.pricing.tier.freeB1")}
              </li>
              <li className="flex gap-1.5">
                <Check className="nn-trust-mark mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden />
                {t("pages.pricing.tier.freeB2")}
              </li>
            </ul>
            <p className="mt-4 text-2xl font-bold">$0</p>
            <Link
              href={tryQuestionsHref}
              className="nn-btn-secondary mt-4 inline-flex w-full justify-center py-2.5 text-sm font-semibold"
            >
              {t("pages.pricing.tier.freeCta")}
            </Link>
          </article>

          {coreRow ? (
            <article className="flex flex-col rounded-2xl border border-[var(--theme-card-border)] bg-card p-5 shadow-sm ring-2 ring-role-cta/25">
              <p className="mb-2 inline-block w-fit rounded-full bg-role-cta-soft px-2 py-0.5 text-xs font-bold text-role-cta-on-soft">
                {t("pages.pricing.tier.coreBadge")}
              </p>
              <h3 className="text-lg font-semibold text-[var(--theme-heading-text)]">{t(DURATION_KEYS[coreRow.duration])}</h3>
              <p className="mt-2 text-xs leading-snug text-muted-foreground">{planPersona[coreRow.duration]}</p>
              <ul className="mt-3 space-y-1.5 text-xs text-[var(--theme-body-text)]">
                {planOutcomeLines[coreRow.duration].map((line) => (
                  <li key={line} className="flex gap-1.5">
                    <Check className="nn-trust-mark mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden />
                    {line}
                  </li>
                ))}
              </ul>
              <p className="mt-4 text-2xl font-bold">{coreRow.totalLabel}</p>
              <p className="text-sm text-muted-foreground">{coreRow.monthlyEquivalentLabel} {t("pages.pricing.plan.avgSuffix")}</p>
              <button
                type="button"
                disabled={checkoutLoading || !policiesAccepted}
                onClick={() => startCheckout(coreRow.duration)}
                className="nn-btn-primary mt-4 w-full py-2.5 text-sm font-semibold disabled:opacity-60"
              >
                {t("pages.pricing.tier.coreCta")}
              </button>
            </article>
          ) : null}

          {premiumRow ? (
            <article className="flex flex-col rounded-2xl border border-role-premium-border bg-role-premium-surface p-5 shadow-sm">
              <p className="mb-2 inline-block w-fit rounded-full border border-role-premium-border bg-role-premium-surface px-2 py-0.5 text-xs font-bold text-role-premium-text">
                {t("pages.pricing.tier.premiumBadge")}
              </p>
              <h3 className="text-lg font-semibold text-[var(--theme-heading-text)]">{t(DURATION_KEYS[premiumRow.duration])}</h3>
              <p className="mt-2 text-xs leading-snug text-muted-foreground">{t("pages.pricing.tier.premiumSub")}</p>
              <ul className="mt-3 space-y-1.5 text-xs text-[var(--theme-body-text)]">
                <li className="flex gap-1.5">
                  <Check className="nn-trust-mark mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden />
                  {t("pages.pricing.tier.premiumB0")}
                </li>
                <li className="flex gap-1.5">
                  <Check className="nn-trust-mark mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden />
                  {t("pages.pricing.tier.premiumB1")}
                </li>
                <li className="flex gap-1.5">
                  <Check className="nn-trust-mark mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden />
                  {t("pages.pricing.tier.premiumB2")}
                </li>
              </ul>
              <p className="mt-4 text-2xl font-bold">{premiumRow.totalLabel}</p>
              <p className="text-sm text-muted-foreground">{premiumRow.monthlyEquivalentLabel} {t("pages.pricing.plan.avgSuffix")}</p>
              {premiumRow.savingsVsMonthlyPercent > 0 ? (
                <p className="mt-2 text-xs font-semibold text-[var(--role-heat-text)]">
                  {t("pages.pricing.plan.saveVsMonthly", { pct: premiumRow.savingsVsMonthlyPercent })}
                </p>
              ) : null}
              <button
                type="button"
                disabled={checkoutLoading || !policiesAccepted}
                onClick={() => startCheckout(premiumRow.duration)}
                className="nn-btn-primary mt-4 w-full py-2.5 text-sm font-semibold disabled:opacity-60"
              >
                {t("pages.pricing.tier.premiumCta")}
              </button>
            </article>
          ) : null}
          {!coreRow && !premiumRow ? (
            <article className="md:col-span-3 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-inset)] p-5 text-sm text-muted-foreground">
              {t("pages.pricing.plansUpdating")}
            </article>
          ) : null}
        </div>
      </section>

      <section className="mt-14">
        <h2 className="text-xl font-bold text-[var(--theme-heading-text)]">{t("pages.pricing.productPreview.title")}</h2>
        <p className="mt-2 text-sm text-muted-foreground">{t("pages.pricing.productPreview.lead")}</p>
        <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {([0, 1, 2, 3] as const).map((i) => (
            <div key={i} className="rounded-xl border border-[var(--theme-card-border)] bg-card p-4">
              <p className="text-sm font-semibold text-[var(--theme-heading-text)]">
                {t(`pages.pricing.productPreview.${i}.title`)}
              </p>
              <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                {t(`pages.pricing.productPreview.${i}.body`)}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-14">
        <h2 className="text-xl font-bold text-[var(--theme-heading-text)]">{t("pages.pricing.examChoose.title")}</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          {t(country === "US" ? "pages.pricing.examChoose.subtitleUS" : "pages.pricing.examChoose.subtitleCA")}
        </p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {Object.values(examLinks).map((item) => (
            <Link
              key={item.labelKey}
              href={item.href}
              className="rounded-xl border border-[var(--theme-card-border)] bg-card p-4 transition hover:border-[var(--border-medium)]"
            >
              <p className="text-sm font-semibold text-[var(--theme-heading-text)]">{t(item.labelKey)}</p>
              <p className="mt-1 text-xs text-muted-foreground">{t(item.blurbKey)}</p>
            </Link>
          ))}
        </div>
        {segment === "np" ? (
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            {country === "US" ? (
              <>
                NP search intent varies by board. Keyword hubs (same FNP or PMHNP pathways):{" "}
                <MarketingTrackedLink
                  href={localize(NP.aanpPracticeTest)}
                  event={PH.marketingPathwayHubCta}
                  eventProps={{ surface: "pricing_compare_np_board_link", pathway_id: "us-np-fnp", link_target: "aanp_practice_test" }}
                  className="font-semibold text-primary hover:underline"
                >
                  AANP practice test
                </MarketingTrackedLink>
                ,{" "}
                <MarketingTrackedLink
                  href={localize(NP.anccFnpPracticeTest)}
                  event={PH.marketingPathwayHubCta}
                  eventProps={{ surface: "pricing_compare_np_board_link", pathway_id: "us-np-fnp", link_target: "ancc_fnp_practice_test" }}
                  className="font-semibold text-primary hover:underline"
                >
                  ANCC FNP practice test
                </MarketingTrackedLink>
                ,{" "}
                <MarketingTrackedLink
                  href={localize(NP.pmhnpPracticeTest)}
                  event={PH.marketingPathwayHubCta}
                  eventProps={{ surface: "pricing_compare_np_board_link", pathway_id: "us-np-pmhnp", link_target: "pmhnp_practice_test" }}
                  className="font-semibold text-primary hover:underline"
                >
                  PMHNP practice test
                </MarketingTrackedLink>
                .
              </>
            ) : (
              <>
                Canadian NP:{" "}
                <MarketingTrackedLink
                  href={localize(NP.cnplePracticeTest)}
                  event={PH.marketingPathwayHubCta}
                  eventProps={{ surface: "pricing_compare_np_board_link", pathway_id: "ca-np-cnple", link_target: "cnple_practice_test" }}
                  className="font-semibold text-primary hover:underline"
                >
                  CNPLE practice test
                </MarketingTrackedLink>{" "}
                matches the national hub path.
              </>
            )}
          </p>
        ) : null}
      </section>

      <div className="mt-12 flex justify-center">
        <Link
          href={tryQuestionsHref}
          className="inline-flex min-h-[48px] items-center justify-center rounded-full border border-role-cta/35 bg-role-cta-soft px-8 py-3 text-sm font-semibold text-role-cta-on-soft hover:bg-[color-mix(in_srgb,var(--role-cta)_14%,var(--bg-card))]"
        >
          {t("pages.pricing.cta.startPractice")}
        </Link>
      </div>

      <p className="mt-10 text-center text-xs text-muted-foreground">{t("pages.pricing.social.pricingFooterLine")}</p>
    </main>
  );
}
