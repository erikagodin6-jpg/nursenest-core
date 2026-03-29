"use client";

import { useCallback, useEffect, useState } from "react";

type Tab = "questions" | "flashcards";

type DraftRow = {
  id: string;
  stemPreview?: string | null;
  frontPreview?: string | null;
  reviewStatus: string;
  promotedEntityId?: string | null;
  validationJson: unknown;
  createdAt: string;
  batchId?: string | null;
  categoryId?: string | null;
};

export function ReviewQueueClient() {
  const [tab, setTab] = useState<Tab>("questions");
  const [drafts, setDrafts] = useState<DraftRow[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [detail, setDetail] = useState<Record<string, unknown> | null>(null);
  const [categories, setCategories] = useState<{ id: string; name: string; slug: string }[]>([]);
  const [categoryId, setCategoryId] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadList = useCallback(async () => {
    const path = tab === "questions" ? "/api/admin/ai/drafts/questions" : "/api/admin/ai/drafts/flashcards";
    const res = await fetch(path, { credentials: "include" });
    const data = (await res.json()) as { drafts?: DraftRow[] };
    setDrafts(data.drafts ?? []);
  }, [tab]);

  useEffect(() => {
    void loadList();
  }, [loadList]);

  useEffect(() => {
    void fetch("/api/admin/categories", { credentials: "include" })
      .then((r) => r.json())
      .then((d: { categories?: { id: string; name: string; slug: string }[] }) => setCategories(d.categories ?? []))
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!selected) {
      setDetail(null);
      return;
    }
    const path =
      tab === "questions"
        ? `/api/admin/ai/drafts/questions/${selected}`
        : `/api/admin/ai/drafts/flashcards/${selected}`;
    void fetch(path, { credentials: "include" })
      .then((r) => r.json())
      .then((d: { draft?: Record<string, unknown> }) => {
        setDetail(d.draft ?? null);
        const c = d.draft?.categoryId as string | undefined;
        if (c) setCategoryId(c);
      })
      .catch(() => setDetail(null));
  }, [selected, tab]);

  async function review(action: "approve" | "reject") {
    if (!selected) return;
    setError(null);
    setLoading(true);
    try {
      const path =
        tab === "questions"
          ? `/api/admin/ai/drafts/questions/${selected}/review`
          : `/api/admin/ai/drafts/flashcards/${selected}/review`;
      const res = await fetch(path, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, notes: notes.trim() || undefined }),
      });
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) {
        setError(data.error ?? String(res.status));
        return;
      }
      setNotes("");
      setSelected(null);
      await loadList();
    } finally {
      setLoading(false);
    }
  }

  async function promote() {
    if (!selected) return;
    setError(null);
    setLoading(true);
    try {
      const path =
        tab === "questions"
          ? `/api/admin/ai/drafts/questions/${selected}/promote`
          : `/api/admin/ai/drafts/flashcards/${selected}/promote`;
      const res = await fetch(path, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...(categoryId.trim() ? { categoryId: categoryId.trim() } : {}) }),
      });
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) {
        setError(data.error ?? String(res.status));
        return;
      }
      setSelected(null);
      await loadList();
    } finally {
      setLoading(false);
    }
  }

  const preview =
    tab === "questions"
      ? drafts.find((d) => d.id === selected)?.stemPreview
      : drafts.find((d) => d.id === selected)?.frontPreview;

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="nn-card p-4">
        <div className="mb-3 flex gap-2">
          <button
            type="button"
            className={`rounded-full px-3 py-1 text-sm ${tab === "questions" ? "bg-primary text-primary-foreground" : "border border-border"}`}
            onClick={() => {
              setTab("questions");
              setSelected(null);
            }}
          >
            Questions
          </button>
          <button
            type="button"
            className={`rounded-full px-3 py-1 text-sm ${tab === "flashcards" ? "bg-primary text-primary-foreground" : "border border-border"}`}
            onClick={() => {
              setTab("flashcards");
              setSelected(null);
            }}
          >
            Flashcards
          </button>
          <button
            type="button"
            className="ml-auto text-xs text-primary underline"
            onClick={() => void loadList()}
          >
            Refresh
          </button>
        </div>
        <ul className="max-h-80 space-y-2 overflow-y-auto text-sm">
          {drafts.length === 0 ? (
            <li className="text-muted">No pending drafts.</li>
          ) : (
            drafts.map((d) => (
              <li key={d.id}>
                <button
                  type="button"
                  className={`w-full rounded border px-2 py-2 text-left ${selected === d.id ? "border-primary bg-primary/5" : "border-border"}`}
                  onClick={() => setSelected(d.id)}
                >
                  <span className="line-clamp-2 font-medium">{d.stemPreview ?? d.frontPreview ?? d.id}</span>
                  <span className="block text-xs text-muted">
                    {d.reviewStatus}
                    {d.promotedEntityId ? ` · promoted ${d.promotedEntityId}` : ""} · {new Date(d.createdAt).toLocaleString()}
                  </span>
                </button>
              </li>
            ))
          )}
        </ul>
      </div>

      <div className="nn-card space-y-3 p-4">
        <h3 className="font-semibold">Preview & actions</h3>
        {!selected ? <p className="text-sm text-muted">Select a draft.</p> : null}
        {selected ? (
          <>
            <p className="text-xs text-muted">ID: {selected}</p>
            <p className="text-sm">{preview}</p>
            <textarea
              readOnly
              className="h-40 w-full rounded border border-border bg-black/[0.03] p-2 font-mono text-xs"
              value={detail ? JSON.stringify(detail, null, 2) : "Loading…"}
            />
            <label className="block text-sm">
              Category for promotion
              <select
                className="mt-1 w-full rounded border border-border px-2 py-1.5 text-sm"
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
              >
                <option value="">— paste ID or pick —</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.slug})
                  </option>
                ))}
              </select>
            </label>
            <label className="block text-sm">
              Review notes (optional)
              <input
                className="mt-1 w-full rounded border border-border px-2 py-1.5 text-sm"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </label>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                className="rounded bg-emerald-600 px-3 py-1.5 text-sm font-medium text-white disabled:opacity-50"
                disabled={loading}
                onClick={() => void review("approve")}
              >
                Approve
              </button>
              <button
                type="button"
                className="rounded bg-red-600 px-3 py-1.5 text-sm font-medium text-white disabled:opacity-50"
                disabled={loading}
                onClick={() => void review("reject")}
              >
                Reject
              </button>
            </div>
            <p className="text-xs text-muted">
              After approval, promote into a real {tab === "questions" ? "Question" : "Flashcard"} (still DRAFT status in bank).
            </p>
            <button
              type="button"
              className="rounded border border-primary px-3 py-1.5 text-sm font-semibold text-primary disabled:opacity-50"
              disabled={loading}
              onClick={() => void promote()}
            >
              Promote (approved only)
            </button>
            {error ? <p className="text-sm text-red-600">{error}</p> : null}
          </>
        ) : null}
      </div>
    </div>
  );
}
