import { Suspense } from "react";
import { AuthFlowTrustReassurance } from "@/components/auth/auth-flow-trust-reassurance";
import { SignupForm } from "@/components/auth/signup-form";
import { AuthLeafWatermark } from "@/components/brand/auth-leaf-watermark";
import { SiteBrandLogoMark } from "@/components/brand/site-brand-logo";
import { withMarketingLocale } from "@/lib/i18n/marketing-path";
import { loadMarketingMessages } from "@/lib/marketing-i18n/load-marketing-messages";

export async function MarketingSignupPage({ locale }: { locale: string }) {
  const m = await loadMarketingMessages(locale);
  return (
    <main className="mx-auto w-full max-w-md nn-marketing-x nn-rhythm-page">
      <div className="nn-card relative overflow-hidden p-6 sm:p-8">
        <AuthLeafWatermark />
        <div className="relative z-[1]">
          <div className="mb-6 flex justify-center bg-transparent">
            <SiteBrandLogoMark variant="auth" logoVariant="leaf" className="!h-11 !max-h-11 sm:!h-12 sm:!max-h-12" />
          </div>
          <header className="mb-6 text-center">
            <h1 className="text-2xl font-semibold tracking-tight text-[var(--palette-heading)] sm:text-3xl">
              {m["pages.signup.h1"]}
            </h1>
            <p className="mt-2 text-center text-sm text-muted-foreground sm:text-base">{m["pages.signup.subtitle"]}</p>
          </header>
          <AuthFlowTrustReassurance variant="signup" />
          <Suspense fallback={<div className="mt-6 h-64 animate-pulse rounded-xl bg-muted/40" aria-hidden />}>
            <SignupForm
              termsHref={withMarketingLocale(locale, "/terms")}
              privacyHref={withMarketingLocale(locale, "/privacy")}
              contactHref={withMarketingLocale(locale, "/contact")}
              forgotPasswordHref={withMarketingLocale(locale, "/forgot-password")}
            />
          </Suspense>
        </div>
      </div>
    </main>
  );
}
