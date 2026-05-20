"use client";

import { useEffect, useMemo, useState } from "react";
import type { MedCalcProgressSnapshot } from "@/lib/med-calculations/med-calculations-engine";

export type MedCalcProgressMap = Record<string, MedCalcProgressSnapshot>;

const DEFAULT_PROGRESS: MedCalcProgressSnapshot = {
  strictAttempts: 0,
  strictPasses: 0,
  bestStreak: 0,
  totalAnswered: 0,
  correctAnswered: 0,
};

function storageKey(userId: string) {
  return `nn_med_calc_progress_${userId || "anon"}`;
}

export function readMedCalcProgress(userId: string): MedCalcProgressMap {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(storageKey(userId));
    if (!raw) return {};
    return JSON.parse(raw) as MedCalcProgressMap;
  } catch {
    return {};
  }
}

export function writeMedCalcProgress(userId: string, value: MedCalcProgressMap): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(storageKey(userId), JSON.stringify(value));
  } catch {
    /* ignore quota/private mode */
  }
}

export function mergeMedCalcProgress(
  current: MedCalcProgressMap,
  lessonSlug: string,
  patch: Partial<MedCalcProgressSnapshot>,
): MedCalcProgressMap {
  const base = current[lessonSlug] ?? DEFAULT_PROGRESS;
  return {
    ...current,
    [lessonSlug]: {
      strictAttempts: patch.strictAttempts ?? base.strictAttempts,
      strictPasses: patch.strictPasses ?? base.strictPasses,
      bestStreak: patch.bestStreak ?? base.bestStreak,
      totalAnswered: patch.totalAnswered ?? base.totalAnswered,
      correctAnswered: patch.correctAnswered ?? base.correctAnswered,
    },
  };
}

export function useMedCalcProgress(userId: string) {
  const [progress, setProgress] = useState<MedCalcProgressMap>({});

  useEffect(() => {
    setProgress(readMedCalcProgress(userId));
  }, [userId]);

  useEffect(() => {
    writeMedCalcProgress(userId, progress);
  }, [progress, userId]);

  const totals = useMemo(() => {
    return Object.values(progress).reduce(
      (acc, row) => {
        acc.strictAttempts += row.strictAttempts;
        acc.strictPasses += row.strictPasses;
        acc.totalAnswered += row.totalAnswered;
        acc.correctAnswered += row.correctAnswered;
        acc.bestStreak = Math.max(acc.bestStreak, row.bestStreak);
        return acc;
      },
      { strictAttempts: 0, strictPasses: 0, totalAnswered: 0, correctAnswered: 0, bestStreak: 0 },
    );
  }, [progress]);

  return { progress, setProgress, totals };
}
