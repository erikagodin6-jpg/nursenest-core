"use client";

import type { TierCode } from "@prisma/client";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Check } from "lucide-react";
import { buildTierPricingNarrative } from "@/lib/conversion/pricing-catalog";
import { trackClientEvent } from "@/lib/observability/posthog-client";
import { PH } from "@/lib/observability/posthog-conversion-events";
import { useMarketingI18n } from "@/lib/marketing-i18n";
import { withMarketingLocale } from "@/lib/i18n/marketing-path";
import { useNursenestRegion } from "@/lib/region/use-nursenest-region";
import { rnQuestions } from "@/lib/marketing/marketing-entry-routes";
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
import {
  BILLING_DURATION_ORDER,
  ALLIED_CAREER_KEYS,
  ALLIED_CAREER_DISPLAY_NAMES,
  type AlliedCareerKey,
} from "@/lib/pricing/display-catalog";
import {
  MARKETING_PRIMARY_CTA_CLASS,
  MARKETING_SECONDARY_CTA_CLASS,
  MARKETING_TERTIARY_LINK_CLASS,
} from "@/lib/theme/marketing-hero-pattern";
import { PricingHero } from "@/components/marketing/pricing-hero";
import {
  ValuePropsStrip,
  FeatureComparisonTable,
  PricingFeaturesGrid,
  WhyItWorks,
  AlliedHealthClarity,
  PricingUnlockSection,
  ProductPreviewGrid,
  PricingTrustReassurance,
  PricingCTA,
} from "@/components/marketing/pricing-sections";
import { useExperiment } from "@/lib/experiments/use-experiment";
import {
  HERO_CTA_COPY,
  TRIAL_MESSAGING_COPY,
} from "@/lib/experiments/experiment-engine";

type NursingPlanRow = {
  tier: TierCode;
  country: "CA" | "US";
  duration: BillingDuration;
  checkoutAvailable: boolean;
  totalLabel: string;
  monthlyEquivalentLabel: string;
  savingsVsMonthlyPercent: number;
  isBestValue: boolean;
  isMostPopular: boolean;
  anchorPriceLabel: string | null;
  planCode: string;
};

type AlliedPlanRow = {
  tier: "ALLIED";
  alliedCareer: AlliedCareerKey;
  alliedCareerLabel: string;
  country: "CA" | "US";
  duration: BillingDuration;
  checkoutAvailable: boolean;
  totalLabel: string;
  monthlyEquivalentLabel: string;
  savingsVsMonthlyPercent: number;
  isBestValue: boolean;
  isMostPopular: boolean;
  planCode: string;
};

type Segment = "prenursing" | "newgrad" | "rn" | "pn" | "np" | "allied";

function segmentToTier(segment: Segment): TierCode {
  switch (segment) {
    case "prenursing": return "PRE_NURSING";
    case "newgrad": return "NEW_GRAD";
    case "pn": return "RPN";
    case "rn": return "RN";
    case "np": return "NP";
    case "allied": return "ALLIED";
    default: return "RN";
  }
}

const SEGMENT_LABELS: Record<Segment, string> = {
  prenursing: "Pre-Nursing",
  newgrad: "New Grad",
  rn: "RN / NCLEX-RN",
  pn: "RPN / REx-PN",
  np: "NP",
  allied: "Allied Health",
};

const DURATION_LABELS: Record<BillingDuration, string> = {
  monthly: "Monthly",
  "3-month": "3 Month",
  "6-month": "6 Month",
  yearly: "12 Month",
};

