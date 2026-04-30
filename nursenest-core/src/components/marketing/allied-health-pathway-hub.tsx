import Link from "next/link";
import type { CSSProperties } from "react";
import {
  Activity,
  BookOpen,
  ClipboardCheck,
  FileBarChart,
  GraduationCap,
  HeartHandshake,
  Layers,
  Sparkles,
  Stethoscope,
  Target,
} from "lucide-react";
import { FunnelExamHubViewBeacon } from "@/components/marketing/funnel-analytics-beacons";
import { StudyCard } from "@/components/ui/study-card";
import { getLessonHubSystemVisual } from "@/components/pathway-lessons/lesson-system-hub-visuals";
import {
  alliedProfessionDefaultRoleHero,
  alliedProfessionDefaultSkillOverlay,
  alliedProfessionPremiumCtaHeadline,
  alliedProfessionTrackChipLabel,
  listAlliedProfessionsSorted,
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
import { learningConfigForPathwayId } from "@/lib/pathways/pathway-learning-structure";
import { loginWithCallback } from "@/lib/marketing/marketing-entry-routes";
import { marketingTierHubStudyActionHref } from "@/lib/navigation/marketing-tier-hub-study-hrefs";
import { ALLIED_PROFESSION_QUERY_PARAM, isAlliedMarketingCorePathwayId } from "@/lib/lessons/canonical-lessons-hubs";
import { SCENARIO_LEARNER_ROUTES, withScenarioPathwayAndProfessionQuery } from "@/lib/scenarios/scenario-routes";

function hubVisualKeyForCategoryId(id: string): string {
  const s = id.trim().toLowerCase().replace(/[^a-z0-9]+/g, "_");
  return s.length > 0 ? s : "fundamentals";
}

export function AlliedHealthPathwayHub({
  pathway,
  hubPath,
  profession = null,
  sampleQuestionStem = null,
}: {
  pathway: ExamPathwayDefinition;
  hubPath: string;
  /** When set, this hub is scoped to a single occupation (links carry `?alliedProfession=`). */
  profession?: AlliedProfessionMarketing | null;
  /** Optional preview line for occupation hubs (bounded stem text). */
  sampleQuestionStem?: string | null;
}) {
  const countryLine = pathway.countrySlug === "canada" ? "Canada" : "United States";
  const profKey = profession?.professionKey?.trim() ?? "";

  const lessonsHref = profKey
    ? alliedHealthLessonsIndexPath(profKey)
    : marketingTierHubStudyActionHref(pathway, "lessons");
  const questionsBase = buildExamPathwayPath(pathway, "questions");
  const questionsHref = profKey ? withAlliedProfessionMarketingQuery(questionsBase, profKey) : questionsBase;
  const flashcardsBase = marketingTierHubStudyActionHref(pathway, "flashcards");
  const flashcardsHref = profKey ? withAlliedProfessionMarketingQuery(flashcardsBase, profKey) : flashcardsBase;
  const catBase = buildExamPathwayPath(pathway, "cat");
  const catHref = profKey ? withAlliedProfessionMarketingQuery(catBase, profKey) : catBase;
  const pricingHref = buildExamPathwayPath(pathway, "pricing");
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
    : `${countryLine} · Allied health`;

  const roleHero = profession ? alliedProfessionDefaultRoleHero(profession) : null;
  const skillOverlay = profession ? alliedProfessionDefaultSkillOverlay(profession) : null;
  const scenarioPrimaryHref = clinicalScenariosHref ?? questionsHref;

  return (
    <div className="space-y-[var(--nn-rhythm-section-y)]" data-nn-allied-pathway-hub="1">
      <FunnelExamHubViewBeacon pathway={pathway} hubPath={hubPath} />

      {/* Hero */}
      <header className="relative overflow-hidden rounded-[1.75rem] border border-[color-mix(in_srgb,var(--semantic-info)_22%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-info)_7%,var(--semantic-surface))] px-6 py-10 shadow-[var(--semantic-shadow-soft)] sm:px-10 sm:py-12">
        <div
          className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-[color-mix(in_srgb,var(--semantic-brand)_14%,transparent)] blur-3xl"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute -bottom-16 -left-12 h-48 w-48 rounded-full bg-[color-mix(in_srgb,var(--semantic-success)_12%,transparent)] blur-3xl"
          aria-hidden
        />
        <p className="text-[0.65rem] font-bold uppercase tracking-[0.2em] text-[var(--semantic-brand)]">{heroKicker}</p>
        <h1 className="mt-3 max-w-3xl text-3xl font-extrabold tracking-tight text-[var(--theme-heading-text)] sm:text-4xl sm:leading-[1.12]">
          {heroTitle}
        </h1>
        <p className="mt-5 max-w-2xl text-base leading-relaxed text-[var(--semantic-text-secondary)] sm:text-lg">
          {heroBody}
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href={pricingHref}
            className="inline-flex min-h-11 items-center justify-center rounded-full bg-[var(--semantic-brand)] px-6 py-2.5 text-sm font-semibold text-[var(--semantic-brand-contrast)] shadow-md transition hover:opacity-95"
          >
            View plans and pricing
          </Link>
          <Link
            href={profession ? "/allied-health" : "/allied-health#allied-professions-heading"}
            className="inline-flex min-h-11 items-center justify-center rounded-full border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] px-6 py-2.5 text-sm font-semibold text-[var(--semantic-text-primary)] transition hover:bg-[var(--semantic-panel-muted)]"
          >
            {profession ? "All occupation tracks" : "Choose your occupation track"}
          </Link>
          <Link
            href={lessonsHref}
            className="inline-flex min-h-11 items-center justify-center rounded-full border border-[color-mix(in_srgb,var(--semantic-info)_35%,var(--semantic-border-soft))] px-6 py-2.5 text-sm font-semibold text-[var(--semantic-info)] transition hover:bg-[color-mix(in_srgb,var(--semantic-info)_8%,var(--semantic-surface))]"
          >
            {profession ? "Lessons for this track" : "Browse lessons hub"}
          </Link>
        </div>
      </header>

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
          <h2 id="allied-occupation-scope-heading" className="text-xl font-bold text-[var(--theme-heading-text)]">
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
              href="/allied-health"
              className="text-sm font-semibold text-[var(--semantic-brand)] underline-offset-2 hover:underline"
            >
              ← Allied health occupation chooser
            </Link>
            <Link
              href={`/allied-health/${encodeURIComponent(profession.professionKey)}/blog`}
              className="text-sm font-medium text-[var(--semantic-text-secondary)] hover:text-[var(--semantic-brand)]"
            >
              Track blog
            </Link>
          </div>
          <div className="mt-8 grid gap-8 lg:grid-cols-2">
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
          <h2 id="allied-skill-overlay-heading" className="text-xl font-bold text-[var(--theme-heading-text)]">
            Study map for {alliedProfessionTrackChipLabel(profession)}
          </h2>
          <p className="mt-2 max-w-2xl text-sm text-[var(--semantic-text-secondary)]">
            Structured overlays — same lessons and questions as the allied pathway, organized for your licensing context.
          </p>
          <div className="mt-8 grid gap-8 lg:grid-cols-2">
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
        <section className="rounded-[1.5rem] border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-6 sm:p-8" aria-labelledby="allied-tracks-heading">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 id="allied-tracks-heading" className="text-xl font-bold text-[var(--theme-heading-text)]">
                Choose your Allied Health track
              </h2>
              <p className="mt-2 max-w-2xl text-sm text-[var(--semantic-text-secondary)]">
                Every track opens the same pathway-scoped lessons and question bank, with optional profession filters so study
                stays aligned to your licensing context.
              </p>
            </div>
            <Link href="/allied-health" className="text-sm font-semibold text-[var(--semantic-brand)] underline-offset-2 hover:underline">
              Full allied marketing hub →
            </Link>
          </div>
          <p className="nn-marketing-label mt-6 text-[var(--semantic-text-secondary)]">Quick scan</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {tracks.map((p) => (
              <Link
                key={p.segment}
                href={alliedHealthSegmentPath(p.segment)}
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
                <li key={p.segment}>
                  <article
                    className="flex h-full flex-col rounded-[1.35rem] border border-[color-mix(in_srgb,var(--semantic-chart-3)_18%,var(--semantic-border-soft))] bg-[var(--semantic-panel-muted)] p-5 shadow-[var(--semantic-shadow-soft)] transition hover:-translate-y-0.5 hover:border-[color-mix(in_srgb,var(--semantic-brand)_28%,var(--semantic-border-soft))]"
                    style={{ "--nn-system-accent": `var(${visual.accentVar})` } as CSSProperties}
                  >
                    <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-[color-mix(in_srgb,var(--nn-system-accent)_20%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--nn-system-accent)_10%,var(--semantic-surface))] text-[var(--nn-system-accent)]">
                      <Icon className="h-4 w-4" aria-hidden />
                    </span>
                    <h3 className="mt-3 text-base font-semibold text-[var(--theme-heading-text)]">{alliedProfessionTrackChipLabel(p)}</h3>
                    <p className="mt-2 flex-1 text-sm leading-relaxed text-[var(--semantic-text-secondary)]">{p.description}</p>
                    <div className="mt-4 flex flex-wrap gap-2 border-t border-[var(--semantic-border-soft)] pt-4">
                      <Link
                        href={alliedHealthSegmentPath(p.segment)}
                        className="text-sm font-semibold text-[var(--semantic-brand)] underline-offset-2 hover:underline"
                      >
                        Track prep guide
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
      <section aria-labelledby="allied-study-modes-heading">
        <h2 id="allied-study-modes-heading" className="text-xl font-bold text-[var(--theme-heading-text)]">
          Study modes
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
        <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <li>
            <StudyCard
              surface="hub"
              variant="featured"
              href={lessonsHref}
              className="nn-qa-allied-hub-lessons"
              icon={BookOpen}
              title="Lessons by category"
              description="Pathway-scoped modules aligned to discipline clusters — same card layout as the lessons hub."
              cta="Open lessons"
            />
          </li>
          <li>
            <StudyCard
              surface="hub"
              variant="featured"
              href={questionsHref}
              className="nn-qa-allied-hub-questions"
              icon={Target}
              title="Practice questions"
              description="Vignettes and rationales filtered to your allied authorization lane — no RN-only depth mixed in."
              cta="Practice questions hub"
            />
          </li>
          <li>
            <StudyCard
              surface="hub"
              variant="featured"
              href={flashcardsHref}
              className="nn-qa-allied-hub-flashcards"
              icon={Layers}
              title="Flashcards"
              description="High-yield recall for terminology, protocols, and safety edges. Opens the in-app flashcard builder for this pathway."
              cta="Open flashcards"
            />
          </li>
          <li>
            <StudyCard
              surface="hub"
              variant="featured"
              href={catHref}
              className="nn-qa-allied-hub-cat"
              icon={Activity}
              title="Adaptive readiness"
              description="CAT-style practice where difficulty responds to performance — use this when you are ready for longer, exam-shaped sessions."
              cta="Explore adaptive hub"
            />
          </li>
        </ul>
      </section>

      {/* Lessons by category — mirrors lesson hub system cards */}
      <section aria-labelledby="allied-lesson-cats-heading">
        <h2 id="allied-lesson-cats-heading" className="text-xl font-bold text-[var(--theme-heading-text)]">
          Lessons by category
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
              <li key={c.id}>
                <Link
                  href={href}
                  className="nn-lesson-system-card flex h-full flex-col rounded-[1.35rem] border border-[color-mix(in_srgb,var(--nn-system-accent)_16%,var(--semantic-border-soft))] bg-[var(--semantic-surface)] p-4 transition hover:shadow-[var(--semantic-shadow-soft)]"
                  style={{ "--nn-system-accent": `var(${visual.accentVar})` } as CSSProperties}
                >
                  <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-[color-mix(in_srgb,var(--nn-system-accent)_18%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--nn-system-accent)_9%,var(--semantic-panel-muted))] text-[var(--nn-system-accent)]">
                    <Icon className="h-4 w-4" aria-hidden />
                  </span>
                  <span className="mt-3 line-clamp-2 text-base font-semibold text-[var(--theme-heading-text)]">{c.title}</span>
                  {c.description ? (
                    <span className="mt-2 line-clamp-2 text-xs text-[var(--semantic-text-secondary)]">{c.description}</span>
                  ) : null}
                  <span className="mt-3 text-xs font-semibold text-[var(--semantic-brand)]">View lessons →</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </section>

      {/* Case scenarios, skills, readiness */}
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
            {clinicalScenariosHref ? "Open clinical scenarios (sign in) →" : "Open practice questions →"}
          </Link>
          {clinicalScenariosHref ? (
            <Link
              href={questionsHref}
              className="mt-2 inline-flex text-sm font-medium text-[var(--semantic-text-secondary)] underline-offset-2 hover:text-[var(--semantic-brand)] hover:underline"
            >
              Or go straight to practice questions →
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
            Browse lesson skills →
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
              Open My Exam Plan (sign in) →
            </Link>
            <Link
              href={practiceTestsHref}
              className="inline-flex text-sm font-medium text-[var(--semantic-text-secondary)] hover:text-[var(--semantic-brand)]"
            >
              Practice exams hub →
            </Link>
          </div>
        </article>
      </section>

      {/* Pricing CTA band */}
      <section
        className="rounded-[1.5rem] border border-[var(--semantic-border-soft)] bg-[var(--semantic-panel-positive)] p-8 text-center"
        aria-labelledby="allied-pricing-heading"
      >
        <HeartHandshake className="mx-auto h-10 w-10 text-[var(--semantic-success)]" aria-hidden />
        <h2 id="allied-pricing-heading" className="mt-4 text-xl font-bold text-[var(--theme-heading-text)]">
          {profession ? alliedProfessionPremiumCtaHeadline(profession) : "Ready to study on a career-specific allied plan?"}
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-sm text-[var(--semantic-text-secondary)]">
          Allied plans are priced per career lane at checkout. Pick your track above, then confirm the plan that matches your
          exam and region.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link
            href={pricingHref}
            className="inline-flex min-h-11 items-center justify-center rounded-full bg-[var(--semantic-success)] px-8 py-2.5 text-sm font-semibold text-[var(--semantic-success-contrast)] transition hover:opacity-95"
          >
            Compare allied pricing
          </Link>
          <Link
            href="/signup"
            className="inline-flex min-h-11 items-center justify-center rounded-full border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] px-8 py-2.5 text-sm font-semibold text-[var(--semantic-text-primary)] transition hover:bg-[var(--semantic-panel-muted)]"
          >
            Create account
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

      {/* Secondary: flashcards + exams reminder row */}
      <section className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-dashed border-[var(--semantic-border-soft)] bg-[var(--semantic-panel-muted)] px-5 py-4">
        <div className="flex items-center gap-3">
          <GraduationCap className="h-9 w-9 shrink-0 text-[var(--semantic-info)]" aria-hidden />
          <div>
            <p className="text-sm font-semibold text-[var(--theme-heading-text)]">Already subscribed?</p>
            <p className="text-xs text-[var(--semantic-text-secondary)]">
              Jump into flashcards, practice sessions, or longer mock exams with your allied pathway id.
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            href={flashcardsHref}
            className="rounded-full border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] px-4 py-2 text-xs font-semibold hover:bg-[var(--semantic-panel-cool)]"
          >
            Flashcards
          </Link>
          <Link
            href={practiceTestsHref}
            className="rounded-full border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] px-4 py-2 text-xs font-semibold hover:bg-[var(--semantic-panel-cool)]"
          >
            Practice exams
          </Link>
        </div>
      </section>
    </div>
  );
}
