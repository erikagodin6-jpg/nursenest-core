import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import {
  Activity,
  BookOpenCheck,
  Brain,
  Calculator,
  ClipboardCheck,
  FileQuestion,
  FlaskConical,
  HeartPulse,
  Layers,
  Stethoscope,
} from "lucide-react";
import { ExamFamily, type TierCode } from "@prisma/client";
import { PathwayLessonSectionContent } from "@/components/lessons/pathway-lesson-body";
import { LessonSectionCard } from "@/components/lessons/lesson-section-card";
import { LessonReadingScrollProgress } from "@/components/lessons/lesson-reading-scroll-progress";
import { contentTierForPathwayLessonRender } from "@/lib/lessons/global-lesson-architecture";
import { cookies } from "next/headers";
import { resolveLessonMeasurementSystem } from "@/lib/measurements/resolve-lesson-measurement-system";
import {
  readMeasurementPreferenceFromCookieStore,
  type MeasurementPreference,
} from "@/lib/measurements/measurement-preference";
import { LessonMeasurementUnitsBar } from "@/components/lessons/lesson-measurement-units-bar";
import { PremiumLessonPublishNotice } from "@/components/lessons/premium-lesson-publish-notice";
import { PathwayLessonLockedSectionsPreview } from "@/components/lessons/pathway-lesson-locked-sections-preview";
import { PathwayLessonActions } from "@/components/lessons/pathway-lesson-actions";
import { computePathwayLessonLinkedLearningSignals } from "@/lib/lessons/pathway-lesson-linked-learning-assets";
import { PathwayLessonProgressBadgeLive } from "@/components/lessons/pathway-lesson-progress-badge-live";
import { PathwayLessonProgressTracker } from "@/components/lessons/pathway-lesson-progress-tracker";
import { loadMarketingPathwayLessonViewerContext } from "@/lib/lessons/marketing-pathway-lesson-viewer-context.server";
import { buildExamPathwayPath } from "@/lib/exam-pathways/exam-product-registry";
import type { ExamPathwayDefinition } from "@/lib/exam-pathways/types";
import { marketingPathwayLessonsIndexPath } from "@/lib/lessons/lesson-routes";
import { PathwayLessonPreviewBanner } from "@/components/lessons/pathway-lesson-preview-banner";
import {
  getPathwayLessonPreviewKind,
  sanitizePaywallPreviewSection,
  visibleSectionsForLesson,
} from "@/lib/lessons/pathway-lesson-access";
import { resolveMarketingPathwayLessonRouteResolution } from "@/lib/lessons/pathway-lesson-route-access";
import { normalizePathwayLessonLocale } from "@/lib/lessons/pathway-lesson-locale";
import { loadPathwayLessonWithLegacySlugRedirect } from "@/lib/lessons/pathway-lesson-detail-redirect";
import { EeatContentAttribution } from "@/components/seo/eeat-content-attribution";
import { PathwayLessonMedicalEducationJsonLd } from "@/components/seo/seo-json-ld";
import { BreadcrumbsFromResolution } from "@/components/navigation/breadcrumbs";
import { LessonsPageShell } from "@/components/pathway-lessons/lessons-page-shell";
import { EMPTY_QUESTION_SNAPSHOT } from "@/lib/exam-pathways/marketing-hub-fallbacks";
import { loadPathwayQuestionBankSnapshot } from "@/lib/exam-pathways/pathway-question-bank-snapshot.server";
import { marketingCatCompletePoolUsable } from "@/lib/exam-pathways/pathway-marketing-practice-gates";
import {
  buildMarketingLessonHubSurfaceChips,
  type MarketingLessonHubSurfaceChip,
} from "@/lib/marketing/marketing-lesson-hub-surface-chips";
import {
  buildLessonHubPremiumModuleStripLinks,
  type LessonHubPremiumStripLink,
} from "@/lib/marketing/lesson-hub-premium-module-strip";
import { resolveBreadcrumbResolution } from "@/lib/breadcrumbs/breadcrumb-resolver";
import { getPathwayLessonContentDates } from "@/lib/seo/pathway-lesson-content-dates";
import { MarketingStudyCrossLinks } from "@/components/seo/marketing-study-cross-links";
import { LessonQualityNotice } from "@/components/lessons/lesson-quality-notice";
import { classifyPathwayLesson } from "@/lib/content-quality/classify-lesson";
import { buildQuickReviewBullets } from "@/lib/lessons/pathway-lesson-quick-review";
import {
  extractExamFocusHighYieldLines,
  extractSecondaryExamContextLines,
} from "@/lib/lessons/pathway-lesson-study-extract";
import { LessonReadingViewport } from "@/components/lessons/lesson-reading-viewport";
import { extractClinicalPearlLines } from "@/lib/lessons/extract-clinical-pearl-lines";
import { rnLessonSectionStackClass } from "@/lib/lessons/rn-reading-stack";
import {
  PREMIUM_LESSON_READING_V2_SHELL_CLASS,
  usesPremiumLessonReadingV2Layout,
} from "@/lib/lessons/premium-lesson-reading-v2";
import { PathwayLessonQuickClinicalSummary } from "@/components/lessons/pathway-lesson-quick-clinical-summary";
import { resolveLessonImage } from "@/lib/content/resolve-lesson-image";
import { hasRenderableLessonImageUrl } from "@/lib/lessons/has-renderable-lesson-image";
import { LessonClinicalImageCard } from "@/components/lessons/lesson-clinical-image-card";
import { LessonAudioCard } from "@/components/lessons/lesson-audio-card";
import { LessonSectionAudioButton } from "@/components/lessons/lesson-section-audio-button";
import { pathwayLessonPublicDetailPath } from "@/lib/lessons/pathway-lesson-types";
import { LessonCheckpointCard } from "@/components/lessons/lesson-checkpoint-card";
import { LessonRecallProvider } from "@/components/lessons/lesson-recall-context";
import { LessonRecallToggle } from "@/components/lessons/lesson-recall-toggle";
import { LessonRecallBlock } from "@/components/lessons/lesson-recall-block";
import { LessonKeyRecallChip } from "@/components/lessons/lesson-key-recall-chip";
import {
  loadPathwayLessonProgressForSlug,
  type PathwayLessonProgressStatus,
} from "@/lib/lessons/pathway-lesson-progress";
import { PathwayLessonAssessmentExperienceLazy } from "@/components/lessons/pathway-lesson-assessment-experience-lazy";
import { PathwayLessonDetailHeader } from "@/components/lessons/pathway-lesson-detail-header";
import {
  pathwayCountryLabel,
  pathwayRegionAwareExamName,
} from "@/lib/lessons/pathway-lesson-hub-seo";
import { pathwayAllowsCatAdaptiveStart } from "@/lib/exam-pathways/pathway-entitlements-policy";
import type { AccessScope } from "@/lib/entitlements/user-access-types";
import type { PathwayLessonQuizItem } from "@/lib/lessons/pathway-lesson-types";
import {
  PathwayLessonDetailDeferred,
  PathwayLessonDetailDeferredSkeleton,
} from "@/components/lessons/pathway-lesson-detail-deferred";
import { PathwayLessonRecordChips } from "@/components/pathway-lessons/pathway-lesson-record-chips";
import { LearnerSurfaceCard } from "@/components/ui/learner-surface-card";
import { lessonSectionSurface } from "@/components/lessons/lesson-section-card";
import { MarketingPathwayLessonDetailViewBeacon } from "@/components/observability/marketing-study-surface-view-beacons";
import { loadStudySettings } from "@/lib/learner/load-study-settings";
import { DEFAULT_STUDY_SETTINGS } from "@/lib/learner/study-settings";
import { cleanLessonTitleForDisplay } from "@/lib/lessons/lesson-title-presentation";
import { buildAlliedAwareLessonPublicSeoSurface } from "@/lib/allied/allied-lesson-seo-differentiation";
import {
  pathwayLessonSectionPrefersWideColumn,
  shouldRenderPathwayLessonSection,
} from "@/lib/lessons/lesson-section-page-layout";
import {
  pathwayLessonSectionHasRenderableTeachingContent,
  sortPathwayLessonSectionsForClinicalDisplay,
} from "@/lib/lessons/pathway-lesson-detail-display";
import { ExamTakeawaysBlock } from "@/components/lessons/exam-takeaways-block";
import {
  PathwayLessonCommonTrapsStrip,
  PathwayLessonMemoryAnchorStrip,
} from "@/components/lessons/pathway-lesson-study-strips";
import { lessonHasExamTakeaways } from "@/lib/lessons/exam-takeaways-items";
import { isLessonRetentionSectionKind } from "@/lib/lessons/lesson-retention-section";
import { LessonStickyReviewDock } from "@/components/lessons/lesson-sticky-review-dock";
import { resolveQuizEmbedQuestionsForLessonSlug } from "@/lib/lessons/lesson-quiz-embeds";
import { PathwayLessonQuizEmbedSection } from "@/components/lessons/pathway-lesson-quiz-embed-section";
import { resolvePathwayLessonBankAssessments } from "@/lib/lessons/lesson-bank-assessment-selection";
import {
  loadPathwayLessonAdjacent,
  mapPathwayLessonAdjacentToHrefs,
} from "@/lib/lessons/pathway-lesson-adjacent";
import { PathwayLessonSequenceNavBar } from "@/components/lessons/pathway-lesson-sequence-nav";
import { PathwayLessonStickySequenceNav } from "@/components/lessons/pathway-lesson-sticky-sequence-nav";
import {
  pickPathwayLessonMarketingRecordChipsSource,
  toPathwayLessonDeferredServerSnapshot,
} from "@/lib/lessons/marketing-pathway-lesson-client-contract";
import { DEFAULT_MARKETING_LOCALE } from "@/lib/i18n/marketing-locale-policy";
import { formatMarketingMessage } from "@/lib/marketing-i18n-core";
import { loadMarketingMessageShardsSync } from "@/lib/marketing-i18n/load-marketing-message-shards";
import { LEARNER_APP_MESSAGE_SHARDS } from "@/lib/marketing-i18n/marketing-i18n-shard-groups";
import { safeServerLog } from "@/lib/observability/safe-server-log";
import { StaffEditLivePageBanner } from "@/components/staff/staff-edit-live-page-banner";
import { buildAdminPathwayLessonStableEditHref } from "@/lib/admin/pathway-lesson-stable-edit-href";
import { HUB } from "@/lib/marketing/marketing-entry-routes";
import { PathwayLessonDetailMarketingI18nLayer } from "@/components/lessons/pathway-lesson-detail-marketing-i18n-layer";
import { AutomaticRelatedContentForPublic } from "@/components/linking/automatic-related-content-for-public";
import { PathwayLessonTopicSiblingsStrip } from "@/components/lessons/pathway-lesson-topic-siblings-strip";
import { PathwayLessonRemediationChain } from "@/components/lessons/pathway-lesson-remediation-chain";
import { buildLessonDetailAutomaticRelatedExcludeHrefs } from "@/lib/linking/lesson-detail-automatic-related-excludes";
import { resolveMarketingHubEcgModulePublic } from "@/lib/ecg-module/ecg-marketing-hub-surface.server";

