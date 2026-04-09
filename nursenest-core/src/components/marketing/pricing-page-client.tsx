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
import { buildExamPathwayPath, getExamPathwayById } from "@/lib/exam-pathways/exam-product-registry";
import { HUB } from "@/lib/marketing/marketing-entry-routes";
import { marketingExamHubPath } from "@/lib/marketing/country-exam-offerings";
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
import { BILLING_DURATION_ORDER } from "@/lib/pricing/display-catalog";
import {
  MARKETING_PRIMARY_CTA_CLASS,
  MARKETING_SECONDARY_CTA_CLASS,
  MARKETING_TERTIARY_LINK_CLASS,
} from "@/lib/theme/marketing-hero-pattern";
import { MarketingTrustSignalsStrip } from "@/components/marketing/marketing-trust-signals-strip";

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

/** RN, combined PN (RPN CA / LPN US), NP, Allied — matches public tier SKUs. */
type Segment = "rn" | "pn" | "np" | "allied";

function segmentToTierCountry(segment: Segment, country: "CA" | "US"): { tier: TierCode; country: "CA" | "US" } {
  switch (segment) {
    case "pn":
      return country === "CA" ? { tier: "RPN", country: "CA" } : { tier: "LVN_LPN", country: "US" };
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

const DURATION_LABEL_KEYS: Record<BillingDuration, string> = {
  monthly: "pages.pricing.duration.monthly",
  "3-month": "pages.pricing.duration.3month",
  "6-month": "pages.pricing.duration.6month",
  yearly: "pages.pricing.conversion.duration12",
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
  const [country, setCountry] = useState<"CA" | "US">("US");
  const [plans, setPlans] = useState<PlanRow[]>([]);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);
  const [checkoutOpsHint, setCheckoutOpsHint] = useState<string | null>(null);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [policiesAccepted, setPoliciesAccepted] = useState(false);
  const { locale, t } = useMarketingI18n();
  const { region } = useNursenestRegion();
  const institutionalHref = withMarketingLocale(locale, "/for-institutions");

  useEffect(() => {
    setCountry(region === "US" ? "US" : "CA");
  }, [region]);

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

  const { tier, country: effectiveCountry } = segmentToTierCountry(segment, country);
  const narrative = buildTierPricingNarrative(t, tier);

  const filtered = useMemo(
    () => plans.filter((p) => p.tier === tier && p.country === effectiveCountry),
    [plans, tier, effectiveCountry],
  );

  const rowByDuration = useMemo(() => {
    const m = new Map<BillingDuration, PlanRow>();
    for (const p of filtered) m.set(p.duration, p);
    return m;
  }, [filtered]);

  const tryQuestionsHref = localize(rnQuestions(region));

  const termsHref = localize("/terms");
  const privacyHref = localize("/privacy");
  const refundHref = localize("/refund-policy");

  const examLinks = useMemo(() => {
    const rc = country === "US" ? "US" : "CA";
    return {
      rn: {
        labelKey: `pages.pricing.examCard.rn${rc}`,
        href: localize(marketingExamHubPath(country, "rn")),
      },
      pn: {
        labelKey: country === "US" ? "pages.pricing.examCard.pnUS" : "pages.pricing.examCard.pnCA",
        href: localize(marketingExamHubPath(country, "pn")),
      },
      np: {
        labelKey: `pages.pricing.examCard.np${rc}`,
        href: localize(marketingExamHubPath(country, "np")),
      },
      allied: {
        labelKey: `pages.pricing.examCard.allied${rc}`,
        href: localize(marketingExamHubPath(country, "allied")),
      },
    } as const;
  }, [country, localize]);

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

  const includeKeys = ["lessons", "bank", "cat", "analytics"] as const;

  const tierTabs: { id: Segment; labelKey: string }[] = [
    { id: "rn", labelKey: "pages.pricing.segment.rn" },
    { id: "pn", labelKey: "pages.pricing.segment.pnCombined" },
    { id: "np", labelKey: "pages.pricing.segment.np" },
    { id: "allied", labelKey: "pages.pricing.segment.allied" },
  ];

  return (
    <main className="mx-auto w-full max-w-6xl nn-marketing-x pb-[var(--nn-rhythm-page-y)] pt-0">
      {/* 1. Header */}
      <header className="border-b border-[var(--border-subtle)] pb-10 pt-2">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="nn-marketing-h1 text-balance">{heading}</h1>
          <p className="nn-marketing-body mt-3 text-pretty text-muted-foreground">{heroSub}</p>
          <p className="nn-marketing-body-sm mt-2 text-pretty text-muted-foreground">{intro}</p>
          <div className="mx-auto mt-6 max-w-xl text-left">
            <MarketingTrustSignalsStrip variant="compact" />
          </div>
          <p className="nn-marketing-caption mx-auto mt-4 max-w-lg text-muted-foreground">{t("pages.pricing.conversion.checkoutTrust")}</p>
        </div>
      </header>

      {/* Country + tier */}
      <section className="mt-10 space-y-6">
        <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <span className="text-sm font-medium text-muted-foreground">{t("pages.pricing.conversion.billingRegion")}</span>
          <div className="flex gap-2" role="group" aria-label={t("pages.pricing.conversion.billingRegion")}>
            <button
              type="button"
              onClick={() => setCountry("CA")}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                country === "CA"
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "border border-border bg-card text-[var(--theme-body-text)] hover:bg-muted/50"
              }`}
            >
              {t("pages.pricing.country.ca")}
            </button>
            <button
              type="button"
              onClick={() => setCountry("US")}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                country === "US"
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "border border-border bg-card text-[var(--theme-body-text)] hover:bg-muted/50"
              }`}
            >
              {t("pages.pricing.country.us")}
            </button>
          </div>
        </div>

        <div>
          <p className="mb-3 text-center text-sm font-medium text-muted-foreground">{t("pages.pricing.conversion.chooseTrack")}</p>
          <div className="flex flex-wrap justify-center gap-2">
            {tierTabs.map(({ id, labelKey }) => (
              <button
                key={id}
                type="button"
                onClick={() => setSegment(id)}
                className={`rounded-full px-4 py-2.5 text-sm font-semibold transition ${
                  segment === id
                    ? "bg-role-cta text-role-cta-foreground shadow-[0_4px_14px_var(--role-cta-shadow)]"
                    : "border border-[var(--border-medium)] bg-card text-[var(--theme-body-text)] hover:bg-[var(--surface-interactive-hover)]"
                }`}
              >
                {t(labelKey)}
              </button>
            ))}
          </div>
        </div>

        <p className="mx-auto max-w-2xl text-center text-sm text-muted-foreground">{narrative.subhead}</p>
      </section>

      {/* 2–4. Duration cards + includes + pricing */}
      <section className="mt-12" aria-labelledby="pricing-plans-heading">
        <div className="mb-6 text-center">
          <h2 id="pricing-plans-heading" className="nn-marketing-h2">
            {t("pages.pricing.conversion.pickTerm")}
          </h2>
          <p className="nn-marketing-body-sm mt-2 text-muted-foreground">{t("pages.pricing.conversion.pickTermSub")}</p>
          <p className="nn-marketing-caption mt-3 font-medium text-primary">{t("pages.pricing.conversion.mostStudentsLine")}</p>
        </div>

        {loadError ? <p className="mb-6 text-center text-sm text-red-600">{loadError}</p> : null}

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {BILLING_DURATION_ORDER.map((duration) => {
            const row = rowByDuration.get(duration);
            const isBest = row?.isBestValue ?? duration === "yearly";
            const isPop = row?.isMostPopular ?? false;
            return (
              <article
                key={duration}
                className={`relative flex flex-col rounded-2xl border bg-card p-5 shadow-sm ${
                  isBest
                    ? "border-primary ring-2 ring-primary/25"
                    : "border-[var(--theme-card-border)]"
                }`}
              >
                {isBest ? (
                  <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 rounded-full bg-primary px-3 py-0.5 text-[11px] font-bold uppercase tracking-wide text-primary-foreground">
                    {t("pages.pricing.conversion.badgeBestValue")}
                  </span>
                ) : isPop ? (
                  <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 rounded-full bg-muted px-3 py-0.5 text-[11px] font-bold uppercase tracking-wide text-foreground">
                    {t("pages.pricing.conversion.badgePopular")}
                  </span>
                ) : null}

                <h3 className="nn-marketing-h3 mt-1">{t(DURATION_LABEL_KEYS[duration])}</h3>

                <ul className="mt-4 flex-1 space-y-2 text-sm text-[var(--theme-body-text)]">
                  {includeKeys.map((k) => (
                    <li key={k} className="flex gap-2">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400" aria-hidden />
                      <span>{t(`pages.pricing.conversion.includes.${k}`)}</span>
                    </li>
                  ))}
                </ul>

                {row ? (
                  <>
                    <p className="mt-6 nn-marketing-h3 tabular-nums text-[var(--theme-heading-text)]">{row.totalLabel}</p>
                    <p className="text-sm text-muted-foreground">
                      {row.monthlyEquivalentLabel} {t("pages.pricing.plan.avgSuffix")}
                    </p>
                    {row.savingsVsMonthlyPercent > 0 ? (
                      <p className="mt-1 text-xs font-semibold text-emerald-700 dark:text-emerald-400">
                        {t("pages.pricing.plan.saveVsMonthly", { pct: row.savingsVsMonthlyPercent })}
                      </p>
                    ) : null}
                    <button
                      type="button"
                      disabled={checkoutLoading || !policiesAccepted || !row.checkoutAvailable}
                      onClick={() => startCheckout(duration)}
                      className={`${MARKETING_PRIMARY_CTA_CLASS} mt-4 w-full justify-center disabled:pointer-events-none disabled:opacity-50`}
                    >
                      {row.checkoutAvailable ? t("pages.pricing.conversion.ctaSubscribe") : t("pages.pricing.conversion.ctaUnavailable")}
                    </button>
                    {!row.checkoutAvailable ? (
                      <p className="mt-2 text-center text-[11px] leading-snug text-muted-foreground">{t("pages.pricing.conversion.checkoutHintAlt")}</p>
                    ) : null}
                  </>
                ) : (
                  <div className="mt-6 flex flex-1 flex-col justify-end">
                    <p className="text-sm text-muted-foreground">{t("pages.pricing.conversion.planLoading")}</p>
                  </div>
                )}
              </article>
            );
          })}
        </div>

        <div className="mx-auto mt-8 max-w-xl rounded-xl border border-dashed border-border bg-muted/20 px-4 py-3 text-center">
          <p className="text-sm text-muted-foreground">{t("pages.pricing.conversion.freeTeaser")}</p>
          <Link href={tryQuestionsHref} className={`${MARKETING_SECONDARY_CTA_CLASS} mt-3 inline-flex justify-center`}>
            {t("pages.pricing.tier.freeCta")}
            <ArrowRight className="ml-2 h-4 w-4" aria-hidden />
          </Link>
        </div>
      </section>

      {/* Policy + errors */}
      <section className="mt-10 max-w-xl mx-auto">
        <p className="text-sm text-muted-foreground">{t("pages.pricing.billing.recurringShort")}</p>
        {checkoutError ? <p className="mt-3 text-sm text-red-600">{checkoutError}</p> : null}
        {checkoutOpsHint ? (
          <p className="mt-2 rounded-md border border-border/80 bg-muted/40 px-3 py-2 font-mono text-xs text-muted-foreground">{checkoutOpsHint}</p>
        ) : null}

        <div className="mt-6 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-section-alt)] p-4 text-sm">
          <label className="flex cursor-pointer gap-3">
            <input
              type="checkbox"
              className="mt-1 h-4 w-4 shrink-0 rounded border-border"
              checked={policiesAccepted}
              onChange={(e) => setPoliciesAccepted(e.target.checked)}
            />
            <span className="text-[var(--theme-body-text)]">
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
      </section>

      {/* Guarantee */}
      <section className="mt-12 rounded-2xl border border-[var(--theme-card-border)] bg-card p-6 shadow-sm">
        <h2 className="nn-marketing-h3">{t("pages.pricing.trust.guaranteeTitle")}</h2>
        <p className="mt-2 text-sm text-muted-foreground">{t("pages.pricing.trust.guaranteeBody")}</p>
        <ul className="mt-4 space-y-2 text-sm text-[var(--theme-body-text)]">
          <li className="flex gap-2">
            <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden />
            {t("pages.pricing.trust.bullet0")}
          </li>
          <li className="flex gap-2">
            <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden />
            {t("pages.pricing.trust.bullet1")}
          </li>
          <li className="flex gap-2">
            <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden />
            {t("pages.pricing.trust.bullet2")}
          </li>
        </ul>
        <p className="mt-4 text-xs text-muted-foreground">{t("pages.pricing.billing.cancelComfort")}</p>
      </section>

      {/* Compact: institutional + exam hubs */}
      <section className="mt-10 rounded-xl border border-[var(--border-subtle)] bg-muted/15 px-4 py-4 text-sm text-muted-foreground">
        <p>{t("pages.pricing.institutionalBanner")}</p>
        <Link href={institutionalHref} className="nn-link-quiet mt-2 inline-block font-semibold">
          {t("pages.pricing.institutionalLink")} →
        </Link>
      </section>

      <section className="mt-10">
        <h2 className="nn-marketing-h2">{t("pages.pricing.examChoose.title")}</h2>
        <p className="nn-marketing-body-sm mt-2 text-muted-foreground">
          {t(country === "US" ? "pages.pricing.examChoose.subtitleUS" : "pages.pricing.examChoose.subtitleCA")}
        </p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {Object.values(examLinks).map((item) => (
            <Link
              key={item.labelKey}
              href={item.href}
              className="rounded-xl border border-[var(--theme-card-border)] bg-card p-4 transition hover:border-[var(--border-medium)]"
            >
              <p className="nn-marketing-h4">{t(item.labelKey)}</p>
            </Link>
          ))}
        </div>
        {segment === "np" ? (
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            {country === "US" ? (
              <>
                {t("pages.pricing.npTracksIntroUS")}{" "}
                <MarketingTrackedLink
                  href={localize(buildExamPathwayPath(getExamPathwayById("us-np-fnp")!))}
                  event={PH.marketingPathwayHubCta}
                  eventProps={{ surface: "pricing_np_link", pathway_id: "us-np-fnp" }}
                  className="font-semibold text-primary hover:underline"
                >
                  FNP
                </MarketingTrackedLink>
                {", "}
                <MarketingTrackedLink
                  href={localize(buildExamPathwayPath(getExamPathwayById("us-np-pmhnp")!))}
                  event={PH.marketingPathwayHubCta}
                  eventProps={{ surface: "pricing_np_link", pathway_id: "us-np-pmhnp" }}
                  className="font-semibold text-primary hover:underline"
                >
                  PMHNP
                </MarketingTrackedLink>
                .
              </>
            ) : (
              <>
                {t("pages.pricing.npTracksIntroCA")}{" "}
                <MarketingTrackedLink
                  href={localize(buildExamPathwayPath(getExamPathwayById("ca-np-cnple")!))}
                  event={PH.marketingPathwayHubCta}
                  eventProps={{ surface: "pricing_np_link", pathway_id: "ca-np-cnple" }}
                  className="font-semibold text-primary hover:underline"
                >
                  CNPLE hub
                </MarketingTrackedLink>
                .
              </>
            )}
          </p>
        ) : null}
      </section>

      <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
        <Link href={tryQuestionsHref} className={MARKETING_PRIMARY_CTA_CLASS}>
          {t("pages.pricing.cta.startPractice")}
        </Link>
        <Link href={localize(HUB.signup)} className={MARKETING_TERTIARY_LINK_CLASS}>
          {t("pages.pricing.conversion.ctaCreateAccount")}
        </Link>
      </div>

      <p className="mt-8 text-center text-xs text-muted-foreground">{t("pages.pricing.social.pricingFooterLine")}</p>
    </main>
  );
}
