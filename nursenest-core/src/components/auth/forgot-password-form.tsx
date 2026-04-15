"use client";

import Link from "next/link";
import { useState } from "react";

type Props = {
  backToLoginHref: string;
  backToLoginLabel: string;
  submitLabel: string;
  sendingLabel?: string;
  successMessage: string;
  errorMessage: string;
  notEmailMessage?: string;
  emailPlaceholder: string;
};

export function ForgotPasswordForm({
  backToLoginHref,
  backToLoginLabel,
  submitLabel,
  sendingLabel = "Sending\u2026",
  successMessage,
  errorMessage,
  notEmailMessage = "Password reset uses the email on your account. Please enter your email address, not your username.",
  emailPlaceholder,
}: Props) {
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [devUrl, setDevUrl] = useState<string | null>(null);

  async function submitForgotPassword(formData: FormData) {
    setError(null);
    setDevUrl(null);
    setLoading(true);
    try {
      const email = String(formData.get("email") ?? "").trim();
      if (email.length > 0 && !email.includes("@")) {
        setError(notEmailMessage);
        setLoading(false);
        return;
      }
      const url =
        typeof window !== "undefined"
          ? `${window.location.origin}/api/auth/forgot-password`
          : "/api/auth/forgot-password";
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
        signal: AbortSignal.timeout(25_000),
      });
      const raw = await res.text();
      let data = {} as {
        ok?: boolean;
        message?: string;
        error?: string;
        _devResetUrl?: string;
      };
      if (raw.length > 0) {
        try {
          data = JSON.parse(raw) as typeof data;
        } catch {
          /* non-JSON error page */
        }
      }
      if (!res.ok) {
        const msg =
          typeof data.error === "string" && data.error.length > 0
            ? data.error
            : `Request failed (${res.status}). ${errorMessage}`;
        setError(msg);
        return;
      }
      setDone(true);
      if (typeof data._devResetUrl === "string" && data._devResetUrl.length > 0) {
        setDevUrl(data._devResetUrl);
      }
    } catch (e) {
      const aborted =
        (e instanceof DOMException && e.name === "AbortError") ||
        (e instanceof Error && (e.name === "AbortError" || /aborted/i.test(e.message)));
      setError(aborted ? "Request timed out. Your network or the server may be slow — try again in a moment." : errorMessage);
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
    <form
      className="mt-6 space-y-4"
      onSubmit={(e) => {
        e.preventDefault();
        void submitForgotPassword(new FormData(e.currentTarget));
      }}
    >
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
        {loading ? sendingLabel : submitLabel}
      </button>
      <Link className="block text-center text-sm font-semibold text-primary hover:underline" href={backToLoginHref}>
        {backToLoginLabel}
      </Link>
    </form>
  );
}
