"use client";

import { signOut } from "next-auth/react";
import Link from "next/link";
import { useMemo, useState } from "react";
import {
  ACCOUNT_DELETION_BILLING_WARNING,
  ACCOUNT_DELETION_CONFIRMATION_PHRASE,
  ACCOUNT_DELETION_RETAINED_RECORDS_COPY,
} from "@/lib/account/account-deletion-copy";

type AccountDeleteDangerZoneProps = {
  userEmail: string;
  billingHref?: string;
};

const affectedData = [
  "profile/account access",
  "study progress",
  "flashcards/progress",
  "practice/CAT exam history",
  "readiness reports/analytics",
  "saved learner settings",
] as const;

export function AccountDeleteDangerZone({
  userEmail,
  billingHref = "/app/account/billing",
}: AccountDeleteDangerZoneProps) {
  const [open, setOpen] = useState(false);
  const [confirmation, setConfirmation] = useState("");
  const [checked, setChecked] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const confirmationValid = useMemo(() => {
    const normalized = confirmation.trim();
    return (
      normalized === ACCOUNT_DELETION_CONFIRMATION_PHRASE ||
      normalized.toLowerCase() === userEmail.trim().toLowerCase()
    );
  }, [confirmation, userEmail]);

  const canSubmit = confirmationValid && checked && !submitting;

  async function submitDeletion() {
    if (!canSubmit) return;
    setSubmitting(true);
    setError(null);

    try {
      const response = await fetch("/api/account/delete", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ confirmation }),
      });
      const payload = (await response.json().catch(() => ({}))) as {
        ok?: boolean;
        error?: string;
        redirectTo?: string;
      };

      if (!response.ok || !payload.ok) {
        setError(payload.error || "Unable to delete your account. Try again shortly.");
        setSubmitting(false);
        return;
      }

      await signOut({ callbackUrl: payload.redirectTo || "/login?accountDeleted=1" });
    } catch {
      setError("Unable to delete your account. Try again shortly.");
      setSubmitting(false);
    }
  }

  return (
    <section
      aria-labelledby="delete-account-heading"
      className="rounded-2xl border border-[color-mix(in_srgb,var(--semantic-danger)_38%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-danger)_7%,var(--semantic-surface))] p-6 shadow-sm"
    >
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="max-w-3xl space-y-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--semantic-danger)]">Danger Zone</p>
            <h2 id="delete-account-heading" className="mt-2 text-2xl font-bold text-[var(--semantic-text-primary)]">
              Delete Account
            </h2>
          </div>
          <p className="text-sm leading-6 text-[var(--semantic-text-secondary)]">
            Deleting your NurseNest account is permanent. You will lose access to your profile, learner history,
            study tools, and saved settings.
          </p>
          <div>
            <p className="text-sm font-semibold text-[var(--semantic-text-primary)]">Data affected:</p>
            <ul className="mt-2 grid gap-2 text-sm text-[var(--semantic-text-secondary)] sm:grid-cols-2">
              {affectedData.map((item) => (
                <li key={item} className="flex gap-2">
                  <span aria-hidden="true" className="text-[var(--semantic-danger)]">
                    •
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <p className="text-sm leading-6 text-[var(--semantic-text-secondary)]">{ACCOUNT_DELETION_RETAINED_RECORDS_COPY}</p>
          <p className="text-sm leading-6 text-[var(--semantic-text-secondary)]">
            {ACCOUNT_DELETION_BILLING_WARNING}{" "}
            <Link href={billingHref} className="font-semibold text-[var(--semantic-brand)] underline-offset-4 hover:underline">
              Manage billing
            </Link>
            .
          </p>
        </div>
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="inline-flex items-center justify-center rounded-full bg-[var(--semantic-danger)] px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-[var(--semantic-danger)] focus:ring-offset-2"
        >
          Delete my account
        </button>
      </div>

      {open ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="delete-account-modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 p-4"
        >
          <div className="w-full max-w-lg rounded-2xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-6 shadow-2xl">
            <h3 id="delete-account-modal-title" className="text-xl font-bold text-[var(--semantic-text-primary)]">
              Permanently delete account
            </h3>
            <p className="mt-3 text-sm leading-6 text-[var(--semantic-text-secondary)]">
              This action cannot be undone. Type <strong>DELETE</strong> or your email address to continue, then confirm
              that you understand the deletion is permanent.
            </p>
            <label className="mt-5 block text-sm font-semibold text-[var(--semantic-text-primary)]">
              Type DELETE or your email address
              <input
                value={confirmation}
                onChange={(event) => setConfirmation(event.target.value)}
                className="mt-2 w-full rounded-xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] px-4 py-3 text-[var(--semantic-text-primary)] outline-none focus:border-[var(--semantic-danger)]"
                placeholder={userEmail || "DELETE"}
                autoComplete="off"
              />
            </label>
            <label className="mt-4 flex items-start gap-3 text-sm text-[var(--semantic-text-secondary)]">
              <input
                type="checkbox"
                checked={checked}
                onChange={(event) => setChecked(event.target.checked)}
                className="mt-1 size-4 rounded border-[var(--semantic-border-soft)]"
              />
              <span>I understand this permanently deletes my NurseNest account and learner data listed above.</span>
            </label>
            {error ? (
              <p role="alert" className="mt-4 rounded-xl bg-[color-mix(in_srgb,var(--semantic-danger)_10%,var(--semantic-surface))] p-3 text-sm font-medium text-[var(--semantic-danger)]">
                {error}
              </p>
            ) : null}
            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => {
                  setOpen(false);
                  setError(null);
                }}
                disabled={submitting}
                className="rounded-full border border-[var(--semantic-border-soft)] px-5 py-3 text-sm font-bold text-[var(--semantic-text-primary)]"
              >
                Keep my account
              </button>
              <button
                type="button"
                disabled={!canSubmit}
                onClick={submitDeletion}
                className="rounded-full bg-[var(--semantic-danger)] px-5 py-3 text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-50"
              >
                {submitting ? "Deleting..." : "Permanently delete account"}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}
