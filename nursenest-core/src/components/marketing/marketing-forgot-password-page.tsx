"use client";

import { Suspense } from "react";
import { ForgotPasswordForm } from "@/components/auth/forgot-password-form";
import { AuthStateSurface } from "@/components/auth/auth-experience/auth-state-surface";
import { PremiumAuthShell } from "@/components/auth/premium-auth-shell";
import { AuthIncidentNotice } from "@/components/marketing/auth-incident-notice";
import { withMarketingLocale } from "@/lib/i18n/marketing-path";
import { useMarketingI18n } from "@/components/marketing/marketing-i18n-provider";

function pick(messages: Record<string, string>, key: string, fallback: string): string {
  const value = messages[key];
  return typeof value === "string" && value.trim().length > 0 ? value : fallback;
}

export function MarketingForgotPasswordPage() {
  const { locale, messages } = useMarketingI18n();
  const loginHref = withMarketingLocale(locale, "/login");
  const contactHref = withMarketingLocale(locale, "/contact");

  return (
    <PremiumAuthShell
      variant="recovery"
      title={pick(messages, "pages.forgotPassword.h1", "Forgot Password?")}
      subtitle={pick(
        messages,
        "pages.forgotPassword.intro",
        "Enter your email address. If an account exists with a password, we will send a reset link.",
      )}
      termsHref={withMarketingLocale(locale, "/terms")}
      privacyHref={withMarketingLocale(locale, "/privacy")}
      contactHref={contactHref}
      stateSurface={
        <Suspense>
          <AuthStateSurface />
        </Suspense>
      }
    >
      <AuthIncidentNotice contactHref={contactHref} />
      <ForgotPasswordForm
        backToLoginHref={loginHref}
        backToLoginLabel={pick(messages, "pages.forgotPassword.backToLoginLabel", "Back To Sign In")}
        submitLabel={pick(messages, "pages.forgotPassword.submitLabel", "Send Reset Link")}
        sendingLabel={pick(messages, "pages.forgotPassword.sendingLabel", "Sending\u2026")}
        errorMessage={pick(messages, "pages.forgotPassword.errorMessage", "Unable to complete request. Try again.")}
        errorNetwork={messages["pages.forgotPassword.errorNetwork"]}
        errorServer={messages["pages.forgotPassword.errorServer"]}
        notEmailMessage={pick(
          messages,
          "pages.forgotPassword.notEmailMessage",
          "Password reset uses the email on your account. Please enter your email address, not your username.",
        )}
        emailPlaceholder={pick(messages, "pages.forgotPassword.emailPlaceholder", "Email Address On Your Account")}
      />
    </PremiumAuthShell>
  );
}
