"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { getCsrfToken, getSession, useSession } from "next-auth/react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useMarketingI18n } from "@/lib/marketing-i18n";
import { withMarketingLocale } from "@/lib/i18n/marketing-path";
import { refreshThenReplaceIfDifferent } from "@/lib/auth/post-login-client-navigation";
import { resolveMarketingAuthRedirectTarget } from "@/lib/auth/post-login-resume-path";
import { resolveLoginSubmitOutcome } from "@/components/auth/login-form-result";
import { isLikelyNetworkFailure } from "@/components/auth/auth-client-error-handling";
import { AuthMessageBanner } from "@/components/auth/auth-experience/auth-message-banner";
import { AuthTransitionShell } from "@/components/auth/auth-experience/auth-transition-shell";
import {
  AuthCheckbox,
  AuthField,
  AuthInput,
  AuthPrimaryButton,
  AuthTextLink,
} from "@/components/auth/auth-experience/auth-primitives";
import { OAuthProviderButtonsServer } from "@/components/auth/oauth-provider-buttons-server";
import { authTransitionMessageTone } from "@/lib/auth/auth-transition-governance";
import { isPlaceholderAuthCopy } from "@/lib/ui/is-placeholder-auth-copy";

type CredentialSignInResult = {
  error?: string;
  code?: string;
  status: number;
  ok: boolean;
  url: string | null;
};

async function signInWithCredentialsSafely(params: {
  email: string;
  password: string;
  rememberMe: string;
  redirectTo: string;
}): Promise<CredentialSignInResult> {
  const csrfToken = await getCsrfToken();
  const response = await fetch("/api/auth/callback/credentials", {
    method: "POST",
    credentials: "same-origin",
    cache: "no-store",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      "X-Auth-Return-Redirect": "1",
    },
    body: new URLSearchParams({
      email: params.email,
      password: params.password,
      rememberMe: params.rememberMe,
      csrfToken: csrfToken ?? "",
      callbackUrl: params.redirectTo,
    }),
  });

  const payload = (await response.json().catch(() => ({}))) as { url?: unknown };
  const rawUrl = typeof payload.url === "string" ? payload.url : params.redirectTo;
  const parsedUrl = new URL(rawUrl, window.location.origin);
  const error = parsedUrl.searchParams.get("error") ?? undefined;
  const code = parsedUrl.searchParams.get("code") ?? undefined;

  if (response.ok) {
    await getSession().catch(() => null);
  }

  return {
    error,
    code,
    status: response.status,
    ok: response.ok,
    url: error ? null : parsedUrl.href,
  };
}

