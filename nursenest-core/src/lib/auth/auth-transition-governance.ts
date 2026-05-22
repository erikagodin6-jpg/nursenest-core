/**
 * Central governance for Blossom auth transitions — copy, pathway panels, watermark rules,
 * loading messages, and continuation CTAs. Callback/resume path safety stays in
 * {@link ./auth-flow-governance.ts}; study hints in {@link ./auth-study-continuation-context.ts}.
 */

import {
  resolveAuthErrorPresentation,
  type OAuthProviderId,
} from "@/lib/auth/auth-flow-governance";
import { resolveAuthContinuationHint, type AuthContinuationHint } from "@/lib/auth/auth-study-continuation-context";
import { isNpPremiumConvergencePathway } from "@/lib/marketing/np-premium-convergence-pathways";
import type { ExamPathwayDefinition } from "@/lib/exam-pathways/types";

/** Marketing auth surfaces — transition moments (not form fields). */
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

export type AuthWhatsNextStep = {
  title: string;
  detail: string;
  href: string;
};

export type AuthTransitionCopy = {
  eyebrow: string;
  title: string;
  message: string;
  help: string | null;
};

export type AuthLoadingPresentation = {
  headline: string;
  detail: string | null;
};

export type AuthSignInSuccessPresentation = {
  ctaLabel: string;
  loading: AuthLoadingPresentation;
};

/** Leaf watermark — opacity ranges and placement (Blossom auth spec). */
export const AUTH_LEAF_WATERMARK_GOVERNANCE = {
  hero: { opacityMin: 0.06, opacityMax: 0.1, defaultOpacity: 0.09 },
  ambient: { opacityMin: 0.03, opacityMax: 0.06, defaultOpacity: 0.055 },
  cardCorner: { opacityMin: 0.05, opacityMax: 0.07, defaultOpacity: 0.055 },
  mobileScale: 0.92,
  blurPx: 0,
  zIndex: 0,
  contentZIndex: 1,
} as const;

export function authLeafOpacityForPlacement(
  placement: "card-corner" | "panel-hero" | "page-ambient",
  opts?: { mobile?: boolean },
): number {
  const g = AUTH_LEAF_WATERMARK_GOVERNANCE;
  let base =
    placement === "panel-hero"
      ? g.hero.defaultOpacity
      : placement === "page-ambient"
        ? g.ambient.defaultOpacity
        : g.cardCorner.defaultOpacity;
  if (opts?.mobile) base *= g.mobileScale;
  return base;
}

function pathwayIdFromCallback(callbackUrl: string | null): string | null {
  if (!callbackUrl?.trim()) return null;
  try {
    const id = new URL(callbackUrl.trim(), "http://localhost").searchParams.get("pathwayId")?.trim();
    return id || null;
  } catch {
    return null;
  }
}

function pathwayIdFromSearch(pathwayId: string | null | undefined): string | null {
  const id = pathwayId?.trim();
  return id || null;
}

/** Infer learner segment from pathway id slug (callback or signup selection). */
export function inferAuthPathwaySegment(pathwayId: string | null): AuthPathwaySegment {
  if (!pathwayId) return "general";
  const id = pathwayId.toLowerCase();
  if (id.includes("np") || id.startsWith("ca-np") || id.includes("-np-")) return "np";
  if (id.includes("lpn") || id.includes("nclex-pn") || id.includes("rex-pn") || id.includes("-pn")) return "rpn";
  if (id.includes("nclex-rn") || id.includes("-rn")) return "rn";
  return "general";
}

function withPathwayQuery(base: string, pathwayId: string | null): string {
  if (!pathwayId) return base;
  const sep = base.includes("?") ? "&" : "?";
  return `${base}${sep}pathwayId=${encodeURIComponent(pathwayId)}`;
}

