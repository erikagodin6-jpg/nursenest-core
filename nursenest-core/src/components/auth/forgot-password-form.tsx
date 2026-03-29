"use client";

import Link from "next/link";
import { useState } from "react";

type Props = {
  backToLoginHref: string;
  backToLoginLabel: string;
  submitLabel: string;
  successMessage: string;
  errorMessage: string;
  emailPlaceholder: string;
};

export function ForgotPasswordForm({
  backToLoginHref,
  backToLoginLabel,
  submitLabel,
  successMessage,
  errorMessage,
  emailPlaceholder,
}: Props) {
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [devUrl, setDevUrl] = useState<string | null>(null);

  async function onSubmit(formData: FormData) {
    setError(null);
    setDevUrl(null);
    setLoading(true);
    try {
      const email = String(formData.get("email") ?? "").trim();
      if (email.length > 0 && !email.includes("@")) {
        setError(
          "Password reset uses the email on your account. Please enter your email address, not your username.",
        );
        setLoading(false);
        return;
      }
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = (await res.json().catch(() => ({}))) as {
        ok?: boolean;
        message?: string;
        error?: string;
        _devResetUrl?: string;
      };
      if (!res.ok) {
        setError(data.error ?? errorMessage);
        return;
      }
      setDone(true);
      if (typeof data._devResetUrl === "string" && data._devResetUrl.length > 0) {
        setDevUrl(data._devResetUrl);
      }
    } catch {
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }

  if (done) {
    return (
      <div className="mt-6 space-y-4">
        <p className="text-sm text-muted">{successMessage}</p>
        {devUrl ? (
          <p className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs break-all text-amber-950">
            <span className="font-semibold">Development only:</span> reset link{" "}
            <a className="underline" href={devUrl}>
              open reset page
            </a>
          </p>
        ) : null}
        <Link className="inline-block text-sm font-semibold text-primary hover:underline" href={backToLoginHref}>
          {backToLoginLabel}
        </Link>
      </div>
    );
  }

  return (
    <form action={onSubmit} className="mt-6 space-y-4">
      <input
        className="w-full rounded-xl border border-border bg-white px-3 py-2"
        type="text"
        name="email"
        inputMode="email"
        placeholder={emailPlaceholder}
        required
        autoComplete="email"
        disabled={loading}
      />
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      <button className="w-full rounded-xl bg-primary px-4 py-2 font-semibold text-primary-foreground disabled:opacity-60" type="submit" disabled={loading}>
        {loading ? "Sending…" : submitLabel}
      </button>
      <Link className="block text-center text-sm font-semibold text-primary hover:underline" href={backToLoginHref}>
        {backToLoginLabel}
      </Link>
    </form>
  );
}
