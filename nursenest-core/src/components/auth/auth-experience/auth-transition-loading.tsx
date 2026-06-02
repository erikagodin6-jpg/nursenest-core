"use client";

import { AuthTransitionShell } from "@/components/auth/auth-experience/auth-transition-shell";
import type { AuthTransitionKind } from "@/lib/auth/auth-transition-types";

export type AuthTransitionLoadingProps = {
  kind: AuthTransitionKind;
  callbackUrl?: string | null;
  signupTier?: "RN" | "PN" | "NP" | "ALLIED" | null;
  className?: string;
};

/** @deprecated Prefer {@link AuthTransitionShell} with `showLoading` — retained for imports. */
export function AuthTransitionLoading({ kind, callbackUrl, signupTier, className = "" }: AuthTransitionLoadingProps) {
  return (
    <AuthTransitionShell
      kind={kind}
      callbackUrl={callbackUrl}
      signupTier={signupTier}
      showLoading
      className={className}
    />
  );
}