/** Pathway-aware onboarding steps after email verification. */
export function resolveAuthWhatsNextSteps(
  segment: AuthPathwaySegment,
  pathwayId: string | null,
): AuthWhatsNextStep[] {
  const pid = pathwayId;
  switch (segment) {
    case "rn":
      return [
        {
          title: "Start flashcards",
          detail: "Adaptive warm-up for your NCLEX track",
          href: withPathwayQuery("/app/flashcards", pid),
        },
        {
          title: "Begin readiness review",
          detail: "See accuracy bands and weak areas",
          href: withPathwayQuery("/app/account/analytics", pid),
        },
        {
          title: "Practice cardiac questions",
          detail: "High-yield stems with rationales",
          href: withPathwayQuery("/app/questions", pid),
        },
      ];
    case "rpn":
      return [
        {
          title: "Review fundamentals",
          detail: "Pathway lessons aligned to your exam",
          href: withPathwayQuery("/app/lessons", pid),
        },
        {
          title: "Begin adaptive practice",
          detail: "Mixed practice tuned to your level",
          href: withPathwayQuery("/app/practice-tests", pid),
        },
        {
          title: "Start flashcards",
          detail: "Quick recall for clinical essentials",
          href: withPathwayQuery("/app/flashcards", pid),
        },
      ];
    case "np":
      return [
        {
          title: "Clinical reasoning",
          detail: "Branching cases and judgment practice",
          href: withPathwayQuery("/app/questions", pid),
        },
        {
          title: "Differential diagnosis",
          detail: "Compare presentations with rationales",
          href: withPathwayQuery("/app/practice-tests", pid),
        },
        {
          title: "SOAP note review",
          detail: "Documentation and synthesis drills",
          href: withPathwayQuery("/app/lessons", pid),
        },
      ];
    default:
      return [
        {
          title: "Start adaptive study",
          detail: "Flashcards tuned to your pathway",
          href: withPathwayQuery("/app/flashcards", pid),
        },
        {
          title: "Open practice hub",
          detail: "Exams and question banks",
          href: withPathwayQuery("/app/practice-tests", pid),
        },
        {
          title: "Check readiness",
          detail: "Progress and weak-area signals",
          href: withPathwayQuery("/app/account/analytics", pid),
        },
      ];
  }
}

export function resolveEmailVerifiedPresentation(
  pathwayId?: string | null,
): AuthTransitionCopy & { whatsNextTitle: string; whatsNextEyebrow: string } {
  const pid = pathwayIdFromSearch(pathwayId);
  const segment = inferAuthPathwaySegment(pid);
  const examLabel =
    segment === "np"
      ? "advanced practice"
      : segment === "rpn"
        ? "practical nursing"
        : segment === "rn"
          ? "NCLEX-RN"
          : "nursing";

  return {
    eyebrow: "Ready for adaptive study",
    title: "You're ready to begin adaptive study.",
    message: `Your account is active. ${examLabel} readiness tracking and your pathway unlock as soon as you sign in.`,
    help: "We will pick up where you left off if you already started studying on this device.",
    whatsNextEyebrow: "What's next",
    whatsNextTitle:
      segment === "general"
        ? "Continue into your study workspace"
        : `Your ${segment === "rn" ? "RN" : segment === "rpn" ? "RPN" : "NP"} study path`,
  };
}

export function resolveSessionExpiredPresentation(studyHint: AuthContinuationHint | null): AuthTransitionCopy {
  return {
    eyebrow: "Session paused",
    title: "Your session paused while you were away.",
    message: "Your study progress is saved and ready to continue.",
    help: studyHint
      ? `${studyHint.headline}${studyHint.detail ? ` ${studyHint.detail}` : ""}`
      : "Sign in again and we will return you to the same study session when possible.",
  };
}

export function resolveOAuthContinuationPresentation(
  provider: OAuthProviderId | null,
  studyHint: AuthContinuationHint | null,
): AuthTransitionCopy & { providerLabel: string } {
  const label = provider === "apple" ? "Apple" : provider === "google" ? "Google" : "your provider";
  return {
    providerLabel: label,
    eyebrow: `Continuing with ${label}`,
    title: "Linking your NurseNest account",
    message: studyHint?.headline ?? "One moment — preparing your adaptive study workspace.",
    help: studyHint?.detail ?? "Adaptive profile and pathway preferences are syncing.",
  };
}

