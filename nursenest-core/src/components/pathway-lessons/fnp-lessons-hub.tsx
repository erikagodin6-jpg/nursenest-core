import Link from "next/link";
import type { ExamPathwayDefinition } from "@/lib/exam-pathways/types";
import { FnpLessonExplorer } from "@/components/pathway-lessons/fnp-lesson-explorer";
import { FnpLessonsNpBoardCrosslinks } from "@/components/pathway-lessons/fnp-lessons-np-board-crosslinks";
import { buildExamPathwayPath } from "@/lib/exam-pathways/exam-product-registry";
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

type Props = {
  pathway: ExamPathwayDefinition;
  lessons: PathwayLessonRecord[];
  lessonsBasePath: string;
  topicClusters: TopicCluster[];
};

function appQuestionsHref(pathwayId: string, topic?: string): string {
  const q = new URLSearchParams();
  q.set("pathwayId", pathwayId);
  if (topic) q.set("topic", topic);
  return `/app/questions?${q.toString()}`;
}

const HASH_BY_LIFESPAN: Record<string, string> = {
  prenatal_womens: "#fnp-prenatal",
  pediatric: "#fnp-pediatric",
  adolescent: "#fnp-adolescent",
  adult: "#fnp-adult",
  geriatric: "#fnp-geriatric",
  lifespan_mixed: "#fnp-lifespan",
};

