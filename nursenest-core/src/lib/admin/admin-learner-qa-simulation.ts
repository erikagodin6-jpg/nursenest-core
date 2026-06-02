import { createHmac, timingSafeEqual } from "node:crypto";
import { cache } from "react";
import { CountryCode, TierCode } from "@prisma/client";
import { ALLIED_CAREER_KEYS, type AlliedCareerKey } from "@/lib/pricing/display-catalog";
import type { BillingDuration } from "@/lib/pricing/billing-types";
import type { UserAccess } from "@/lib/entitlements/user-access-types";
import type { LearnerPathwayNavMetadata } from "@/lib/learner/load-learner-shell-pathway-metadata";
import { formatPathwayContextBar } from "@/lib/learner/load-learner-shell-pathway-metadata";
import { learnerPathwayHubChromeHref } from "@/lib/learner/learner-pathway-hub-chrome-href";
import { getExamPathwayById } from "@/lib/exam-pathways/exam-pathways-catalog";

export const ADMIN_LEARNER_QA_COOKIE = "nn_admin_learner_qa";
const PAYLOAD_VERSION = 1 as const;
export const ADMIN_LEARNER_QA_MAX_AGE_SEC = 2 * 60 * 60;

export type AdminLearnerQaTrack =
  | "RN"
  | "RPN"
  | "LVN_LPN"
  | "NP"
  | "ALLIED"
  | "NEW_GRAD"
  | "PRE_NURSING";
export type AdminLearnerQaLifecycle =
  | "paid_active"        // Active subscriber — any billing cadence (default: yearly)
  | "paid_monthly"       // Active monthly subscriber (explicit cadence)
  | "paid_annual"        // Active annual subscriber (explicit cadence)
  | "none"               // Free user — no subscription ever
  | "expired"            // Subscription expired, no access
  | "trial"              // Active trial user
  | "trial_expired"      // Trial ended, no conversion
  | "canceled"           // Subscription cancelled but still within paid period
  | "past_due";          // Failed payment — past-due grace period

/** NP board prep specialization — maps to `exam-pathways` ids (US). */
export type AdminLearnerQaNpSpecialty = "FNP" | "AGPCNP" | "PMHNP" | "WHNP" | "PNP_PC";

/** Simulated plan cadence for catalog / plan row display (not Stripe). */
export type AdminLearnerQaPlanVariant = Extract<BillingDuration, "monthly" | "6-month" | "yearly">;

/** For display / analytics — does not affect entitlements. */
export type AdminLearnerQaExperienceLevel = "new" | "active" | "returning";

export type AdminLearnerQaPayloadV1 = {
  v: typeof PAYLOAD_VERSION;
  /** Authenticated user id (must match session when verified). */
  sub: string;
  exp: number;
  track: AdminLearnerQaTrack;
  lifecycle: AdminLearnerQaLifecycle;
  country: "US" | "CA";
  /** When `track` is `NP`, selects NP pathway id; defaults to FNP. */
  npSpecialty?: AdminLearnerQaNpSpecialty;
  /** When `track` is `ALLIED`, selects career for entitlement + pricing scope; defaults to `paramedic`. */
  alliedCareer?: AlliedCareerKey;
  /** Billing cadence reflected on synthetic `UserAccess.plan`; sensible default per lifecycle. */
  planVariant?: AdminLearnerQaPlanVariant;
  /**
   * When set, this is a REAL USER view-as session.
   * Stored for audit/display — the `track`/`lifecycle`/`country` are derived from the real user's
   * actual subscription data at session-start time.  The real user's study data is NOT loaded;
   * entitlements are synthetic (built from the mapped params) to avoid data privacy issues.
   */
  targetUserId?: string;
  /** Real user's email — for banner display only, never used for data access. */
  targetEmail?: string;
  /** Experience level label — for banner display only. */
  experienceLevel?: AdminLearnerQaExperienceLevel;
};

