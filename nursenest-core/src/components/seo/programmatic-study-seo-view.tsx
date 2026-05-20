import Link from "next/link";
import type { ExamPathwayDefinition } from "@/lib/exam-pathways/types";
import { buildExamPathwayPath } from "@/lib/exam-pathways/build-exam-pathway-path";
import { BreadcrumbBar } from "@/components/seo/breadcrumb-bar";
import { pathwayProgrammaticStudySeoBreadcrumbs } from "@/lib/seo/pathway-breadcrumbs";
import type { ProgrammaticStudySeoPagePayload } from "@/lib/seo/programmatic-study-seo-load";
import {
  marketingPathwayLessonsIndexPath,
  marketingPathwayLessonDetailPath,
  marketingProgrammaticStudySeoPath,
  marketingPathwayLessonTopicClusterPath,
} from "@/lib/lessons/lesson-routes";
import { pathwayLessonPublicDetailPath } from "@/lib/lessons/pathway-lesson-types";
import {
  sanitizePaywallPreviewSection,
  visibleSectionsForLesson,
} from "@/lib/lessons/pathway-lesson-access";
import { buildQuickReviewBullets } from "@/lib/lessons/pathway-lesson-quick-review";
import { contentTierForPathwayLessonRender } from "@/lib/lessons/global-lesson-architecture";
import { getMeasurementSystemForCountry } from "@/lib/measurements/measurement-system";
import { LessonSectionCard } from "@/components/lessons/lesson-section-card";
import { PathwayLessonSectionContent } from "@/components/lessons/pathway-lesson-body";
import { PathwayLessonLockedSectionsPreview } from "@/components/lessons/pathway-lesson-locked-sections-preview";
import { shouldRenderPathwayLessonSection } from "@/lib/lessons/lesson-section-page-layout";
import type { TierCode } from "@prisma/client";
import { absoluteUrl } from "@/lib/seo/site-origin";

function parseOptions(raw: unknown): string[] {
  if (Array.isArray(raw)) return raw.map((x) => String(x));
  return [];
}

function WebPageJsonLd(args: { name: string; description: string; url: string }) {
  const jsonLd = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: args.name,
    description: args.description,
    url: args.url,
  });
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd }} />;
}

