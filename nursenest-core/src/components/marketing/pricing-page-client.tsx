"use client";

import type { TierCode } from "@prisma/client";
import Link from "next/link";
import { Suspense, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { Check } from "lucide-react";
import { buildTierPricingNarrative } from "@/lib/conversion/pricing-catalog";
import { PH } from "@/lib/observability/posthog-conversion-events";
import { trackProductEvent } from "@/lib/observability/product-analytics";
import { useMarketingI18n } from "@/lib/marketing-i18n";
import { withMarketingLocale } from "@/lib/i18n/marketing-path";
import { useNursenestRegion } from "@/lib/region/use-nursenest-region";
import { useClientGlobalRegionCookie } from "@/lib/region/use-client-global-region";
import { canShowPricing } from "@/lib/navigation/market-readiness";
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
import { getExamLabel, getNursingRoleLabel } from "@/lib/labels/nursing-role-labels";
import { BrandTrustInline } from "@/components/brand/brand-trust-inline";
import { PricingConversionClarity } from "@/components/marketing/pricing-conversion-clarity";
import { PricingRegionFaq } from "@/components/marketing/pricing-region-faq";
import { PricingReliabilityFaq } from "@/components/marketing/pricing-reliability-faq";
import { PricingLearnerFaq } from "@/components/marketing/pricing-learner-faq";
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

function isRenderablePlanRow(row: NursingPlanRow | AlliedPlanRow): boolean {
  return Boolean(
    row.totalLabel?.trim() &&
      row.monthlyEquivalentLabel?.trim() &&
      row.planCode?.trim(),
  );
}

type CheckoutRequestError = Error & {
  parsed?: ParsedCheckoutErrorBody;
  status?: number;
};

function segmentToTier(segment: Segment, isUS?: boolean): TierCode {
  switch (segment) {
    case "prenursing": return "PRE_NURSING";
    case "newgrad": return "NEW_GRAD";
    // "pn" covers both Canada RPN and US LVN_LPN — resolve by region
    case "pn": return isUS ? "LVN_LPN" : "RPN";
    case "rn": return "RN";
    case "np": return "NP";
    case "allied": return "ALLIED";
    default: return "RN";
  }
}

function tierToSegment(tier: TierCode, isUS?: boolean): Segment {
  switch (tier) {
    case "PRE_NURSING": return "prenursing";
    case "NEW_GRAD": return "newgrad";
    case "LVN_LPN":
    case "RPN": return "pn";
    case "RN": return "rn";
    case "NP": return "np";
    case "ALLIED": return "allied";
    default: return isUS ? "rn" : "rn";
  }
}

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

const TRIAL_PRIMARY_COPY = "Start your 3-day free trial";
const TRIAL_SECONDARY_COPY = "No charge today. Cancel anytime before your trial ends.";
const TRIAL_FINE_PRINT_COPY = "Billing begins automatically after 3 days unless cancelled.";

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

function PricingPlanGridSkeleton() {
  return (
    <div
      className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4 xl:gap-6 xl:items-start"
      aria-busy="true"
      aria-label="Loading pricing plans"
    >
      {BILLING_DURATION_ORDER.map((duration) => (
        <article
          key={duration}
          className="relative flex min-h-[26rem] flex-col rounded-2xl border border-[var(--palette-border)] bg-card p-6 shadow-[var(--elevation-rest)] xl:min-h-[25.5rem]"
        >
          <div className="h-7 w-28 max-w-[70%] animate-pulse rounded-md bg-[color-mix(in_srgb,var(--semantic-panel-muted)_55%,var(--semantic-border-soft))]" />
          <div className="mt-2 h-4 w-[88%] max-w-xs animate-pulse rounded-md bg-[color-mix(in_srgb,var(--semantic-panel-muted)_45%,var(--semantic-border-soft))]" />
          <div className="mt-2 h-3 w-24 animate-pulse rounded-md bg-[color-mix(in_srgb,var(--semantic-panel-muted)_35%,var(--semantic-border-soft))]" />
          <div className="mt-6 border-t border-[var(--semantic-border-soft)] pt-5">
            <div className="h-4 w-20 animate-pulse rounded-md bg-[color-mix(in_srgb,var(--semantic-panel-muted)_40%,var(--semantic-border-soft))]" />
            <div className="mt-3 h-9 w-36 animate-pulse rounded-md bg-[color-mix(in_srgb,var(--semantic-panel-muted)_50%,var(--semantic-border-soft))]" />
            <div className="mt-2 h-3 w-44 animate-pulse rounded-md bg-[color-mix(in_srgb,var(--semantic-panel-muted)_35%,var(--semantic-border-soft))]" />
          </div>
          <div className="mt-6 flex flex-1 flex-col gap-2.5">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="flex gap-2">
                <div className="mt-0.5 h-4 w-4 shrink-0 animate-pulse rounded-sm bg-[color-mix(in_srgb,var(--semantic-panel-muted)_40%,var(--semantic-border-soft))]" />
                <div className="h-4 flex-1 animate-pulse rounded-md bg-[color-mix(in_srgb,var(--semantic-panel-muted)_35%,var(--semantic-border-soft))]" />
              </div>
            ))}
          </div>
          <div className="mt-6 h-11 w-full animate-pulse rounded-xl bg-[color-mix(in_srgb,var(--semantic-panel-muted)_45%,var(--semantic-border-soft))]" />
          <div className="mx-auto mt-3 h-3 w-48 animate-pulse rounded-md bg-[color-mix(in_srgb,var(--semantic-panel-muted)_30%,var(--semantic-border-soft))]" />
        </article>
      ))}
    </div>
  );
}