function pathnameFromCallback(callbackUrl: string | null): string | null {
  if (!callbackUrl?.trim()) return null;
  try {
    return new URL(callbackUrl.trim(), "http://localhost").pathname;
  } catch {
    return null;
  }
}

/** Short CTA + loading copy from safe learner callback (post sign-in redirect). */
export function resolveSignInSuccessPresentation(callbackUrl: string | null): AuthSignInSuccessPresentation {
  const pathname = pathnameFromCallback(callbackUrl);
  let ctaLabel = "Continue";
  let loadingHeadline = "Preparing your study workspace";
  let loadingDetail: string | null = "Loading your pathway and readiness insights";

  if (pathname?.startsWith("/app/flashcards")) {
    ctaLabel = "Continue";
    loadingHeadline = "Restoring your flashcard session";
    loadingDetail = "Your deck and progress are syncing";
  } else if (pathname?.includes("cat") || pathname?.startsWith("/app/cat")) {
    ctaLabel = "Resume";
    loadingHeadline = "Restoring your adaptive CAT session";
    loadingDetail = "Exam simulation settings are loading";
  } else if (
    pathname?.startsWith("/app/practice-tests") ||
    pathname?.startsWith("/app/practice-exams")
  ) {
    ctaLabel = "Resume";
    loadingHeadline = "Restoring your practice session";
    loadingDetail = "Your exam queue is ready to continue";
  } else if (pathname?.startsWith("/app/questions")) {
    ctaLabel = "Continue";
    loadingHeadline = "Restoring your question bank session";
    loadingDetail = "Your practice queue is loading";
  } else if (pathname?.startsWith("/app/lessons")) {
    ctaLabel = "Continue";
    loadingHeadline = "Opening your lesson workspace";
    loadingDetail = "Returning to your last study hub";
  } else if (pathname?.startsWith("/app/")) {
    ctaLabel = "Continue";
    loadingHeadline = "Preparing your study workspace";
    loadingDetail = "Restoring your adaptive session";
  } else {
    ctaLabel = "Start";
    loadingHeadline = "Preparing your study workspace";
    loadingDetail = null;
  }

  return {
    ctaLabel,
    loading: { headline: loadingHeadline, detail: loadingDetail },
  };
}

export function resolveAuthLoadingPresentation(
  kind: AuthTransitionKind,
  callbackUrl?: string | null,
): AuthLoadingPresentation {
  if (kind === "sign-in-success" || kind === "loading") {
    return resolveSignInSuccessPresentation(callbackUrl ?? null).loading;
  }
  switch (kind) {
    case "oauth-continuation":
      return {
        headline: "Restoring your adaptive session",
        detail: "Secure sign-in in progress",
      };
    case "email-verified":
      return {
        headline: "Preparing your study workspace",
        detail: "Adaptive readiness is almost ready",
      };
    case "session-expired":
      return {
        headline: "Restoring your study session",
        detail: "Sign in to continue where you left off",
      };
    case "password-reset-success":
      return {
        headline: "Updating your secure access",
        detail: "You can sign in with your new password",
      };
    case "sign-up-completion":
      return {
        headline: "Setting up your adaptive profile",
        detail: "Check your inbox to verify your email",
      };
    case "magic-link-confirmation":
      return {
        headline: "Confirming your sign-in link",
        detail: "This usually takes a moment",
      };
    case "account-recovery":
      return {
        headline: "Helping you restore access",
        detail: "Follow the steps in your inbox",
      };
    case "authentication-error":
      return {
        headline: "Let's try that again",
        detail: null,
      };
    default:
      return {
        headline: "Preparing your study workspace",
        detail: null,
      };
  }
}

export function resolveSignUpCompletionPresentation(): AuthTransitionCopy {
  return {
    eyebrow: "Almost there",
    title: "Your NurseNest account is on its way.",
    message: "Check your inbox to verify your email, then sign in to unlock adaptive study.",
    help: "Did not receive it? Check spam or request a new link after signing in.",
  };
}

export function resolvePasswordResetSuccessPresentation(): AuthTransitionCopy {
  return {
    eyebrow: "Password updated",
    title: "You're ready to sign in again.",
    message: "Your new password is active. Continue into your adaptive study workspace.",
    help: "We will return you to the same study session when possible.",
  };
}

