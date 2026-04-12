"use client";

import { useState } from "react";
import { trackClientEvent } from "@/lib/observability/posthog-client";

export function LearnerBillingPortalButton({
  label,
  busyLabel,
  errorFallback,
  className,
}: {
  label: string;
  busyLabel: string;
  errorFallback: string;
  className?: string;
}) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function openPortal() {
    setBusy(true);
    setError(null);
    trackClientEvent("billing_portal_opened", { surface: "billing_page" });
    try {
      const res = await fetch("/api/billing/portal", { method: "POST" });
      const data = (await res.json()) as { url?: string; error?: string };
      if (!res.ok || !data.url) {
        setError(data.error ?? errorFallback);
        trackClientEvent("billing_portal_error", { reason: data.error ?? "unknown" });
        return;
      }
      window.location.href = data.url;
    } catch {
      setError(errorFallback);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-2">
      <button
        type="button"
        disabled={busy}
        onClick={() => void openPortal()}
        className={
          className ??
          "inline-flex w-full max-w-md items-center justify-center rounded-full bg-role-cta px-5 py-3 text-sm font-semibold text-role-cta-foreground shadow-sm disabled:opacity-50 sm:w-auto"
        }
      >
        {busy ? busyLabel : label}
      </button>
      {error ? (
        <p className="text-sm text-[var(--semantic-danger-contrast)]" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