export function FnpLessonsHub({ pathway, lessons, lessonsBasePath, topicClusters }: Props) {
  const safeLessons = lessons.filter(pathwayLessonHasRenderableHubSlug);
  const explorerPayload = buildFnpExplorerPayload(safeLessons);
  const { countsLife, countsDom } = fnpExplorerCounts(explorerPayload);
  const featured = safeLessons.length > 0 ? [...safeLessons].sort((a, b) => a.slug.localeCompare(b.slug))[0] : null;
  const featuredPreview = featured ? fnpLessonClinicalPreview(featured) : null;
  const questionsHub = buildExamPathwayPath(pathway, "questions");
  const examHub = buildExamPathwayPath(pathway);

  return (
    <div className="space-y-14">
      {/* 1: How to use */}
      <section className="rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-sm" aria-labelledby="how-use-fnp">
        <h2 id="how-use-fnp" className="text-lg font-bold text-[var(--theme-heading-text)]">
          How to use these lessons for FNP boards
        </h2>
        <ol className="mt-4 space-y-3 text-sm leading-relaxed text-[var(--theme-muted-text)]">
          <li>
            <span className="font-semibold text-foreground">1. Review the clinical concept.</span> Extract the decision rule
            (what changes risk, what data you must not skip). At the NP level this is <em>provider</em> judgment, not task lists.
          </li>
          <li>
            <span className="font-semibold text-foreground">2. Apply it to a patient scenario.</span> Read for age, comorbidities,
            pregnancy status, and medications before you touch an option.
          </li>
          <li>
            <span className="font-semibold text-foreground">3. Interpret findings.</span> Labs, imaging, and exam elements are
            there to support or refute differentials. Name what each finding does to pretest probability.
          </li>
          <li>
            <span className="font-semibold text-foreground">4. Choose the working diagnosis.</span> Commit only when criteria
            fit; leave the door open when red flags demand referral or escalation.
          </li>
          <li>
            <span className="font-semibold text-foreground">5. Determine management.</span> Therapy, counseling, follow-up
            interval, and safety-netting should match guideline intensity and the patient&apos;s context.
          </li>
        </ol>
        <FnpLessonsNpBoardCrosslinks />
      </section>

      {/* Trust anchors */}
      <section className="rounded-2xl border border-primary/20 bg-primary/[0.04] p-5 sm:p-6">
        <h2 className="text-lg font-bold text-[var(--theme-heading-text)]">Built for FNP certification, not generic nursing review</h2>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-[var(--theme-muted-text)]">
          <li>Structured around the <strong className="text-foreground">AANP and ANCC</strong> emphasis on assessment → diagnosis → plan → evaluation across settings.</li>
          <li>
            <strong className="text-foreground">Full lifespan</strong>: from prenatal/women&apos;s health through geriatrics. How
            items embed age in the stem, not just the topic label.
          </li>
          <li>
            <strong className="text-foreground">Clinical decision-making</strong>, not memorization: differentials, interpretation,
            and management trade-offs, not recognition of the longest answer.
          </li>
        </ul>
      </section>

      {topicClusters.length > 0 && (
        <section aria-label="Browse by topic" className="rounded-xl border border-border bg-card p-4">
          <h2 className="text-sm font-bold text-[var(--theme-heading-text)]">Browse by topic cluster</h2>
          <p className="mt-1 text-xs text-muted">Alternate index when you study by organ system or theme.</p>
          <ul className="mt-3 flex flex-wrap gap-2">
            {topicClusters.map((t) => (
              <li key={t.topicSlug}>
                <Link
                  href={`${lessonsBasePath}/topics/${t.topicSlug}`}
                  className="inline-flex rounded-full border border-border bg-[var(--theme-muted-surface)] px-3 py-1.5 text-sm font-medium hover:border-primary/40"
                >
                  {t.label} ({t.count})
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Lifespan quick nav + counts */}
      <nav aria-label="FNP lessons by population" className="rounded-xl border border-border bg-[var(--theme-muted-surface)] p-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted">Jump to population lane</p>
        <p className="mt-1 text-xs text-[var(--theme-muted-text)]">
          Opens the lesson list with that age filter. Use the domain chips below for assessment vs management.
        </p>
        <ul className="mt-3 flex flex-wrap gap-2">
          {FNP_LIFESPAN_ORDER.map((row) => (
            <li key={row.id}>
              <a
                href={`${HASH_BY_LIFESPAN[row.id] ?? "#fnp-explorer"}`}
                className="inline-flex rounded-full border border-border bg-card px-3 py-1.5 text-sm font-medium hover:border-primary/40"
              >
                {row.shortLabel} ({countsLife[row.id]})
              </a>
            </li>
          ))}
        </ul>
      </nav>

      {/* Domain counts */}
      <section aria-label="Clinical domain coverage" className="rounded-xl border border-border bg-card p-4">
        <h2 className="text-sm font-bold text-[var(--theme-heading-text)]">Domain coverage (secondary grouping)</h2>
        <p className="mt-1 text-xs text-[var(--theme-muted-text)]">
          Pair a population filter with assessment, diagnosis, management, or evaluation. Items on the exam cross these lanes.
        </p>
        <ul className="mt-3 flex flex-wrap gap-2 text-sm text-muted">
          {FNP_DOMAIN_ORDER.map((row) => (
            <li key={row.id} className="rounded-full border border-border px-3 py-1">
              {row.label}: <span className="font-semibold text-foreground">{countsDom[row.id]}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* Featured clinical case */}
      {featured && featured.slug?.trim() && featuredPreview && (
        <section className="rounded-2xl border-2 border-primary/25 bg-gradient-to-b from-card to-[var(--theme-muted-surface)] p-5 sm:p-7">
          <p className="text-xs font-semibold uppercase tracking-wide text-primary">Featured clinical case</p>
          <h3 className="mt-2 text-xl font-bold text-[var(--theme-heading-text)]">{featured.title}</h3>
          <div className="mt-4 grid gap-3 border-t border-border pt-4 text-sm sm:grid-cols-2">
            <div className="sm:col-span-2">
              <p className="text-xs font-semibold uppercase text-muted">What this lesson prepares you to do clinically</p>
              <p className="mt-1 text-foreground">{featuredPreview.providerTasks}</p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase text-muted">Likely item styles</p>
              <p className="mt-1 text-[var(--theme-muted-text)]">{featuredPreview.likelyQuestionTypes}</p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase text-muted">Board rationale</p>
              <p className="mt-1 text-[var(--theme-muted-text)]">{featuredPreview.whyBoards}</p>
            </div>
            <div className="sm:col-span-2 rounded-lg bg-card/80 p-3 border border-border">
              <p className="text-xs font-semibold text-muted">Mini patient scenario</p>
              <p className="mt-1 text-foreground">{featuredPreview.miniScenario}</p>
            </div>
            <div className="sm:col-span-2 rounded-lg bg-card/80 p-3 border border-border">
              <p className="text-xs font-semibold text-muted">Sample clinical decision</p>
              <p className="mt-1 text-foreground">{featuredPreview.sampleDecision}</p>
            </div>
          </div>
          <div className="mt-5 flex flex-wrap gap-2">
            <Link
              href={pathwayLessonMarketingDetailHref(lessonsBasePath, featured.slug)!}
              className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
            >
              Open lesson
            </Link>
            <Link
              href={appQuestionsHref(pathway.id, featured.topic)}
              className="rounded-full border border-border bg-card px-4 py-2 text-sm font-semibold hover:bg-gray-50"
            >
              Try a clinical case now
            </Link>
            <Link href={appQuestionsHref(pathway.id)} className="rounded-full border border-border px-4 py-2 text-sm font-semibold hover:bg-gray-50">
              Test your diagnostic reasoning
            </Link>
          </div>
        </section>
      )}

      {/* Filterable lesson list */}
      <section aria-labelledby="fnp-lesson-library">
        <h2 id="fnp-lesson-library" className="text-lg font-bold text-[var(--theme-heading-text)]">
          Lesson library
        </h2>
        <p className="mt-2 text-sm text-[var(--theme-muted-text)]">
          Use filters to mirror board-style layering: <strong className="text-foreground">who</strong> the patient is and{" "}
          <strong className="text-foreground">what task</strong> the stem is testing.
        </p>
        <div className="mt-6">
          <FnpLessonExplorer
            pathway={pathway}
            lessonsBasePath={lessonsBasePath}
            explorerLessons={explorerPayload}
            excludeSlug={safeLessons.length > 1 ? featured?.slug ?? null : null}
          />
        </div>
      </section>

      {/* Differential diagnosis emphasis */}
      <section className="rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-sm" aria-labelledby="fnp-diff">
        <h2 id="fnp-diff" className="text-lg font-bold text-[var(--theme-heading-text)]">
          How FNP questions test differential thinking
        </h2>
        <p className="mt-2 text-sm text-[var(--theme-muted-text)]">
          Boards rarely ask for a textbook definition. They present a symptom and force you to discriminate among plausible
          explanations with the <em>same</em> chief complaint.
        </p>
        <div className="mt-4 rounded-xl border border-border bg-[var(--theme-muted-surface)] p-4 text-sm">
          <p className="font-semibold text-foreground">Symptom (illustrative): acute chest pain at rest</p>
          <ul className="mt-2 space-y-1.5 text-[var(--theme-muted-text)]">
            <li>
              <strong className="text-foreground">Must rule out first:</strong> ACS, pulmonary embolism, aortic dissection,
              pneumothorax, depending on risk factors and associated features in the stem.
            </li>
            <li>
              <strong className="text-foreground">Also in play:</strong> pericarditis, musculoskeletal pain, GERD/esophageal
              spasm, anxiety/panic. After dangerous causes are addressed or convincingly lowered in probability.
            </li>
            <li>
              <strong className="text-foreground">Reasoning pathway:</strong> stabilize if unstable → targeted history/exam →
              ECG and initial labs/imaging as indicated → choose the next diagnostic or therapeutic step that matches the
              leading hypothesis <em>and</em> remaining risk.
            </li>
          </ul>
        </div>
      </section>

      {/* Clinical workflow */}
      <section className="rounded-2xl border border-border bg-[var(--theme-muted-surface)] p-5 sm:p-6" aria-labelledby="fnp-workflow">
        <h2 id="fnp-workflow" className="text-lg font-bold text-[var(--theme-heading-text)]">
          Clinical workflow: symptom → assessment → diagnosis → management → follow-up
        </h2>
        <p className="mt-2 text-sm text-[var(--theme-muted-text)]">
          Lessons are organized to reinforce this sequence. Skipping upstream steps is how well-prepared candidates miss items.
        </p>
        <ol className="mt-4 space-y-2 text-sm text-[var(--theme-muted-text)]">
          <li>
            <strong className="text-foreground">Symptom / concern</strong>: what brought the patient in, and what must be ruled
            out urgently?
          </li>
          <li>
            <strong className="text-foreground">Assessment</strong>: history, exam, targeted tests; interpret in context of age
            and comorbidity.
          </li>
          <li>
            <strong className="text-foreground">Diagnosis</strong>: working diagnosis with differentials ranked by probability
            and harm if wrong.
          </li>
          <li>
            <strong className="text-foreground">Management</strong>: pharmacologic and nonpharmacologic plan, referrals,
            patient education.
          </li>
          <li>
            <strong className="text-foreground">Evaluation</strong>: when to reassess, what defines response, what triggers
            escalation.
          </li>
        </ol>
      </section>

      {/* Lesson → practice → readiness */}
      <section className="rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-sm" aria-labelledby="fnp-flow">
        <h2 id="fnp-flow" className="text-lg font-bold text-[var(--theme-heading-text)]">
          Lesson → case questions → performance by domain → exam simulation → readiness
        </h2>
        <p className="mt-2 text-sm text-[var(--theme-muted-text)]">
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
              <div className="flex w-full min-w-0 flex-col rounded-lg border border-border bg-[var(--theme-muted-surface)] px-3 py-2.5 text-center shadow-sm sm:py-3">
                <span className="text-[10px] font-bold uppercase tracking-wide text-primary">{item.step}</span>
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
          <Link href="/app/questions" className="font-semibold text-primary">
            App question bank
          </Link>
          <span aria-hidden>·</span>
          <Link href="/app/exams" className="font-semibold text-primary">
            Exam simulations
          </Link>
          <span aria-hidden>·</span>
          <Link href="/app/flashcards" className="font-semibold text-primary">
            Flashcards
          </Link>
        </div>
      </section>

      {/* Advanced reasoning */}
      <section className="rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-sm" aria-labelledby="fnp-advanced">
        <h2 id="fnp-advanced" className="text-lg font-bold text-[var(--theme-heading-text)]">
          What advanced FNP reasoning looks like
        </h2>
        <p className="mt-2 text-sm text-[var(--theme-muted-text)]">
          Illustrative primary-care vignette: focus on sequence and elimination, not memorizing this exact answer.
        </p>
        <div className="mt-4 rounded-xl border border-border bg-[var(--theme-muted-surface)] p-4 text-sm">
          <p className="font-medium text-foreground">
            A 58-year-old with hypertension and diabetes presents with 2 days of progressive dyspnea on exertion and
            bilateral ankle edema. BP 168/94, HR 102, RR 22, SpO₂ 93% on room air. Crackles at lung bases. JVP elevated.
          </p>
          <p className="mt-3 font-medium text-foreground">Which is the best next step in management?</p>
          <ul className="mt-2 space-y-1 text-[var(--theme-muted-text)]">
            <li>A. Order BNP and echocardiogram before treating</li>
            <li>B. Start IV loop diuretic with monitoring and reassessment</li>
            <li>C. Increase long-acting antihypertensive to goal immediately</li>
            <li>D. Urgent referral to cardiology before any therapy</li>
          </ul>
          <p className="mt-3 text-foreground">
            <strong>Key findings:</strong> Volume overload + hypoxemia + tachycardia suggest acute decompensated heart failure
            until proven otherwise. Dangerous instability trumps completing all diagnostics first.
          </p>
          <p className="mt-2 text-[var(--theme-muted-text)]">
            <strong className="text-foreground">Rule in/out:</strong> STEMI is less supported without ischemic symptoms, but you
            still monitor ECG/troponins per protocol. The stem rewards treating the failure state causing respiratory compromise.
          </p>
          <p className="mt-2 text-[var(--theme-muted-text)]">
            <strong className="text-foreground">Best management:</strong> Initiate diuresis with monitoring (B is most aligned).
            Then refine diagnosis with imaging/labs as the patient stabilizes.
          </p>
          <p className="mt-2 text-[var(--theme-muted-text)]">
            <strong className="text-foreground">Clinical takeaway:</strong> When the presentation is consistent with acute
            decompensation, delaying therapy solely for confirmatory testing can fail the patient and the item.
          </p>
        </div>
      </section>

      {/* Common mistakes */}
      <section aria-labelledby="fnp-mistakes">
        <h2 id="fnp-mistakes" className="text-lg font-bold text-[var(--theme-heading-text)]">
          Common mistakes NP candidates make
        </h2>
        <div className="mt-4 space-y-6">
          {FNP_NP_COMMON_MISTAKES.map((block) => (
            <div key={block.heading}>
              <p className="text-xs font-semibold uppercase text-muted">{block.heading}</p>
              <ul className="mt-2 list-disc space-y-2 pl-5 text-sm text-[var(--theme-muted-text)]">
                {block.items.map((item, idx) => (
                  <li key={`${block.heading}-${idx}`}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* CTAs */}
      <section className="rounded-2xl border border-primary/20 bg-primary/[0.06] p-5 sm:p-6">
        <h2 className="text-lg font-bold text-[var(--theme-heading-text)]">Low-friction entry</h2>
        <p className="mt-2 text-sm text-[var(--theme-muted-text)]">
          Start with a short case block; deeper sessions may prompt sign-in depending on product rules, not a forced login on
          the first click.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <Link
            href={appQuestionsHref(pathway.id)}
            className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
          >
            Try a clinical case now
          </Link>
          {featured && (
            <Link
              href={appQuestionsHref(pathway.id, featured.topic)}
              className="rounded-full border border-border bg-card px-4 py-2 text-sm font-semibold"
            >
              Test your diagnostic reasoning (this topic)
            </Link>
          )}
          <Link href="/app/exams" className="rounded-full border border-border bg-card px-4 py-2 text-sm font-semibold">
            See how you perform across age groups
          </Link>
          <Link href="/app/questions" className="rounded-full border border-border bg-card px-4 py-2 text-sm font-semibold">
            Open app question bank
          </Link>
        </div>
        <p className="mt-3 text-xs text-muted">
          <Link href={examHub} className="font-semibold text-primary">
            {pathway.shortName} hub
          </Link>{" "}
          ·{" "}
          <Link href={questionsHub} className="font-semibold text-primary">
            Questions
          </Link>
        </p>
      </section>
    </div>
  );
}