export function LoginForm({
  forgotPasswordHref = "/forgot-password",
  termsHref = "/terms",
  privacyHref = "/privacy",
  contactHref: _contactHref = "/contact",
}: {
  forgotPasswordHref?: string;
  termsHref?: string;
  privacyHref?: string;
  /** Kept for API compatibility with marketing pages. */
  contactHref?: string;
} = {}) {
  const { t, locale } = useMarketingI18n();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { status } = useSession();
  const [error, setError] = useState<string | null>(null);
  const [errorHelp, setErrorHelp] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  /** Until true, keep submit disabled so E2E / fast users cannot trigger a native form POST before React `onSubmit` runs. */
  const [clientReady, setClientReady] = useState(false);
  /** Synchronous guard — `pending` state may not flip before a second submit in the same tick. */
  const submitInFlightRef = useRef(false);
  const urlRateLimitBannerRef = useRef(false);
  const adminRequiredBannerRef = useRef(false);
  const redirectTarget = useMemo(
    () => resolveMarketingAuthRedirectTarget(pathname ?? "/", searchParams, locale),
    [searchParams, pathname, locale],
  );
  /** Preserves `callbackUrl` (e.g. pricing + checkout intent) when switching to signup. */
  const signupHrefWithResume = useMemo(() => {
    const signupBase = withMarketingLocale(locale, "/signup");
    const rawCb = searchParams.get("callbackUrl");
    if (rawCb && rawCb.trim()) {
      return `${signupBase}?${new URLSearchParams({ callbackUrl: rawCb }).toString()}`;
    }
    return signupBase;
  }, [locale, searchParams]);

  /** Staff session present in JWT but server could not verify admin row — controlled message, not generic app error. */
  useEffect(() => {
    if (adminRequiredBannerRef.current) return;
    const err = searchParams.get("error");
    if (err !== "admin_required") return;
    adminRequiredBannerRef.current = true;
    setError(
      "We could not verify admin access with the database on your last attempt. Sign in again, then open the Admin Dashboard.",
    );
    setErrorHelp(null);
    const sp = new URLSearchParams(searchParams.toString());
    sp.delete("error");
    const qs = sp.toString();
    const base = pathname ?? "/login";
    router.replace(`${base}${qs ? `?${qs}` : ""}`);
  }, [searchParams, pathname, router]);

  /** Full-page hits to `/api/auth/*` (rate limit, stale links) — normalize to a login banner, not raw JSON. */
  useEffect(() => {
    if (urlRateLimitBannerRef.current) return;
    const err = searchParams.get("error");
    const code = searchParams.get("code");
    const isRateLimited =
      code === "rate_limit_exceeded" ||
      err === "rate_limited" ||
      (err === "AccessDenied" && code === "rate_limit_exceeded");
    if (!isRateLimited) return;
    urlRateLimitBannerRef.current = true;
    setError(t("pages.login.errorRateLimited"));
    const retryRaw = searchParams.get("retryAfterSec");
    const retrySec = retryRaw != null ? Number.parseInt(retryRaw, 10) : Number.NaN;
    setErrorHelp(
      Number.isFinite(retrySec) && retrySec > 0 ? t("pages.login.errorRateLimitedRetryHint", { seconds: retrySec }) : null,
    );
    const sp = new URLSearchParams(searchParams.toString());
    sp.delete("error");
    sp.delete("code");
    sp.delete("retryAfterSec");
    const qs = sp.toString();
    const base = pathname ?? "/login";
    router.replace(`${base}${qs ? `?${qs}` : ""}`);
  }, [searchParams, pathname, router, t]);

  useEffect(() => {
    setClientReady(true);
  }, []);

  useEffect(() => {
    if (status !== "authenticated") return;
    void refreshThenReplaceIfDifferent(router, redirectTarget, pathname ?? "/", searchParams);
  }, [status, router, redirectTarget, pathname, searchParams]);

  /**
   * Release the sync submit guard after we have left the login surface.
   * Clearing on `authenticated` alone can race: session can flip before client navigation finishes,
   * briefly allowing a second credential POST while still on `/login`.
   */
  useEffect(() => {
    if (status !== "authenticated") return;
    if (pathname.includes("/login")) return;
    submitInFlightRef.current = false;
  }, [status, pathname]);

  async function onSubmit(formData: FormData) {
    setError(null);
    setErrorHelp(null);
    if (status === "authenticated") {
      submitInFlightRef.current = false;
      await refreshThenReplaceIfDifferent(router, redirectTarget, pathname ?? "/", searchParams);
      return;
    }
    const email = String(formData.get("email") ?? "").trim();
    const password = String(formData.get("password") ?? "");
    if (!email || !password) {
      submitInFlightRef.current = false;
      setError(t("pages.login.errorInvalid"));
      const g = t("pages.login.errorInvalidGuidance")?.trim();
      setErrorHelp(g || null);
      return;
    }

    setPending(true);
    let keepSpinnerUntilRedirect = false;
    try {
      const rememberMe =
        formData.get("rememberMe") === "on" ||
        String(formData.get("rememberMe") ?? "") === "true";
      let result: CredentialSignInResult | undefined;
      try {
        const authRedirectTo = new URL(redirectTarget, window.location.origin).href;
        result = await signInWithCredentialsSafely({
          email,
          password,
          rememberMe: rememberMe ? "true" : "false",
          redirectTo: authRedirectTo,
        });
      } catch (e) {
        console.error("[login] signIn threw", e);
        const session = await getSession().catch(() => null);
        if (session?.user) {
          keepSpinnerUntilRedirect = true;
          await refreshThenReplaceIfDifferent(router, redirectTarget, pathname ?? "/", searchParams);
          return;
        }
        setError(isLikelyNetworkFailure(e) ? t("pages.login.errorNetwork") : t("pages.login.errorGeneric"));
        setErrorHelp(null);
        return;
      }

      let outcome = resolveLoginSubmitOutcome(result ?? null, false);
      if (outcome !== "success") {
        const session = await getSession().catch(() => null);
        outcome = resolveLoginSubmitOutcome(result ?? null, Boolean(session?.user));
      }

      if (outcome !== "success") {
        if (outcome === "invalid_credentials") {
          setError(t("pages.login.errorInvalid"));
          const g = t("pages.login.errorInvalidGuidance")?.trim();
          setErrorHelp(g || null);
        } else if (outcome === "rate_limited") {
          setError(t("pages.login.errorRateLimited"));
          let retryHint: string | null = null;
          const r = result as { url?: string; retryAfterSec?: unknown } | undefined;
          if (typeof r?.retryAfterSec === "number" && Number.isFinite(r.retryAfterSec) && r.retryAfterSec > 0) {
            retryHint = t("pages.login.errorRateLimitedRetryHint", { seconds: Math.ceil(r.retryAfterSec) });
          } else if (typeof r?.url === "string") {
            try {
              const u = new URL(r.url, window.location.origin);
              const s = u.searchParams.get("retryAfterSec");
              const n = s != null ? Number.parseInt(s, 10) : Number.NaN;
              if (Number.isFinite(n) && n > 0) {
                retryHint = t("pages.login.errorRateLimitedRetryHint", { seconds: n });
              }
            } catch {
              /* ignore malformed url */
            }
          }
          setErrorHelp(retryHint);
        } else {
          setError(t("pages.login.errorGeneric"));
          setErrorHelp(null);
        }
        return;
      }

      keepSpinnerUntilRedirect = true;
      try {
        await refreshThenReplaceIfDifferent(router, redirectTarget, pathname ?? "/", searchParams);
      } catch {
        keepSpinnerUntilRedirect = false;
        submitInFlightRef.current = false;
        setPending(false);
        setError(t("pages.login.errorGeneric"));
        setErrorHelp(null);
        return;
      }
    } finally {
      /** Do not clear until navigation/session settles — otherwise a second submit can POST credentials again and hit proxy rate limits while the first login still succeeds. */
      if (!keepSpinnerUntilRedirect) {
        submitInFlightRef.current = false;
        setPending(false);
      }
    }
  }

  const alreadySignedIn = status === "authenticated";
  const signUpLabel = isPlaceholderAuthCopy(t("pages.login.signUpCta"), "pages.login.signUpCta")
    ? "Create account"
    : t("pages.login.signUpCta");

  return (
    <form
      className="nn-premium-auth-form mt-6 space-y-4"
      data-nn-premium-auth-form="login"
      data-nn-auth-pending={pending ? "true" : "false"}
      aria-busy={pending}
      /** Default HTML form method is GET — a submit before React hydrates would put credentials in the URL. */
      method="post"
      onSubmit={(e) => {
        e.preventDefault();
        if (pending || submitInFlightRef.current) return;
        submitInFlightRef.current = true;
        const fd = new FormData(e.currentTarget);
        void onSubmit(fd);
      }}
    >
      {alreadySignedIn ? (
        <AuthTransitionShell
          kind="sign-in-success"
          layout="inline"
          callbackUrl={redirectTarget}
        />
      ) : null}

      <AuthField
        id="login-identifier"
        label={t("pages.login.fieldIdentifierLabel")}
        hint={t("pages.login.identifierHint")}
        hintId="login-identifier-hint"
      >
        <AuthInput
          id="login-identifier"
          type="text"
          name="email"
          placeholder={t("pages.login.placeholderIdentifier")}
          required={!alreadySignedIn}
          autoComplete="username"
          aria-describedby="login-identifier-hint"
          invalid={Boolean(error)}
          disabled={pending || alreadySignedIn}
        />
      </AuthField>
      <div className="nn-premium-auth-field">
        <div className="nn-premium-auth-label-row">
          <label htmlFor="login-password" className="nn-premium-auth-label">
            {t("pages.login.fieldPasswordLabel")}
          </label>
          <AuthTextLink href={forgotPasswordHref}>{t("pages.login.forgotPasswordLink")}</AuthTextLink>
        </div>
        <AuthInput
          id="login-password"
          type="password"
          name="password"
          placeholder={t("pages.login.placeholderPassword")}
          required={!alreadySignedIn}
          autoComplete="current-password"
          invalid={Boolean(error)}
          disabled={pending || alreadySignedIn}
        />
      </div>
      <AuthCheckbox
        id="login-remember"
        name="rememberMe"
        defaultChecked
        aria-describedby="login-remember-hint"
        label={t("pages.login.rememberMe")}
        hint={t("pages.login.rememberMeHint")}
        hintId="login-remember-hint"
        disabled={pending || alreadySignedIn}
      />
      {pending ? (
        <AuthTransitionShell
          kind="sign-in-success"
          layout="inline"
          callbackUrl={redirectTarget}
          showLoading
        />
      ) : null}

      {error ? (
        <AuthMessageBanner
          tone={authTransitionMessageTone("authentication-error")}
          stateId="validation-error"
          title={error}
          message={errorHelp}
        />
      ) : null}

      <div className="nn-premium-auth-sticky-cta">
        <AuthPrimaryButton type="submit" disabled={pending || !clientReady || alreadySignedIn} aria-busy={pending}>
          {pending ? t("pages.login.signingIn") : t("pages.login.submit")}
        </AuthPrimaryButton>
      </div>

      {!alreadySignedIn ? (
        <OAuthProviderButtonsServer
          redirectTarget={redirectTarget}
          disabled={pending || !clientReady}
          surface="login"
          marketingLocale={locale}
          dividerPlacement="trailing"
          dividerLabel="or"
        />
      ) : null}

      {!alreadySignedIn ? (
        <>
          <p className="nn-premium-auth-mobile-trust text-center text-sm">
            Trusted by nursing students nationwide
          </p>
          <p className="nn-premium-auth-switch-copy text-center text-sm">
            {t("pages.login.signUpPrompt")}{" "}
            <AuthTextLink href={signupHrefWithResume}>{signUpLabel}</AuthTextLink>
          </p>
        </>
      ) : null}
    </form>
  );
}