export type AdminLearnerQaPublicState = {
  active: true;
  track: AdminLearnerQaTrack;
  lifecycle: AdminLearnerQaLifecycle;
  country: "US" | "CA";
  npSpecialty: AdminLearnerQaNpSpecialty | null;
  alliedCareer: AlliedCareerKey | null;
  planVariant: AdminLearnerQaPlanVariant | null;
  billingRegionSlug: string | null;
  bannerTitle: string;
  pathwayId: string | null;
  /** Set for real-user view-as sessions. */
  targetUserId: string | null;
  targetEmail: string | null;
  experienceLevel: AdminLearnerQaExperienceLevel | null;
  isRealUser: boolean;
};

export function qaSigningSecret(): string | null {
  const dedicated = process.env.ADMIN_LEARNER_QA_SECRET?.trim();
  if (dedicated && dedicated.length >= 16) return dedicated;
  const auth = process.env.AUTH_SECRET?.trim() || process.env.NEXTAUTH_SECRET?.trim();
  if (auth && auth.length >= 16) return auth;
  return null;
}

function tierForTrack(track: AdminLearnerQaTrack): TierCode {
  switch (track) {
    case "RN":
      return TierCode.RN;
    case "RPN":
      return TierCode.RPN;
    case "LVN_LPN":
      return TierCode.LVN_LPN;
    case "NP":
      return TierCode.NP;
    case "ALLIED":
      return TierCode.ALLIED;
    case "NEW_GRAD":
      return TierCode.NEW_GRAD;
    case "PRE_NURSING":
      return TierCode.PRE_NURSING;
  }
}

/** Tier string for shell chrome fallbacks when pathway metadata is missing (matches JWT tier codes). */
export function learnerQaChromeTierFallbackString(track: AdminLearnerQaTrack): string {
  return String(tierForTrack(track));
}

function countryCodeFromQa(country: "US" | "CA"): CountryCode {
  return country === "CA" ? CountryCode.CA : CountryCode.US;
}

const NP_PATHWAY_BY_SPECIALTY: Record<AdminLearnerQaNpSpecialty, string> = {
  FNP: "us-np-fnp",
  AGPCNP: "us-np-agpcnp",
  PMHNP: "us-np-pmhnp",
  WHNP: "us-np-whnp",
  PNP_PC: "us-np-pnp-pc",
};

const QA_NP_SPECIALTIES = Object.keys(NP_PATHWAY_BY_SPECIALTY) as AdminLearnerQaNpSpecialty[];

/** Stripe checkout-style region slug for CA/US pools (see {@link planFromCheckoutMetadata}). */
export function billingRegionSlugForQaCountry(country: "US" | "CA"): string {
  return country === "CA" ? "canada" : "us";
}

export function defaultNpSpecialtyForTrack(track: AdminLearnerQaTrack): AdminLearnerQaNpSpecialty | null {
  return track === "NP" ? "FNP" : null;
}

export function defaultAlliedCareerForTrack(track: AdminLearnerQaTrack): AlliedCareerKey | null {
  return track === "ALLIED" ? "paramedic" : null;
}

export function defaultPlanVariantForLifecycle(lifecycle: AdminLearnerQaLifecycle): AdminLearnerQaPlanVariant | null {
  if (lifecycle === "paid_active" || lifecycle === "paid_annual" || lifecycle === "canceled") return "yearly";
  if (lifecycle === "paid_monthly") return "monthly";
  if (lifecycle === "trial" || lifecycle === "trial_expired") return "monthly";
  return null;
}

/** Human-readable one-liner for the given lifecycle — used in banner + toolbar. */
export function lifecycleLabel(lifecycle: AdminLearnerQaLifecycle): string {
  switch (lifecycle) {
    case "paid_active":   return "Active subscriber";
    case "paid_monthly":  return "Active monthly subscriber";
    case "paid_annual":   return "Active annual subscriber";
    case "none":          return "Free user (no subscription)";
    case "expired":       return "Expired subscription";
    case "trial":         return "Active trial";
    case "trial_expired": return "Expired trial";
    case "canceled":      return "Cancelled subscription";
    case "past_due":      return "Failed payment / past-due";
  }
}

