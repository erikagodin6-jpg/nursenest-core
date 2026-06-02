import { ExamPathwayHubPremiumModules } from "@/components/exam-pathways/exam-pathway-hub-premium-modules";
import Link from "next/link";
import { AdmissionsProductReadinessGrid } from "@/components/pre-nursing/admissions-product-readiness-grid";
import { PreNursingLandingClient } from "@/components/pre-nursing/pre-nursing-landing-client";
import { PreNursingMarketingHubActions } from "@/components/pre-nursing/pre-nursing-marketing-hub-actions";
import { PreNursingSurfaceAnalytics } from "@/components/pre-nursing/pre-nursing-surface-analytics";
import { BreadcrumbBar } from "@/components/seo/breadcrumb-bar";
import { getExamPathwayById } from "@/lib/exam-pathways/exam-pathways-catalog";
import { DEFAULT_MARKETING_LOCALE } from "@/lib/i18n/marketing-locale-policy";
import { withMarketingLocale } from "@/lib/i18n/marketing-path";
import { loginWithCallback } from "@/lib/marketing/marketing-entry-routes";
import { pathwayHubAppPracticeTestsHref } from "@/lib/marketing/pathway-hub-app-questions-href";
import {
  PRE_NURSING_CATEGORIES,
  PRE_NURSING_LESSON_QUALITY_STANDARD,
  PRE_NURSING_PATHWAY_PROGRESSION,
  PRE_NURSING_QUESTION_REQUIREMENTS,
  preNursingCategoryCount,
  preNursingTotalLessonCount,
} from "@/lib/pre-nursing/pre-nursing-learning-ecosystem";
import { preNursingHubBreadcrumbs } from "@/lib/seo/breadcrumb-resolver";

const DEFAULT_PATHWAY_ID = "pre-nursing" as const;

/**
 * Public Pre-Nursing hub body: hero, primary study-mode cards, and the same premium foundations
 * ecosystem as {@link ExamPathwayHubPremiumModules} on pathway-tier hubs (`pre-nursing` / `pre-nursing-ca`).
 */
