import Link from "next/link";
import type { CSSProperties } from "react";
import { ClipboardCheck, FileBarChart, HeartHandshake, Sparkles, Stethoscope } from "lucide-react";
import { FunnelExamHubViewBeacon } from "@/components/marketing/funnel-analytics-beacons";
import { MarketingPathwayHubHeroBand } from "@/components/marketing/marketing-pathway-hub-hero-band";
import { MarketingPathwayHubProductPreview } from "@/components/marketing/marketing-pathway-hub-product-preview";
import { MeasurementSystemToggle } from "@/components/measurements/measurement-system-toggle";
import { StudyCard } from "@/components/ui/study-card";
import { ExamPathwayHubPremiumModules } from "@/components/exam-pathways/exam-pathway-hub-premium-modules";
import { PathwayLiveInventoryStrip } from "@/components/exam-pathways/pathway-live-inventory-strip";
import { getLessonHubSystemVisual } from "@/components/pathway-lessons/lesson-system-hub-visuals";
import {
  ALLIED_HUB_CATEGORY_META,
  alliedProfessionDefaultRoleHero,
  alliedProfessionDefaultSkillOverlay,
  alliedProfessionPremiumCtaHeadline,
  alliedProfessionTrackChipLabel,
  listAlliedProfessionsSorted,
  type AlliedHubCategoryId,
  type AlliedProfessionMarketing,
} from "@/lib/allied/allied-professions-registry";
import {
  alliedHealthLessonsIndexPath,
  alliedHealthSegmentPath,
  mergeMarketingPathQuery,
  withAlliedProfessionMarketingQuery,
} from "@/lib/lessons/lesson-routes";
import { buildExamPathwayPath } from "@/lib/exam-pathways/build-exam-pathway-path";
import type { ExamPathwayDefinition } from "@/lib/exam-pathways/types";
import {
  ALLIED_GLOBAL_HUB_PATH,
  buildAlliedGlobalHubPath,
  buildAlliedOccupationMarketingHubPath,
  isMarketingAlliedHealthTopLevelHubPath,
} from "@/lib/allied/allied-global-pathway";
import { learningConfigForPathwayId } from "@/lib/pathways/pathway-learning-structure";
import { loginWithCallback } from "@/lib/marketing/marketing-entry-routes";
import { AlliedPathwayHubCatCard } from "@/components/marketing/allied-pathway-hub-cat-card";
import { MarketingHubGuidedStudyPathStrip } from "@/components/marketing/marketing-hub-guided-study-path";
import { marketingTierHubStudyActionHref } from "@/lib/navigation/marketing-tier-hub-study-hrefs";
import { ALLIED_PROFESSION_QUERY_PARAM, isAlliedMarketingCorePathwayId } from "@/lib/lessons/canonical-lessons-hubs";
import { SCENARIO_LEARNER_ROUTES, withScenarioPathwayAndProfessionQuery } from "@/lib/scenarios/scenario-routes";
import type { AlliedPathwayHubOverview } from "@/lib/marketing/allied-pathway-hub-overview";
import type { MeasurementPreference } from "@/lib/measurements/measurement-preference";

function hubVisualKeyForCategoryId(id: string): string {
  const s = id.trim().toLowerCase().replace(/[^a-z0-9]+/g, "_");
  return s.length > 0 ? s : "fundamentals";
}

/** Occupation-card badge hue — mirrors RN hub multi-semantic pattern (see semantic-status-tokens.css). */
const ALLIED_HUB_CATEGORY_BADGE_CLASS: Record<AlliedHubCategoryId, string> = {
  therapy: "nn-badge-semantic-info",
  lab: "nn-badge-semantic-warning",
  acute: "nn-badge-semantic-danger",
  clinical: "nn-badge-semantic-success",
  support: "nn-badge-semantic-success",
};

const ALLIED_HUB_CATEGORY_SHORT: Record<AlliedHubCategoryId, string> = {
  therapy: "Therapy",
  lab: "Lab & imaging",
  acute: "Acute & field",
  clinical: "Clinical",
  support: "Community",
};

