"use client";

import { useEffect, useRef } from "react";
import type { PathwayLessonProgressStatus } from "@/lib/lessons/pathway-lesson-progress";
import { emitPathwayLessonProgress } from "@/lib/lessons/pathway-lesson-progress-events";

const ENGAGE_SCROLL_RATIO = 0.5;
const AUTO_COMPLETE_SCROLL_RATIO = 0.88;
const AUTO_COMPLETE_MIN_MS = 45_000;

/**
 * Records open (lesson opened → in progress), scroll engagement, and optional conservative
 * auto-complete (high scroll depth + minimum time on page — not scroll alone).
 */
export function PathwayLessonProgressTracker({
  pathwayId,
  lessonSlug,
  enabled,
  initialProgress = "not_started",
  allowAutoComplete = true,
}: {
  pathwayId: string;
  lessonSlug: string;
  enabled: boolean;
  initialProgress?: PathwayLessonProgressStatus;
  allowAutoComplete?: boolean;
}) {
  const engagePostedRef = useRef(false);

  useEffect(() => {
    if (!enabled || !lessonSlug.trim()) return;

    let cancelled = false;
    engagePostedRef.current = false;
    let raf = 0;
    let autoCompleteSent = false;
    const mountedAt = Date.now();

    const envAutoOff = process.env.NEXT_PUBLIC_PATHWAY_LESSON_AUTO_COMPLETE === "0";
    const autoOk = allowAutoComplete !== false && !envAutoOff && initialProgress !== "completed";

    const post = async (action: "open" | "engage" | "complete") => {
      const res = await fetch("/api/lessons/pathway-progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pathwayId, lessonSlug, action }),
      }).catch(() => null);
      return res?.ok === true;
    };

    void (async () => {
      const opened = await post("open");
      if (
        opened &&
        initialProgress === "not_started" &&
        typeof window !== "undefined"
      ) {
        emitPathwayLessonProgress({
          pathwayId,
          lessonSlug,
          status: "in_progress",
          source: "manual",
        });
      }
    })();

    const tryAutoComplete = async (ratio: number) => {
      if (cancelled || !autoOk || autoCompleteSent) return;
      const elapsed = Date.now() - mountedAt;
      if (ratio < AUTO_COMPLETE_SCROLL_RATIO || elapsed < AUTO_COMPLETE_MIN_MS) return;
      autoCompleteSent = true;
      const ok = await post("complete");
      if (ok) {
        emitPathwayLessonProgress({
          pathwayId,
          lessonSlug,
          status: "completed",
          source: "auto",
        });
        if (typeof window !== "undefined") {
          window.dispatchEvent(new CustomEvent("nn-learner-stats-updated"));
        }
      } else {
        autoCompleteSent = false;
      }
    };

    const tick = () => {
      if (cancelled) return;
      const el = document.documentElement;
      const scrollable = el.scrollHeight - window.innerHeight;
      const ratio = scrollable <= 0 ? 1 : window.scrollY / scrollable;

      if (!engagePostedRef.current && ratio >= ENGAGE_SCROLL_RATIO) {
        engagePostedRef.current = true;
        void post("engage");
      }
      void tryAutoComplete(ratio);
    };

    const onScroll = () => {
      if (raf) cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        raf = 0;
        tick();
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true, capture: true });
    tick();

    return () => {
      cancelled = true;
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll, { capture: true });
    };
  }, [enabled, pathwayId, lessonSlug, initialProgress, allowAutoComplete]);

  return null;
}
