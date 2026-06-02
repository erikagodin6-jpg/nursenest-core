import { listPlatformFeatures } from "./feature-registry";

export const SUBSCRIPTION_CONTRACT_VERSION = "1.0.0" as const;

export type SubscriptionRule = {
  id: string;
  owner: "billing-platform" | "growth-platform";
  status: "enforced" | "documented" | "needs-review";
  source: string;
  rule: string;
};

export const SUBSCRIPTION_RULES = [
  {
    id: "stripe_price_envs",
    owner: "billing-platform",
    status: "enforced",
    source: "src/lib/stripe/pricing-map.ts",
    rule: "Stripe price IDs are resolved from canonical env keys; no hardcoded price IDs in checkout source.",
  },
  {
    id: "subscriber_gate",
    owner: "billing-platform",
    status: "enforced",
    source: "src/lib/entitlements/require-subscriber-session.ts",
    rule: "Subscriber-only APIs must use requireSubscriberSession or an equivalent server-side entitlement resolver.",
  },
  {
    id: "page_entitlement",
    owner: "billing-platform",
    status: "enforced",
    source: "src/lib/entitlements/resolve-entitlement-for-page.ts",
    rule: "Premium learner pages must resolve DB-backed entitlement before showing unlocked content.",
  },
  {
    id: "trial_rules",
    owner: "growth-platform",
    status: "documented",
    source: "src/lib/trial/trial-email-controls.ts",
    rule: "Trials must be represented as subscription state, not as client-only access.",
  },
  {
    id: "cancellation_rules",
    owner: "billing-platform",
    status: "documented",
    source: "src/lib/billing/subscription-management.ts",
    rule: "Cancellation and portal access must route through server-owned subscription management.",
  },
] as const satisfies readonly SubscriptionRule[];

export type SubscriptionContractViolation = {
  rule: "missing_subscription_feature_guard" | "missing_rule";
  detail: string;
};

export function validateSubscriptionContract(): SubscriptionContractViolation[] {
  const violations: SubscriptionContractViolation[] = [];
  const ruleIds = new Set(SUBSCRIPTION_RULES.map((rule) => rule.id));
  for (const required of ["stripe_price_envs", "subscriber_gate", "page_entitlement"] as const) {
    if (!ruleIds.has(required)) {
      violations.push({ rule: "missing_rule", detail: `Missing subscription governance rule: ${required}` });
    }
  }

  for (const feature of listPlatformFeatures()) {
    if (
      (feature.monetizationStatus === "subscription" || feature.monetizationStatus === "add-on") &&
      feature.entitlementGuard !== "resolveEntitlementForPage" &&
      feature.entitlementGuard !== "requireSubscriberSession" &&
      feature.entitlementGuard !== "getCurrentEcgModuleAccess" &&
      feature.entitlementGuard !== "alliedOccupationEntitlement"
    ) {
      violations.push({
        rule: "missing_subscription_feature_guard",
        detail: `${feature.label} is subscription monetized but does not declare a subscription entitlement guard.`,
      });
    }
  }

  return violations;
}
