"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { getSession, signIn, useSession } from "next-auth/react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useMarketingI18n } from "@/lib/marketing-i18n";
import { withMarketingLocale } from "@/lib/i18n/marketing-path";
import { refreshThenReplaceIfDifferent } from "@/lib/auth/post-login-client-navigation";
import { resolveMarketingAuthRedirectTarget } from "@/lib/auth/post-login-resume-path";
import { resolveLoginSubmitOutcome } from "@/components/auth/login-form-result";
import { isLikelyNetworkFailure } from "@/components/auth/auth-client-error-handling";

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
      let result: Awaited<ReturnType<typeof signIn>> | undefined;
      try {
        result = await signIn("credentials", {
          email,
          password,
          rememberMe: rememberMe ? "true" : "false",
          redirect: false,
          redirectTo: redirectTarget,
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

  return (
    <form
      className="mt-6 space-y-4"
      onSubmit={(e) => {
        e.preventDefault();
        if (pending || submitInFlightRef.current) return;
        submitInFlightRef.current = true;
        const fd = new FormData(e.currentTarget);
        void onSubmit(fd);
      }}
    >
      {alreadySignedIn ? (
        <p className="text-sm text-muted-foreground" role="status">
          {t("pages.login.alreadySignedIn")}
        </p>
      ) : null}
      <div className="space-y-1.5">
        <label htmlFor="login-identifier" className="text-sm font-medium text-foreground">
          {t("pages.login.fieldIdentifierLabel")}
        </label>
        <input
          id="login-identifier"
          className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color-mix(in_srgb,var(--primary)_30%,transparent)]"
          type="text"
          name="email"
          placeholder={t("pages.login.placeholderIdentifier")}
          required={!alreadySignedIn}
          autoComplete="username"
          aria-describedby="login-identifier-hint"
        />
        <p id="login-identifier-hint" className="text-xs leading-relaxed text-muted-foreground">
          {t("pages.login.identifierHint")}
        </p>
      </div>
      <div className="space-y-1.5">
        <div className="flex items-center justify-between gap-2">
          <label htmlFor="login-password" className="text-sm font-medium text-foreground">
            {t("pages.login.fieldPasswordLabel")}
          </label>
          <Link href={forgotPasswordHref} className="text-sm font-medium text-primary hover:underline">
            {t("pages.login.forgotPasswordLink")}
          </Link>
        </div>
        <input
          id="login-password"
          className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color-mix(in_srgb,var(--primary)_30%,transparent)]"
          type="password"
          name="password"
          placeholder={t("pages.login.placeholderPassword")}
          required={!alreadySignedIn}
          autoComplete="current-password"
        />
      </div>
      <div className="flex items-start gap-2.5">
        <input
          id="login-remember"
          className="mt-1 h-4 w-4 shrink-0 rounded border border-border text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color-mix(in_srgb,var(--primary)_30%,transparent)]"
          type="checkbox"
          name="rememberMe"
          defaultChecked
          aria-describedby="login-remember-hint"
        />
        <div className="min-w-0 space-y-0.5">
          <label htmlFor="login-remember" className="text-sm font-medium text-foreground">
            {t("pages.login.rememberMe")}
          </label>
          <p id="login-remember-hint" className="text-xs text-muted-foreground">
            {t("pages.login.rememberMeHint")}
          </p>
        </div>
      </div>
      {error || errorHelp ? (
        <div
          role="alert"
          aria-live="polite"
          className="rounded-xl border border-[color-mix(in_srgb,var(--semantic-danger)_35%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-danger)_10%,var(--semantic-surface))] px-3 py-2.5 text-[var(--semantic-text-primary)]"
        >
          {error ? <p className="text-sm font-medium">{error}</p> : null}
          {errorHelp ? <p className="mt-1 text-xs leading-relaxed text-[var(--semantic-text-secondary)]">{errorHelp}</p> : null}
        </div>
      ) : null}
      <p className="text-xs leading-relaxed text-muted-foreground">
        {t("pages.login.legalBefore")}
        <Link href={termsHref} className="font-semibold text-primary underline-offset-4 hover:underline">
          {t("pages.login.termsLink")}
        </Link>
        {t("pages.login.legalAnd")}
        <Link href={privacyHref} className="font-semibold text-primary underline-offset-4 hover:underline">
          {t("pages.login.privacyLink")}
        </Link>
        {t("pages.login.legalAfter")}
      </p>
      <button
        className="w-full rounded-xl bg-role-cta px-4 py-3 text-sm font-semibold text-role-cta-foreground transition hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color-mix(in_srgb,var(--primary)_40%,transparent)] disabled:pointer-events-none disabled:opacity-60"
        type="submit"
        disabled={pending}
      >
        {pending ? t("pages.login.signingIn") : t("pages.login.submit")}
      </button>
      {!alreadySignedIn ? (
        <p className="text-center text-sm text-muted-foreground">
          {t("pages.login.signUpPrompt")}{" "}
          <Link href={signupHrefWithResume} className="font-semibold text-primary underline-offset-4 hover:underline">
            {t("pages.login.signUpCta")}
          </Link>
        </p>
      ) : null}
    </form>
  );
}