/**
 * Map a real subscriber's DB status to the nearest QA lifecycle enum.
 * Used when starting a real-user view-as session.
 */
export function lifecycleFromSubscriptionStatus(
  status: "none" | "active" | "canceled" | "grace" | "past_due",
  planDuration: string | null,
  trialStatus: "NONE" | "ACTIVE" | "EXPIRED" | "CONVERTED" | null,
): AdminLearnerQaLifecycle {
  if (status === "active") {
    if (trialStatus === "ACTIVE") return "trial";
    if (planDuration === "monthly") return "paid_monthly";
    if (planDuration === "yearly" || planDuration === "6-month") return "paid_annual";
    return "paid_active";
  }
  if (status === "past_due") return "past_due";
  if (status === "canceled" || status === "grace") return "canceled";
  if (trialStatus === "EXPIRED") return "trial_expired";
  return "none";
}

/** Default pathway ids for chrome + context bar (registry-backed). */
export function pathwayIdForQaTrack(
  track: AdminLearnerQaTrack,
  country: "US" | "CA",
  npSpecialty?: AdminLearnerQaNpSpecialty | null,
): string | null {
  switch (track) {
    case "RN":
      return country === "CA" ? "ca-rn-nclex-rn" : "us-rn-nclex-rn";
    case "RPN":
      return "ca-rpn-rex-pn";
    case "LVN_LPN":
      return "us-lpn-nclex-pn";
    case "NP": {
      const spec = npSpecialty ?? "FNP";
      return NP_PATHWAY_BY_SPECIALTY[spec] ?? "us-np-fnp";
    }
    case "ALLIED":
      return country === "CA" ? "ca-allied-core" : "us-allied-core";
    case "NEW_GRAD":
      return "us-rn-new-grad-transition";
    case "PRE_NURSING":
      return null;
    default:
      return null;
  }
}

/** Copy for learner shell user menu (plain language; avoids JWT subscription mismatch during QA). */
export function learnerQaUserBarOverlayFromPayload(p: AdminLearnerQaPayloadV1): { planLabel: string; scopeLine: string } {
  const prefix = p.targetUserId ? "Real user" : "Simulated";
  const life = `${prefix}: ${lifecycleLabel(p.lifecycle)}`;
  const track =
    p.track === "LVN_LPN"
      ? "LVN/LPN"
      : p.track === "NEW_GRAD"
        ? "New Grad"
        : p.track === "ALLIED"
          ? "Allied"
          : p.track === "PRE_NURSING"
            ? "Pre-Nursing"
            : p.track;
  const np =
    p.track === "NP"
      ? ` · NP ${(p.npSpecialty ?? "FNP").replace("_", "-")}`
      : p.track === "ALLIED"
        ? ` · ${(p.alliedCareer ?? "paramedic").replace(/_/g, " ")}`
        : "";
  const plan = p.planVariant ? ` · ${p.planVariant}` : "";
  return { planLabel: life, scopeLine: `${track}${np}${plan} · ${p.country}` };
}

export function bannerTitleForPayload(p: AdminLearnerQaPayloadV1): string {
  const trackLabel =
    p.track === "LVN_LPN"
      ? "LVN/LPN"
      : p.track === "NEW_GRAD"
        ? "New Grad"
        : p.track === "ALLIED"
          ? "Allied"
          : p.track === "PRE_NURSING"
            ? "Pre-Nursing"
            : p.track;
  const life = lifecycleLabel(p.lifecycle);
  const np =
    p.track === "NP"
      ? ` · NP ${(p.npSpecialty ?? "FNP").replace(/_/g, "/")}`
      : p.track === "ALLIED"
        ? ` · Allied: ${(p.alliedCareer ?? "paramedic").replace(/_/g, " ")}`
        : "";
  const plan = p.planVariant ? ` · Plan: ${p.planVariant}` : "";
  if (p.targetUserId && p.targetEmail) {
    return `VIEWING AS USER — ${p.targetEmail} · ${trackLabel}${np}${plan} · ${life} · ${p.country}`;
  }
  return `SIMULATED LEARNER — ${trackLabel}${np}${plan} · ${life} · ${p.country}`;
}