export function AlliedHealthPathwayHub({
  pathway,
  hubPath,
  profession = null,
  sampleQuestionStem = null,
  overview = null,
  initialMeasurementPreference = null,
  syncMeasurementPreferenceToProfile = false,
  viewerSignedIn = false,
  ecgModulePublic,
}: {
  pathway: ExamPathwayDefinition;
  hubPath: string;
  /** When set, this hub is scoped to a single occupation (links carry `?alliedProfession=`). */
  profession?: AlliedProfessionMarketing | null;
  /** Optional preview line for occupation hubs (bounded stem text). */
  sampleQuestionStem?: string | null;
  /** Pathway-scoped inventory + optional module visibility for public hub routes. */
  overview?: AlliedPathwayHubOverview | null;
  initialMeasurementPreference?: MeasurementPreference | null;
  /** When true and the viewer is signed in, unit toggle PATCHes `/api/learner/personal-profile` (cookie/localStorage still apply for guests). */
  syncMeasurementPreferenceToProfile?: boolean;
  viewerSignedIn?: boolean;
  /** Passed through to premium modules (allied hubs omit ECG tiles; safe no-op). */
  ecgModulePublic?: boolean;
}) {
  const isGlobalAlliedHub = hubPath === buildAlliedGlobalHubPath();
  const countryLine = isGlobalAlliedHub ? "Global" : pathway.countrySlug === "canada" ? "Canada" : "United States";
  const profKey = profession?.professionKey?.trim() ?? "";
  /** Top-level marketing hubs (`/allied/allied-health`, `/us/allied/allied-health`, …): occupation chooser only. */
  const occupationPickerOnly = !profKey && isMarketingAlliedHealthTopLevelHubPath(hubPath);
  const showFullStudySurface = !occupationPickerOnly;

  const lessonsBase = isGlobalAlliedHub ? buildAlliedGlobalHubPath("lessons") : marketingTierHubStudyActionHref(pathway, "lessons");
  const lessonsHref = profKey ? alliedHealthLessonsIndexPath(profKey) : lessonsBase;
  const questionsBase = isGlobalAlliedHub ? buildAlliedGlobalHubPath("questions") : buildExamPathwayPath(pathway, "questions");
  const questionsHref = profKey ? withAlliedProfessionMarketingQuery(questionsBase, profKey) : questionsBase;
  const flashcardsBase = marketingTierHubStudyActionHref(pathway, "flashcards");
  const flashcardsHref = profKey ? withAlliedProfessionMarketingQuery(flashcardsBase, profKey) : flashcardsBase;
  const catBase = isGlobalAlliedHub ? buildAlliedGlobalHubPath("cat") : buildExamPathwayPath(pathway, "cat");
  const catHref = profKey ? withAlliedProfessionMarketingQuery(catBase, profKey) : catBase;
  const pricingHref = isGlobalAlliedHub ? buildAlliedGlobalHubPath("pricing") : buildExamPathwayPath(pathway, "pricing");
  const examPlanHref = loginWithCallback(`/app/exam-plan`);
  const practiceTestsHref = profKey
    ? loginWithCallback(
        `/app/practice-tests?pathwayId=${encodeURIComponent(pathway.id)}&alliedProfession=${encodeURIComponent(profKey)}`,
      )
    : loginWithCallback(`/app/practice-tests?pathwayId=${encodeURIComponent(pathway.id)}`);

  const clinicalScenariosHref =
    profKey && isAlliedMarketingCorePathwayId(pathway.id)
      ? loginWithCallback(
          withScenarioPathwayAndProfessionQuery(SCENARIO_LEARNER_ROUTES.clinicalScenarios, pathway.id, profKey),
        )
      : null;

  const learning = learningConfigForPathwayId(pathway.id);
  const categoryShowcase = learning.categories.slice(0, 16);

  const tracks = listAlliedProfessionsSorted();

  const heroTitle = profession ? profession.h1 : pathway.displayName;
  const heroBody = profession ? profession.description : pathway.seoDescription;
  const heroKicker = profession
    ? `${countryLine} · ${pathway.shortName} · ${alliedProfessionTrackChipLabel(profession)}`
    : isGlobalAlliedHub
      ? `${pathway.shortName} · Global pathway`
      : `${countryLine} · ${pathway.shortName}`;
  const flashcardDeckLine =
    typeof overview?.flashcardDeckCount === "number"
      ? `${overview.flashcardDeckCount} published flashcard deck${overview.flashcardDeckCount === 1 ? "" : "s"}`
      : null;
  const questionCountLine =
    overview?.questionSnapshot.status === "ok"
      ? `${overview.questionSnapshot.pathwayScopedCount} practice questions`
      : null;

  const roleHero = profession ? alliedProfessionDefaultRoleHero(profession) : null;
  const skillOverlay = profession ? alliedProfessionDefaultSkillOverlay(profession) : null;
  const scenarioPrimaryHref = clinicalScenariosHref ?? questionsHref;

  const alliedToneAttr = profession ? { "data-nn-allied-hub-tone": profession.hubCategory } : {};

  return (
    <div
      className={`nn-premium-pathway-hub nn-allied-health-hub space-y-10 sm:space-y-12 lg:space-y-14${occupationPickerOnly ? " nn-marketing-surface" : ""}`}
      data-nn-allied-pathway-hub="1"
      data-nn-allied-newgrad-convergence="allied"
      data-nn-nursing-tier-hub="surface"
      {...alliedToneAttr}
    >
      <FunnelExamHubViewBeacon pathway={pathway} hubPath={hubPath} />

      <header className="relative">
        <MarketingPathwayHubHeroBand
          eyebrow={<p className="nn-premium-home-eyebrow max-w-full whitespace-normal">{heroKicker}</p>}
          title={
            <h1
              id="allied-pathway-hub-hero-title"
              className="nn-marketing-h1 max-w-[min(100%,42rem)] text-balance text-[var(--palette-heading)]"
            >
              {heroTitle}
            </h1>
          }
          intro={
            <p className="nn-marketing-body max-w-2xl text-pretty text-[var(--palette-text-muted)] sm:text-lg">{heroBody}</p>
          }
        >
          <div className="flex min-w-0 flex-wrap gap-3">
            <Link
              href={pricingHref}
              className="inline-flex min-h-11 items-center justify-center rounded-full bg-[var(--semantic-brand)] px-6 py-2.5 text-sm font-semibold text-[var(--semantic-brand-contrast)] shadow-md transition hover:opacity-95"
            >
              View Plans and Pricing
            </Link>
            <Link
              href={profession ? ALLIED_GLOBAL_HUB_PATH : `${ALLIED_GLOBAL_HUB_PATH}#allied-occupation-tracks`}
              className="inline-flex min-h-11 items-center justify-center rounded-full border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] px-6 py-2.5 text-sm font-semibold text-[var(--semantic-text-primary)] transition hover:bg-[var(--semantic-panel-muted)]"
            >
              {profession ? "All Occupation Tracks" : "Choose Your Occupation Track"}
            </Link>
            {showFullStudySurface || isGlobalAlliedHub ? (
              <Link
                href={lessonsHref}
                className="inline-flex min-h-11 items-center justify-center rounded-full border border-[color-mix(in_srgb,var(--semantic-info)_35%,var(--semantic-border-soft))] px-6 py-2.5 text-sm font-semibold text-[var(--semantic-info)] transition hover:bg-[color-mix(in_srgb,var(--semantic-info)_8%,var(--semantic-surface))]"
              >
                {profession ? "Lessons for This Track" : "Browse Lessons Hub"}
              </Link>
            ) : null}
            {showFullStudySurface || isGlobalAlliedHub ? (
              <Link
                href={questionsHref}
                className="inline-flex min-h-11 items-center justify-center rounded-full border border-[color-mix(in_srgb,var(--semantic-chart-2)_35%,var(--semantic-border-soft))] px-6 py-2.5 text-sm font-semibold text-[var(--semantic-chart-2)] transition hover:bg-[color-mix(in_srgb,var(--semantic-chart-2)_8%,var(--semantic-surface))]"
              >
                {profession ? "Questions for This Track" : "Practice Questions Hub"}
              </Link>
            ) : null}
          </div>
          {isGlobalAlliedHub || occupationPickerOnly ? (
            <div className="mt-6 max-w-sm">
              <MeasurementSystemToggle
                fallbackSystem="SI"
                initialPreference={initialMeasurementPreference}
                title="Units for allied study"
                description="Allied study is global. Switch units without swapping pathways."
                compact
                onPreferenceCommitted={
                  syncMeasurementPreferenceToProfile
                    ? (pref) => {
                        void fetch("/api/learner/personal-profile", {
                          method: "PATCH",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({ measurementPreference: pref }),
                        });
                      }
                    : undefined
                }
              />
            </div>
          ) : null}
        </MarketingPathwayHubHeroBand>
      </header>

      <MarketingPathwayHubProductPreview pathway={pathway} />

      {showFullStudySurface ? (
        <MarketingHubGuidedStudyPathStrip
          headingId="allied-guided-study-path-heading"
          title="Guided study path"
          subtitle={
            profession
              ? `A calm sequence for ${alliedProfessionTrackChipLabel(profession)} — concepts, drills, recall, then readiness checks on this pathway only.`
              : "Start with lessons, strengthen judgment with questions, reinforce with flashcards, then open adaptive readiness and longer exam sets when you are ready."
          }
          steps={[
            {
              title: "Lessons",
              hint: "Topic-scoped modules for this pathway.",
              href: lessonsHref,
              tone: "success",
            },
            {
              title: "Practice Questions",
              hint: "Vignettes filtered to allied authorization.",
              href: questionsHref,
              tone: "info",
            },
            {
              title: "Flashcards",
              hint: "Rapid recall inside the app.",
              href: flashcardsHref,
              tone: "chart1",
            },
            {
              title: "Adaptive readiness",
              hint: "CAT-style hub when your plan unlocks it.",
              href: catHref,
              tone: "warning",
            },
            {
              title: "Practice exams",
              hint: "Longer timed sets with sign-in callback.",
              href: practiceTestsHref,
              tone: "chart5",
            },
          ]}
        />
      ) : null}

      {showFullStudySurface && overview ? (
        <section
          className="rounded-[1.35rem] border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-5 sm:p-6"
          aria-labelledby="allied-pathway-live-heading"
          data-nn-allied-hub-compact-analytics="1"
        >
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 id="allied-pathway-live-heading" className="nn-marketing-h2 text-balance">
              {isGlobalAlliedHub ? "Live Pathway Snapshot" : `${countryLine} · Live Inventory`}
            </h2>
            <div className="flex flex-wrap justify-end gap-2">
              {overview.lessonCount > 0 ? (
                <span className="nn-badge-semantic-success whitespace-nowrap px-2.5 py-1 text-[11px]">
                  {overview.lessonCount} Lessons
                </span>
              ) : null}
              {questionCountLine ? (
                <span className="nn-badge-semantic-info whitespace-nowrap px-2.5 py-1 text-[11px]">{questionCountLine}</span>
              ) : null}
              {flashcardDeckLine ? (
                <span className="nn-badge-semantic-warning whitespace-nowrap px-2.5 py-1 text-[11px]">{flashcardDeckLine}</span>
              ) : null}
              {overview.practiceExamReady ? (
                <span className="nn-badge-semantic-success whitespace-nowrap px-2.5 py-1 text-[11px]">Practice Exam Ready</span>
              ) : null}
            </div>
          </div>
          <p className="mt-3 max-w-3xl text-xs leading-relaxed text-[var(--semantic-text-secondary)] sm:text-sm">
            Inventory and readiness signals for{" "}
            <span className="font-semibold text-[var(--semantic-text-primary)]">{pathway.shortName}</span>
            {profession ? (
              <>
                {" "}
                · scoped to{" "}
                <span className="font-semibold text-[var(--semantic-text-primary)]">{alliedProfessionTrackChipLabel(profession)}</span>
              </>
            ) : null}
            .
          </p>
          <PathwayLiveInventoryStrip
            pathway={pathway}
            questionSnapshot={overview.questionSnapshot}
            lessonCount={overview.lessonCount}
            variant="hub"
          />
        </section>
      ) : null}

      {profession && roleHero ? (
        <section
          className="grid gap-4 md:grid-cols-3"
          aria-labelledby="allied-role-hero-visible-heading"
        >
          <h2 id="allied-role-hero-visible-heading" className="sr-only">
            Role snapshot
          </h2>
          <article className="rounded-[1.35rem] border border-[color-mix(in_srgb,var(--semantic-chart-3)_22%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-chart-3)_7%,var(--semantic-surface))] p-6">
            <h3 className="text-base font-semibold text-[var(--theme-heading-text)]">What you do in this role</h3>
            <ul className="mt-3 list-inside list-disc space-y-2 text-sm text-[var(--semantic-text-secondary)]">
              {roleHero.whatYouDo.map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>
          </article>
          <article className="rounded-[1.35rem] border border-[color-mix(in_srgb,var(--semantic-info)_22%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-info)_8%,var(--semantic-surface))] p-6">
            <h3 className="text-base font-semibold text-[var(--theme-heading-text)]">Where you work</h3>
            <ul className="mt-3 list-inside list-disc space-y-2 text-sm text-[var(--semantic-text-secondary)]">
              {roleHero.whereYouWork.map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>
          </article>
          <article className="rounded-[1.35rem] border border-[color-mix(in_srgb,var(--semantic-chart-1)_22%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-chart-1)_8%,var(--semantic-surface))] p-6">
            <h3 className="text-base font-semibold text-[var(--theme-heading-text)]">Top skills required</h3>
            <ul className="mt-3 list-inside list-disc space-y-2 text-sm text-[var(--semantic-text-secondary)]">
              {roleHero.topSkills.map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>
          </article>
        </section>
      ) : null}

      {profession ? (
        <section
          className="rounded-[1.5rem] border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-6 sm:p-8"
          aria-labelledby="allied-occupation-scope-heading"
        >
          <h2 id="allied-occupation-scope-heading" className="nn-marketing-h2">
            Scoped to this occupation
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[var(--semantic-text-secondary)]">
            Lessons, practice entry points, and study cards below keep{" "}
            <span className="font-semibold text-[var(--semantic-text-primary)]">{alliedProfessionTrackChipLabel(profession)}</span> context
            via <code className="rounded bg-[var(--semantic-panel-muted)] px-1">{ALLIED_PROFESSION_QUERY_PARAM}</code> on the
            allied pathway hub — not mixed with RN/PN/NP-only hubs.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link
              href={ALLIED_GLOBAL_HUB_PATH}
              className="text-sm font-semibold text-[var(--semantic-brand)] underline-offset-2 hover:underline"
            >
              ← Allied health occupation chooser
            </Link>
            <Link
              href={`${alliedHealthSegmentPath(profession.segment)}/blog`}
              className="text-sm font-medium text-[var(--semantic-text-secondary)] hover:text-[var(--semantic-brand)]"
            >
              Track blog
            </Link>
          </div>
          <div className="mt-6 grid gap-6 lg:grid-cols-2">
            <div>
              <h3 className="text-lg font-semibold text-[var(--theme-heading-text)]">Exam overview</h3>
              <ul className="mt-3 list-inside list-disc space-y-2 text-sm text-[var(--semantic-text-secondary)]">
                {profession.examOverview.map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-[var(--theme-heading-text)]">How NurseNest supports this track</h3>
              <ul className="mt-3 list-inside list-disc space-y-2 text-sm text-[var(--semantic-text-secondary)]">
                {profession.features.map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </ul>
            </div>
          </div>
          {sampleQuestionStem ? (
            <div className="mt-8 rounded-xl border border-[color-mix(in_srgb,var(--semantic-chart-4)_22%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-chart-4)_6%,var(--semantic-surface))] p-5">
              <h3 className="text-base font-semibold text-[var(--theme-heading-text)]">Sample question stem (preview)</h3>
              <p className="mt-2 text-sm text-[var(--semantic-text-secondary)]">{sampleQuestionStem}</p>
              <p className="mt-2 text-xs text-[var(--semantic-text-secondary)]">
                Full items and rationales unlock with a matching allied plan in the app.
              </p>
            </div>
          ) : null}
        </section>
      ) : null}

      {profession && skillOverlay ? (
        <section
          className="rounded-[1.5rem] border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-6 sm:p-8"
          aria-labelledby="allied-skill-overlay-heading"
        >
          <h2 id="allied-skill-overlay-heading" className="nn-marketing-h2">
            Study map for {alliedProfessionTrackChipLabel(profession)}
          </h2>
          <p className="mt-2 max-w-2xl text-sm text-[var(--semantic-text-secondary)]">
            Structured overlays — same lessons and questions as the allied pathway, organized for your licensing context.
          </p>
          <div className="mt-6 grid gap-6 lg:grid-cols-2">
            <div>
              <h3 className="text-lg font-semibold text-[var(--semantic-chart-2)]">Common tasks</h3>
              <ul className="mt-3 list-inside list-disc space-y-2 text-sm text-[var(--semantic-text-secondary)]">
                {skillOverlay.commonTasks.map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-[var(--semantic-success)]">Clinical skills</h3>
              <ul className="mt-3 list-inside list-disc space-y-2 text-sm text-[var(--semantic-text-secondary)]">
                {skillOverlay.clinicalSkills.map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-[var(--semantic-warning)]">High-risk situations</h3>
              <ul className="mt-3 list-inside list-disc space-y-2 text-sm text-[var(--semantic-text-secondary)]">
                {skillOverlay.highRiskSituations.map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-[var(--semantic-info)]">Exam focus areas</h3>
              <ul className="mt-3 list-inside list-disc space-y-2 text-sm text-[var(--semantic-text-secondary)]">
                {skillOverlay.examFocusAreas.map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      ) : null}

      {!profession ? (
        <section
          id="allied-occupation-tracks"
          className="rounded-[1.5rem] border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-6 sm:p-8"
          aria-labelledby="allied-tracks-heading"
        >
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 id="allied-tracks-heading" className="nn-marketing-h2">
                Choose Your Allied Health Track
              </h2>
              <p className="mt-2 max-w-2xl text-sm text-[var(--semantic-text-secondary)]">
                Every track opens the same pathway-scoped lessons and question bank, with optional profession filters so study
                stays aligned to your licensing context.
              </p>
            </div>
            <Link href="/allied-health" className="text-sm font-semibold text-[var(--semantic-brand)] underline-offset-2 hover:underline">
              Allied marketing overview →
            </Link>
          </div>
          <p className="nn-marketing-label mt-6 text-[var(--semantic-text-secondary)]">Quick scan</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {tracks.map((p) => (
              <Link
                key={p.segment}
                href={buildAlliedOccupationMarketingHubPath(p.professionKey)}
                className="rounded-full border border-[var(--semantic-border-soft)] bg-[var(--semantic-panel-muted)] px-3 py-1.5 text-xs font-semibold text-[var(--semantic-text-primary)] transition hover:border-[color-mix(in_srgb,var(--semantic-brand)_35%,var(--semantic-border-soft))] hover:bg-[var(--semantic-surface)]"
              >
                {alliedProfessionTrackChipLabel(p)}
              </Link>
            ))}
          </div>
          <ul className="nn-qa-pathway-lessons-grid mt-8 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {tracks.map((p) => {
              const visual = getLessonHubSystemVisual(hubVisualKeyForCategoryId(p.hubCategory));
              const Icon = visual.icon;
              const scopedLessons = mergeMarketingPathQuery(lessonsHref, {
                [ALLIED_PROFESSION_QUERY_PARAM]: p.professionKey,
              });
              return (
                <li key={p.segment} className="min-w-0">
                  <article
                    className="flex h-full min-w-0 flex-col rounded-[1.35rem] border border-[color-mix(in_srgb,var(--semantic-chart-3)_18%,var(--semantic-border-soft))] bg-[var(--semantic-panel-muted)] p-5 shadow-[var(--semantic-shadow-soft)] transition motion-safe:hover:-translate-y-0.5 hover:border-[color-mix(in_srgb,var(--semantic-brand)_28%,var(--semantic-border-soft))]"
                    style={{ "--nn-system-accent": `var(${visual.accentVar})` } as CSSProperties}
                  >
                    <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-[color-mix(in_srgb,var(--nn-system-accent)_20%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--nn-system-accent)_10%,var(--semantic-surface))] text-[var(--nn-system-accent)]">
                      <Icon className="h-4 w-4" aria-hidden />
                    </span>
                    <span
                      className={`mt-3 inline-flex w-fit ${ALLIED_HUB_CATEGORY_BADGE_CLASS[p.hubCategory]}`}
                      title={ALLIED_HUB_CATEGORY_META[p.hubCategory].sublabel}
                    >
                      {ALLIED_HUB_CATEGORY_SHORT[p.hubCategory]}
                    </span>
                    <h3 className="mt-2 text-base font-semibold text-[var(--theme-heading-text)]">{alliedProfessionTrackChipLabel(p)}</h3>
                    <p className="mt-2 flex-1 text-sm leading-relaxed text-[var(--semantic-text-secondary)]">{p.description}</p>
                    <div className="mt-4 flex flex-wrap gap-2 border-t border-[var(--semantic-border-soft)] pt-4">
                      <Link
                        href={buildAlliedOccupationMarketingHubPath(p.professionKey)}
                        className="text-sm font-semibold text-[var(--semantic-brand)] underline-offset-2 hover:underline"
                        data-nn-allied-occupation-card-primary="1"
                      >
                        Open Study Hub
                      </Link>
                      <span className="text-[var(--semantic-text-secondary)]">·</span>
                      <Link
                        href={scopedLessons}
                        className="text-sm font-medium text-[var(--semantic-text-secondary)] hover:text-[var(--semantic-brand)]"
                      >
                        Lessons for this track
                      </Link>
                    </div>
                  </article>
                </li>
              );
            })}
          </ul>
        </section>
      ) : null}

      {/* Core study modes — NurseNest study-card vocabulary */}
      {showFullStudySurface ? (
      <section aria-labelledby="allied-study-modes-heading">
        <h2 id="allied-study-modes-heading" className="nn-marketing-h2">
          Study Modes
        </h2>
        <p className="mt-2 max-w-2xl text-sm text-[var(--semantic-text-secondary)]">
          Move from concepts to recall to exam-style judgment — the same progression we use across NurseNest hubs, scoped to
          allied-tier content
          {profession ? (
            <>
              {" "}
              for <span className="font-semibold text-[var(--semantic-text-primary)]">{alliedProfessionTrackChipLabel(profession)}</span>.
            </>
          ) : (
            "."
          )}
        </p>
        <ul className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
          <li>
            <StudyCard
              surface="hub"
              variant="featured"
              href={lessonsHref}
              className="nn-exam-hub-study-card--lessons nn-qa-allied-hub-lessons"
              title="Lessons by Category"
              description="Pathway-scoped modules aligned to discipline clusters — same card layout as the lessons hub."
              cta="Open Lessons"
            />
          </li>
          <li>
            <StudyCard
              surface="hub"
              variant="featured"
              href={questionsHref}
              className="nn-exam-hub-study-card--questions nn-qa-allied-hub-questions"
              title="Practice Questions"
              description="Vignettes and rationales filtered to your allied authorization lane — no RN-only depth mixed in."
              cta="Practice Questions Hub"
            />
          </li>
          <li>
            <StudyCard
              surface="hub"
              variant="featured"
              href={flashcardsHref}
              className="nn-exam-hub-study-card--flashcards nn-qa-allied-hub-flashcards"
              title="Flashcards"
              description="High-yield recall for terminology, protocols, and safety edges. Opens the in-app flashcard builder for this pathway."
              cta="Open Flashcards"
            />
          </li>
          <li>
            <StudyCard
              surface="hub"
              variant="featured"
              href={practiceTestsHref}
              className="nn-exam-hub-study-card--practice nn-qa-allied-hub-practice-exams"
              title="Practice exams"
              description="Longer exam-style sets with pathway-aware pacing and sign-in callbacks that keep the allied tier in scope."
              cta="Open Practice Exams"
            />
          </li>
          <li>
            <AlliedPathwayHubCatCard professionKey={profKey || null} catHref={catHref} />
          </li>
        </ul>
      </section>
      ) : null}

      {showFullStudySurface ? (
        <ExamPathwayHubPremiumModules
          pathway={pathway}
          isSignedIn={viewerSignedIn}
          alliedProfessionKey={profKey || null}
          ecgModulePublic={ecgModulePublic}
        />
      ) : null}

      {showFullStudySurface && overview && overview.moduleCards.length > 0 ? (
        <section aria-labelledby="allied-module-addons-heading">
          <h2 id="allied-module-addons-heading" className="nn-marketing-h2">
            Specialized modules
          </h2>
          <p className="mt-2 max-w-2xl text-sm text-[var(--semantic-text-secondary)]">
            Modules only appear here when their public routes are enabled for this occupation. Surfaces that are not yet
            launched for allied learners are omitted from this list.
          </p>
          <ul className="mt-6 grid gap-4 md:grid-cols-2">
            {overview.moduleCards.map((card) => (
              <li key={card.id}>
                <article className="nn-premium-allied-module-card flex h-full min-w-0 flex-col rounded-[1.35rem] border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-5 shadow-[var(--semantic-shadow-soft)]">
                  <div className="flex min-w-0 items-center justify-between gap-3">
                    <h3 className="min-w-0 text-base font-semibold text-[var(--theme-heading-text)]">{card.title}</h3>
                    <span className="rounded-full border border-[var(--semantic-border-soft)] bg-[var(--semantic-panel-muted)] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-[var(--semantic-text-secondary)]">
                      {card.access === "free" ? "Free preview" : "Paid"}
                    </span>
                  </div>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-[var(--semantic-text-secondary)]">{card.description}</p>
                  <Link
                    href={card.href}
                    className="mt-4 inline-flex text-sm font-semibold text-[var(--semantic-brand)] underline-offset-2 hover:underline"
                  >
                    Open Module →
                  </Link>
                </article>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {/* Lessons by category — mirrors lesson hub system cards */}
      {showFullStudySurface ? (
      <section aria-labelledby="allied-lesson-cats-heading">
        <h2 id="allied-lesson-cats-heading" className="nn-marketing-h2">
          Lessons by Category
        </h2>
        <p className="mt-2 max-w-2xl text-sm text-[var(--semantic-text-secondary)]">
          Categories follow the allied discipline map — tap through to the paginated lessons hub with search-friendly topic
          context.
        </p>
        <ul className="nn-qa-pathway-lessons-grid mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
          {categoryShowcase.map((c) => {
            const visual = getLessonHubSystemVisual(hubVisualKeyForCategoryId(c.id));
            const Icon = visual.icon;
            const href = mergeMarketingPathQuery(lessonsHref, { q: c.title });
            return (
              <li key={c.id} className="min-w-0">
                <Link
                  href={href}
                  className="nn-lesson-system-card flex h-full min-w-0 flex-col rounded-[1.35rem] border border-[color-mix(in_srgb,var(--nn-system-accent)_16%,var(--semantic-border-soft))] bg-[var(--semantic-surface)] p-4 transition motion-safe:hover:shadow-[var(--semantic-shadow-soft)]"
                  style={{ "--nn-system-accent": `var(${visual.accentVar})` } as CSSProperties}
                >
                  <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-[color-mix(in_srgb,var(--nn-system-accent)_18%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--nn-system-accent)_9%,var(--semantic-panel-muted))] text-[var(--nn-system-accent)]">
                    <Icon className="h-4 w-4" aria-hidden />
                  </span>
                  <span className="mt-3 line-clamp-2 text-base font-semibold text-[var(--theme-heading-text)]">{c.title}</span>
                  {c.description ? (
                    <span className="mt-2 line-clamp-2 text-xs text-[var(--semantic-text-secondary)]">{c.description}</span>
                  ) : null}
                  <span className="mt-3 text-xs font-semibold text-[var(--semantic-brand)]">View Lessons →</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </section>
      ) : null}

      {/* Case scenarios, skills, readiness */}
      {showFullStudySurface ? (
      <section className="grid gap-5 lg:grid-cols-3" aria-labelledby="allied-deeper-heading">
        <h2 id="allied-deeper-heading" className="sr-only">
          Cases, skills, and readiness
        </h2>
        <article className="rounded-[1.35rem] border border-[color-mix(in_srgb,var(--semantic-chart-2)_22%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-chart-2)_6%,var(--semantic-surface))] p-6">
          <Stethoscope className="h-8 w-8 text-[var(--semantic-chart-2)]" aria-hidden />
          <h3 className="mt-4 text-lg font-semibold text-[var(--theme-heading-text)]">Case scenarios</h3>
          <p className="mt-2 text-sm text-[var(--semantic-text-secondary)]">
            {clinicalScenariosHref
              ? "Preview the learner scenarios shell with your occupation in the URL, then reinforce with pathway-scoped questions."
              : "Scenario-style stems and branching rationales live in the practice question bank. Start from the questions hub, then refine by topic inside the bank."}
          </p>
          <Link
            href={scenarioPrimaryHref}
            className="mt-4 inline-flex text-sm font-semibold text-[var(--semantic-brand)] underline-offset-2 hover:underline"
          >
            {clinicalScenariosHref ? "Open Clinical Scenarios (Sign In) →" : "Open Practice Questions →"}
          </Link>
          {clinicalScenariosHref ? (
            <Link
              href={questionsHref}
              className="mt-2 inline-flex text-sm font-medium text-[var(--semantic-text-secondary)] underline-offset-2 hover:text-[var(--semantic-brand)] hover:underline"
            >
              Or Go Straight to Practice Questions →
            </Link>
          ) : null}
        </article>
        <article className="rounded-[1.35rem] border border-[color-mix(in_srgb,var(--semantic-success)_24%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-success)_7%,var(--semantic-surface))] p-6">
          <ClipboardCheck className="h-8 w-8 text-[var(--semantic-success)]" aria-hidden />
          <h3 className="mt-4 text-lg font-semibold text-[var(--theme-heading-text)]">Skills and checklists</h3>
          <p className="mt-2 text-sm text-[var(--semantic-text-secondary)]">
            Procedure judgment, infection control, and documentation patterns are embedded across lessons and flashcards.
            Use lessons first, then flashcards for rapid checklist-style review.
          </p>
          <Link href={lessonsHref} className="mt-4 inline-flex text-sm font-semibold text-[var(--semantic-brand)] underline-offset-2 hover:underline">
            Browse Lesson Skills →
          </Link>
        </article>
        <article className="rounded-[1.35rem] border border-[color-mix(in_srgb,var(--semantic-warning)_26%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-warning)_8%,var(--semantic-surface))] p-6">
          <FileBarChart className="h-8 w-8 text-[var(--semantic-warning)]" aria-hidden />
          <h3 className="mt-4 text-lg font-semibold text-[var(--theme-heading-text)]">Exam readiness and report card</h3>
          <p className="mt-2 text-sm text-[var(--semantic-text-secondary)]">
            Signed-in learners get pacing, weak-area signals, and progress snapshots in My Exam Plan and the dashboard —
            scoped to your subscription and pathway.
          </p>
          <div className="mt-4 flex flex-col gap-2">
            <Link
              href={examPlanHref}
              className="inline-flex text-sm font-semibold text-[var(--semantic-brand)] underline-offset-2 hover:underline"
            >
              Open My Exam Plan (Sign In) →
            </Link>
            <Link
              href={practiceTestsHref}
              className="inline-flex text-sm font-medium text-[var(--semantic-text-secondary)] hover:text-[var(--semantic-brand)]"
            >
              Practice Exams Hub →
            </Link>
          </div>
        </article>
      </section>
      ) : null}

      {/* Pricing CTA band */}
      <section
        className="rounded-[1.5rem] border border-[var(--semantic-border-soft)] bg-[var(--semantic-panel-positive)] p-8 text-center"
        aria-labelledby="allied-pricing-heading"
      >
        <HeartHandshake className="mx-auto h-10 w-10 text-[var(--semantic-success)]" aria-hidden />
        <h2 id="allied-pricing-heading" className="nn-marketing-h2 mt-4">
          {profession ? alliedProfessionPremiumCtaHeadline(profession) : "Ready to choose one Allied occupation plan?"}
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-sm text-[var(--semantic-text-secondary)]">
          Allied occupations can share the same price, but access stays occupation-specific. Pick your track above, then
          confirm the plan that matches your exam and region before checkout.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link
            href={pricingHref}
            className="inline-flex min-h-11 items-center justify-center rounded-full bg-[var(--role-cta)] px-8 py-2.5 text-sm font-semibold text-[var(--role-cta-foreground)] shadow-[0_10px_22px_color-mix(in_srgb,var(--role-cta-shadow)_55%,transparent)] transition hover:bg-[var(--role-cta-hover)]"
          >
            View occupation-specific Allied pricing
          </Link>
          <Link
            href="/signup"
            className="inline-flex min-h-11 items-center justify-center rounded-full border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] px-8 py-2.5 text-sm font-semibold text-[var(--semantic-text-primary)] transition hover:bg-[var(--semantic-panel-muted)]"
          >
            Create account to choose your occupation
          </Link>
        </div>
        <p className="mt-4 text-xs text-[var(--semantic-text-secondary)]">
          <Sparkles className="mr-1 inline h-3.5 w-3.5 align-text-bottom text-[var(--semantic-chart-4)]" aria-hidden />
          Prefer nursing tracks?{" "}
          <Link href="/lessons" className="font-semibold text-[var(--semantic-brand)] underline-offset-2 hover:underline">
            Browse RN, PN, and NP hubs
          </Link>
          .
        </p>
      </section>
    </div>
  );
}
