"use client";

import type { TierCode } from "@prisma/client";
import { Check, ShieldAlert, Target } from "lucide-react";
import { pricingTierToNarrativeSlug } from "@/lib/conversion/pricing-catalog";
import { useMarketingI18n } from "@/lib/marketing-i18n";

type PricingTierScopePanelProps = {
  tier: TierCode;
  trackLabel: string;
  alliedCareerLabel?: string;
};

const INCLUDED_INDEXES = [0, 1, 2, 3, 4] as const;
const NOT_INCLUDED_INDEXES = [0, 1] as const;

function messageList(
  t: (key: string, params?: Record<string, string | number>) => string,
  keys: readonly string[],
  params: Record<string, string>,
): string[] {
  return keys
    .map((key) => t(key, params))
    .map((value) => value.trim())
    .filter(Boolean);
}

export function PricingTierScopePanel({
  tier,
  trackLabel,
  alliedCareerLabel,
}: PricingTierScopePanelProps) {
  const { t } = useMarketingI18n();
  const slug = pricingTierToNarrativeSlug(tier);
  const baseKey = `pages.pricing.tierScope.${slug}`;
  const selectionLabel = alliedCareerLabel?.trim() || trackLabel;
  const params = {
    track: trackLabel,
    selection: selectionLabel,
    occupation: alliedCareerLabel?.trim() || selectionLabel,
  };

  const included = messageList(
    t,
    INCLUDED_INDEXES.map((index) => `${baseKey}.included${index}`),
    params,
  );
  const notIncluded = messageList(
    t,
    NOT_INCLUDED_INDEXES.map((index) => `${baseKey}.notIncluded${index}`),
    params,
  );

  return (
    <section
      data-testid="pricing-tier-scope-panel"
      id="pricing-tier-scope-panel"
      aria-labelledby="pricing-tier-scope-heading"
      className="rounded-3xl border border-[var(--semantic-border-soft)] bg-[color-mix(in_srgb,var(--semantic-panel-cool)_18%,var(--semantic-surface))] p-6 shadow-[var(--semantic-shadow-soft)] sm:p-7"
    >
      <div className="flex flex-col gap-3 text-left sm:flex-row sm:items-start sm:justify-between">
        <div className="max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--semantic-info)]">
            {t("pages.pricing.tierScope.eyebrow")}
          </p>
          <h3
            id="pricing-tier-scope-heading"
            className="mt-2 text-2xl font-semibold text-[var(--semantic-text-primary)]"
          >
            {t("pages.pricing.tierScope.heading", params)}
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-[var(--semantic-text-secondary)]">
            {t(`${baseKey}.lead`, params)}
          </p>
        </div>
        <div className="rounded-full border border-[color-mix(in_srgb,var(--semantic-info)_20%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-info)_10%,var(--semantic-surface))] px-4 py-2 text-sm font-semibold text-[var(--semantic-text-primary)]">
          {t("pages.pricing.tierScope.selectionChip", params)}
        </div>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        <article className="rounded-2xl border border-[color-mix(in_srgb,var(--semantic-success)_20%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-success)_06%,var(--semantic-surface))] p-5">
          <div className="flex items-center gap-2">
            <Check className="h-4 w-4 text-[var(--semantic-success)]" aria-hidden />
            <h4 className="text-sm font-semibold text-[var(--semantic-text-primary)]">
              {t("pages.pricing.tierScope.section.included")}
            </h4>
          </div>
          <ul className="mt-3 space-y-2.5 text-sm leading-relaxed text-[var(--semantic-text-secondary)]">
            {included.map((item) => (
              <li key={item} className="flex gap-2">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-[var(--semantic-success)]" aria-hidden />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </article>

        <article className="rounded-2xl border border-[color-mix(in_srgb,var(--semantic-info)_20%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-info)_05%,var(--semantic-surface))] p-5">
          <div className="flex items-center gap-2">
            <Target className="h-4 w-4 text-[var(--semantic-info)]" aria-hidden />
            <h4 className="text-sm font-semibold text-[var(--semantic-text-primary)]">
              {t("pages.pricing.tierScope.section.scope")}
            </h4>
          </div>
          <p className="mt-3 text-sm leading-relaxed text-[var(--semantic-text-secondary)]">
            {t(`${baseKey}.scope`, params)}
          </p>
          <p className="mt-3 text-sm leading-relaxed text-[var(--semantic-text-secondary)]">
            {t(`${baseKey}.scopeNote`, params)}
          </p>
        </article>

        <article className="rounded-2xl border border-[color-mix(in_srgb,var(--semantic-warning)_22%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-warning)_06%,var(--semantic-surface))] p-5">
          <div className="flex items-center gap-2">
            <ShieldAlert className="h-4 w-4 text-[var(--semantic-warning)]" aria-hidden />
            <h4 className="text-sm font-semibold text-[var(--semantic-text-primary)]">
              {t("pages.pricing.tierScope.section.notIncluded")}
            </h4>
          </div>
          <ul className="mt-3 space-y-2.5 text-sm leading-relaxed text-[var(--semantic-text-secondary)]">
            {notIncluded.map((item) => (
              <li key={item} className="flex gap-2">
                <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0 text-[var(--semantic-warning)]" aria-hidden />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </article>
      </div>

      <p className="mt-5 text-sm leading-relaxed text-[var(--semantic-text-secondary)]">
        {t(`${baseKey}.checkoutHint`, params)}
      </p>
    </section>
  );
}