function hmacHex(secret: string, message: string): string {
  return createHmac("sha256", secret).update(message, "utf8").digest("hex");
}

function timingSafeStringEqual(a: string, b: string): boolean {
  const ab = Buffer.from(a, "utf8");
  const bb = Buffer.from(b, "utf8");
  if (ab.length !== bb.length) return false;
  return timingSafeEqual(ab, bb);
}

export function signAdminLearnerQaCookieValue(payload: AdminLearnerQaPayloadV1): string | null {
  const secret = qaSigningSecret();
  if (!secret) return null;
  const body = Buffer.from(JSON.stringify(payload), "utf8").toString("base64url");
  const sig = hmacHex(secret, body);
  return `${body}.${sig}`;
}

export function verifyAdminLearnerQaCookieValue(
  cookieValue: string | undefined,
  expectedUserId: string,
): AdminLearnerQaPayloadV1 | null {
  const secret = qaSigningSecret();
  if (!secret || !cookieValue?.trim()) return null;
  const parts = cookieValue.split(".");
  if (parts.length !== 2) return null;
  const [body, sig] = parts;
  if (!body || !sig) return null;
  const expectedSig = hmacHex(secret, body);
  if (!timingSafeStringEqual(expectedSig, sig)) return null;
  let parsed: unknown;
  try {
    parsed = JSON.parse(Buffer.from(body, "base64url").toString("utf8"));
  } catch {
    return null;
  }
  if (!parsed || typeof parsed !== "object") return null;
  const o = parsed as Record<string, unknown>;
  if (o.v !== PAYLOAD_VERSION || typeof o.sub !== "string" || typeof o.exp !== "number") return null;
  if (o.sub !== expectedUserId) return null;
  if (o.exp <= Math.floor(Date.now() / 1000)) return null;
  const track = o.track as AdminLearnerQaTrack;
  const lifecycle = o.lifecycle as AdminLearnerQaLifecycle;
  const country = o.country as "US" | "CA";
  const validTracks: AdminLearnerQaTrack[] = [
    "RN",
    "RPN",
    "LVN_LPN",
    "NP",
    "ALLIED",
    "NEW_GRAD",
    "PRE_NURSING",
  ];
  const validLife: AdminLearnerQaLifecycle[] = [
    "paid_active", "paid_monthly", "paid_annual",
    "none", "expired", "trial", "trial_expired", "canceled", "past_due",
  ];
  if (!validTracks.includes(track)) return null;
  if (!validLife.includes(lifecycle)) return null;
  if (country !== "US" && country !== "CA") return null;

  let npSpecialty: AdminLearnerQaNpSpecialty | undefined;
  if (typeof o.npSpecialty === "string" && QA_NP_SPECIALTIES.includes(o.npSpecialty as AdminLearnerQaNpSpecialty)) {
    npSpecialty = o.npSpecialty as AdminLearnerQaNpSpecialty;
  }
  if (npSpecialty && track !== "NP") npSpecialty = undefined;

  let alliedCareer: AlliedCareerKey | undefined;
  if (typeof o.alliedCareer === "string" && (ALLIED_CAREER_KEYS as readonly string[]).includes(o.alliedCareer)) {
    alliedCareer = o.alliedCareer as AlliedCareerKey;
  }
  if (alliedCareer && track !== "ALLIED") alliedCareer = undefined;

  let planVariant: AdminLearnerQaPlanVariant | undefined;
  if (o.planVariant === "monthly" || o.planVariant === "yearly" || o.planVariant === "6-month") {
    planVariant = o.planVariant;
  }

  const targetUserId = typeof o.targetUserId === "string" && o.targetUserId.trim() ? o.targetUserId.trim() : undefined;
  const targetEmail = typeof o.targetEmail === "string" && o.targetEmail.trim() ? o.targetEmail.trim() : undefined;
  const validExpLevels: AdminLearnerQaExperienceLevel[] = ["new", "active", "returning"];
  const experienceLevel =
    typeof o.experienceLevel === "string" && validExpLevels.includes(o.experienceLevel as AdminLearnerQaExperienceLevel)
      ? (o.experienceLevel as AdminLearnerQaExperienceLevel)
      : undefined;

  return {
    v: PAYLOAD_VERSION,
    sub: o.sub,
    exp: o.exp,
    track,
    lifecycle,
    country,
    ...(npSpecialty ? { npSpecialty } : {}),
    ...(alliedCareer ? { alliedCareer } : {}),
    ...(planVariant ? { planVariant } : {}),
    ...(targetUserId ? { targetUserId } : {}),
    ...(targetEmail ? { targetEmail } : {}),
    ...(experienceLevel ? { experienceLevel } : {}),
  };
}

