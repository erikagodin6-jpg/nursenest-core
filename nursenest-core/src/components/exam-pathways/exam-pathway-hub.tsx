import { BreadcrumbBar } from "@/components/seo/breadcrumb-bar";
import { FaqJsonLd } from "@/components/seo/faq-json-ld";
import type { ExamPathwayDefinition } from "@/lib/exam-pathways/types";
import type { NpPracticeTestLandingCopy } from "@/lib/exam-pathways/np-practice-test-segments";
import { pathwayOverviewBreadcrumbs } from "@/lib/seo/pathway-breadcrumbs";
import { pathwayHubFaqSchema } from "@/lib/seo/pathway-hub-faq-schema";
import { NpInventoryHeading } from "@/components/exam-pathways/exam-pathway-np-inventory-heading";
import { ExamPathwayWaitlistBanner } from "@/components/exam-pathways/exam-pathway-waitlist-banner";
import { ExamHubComparisonLink } from "@/components/marketing/exam-hub-comparison-link";
import { MarketingTrustSignalsStrip } from "@/components/marketing/marketing-trust-signals-strip";
import { FunnelExamHubViewBeacon } from "@/components/marketing/funnel-analytics-beacons";
import { ExamPathwayHubBody } from "@/components/exam-pathways/exam-pathway-hub-body";
import { MarketingPathwayHubHeroBand } from "@/components/marketing/marketing-pathway-hub-hero-band";
import { PathwayLiveInventoryStrip } from "@/components/exam-pathways/pathway-live-inventory-strip";
import { NpSeoAliasHubAnalytics } from "@/components/marketing/np-seo-alias-hub-analytics";
import { validateLearnerCopyForExamContext } from "@/lib/learner/validate-learner-copy-context";
import { buildExamPathwayPath } from "@/lib/exam-pathways/build-exam-pathway-path";
import type { PathwayQuestionBankSnapshot } from "@/lib/exam-pathways/pathway-question-bank-snapshot";
import { EMPTY_QUESTION_SNAPSHOT, ZERO_LESSON_COUNT } from "@/lib/exam-pathways/marketing-hub-fallbacks";
import type { NpPathwayInventoryGate } from "@/lib/np/np-pathway-inventory-gate";
import type { HubLessonProgress } from "@/components/exam-pathways/exam-pathway-hub-study-modes";

