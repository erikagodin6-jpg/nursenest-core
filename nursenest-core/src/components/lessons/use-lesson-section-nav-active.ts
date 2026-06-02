"use client";

import { useEffect, useRef, useState } from "react";

export type LessonSectionNavEntry = {
  id: string;
  heading: string;
};

/**
 * Tracks which lesson section anchor is currently in the reading viewport.
 */
export function useLessonSectionNavActive(sections: LessonSectionNavEntry[]) {
  const [activeId, setActiveId] = useState<string | null>(
    sections[0]?.id ?? null,
  );
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    if (typeof window === "undefined" || sections.length === 0) return;

    const sectionIdToY = new Map<string, number>();

    observerRef.current = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            sectionIdToY.set(entry.target.id, entry.boundingClientRect.top);
          } else {
            sectionIdToY.delete(entry.target.id);
          }
        }
        if (sectionIdToY.size === 0) return;
        let best: string | null = null;
        let bestY = Infinity;
        for (const [id, y] of sectionIdToY) {
          if (y < bestY) {
            bestY = y;
            best = id;
          }
        }
        if (best) setActiveId(best);
      },
      { rootMargin: "-12% 0px -62% 0px", threshold: 0 },
    );

    for (const section of sections) {
      const el = document.getElementById(section.id);
      if (el) observerRef.current.observe(el);
    }

    return () => observerRef.current?.disconnect();
  }, [sections]);

  const goTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      setActiveId(id);
    }
  };

  return { activeId, goTo };
}