export function resolveMagicLinkPresentation(
  variant: "sent" | "confirmed" | "invalid" | "expired",
): AuthTransitionCopy {
  switch (variant) {
    case "sent":
      return {
        eyebrow: "Check your inbox",
        title: "Your sign-in link is on the way.",
        message: "Open the email on this device to continue without a password.",
        help: "Links expire for security — request a new one from sign in if needed.",
      };
    case "confirmed":
      return {
        eyebrow: "Link confirmed",
        title: "Finishing sign-in for you.",
        message: "Preparing your study workspace — this usually takes a moment.",
        help: null,
      };
    case "expired":
      return {
        eyebrow: "Link expired",
        title: "This sign-in link has expired.",
        message: "Request a fresh link from the sign-in page when you are ready.",
        help: "Your study progress remains saved on your account.",
      };
    case "invalid":
    default:
      return {
        eyebrow: "Link not recognized",
        title: "We could not use this sign-in link.",
        message: "Try signing in with email and password, or request a new magic link.",
        help: null,
      };
  }
}

export function resolveAccountRecoveryPresentation(): AuthTransitionCopy {
  return {
    eyebrow: "Account recovery",
    title: "We'll help you get back to studying.",
    message: "If an account exists for that email, we sent recovery steps. Delivery can take a few minutes.",
    help: "Check spam or promotions. Contact support if you still cannot access your account.",
  };
}

export function resolveVerifyEmailBannerPresentation(
  status: "success" | "expired" | "invalid" | "rate_limited",
): AuthTransitionCopy {
  switch (status) {
    case "success":
      return {
        eyebrow: "Email verified",
        title: "You're ready to begin adaptive study.",
        message: "Sign in to open your pathway and readiness tools.",
        help: null,
      };
    case "expired":
      return resolveMagicLinkPresentation("expired");
    case "invalid":
      return resolveMagicLinkPresentation("invalid");
    case "rate_limited":
      return {
        eyebrow: "Please wait",
        title: "Too many attempts right now.",
        message: "Take a short pause, then try again.",
        help: "This protects your account while keeping study data safe.",
      };
  }
}

/** Maps Auth.js error codes to calm copy; re-exports flow governance. */
export function resolveAuthenticationErrorPresentation(errorCode: string | null): AuthTransitionCopy | null {
  const raw = resolveAuthErrorPresentation(errorCode);
  if (!raw) return null;
  return {
    eyebrow: "Sign-in needs attention",
    title: raw.title,
    message: raw.message,
    help: raw.help,
  };
}

/** Preferred banner tone — recovery-first, not enterprise alert. */
export function authTransitionMessageTone(
  kind: AuthTransitionKind,
): "default" | "info" | "success" | "warning" | "danger" {
  if (kind === "authentication-error") return "info";
  if (kind === "session-expired") return "info";
  if (kind === "email-verified" || kind === "password-reset-success" || kind === "sign-up-completion") {
    return "success";
  }
  return "info";
}

export function resolveAuthTransitionFromCallback(
  kind: AuthTransitionKind,
  callbackUrl: string | null,
): {
  pathwayId: string | null;
  segment: AuthPathwaySegment;
  studyHint: AuthContinuationHint | null;
  whatsNext: AuthWhatsNextStep[];
} {
  const pathwayId = pathwayIdFromCallback(callbackUrl);
  const segment = inferAuthPathwaySegment(pathwayId);
  const studyHint = resolveAuthContinuationHint(callbackUrl);
  const whatsNext = resolveAuthWhatsNextSteps(segment, pathwayId);
  return { pathwayId, segment, studyHint, whatsNext };
}

/** NP premium pathway check for optional copy emphasis (no new entitlements). */
export function isNpPathwayForAuthCopy(pathwayId: string | null, pathwayDef?: ExamPathwayDefinition | null): boolean {
  if (pathwayDef && isNpPremiumConvergencePathway(pathwayDef)) return true;
  return inferAuthPathwaySegment(pathwayId) === "np";
}
