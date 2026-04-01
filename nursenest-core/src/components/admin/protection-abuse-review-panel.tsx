"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { PremiumProtectionAdminSnapshot } from "@/lib/admin/load-premium-protection-admin-snapshot";

type OpenRow = PremiumProtectionAdminSnapshot["openAbuseReviews"][number];
type ClosedRow = PremiumProtectionAdminSnapshot["recentClosedAbuseReviews"][number];

function evidencePreview(ev: unknown): string {
  try {
    const s = JSON.stringify(ev);
    return s.length > 800 ? `${s.slice(0, 800)}…` : s;
  } catch {
    return String(ev);
  }
}

export function ProtectionAbuseReviewPanel(props: { initialOpen: OpenRow[]; initialClosed: ClosedRow[] }) {
  const router = useRouter();
  const [open, setOpen] = useState(props.initialOpen);
  const [closed, setClosed] = useState(props.initialClosed);
  const [view, setView] = useState<"open" | "closed" | "all">("open");
  const [sortClosed, setSortClosed] = useState<"newest_dismissed" | "oldest_dismissed">("newest_dismissed");
  const [pending, setPending] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [notes, setNotes] = useState<Record<string, string>>({});

  useEffect(() => {
    setOpen(props.initialOpen);
    setClosed(props.initialClosed);
  }, [props.initialOpen, props.initialClosed]);

  async function act(id: string, action: "dismiss" | "resolve") {
    setError(null);
    setPending(`${id}:${action}`);
    try {
      const res = await fetch(`/api/admin/protection-abuse-reviews/${encodeURIComponent(id)}/action`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, note: notes[id]?.trim() || undefined }),
      });
      const data = (await res.json()) as { error?: string };
      if (!res.ok) {
        setError(data.error ?? "Request failed");
        return;
      }
      const moved = open.find((r) => r.id === id);
      setOpen((prev) => prev.filter((r) => r.id !== id));
      if (moved) {
        const note = notes[id]?.trim() || null;
        const newRow: ClosedRow = {
          id: moved.id,
          userId: moved.userId,
          userEmailSample: moved.userEmailSample,
          reason: moved.reason,
          score: moved.score,
          createdAt: moved.createdAt,
          dismissedAt: new Date().toISOString(),
          resolution: action === "dismiss" ? "DISMISSED" : "RESOLVED",
          adminNote: note,
          actorEmailSample: null,
        };
        setClosed((prev) => [newRow, ...prev].slice(0, 30));
      }
      setNotes((n) => {
        const next = { ...n };
        delete next[id];
        return next;
      });
      router.refresh();
    } catch {
      setError("Network error");
    } finally {
      setPending(null);
    }
  }

  const sortedOpen = useMemo(
    () => [...open].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
    [open],
  );

  const sortedClosed = useMemo(() => {
    const arr = [...closed];
    arr.sort((a, b) => {
      const ta = new Date(a.dismissedAt).getTime();
      const tb = new Date(b.dismissedAt).getTime();
      return sortClosed === "newest_dismissed" ? tb - ta : ta - tb;
    });
    return arr;
  }, [closed, sortClosed]);

  const showOpen = view === "open" || view === "all";
  const showClosed = view === "closed" || view === "all";

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex flex-wrap gap-2 rounded-lg border border-border/60 bg-muted/20 p-1 text-xs font-medium">
          {(
            [
              ["open", `Open (${open.length})`],
              ["closed", `Closed (${closed.length})`],
              ["all", "All"],
            ] as const
          ).map(([k, label]) => (
            <button
              key={k}
              type="button"
              className={`rounded-md px-3 py-1.5 ${view === k ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
              onClick={() => setView(k)}
            >
              {label}
            </button>
          ))}
        </div>
        {showClosed ? (
          <label className="flex items-center gap-2 text-xs text-muted-foreground">
            <span>Closed sort</span>
            <select
              className="rounded border border-border bg-background px-2 py-1 text-foreground"
              value={sortClosed}
              onChange={(e) => setSortClosed(e.target.value as typeof sortClosed)}
            >
              <option value="newest_dismissed">Newest closed first</option>
              <option value="oldest_dismissed">Oldest closed first</option>
            </select>
          </label>
        ) : null}
      </div>

      <p className="text-xs text-muted-foreground">
        Open items are sorted by newest signal first. Use <strong>Dismiss</strong> for false positives and{" "}
        <strong>Resolve</strong> when reviewed or handled outside this queue.
      </p>

      {error ? <p className="text-sm text-red-600">{error}</p> : null}

      {showOpen ? (
        <div>
          <h3 className="text-sm font-semibold text-[var(--theme-heading-text)]">Pending review</h3>
          {sortedOpen.length === 0 ? (
            <p className="mt-2 text-sm text-muted-foreground">No open items.</p>
          ) : (
            <ul className="mt-3 space-y-4">
              {sortedOpen.map((r) => (
                <li key={r.id} className="rounded-lg border border-amber-500/25 bg-muted/15 p-4 text-sm">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div>
                      <p className="font-medium text-foreground">{r.reason}</p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        Score {r.score} · User <code className="text-foreground">{r.userId.slice(0, 12)}…</code> ·{" "}
                        {r.userEmailSample} · Flagged {new Date(r.createdAt).toLocaleString()}
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        disabled={pending != null}
                        className="rounded-md border border-border bg-background px-3 py-1.5 text-xs font-semibold hover:bg-muted disabled:opacity-50"
                        onClick={() => void act(r.id, "dismiss")}
                      >
                        {pending === `${r.id}:dismiss` ? "…" : "Dismiss"}
                      </button>
                      <button
                        type="button"
                        disabled={pending != null}
                        className="rounded-md bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground hover:opacity-95 disabled:opacity-50"
                        onClick={() => void act(r.id, "resolve")}
                      >
                        {pending === `${r.id}:resolve` ? "…" : "Resolve"}
                      </button>
                    </div>
                  </div>
                  <label className="mt-3 block text-xs text-muted-foreground">
                    Optional note (max 500 chars)
                    <textarea
                      className="mt-1 w-full max-w-xl rounded border border-border bg-background px-2 py-1.5 text-foreground"
                      rows={2}
                      maxLength={500}
                      value={notes[r.id] ?? ""}
                      onChange={(e) => setNotes((n) => ({ ...n, [r.id]: e.target.value }))}
                      placeholder="Internal note — not shown to the learner"
                    />
                  </label>
                  {r.evidence != null ? (
                    <details className="mt-2 text-xs">
                      <summary className="cursor-pointer text-muted-foreground">Evidence snapshot</summary>
                      <pre className="mt-2 max-h-40 overflow-auto rounded bg-muted/40 p-2 font-mono text-[11px] text-foreground">
                        {evidencePreview(r.evidence)}
                      </pre>
                    </details>
                  ) : null}
                </li>
              ))}
            </ul>
          )}
        </div>
      ) : null}

      {showClosed && view === "all" && sortedOpen.length > 0 && sortedClosed.length > 0 ? (
        <hr className="border-border/60" />
      ) : null}

      {showClosed ? (
        <div>
          <h3 className="text-sm font-semibold text-[var(--theme-heading-text)]">Closed</h3>
          {sortedClosed.length === 0 ? (
            <p className="mt-2 text-sm text-muted-foreground">No closed items in this snapshot window.</p>
          ) : (
            <ul className="mt-3 space-y-3">
              {sortedClosed.map((r) => (
                <li key={r.id} className="rounded-lg border border-border/60 bg-muted/10 p-3 text-sm">
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                        r.resolution === "DISMISSED"
                          ? "bg-slate-500/15 text-slate-800 dark:text-slate-100"
                          : "bg-emerald-600/15 text-emerald-900 dark:text-emerald-100"
                      }`}
                    >
                      {r.resolution === "DISMISSED" ? "Dismissed" : "Resolved"}
                    </span>
                    <span className="font-medium text-foreground">{r.reason}</span>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Score {r.score} · User <code className="text-foreground">{r.userId.slice(0, 12)}…</code> ·{" "}
                    {r.userEmailSample} · Flagged {new Date(r.createdAt).toLocaleString()} · Closed{" "}
                    {new Date(r.dismissedAt).toLocaleString()}
                    {r.actorEmailSample ? (
                      <>
                        {" "}
                        · By {r.actorEmailSample}
                      </>
                    ) : null}
                  </p>
                  {r.adminNote ? (
                    <p className="mt-2 rounded border border-border/40 bg-background/50 px-2 py-1 text-xs text-foreground">
                      <span className="text-muted-foreground">Note: </span>
                      {r.adminNote}
                    </p>
                  ) : null}
                </li>
              ))}
            </ul>
          )}
        </div>
      ) : null}
    </div>
  );
}
