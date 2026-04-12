import { ForgotPasswordForm } from "@/components/auth/forgot-password-form";
import { SiteBrandLogoMark } from "@/components/brand/site-brand-logo";
import { withMarketingLocale } from "@/lib/i18n/marketing-path";
import { loadMarketingMessages } from "@/lib/marketing-i18n/load-marketing-messages";

export async function MarketingForgotPasswordPage({ locale }: { locale: string }) {
  const m = await loadMarketingMessages(locale);
  const loginHref = withMarketingLocale(locale, "/login");

  return (
    <main className="mx-auto w-full max-w-md nn-marketing-x nn-rhythm-page">
      <div className="nn-card p-6 sm:p-8">
        <div className="mb-6 flex justify-center bg-transparent">
          <SiteBrandLogoMark variant="auth" logoVariant="leaf" className="!h-11 !max-h-11 sm:!h-12 sm:!max-h-12" />
        </div>
        <h1 className="nn-marketing-h1">{m["pages.forgotPassword.h1"] ?? "Reset Your Password"}</h1>
        <p className="nn-marketing-body-sm mt-2 text-muted">
          {m["pages.forgotPassword.intro"] ??
            "Enter your email address. If an account exists with a password, we will send a reset link."}
        </p>
        <ForgotPasswordForm
          backToLoginHref={loginHref}
          backToLoginLabel={m["pages.forgotPassword.backToLoginLabel"] ?? "Back to sign in"}
          submitLabel={m["pages.forgotPassword.submitLabel"] ?? "Send reset link"}
          successMessage={
            m["pages.forgotPassword.successMessage"] ??
            "If an account exists for that email, a password reset link has been sent."
          }
          errorMessage={m["pages.forgotPassword.errorMessage"] ?? "Something went wrong. Please try again."}
          emailPlaceholder={m["pages.forgotPassword.emailPlaceholder"] ?? "Email address on your account"}
        />
      </div>
    </main>
  );
}
