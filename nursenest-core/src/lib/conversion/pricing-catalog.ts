import type { TierCode } from "@prisma/client";
import { getConversionVariant } from "@/lib/conversion/experiment-config";
import type { BillingDuration } from "@/lib/pricing/billing-types";

export type { BillingDuration };

export type TierPricingNarrative = {
  tier: TierCode;
  headline: string;
  subhead: string;
  outcomes: string[];
  included: string[];
  proofLine: string;
  urgencyLine?: string;
};

type MarketingT = (key: string, params?: Record<string, string | number | undefined>) => string;

function tierToNarrativeSlug(tier: TierCode): "rpn" | "lvn_lpn" | "rn" | "np" | "allied" {
  if (tier === "RPN") return "rpn";
  if (tier === "LVN_LPN") return "lvn_lpn";
  if (tier === "NP") return "np";
  if (tier === "ALLIED") return "allied";
  return "rn";
}

/**
 * Pricing page narratives — copy lives in marketing i18n (`pages.pricing.narrative.*`).
 */
export function buildTierPricingNarrative(t: MarketingT, tier: TierCode): TierPricingNarrative {
  const slug = tierToNarrativeSlug(tier);
  const prefix = `pages.pricing.narrative.${slug}`;
  const variant = getConversionVariant();

  const outcomes = [t(`${prefix}.outcome0`), t(`${prefix}.outcome1`), t(`${prefix}.outcome2`)];
  const included = [
    t(`${prefix}.included0`),
    t(`${prefix}.included1`),
    t(`${prefix}.included2`),
    t(`${prefix}.included3`),
  ];
  const proofLine = t(`${prefix}.proofLine`);

  if (variant === "urgency") {
    return {
      tier,
      headline: t(`${prefix}.headlineUrgency`),
      subhead: t(`${prefix}.subhead`),
      outcomes,
      included,
      proofLine,
      urgencyLine: t("pages.pricing.narrative.variant.urgencyLine"),
    };
  }
  if (variant === "outcome") {
    return {
      tier,
      headline: t(`${prefix}.headlineOutcome`),
      subhead: t(`${prefix}.subhead`),
      outcomes,
      included,
      proofLine,
    };
  }
  return {
    tier,
    headline: t(`${prefix}.headline`),
    subhead: t(`${prefix}.subhead`),
    outcomes,
    included,
    proofLine,
  };
}
