/**
 * Central auth surface states — marketing auth routes consume via AuthStateSurface.
 */

import type { AuthContinuationHint } from "@/lib/auth/auth-study-continuation-context";

export type AuthMessageTone = "default" | "info" | "success" | "warning" | "danger";

export type AuthExperienceState =
  | "default"
  | "loading"
  | "validation-error"
  | "oauth-error"
  | "session-expired"
  | "continuation"
  | "verify-email"
  | "reset-success"
  | "magic-link-sent"
  | "magic-link-invalid"
  | "magic-link-expired";

/** Canonical route mode — prefer over legacy `variant`. */
export type AuthExperienceMode = "login" | "signup" | "recovery" | "reset" | "verify" | "oauth";

/** Figma layout families (do not fork per-route shells). */
export type AuthExperienceLayout =
  | "split-editorial"
  | "signup-aspirational"
  | "centered-glass"
  | "verified-split";

export type AuthExperienceTheme = "blossom" | "ocean" | "midnight";

export type AuthExperienceContinuation = {
  studyHint?: AuthContinuationHint | null;
};

/** @deprecated Use AuthExperienceMode */
export type AuthExperienceShellVariant = "login" | "signup" | "recovery" | "reset";

export function authModeFromVariant(variant: AuthExperienceShellVariant): AuthExperienceMode {
  return variant;
}

export function authLayoutForMode(mode: AuthExperienceMode): AuthExperienceLayout {
  switch (mode) {
    case "signup":
      return "signup-aspirational";
    case "recovery":
      return "centered-glass";
    case "verify":
      return "centered-glass";
    case "oauth":
      return "centered-glass";
    case "reset":
      return "split-editorial";
    case "login":
    default:
      return "split-editorial";
  }
}

export type AuthMessageBannerProps = {
  tone: AuthMessageTone;
  title: string;
  message?: string | null;
  help?: string | null;
  /** Stable hook for analytics / e2e */
  stateId?: AuthExperienceState;
  className?: string;
};