function PricingPlansStatusPanel({
  message,
  onRetry,
}: {
  message: string;
  onRetry: () => void;
}) {
  return (
    <div
      className="mx-auto max-w-lg rounded-xl border border-[color-mix(in_srgb,var(--semantic-info)_28%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-info)_06%,var(--semantic-surface))] px-4 py-3 text-center text-sm text-[var(--semantic-text-secondary)] shadow-[var(--semantic-shadow-soft)]"
      role="status"
    >
      <p>{message}</p>
      <button
        type="button"
        className="mt-2 text-sm font-semibold text-primary underline underline-offset-2 hover:opacity-90"
        onClick={onRetry}
      >
        Refresh page
      </button>
    </div>
  );
}

function CheckoutCancelledNotice() {
  const sp = useSearchParams();
  const [dismissed, setDismissed] = useState(false);
  if (dismissed || sp.get("checkout") !== "cancelled") return null;
  return (
    <div className="rounded-xl border border-[color-mix(in_srgb,var(--semantic-warning)_30%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-warning)_8%,var(--color-card))] px-4 py-3 text-sm shadow-[var(--elevation-rest)]">
      <p className="font-semibold text-[var(--semantic-warning-contrast)]">Checkout was cancelled</p>
      <p className="mt-0.5 text-[color-mix(in_srgb,var(--semantic-warning-contrast)_85%,var(--semantic-text-muted))]">
        No payment was taken. Choose a plan whenever you&apos;re ready.
      </p>
      <button type="button" onClick={() => setDismissed(true)} className="mt-1.5 text-xs underline opacity-70 hover:opacity-100">
        Dismiss
      </button>
    </div>
  );
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
  const [showConsentPrompt, setShowConsentPrompt] = useState(false);
  const [pendingCheckoutDuration, setPendingCheckoutDuration] = useState<BillingDuration | null>(null);
  const [checkoutIntentHandled, setCheckoutIntentHandled] = useState(false);
  const [plansLoaded, setPlansLoaded] = useState(false);
  const { locale, t } = useMarketingI18n();
  /** `t` is recreated when marketing shards merge — do not use it as a fetch effect dep (can starve in-flight loads). */
  const tRef = useRef(t);
  tRef.current = t;
  const { region } = useNursenestRegion();
  const globalMarketSlug = useClientGlobalRegionCookie();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { status: authStatus } = useSession();

  const heroCtaLabel = TRIAL_PRIMARY_COPY;
  const trialSubtext = TRIAL_SECONDARY_COPY;
  const pricingCurrencyLine = useMemo(
    () =>
      region === "US"
        ? "All prices are shown in U.S. dollars."
        : "All prices are shown in Canadian dollars.",
    [region],
  );

  useEffect(() => {
    trackProductEvent("pricing_page_viewed", {
      actor: "anonymous",
      funnel_step: "pricing_page_view",
      marketing_locale: locale,
      marketing_region: region,
      pricing_segment: segment,
    });
  }, [locale, region, segment]);

  const localize = useCallback((href: string) => withMarketingLocale(locale, href), [locale]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        /** Avoid stale browser HTTP cache for anonymous pricing JSON (CDN is still authoritative at origin). */
        const res = await fetch("/api/pricing/options", { cache: "no-store" });
        if (!res.ok) throw new Error("load_failed");
        const data = (await res.json()) as Record<string, unknown>;
        const plans = data.plans;
        const allied = data.alliedPlans;
        if (!Array.isArray(plans) || !Array.isArray(allied)) {
          if (!cancelled) {
            setNursingPlans([]);
            setAlliedPlans([]);
            setLoadError(tRef.current("pages.pricing.error.pricingTemporarilyUnavailable"));
            setPlansLoaded(true);
          }
          return;
        }
        if (plans.length === 0 && allied.length === 0) {
          if (!cancelled) {
            setNursingPlans([]);
            setAlliedPlans([]);
            setLoadError(tRef.current("pages.pricing.error.pricingTemporarilyUnavailable"));
            setPlansLoaded(true);
          }
          return;
        }
        if (!cancelled) {
          setLoadError(null);
          setNursingPlans(plans as NursingPlanRow[]);
          setAlliedPlans(allied as AlliedPlanRow[]);
          if (typeof data.trialDays === "number") setTrialDays(data.trialDays);
          setPlansLoaded(true);
        }
      } catch {
        if (!cancelled) {
          setLoadError(tRef.current("pages.pricing.error.loadPlans"));
          setPlansLoaded(true);
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const isUS = region === "US";
  const segmentLabels: Record<Segment, string> = useMemo(
    () => ({
      prenursing: "Pre-Nursing",
      newgrad: "New Grad",
      rn: "RN / NCLEX-RN",
      pn: `${getNursingRoleLabel({ country: region, role: "PN" })} / ${getExamLabel({ country: region, role: "PN" })}`,
      np: "NP",
      allied: "Allied Health",
    }),
    [region],
  );
  const tier = segmentToTier(segment, isUS);
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

  const trackDataGap = useMemo(
    () =>
      plansLoaded &&
      loadError === null &&
      displayPlans.length === 0 &&
      (nursingPlans.length > 0 || alliedPlans.length > 0),
    [plansLoaded, loadError, displayPlans.length, nursingPlans.length, alliedPlans.length],
  );

  const showPricingGrid = plansLoaded && loadError === null && !trackDataGap;

  const showNorthAmericaStripeScopeNote = useMemo(() => {
    if (!globalMarketSlug) return false;
    return !canShowPricing(globalMarketSlug);
  }, [globalMarketSlug]);

  const tryQuestionsHref = localize(rnQuestions(region));
  const termsHref = localize("/terms");
  const privacyHref = localize("/privacy");
  const refundHref = localize("/refund-policy");

  const startCheckout = useCallback(
    async (duration: BillingDuration) => {
      setCheckoutError(null);
      setCheckoutOpsHint(null);
      setCheckoutLoading(true);
      trackProductEvent(PH.checkoutStarted, {
        actor: "anonymous",
        funnel_step: "checkout_initiated",
        stripe_tier: String(tier),
        tier: String(tier),
        duration: String(duration),
        has_trial: trialDays > 0,
        trial_days: trialDays,
        marketing_locale: locale,
        marketing_region: region,
        pricing_segment: segment,
        ...(isAllied ? { allied_career: selectedAlliedCareer } : {}),
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
        console.info("[pricing_checkout] request_payload", body);

        const res = await fetch("/api/subscriptions/checkout", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
        console.info("[pricing_checkout] response_status", {
          status: res.status,
          ok: res.ok,
          contentType: res.headers.get("content-type") ?? "",
        });

        const responseText = await res.text();
        const contentType = res.headers.get("content-type") ?? "";

        if (!res.ok) {
          console.error("[pricing_checkout] checkout API error response", {
            status: res.status,
            contentType,
            body: responseText,
          });
        }

        let parsedBody: unknown = null;
        const trimmedResponse = responseText.trim();
        const responseLooksJson =
          contentType.toLowerCase().includes("application/json") ||
          trimmedResponse.startsWith("{") ||
          trimmedResponse.startsWith("[");
        if (trimmedResponse.length > 0 && responseLooksJson) {
          try {
            parsedBody = JSON.parse(trimmedResponse) as unknown;
          } catch (parseError) {
            console.error("[pricing_checkout] response_json_parse_failed", parseError);
            parsedBody = null;
          }
        }

        if (!res.ok) {
          const parsed = parseCheckoutApiErrorBody(parsedBody);
          console.error("[pricing_checkout] parsed_error_body", parsed);
          const err = new Error(checkoutErrorUserMessage(parsed, res.status, t)) as CheckoutRequestError;
          err.parsed = parsed;
          err.status = res.status;
          throw err;
        }

        if (!contentType.toLowerCase().includes("application/json")) {
          console.error("[pricing_checkout] checkout API returned non-JSON response", {
            status: res.status,
            contentType,
            body: responseText,
          });
          throw new Error(t("pages.pricing.error.checkoutTemporarilyUnavailable"));
        }

        if (!parsedBody || typeof parsedBody !== "object") {
          throw new Error(t("pages.pricing.error.checkoutTemporarilyUnavailable"));
        }

        const checkoutUrl = (parsedBody as { url?: unknown }).url;
        if (typeof checkoutUrl !== "string" || checkoutUrl.trim().length === 0) {
          throw new Error(t("pages.pricing.error.checkoutTemporarilyUnavailable"));
        }
        console.info("[pricing_checkout] redirect_url_received", { checkoutUrl });
        window.location.assign(checkoutUrl);
      } catch (error) {
        console.error("[pricing_checkout] start checkout failed", error);
        setCheckoutOpsHint(null);
        const checkoutErr = error as CheckoutRequestError;
        if (checkoutErr.parsed?.code === STRIPE_PRICE_NOT_CONFIGURED_CODE) {
          setCheckoutError(t("pages.pricing.error.checkoutPlanNotConfigured"));
          if (showStripePriceEnvKeyOnCheckoutError() && checkoutErr.parsed.envKey) {
            setCheckoutOpsHint(t("pages.pricing.error.checkoutOpsStripePrice", { envKey: checkoutErr.parsed.envKey }));
          }
        } else {
          const raw = error instanceof Error ? error.message.trim() : "";
          if (!raw) {
            setCheckoutError(t("pages.pricing.error.checkoutNetwork"));
          } else if (/failed to fetch|networkerror|load[_ ]failed/i.test(raw)) {
            setCheckoutError(t("pages.pricing.error.checkoutNetwork"));
          } else if (
            raw.includes("Checkout service") ||
            raw.includes("Stripe redirect") ||
            raw.includes("unexpected response") ||
            raw.includes("empty response")
          ) {
            setCheckoutError(t("pages.pricing.error.checkoutTemporarilyUnavailable"));
          } else {
            setCheckoutError(raw);
          }
        }
        setCheckoutLoading(false);
      }
    },
    [tier, trialDays, t, isAllied, selectedAlliedCareer, region, locale, segment],
  );

  const requestCheckout = useCallback(
    (duration: BillingDuration) => {
      setCheckoutError(null);
      setCheckoutOpsHint(null);
      if (authStatus === "loading") return;
      if (authStatus !== "authenticated") {
        const callbackParams = new URLSearchParams(searchParams.toString());
        callbackParams.set("checkoutIntent", "1");
        callbackParams.set("checkoutTier", tier);
        callbackParams.set("checkoutDuration", duration);
        if (isAllied) callbackParams.set("checkoutAlliedCareer", selectedAlliedCareer);
        else callbackParams.delete("checkoutAlliedCareer");
        const callbackPath = `${pathname}?${callbackParams.toString()}`;
        const loginPath = localize("/login");
        const signInUrl = `${loginPath}?callbackUrl=${encodeURIComponent(callbackPath)}`;
        window.location.assign(signInUrl);
        return;
      }
      if (policiesAccepted) {
        void startCheckout(duration);
        return;
      }
      setPendingCheckoutDuration(duration);
      setShowConsentPrompt(true);
    },
    [authStatus, isAllied, localize, pathname, policiesAccepted, searchParams, selectedAlliedCareer, startCheckout, tier],
  );

  const confirmConsentAndCheckout = useCallback(() => {
    if (!pendingCheckoutDuration) return;
    if (!policiesAccepted) {
      setCheckoutError(t("pages.pricing.checkout.mustAcceptPolicies"));
      return;
    }
    setShowConsentPrompt(false);
    const duration = pendingCheckoutDuration;
    setPendingCheckoutDuration(null);
    void startCheckout(duration);
  }, [pendingCheckoutDuration, policiesAccepted, startCheckout, t]);

  const SEGMENT_ORDER: Segment[] = ["prenursing", "newgrad", "rn", "pn", "np", "allied"];

  useEffect(() => {
    if (checkoutIntentHandled || authStatus !== "authenticated") return;
    if (searchParams.get("checkoutIntent") !== "1") return;

    const checkoutTier = searchParams.get("checkoutTier");
    const checkoutDuration = searchParams.get("checkoutDuration");
    if (!checkoutTier || !checkoutDuration) return;

    const allowedTiers: TierCode[] = ["PRE_NURSING", "NEW_GRAD", "RPN", "LVN_LPN", "RN", "NP", "ALLIED"];
    const allowedDurations: BillingDuration[] = ["monthly", "3-month", "6-month", "yearly"];
    if (!allowedTiers.includes(checkoutTier as TierCode) || !allowedDurations.includes(checkoutDuration as BillingDuration)) {
      return;
    }

    const tierCode = checkoutTier as TierCode;
    const durationCode = checkoutDuration as BillingDuration;
    setSegment(tierToSegment(tierCode, region === "US"));
    if (tierCode === "ALLIED") {
      const checkoutAlliedCareer = searchParams.get("checkoutAlliedCareer");
      if (checkoutAlliedCareer && ALLIED_CAREER_KEYS.includes(checkoutAlliedCareer as AlliedCareerKey)) {
        setSelectedAlliedCareer(checkoutAlliedCareer as AlliedCareerKey);
      }
    }
    setPendingCheckoutDuration(durationCode);
    setShowConsentPrompt(true);
    setCheckoutIntentHandled(true);

    const cleanParams = new URLSearchParams(searchParams.toString());
    cleanParams.delete("checkoutIntent");
    cleanParams.delete("checkoutTier");
    cleanParams.delete("checkoutDuration");
    cleanParams.delete("checkoutAlliedCareer");
    const cleanUrl = cleanParams.size > 0 ? `${pathname}?${cleanParams.toString()}` : pathname;
    window.history.replaceState({}, "", cleanUrl);
  }, [authStatus, checkoutIntentHandled, pathname, region, searchParams]);

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-col gap-20 nn-marketing-x pb-[var(--nn-rhythm-page-y)] pt-0 md:gap-24">

      {/* ── Section 1: Hero ── */}
      <PricingHero
        studySystemHref={localize("/how-it-works")}
        ctaLabel={heroCtaLabel}
        trialSubtext={trialSubtext}
        trialFinePrint={TRIAL_FINE_PRINT_COPY}
        pricesShownLine={pricingCurrencyLine}
      />

      {showNorthAmericaStripeScopeNote ? (
        <div
          className="rounded-xl border border-[color-mix(in_srgb,var(--semantic-warning)_28%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-warning)_08%,var(--semantic-surface))] px-4 py-3 text-sm text-[var(--semantic-text-secondary)] shadow-[var(--semantic-shadow-soft)]"
          role="status"
        >
          <p>{t("pages.pricing.globalContext.northAmericaStripeScope")}</p>
        </div>
      ) : null}

      {/* ── Section 2: Trust + Value Strip ── */}
      <div className="flex flex-col items-center gap-4 text-center">
        <BrandTrustInline variant="pricing" className="justify-center" />
        <ValuePropsStrip />
      </div>

      {/* ── Section 2b: Value breakdown, included vs not, payment safety, objections ── */}
      <PricingConversionClarity />

      {/* ── Section 2c: US / Canada & exam scope FAQ ── */}
      <PricingRegionFaq />

      {/* ── Section 2d: Stability, performance, study continuity ── */}
      <PricingReliabilityFaq />

      {/* ── Section 2e: Pass anxiety, try-before-pay, refund honesty ── */}
      <PricingLearnerFaq />

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
                  trackProductEvent("tier_selected", {
                    segment: id,
                    tier: segmentToTier(id, region === "US"),
                    marketing_locale: locale,
                    marketing_region: region,
                  });
                }}
                className={`rounded-full px-4 py-2.5 text-sm font-semibold transition-[background-color,color,box-shadow,transform,border-color] duration-150 ease-out ${
                  segment === id
                    ? "bg-role-cta text-role-cta-foreground shadow-[0_4px_14px_var(--role-cta-shadow)]"
                    : "border border-[var(--border-medium)] bg-card text-[var(--palette-text)] hover:-translate-y-px hover:bg-[var(--surface-interactive-hover)] hover:shadow-[var(--elevation-hover)]"
                }`}
              >
                {segmentLabels[id]}
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
                    trackProductEvent("allied_career_selected", {
                      career,
                      marketing_locale: locale,
                      marketing_region: region,
                    });
                  }}
                  className={`rounded-full px-3 py-1.5 text-xs font-semibold transition-[background-color,color,box-shadow,transform] duration-150 ease-out ${
                    selectedAlliedCareer === career
                      ? "bg-[var(--semantic-brand)] text-[var(--semantic-brand-contrast)] shadow-[var(--elevation-rest)]"
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

        <Suspense fallback={null}>
          <CheckoutCancelledNotice />
        </Suspense>

        {!plansLoaded && !loadError ? <PricingPlanGridSkeleton /> : null}

        {plansLoaded && loadError ? (
          <PricingPlansStatusPanel message={loadError} onRetry={() => window.location.reload()} />
        ) : null}

        {plansLoaded && !loadError && trackDataGap ? (
          <PricingPlansStatusPanel
            message={t("pages.pricing.error.trackTemporarilyUnavailable")}
            onRetry={() => window.location.reload()}
          />
        ) : null}

        {/* Pricing cards — real list prices from `/api/pricing/options` (display catalog + Stripe checkout flags). */}
        {showPricingGrid ? (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4 xl:gap-6 xl:items-start">
          {BILLING_DURATION_ORDER.map((duration) => {
            const rawRow = rowByDuration.get(duration);
            const row = rawRow && isRenderablePlanRow(rawRow) ? rawRow : undefined;
            /**
             * Catalog gaps: e.g. NEW_GRAD / PRE_NURSING have no 3-month row in `display-catalog` (no Stripe
             * price for that combo). We must **not** drop the grid cell — that read as “pricing never loaded”.
             */
            const slotUnavailable = Boolean(!rawRow);
            const rowDataInvalid = Boolean(rawRow && !row);
            const isBest = Boolean(row?.isBestValue);
            const isPop = Boolean(row?.isMostPopular);
            const isHighlighted = Boolean(row) && !slotUnavailable && !rowDataInvalid && (isBest || isPop);

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
                  <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-[var(--semantic-info)] px-5 py-1.5 text-xs font-bold uppercase tracking-wide text-[var(--text-inverse)] shadow-[0_2px_8px_color-mix(in_srgb,var(--semantic-info)_30%,transparent)]">
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

                {rowDataInvalid ? (
                  <div className="mt-8 flex flex-1 flex-col justify-end gap-2">
                    <p className="text-sm text-muted-foreground">{t("pages.pricing.plan.rowDataIncomplete")}</p>
                  </div>
                ) : slotUnavailable ? (
                  <div className="mt-8 flex flex-1 flex-col justify-end gap-2">
                    <p className="text-sm text-muted-foreground">{t("pages.pricing.plan.durationNotOffered")}</p>
                  </div>
                ) : row ? (
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
                      disabled={checkoutLoading || !row.checkoutAvailable}
                      onClick={() => requestCheckout(duration)}
                      className={`${isHighlighted ? MARKETING_PRIMARY_CTA_CLASS : MARKETING_SECONDARY_CTA_CLASS} mt-6 w-full justify-center disabled:pointer-events-none disabled:opacity-50`}
                    >
                      {row.checkoutAvailable ? TRIAL_PRIMARY_COPY : t("pages.pricing.checkout.comingSoon")}
                    </button>
                    {row.checkoutAvailable ? (
                      <>
                        <p className={`mt-3 text-center text-xs leading-snug ${isPop ? "font-semibold text-[var(--semantic-info)]" : "text-muted-foreground"}`}>
                          {TRIAL_SECONDARY_COPY}
                        </p>
                        <p className="mt-1 text-center text-[11px] leading-snug text-muted-foreground">
                          {TRIAL_FINE_PRINT_COPY}
                        </p>
                      </>
                    ) : (
                      <p className="mt-3 text-center text-xs leading-snug text-muted-foreground">
                        {t("pages.pricing.checkout.unavailableBody")}
                      </p>
                    )}
                  </>
                ) : null}
              </article>
            );
          })}
        </div>
        ) : null}

        {showConsentPrompt ? (
          <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/45 px-4 pb-4 pt-24 sm:items-center sm:pb-6">
            <div className="w-full max-w-xl rounded-2xl border border-[var(--accent-surface-b-border)] bg-[var(--color-card)] p-5 shadow-[var(--elevation-hover)] sm:p-6">
              <h3 className="text-lg font-semibold text-[var(--palette-heading)]">
                Confirm before checkout
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Before we take you to secure checkout, please confirm your agreement to our policies, including recurring billing and cancellation rules.
              </p>

              <div className="mt-4 rounded-xl border border-[var(--accent-surface-b-border)] bg-[var(--accent-surface-b)] p-4 text-sm">
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

              <div className="mt-5 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  className={MARKETING_TERTIARY_LINK_CLASS}
                  onClick={() => {
                    setShowConsentPrompt(false);
                    setPendingCheckoutDuration(null);
                    setCheckoutError(null);
                  }}
                  disabled={checkoutLoading}
                >
                  Not now
                </button>
                <button
                  type="button"
                  className={MARKETING_PRIMARY_CTA_CLASS}
                  onClick={confirmConsentAndCheckout}
                  disabled={checkoutLoading || !policiesAccepted}
                >
                  Continue to secure checkout
                </button>
              </div>
            </div>
          </div>
        ) : null}

        {/* Trial callout */}
        {trialDays > 0 && (
          <div className="mx-auto max-w-xl rounded-2xl border border-[var(--semantic-success)]/20 bg-[color-mix(in_srgb,var(--semantic-success)_5%,var(--color-card))] px-8 py-6 text-center shadow-[var(--elevation-rest)]">
            <p className="text-lg font-semibold text-[var(--palette-heading)]">
              Try Everything Free for {trialDays} Days
            </p>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              Full access to all lessons, practice tests, CAT exams, and analytics.
              {` ${TRIAL_SECONDARY_COPY}`}
            </p>
            <p className="mt-2 text-xs text-muted-foreground">
              Payment method required. {TRIAL_FINE_PRINT_COPY}
            </p>
          </div>
        )}

        {/* Checkout feedback */}
        <div className="mx-auto max-w-xl space-y-4">
          {checkoutError ? <p className="text-center text-sm text-destructive">{checkoutError}</p> : null}
          {checkoutOpsHint ? (
            <p className="rounded-md border border-border/80 bg-muted/40 px-3 py-2 font-mono text-xs text-muted-foreground">{checkoutOpsHint}</p>
          ) : null}
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
      <div className="text-center">
        <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <Link href="#pricing-plans-heading" className={MARKETING_PRIMARY_CTA_CLASS}>
            {TRIAL_PRIMARY_COPY}
          </Link>
          <Link href={tryQuestionsHref} className={MARKETING_TERTIARY_LINK_CLASS}>
            Or Try Free Questions First
          </Link>
        </div>
        <p className="mt-3 text-xs text-muted-foreground">
          {TRIAL_SECONDARY_COPY}
        </p>
        <p className="mt-1 text-[11px] text-muted-foreground">
          {TRIAL_FINE_PRINT_COPY}
        </p>
      </div>
    </main>
  );
}
