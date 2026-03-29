import { ResetPasswordForm } from "@/components/auth/reset-password-form";
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
  await loadMarketingMessages(locale);
  const loginHref = withMarketingLocale(locale, "/login");

  return (
    <main className="mx-auto w-full max-w-md px-6 py-16">
      <div className="nn-card p-8">
        <div className="mb-6 flex justify-center">
          <SiteBrandLogoMark className="h-10 w-auto max-w-[12rem] object-contain md:h-12" />
        </div>
        <h1 className="text-3xl font-bold">Choose a new password</h1>
        <p className="mt-2 text-sm text-muted">Enter and confirm your new password (at least 8 characters).</p>
        <ResetPasswordForm
          token={token}
          backToLoginHref={loginHref}
          backToLoginLabel="Back to sign in"
          submitLabel="Update password"
          successMessage="Your password has been updated. You can sign in now."
          errorGeneric="This reset link is invalid or has expired. Request a new one from the sign-in page."
          passwordLabel="New password"
          confirmLabel="Confirm new password"
          mismatchMessage="Passwords do not match."
          weakPasswordMessage="Password must be at least 8 characters."
        />
      </div>
    </main>
  );
}
