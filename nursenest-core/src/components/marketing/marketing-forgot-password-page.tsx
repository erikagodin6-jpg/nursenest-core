import { ForgotPasswordForm } from "@/components/auth/forgot-password-form";
import { PremiumAuthShell } from "@/components/auth/premium-auth-shell";
import { AuthIncidentNotice } from "@/components/marketing/auth-incident-notice";
import { withMarketingLocale } from "@/lib/i18n/marketing-path";
import { loadMarketingMessageShards } from "@/lib/marketing-i18n/load-marketing-message-shards";
import { MARKETING_DEFAULT_LAYOUT_MESSAGE_SHARDS } from "@/lib/marketing-i18n/marketing-i18n-shard-groups";

export async function MarketingForgotPasswordPage({ locale }: { locale: string }) {
  const m = await loadMarketingMessageShards(locale, MARKETING_DEFAULT_LAYOUT_MESSAGE_SHARDS);
  const loginHref = withMarketingLocale(locale, "/login");
  const contactHref = withMarketingLocale(locale, "/contact");

  return (
    <PremiumAuthShell
      variant="recovery"
      title={m["pages.forgotPassword.h1"] ?? "Forgot Password?"}
      subtitle={
        m["pages.forgotPassword.intro"] ??
        "Enter your email address. If an account exists with a password, we will send a reset link."
      }
      termsHref={withMarketingLocale(locale, "/terms")}
      privacyHref={withMarketingLocale(locale, "/privacy")}
      contactHref={contactHref}
    >
      <AuthIncidentNotice contactHref={contactHref} />
      <ForgotPasswordForm
        backToLoginHref={loginHref}
        backToLoginLabel={m["pages.forgotPassword.backToLoginLabel"] ?? "Back To Sign In"}
        submitLabel={m["pages.forgotPassword.submitLabel"] ?? "Send Reset Link"}
        sendingLabel={m["pages.forgotPassword.sendingLabel"] ?? "Sending\u2026"}
        errorMessage={m["pages.forgotPassword.errorMessage"] ?? "Unable to complete request. Try again."}
        errorNetwork={m["pages.forgotPassword.errorNetwork"]}
        errorServer={m["pages.forgotPassword.errorServer"]}
        notEmailMessage={
          m["pages.forgotPassword.notEmailMessage"] ??
          "Password reset uses the email on your account. Please enter your email address, not your username."
        }
        emailPlaceholder={m["pages.forgotPassword.emailPlaceholder"] ?? "Email Address On Your Account"}
      />
    </PremiumAuthShell>
  );
}
