import { PH } from "@/lib/observability/posthog-conversion-events";
import { eachStripePriceMatrixRow } from "@/lib/stripe/pricing-map";
import { validateAnalyticsContract } from "@/lib/platform-governance/analytics-contract";
import { validateMonetizationContract } from "@/lib/platform-governance/monetization-contract";
import { validateSubscriptionContract } from "@/lib/platform-governance/subscription-contract";

export type LaunchGateTone = "green" | "yellow" | "red";

export type LaunchGateStatus = {
  id: string;
  label: string;
  tone: LaunchGateTone;
  detail: string;
};

export type UsLaunchStatus = {
  score: number;
  verdict: "Not Ready" | "Needs Work" | "Launch Ready" | "Launch Immediately";
  billingArchitecture: "multi-currency";
  gates: LaunchGateStatus[];
  missingUsStripeEnvKeys: string[];
};

const REQUIRED_REVENUE_EVENTS = [
  PH.signupStarted,
  PH.signupCompleted,
  PH.trialStarted,
  PH.trialConverted,
  PH.subscriptionPurchased,
  PH.subscriptionCancelled,
  PH.flashcardsStarted,
  PH.catStarted,
  PH.practiceStarted,
] as const;

function toneFor(ok: boolean, warn = false): LaunchGateTone {
  if (ok) return "green";
  return warn ? "yellow" : "red";
}

function verdictFor(score: number): UsLaunchStatus["verdict"] {
  if (score >= 90) return "Launch Immediately";
  if (score >= 86) return "Launch Ready";
  if (score >= 70) return "Needs Work";
  return "Not Ready";
}

export function requiredUsLaunchRevenueEvents(): readonly string[] {
  return REQUIRED_REVENUE_EVENTS;
}

export function missingUsStripePriceEnvKeys(): string[] {
  const seen = new Set<string>();
  return eachStripePriceMatrixRow()
    .filter((row) => row.country === "US" && !row.priceId)
    .map((row) => row.envKey)
    .filter((key) => (seen.has(key) ? false : (seen.add(key), true)));
}

export function buildUsLaunchStatus(): UsLaunchStatus {
  const missingStripe = missingUsStripePriceEnvKeys();
  const analyticsViolations = validateAnalyticsContract();
  const monetizationViolations = validateMonetizationContract();
  const subscriptionViolations = validateSubscriptionContract();
  const missingRequiredEvents = REQUIRED_REVENUE_EVENTS.filter((eventName) =>
    analyticsViolations.some((violation) => violation.eventName === eventName),
  );

  const gates: LaunchGateStatus[] = [
    {
      id: "stripe",
      label: "Stripe status",
      tone: toneFor(missingStripe.length === 0),
      detail:
        missingStripe.length === 0
          ? "US multi-currency Stripe price IDs are configured."
          : `${missingStripe.length} US Stripe price env key(s) missing.`,
    },
    {
      id: "analytics",
      label: "Analytics status",
      tone: toneFor(missingRequiredEvents.length === 0 && analyticsViolations.length === 0, analyticsViolations.length > 0),
      detail:
        missingRequiredEvents.length === 0
          ? "Required US revenue funnel events are registered."
          : `Missing required event(s): ${missingRequiredEvents.join(", ")}`,
    },
    {
      id: "entitlements",
      label: "Entitlement status",
      tone: toneFor(monetizationViolations.length === 0 && subscriptionViolations.length === 0),
      detail:
        monetizationViolations.length + subscriptionViolations.length === 0
          ? "Premium surfaces declare server-side monetization and subscription guards."
          : `${monetizationViolations.length + subscriptionViolations.length} entitlement contract issue(s).`,
    },
    {
      id: "revenue_funnel",
      label: "Revenue funnel status",
      tone: toneFor(missingStripe.length === 0 && missingRequiredEvents.length === 0, missingStripe.length > 0),
      detail: "Homepage, signup, trial, checkout, study-start, purchase, conversion, and cancellation events are contract-covered.",
    },
    {
      id: "e2e",
      label: "E2E status",
      tone: "yellow",
      detail: "Run npm run test:e2e:us-launch before deployment; failures block launch.",
    },
  ];

  const redCount = gates.filter((gate) => gate.tone === "red").length;
  const yellowCount = gates.filter((gate) => gate.tone === "yellow").length;
  const score = Math.max(0, Math.min(100, 92 - redCount * 18 - yellowCount * 6));

  return {
    score,
    verdict: verdictFor(score),
    billingArchitecture: "multi-currency",
    gates,
    missingUsStripeEnvKeys: missingStripe,
  };
}
