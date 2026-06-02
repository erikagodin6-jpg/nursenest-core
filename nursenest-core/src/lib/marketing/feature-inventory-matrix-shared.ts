/**
 * Client-safe feature matrix display contracts.
 *
 * Keep DB/cache inventory loading in `feature-inventory-metrics.ts`; client components only need
 * labels, tier order, and row shapes.
 */

export const TIER_DISPLAY_ORDER = ["newGrad", "rn", "rpn", "np", "allied"] as const;
export type TierDisplayKey = (typeof TIER_DISPLAY_ORDER)[number];

export const TIER_DISPLAY_LABELS: Record<TierDisplayKey, string> = {
  newGrad: "New Grad",
  rn: "RN",
  rpn: "RPN / PN",
  np: "NP",
  allied: "Allied",
};

export type FeatureMatrixRow = {
  /** Display name */
  label: string;
  /** Short description */
  description: string;
  /** Mapping from tier key to display value (checkmark or count) */
  values: Record<TierDisplayKey, string | boolean>;
  /** Whether this is a tier-specific feature */
  isHighlighted?: boolean;
};
