"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

type Props = {
  token: string;
  backToLoginHref: string;
  backToLoginLabel: string;
  submitLabel: string;
  successMessage: string;
  errorGeneric: string;
  passwordLabel: string;
  confirmLabel: string;
  mismatchMessage: string;
  weakPasswordMessage: string;
};

export function ResetPasswordForm({
  token,
  backToLoginHref,
  backToLoginLabel,
  submitLabel,
  successMessage,
  errorGeneric,
  passwordLabel,
  confirmLabel,
  mismatchMessage,
  weakPasswordMessage,
}: Props) {
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const hasToken = useMemo(() => token.length >= 20, [token]);

  async function onSubmit(formData: FormData) {
    setError(null);
    const password = String(formData.get("password") ?? "");
    const confirm = String(formData.get("confirm") ?? "");
    if (password.length < 8) {
      setError(weakPasswordMessage);
      return;
    }
    if (password !== confirm) {
      setError(mismatchMessage);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });
      const data = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string; message?: string };
      if (!res.ok) {
        setError(data.error ?? errorGeneric);
        return;
      }
      setDone(true);
    } catch {
      setError(errorGeneric);
    } finally {
      setLoading(false);
    }
  }

  if (!hasToken) {
    return (
      <div className="mt-6 space-y-4">
        <p className="text-sm text-red-600">{errorGeneric}</p>
        <Link className="inline-block text-sm font-semibold text-primary hover:underline" href={backToLoginHref}>
          {backToLoginLabel}
        </Link>
      </div>
    );
  }

  if (done) {
    return (
      <div className="mt-6 space-y-4">
        <p className="text-sm text-green-700">{successMessage}</p>
        <Link className="nn-btn-primary inline-flex w-full justify-center rounded-xl px-4 py-2 font-bold" href={backToLoginHref}>
          {backToLoginLabel}
        </Link>
      </div>
    );
  }

  return (
    <form action={onSubmit} className="mt-6 space-y-4">
      <input
        className="w-full rounded-xl border border-border bg-white px-3 py-2"
        type="password"
        name="password"
        placeholder={passwordLabel}
        required
        minLength={8}
        autoComplete="new-password"
        disabled={loading}
      />
      <input
        className="w-full rounded-xl border border-border bg-white px-3 py-2"
        type="password"
        name="confirm"
        placeholder={confirmLabel}
        required
        minLength={8}
        autoComplete="new-password"
        disabled={loading}
      />
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      <button className="w-full rounded-xl bg-primary px-4 py-2 font-semibold text-primary-foreground disabled:opacity-60" type="submit" disabled={loading}>
        {loading ? "Saving…" : submitLabel}
      </button>
    </form>
  );
}
