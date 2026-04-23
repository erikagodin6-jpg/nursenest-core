"use client";

import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { MarketingTrackedLink } from "@/components/marketing/marketing-tracked-link";
import { PH } from "@/lib/observability/posthog-conversion-events";
import { pathwayAnalyticsDimensions, trackProductEvent } from "@/lib/observability/product-analytics";
import type { ExamPathwayDefinition } from "@/lib/exam-pathways/types";
import type { MarketingTierHubContextualCta } from "@/lib/conversion/select-marketing-tier-hub-contextual-cta";

/**
 * One contextual conversion row on the marketing tier hub — uses the same card wash pattern as other hub strips.
 * Selection logic stays in {@link selectMarketingTierHubContextualCta}; this component is presentation + analytics only.
 */
export function MarketingTierHubContextualCta({
  pathway,
  decision,
  npSeoAliasSegment,
}: {
  pathway: ExamPathwayDefinition;
  decision: MarketingTierHubContextualCta;
  npSeoAliasSegment?: string;
}) {
  const [dismissed, setDismissed] = useState(false);
  const dims = pathwayAnalyticsDimensions(pathway);

  if (dismissed) return null;

  return (
    <div
      className="mt-4 rounded-xl border border-[color-mix(in_srgb,var(--semantic-brand)_14%,var(--border-subtle))] bg-[color-mix(in_srgb,var(--semantic-panel-positive)_8%,var(--theme-card-bg))] px-4 py-4 sm:px-5"
      role="region"
      aria-label="Suggested next step"
      data-nn-contextual-cta={decision.variant}
    >
      <p className="nn-marketing-body-sm font-semibold text-[var(--theme-heading-text)]">{decision.headline}</p>
      <p className="nn-marketing-body-sm mt-1.5 max-w-2xl text-pretty text-[var(--theme-muted-text)]">{decision.supportingLine}</p>
      <div className="mt-3 flex flex-wrap items-center gap-3">
        <MarketingTrackedLink
          href={decision.primaryHref}
          event={PH.conversionCtaClick}
          eventProps={{
            ...dims,
            np_seo_alias_segment: npSeoAliasSegment,
            surface: "tier_hub_context_banner",
            contextual_variant: decision.variant,
            dedupe_key: decision.dedupeKey,
            destination_kind: decision.variant === "unlock_pathway_premium" ? "marketing_pricing" : "marketing_questions",
            pathway_hub_card: "contextual_primary",
          }}
          className="inline-flex min-h-[44px] items-center justify-center rounded-full nn-btn-primary px-5 py-2.5 text-sm font-semibold shadow-sm"
        >
          {decision.primaryLabel}
          <ArrowRight className="ml-1.5 h-4 w-4 shrink-0" aria-hidden />
        </MarketingTrackedLink>
        <button
          type="button"
          className="text-xs font-medium text-[var(--theme-muted-text)] underline decoration-dotted underline-offset-2 hover:text-[var(--theme-body-text)]"
          onClick={() => {
            trackProductEvent(PH.conversionCtaClick, {
              ...dims,
              surface: "tier_hub_context_banner",
              contextual_variant: decision.variant,
              dedupe_key: decision.dedupeKey,
              dismiss: true,
            });
            setDismissed(true);
          }}
        >
          Not now
        </button>
      </div>
    </div>
  );
}
