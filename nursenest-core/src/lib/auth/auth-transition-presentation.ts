/**
 * Composed auth transition presentations — localization via {@link AuthTransitionTranslate}.
 * Path/callback safety stays in auth-flow-governance; study hints in auth-study-continuation-context.
 */

import { resolveAuthErrorPresentation } from "@/lib/auth/auth-flow-governance";
import { resolveAuthContinuationHint } from "@/lib/auth/auth-study-continuation-context";
import { AUTH_TRANSITION_I18N as K } from "@/lib/auth/auth-transition-i18n-keys";
import {
  inferAuthPathwaySegment,
  authTransitionMessageTone,
  type AuthPathwaySegment,
} from "@/lib/auth/auth-transition-governance-core";
import type {
  AuthLearnerIntent,
  AuthMagicLinkVariant,
  AuthTransitionAction,
  AuthTransitionKind,
  AuthTransitionMotionPreset,
  AuthTransitionPresentation,
  AuthTransitionPresentationInput,
  AuthTransitionTranslate,
  AuthTransitionWatermarkStyle,
  AuthWhatsNextStep,
} from "@/lib/auth/auth-transition-types";

export type { AuthTransitionPresentation, AuthTransitionPresentationInput, AuthTransitionTranslate };

function pathwayIdFromCallback(callbackUrl: string | null | undefined): string | null {
  if (!callbackUrl?.trim()) return null;
  try {
    return new URL(callbackUrl.trim(), "http://localhost").searchParams.get("pathwayId")?.trim() || null;
  } catch {
    return null;
  }
}

function withPathwayQuery(base: string, pathwayId: string | null): string {
  if (!pathwayId) return base;
  const sep = base.includes("?") ? "&" : "?";
  return `${base}${sep}pathwayId=${encodeURIComponent(pathwayId)}`;
}

export function inferLearnerIntentFromCallback(callbackUrl: string | null | undefined): AuthLearnerIntent {
  if (!callbackUrl?.trim()) return "general";
  try {
    const pathname = new URL(callbackUrl.trim(), "http://localhost").pathname;
    if (pathname.startsWith("/app/flashcards")) return "flashcards";
    if (pathname.includes("cat") || pathname.startsWith("/app/cat")) return "cat";
    if (pathname.startsWith("/app/practice-tests") || pathname.startsWith("/app/practice-exams")) return "practice";
    if (pathname.startsWith("/app/questions")) return "questions";
    if (pathname.startsWith("/app/lessons")) return "lessons";
    if (pathname.startsWith("/app/")) return "learner-app";
    return "marketing";
  } catch {
    return "general";
  }
}

export function signupTierToPathwaySegment(tier: AuthTransitionPresentationInput["signupTier"]): AuthPathwaySegment {
  if (tier === "RN") return "rn";
  if (tier === "PN") return "rpn";
  if (tier === "NP") return "np";
  return "general";
}

