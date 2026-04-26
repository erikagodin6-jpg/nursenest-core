import Link from "next/link";
import { Suspense } from "react";
import { AuthFlowTrustReassurance } from "@/components/auth/auth-flow-trust-reassurance";
import { LoginForm } from "@/components/auth/login-form";
import { VerifyStatusBanner } from "@/components/auth/verify-status-banner";
import { AuthLeafWatermark } from "@/components/brand/auth-leaf-watermark";
import { SiteBrandLogoMark } from "@/components/brand/site-brand-logo";
import { AuthIncidentNotice } from "@/components/marketing/auth-incident-notice";
import { MarketingI18nShardLayer } from "@/components/i18n/marketing-i18n-provider";
import { DEFAULT_MARKETING_LOCALE } from "@/lib/i18n/marketing-locale-policy";
import { pickLoginSurfaceMessages } from "@/lib/i18n/login-surface-message-keys";
import { resolveLoginMarketingLocaleFromUrlSegment } from "@/lib/i18n/resolve-login-marketing-locale";
import { withMarketingLocale } from "@/lib/i18n/marketing-path";
import { loadMarketingMessages } from "@/lib/marketing-i18n/load-marketing-messages";

/**
 * Safe merge replacement (removes broken import)
 */
function mergeMessages(primary: Record<string, string>, fallback: Record<string, string>) {
  return { ...fallback, ...primary };
}

function LoginFormStreamFallback() {
  const inputClass =
    "w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm pointer-events-none";

  return (
    <div className="mt-6 space-y-4" aria-busy="true">
      <div className="space-y-1.5">
        <div className="h-4 w-28 animate-pulse rounded bg-border/50" aria-hidden />
        <input id="login-identifier" name="email" type="text" readOnly tabIndex={-1} className={inputClass} autoComplete="username" aria-disabled="true" />
      </div>
      <div className="space-y-1.5">
        <div className="h-4 w-24 animate-pulse rounded bg-border/50" aria-hidden />
        <input id="login-password" name="password" type="password" readOnly tabIndex={-1} className={inputClass} autoComplete="current-password" aria-disabled="true" />
      </div>
      <div className="h-10 w-full animate-pulse rounded-xl bg-border/40" aria-hidden />
    </div>
  );
}

export type MarketingLoginLocaleMode = "pinned-english" | "localized";

export async function MarketingLoginPage({
  localeMode,
  localeHint,
}: {
  localeMode: MarketingLoginLocaleMode;
  localeHint?: string;
}) {
  const resolved =
    localeMode === "pinned-english"
      ? DEFAULT_MARKETING_LOCALE
      : resolveLoginMarketingLocaleFromUrlSegment(localeHint ?? "");

  const primary = await loadMarketingMessages(resolved);
  const english = await loadMarketingMessages(DEFAULT_MARKETING_LOCALE);

  // ✅ SAFE merge (replaces broken function)
  const m = mergeMessages(primary, english);

  const forgotHref = withMarketingLocale(resolved, "/forgot-password");

  const loginSurface = pickLoginSurfaceMessages(m);
  const loginSurfaceFallback =
    resolved !== DEFAULT_MARKETING_LOCALE ? pickLoginSurfaceMessages(english) : undefined;

  return (
    <main className="mx-auto flex w-full max-w-md flex-col nn-marketing-x nn-rhythm-page">
      <MarketingI18nShardLayer messages={loginSurface} fallbackMessages={loginSurfaceFallback}>
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
              <p className="mt-2 text-center text-sm text-muted-foreground sm:text-base">
                {m["pages.login.subtitle"]}
              </p>
            </header>

            <Suspense fallback={<LoginFormStreamFallback />}>
              <LoginForm
                forgotPasswordHref={forgotHref}
                termsHref={withMarketingLocale(resolved, "/terms")}
                privacyHref={withMarketingLocale(resolved, "/privacy")}
                contactHref={withMarketingLocale(resolved, "/contact")}
              />
            </Suspense>

            <div className="nn-account-recovery-hint space-y-3 border-t border-[var(--semantic-border-soft)] pt-5">
              <p className="text-sm font-semibold text-[var(--theme-heading-text)]">
                {m["pages.login.recoveryHeading"]}
              </p>

              <ol className="list-decimal space-y-2 pl-5 text-sm leading-relaxed text-muted-foreground">
                <li>
                  <Link href={forgotHref} className="font-semibold text-[var(--semantic-brand)] underline-offset-2 hover:underline">
                    {m["pages.login.forgotPasswordLink"]}
                  </Link>
                  <span> — {m["pages.login.recoveryForgotHint"]}</span>
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

        <section className="mt-8 w-full pb-2" aria-labelledby="auth-trust-heading">
          <AuthFlowTrustReassurance variant="login" layout="standalone" />
        </section>
      </MarketingI18nShardLayer>
    </main>
  );
}