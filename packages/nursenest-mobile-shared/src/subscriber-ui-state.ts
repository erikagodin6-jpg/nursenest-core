import { parseApiErrorCode } from "./paywall.js";

/**
 * Fields from `GET /api/learner/personal-profile` used for subscriber UX only.
 * Server remains SoT — this module never infers billing state beyond API flags.
 */
export type PersonalProfileSubscriberFields = {
  readonly subscriberAccess?: boolean;
  readonly entitlementVerifyFailed?: boolean;
  readonly lockReason?: "subscription_plan" | null;
};

export type ProfileQueryFlags = {
  readonly isLoading: boolean;
  readonly isSuccess: boolean;
  readonly isError: boolean;
  readonly data: unknown;
};

export type ResolveSubscriberUiStateInput = {
  /** `AuthProvider.ready` — SecureStore + initial session probe finished. */
  readonly authReady: boolean;
  /** Origin + cookie jar present so profile query can run. */
  readonly hasApiCredentials: boolean;
  readonly profile: ProfileQueryFlags;
};

export type SubscriberUiPhase =
  | "wait_auth"
  | "wait_credentials"
  | "profile_loading"
  | "profile_error"
  | "verify_failed"
  | "no_subscriber_access"
  | "subscriber_ok";

export type SubscriberUiState = {
  readonly phase: SubscriberUiPhase;
  /**
   * When true, avoid rendering “locked / no access” rows until the server profile resolves
   * (prevents paid UI flashing false-negative while cookies hydrate).
   */
  readonly blockLockedCopyFlash: boolean;
  /** Neutral, App Store–safe summary; empty when `subscriber_ok`. */
  readonly neutralSummaryLine: string;
  /** Convenience: server says premium learner APIs may run. */
  readonly subscriberAccess: boolean;
};

function asProfile(data: unknown): PersonalProfileSubscriberFields | null {
  if (!data || typeof data !== "object") return null;
  return data as PersonalProfileSubscriberFields;
}

/**
 * Centralizes mobile home / onboarding branching from **server JSON only** (personal profile).
 * Does not duplicate `getUserAccess` — consumes `subscriberAccess` and related flags from the API.
 */
export function resolveSubscriberUiState(input: ResolveSubscriberUiStateInput): SubscriberUiState {
  const { authReady, hasApiCredentials, profile } = input;

  if (!authReady) {
    return {
      phase: "wait_auth",
      blockLockedCopyFlash: true,
      neutralSummaryLine: "Restoring session…",
      subscriberAccess: false,
    };
  }

  if (!hasApiCredentials) {
    return {
      phase: "wait_credentials",
      blockLockedCopyFlash: true,
      neutralSummaryLine: "Sign in on this device to load your study profile.",
      subscriberAccess: false,
    };
  }

  if (profile.isLoading) {
    return {
      phase: "profile_loading",
      blockLockedCopyFlash: true,
      neutralSummaryLine: "Checking your access…",
      subscriberAccess: false,
    };
  }

  if (profile.isError) {
    return {
      phase: "profile_error",
      blockLockedCopyFlash: true,
      neutralSummaryLine: "Could not load your profile. Reopen the app when you are online.",
      subscriberAccess: false,
    };
  }

  if (!profile.isSuccess) {
    return {
      phase: "profile_loading",
      blockLockedCopyFlash: true,
      neutralSummaryLine: "Checking your access…",
      subscriberAccess: false,
    };
  }

  const p = asProfile(profile.data);
  if (!p) {
    return {
      phase: "profile_error",
      blockLockedCopyFlash: true,
      neutralSummaryLine: "Could not load your profile. Reopen the app when you are online.",
      subscriberAccess: false,
    };
  }

  if (p.entitlementVerifyFailed) {
    return {
      phase: "verify_failed",
      blockLockedCopyFlash: false,
      neutralSummaryLine:
        "We could not verify subscription status. Try again shortly, or open the website while we retry.",
      subscriberAccess: false,
    };
  }

  if (!p.subscriberAccess) {
    const lock = p.lockReason === "subscription_plan";
    return {
      phase: "no_subscriber_access",
      blockLockedCopyFlash: false,
      neutralSummaryLine: lock
        ? "Your active web subscription sets exam region and tier. Manage billing on the website when you want to change scope."
        : "Full practice features are available after you complete billing on the website.",
      subscriberAccess: false,
    };
  }

  return {
    phase: "subscriber_ok",
    blockLockedCopyFlash: false,
    neutralSummaryLine: "",
    subscriberAccess: true,
  };
}

/** Headline for command-center style APIs that return 403 + JSON `code` (subscriber gate). */
export function subscriberHeadlineFromSubscriberApi403(body: unknown): string {
  const code = parseApiErrorCode(body);
  if (code === "not_subscribed") {
    return "Subscribe on the website to unlock personalized study picks in the app.";
  }
  if (code === "access_verify_failed") {
    return "Access could not be verified. Try again shortly.";
  }
  if (code === "unauthorized") {
    return "Session expired. Sign in again to continue.";
  }
  if (code === "region_tier_locked") {
    return "Exam region or tier is tied to your web subscription. Update billing on the website if you need a different scope.";
  }
  return "This feed needs an active subscription managed on the website.";
}