export function resolveAuthWhatsNextSteps(
  segment: AuthPathwaySegment,
  pathwayId: string | null,
  t: AuthTransitionTranslate,
): AuthWhatsNextStep[] {
  const pid = pathwayId;
  switch (segment) {
    case "rn":
      return [
        {
          title: t(K.whatsNext.rn1Title),
          detail: t(K.whatsNext.rn1Detail),
          href: withPathwayQuery("/app/flashcards", pid),
        },
        {
          title: t(K.whatsNext.rn2Title),
          detail: t(K.whatsNext.rn2Detail),
          href: withPathwayQuery("/app/account/analytics", pid),
        },
        {
          title: t(K.whatsNext.rn3Title),
          detail: t(K.whatsNext.rn3Detail),
          href: withPathwayQuery("/app/questions", pid),
        },
      ];
    case "rpn":
      return [
        {
          title: t(K.whatsNext.rpn1Title),
          detail: t(K.whatsNext.rpn1Detail),
          href: withPathwayQuery("/app/lessons", pid),
        },
        {
          title: t(K.whatsNext.rpn2Title),
          detail: t(K.whatsNext.rpn2Detail),
          href: withPathwayQuery("/app/practice-tests", pid),
        },
        {
          title: t(K.whatsNext.rpn3Title),
          detail: t(K.whatsNext.rpn3Detail),
          href: withPathwayQuery("/app/flashcards", pid),
        },
      ];
    case "np":
      return [
        {
          title: t(K.whatsNext.np1Title),
          detail: t(K.whatsNext.np1Detail),
          href: withPathwayQuery("/app/questions", pid),
        },
        {
          title: t(K.whatsNext.np2Title),
          detail: t(K.whatsNext.np2Detail),
          href: withPathwayQuery("/app/practice-tests", pid),
        },
        {
          title: t(K.whatsNext.np3Title),
          detail: t(K.whatsNext.np3Detail),
          href: withPathwayQuery("/app/lessons", pid),
        },
      ];
    default:
      return [
        {
          title: t(K.whatsNext.general1Title),
          detail: t(K.whatsNext.general1Detail),
          href: withPathwayQuery("/app/flashcards", pid),
        },
        {
          title: t(K.whatsNext.general2Title),
          detail: t(K.whatsNext.general2Detail),
          href: withPathwayQuery("/app/practice-tests", pid),
        },
        {
          title: t(K.whatsNext.general3Title),
          detail: t(K.whatsNext.general3Detail),
          href: withPathwayQuery("/app/account/analytics", pid),
        },
      ];
  }
}

function oauthProviderLabel(
  provider: AuthTransitionPresentationInput["oauthProvider"],
  t: AuthTransitionTranslate,
): string {
  if (provider === "apple") return t(K.oauth.providerApple);
  if (provider === "google") return t(K.oauth.providerGoogle);
  return t(K.oauth.providerUnknown);
}

function emailVerifiedMessage(segment: AuthPathwaySegment, t: AuthTransitionTranslate): string {
  switch (segment) {
    case "rn":
      return t(K.emailVerified.messageRn);
    case "rpn":
      return t(K.emailVerified.messageRpn);
    case "np":
      return t(K.emailVerified.messageNp);
    default:
      return t(K.emailVerified.messageGeneral);
  }
}

function emailVerifiedWhatsNextTitle(segment: AuthPathwaySegment, t: AuthTransitionTranslate): string {
  switch (segment) {
    case "rn":
      return t(K.emailVerified.whatsNextTitleRn);
    case "rpn":
      return t(K.emailVerified.whatsNextTitleRpn);
    case "np":
      return t(K.emailVerified.whatsNextTitleNp);
    default:
      return t(K.emailVerified.whatsNextTitleGeneral);
  }
}

function signInLoadingCopy(
  intent: AuthLearnerIntent,
  segment: AuthPathwaySegment,
  t: AuthTransitionTranslate,
): { headline: string; detail: string | null; ctaLabel: string } {
  switch (intent) {
    case "flashcards":
      return {
        headline: t(K.signIn.loadingFlashcardsHeadline),
        detail: t(K.signIn.loadingFlashcardsDetail),
        ctaLabel: t(K.common.ctaContinue),
      };
    case "cat":
      return {
        headline: t(K.signIn.loadingCatHeadline),
        detail: t(K.signIn.loadingCatDetail),
        ctaLabel: t(K.common.ctaResume),
      };
    case "practice":
      return {
        headline: t(K.signIn.loadingPracticeHeadline),
        detail: t(K.signIn.loadingPracticeDetail),
        ctaLabel: t(K.common.ctaResume),
      };
    case "questions":
      return {
        headline: t(K.signIn.loadingQuestionsHeadline),
        detail: t(K.signIn.loadingQuestionsDetail),
        ctaLabel: t(K.common.ctaContinue),
      };
    case "lessons":
      return {
        headline: t(K.signIn.loadingLessonsHeadline),
        detail: t(K.signIn.loadingLessonsDetail),
        ctaLabel: t(K.common.ctaContinue),
      };
    case "learner-app":
      return {
        headline: t(K.signIn.loadingAppHeadline),
        detail: t(K.signIn.loadingAppDetail),
        ctaLabel: t(K.common.ctaContinue),
      };
    default:
      return {
        headline: t(K.signIn.loadingDefaultHeadline),
        detail:
          segment === "rn"
            ? t(K.signIn.continuationRnCat)
            : segment === "np"
              ? t(K.signIn.continuationNpDifferential)
              : t(K.signIn.loadingDefaultDetail),
        ctaLabel: t(K.common.ctaStart),
      };
  }
}

