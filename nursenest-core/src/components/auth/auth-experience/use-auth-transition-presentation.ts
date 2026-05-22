"use client";

import { useMemo } from "react";
import { useMarketingI18n } from "@/lib/marketing-i18n";
import {
  resolveAuthTransitionPresentation,
  type AuthTransitionPresentation,
  type AuthTransitionPresentationInput,
} from "@/lib/auth/auth-transition-presentation";

export function useAuthTransitionPresentation(
  input: AuthTransitionPresentationInput,
): AuthTransitionPresentation {
  const { t } = useMarketingI18n();
  return useMemo(
    () => resolveAuthTransitionPresentation(input, t),
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
      input.studyHint,
      input.signupTier,
      input.verifyStatus,
      input.primaryActionHref,
      input.secondaryActionHref,
      input.layout,
      t,
    ],
  );
}
