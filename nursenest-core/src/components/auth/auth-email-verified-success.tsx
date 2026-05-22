"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { AuthTransitionShell } from "@/components/auth/auth-experience/auth-transition-shell";
import { useMarketingI18n } from "@/lib/marketing-i18n";
import { withMarketingLocale } from "@/lib/i18n/marketing-path";
import { readAuthCallbackFromSearchParams } from "@/lib/auth/auth-flow-governance";

export function AuthEmailVerifiedSuccess() {
  const searchParams = useSearchParams();
  const { locale } = useMarketingI18n();

  const callbackUrl = readAuthCallbackFromSearchParams(searchParams);

  const signInHref = (() => {
    const sp = new URLSearchParams(searchParams.toString());
    sp.delete("verify");
    sp.delete("status");
    const qs = sp.toString();
    const base = withMarketingLocale(locale, "/login");
    return qs ? `${base}?${qs}` : base;
  })();

  const primaryContinueHref = callbackUrl
    ? `${signInHref}${signInHref.includes("?") ? "&" : "?"}callbackUrl=${encodeURIComponent(callbackUrl)}`
    : `${signInHref}${signInHref.includes("?") ? "&" : "?"}callbackUrl=${encodeURIComponent("/app/start-studying")}`;

  const lessonsHref = withMarketingLocale(locale, "/rn");

  return (
    <>
      <AuthTransitionShell
        kind="email-verified"
        layout="full-page"
        callbackUrl={callbackUrl}
        primaryActionHref={primaryContinueHref}
        secondaryActionHref={lessonsHref}
      />
      <p className="nn-premium-auth-verified__signin-hint nn-marketing-x px-4 pb-8 text-center text-sm">
        Already signed in on another device?{" "}
        <Link href={signInHref} className="font-semibold text-[var(--semantic-brand)] underline-offset-2 hover:underline">
          Go to sign in
        </Link>
      </p>
    </>
  );
}

export function useShowAuthEmailVerifiedSuccess(): boolean {
  const params = useSearchParams();
  return params.get("verify") === "success";
}
