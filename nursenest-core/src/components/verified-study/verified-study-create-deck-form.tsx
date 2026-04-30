"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { STUDY_TOOL_ROUTES, withStudyToolPathwayQuery } from "@/lib/study-tools/study-tool-routes";

export function VerifiedStudyCreateDeckForm({ pathwayId }: { pathwayId: string }) {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setBusy(true);
    try {
      const res = await fetch("/api/verified-study/decks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, pathwayId, visibility: "PRIVATE" }),
      });
      const j = (await res.json()) as { ok?: boolean; deck?: { id: string }; code?: string };
      if (!res.ok || !j.ok || !j.deck?.id) {
        setErr(j.code ?? "save_failed");
        return;
      }
      router.push(withStudyToolPathwayQuery(`${STUDY_TOOL_ROUTES.decks}/${j.deck.id}`, pathwayId));
      router.refresh();
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-3 rounded-xl border border-[var(--semantic-border-soft)] bg-[var(--bg-card)] p-4">
      <label className="block text-sm font-medium text-[var(--semantic-text-primary)]">
        Deck title
        <input
          className="mt-1 w-full rounded-md border border-[var(--semantic-border-soft)] bg-[var(--bg-muted)] px-2 py-1.5 text-sm"
          value={title}
          onChange={(ev) => setTitle(ev.target.value)}
          maxLength={200}
          required
        />
      </label>
      {err ? <p className="text-sm text-[var(--semantic-danger)]">{err}</p> : null}
      <button
        type="submit"
        disabled={busy || !title.trim()}
        className="rounded-full bg-[var(--semantic-brand)] px-4 py-2 text-sm font-semibold text-[var(--semantic-text-on-brand)] disabled:opacity-50"
      >
        {busy ? "Saving…" : "Create private deck"}
      </button>
    </form>
  );
}
