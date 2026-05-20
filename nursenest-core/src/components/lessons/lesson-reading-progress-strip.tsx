"use client";

import { useEffect, useMemo, useState } from "react";
import { useLessonSectionNavActive } from "@/components/lessons/use-lesson-section-nav-active";
import type { LessonSectionNavEntry } from "@/components/lessons/use-lesson-section-nav-active";

export function LessonReadingProgressStrip({
  sections,
}: {
  sections: LessonSectionNavEntry[];
}) {
  const { activeId } = useLessonSectionNavActive(sections);
  const [scrollPct, setScrollPct] = useState(0);

  useEffect(() => {
    const tick = () => {
      const el = document.documentElement;
      const scrollable = el.scrollHeight - window.innerHeight;
      const ratio = scrollable <= 0 ? 1 : window.scrollY / scrollable;
      setScrollPct(Math.min(100, Math.max(0, Math.round(ratio * 100))));
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

  const activeIndex = useMemo(() => {
    const idx = sections.findIndex((section) => section.id === activeId);
    return idx >= 0 ? idx + 1 : 1;
  }, [activeId, sections]);

  const total = Math.max(sections.length, 1);
  const pct = scrollPct > 0 ? scrollPct : Math.round((activeIndex / total) * 100);

  return (
    <section
      className="nn-lesson-reading-progress-strip"
      data-nn-lesson-reading-progress-strip
      aria-label="Lesson progress"
    >
      <div className="nn-lesson-reading-progress-strip__top">
        <span>Lesson progress</span>
        <span>
          <b>{activeIndex}</b> of <b>{total}</b> sections · <b>{pct}%</b>
        </span>
      </div>
      <div className="nn-lesson-reading-progress-strip__bar" aria-hidden="true">
        <span style={{ width: `${pct}%` }} />
      </div>
    </section>
  );
}
