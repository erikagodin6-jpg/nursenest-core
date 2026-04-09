"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import type { AdminUserSearchRow } from "@/lib/admin/load-admin-user-search";

export function AdminUserSearchPanel({
  initialQuery,
  initialRows,
}: {
  initialQuery: string;
  initialRows: AdminUserSearchRow[] | null;
}) {
  const router = useRouter();
  const [q, setQ] = useState(initialQuery);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [rows, setRows] = useState<AdminUserSearchRow[] | null>(initialRows);

  useEffect(() => {
    setQ(initialQuery);
    setRows(initialRows);
  }, [initialQuery, initialRows]);

  const runSearch = useCallback(async () => {
    const trimmed = q.trim();
    if (trimmed.length < 2) {
      setErr("Enter at least 2 characters.");
      setRows([]);
      return;
    }
    setBusy(true);
    setErr(null);
    try {
      const res = await fetch(`/api/admin/users/lookup?q=${encodeURIComponent(trimmed)}`, { cache: "no-store" });
      const json = (await res.json()) as { ok?: boolean; users?: AdminUserSearchRow[]; error?: string };
      if (!res.ok) {
        setErr(json.error ?? "Search failed");
        setRows([]);
        return;
      }
      setRows(json.users ?? []);
      router.replace(`/admin/users?q=${encodeURIComponent(trimmed)}`, { scroll: false });
    } catch (e) {
      setErr(e instanceof Error ? e.message : String(e));
      setRows([]);
    } finally {
      setBusy(false);
    }
  }, [q, router]);

  return (
    <div className="nn-card p-5">
      <h2 className="text-lg font-semibold">Find a user</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Search by email, name, username, or paste a user id. Results link to a read-only support profile.
      </p>
      <div className="mt-4 flex flex-wrap items-end gap-2">
        <label className="min-w-[240px] flex-1 space-y-1">
          <span className="text-xs font-medium text-muted-foreground">Query</span>
          <input
            className="w-full rounded-md border border-border px-3 py-2 text-sm"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") void runSearch();
            }}
            placeholder="email, name, or id"
          />
        </label>
        <button
          type="button"
          disabled={busy}
          className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground disabled:opacity-50"
          onClick={() => void runSearch()}
        >
          {busy ? "Searching…" : "Search"}
        </button>
      </div>
      {err ? <p className="mt-2 text-sm text-rose-700 dark:text-rose-300">{err}</p> : null}

      {rows && rows.length === 0 && !err && q.trim().length >= 2 ? (
        <p className="mt-4 text-sm text-muted-foreground">No matches.</p>
      ) : null}

      {rows && rows.length > 0 ? (
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[720px] border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-border text-xs uppercase text-muted-foreground">
                <th className="py-2">Name</th>
                <th className="py-2">Email</th>
                <th className="py-2">Role</th>
                <th className="py-2">Tier</th>
                <th className="py-2">Trial</th>
                <th className="py-2" />
              </tr>
            </thead>
            <tbody>
              {rows.map((u) => (
                <tr key={u.id} className="border-b border-border/50">
                  <td className="py-2 pr-2">{u.name}</td>
                  <td className="py-2 font-mono text-xs">{u.email}</td>
                  <td className="py-2">{u.role}</td>
                  <td className="py-2">{u.tier}</td>
                  <td className="py-2">{u.trialStatus}</td>
                  <td className="py-2">
                    <Link href={`/admin/users/${encodeURIComponent(u.id)}`} className="font-semibold text-primary underline">
                      Support profile →
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}
    </div>
  );
}
