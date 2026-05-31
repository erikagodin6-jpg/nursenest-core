import fs from "node:fs";
import path from "node:path";
import { listPlatformFeatures, type PlatformFeature } from "./feature-registry";

export const MONETIZATION_CONTRACT_VERSION = "1.0.0" as const;

const REQUIRED_GUARD_TOKEN: Record<PlatformFeature["entitlementGuard"], string | null> = {
  public: null,
  freemium: "getFreemiumSnapshot",
  resolveEntitlementForPage: "resolveEntitlementForPage",
  requireSubscriberSession: "requireSubscriberSession",
  getCurrentEcgModuleAccess: "getCurrentEcgModuleAccess",
  alliedOccupationEntitlement: "evaluateAlliedOccupationAccess",
  adminOnly: "requireAdmin",
};

export type MonetizationContractViolation = {
  featureId: string;
  rule: "missing_guard" | "missing_source_file" | "missing_paywall_or_redirect";
  detail: string;
};

function sourceIncludesAny(source: string, tokens: readonly string[]): boolean {
  return tokens.some((token) => source.includes(token));
}

export function validateMonetizationContract(projectRoot = process.cwd()): MonetizationContractViolation[] {
  const violations: MonetizationContractViolation[] = [];

  for (const feature of listPlatformFeatures()) {
    if (feature.monetizationStatus === "free") continue;

    const requiredGuard = REQUIRED_GUARD_TOKEN[feature.entitlementGuard];
    if (!requiredGuard) {
      violations.push({
        featureId: feature.id,
        rule: "missing_guard",
        detail: `${feature.label} is monetized but does not declare a subscriber, entitlement, freemium, or admin guard.`,
      });
      continue;
    }

    let guardFound = false;
    let paywallOrRedirectFound = false;

    for (const file of feature.canonicalSourceFiles) {
      const absolute = path.join(projectRoot, file);
      if (!fs.existsSync(absolute)) {
        violations.push({
          featureId: feature.id,
          rule: "missing_source_file",
          detail: `${feature.label} governance file is missing: ${file}`,
        });
        continue;
      }
      const source = fs.readFileSync(absolute, "utf8");
      if (source.includes(requiredGuard)) guardFound = true;
      if (
        sourceIncludesAny(source, [
          "SubscriptionPaywall",
          "redirect(\"/app\")",
          "notSubscribedResponse",
          "requireSubscriberSession",
          "ecgApiDeniedResponse",
          "hasAccess",
          "allowed: false",
        ])
      ) {
        paywallOrRedirectFound = true;
      }
    }

    if (!guardFound) {
      violations.push({
        featureId: feature.id,
        rule: "missing_guard",
        detail: `${feature.label} must reference ${requiredGuard} in at least one canonical source file.`,
      });
    }

    if (
      feature.monetizationStatus !== "staff-only" &&
      feature.monetizationStatus !== "freemium-gated" &&
      !paywallOrRedirectFound
    ) {
      violations.push({
        featureId: feature.id,
        rule: "missing_paywall_or_redirect",
        detail: `${feature.label} is subscription monetized but no paywall, subscriber denial, or safe redirect was found in canonical sources.`,
      });
    }
  }

  return violations;
}