/**
 * Paywall: full `PathwayLessonRecord` / `sections[]` stay in this server component. Gate with
 * `canViewFullPathwayLesson` / `visibleSectionsForLesson` before rendering; pass only thin props into
 * `"use client"` surfaces (see `marketing-pathway-lesson-client-contract.ts`). Subscriber-only supplements
 * (takeaways, memory anchor, traps) render only when `fullAccess` is true.
 */

export type PathwayLessonDetailPageBodyProps = {
  pathway: ExamPathwayDefinition;
  pathname: string;
  lessonSlug: string;
  lessonContentLocale: string;
};

type ContinueLearningCard = {
  label: string;
  href: string;
  count?: number | null;
  note: string;
};

const CONTINUE_LEARNING_ICONS = {
  activity: Activity,
  book: BookOpenCheck,
  brain: Brain,
  calculator: Calculator,
  check: ClipboardCheck,
  flask: FlaskConical,
  heart: HeartPulse,
  layers: Layers,
  question: FileQuestion,
  stethoscope: Stethoscope,
} as const;

function continueLearningLabel(label: string): string {
  const normalized = label.trim().toLowerCase();
  if (normalized.includes("adaptive cat")) return "CAT Readiness";
  if (normalized.includes("practice exam")) return "Practice Exams";
  if (normalized.includes("question")) return "Practice Questions";
  if (normalized.includes("flashcard")) return "Flashcards";
  if (normalized.includes("lab")) return "Lab Interpretation";
  if (normalized.includes("medication") || normalized.includes("med calc")) return "Medication Math";
  if (normalized.includes("ecg")) return "ECG Practice";
  if (normalized.includes("prioritization") || normalized.includes("delegation")) return "Prioritization & Delegation";
  if (normalized.includes("clinical skills")) return "Skills Refreshers";
  if (normalized.includes("pharmacology")) return "Pharmacology Practice";
  if (normalized.includes("case") || normalized.includes("scenario")) return "Case Studies";
  return label;
}

