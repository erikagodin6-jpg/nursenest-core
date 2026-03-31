"use client";

import { useState } from "react";

export function LessonMarkCompleteButton({ lessonId }: { lessonId: string }) {
  const [status, setStatus] = useState<"idle" | "saving" | "done" | "error">("idle");

  async function save() {
    setStatus("saving");
    try {
      const res = await fetch("/api/lessons/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lessonId, completed: true }),
      });
      if (!res.ok) throw new Error("fail");
      setStatus("done");
    } catch {
      setStatus("error");
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <button
        type="button"
        disabled={status === "saving" || status === "done"}
        onClick={() => void save()}
        className="rounded-full border border-border px-4 py-2 text-sm font-semibold hover:bg-muted disabled:opacity-60"
      >
        {status === "done" ? "Marked complete" : status === "saving" ? "Saving…" : "Mark lesson complete"}
      </button>
      {status === "error" ? <span className="text-xs text-amber-800">Could not save—try again.</span> : null}
    </div>
  );
}
