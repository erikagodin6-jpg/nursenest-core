"use client";

import {
  ADVANCED_ECG_MODULE_ENTITLEMENT,
  ADVANCED_ECG_MODULE_NAME,
  ADVANCED_ECG_PRICE_LABEL,
  ADVANCED_ECG_PURCHASE_BADGE,
} from "@/lib/advanced-ecg/advanced-ecg-module-config";
import {
  MARKETING_PRIMARY_CTA_CLASS,
  MARKETING_SECONDARY_CTA_CLASS,
} from "@/lib/theme/marketing-hero-pattern";

type PricingAdvancedEcgAddOnProps = {
  onCheckout: () => void;
  checkoutLoading?: boolean;
  checkoutEnabled?: boolean;
  disabledMessage?: string | null;
};

export function PricingAdvancedEcgAddOn({
  onCheckout,
  checkoutLoading = false,
  checkoutEnabled = true,
  disabledMessage = null,
}: PricingAdvancedEcgAddOnProps) {
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
            {ADVANCED_ECG_MODULE_NAME}
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-[var(--semantic-text-secondary)]">
            Advanced ECG is a separate paid module. Not included in base exam subscriptions. Includes full access to the Basic ECG curriculum. Designed for RN/NP, critical care, emergency, telemetry, and advanced practice ECG interpretation.
          </p>
          <div className="mt-4 flex flex-wrap gap-2 text-xs font-medium text-[var(--semantic-text-secondary)]">
            <span className="rounded-full border border-[var(--semantic-border-soft)] px-3 py-1">Own entitlement: <code>{ADVANCED_ECG_MODULE_ENTITLEMENT}</code></span>
            <span className="rounded-full border border-[var(--semantic-border-soft)] px-3 py-1">RN / NP scope only for now</span>
            <span className="rounded-full border border-[var(--semantic-border-soft)] px-3 py-1">Sold separately from core plans</span>
          </div>
        </div>

        <div className="rounded-2xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-4 lg:w-[23rem]">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--semantic-text-muted)]">
            {ADVANCED_ECG_PURCHASE_BADGE}
          </p>
          <p className="mt-2 text-3xl font-semibold tracking-tight text-[var(--semantic-text-primary)]">
            {ADVANCED_ECG_PRICE_LABEL}
          </p>
          <p className="mt-1 text-xs font-medium uppercase tracking-[0.16em] text-[var(--semantic-text-muted)]">
            Lifetime access
          </p>
          <button
            type="button"
            className={`mt-5 w-full ${MARKETING_PRIMARY_CTA_CLASS}`}
            onClick={onCheckout}
            disabled={checkoutLoading || !checkoutEnabled}
            data-nn-qa-advanced-ecg-purchase=""
          >
            {checkoutLoading
              ? "Loading..."
              : checkoutEnabled
                ? `Buy ${ADVANCED_ECG_MODULE_NAME}`
                : "Advanced ECG not available yet"}
          </button>
          <p className="mt-3 text-xs leading-relaxed text-[var(--semantic-text-secondary)]">
            Checkout starts a one-time Advanced ECG purchase with ongoing specialty-module access. It does not replace or expand the base RN/NP subscription you already have.
          </p>
          {disabledMessage ? (
            <p className="mt-3 rounded-xl border border-[color-mix(in_srgb,var(--semantic-warning)_26%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-warning)_8%,var(--semantic-surface))] px-3 py-2 text-xs leading-relaxed text-[var(--semantic-warning-contrast)]">
              {disabledMessage}
            </p>
          ) : null}
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