function continueLearningNote(label: string): string {
  switch (label) {
    case "Practice Questions":
      return "Apply this topic with board-style rationales.";
    case "Flashcards":
      return "Review recall prompts tied to the same study pool.";
    case "Case Studies":
      return "Practice clinical judgment with unfolding scenarios.";
    case "CAT Readiness":
      return "Check adaptive readiness when you are ready to test.";
    case "Medication Math":
      return "Reinforce dosage, infusion, and safety calculations.";
    case "ECG Practice":
      return "Move from concepts into rhythm recognition.";
    case "Lab Interpretation":
      return "Connect abnormal values to nursing actions.";
    case "Prioritization & Delegation":
      return "Practice who to see first and what to escalate.";
    case "Practice Exams":
      return "Build stamina with exam-mode practice.";
    case "Skills Refreshers":
      return "Review safety sequences and competency steps.";
    case "Pharmacology Practice":
      return "Connect drug classes to monitoring priorities.";
    default:
      return "Continue with a related study activity.";
  }
}

function continueLearningIcon(label: string): keyof typeof CONTINUE_LEARNING_ICONS {
  switch (label) {
    case "Practice Questions":
      return "question";
    case "Flashcards":
      return "layers";
    case "Case Studies":
      return "book";
    case "CAT Readiness":
      return "brain";
    case "Medication Math":
      return "calculator";
    case "ECG Practice":
      return "heart";
    case "Lab Interpretation":
      return "flask";
    case "Prioritization & Delegation":
      return "activity";
    case "Practice Exams":
      return "check";
    case "Skills Refreshers":
      return "stethoscope";
    case "Pharmacology Practice":
      return "stethoscope";
    default:
      return "book";
  }
}

function buildContinueLearningCards({
  surfaceChips,
  moduleLinks,
  questionCount,
  catCount,
}: {
  surfaceChips: MarketingLessonHubSurfaceChip[];
  moduleLinks: LessonHubPremiumStripLink[];
  questionCount: number | null;
  catCount: number | null;
}): ContinueLearningCard[] {
  const cards: ContinueLearningCard[] = [];
  const seen = new Set<string>();
  const add = (label: string, href: string, count?: number | null) => {
    const cleanLabel = continueLearningLabel(label);
    const key = `${cleanLabel}::${href}`;
    if (!href.trim() || seen.has(key)) return;
    seen.add(key);
    cards.push({
      label: cleanLabel,
      href,
      count: typeof count === "number" && Number.isFinite(count) ? count : null,
      note: continueLearningNote(cleanLabel),
    });
  };

  for (const chip of surfaceChips) {
    const normalized = chip.label.toLowerCase();
    add(
      chip.label,
      chip.href,
      normalized.includes("question")
        ? questionCount
        : normalized.includes("adaptive cat")
          ? catCount
          : null,
    );
  }
  for (const link of moduleLinks) add(link.label, link.href, null);
  return cards;
}

function ContinueLearningSection({ cards }: { cards: ContinueLearningCard[] }) {
  if (!cards.length) return null;
  const numberFormatter = new Intl.NumberFormat("en");
  return (
    <section
      className="mt-8 rounded-2xl border border-[color-mix(in_srgb,var(--semantic-border-soft)_88%,var(--semantic-brand)_12%)] bg-[color-mix(in_srgb,var(--semantic-surface)_92%,var(--semantic-panel-cool)_8%)] p-4 shadow-[var(--semantic-shadow-soft)] sm:p-5"
      aria-labelledby="lesson-continue-learning-heading"
      data-testid="pathway-lesson-continue-learning"
      data-nn-lesson-continue-learning
    >
      <div className="max-w-2xl">
        <p className="nn-lesson-module-eyebrow">Next study step</p>
        <h2 id="lesson-continue-learning-heading" className="mt-1 text-xl font-semibold tracking-[-0.02em] text-[var(--theme-heading-text)] sm:text-2xl">
          Continue Your Learning
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-[var(--semantic-text-secondary)]">
          Finish the lesson first, then choose a focused activity to apply what you just reviewed.
        </p>
      </div>
      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => (
          (() => {
            const Icon = CONTINUE_LEARNING_ICONS[continueLearningIcon(card.label)];
            return (
              <Link
                key={`${card.label}-${card.href}`}
                href={card.href}
                className="group flex min-h-28 flex-col justify-between rounded-xl border border-[color-mix(in_srgb,var(--semantic-border-soft)_86%,transparent)] bg-[var(--semantic-surface)] p-3.5 text-left shadow-[var(--semantic-shadow-soft)] transition hover:-translate-y-0.5 hover:border-[color-mix(in_srgb,var(--semantic-brand)_34%,var(--semantic-border-soft))] hover:bg-[color-mix(in_srgb,var(--semantic-surface)_94%,var(--semantic-panel-positive)_6%)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color-mix(in_srgb,var(--semantic-brand)_32%,transparent)] sm:p-4"
                data-nn-pathway-lesson-continue-learning-card
              >
                <span>
                  <span className="mb-3 inline-flex h-8 w-8 items-center justify-center rounded-lg border border-[color-mix(in_srgb,var(--semantic-brand)_18%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-brand)_8%,var(--semantic-surface))] text-[var(--semantic-brand)]">
                    <Icon className="h-4 w-4" aria-hidden />
                  </span>
                  <span className="block text-sm font-semibold text-[var(--theme-heading-text)]">
                    {card.label}
                    {card.count != null ? (
                      <span className="text-[var(--semantic-text-secondary)]"> ({numberFormatter.format(card.count)})</span>
                    ) : null}
                  </span>
                  <span className="mt-1.5 block text-xs leading-relaxed text-[var(--semantic-text-secondary)]">
                    {card.note}
                  </span>
                </span>
                <span className="mt-3 text-xs font-semibold text-[var(--semantic-brand)] group-hover:underline">
                  Open activity
                </span>
              </Link>
            );
          })()
        ))}
      </div>
    </section>
  );
}

