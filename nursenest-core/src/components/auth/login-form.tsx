"use client";

import Link from "next/link";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useMarketingI18n } from "@/lib/marketing-i18n";

function safeCallbackPath(raw: string | null): string | null {
  if (!raw?.trim()) return null;
  try {
    const origin = typeof window !== "undefined" ? window.location.origin : "http://localhost";
    const u = new URL(raw, origin);
    if (u.origin !== new URL(origin).origin) return null;
    if (!u.pathname.startsWith("/")) return null;
    return `${u.pathname}${u.search}${u.hash}`;
  } catch {
    return null;
  }
}

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
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(formData: FormData) {
    setError(null);
    const email = String(formData.get("email") ?? "").trim();
    const password = String(formData.get("password") ?? "");
    const fromQuery = safeCallbackPath(searchParams.get("callbackUrl"));
    const redirectTarget = fromQuery ?? "/app";

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
      redirectTo: redirectTarget,
    });

    if (result?.error) {
      setError(t("pages.login.errorInvalid"));
      return;
    }
    if (result && result.ok === false) {
      setError(t("pages.login.errorGeneric"));
      return;
    }

    router.refresh();
    router.push(redirectTarget);
  }

  return (
    <form
      className="mt-6 space-y-4"
      onSubmit={(e) => {
        e.preventDefault();
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
          className="w-full rounded-xl border border-border bg-white px-3 py-2"
          type="text"
          name="email"
          placeholder={t("pages.login.placeholderIdentifier")}
          required
          autoComplete="username"
        />
      </div>
      <div className="space-y-1.5">
        <input
          className="w-full rounded-xl border border-border bg-white px-3 py-2"
          type="password"
          name="password"
          placeholder={t("pages.login.placeholderPassword")}
          required
        />
        <div className="flex justify-end sm:justify-start">
          <Link href={forgotPasswordHref} className="text-sm font-medium text-primary hover:underline">
            {t("pages.login.forgotPasswordLink")}
          </Link>
        </div>
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
      <button className="w-full rounded-xl bg-role-cta px-4 py-2 font-semibold text-role-cta-foreground" type="submit">
        {t("pages.login.submit")}
      </button>
    </form>
  );
}
