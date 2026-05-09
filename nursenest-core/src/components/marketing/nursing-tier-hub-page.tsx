"use client";

import { Activity, BookOpen, ClipboardList, Target } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useSession } from "next-auth/react";
import type { ExamPathwayDefinition } from "@/lib/exam-pathways/types";
import { buildExamPathwayPath } from "@/lib/exam-pathways/build-exam-pathway-path";
import { catPathwayExamCodeLabel } from "@/lib/exam-pathways/cat-pathway-labels";
import { appPathwayCatSessionStartPath } from "@/lib/exam-pathways/pathway-cat-flow";
import { ExamPathwayHubPremiumModules } from "@/components/exam-pathways/exam-pathway-hub-premium-modules";
import { FunnelExamHubViewBeacon } from "@/components/marketing/funnel-analytics-beacons";
import { MarketingTrackedLink } from "@/components/marketing/marketing-tracked-link";
import { StudyCard } from "@/components/ui/study-card";
import type { NursingTierHubActionId, NursingTierHubContent } from "@/lib/marketing/nursing-tier-hub-content";
import { resolveNursingTierHubStudyCardHref } from "@/lib/marketing/nursing-tier-hub-content";
import { useMarketingI18n } from "@/lib/marketing-i18n";
import { pathwayMarketingHubLinkContext } from "@/lib/marketing/np-seo-alias-analytics-props";
import { PH } from "@/lib/observability/posthog-conversion-events";
import type { PathwayHubResumePayload } from "@/lib/learner/pathway-lesson-continuation";
import { formatSentenceCase, formatTitleCase } from "@/lib/format/text-case";

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
  npSeoAliasSegment,
  emphasizeCatPracticeTests = false,
  hubResume: _hubResume,
  viewerSignedIn = false,
  viewerHasPathwayLessonAccess: _viewerHasPathwayLessonAccess,
}: {
  pathway: ExamPathwayDefinition;
  hubPath: string;
  content: NursingTierHubContent | null; // 🔥 allow null
  /** When set (NP practice-test SEO alias URLs), analytics props match {@link ExamPathwayHub}. */
  npSeoAliasSegment?: string;
  /** NP SEO alias hubs: highlight CAT practice-test intent — mirrors {@link ExamPathwayHubBody}. */
  emphasizeCatPracticeTests?: boolean;
  hubResume?: PathwayHubResumePayload | null;
  viewerSignedIn?: boolean;
  viewerHasPathwayLessonAccess?: boolean;
}) {
  const { t } = useMarketingI18n();
  const { status, data: clientSession } = useSession();
  const clientSignedIn = status === "authenticated" && Boolean((clientSession?.user as { id?: string } | undefined)?.id);
  const effectiveViewerSignedIn = viewerSignedIn || clientSignedIn;
  const linkCtx = pathwayMarketingHubLinkContext(pathway, npSeoAliasSegment);
  const catAppStartHref = appPathwayCatSessionStartPath(pathway.id);
  const catExamLabel = catPathwayExamCodeLabel(pathway);

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

  const rawTitle = content.title || pathway.shortName;
  const heading = formatTitleCase(rawTitle);
  const introRaw = content.intro?.trim();
  const intro = introRaw ? formatSentenceCase(introRaw) : "";
  const eyebrow = pathway.shortName.trim() || pathway.displayName;

  return (
    <>
      <FunnelExamHubViewBeacon pathway={pathway} hubPath={hubPath} />

      <div
        className="nn-premium-pathway-hub"
        data-nn-nursing-tier-hub="surface"
        data-pathway-track={pathway.roleTrack}
      >
        <section className="nn-hub-tier-study-band" aria-labelledby="nn-nursing-tier-hub-title">
          <div className="nn-nursing-tier-hub-hero-band">
            <p className="nn-premium-home-eyebrow">{eyebrow}</p>
            <h1
              id="nn-nursing-tier-hub-title"
              className="nn-marketing-h1 mt-4 max-w-[min(100%,42rem)] text-balance text-[var(--palette-heading)]"
            >
              {heading}
            </h1>
            {intro ? (
              <p className="nn-marketing-body mt-4 max-w-3xl text-pretty text-[var(--palette-text-muted)]">
                {intro}
              </p>
            ) : null}
          </div>

          <ul
            className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5"
            data-nn-hub-section="quick-actions"
          >
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

        <ExamPathwayHubPremiumModules
          pathway={pathway}
          isSignedIn={effectiveViewerSignedIn}
          npSeoAliasSegment={npSeoAliasSegment}
        />

        {emphasizeCatPracticeTests ? (
          <div className="nn-study-callout mt-6 px-4 py-4 sm:px-5">
            <p className="nn-marketing-h4">{t("components.examPathwayHub.body.catStripTitle")}</p>
            <p className="nn-marketing-body-sm mt-2 text-[var(--theme-muted-text)]">{t("components.examPathwayHub.body.catStripBody")}</p>
            {effectiveViewerSignedIn ? (
              <MarketingTrackedLink
                href={catAppStartHref}
                event={PH.marketingPathwayHubCta}
                eventProps={{
                  ...linkCtx,
                  surface: "cat_practice_strip",
                  pathway_id: pathway.id,
                  signed_in: true,
                  destination_type: "cat_practice_tests",
                  link_target: "app_pathway_cat_start",
                }}
                className="nn-marketing-body-sm mt-3 inline-flex font-semibold text-primary hover:underline"
              >
                {t("components.examPathwayHub.body.catCtaSignedIn", { exam: catExamLabel })}
              </MarketingTrackedLink>
            ) : (
              <MarketingTrackedLink
                href="/signup"
                event={PH.marketingPathwayHubCta}
                eventProps={{
                  ...linkCtx,
                  surface: "cat_practice_strip",
                  pathway_id: pathway.id,
                  signed_in: false,
                  destination_type: "signup",
                  link_target: "signup",
                }}
                className="nn-marketing-body-sm mt-3 inline-flex font-semibold text-primary hover:underline"
              >
                {t("components.examPathwayHub.body.catCtaSignup", { exam: catExamLabel })}
              </MarketingTrackedLink>
            )}
          </div>
        ) : null}
      </div>
    </>
  );
}