export async function PathwayLessonDetailPageBody({
  pathway,
  pathname,
  lessonSlug,
  lessonContentLocale,
}: PathwayLessonDetailPageBodyProps) {
  const [lessonResult] = await Promise.allSettled([
    loadPathwayLessonWithLegacySlugRedirect(
      pathway,
      lessonSlug,
      lessonContentLocale,
    ),
  ]);
  const loadedLesson =
    lessonResult.status === "fulfilled" ? lessonResult.value : undefined;
  const lessonLoadFailed = lessonResult.status === "rejected";

  const { userId, entitlement, staffFullLessonAccess, learnerPathResolved } =
    await loadMarketingPathwayLessonViewerContext(
      "(marketing).pathway-lesson-detail-page-body",
    );

  const [studySettingsRes] = await Promise.allSettled([
    loadStudySettings(userId),
  ]);
  const studySettings =
    studySettingsRes.status === "fulfilled"
      ? studySettingsRes.value
      : DEFAULT_STUDY_SETTINGS;
  const bankEntitlement: AccessScope | null =
    entitlement === "error" ? null : entitlement;
  /** Staff QA: treat like subscriber for bank-linked surfaces where entitlement resolves; lesson body uses `fullAccess`. */
  const fullQuizAccess =
    bankEntitlement?.hasAccess === true || staffFullLessonAccess;

  const routeResolution = resolveMarketingPathwayLessonRouteResolution({
    pathway,
    lesson: loadedLesson,
    lessonLoadFailed,
    userId,
    entitlement,
    learnerPathResolved,
    staffFullLessonAccess,
  });
  if (routeResolution.kind === "not_found") notFound();

  const { lesson, fullAccess, scope, entitlementError } = routeResolution;
  const isRnLessonPathway =
    pathway.id === "ca-rn-nclex-rn" || pathway.id === "us-rn-nclex-rn";
  const usesReadingV2Layout = usesPremiumLessonReadingV2Layout({
    pathwayId: pathway.id,
    examFamily: pathway.examFamily,
    roleTrack: pathway.roleTrack,
  });
  const linkedLearningSignals =
    lesson.linkedLearningSignals ??
    computePathwayLessonLinkedLearningSignals(pathway.id, lesson);
  const examName = pathwayRegionAwareExamName(pathway);
  const [bankAssessmentsRes, adjacentSlugsRes, contentDatesRes] =
    await Promise.allSettled([
      resolvePathwayLessonBankAssessments(pathway, lesson),
      loadPathwayLessonAdjacent(pathway.id, lesson.slug, lessonContentLocale),
      getPathwayLessonContentDates(
        pathway.id,
        lesson.slug,
        lessonContentLocale,
      ),
    ]);
  const emptyBankAssessments: {
    preTest: PathwayLessonQuizItem[];
    postTest: PathwayLessonQuizItem[];
  } = {
    preTest: [],
    postTest: [],
  };
  const bankAssessments =
    bankAssessmentsRes.status === "fulfilled"
      ? bankAssessmentsRes.value
      : emptyBankAssessments;
  const adjacentSlugs =
    adjacentSlugsRes.status === "fulfilled"
      ? adjacentSlugsRes.value
      : { prev: null, next: null };
  const lessonAdjacentHrefs = mapPathwayLessonAdjacentToHrefs(
    adjacentSlugs,
    (slug) => pathwayLessonPublicDetailPath(pathway, slug),
  );
  const hasLessonSequence = Boolean(
    lessonAdjacentHrefs.prev || lessonAdjacentHrefs.next,
  );
  const visible = visibleSectionsForLesson(lesson, fullAccess);
  const visibleForRender = fullAccess
    ? visible
    : visible.map(sanitizePaywallPreviewSection);
  const previewLesson = fullAccess
    ? lesson
    : {
        ...lesson,
        sections: visibleForRender,
        preTest: undefined,
        postTest: undefined,
      };

  const tierForLessonContent: TierCode | null =
    entitlement === "error" ? null : (entitlement.tier as TierCode | null);
  const lessonContentTier = contentTierForPathwayLessonRender(
    pathway,
    tierForLessonContent,
  );
  const cookieStore = await cookies();
  const measurementPreference: MeasurementPreference | null =
    readMeasurementPreferenceFromCookieStore(cookieStore);
  const lessonMeasurementSystem = resolveLessonMeasurementSystem({
    countryCode: pathway.countryCode,
    pathwayId: pathway.id,
    preference: measurementPreference,
  });

  const base = marketingPathwayLessonsIndexPath(pathway);
  let questionSnapshot = EMPTY_QUESTION_SNAPSHOT;
  let questionSnapshotLoadRejected = false;
  try {
    questionSnapshot = await loadPathwayQuestionBankSnapshot(pathway.id);
  } catch {
    questionSnapshotLoadRejected = true;
  }
  const canStartCat =
    !questionSnapshotLoadRejected && marketingCatCompletePoolUsable(questionSnapshot, pathway.id);
  const lessonHubSurfaceChips = buildMarketingLessonHubSurfaceChips(pathway, {
    canStartCat,
    questionSnapshotLoadRejected,
  });
  const blogHubPath = buildExamPathwayPath(pathway, "blog");
  const pathwayQuestionsHref = buildExamPathwayPath(pathway, "questions");
  const pathwayFlashcardsHref = buildExamPathwayPath(pathway, "flashcards");
  const automaticRelatedExcludeHrefs = buildLessonDetailAutomaticRelatedExcludeHrefs({
    pathway,
    lessonSlug: lesson.slug,
    lessonTopicSlug: lesson.topicSlug,
    blogHubPath,
  });
  const lessonQuizEmbed = resolveQuizEmbedQuestionsForLessonSlug(lesson.slug);

  const lessonProgress =
    userId && fullAccess
      ? await loadPathwayLessonProgressForSlug(userId, pathway.id, lesson.slug)
      : ("not_started" satisfies PathwayLessonProgressStatus);

  // Strip body before passing locked sections to any downstream component — only headings are needed for the
  // teaser. This prevents accidental body serialization if the preview component ever becomes a Client Component.
  const lockedSections =
    !fullAccess && lesson.sections.length > visible.length
      ? lesson.sections
          .slice(visible.length)
          .filter((s) => shouldRenderPathwayLessonSection(s.kind))
          .map(({ id, heading }) => ({ id, heading }))
      : [];
  const seoSurface = buildAlliedAwareLessonPublicSeoSurface(pathway, {
    title: lesson.title,
    topic: lesson.topic,
    bodySystem: lesson.bodySystem,
    seoTitle: lesson.seoTitle,
    seoDescription: lesson.seoDescription,
    alliedProfessionKey: lesson.alliedProfessionKey,
  });
  const displayLessonTitle = cleanLessonTitleForDisplay(
    seoSurface.displayTitle,
  );
  const breadcrumbResolution = resolveBreadcrumbResolution({
    kind: "pathway-lesson-detail",
    pathway,
    lesson,
    lessonTitleDisplay: displayLessonTitle,
  });
  const lessonQuality = classifyPathwayLesson(lesson);
  const contentDates =
    contentDatesRes.status === "fulfilled" ? contentDatesRes.value : null;
  const quickReviewBullets = buildQuickReviewBullets(previewLesson);
  const dateFormatter = new Intl.DateTimeFormat("en", {
    month: "short",
    year: "numeric",
  });
  const updatedLabel = contentDates?.dateModified
    ? `Updated ${dateFormatter.format(new Date(contentDates.dateModified))}`
    : null;
  const reviewedLabel = contentDates?.dateModified
    ? `Clinically Reviewed ${dateFormatter.format(new Date(contentDates.dateModified))}`
    : "Clinically Reviewed";
  const estimatedStudyMinutes =
    quickReviewBullets.length >= 8
      ? "12-18 Min Study Time"
      : "8-12 Min Study Time";
  const readinessLabel = linkedLearningSignals.adaptiveLearningReadiness
    ? "Readiness Linked"
    : "Study Mode";
  const difficultyLabel =
    lesson.structuralQuality?.structureMode === "premium"
      ? "Premium Clinical Depth"
      : "Core Clinical Review";
  const jsonLdLessonPath =
    pathwayLessonPublicDetailPath(pathway, lesson.slug) ?? pathname;
  const examFocusPrimary = extractExamFocusHighYieldLines(previewLesson);
  const examFocusFallback = extractSecondaryExamContextLines(
    previewLesson.sections,
  );
  const examFocusRailLines =
    examFocusPrimary.length > 0 ? examFocusPrimary : examFocusFallback;
  const matchedLessonImage = resolveLessonImage({
    slug: lesson.slug,
    title: lesson.title,
    topicSlug: lesson.topicSlug,
    topic: lesson.topic,
    bodySystem: lesson.bodySystem,
  });
  const requestedNorm = normalizePathwayLessonLocale(lessonContentLocale);
  const marketingUiLocale = DEFAULT_MARKETING_LOCALE;
  const marketingMessages = loadMarketingMessageShardsSync(
    DEFAULT_MARKETING_LOCALE,
    LEARNER_APP_MESSAGE_SHARDS,
  );
  const t = (
    key: string,
    params?: Record<string, string | number | undefined>,
  ) =>
    formatMarketingMessage(marketingMessages, key, params, marketingMessages, {
      locale: DEFAULT_MARKETING_LOCALE,
    });
  const ecgModulePublic = await resolveMarketingHubEcgModulePublic().catch(
    () => false,
  );
  const continueLearningCards = buildContinueLearningCards({
    surfaceChips: lessonHubSurfaceChips,
    moduleLinks: buildLessonHubPremiumModuleStripLinks(pathway, {
      ecgModulePublic,
      messages: marketingMessages,
      signedIn: Boolean(userId),
    }),
    questionCount:
      questionSnapshot.status === "ok" ? questionSnapshot.pathwayScopedCount : null,
    catCount:
      questionSnapshot.status === "ok" ? questionSnapshot.adaptiveEligibleCount : null,
  });
  const showLocaleFallbackNotice = Boolean(
    lesson.localeMeta &&
    (lesson.localeMeta.usedLocaleFallback ||
      (lesson.localeMeta.isCatalogEnglishSource && requestedNorm !== "en")),
  );

  const omitHighYieldIds = new Set(lesson.omitHighYieldSectionIds ?? []);
  const displaySections = sortPathwayLessonSectionsForClinicalDisplay(
    visibleForRender
      .filter((s) => shouldRenderPathwayLessonSection(s.kind))
      .filter((s) => !omitHighYieldIds.has(s.id)),
  ).filter((section) =>
    pathwayLessonSectionHasRenderableTeachingContent({
      section,
      resolvedBodyText: typeof section.body === "string" ? section.body : "",
      viewerTier: lessonContentTier,
      measurementSystem: lessonMeasurementSystem,
      linkedNextStepsUsesCardRail: false,
    }),
  );
  const retentionSections = displaySections.filter((section) =>
    isLessonRetentionSectionKind(section.kind ?? null),
  );
  const learningSections = displaySections.filter(
    (section) => !isLessonRetentionSectionKind(section.kind ?? null),
  );
  const articleSections =
    learningSections.length > 0 ? learningSections : displaySections;

  const clinicalPearlsSection = retentionSections.find(
    (section) => section.kind === "clinical_pearls",
  );
  const rnClinicalPearlLines = usesReadingV2Layout
    ? extractClinicalPearlLines(
        typeof clinicalPearlsSection?.body === "string"
          ? clinicalPearlsSection.body
          : "",
        {
          pathwayId: pathway.id,
          lessonSlug: lesson.slug,
          source: "marketing-pathway-lesson-detail",
        },
      )
    : [];

  const tocNavSections = [
    ...articleSections.map((s) => ({
      id: s.id,
      heading: s.heading,
      kind: s.kind,
    })),
    {
      id: "lesson-retention-review",
      heading: "Review",
      kind: "takeaways" as const,
    },
  ];

  if (process.env.PATHWAY_LESSON_PUBLIC_RENDER_LOG === "1") {
    const first = displaySections[0];
    const preview = (typeof first?.body === "string" ? first.body : "")
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, 200);
    safeServerLog("pathway_lesson", "[PUBLIC_LESSON_RENDER]", {
      pathwayId: pathway.id,
      lessonSlug: lesson.slug,
      sectionsCount: displaySections.length,
      firstSectionKind: first?.kind ?? null,
      firstSectionBodyPreview: preview,
      structuralPublicComplete: Boolean(
        lesson.structuralQuality?.publicComplete,
      ),
    });
  }

  return (
    <PathwayLessonDetailMarketingI18nLayer messages={marketingMessages}>
      <LessonsPageShell
        omitHeroBand
        title={lesson.title}
        eyebrow={pathway.shortName.trim() || pathway.displayName}
        pathwayTrack={pathway.roleTrack}
        backLink={{ label: `${examName} Lessons`, href: base }}
      >
        <div
          className={`nn-lesson-page-shell nn-premium-lesson-detail-shell nn-lesson-reading-shell--blossom${usesReadingV2Layout ? " px-3 py-1 sm:px-5 sm:py-2" : " px-0 py-2 sm:px-6 sm:py-4"}${hasLessonSequence ? " pb-20 sm:pb-5" : ""}${pathway.examFamily === ExamFamily.NP ? " nn-lesson-page-shell--np" : ""}${usesReadingV2Layout ? ` ${PREMIUM_LESSON_READING_V2_SHELL_CLASS}` : ""}${isRnLessonPathway ? " nn-lesson-page-shell--rn" : ""}`}
          data-nn-premium-lessons-system="detail"
        >
          <MarketingPathwayLessonDetailViewBeacon
            pathway={pathway}
            lessonSlug={lesson.slug}
            topicSlug={lesson.topicSlug}
            topicLabel={lesson.topic}
            marketingLocale={marketingUiLocale}
          />
          <PathwayLessonMedicalEducationJsonLd
            path={jsonLdLessonPath}
            headline={seoSurface.jsonLdHeadline}
            description={
              fullAccess
                ? seoSurface.jsonLdDescription.slice(0, 320)
                : `${seoSurface.jsonLdDescription.slice(0, 200)}${seoSurface.jsonLdDescription.length > 200 ? "…" : ""}`
            }
            datePublished={contentDates?.datePublished ?? null}
            dateModified={contentDates?.dateModified ?? null}
            aboutOccupation={seoSurface.structuredAboutOccupation}
          />
          <BreadcrumbsFromResolution
            resolution={breadcrumbResolution}
            pathname={pathname}
            navClassName="nn-marketing-caption text-[var(--theme-muted-text)]"
          />
          <PathwayLessonSequenceNavBar
            adjacent={lessonAdjacentHrefs}
            className="mb-2"
          />
          <PathwayLessonProgressTracker
            pathwayId={pathway.id}
            lessonSlug={lesson.slug}
            enabled={Boolean(userId) && fullAccess}
            initialProgress={lessonProgress}
          />
          <PathwayLessonDetailHeader
            pathway={pathway}
            lessonsBasePath={base}
            lessonTitle={displayLessonTitle}
            lessonTopic={lesson.topic}
            bodySystem={lesson.bodySystem}
            estimatedStudyTimeLabel={estimatedStudyMinutes}
            readinessLabel={readinessLabel}
            difficultyLabel={difficultyLabel}
            updatedLabel={updatedLabel}
            reviewedLabel={reviewedLabel}
            compactHero={usesReadingV2Layout}
            trailing={
              <div className="flex flex-col items-end gap-2">
                {userId && fullAccess ? (
                  <PathwayLessonProgressBadgeLive
                    pathwayId={pathway.id}
                    lessonSlug={lesson.slug}
                    initial={lessonProgress}
                    className="shrink-0"
                  />
                ) : null}
                <LessonMeasurementUnitsBar
                  fallbackSystem={lessonMeasurementSystem}
                  initialPreference={measurementPreference}
                  syncToProfile={Boolean(userId)}
                />
              </div>
            }
          />
          <LessonReadingScrollProgress />
          {showLocaleFallbackNotice ? (
            <aside
              className="nn-card mt-4 border-border bg-[var(--theme-muted-surface)] p-3 text-sm text-[var(--theme-body-text)]"
              data-testid="aside-pathway-lesson-locale-en"
            >
              {lesson.localeMeta?.isCatalogEnglishSource ? (
                <>
                  This lesson body is{" "}
                  <span className="font-medium text-foreground">English</span>{" "}
                  (bundled catalog or seed data). A{" "}
                  <span className="font-medium text-foreground">
                    {lesson.localeMeta.requestedContentLocale}
                  </span>{" "}
                  version will appear here once a matching row is published in{" "}
                  <span className="font-medium text-foreground">
                    pathway_lessons
                  </span>
                  .
                </>
              ) : lesson.localeMeta?.usedLocaleFallback ? (
                <>
                  No published lesson was found for{" "}
                  <span className="font-medium text-foreground">
                    {lesson.localeMeta.requestedContentLocale}
                  </span>
                  ; showing the{" "}
                  <span className="font-medium text-foreground">
                    {lesson.localeMeta.contentLocale}
                  </span>{" "}
                  version instead.
                </>
              ) : null}
            </aside>
          ) : null}

          {!fullAccess ? (
            entitlementError ? (
              <>
                <aside
                  className="nn-card mt-3 border p-4 text-sm text-[var(--theme-body-text)]"
                  style={{
                    borderColor:
                      "color-mix(in srgb, var(--semantic-warning) 35%, var(--semantic-border-soft))",
                    background:
                      "color-mix(in srgb, var(--semantic-panel-warm) 55%, var(--semantic-surface))",
                  }}
                >
                  <p className="font-semibold text-[var(--theme-heading-text)]">
                    Access check didn’t complete
                  </p>
                  <p className="mt-1 text-[var(--semantic-text-secondary)]">
                    We couldn’t confirm your plan (temporary server or data
                    issue). This is not the same as being denied access. Refresh
                    in a moment; you can still read the preview sections below.
                    Sign in again or contact support if it persists.
                  </p>
                </aside>
                <PathwayLessonPreviewBanner
                  kind="default_preview"
                  pathwayShortName={pathway.shortName}
                  pathwayCountryLabel={pathwayCountryLabel(pathway)}
                />
              </>
            ) : (
              <PathwayLessonPreviewBanner
                kind={getPathwayLessonPreviewKind(
                  scope,
                  pathway,
                  learnerPathResolved,
                  userId,
                )}
                pathwayShortName={pathway.shortName}
                pathwayCountryLabel={pathwayCountryLabel(pathway)}
              />
            )
          ) : null}

          <div
            className={`nn-lesson-layout nn-lesson-layout--premium-reading ${usesReadingV2Layout ? "mt-2" : "mt-3"}`}
            data-nn-premium-lessons-reading-layout
          >
            <LessonReadingViewport
              sections={tocNavSections}
              progress={lessonProgress}
              progressVisible={Boolean(userId) && fullAccess}
              layout={usesReadingV2Layout ? "rn-v2" : "default"}
              clinicalPearls={rnClinicalPearlLines}
            >
              <div
                className="nn-lesson-main nn-lesson-main--blossom min-w-0"
                data-testid="pathway-lesson-main-column"
                data-nn-premium-lessons-reading-main
              >
              {matchedLessonImage.url &&
              hasRenderableLessonImageUrl(matchedLessonImage.url) ? (
                <LessonClinicalImageCard
                  url={matchedLessonImage.url}
                  alt={matchedLessonImage.alt}
                  source={matchedLessonImage.source}
                  caption={matchedLessonImage.caption}
                  lessonTitle={displayLessonTitle}
                />
              ) : null}

              {fullAccess && lesson.audioUrl ? (
                <LessonAudioCard
                  audioUrl={lesson.audioUrl}
                  lessonTitle={displayLessonTitle}
                />
              ) : null}

              <PathwayLessonAssessmentExperienceLazy
                userId={userId}
                pathwayId={pathway.id}
                lessonSlug={lesson.slug}
                topic={lesson.topic}
                initialProgress={lessonProgress}
                preTest={fullAccess ? bankAssessments.preTest : undefined}
                postTest={fullAccess ? bankAssessments.postTest : undefined}
                fullAccess={fullAccess}
                assessmentsEnabled={studySettings.enablePrePostQuizzes}
              >
                <LessonRecallProvider>
                  <div className="mt-5 sm:mt-6">
                    <div className="mb-2 flex w-full justify-end px-0">
                      <LessonRecallToggle />
                    </div>
                    <article
                      className={`nn-lesson-article-flow nn-premium-lesson-article nn-premium-lesson-reading-flow w-full max-w-none${usesReadingV2Layout ? " nn-lesson-reading-stack" : ""}`}
                      data-nn-lesson-article
                      data-nn-premium-lessons-section-system
                    >
                      {(() => {
                        let editorialRhythmIndex = 0;
                        return articleSections.map((section, sectionIndex) => {
                          const wide = pathwayLessonSectionPrefersWideColumn(
                            section.kind,
                            {
                              hasCheckpointQuestions: Boolean(
                                section.checkpointQuestions?.length,
                              ),
                            },
                          );
                          const editorialSurface =
                            lessonSectionSurface(section.kind) === "editorial";
                          const rhythmIdx = editorialSurface
                            ? editorialRhythmIndex++
                            : undefined;
                          return (
                            <LessonSectionCard
                              key={section.id}
                              id={section.id}
                              heading={section.heading}
                              kind={section.kind}
                              className={[
                                wide ? "nn-lesson-section-card--wide" : "",
                                usesReadingV2Layout
                                  ? rnLessonSectionStackClass(sectionIndex) ?? ""
                                  : "",
                              ]
                                .filter(Boolean)
                                .join(" ") || undefined}
                              editorialRhythmIndex={rhythmIdx}
                            >
                              {section.audioUrl ? (
                                <LessonSectionAudioButton
                                  audioUrl={section.audioUrl}
                                  sectionId={section.id}
                                  sectionHeading={section.heading}
                                />
                              ) : null}
                              <PathwayLessonSectionContent
                                text={
                                  typeof section.body === "string"
                                    ? section.body
                                    : ""
                                }
                                figures={section.figures}
                                examFocus={section.examFocus}
                                lessonWikiBasePath={base}
                                viewerTier={lessonContentTier}
                                measurementSystem={lessonMeasurementSystem}
                                sectionKind={section.kind ?? null}
                                emptyBodyMessage={t(
                                  "learner.lessons.detail.sectionEmptyBody",
                                )}
                                figuresVisualLeadMessage={t(
                                  "learner.lessons.detail.sectionFiguresVisualLead",
                                )}
                              />
                              {section.keyRecallFacts?.length ? (
                                <LessonKeyRecallChip
                                  facts={section.keyRecallFacts}
                                />
                              ) : null}
                              {section.recallPrompts?.length ? (
                                <LessonRecallBlock
                                  prompts={section.recallPrompts}
                                />
                              ) : null}
                              {section.checkpointQuestions?.length ? (
                                <LessonCheckpointCard
                                  questions={section.checkpointQuestions}
                                />
                              ) : null}
                            </LessonSectionCard>
                          );
                        });
                      })()}
                    </article>
                    {lessonQuizEmbed?.length ? (
                      <div className="mx-auto mt-8 max-w-5xl">
                        <PathwayLessonQuizEmbedSection
                          lessonSlug={lesson.slug}
                          links={{
                            practiceExamsHref: buildExamPathwayPath(
                              pathway,
                              "exams",
                            ),
                            flashcardsHref: buildExamPathwayPath(
                              pathway,
                              "flashcards",
                            ),
                            practiceQuestionsHref: buildExamPathwayPath(
                              pathway,
                              "questions",
                            ),
                            relatedLessonsHref: base,
                          }}
                        />
                      </div>
                    ) : null}
                  </div>
                </LessonRecallProvider>

                {lockedSections.length > 0 ? (
                  <div className="mx-auto mt-5 max-w-5xl">
                    <PathwayLessonLockedSectionsPreview
                      sections={lockedSections}
                    />
                  </div>
                ) : null}

                <section
                  id="lesson-retention-review"
                  className="nn-lesson-retention-review-zone"
                  aria-labelledby="lesson-retention-review-heading"
                  data-nn-premium-retention-review-zone
                >
                  <header className="nn-lesson-retention-review-zone__head">
                    <div className="nn-lesson-retention-review-zone__intro">
                      <p className="nn-lesson-hero-eyebrow">
                        Retention & exam readiness
                      </p>
                      <p>
                        Clinical pearls, traps, safety priorities, quick recall,
                        and related concepts live here so the main lesson stays
                        calm and uninterrupted.
                      </p>
                    </div>
                    <div className="nn-lesson-retention-review-zone__tagline">
                      <h2 id="lesson-retention-review-heading">
                        Review after learning, not during it.
                      </h2>
                    </div>
                  </header>
                  {retentionSections.length > 0 ? (
                    <div className="nn-lesson-retention-review-zone__sections">
                      {retentionSections.map((section) => (
                        <LessonSectionCard
                          key={section.id}
                          id={section.id}
                          heading={section.heading}
                          kind={section.kind}
                        >
                          <PathwayLessonSectionContent
                            text={
                              typeof section.body === "string"
                                ? section.body
                                : ""
                            }
                            figures={section.figures}
                            examFocus={section.examFocus}
                            lessonWikiBasePath={base}
                            viewerTier={lessonContentTier}
                            measurementSystem={lessonMeasurementSystem}
                            sectionKind={section.kind ?? null}
                            emptyBodyMessage={t(
                              "learner.lessons.detail.sectionEmptyBody",
                            )}
                            figuresVisualLeadMessage={t(
                              "learner.lessons.detail.sectionFiguresVisualLead",
                            )}
                          />
                        </LessonSectionCard>
                      ))}
                    </div>
                  ) : null}
                  {fullAccess && lesson.memoryAnchor ? (
                    <PathwayLessonMemoryAnchorStrip
                      text={lesson.memoryAnchor}
                    />
                  ) : null}
                  {fullAccess &&
                  lesson.studyCommonTraps &&
                  lesson.studyCommonTraps.length > 0 ? (
                    <PathwayLessonCommonTrapsStrip
                      items={lesson.studyCommonTraps}
                    />
                  ) : null}
                  {fullAccess &&
                  lessonHasExamTakeaways(lesson.studyTakeaways) ? (
                    <ExamTakeawaysBlock
                      pathway={pathway}
                      items={lesson.studyTakeaways}
                      position="bottom"
                    />
                  ) : null}
                  <PathwayLessonQuickClinicalSummary
                    quickReviewLines={quickReviewBullets}
                    examFocusLines={examFocusRailLines}
                    commonMistakes={
                      fullAccess ? lesson.studyCommonTraps : undefined
                    }
                    fullAccess={fullAccess}
                    labels={{
                      eyebrow: t("learner.lessons.quickClinical.eyebrow"),
                      title: t("learner.lessons.quickClinical.title"),
                      keyTakeaways: t(
                        "learner.lessons.quickClinical.card.keyTakeaways",
                      ),
                      redFlags: t(
                        "learner.lessons.quickClinical.card.redFlags",
                      ),
                      priorityInterventions: t(
                        "learner.lessons.quickClinical.card.priorityInterventions",
                      ),
                      examTraps: t(
                        "learner.lessons.quickClinical.card.examTraps",
                      ),
                      mustKnowLabs: t(
                        "learner.lessons.quickClinical.card.mustKnowLabs",
                      ),
                      escalationCues: t(
                        "learner.lessons.quickClinical.card.escalationCues",
                      ),
                    }}
                  />
                </section>

                <ContinueLearningSection cards={continueLearningCards} />

                <PathwayLessonTopicSiblingsStrip
                  pathway={pathway}
                  topicSlug={lesson.topicSlug}
                  topicLabel={lesson.topic}
                  excludeSlug={lesson.slug}
                />

                <PathwayLessonActions
                  pathwayId={pathway.id}
                  lessonSlug={lesson.slug}
                  topicCode={lesson.topicSlug}
                  topicLabel={lesson.topic}
                  userId={userId}
                  canMarkComplete={fullAccess}
                  initialProgress={lessonProgress}
                  catAdaptiveAvailable={pathwayAllowsCatAdaptiveStart(pathway)}
                  linkedLearningSignals={linkedLearningSignals}
                  linkMode="marketing"
                />
              </PathwayLessonAssessmentExperienceLazy>
              </div>
            </LessonReadingViewport>
          </div>
          <LessonStickyReviewDock enabled={fullAccess} />

          <PathwayLessonRemediationChain
            pathway={pathway}
            topicSlug={lesson.topicSlug}
            topicLabel={lesson.topic}
            lessonSlug={lesson.slug}
          />

          <Suspense fallback={<PathwayLessonDetailDeferredSkeleton />}>
            <PathwayLessonDetailDeferred
              pathway={pathway}
              lesson={toPathwayLessonDeferredServerSnapshot(lesson)}
              lessonsBasePath={base}
              contentLocale={lessonContentLocale}
              bankEntitlement={bankEntitlement}
              fullQuizAccess={fullQuizAccess}
              userId={userId}
            />
          </Suspense>

          <AutomaticRelatedContentForPublic
            surface="lesson"
            pathway={pathway}
            lesson={{
              slug: lesson.slug,
              title: lesson.title,
              topic: lesson.topic,
              topicSlug: lesson.topicSlug,
              bodySystem: lesson.bodySystem,
            }}
            locale={lessonContentLocale}
            excludeHrefs={automaticRelatedExcludeHrefs}
          />

          <div
            className="mt-8 rounded-2xl border border-[var(--semantic-border-soft)] bg-[color-mix(in_srgb,var(--semantic-panel-muted)_55%,var(--semantic-surface))] px-4 py-3 text-center shadow-[var(--semantic-shadow-soft)] sm:px-5"
            data-nn-premium-lessons-linked-learning
          >
            <p className="text-xs leading-relaxed text-[var(--semantic-text-secondary)]">
              <Link
                href={blogHubPath}
                className="font-medium text-primary hover:underline"
              >
                {examName} Blog Posts
              </Link>
              {" · "}
              <Link
                href={`/blog/tag/${encodeURIComponent(lesson.topicSlug)}`}
                className="font-medium text-primary hover:underline"
              >
                {lesson.topic} Articles
              </Link>
              {" · "}
              <Link
                href={pathwayFlashcardsHref}
                className="font-medium text-primary hover:underline"
              >
                {examName} Flashcards
              </Link>
              {" · "}
              <Link
                href={pathwayQuestionsHref}
                className="font-medium text-primary hover:underline"
              >
                {examName} Practice Questions
              </Link>
              {" · "}
              <Link
                href="/tools"
                className="font-medium text-primary hover:underline"
              >
                Tools
              </Link>
              {" · "}
              <Link
                href="/lessons"
                className="font-medium text-primary hover:underline"
              >
                All Lesson Hubs
              </Link>
              {" · "}
              <Link
                href={buildExamPathwayPath(pathway)}
                className="font-medium text-primary hover:underline"
              >
                {examName} Exam Hub
              </Link>
            </p>
          </div>

          <MarketingStudyCrossLinks className="mt-12" />
          <LearnerSurfaceCard
            variant="minimal"
            data-testid="lesson-detail-editorial-metadata"
            className="nn-lesson-detail-editorial-metadata mt-10 border border-[color-mix(in_srgb,var(--semantic-border-soft)_88%,var(--semantic-brand)_8%)] bg-[color-mix(in_srgb,var(--semantic-surface)_93%,var(--semantic-panel-muted)_7%)] px-3 py-3 shadow-[var(--semantic-shadow-soft)] sm:px-4 sm:py-3.5"
          >
            <h2 className="sr-only">Catalog and editorial metadata</h2>
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1.5 text-[0.7rem] leading-snug text-[var(--semantic-text-secondary)] sm:text-xs">
              <PathwayLessonRecordChips
                lesson={pickPathwayLessonMarketingRecordChipsSource(lesson)}
                omitTopic
                className="gap-1"
              />
            </div>
            {fullAccess ? (
              <div className="mt-3 space-y-2 border-t border-[color-mix(in_srgb,var(--semantic-border-soft)_92%,transparent)] pt-3">
                <PremiumLessonPublishNotice
                  validation={lesson.premiumValidation}
                />
                <LessonQualityNotice
                  tier={lessonQuality.tier}
                  wordCount={lessonQuality.wordCount}
                />
              </div>
            ) : null}
          </LearnerSurfaceCard>
          <EeatContentAttribution variant="lesson" />
          <StaffEditLivePageBanner
            adminHref={buildAdminPathwayLessonStableEditHref({
              pathwayId: pathway.id,
              slug: lesson.slug,
              locale: lessonContentLocale,
            })}
            label="Edit this pathway lesson"
          />
          {hasLessonSequence ? (
            <PathwayLessonStickySequenceNav adjacent={lessonAdjacentHrefs} />
          ) : null}
        </div>
      </LessonsPageShell>
    </PathwayLessonDetailMarketingI18nLayer>
  );
}
