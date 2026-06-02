"use client";

import { useState, useEffect, useCallback } from "react";

type LifecycleStats = {
  pendingWarning1: number;
  pendingWarning2: number;
  pendingWarning3: number;
  softDeleted: number;
  pendingPermanentPurge: number;
  recentlyRecovered: number;
  generatedAt: string;
};

type RunResult = {
  ok: boolean;
  dryRun: boolean;
  result?: {
    warning1Sent: number;
    warning2Sent: number;
    warning3Sent: number;
    softDeleted: number;
    permanentlyPurged: number;
    errors: string[];
    ranAt: string;
  };
};

function StatPill({ label, value, tone }: { label: string; value: number | null; tone?: "warning" | "danger" | "success" | "muted" }) {
  const colors = {
    warning: "bg-amber-50 border-amber-200 text-amber-800",
    danger: "bg-red-50 border-red-200 text-red-800",
    success: "bg-green-50 border-green-200 text-green-800",
    muted: "bg-[var(--semantic-panel-muted)] border-[var(--semantic-border-soft)] text-[var(--semantic-text-secondary)]",
  };
  const cls = colors[tone ?? "muted"];
  return (
    <div className={`rounded-xl border p-4 ${cls}`}>
      <p className="text-[10px] font-semibold uppercase tracking-widest opacity-70">{label}</p>
      <p className="mt-1 text-2xl font-bold tabular-nums">{value ?? "—"}</p>
    </div>
  );
}

export function AdminLifecyclePanel() {
  const [stats, setStats] = useState<LifecycleStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [running, setRunning] = useState(false);
  const [runResult, setRunResult] = useState<RunResult | null>(null);
  const [dryRun, setDryRun] = useState(true);

  const fetchStats = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/account-lifecycle", { credentials: "include" });
      if (res.ok) setStats(await res.json() as LifecycleStats);
    } catch { /* silent */ } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { void fetchStats(); }, [fetchStats]);

  async function runCron() {
    setRunning(true);
    setRunResult(null);
    try {
      const res = await fetch("/api/admin/account-lifecycle", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dryRun, batchSize: 200 }),
      });
      const data = await res.json() as RunResult;
      setRunResult(data);
      if (!dryRun) await fetchStats();
    } catch (e) {
      setRunResult({ ok: false, dryRun, result: undefined });
    } finally {
      setRunning(false);
    }
  }

  return (
    <section className="space-y-6" data-testid="admin-lifecycle-panel">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-[var(--semantic-text-primary)]">Account lifecycle</h2>
          <p className="text-xs text-[var(--semantic-text-muted)] mt-0.5">
            Inactivity warnings, soft deletes, and permanent purges.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <label className="flex items-center gap-1.5 text-xs font-medium text-[var(--semantic-text-secondary)]">
            <input
              type="checkbox"
              checked={dryRun}
              onChange={(e) => setDryRun(e.target.checked)}
              className="h-4 w-4"
            />
            Dry run
          </label>
          <button
            type="button"
            disabled={running}
            onClick={() => void runCron()}
            className={`inline-flex items-center rounded-lg px-4 py-2 text-sm font-semibold transition-colors disabled:opacity-50 ${
              dryRun
                ? "border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] text-[var(--semantic-text-primary)]"
                : "bg-red-600 text-white hover:bg-red-700"
            }`}
          >
            {running ? "Running…" : dryRun ? "Dry run" : "⚠ Run live"}
          </button>
        </div>
      </div>

      {/* Stats grid */}
      {loading ? (
        <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-6 animate-pulse">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-20 rounded-xl bg-[var(--semantic-panel-muted)]" />
          ))}
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <StatPill label="Warning 1 sent (awaiting W2)" value={stats?.pendingWarning1 ?? null} tone="warning" />
          <StatPill label="Warning 2 sent (awaiting W3)" value={stats?.pendingWarning2 ?? null} tone="warning" />
          <StatPill label="Final warning sent" value={stats?.pendingWarning3 ?? null} tone="danger" />
          <StatPill label="Soft-deleted" value={stats?.softDeleted ?? null} tone="danger" />
          <StatPill label="Pending permanent purge" value={stats?.pendingPermanentPurge ?? null} tone="danger" />
          <StatPill label="Recovered (30d)" value={stats?.recentlyRecovered ?? null} tone="success" />
        </div>
      )}

      {/* Run result */}
      {runResult ? (
        <div className="rounded-xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-4 text-sm">
          <p className="font-semibold text-[var(--semantic-text-primary)] mb-2">
            {runResult.dryRun ? "Dry run" : "Live run"} result
          </p>
          {runResult.result ? (
            <div className="space-y-1 font-mono text-xs text-[var(--semantic-text-secondary)]">
              <div>Warning 1 sent: {runResult.result.warning1Sent}</div>
              <div>Warning 2 sent: {runResult.result.warning2Sent}</div>
              <div>Warning 3 sent: {runResult.result.warning3Sent}</div>
              <div>Soft-deleted: {runResult.result.softDeleted}</div>
              <div>Permanently purged: {runResult.result.permanentlyPurged}</div>
              {runResult.result.errors.length > 0 && (
                <div className="text-red-600 mt-2">
                  Errors: {runResult.result.errors.join("; ")}
                </div>
              )}
            </div>
          ) : (
            <p className="text-red-600">Run failed — check server logs.</p>
          )}
        </div>
      ) : null}

      <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-xs text-amber-800">
        <strong>Protected:</strong> Admins, staff, and active paid subscribers are NEVER auto-deleted.
        Set <code>isDeletionExempt = true</code> in the DB for special accounts.
        Default thresholds: free users 60 days, engaged users 150 days. Dry-run first.
      </div>
    </section>
  );
}