function signUpLoadingCopy(
  segment: AuthPathwaySegment,
  t: AuthTransitionTranslate,
  restoring: boolean,
): { headline: string; detail: string | null } {
  const headline =
    segment === "rn"
      ? t(K.signUp.loadingHeadlineRn)
      : segment === "rpn"
        ? t(K.signUp.loadingHeadlineRpn)
        : segment === "np"
          ? t(K.signUp.loadingHeadlineNp)
          : t(K.signUp.loadingHeadlineGeneral);
  return {
    headline,
    detail: restoring ? t(K.signUp.loadingRestore) : t(K.signUp.loadingDetail),
  };
}

function watermarkStyleForKind(kind: AuthTransitionKind, layout: AuthTransitionPresentationInput["layout"]): AuthTransitionWatermarkStyle {
  if (layout === "full-page" || kind === "email-verified") {
    return { hero: "panel-hero", ambient: "page-ambient", cardCorner: false };
  }
  if (kind === "oauth-continuation" || kind === "loading" || kind === "sign-in-success" || kind === "sign-up-completion") {
    return { hero: "none", ambient: "none", cardCorner: false };
  }
  return { hero: "none", ambient: "none", cardCorner: true };
}

function motionPresetForKind(kind: AuthTransitionKind): AuthTransitionMotionPreset {
  switch (kind) {
    case "email-verified":
    case "password-reset-success":
      return "celebration";
    case "oauth-continuation":
    case "loading":
    case "sign-in-success":
    case "sign-up-completion":
      return "loading-strip";
    case "session-expired":
    case "authentication-error":
    case "magic-link-confirmation":
      return "calm-recovery";
    default:
      return "fade-in";
  }
}

function magicLinkCopy(variant: AuthMagicLinkVariant, t: AuthTransitionTranslate) {
  switch (variant) {
    case "sent":
      return {
        eyebrow: t(K.magicLink.sentEyebrow),
        title: t(K.magicLink.sentTitle),
        body: t(K.magicLink.sentMessage),
        help: t(K.magicLink.sentHelp),
      };
    case "confirmed":
      return {
        eyebrow: t(K.magicLink.confirmedEyebrow),
        title: t(K.magicLink.confirmedTitle),
        body: t(K.magicLink.confirmedMessage),
        help: null,
      };
    case "expired":
      return {
        eyebrow: t(K.magicLink.expiredEyebrow),
        title: t(K.magicLink.expiredTitle),
        body: t(K.magicLink.expiredMessage),
        help: t(K.magicLink.expiredHelp),
      };
    case "invalid":
    default:
      return {
        eyebrow: t(K.magicLink.invalidEyebrow),
        title: t(K.magicLink.invalidTitle),
        body: t(K.magicLink.invalidMessage),
        help: null,
      };
  }
}

/**
 * Single composition entry — all auth transition copy, actions, motion, and a11y announcements.
 */
