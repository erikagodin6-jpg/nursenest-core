"use client";

import { useMemo } from "react";
import { useMarketingI18n } from "@/lib/marketing-i18n";
import {
  resolveAuthTransitionPresentation,
  type AuthTransitionPresentation,
  type AuthTransitionPresentationInput,
} from "@/lib/auth/auth-transition-presentation";
import { createAuthTransitionTranslate } from "@/lib/auth/auth-transition-translate";

export function useAuthTransitionPresentation(
  input: AuthTransitionPresentationInput,
): AuthTransitionPresentation {
  const { t } = useMarketingI18n();
  const transitionT = useMemo(() => createAuthTransitionTranslate(t), [t]);
  const studyHintKey = input.studyHint
    ? `${input.studyHint.headline ?? ""}|${input.studyHint.detail ?? ""}`
    : null;
  return useMemo(
    () => resolveAuthTransitionPresentation(input, transitionT),
    [
      input.kind,
      input.pathway,
      input.pathwayId,
      input.callbackUrl,
      input.error,
      input.learnerIntent,
      input.onboardingState,
      input.magicLinkVariant,
      input.oauthProvider,
      studyHintKey,
      input.signupTier,
      input.verifyStatus,
      input.primaryActionHref,
      input.secondaryActionHref,
      input.layout,
      transitionT,
    ],
  );
}
