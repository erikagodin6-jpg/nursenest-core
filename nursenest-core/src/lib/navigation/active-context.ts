/**
 * Central navigation context — single source of truth for header + learner chrome.
 * All nav rendering should derive from {@link ActiveContext} (no scattered auth/tier checks).
 */

import type { TierCode } from "@prisma/client";
import type { SessionUserRole } from "@/types/next-auth";
import type { GlobalRegionSlug } from "@/lib/i18n/global-regions";
import type { NursenestRegion } from "@/lib/region/use-nursenest-region";

/** Exam home market (US/CA) — distinct from optional global expansion region. */
export type ActiveExamRegion = "US" | "CA";

/**
 * Subscription bucket for nav mode.
 * - `none` — signed out
 * - `unpaid` — signed in, no active premium session status
 * - `entitled` — signed in with active/grace/past-due premium status (matches session normalization)
 */
export type ActiveEntitlement = "entitled" | "unpaid" | "none";

export type ActiveNavMode = "public" | "learner";

/**
 * Collapsed nursing pathway for nav (NP > RN > PN rule).
 * ALLIED stays explicit; null when unknown / signed out.
 */
export type PrimaryPathwayNav = "NP" | "RN" | "PN" | "ALLIED" | null;

export type ActiveContext = {
  /** ISO-like market code for analytics + exam IA: US | CA, or global slug (e.g. PH) when set */
  country: string;
  /** Marketing / learner locale (e.g. en, fr, tl) */
  language: string;
  /** Raw session tier when signed in */
  sessionTier: TierCode | null;
  /** Single primary pathway for pills + mega-menu emphasis */
  primaryPathway: PrimaryPathwayNav;
  entitlement: ActiveEntitlement;
  navMode: ActiveNavMode;
  /** US/CA exam selector — always defined for marketing math */
  examRegion: ActiveExamRegion;
  /** Optional global expansion region (philippines, india, …) */
  globalRegion: GlobalRegionSlug | null;
};

export type SessionSubscription = NonNullable<
  import("next-auth").Session["user"]["subscriptionStatus"]
>;

/**
 * Maps NextAuth subscriptionStatus → entitlement bucket (client-safe, mirrors JWT session callback).
 */
export function resolveEntitlementFromSubscriptionStatus(
  status: SessionSubscription | undefined | null,
): ActiveEntitlement {
  if (!status || status === "none") return "unpaid";
  if (status === "active" || status === "grace" || status === "past_due_grace" || status === "past_due") {
    return "entitled";
  }
  return "unpaid";
}

/**
 * Marketing chrome (`SiteHeader` / `SiteFooter`) always uses the public marketing information architecture,
 * including for entitled signed-in learners. Study shortcuts belong in auth CTAs and `/app`, not a
 * separate header mode that replaces mega-menus and marketing nav on `/` and other marketing routes.
 */
export function resolveNavMode(_args: {
  entitlement: ActiveEntitlement;
  role: SessionUserRole | undefined;
}): ActiveNavMode {
  return "public";
}

/**
 * Primary pathway: NP > RN > PN (PN folds RPN/LVN_LPN); ALLIED separate.
 */
export function resolvePrimaryPathwayNav(tier: TierCode | null | undefined): PrimaryPathwayNav {
  if (!tier) return null;
  if (tier === "NP") return "NP";
  if (tier === "RN") return "RN";
  if (tier === "RPN" || tier === "LVN_LPN") return "PN";
  if (tier === "ALLIED") return "ALLIED";
  /** Includes `PRE_NURSING` and `NEW_GRAD` — no single collapsed pathway pill. */
  return null;
}

function regionToCountryCode(region: NursenestRegion): string {
  return region;
}

/** Prefer global region slug for `country` when present (SEO/geo), else exam region. */
export function resolveActiveCountryCode(args: {
  examRegion: NursenestRegion;
  globalRegion: GlobalRegionSlug | null;
  sessionCountry: "US" | "CA" | undefined;
}): string {
  if (args.globalRegion === "philippines") return "PH";
  if (args.globalRegion === "india") return "IN";
  // Fallback: session country for signed-in users on /app; marketing cookie for site
  if (args.sessionCountry) return args.sessionCountry;
  return regionToCountryCode(args.examRegion);
}

/**
 * Builds {@link ActiveContext} for client components (session + region hooks).
 */
export function buildActiveContext(args: {
  locale: string;
  examRegion: NursenestRegion;
  globalRegion: GlobalRegionSlug | null;
  session: import("next-auth").Session | null;
}): ActiveContext {
  const user = args.session?.user;
  const role = user?.role;
  const tier = user?.tier ?? null;
  const subscription = user?.subscriptionStatus;

  const entitlement: ActiveEntitlement = !user
    ? "none"
    : resolveEntitlementFromSubscriptionStatus(subscription ?? "none");
  const navMode = resolveNavMode({ entitlement, role });
  const primaryPathway = resolvePrimaryPathwayNav(tier);

  const country = resolveActiveCountryCode({
    examRegion: args.examRegion,
    globalRegion: args.globalRegion,
    sessionCountry: user?.country,
  });

  return {
    country,
    language: args.locale,
    sessionTier: tier,
    primaryPathway,
    entitlement,
    navMode,
    examRegion: args.examRegion,
    globalRegion: args.globalRegion,
  };
}
