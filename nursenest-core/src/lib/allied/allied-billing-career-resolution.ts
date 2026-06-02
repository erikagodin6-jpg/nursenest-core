import type { AlliedCareerKey } from "@/lib/pricing/display-catalog";
import {
  ALLIED_CAREER_KEYS,
  professionKeyToCareerKey,
} from "@/lib/pricing/display-catalog";

const CAREER_SET = new Set<string>(ALLIED_CAREER_KEYS);

/** Primary marketing `professionKey` used for lesson/topic scoping for each billed allied career. */
export const ALLIED_CAREER_CANONICAL_PROFESSION_KEY: Record<AlliedCareerKey, string> = {
  paramedic: "paramedic",
  rrt: "respiratory",
  mlt: "mlt",
  imaging: "imaging",
  ota_pta: "occupational-therapy",
  pharmtech: "pharmacy-tech",
  socialwork: "social-work",
};

export function canonicalProfessionKeyForAlliedCareer(career: AlliedCareerKey): string {
  return ALLIED_CAREER_CANONICAL_PROFESSION_KEY[career];
}

export function isValidAlliedCareerKey(raw: string | null | undefined): raw is AlliedCareerKey {
  const t = raw?.trim();
  return Boolean(t && CAREER_SET.has(t));
}

export type ResolvedAlliedEntitlement = {
  career: AlliedCareerKey | null;
  professionKey: string | null;
  /** Subscription/user row missing or invalid occupation — do not grant allied premium study surfaces. */
  pendingOccupation: boolean;
};

/**
 * Prefer Stripe subscription `alliedCareer` (billing key); fall back to mapping `User.alliedProfessionKey`
 * when it is a known marketing profession slug.
 */
export function resolveAlliedEntitlementFromProfile(args: {
  subscriptionAlliedCareer: string | null | undefined;
  userAlliedProfessionKey: string | null | undefined;
}): ResolvedAlliedEntitlement {
  const subRaw = args.subscriptionAlliedCareer?.trim();
  if (isValidAlliedCareerKey(subRaw)) {
    return {
      career: subRaw,
      professionKey: canonicalProfessionKeyForAlliedCareer(subRaw),
      pendingOccupation: false,
    };
  }

  const profSlug = args.userAlliedProfessionKey?.trim().toLowerCase();
  if (profSlug) {
    const fromProf = professionKeyToCareerKey(profSlug);
    if (fromProf) {
      return {
        career: fromProf,
        professionKey: canonicalProfessionKeyForAlliedCareer(fromProf),
        pendingOccupation: false,
      };
    }
  }

  return {
    career: null,
    professionKey: profSlug || null,
    pendingOccupation: true,
  };
}
