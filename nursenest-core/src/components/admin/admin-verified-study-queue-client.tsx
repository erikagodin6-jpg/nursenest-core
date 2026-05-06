"use client";

import { useState } from "react";

type Row = {
  id: string;
  title: string;
  pathwayId: string;
  ownerId: string;
  verificationStatus: string;
  moderationStatus: string;
  updatedAt: string | Date;
  _count: { cards: number };
};

export function AdminVerifiedStudyQueueClient({ initialDecks }: { initialDecks: Row[] }) {
  const [decks, setDecks] = useState(initialDecks);
  const [msg, setMsg] = useState<string | null>(null);

  async function act(deckId: string, decision: "approve" | "reject" | "unpublish") {
    setMsg(null);
    const res = await fetch(`/api/admin/verified-study/decks/${deckId}/publish-review`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ decision }),
    });
    const j = (await res.json()) as { ok?: boolean; code?: string; reasons?: string[] };
    if (!res.ok || !j.ok) {
      setMsg(`${j.code ?? "error"}${j.reasons?.length ? `: ${j.reasons.join(", ")}` : ""}`);
      return;
    }
    setDecks((prev) => prev.filter((d) => d.id !== deckId));
    setMsg(decision === "approve" ? "Approved." : decision === "reject" ? "Rejected." : "Unpublished.");
  }

  if (decks.length === 0) {
    return <p className="text-sm text-[var(--theme-body-text)]">No pending public decks.</p>;
  }

  return (
    <div className="space-y-3">
      {msg ? <p className="text-sm text-[var(--semantic-info)]">{msg}</p> : null}
      <ul className="space-y-2">
        {decks.map((d) => (
          <li
            key={d.id}
            className="flex flex-col gap-2 rounded-lg border border-[var(--semantic-border-soft)] bg-[var(--bg-card)] p-3 sm:flex-row sm:items-center sm:justify-between"
          >
            <div>
              <p className="font-medium text-[var(--semantic-text-primary)]">{d.title}</p>
              <p className="text-xs text-[var(--theme-body-text)]">
                {d.pathwayId} · {d._count.cards} cards · owner {d.ownerId.slice(0, 8)}…
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                className="rounded-full bg-[var(--semantic-success)] px-3 py-1 text-xs font-semibold text-[var(--semantic-text-on-brand)]"
                onClick={() => void act(d.id, "approve")}
              >
                Approve
              </button>
              <button
                type="button"
                className="rounded-full border border-[var(--semantic-border-soft)] px-3 py-1 text-xs font-medium text-[var(--semantic-danger)]"
                onClick={() => void act(d.id, "reject")}
              >
                Reject
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
