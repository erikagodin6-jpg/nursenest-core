"use client";

import type { AuthTransitionKind } from "@/lib/auth/auth-transition-governance";
import { resolveAuthLoadingPresentation } from "@/lib/auth/auth-transition-governance";

export type AuthTransitionLoadingProps = {
  kind: AuthTransitionKind;
  callbackUrl?: string | null;
  className?: string;
};

/**
 * Premium auth loading strip — blossom pulse, no blank spinner screens.
 */
export function AuthTransitionLoading({ kind, callbackUrl, className = "" }: AuthTransitionLoadingProps) {
  const { headline, detail } = resolveAuthLoadingPresentation(kind, callbackUrl);

  return (
    <div
      className={`nn-auth-transition-loading mb-4 ${className}`.trim()}
      data-nn-auth-transition-loading
      data-nn-auth-transition-kind={kind}
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <div className="nn-auth-transition-loading__mark" aria-hidden>
        <span className="nn-auth-continuation-card__leaf nn-auth-transition-loading__leaf" />
        <span className="nn-auth-continuation-card__progress" />
      </div>
      <div className="nn-auth-transition-loading__copy">
        <p className="nn-auth-transition-loading__headline">{headline}</p>
        {detail ? <p className="nn-auth-transition-loading__detail">{detail}</p> : null}
      </div>
    </div>
  );
}
