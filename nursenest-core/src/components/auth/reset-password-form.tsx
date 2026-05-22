"use client";

import { useMemo, useState } from "react";
import { AuthTransitionShell } from "@/components/auth/auth-experience/auth-transition-shell";

type Props = {
  token: string;
  backToLoginHref: string;
  submitLabel: string;
  savingLabel?: string;
  errorGeneric: string;
  passwordLabel: string;
  confirmLabel: string;
  mismatchMessage: string;
  weakPasswordMessage: string;
};

export function ResetPasswordForm({
  token,
  backToLoginHref,
  submitLabel,
  savingLabel = "Saving\u2026",
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
      <div className="nn-premium-auth-form mt-6" data-nn-premium-auth-error-state>
        <AuthTransitionShell
          kind="magic-link-confirmation"
          layout="panel"
          magicLinkVariant="invalid"
          primaryActionHref={backToLoginHref}
        />
      </div>
    );
  }

  if (done) {
    return (
      <div className="nn-premium-auth-form mt-6" data-nn-premium-auth-reset-success>
        <AuthTransitionShell
          kind="password-reset-success"
          layout="panel"
          primaryActionHref={backToLoginHref}
        />
      </div>
    );
  }

  return (
    <form action={onSubmit} className="nn-premium-auth-form mt-6 space-y-4" data-nn-premium-auth-form="reset-password">
      <input
        className="nn-premium-auth-input w-full rounded-xl border border-border bg-white px-3 py-2"
        type="password"
        name="password"
        placeholder={passwordLabel}
        required
        minLength={8}
        autoComplete="new-password"
        disabled={loading}
      />
      <input
        className="nn-premium-auth-input w-full rounded-xl border border-border bg-white px-3 py-2"
        type="password"
        name="confirm"
        placeholder={confirmLabel}
        required
        minLength={8}
        autoComplete="new-password"
        disabled={loading}
      />
      {error ? <p className="nn-premium-auth-alert rounded-xl px-3 py-2 text-sm text-[var(--semantic-text-primary)]">{error}</p> : null}
      <button className="nn-premium-auth-primary-button w-full rounded-xl bg-primary px-4 py-2 font-semibold text-primary-foreground disabled:opacity-60" type="submit" disabled={loading}>
        {loading ? savingLabel : submitLabel}
      </button>
    </form>
  );
}
