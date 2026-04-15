import { Suspense } from "react";
import { LoginForm } from "@/components/auth/login-form";
import { VerifyStatusBanner } from "@/components/auth/verify-status-banner";
import { AuthLeafWatermark } from "@/components/brand/auth-leaf-watermark";
import { SiteBrandLogoMark } from "@/components/brand/site-brand-logo";
import { AuthIncidentNotice } from "@/components/marketing/auth-incident-notice";
import { withMarketingLocale } from "@/lib/i18n/marketing-path";
import { loadMarketingMessages } from "@/lib/marketing-i18n/load-marketing-messages";

export async function MarketingLoginPage({ locale }: { locale: string }) {
  const m = await loadMarketingMessages(locale);
  const forgotHref = withMarketingLocale(locale, "/forgot-password");
  return (
    <main className="mx-auto w-full max-w-md nn-marketing-x nn-rhythm-page">
      <div className="nn-card relative overflow-hidden p-6 sm:p-8">
        <AuthLeafWatermark />
        <div className="relative z-[1]">
          <div className="mb-6 flex justify-center bg-transparent">
            <SiteBrandLogoMark variant="auth" logoVariant="leaf" className="!h-11 !max-h-11 sm:!h-12 sm:!max-h-12" />
          </div>
          <Suspense>
            <VerifyStatusBanner />
          </Suspense>
          <AuthIncidentNotice contactHref={withMarketingLocale(locale, "/contact")} />
          <header className="mb-8 text-center">
            <h1 className="text-2xl font-semibold tracking-tight text-[var(--palette-heading)] sm:text-3xl">
              {m["pages.login.welcome"]}
            </h1>
            <p className="mt-2 text-center text-sm text-muted-foreground sm:text-base">{m["pages.login.subtitle"]}</p>
          </header>
          <Suspense fallback={<div className="mt-6 h-32 animate-pulse rounded-xl bg-border/40" aria-hidden />}>
            <LoginForm
              forgotPasswordHref={forgotHref}
              termsHref={withMarketingLocale(locale, "/terms")}
              privacyHref={withMarketingLocale(locale, "/privacy")}
            />
          </Suspense>
          <div className="nn-account-recovery-hint">
            <p>{m["pages.login.cantFindAccount"]}</p>
          </div>
        </div>
      </div>
    </main>
  );
}
