"use client";

import { Activity, BookOpen, ClipboardList, Target } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useSession } from "next-auth/react";
import type { ExamPathwayDefinition } from "@/lib/exam-pathways/types";
import { buildExamPathwayPath } from "@/lib/exam-pathways/build-exam-pathway-path";
import { FunnelExamHubViewBeacon } from "@/components/marketing/funnel-analytics-beacons";
import { StudyCard } from "@/components/ui/study-card";
import type { NursingTierHubActionId, NursingTierHubContent } from "@/lib/marketing/nursing-tier-hub-content";
import { resolveNursingTierHubStudyCardHref } from "@/lib/marketing/nursing-tier-hub-content";
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
  flashcards: "nn-qa-nursing-tier-hub-flashcards-card",
  practice_questions: "nn-qa-nursing-tier-hub-practice-card",
  exams: "nn-qa-nursing-tier-hub-exams-card",
};

/** Matches `globals.css` hub role modifiers (see pre-nursing hub tiles). */
const ACTION_HUB_ROLE_CLASS: Record<NursingTierHubActionId, string> = {
  lessons: "nn-exam-hub-study-card--lessons",
  flashcards: "nn-exam-hub-study-card--flashcards",
  practice_questions: "nn-exam-hub-study-card--practice",
  exams: "nn-exam-hub-study-card--cat",
};

export function NursingTierHubPage({
  pathway,
  hubPath,
  content,
  npSeoAliasSegment: _npSeoAliasSegment,
  hubResume: _hubResume,
  viewerSignedIn = false,
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
  const { status, data: clientSession } = useSession();
  const clientSignedIn = status === "authenticated" && Boolean((clientSession?.user as { id?: string } | undefined)?.id);
  const effectiveViewerSignedIn = viewerSignedIn || clientSignedIn;

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

      <div data-nn-nursing-tier-hub="surface">
        <section>
          <h1>{title}</h1>

          <p>{content.intro || ""}</p>

          <ul className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {orderedActions.map((action) => {
              if (!action) return null;

              const Icon = ACTION_ICON[action.id];
              const href = resolveNursingTierHubStudyCardHref(pathway, action, {
                viewerSignedIn: effectiveViewerSignedIn,
              });
              const locked = action.disabled === true;
              const hubRoleClass = ACTION_HUB_ROLE_CLASS[action.id];
              const qaClass = ACTION_QA_CLASS[action.id];
              const cardClass = [qaClass, hubRoleClass].filter(Boolean).join(" ");
              const isAppFlashcardsTile = action.id === "flashcards" && href.startsWith("/app/flashcards");
              const isAppPracticeTestsTile = action.id === "exams" && href.startsWith("/app/practice-tests");

              return (
                <li key={action.id}>
                  <StudyCard
                    surface="hub"
                    variant={locked ? "locked" : "featured"}
                    href={locked ? buildExamPathwayPath(pathway) : href}
                    prefetch={isAppFlashcardsTile || isAppPracticeTestsTile ? false : undefined}
                    className={cardClass}
                    icon={Icon}
                    title={action.label || "Open"}
                    description={
                      locked && action.disabledNote
                        ? action.disabledNote
                        : action.description || ""
                    }
                    cta={locked ? (action.disabledNote || "Lessons Unavailable for This Pathway") : action.label || "Open"}
                  />
                </li>
              );
            })}
          </ul>
        </section>
      </div>
    </>
  );
}
