import Link from "next/link";
import type { ExamPathwayDefinition } from "@/lib/exam-pathways/types";
import {
  pathwayLessonHasRenderableHubSlug,
  pathwayLessonMarketingDetailHref,
  type PathwayLessonRecord,
} from "@/lib/lessons/pathway-lesson-types";
import {
  buildNclexRnUsLessonSections,
  nclexRnCommonMistakeBlocks,
  nclexRnLessonExamPreview,
  type NclexRnHubRegion,
} from "@/lib/lessons/nclex-rn-us-lesson-enrichment";
import { buildExamPathwayPath } from "@/lib/exam-pathways/exam-product-registry";
import type { TopicCluster } from "@/lib/lessons/pathway-lesson-loader";

type Props = {
  pathway: ExamPathwayDefinition;
  lessons: PathwayLessonRecord[];
  lessonsBasePath: string;
  topicClusters: TopicCluster[];
  region: NclexRnHubRegion;
};

function appQuestionsHref(pathwayId: string, topic?: string): string {
  const q = new URLSearchParams();
  q.set("pathwayId", pathwayId);
  if (topic) q.set("topic", topic);
  return `/app/questions?${q.toString()}`;
}

export function NclexRnLessonsHub({ pathway, lessons, lessonsBasePath, topicClusters, region }: Props) {
  const isCa = region === "ca";
  const isUsRn = region === "us";
  const safeLessons = lessons.filter(pathwayLessonHasRenderableHubSlug);
  const sections = buildNclexRnUsLessonSections(safeLessons);
  const navLinks = sections.filter((s) => s.count > 0);
  const featured = safeLessons.length > 0 ? [...safeLessons].sort((a, b) => a.slug.localeCompare(b.slug))[0] : null;
  const featuredPreview = featured ? nclexRnLessonExamPreview(featured, region) : null;
  const mistakeBlocks = nclexRnCommonMistakeBlocks(region);
  const questionsHub = buildExamPathwayPath(pathway, "questions");
  const examHub = buildExamPathwayPath(pathway);

  return (
    <div className="space-y-14">
      {/* 1: How to use */}
      <section className="rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-sm" aria-labelledby="how-use-nclex-rn">
        <h2 id="how-use-nclex-rn" className="text-lg font-bold text-[var(--theme-heading-text)]">
          How to use these lessons for NCLEX-RN
        </h2>
        <ol className="mt-4 space-y-3 text-sm leading-relaxed text-[var(--theme-muted-text)]">
          <li>
            <span className="font-semibold text-foreground">1. Learn the concept.</span> Extract the decision rule (what
            changes risk, what must be assessed first), not isolated facts to recite.
          </li>
          <li>
            <span className="font-semibold text-foreground">2. Apply with exam-style questions.</span>{" "}
            {isCa ? (
              <>
                Use the same pathway in the question bank so scope, units, and language stay consistent with Canadian RN
                practice when items are tagged for that context.
              </>
            ) : (
              <>
                Pull items from this pathway so stems, scope, and US terminology stay consistent with NCLEX-RN expectations.
              </>
            )}
          </li>
          <li>
            <span className="font-semibold text-foreground">3. Review rationale deeply.</span> For every option, name the
            patient outcome if it were correct. Then compare to the stem’s urgency and data.
          </li>
          <li>
            <span className="font-semibold text-foreground">4. Identify weak areas.</span> Tag misses by Client Needs bucket
            and symptom pattern (e.g., “missed hypoxia cue”) before adding new volume.
          </li>
          <li>
            <span className="font-semibold text-foreground">5. Retest.</span> Run a timed or CAT-style block after you can
            explain prior errors. Retesting without analysis reinforces guesses.
          </li>
        </ol>
      </section>

      {/* Trust anchors */}
      <section className="rounded-2xl border border-primary/20 bg-primary/[0.04] p-5 sm:p-6">
        <h2 className="text-lg font-bold text-[var(--theme-heading-text)]">Built for NCLEX-RN, not generic “nursing content”</h2>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-[var(--theme-muted-text)]">
          <li>Aligned with the NCLEX-RN test plan Client Needs framework used to group lessons below.</li>
          <li>Built for clinical judgment: unsafe vs safe, urgent vs routine, not recognition of the longest answer.</li>
          <li>Includes NGN-style reasoning: layered data, multiple plausible options, one best action for this patient.</li>
          {isUsRn && (
            <li>
              High-performing prep pairs lessons with the question bank, adaptive (CAT) practice, and performance
              feedback. This hub is the lesson layer of that system.
            </li>
          )}
          {isCa && (
            <li>
              Canadian RN track: lessons and stems use Canadian acute care language and SI units where noted. Avoid
              cross-mixing unrelated US-only scope statements.
            </li>
          )}
        </ul>
      </section>

      {/* Topic clusters (body system / SEO hubs) */}
      {topicClusters.length > 0 && (
        <section aria-label="Browse by topic" className="rounded-xl border border-border bg-card p-4">
          <h2 className="text-sm font-bold text-[var(--theme-heading-text)]">Browse by topic cluster</h2>
          <p className="mt-1 text-xs text-muted">Same lessons, alternate index, useful when you study by organ system.</p>
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

      {/* Anchor navigation */}
      {navLinks.length > 0 && (
        <nav aria-label="NCLEX-RN lesson categories" className="rounded-xl border border-border bg-[var(--theme-muted-surface)] p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted">Jump to Client Needs</p>
          <ul className="mt-3 flex flex-wrap gap-2">
            {navLinks.map((s) => (
              <li key={s.anchor}>
                <a
                  href={`#${s.anchor}`}
                  className="inline-flex rounded-full border border-border bg-card px-3 py-1.5 text-sm font-medium hover:border-primary/40"
                >
                  {s.title === "Physiological Integrity" ? `${s.subtitle}` : s.title} ({s.count})
                </a>
              </li>
            ))}
          </ul>
        </nav>
      )}

      {/* Featured + category sections */}
      {featured && featured.slug?.trim() && featuredPreview && (
        <section className="rounded-2xl border-2 border-primary/25 bg-gradient-to-b from-card to-[var(--theme-muted-surface)] p-5 sm:p-7">
          <p className="text-xs font-semibold uppercase tracking-wide text-primary">Featured lesson</p>
          <h3 className="mt-2 text-xl font-bold text-[var(--theme-heading-text)]">{featured.title}</h3>
          <div className="mt-4 grid gap-3 border-t border-border pt-4 text-sm sm:grid-cols-2">
            <div>
              <p className="text-xs font-semibold uppercase text-muted">Clinical scenario type</p>
              <p className="mt-1 text-foreground">{featuredPreview.scenarioType}</p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase text-muted">Likely NCLEX item types</p>
              <p className="mt-1 text-foreground">{featuredPreview.examQuestionTypes}</p>
            </div>
            <div className="sm:col-span-2">
              <p className="text-xs font-semibold uppercase text-muted">What this lesson prepares you for</p>
              <p className="mt-1 text-[var(--theme-muted-text)]">{featuredPreview.whyOnExam}</p>
            </div>
            <div className="sm:col-span-2 rounded-lg bg-card/80 p-3 border border-border">
              <p className="text-xs font-semibold text-muted">Scenario preview</p>
              <p className="mt-1 text-foreground">{featuredPreview.miniScenario}</p>
            </div>
            <div className="sm:col-span-2 rounded-lg bg-card/80 p-3 border border-border">
              <p className="text-xs font-semibold text-muted">Reasoning excerpt (from lesson core)</p>
              <p className="mt-1 italic text-[var(--theme-muted-text)]">
                &ldquo;{featuredPreview.rationaleSnippet}&rdquo;
              </p>
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
              Start 5-question quiz from this topic
            </Link>
            <Link href={appQuestionsHref(pathway.id)} className="rounded-full border border-border px-4 py-2 text-sm font-semibold hover:bg-gray-50">
              Test this lesson now
            </Link>
          </div>
        </section>
      )}

      {sections.map((section) => {
        if (section.count === 0) return null;
        return (
          <section key={section.anchor} id={section.anchor} className="scroll-mt-24">
            <div className="border-b border-border pb-3">
              <h2 className="text-xl font-bold text-[var(--theme-heading-text)]">{section.title}</h2>
              {section.subtitle && (
                <p className="mt-1 text-sm text-muted">
                  {section.subtitle} · <span className="font-medium text-foreground">{section.count} lesson(s)</span>
                </p>
              )}
            </div>
            <ul className="mt-6 space-y-6">
              {section.lessons
                .filter((l) => !featured || l.slug !== featured.slug)
                .map((l) => {
                  const p = nclexRnLessonExamPreview(l, region);
                  return (
                    <li key={l.slug} className="rounded-xl border border-border bg-card p-4 sm:p-5 shadow-sm">
                      <p className="text-xs font-medium uppercase text-muted">{l.topic}</p>
                      <Link
                        href={pathwayLessonMarketingDetailHref(lessonsBasePath, l.slug)!}
                        className="mt-1 block text-lg font-semibold text-primary hover:underline"
                      >
                        {l.title}
                      </Link>
                      <div className="mt-4 grid gap-3 border-t border-border pt-4 text-sm sm:grid-cols-2">
                        <div>
                          <p className="text-xs font-semibold uppercase text-muted">Scenario focus</p>
                          <p className="mt-0.5">{p.scenarioType}</p>
                        </div>
                        <div>
                          <p className="text-xs font-semibold uppercase text-muted">Item types</p>
                          <p className="mt-0.5">{p.examQuestionTypes}</p>
                        </div>
                        <div className="sm:col-span-2">
                          <p className="text-xs font-semibold uppercase text-muted">What this lesson prepares you for</p>
                          <p className="mt-0.5 text-[var(--theme-muted-text)]">{p.whyOnExam}</p>
                        </div>
                        <div className="sm:col-span-2 rounded-lg bg-[var(--theme-muted-surface)] p-3">
                          <p className="text-xs font-semibold text-muted">Clinical scenario preview</p>
                          <p className="mt-1">{p.miniScenario}</p>
                        </div>
                        <div className="sm:col-span-2 rounded-lg bg-[var(--theme-muted-surface)] p-3">
                          <p className="text-xs font-semibold text-muted">Reasoning snippet</p>
                          <p className="mt-1 italic text-[var(--theme-muted-text)]">&ldquo;{p.rationaleSnippet}&rdquo;</p>
                        </div>
                      </div>
                      <div className="mt-4 flex flex-wrap gap-2">
                        <Link
                          href={pathwayLessonMarketingDetailHref(lessonsBasePath, l.slug)!}
                          className="text-sm font-semibold text-primary"
                        >
                          Read lesson →
                        </Link>
                        <Link href={appQuestionsHref(pathway.id, l.topic)} className="text-sm font-semibold text-primary">
                          Practice questions →
                        </Link>
                        <Link href="/app/flashcards" className="text-sm font-semibold text-muted hover:text-primary">
                          Flashcards →
                        </Link>
                        <Link href="/app/exams" className="text-sm font-semibold text-muted hover:text-primary">
                          CAT exams →
                        </Link>
                      </div>
                    </li>
                  );
                })}
            </ul>
            {section.lessons.filter((l) => !featured || l.slug !== featured.slug).length === 0 &&
              section.lessons.length > 0 && (
                <p className="mt-4 text-sm text-[var(--theme-muted-text)]">
                  This category&apos;s lesson is expanded in the featured block above.
                </p>
              )}
          </section>
        );
      })}

      {/* Clinical judgment */}
      <section className="rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-sm" aria-labelledby="cj-nclex-rn">
        <h2 id="cj-nclex-rn" className="text-lg font-bold text-[var(--theme-heading-text)]">
          Clinical judgment system: from knowledge to a selected action
        </h2>
        <div className="mt-3 space-y-3 text-sm leading-relaxed text-[var(--theme-muted-text)]">
          <p>
            NCLEX-RN does not reward recall. It rewards which action is <em> safest and most urgent</em> for this patient
            with incomplete information. Timed presentation and plausible distractors are part of the construct.
          </p>
          <p>
            <strong className="text-foreground">Thinking under pressure:</strong> You have seconds to notice the cue that
            changes risk (vitals, neuro, bleeding, airway). Lessons train you to name that cue before you touch an option.
          </p>
          <ul className="list-disc space-y-2 pl-5">
            <li>
              <strong className="text-foreground">Prioritization (ABCs, acute vs chronic, stable vs unstable)</strong> turns
              assessment data into an ordered sequence of concerns.
            </li>
            <li>
              <strong className="text-foreground">Safety-first / Maslow</strong> when physiological and psychosocial answers
              both look reasonable. Threats to life, airway, or circulation usually precede psychosocial priorities on the exam.
            </li>
            <li>
              <strong className="text-foreground">Outcome-based selection</strong>: “If I do this now, what improves for the
              patient in the next 5–15 minutes?”
            </li>
          </ul>
        </div>
      </section>

      {/* Flow */}
      <section className="rounded-2xl border border-border bg-[var(--theme-muted-surface)] p-5 sm:p-6" aria-labelledby="flow-nclex-rn">
        <h2 id="flow-nclex-rn" className="text-lg font-bold text-[var(--theme-heading-text)]">
          Structured pathway: lesson → questions → weak areas → CAT → readiness
        </h2>
        <p className="mt-2 text-sm text-[var(--theme-muted-text)]">
          Lessons alone do not equal readiness. They feed the loop below with the bank, analytics, and adaptive exams.
        </p>
        <div
          className="mt-5 flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-stretch sm:gap-0"
          aria-label="Preparation progression"
        >
          {[
            { step: "1", label: "Lesson", detail: "Cue patterns & rules" },
            { step: "2", label: "Questions", detail: "Exam-style stems + rationales" },
            { step: "3", label: "Weak areas", detail: "Category & error pattern review" },
            { step: "4", label: "CAT exam", detail: "Adaptive difficulty & length" },
            { step: "5", label: "Readiness", detail: "Predict errors before you click" },
          ].map((item, i, arr) => (
            <div key={item.label} className="flex min-w-0 flex-1 items-center gap-2 sm:flex-col sm:gap-1">
              <div className="flex w-full min-w-0 flex-col rounded-lg border border-border bg-card px-3 py-2.5 text-center shadow-sm sm:py-3">
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
        <ol className="mt-6 space-y-2 text-sm text-[var(--theme-muted-text)]">
          <li>Lesson establishes cue patterns you will recognize in stems.</li>
          <li>Practice forces commitment; rationales and weak-area tags show where judgment drifts.</li>
          <li>Performance feedback (accuracy by domain, trend) directs what to re-study.</li>
          <li>CAT mocks approximate adaptive difficulty and stopping rules, not the same as untimed blocks.</li>
          <li>Readiness: you can state the error you almost made before the rationale reveals it.</li>
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

      {/* Strong reasoning sample */}
      <section className="rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-sm" aria-labelledby="reasoning-nclex-rn">
        <h2 id="reasoning-nclex-rn" className="text-lg font-bold text-[var(--theme-heading-text)]">
          What strong NCLEX-RN reasoning looks like
        </h2>
        <p className="mt-2 text-sm text-[var(--theme-muted-text)]">
          Sample acute-care stem (illustrative) with the kind of elimination you should practice.
        </p>
        <div className="mt-4 rounded-xl border border-border bg-[var(--theme-muted-surface)] p-4 text-sm">
          <p className="font-medium text-foreground">
            A patient with acute STEMI arrives in the ED. Which intervention is the highest priority?
          </p>
          <ul className="mt-2 space-y-1 text-[var(--theme-muted-text)]">
            <li>A. Chewable aspirin</li>
            <li>B. 12-lead ECG within 10 minutes</li>
            <li>C. Activate the cath lab for PCI</li>
            <li>D. Start heparin infusion</li>
          </ul>
          <p className="mt-3 text-foreground">
            <strong>Correct logic:</strong> Reperfusion limits infarct size; activating PCI addresses the occluded vessel when
            STEMI is identified.
          </p>
          <p className="mt-2 text-[var(--theme-muted-text)]">
            <strong className="text-foreground">Eliminate distractors:</strong> Aspirin and ECG matter early, but once STEMI is
            confirmed, definitive reperfusion supersedes repeating the diagnostic step. Heparin may be in the pathway but does
            not replace restoring flow.
          </p>
          <p className="mt-2 text-[var(--theme-muted-text)]">
            <strong className="text-foreground">Takeaway:</strong> “Priority” on NCLEX often means the action that most
            directly reduces death in the next minutes, not the most detailed nursing task.
          </p>
        </div>
      </section>

      {/* Common mistakes */}
      <section aria-labelledby="mistakes-nclex-rn">
        <h2 id="mistakes-nclex-rn" className="text-lg font-bold text-[var(--theme-heading-text)]">
          Common mistakes RN students make
        </h2>
        <div className="mt-4 space-y-6">
          {mistakeBlocks.map((block) => (
            <div key={block.group}>
              {block.group !== "all" && (
                <p className="text-xs font-semibold uppercase text-muted">
                  {block.group === "safe" ? "Safe & effective care" : "Physiological integrity"}
                </p>
              )}
              <ul className="mt-2 list-disc space-y-2 pl-5 text-sm text-[var(--theme-muted-text)]">
                {block.items.map((item, idx) => (
                  <li key={`${block.group}-${idx}`}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* CTAs */}
      <section className="rounded-2xl border border-primary/20 bg-primary/[0.06] p-5 sm:p-6">
        <h2 className="text-lg font-bold text-[var(--theme-heading-text)]">Start without friction</h2>
        <p className="mt-2 text-sm text-[var(--theme-muted-text)]">
          Try a short bank pass first; full sessions may prompt sign-in depending on product rules, not a forced login at the
          first click.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <Link href={appQuestionsHref(pathway.id)} className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground">
            Start quick quiz (pathway-scoped)
          </Link>
          {featured && (
            <Link
              href={appQuestionsHref(pathway.id, featured.topic)}
              className="rounded-full border border-border bg-card px-4 py-2 text-sm font-semibold"
            >
              Start 5-question quiz from this topic
            </Link>
          )}
          <Link href="/app/questions" className="rounded-full border border-border bg-card px-4 py-2 text-sm font-semibold">
            Open app question bank
          </Link>
          <Link href="/app/exams" className="rounded-full border border-border bg-card px-4 py-2 text-sm font-semibold">
            See your weak areas instantly (after a session)
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
