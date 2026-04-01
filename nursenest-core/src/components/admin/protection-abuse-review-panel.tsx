"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { PremiumProtectionAdminSnapshot } from "@/lib/admin/load-premium-protection-admin-snapshot";
import { PROTECTION_ABUSE_REVIEW_NOTE_MAX } from "@/lib/admin/protection-abuse-review-constants";

type OpenRow = PremiumProtectionAdminSnapshot["openAbuseReviews"][number];
type ClosedRow = PremiumProtectionAdminSnapshot["recentClosedAbuseReviews"][number];
type Summary = PremiumProtectionAdminSnapshot["abuseReviewSummary"];

function evidencePreview(ev: unknown): string {
  try {
    const s = JSON.stringify(ev);
    return s.length > 800 ? `${s.slice(0, 800)}…` : s;
  } catch {
    return String(ev);
  }
}

export function ProtectionAbuseReviewPanel(props: {
  initialOpen: OpenRow[];
  initialClosed: ClosedRow[];
  summary: Summary;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(props.initialOpen);
  const [closed, setClosed] = useState(props.initialClosed);
  const [summary, setSummary] = useState(props.summary);
  const [filter, setFilter] = useState<"open" | "dismissed" | "resolved">("open");
  const [sortClosed, setSortClosed] = useState<"newest_dismissed" | "oldest_dismissed">("newest_dismissed");
  const [pending, setPending] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [notes, setNotes] = useState<Record<string, string>>({});

  useEffect(() => {
    setOpen(props.initialOpen);
    setClosed(props.initialClosed);
    setSummary(props.summary);
  }, [props.initialOpen, props.initialClosed, props.summary]);

  async function act(id: string, action: "dismiss" | "resolve") {
    setError(null);
    const raw = notes[id] ?? "";
    if (raw.length > PROTECTION_ABUSE_REVIEW_NOTE_MAX) {
      setError(`Note must be at most ${PROTECTION_ABUSE_REVIEW_NOTE_MAX} characters.`);
      return;
    }
    setPending(`${id}:${action}`);
    try {
      const res = await fetch(`/api/admin/protection-abuse-reviews/${encodeURIComponent(id)}/action`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, note: raw.trim() || undefined }),
      });
      const data = (await res.json()) as { error?: string };
      if (!res.ok) {
        setError(data.error ?? "Request failed");
        return;
      }
      const moved = open.find((r) => r.id === id);
      setOpen((prev) => prev.filter((r) => r.id !== id));
      setSummary((s) => ({
        openCount: Math.max(0, s.openCount - 1),
        dismissedCount: action === "dismiss" ? s.dismissedCount + 1 : s.dismissedCount,
        resolvedCount: action === "resolve" ? s.resolvedCount + 1 : s.resolvedCount,
        actionsLast7Days: s.actionsLast7Days + 1,
      }));
      if (moved) {
        const note = raw.trim() || null;
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

  const closedDismissed = useMemo(
    () => sortedClosed.filter((r) => r.resolution === "DISMISSED"),
    [sortedClosed],
  );
  const closedResolved = useMemo(
    () => sortedClosed.filter((r) => r.resolution === "RESOLVED"),
    [sortedClosed],
  );

  const closedToShow = filter === "dismissed" ? closedDismissed : filter === "resolved" ? closedResolved : [];

  const showOpen = filter === "open";
  const showClosedList = filter === "dismissed" || filter === "resolved";

  return (
    <div className="space-y-4">
      <div className="grid gap-3 rounded-lg border border-border/60 bg-muted/15 p-4 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Open</p>
          <p className="mt-1 text-2xl font-bold tabular-nums text-foreground">{summary.openCount.toLocaleString()}</p>
        </div>
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Dismissed (total)</p>
          <p className="mt-1 text-2xl font-bold tabular-nums text-foreground">{summary.dismissedCount.toLocaleString()}</p>
        </div>
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Resolved (total)</p>
          <p className="mt-1 text-2xl font-bold tabular-nums text-foreground">{summary.resolvedCount.toLocaleString()}</p>
        </div>
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Closed (last 7 days)</p>
          <p className="mt-1 text-2xl font-bold tabular-nums text-foreground">{summary.actionsLast7Days.toLocaleString()}</p>
          <p className="mt-0.5 text-[11px] text-muted-foreground">Actions recorded in rolling window</p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="flex flex-wrap gap-2 rounded-lg border border-border/60 bg-muted/20 p-1 text-xs font-medium">
          {(
            [
              ["open", `Open (${summary.openCount})`],
              ["dismissed", `Dismissed (${summary.dismissedCount})`],
              ["resolved", `Resolved (${summary.resolvedCount})`],
            ] as const
          ).map(([k, label]) => (
            <button
              key={k}
              type="button"
              className={`rounded-md px-3 py-1.5 ${filter === k ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
              onClick={() => setFilter(k)}
            >
              {label}
            </button>
          ))}
        </div>
        {showClosedList ? (
          <label className="flex items-center gap-2 text-xs text-muted-foreground">
            <span>Sort</span>
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
        Lists show up to 40 open and 25 recent closed rows; summary counts are database totals. Use{" "}
        <strong>Dismiss</strong> for false positives and <strong>Resolve</strong> when handled. Notes are{" "}
        {PROTECTION_ABUSE_REVIEW_NOTE_MAX} characters max (server + UI).
      </p>

      {error ? <p className="text-sm text-red-600">{error}</p> : null}

      {showOpen ? (
        <div>
          <h3 className="text-sm font-semibold text-[var(--theme-heading-text)]">Pending review</h3>
          {sortedOpen.length === 0 ? (
            <p className="mt-2 text-sm text-muted-foreground">No open items in this page snapshot.</p>
          ) : (
            <ul className="mt-3 space-y-4">
              {sortedOpen.map((r) => {
                const len = notes[r.id]?.length ?? 0;
                return (
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
                      Optional note (max {PROTECTION_ABUSE_REVIEW_NOTE_MAX} characters)
                      <textarea
                        className="mt-1 w-full max-w-xl rounded border border-border bg-background px-2 py-1.5 text-foreground"
                        rows={2}
                        maxLength={PROTECTION_ABUSE_REVIEW_NOTE_MAX}
                        value={notes[r.id] ?? ""}
                        onChange={(e) => {
                          const v = e.target.value;
                          if (v.length <= PROTECTION_ABUSE_REVIEW_NOTE_MAX) {
                            setNotes((n) => ({ ...n, [r.id]: v }));
                          }
                        }}
                        placeholder="Internal note — not shown to the learner"
                      />
                      <span className="mt-1 block text-[11px] text-muted-foreground">
                        {len} / {PROTECTION_ABUSE_REVIEW_NOTE_MAX}
                      </span>
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
                );
              })}
            </ul>
          )}
        </div>
      ) : null}

      {showClosedList ? (
        <div>
          <h3 className="text-sm font-semibold text-[var(--theme-heading-text)]">
            {filter === "dismissed" ? "Dismissed" : "Resolved"} (recent)
          </h3>
          {closedToShow.length === 0 ? (
            <p className="mt-2 text-sm text-muted-foreground">No matching rows in this page snapshot.</p>
          ) : (
            <ul className="mt-3 space-y-3">
              {closedToShow.map((r) => (
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
