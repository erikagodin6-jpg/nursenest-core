"use client";

import { useState } from "react";

export function ContentQualityRefreshButton() {
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  async function run() {
    setLoading(true);
    setMsg(null);
    try {
      const res = await fetch("/api/admin/content-quality/refresh", { method: "POST" });
      const data = (await res.json()) as { ok?: boolean; error?: string };
      if (!res.ok) throw new Error(data.error ?? "Failed");
      setMsg("Snapshot refreshed. Reload the page to see updated numbers.");
    } catch (e) {
      setMsg(e instanceof Error ? e.message : "Error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <button
        type="button"
        disabled={loading}
        onClick={() => void run()}
        className="rounded-lg bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground disabled:opacity-50"
      >
        {loading ? "Refreshing…" : "Refresh corpus snapshot"}
      </button>
      {msg ? <p className="max-w-xs text-right text-xs text-muted-foreground">{msg}</p> : null}
    </div>
  );
}
