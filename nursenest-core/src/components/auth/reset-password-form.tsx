"use client";

import { useMemo, useState } from "react";
import { AuthMessageBanner } from "@/components/auth/auth-experience/auth-message-banner";
import { AuthTransitionShell } from "@/components/auth/auth-experience/auth-transition-shell";
import { AuthField, AuthInput, AuthPrimaryButton } from "@/components/auth/auth-experience/auth-primitives";
import { authTransitionMessageTone } from "@/lib/auth/auth-transition-governance";

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
    <form
      className="nn-premium-auth-form mt-6 space-y-4"
      data-nn-premium-auth-form="reset-password"
      data-nn-auth-pending={loading ? "true" : undefined}
      method="post"
      aria-busy={loading}
      onSubmit={(e) => {
        e.preventDefault();
        if (loading) return;
        void onSubmit(new FormData(e.currentTarget));
      }}
    >
      <AuthField id="reset-password" label={passwordLabel}>
        <AuthInput
          id="reset-password"
          type="password"
          name="password"
          placeholder={passwordLabel}
          required
          minLength={8}
          autoComplete="new-password"
          disabled={loading}
          invalid={Boolean(error)}
        />
      </AuthField>
      <AuthField id="reset-password-confirm" label={confirmLabel}>
        <AuthInput
          id="reset-password-confirm"
          type="password"
          name="confirm"
          placeholder={confirmLabel}
          required
          minLength={8}
          autoComplete="new-password"
          disabled={loading}
          invalid={Boolean(error)}
        />
      </AuthField>
      {error ? (
        <AuthMessageBanner
          tone={authTransitionMessageTone("authentication-error")}
          stateId="validation-error"
          title={error}
        />
      ) : null}
      <AuthPrimaryButton type="submit" disabled={loading} aria-busy={loading}>
        {loading ? savingLabel : submitLabel}
      </AuthPrimaryButton>
    </form>
  );
}
