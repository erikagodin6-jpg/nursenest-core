import Link from "next/link";
import { Suspense } from "react";
import { AuthFlowTrustReassurance } from "@/components/auth/auth-flow-trust-reassurance";
import { LoginForm } from "@/components/auth/login-form";
import { VerifyStatusBanner } from "@/components/auth/verify-status-banner";
import { AuthLeafWatermark } from "@/components/brand/auth-leaf-watermark";
import { SiteBrandLogoMark } from "@/components/brand/site-brand-logo";
import { AuthIncidentNotice } from "@/components/marketing/auth-incident-notice";
import { DEFAULT_MARKETING_LOCALE, isMarketingLocaleCode } from "@/lib/i18n/marketing-locale-policy";
import { withMarketingLocale } from "@/lib/i18n/marketing-path";
import { loadMarketingMessages, mergeMissingMarketingMessageKeys } from "@/lib/marketing-i18n/load-marketing-messages";

function resolveLoginMarketingLocale(locale: string): string {
  const trimmed = typeof locale === "string" ? locale.trim() : "";
  if (!trimmed || !isMarketingLocaleCode(trimmed)) return DEFAULT_MARKETING_LOCALE;
  return trimmed;
}

export async function MarketingLoginPage({ locale }: { locale: string }) {
  const resolved = resolveLoginMarketingLocale(locale);
  const primary = await loadMarketingMessages(resolved);
  const english = await loadMarketingMessages(DEFAULT_MARKETING_LOCALE);
  const m = mergeMissingMarketingMessageKeys(primary, english);
  const forgotHref = withMarketingLocale(resolved, "/forgot-password");
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
          <AuthIncidentNotice contactHref={withMarketingLocale(resolved, "/contact")} />
          <header className="mb-6 text-center">
            <h1 className="text-2xl font-semibold tracking-tight text-[var(--palette-heading)] sm:text-3xl">
              {m["pages.login.welcome"]}
            </h1>
            <p className="mt-2 text-center text-sm text-muted-foreground sm:text-base">{m["pages.login.subtitle"]}</p>
          </header>
          <AuthFlowTrustReassurance variant="login" />
          <Suspense fallback={<div className="mt-6 h-32 animate-pulse rounded-xl bg-border/40" aria-hidden />}>
            <LoginForm
              forgotPasswordHref={forgotHref}
              termsHref={withMarketingLocale(resolved, "/terms")}
              privacyHref={withMarketingLocale(resolved, "/privacy")}
              contactHref={withMarketingLocale(resolved, "/contact")}
            />
          </Suspense>
          <div className="nn-account-recovery-hint space-y-3 border-t border-[var(--semantic-border-soft)] pt-5">
            <p className="text-sm font-semibold text-[var(--theme-heading-text)]">{m["pages.login.recoveryHeading"]}</p>
            <ol className="list-decimal space-y-2 pl-5 text-sm leading-relaxed text-muted-foreground">
              <li>
                <Link href={forgotHref} className="font-semibold text-[var(--semantic-brand)] underline-offset-2 hover:underline">
                  {m["pages.login.forgotPasswordLink"]}
                </Link>
                <span className="text-muted-foreground"> — {m["pages.login.recoveryForgotHint"]}</span>
              </li>
              <li>{m["pages.login.cantFindAccount"]}</li>
              <li>
                <Link
                  href={withMarketingLocale(resolved, "/contact")}
                  className="font-semibold text-[var(--semantic-brand)] underline-offset-2 hover:underline"
                >
                  {m["pages.login.recoveryContactLink"]}
                </Link>
                {m["pages.login.recoveryContactSuffix"]}
              </li>
            </ol>
          </div>
        </div>
      </div>
    </main>
  );
}
