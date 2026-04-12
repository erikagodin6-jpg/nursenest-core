/**
 * Entitlement-aware context switching.
 *
 * Separates VIEW CONTEXT from ACCESS ENTITLEMENTS:
 *
 *   - VIEW CONTEXT: what country/language/profession/exam the user is browsing
 *   - ACCESS: what content they can actually open (server-enforced)
 *
 * When a user switches context:
 *   1. If they switch to their purchased market → full access, no restrictions
 *   2. If they switch to another supported market → public pages allowed,
 *      protected content blocked with upgrade messaging
 *   3. If they switch to an unsupported market → marketing pages only,
 *      clear "coming soon" messaging
 *
 * This module provides the decision logic; UI components consume these results
 * to show appropriate messaging, CTAs, and redirects.
 */

import type { GlobalRegionSlug, GlobalLocaleCode } from "@/lib/i18n/global-regions";
import type { MarketSupportTier } from "@/lib/navigation/market-readiness";
import { getMarketReadiness, isMarketFullySupported } from "@/lib/navigation/market-readiness";

// ── Types ────────────────────────────────────────────────────────────────────

export type EntitlementRegion = {
  /** The legacy CountryCode from the User model (CA | US). */
  countryCode: string | null;
  /** The TierCode from the User's subscription/profile. */
  tier: string | null;
  /** Whether the user has an active paid subscription. */
  hasActiveSubscription: boolean;
};

export type ContextSwitchDecision = {
  /** Whether the user can access protected content in this context. */
  canAccessProtectedContent: boolean;
  /** Whether the switch target is the user's purchased region. */
  isHomeRegion: boolean;
  /** The support level of the target market. */
  marketSupport: MarketSupportTier;
  /** What should happen when the user tries to access protected content. */
  protectedContentAction: "allow" | "paywall" | "upgrade_cta" | "coming_soon";
  /** User-facing messaging for the context banner. */
  contextMessage: string | null;
  /** Whether to show a "return to your purchased content" link. */
  showReturnHome: boolean;
  /** The home region to return to, if applicable. */
  homeRegion: GlobalRegionSlug | null;
};

// ── Core decision function ───────────────────────────────────────────────────

/**
 * Evaluate what happens when a user views content in a given region context.
 *
 * Pure function — no DB calls, no side effects.
 */
export function evaluateContextSwitch(
  targetRegion: GlobalRegionSlug,
  entitlement: EntitlementRegion,
): ContextSwitchDecision {
  const market = getMarketReadiness(targetRegion);
  const homeRegion = mapCountryCodeToGlobalRegion(entitlement.countryCode);
  const isHome = homeRegion === targetRegion;

  // Case 1: user is in their home region
  if (isHome && entitlement.hasActiveSubscription) {
    return {
      canAccessProtectedContent: true,
      isHomeRegion: true,
      marketSupport: market.supportTier,
      protectedContentAction: "allow",
      contextMessage: null,
      showReturnHome: false,
      homeRegion,
    };
  }

  // Case 2: user is switching to a fully supported market they don't own
  if (market.supportTier === "full" && !isHome) {
    return {
      canAccessProtectedContent: false,
      isHomeRegion: false,
      marketSupport: "full",
      protectedContentAction: entitlement.hasActiveSubscription ? "upgrade_cta" : "paywall",
      contextMessage: entitlement.hasActiveSubscription
        ? "You're browsing a different market. Your subscription covers a different region."
        : null,
      showReturnHome: entitlement.hasActiveSubscription,
      homeRegion,
    };
  }

  // Case 3: partial support market
  if (market.supportTier === "partial") {
    return {
      canAccessProtectedContent: false,
      isHomeRegion: false,
      marketSupport: "partial",
      protectedContentAction: "coming_soon",
      contextMessage: "Study content for this market is in development.",
      showReturnHome: entitlement.hasActiveSubscription,
      homeRegion,
    };
  }

  // Case 4: marketing-only or planned
  return {
    canAccessProtectedContent: false,
    isHomeRegion: false,
    marketSupport: market.supportTier,
    protectedContentAction: "coming_soon",
    contextMessage: market.supportTier === "planned"
      ? "We're working on bringing NurseNest to this market."
      : "Full exam prep for this market is coming soon.",
    showReturnHome: entitlement.hasActiveSubscription,
    homeRegion,
  };
}

/**
 * Determine whether a route should be accessible based on entitlement
 * and the target market context.
 *
 * Returns:
 *   - "allow"    → render normally
 *   - "paywall"  → show paywall/upgrade UI
 *   - "redirect" → redirect to home region hub
 *   - "public"   → allow but mark as public/marketing page
 */
export function evaluateRouteAccess(
  targetRegion: GlobalRegionSlug,
  entitlement: EntitlementRegion,
  isProtectedRoute: boolean,
): "allow" | "paywall" | "redirect" | "public" {
  const decision = evaluateContextSwitch(targetRegion, entitlement);

  if (!isProtectedRoute) return "public";
  if (decision.canAccessProtectedContent) return "allow";
  if (decision.protectedContentAction === "coming_soon") return "redirect";

  return "paywall";
}

/**
 * Build the "return to your content" CTA data.
 */
export function buildReturnHomeCta(
  entitlement: EntitlementRegion,
): { label: string; href: string } | null {
  if (!entitlement.hasActiveSubscription || !entitlement.countryCode) return null;

  const homeRegion = mapCountryCodeToGlobalRegion(entitlement.countryCode);
  if (!homeRegion) return null;

  const tierLabel = entitlement.tier ?? "your";
  return {
    label: `Return to ${tierLabel} prep`,
    href: "/app",
  };
}

// ── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Map the legacy Prisma CountryCode to a GlobalRegionSlug.
 * Currently only US and CA are stored in the User model.
 */
function mapCountryCodeToGlobalRegion(
  countryCode: string | null,
): GlobalRegionSlug | null {
  if (!countryCode) return null;
  const map: Record<string, GlobalRegionSlug> = {
    US: "us",
    CA: "canada",
  };
  return map[countryCode.toUpperCase()] ?? null;
}
