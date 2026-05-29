"use client";

import type { TierCode } from "@prisma/client";
import Link from "next/link";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type MouseEvent,
  type ReactNode,
} from "react";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { Check } from "lucide-react";
import { buildTierPricingNarrative } from "@/lib/conversion/pricing-catalog";
import { PH } from "@/lib/observability/posthog-conversion-events";
import { trackProductEvent } from "@/lib/observability/product-analytics";
import { useMarketingI18n } from "@/lib/marketing-i18n";
import { withMarketingLocale } from "@/lib/i18n/marketing-path";
import { useNursenestRegion } from "@/lib/region/use-nursenest-region";
import { useClientGlobalRegionCookie } from "@/lib/region/use-client-global-region";
import type { GlobalRegionSlug } from "@/lib/i18n/global-regions";
import { isGlobalRegionSlug } from "@/lib/i18n/global-regions";
import { canShowPricing } from "@/lib/navigation/market-readiness";
import { rnQuestions } from "@/lib/marketing/marketing-entry-routes";
import { LEGAL_POLICY_BUNDLE_VERSION } from "@/lib/legal/legal-config";
import {
  CHECKOUT_INVALID_PAYLOAD_CODE,
  CHECKOUT_NA_BILLING_SCOPE_ACK_REQUIRED_CODE,
  CHECKOUT_POLICY_VERSION_MISMATCH_CODE,
  CHECKOUT_SESSION_FAILED_CODE,
  CHECKOUT_STRIPE_UNAVAILABLE_CODE,
  CHECKOUT_UNAUTHORIZED_CODE,
  CHECKOUT_FREE_PATHWAY_NO_STRIPE_CODE,
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
  isFreeStripeBillingNursingTier,
  type AlliedCareerKey,
} from "@/lib/pricing/display-catalog";
import { fetchPricingOptionsPayloadDeduped } from "@/lib/pricing/pricing-options-client-fetch";
import type { PricingOptionsPayload } from "@/lib/pricing/pricing-options-payload-types";
import {
  MARKETING_PRIMARY_CTA_CLASS,
  MARKETING_SECONDARY_CTA_CLASS,
  MARKETING_TERTIARY_LINK_CLASS,
} from "@/lib/theme/marketing-hero-pattern";
import {
  getExamLabel,
  getNursingRoleLabel,
} from "@/lib/labels/nursing-role-labels";
import { BrandTrustInline } from "@/components/brand/brand-trust-inline";
import { PricingConversionClarity } from "@/components/marketing/pricing-conversion-clarity";
import { PricingClinicalReadinessEcosystem } from "@/components/marketing/pricing-clinical-readiness-ecosystem";
import { PricingInteractiveShowcase } from "@/components/marketing/pricing-interactive-showcase";
import { PricingLabsWorkstationFeature } from "@/components/marketing/pricing-labs-workstation-feature";
import { PricingMedCalcWorkstationFeature } from "@/components/marketing/pricing-med-calc-workstation-feature";
import { PricingClinicalSkillsWorkstationFeature } from "@/components/marketing/pricing-clinical-skills-workstation-feature";
import { PricingAdvancedEcgAddOn } from "@/components/marketing/pricing-advanced-ecg-add-on";
import { PricingEcgClarityBlock } from "@/components/marketing/pricing-ecg-clarity-block";
import { PricingRegionFaq } from "@/components/marketing/pricing-region-faq";
import { PricingReliabilityFaq } from "@/components/marketing/pricing-reliability-faq";
import { PricingLearnerFaq } from "@/components/marketing/pricing-learner-faq";
import { PricingSubscriptionFaq } from "@/components/marketing/pricing-subscription-faq";
import { PricingHero } from "@/components/marketing/pricing-hero";
import { PricingTierScopePanel } from "@/components/marketing/pricing-tier-scope-panel";
import {
  SiConvMarketingExplainer,
  SiConvPricingFeatureDisclosure,
} from "@/components/marketing/si-conv-clinical-reasoning-support";
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
import { TierValueExperience } from "@/components/marketing/tier-value-experience";
import type { TierValueKey } from "@/lib/marketing/tier-value-experience";

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

function marketingPricingPayloadHasRenderablePlans(
  p: PricingOptionsPayload,
): boolean {
  const plans = p.plans;
  const allied = p.alliedPlans;
  return (
    (Array.isArray(plans) && plans.length > 0) ||
    (Array.isArray(allied) && allied.length > 0)
  );
}

/** Paid exam tracks only — pre-nursing is free and lives under `/pre-nursing`, not on `/pricing`. */
type Segment = "newgrad" | "rn" | "pn" | "np" | "allied";

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
    case "newgrad":
      return "NEW_GRAD";
    // "pn" covers both Canada RPN and US LVN_LPN — resolve by region
    case "pn":
      return isUS ? "LVN_LPN" : "RPN";
    case "rn":
      return "RN";
    case "np":
      return "NP";
    case "allied":
      return "ALLIED";
    default:
      return "RN";
  }
}

function tierToSegment(tier: TierCode, isUS?: boolean): Segment {
  switch (tier) {
    /** Not listed on pricing; avoid impossible UI state if URL ever references this tier. */
    case "PRE_NURSING":
      return "rn";
    case "NEW_GRAD":
      return "newgrad";
    case "LVN_LPN":
    case "RPN":
      return "pn";
    case "RN":
      return "rn";
    case "NP":
      return "np";
    case "ALLIED":
      return "allied";
    default:
      return isUS ? "rn" : "rn";
  }
}

function segmentToTierValueKey(segment: Segment): TierValueKey {
  switch (segment) {
    case "newgrad":
      return "newgrad";
    case "pn":
      return "pn";
    case "np":
      return "np";
    case "allied":
      return "allied";
    case "rn":
    default:
      return "rn";
  }
}

function tierValueKeyToSegment(key: TierValueKey): Segment | null {
  switch (key) {
    case "newgrad":
      return "newgrad";
    case "pn":
      return "pn";
    case "np":
      return "np";
    case "allied":
      return "allied";
    case "rn":
      return "rn";
    case "preNursing":
      return null;
  }
}

/** Maps billing durations to public marketing keys (`marketing-en.json`). */
const PLAN_DURATION_LABEL_KEY: Record<BillingDuration, string> = {
  monthly: "pages.pricing.planDuration.monthly",
  "3-month": "pages.pricing.planDuration.3-month",
  "6-month": "pages.pricing.planDuration.6-month",
  yearly: "pages.pricing.planDuration.yearly",
};

const DURATION_TAGLINE_KEY: Record<BillingDuration, string> = {
  monthly: "pages.pricing.duration.tagline.monthly",
  "3-month": "pages.pricing.duration.tagline.3-month",
  "6-month": "pages.pricing.duration.tagline.6-month",
  yearly: "pages.pricing.duration.tagline.yearly",
};

const PLAN_CARD_BULLET_KEYS = [
  "pages.pricing.planCard.bullet1",
  "pages.pricing.planCard.bullet2",
  "pages.pricing.planCard.bullet3",
  "pages.pricing.planCard.bullet4",
] as const;

const CHECKOUT_LOADING_LABEL = "Loading checkout...";
const CHECKOUT_INTENT_STORAGE_KEY = "nn_pricing_checkout_intent";

function preventCheckoutDefault(event?: MouseEvent<HTMLElement>) {
  event?.preventDefault();
  event?.stopPropagation();
}

function validatedCheckoutRedirectUrl(rawUrl: unknown): string | null {
  if (typeof rawUrl !== "string") return null;
  const trimmed = rawUrl.trim();
  if (!trimmed) return null;
  try {
    const url = new URL(trimmed);
    if (url.protocol !== "https:" && url.protocol !== "http:") return null;
    return url.toString();
  } catch {
    return null;
  }
}

const PRICING_AUDIENCE_SEGMENTS = [
  {
    title: "Individual Providers",
    body: "Independent clinicians, tutors, and educators who need exam-aligned learning tools, clinical modules, and focused readiness support.",
    bullets: [
      "Single-seat access",
      "Clinical readiness modules",
      "Flexible learner pathways",
    ],
  },
  {
    title: "Clinics",
    body: "Small teams that want structured onboarding, consistent clinical refreshers, and shared readiness language across providers or learners.",
    bullets: [
      "Multi-provider onboarding",
      "Role-aware study pathways",
      "Team implementation support",
    ],
  },
  {
    title: "Healthcare Organizations",
    body: "Organizations supporting cohorts, transition-to-practice programs, remediation, or clinical education initiatives at scale.",
    bullets: [
      "Cohort rollout planning",
      "Analytics and reporting options",
      "Enterprise support workflows",
    ],
  },
  {
    title: "Institutional / Enterprise Pricing",
    body: "Custom contracts for schools, programs, and healthcare systems that need scalable licensing, enterprise support, reporting, and integration planning.",
    bullets: [
      "Custom contracts",
      "Scalable licensing",
      "API/EHR integration planning",
      "Advanced analytics and reporting",
    ],
  },
] as const;

