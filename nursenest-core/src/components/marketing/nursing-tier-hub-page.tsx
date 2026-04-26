"use client";

import Link from "next/link";
import { useCallback } from "react";
import { Activity, BookOpen, ClipboardList, Target } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { ExamPathwayDefinition } from "@/lib/exam-pathways/types";
import { ExamPathwayWaitlistBanner } from "@/components/exam-pathways/exam-pathway-waitlist-banner";
import { NpSeoAliasHubAnalytics } from "@/components/marketing/np-seo-alias-hub-analytics";
import { FunnelExamHubViewBeacon } from "@/components/marketing/funnel-analytics-beacons";
import { StudyCard } from "@/components/ui/study-card";
import type { NursingTierHubActionId, NursingTierHubContent } from "@/lib/marketing/nursing-tier-hub-content";
import type { PathwayHubResumePayload } from "@/lib/learner/pathway-lesson-continuation";
import { pathwayMarketingHubLinkContext } from "@/lib/marketing/np-seo-alias-analytics-props";
import { PH } from "@/lib/observability/posthog-conversion-events";
import { pathwayAnalyticsDimensions, trackProductEvent } from "@/lib/observability/product-analytics";
import { buildExamPathwayPath } from "@/lib/exam-pathways/build-exam-pathway-path";
import { selectMarketingTierHubContextualCta } from "@/lib/conversion/select-marketing-tier-hub-contextual-cta";
import { MarketingTierHubContextualCta } from "@/components/conversion/marketing-tier-hub-contextual-cta";

const ACTION_ICON: Record<NursingTierHubActionId, LucideIcon> = {
  lessons: BookOpen,
  flashcards: ClipboardList,
  practice_questions: Target,
  exams: Activity,
};

export function NursingTierHubPage({
  pathway,
  hubPath,
  content,
  npSeoAliasSegment,
  hubResume,
  viewerSignedIn = false,
  viewerHasPathwayLessonAccess = false,
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

  const linkCtx = pathwayMarketingHubLinkContext(pathway, npSeoAliasSegment);

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

            return (
              <li key={action.id}>
                <StudyCard
                  surface="hub"
                  variant="featured"
                  href={action.href || "#"}
                  icon={Icon}
                  title={action.label || "Open"}
                  description={action.description || ""}
                  cta={action.label || "Open"}
                />
              </li>
            );
          })}
        </ul>
      </section>
    </>
  );
}