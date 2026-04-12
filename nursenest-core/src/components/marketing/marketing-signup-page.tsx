import { Suspense } from "react";
import { SignupForm } from "@/components/auth/signup-form";
import { SiteBrandLogoMark } from "@/components/brand/site-brand-logo";
import { withMarketingLocale } from "@/lib/i18n/marketing-path";
import { loadMarketingMessages } from "@/lib/marketing-i18n/load-marketing-messages";

export async function MarketingSignupPage({ locale }: { locale: string }) {
  const m = await loadMarketingMessages(locale);
  return (
    <main className="mx-auto w-full max-w-md nn-marketing-x nn-rhythm-page">
      <div className="nn-card p-6 sm:p-8">
        <div className="mb-6 flex justify-center bg-transparent">
          <SiteBrandLogoMark variant="auth" logoVariant="leaf" className="!h-11 !max-h-11 sm:!h-12 sm:!max-h-12" />
        </div>
        <h1 className="nn-marketing-h1">{m["pages.signup.h1"]}</h1>
        <p className="nn-marketing-body-sm mt-2 text-muted">{m["pages.signup.subtitle"]}</p>
        <Suspense fallback={<div className="mt-6 h-64 animate-pulse rounded-xl bg-muted/40" aria-hidden />}>
          <SignupForm
            termsHref={withMarketingLocale(locale, "/terms")}
            privacyHref={withMarketingLocale(locale, "/privacy")}
          />
        </Suspense>
      </div>
    </main>
  );
}
