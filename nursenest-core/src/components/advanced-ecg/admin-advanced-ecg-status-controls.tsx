"use client";

import { useState } from "react";
import type { AdvancedEcgModuleStatus } from "@/lib/advanced-ecg/advanced-ecg-module-status";

type AdminAdvancedEcgStatusControlsProps = {
  currentStatus: AdvancedEcgModuleStatus;
  canPublish: boolean;
  publishFailures: string[];
};

const STATUSES: readonly AdvancedEcgModuleStatus[] = ["draft", "qa_preview", "published"];

export function AdminAdvancedEcgStatusControls({
  currentStatus,
  canPublish,
  publishFailures,
}: AdminAdvancedEcgStatusControlsProps) {
  const [busy, setBusy] = useState<AdvancedEcgModuleStatus | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  async function updateStatus(status: AdvancedEcgModuleStatus) {
    setBusy(status);
    setMessage(null);
    try {
      const res = await fetch("/api/admin/modules/advanced-ecg/status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({ status }),
      });
      const data = (await res.json()) as { ok?: boolean; status?: string; failures?: string[]; error?: string };
      if (!res.ok || !data.ok) {
        setMessage((data.failures ?? [data.error ?? "Unable to update Advanced ECG status."]).join(" | "));
        return;
      }
      setMessage(`Advanced ECG status: ${data.status ?? status}`);
    } catch {
      setMessage("Unable to update Advanced ECG status right now.");
    } finally {
      setBusy(null);
    }
  }

  return (
    <div className="rounded-lg border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-4">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--semantic-text-muted)]">
        Advanced ECG publish controls
      </p>
      <p className="mt-2 text-sm text-[var(--semantic-text-secondary)]">
        Current status: <span className="font-semibold text-[var(--semantic-text-primary)]">{currentStatus}</span>
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        {STATUSES.map((status) => (
          <button
            key={status}
            type="button"
            onClick={() => void updateStatus(status)}
            disabled={busy !== null || (status === "published" && !canPublish)}
            className="rounded-md border border-[var(--semantic-border-soft)] bg-[var(--semantic-bg-base)] px-3 py-2 text-sm font-semibold text-[var(--semantic-text-primary)] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {busy === status ? "Updating..." : `Set ${status}`}
          </button>
        ))}
      </div>
      {!canPublish && publishFailures.length > 0 ? (
        <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-[var(--semantic-text-secondary)]">
          {publishFailures.map((failure) => (
            <li key={failure}>{failure}</li>
          ))}
        </ul>
      ) : null}
      {message ? <p className="mt-3 text-sm text-[var(--semantic-text-secondary)]">{message}</p> : null}
    </div>
  );
}
