"use client";

import { useCallback, useState } from "react";
import type { CountryCode, TierCode } from "@prisma/client";

export type DemoUserRow = {
  id: string;
  email: string;
  name: string;
  tier: TierCode;
  country: CountryCode;
  learnerPath: string | null;
  createdAt: string;
};

export type PathwayOption = { id: string; label: string };

export function AdminDemoUsersPanel({
  pathways,
  initialUsers,
}: {
  pathways: PathwayOption[];
  initialUsers: DemoUserRow[];
}) {
  const [users, setUsers] = useState(initialUsers);
  const [pathwayId, setPathwayId] = useState(pathways[0]?.id ?? "");
  const [lessonCompletionPercent, setLessonCompletionPercent] = useState("40");
  const [readinessScoreTarget, setReadinessScoreTarget] = useState("75");
  const [busy, setBusy] = useState(false);
  const [lastCreated, setLastCreated] = useState<{
    email: string;
    password: string;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    const res = await fetch("/api/admin/demo-users");
    if (!res.ok) return;
    const data = (await res.json()) as { users: DemoUserRow[] };
    setUsers(data.users);
  }, []);

  const onCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLastCreated(null);
    setBusy(true);
    try {
      const pct = lessonCompletionPercent.trim();
      const readiness = readinessScoreTarget.trim();
      const res = await fetch("/api/admin/demo-users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pathwayId,
          lessonCompletionPercent: pct === "" ? undefined : Number(pct),
          readinessScoreTarget: readiness === "" ? undefined : Number(readiness),
        }),
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(typeof body.error === "string" ? body.error : "Create failed");
        return;
      }
      if (body.ok === true && typeof body.email === "string" && typeof body.plaintextPassword === "string") {
        setLastCreated({ email: body.email, password: body.plaintextPassword });
      }
      await refresh();
    } finally {
      setBusy(false);
    }
  };

  const onDelete = async (userId: string) => {
    if (!confirm("Delete this demo user and all associated data?")) return;
    setError(null);
    setBusy(true);
    try {
      const res = await fetch(`/api/admin/demo-users?userId=${encodeURIComponent(userId)}`, { method: "DELETE" });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        setError(typeof body.error === "string" ? body.error : "Delete failed");
        return;
      }
      if (lastCreated && users.some((u) => u.id === userId)) {
        setLastCreated(null);
      }
      await refresh();
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-8">
      <section className="nn-card p-6">
        <h2 className="text-lg font-semibold text-[var(--theme-heading-text)]">Create demo learner</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Tier and country follow the selected pathway. Progress uses published pathway lessons; readiness seeds a practice
          exam attempt when a published exam exists for that tier and country.
        </p>
        <form onSubmit={onCreate} className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <label className="flex flex-col gap-1 text-sm sm:col-span-2">
            <span className="font-medium text-foreground">Pathway</span>
            <select
              className="rounded-md border border-border bg-background px-3 py-2"
              value={pathwayId}
              onChange={(e) => setPathwayId(e.target.value)}
              required
            >
              {pathways.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.label}
                </option>
              ))}
            </select>
          </label>
          <label className="flex flex-col gap-1 text-sm">
            <span className="font-medium text-foreground">Lesson completion %</span>
            <input
              type="number"
              min={0}
              max={100}
              className="rounded-md border border-border bg-background px-3 py-2"
              value={lessonCompletionPercent}
              onChange={(e) => setLessonCompletionPercent(e.target.value)}
            />
          </label>
          <label className="flex flex-col gap-1 text-sm">
            <span className="font-medium text-foreground">Readiness target (0–100)</span>
            <input
              type="number"
              min={0}
              max={100}
              className="rounded-md border border-border bg-background px-3 py-2"
              value={readinessScoreTarget}
              onChange={(e) => setReadinessScoreTarget(e.target.value)}
            />
          </label>
          <div className="flex items-end sm:col-span-2 lg:col-span-4">
            <button
              type="submit"
              disabled={busy || !pathwayId}
              className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground disabled:opacity-50"
            >
              {busy ? "Working…" : "Create demo user"}
            </button>
          </div>
        </form>
        {error ? (
          <p className="mt-3 text-sm text-[var(--semantic-danger)]" role="alert">
            {error}
          </p>
        ) : null}
        {lastCreated ? (
          <div className="mt-4 rounded-lg border border-[color-mix(in_srgb,var(--semantic-info)_35%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-panel-cool)_12%,transparent)] p-4 text-sm">
            <p className="font-semibold text-[var(--theme-heading-text)]">Credentials (copy now — password is not stored)</p>
            <p className="mt-2 break-all">
              <span className="text-muted-foreground">Email:</span> {lastCreated.email}
            </p>
            <p className="mt-1 break-all font-mono text-xs">
              <span className="text-muted-foreground">Password:</span> {lastCreated.password}
            </p>
          </div>
        ) : null}
      </section>

      <section className="nn-card p-6">
        <h2 className="text-lg font-semibold text-[var(--theme-heading-text)]">Demo accounts</h2>
        <p className="mt-1 text-sm text-muted-foreground">Reserved emails @nursenest.demo.invalid — no real billing or outbound mail.</p>
        <div className="mt-4 overflow-auto">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead>
              <tr className="border-b border-border text-muted-foreground">
                <th className="py-2 pr-4 font-medium">Email</th>
                <th className="py-2 pr-4 font-medium">Tier</th>
                <th className="py-2 pr-4 font-medium">Pathway</th>
                <th className="py-2 pr-4 font-medium">Created</th>
                <th className="py-2 font-medium w-28">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-6 text-muted-foreground">
                    No demo users yet.
                  </td>
                </tr>
              ) : (
                users.map((u) => (
                  <tr key={u.id} className="border-b border-border/60">
                    <td className="py-2 pr-4 align-top break-all">{u.email}</td>
                    <td className="py-2 pr-4 align-top">{u.tier}</td>
                    <td className="py-2 pr-4 align-top font-mono text-xs">{u.learnerPath ?? "—"}</td>
                    <td className="py-2 pr-4 align-top whitespace-nowrap">{new Date(u.createdAt).toLocaleString()}</td>
                    <td className="py-2 align-top">
                      <button
                        type="button"
                        className="text-[var(--semantic-danger)] hover:underline disabled:opacity-50"
                        disabled={busy}
                        onClick={() => onDelete(u.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
