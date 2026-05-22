import Link from "next/link";
import { Suspense } from "react";
import { AuthFlowTrustReassurance } from "@/components/auth/auth-flow-trust-reassurance";
import { LoginForm } from "@/components/auth/login-form";
import { PremiumAuthShell } from "@/components/auth/premium-auth-shell";
import { VerifyStatusBanner } from "@/components/auth/verify-status-banner";
import { MarketingLoginPageClient } from "@/components/marketing/marketing-login-page-client";
import { MarketingI18nShardLayer } from "@/components/i18n/marketing-i18n-provider";
import { AuthIncidentNotice } from "@/components/marketing/auth-incident-notice";
import { AuthStateSurface } from "@/components/auth/auth-experience/auth-state-surface";
import { DEFAULT_MARKETING_LOCALE } from "@/lib/i18n/marketing-locale-policy";
import { withMarketingLocale } from "@/lib/i18n/marketing-path";
import { pickLoginSurfaceMessages } from "@/lib/i18n/login-surface-message-keys";
import { resolveLoginMarketingLocaleFromUrlSegment } from "@/lib/i18n/resolve-login-marketing-locale";
import { loadMarketingMessageShards } from "@/lib/marketing-i18n/load-marketing-message-shards";
import { MARKETING_DEFAULT_LAYOUT_MESSAGE_SHARDS } from "@/lib/marketing-i18n/marketing-i18n-shard-groups";

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

  const primary = await loadMarketingMessageShards(
    resolved,
    MARKETING_DEFAULT_LAYOUT_MESSAGE_SHARDS,
  );
  const english = await loadMarketingMessageShards(
    DEFAULT_MARKETING_LOCALE,
    MARKETING_DEFAULT_LAYOUT_MESSAGE_SHARDS,
  );
  const messages = mergeMessages(primary, english);

  const forgotHref = withMarketingLocale(resolved, "/forgot-password");
  const contactHref = withMarketingLocale(resolved, "/contact");

  const loginSurface = pickLoginSurfaceMessages(messages);
  const loginSurfaceFallback =
    resolved !== DEFAULT_MARKETING_LOCALE ? pickLoginSurfaceMessages(english) : undefined;

  return (
    <MarketingI18nShardLayer messages={loginSurface} fallbackMessages={loginSurfaceFallback}>
      <MarketingLoginPageClient>
      <PremiumAuthShell
        variant="login"
        title={message(messages, "pages.login.welcome", "Sign in")}
        subtitle={message(messages, "pages.login.subtitle", "Continue your adaptive study session.")}
        termsHref={withMarketingLocale(resolved, "/terms")}
        privacyHref={withMarketingLocale(resolved, "/privacy")}
        contactHref={contactHref}
        mobileEyebrow="NurseNest · Blossom"
        stateSurface={
          <Suspense>
            <AuthStateSurface />
          </Suspense>
        }
      >
        <Suspense>
          <VerifyStatusBanner />
        </Suspense>

        <AuthIncidentNotice contactHref={contactHref} />

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
            {message(messages, "pages.login.recoveryHeading", "Having Trouble Signing In?")}
          </p>

          <ol className="list-decimal space-y-2 pl-5 text-sm leading-relaxed text-muted-foreground">
            <li>
              <Link
                href={forgotHref}
                className="font-semibold text-[var(--semantic-brand)] underline-offset-2 hover:underline"
              >
                {message(messages, "pages.login.forgotPasswordLink", "Reset Your Password")}
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
                {message(messages, "pages.login.recoveryContactLink", "Contact Support")}
              </Link>
              {message(messages, "pages.login.recoveryContactSuffix", " if you still need help.")}
            </li>
          </ol>
        </div>

        <section className="mt-5 w-full pb-2 sm:mt-6" aria-labelledby="auth-trust-heading">
          <AuthFlowTrustReassurance variant="login" layout="standalone" contactHref={contactHref} />
        </section>
      </PremiumAuthShell>
      </MarketingLoginPageClient>
    </MarketingI18nShardLayer>
  );
}