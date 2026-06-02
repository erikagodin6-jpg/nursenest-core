"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { AuthEmailVerifiedSuccess } from "@/components/auth/auth-email-verified-success";
import { AuthExperienceShell } from "@/components/auth/auth-experience/auth-experience-shell";
import { AuthTransitionShell } from "@/components/auth/auth-experience/auth-transition-shell";
import { AuthVerifyEmailPending } from "@/components/auth/auth-verify-email-pending";
import { useMarketingI18n } from "@/lib/marketing-i18n";
import { withMarketingLocale } from "@/lib/i18n/marketing-path";
import { readAuthCallbackFromSearchParams } from "@/lib/auth/auth-flow-governance";

export type VerifyEmailExperienceClientProps = {
  termsHref: string;
  privacyHref: string;
  contactHref: string;
};

function VerifyEmailExperienceInner({
  termsHref,
  privacyHref,
  contactHref,
}: VerifyEmailExperienceClientProps) {
  const searchParams = useSearchParams();
  const { locale, t } = useMarketingI18n();

  const status = searchParams.get("status");
  const sent = searchParams.get("sent") === "1";
  const callbackUrl = readAuthCallbackFromSearchParams(searchParams);
  const email = searchParams.get("email");

  const loginBase = withMarketingLocale(locale, "/login");
  const loginParams = new URLSearchParams();
  if (callbackUrl) loginParams.set("callbackUrl", callbackUrl);
  const loginHref = loginParams.toString() ? `${loginBase}?${loginParams.toString()}` : loginBase;

  if (status === "success") {
    return <AuthEmailVerifiedSuccess />;
  }

  if (status === "invalid" || status === "expired" || status === "rate_limited") {
    const magicVariant = status === "expired" ? "expired" : "invalid";
    return (
      <AuthExperienceShell
        mode="verify"
        layout="centered-glass"
        theme="blossom"
        state={status === "expired" ? "magic-link-expired" : "magic-link-invalid"}
        title={t("pages.verifyEmail.errorTitle") ?? "Link not available"}
        subtitle={t("pages.verifyEmail.errorSubtitle") ?? "Request a new verification email or sign in to continue."}
        termsHref={termsHref}
        privacyHref={privacyHref}
        contactHref={contactHref}
      >
        <AuthTransitionShell
          kind={status === "rate_limited" ? "authentication-error" : "magic-link-confirmation"}
          layout="panel"
          magicLinkVariant={magicVariant}
          verifyStatus={status === "rate_limited" ? "rate_limited" : undefined}
          primaryActionHref={loginHref}
        />
        <p className="mt-4 text-center text-sm text-[var(--auth-subtext)]">
          <a href={loginHref} className="font-semibold text-[var(--auth-primary)] underline-offset-2 hover:underline">
            {t("auth.emailVerification.signInLink") ?? "Back to sign in"}
          </a>
        </p>
      </AuthExperienceShell>
    );
  }

  return (
    <AuthExperienceShell
      mode="verify"
      layout="centered-glass"
      theme="blossom"
      state="verify-email"
      title={t("pages.verifyEmail.pendingTitle") ?? "Check your inbox"}
      subtitle={
        t("pages.verifyEmail.pendingSubtitle") ??
        "We sent a verification link so you can continue into your adaptive study workspace."
      }
      termsHref={termsHref}
      privacyHref={privacyHref}
      contactHref={contactHref}
      mobileEyebrow="NurseNest · Sea Glass"
    >
      <AuthVerifyEmailPending email={email} loginHref={loginHref} callbackUrl={callbackUrl} />
      {!sent && !status ? (
        <p className="mt-4 text-center text-xs text-[var(--auth-subtext)]">
          {t("pages.verifyEmail.pendingHint") ?? "Links expire for your security — you can always request another."}
        </p>
      ) : null}
    </AuthExperienceShell>
  );
}

export function VerifyEmailExperienceClient(props: VerifyEmailExperienceClientProps) {
  return (
    <Suspense
      fallback={
        <div className="nn-premium-auth-centered nn-marketing-x py-16" aria-hidden>
          <div className="mx-auto h-64 max-w-md animate-pulse rounded-2xl bg-muted/40" />
        </div>
      }
    >
      <VerifyEmailExperienceInner {...props} />
    </Suspense>
  );
}
