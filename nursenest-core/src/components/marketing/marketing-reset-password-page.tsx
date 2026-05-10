import { ResetPasswordForm } from "@/components/auth/reset-password-form";
import { PremiumAuthShell } from "@/components/auth/premium-auth-shell";
import { withMarketingLocale } from "@/lib/i18n/marketing-path";
import { loadMarketingMessages } from "@/lib/marketing-i18n/load-marketing-messages";

export async function MarketingResetPasswordPage({
  locale,
  token,
}: {
  locale: string;
  token: string;
}) {
  const m = await loadMarketingMessages(locale);
  const loginHref = withMarketingLocale(locale, "/login");

  return (
    <PremiumAuthShell
      variant="reset"
      title={m["pages.resetPassword.h1"] ?? "Reset Password"}
      subtitle={m["pages.resetPassword.intro"] ?? "Enter and confirm your new password (at least 8 characters)."}
      termsHref={withMarketingLocale(locale, "/terms")}
      privacyHref={withMarketingLocale(locale, "/privacy")}
      contactHref={withMarketingLocale(locale, "/contact")}
    >
      <ResetPasswordForm
        token={token}
        backToLoginHref={loginHref}
        backToLoginLabel={m["pages.resetPassword.backToLoginLabel"] ?? "Back To Sign In"}
        submitLabel={m["pages.resetPassword.submitLabel"] ?? "Update Password"}
        savingLabel={m["pages.resetPassword.savingLabel"] ?? "Saving\u2026"}
        successMessage={m["pages.resetPassword.successMessage"] ?? "Your password has been updated. You can sign in now."}
        errorGeneric={
          m["pages.resetPassword.errorGeneric"] ??
          "This reset link is invalid or has expired. Request a new one from the Sign In page."
        }
        passwordLabel={m["pages.resetPassword.passwordLabel"] ?? "New Password"}
        confirmLabel={m["pages.resetPassword.confirmLabel"] ?? "Confirm New Password"}
        mismatchMessage={m["pages.resetPassword.mismatchMessage"] ?? "Passwords do not match."}
        weakPasswordMessage={m["pages.resetPassword.weakPasswordMessage"] ?? "Password must be at least 8 characters."}
      />
    </PremiumAuthShell>
  );
}
