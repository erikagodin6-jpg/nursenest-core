"use client";

import { useMemo } from "react";
import { useSearchParams } from "next/navigation";
import {
  AUTH_OAUTH_CONTINUING_PARAM,
  AUTH_SESSION_EXPIRED_PARAM,
  isOAuthContinuationSearchParams,
  isSessionExpiredSearchParams,
  oauthProviderFromSearchParams,
  resolveAuthErrorPresentation,
} from "@/lib/auth/auth-flow-governance";
import { resolveAuthContinuationHint } from "@/lib/auth/auth-study-continuation-context";
import { resolveMarketingAuthRedirectTarget } from "@/lib/auth/post-login-resume-path";
import { usePathname } from "next/navigation";
import { useMarketingI18n } from "@/lib/marketing-i18n";

export function useAuthRouteSearchState() {
  const searchParams = useSearchParams();
  const pathname = usePathname() ?? "/login";
  const { locale } = useMarketingI18n();

  return useMemo(() => {
    const redirectTarget = resolveMarketingAuthRedirectTarget(pathname, searchParams, locale);
    const studyHint = resolveAuthContinuationHint(redirectTarget);
    const oauthContinuing = isOAuthContinuationSearchParams(searchParams);
    const sessionExpired = isSessionExpiredSearchParams(searchParams);
    const provider = oauthProviderFromSearchParams(searchParams);
    const oauthError = resolveAuthErrorPresentation(searchParams.get("error"));

    return {
      redirectTarget,
      studyHint,
      oauthContinuing,
      sessionExpired,
      provider,
      oauthError,
      searchParams,
      pathname,
      oauthContinuingParam: AUTH_OAUTH_CONTINUING_PARAM,
      sessionExpiredParam: AUTH_SESSION_EXPIRED_PARAM,
    };
  }, [searchParams, pathname, locale]);
}
