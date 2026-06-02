"use client";

import { useSearchParams } from "next/navigation";
import { AuthTransitionShell } from "@/components/auth/auth-experience/auth-transition-shell";

const VERIFY_STATUSES = new Set(["success", "expired", "invalid", "rate_limited"]);

export function VerifyStatusBanner() {
  const params = useSearchParams();
  const status = params.get("verify");
  const registered = params.get("registered") === "1";

  if (status && VERIFY_STATUSES.has(status)) {
    if (status === "success") {
      return (
        <div data-nn-premium-auth-verification="">
          <AuthTransitionShell
            kind="email-verified"
            layout="inline"
            verifyStatus="success"
            className="mb-4"
          />
        </div>
      );
    }
    if (status === "rate_limited") {
      return (
        <div data-nn-premium-auth-verification="">
          <AuthTransitionShell
            kind="authentication-error"
            layout="inline"
            verifyStatus="rate_limited"
            className="mb-4"
          />
        </div>
      );
    }
    return (
      <div data-nn-premium-auth-verification="">
        <AuthTransitionShell
          kind="magic-link-confirmation"
          layout="inline"
          magicLinkVariant={status === "expired" ? "expired" : "invalid"}
          className="mb-4"
        />
      </div>
    );
  }

  if (registered) {
    return <AuthTransitionShell kind="sign-up-completion" layout="inline" className="mb-4" />;
  }

  return null;
}
