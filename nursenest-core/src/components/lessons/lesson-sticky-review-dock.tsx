"use client";

import { useEffect, useState } from "react";

export function LessonStickyReviewDock({
  enabled = true,
  targetId = "lesson-retention-review",
}: {
  enabled?: boolean;
  targetId?: string;
}) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!enabled || typeof window === "undefined") return;
    let raf = 0;
    const update = () => {
      cancelAnimationFrame(raf);
      raf = window.requestAnimationFrame(() => {
        const max = document.documentElement.scrollHeight - window.innerHeight;
        const ratio = max > 0 ? window.scrollY / max : 0;
        setVisible(ratio > 0.62);
      });
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <aside
      className="nn-lesson-sticky-review-dock"
      data-visible={visible ? "true" : "false"}
      aria-label="Lesson review shortcut"
    >
      <div className="nn-lesson-sticky-review-dock__text">
        <strong>Ready for review?</strong>
        <span>Jump to retention and exam readiness.</span>
      </div>
      <a href={`#${targetId}`}>Review</a>
    </aside>
  );
}
