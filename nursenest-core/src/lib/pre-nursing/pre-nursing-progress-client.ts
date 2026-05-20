"use client";

import { PRE_NURSING_MODULE_REGISTRY } from "@/content/pre-nursing/pre-nursing-registry";
import { nextPreNursingModuleSlug, preNursingCompletionFraction } from "@/lib/pre-nursing/pre-nursing-adaptive";

const LS_KEY = "pre-nursing-completed-slugs-v1";

export type PreNursingProgressSnapshot = {
  authenticated: boolean;
  completed: Set<string>;
  completedCount: number;
  totalCount: number;
  progressPct: number;
  nextSlug: string | null;
};

type ProgressApi = {
  authenticated: boolean;
  completedSlugs: string[];
};

export function readLocalPreNursingCompleted(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(LS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((x): x is string => typeof x === "string");
  } catch {
    return [];
  }
}

export function writeLocalPreNursingCompleted(slugs: string[]) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(LS_KEY, JSON.stringify(slugs));
  } catch {
    // ignore localStorage quota errors
  }
}

export async function loadMergedPreNursingProgress(): Promise<PreNursingProgressSnapshot> {
  const local = new Set(readLocalPreNursingCompleted());
  let authenticated = false;
  try {
    const res = await fetch("/api/learner/pre-nursing-progress", { method: "GET" });
    if (res.ok) {
      const api = (await res.json()) as ProgressApi;
      authenticated = api.authenticated === true;
      for (const s of api.completedSlugs ?? []) local.add(s);
    }
  } catch {
    // fallback to local-only progress
  }
  const completed = new Set<string>(
    [...local].filter((slug) => PRE_NURSING_MODULE_REGISTRY.some((m) => m.slug === slug)),
  );
  const completedCount = completed.size;
  const { pct, total } = preNursingCompletionFraction(completedCount);
  return {
    authenticated,
    completed,
    completedCount,
    totalCount: total,
    progressPct: pct,
    nextSlug: nextPreNursingModuleSlug(completed),
  };
}

export function preNursingMilestoneMessage(args: {
  completedCount: number;
  totalCount: number;
  currentModuleDone?: boolean;
}): string {
  const { completedCount, totalCount, currentModuleDone } = args;
  if (totalCount <= 0) return "Start with one module to begin your Pre-Nursing foundation.";
  if (completedCount >= totalCount) return "You completed every Pre-Nursing module. You are ready to choose your exam-prep pathway.";
  if (completedCount >= Math.max(1, totalCount - 1)) return "Nearly done. This is a strong moment to compare RN, PN/RPN, or NP next steps.";
  if (completedCount >= Math.ceil(totalCount / 2)) return "Halfway there. Your foundation is solid enough to start pathway planning.";
  if (completedCount >= 3) return "You built momentum across multiple modules. Keep consistency and start planning what comes next.";
  if (currentModuleDone || completedCount >= 1) return "Great start. Keep your momentum with the next recommended module.";
  return "Start your first module to build momentum and unlock personalized recommendations.";
}

