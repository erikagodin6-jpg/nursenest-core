import Link from "next/link";
import dynamic from "next/dynamic";
import type { ExamPathwayDefinition } from "@/lib/exam-pathways/types";
import { PathwayHubSupplementaryDisclosure } from "@/components/pathway-lessons/pathway-hub-supplementary-disclosure";
import { PathwayTopicClusterGroupedNav } from "@/components/pathway-lessons/pathway-topic-cluster-grouped-nav";

const FnpLessonExplorer = dynamic(
  () => import("@/components/pathway-lessons/fnp-lesson-explorer").then((m) => m.FnpLessonExplorer),
  {
    loading: () => (
      <div
        className="min-h-[220px] rounded-2xl border border-[var(--border-subtle)] bg-gradient-to-b from-[var(--nn-presentation-wash)] to-[var(--theme-muted-surface)]/50 p-6 shadow-[var(--shadow-card)]"
        aria-busy="true"
        aria-label="Loading FNP lesson explorer"
      >
        <p className="nn-marketing-label nn-marketing-label--accent">NP lesson library</p>
        <p className="mt-2 text-sm font-medium text-[var(--theme-heading-text)]">Loading domain and lifespan explorer…</p>
        <p className="mt-2 max-w-md text-sm text-[var(--theme-muted-text)]">
          One moment while we prepare your interactive lesson map—grouped by clinical domain and population.
        </p>
        <div className="mt-6 flex gap-2">
          <span className="h-9 w-24 animate-pulse rounded-full bg-[var(--theme-muted-surface)]" />
          <span className="h-9 w-28 animate-pulse rounded-full bg-[var(--theme-muted-surface)]" />
          <span className="h-9 w-20 animate-pulse rounded-full bg-[var(--theme-muted-surface)]" />
        </div>
      </div>
    ),
  },
);
import { buildExamPathwayPath } from "@/lib/exam-pathways/build-exam-pathway-path";
import {
  buildFnpExplorerPayload,
  fnpExplorerCounts,
  fnpLessonClinicalPreview,
  FNP_DOMAIN_ORDER,
  FNP_LIFESPAN_ORDER,
  FNP_NP_COMMON_MISTAKES,
} from "@/lib/lessons/fnp-us-lesson-enrichment";
import {
  pathwayLessonHasRenderableHubSlug,
  pathwayLessonMarketingDetailHref,
  type PathwayLessonRecord,
} from "@/lib/lessons/pathway-lesson-types";
import type { TopicCluster } from "@/lib/lessons/pathway-lesson-loader";
import type { PathwayLessonProgressStatus } from "@/lib/lessons/pathway-lesson-progress";
import { pathwayHubAppFlashcardsHref, pathwayHubAppQuestionsHref } from "@/lib/marketing/pathway-hub-app-questions-href";

type Props = {
  pathway: ExamPathwayDefinition;
  lessons: PathwayLessonRecord[];
  lessonsBasePath: string;
  topicClusters: TopicCluster[];
  progressMap?: Record<string, PathwayLessonProgressStatus>;
};

const HASH_BY_LIFESPAN: Record<string, string> = {
  prenatal_womens: "#fnp-prenatal",
  pediatric: "#fnp-pediatric",
  adolescent: "#fnp-adolescent",
  adult: "#fnp-adult",
  geriatric: "#fnp-geriatric",
  lifespan_mixed: "#fnp-lifespan",
};

