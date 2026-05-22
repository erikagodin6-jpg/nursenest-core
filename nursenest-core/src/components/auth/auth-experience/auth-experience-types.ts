/**
 * Central auth surface states — marketing auth routes consume via AuthStateSurface.
 */

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

export type AuthMessageBannerProps = {
  tone: AuthMessageTone;
  title: string;
  message?: string | null;
  help?: string | null;
  /** Stable hook for analytics / e2e */
  stateId?: AuthExperienceState;
  className?: string;
};
