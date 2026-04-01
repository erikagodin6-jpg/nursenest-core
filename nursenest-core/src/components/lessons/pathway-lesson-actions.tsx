"use client";

import { useState } from "react";
import Link from "next/link";

export function PathwayLessonActions({
  pathwayId,
  lessonSlug,
  topicCode,
  topicLabel,
  userId,
  canMarkComplete,
}: {
  pathwayId: string;
  lessonSlug: string;
  topicCode?: string | null;
  topicLabel?: string | null;
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
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("nn-learner-stats-updated"));
      }
    } catch {
      setStatus("error");
    }
  }

  const topicCodeParam = topicCode?.trim() ? `&topicCode=${encodeURIComponent(topicCode.trim())}` : "";
  const topicLabelParam = topicLabel?.trim() ? `&topic=${encodeURIComponent(topicLabel.trim())}` : "";
  const qbHref = `/app/questions?pathwayId=${encodeURIComponent(pathwayId)}${topicCodeParam}${topicLabelParam}&preset=topic_drill`;
  const flashcardsHref = topicCode?.trim()
    ? `/app/flashcards?pathwayId=${encodeURIComponent(pathwayId)}&topicCode=${encodeURIComponent(topicCode.trim())}`
    : `/app/flashcards?pathwayId=${encodeURIComponent(pathwayId)}`;

  return (
    <div className="mt-10 flex flex-col gap-4 border-t border-[var(--theme-separator)] pt-8 sm:flex-row sm:flex-wrap sm:items-center">
      <Link
        href={qbHref}
        className="inline-flex justify-center rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground"
      >
        Practice more like this
      </Link>
      <Link
        href={flashcardsHref}
        className="inline-flex justify-center rounded-full border border-border px-5 py-2.5 text-sm font-semibold hover:bg-gray-50"
      >
        Reinforce with flashcards
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
