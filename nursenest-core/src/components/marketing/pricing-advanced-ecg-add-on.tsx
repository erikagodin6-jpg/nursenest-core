"use client";

import type { BillingDuration } from "@/lib/stripe/pricing-map";
import {
  ADVANCED_ECG_BILLING_DURATIONS,
  ADVANCED_ECG_MODULE_ENTITLEMENT,
} from "@/lib/advanced-ecg/advanced-ecg-module-config";
import {
  MARKETING_PRIMARY_CTA_CLASS,
  MARKETING_SECONDARY_CTA_CLASS,
} from "@/lib/theme/marketing-hero-pattern";

const DURATION_LABELS: Record<BillingDuration, string> = {
  monthly: "Monthly",
  "3-month": "3 months",
  "6-month": "6 months",
  yearly: "Yearly",
};

type PricingAdvancedEcgAddOnProps = {
  onCheckout: (duration: BillingDuration) => void;
  checkoutLoading?: boolean;
};

export function PricingAdvancedEcgAddOn({ onCheckout, checkoutLoading = false }: PricingAdvancedEcgAddOnProps) {
  return (
    <section
      id="advanced-ecg-add-on"
      className="rounded-3xl border border-[color-mix(in_srgb,var(--semantic-info)_24%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-info)_05%,var(--semantic-surface))] p-6 shadow-[var(--semantic-shadow-soft)]"
      data-nn-qa-pricing-advanced-ecg-add-on=""
    >
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div className="max-w-3xl">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--semantic-info)]">
            Separate paid module
          </p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight text-[var(--semantic-text-primary)]">
            Advanced ECG & Telemetry Mastery
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-[var(--semantic-text-secondary)]">
            Advanced ECG is a separate paid module. Not included in base exam subscriptions. Designed for RN/NP, critical care, emergency, telemetry, and advanced practice ECG interpretation.
          </p>
          <div className="mt-4 flex flex-wrap gap-2 text-xs font-medium text-[var(--semantic-text-secondary)]">
            <span className="rounded-full border border-[var(--semantic-border-soft)] px-3 py-1">Own entitlement: <code>{ADVANCED_ECG_MODULE_ENTITLEMENT}</code></span>
            <span className="rounded-full border border-[var(--semantic-border-soft)] px-3 py-1">RN / NP scope only for now</span>
            <span className="rounded-full border border-[var(--semantic-border-soft)] px-3 py-1">Sold separately from core plans</span>
          </div>
        </div>

        <div className="rounded-2xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-4 lg:w-[23rem]">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--semantic-text-muted)]">
            Choose add-on billing
          </p>
          <div className="mt-4 grid gap-2 sm:grid-cols-2">
            {ADVANCED_ECG_BILLING_DURATIONS.map((duration) => (
              <button
                key={duration}
                type="button"
                className={MARKETING_PRIMARY_CTA_CLASS}
                onClick={() => onCheckout(duration)}
                disabled={checkoutLoading}
                data-nn-qa-advanced-ecg-duration={duration}
              >
                {checkoutLoading ? "Loading..." : `Add ${DURATION_LABELS[duration]}`}
              </button>
            ))}
          </div>
          <p className="mt-3 text-xs leading-relaxed text-[var(--semantic-text-secondary)]">
            Checkout starts a dedicated Advanced ECG add-on subscription. It does not replace or expand the base RN/NP subscription you already have.
          </p>
        </div>
      </div>

      <div className="mt-6 grid gap-3 md:grid-cols-3">
        {[
          "Advanced ECG Foundations",
          "12-Lead Interpretation",
          "Critical Care Telemetry",
        ].map((title) => (
          <div key={title} className="rounded-2xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-4">
            <p className="text-sm font-semibold text-[var(--semantic-text-primary)]">{title}</p>
            <p className="mt-2 text-xs leading-relaxed text-[var(--semantic-text-secondary)]">
              Included on the dedicated learner surface after the Advanced ECG add-on is active.
            </p>
          </div>
        ))}
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <a href="/modules/ecg-advanced" className={MARKETING_SECONDARY_CTA_CLASS}>
          Preview learner surface
        </a>
        <a href="/modules/ecg-advanced#upgrade" className={MARKETING_SECONDARY_CTA_CLASS}>
          Review access rules
        </a>
      </div>
    </section>
  );
}
