"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

/**
 * Persistent learner-shell banner while signed QA cookie is active (staff only).
 */
export function AdminLearnerQaBanner({ title }: { title: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function exit() {
    setErr(null);
    setBusy(true);
    try {
      const res = await fetch("/api/admin/learner-qa/clear", {
        method: "POST",
        credentials: "include",
        cache: "no-store",
      });
      if (!res.ok) {
        const j = (await res.json().catch(() => ({}))) as { error?: string };
        setErr(j.error ?? `Exit failed (${res.status})`);
        return;
      }
      router.refresh();
    } catch (e) {
      setErr(e instanceof Error ? e.message : String(e));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div
      role="region"
      aria-label="Admin learner QA mode"
      className="mb-2 rounded-lg border border-[color-mix(in_srgb,var(--semantic-warning)_35%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-warning)_12%,var(--semantic-surface))] px-3 py-2 text-sm text-[var(--semantic-text-primary)] shadow-sm sm:px-4"
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="min-w-0 flex-1 font-semibold leading-snug">{title}</p>
        <button
          type="button"
          onClick={() => void exit()}
          disabled={busy}
          className="shrink-0 rounded-md border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] px-3 py-1.5 text-xs font-semibold text-[var(--semantic-text-primary)] hover:bg-[var(--surface-interactive-hover)] disabled:opacity-50"
        >
          {busy ? "…" : "Exit learner view"}
        </button>
      </div>
      {err ? <p className="mt-1 text-xs text-[var(--semantic-danger)]">{err}</p> : null}
    </div>
  );
}