export function resolveAuthTransitionPresentation(
  input: AuthTransitionPresentationInput,
  t: AuthTransitionTranslate,
): AuthTransitionPresentation {
  const kind = input.kind;
  const callbackUrl = input.callbackUrl ?? null;
  const pathwayId = input.pathwayId ?? pathwayIdFromCallback(callbackUrl);
  const segment =
    input.pathway ?? (input.signupTier ? signupTierToPathwaySegment(input.signupTier) : inferAuthPathwaySegment(pathwayId));
  const intent = input.learnerIntent ?? inferLearnerIntentFromCallback(callbackUrl);
  const studyHint = input.studyHint ?? resolveAuthContinuationHint(callbackUrl);
  const layout = input.layout ?? (kind === "email-verified" ? "full-page" : "inline");
  const nextSteps = resolveAuthWhatsNextSteps(segment, pathwayId, t);
  const tone = authTransitionMessageTone(kind);

  let eyebrow = "";
  let title = "";
  let body = "";
  let help: string | null = null;
  let loadingCopy = { headline: t(K.signIn.loadingDefaultHeadline), detail: null as string | null };
  let primaryAction: AuthTransitionAction | null = null;
  let secondaryAction: AuthTransitionAction | null = null;
  let oauthProviderLabelResolved: string | null = null;

  switch (kind) {
    case "email-verified": {
      eyebrow = t(K.emailVerified.eyebrow);
      title = t(K.emailVerified.title);
      body = emailVerifiedMessage(segment, t);
      help = t(K.emailVerified.help);
      loadingCopy = {
        headline: t(K.loading.emailVerifiedHeadline),
        detail: t(K.loading.emailVerifiedDetail),
      };
      const primaryHref = input.primaryActionHref ?? withPathwayQuery("/app/start-studying", pathwayId);
      const first = nextSteps[0];
      primaryAction = {
        label: first ? `${t(K.common.signInPrefix)} · ${first.title}` : t(K.common.signInContinue),
        href: primaryHref,
        kind: "primary",
      };
      secondaryAction = input.secondaryActionHref
        ? { label: t(K.common.exploreLessons), href: input.secondaryActionHref, kind: "secondary" }
        : null;
      if (input.verifyStatus === "success" && layout === "inline") {
        title = t(K.emailVerified.verifyBannerTitle);
        body = t(K.emailVerified.verifyBannerMessage);
      }
      break;
    }
    case "session-expired": {
      eyebrow = t(K.sessionExpired.eyebrow);
      title = t(K.sessionExpired.title);
      body = t(K.sessionExpired.message);
      help = studyHint
        ? `${studyHint.headline}${studyHint.detail ? ` ${studyHint.detail}` : ""}`
        : t(K.sessionExpired.helpDefault);
      loadingCopy = {
        headline: t(K.loading.sessionHeadline),
        detail: t(K.loading.sessionDetail),
      };
      break;
    }
    case "oauth-continuation": {
      const providerLabel = oauthProviderLabel(input.oauthProvider ?? null, t);
      oauthProviderLabelResolved = providerLabel;
      eyebrow = t(K.oauth.eyebrow, { provider: providerLabel });
      title = t(K.oauth.title);
      body = studyHint?.headline ?? t(K.oauth.messageDefault);
      help = studyHint?.detail ?? t(K.oauth.helpDefault);
      loadingCopy = {
        headline: t(K.loading.oauthHeadline),
        detail: t(K.loading.oauthDetail),
      };
      break;
    }
    case "sign-in-success":
    case "loading": {
      const signIn = signInLoadingCopy(intent, segment, t);
      loadingCopy = { headline: signIn.headline, detail: signIn.detail };
      eyebrow = t(K.emailVerified.eyebrow);
      title = studyHint?.headline ?? signIn.headline;
      body = studyHint?.detail ?? signIn.detail ?? "";
      help =
        intent === "flashcards" && segment === "rn"
          ? t(K.signIn.continuationRnFlashcards)
          : intent === "cat" && segment === "rn"
            ? t(K.signIn.continuationRnCat)
            : intent === "practice" && segment === "np"
              ? t(K.signIn.continuationNpDifferential)
              : input.callbackUrl
                ? t(K.common.alreadySignedInHelp, { cta: signIn.ctaLabel })
                : null;
      break;
    }
    case "sign-up-completion": {
      eyebrow = t(K.signUp.eyebrow);
      title = t(K.signUp.title);
      body = t(K.signUp.message);
      help = t(K.signUp.help);
      loadingCopy = signUpLoadingCopy(segment, t, Boolean(callbackUrl));
      break;
    }
    case "password-reset-success": {
      eyebrow = t(K.passwordReset.eyebrow);
      title = t(K.passwordReset.title);
      body = t(K.passwordReset.message);
      help = t(K.passwordReset.help);
      loadingCopy = {
        headline: t(K.passwordReset.loadingHeadline),
        detail: t(K.passwordReset.loadingDetail),
      };
      primaryAction = input.primaryActionHref
        ? { label: t(K.common.signInContinue), href: input.primaryActionHref, kind: "primary" }
        : null;
      break;
    }
    case "magic-link-confirmation": {
      const ml = magicLinkCopy(input.magicLinkVariant ?? "sent", t);
      eyebrow = ml.eyebrow;
      title = ml.title;
      body = ml.body;
      help = ml.help;
      loadingCopy = {
        headline: t(K.magicLink.loadingHeadline),
        detail: t(K.magicLink.loadingDetail),
      };
      break;
    }
    case "account-recovery": {
      eyebrow = t(K.accountRecovery.eyebrow);
      title = t(K.accountRecovery.title);
      body = t(K.accountRecovery.message);
      help = t(K.accountRecovery.help);
      loadingCopy = {
        headline: t(K.accountRecovery.loadingHeadline),
        detail: t(K.accountRecovery.loadingDetail),
      };
      primaryAction = input.primaryActionHref
        ? { label: t(K.common.signInContinue), href: input.primaryActionHref, kind: "primary" }
        : null;
      break;
    }
    case "authentication-error": {
      eyebrow = t(K.authError.eyebrow);
      loadingCopy = { headline: t(K.authError.loadingHeadline), detail: null };
      if (input.verifyStatus === "rate_limited") {
        title = t(K.authError.rateLimitedTitle);
        body = t(K.authError.rateLimitedMessage);
        help = t(K.authError.rateLimitedHelp);
        break;
      }
      const raw = resolveAuthErrorPresentation(input.error ?? null);
      if (raw) {
        title = raw.title;
        body = raw.message;
        help = raw.help;
      } else {
        title = t(K.authError.loadingHeadline);
        body = "";
      }
      break;
    }
    default:
      break;
  }

  if (input.primaryActionHref && !primaryAction) {
    primaryAction = {
      label: t(K.common.ctaContinue),
      href: input.primaryActionHref,
      kind: "primary",
    };
  }
  if (input.secondaryActionHref && !secondaryAction) {
    secondaryAction = {
      label: t(K.common.exploreLessons),
      href: input.secondaryActionHref,
      kind: "secondary",
    };
  }

  const whatsNextEyebrow = kind === "email-verified" ? t(K.common.whatsNextEyebrow) : null;
  const whatsNextTitle = kind === "email-verified" ? emailVerifiedWhatsNextTitle(segment, t) : null;

  const accessibilityAnnouncement = [eyebrow, title, body, help].filter(Boolean).join(". ");

  return {
    kind,
    eyebrow,
    title,
    whatsNextEyebrow,
    whatsNextTitle,
    body,
    tone,
    loadingCopy,
    primaryAction,
    secondaryAction,
    nextSteps,
    watermarkStyle: watermarkStyleForKind(kind, layout),
    motionPreset: motionPresetForKind(kind),
    accessibilityAnnouncement,
    help,
    oauthProviderLabel: oauthProviderLabelResolved,
  };
}
