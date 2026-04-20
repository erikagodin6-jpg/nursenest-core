"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { getSession, signIn, useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useMarketingI18n } from "@/lib/marketing-i18n";
import { safeCallbackPath } from "@/lib/auth/safe-callback-path";
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
  const { t } = useMarketingI18n();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { status } = useSession();
  const [error, setError] = useState<string | null>(null);
  const [errorHelp, setErrorHelp] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  /** Synchronous guard — `pending` state may not flip before a second submit in the same tick. */
  const submitInFlightRef = useRef(false);
  const redirectTarget = useMemo(() => {
    const fromQuery = safeCallbackPath(searchParams.get("callbackUrl"));
    return fromQuery ?? "/app";
  }, [searchParams]);

  useEffect(() => {
    if (status === "authenticated") {
      router.replace(redirectTarget);
    }
  }, [status, router, redirectTarget]);

  async function onSubmit(formData: FormData) {
    setError(null);
    setErrorHelp(null);
    const email = String(formData.get("email") ?? "").trim();
    const password = String(formData.get("password") ?? "");
    if (!email || !password) {
      setError(t("pages.login.errorInvalid"));
      const g = t("pages.login.errorInvalidGuidance")?.trim();
      setErrorHelp(g || null);
      return;
    }
    if (status === "authenticated") {
      router.replace(redirectTarget);
      return;
    }

    if (submitInFlightRef.current) {
      return;
    }
    submitInFlightRef.current = true;
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
          await router.refresh();
          router.push(redirectTarget);
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
          setErrorHelp(null);
        } else {
          setError(t("pages.login.errorGeneric"));
          setErrorHelp(null);
        }
        return;
      }

      keepSpinnerUntilRedirect = true;
      await router.refresh();
      router.push(redirectTarget);
    } finally {
      submitInFlightRef.current = false;
      if (!keepSpinnerUntilRedirect) {
        setPending(false);
      }
    }
  }

  if (status === "authenticated") {
    return (
      <p className="mt-6 text-sm text-muted-foreground" role="status">
        {t("pages.login.alreadySignedIn")}
      </p>
    );
  }

  return (
    <form
      className="mt-6 space-y-4"
      onSubmit={(e) => {
        e.preventDefault();
        if (pending) return;
        const fd = new FormData(e.currentTarget);
        void onSubmit(fd);
      }}
    >
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
          required
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
          required
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
    </form>
  );
}
