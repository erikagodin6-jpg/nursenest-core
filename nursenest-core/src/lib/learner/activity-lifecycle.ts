import "server-only";

import type { Session } from "next-auth";
import { getProtectedRouteSession } from "@/lib/auth/protected-route-session";
import { resolveEntitlementForPage, type PageEntitlementResult } from "@/lib/entitlements/resolve-entitlement-for-page";
import { getServerPremiumProtectionFlags, type PremiumProtectionFlags } from "@/lib/premium-protection/config";
import { maskUserLabelForWatermark } from "@/lib/premium-protection/mask-user-label";
import { safeServerLog } from "@/lib/observability/safe-server-log";

export type LearnerActivityKind =
  | "flashcards"
  | "practice_exam"
  | "cat_exam"
  | "review"
  | "resume";

export type LearnerActivityPhase =
  | "idle"
  | "auth-resolving"
  | "access-validating"
  | "loading"
  | "ready"
  | "submitting"
  | "recovering"
  | "completed"
  | "error";

export type LearnerActivityRouteParamSpec = {
  name: string;
  value: unknown;
  pattern: RegExp;
  displayName?: string;
};

export type LearnerActivityRouteParams = Record<string, string>;

export type LearnerActivityBootstrapReady = {
  ok: true;
  phase: "ready";
  surface: string;
  activityKind: LearnerActivityKind;
  routeParams: LearnerActivityRouteParams;
  session: Session;
  userId: string;
  email: string | null;
  entitlement: Exclude<PageEntitlementResult, "error">;
  protectionFlags: PremiumProtectionFlags;
  userLabel: string;
};

export type LearnerActivityBootstrapFail = {
  ok: false;
  phase: Exclude<LearnerActivityPhase, "ready">;
  surface: string;
  activityKind: LearnerActivityKind;
  reason:
    | "invalid_route_params"
    | "auth_unavailable"
    | "access_unavailable"
    | "subscription_required";
  title: string;
  message: string;
  homeHref: string;
  homeLabel: string;
  routeParams?: LearnerActivityRouteParams;
  invalidParam?: string;
  entitlement?: PageEntitlementResult;
};

export type LearnerActivityBootstrapResult =
  | LearnerActivityBootstrapReady
  | LearnerActivityBootstrapFail;

export function normalizeLearnerActivityRouteParams(
  specs: LearnerActivityRouteParamSpec[],
): { ok: true; params: LearnerActivityRouteParams } | { ok: false; invalidParam: string; params: LearnerActivityRouteParams } {
  const params: LearnerActivityRouteParams = {};
  for (const spec of specs) {
    const raw = typeof spec.value === "string" ? spec.value.trim() : "";
    if (!raw || !spec.pattern.test(raw)) {
      return { ok: false, invalidParam: spec.displayName ?? spec.name, params };
    }
    params[spec.name] = raw;
  }
  return { ok: true, params };
}

export async function loadLearnerActivityBootstrap({
  surface,
  activityKind,
  routeParams = [],
  homeHref,
  homeLabel,
  requireSubscription = true,
}: {
  surface: string;
  activityKind: LearnerActivityKind;
  routeParams?: LearnerActivityRouteParamSpec[];
  homeHref: string;
  homeLabel: string;
  requireSubscription?: boolean;
}): Promise<LearnerActivityBootstrapResult> {
  const normalized = normalizeLearnerActivityRouteParams(routeParams);
  if (!normalized.ok) {
    return {
      ok: false,
      phase: "error",
      surface,
      activityKind,
      reason: "invalid_route_params",
      title: "Activity link unavailable",
      message: `This ${normalized.invalidParam} link is invalid or expired.`,
      homeHref,
      homeLabel,
      routeParams: normalized.params,
      invalidParam: normalized.invalidParam,
    };
  }

  let session: Session | null = null;
  try {
    session = await getProtectedRouteSession(surface);
  } catch (error) {
    safeServerLog("learner_activity", "bootstrap_session_threw", {
      surface,
      activityKind,
      detail: (error instanceof Error ? error.message : String(error)).slice(0, 200),
    });
  }

  const userId = (session?.user as { id?: string } | undefined)?.id ?? "";
  if (!session || !userId) {
    return {
      ok: false,
      phase: "auth-resolving",
      surface,
      activityKind,
      reason: "auth_unavailable",
      title: "Session still resolving",
      message: "We could not verify your learner session yet. Retry from here so your activity can resume cleanly.",
      homeHref,
      homeLabel,
      routeParams: normalized.params,
    };
  }

  const entitlement = await resolveEntitlementForPage(userId);
  if (entitlement === "error") {
    return {
      ok: false,
      phase: "access-validating",
      surface,
      activityKind,
      reason: "access_unavailable",
      title: "Access verification unavailable",
      message: "We could not verify your learner access. Retry shortly; your progress is safe.",
      homeHref,
      homeLabel,
      routeParams: normalized.params,
      entitlement,
    };
  }

  if (requireSubscription && !entitlement.hasAccess) {
    return {
      ok: false,
      phase: "error",
      surface,
      activityKind,
      reason: "subscription_required",
      title: "Subscription required",
      message: "This learning activity is part of the full NurseNest study experience.",
      homeHref,
      homeLabel,
      routeParams: normalized.params,
      entitlement,
    };
  }

  const email = (session.user as { email?: string | null } | undefined)?.email ?? null;
  return {
    ok: true,
    phase: "ready",
    surface,
    activityKind,
    routeParams: normalized.params,
    session,
    userId,
    email,
    entitlement,
    protectionFlags: getServerPremiumProtectionFlags(),
    userLabel: maskUserLabelForWatermark(email, userId),
  };
}