export function ExamPathwayHub({
  pathway,
  isSignedIn = false,
  npInventory = null,
  heroTitle,
  heroLead,
  emphasizeCatPracticeTests = false,
  marketingHubPath,
  npPracticeSeo,
  npSeoAliasSegment,
  questionSnapshot: questionSnapshotProp,
  pathwayLessonCount: pathwayLessonCountProp,
  hubProgress,
}: {
  pathway: ExamPathwayDefinition;
  isSignedIn?: boolean;
  npInventory?: NpPathwayInventoryGate | null;
  /** NP SEO landing (`aanp-practice-test`, …) overrides the default hub headline. */
  heroTitle?: string;
  heroLead?: string;
  /** Surfaces CAT practice-test entry (signed-in → `/app/practice-tests`). */
  emphasizeCatPracticeTests?: boolean;
  /** Request path for the hub crumb. On NP alias overviews, equals the keyword URL (self-canonical). Subpages omit hubBasePath in breadcrumbs — see `np-seo-alias-canonical-policy.ts`. */
  marketingHubPath: string;
  /** Full NP alias copy when on a board-named URL. */
  npPracticeSeo?: NpPracticeTestLandingCopy | null;
  /** Third path segment when it is an NP SEO alias (e.g. `aanp-practice-test`). */
  npSeoAliasSegment?: string;
  /** Published question pool scoped like the in-app bank (tier + region + pathway exam keys). */
  questionSnapshot?: PathwayQuestionBankSnapshot | null;
  /** Pathway lesson total — {@link countPathwayLessons}. */
  pathwayLessonCount?: number;
  /** Lesson completion snapshot for signed-in learners. Drives progress indicator on the Lessons card. */
  hubProgress?: HubLessonProgress | null;
}) {
  const questionSnapshot = questionSnapshotProp ?? EMPTY_QUESTION_SNAPSHOT;
  const pathwayLessonCount = pathwayLessonCountProp ?? ZERO_LESSON_COUNT;
  validateLearnerCopyForExamContext(pathway, heroTitle ?? pathway.displayName, "hub_hero");
  validateLearnerCopyForExamContext(pathway, heroLead ?? pathway.seoDescription, "hub_hero");
  const hubOpts = { hubBasePath: marketingHubPath };
  const { crumbs, schemaItems } = pathwayOverviewBreadcrumbs(pathway, hubOpts);
  const countryLine = pathway.countrySlug === "canada" ? "Canada" : "United States";

  return (
    <div
      className="nn-premium-pathway-hub mx-auto max-w-6xl px-4 py-6 sm:py-8 lg:px-6"
      data-nn-nursing-tier-hub="surface"
      data-nn-rn-slice-readiness={pathway.roleTrack === "rn" ? "1" : undefined}
      data-pathway-track={pathway.roleTrack}
    >
      <FunnelExamHubViewBeacon pathway={pathway} hubPath={marketingHubPath} />
      {npSeoAliasSegment ? (
        <NpSeoAliasHubAnalytics
          pathwayId={pathway.id}
          aliasSegment={npSeoAliasSegment}
          canonicalPathwayHubPath={buildExamPathwayPath(pathway)}
          countrySlug={pathway.countrySlug}
          examFamily={String(pathway.examFamily)}
        />
      ) : null}
      <BreadcrumbBar crumbs={crumbs} schemaItems={schemaItems} navClassName="nn-marketing-caption text-[var(--theme-muted-text)]" />
      <FaqJsonLd items={pathwayHubFaqSchema(pathway)} />
      <MarketingPathwayHubHeroBand
        className="mt-1"
        eyebrow={
          <p className="nn-premium-home-eyebrow max-w-full whitespace-normal">
            {countryLine} · {pathway.boardLabel ?? pathway.roleTrack.toUpperCase()}
          </p>
        }
        title={<h1 className="nn-marketing-h1 max-w-[min(100%,48rem)] text-balance text-[var(--palette-heading)]">{heroTitle ?? pathway.displayName}</h1>}
        intro={
          <p className="nn-marketing-body max-w-3xl text-pretty text-[var(--palette-text-muted)] sm:text-lg">
            {heroLead ?? pathway.seoDescription}
          </p>
        }
      />

      <div className="mt-4 max-w-3xl">
        <MarketingTrustSignalsStrip variant="compact" examHub />
      </div>
      <ExamHubComparisonLink />

      {pathway.status === "upcoming" || pathway.acquisitionMode === "waitlist" ? (
        <ExamPathwayWaitlistBanner
          pathwayId={pathway.id}
          variant={pathway.acquisitionMode === "waitlist" ? "waitlist" : "upcoming"}
        />
      ) : null}

      <PathwayLiveInventoryStrip
        pathway={pathway}
        questionSnapshot={questionSnapshot}
        lessonCount={pathwayLessonCount}
        variant="hub"
      />

      {npInventory?.belowThreshold ? (
        <aside className="nn-study-card nn-study-card--wash mt-6 p-4 sm:p-5">
          <NpInventoryHeading />
          <p className="nn-marketing-body-sm mt-2 text-[var(--theme-muted-text)]">{npInventory.noticeMarkdown}</p>
        </aside>
      ) : null}

      {npPracticeSeo ? (
        <section className="nn-study-card mt-8 p-4 sm:p-5" aria-labelledby="np-alias-support-heading">
          <h2 id="np-alias-support-heading" className="nn-marketing-h3">
            {npPracticeSeo.supportSectionHeading}
          </h2>
          <p className="nn-marketing-body-sm mt-2 text-[var(--theme-muted-text)]">{npPracticeSeo.supportSectionBody}</p>
        </section>
      ) : null}

      <ExamPathwayHubBody
        pathway={pathway}
        isSignedIn={isSignedIn}
        emphasizeCatPracticeTests={emphasizeCatPracticeTests}
        marketingHubPath={marketingHubPath}
        npSeoAliasSegment={npSeoAliasSegment}
        conversionSectionHeading={npPracticeSeo?.conversionSectionHeading}
        conversionSectionLead={npPracticeSeo?.conversionSectionLead}
        hubProgress={hubProgress}
        pathwayLessonCount={pathwayLessonCount}
      />
    </div>
  );
}
