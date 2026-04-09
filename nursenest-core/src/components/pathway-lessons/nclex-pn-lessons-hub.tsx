import Link from "next/link";
import type { ExamPathwayDefinition } from "@/lib/exam-pathways/types";
import { PathwayHubSupplementaryDisclosure } from "@/components/pathway-lessons/pathway-hub-supplementary-disclosure";
import { PathwayNclexScalableLessonSection } from "@/components/pathway-lessons/pathway-nclex-scalable-lesson-list";
import { PathwayTopicClusterGroupedNav } from "@/components/pathway-lessons/pathway-topic-cluster-grouped-nav";
import {
  pathwayLessonHasRenderableHubSlug,
  pathwayLessonMarketingDetailHref,
  type PathwayLessonRecord,
} from "@/lib/lessons/pathway-lesson-types";
import {
  buildNclexPnUsLessonSections,
  nclexPnLessonExamPreview,
  NCLEX_PN_US_COMMON_MISTAKES,
} from "@/lib/lessons/nclex-pn-us-lesson-enrichment";
import { buildExamPathwayPath } from "@/lib/exam-pathways/exam-product-registry";
import type { TopicCluster } from "@/lib/lessons/pathway-lesson-loader";
import type { PathwayLessonProgressStatus } from "@/lib/lessons/pathway-lesson-progress";
import { PathwayLessonProgressBadge } from "@/components/lessons/pathway-lesson-progress-badge";

type Props = {
  pathway: ExamPathwayDefinition;
  lessons: PathwayLessonRecord[];
  lessonsBasePath: string;
  topicClusters: TopicCluster[];
  progressMap?: Record<string, PathwayLessonProgressStatus>;
};

function appQuestionsHref(pathwayId: string, topic?: string): string {
  const q = new URLSearchParams();
  q.set("pathwayId", pathwayId);
  if (topic) q.set("topic", topic);
  return `/app/questions?${q.toString()}`;
}

