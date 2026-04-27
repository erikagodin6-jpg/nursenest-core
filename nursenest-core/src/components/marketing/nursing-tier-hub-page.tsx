"use client";

import { Activity, BookOpen, ClipboardList, Target } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { ExamPathwayDefinition } from "@/lib/exam-pathways/types";
import { buildExamPathwayPath } from "@/lib/exam-pathways/build-exam-pathway-path";
import { FunnelExamHubViewBeacon } from "@/components/marketing/funnel-analytics-beacons";
import { StudyCard } from "@/components/ui/study-card";
import type { NursingTierHubActionId, NursingTierHubContent } from "@/lib/marketing/nursing-tier-hub-content";
import { resolveNursingTierHubActionHref } from "@/lib/marketing/nursing-tier-hub-content";
import type { PathwayHubResumePayload } from "@/lib/learner/pathway-lesson-continuation";

const ACTION_ICON: Record<NursingTierHubActionId, LucideIcon> = {
  lessons: BookOpen,
  flashcards: ClipboardList,
  practice_questions: Target,
  exams: Activity,
};

/** Stable Playwright hooks — hub `StudyCard` applies this on the whole-card `Link`. */
const ACTION_QA_CLASS: Partial<Record<NursingTierHubActionId, string>> = {
  lessons: "nn-qa-nursing-tier-hub-lessons-card",
  practice_questions: "nn-qa-nursing-tier-hub-practice-card",
  exams: "nn-qa-nursing-tier-hub-exams-card",
};

export function NursingTierHubPage({
  pathway,
  hubPath,
  content,
  npSeoAliasSegment: _npSeoAliasSegment,
  hubResume: _hubResume,
  viewerSignedIn: _viewerSignedIn,
  viewerHasPathwayLessonAccess: _viewerHasPathwayLessonAccess,
}: {
  pathway: ExamPathwayDefinition;
  hubPath: string;
  content: NursingTierHubContent | null; // 🔥 allow null
  npSeoAliasSegment?: string;
  hubResume?: PathwayHubResumePayload | null;
  viewerSignedIn?: boolean;
  viewerHasPathwayLessonAccess?: boolean;
}) {
  // 🔥 HARD GUARD — prevents ALL crashes
  if (!content || !Array.isArray(content.actions)) {
    console.error("[NURSING HUB] invalid content", content);

    return (
      <div className="text-center py-12 text-red-500">
        Hub content failed to load
      </div>
    );
  }

  const actionsById = new Map(
    content.actions.map((action) => [action.id, action])
  );

  const orderedActions = (["lessons", "flashcards", "practice_questions", "exams"] as NursingTierHubActionId[])
    .map((id) => actionsById.get(id))
    .filter(Boolean);

  const title = content.title || pathway.shortName;

  return (
    <>
      <FunnelExamHubViewBeacon pathway={pathway} hubPath={hubPath} />

      <section>
        <h1>{title}</h1>

        <p>{content.intro || ""}</p>

        <ul className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {orderedActions.map((action) => {
            if (!action) return null;

            const Icon = ACTION_ICON[action.id];
            const href = resolveNursingTierHubActionHref(pathway, action);
            const locked = Boolean(action.disabled);

            return (
              <li key={action.id}>
                <StudyCard
                  surface="hub"
                  variant={locked ? "locked" : "featured"}
                  href={locked ? buildExamPathwayPath(pathway) : href}
                  className={ACTION_QA_CLASS[action.id]}
                  icon={Icon}
                  title={action.label || "Open"}
                  description={
                    locked && action.disabledNote
                      ? action.disabledNote
                      : action.description || ""
                  }
                  cta={locked ? (action.disabledNote || "Lessons unavailable for this pathway") : action.label || "Open"}
                />
              </li>
            );
          })}
        </ul>
      </section>
    </>
  );
}
