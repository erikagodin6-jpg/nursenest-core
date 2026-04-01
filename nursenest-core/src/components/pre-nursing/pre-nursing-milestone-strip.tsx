"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { PRE_NURSING_MODULE_REGISTRY } from "@/content/pre-nursing/pre-nursing-registry";
import strings from "@/content/pre-nursing/pre-nursing-strings-en.json";
import { PH } from "@/lib/observability/posthog-conversion-events";
import { trackClientEvent } from "@/lib/observability/posthog-client";
import {
  loadMergedPreNursingProgress,
  preNursingMilestoneMessage,
  type PreNursingProgressSnapshot,
} from "@/lib/pre-nursing/pre-nursing-progress-client";

const dict = strings as Record<string, string>;

function moduleTitleForSlug(s: string): string {
  const m = PRE_NURSING_MODULE_REGISTRY.find((x) => x.slug === s);
  return m ? dict[m.titleKey] ?? s : s;
}

export function PreNursingMilestoneStrip({
  sourceSurface,
  currentSlug,
}: {
  sourceSurface: "hub" | "module" | "study_plan" | "lessons_hub";
  currentSlug?: string;
}) {
  const [snapshot, setSnapshot] = useState<PreNursingProgressSnapshot | null>(null);

  useEffect(() => {
    void (async () => {
      setSnapshot(await loadMergedPreNursingProgress());
    })();
  }, []);

  const currentDone = useMemo(() => Boolean(currentSlug && snapshot?.completed.has(currentSlug)), [currentSlug, snapshot]);

  if (!snapshot) {
    return <div className="nn-card mb-6 p-4 text-sm text-muted">Loading progress…</div>;
  }

  const nextTitle = snapshot.nextSlug ? moduleTitleForSlug(snapshot.nextSlug) : null;
  const milestone = preNursingMilestoneMessage({
    completedCount: snapshot.completedCount,
    totalCount: snapshot.totalCount,
    currentModuleDone: currentDone,
  });

  return (
    <section className="nn-card mb-6 space-y-3 p-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm font-semibold text-[var(--theme-heading-text)]">Pre-Nursing progress</p>
        <p className="text-xs text-muted">
          {snapshot.completedCount}/{snapshot.totalCount} modules · {snapshot.progressPct}%
        </p>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-muted">
        <div className="h-full bg-role-success transition-[width] duration-300" style={{ width: `${snapshot.progressPct}%` }} />
      </div>
      <p className="text-sm text-muted">{milestone}</p>
      <div className="flex flex-wrap items-center gap-3 text-sm">
        {snapshot.nextSlug && nextTitle ? (
          <Link
            href={`/pre-nursing/lessons/${snapshot.nextSlug}`}
            className="font-semibold text-primary hover:underline"
            onClick={() =>
              trackClientEvent(PH.preNursingNextModuleClicked, {
                source_surface: sourceSurface,
                module_slug: snapshot.nextSlug!,
                completion_count: snapshot.completedCount,
                signed_in: snapshot.authenticated,
              })
            }
          >
            Next recommended: {nextTitle}
          </Link>
        ) : (
          <Link
            href="/exam-lessons"
            className="font-semibold text-primary hover:underline"
            onClick={() =>
              trackClientEvent(PH.preNursingExamLessonsHubClicked, {
                source_surface: sourceSurface,
                completion_count: snapshot.completedCount,
                signed_in: snapshot.authenticated,
                cta_type: "all_complete_next_step",
              })
            }
          >
            All complete — explore exam lesson hubs
          </Link>
        )}
        <Link href="/pre-nursing/study-plan" className="text-muted-foreground hover:text-primary hover:underline">
          Personalize pacing
        </Link>
      </div>
    </section>
  );
}

