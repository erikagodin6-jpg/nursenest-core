"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";

const storageKey = (courseId: string) => `nn_internal_course_progress:${courseId}`;

const INTERNAL_COURSE_PROGRESS_EVENT = "nn-internal-course-progress-changed";

type ProgressV1 = {
  v: 1;
  completedModuleIds: string[];
  lastVisitedModuleId?: string | null;
};

function readProgress(courseId: string): ProgressV1 {
  if (typeof window === "undefined") {
    return { v: 1, completedModuleIds: [] };
  }
  try {
    const raw = localStorage.getItem(storageKey(courseId));
    if (!raw) return { v: 1, completedModuleIds: [] };
    const j = JSON.parse(raw) as Partial<ProgressV1>;
    const ids = Array.isArray(j.completedModuleIds)
      ? j.completedModuleIds.filter((x): x is string => typeof x === "string" && x.length > 0)
      : [];
    const last =
      typeof j.lastVisitedModuleId === "string" && j.lastVisitedModuleId.length > 0
        ? j.lastVisitedModuleId
        : null;
    return { v: 1, completedModuleIds: ids, lastVisitedModuleId: last };
  } catch {
    return { v: 1, completedModuleIds: [] };
  }
}

function writeProgress(courseId: string, next: ProgressV1) {
  try {
    localStorage.setItem(storageKey(courseId), JSON.stringify(next));
  } catch {
    /* ignore quota */
  }
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent(INTERNAL_COURSE_PROGRESS_EVENT, { detail: { courseId } }));
  }
}

export function InternalCourseProgressBanner(props: {
  courseId: string;
  moduleIdsInOrder: string[];
}) {
  const { courseId, moduleIdsInOrder } = props;
  const [mounted, setMounted] = useState(false);
  const [completed, setCompleted] = useState<string[]>([]);
  const [lastVisited, setLastVisited] = useState<string | null>(null);

  const refresh = useCallback(() => {
    const p = readProgress(courseId);
    setCompleted(p.completedModuleIds);
    setLastVisited(p.lastVisitedModuleId ?? null);
  }, [courseId]);

  useEffect(() => {
    setMounted(true);
    refresh();
  }, [refresh]);

  const total = moduleIdsInOrder.length;
  const done = completed.filter((id) => moduleIdsInOrder.includes(id)).length;
  const pct = total === 0 ? 0 : Math.round((done / total) * 100);

  const firstIncomplete = useMemo(() => moduleIdsInOrder.find((id) => !completed.includes(id)), [moduleIdsInOrder, completed]);

  const continueTarget = useMemo(() => {
    if (
      lastVisited &&
      moduleIdsInOrder.includes(lastVisited) &&
      !completed.includes(lastVisited)
    ) {
      return lastVisited;
    }
    return firstIncomplete ?? null;
  }, [lastVisited, moduleIdsInOrder, completed, firstIncomplete]);

  useEffect(() => {
    const onProgress = (e: Event) => {
      const d = (e as CustomEvent<{ courseId?: string }>).detail;
      if (d?.courseId === courseId) refresh();
    };
    window.addEventListener(INTERNAL_COURSE_PROGRESS_EVENT, onProgress as EventListener);
    return () => window.removeEventListener(INTERNAL_COURSE_PROGRESS_EVENT, onProgress as EventListener);
  }, [courseId, refresh]);

  const onStorage = useCallback(
    (e: StorageEvent) => {
      if (e.key === storageKey(courseId)) refresh();
    },
    [courseId, refresh],
  );

  useEffect(() => {
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [onStorage]);

  if (!mounted) {
    return (
      <div className="mb-6 rounded-lg border border-border bg-muted/20 px-4 py-3 text-sm text-muted-foreground">
        Loading progress…
      </div>
    );
  }

  return (
    <div className="mb-6 space-y-2 rounded-lg border border-[color-mix(in_srgb,var(--semantic-brand)_18%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-panel-positive)_10%,transparent)] px-4 py-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm font-semibold text-foreground">Your progress</p>
        <span className="text-xs font-medium text-muted-foreground">
          {done}/{total} modules · {pct}%
        </span>
      </div>
      <div className="nn-progress-track-semantic h-2 w-full overflow-hidden rounded-full bg-muted/50">
        <div
          className="nn-progress-fill-semantic-brand h-full rounded-full transition-[width] duration-300"
          style={{ width: `${pct}%` }}
        />
      </div>
      {continueTarget ? (
        <p className="text-xs text-muted-foreground">
          <Link href={`#mod-${continueTarget}`} className="font-semibold text-primary underline-offset-2 hover:underline">
            Continue where you left off
          </Link>
        </p>
      ) : total > 0 && done >= total ? (
        <p className="text-xs font-medium text-[color-mix(in_srgb,var(--semantic-success)_85%,var(--foreground))]">
          All modules marked complete.
        </p>
      ) : null}
    </div>
  );
}

export function InternalCourseModuleProgressShell(props: {
  courseId: string;
  moduleId: string;
  children: React.ReactNode;
}) {
  const { courseId, moduleId, children } = props;
  const [mounted, setMounted] = useState(false);
  const [complete, setComplete] = useState(false);

  useEffect(() => {
    setMounted(true);
    const p = readProgress(courseId);
    setComplete(p.completedModuleIds.includes(moduleId));
  }, [courseId, moduleId]);

  const toggle = useCallback(() => {
    const p = readProgress(courseId);
    const setIds = new Set(p.completedModuleIds);
    if (setIds.has(moduleId)) setIds.delete(moduleId);
    else setIds.add(moduleId);
    const next: ProgressV1 = {
      v: 1,
      completedModuleIds: [...setIds],
      lastVisitedModuleId: moduleId,
    };
    writeProgress(courseId, next);
    setComplete(next.completedModuleIds.includes(moduleId));
  }, [courseId, moduleId]);

  return (
    <div id={`mod-${moduleId}`} className="scroll-mt-24 space-y-3">
      {children}
      {mounted ? (
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={toggle}
            className="rounded-lg border border-border bg-background/80 px-3 py-1.5 text-xs font-semibold text-foreground hover:bg-muted/40"
          >
            {complete ? "Mark module incomplete" : "Mark module complete"}
          </button>
        </div>
      ) : null}
    </div>
  );
}
