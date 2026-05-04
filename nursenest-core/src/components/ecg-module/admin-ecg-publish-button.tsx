"use client";

import { useState } from "react";

export function AdminEcgPublishButton({ disabled, failedReasons }: { disabled: boolean; failedReasons: string[] }) {
  const [status, setStatus] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function publish() {
    setBusy(true);
    setStatus(null);
    try {
      const res = await fetch("/api/admin/modules/ecg/publish", { method: "POST", credentials: "same-origin" });
      const data = (await res.json()) as { ok?: boolean; failures?: string[]; status?: string };
      if (!res.ok || !data.ok) {
        setStatus((data.failures ?? ["ECG module failed publish readiness."]).join(" | "));
        return;
      }
      setStatus(`ECG module status: ${data.status ?? "published"}`);
    } catch {
      setStatus("Unable to publish ECG module right now.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="rounded-lg border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-4">
      <button
        type="button"
        disabled={disabled || busy}
        onClick={() => void publish()}
        className="rounded-md bg-[var(--semantic-info)] px-4 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
      >
        {busy ? "Publishing..." : "Publish ECG Module"}
      </button>
      {disabled && failedReasons.length > 0 ? (
        <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-[var(--semantic-text-secondary)]">
          {failedReasons.slice(0, 6).map((reason) => (
            <li key={reason}>{reason}</li>
          ))}
        </ul>
      ) : null}
      {status ? <p className="mt-3 text-sm text-[var(--semantic-text-secondary)]">{status}</p> : null}
    </div>
  );
}
