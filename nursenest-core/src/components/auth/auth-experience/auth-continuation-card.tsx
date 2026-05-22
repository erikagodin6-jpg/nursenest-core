"use client";

import type { AuthContinuationHint } from "@/lib/auth/auth-study-continuation-context";

export type AuthContinuationCardProps = {
  providerLabel: string;
  studyHint?: AuthContinuationHint | null;
  /** OAuth full-page redirect in progress */
  loading?: boolean;
  eyebrow?: string;
  title?: string;
  fallbackDetail?: string | null;
};

/**
 * OAuth continuation + session recovery context (Figma auth/oauth-continue, 88:24).
 */
export function AuthContinuationCard({
  providerLabel,
  studyHint,
  loading = true,
  eyebrow,
  title,
  fallbackDetail,
}: AuthContinuationCardProps) {
  const eyebrowLine = eyebrow ?? `Continuing with ${providerLabel}`;
  const titleLine = title ?? "Linking your NurseNest account";

  return (
    <div
      className="nn-auth-continuation-card mb-4"
      data-nn-auth-continuation-card
      data-nn-premium-auth-oauth-continuation
      data-nn-auth-transition="oauth-continuation"
      role="status"
      aria-live="polite"
      aria-busy={loading}
    >
      <div className="nn-auth-continuation-card__mark" aria-hidden>
        <span className="nn-auth-continuation-card__leaf" />
        {loading ? <span className="nn-auth-continuation-card__progress" /> : null}
      </div>
      <div className="nn-auth-continuation-card__copy">
        <p className="nn-auth-continuation-card__eyebrow">{eyebrowLine}</p>
        <p className="nn-auth-continuation-card__title">{titleLine}</p>
        {studyHint ? (
          <>
            <p className="nn-auth-continuation-card__headline">{studyHint.headline}</p>
            {studyHint.detail ? <p className="nn-auth-continuation-card__detail">{studyHint.detail}</p> : null}
          </>
        ) : (
          <p className="nn-auth-continuation-card__detail">
            {fallbackDetail ?? "One moment — adaptive profile syncing"}
          </p>
        )}
      </div>
    </div>
  );
}
