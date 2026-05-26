"use client";

import { Suspense, type ReactNode } from "react";
import { AuthEmailVerifiedSuccess, useShowAuthEmailVerifiedSuccess } from "@/components/auth/auth-email-verified-success";

function LoginRouteBody({ children }: { children: ReactNode }) {
  const showVerified = useShowAuthEmailVerifiedSuccess();
  if (showVerified) {
    return <AuthEmailVerifiedSuccess />;
  }
  return children;
}

/**
 * Client gate: email verification success uses the full Mint Blossom celebration layout;
 * otherwise renders the standard login shell children.
 */
export function MarketingLoginPageClient({ children }: { children: ReactNode }) {
  return (
    <Suspense fallback={null}>
      <LoginRouteBody>{children}</LoginRouteBody>
    </Suspense>
  );
}
