"use client";

import Link from "next/link";
import { signOut } from "next-auth/react";
import { useState } from "react";
import { useMarketingI18n } from "@/lib/marketing-i18n";
import { trackClientEvent } from "@/lib/observability/posthog-client";

export function LearnerProfileAccountActions({
  hasPassword,
  showBillingPortal,
  variant = "full",
}: {
  hasPassword: boolean;
  showBillingPortal: boolean;
  /** `passwordOnly` / `billingOnly` for focused account subpages. */
  variant?: "full" | "passwordOnly" | "billingOnly";
}) {
  const { t } = useMarketingI18n();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [billingBusy, setBillingBusy] = useState(false);

  async function changePassword(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setMessage(null);
    setBusy(true);
    try {
      const res = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword, confirmPassword }),
      });
      const data = (await res.json()) as {
        ok?: boolean;
        error?: string;
        message?: string;
        signOutRecommended?: boolean;
      };
      if (!res.ok || !data.ok) {
        setError(data.error ?? t("learner.security.changePasswordFailed"));
        return;
      }
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      if (data.signOutRecommended) {
        await signOut({ redirectTo: "/login" });
        return;
      }
      setMessage(data.message ?? t("learner.security.passwordUpdatedFallback"));
    } catch {
      setError(t("learner.security.networkError"));
    } finally {
      setBusy(false);
    }
  }

  async function openBillingPortal() {
    setBillingBusy(true);
    setError(null);
    trackClientEvent("billing_portal_opened", { surface: "account_actions" });
    try {
      const res = await fetch("/api/billing/portal", { method: "POST" });
      const data = (await res.json()) as { url?: string; error?: string };
      if (!res.ok || !data.url) {
        setError(data.error ?? t("learner.accountActions.billingPortalUnavailable"));
        return;
      }
      window.location.href = data.url;
    } catch {
      setError(t("learner.accountActions.billingPortalOpenFailed"));
    } finally {
      setBillingBusy(false);
    }
  }

  const showPassword = variant === "full" || variant === "passwordOnly";
  const showBilling = variant === "full" || variant === "billingOnly";

  return (
    <div className="space-y-6">
      {showPassword ? (
      <div>
        <h3 className="text-sm font-semibold text-[var(--theme-heading-text)]">{t("learner.security.passwordHeading")}</h3>
        {!hasPassword ? (
          <p className="mt-2 text-sm text-muted-foreground">
            {t("learner.security.noPasswordBefore")}{" "}
            <Link className="font-medium text-primary underline" href="/forgot-password">
              {t("learner.security.noPasswordLink")}
            </Link>{" "}
            {t("learner.security.noPasswordAfter")}
          </p>
        ) : (
          <form onSubmit={(e) => void changePassword(e)} className="mt-3 max-w-md space-y-3">
            <label className="block text-sm">
              <span className="text-muted-foreground">{t("learner.security.currentPasswordLabel")}</span>
              <input
                type="password"
                autoComplete="current-password"
                className="mt-1 w-full rounded-lg border border-border px-3 py-2 text-sm"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
              />
            </label>
            <label className="block text-sm">
              <span className="text-muted-foreground">{t("learner.security.newPasswordLabel")}</span>
              <input
                type="password"
                autoComplete="new-password"
                className="mt-1 w-full rounded-lg border border-border px-3 py-2 text-sm"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                minLength={8}
              />
            </label>
            <label className="block text-sm">
              <span className="text-muted-foreground">{t("learner.security.confirmPasswordLabel")}</span>
              <input
                type="password"
                autoComplete="new-password"
                className="mt-1 w-full rounded-lg border border-border px-3 py-2 text-sm"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </label>
            <p className="text-xs text-muted-foreground">{t("learner.security.passwordPolicyHint")}</p>
            <button
              type="submit"
              disabled={busy}
              className="rounded-xl bg-role-cta px-4 py-2 text-sm font-semibold text-role-cta-foreground disabled:opacity-50"
            >
              {busy ? t("learner.security.updatingPassword") : t("learner.security.updatePassword")}
            </button>
          </form>
        )}
        {hasPassword ? (
          <p className="mt-3 text-xs text-muted-foreground">
            {t("learner.security.forgotInlineBefore")}{" "}
            <Link className="font-medium text-primary underline" href="/forgot-password">
              {t("learner.security.forgotInlineLink")}
            </Link>
          </p>
        ) : null}
      </div>
      ) : null}

      {showBilling ? (
      <div className={showPassword ? "border-t border-border/60 pt-6" : ""}>
        <h3 className="text-sm font-semibold text-[var(--theme-heading-text)]">{t("learner.accountActions.billingHeading")}</h3>
        <p className="mt-1 text-sm text-muted-foreground">{t("learner.accountActions.billingBody")}</p>
        {showBillingPortal ? (
          <button
            type="button"
            disabled={billingBusy}
            onClick={() => void openBillingPortal()}
            className="mt-3 rounded-xl border border-role-cta/35 bg-role-cta-soft px-4 py-2 text-sm font-semibold text-role-cta-on-soft disabled:opacity-50"
          >
            {billingBusy ? t("learner.accountActions.billingOpening") : t("learner.accountActions.billingCta")}
          </button>
        ) : (
          <p className="mt-3 text-sm text-muted-foreground">
            {t("learner.accountActions.billingNoCustomerBefore")}{" "}
            <Link href="/pricing" className="font-medium text-primary underline">
              {t("learner.accountActions.billingViewPlans")}
            </Link>
          </p>
        )}
      </div>
      ) : null}

      {showBilling ? (
      <div className="border-t border-border/60 pt-6">
        <h3 className="text-sm font-semibold text-[var(--theme-heading-text)]">{t("learner.accountActions.policiesHeading")}</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          {showBillingPortal ? t("learner.accountActions.policiesBodyWithPortal") : t("learner.accountActions.policiesBodyNoPortal")}
        </p>
        <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-sm">
          <li>
            <Link className="font-medium text-primary underline" href="/terms">
              {t("learner.accountActions.linkTerms")}
            </Link>
          </li>
          <li>
            <Link className="font-medium text-primary underline" href="/privacy">
              {t("learner.accountActions.linkPrivacy")}
            </Link>
          </li>
          <li>
            <Link className="font-medium text-primary underline" href="/refund-policy">
              {t("learner.accountActions.linkRefunds")}
            </Link>
          </li>
          <li>
            <Link className="font-medium text-primary underline" href="/acceptable-use">
              {t("learner.accountActions.linkAcceptableUse")}
            </Link>
          </li>
          <li>
            <Link className="font-medium text-primary underline" href="/contact">
              {t("learner.accountActions.linkContact")}
            </Link>
          </li>
        </ul>
      </div>
      ) : null}

      {error ? (
        <p className="text-sm text-[var(--semantic-danger-contrast)]" role="alert">
          {error}
        </p>
      ) : null}
      {message ? (
        <p className="text-sm text-role-success" role="status">
          {message}
        </p>
      ) : null}
    </div>
  );
}