function PricingAudienceSection() {
  return (
    <section
      aria-labelledby="pricing-audience-heading"
      className="rounded-[2rem] border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-6 shadow-[var(--semantic-shadow-soft)] sm:p-8"
    >
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-3xl">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--semantic-brand)]">
            Pricing pathways
          </p>
          <h2
            id="pricing-audience-heading"
            className="mt-3 text-3xl font-bold tracking-tight text-[var(--theme-heading-text)]"
          >
            Plans for individuals, clinics, and institutions
          </h2>
          <p className="mt-4 text-sm leading-7 text-[var(--theme-body-text)]">
            Choose self-serve access for individual study, or start a sales
            conversation for multi-provider onboarding, enterprise support,
            analytics, reporting, and integration planning.
          </p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <Link
            href="/for-institutions"
            className={MARKETING_PRIMARY_CTA_CLASS}
          >
            Book a Demo
          </Link>
          <Link href="/contact" className={MARKETING_SECONDARY_CTA_CLASS}>
            Contact Sales
          </Link>
          <Link
            href="#pricing-plans-heading"
            className={MARKETING_TERTIARY_LINK_CLASS}
          >
            Get Started
          </Link>
        </div>
      </div>

      <div className="mt-7 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {PRICING_AUDIENCE_SEGMENTS.map((segment) => (
          <article
            key={segment.title}
            className="rounded-2xl border border-[var(--semantic-border-soft)] bg-[color-mix(in_srgb,var(--semantic-surface-alt)_62%,var(--semantic-surface))] p-5"
          >
            <h3 className="text-base font-semibold text-[var(--theme-heading-text)]">
              {segment.title}
            </h3>
            <p className="mt-3 text-sm leading-6 text-[var(--theme-body-text)]">
              {segment.body}
            </p>
            <ul className="mt-4 space-y-2 text-sm leading-6 text-[var(--semantic-text-secondary)]">
              {segment.bullets.map((bullet) => (
                <li key={bullet} className="flex gap-2">
                  <Check
                    className="mt-0.5 h-4 w-4 shrink-0 text-[var(--semantic-success)]"
                    aria-hidden
                  />
                  <span>{bullet}</span>
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </section>
  );
}

function checkoutErrorUserMessage(
  parsed: ParsedCheckoutErrorBody,
  httpStatus: number,
  t: (key: string, params?: Record<string, string | number>) => string,
): string {
  const { code, message } = parsed;
  if (code === STRIPE_PRICE_NOT_CONFIGURED_CODE)
    return t("pages.pricing.error.checkoutPlanNotConfigured");
  if (code === CHECKOUT_FREE_PATHWAY_NO_STRIPE_CODE)
    return t("pages.pricing.error.checkoutFreePathway");
  if (code === CHECKOUT_UNAUTHORIZED_CODE || httpStatus === 401)
    return t("pages.pricing.error.checkoutSignIn");
  if (code === CHECKOUT_POLICY_VERSION_MISMATCH_CODE)
    return t("pages.pricing.error.checkoutPolicyStale");
  if (code === CHECKOUT_NA_BILLING_SCOPE_ACK_REQUIRED_CODE)
    return t("pages.pricing.globalContext.mustAckBeforeCheckout");
  if (code === CHECKOUT_INVALID_PAYLOAD_CODE)
    return t("pages.pricing.error.checkoutInvalidRequest");
  if (
    code === CHECKOUT_STRIPE_UNAVAILABLE_CODE ||
    code === CHECKOUT_SESSION_FAILED_CODE
  ) {
    return t("pages.pricing.error.checkoutTemporarilyUnavailable");
  }
  if (message.length > 0) return message;
  return t("pages.pricing.error.checkoutUnavailable");
}

function PricingPlanGridSkeleton({ ariaLabel }: { ariaLabel: string }) {
  return (
    <div
      className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4 xl:gap-6 xl:items-start"
      aria-busy="true"
      aria-label={ariaLabel}
    >
      {BILLING_DURATION_ORDER.map((duration) => (
        <article
          key={duration}
          className="relative flex min-h-[20rem] flex-col rounded-2xl border border-[var(--palette-border)] bg-card p-6 shadow-[var(--elevation-rest)] sm:min-h-[26rem] xl:min-h-[25.5rem]"
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
  refreshLabel,
}: {
  message: string;
  onRetry: () => void;
  refreshLabel: string;
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
        {refreshLabel}
      </button>
    </div>
  );
}

function CheckoutCancelledNotice({
  searchQuery,
  t,
}: {
  searchQuery: string;
  t: (key: string, params?: Record<string, string | number>) => string;
}) {
  const sp = useMemo(() => new URLSearchParams(searchQuery), [searchQuery]);
  const [dismissed, setDismissed] = useState(false);
  if (dismissed || sp.get("checkout") !== "cancelled") return null;
  return (
    <div className="rounded-xl border border-[color-mix(in_srgb,var(--semantic-warning)_30%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-warning)_8%,var(--color-card))] px-4 py-3 text-sm shadow-[var(--elevation-rest)]">
      <p className="font-semibold text-[var(--semantic-warning-contrast)]">
        {t("pages.pricing.checkout.cancelledHeading")}
      </p>
      <p className="mt-0.5 text-[color-mix(in_srgb,var(--semantic-warning-contrast)_85%,var(--semantic-text-muted))]">
        {t("pages.pricing.checkout.cancelledBody")}
      </p>
      <button
        type="button"
        onClick={() => setDismissed(true)}
        className="mt-1.5 text-xs underline opacity-70 hover:opacity-100"
      >
        {t("pages.pricing.checkout.dismissCancelled")}
      </button>
    </div>
  );
}

export function PricingPageClient({
  heading,
  intro,
  heroSub,
  serverCheckoutRegionSlugs = [],
  serverTierSubheads = {},
  initialPricingOptions,
  initialSearchParamsString = "",
  featureMatrix = null,
}: {
  heading: string;
  intro: string;
  heroSub: string;
  /** Server union of `nn_global_region` + signed explicit checkout context (HttpOnly); keeps pricing gate aligned with POST checkout. */
  serverCheckoutRegionSlugs?: readonly GlobalRegionSlug[];
  /** RSC-resolved tier subheads (`getRequiredPublicMetadataLine`) — avoids client `t()` missing-key gaps under plan headings. */
  serverTierSubheads?: Partial<Record<TierCode, string>>;
  /**
   * Same payload as `GET /api/pricing/options`, built during RSC render so the grid is not blocked
   * by a second client fetch (rate limits, CDN, or transient `/api` failures).
   */
  initialPricingOptions: PricingOptionsPayload;
  /** From RSC `searchParams` — avoids `useSearchParams()` (CSR bailout + full-page Suspense skeleton on `/pricing`). */
  initialSearchParamsString?: string;
  /** Server-rendered feature matrix; kept out of the client bundle because it reads cached inventory. */
  featureMatrix?: ReactNode;
}) {
  const hasServerCatalogRef = useRef(
    marketingPricingPayloadHasRenderablePlans(initialPricingOptions),
  );
  const [segment, setSegment] = useState<Segment>("rn");
  const [selectedAlliedCareer, setSelectedAlliedCareer] =
    useState<AlliedCareerKey>("paramedic");
  const checkoutSegmentRef = useRef<Segment>("rn");
  const checkoutAlliedCareerRef = useRef<AlliedCareerKey>("paramedic");
  useEffect(() => {
    checkoutSegmentRef.current = segment;
  }, [segment]);
  useEffect(() => {
    checkoutAlliedCareerRef.current = selectedAlliedCareer;
  }, [selectedAlliedCareer]);
  const [nursingPlans, setNursingPlans] = useState<NursingPlanRow[]>(() =>
    Array.isArray(initialPricingOptions.plans)
      ? (initialPricingOptions.plans as NursingPlanRow[])
      : [],
  );
  const [alliedPlans, setAlliedPlans] = useState<AlliedPlanRow[]>(() =>
    Array.isArray(initialPricingOptions.alliedPlans)
      ? (initialPricingOptions.alliedPlans as AlliedPlanRow[])
      : [],
  );
  const [trialDays, setTrialDays] = useState(() =>
    typeof initialPricingOptions.trialDays === "number"
      ? initialPricingOptions.trialDays
      : 3,
  );
  const [loadError, setLoadError] = useState<string | null>(null);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);
  const [checkoutOpsHint, setCheckoutOpsHint] = useState<string | null>(null);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [clientReady, setClientReady] = useState(false);
  const [policiesAccepted, setPoliciesAccepted] = useState(false);
  const [showConsentPrompt, setShowConsentPrompt] = useState(false);
  const [pendingCheckoutDuration, setPendingCheckoutDuration] =
    useState<BillingDuration | null>(null);
  const [checkoutIntentHandled, setCheckoutIntentHandled] = useState(false);
  const checkoutInFlightRef = useRef(false);
  const [plansLoaded, setPlansLoaded] = useState(
    () => hasServerCatalogRef.current,
  );
  /** Soft gate: partial global regions (cookie + signed explicit context) require NA billing acknowledgment before checkout. */
  const [naPathwayAcknowledged, setNaPathwayAcknowledged] = useState(false);
  /** Allied Health only — explicit acknowledgement before any paid checkout (persists until segment/career changes). */
  const [alliedProfessionCheckoutAck, setAlliedProfessionCheckoutAck] =
    useState(false);
  const { locale, t } = useMarketingI18n();
  useEffect(() => {
    setClientReady(true);
  }, []);
  /** `t` is recreated when marketing shards merge — do not use it as a fetch effect dep (can starve in-flight loads). */
  const tRef = useRef(t);
  tRef.current = t;
  const { region } = useNursenestRegion();
  const globalMarketSlug = useClientGlobalRegionCookie();
  const authoritativeRegionSlugs = useMemo(() => {
    const s = new Set<GlobalRegionSlug>();
    for (const x of serverCheckoutRegionSlugs) {
      if (isGlobalRegionSlug(x)) s.add(x);
    }
    if (globalMarketSlug) s.add(globalMarketSlug);
    return [...s];
  }, [serverCheckoutRegionSlugs, globalMarketSlug]);

  const checkoutBodyGlobalSlug = useMemo((): GlobalRegionSlug => {
    if (globalMarketSlug) return globalMarketSlug;
    const fromServer = serverCheckoutRegionSlugs.find((slug) =>
      isGlobalRegionSlug(slug),
    );
    if (fromServer) return fromServer;
    return region === "US" ? "us" : "canada";
  }, [globalMarketSlug, serverCheckoutRegionSlugs, region]);

  const pathname = usePathname();
  const { status: authStatus } = useSession();

  const heroTrialFooter = useMemo(() => {
    if (trialDays <= 0) {
      return {
        sub: t("pages.pricing.checkout.recurringShort"),
        fine: "" as const,
      };
    }
    return {
      sub: t("pages.pricing.trial.shortLead"),
      fine: t("pages.pricing.trial.shortFinePrint"),
    };
  }, [trialDays, t]);

  const pricingCurrencyLine = useMemo(
    () =>
      region === "US"
        ? t("pages.pricing.pricesShown.us")
        : t("pages.pricing.pricesShown.ca"),
    [region, t],
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

  const localize = useCallback(
    (href: string) => withMarketingLocale(locale, href),
    [locale],
  );

  useEffect(() => {
    if (hasServerCatalogRef.current) {
      setPlansLoaded(true);
      return;
    }

    let cancelled = false;
    const hadRenderableServerCatalog = hasServerCatalogRef.current;

    const applyPayload = (data: PricingOptionsPayload): boolean => {
      const plans = data.plans;
      const allied = data.alliedPlans;
      if (!Array.isArray(plans) || !Array.isArray(allied)) return false;
      if (plans.length === 0 && allied.length === 0) return false;
      setLoadError(null);
      setNursingPlans(plans as NursingPlanRow[]);
      setAlliedPlans(allied as AlliedPlanRow[]);
      if (typeof data.trialDays === "number") setTrialDays(data.trialDays);
      return true;
    };

    (async () => {
      try {
        /** Deduped fetch — must not replace a valid SSR catalog with empty/error (rate limits, transient API). */
        const raw = await fetchPricingOptionsPayloadDeduped();
        if (cancelled) return;
        const data = raw as PricingOptionsPayload;
        const ok = applyPayload(data);
        if (!ok) {
          if (!hadRenderableServerCatalog && !hasServerCatalogRef.current) {
            setNursingPlans([]);
            setAlliedPlans([]);
            setLoadError(
              tRef.current("pages.pricing.error.pricingTemporarilyUnavailable"),
            );
          } else if (hadRenderableServerCatalog) {
            console.warn(
              JSON.stringify({
                scope: "marketing_pricing",
                event: "pricing_options_refresh_empty_kept_ssr",
              }),
            );
          }
        }
      } catch (e) {
        if (cancelled) return;
        if (!hadRenderableServerCatalog && !hasServerCatalogRef.current) {
          setLoadError(tRef.current("pages.pricing.error.loadPlans"));
        } else {
          console.warn(
            JSON.stringify({
              scope: "marketing_pricing",
              event: "pricing_options_refresh_failed_kept_ssr",
              message: (e instanceof Error ? e.message : String(e)).slice(
                0,
                240,
              ),
            }),
          );
        }
      } finally {
        if (!cancelled) setPlansLoaded(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const isUS = region === "US";
  /** Narrow to label helpers' union — matches {@link NursenestRegionRoot} server resolution. */
  const examLabelCountry: "US" | "CA" = region === "US" ? "US" : "CA";
  const segmentLabels: Record<Segment, string> = useMemo(
    () => ({
      newgrad: t("pages.pricing.segmentTab.newgrad"),
      rn: t("pages.pricing.segmentTab.rn"),
      pn: t("pages.pricing.segmentTab.pnTemplate", {
        role: getNursingRoleLabel({ country: examLabelCountry, role: "PN" }),
        exam: getExamLabel({ country: examLabelCountry, role: "PN" }),
      }),
      np: t("pages.pricing.segmentTab.np"),
      allied: t("pages.pricing.segmentTab.allied"),
    }),
    [examLabelCountry, t],
  );
  const tier = segmentToTier(segment, isUS);
  const narrative = useMemo(() => {
    const built = buildTierPricingNarrative(t, tier);
    const serverSub = serverTierSubheads[tier]?.trim();
    if (serverSub) return { ...built, subhead: serverSub };
    return built;
  }, [t, tier, serverTierSubheads]);
  const isAllied = segment === "allied";
  const selectedTierScopeLabel = isAllied
    ? ALLIED_CAREER_DISPLAY_NAMES[selectedAlliedCareer]
    : segmentLabels[segment];
  const alliedCheckoutBlocked = isAllied && !alliedProfessionCheckoutAck;
  const isFreeNursingPricingTrack =
    !isAllied && isFreeStripeBillingNursingTier(tier);

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
      !isFreeNursingPricingTrack &&
      plansLoaded &&
      loadError === null &&
      displayPlans.length === 0 &&
      (nursingPlans.length > 0 || alliedPlans.length > 0),
    [
      isFreeNursingPricingTrack,
      plansLoaded,
      loadError,
      displayPlans.length,
      nursingPlans.length,
      alliedPlans.length,
    ],
  );

  const showPricingGrid = plansLoaded && loadError === null && !trackDataGap;
  const showPaidPlanDurationGrid =
    showPricingGrid && !isFreeNursingPricingTrack;

  const showNorthAmericaStripeScopeNote = useMemo(
    () => authoritativeRegionSlugs.some((slug) => !canShowPricing(slug)),
    [authoritativeRegionSlugs],
  );

  const pricingCheckoutSoftGate = showNorthAmericaStripeScopeNote;

  const authoritativeRegionKey = authoritativeRegionSlugs.join(",");
  useEffect(() => {
    setNaPathwayAcknowledged(false);
  }, [authoritativeRegionKey]);

  useEffect(() => {
    setAlliedProfessionCheckoutAck(false);
  }, [segment, selectedAlliedCareer]);

  const paidPlanPrimaryCtaLabel = useMemo(
    () =>
      pricingCheckoutSoftGate
        ? t("pages.pricing.checkout.ctaJoinNorthAmericaPathways")
        : t("pages.pricing.conversion.ctaSubscribe"),
    [pricingCheckoutSoftGate, t],
  );

  const heroCtaLabel = paidPlanPrimaryCtaLabel;

  const tryQuestionsHref = localize(rnQuestions(region));
  const termsHref = localize("/terms");
  const privacyHref = localize("/privacy");
  const refundHref = localize("/refund-policy");

  /** Guest → `/login?callbackUrl=…` with checkout intent on the pricing URL (same contract as {@link requestCheckout}). */
  const redirectGuestToLoginForCheckout = useCallback(
    (duration: BillingDuration) => {
      const checkoutSegment = checkoutSegmentRef.current;
      const checkoutTier = segmentToTier(checkoutSegment, region === "US");
      const checkoutIsAllied = checkoutSegment === "allied";
      const checkoutAlliedCareer = checkoutAlliedCareerRef.current;
      const qs =
        typeof window !== "undefined" && window.location.search.length > 1
          ? window.location.search.slice(1)
          : initialSearchParamsString;
      const callbackParams = new URLSearchParams(qs);
      callbackParams.set("checkoutIntent", "1");
      callbackParams.set("checkoutTier", checkoutTier);
      callbackParams.set("checkoutDuration", duration);
      if (checkoutIsAllied)
        callbackParams.set("checkoutAlliedCareer", checkoutAlliedCareer);
      else callbackParams.delete("checkoutAlliedCareer");
      try {
        window.sessionStorage.setItem(
          CHECKOUT_INTENT_STORAGE_KEY,
          JSON.stringify({
            tier: checkoutTier,
            duration,
            alliedCareer: checkoutIsAllied ? checkoutAlliedCareer : null,
          }),
        );
      } catch {
        // Query params remain the primary persistence path; storage is only a same-origin backup.
      }
      const callbackPath = `${pathname}?${callbackParams.toString()}`;
      const loginPath = localize("/login");
      window.location.assign(
        `${loginPath}?callbackUrl=${encodeURIComponent(callbackPath)}`,
      );
    },
    [localize, pathname, initialSearchParamsString, region],
  );

  const redirectGuestToLoginForAdvancedEcgCheckout = useCallback(
    (duration: BillingDuration) => {
      const qs =
        typeof window !== "undefined" && window.location.search.length > 1
          ? window.location.search.slice(1)
          : initialSearchParamsString;
      const callbackParams = new URLSearchParams(qs);
      callbackParams.set("checkoutIntent", "1");
      callbackParams.set("checkoutModule", "advanced_ecg");
      callbackParams.set("checkoutDuration", duration);
      const callbackPath = `${pathname}?${callbackParams.toString()}`;
      const loginPath = localize("/login");
      window.location.assign(
        `${loginPath}?callbackUrl=${encodeURIComponent(callbackPath)}`,
      );
    },
    [initialSearchParamsString, localize, pathname],
  );

  const startCheckout = useCallback(
    async (duration: BillingDuration) => {
      if (checkoutInFlightRef.current) return;
      const checkoutSegment = checkoutSegmentRef.current;
      const checkoutTier = segmentToTier(checkoutSegment, region === "US");
      const checkoutIsAllied = checkoutSegment === "allied";
      const checkoutAlliedCareer = checkoutAlliedCareerRef.current;
      setCheckoutError(null);
      setCheckoutOpsHint(null);
      if (checkoutIsAllied && !alliedProfessionCheckoutAck) {
        setCheckoutError(t("pages.pricing.alliedLock.mustAckBeforeCheckout"));
        return;
      }
      if (isFreeStripeBillingNursingTier(checkoutTier)) {
        window.location.assign(localize("/pre-nursing"));
        return;
      }
      checkoutInFlightRef.current = true;
      setCheckoutLoading(true);
      trackProductEvent(PH.checkoutStarted, {
        actor: "user",
        funnel_step: "checkout_initiated",
        stripe_tier: String(checkoutTier),
        tier: String(checkoutTier),
        duration: String(duration),
        has_trial: trialDays > 0,
        trial_days: trialDays,
        marketing_locale: locale,
        marketing_region: region,
        pricing_segment: checkoutSegment,
        pricing_checkout_soft_gate: pricingCheckoutSoftGate,
        na_pathway_acknowledged: naPathwayAcknowledged,
        global_market_slug: checkoutBodyGlobalSlug,
        authoritative_region_slugs: authoritativeRegionKey,
        ...(checkoutIsAllied
          ? {
              allied_career: checkoutAlliedCareer,
              allied_profession_acknowledged: alliedProfessionCheckoutAck,
            }
          : {}),
      });
      try {
        const body: Record<string, unknown> = {
          tier: checkoutTier,
          duration,
          acceptPolicies: true,
          policyVersion: LEGAL_POLICY_BUNDLE_VERSION,
          region: checkoutBodyGlobalSlug,
          ...(pricingCheckoutSoftGate && naPathwayAcknowledged
            ? { naBillingScopeAcknowledged: true as const }
            : {}),
        };
        if (checkoutIsAllied) {
          body.alliedCareer = checkoutAlliedCareer;
        }
        console.info("[pricing_checkout] request_payload", body);

        const res = await fetch("/api/subscriptions/checkout", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(body),
        });
        console.info("[pricing_checkout] response_status", {
          status: res.status,
          ok: res.ok,
          contentType: res.headers.get("content-type") ?? "",
        });

        const responseText = await res.text();
        const contentType = res.headers.get("content-type") ?? "";

        if (!res.ok && res.status !== 401) {
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
            console.error(
              "[pricing_checkout] response_json_parse_failed",
              parseError,
            );
            parsedBody = null;
          }
        }

        if (!res.ok) {
          const parsed = parseCheckoutApiErrorBody(parsedBody);
          if (
            parsed.code === CHECKOUT_UNAUTHORIZED_CODE ||
            res.status === 401
          ) {
            setCheckoutLoading(false);
            redirectGuestToLoginForCheckout(duration);
            return;
          }
          console.error("[pricing_checkout] parsed_error_body", parsed);
          const err = new Error(
            checkoutErrorUserMessage(parsed, res.status, t),
          ) as CheckoutRequestError;
          err.parsed = parsed;
          err.status = res.status;
          throw err;
        }

        if (!contentType.toLowerCase().includes("application/json")) {
          console.error(
            "[pricing_checkout] checkout API returned non-JSON response",
            {
              status: res.status,
              contentType,
              body: responseText,
            },
          );
          throw new Error(
            t("pages.pricing.error.checkoutTemporarilyUnavailable"),
          );
        }

        if (!parsedBody || typeof parsedBody !== "object") {
          throw new Error(
            t("pages.pricing.error.checkoutTemporarilyUnavailable"),
          );
        }

        const checkoutUrl = validatedCheckoutRedirectUrl(
          (parsedBody as { url?: unknown }).url,
        );
        if (!checkoutUrl) {
          console.error("[pricing_checkout] invalid_checkout_redirect_url", {
            urlPresent: Boolean((parsedBody as { url?: unknown }).url),
          });
          throw new Error(
            t("pages.pricing.error.checkoutTemporarilyUnavailable"),
          );
        }
        console.info("[pricing_checkout] redirect_url_received", {
          checkoutUrl,
          sessionId: (parsedBody as { sessionId?: unknown }).sessionId ?? "",
        });
        window.location.assign(checkoutUrl);
      } catch (error) {
        console.error("[pricing_checkout] start checkout failed", error);
        setCheckoutOpsHint(null);
        const checkoutErr = error as CheckoutRequestError;
        if (
          checkoutErr.status === 401 ||
          checkoutErr.parsed?.code === CHECKOUT_UNAUTHORIZED_CODE
        ) {
          redirectGuestToLoginForCheckout(duration);
          return;
        }
        if (checkoutErr.parsed?.code === STRIPE_PRICE_NOT_CONFIGURED_CODE) {
          setCheckoutError(t("pages.pricing.error.checkoutPlanNotConfigured"));
          if (
            showStripePriceEnvKeyOnCheckoutError() &&
            checkoutErr.parsed.envKey
          ) {
            setCheckoutOpsHint(
              t("pages.pricing.error.checkoutOpsStripePrice", {
                envKey: checkoutErr.parsed.envKey,
              }),
            );
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
            setCheckoutError(
              t("pages.pricing.error.checkoutTemporarilyUnavailable"),
            );
          } else {
            setCheckoutError(raw);
          }
        }
        checkoutInFlightRef.current = false;
        setCheckoutLoading(false);
      }
    },
    [
      authStatus,
      localize,
      redirectGuestToLoginForCheckout,
      tier,
      trialDays,
      t,
      isAllied,
      selectedAlliedCareer,
      region,
      locale,
      segment,
      pricingCheckoutSoftGate,
      naPathwayAcknowledged,
      checkoutBodyGlobalSlug,
      authoritativeRegionKey,
      alliedProfessionCheckoutAck,
    ],
  );

  const requestCheckout = useCallback(
    (duration: BillingDuration, event?: MouseEvent<HTMLElement>) => {
      preventCheckoutDefault(event);
      if (!clientReady) return;
      if (checkoutInFlightRef.current || checkoutLoading) return;
      setCheckoutError(null);
      setCheckoutOpsHint(null);
      if (pricingCheckoutSoftGate && !naPathwayAcknowledged) {
        setCheckoutError(
          t("pages.pricing.globalContext.mustAckBeforeCheckout"),
        );
        return;
      }
      if (isAllied && !alliedProfessionCheckoutAck) {
        setCheckoutError(t("pages.pricing.alliedLock.mustAckBeforeCheckout"));
        return;
      }
      if (policiesAccepted) {
        void startCheckout(duration);
        return;
      }
      setPendingCheckoutDuration(duration);
      setShowConsentPrompt(true);
    },
    [
      authStatus,
      isAllied,
      policiesAccepted,
      pricingCheckoutSoftGate,
      naPathwayAcknowledged,
      redirectGuestToLoginForCheckout,
      startCheckout,
      t,
      alliedProfessionCheckoutAck,
      checkoutLoading,
      clientReady,
    ],
  );

  const startAdvancedEcgCheckout = useCallback(
    async (duration: BillingDuration) => {
      if (checkoutInFlightRef.current) return;
      setCheckoutError(null);
      setCheckoutOpsHint(null);
      if (authStatus === "loading") return;
      if (authStatus !== "authenticated") {
        setCheckoutLoading(true);
        redirectGuestToLoginForAdvancedEcgCheckout(duration);
        return;
      }
      if (!policiesAccepted) {
        setCheckoutError(t("pages.pricing.checkout.mustAcceptPolicies"));
        return;
      }
      checkoutInFlightRef.current = true;
      setCheckoutLoading(true);
      try {
        const res = await fetch("/api/subscriptions/checkout/advanced-ecg", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            duration,
            acceptPolicies: true,
            policyVersion: LEGAL_POLICY_BUNDLE_VERSION,
          }),
        });
        const payload = (await res.json().catch(() => ({}))) as unknown;
        if (!res.ok) {
          const parsed = parseCheckoutApiErrorBody(payload);
          if (
            parsed.code === CHECKOUT_UNAUTHORIZED_CODE ||
            res.status === 401
          ) {
            setCheckoutLoading(false);
            redirectGuestToLoginForAdvancedEcgCheckout(duration);
            return;
          }
          const err = new Error(
            checkoutErrorUserMessage(parsed, res.status, t),
          ) as CheckoutRequestError;
          err.parsed = parsed;
          err.status = res.status;
          throw err;
        }
        const checkoutUrl = validatedCheckoutRedirectUrl(
          (payload as { url?: unknown }).url,
        );
        if (!checkoutUrl) {
          throw new Error(
            t("pages.pricing.error.checkoutTemporarilyUnavailable"),
          );
        }
        window.location.assign(checkoutUrl);
      } catch (error) {
        const checkoutErr = error as CheckoutRequestError;
        if (
          checkoutErr.status === 401 ||
          checkoutErr.parsed?.code === CHECKOUT_UNAUTHORIZED_CODE
        ) {
          setCheckoutLoading(false);
          redirectGuestToLoginForAdvancedEcgCheckout(duration);
          return;
        }
        if (checkoutErr.parsed?.code === STRIPE_PRICE_NOT_CONFIGURED_CODE) {
          setCheckoutError(t("pages.pricing.error.checkoutPlanNotConfigured"));
          if (
            showStripePriceEnvKeyOnCheckoutError() &&
            checkoutErr.parsed.envKey
          ) {
            setCheckoutOpsHint(
              t("pages.pricing.error.checkoutOpsStripePrice", {
                envKey: checkoutErr.parsed.envKey,
              }),
            );
          }
        } else {
          setCheckoutError(
            error instanceof Error && error.message.trim().length > 0
              ? error.message
              : t("pages.pricing.error.checkoutNetwork"),
          );
        }
        checkoutInFlightRef.current = false;
        setCheckoutLoading(false);
      }
    },
    [
      authStatus,
      policiesAccepted,
      redirectGuestToLoginForAdvancedEcgCheckout,
      t,
    ],
  );

  const confirmConsentAndCheckout = useCallback(
    (event?: MouseEvent<HTMLElement>) => {
      preventCheckoutDefault(event);
      if (checkoutInFlightRef.current || checkoutLoading) return;
      if (!pendingCheckoutDuration) return;
      if (pricingCheckoutSoftGate && !naPathwayAcknowledged) {
        setCheckoutError(
          t("pages.pricing.globalContext.mustAckBeforeCheckout"),
        );
        return;
      }
      if (isAllied && !alliedProfessionCheckoutAck) {
        setCheckoutError(t("pages.pricing.alliedLock.mustAckBeforeCheckout"));
        return;
      }
      if (!policiesAccepted) {
        setCheckoutError(t("pages.pricing.checkout.mustAcceptPolicies"));
        return;
      }
      setShowConsentPrompt(false);
      const duration = pendingCheckoutDuration;
      setPendingCheckoutDuration(null);
      void startCheckout(duration);
    },
    [
      pendingCheckoutDuration,
      policiesAccepted,
      pricingCheckoutSoftGate,
      naPathwayAcknowledged,
      isAllied,
      alliedProfessionCheckoutAck,
      checkoutLoading,
      startCheckout,
      t,
    ],
  );

  const SEGMENT_ORDER: Segment[] = ["newgrad", "rn", "pn", "np", "allied"];

  useEffect(() => {
    if (checkoutIntentHandled || authStatus !== "authenticated") return;
    const sp = new URLSearchParams(initialSearchParamsString);
    if (sp.get("checkoutIntent") !== "1") {
      try {
        const stored = window.sessionStorage.getItem(
          CHECKOUT_INTENT_STORAGE_KEY,
        );
        const parsed = stored
          ? (JSON.parse(stored) as {
              tier?: unknown;
              duration?: unknown;
              alliedCareer?: unknown;
            })
          : null;
        if (
          typeof parsed?.tier === "string" &&
          typeof parsed.duration === "string"
        ) {
          sp.set("checkoutIntent", "1");
          sp.set("checkoutTier", parsed.tier);
          sp.set("checkoutDuration", parsed.duration);
          if (typeof parsed.alliedCareer === "string")
            sp.set("checkoutAlliedCareer", parsed.alliedCareer);
        }
      } catch {
        // Ignore corrupted client storage and fall back to explicit URL intent only.
      }
    }
    if (sp.get("checkoutIntent") !== "1") return;
    const checkoutModule = sp.get("checkoutModule");
    const checkoutDuration = sp.get("checkoutDuration");

    if (checkoutModule === "advanced_ecg") {
      if (!checkoutDuration) return;
      const allowedDurations: BillingDuration[] = [
        "monthly",
        "3-month",
        "6-month",
        "yearly",
      ];
      if (!allowedDurations.includes(checkoutDuration as BillingDuration))
        return;

      setCheckoutIntentHandled(true);
      const cleanParams = new URLSearchParams(sp.toString());
      cleanParams.delete("checkoutIntent");
      cleanParams.delete("checkoutModule");
      cleanParams.delete("checkoutDuration");
      const cleanUrl =
        cleanParams.size > 0
          ? `${pathname}?${cleanParams.toString()}`
          : pathname;
      window.history.replaceState({}, "", cleanUrl);

      if (!policiesAccepted) {
        setCheckoutError(t("pages.pricing.checkout.mustAcceptPolicies"));
        return;
      }
      void startAdvancedEcgCheckout(checkoutDuration as BillingDuration);
      return;
    }

    const checkoutTier = sp.get("checkoutTier");
    if (!checkoutTier || !checkoutDuration) return;

    if (checkoutTier === "PRE_NURSING") {
      setCheckoutIntentHandled(true);
      const cleanParamsEarly = new URLSearchParams(sp.toString());
      cleanParamsEarly.delete("checkoutIntent");
      cleanParamsEarly.delete("checkoutTier");
      cleanParamsEarly.delete("checkoutDuration");
      cleanParamsEarly.delete("checkoutAlliedCareer");
      const cleanUrlEarly =
        cleanParamsEarly.size > 0
          ? `${pathname}?${cleanParamsEarly.toString()}`
          : pathname;
      window.history.replaceState({}, "", cleanUrlEarly);
      try {
        window.sessionStorage.removeItem(CHECKOUT_INTENT_STORAGE_KEY);
      } catch {}
      window.location.assign(localize("/pre-nursing"));
      return;
    }

    const allowedTiers: TierCode[] = [
      "NEW_GRAD",
      "RPN",
      "LVN_LPN",
      "RN",
      "NP",
      "ALLIED",
    ];
    const allowedDurations: BillingDuration[] = [
      "monthly",
      "3-month",
      "6-month",
      "yearly",
    ];
    if (
      !allowedTiers.includes(checkoutTier as TierCode) ||
      !allowedDurations.includes(checkoutDuration as BillingDuration)
    ) {
      return;
    }

    const tierCode = checkoutTier as TierCode;
    const durationCode = checkoutDuration as BillingDuration;
    setSegment(tierToSegment(tierCode, region === "US"));
    if (tierCode === "ALLIED") {
      const checkoutAlliedCareer = sp.get("checkoutAlliedCareer");
      if (
        checkoutAlliedCareer &&
        ALLIED_CAREER_KEYS.includes(checkoutAlliedCareer as AlliedCareerKey)
      ) {
        setSelectedAlliedCareer(checkoutAlliedCareer as AlliedCareerKey);
      }
    }
    setPendingCheckoutDuration(durationCode);
    setShowConsentPrompt(true);
    setCheckoutIntentHandled(true);

    const cleanParams = new URLSearchParams(sp.toString());
    cleanParams.delete("checkoutIntent");
    cleanParams.delete("checkoutTier");
    cleanParams.delete("checkoutDuration");
    cleanParams.delete("checkoutAlliedCareer");
    const cleanUrl =
      cleanParams.size > 0 ? `${pathname}?${cleanParams.toString()}` : pathname;
    window.history.replaceState({}, "", cleanUrl);
    try {
      window.sessionStorage.removeItem(CHECKOUT_INTENT_STORAGE_KEY);
    } catch {}
  }, [
    authStatus,
    checkoutIntentHandled,
    initialSearchParamsString,
    localize,
    pathname,
    policiesAccepted,
    region,
    startAdvancedEcgCheckout,
    t,
  ]);

  return (
    <div className="nn-pricing-premium-root mx-auto flex w-full max-w-6xl flex-col gap-12 nn-marketing-x pb-[var(--nn-rhythm-page-y)] pt-0 md:gap-16">
      {/* ── Section 1: Hero ── */}
      <PricingHero
        eyebrow={t("pages.pricing.hero.choicePill")}
        headline={heading}
        body={heroSub}
        trustLine={intro}
        ctaLabel={heroCtaLabel}
        trialSubtext={heroTrialFooter.sub}
        trialFinePrint={heroTrialFooter.fine}
        pricesShownLine={pricingCurrencyLine}
        secondaryLabel={t("pages.pricing.hero.ctaSeeIncluded")}
      />

      {showNorthAmericaStripeScopeNote ? (
        <div
          className="rounded-xl border border-[color-mix(in_srgb,var(--semantic-warning)_28%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-warning)_08%,var(--semantic-surface))] px-4 py-3 text-sm text-[var(--semantic-text-secondary)] shadow-[var(--semantic-shadow-soft)]"
          role="region"
          aria-label={t(
            "pages.pricing.globalContext.northAmericaStripeScopeAria",
          )}
        >
          <p>{t("pages.pricing.globalContext.northAmericaStripeScope")}</p>
          <label className="mt-3 flex cursor-pointer items-start gap-3 rounded-lg border border-[color-mix(in_srgb,var(--semantic-warning)_22%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-warning)_04%,var(--color-card))] p-3 text-left text-[13px] leading-snug text-[var(--palette-text)]">
            <input
              type="checkbox"
              className="mt-0.5 h-4 w-4 shrink-0 rounded border-border"
              checked={naPathwayAcknowledged}
              onChange={(e) => {
                setNaPathwayAcknowledged(e.target.checked);
                if (e.target.checked) setCheckoutError(null);
              }}
            />
            <span>
              {t("pages.pricing.globalContext.ackNorthAmericaBillingLabel")}
            </span>
          </label>
        </div>
      ) : null}

      {/* ── Plan selector + pricing cards (surfaced early) ── */}
      <section
        aria-labelledby="pricing-plans-heading"
        className="scroll-mt-20 space-y-10 md:scroll-mt-24 md:space-y-12"
      >
        <div className="text-center">
          <h2 id="pricing-plans-heading" className="nn-marketing-h2">
            {t("pages.pricing.choosePlan.heading")}
          </h2>
          <p className="nn-marketing-body-sm mx-auto mt-2 max-w-xl text-muted-foreground">
            {narrative.subhead}
          </p>
        </div>

        {/* Tier tabs */}
        <div className="space-y-4">
          <p className="text-center text-sm font-medium text-muted-foreground">
            {t("pages.pricing.choosePlan.trackPrompt")}
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            {SEGMENT_ORDER.map((id) => (
              <button
                key={id}
                type="button"
                data-testid={`pricing-segment-${id}`}
                disabled={!clientReady || checkoutLoading}
                onClick={() => {
                  checkoutSegmentRef.current = id;
                  setSegment(id);
                  trackProductEvent("tier_selected", {
                    segment: id,
                    tier: segmentToTier(id, region === "US"),
                    marketing_locale: locale,
                    marketing_region: region,
                  });
                }}
                className="nn-pricing-pill-control px-4 py-2.5 text-sm font-semibold transition-[background-color,color,box-shadow,transform,border-color] duration-150 ease-out disabled:pointer-events-none disabled:opacity-60"
                data-active={segment === id ? "true" : "false"}
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
              {t("pages.pricing.choosePlan.careerPrompt")}
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              {ALLIED_CAREER_KEYS.map((career) => (
                <button
                  key={career}
                  type="button"
                  onClick={() => {
                    checkoutAlliedCareerRef.current = career;
                    setSelectedAlliedCareer(career);
                    trackProductEvent("allied_career_selected", {
                      career,
                      marketing_locale: locale,
                      marketing_region: region,
                    });
                  }}
                  className="nn-pricing-pill-control px-3 py-1.5 text-xs font-semibold transition-[background-color,color,box-shadow,transform] duration-150 ease-out"
                  data-active={
                    selectedAlliedCareer === career ? "true" : "false"
                  }
                >
                  {ALLIED_CAREER_DISPLAY_NAMES[career]}
                </button>
              ))}
            </div>
            <AlliedHealthClarity />

            <div
              data-testid="pricing-allied-profession-warning"
              className="rounded-xl border border-[color-mix(in_srgb,var(--semantic-warning)_30%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-warning)_09%,var(--semantic-surface))] px-4 py-3 text-left shadow-[var(--semantic-shadow-soft)] sm:px-5"
              role="region"
              aria-label={t("pages.pricing.alliedLock.warningAria")}
            >
              <p className="text-sm font-semibold text-[var(--semantic-warning-contrast)]">
                {t("pages.pricing.alliedLock.warningTitle")}
              </p>
              <ul className="mt-2 list-inside list-disc space-y-1.5 text-sm leading-snug text-[color-mix(in_srgb,var(--semantic-warning-contrast)_92%,var(--semantic-text-muted))]">
                <li>{t("pages.pricing.alliedLock.line1")}</li>
                <li>{t("pages.pricing.alliedLock.line2")}</li>
                <li>{t("pages.pricing.alliedLock.line3")}</li>
              </ul>
              <label className="mt-4 flex cursor-pointer items-start gap-3 rounded-lg border border-[color-mix(in_srgb,var(--semantic-warning)_22%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-warning)_05%,var(--color-card))] p-3 text-left text-[13px] leading-snug text-[var(--palette-text)]">
                <input
                  type="checkbox"
                  data-testid="pricing-allied-profession-ack"
                  className="mt-0.5 h-4 w-4 shrink-0 rounded border-border"
                  checked={alliedProfessionCheckoutAck}
                  onChange={(e) => {
                    setAlliedProfessionCheckoutAck(e.target.checked);
                    if (e.target.checked) setCheckoutError(null);
                  }}
                />
                <span>{t("pages.pricing.alliedLock.ackLabel")}</span>
              </label>
            </div>
          </div>
        )}

        <PricingTierScopePanel
          tier={tier}
          trackLabel={segmentLabels[segment]}
          alliedCareerLabel={isAllied ? selectedTierScopeLabel : undefined}
        />

        <CheckoutCancelledNotice
          searchQuery={initialSearchParamsString}
          t={t}
        />

        {!plansLoaded && !loadError ? (
          <PricingPlanGridSkeleton
            ariaLabel={t("pages.pricing.loadingPlansAria")}
          />
        ) : null}

        {plansLoaded && loadError ? (
          <PricingPlansStatusPanel
            message={loadError}
            onRetry={() => window.location.reload()}
            refreshLabel={t("pages.pricing.error.refreshCta")}
          />
        ) : null}

        {plansLoaded && !loadError && trackDataGap ? (
          <PricingPlansStatusPanel
            message={t("pages.pricing.error.trackTemporarilyUnavailable")}
            onRetry={() => window.location.reload()}
            refreshLabel={t("pages.pricing.error.refreshCta")}
          />
        ) : null}

        {/* Paid duration cards — list prices from server-hydrated catalog; client may refresh from `/api/pricing/options`. */}
        {showPaidPlanDurationGrid ? (
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4 xl:gap-6 xl:items-start">
            {BILLING_DURATION_ORDER.map((duration) => {
              const rawRow = rowByDuration.get(duration);
              const row =
                rawRow && isRenderablePlanRow(rawRow) ? rawRow : undefined;
              /**
               * Catalog gaps: e.g. NEW_GRAD has no 3-month row in `display-catalog` (no Stripe price).
               * We must **not** drop the grid cell — that read as “pricing never loaded”.
               */
              const slotUnavailable = Boolean(!rawRow);
              const rowDataInvalid = Boolean(rawRow && !row);
              const isBest = Boolean(row?.isBestValue);
              const isPop = Boolean(row?.isMostPopular);
              const isHighlighted =
                Boolean(row) &&
                !slotUnavailable &&
                !rowDataInvalid &&
                (isBest || isPop);
              const canAttemptCheckout =
                Boolean(row) && !slotUnavailable && !rowDataInvalid;

              return (
                <article
                  key={duration}
                  className={`nn-card-interactive nn-motion-standard nn-pricing-plan-card relative flex flex-col rounded-2xl border transition-shadow duration-200 ${
                    isPop
                      ? "z-10 p-7 xl:-my-3 xl:p-8"
                      : isBest
                        ? "p-7"
                        : "p-6 hover:shadow-[var(--elevation-hover)]"
                  }`}
                  data-highlight={
                    isPop ? "popular" : isBest ? "value" : undefined
                  }
                >
                  {isPop ? (
                    <span className="nn-pricing-badge absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-[var(--semantic-info)] px-5 py-1.5 text-xs font-bold uppercase tracking-wide text-[var(--text-inverse)]">
                      {t("pages.pricing.conversion.badgePopular")}
                    </span>
                  ) : isBest ? (
                    <span className="nn-pricing-badge absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-[var(--semantic-success)] px-5 py-1.5 text-xs font-bold uppercase tracking-wide text-[var(--text-inverse)]">
                      {t("pages.pricing.conversion.badgeBestValue")}
                    </span>
                  ) : null}

                  <h3
                    className={
                      isPop
                        ? "text-xl font-bold text-[var(--palette-heading)]"
                        : "nn-marketing-h3"
                    }
                  >
                    {t(PLAN_DURATION_LABEL_KEY[duration])}
                  </h3>

                  <p
                    className={`mt-2 leading-snug text-muted-foreground ${isPop ? "text-sm font-medium" : "text-[13px]"}`}
                  >
                    {t(DURATION_TAGLINE_KEY[duration])}
                  </p>

                  {duration !== "monthly" && (
                    <p className="mt-2 inline-flex items-center gap-1.5 text-[11px] font-semibold tracking-wide text-[var(--semantic-success)]">
                      <span
                        className="inline-block h-1.5 w-1.5 rounded-full bg-[var(--semantic-success)]"
                        aria-hidden
                      />
                      {t("pages.pricing.foundingPricing.line")}
                    </p>
                  )}

                  {rowDataInvalid ? (
                    <div className="mt-8 flex flex-1 flex-col justify-end gap-2">
                      <p className="text-sm text-muted-foreground">
                        {t("pages.pricing.plan.rowDataIncomplete")}
                      </p>
                    </div>
                  ) : slotUnavailable ? (
                    <div className="mt-8 flex flex-1 flex-col justify-end gap-2">
                      <p className="text-sm text-muted-foreground">
                        {t("pages.pricing.plan.durationNotOffered")}
                      </p>
                    </div>
                  ) : row ? (
                    <>
                      <div
                        className="mt-6 border-t pt-5"
                        style={{
                          borderColor: isPop
                            ? "color-mix(in srgb, var(--semantic-info) 15%, var(--semantic-border-soft))"
                            : "var(--semantic-border-soft)",
                        }}
                      >
                        {"anchorPriceLabel" in row && row.anchorPriceLabel && (
                          <p className="text-sm text-muted-foreground line-through decoration-muted-foreground/50">
                            {row.anchorPriceLabel}
                          </p>
                        )}
                        <p
                          className={`font-black tabular-nums text-[var(--palette-heading)] ${isPop ? "text-3xl" : isHighlighted ? "text-[28px]" : "text-2xl"}`}
                        >
                          {row.totalLabel}
                        </p>
                      </div>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {row.monthlyEquivalentLabel}{" "}
                        {t("pages.pricing.plan.avgSuffix")}
                      </p>
                      {row.savingsVsMonthlyPercent > 0 ? (
                        <p className="mt-1.5 text-xs font-semibold text-[var(--semantic-success)]">
                          {t("pages.pricing.plan.saveVsMonthly", {
                            pct: row.savingsVsMonthlyPercent,
                          })}
                        </p>
                      ) : null}

                      <ul className="mt-6 flex-1 space-y-2.5 text-sm text-[var(--palette-text)]">
                        {PLAN_CARD_BULLET_KEYS.map((key) => (
                          <li key={key} className="flex gap-2">
                            <Check
                              className="mt-0.5 h-4 w-4 shrink-0 text-[var(--semantic-success)]"
                              aria-hidden
                            />
                            <span>{t(key)}</span>
                          </li>
                        ))}
                      </ul>

                      <SiConvPricingFeatureDisclosure />

                      <button
                        type="button"
                        data-testid={`pricing-checkout-${duration}`}
                        disabled={
                          !clientReady ||
                          checkoutLoading ||
                          authStatus === "loading" ||
                          (pricingCheckoutSoftGate && !naPathwayAcknowledged) ||
                          alliedCheckoutBlocked
                        }
                        onClick={(event) => requestCheckout(duration, event)}
                        className={`${isHighlighted ? MARKETING_PRIMARY_CTA_CLASS : MARKETING_SECONDARY_CTA_CLASS} mt-6 w-full justify-center disabled:pointer-events-none disabled:opacity-50`}
                      >
                        {checkoutLoading
                          ? CHECKOUT_LOADING_LABEL
                          : canAttemptCheckout
                            ? paidPlanPrimaryCtaLabel
                            : t("pages.pricing.checkout.comingSoon")}
                      </button>
                      <Link
                        href="#pricing-tier-value"
                        className="mt-3 inline-flex justify-center text-sm font-semibold text-[var(--semantic-brand)] underline underline-offset-4"
                      >
                        See everything included
                      </Link>
                      {canAttemptCheckout ? (
                        <>
                          {pricingCheckoutSoftGate ? (
                            <p className="mt-3 text-center text-xs leading-snug text-muted-foreground">
                              {t(
                                "pages.pricing.checkout.northAmericaBillingSubcopy",
                              )}
                            </p>
                          ) : null}
                          {!pricingCheckoutSoftGate && trialDays > 0 ? (
                            <>
                              <p
                                className={`mt-3 text-center text-xs leading-snug ${
                                  isPop
                                    ? "font-semibold text-[var(--semantic-info)]"
                                    : "text-muted-foreground"
                                }`}
                              >
                                {heroTrialFooter.sub}
                              </p>
                              <p className="mt-1 text-center text-[11px] leading-snug text-muted-foreground">
                                {heroTrialFooter.fine}
                              </p>
                            </>
                          ) : !pricingCheckoutSoftGate ? (
                            <p className="mt-3 text-center text-xs leading-snug text-muted-foreground">
                              {t("pages.pricing.checkout.recurringShort")}
                            </p>
                          ) : null}
                          {isAllied && alliedCheckoutBlocked ? (
                            <p className="mt-3 text-center text-xs font-medium leading-snug text-[var(--semantic-warning-contrast)]">
                              {t(
                                "pages.pricing.alliedLock.mustAckBeforeCheckout",
                              )}
                            </p>
                          ) : null}
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
            <div className="nn-pricing-consent-modal w-full max-w-xl rounded-2xl border p-5 shadow-[var(--elevation-hover)] sm:p-6">
              <h3 className="text-lg font-semibold text-[var(--palette-heading)]">
                {t("pages.pricing.checkout.confirmConsentHeading")}
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">
                {t("pages.pricing.checkout.confirmConsentLead")}
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
                    <Link
                      href={termsHref}
                      className="nn-link-quiet font-semibold"
                    >
                      {t("pages.pricing.checkout.policyTermsLabel")}
                    </Link>
                    {t("pages.pricing.checkout.policyAckBetween1")}
                    <Link
                      href={privacyHref}
                      className="nn-link-quiet font-semibold"
                    >
                      {t("pages.pricing.checkout.policyPrivacyLabel")}
                    </Link>
                    {t("pages.pricing.checkout.policyAckBetween2")}
                    <Link
                      href={refundHref}
                      className="nn-link-quiet font-semibold"
                    >
                      {t("pages.pricing.checkout.policyRefundLabel")}
                    </Link>
                    {t("pages.pricing.checkout.policyAckEnd")}
                  </span>
                </label>
              </div>

              {pricingCheckoutSoftGate ? (
                <div className="mt-3 rounded-xl border border-[color-mix(in_srgb,var(--semantic-warning)_22%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-warning)_06%,var(--color-card))] p-4 text-sm">
                  <label className="flex cursor-pointer gap-3">
                    <input
                      type="checkbox"
                      className="mt-1 h-4 w-4 shrink-0 rounded border-border"
                      checked={naPathwayAcknowledged}
                      onChange={(e) => {
                        setNaPathwayAcknowledged(e.target.checked);
                        if (e.target.checked) setCheckoutError(null);
                      }}
                    />
                    <span className="text-[var(--palette-text)]">
                      {t(
                        "pages.pricing.globalContext.ackNorthAmericaBillingLabel",
                      )}
                    </span>
                  </label>
                </div>
              ) : null}

              {isAllied ? (
                <div
                  data-testid="pricing-allied-profession-warning-modal"
                  className="mt-3 rounded-xl border border-[color-mix(in_srgb,var(--semantic-warning)_26%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-warning)_07%,var(--color-card))] p-4 text-sm"
                >
                  <p className="font-semibold text-[var(--semantic-warning-contrast)]">
                    {t("pages.pricing.alliedLock.warningTitle")}
                  </p>
                  <ul className="mt-2 list-inside list-disc space-y-1 text-[13px] leading-snug text-muted-foreground">
                    <li>{t("pages.pricing.alliedLock.line1")}</li>
                    <li>{t("pages.pricing.alliedLock.line2")}</li>
                    <li>{t("pages.pricing.alliedLock.line3")}</li>
                  </ul>
                  <label className="mt-3 flex cursor-pointer items-start gap-3 rounded-lg border border-[color-mix(in_srgb,var(--semantic-warning)_20%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-warning)_04%,var(--semantic-surface))] p-3 text-left text-[13px] leading-snug">
                    <input
                      type="checkbox"
                      data-testid="pricing-allied-profession-ack-modal"
                      className="mt-0.5 h-4 w-4 shrink-0 rounded border-border"
                      checked={alliedProfessionCheckoutAck}
                      onChange={(e) => {
                        setAlliedProfessionCheckoutAck(e.target.checked);
                        if (e.target.checked) setCheckoutError(null);
                      }}
                    />
                    <span className="text-[var(--palette-text)]">
                      {t("pages.pricing.alliedLock.ackLabel")}
                    </span>
                  </label>
                </div>
              ) : null}

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
                  {t("pages.pricing.checkout.modalDismiss")}
                </button>
                <button
                  type="button"
                  className={MARKETING_PRIMARY_CTA_CLASS}
                  onClick={(event) => confirmConsentAndCheckout(event)}
                  disabled={
                    checkoutLoading ||
                    !policiesAccepted ||
                    (pricingCheckoutSoftGate && !naPathwayAcknowledged) ||
                    (isAllied && !alliedProfessionCheckoutAck)
                  }
                >
                  {checkoutLoading
                    ? CHECKOUT_LOADING_LABEL
                    : pricingCheckoutSoftGate
                      ? t(
                          "pages.pricing.checkout.continueToNorthAmericaCheckout",
                        )
                      : t("pages.pricing.checkout.continueToSecureCheckout")}
                </button>
              </div>
            </div>
          </div>
        ) : null}

        {/* Trial callout */}
        {trialDays > 0 && (
          <div className="nn-pricing-trial-card mx-auto max-w-xl rounded-2xl border px-8 py-6 text-center shadow-[var(--elevation-rest)]">
            <p className="text-lg font-semibold text-[var(--palette-heading)]">
              {t("pages.pricing.trial.bannerTitleWithDays", {
                days: trialDays,
              })}
            </p>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              {t("pages.pricing.trial.bannerLead")}
              {` ${heroTrialFooter.sub}`}
            </p>
            <p className="mt-2 text-xs text-muted-foreground">
              {t("pages.pricing.trial.bannerFinePrint")}
            </p>
          </div>
        )}

        {/* Checkout feedback */}
        <div className="mx-auto max-w-xl space-y-4">
          {checkoutError ? (
            <p className="text-center text-sm text-destructive">
              {checkoutError}
            </p>
          ) : null}
          {checkoutOpsHint ? (
            <p className="rounded-md border border-border/80 bg-muted/40 px-3 py-2 font-mono text-xs text-muted-foreground">
              {checkoutOpsHint}
            </p>
          ) : null}
        </div>

        <TierValueExperience
          activeTier={segmentToTierValueKey(segment)}
          onTierSelect={(key) => {
            const next = tierValueKeyToSegment(key);
            if (!next) {
              window.location.href = localize("/pre-nursing");
              return;
            }
            checkoutSegmentRef.current = next;
            setSegment(next);
          }}
        />
      </section>

      {/* ── Trust + value + FAQs (after plans) ── */}
      <div className="flex flex-col items-center gap-4 text-center">
        <BrandTrustInline variant="pricing" className="justify-center" />
        <ValuePropsStrip />
      </div>

      <PricingConversionClarity />

      <PricingAudienceSection />

      <PricingInteractiveShowcase />

      <PricingClinicalReadinessEcosystem />

      <PricingLabsWorkstationFeature />

      <PricingMedCalcWorkstationFeature />

      <PricingClinicalSkillsWorkstationFeature />

      <PricingEcgClarityBlock />

      <PricingAdvancedEcgAddOn
        onCheckout={(duration) => void startAdvancedEcgCheckout(duration)}
        checkoutLoading={checkoutLoading}
      />

      <PricingRegionFaq />

      <PricingReliabilityFaq />

      <PricingLearnerFaq />

      <SiConvMarketingExplainer />

      <PricingSubscriptionFaq />

      {/* ── Premium Feature Matrix ── */}
      {featureMatrix}

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
          <Link
            href="#pricing-plans-heading"
            className={MARKETING_PRIMARY_CTA_CLASS}
          >
            {paidPlanPrimaryCtaLabel}
          </Link>
          <Link
            href={tryQuestionsHref}
            className={MARKETING_TERTIARY_LINK_CLASS}
          >
            {t("pages.pricing.cta.bottomSecondaryTryQuestions")}
          </Link>
        </div>
        {trialDays > 0 ? (
          <>
            <p className="mt-3 text-xs text-muted-foreground">
              {heroTrialFooter.sub}
            </p>
            <p className="mt-1 text-[11px] text-muted-foreground">
              {heroTrialFooter.fine}
            </p>
          </>
        ) : (
          <p className="mt-3 text-xs text-muted-foreground">
            {t("pages.pricing.checkout.recurringShort")}
          </p>
        )}
      </div>
    </div>
  );
}
