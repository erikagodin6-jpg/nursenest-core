import type { OAuthProviderId } from "@/lib/auth/auth-flow-governance";
import type { AuthContinuationHint } from "@/lib/auth/auth-study-continuation-context";

/** Marketing auth transition moments — single taxonomy for shells + governance. */
export type AuthTransitionKind =
  | "email-verified"
  | "session-expired"
  | "password-reset-success"
  | "oauth-continuation"
  | "sign-in-success"
  | "sign-up-completion"
  | "magic-link-confirmation"
  | "account-recovery"
  | "loading"
  | "authentication-error";

export type AuthPathwaySegment = "rn" | "rpn" | "np" | "general";

export type AuthLearnerIntent =
  | "flashcards"
  | "cat"
  | "practice"
  | "questions"
  | "lessons"
  | "learner-app"
  | "marketing"
  | "general";

export type AuthOnboardingState = "pending" | "complete" | null;

export type AuthMagicLinkVariant = "sent" | "confirmed" | "invalid" | "expired";

export type AuthTransitionLayout = "inline" | "panel" | "full-page";

export type AuthTransitionMessageTone = "default" | "info" | "success" | "warning" | "danger";

export type AuthWhatsNextStep = {
  title: string;
  detail: string;
  href: string;
};

export type AuthTransitionAction = {
  label: string;
  href: string;
  kind: "primary" | "secondary";
};

export type AuthTransitionWatermarkStyle = {
  hero: "panel-hero" | "none";
  ambient: "page-ambient" | "none";
  cardCorner: boolean;
};

export type AuthTransitionMotionPreset =
  | "fade-in"
  | "celebration"
  | "continuation-pulse"
  | "loading-strip"
  | "calm-recovery"
  | "none";

export type AuthTransitionPresentation = {
  kind: AuthTransitionKind;
  eyebrow: string;
  title: string;
  body: string;
  tone: AuthTransitionMessageTone;
  loadingCopy: { headline: string; detail: string | null };
  primaryAction: AuthTransitionAction | null;
  secondaryAction: AuthTransitionAction | null;
  nextSteps: AuthWhatsNextStep[];
  watermarkStyle: AuthTransitionWatermarkStyle;
  motionPreset: AuthTransitionMotionPreset;
  accessibilityAnnouncement: string;
  help: string | null;
};

export type AuthTransitionPresentationInput = {
  kind: AuthTransitionKind;
  pathwayId?: string | null;
  pathway?: AuthPathwaySegment;
  callbackUrl?: string | null;
  error?: string | null;
  learnerIntent?: AuthLearnerIntent | null;
  onboardingState?: AuthOnboardingState;
  magicLinkVariant?: AuthMagicLinkVariant;
  oauthProvider?: OAuthProviderId | null;
  studyHint?: AuthContinuationHint | null;
  signupTier?: "RN" | "PN" | "NP" | "ALLIED" | null;
  verifyStatus?: "success" | "expired" | "invalid" | "rate_limited";
  primaryActionHref?: string | null;
  secondaryActionHref?: string | null;
  layout?: AuthTransitionLayout;
};

export type AuthTransitionTranslate = (
  key: string,
  params?: Record<string, string | number | undefined>,
) => string;
