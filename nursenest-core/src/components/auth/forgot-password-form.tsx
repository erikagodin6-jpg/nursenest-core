"use client";

import { useState } from "react";
import { AuthMessageBanner } from "@/components/auth/auth-experience/auth-message-banner";
import { AuthTransitionShell } from "@/components/auth/auth-experience/auth-transition-shell";
import {
  AuthField,
  AuthInlineLink,
  AuthInput,
  AuthPrimaryButton,
} from "@/components/auth/auth-experience/auth-primitives";
import { isLikelyNetworkFailure } from "@/components/auth/auth-client-error-handling";
import { authTransitionMessageTone } from "@/lib/auth/auth-transition-governance";

type Props = {
  backToLoginHref: string;
  backToLoginLabel: string;
  submitLabel: string;
  sendingLabel?: string;
  /** Fallback when the server returns an error without a safe `error` string. */
  errorMessage: string;
  /** Prefer over `errorMessage` for likely offline / failed-fetch cases. */
  errorNetwork?: string;
  /** Prefer over `errorMessage` for server-side failures (5xx / opaque errors). */
  errorServer?: string;
  notEmailMessage?: string;
  emailPlaceholder: string;
  emailLabel?: string;
};

export function ForgotPasswordForm({
  backToLoginHref,
  backToLoginLabel,
  submitLabel,
  sendingLabel = "Sending\u2026",
  errorMessage,
  errorNetwork,
  errorServer,
  notEmailMessage = "Password reset uses the email on your account. Please enter your email address, not your username.",
  emailPlaceholder,
  emailLabel = "Email address",
}: Props) {
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [devUrl, setDevUrl] = useState<string | null>(null);

  const networkCopy = errorNetwork ?? errorMessage;
  const serverCopy = errorServer ?? errorMessage;

  async function submitForgotPassword(formData: FormData) {
    if (loading) return;
    setError(null);
    setDevUrl(null);
    setLoading(true);
    try {
      const email = String(formData.get("email") ?? "").trim();
      if (email.length > 0 && !email.includes("@")) {
        setError(notEmailMessage);
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
        const fromApi = typeof data.error === "string" && data.error.trim().length > 0 ? data.error.trim() : null;
        setError(fromApi ?? serverCopy);
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
      if (aborted) {
        setError(networkCopy);
        return;
      }
      setError(isLikelyNetworkFailure(e) ? networkCopy : serverCopy);
    } finally {
      setLoading(false);
    }
  }

  if (done) {
    return (
      <div className="nn-premium-auth-form mt-6 space-y-4" data-nn-premium-auth-email-sent>
        <AuthTransitionShell kind="account-recovery" layout="panel" primaryActionHref={backToLoginHref} />
        {devUrl ? (
          <p className="nn-premium-auth-dev-notice">
            <span className="font-semibold">Development only:</span> reset link{" "}
            <a href={devUrl}>open reset page</a>
          </p>
        ) : null}
      </div>
    );
  }

  return (
    <form
      className="nn-premium-auth-form mt-6 space-y-4"
      data-nn-premium-auth-form="forgot-password"
      data-nn-auth-pending={loading ? "true" : undefined}
      aria-busy={loading}
      onSubmit={(e) => {
        e.preventDefault();
        if (loading) return;
        void submitForgotPassword(new FormData(e.currentTarget));
      }}
    >
      <AuthField id="forgot-email" label={emailLabel}>
        <AuthInput
          id="forgot-email"
          type="text"
          name="email"
          inputMode="email"
          placeholder={emailPlaceholder}
          required
          autoComplete="email"
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
        {loading ? sendingLabel : submitLabel}
      </AuthPrimaryButton>
      <AuthInlineLink href={backToLoginHref}>{backToLoginLabel}</AuthInlineLink>
    </form>
  );
}
