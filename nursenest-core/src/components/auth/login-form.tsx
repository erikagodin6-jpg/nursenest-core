"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { getSession, signIn, useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useMarketingI18n } from "@/lib/marketing-i18n";
import { safeCallbackPath } from "@/lib/auth/safe-callback-path";
import { resolveLoginSubmitOutcome } from "@/components/auth/login-form-result";

export function LoginForm({
  forgotPasswordHref = "/forgot-password",
  termsHref = "/terms",
  privacyHref = "/privacy",
}: {
  forgotPasswordHref?: string;
  termsHref?: string;
  privacyHref?: string;
} = {}) {
  const { t } = useMarketingI18n();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { status } = useSession();
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
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
    const email = String(formData.get("email") ?? "").trim();
    const password = String(formData.get("password") ?? "");
    if (!email || !password) {
      setError(t("pages.login.errorInvalid"));
      return;
    }
    if (status === "authenticated") {
      router.replace(redirectTarget);
      return;
    }

    setPending(true);
    try {
      let result: Awaited<ReturnType<typeof signIn>>;
      try {
        result = await signIn("credentials", {
          email,
          password,
          redirect: false,
          redirectTo: redirectTarget,
        });
      } catch (e) {
        console.error("[login] signIn threw", e);
        setError(t("pages.login.errorGeneric"));
        return;
      }

      let outcome = resolveLoginSubmitOutcome(result, false);
      if (outcome !== "success") {
        const session = await getSession().catch(() => null);
        outcome = resolveLoginSubmitOutcome(result, Boolean(session?.user));
      }

      if (outcome !== "success") {
        if (outcome === "invalid_credentials") {
          setError(t("pages.login.errorInvalid"));
        } else {
          setError(t("pages.login.errorGeneric"));
        }
        return;
      }

      router.refresh();
      router.push(redirectTarget);
    } finally {
      setPending(false);
    }
  }

  if (status === "authenticated") {
    return <p className="mt-6 text-sm text-muted-foreground">You are already signed in. Redirecting...</p>;
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
        />
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
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
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
        {pending ? `${t("pages.login.submit")}…` : t("pages.login.submit")}
      </button>
    </form>
  );
}
