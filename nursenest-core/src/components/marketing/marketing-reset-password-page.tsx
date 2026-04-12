import { ResetPasswordForm } from "@/components/auth/reset-password-form";
import { AuthLeafWatermark } from "@/components/brand/auth-leaf-watermark";
import { SiteBrandLogoMark } from "@/components/brand/site-brand-logo";
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
    <main className="mx-auto w-full max-w-md nn-marketing-x nn-rhythm-page">
      <div className="nn-card relative overflow-hidden p-6 sm:p-8">
        <AuthLeafWatermark />
        <div className="relative z-[1]">
          <div className="mb-6 flex justify-center bg-transparent">
            <SiteBrandLogoMark variant="auth" logoVariant="leaf" className="!h-11 !max-h-11 sm:!h-12 sm:!max-h-12" />
          </div>
          <h1 className="nn-marketing-h1">{m["pages.resetPassword.h1"] ?? "Choose a New Password"}</h1>
          <p className="nn-marketing-body-sm mt-2 text-muted">
            {m["pages.resetPassword.intro"] ?? "Enter and confirm your new password (at least 8 characters)."}
          </p>
          <ResetPasswordForm
            token={token}
            backToLoginHref={loginHref}
            backToLoginLabel={m["pages.resetPassword.backToLoginLabel"] ?? "Back to sign in"}
            submitLabel={m["pages.resetPassword.submitLabel"] ?? "Update password"}
            savingLabel={m["pages.resetPassword.savingLabel"] ?? "Saving\u2026"}
            successMessage={m["pages.resetPassword.successMessage"] ?? "Your password has been updated. You can sign in now."}
            errorGeneric={
              m["pages.resetPassword.errorGeneric"] ??
              "This reset link is invalid or has expired. Request a new one from the sign-in page."
            }
            passwordLabel={m["pages.resetPassword.passwordLabel"] ?? "New password"}
            confirmLabel={m["pages.resetPassword.confirmLabel"] ?? "Confirm new password"}
            mismatchMessage={m["pages.resetPassword.mismatchMessage"] ?? "Passwords do not match."}
            weakPasswordMessage={m["pages.resetPassword.weakPasswordMessage"] ?? "Password must be at least 8 characters."}
          />
        </div>
      </div>
    </main>
  );
}