const DURATION_MICROCOPY: Record<BillingDuration, string> = {
  monthly: "Flexible access",
  "3-month": "Most students choose this",
  "6-month": "Build confidence at your own pace",
  yearly: "Best value for long-term prep",
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
  const [selectedAlliedCareer, setSelectedAlliedCareer] = useState<AlliedCareerKey>("paramedic");
  const [nursingPlans, setNursingPlans] = useState<NursingPlanRow[]>([]);
  const [alliedPlans, setAlliedPlans] = useState<AlliedPlanRow[]>([]);
  const [trialDays, setTrialDays] = useState(3);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);
  const [checkoutOpsHint, setCheckoutOpsHint] = useState<string | null>(null);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [policiesAccepted, setPoliciesAccepted] = useState(false);
  const { locale, t } = useMarketingI18n();
  const { region } = useNursenestRegion();

  const heroCtaVariant = useExperiment("hero_cta");
  const trialMsgVariant = useExperiment("trial_messaging");
  const heroCtaLabel = HERO_CTA_COPY[heroCtaVariant] ?? "Start Free Trial";
  const trialSubtext = TRIAL_MESSAGING_COPY[trialMsgVariant] ?? "No charge today. Cancel anytime before your trial ends.";

  useEffect(() => {
    trackClientEvent("pricing_page_viewed", {
      actor: "anonymous",
      funnel_step: "pricing_page_view",
    });
  }, []);

  const localize = useCallback((href: string) => withMarketingLocale(locale, href), [locale]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/pricing/options");
        const data = await res.json();
        if (!res.ok) throw new Error("load_failed");
        if (!cancelled) {
          setNursingPlans(data.plans ?? []);
          setAlliedPlans(data.alliedPlans ?? []);
          if (typeof data.trialDays === "number") setTrialDays(data.trialDays);
        }
      } catch {
        if (!cancelled) setLoadError(t("pages.pricing.error.loadPlans"));
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [t]);

  const tier = segmentToTier(segment);
  const narrative = buildTierPricingNarrative(t, tier);
  const isAllied = segment === "allied";

  const filteredNursingPlans = useMemo(
    () => nursingPlans.filter((p) => p.tier === tier),
    [nursingPlans, tier],
  );

  const filteredAlliedPlans = useMemo(
    () => alliedPlans.filter((p) => p.alliedCareer === selectedAlliedCareer),
    [alliedPlans, selectedAlliedCareer],
  );

  const displayPlans = isAllied ? filteredAlliedPlans : filteredNursingPlans;

  const rowByDuration = useMemo(() => {
    const m = new Map<BillingDuration, NursingPlanRow | AlliedPlanRow>();
    for (const p of displayPlans) m.set(p.duration, p);
    return m;
  }, [displayPlans]);

  const tryQuestionsHref = localize(rnQuestions(region));
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
        actor: "anonymous",
        funnel_step: "checkout_initiated",
        tier: String(tier),
        duration: String(duration),
        has_trial: trialDays > 0,
        trial_days: trialDays,
        ...(isAllied ? { alliedCareer: selectedAlliedCareer } : {}),
      });
      try {
        const body: Record<string, unknown> = {
          tier,
          duration,
          acceptPolicies: true,
          policyVersion: LEGAL_POLICY_BUNDLE_VERSION,
          region,
        };
        if (isAllied) {
          body.alliedCareer = selectedAlliedCareer;
        }
        const res = await fetch("/api/subscriptions/checkout", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
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
        window.location.href = (data as { url: string }).url;
      } catch {
        setCheckoutOpsHint(null);
        setCheckoutError(t("pages.pricing.error.checkoutNetwork"));
        setCheckoutLoading(false);
      }
    },
    [policiesAccepted, tier, trialDays, t, isAllied, selectedAlliedCareer],
  );

  const SEGMENT_ORDER: Segment[] = ["prenursing", "newgrad", "rn", "pn", "np", "allied"];

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-col gap-20 nn-marketing-x pb-[var(--nn-rhythm-page-y)] pt-0 md:gap-24">

      {/* ── Section 1: Hero ── */}
      <PricingHero
        studySystemHref={localize("/how-it-works")}
        ctaLabel={heroCtaLabel}
        trialSubtext={trialSubtext}
      />

      {/* ── Section 2: Trust + Value Strip ── */}
      <ValuePropsStrip />

      {/* ── Section 3: Plan Selector + Section 4: Pricing Cards ── */}
      <section aria-labelledby="pricing-plans-heading" className="space-y-12">
        <div className="text-center">
          <h2 id="pricing-plans-heading" className="nn-marketing-h2">
            Choose Your Plan
          </h2>
          <p className="nn-marketing-body-sm mx-auto mt-2 max-w-xl text-muted-foreground">
            {narrative.subhead}
          </p>
        </div>

        {/* Tier tabs */}
        <div className="space-y-4">
          <p className="text-center text-sm font-medium text-muted-foreground">
            Select Your Exam Track
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            {SEGMENT_ORDER.map((id) => (
              <button
                key={id}
                type="button"
                onClick={() => {
                  setSegment(id);
                  trackClientEvent("tier_selected", { segment: id, tier: segmentToTier(id) });
                }}
                className={`rounded-full px-4 py-2.5 text-sm font-semibold transition-[background-color,color,box-shadow,transform,border-color] duration-150 ease-out ${
                  segment === id
                    ? "bg-role-cta text-role-cta-foreground shadow-[0_4px_14px_var(--role-cta-shadow)]"
                    : "border border-[var(--border-medium)] bg-card text-[var(--palette-text)] hover:-translate-y-px hover:bg-[var(--surface-interactive-hover)] hover:shadow-[var(--elevation-hover)]"
                }`}
              >
                {SEGMENT_LABELS[id]}
              </button>
            ))}
          </div>
        </div>

        {/* Allied career selector */}
        {isAllied && (
          <div className="mx-auto max-w-lg space-y-3">
            <p className="text-center text-sm font-medium text-muted-foreground">
              Select Your Career Line
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              {ALLIED_CAREER_KEYS.map((career) => (
                <button
                  key={career}
                  type="button"
                  onClick={() => {
                    setSelectedAlliedCareer(career);
                    trackClientEvent("allied_career_selected", { career });
                  }}
                  className={`rounded-full px-3 py-1.5 text-xs font-semibold transition-[background-color,color,box-shadow,transform] duration-150 ease-out ${
                    selectedAlliedCareer === career
                      ? "bg-[var(--semantic-brand)] text-white shadow-[var(--elevation-rest)]"
                      : "border border-[var(--border-medium)] bg-card text-[var(--palette-text)] hover:-translate-y-px hover:bg-[var(--surface-interactive-hover)] hover:shadow-[var(--elevation-hover)]"
                  }`}
                >
                  {ALLIED_CAREER_DISPLAY_NAMES[career]}
                </button>
              ))}
            </div>
            <AlliedHealthClarity />
          </div>
        )}

        {loadError ? <p className="text-center text-sm text-destructive">{loadError}</p> : null}

        {/* Pricing cards */}
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4 xl:gap-6 xl:items-start">
          {BILLING_DURATION_ORDER.map((duration) => {
            const row = rowByDuration.get(duration);
            const isBest = row?.isBestValue ?? duration === "yearly";
            const isPop = row?.isMostPopular ?? false;
            const isHighlighted = isBest || isPop;

            return (
              <article
                key={duration}
                className={`nn-card-interactive nn-motion-standard relative flex flex-col rounded-2xl transition-shadow duration-200 ${
                  isPop
                    ? "z-10 border-2 border-[var(--semantic-info)] bg-[color-mix(in_srgb,var(--semantic-info)_5%,var(--color-card))] p-7 shadow-[0_8px_32px_-4px_color-mix(in_srgb,var(--semantic-info)_20%,transparent)] xl:-my-3 xl:p-8"
                    : isBest
                      ? "border-2 border-primary bg-[color-mix(in_srgb,var(--palette-primary)_4%,var(--color-card))] p-7 shadow-[0_4px_20px_-4px_color-mix(in_srgb,var(--palette-primary)_14%,transparent)]"
                      : "border border-[var(--palette-border)] bg-card p-6 shadow-[var(--elevation-rest)] hover:shadow-[var(--elevation-hover)]"
                }`}
              >
                {isPop ? (
                  <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-[var(--semantic-info)] px-5 py-1.5 text-xs font-bold uppercase tracking-wide text-white shadow-[0_2px_8px_color-mix(in_srgb,var(--semantic-info)_30%,transparent)]">
                    Most Popular
                  </span>
                ) : isBest ? (
                  <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-primary px-5 py-1.5 text-xs font-bold uppercase tracking-wide text-primary-foreground shadow-[0_2px_8px_color-mix(in_srgb,var(--palette-primary)_24%,transparent)]">
                    Best Value
                  </span>
                ) : null}

                <h3 className={isPop ? "text-xl font-bold text-[var(--palette-heading)]" : "nn-marketing-h3"}>{DURATION_LABELS[duration]}</h3>

                <p className={`mt-2 leading-snug text-muted-foreground ${isPop ? "text-sm font-medium" : "text-[13px]"}`}>
                  {DURATION_MICROCOPY[duration]}
                </p>

                {duration !== "monthly" && (
                  <p className="mt-2 inline-flex items-center gap-1.5 text-[11px] font-semibold tracking-wide text-[var(--semantic-success)]">
                    <span className="inline-block h-1.5 w-1.5 rounded-full bg-[var(--semantic-success)]" aria-hidden />
                    Founding Pricing
                  </p>
                )}

                {row ? (
                  <>
                    <div
                      className="mt-6 border-t pt-5"
                      style={{ borderColor: isPop
                        ? "color-mix(in srgb, var(--semantic-info) 15%, var(--semantic-border-soft))"
                        : "var(--semantic-border-soft)" }}
                    >
                      {"anchorPriceLabel" in row && row.anchorPriceLabel && (
                        <p className="text-sm text-muted-foreground line-through decoration-muted-foreground/50">
                          {row.anchorPriceLabel}
                        </p>
                      )}
                      <p className={`font-black tabular-nums text-[var(--palette-heading)] ${isPop ? "text-3xl" : isHighlighted ? "text-[28px]" : "text-2xl"}`}>
                        {row.totalLabel}
                      </p>
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {row.monthlyEquivalentLabel} {t("pages.pricing.plan.avgSuffix")}
                    </p>
                    {row.savingsVsMonthlyPercent > 0 ? (
                      <p className="mt-1.5 text-xs font-semibold text-[var(--semantic-success)]">
                        {t("pages.pricing.plan.saveVsMonthly", { pct: row.savingsVsMonthlyPercent })}
                      </p>
                    ) : null}

                    <ul className="mt-6 flex-1 space-y-2.5 text-sm text-[var(--palette-text)]">
                      {["All lessons and questions", "CAT exams and practice tests", "Smart review and analytics", "Personalized study plan"].map((item) => (
                        <li key={item} className="flex gap-2">
                          <Check className="mt-0.5 h-4 w-4 shrink-0 text-[var(--semantic-success)]" aria-hidden />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>

                    <button
                      type="button"
                      disabled={checkoutLoading || !policiesAccepted || !row.checkoutAvailable}
                      onClick={() => startCheckout(duration)}
                      className={`${isHighlighted ? MARKETING_PRIMARY_CTA_CLASS : MARKETING_SECONDARY_CTA_CLASS} mt-6 w-full justify-center disabled:pointer-events-none disabled:opacity-50`}
                    >
                      {row.checkoutAvailable ? heroCtaLabel : "Coming Soon"}
                    </button>
                    {row.checkoutAvailable ? (
                      <p className={`mt-3 text-center text-xs leading-snug ${isPop ? "font-semibold text-[var(--semantic-info)]" : "text-muted-foreground"}`}>
                        No Charge Today
                      </p>
                    ) : (
                      <p className="mt-3 text-center text-xs leading-snug text-muted-foreground">
                        This plan is not yet available for checkout
                      </p>
                    )}
                  </>
                ) : (
                  <div className="mt-8 flex flex-1 flex-col justify-end">
                    <p className="text-sm text-muted-foreground">Loading pricing...</p>
                  </div>
                )}
              </article>
            );
          })}
        </div>

        {/* Trial callout */}
        {trialDays > 0 && (
          <div className="mx-auto max-w-xl rounded-2xl border border-[var(--semantic-success)]/20 bg-[color-mix(in_srgb,var(--semantic-success)_5%,var(--color-card))] px-8 py-6 text-center shadow-[var(--elevation-rest)]">
            <p className="text-lg font-semibold text-[var(--palette-heading)]">
              Try Everything Free for {trialDays} Days
            </p>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              Full access to all lessons, practice tests, CAT exams, and analytics.
              No charge until your trial ends. Cancel anytime in one click.
            </p>
            <p className="mt-2 text-xs text-muted-foreground">
              Payment method required to start your trial. You will not be charged during the trial period.
            </p>
          </div>
        )}

        {/* Policy acceptance */}
        <div className="mx-auto max-w-xl space-y-4">
          {checkoutError ? <p className="text-center text-sm text-destructive">{checkoutError}</p> : null}
          {checkoutOpsHint ? (
            <p className="rounded-md border border-border/80 bg-muted/40 px-3 py-2 font-mono text-xs text-muted-foreground">{checkoutOpsHint}</p>
          ) : null}

          <div className="rounded-xl border border-[var(--accent-surface-b-border)] bg-[var(--accent-surface-b)] p-4 text-sm">
            <label className="flex cursor-pointer gap-3">
              <input
                type="checkbox"
                className="mt-1 h-4 w-4 shrink-0 rounded border-border"
                checked={policiesAccepted}
                onChange={(e) => setPoliciesAccepted(e.target.checked)}
              />
              <span className="text-[var(--palette-text)]">
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
        </div>
      </section>

      {/* ── Section 5 (comparison) ── */}
      <FeatureComparisonTable />

      {/* ── Section 6: What You Get ── */}
      <PricingFeaturesGrid />

      {/* ── Section 6b: Deep unlock showcase ── */}
      <PricingUnlockSection />

      {/* ── Product screenshots ── */}
      <ProductPreviewGrid />

      {/* ── Section 7: Why NurseNest Works ── */}
      <WhyItWorks />

      {/* ── Trust ── */}
      <PricingTrustReassurance />

      {/* ── Section 9: Final CTA ── */}
      <PricingCTA plansHref="#pricing-plans-heading" />

      {/* Bottom links */}
      <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
        <Link href="#pricing-plans-heading" className={MARKETING_PRIMARY_CTA_CLASS}>
          {heroCtaLabel}
        </Link>
        <Link href={tryQuestionsHref} className={MARKETING_TERTIARY_LINK_CLASS}>
          Or Try Free Questions First
        </Link>
      </div>
    </main>
  );
}