/**
 * Verified QA cookie payloads must not affect learner shell or chrome unless the requester has a
 * DB-backed staff session (defense in depth: cookie alone never changes non-staff UI).
 */
export function staffGatedVerifiedSimulation(
  hasStaffSession: boolean,
  verified: AdminLearnerQaPayloadV1 | null,
): AdminLearnerQaPayloadV1 | null {
  return hasStaffSession && verified ? verified : null;
}

export const getVerifiedAdminLearnerQaSimulation = cache(async function getVerifiedAdminLearnerQaSimulation(
  userId: string,
): Promise<AdminLearnerQaPayloadV1 | null> {
  if (!userId) return null;
  try {
    const { cookies } = await import("next/headers");
    const jar = await cookies();
    const raw = jar.get(ADMIN_LEARNER_QA_COOKIE)?.value;
    return verifyAdminLearnerQaCookieValue(raw, userId);
  } catch {
    return null;
  }
});

export function publicQaStateFromPayload(p: AdminLearnerQaPayloadV1): AdminLearnerQaPublicState {
  const np = p.track === "NP" ? (p.npSpecialty ?? "FNP") : null;
  const allied = p.track === "ALLIED" ? (p.alliedCareer ?? "paramedic") : null;
  const plan = p.planVariant ?? defaultPlanVariantForLifecycle(p.lifecycle);
  return {
    active: true,
    track: p.track,
    lifecycle: p.lifecycle,
    country: p.country,
    npSpecialty: np,
    alliedCareer: allied,
    planVariant: plan,
    billingRegionSlug: billingRegionSlugForQaCountry(p.country),
    bannerTitle: bannerTitleForPayload(p),
    pathwayId: pathwayIdForQaTrack(p.track, p.country, np),
    targetUserId: p.targetUserId ?? null,
    targetEmail: p.targetEmail ?? null,
    experienceLevel: p.experienceLevel ?? null,
    isRealUser: Boolean(p.targetUserId),
  };
}

export async function readAdminLearnerQaPublicState(userId: string): Promise<AdminLearnerQaPublicState | null> {
  const p = await getVerifiedAdminLearnerQaSimulation(userId);
  return p ? publicQaStateFromPayload(p) : null;
}

export function learnerPathwayNavFromQaPayload(payload: AdminLearnerQaPayloadV1): LearnerPathwayNavMetadata {
  if (payload.track === "PRE_NURSING") {
    return {
      showBaselinePrompt: false,
      pathwayId: null,
      pathwayShortLabel: "Pre-Nursing",
      pathwayHubHref: "/pre-nursing",
      pathwayContextBar: null,
      examsLabel: "Exams",
    };
  }
  const np = payload.track === "NP" ? (payload.npSpecialty ?? "FNP") : null;
  const pathwayId = pathwayIdForQaTrack(payload.track, payload.country, np);
  let pathwayShortLabel: string | null = null;
  let pathwayHubHref: string | null = null;
  let pathwayContextBar: string | null = null;
  let examsLabel: "CAT Exams" | "Exams" = "Exams";
  if (pathwayId) {
    const p = getExamPathwayById(pathwayId);
    if (p) {
      pathwayHubHref = learnerPathwayHubChromeHref(p);
      pathwayContextBar = formatPathwayContextBar(p);
      pathwayShortLabel =
        p.roleTrack === "rn"
          ? "RN"
          : p.roleTrack === "rpn" || p.roleTrack === "lpn"
            ? "PN"
            : p.roleTrack === "np"
              ? "NP"
              : p.roleTrack === "allied"
                ? "Allied"
                : "Pathway";
      if (p.roleTrack === "rn" || p.roleTrack === "rpn" || p.roleTrack === "lpn" || p.roleTrack === "np") {
        examsLabel = "CAT Exams";
      }
    }
  }
  return {
    showBaselinePrompt: false,
    pathwayId,
    pathwayShortLabel,
    pathwayHubHref,
    pathwayContextBar,
    examsLabel,
  };
}

