"use client";

import { useState } from "react";
import Link from "next/link";

export function PathwayLessonActions({
  pathwayId,
  lessonSlug,
  userId,
  canMarkComplete,
}: {
  pathwayId: string;
  lessonSlug: string;
  userId: string;
  canMarkComplete: boolean;
}) {
  const [status, setStatus] = useState<"idle" | "saving" | "done" | "error">("idle");

  async function markComplete() {
    if (!userId || !canMarkComplete) return;
    setStatus("saving");
    try {
      const res = await fetch("/api/lessons/pathway-progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pathwayId,
          lessonSlug,
          completed: true,
        }),
      });
      if (!res.ok) throw new Error("save_failed");
      setStatus("done");
    } catch {
      setStatus("error");
    }
  }

  /** Pathway-only: `topic` labels in lessons rarely match `exam_questions.topic` strings — filter in-app instead. */
  const qbHref = `/app/questions?pathwayId=${encodeURIComponent(pathwayId)}`;

  return (
    <div className="mt-10 flex flex-col gap-4 border-t border-[var(--theme-separator)] pt-8 sm:flex-row sm:flex-wrap sm:items-center">
      <Link
        href={qbHref}
        className="inline-flex justify-center rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground"
      >
        Practice questions for this exam pathway
      </Link>
      <Link
        href="/app/flashcards"
        className="inline-flex justify-center rounded-full border border-border px-5 py-2.5 text-sm font-semibold hover:bg-gray-50"
      >
        Flashcards
      </Link>
      <Link
        href="/app/exams"
        className="inline-flex justify-center rounded-full border border-border px-5 py-2.5 text-sm font-semibold hover:bg-gray-50"
      >
        Timed practice exam
      </Link>
      {!userId ? (
        <p className="text-sm text-muted">
          <Link href="/login" className="font-semibold text-primary underline">
            Sign in
          </Link>{" "}
          to save progress on this lesson.
        </p>
      ) : canMarkComplete ? (
        <div className="flex items-center gap-2">
          <button
            type="button"
            disabled={status === "saving" || status === "done"}
            onClick={() => void markComplete()}
            className="rounded-full border border-border px-4 py-2 text-sm font-semibold hover:bg-gray-50 disabled:opacity-60"
          >
            {status === "done" ? "Saved as studied" : status === "saving" ? "Saving…" : "Mark lesson studied"}
          </button>
          {status === "error" ? <span className="text-xs text-amber-800">Could not save—try again.</span> : null}
        </div>
      ) : (
        <p className="text-sm text-muted">Subscribe with a plan that matches this exam pathway to track completion.</p>
      )}
    </div>
  );
}