export function NclexPnLessonsHub({ pathway, lessons, lessonsBasePath, topicClusters, progressMap = {} }: Props) {
  const safeLessons = lessons.filter(pathwayLessonHasRenderableHubSlug);
  const sections = buildNclexPnUsLessonSections(safeLessons);
  const navLinks = sections.filter((s) => s.count > 0);
  const featured = safeLessons.length > 0 ? [...safeLessons].sort((a, b) => a.slug.localeCompare(b.slug))[0] : null;
  const featuredPreview = featured ? nclexPnLessonExamPreview(featured) : null;
  const questionsHub = buildExamPathwayPath(pathway, "questions");
  const examHub = buildExamPathwayPath(pathway);

  return (
    <div className="space-y-14">
      <section className="nn-study-card p-5 sm:p-6" aria-labelledby="how-use-nclex-pn">
        <h2 id="how-use-nclex-pn" className="nn-marketing-h3">
          How to use these lessons for NCLEX-PN
        </h2>
        <ol className="nn-marketing-body-sm mt-4 list-none space-y-3 pl-0 text-[var(--theme-muted-text)]">
          <li>
            <span className="font-semibold text-[var(--theme-heading-text)]">1. Learn the concept.</span> Focus on what the LVN/LPN can do,
            must report, and must not do. NCLEX-PN tests scope as often as content.
          </li>
          <li>
            <span className="font-semibold text-[var(--theme-heading-text)]">2. Apply with questions.</span> Use this pathway in the bank so
            stems stay PN-scoped (delegation, basic care, ordered interventions), not RN-level analysis items.
          </li>
          <li>
            <span className="font-semibold text-[var(--theme-heading-text)]">3. Review rationale deeply.</span> For each wrong option, ask:
            unsafe for the patient, out of scope, or right idea but wrong sequence?
          </li>
          <li>
            <span className="font-semibold text-[var(--theme-heading-text)]">4. Revisit weak areas.</span> Return to the matching Client Needs
            section here before stacking new topics; CAT difficulty only helps after gaps shrink.
          </li>
        </ol>
      </section>

      <section className="nn-study-callout p-5 sm:p-6">
        <h2 className="nn-marketing-h3">NCLEX-PN: explicit, not generic prep</h2>
        <ul className="nn-marketing-body-sm mt-3 list-disc space-y-2 pl-5 text-[var(--theme-muted-text)]">
          <li>Aligned with the NCLEX-PN test plan Client Needs framework used to group lessons below.</li>
          <li>Built around practical/vocational scope: delegation, safety, and ordered care, not RN leadership disguised as PN.</li>
          <li>Supports clinical judgment and NGN-style stems: multiple “reasonable” options with one safest, scope-correct choice.</li>
        </ul>
      </section>

      <PathwayTopicClusterGroupedNav
        lessonsBasePath={lessonsBasePath}
        topicClusters={topicClusters}
        pathwayShortName={pathway.shortName}
      />

      {navLinks.length > 0 && (
        <nav aria-label="NCLEX-PN lesson categories" className="nn-study-card nn-study-card--wash p-4">
          <p className="nn-marketing-label">Jump to Client Needs</p>
          <p className="nn-marketing-caption mt-1">Counts reflect lessons on this page (paginated hub).</p>
          <ul className="mt-3 flex flex-wrap gap-2">
            {navLinks.map((s) => (
              <li key={s.anchor}>
                <a
                  href={`#${s.anchor}`}
                  className="nn-chip nn-marketing-body-sm px-3 py-1.5 font-medium hover:border-[color-mix(in_srgb,var(--theme-primary)_30%,var(--border-subtle))]"
                >
                  {s.title === "Physiological Integrity" ? `${s.subtitle}` : s.title} ({s.count})
                </a>
              </li>
            ))}
          </ul>
        </nav>
      )}

      {featured && featured.slug?.trim() && featuredPreview && (
        <section className="nn-study-card bg-gradient-to-b from-[var(--bg-card)] to-[var(--nn-presentation-wash)] p-5 sm:p-7">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <p className="nn-marketing-caption font-semibold uppercase tracking-wide text-[var(--theme-primary)]">
              Featured lesson
            </p>
            {Object.keys(progressMap).length > 0 ? (
              <PathwayLessonProgressBadge status={progressMap[featured.slug] ?? "not_started"} />
            ) : null}
          </div>
          <h3 className="nn-marketing-h2 mt-2">{featured.title}</h3>
          <div className="mt-4 grid gap-3 border-t border-border/80 pt-4 sm:grid-cols-2">
            <div>
              <p className="nn-marketing-caption font-semibold uppercase">Clinical scenario type</p>
              <p className="nn-marketing-body-sm mt-1 text-[var(--theme-body-text)]">{featuredPreview.scenarioType}</p>
            </div>
            <div>
              <p className="nn-marketing-caption font-semibold uppercase">Likely item types</p>
              <p className="nn-marketing-body-sm mt-1 text-[var(--theme-body-text)]">{featuredPreview.examQuestionTypes}</p>
            </div>
            <div className="sm:col-span-2">
              <p className="nn-marketing-caption font-semibold uppercase">What this lesson prepares you for (NCLEX-PN)</p>
              <p className="nn-marketing-body-sm mt-1 text-[var(--theme-muted-text)]">{featuredPreview.whyOnExam}</p>
            </div>
            <div className="nn-surface-inset sm:col-span-2 rounded-xl p-3">
              <p className="nn-marketing-caption font-semibold">Clinical scenario preview</p>
              <p className="nn-marketing-body-sm mt-1 text-[var(--theme-body-text)]">{featuredPreview.miniScenario}</p>
            </div>
            <div className="nn-surface-inset sm:col-span-2 rounded-xl p-3">
              <p className="nn-marketing-caption font-semibold">Reasoning excerpt</p>
              <p className="nn-marketing-body-sm mt-1 italic text-[var(--theme-muted-text)]">
                &ldquo;{featuredPreview.rationaleSnippet}&rdquo;
              </p>
            </div>
          </div>
          <div className="mt-5 flex flex-wrap gap-2">
            <Link
              href={pathwayLessonMarketingDetailHref(lessonsBasePath, featured.slug)!}
              className="inline-flex rounded-full nn-btn-primary px-4 py-2 text-sm font-semibold shadow-none"
            >
              Open lesson
            </Link>
            <Link
              href={appQuestionsHref(pathway.id, featured.topic)}
              className="inline-flex rounded-full nn-btn-secondary bg-card px-4 py-2 text-sm font-semibold"
            >
              Test this topic in 5 questions
            </Link>
            <Link
              href={appQuestionsHref(pathway.id)}
              className="inline-flex rounded-full nn-btn-secondary px-4 py-2 text-sm font-semibold"
            >
              Start quick quiz
            </Link>
          </div>
        </section>
      )}

      {sections.map((section) => (
        <PathwayNclexScalableLessonSection
          key={section.anchor}
          pathwayId={pathway.id}
          lessonsBasePath={lessonsBasePath}
          section={section}
          featuredSlug={featured?.slug}
          variant="pn"
          progressMap={progressMap}
        />
      ))}

      <PathwayHubSupplementaryDisclosure
        summary="Clinical judgment, study loops, sample items & next steps"
        hint="Expand for PN-scope guidance and shortcuts after you browse lessons on this page."
        className="mt-2"
      >
      <section className="nn-study-card p-5 sm:p-6" aria-labelledby="cj-nclex-pn">
        <h2 id="cj-nclex-pn" className="nn-marketing-h3">
          Clinical judgment at PN scope
        </h2>
        <div className="mt-3 space-y-3 text-sm leading-relaxed text-[var(--theme-muted-text)]">
          <p>
            NCLEX-PN measures whether you can apply knowledge to <em>safe decisions</em> in the practical nurse role, not
            whether you can list facts. CAT adjusts difficulty as you go; weak scope boundaries show up fast.
          </p>
          <ul className="list-disc space-y-2 pl-5">
            <li>
              <strong className="text-[var(--theme-heading-text)]">Prioritization:</strong> unstable vs stable, acute change vs routine
              care. Then choose what your license supports.
            </li>
            <li>
              <strong className="text-[var(--theme-heading-text)]">Safety &amp; outcomes:</strong> Does this option reduce harm in the next few
              minutes, or only check a task off?
            </li>
            <li>
              <strong className="text-[var(--theme-heading-text)]">Scope:</strong> When in doubt, select report, clarify orders, or request the
              RN when assessment or judgment exceeds PN practice.
            </li>
          </ul>
        </div>
      </section>

      <section className="nn-study-card nn-study-card--wash p-5 sm:p-6" aria-labelledby="flow-nclex-pn">
        <h2 id="flow-nclex-pn" className="nn-marketing-h3">
          Lesson → practice questions → weak areas → CAT exam
        </h2>
        <ol className="nn-marketing-body-sm mt-4 list-none space-y-2 pl-0 text-[var(--theme-muted-text)]">
          <li>Lesson: pattern recognition for PN-appropriate actions and delegation.</li>
          <li>Practice: commit under time; read every distractor against scope and safety.</li>
          <li>Weak areas: let rationales drive what you re-study. Avoid endless new topics.</li>
          <li>CAT mock: adaptive stops and length mirror the real exam more than untimed blocks alone.</li>
        </ol>
        <div className="mt-3 flex flex-wrap gap-2 text-sm">
          <Link href={questionsHub} className="font-semibold text-primary">
            Question bank hub
          </Link>
          <span aria-hidden>·</span>
          <Link href="/app/questions" className="font-semibold text-primary">
            App question bank
          </Link>
          <span aria-hidden>·</span>
          <Link href="/app/exams" className="font-semibold text-primary">
            Practice exams (CAT)
          </Link>
          <span aria-hidden>·</span>
          <Link href="/app/flashcards" className="font-semibold text-primary">
            Flashcards
          </Link>
        </div>
      </section>

      <section className="nn-study-card p-5 sm:p-6" aria-labelledby="reasoning-nclex-pn">
        <h2 id="reasoning-nclex-pn" className="nn-marketing-h3">
          What strong NCLEX-PN reasoning looks like
        </h2>
        <p className="mt-2 text-sm text-[var(--theme-muted-text)]">
          Illustrative delegation stem: eliminate options that confuse task completion with patient safety or licensed duty.
        </p>
        <div className="nn-study-card--wash mt-4 rounded-xl border border-border/80 p-4">
          <p className="nn-marketing-body-sm font-medium text-[var(--theme-heading-text)]">
            The RN assigns you four patients. Which should you see first?
          </p>
          <ul className="nn-marketing-body-sm mt-2 space-y-1 text-[var(--theme-muted-text)]">
            <li>A. Stable post-op waiting for discharge teaching</li>
            <li>B. New onset chest pressure with diaphoresis and BP drop</li>
            <li>C. Diabetic patient due for scheduled insulin per protocol</li>
            <li>D. UAP asks for help turning a patient on bedrest</li>
          </ul>
          <p className="nn-marketing-body-sm mt-3 text-[var(--theme-body-text)]">
            <strong>Correct logic:</strong> See the patient with acute cardiopulmonary compromise first. Potential
            life-threatening change beats routine timing tasks.
          </p>
          <p className="nn-marketing-body-sm mt-2 text-[var(--theme-muted-text)]">
            <strong className="text-[var(--theme-heading-text)]">Eliminate distractors:</strong> Discharge teaching and routine insulin matter,
            but not before unstable symptoms are addressed or escalated per facility policy. Helping the UAP may be valid only
            after higher-risk needs are covered.
          </p>
          <p className="nn-marketing-body-sm mt-2 text-[var(--theme-muted-text)]">
            <strong className="text-[var(--theme-heading-text)]">Takeaway:</strong> NCLEX-PN prioritization still follows patient outcome
            risk. Then stay inside what you can assess, perform, and report within PN scope.
          </p>
        </div>
      </section>

      <section aria-labelledby="mistakes-nclex-pn">
        <h2 id="mistakes-nclex-pn" className="nn-marketing-h3">
          Common mistakes for LPN/LVN students
        </h2>
        <div className="mt-4 space-y-6">
          {NCLEX_PN_US_COMMON_MISTAKES.map((block) => (
            <div key={block.group}>
              {block.group !== "all" && (
                <p className="text-xs font-semibold uppercase text-muted">
                  {block.group === "safe" ? "Safe & coordinated care" : "Physiological integrity"}
                </p>
              )}
              <ul className="nn-marketing-body-sm mt-2 list-disc space-y-2 pl-5 text-[var(--theme-muted-text)]">
                {block.items.map((item, idx) => (
                  <li key={`${block.group}-${idx}`}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section className="nn-study-callout p-5 sm:p-6">
        <h2 className="nn-marketing-h3">Low-friction next steps</h2>
        <p className="nn-marketing-body-sm mt-2 text-[var(--theme-muted-text)]">
          Open the bank with this pathway; longer sessions may prompt sign-in. Short tries stay accessible when the product
          allows it.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <Link
            href={appQuestionsHref(pathway.id)}
            className="inline-flex rounded-full nn-btn-primary px-4 py-2 text-sm font-semibold shadow-none"
          >
            Start quick quiz (pathway-scoped)
          </Link>
          <Link href="/app/questions" className="inline-flex rounded-full nn-btn-secondary bg-card px-4 py-2 text-sm font-semibold">
            Open app question bank
          </Link>
          <Link href="/app/exams" className="inline-flex rounded-full nn-btn-secondary bg-card px-4 py-2 text-sm font-semibold">
            See your weak areas instantly (after a session)
          </Link>
        </div>
        <p className="nn-marketing-caption mt-3">
          <Link href={examHub} className="font-semibold text-primary">
            {pathway.shortName} hub
          </Link>{" "}
          ·{" "}
          <Link href={questionsHub} className="font-semibold text-primary">
            Questions
          </Link>
        </p>
      </section>
      </PathwayHubSupplementaryDisclosure>
    </div>
  );
}
