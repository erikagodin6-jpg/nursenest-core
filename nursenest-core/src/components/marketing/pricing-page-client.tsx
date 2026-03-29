"use client";

import type { TierCode } from "@prisma/client";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { SOCIAL_PROOF, TRUST_BLOCK, getTierPricingNarrative } from "@/lib/conversion/pricing-catalog";
import { trackClientEvent } from "@/lib/observability/posthog-client";
import { PH } from "@/lib/observability/posthog-conversion-events";
import { useMarketingI18n } from "@/lib/marketing-i18n";
import { withMarketingLocale } from "@/lib/i18n/marketing-path";
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

const DURATION_LABEL: Record<BillingDuration, string> = {
  monthly: "Monthly",
  "3-month": "3 months",
  "6-month": "6 months",
  yearly: "12 months (best savings)",
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
  const { locale, t } = useMarketingI18n();
  const institutionalHref = withMarketingLocale(locale, "/for-institutions");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/pricing/options");
        const data = await res.json();
        if (!res.ok) throw new Error("load_failed");
        if (!cancelled) setPlans(data.plans ?? []);
      } catch {
        if (!cancelled) setLoadError("Plans could not be loaded. Refresh or try again shortly.");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const { tier, country: effectiveCountry } = segmentToTierCountry(segment, country);
  const narrative = getTierPricingNarrative(tier);

  const filtered = useMemo(
    () => plans.filter((p) => p.tier === tier && p.country === effectiveCountry),
    [plans, tier, effectiveCountry],
  );

  const startCheckout = useCallback(
    async (duration: BillingDuration) => {
      setCheckoutError(null);
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
          body: JSON.stringify({ country: effectiveCountry, tier, duration }),
        });
        const data = await res.json();
        if (res.status === 401) {
          setCheckoutError("Sign in first, then return to pricing to complete checkout.");
          setCheckoutLoading(false);
          return;
        }
        if (!res.ok || !data.url) {
          setCheckoutError(data.error ?? "Checkout unavailable for this combination.");
          setCheckoutLoading(false);
          return;
        }
        window.location.href = data.url as string;
      } catch {
        setCheckoutError("Network error starting checkout.");
        setCheckoutLoading(false);
      }
    },
    [effectiveCountry, tier],
  );

  return (
    <main className="mx-auto w-full max-w-6xl px-6 py-12">
      <p className="text-xs font-semibold uppercase tracking-wide text-primary">Pricing</p>
      <h1 className="mt-2 text-4xl font-bold text-[var(--theme-heading-text)]">{heading}</h1>
      <p className="mt-3 max-w-2xl text-muted">{intro}</p>
      <div className="nn-accent-soft-ring mt-4 rounded-xl border px-4 py-3 text-sm text-muted">
        <p>{t("pages.pricing.institutionalBanner")}</p>
        <Link href={institutionalHref} className="mt-2 inline-block font-semibold text-primary hover:underline">
          {t("pages.pricing.institutionalLink")} →
        </Link>
      </div>
      <p className="mt-4 max-w-3xl text-sm text-muted">{SOCIAL_PROOF.passRateLine}</p>

      <div className="mt-8 flex flex-wrap gap-2">
        {(
          [
            ["rpn", "RPN (Canada)"],
            ["lvn", "LVN/LPN (US)"],
            ["rn", "RN"],
            ["np", "NP"],
            ["allied", "Allied health"],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            onClick={() => setSegment(id)}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
              segment === id ? "bg-primary text-primary-foreground" : "border border-border bg-card hover:bg-muted/80"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {(segment === "rn" || segment === "np" || segment === "allied") && (
        <div className="mt-4 flex gap-2">
          <span className="text-sm text-muted">Country:</span>
          <button
            type="button"
            className={`rounded-full px-3 py-1 text-xs font-semibold ${country === "CA" ? "bg-primary/15 text-primary" : "border border-border"}`}
            onClick={() => setCountry("CA")}
          >
            Canada
          </button>
          <button
            type="button"
            className={`rounded-full px-3 py-1 text-xs font-semibold ${country === "US" ? "bg-primary/15 text-primary" : "border border-border"}`}
            onClick={() => setCountry("US")}
          >
            United States
          </button>
        </div>
      )}

      <section className="mt-10 grid gap-8 lg:grid-cols-2">
        <div>
          <h2 className="text-2xl font-bold text-[var(--theme-heading-text)]">{narrative.headline}</h2>
          {narrative.urgencyLine ? <p className="mt-2 text-sm font-medium text-primary">{narrative.urgencyLine}</p> : null}
          <p className="mt-3 text-muted">{narrative.subhead}</p>
          <h3 className="mt-6 text-sm font-semibold uppercase tracking-wide text-muted">Outcomes you will feel</h3>
          <ul className="mt-2 list-inside list-disc space-y-2 text-sm">
            {narrative.outcomes.map((o) => (
              <li key={o}>{o}</li>
            ))}
          </ul>
          <h3 className="mt-6 text-sm font-semibold uppercase tracking-wide text-muted">What you get</h3>
          <ul className="mt-2 list-inside list-disc space-y-2 text-sm text-muted">
            {narrative.included.map((o) => (
              <li key={o}>{o}</li>
            ))}
          </ul>
          <p className="mt-4 text-sm text-muted">{narrative.proofLine}</p>
        </div>

        <div className="space-y-4">
          <div className="nn-card overflow-hidden">
            <div className="bg-gradient-to-br from-primary/15 to-primary/5 px-4 py-8 text-center">
              <p className="text-xs font-semibold uppercase tracking-wide text-primary">Product preview</p>
              <p className="mt-2 text-sm text-muted">
                Dashboard, timed question sessions, and mock exams stay in one learner shell—no tab hopping on exam week.
              </p>
            </div>
          </div>
          <div className="nn-card p-4">
            <p className="text-sm font-semibold">{TRUST_BLOCK.guaranteeTitle}</p>
            <p className="mt-2 text-sm text-muted">{TRUST_BLOCK.guaranteeBody}</p>
            <ul className="mt-3 list-inside list-disc text-sm text-muted">
              {TRUST_BLOCK.trustBullets.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="mt-12">
        <h2 className="text-xl font-bold text-[var(--theme-heading-text)]">Choose billing rhythm</h2>
        <p className="mt-2 text-sm text-muted">
          Suggested totals help you compare savings; Stripe shows the exact charged amount at checkout.
        </p>
        {loadError ? <p className="mt-4 text-sm text-red-600">{loadError}</p> : null}
        {checkoutError ? <p className="mt-4 text-sm text-red-600">{checkoutError}</p> : null}

        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {(["monthly", "3-month", "6-month", "yearly"] as BillingDuration[]).map((dur) => {
            const row = filtered.find((p) => p.duration === dur);
            return (
              <article
                key={dur}
                className={`nn-card flex flex-col p-5 ${row?.isBestValue ? "ring-2 ring-primary" : ""}`}
              >
                {row?.isBestValue ? (
                  <p className="mb-2 inline-block w-fit rounded-full bg-primary px-2 py-0.5 text-xs font-bold text-primary-foreground">
                    Best value
                  </p>
                ) : null}
                <h3 className="text-lg font-semibold text-[var(--theme-heading-text)]">{DURATION_LABEL[dur]}</h3>
                {row ? (
                  <>
                    <p className="mt-2 text-2xl font-bold">{row.totalLabel}</p>
                    <p className="text-sm text-muted">{row.monthlyEquivalentLabel} avg</p>
                    {row.savingsVsMonthlyPercent > 0 ? (
                      <p className="mt-2 text-xs font-semibold text-primary">Save ~{row.savingsVsMonthlyPercent}% vs monthly pace</p>
                    ) : null}
                    <button
                      type="button"
                      disabled={checkoutLoading || !row.checkoutAvailable}
                      onClick={() => startCheckout(dur)}
                      className="mt-4 w-full rounded-full bg-primary py-2.5 text-sm font-semibold text-primary-foreground disabled:opacity-60"
                    >
                      {row.checkoutAvailable ? "Continue to secure checkout" : "Coming soon"}
                    </button>
                  </>
                ) : (
                  <>
                    <p className="mt-3 text-sm font-medium text-muted">Coming soon</p>
                    <button
                      type="button"
                      disabled
                      className="mt-4 w-full rounded-full border border-border bg-muted/50 py-2.5 text-sm font-semibold text-muted-foreground"
                    >
                      Coming soon
                    </button>
                  </>
                )}
              </article>
            );
          })}
        </div>
      </section>

      <p className="mt-10 text-center text-xs text-muted">{SOCIAL_PROOF.pricingFooterLine}</p>
    </main>
  );
}
