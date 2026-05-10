"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

export type ClinicalSkillsProgressState = {
  completedSlugs: string[];
  lastSlug: string | null;
  lastViewedMs: number;
};

const STORAGE_PREFIX = "nn.clinical-skills.v1:";

function safeParse(raw: string | null): ClinicalSkillsProgressState | null {
  if (!raw) return null;
  try {
    const v = JSON.parse(raw) as Partial<ClinicalSkillsProgressState>;
    const completedSlugs = Array.isArray(v.completedSlugs)
      ? v.completedSlugs.filter((s) => typeof s === "string").map((s) => s.trim()).filter(Boolean)
      : [];
    const lastSlug = typeof v.lastSlug === "string" && v.lastSlug.trim() ? v.lastSlug.trim() : null;
    const lastViewedMs = typeof v.lastViewedMs === "number" && Number.isFinite(v.lastViewedMs) ? v.lastViewedMs : 0;
    return { completedSlugs, lastSlug, lastViewedMs };
  } catch {
    return null;
  }
}

export function useClinicalSkillsProgress(userId: string | null) {
  const key = useMemo(() => `${STORAGE_PREFIX}${userId?.trim() || "anon"}`, [userId]);

  const [state, setState] = useState<ClinicalSkillsProgressState>({
    completedSlugs: [],
    lastSlug: null,
    lastViewedMs: 0,
  });

  useEffect(() => {
    if (typeof window === "undefined") return;
    const parsed = safeParse(window.localStorage.getItem(key));
    if (parsed) setState(parsed);
  }, [key]);

  const persist = useCallback((updater: (prev: ClinicalSkillsProgressState) => ClinicalSkillsProgressState) => {
    setState((prev) => {
      const next = updater(prev);
      try {
        window.localStorage.setItem(key, JSON.stringify(next));
      } catch {
        /* quota / private mode */
      }
      return next;
    });
  }, [key]);

  const markViewed = useCallback(
    (slug: string) => {
      const s = slug.trim();
      if (!s) return;
      persist((prev) => ({
        ...prev,
        lastSlug: s,
        lastViewedMs: Date.now(),
      }));
    },
    [persist],
  );

  const markCompleted = useCallback(
    (slug: string) => {
      const s = slug.trim();
      if (!s) return;
      persist((prev) => {
        const completedSlugs = prev.completedSlugs.includes(s) ? prev.completedSlugs : [...prev.completedSlugs, s];
        return {
          completedSlugs,
          lastSlug: s,
          lastViewedMs: Date.now(),
        };
      });
    },
    [persist],
  );

  return { state, markViewed, markCompleted };
}