export async function PreNursingMarketingHubMain({
  heroTitle,
  heroSubtitle,
  linkHref,
  marketingLocale = DEFAULT_MARKETING_LOCALE,
  pathwayId = DEFAULT_PATHWAY_ID,
}: {
  heroTitle: string;
  heroSubtitle: string;
  /** Prefix in-app-safe marketing paths (e.g. `withMarketingLocale`); exam `/us/…` paths must never be prefixed. */
  linkHref: (path: string) => string;
  /** Marketing UI locale for {@link withMarketingLocale} (module grid + hub actions compute hrefs client/server consistently). */
  marketingLocale?: string;
  pathwayId?: typeof DEFAULT_PATHWAY_ID | "pre-nursing-ca";
}) {
  const pathway = getExamPathwayById(pathwayId);
  if (!pathway) {
    throw new Error(`Pre-Nursing hub: missing pathway registry entry "${pathwayId}"`);
  }

  const practiceAppPath = pathwayHubAppPracticeTestsHref(pathway.id);
  const practiceHref = loginWithCallback(practiceAppPath);

  const lessonsPublicHref = withMarketingLocale(marketingLocale, "/pre-nursing/lessons");
  const flashcardsPublicHref = withMarketingLocale(marketingLocale, "/flashcards");
  const practicePublicHref = withMarketingLocale(marketingLocale, practiceHref);

  const { crumbs, schemaItems } = preNursingHubBreadcrumbs();
  const localizedCrumbs = crumbs.map((c) => (c.href ? { ...c, href: linkHref(c.href) } : c));

  return (
    <div
      className="nn-pre-nursing-marketing-hub mx-auto max-w-6xl px-4 py-4 sm:px-6 sm:py-6 lg:px-8"
      data-nn-nursing-tier-hub="surface"
      data-nn-qa-pre-nursing-marketing-hub=""
    >
      <PreNursingSurfaceAnalytics surface="hub" />
      <BreadcrumbBar
        crumbs={localizedCrumbs}
        schemaItems={schemaItems}
        navClassName="nn-marketing-caption text-[var(--theme-muted-text)]"
      />
      <section className="nn-pre-nursing-hub-shell space-y-8" aria-labelledby="pre-nursing-hero-heading">
        <PreNursingMarketingHubActions
          heroTitle={heroTitle}
          heroSubtitle={heroSubtitle}
          lessonsHref={lessonsPublicHref}
          flashcardsHref={flashcardsPublicHref}
          practiceHref={practicePublicHref}
        />

        <section
          className="space-y-5"
          aria-labelledby="pre-nursing-ecosystem-heading"
          data-nn-pre-nursing-learning-ecosystem=""
        >
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="nn-premium-home-eyebrow">Foundational Learning Ecosystem</p>
              <h2 id="pre-nursing-ecosystem-heading" className="nn-marketing-h2 text-balance text-[var(--palette-heading)]">
                Build Nursing School Confidence by Category
              </h2>
              <p className="nn-marketing-body-sm mt-2 max-w-3xl text-pretty text-[var(--semantic-text-secondary)]">
                {preNursingCategoryCount()} academic categories guide learners from lessons to flashcards to practice questions.
                No CAT exam is required for Pre-Nursing.
              </p>
            </div>
            <div className="rounded-2xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] px-4 py-3 text-sm text-[var(--semantic-text-secondary)] shadow-[var(--semantic-shadow-soft)]">
              <span className="font-semibold text-[var(--semantic-text-primary)]">{preNursingTotalLessonCount()}</span> lesson segments across the current library
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {PRE_NURSING_CATEGORIES.map((category) => (
              <article
                key={category.slug}
                className="flex min-h-[17rem] flex-col rounded-2xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-5 shadow-[var(--semantic-shadow-soft)]"
              >
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-[var(--semantic-brand)]">{category.readinessLabel}</p>
                  <h3 className="mt-1 text-lg font-semibold text-[var(--semantic-text-primary)]">{category.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-[var(--semantic-text-secondary)]">{category.description}</p>
                </div>
                <div className="mt-4 grid gap-2 text-xs text-[var(--semantic-text-secondary)]">
                  <p>
                    <span className="font-semibold text-[var(--semantic-text-primary)]">Lesson modules:</span>{" "}
                    {category.lessonSlugs.slice(0, 3).join(", ")}
                  </p>
                  <p>
                    <span className="font-semibold text-[var(--semantic-text-primary)]">Question focus:</span>{" "}
                    {category.questionFocus.join(", ")}
                  </p>
                  <p>
                    <span className="font-semibold text-[var(--semantic-text-primary)]">Study pearl:</span>{" "}
                    {category.studyPearl}
                  </p>
                </div>
                <Link
                  href={lessonsPublicHref}
                  className="mt-auto pt-4 text-sm font-semibold text-[var(--semantic-brand)] underline-offset-2 hover:underline"
                >
                  Start with lessons →
                </Link>
              </article>
            ))}
          </div>
        </section>

        <AdmissionsProductReadinessGrid />

        <section className="grid gap-5 lg:grid-cols-2" data-nn-pre-nursing-quality-standards="">
          <div className="rounded-2xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-5 shadow-[var(--semantic-shadow-soft)]">
            <h2 className="text-lg font-semibold text-[var(--semantic-text-primary)]">College-Level Lesson Standard</h2>
            <p className="mt-2 text-sm leading-relaxed text-[var(--semantic-text-secondary)]">
              Every Pre-Nursing topic is governed as a lesson-first learning unit, then supported by flashcards and practice.
            </p>
            <ul className="mt-4 grid gap-2 text-sm text-[var(--semantic-text-secondary)] sm:grid-cols-2">
              {PRE_NURSING_LESSON_QUALITY_STANDARD.map((item) => (
                <li key={item} className="rounded-xl border border-[var(--semantic-border-soft)] px-3 py-2">
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-5 shadow-[var(--semantic-shadow-soft)]">
            <h2 className="text-lg font-semibold text-[var(--semantic-text-primary)]">Practice Question Standard</h2>
            <p className="mt-2 text-sm leading-relaxed text-[var(--semantic-text-secondary)]">
              Foundational questions teach knowledge, understanding, and application with supportive study feedback.
            </p>
            <ul className="mt-4 grid gap-2 text-sm text-[var(--semantic-text-secondary)] sm:grid-cols-2">
              {PRE_NURSING_QUESTION_REQUIREMENTS.map((item) => (
                <li key={item} className="rounded-xl border border-[var(--semantic-border-soft)] px-3 py-2">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section
          className="rounded-2xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-5 shadow-[var(--semantic-shadow-soft)]"
          aria-labelledby="pre-nursing-pathway-progression-heading"
          data-nn-pre-nursing-pathway-progression=""
        >
          <h2 id="pre-nursing-pathway-progression-heading" className="text-lg font-semibold text-[var(--semantic-text-primary)]">
            Your NurseNest Journey
          </h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-5">
            {PRE_NURSING_PATHWAY_PROGRESSION.map((step, index) => (
              <div key={step} className="rounded-xl border border-[var(--semantic-border-soft)] bg-[color-mix(in_srgb,var(--semantic-brand)_05%,var(--semantic-surface))] p-4">
                <p className="text-xs font-semibold text-[var(--semantic-brand)]">{String(index + 1).padStart(2, "0")}</p>
                <p className="mt-1 text-sm font-semibold text-[var(--semantic-text-primary)]">{step}</p>
              </div>
            ))}
          </div>
        </section>

        <div className="space-y-6 pt-2">
          <PreNursingLandingClient modulesOnly marketingLocale={marketingLocale} />
        </div>

        <ExamPathwayHubPremiumModules pathway={pathway} isSignedIn={false} rootClassName="mt-2 sm:mt-4" />
      </section>
    </div>
  );
}
