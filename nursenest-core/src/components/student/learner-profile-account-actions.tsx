"use client";

import Link from "next/link";
import { signOut } from "next-auth/react";
import { useState } from "react";

export function LearnerProfileAccountActions({
  hasPassword,
  showBillingPortal,
}: {
  hasPassword: boolean;
  showBillingPortal: boolean;
}) {
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
      const data = (await res.json()) as { ok?: boolean; error?: string; signOutRecommended?: boolean };
      if (!res.ok || !data.ok) {
        setError(data.error ?? "Could not update password.");
        return;
      }
      setMessage(data.error ?? "Password updated.");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      if (data.signOutRecommended) {
        await signOut({ callbackUrl: "/login" });
      }
    } catch {
      setError("Network error.");
    } finally {
      setBusy(false);
    }
  }

  async function openBillingPortal() {
    setBillingBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/billing/portal", { method: "POST" });
      const data = (await res.json()) as { url?: string; error?: string };
      if (!res.ok || !data.url) {
        setError(data.error ?? "Billing portal unavailable.");
        return;
      }
      window.location.href = data.url;
    } catch {
      setError("Could not open billing portal.");
    } finally {
      setBillingBusy(false);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-semibold text-[var(--theme-heading-text)]">Password</h3>
        {!hasPassword ? (
          <p className="mt-2 text-sm text-muted-foreground">
            This account does not use a NurseNest password yet. Use{" "}
            <Link className="font-medium text-primary underline" href="/forgot-password">
              forgot password
            </Link>{" "}
            with your email to set one.
          </p>
        ) : (
          <form onSubmit={(e) => void changePassword(e)} className="mt-3 max-w-md space-y-3">
            <label className="block text-sm">
              <span className="text-muted-foreground">Current password</span>
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
              <span className="text-muted-foreground">New password</span>
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
              <span className="text-muted-foreground">Confirm new password</span>
              <input
                type="password"
                autoComplete="new-password"
                className="mt-1 w-full rounded-lg border border-border px-3 py-2 text-sm"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </label>
            <p className="text-xs text-muted-foreground">
              Use at least 8 characters with a letter and a number.
            </p>
            <button
              type="submit"
              disabled={busy}
              className="rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground disabled:opacity-50"
            >
              {busy ? "Updating…" : "Update password"}
            </button>
          </form>
        )}
        {hasPassword ? (
          <p className="mt-3 text-xs text-muted-foreground">
            Forgot it?{" "}
            <Link className="font-medium text-primary underline" href="/forgot-password">
              Email reset link
            </Link>
          </p>
        ) : null}
      </div>

      <div className="border-t border-border/60 pt-6">
        <h3 className="text-sm font-semibold text-[var(--theme-heading-text)]">Billing & subscription</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Update payment method, view invoices, or cancel in Stripe’s secure portal when your plan is billed through
          Stripe.
        </p>
        {showBillingPortal ? (
          <button
            type="button"
            disabled={billingBusy}
            onClick={() => void openBillingPortal()}
            className="mt-3 rounded-xl border border-primary/30 bg-primary/10 px-4 py-2 text-sm font-semibold text-primary disabled:opacity-50"
          >
            {billingBusy ? "Opening…" : "Manage billing in Stripe"}
          </button>
        ) : (
          <p className="mt-3 text-sm text-muted-foreground">
            No Stripe customer linked yet.{" "}
            <Link href="/pricing" className="font-medium text-primary underline">
              View plans
            </Link>
          </p>
        )}
      </div>

      {error ? (
        <p className="text-sm text-red-700 dark:text-red-300" role="alert">
          {error}
        </p>
      ) : null}
      {message ? (
        <p className="text-sm text-emerald-800 dark:text-emerald-200" role="status">
          {message}
        </p>
      ) : null}
    </div>
  );
}