/**
 * Synthetic {@link UserAccess} for staff QA — does not read `Subscription` rows or mutate billing.
 * Caller should wrap with {@link withSessionJwt} / attach `sessionJwt` from the real `User` row.
 */
export function buildUserAccessForAdminLearnerQa(payload: AdminLearnerQaPayloadV1): Omit<UserAccess, "sessionJwt"> {
  const tier = tierForTrack(payload.track);
  const country = countryCodeFromQa(payload.country);
  const npSpec = payload.track === "NP" ? (payload.npSpecialty ?? "FNP") : null;
  const pathwayId = pathwayIdForQaTrack(payload.track, payload.country, npSpec);
  const alliedCareer: AlliedCareerKey | null =
    tier === TierCode.ALLIED ? (payload.alliedCareer ?? "paramedic") : null;
  const billingRegionSlug = billingRegionSlugForQaCountry(payload.country);
  const planVariant = payload.planVariant ?? defaultPlanVariantForLifecycle(payload.lifecycle);

  const planDuration: BillingDuration | null = planVariant ?? null;
  const planCodeParts = [
    "admin_qa_simulated",
    String(tier).toLowerCase(),
    npSpec ? `np_${npSpec.toLowerCase()}` : null,
    alliedCareer,
    planDuration,
  ].filter(Boolean);
  const basePlan = {
    planCode: planCodeParts.join("_"),
    duration: planDuration as string | null,
    cancelAtPeriodEnd: false,
  };

  let hasPremium = false;
  let reason: UserAccess["reason"] = "no_access";
  let planStatus: UserAccess["plan"]["status"] = "none";
  let expiresAt: Date | null = null;

  switch (payload.lifecycle) {
    case "paid_active":
    case "paid_monthly":
    case "paid_annual":
      hasPremium = true;
      reason = "active_subscription";
      planStatus = "active";
      expiresAt = new Date(Date.now() + 86400_000 * 30);
      break;
    case "trial":
      hasPremium = true;
      reason = "active_trial";
      planStatus = "active";
      expiresAt = new Date(Date.now() + 86400_000 * 7);
      break;
    case "canceled":
      // Cancelled but within paid period — still has access
      hasPremium = true;
      reason = "canceled_paid_through";
      planStatus = "canceled";
      expiresAt = new Date(Date.now() + 86400_000 * 14);
      break;
    case "past_due":
      // Failed payment — in past-due grace period (still has temporary access)
      hasPremium = true;
      reason = "past_due_grace";
      planStatus = "past_due";
      expiresAt = new Date(Date.now() + 86400_000 * 3);
      break;
    case "expired":
    case "trial_expired":
      hasPremium = false;
      reason = "no_access";
      planStatus = "canceled";
      expiresAt = new Date(Date.now() - 86400_000);
      break;
    case "none":
    default:
      hasPremium = false;
      reason = "no_access";
      planStatus = "none";
      expiresAt = null;
      break;
  }

  return {
    userId: payload.sub,
    hasPremium,
    reason,
    allowedRegion: { country, billingRegionSlug },
    allowedProfession: { tier, alliedCareer },
    allowedExam: { pathwayId },
    plan: {
      ...basePlan,
      status: planStatus,
      expiresAt,
    },
    adminLearnerQaSimulation: true,
  };
}
