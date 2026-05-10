import { Suspense } from "react";
import { AuthFlowTrustReassurance } from "@/components/auth/auth-flow-trust-reassurance";
import { PremiumAuthShell } from "@/components/auth/premium-auth-shell";
import { SignupForm } from "@/components/auth/signup-form";
import { withMarketingLocale } from "@/lib/i18n/marketing-path";
import { loadMarketingMessages } from "@/lib/marketing-i18n/load-marketing-messages";

export async function MarketingSignupPage({ locale }: { locale: string }) {
  const m = await loadMarketingMessages(locale);
  const termsHref = withMarketingLocale(locale, "/terms");
  const privacyHref = withMarketingLocale(locale, "/privacy");
  const contactHref = withMarketingLocale(locale, "/contact");
  return (
    <PremiumAuthShell
      variant="signup"
      title={m["pages.signup.h1"] ?? "Create Account"}
      subtitle={m["pages.signup.subtitle"] ?? "Choose your pathway and start a connected NurseNest study plan."}
      termsHref={termsHref}
      privacyHref={privacyHref}
      contactHref={contactHref}
    >
      <AuthFlowTrustReassurance
        variant="signup"
        contactHref={contactHref}
      />
      <Suspense fallback={<div className="mt-6 h-64 animate-pulse rounded-xl bg-muted/40" aria-hidden />}>
        <SignupForm
          termsHref={termsHref}
          privacyHref={privacyHref}
          contactHref={contactHref}
          forgotPasswordHref={withMarketingLocale(locale, "/forgot-password")}
        />
      </Suspense>
    </PremiumAuthShell>
  );
}