export function FnpLessonsHub({ pathway, lessons, lessonsBasePath, topicClusters, progressMap = {} }: Props) {
  const safeLessons = lessons.filter(pathwayLessonHasRenderableHubSlug);
  const explorerPayload = buildFnpExplorerPayload(safeLessons);
  const { countsLife, countsDom } = fnpExplorerCounts(explorerPayload);
  const featured = safeLessons.length > 0 ? [...safeLessons].sort((a, b) => a.slug.localeCompare(b.slug))[0] : null;
  const featuredPreview = featured ? fnpLessonClinicalPreview(featured) : null;
  const questionsHub = buildExamPathwayPath(pathway, "questions");
  const examHub = buildExamPathwayPath(pathway);
  const catHub = buildExamPathwayPath(pathway, "cat");
  const boardFraming = pathway.boardLabel ?? pathway.shortName;

  return (
    <div className="nn-np-hub-root space-y-14">
      {/* 1: How to use */}
      <section className="nn-study-card p-5 sm:p-6" aria-labelledby="how-use-fnp">
        <h2 id="how-use-fnp" className="nn-marketing-h3">
          How to use these lessons for {boardFraming}
        </h2>
        <ol className="nn-marketing-body-sm mt-4 list-none space-y-3 pl-0 text-[var(--theme-muted-text)]">
          <li>
            <span className="font-semibold text-[var(--theme-heading-text)]">1. Review the clinical concept.</span> Extract the decision rule
            (what changes risk, what data you must not skip). At the NP level this is <em>provider</em> judgment, not task lists.
          </li>
          <li>
            <span className="font-semibold text-[var(--theme-heading-text)]">2. Apply it to a patient scenario.</span> Read for age, comorbidities,
            pregnancy status, and medications before you touch an option.
          </li>
          <li>
            <span className="font-semibold text-[var(--theme-heading-text)]">3. Interpret findings.</span> Labs, imaging, and exam elements are
            there to support or refute differentials. Name what each finding does to pretest probability.
          </li>
          <li>
            <span className="font-semibold text-[var(--theme-heading-text)]">4. Choose the working diagnosis.</span> Commit only when criteria
            fit; leave the door open when red flags demand referral or escalation.
          </li>
          <li>
            <span className="font-semibold text-[var(--theme-heading-text)]">5. Determine management.</span> Therapy, counseling, follow-up
            interval, and safety-netting should match guideline intensity and the patient&apos;s context.
          </li>
        </ol>
      </section>

      {/* Trust anchors */}
      <section className="nn-study-callout p-5 sm:p-6">
        <h2 className="nn-marketing-h3">
          Built for {pathway.shortName} certification, not generic nursing review
        </h2>
        <ul className="nn-marketing-body-sm mt-3 list-disc space-y-2 pl-5 text-[var(--theme-muted-text)]">
          <li>
            Structured around <strong className="text-[var(--theme-heading-text)]">{boardFraming}</strong> expectations:
            assessment → diagnosis → plan → evaluation across outpatient primary care settings.
          </li>
          <li>
            <strong className="text-[var(--theme-heading-text)]">Full lifespan</strong>: from prenatal/women&apos;s health through geriatrics. How
            items embed age in the stem, not just the topic label.
          </li>
          <li>
            <strong className="text-[var(--theme-heading-text)]">Clinical decision-making</strong>, not memorization: differentials, interpretation,
            and management trade-offs, not recognition of the longest answer.
          </li>
        </ul>
      </section>

      <PathwayTopicClusterGroupedNav
        lessonsBasePath={lessonsBasePath}
        topicClusters={topicClusters}
        pathwayShortName={pathway.shortName}
      />

      {/* Lifespan quick nav + counts */}
      <nav aria-label={`${pathway.shortName} lessons by population`} className="nn-study-card nn-study-card--wash p-4">
        <p className="nn-marketing-label">Jump to population lane</p>
        <p className="nn-marketing-caption mt-1">
          Counts reflect lessons on this page. Use the domain chips below for assessment vs management.
        </p>
        <ul className="mt-3 flex flex-wrap gap-2">
          {FNP_LIFESPAN_ORDER.map((row) => (
            <li key={row.id}>
              <a
                href={`${HASH_BY_LIFESPAN[row.id] ?? "#fnp-explorer"}`}
                className="nn-chip nn-marketing-body-sm px-3 py-1.5 font-medium hover:border-[color-mix(in_srgb,var(--theme-primary)_30%,var(--border-subtle))]"
              >
                {row.shortLabel} ({countsLife[row.id]})
              </a>
            </li>
          ))}
        </ul>
      </nav>

      {/* Domain counts */}
      <section aria-label="Clinical domain coverage" className="nn-study-card p-4">
        <h2 className="nn-marketing-h4">Domain coverage (secondary grouping)</h2>
        <p className="nn-marketing-caption mt-1">
          Pair a population filter with assessment, diagnosis, management, or evaluation. Items on the exam cross these lanes.
        </p>
        <ul className="nn-marketing-body-sm mt-3 flex flex-wrap gap-2">
          {FNP_DOMAIN_ORDER.map((row) => (
            <li key={row.id} className="nn-accent-pill rounded-full px-3 py-1.5 text-sm">
              {row.label}: <span className="font-semibold text-[var(--theme-heading-text)]">{countsDom[row.id]}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* Featured clinical case */}
      {featured && featured.slug?.trim() && featuredPreview && (
        <section className="nn-study-card bg-gradient-to-b from-[var(--bg-card)] to-[var(--nn-presentation-wash)] p-5 sm:p-7">
          <p className="nn-marketing-caption font-semibold uppercase tracking-wide text-[var(--theme-primary)]">
            Featured clinical case
          </p>
          <h3 className="nn-marketing-h2 mt-2">{featured.title}</h3>
          <div className="mt-4 grid gap-3 border-t border-border/80 pt-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <p className="nn-marketing-caption font-semibold uppercase">What this lesson prepares you to do clinically</p>
              <p className="nn-marketing-body-sm mt-1 text-[var(--theme-body-text)]">{featuredPreview.providerTasks}</p>
            </div>
            <div>
              <p className="nn-marketing-caption font-semibold uppercase">Likely item styles</p>
              <p className="nn-marketing-body-sm mt-1 text-[var(--theme-muted-text)]">{featuredPreview.likelyQuestionTypes}</p>
            </div>
            <div>
              <p className="nn-marketing-caption font-semibold uppercase">Board rationale</p>
              <p className="nn-marketing-body-sm mt-1 text-[var(--theme-muted-text)]">{featuredPreview.whyBoards}</p>
            </div>
            <div className="nn-surface-inset sm:col-span-2 rounded-xl p-3">
              <p className="nn-marketing-caption font-semibold">Mini patient scenario</p>
              <p className="nn-marketing-body-sm mt-1 text-[var(--theme-body-text)]">{featuredPreview.miniScenario}</p>
            </div>
            <div className="nn-surface-inset sm:col-span-2 rounded-xl p-3">
              <p className="nn-marketing-caption font-semibold">Sample clinical decision</p>
              <p className="nn-marketing-body-sm mt-1 text-[var(--theme-body-text)]">{featuredPreview.sampleDecision}</p>
            </div>
          </div>
          <div className="mt-5 flex flex-wrap gap-2">
            <Link
              href={pathwayLessonMarketingDetailHref(lessonsBasePath, featured.slug)!}
              data-nn-qa-primary-lesson="true"
              className="inline-flex rounded-full nn-btn-primary px-4 py-2 text-sm font-semibold shadow-none"
            >
              Open lesson
            </Link>
            <Link
              href={pathwayHubAppQuestionsHref(pathway.id, featured.topic)}
              className="inline-flex rounded-full nn-btn-secondary bg-card px-4 py-2 text-sm font-semibold"
            >
              Try a clinical case now
            </Link>
            <Link
              href={pathwayHubAppQuestionsHref(pathway.id)}
              className="inline-flex rounded-full nn-btn-secondary px-4 py-2 text-sm font-semibold"
            >
              Test your diagnostic reasoning
            </Link>
          </div>
        </section>
      )}

      {/* Filterable lesson list */}
      <section aria-labelledby="fnp-lesson-library">
        <h2 id="fnp-lesson-library" className="nn-marketing-h3">
          Lesson library
        </h2>
        <p className="nn-marketing-body-sm mt-2 text-[var(--theme-muted-text)]">
          Use filters to mirror board-style layering: <strong className="text-[var(--theme-heading-text)]">who</strong> the patient is and{" "}
          <strong className="text-[var(--theme-heading-text)]">what task</strong> the stem is testing.
        </p>
        <div className="mt-6">
          <FnpLessonExplorer
            pathway={pathway}
            lessonsBasePath={lessonsBasePath}
            explorerLessons={explorerPayload}
            excludeSlug={safeLessons.length > 1 ? featured?.slug ?? null : null}
            progressMap={progressMap}
          />
        </div>
      </section>

      <PathwayHubSupplementaryDisclosure
        summary="Differential thinking, workflows, sample cases & shortcuts"
        hint="Expand for board-style reasoning and study loops after the lesson library."
        className="mt-2"
      >
      {/* Differential diagnosis emphasis */}
      <section className="nn-study-card p-5 sm:p-6" aria-labelledby="fnp-diff">
        <h2 id="fnp-diff" className="nn-marketing-h3">
          How {pathway.shortName} board items test differential thinking
        </h2>
        <p className="mt-2 text-sm text-[var(--theme-muted-text)]">
          Boards rarely ask for a textbook definition. They present a symptom and force you to discriminate among plausible
          explanations with the <em>same</em> chief complaint.
        </p>
        <div className="nn-study-card--wash mt-4 rounded-xl border border-border/80 p-4">
          <p className="nn-marketing-body-sm font-semibold text-[var(--theme-heading-text)]">
            Symptom (illustrative): acute chest pain at rest
          </p>
          <ul className="nn-marketing-body-sm mt-2 space-y-1.5 text-[var(--theme-muted-text)]">
            <li>
              <strong className="text-[var(--theme-heading-text)]">Must rule out first:</strong> ACS, pulmonary embolism, aortic dissection,
              pneumothorax, depending on risk factors and associated features in the stem.
            </li>
            <li>
              <strong className="text-[var(--theme-heading-text)]">Also in play:</strong> pericarditis, musculoskeletal pain, GERD/esophageal
              spasm, anxiety/panic. After dangerous causes are addressed or convincingly lowered in probability.
            </li>
            <li>
              <strong className="text-[var(--theme-heading-text)]">Reasoning pathway:</strong> stabilize if unstable → targeted history/exam →
              ECG and initial labs/imaging as indicated → choose the next diagnostic or therapeutic step that matches the
              leading hypothesis <em>and</em> remaining risk.
            </li>
          </ul>
        </div>
      </section>

      {/* Clinical workflow */}
      <section className="nn-study-card nn-study-card--wash p-5 sm:p-6" aria-labelledby="fnp-workflow">
        <h2 id="fnp-workflow" className="nn-marketing-h3">
          Clinical workflow: symptom → assessment → diagnosis → management → follow-up
        </h2>
        <p className="nn-marketing-body-sm mt-2 text-[var(--theme-muted-text)]">
          Lessons are organized to reinforce this sequence. Skipping upstream steps is how well-prepared candidates miss items.
        </p>
        <ol className="nn-marketing-body-sm mt-4 list-none space-y-2 pl-0 text-[var(--theme-muted-text)]">
          <li>
            <strong className="text-[var(--theme-heading-text)]">Symptom / concern</strong>: what brought the patient in, and what must be ruled
            out urgently?
          </li>
          <li>
            <strong className="text-[var(--theme-heading-text)]">Assessment</strong>: history, exam, targeted tests; interpret in context of age
            and comorbidity.
          </li>
          <li>
            <strong className="text-[var(--theme-heading-text)]">Diagnosis</strong>: working diagnosis with differentials ranked by probability
            and harm if wrong.
          </li>
          <li>
            <strong className="text-[var(--theme-heading-text)]">Management</strong>: pharmacologic and nonpharmacologic plan, referrals,
            patient education.
          </li>
          <li>
            <strong className="text-[var(--theme-heading-text)]">Evaluation</strong>: when to reassess, what defines response, what triggers
            escalation.
          </li>
        </ol>
      </section>

      {/* Lesson → practice → readiness */}
      <section className="nn-study-card p-5 sm:p-6" aria-labelledby="fnp-flow">
        <h2 id="fnp-flow" className="nn-marketing-h3">
          Lesson → case questions → performance by domain → exam simulation → readiness
        </h2>
        <p className="nn-marketing-body-sm mt-2 text-[var(--theme-muted-text)]">
          Lessons alone do not equal certification readiness. They anchor the loop below with case-based items, analytics, and
          timed simulations.
        </p>
        <div
          className="mt-5 flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-stretch sm:gap-0"
          aria-label="Preparation progression"
        >
          {[
            { step: "1", label: "Lesson", detail: "Decision rules & pitfalls" },
            { step: "2", label: "Cases", detail: "Vignettes + rationales" },
            { step: "3", label: "Domains", detail: "Accuracy by lane & age" },
            { step: "4", label: "Simulation", detail: "Timed / adaptive mocks" },
            { step: "5", label: "Readiness", detail: "Predict errors pre-click" },
          ].map((item, i, arr) => (
            <div key={item.label} className="flex min-w-0 flex-1 items-center gap-2 sm:flex-col sm:gap-1">
              <div className="flex w-full min-w-0 flex-col rounded-xl border border-border/80 bg-card px-3 py-2.5 text-center sm:py-3">
                <span className="nn-marketing-caption font-bold uppercase tracking-wide text-[var(--theme-primary)]">
                  {item.step}
                </span>
                <span className="text-sm font-semibold text-[var(--theme-heading-text)]">{item.label}</span>
                <span className="mt-0.5 text-xs text-muted">{item.detail}</span>
              </div>
              {i < arr.length - 1 && (
                <span className="hidden shrink-0 px-0.5 text-muted sm:block" aria-hidden>
                  →
                </span>
              )}
            </div>
          ))}
        </div>
        <div className="mt-4 flex flex-wrap gap-2 text-sm">
          <Link href={questionsHub} className="font-semibold text-primary">
            Case-based question hub
          </Link>
          <span aria-hidden>·</span>
          <Link href={pathwayHubAppQuestionsHref(pathway.id)} className="font-semibold text-primary">
            App question bank
          </Link>
          <span aria-hidden>·</span>
          <Link href={catHub} className="font-semibold text-primary">
            Exam simulations · this pathway
          </Link>
          <span aria-hidden>·</span>
          <Link href={pathwayHubAppFlashcardsHref(pathway.id)} className="font-semibold text-primary">
            Flashcards
          </Link>
        </div>
      </section>

      {/* Advanced reasoning */}
      <section className="nn-study-card p-5 sm:p-6" aria-labelledby="fnp-advanced">
        <h2 id="fnp-advanced" className="nn-marketing-h3">
          What advanced {pathway.shortName} primary care reasoning looks like
        </h2>
        <p className="nn-marketing-body-sm mt-2 text-[var(--theme-muted-text)]">
          Illustrative outpatient vignette: focus on sequence and elimination, not memorizing this exact answer.
        </p>
        <div className="nn-study-card--wash mt-4 rounded-xl border border-border/80 p-4">
          <p className="nn-marketing-body-sm font-medium text-[var(--theme-body-text)]">
            A 58-year-old with hypertension and diabetes presents with 2 days of progressive dyspnea on exertion and
            bilateral ankle edema. BP 168/94, HR 102, RR 22, SpO₂ 93% on room air. Crackles at lung bases. JVP elevated.
          </p>
          <p className="nn-marketing-body-sm mt-3 font-medium text-[var(--theme-heading-text)]">
            Which is the best next step in management?
          </p>
          <ul className="nn-marketing-body-sm mt-2 space-y-1 text-[var(--theme-muted-text)]">
            <li>A. Order BNP and echocardiogram before treating</li>
            <li>B. Start IV loop diuretic with monitoring and reassessment</li>
            <li>C. Increase long-acting antihypertensive to goal immediately</li>
            <li>D. Urgent referral to cardiology before any therapy</li>
          </ul>
          <p className="nn-marketing-body-sm mt-3 text-[var(--theme-body-text)]">
            <strong>Key findings:</strong> Volume overload + hypoxemia + tachycardia suggest acute decompensated heart failure
            until proven otherwise. Dangerous instability trumps completing all diagnostics first.
          </p>
          <p className="nn-marketing-body-sm mt-2 text-[var(--theme-muted-text)]">
            <strong className="text-[var(--theme-heading-text)]">Rule in/out:</strong> STEMI is less supported without ischemic symptoms, but you
            still monitor ECG/troponins per protocol. The stem rewards treating the failure state causing respiratory compromise.
          </p>
          <p className="nn-marketing-body-sm mt-2 text-[var(--theme-muted-text)]">
            <strong className="text-[var(--theme-heading-text)]">Best management:</strong> Initiate diuresis with monitoring (B is most aligned).
            Then refine diagnosis with imaging/labs as the patient stabilizes.
          </p>
          <p className="nn-marketing-body-sm mt-2 text-[var(--theme-muted-text)]">
            <strong className="text-[var(--theme-heading-text)]">Clinical takeaway:</strong> When the presentation is consistent with acute
            decompensation, delaying therapy solely for confirmatory testing can fail the patient and the item.
          </p>
        </div>
      </section>

      {/* Common mistakes */}
      <section aria-labelledby="fnp-mistakes">
        <h2 id="fnp-mistakes" className="nn-marketing-h3">
          Common mistakes NP candidates make
        </h2>
        <div className="mt-4 space-y-6">
          {FNP_NP_COMMON_MISTAKES.map((block) => (
            <div key={block.heading}>
              <p className="nn-marketing-label">{block.heading}</p>
              <ul className="nn-marketing-body-sm mt-2 list-disc space-y-2 pl-5 text-[var(--theme-muted-text)]">
                {block.items.map((item, idx) => (
                  <li key={`${block.heading}-${idx}`}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* CTAs */}
      <section className="nn-study-callout p-5 sm:p-6">
        <h2 className="nn-marketing-h3">Low-friction entry</h2>
        <p className="nn-marketing-body-sm mt-2 text-[var(--theme-muted-text)]">
          Start with a short case block; deeper sessions may prompt sign-in depending on product rules, not a forced login on
          the first click.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <Link
            href={pathwayHubAppQuestionsHref(pathway.id)}
            className="inline-flex rounded-full nn-btn-primary px-4 py-2 text-sm font-semibold shadow-none"
          >
            Try a clinical case now
          </Link>
          {featured && (
            <Link
              href={pathwayHubAppQuestionsHref(pathway.id, featured.topic)}
              className="inline-flex rounded-full nn-btn-secondary bg-card px-4 py-2 text-sm font-semibold"
            >
              Test your diagnostic reasoning (this topic)
            </Link>
          )}
          <Link href={catHub} className="inline-flex rounded-full nn-btn-secondary bg-card px-4 py-2 text-sm font-semibold">
            See how you perform across age groups
          </Link>
          <Link
            href={pathwayHubAppQuestionsHref(pathway.id)}
            className="inline-flex rounded-full nn-btn-secondary bg-card px-4 py-2 text-sm font-semibold"
          >
            Open app question bank
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
