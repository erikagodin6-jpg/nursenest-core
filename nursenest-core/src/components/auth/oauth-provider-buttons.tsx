"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { AUTH_CALLBACK_PARAM, type OAuthProviderId } from "@/lib/auth/auth-flow-governance";
import { trackProductEvent } from "@/lib/observability/product-analytics";
import { PH } from "@/lib/observability/posthog-conversion-events";

type OAuthProviderButtonsProps = {
  redirectTarget: string;
  disabled?: boolean;
  /** signup surfaces track pathway selection separately */
  surface: "login" | "signup";
  marketingLocale?: string;
  /** Resolved on the server from Auth.js env — never read secrets on the client. */
  providers: OAuthProviderId[];
  /** Figma sign-in: divider below primary CTA */
  dividerPlacement?: "leading" | "trailing";
  dividerLabel?: string;
};

function GoogleMark() {
  return (
    <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden focusable="false">
      <path
        fill="#FFC107"
        d="M43.611 20.083H42V20H24v8h11.303C33.654 32.657 29.122 36 24 36c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C33.64 6.053 28.991 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"
      />
      <path
        fill="#FF3D00"
        d="M6.306 14.691l6.571 4.819C14.655 16.108 18.961 13 24 13c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C33.64 6.053 28.991 4 24 4 16.318 4 9.656 8.337 6.306 14.691z"
      />
      <path
        fill="#4CAF50"
        d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238C29.211 35.091 26.715 36 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z"
      />
      <path
        fill="#1976D2"
        d="M43.611 20.083H42V20H24v8h11.303c1.149-3.413 1.149-7.019 0-10.303H24v8h19.611z"
      />
    </svg>
  );
}

function AppleMark() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" aria-hidden focusable="false" className="text-current">
      <path
        fill="currentColor"
        d="M17.05 12.86c-.03-2.88 2.36-4.27 2.47-4.34-1.34-1.96-3.43-2.23-4.17-2.26-1.78-.18-3.47 1.05-4.37 1.05-.91 0-2.31-1.02-3.8-.99-1.95.03-3.74 1.13-4.74 2.87-2.02 3.5-.52 8.69 1.45 11.53 1 1.43 2.18 3.04 3.74 2.98 1.5-.06 2.07-.97 3.88-.97 1.81 0 2.32.97 3.9.94 1.61-.03 2.63-1.46 3.61-2.89 1.14-1.67 1.61-3.28 1.64-3.36-.04-.02-3.15-1.21-3.18-4.8zM14.68 4.24c.83-1 1.39-2.39 1.24-3.78-1.2.05-2.65.8-3.51 1.79-.77.89-1.44 2.31-1.26 3.68 1.33.1 2.69-.68 3.53-1.69z"
      />
    </svg>
  );
}

export function OAuthProviderButtons({
  redirectTarget,
  disabled = false,
  surface,
  marketingLocale,
  providers,
  dividerPlacement = "leading",
  dividerLabel = "or continue with",
}: OAuthProviderButtonsProps) {
  const [pendingProvider, setPendingProvider] = useState<OAuthProviderId | null>(null);

  if (providers.length === 0) return null;

  async function startOAuth(provider: "google" | "apple") {
    if (disabled || pendingProvider) return;
    setPendingProvider(provider);
    trackProductEvent(PH.authOAuthProviderSelected, {
      actor: "anonymous",
      provider,
      surface,
      marketing_locale: marketingLocale ?? "en",
    });

    const callbackUrl = redirectTarget.startsWith("/")
      ? redirectTarget
      : `/${redirectTarget.replace(/^\//, "")}`;

    try {
      await signIn(provider, {
        callbackUrl,
        redirect: true,
      });
    } catch {
      setPendingProvider(null);
      trackProductEvent(PH.authOAuthSigninFailed, {
        actor: "anonymous",
        provider,
        surface,
      });
    }
  }

  const showGoogle = providers.includes("google");
  const showApple = providers.includes("apple");

  const divider =
    dividerPlacement === "leading" ? (
      <div className="nn-premium-auth-oauth-divider" role="presentation">
        <span>{dividerLabel}</span>
      </div>
    ) : null;

  const trailingDivider =
    dividerPlacement === "trailing" ? (
      <div className="nn-premium-auth-oauth-divider nn-premium-auth-oauth-divider--trailing" role="presentation">
        <span>{dividerLabel}</span>
      </div>
    ) : null;

  return (
    <div className="nn-premium-auth-oauth" data-nn-premium-auth-oauth={surface}>
      {divider}
      <div className="nn-premium-auth-oauth-stack">
        {showGoogle ? (
          <button
            type="button"
            className="nn-premium-auth-oauth-button nn-premium-auth-oauth-button--google"
            disabled={disabled || pendingProvider !== null}
            aria-busy={pendingProvider === "google"}
            onClick={() => void startOAuth("google")}
          >
            <span className="nn-premium-auth-oauth-icon" aria-hidden>
              <GoogleMark />
            </span>
            <span>{pendingProvider === "google" ? "Connecting…" : "Continue with Google"}</span>
          </button>
        ) : null}
        {showApple ? (
          <button
            type="button"
            className="nn-premium-auth-oauth-button nn-premium-auth-oauth-button--apple"
            disabled={disabled || pendingProvider !== null}
            aria-busy={pendingProvider === "apple"}
            onClick={() => void startOAuth("apple")}
          >
            <span className="nn-premium-auth-oauth-icon" aria-hidden>
              <AppleMark />
            </span>
            <span>{pendingProvider === "apple" ? "Connecting…" : "Continue with Apple"}</span>
          </button>
        ) : null}
      </div>
      {trailingDivider}
      <p className="nn-premium-auth-oauth-hint">
        We only use your email and name to personalize your study experience. NurseNest never posts on
        your behalf.
      </p>
      <input type="hidden" name={AUTH_CALLBACK_PARAM} value={redirectTarget} readOnly />
    </div>
  );
}
