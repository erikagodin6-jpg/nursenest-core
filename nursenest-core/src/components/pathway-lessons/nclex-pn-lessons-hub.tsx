import Link from "next/link";
import type { ExamPathwayDefinition } from "@/lib/exam-pathways/types";
import type { PathwayLessonRecord } from "@/lib/lessons/pathway-lesson-types";
import {
  buildNclexPnUsLessonSections,
  nclexPnLessonExamPreview,
  NCLEX_PN_US_COMMON_MISTAKES,
} from "@/lib/lessons/nclex-pn-us-lesson-enrichment";
import { buildExamPathwayPath } from "@/lib/exam-pathways/exam-product-registry";
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

export function NclexPnLessonsHub({ pathway, lessons, lessonsBasePath, topicClusters }: Props) {
  const sections = buildNclexPnUsLessonSections(lessons);
  const navLinks = sections.filter((s) => s.count > 0);
  const featured = lessons.length > 0 ? [...lessons].sort((a, b) => a.slug.localeCompare(b.slug))[0] : null;
  const featuredPreview = featured ? nclexPnLessonExamPreview(featured) : null;
  const questionsHub = buildExamPathwayPath(pathway, "questions");
  const examHub = buildExamPathwayPath(pathway);

  return (
    <div className="space-y-14">
      <section className="rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-sm" aria-labelledby="how-use-nclex-pn">
        <h2 id="how-use-nclex-pn" className="text-lg font-bold text-[var(--theme-heading-text)]">
          How to use these lessons for NCLEX-PN
        </h2>
        <ol className="mt-4 space-y-3 text-sm leading-relaxed text-[var(--theme-muted-text)]">
          <li>
            <span className="font-semibold text-foreground">1. Learn the concept.</span> Focus on what the LVN/LPN can do,
            must report, and must not do—NCLEX-PN tests scope as often as content.
          </li>
          <li>
            <span className="font-semibold text-foreground">2. Apply with questions.</span> Use this pathway in the bank so
            stems stay PN-scoped (delegation, basic care, ordered interventions)—not RN-level analysis items.
          </li>
          <li>
            <span className="font-semibold text-foreground">3. Review rationale deeply.</span> For each wrong option, ask:
            unsafe for the patient, out of scope, or right idea but wrong sequence?
          </li>
          <li>
            <span className="font-semibold text-foreground">4. Revisit weak areas.</span> Return to the matching Client Needs
            section here before stacking new topics; CAT difficulty only helps after gaps shrink.
          </li>
        </ol>
      </section>

      <section className="rounded-2xl border border-primary/20 bg-primary/[0.04] p-5 sm:p-6">
        <h2 className="text-lg font-bold text-[var(--theme-heading-text)]">NCLEX-PN — explicit, not generic prep</h2>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-[var(--theme-muted-text)]">
          <li>Aligned with the NCLEX-PN test plan Client Needs framework used to group lessons below.</li>
          <li>Built around practical/vocational scope: delegation, safety, and ordered care—not RN leadership disguised as PN.</li>
          <li>Supports clinical judgment and NGN-style stems: multiple “reasonable” options with one safest, scope-correct choice.</li>
        </ul>
      </section>

      {topicClusters.length > 0 && (
        <section aria-label="Browse by topic" className="rounded-xl border border-border bg-card p-4">
          <h2 className="text-sm font-bold text-[var(--theme-heading-text)]">Browse by topic cluster</h2>
          <p className="mt-1 text-xs text-muted">Alternate index by system or topic label—same pathway constraints.</p>
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

      {navLinks.length > 0 && (
        <nav aria-label="NCLEX-PN lesson categories" className="rounded-xl border border-border bg-[var(--theme-muted-surface)] p-4">
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

      {featured && featuredPreview && (
        <section className="rounded-2xl border-2 border-primary/25 bg-gradient-to-b from-card to-[var(--theme-muted-surface)] p-5 sm:p-7">
          <p className="text-xs font-semibold uppercase tracking-wide text-primary">Featured lesson</p>
          <h3 className="mt-2 text-xl font-bold text-[var(--theme-heading-text)]">{featured.title}</h3>
          <div className="mt-4 grid gap-3 border-t border-border pt-4 text-sm sm:grid-cols-2">
            <div>
              <p className="text-xs font-semibold uppercase text-muted">Clinical scenario type</p>
              <p className="mt-1 text-foreground">{featuredPreview.scenarioType}</p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase text-muted">Likely item types</p>
              <p className="mt-1 text-foreground">{featuredPreview.examQuestionTypes}</p>
            </div>
            <div className="sm:col-span-2">
              <p className="text-xs font-semibold uppercase text-muted">What this lesson prepares you for (NCLEX-PN)</p>
              <p className="mt-1 text-[var(--theme-muted-text)]">{featuredPreview.whyOnExam}</p>
            </div>
            <div className="sm:col-span-2 rounded-lg bg-card/80 p-3 border border-border">
              <p className="text-xs font-semibold text-muted">Clinical scenario preview</p>
              <p className="mt-1 text-foreground">{featuredPreview.miniScenario}</p>
            </div>
            <div className="sm:col-span-2 rounded-lg bg-card/80 p-3 border border-border">
              <p className="text-xs font-semibold text-muted">Reasoning excerpt</p>
              <p className="mt-1 italic text-[var(--theme-muted-text)]">&ldquo;{featuredPreview.rationaleSnippet}&rdquo;</p>
            </div>
          </div>
          <div className="mt-5 flex flex-wrap gap-2">
            <Link
              href={`${lessonsBasePath}/${featured.slug}`}
              className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
            >
              Open lesson
            </Link>
            <Link
              href={appQuestionsHref(pathway.id, featured.topic)}
              className="rounded-full border border-border bg-card px-4 py-2 text-sm font-semibold hover:bg-gray-50"
            >
              Test this topic in 5 questions
            </Link>
            <Link href={appQuestionsHref(pathway.id)} className="rounded-full border border-border px-4 py-2 text-sm font-semibold hover:bg-gray-50">
              Start quick quiz
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
                  const p = nclexPnLessonExamPreview(l);
                  return (
                    <li key={l.slug} className="rounded-xl border border-border bg-card p-4 sm:p-5 shadow-sm">
                      <p className="text-xs font-medium uppercase text-muted">{l.topic}</p>
                      <Link href={`${lessonsBasePath}/${l.slug}`} className="mt-1 block text-lg font-semibold text-primary hover:underline">
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
                          <p className="text-xs font-semibold uppercase text-muted">Why it matters on NCLEX-PN</p>
                          <p className="mt-0.5 text-[var(--theme-muted-text)]">{p.whyOnExam}</p>
                        </div>
                        <div className="sm:col-span-2 rounded-lg bg-[var(--theme-muted-surface)] p-3">
                          <p className="text-xs font-semibold text-muted">Clinical preview</p>
                          <p className="mt-1">{p.miniScenario}</p>
                        </div>
                        <div className="sm:col-span-2 rounded-lg bg-[var(--theme-muted-surface)] p-3">
                          <p className="text-xs font-semibold text-muted">Rationale snippet</p>
                          <p className="mt-1 italic text-[var(--theme-muted-text)]">&ldquo;{p.rationaleSnippet}&rdquo;</p>
                        </div>
                      </div>
                      <div className="mt-4 flex flex-wrap gap-2">
                        <Link href={`${lessonsBasePath}/${l.slug}`} className="text-sm font-semibold text-primary">
                          Read lesson →
                        </Link>
                        <Link href={appQuestionsHref(pathway.id, l.topic)} className="text-sm font-semibold text-primary">
                          Related questions →
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

      <section className="rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-sm" aria-labelledby="cj-nclex-pn">
        <h2 id="cj-nclex-pn" className="text-lg font-bold text-[var(--theme-heading-text)]">
          Clinical judgment at PN scope
        </h2>
        <div className="mt-3 space-y-3 text-sm leading-relaxed text-[var(--theme-muted-text)]">
          <p>
            NCLEX-PN measures whether you can apply knowledge to <em>safe decisions</em> in the practical nurse role—not
            whether you can list facts. CAT adjusts difficulty as you go; weak scope boundaries show up fast.
          </p>
          <ul className="list-disc space-y-2 pl-5">
            <li>
              <strong className="text-foreground">Prioritization:</strong> unstable vs stable, acute change vs routine
              care—then choose what your license supports.
            </li>
            <li>
              <strong className="text-foreground">Safety &amp; outcomes:</strong> Does this option reduce harm in the next few
              minutes, or only check a task off?
            </li>
            <li>
              <strong className="text-foreground">Scope:</strong> When in doubt, select report, clarify orders, or request the
              RN when assessment or judgment exceeds PN practice.
            </li>
          </ul>
        </div>
      </section>

      <section className="rounded-2xl border border-border bg-[var(--theme-muted-surface)] p-5 sm:p-6" aria-labelledby="flow-nclex-pn">
        <h2 id="flow-nclex-pn" className="text-lg font-bold text-[var(--theme-heading-text)]">
          Lesson → practice questions → weak areas → CAT exam
        </h2>
        <ol className="mt-4 space-y-2 text-sm text-[var(--theme-muted-text)]">
          <li>Lesson: pattern recognition for PN-appropriate actions and delegation.</li>
          <li>Practice: commit under time; read every distractor against scope and safety.</li>
          <li>Weak areas: let rationales drive what you re-study—avoid endless new topics.</li>
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

      <section className="rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-sm" aria-labelledby="reasoning-nclex-pn">
        <h2 id="reasoning-nclex-pn" className="text-lg font-bold text-[var(--theme-heading-text)]">
          What strong NCLEX-PN reasoning looks like
        </h2>
        <p className="mt-2 text-sm text-[var(--theme-muted-text)]">
          Illustrative delegation stem—eliminate options that confuse task completion with patient safety or licensed duty.
        </p>
        <div className="mt-4 rounded-xl border border-border bg-[var(--theme-muted-surface)] p-4 text-sm">
          <p className="font-medium text-foreground">
            The RN assigns you four patients. Which should you see first?
          </p>
          <ul className="mt-2 space-y-1 text-[var(--theme-muted-text)]">
            <li>A. Stable post-op waiting for discharge teaching</li>
            <li>B. New onset chest pressure with diaphoresis and BP drop</li>
            <li>C. Diabetic patient due for scheduled insulin per protocol</li>
            <li>D. UAP asks for help turning a patient on bedrest</li>
          </ul>
          <p className="mt-3 text-foreground">
            <strong>Correct logic:</strong> See the patient with acute cardiopulmonary compromise first—potential
            life-threatening change beats routine timing tasks.
          </p>
          <p className="mt-2 text-[var(--theme-muted-text)]">
            <strong className="text-foreground">Eliminate distractors:</strong> Discharge teaching and routine insulin matter,
            but not before unstable symptoms are addressed or escalated per facility policy. Helping the UAP may be valid only
            after higher-risk needs are covered.
          </p>
          <p className="mt-2 text-[var(--theme-muted-text)]">
            <strong className="text-foreground">Takeaway:</strong> NCLEX-PN prioritization still follows patient outcome
            risk—then stay inside what you can assess, perform, and report within PN scope.
          </p>
        </div>
      </section>

      <section aria-labelledby="mistakes-nclex-pn">
        <h2 id="mistakes-nclex-pn" className="text-lg font-bold text-[var(--theme-heading-text)]">
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
              <ul className="mt-2 list-disc space-y-2 pl-5 text-sm text-[var(--theme-muted-text)]">
                {block.items.map((item, idx) => (
                  <li key={`${block.group}-${idx}`}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-primary/20 bg-primary/[0.06] p-5 sm:p-6">
        <h2 className="text-lg font-bold text-[var(--theme-heading-text)]">Low-friction next steps</h2>
        <p className="mt-2 text-sm text-[var(--theme-muted-text)]">
          Open the bank with this pathway; longer sessions may prompt sign-in—short tries stay accessible when the product
          allows it.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <Link href={appQuestionsHref(pathway.id)} className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground">
            Start quick quiz (pathway-scoped)
          </Link>
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
