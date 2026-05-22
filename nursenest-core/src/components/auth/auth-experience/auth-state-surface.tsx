"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { AuthTransitionShell } from "@/components/auth/auth-experience/auth-transition-shell";
import { useAuthRouteSearchState } from "@/components/auth/auth-experience/use-auth-route-search-state";
import { trackProductEvent } from "@/lib/observability/product-analytics";
import { PH } from "@/lib/observability/posthog-conversion-events";

export function AuthOAuthContinuationBanner() {
  const { studyHint, oauthContinuing, provider, searchParams, pathname, oauthContinuingParam, redirectTarget } =
    useAuthRouteSearchState();
  const trackedRef = useRef(false);
  const router = useRouter();

  useEffect(() => {
    if (!oauthContinuing || trackedRef.current) return;
    trackedRef.current = true;
    trackProductEvent(PH.authOAuthContinuationViewed, {
      actor: "anonymous",
      provider: provider ?? "unknown",
    });
    const sp = new URLSearchParams(searchParams.toString());
    sp.delete(oauthContinuingParam);
    sp.delete("provider");
    const qs = sp.toString();
    router.replace(`${pathname}${qs ? `?${qs}` : ""}`);
  }, [oauthContinuing, pathname, provider, router, searchParams, oauthContinuingParam]);

  if (!oauthContinuing) return null;

  return (
    <AuthTransitionShell
      kind="oauth-continuation"
      layout="inline"
      oauthProvider={provider}
      studyHint={studyHint}
      callbackUrl={redirectTarget}
    />
  );
}

export function AuthSessionExpiredBanner() {
  const { studyHint, sessionExpired, searchParams, pathname, sessionExpiredParam, redirectTarget } =
    useAuthRouteSearchState();
  const trackedRef = useRef(false);
  const router = useRouter();

  useEffect(() => {
    if (!sessionExpired || trackedRef.current) return;
    trackedRef.current = true;
    trackProductEvent(PH.authSessionExpiredRecoveryViewed, { actor: "anonymous" });
    const sp = new URLSearchParams(searchParams.toString());
    sp.delete(sessionExpiredParam);
    const qs = sp.toString();
    router.replace(`${pathname}${qs ? `?${qs}` : ""}`);
  }, [sessionExpired, pathname, router, searchParams, sessionExpiredParam]);

  if (!sessionExpired) return null;

  return (
    <AuthTransitionShell
      kind="session-expired"
      layout="inline"
      studyHint={studyHint}
      callbackUrl={redirectTarget}
    />
  );
}

export function AuthOAuthErrorBanner() {
  const { oauthError, searchParams, pathname } = useAuthRouteSearchState();
  const errorTrackedRef = useRef(false);
  const router = useRouter();
  const errorCode = searchParams.get("error");

  useEffect(() => {
    if (!oauthError || !errorCode || errorTrackedRef.current) return;
    errorTrackedRef.current = true;
    trackProductEvent(PH.authOAuthSigninFailed, {
      actor: "anonymous",
      error_code: errorCode,
    });
    const sp = new URLSearchParams(searchParams.toString());
    sp.delete("error");
    const qs = sp.toString();
    router.replace(`${pathname}${qs ? `?${qs}` : ""}`);
  }, [oauthError, pathname, router, searchParams, errorCode]);

  if (!oauthError) return null;

  return (
    <AuthTransitionShell
      kind="authentication-error"
      layout="inline"
      error={errorCode}
    />
  );
}

export function AuthStateSurface() {
  return (
    <>
      <AuthOAuthContinuationBanner />
      <AuthSessionExpiredBanner />
      <AuthOAuthErrorBanner />
    </>
  );
}
