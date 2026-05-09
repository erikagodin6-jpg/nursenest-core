"use client";

import { useEffect, useState } from "react";

/**
 * Document scroll-based reading progress for anonymous + signed-in lesson readers.
 * Fill uses semantic chart tokens (see `.nn-lesson-reading-progress` in premium-redesign CSS).
 */
export function LessonReadingScrollProgress() {
  const [pct, setPct] = useState(0);

  useEffect(() => {
    const tick = () => {
      const el = document.documentElement;
      const scrollable = el.scrollHeight - window.innerHeight;
      const ratio = scrollable <= 0 ? 1 : window.scrollY / scrollable;
      setPct(Math.min(100, Math.max(0, Math.round(ratio * 100))));
    };

    let raf = 0;
    const onScroll = () => {
      if (raf) cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        raf = 0;
        tick();
      });
    };

    tick();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <div
      data-nn-lesson-progress="reading"
      className="nn-lesson-reading-progress pointer-events-none relative z-[35] -mx-px"
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={pct}
      aria-label="Reading progress"
    >
      <div className="nn-lesson-reading-progress__track" aria-hidden>
        <div
          className="nn-lesson-reading-progress__fill"
          style={{ width: `${pct}%` }}
          data-nn-lesson-progress-fill
        />
      </div>
    </div>
  );
}
