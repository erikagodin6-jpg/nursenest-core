"use client";

import { useState } from "react";

export function PublishEcgModuleButton({ disabled }: { disabled: boolean }) {
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function publish() {
    setPending(true);
    setMessage(null);
    try {
      const response = await fetch("/api/admin/modules/ecg/publish", { method: "POST" });
      const payload = (await response.json().catch(() => null)) as { ok?: boolean; failedGates?: string[]; status?: string } | null;
      if (!response.ok || !payload?.ok) {
        setMessage(payload?.failedGates?.join(" | ") ?? "ECG module publish failed readiness checks.");
        return;
      }
      setMessage(`ECG module status: ${payload.status ?? "published"}`);
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <button
        type="button"
        onClick={publish}
        disabled={disabled || pending}
        className="inline-flex min-h-10 items-center justify-center rounded-md bg-[var(--semantic-brand)] px-4 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
      >
        {pending ? "Publishing..." : "Publish ECG Module"}
      </button>
      {message ? <p className="text-sm text-[var(--semantic-text-secondary)]">{message}</p> : null}
    </div>
  );
}