export function ProgrammaticStudySeoView({
  pathway,
  payload,
  canonicalPath,
}: {
  pathway: ExamPathwayDefinition;
  payload: ProgrammaticStudySeoPagePayload;
  canonicalPath: string;
}) {
  const { lesson, questionCount, previewQuestions, flashcardPreview, introPlainText } = payload;
  /** Marketing shell matches lesson detail: anonymous preview — full lesson lives in `/app` after subscribe. */
  const fullAccess = false;
  const visible = visibleSectionsForLesson(lesson, fullAccess);
  const visibleForRender = visible.map(sanitizePaywallPreviewSection);
  const previewLesson = { ...lesson, sections: visibleForRender, preTest: undefined, postTest: undefined };
  const lessonWikiBasePath = pathwayLessonPublicDetailPath(pathway, lesson.slug);
  const lessonContentTier = contentTierForPathwayLessonRender(pathway, null);
  const lessonMeasurementSystem = getMeasurementSystemForCountry(pathway.countryCode);

  const lockedSections =
    lesson.sections.length > visible.length
      ? lesson.sections
          .slice(visible.length)
          .filter((s) => shouldRenderPathwayLessonSection(s.kind))
          .map(({ id, heading }) => ({ id, heading }))
      : [];

  const outlineHeadings = lesson.sections
    .filter((s) => shouldRenderPathwayLessonSection(s.kind))
    .map((s) => s.heading?.trim())
    .filter(Boolean) as string[];

  const bullets = buildQuickReviewBullets(previewLesson).slice(0, 8);
  const hubBase = buildExamPathwayPath(pathway);
  const lessonsIndex = marketingPathwayLessonsIndexPath(pathway);
  const lessonDetail = marketingPathwayLessonDetailPath(pathway, lesson.slug);
  const topicCluster =
    lesson.topicSlug?.trim() ? marketingPathwayLessonTopicClusterPath(pathway, lesson.topicSlug) : lessonsIndex;
  const questionsHref = `${hubBase}/questions?topic=${encodeURIComponent(lesson.topic?.trim() || lesson.title)}`;
  const catHref = `${hubBase}/cat`;
  const flashcardsHub = "/flashcards";

  const pageLabel = `${lesson.topic || lesson.title} — study hub`;
  const { crumbs, schemaItems } = pathwayProgrammaticStudySeoBreadcrumbs(pathway, pageLabel, lesson.slug);
  const canonical = absoluteUrl(canonicalPath);
  const metaTitle = `${lesson.topic || lesson.title} — study & practice · ${pathway.displayName} | NurseNest`;
  const metaDesc =
    introPlainText.length > 158 ? `${introPlainText.slice(0, 155).trim()}…` : introPlainText;

  const freeQuestionCap = 3;
  const shownQuestions = previewQuestions.slice(0, Math.min(5, previewQuestions.length));

  return (
    <article className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
      <WebPageJsonLd name={metaTitle} description={metaDesc} url={canonical} />
      <BreadcrumbBar crumbs={crumbs} schemaItems={schemaItems} />
      <header className="mt-6 border-b border-[var(--semantic-border-soft)] pb-6">
        <p className="text-xs font-semibold uppercase tracking-wide text-[var(--semantic-text-muted)]">
          {pathway.displayName}
        </p>
        <h1 className="mt-2 text-3xl font-semibold text-[var(--theme-heading-text)] [overflow-wrap:anywhere]">
          {lesson.topic || lesson.title}: study guide, bullets & pathway-scoped practice
        </h1>
        <p className="mt-4 text-sm leading-relaxed text-[var(--semantic-text-secondary)] [overflow-wrap:anywhere]">
          {introPlainText}
        </p>
        <p className="mt-2 text-xs text-[var(--semantic-text-muted)]">
          Pathway question bank overlap for this topic:{" "}
          <span className="font-medium tabular-nums text-[var(--semantic-text-primary)]">{questionCount}</span>{" "}
          published items (same marketing gates as the in-app bank).
        </p>
      </header>

      {outlineHeadings.length > 1 ? (
        <section className="mt-8" aria-labelledby="nn-prog-study-outline">
          <h2 id="nn-prog-study-outline" className="text-lg font-semibold text-[var(--theme-heading-text)]">
            Lesson outline
          </h2>
          <p className="mt-2 text-sm text-[var(--semantic-text-secondary)]">
            Full structured sections unlock with NurseNest Pro; preview below shows the first teaching block.
          </p>
          <ol className="mt-3 list-decimal space-y-1 pl-5 text-sm text-[var(--semantic-text-primary)]">
            {outlineHeadings.map((h) => (
              <li key={h} className="[overflow-wrap:anywhere]">
                {h}
              </li>
            ))}
          </ol>
        </section>
      ) : null}

      <section className="mt-10 space-y-6" aria-labelledby="nn-prog-study-lesson">
        <h2 id="nn-prog-study-lesson" className="text-lg font-semibold text-[var(--theme-heading-text)]">
          Structured lesson preview
        </h2>
        {visibleForRender.map((section) => (
          <LessonSectionCard
            key={section.id}
            id={section.id}
            heading={(section.heading ?? "").trim() || "Section"}
            kind={section.kind}
          >
            <PathwayLessonSectionContent
              text={typeof section.body === "string" ? section.body : ""}
              figures={section.figures}
              examFocus={section.examFocus}
              lessonWikiBasePath={lessonWikiBasePath ?? undefined}
              viewerTier={lessonContentTier as TierCode}
              measurementSystem={lessonMeasurementSystem}
              measurementDual={pathway.countryCode === "CA"}
              sectionKind={section.kind}
              emptyBodyMessage="Content is being prepared for this section."
              figuresVisualLeadMessage="Figures for this section are available in the full lesson."
            />
          </LessonSectionCard>
        ))}
      </section>

      {lockedSections.length > 0 ? (
        <PathwayLessonLockedSectionsPreview
          sections={lockedSections}
          postAuthReturnPath={marketingProgrammaticStudySeoPath(pathway, lesson.slug) ?? undefined}
        />
      ) : null}

      {bullets.length > 0 ? (
        <section className="mt-10" aria-labelledby="nn-prog-study-bullets">
          <h2 id="nn-prog-study-bullets" className="text-lg font-semibold text-[var(--theme-heading-text)]">
            Quick review bullets
          </h2>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-[var(--semantic-text-secondary)]">
            {bullets.map((b, i) => (
              <li key={`${i}-${b.slice(0, 64)}`} className="[overflow-wrap:anywhere]">
                {b}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <section className="mt-10 space-y-4" aria-labelledby="nn-prog-study-questions">
        <h2 id="nn-prog-study-questions" className="text-lg font-semibold text-[var(--theme-heading-text)]">
          Practice question preview
        </h2>
        <p className="text-sm text-[var(--semantic-text-secondary)]">
          First {Math.min(freeQuestionCap, shownQuestions.length)} stem{shownQuestions.length === 1 ? "" : "s"} are
          free to read on this page. Graded sessions, rationales, and the full bank stay in{" "}
          <Link href={questionsHref} className="font-semibold text-[var(--semantic-brand)] hover:underline">
            pathway practice
          </Link>
          .
        </p>
        <ol className="space-y-6">
          {shownQuestions.map((q, idx) => {
            const opts = parseOptions(q.options);
            const isTeaser = idx >= freeQuestionCap;
            return (
              <li
                key={q.id}
                className={`rounded-xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-4 ${isTeaser ? "opacity-80" : ""}`}
              >
                <p className="text-xs font-semibold text-[var(--semantic-text-muted)]">Question {idx + 1}</p>
                <p className="mt-2 text-sm font-medium text-[var(--theme-heading-text)] [overflow-wrap:anywhere]">
                  {q.stem}
                </p>
                {opts.length > 0 ? (
                  <ul className="mt-3 space-y-2">
                    {opts.map((opt, j) => (
                      <li
                        key={`${q.id}-${j}`}
                        className="rounded-lg border border-[color-mix(in_srgb,var(--semantic-border-soft)_70%,transparent)] bg-[color-mix(in_srgb,var(--semantic-panel-cool)_8%,var(--semantic-surface))] px-3 py-2 text-sm text-[var(--semantic-text-secondary)] [overflow-wrap:anywhere]"
                      >
                        <span className="font-semibold text-[var(--semantic-info)]">{String.fromCharCode(65 + j)}.</span>{" "}
                        {opt}
                      </li>
                    ))}
                  </ul>
                ) : null}
                {isTeaser ? (
                  <p className="mt-3 text-xs text-[var(--semantic-text-muted)]">
                    Full scoring + explanations unlock in practice mode.
                  </p>
                ) : null}
              </li>
            );
          })}
        </ol>
      </section>

      {flashcardPreview ? (
        <section className="mt-10 space-y-3" aria-labelledby="nn-prog-study-flashcards">
          <h2 id="nn-prog-study-flashcards" className="text-lg font-semibold text-[var(--theme-heading-text)]">
            Flashcard preview
          </h2>
          <p className="text-sm text-[var(--semantic-text-secondary)]">
            Deck:{" "}
            <Link
              href={`${flashcardsHub}/${encodeURIComponent(flashcardPreview.deckSlug)}`}
              className="font-semibold text-[var(--semantic-chart-3)] hover:underline [overflow-wrap:anywhere]"
            >
              {flashcardPreview.deckTitle}
            </Link>
          </p>
          <ul className="space-y-3 rounded-xl border border-[var(--semantic-border-soft)] bg-[color-mix(in_srgb,var(--semantic-panel-warm)_10%,var(--semantic-surface))] p-4">
            {flashcardPreview.cards.map((c, i) => (
              <li key={i} className="text-sm [overflow-wrap:anywhere]">
                <span className="font-semibold text-[var(--semantic-warning)]">Front:</span> {c.front}
                <br />
                <span className="font-semibold text-[var(--semantic-success)]">Back:</span> {c.back}
              </li>
            ))}
          </ul>
          <Link
            href={flashcardsHub}
            className="inline-flex text-sm font-semibold text-[var(--semantic-chart-3)] hover:underline"
          >
            Unlock full flashcard library →
          </Link>
        </section>
      ) : null}

      <section
        className="mt-10 space-y-3 rounded-xl border border-[var(--semantic-border-soft)] bg-[color-mix(in_srgb,var(--semantic-panel-positive)_10%,var(--semantic-surface))] p-5"
        aria-labelledby="nn-prog-study-cta"
      >
        <h2 id="nn-prog-study-cta" className="text-base font-semibold text-[var(--theme-heading-text)]">
          Go deeper on NurseNest
        </h2>
        <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
          <Link
            href={questionsHref}
            className="inline-flex min-h-10 items-center justify-center rounded-full bg-role-cta px-5 py-2 text-sm font-semibold text-role-cta-foreground shadow-[0_2px_8px_var(--role-cta-shadow)]"
          >
            Start full practice
          </Link>
          <Link
            href={flashcardsHub}
            className="inline-flex min-h-10 items-center justify-center rounded-full border border-[color-mix(in_srgb,var(--semantic-border-soft)_80%,var(--semantic-brand))] bg-[var(--semantic-surface)] px-5 py-2 text-sm font-semibold text-[var(--theme-heading-text)]"
          >
            Unlock full flashcards
          </Link>
          <Link
            href={catHref}
            className="inline-flex min-h-10 items-center justify-center rounded-full border border-[color-mix(in_srgb,var(--semantic-border-soft)_80%,var(--semantic-info))] bg-[var(--semantic-surface)] px-5 py-2 text-sm font-semibold text-[var(--semantic-info)]"
          >
            Take adaptive test (CAT)
          </Link>
        </div>
        <ul className="mt-4 space-y-2 text-sm text-[var(--semantic-text-secondary)]">
          {lessonDetail ? (
            <li>
              <Link href={lessonDetail} className="font-medium text-[var(--semantic-brand)] hover:underline">
                Open the full lesson page
              </Link>{" "}
              for the canonical teaching layout.
            </li>
          ) : null}
          <li>
            <Link href={topicCluster} className="font-medium text-[var(--semantic-brand)] hover:underline">
              Browse related lessons by topic
            </Link>
          </li>
          <li>
            <Link href={lessonsIndex} className="font-medium text-[var(--semantic-brand)] hover:underline">
              Lessons hub
            </Link>{" "}
            for this exam pathway.
          </li>
        </ul>
      </section>
    </article>
  );
}
