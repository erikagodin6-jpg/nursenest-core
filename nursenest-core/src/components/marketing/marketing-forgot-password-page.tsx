import { ForgotPasswordForm } from "@/components/auth/forgot-password-form";
import { SiteBrandLogoMark } from "@/components/brand/site-brand-logo";
import { withMarketingLocale } from "@/lib/i18n/marketing-path";
import { loadMarketingMessages } from "@/lib/marketing-i18n/load-marketing-messages";

export async function MarketingForgotPasswordPage({ locale }: { locale: string }) {
  await loadMarketingMessages(locale);
  const loginHref = withMarketingLocale(locale, "/login");

  return (
    <main className="mx-auto w-full max-w-md px-6 py-16">
      <div className="nn-card p-8">
        <div className="mb-6 flex justify-center">
          <SiteBrandLogoMark />
        </div>
        <h1 className="text-3xl font-bold">Reset your password</h1>
        <p className="mt-2 text-sm text-muted">
          Enter your email address. If an account exists with a password, we will send a reset link.
        </p>
        <ForgotPasswordForm
          backToLoginHref={loginHref}
          backToLoginLabel="Back to sign in"
          submitLabel="Send reset link"
          successMessage="If an account exists for that email, a password reset link has been sent."
          errorMessage="Something went wrong. Please try again."
          emailPlaceholder="Email address on your account"
        />
      </div>
    </main>
  );
}
