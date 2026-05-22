"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { AuthContinuationCard } from "@/components/auth/auth-experience/auth-continuation-card";
import { AuthMessageBanner } from "@/components/auth/auth-experience/auth-message-banner";
import { useAuthRouteSearchState } from "@/components/auth/auth-experience/use-auth-route-search-state";
import {
  authTransitionMessageTone,
  resolveAuthenticationErrorPresentation,
  resolveOAuthContinuationPresentation,
  resolveSessionExpiredPresentation,
} from "@/lib/auth/auth-transition-governance";
import { trackProductEvent } from "@/lib/observability/product-analytics";
import { PH } from "@/lib/observability/posthog-conversion-events";

export function AuthOAuthContinuationBanner() {
  const { studyHint, oauthContinuing, provider, searchParams, pathname, oauthContinuingParam } =
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

  const oauthCopy = resolveOAuthContinuationPresentation(provider, studyHint);
  return (
    <AuthContinuationCard
      providerLabel={oauthCopy.providerLabel}
      studyHint={studyHint}
      eyebrow={oauthCopy.eyebrow}
      title={oauthCopy.title}
      fallbackDetail={oauthCopy.help}
    />
  );
}

export function AuthSessionExpiredBanner() {
  const { studyHint, sessionExpired, searchParams, pathname, sessionExpiredParam } = useAuthRouteSearchState();
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

  const sessionCopy = resolveSessionExpiredPresentation(studyHint);

  return (
    <AuthMessageBanner
      tone={authTransitionMessageTone("session-expired")}
      stateId="session-expired"
      title={sessionCopy.title}
      message={sessionCopy.message}
      help={sessionCopy.help}
    />
  );
}

export function AuthOAuthErrorBanner() {
  const { oauthError, searchParams, pathname } = useAuthRouteSearchState();
  const errorTrackedRef = useRef(false);
  const router = useRouter();

  useEffect(() => {
    const code = searchParams.get("error");
    if (!oauthError || !code || errorTrackedRef.current) return;
    errorTrackedRef.current = true;
    trackProductEvent(PH.authOAuthSigninFailed, {
      actor: "anonymous",
      error_code: code,
    });
    const sp = new URLSearchParams(searchParams.toString());
    sp.delete("error");
    const qs = sp.toString();
    router.replace(`${pathname}${qs ? `?${qs}` : ""}`);
  }, [oauthError, pathname, router, searchParams]);

  if (!oauthError) return null;

  const errorCode = searchParams.get("error");
  const transitionError = resolveAuthenticationErrorPresentation(errorCode) ?? {
    eyebrow: "",
    title: oauthError.title,
    message: oauthError.message,
    help: oauthError.help,
  };

  return (
    <AuthMessageBanner
      tone={authTransitionMessageTone("authentication-error")}
      stateId="oauth-error"
      title={transitionError.title}
      message={transitionError.message}
      help={transitionError.help}
    />
  );
}

/** Single mount for login — avoids triple Suspense boundaries. */
export function AuthStateSurface() {
  return (
    <>
      <AuthOAuthContinuationBanner />
      <AuthSessionExpiredBanner />
      <AuthOAuthErrorBanner />
    </>
  );
}
