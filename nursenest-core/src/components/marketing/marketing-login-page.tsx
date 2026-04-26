import Link from "next/link";
import { Suspense } from "react";
import { AuthFlowTrustReassurance } from "@/components/auth/auth-flow-trust-reassurance";
import { LoginForm } from "@/components/auth/login-form";
import { VerifyStatusBanner } from "@/components/auth/verify-status-banner";
import { AuthLeafWatermark } from "@/components/brand/auth-leaf-watermark";
import { SiteBrandLogoMark } from "@/components/brand/site-brand-logo";
import { MarketingI18nShardLayer } from "@/components/i18n/marketing-i18n-provider";
import { AuthIncidentNotice } from "@/components/marketing/auth-incident-notice";
import { DEFAULT_MARKETING_LOCALE } from "@/lib/i18n/marketing-locale-policy";
import { withMarketingLocale } from "@/lib/i18n/marketing-path";
import { pickLoginSurfaceMessages } from "@/lib/i18n/login-surface-message-keys";
import { resolveLoginMarketingLocaleFromUrlSegment } from "@/lib/i18n/resolve-login-marketing-locale";
import { loadMarketingMessages } from "@/lib/marketing-i18n/load-marketing-messages";

type MarketingMessageMap = Record<string, string>;

function mergeMessages(primary: MarketingMessageMap, fallback: MarketingMessageMap): MarketingMessageMap {
  return { ...fallback, ...primary };
}

function message(messages: MarketingMessageMap, key: string, fallback: string): string {
  const value = messages[key];
  return typeof value === "string" && value.trim().length > 0 ? value : fallback;
}

function LoginFormStreamFallback() {
  const inputClass =
    "w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm pointer-events-none";

  return (
    <div className="mt-6 space-y-4" aria-busy="true">
      <div className="space-y-1.5">
        <div className="h-4 w-28 animate-pulse rounded bg-border/50" aria-hidden />
        <input
          id="login-identifier"
          name="email"
          type="text"
          readOnly
          tabIndex={-1}
          className={inputClass}
          autoComplete="username"
          aria-disabled="true"
        />
      </div>

      <div className="space-y-1.5">
        <div className="h-4 w-24 animate-pulse rounded bg-border/50" aria-hidden />
        <input
          id="login-password"
          name="password"
          type="password"
          readOnly
          tabIndex={-1}
          className={inputClass}
          autoComplete="current-password"
          aria-disabled="true"
        />
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
  const messages = mergeMessages(primary, english);

  const forgotHref = withMarketingLocale(resolved, "/forgot-password");
  const contactHref = withMarketingLocale(resolved, "/contact");

  const loginSurface = pickLoginSurfaceMessages(messages);
  const loginSurfaceFallback =
    resolved !== DEFAULT_MARKETING_LOCALE ? pickLoginSurfaceMessages(english) : undefined;

  return (
    <main className="mx-auto flex w-full max-w-md flex-col nn-marketing-x nn-rhythm-page">
      <MarketingI18nShardLayer messages={loginSurface} fallbackMessages={loginSurfaceFallback}>
        <div className="nn-card relative overflow-hidden p-6 sm:p-8">
          <AuthLeafWatermark />

          <div className="relative z-[1]">
            <div className="mb-6 flex justify-center bg-transparent">
              <SiteBrandLogoMark
                variant="auth"
                logoVariant="leaf"
                className="!h-11 !max-h-11 sm:!h-12 sm:!max-h-12"
              />
            </div>

            <Suspense>
              <VerifyStatusBanner />
            </Suspense>

            <AuthIncidentNotice contactHref={contactHref} />

            <header className="mb-6 text-center">
              <h1 className="text-2xl font-semibold tracking-tight text-[var(--palette-heading)] sm:text-3xl">
                {message(messages, "pages.login.welcome", "Welcome back")}
              </h1>
              <p className="mt-2 text-center text-sm text-muted-foreground sm:text-base">
                {message(messages, "pages.login.subtitle", "Sign in to continue your NurseNest study plan.")}
              </p>
            </header>

            <Suspense fallback={<LoginFormStreamFallback />}>
              <LoginForm
                forgotPasswordHref={forgotHref}
                termsHref={withMarketingLocale(resolved, "/terms")}
                privacyHref={withMarketingLocale(resolved, "/privacy")}
                contactHref={contactHref}
              />
            </Suspense>

            <div className="nn-account-recovery-hint space-y-3 border-t border-[var(--semantic-border-soft)] pt-5">
              <p className="text-sm font-semibold text-[var(--theme-heading-text)]">
                {message(messages, "pages.login.recoveryHeading", "Having trouble signing in?")}
              </p>

              <ol className="list-decimal space-y-2 pl-5 text-sm leading-relaxed text-muted-foreground">
                <li>
                  <Link
                    href={forgotHref}
                    className="font-semibold text-[var(--semantic-brand)] underline-offset-2 hover:underline"
                  >
                    {message(messages, "pages.login.forgotPasswordLink", "Reset your password")}
                  </Link>
                  <span>
                    {" "}
                    —{" "}
                    {message(
                      messages,
                      "pages.login.recoveryForgotHint",
                      "use the same email address you used when creating your account.",
                    )}
                  </span>
                </li>

                <li>
                  {message(
                    messages,
                    "pages.login.cantFindAccount",
                    "If your account cannot be found, check for typos or try another email address.",
                  )}
                </li>

                <li>
                  <Link
                    href={contactHref}
                    className="font-semibold text-[var(--semantic-brand)] underline-offset-2 hover:underline"
                  >
                    {message(messages, "pages.login.recoveryContactLink", "Contact support")}
                  </Link>
                  {message(messages, "pages.login.recoveryContactSuffix", " if you still need help.")}
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