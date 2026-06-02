"use client";

import { useState } from "react";

type Props = { targetUserId: string };

export function AdminViewAsControls({ targetUserId }: Props) {
  const [clearing, setClearing] = useState(false);
  const [message, setMessage] = useState("");

  async function clearSession() {
    setClearing(true);
    try {
      await fetch(`/api/admin/users/${encodeURIComponent(targetUserId)}/impersonate`, {
        method: "DELETE",
        credentials: "include",
      });
      setMessage("Session cleared.");
    } catch {
      setMessage("Failed to clear.");
    } finally {
      setClearing(false);
    }
  }

  return (
    <div className="flex items-center gap-3">
      {message && <span className="text-xs text-amber-800 dark:text-amber-300">{message}</span>}
      <button
        onClick={clearSession}
        disabled={clearing}
        className="rounded-full border border-amber-400 bg-white px-4 py-1.5 text-sm font-semibold text-amber-900 transition hover:bg-amber-100 disabled:opacity-50 dark:bg-transparent dark:text-amber-200 dark:hover:bg-amber-900/40"
      >
        {clearing ? "Clearing…" : "End view-as session"}
      </button>
    </div>
  );
}
