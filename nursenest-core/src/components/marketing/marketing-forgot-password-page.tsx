import { ForgotPasswordForm } from "@/components/auth/forgot-password-form";
import { AuthLeafWatermark } from "@/components/brand/auth-leaf-watermark";
import { SiteBrandLogoMark } from "@/components/brand/site-brand-logo";
import { AuthIncidentNotice } from "@/components/marketing/auth-incident-notice";
import { withMarketingLocale } from "@/lib/i18n/marketing-path";
import { loadMarketingMessages } from "@/lib/marketing-i18n/load-marketing-messages";

export async function MarketingForgotPasswordPage({ locale }: { locale: string }) {
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
          <h1 className="nn-marketing-h1">{m["pages.forgotPassword.h1"] ?? "Reset Your Password"}</h1>
          <p className="nn-marketing-body-sm mt-2 text-muted">
            {m["pages.forgotPassword.intro"] ??
              "Enter your email address. If an account exists with a password, we will send a reset link."}
          </p>
          <AuthIncidentNotice contactHref={withMarketingLocale(locale, "/contact")} />
          <ForgotPasswordForm
            backToLoginHref={loginHref}
            backToLoginLabel={m["pages.forgotPassword.backToLoginLabel"] ?? "Back to sign in"}
            submitLabel={m["pages.forgotPassword.submitLabel"] ?? "Send reset link"}
            sendingLabel={m["pages.forgotPassword.sendingLabel"] ?? "Sending\u2026"}
            successMessage={
              m["pages.forgotPassword.successMessage"] ??
              "If an account exists for that email and it can receive a password reset, we will send a link."
            }
            successDetail={
              m["pages.forgotPassword.successDetail"] ??
              "Delivery can take a few minutes. Check your spam or promotions folder. If nothing arrives, use Contact support above so we can help you restore access."
            }
            errorMessage={m["pages.forgotPassword.errorMessage"] ?? "Unable to complete request. Try again."}
            errorNetwork={m["pages.forgotPassword.errorNetwork"]}
            errorServer={m["pages.forgotPassword.errorServer"]}
            notEmailMessage={
              m["pages.forgotPassword.notEmailMessage"] ??
              "Password reset uses the email on your account. Please enter your email address, not your username."
            }
            emailPlaceholder={m["pages.forgotPassword.emailPlaceholder"] ?? "Email address on your account"}
          />
        </div>
      </div>
    </main>
  );
}
