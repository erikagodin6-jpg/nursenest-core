"use client";

import Link from "next/link";
import { ArrowRight, BookOpen, Layers, Target, TrendingUp } from "lucide-react";
import { StudyCard } from "@/components/ui/study-card";
import { PRE_NURSING_LEARNING_FLOW } from "@/lib/pre-nursing/pre-nursing-learning-ecosystem";

/**
 * Client island: Lucide icons and StudyCard must not cross the Server to Client boundary from the hub shell.
 */
export function PreNursingMarketingHubActions({
  heroTitle,
  heroSubtitle,
  lessonsHref,
  flashcardsHref,
  practiceHref,
}: {
  heroTitle: string;
  heroSubtitle: string;
  lessonsHref: string;
  flashcardsHref: string;
  practiceHref: string;
}) {
  return (
    <>
      <div className="nn-pre-nursing-hub-hero" data-nn-premium-prenursing-hero>
        <h1 id="pre-nursing-hero-heading" className="nn-marketing-h1 max-w-3xl text-balance">
          {heroTitle}
        </h1>
        <p className="nn-marketing-body mt-2 max-w-3xl text-pretty text-[var(--theme-muted-text)]">{heroSubtitle}</p>
        <div className="mt-5 flex flex-wrap gap-3">
          <Link
            href={lessonsHref}
            className="nn-btn-primary inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold shadow-sm"
            data-testid="link-pre-nursing-lessons"
          >
            <BookOpen className="h-4 w-4" aria-hidden />
            Start free lessons
            <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
        </div>
      </div>

      <section
        className="nn-pre-nursing-readiness-panel"
        aria-labelledby="pre-nursing-readiness-heading"
        data-nn-premium-prenursing-readiness
      >
        <div className="nn-pre-nursing-readiness-panel__copy">
          <p className="nn-premium-home-eyebrow">Nursing School Readiness</p>
          <h2 id="pre-nursing-readiness-heading" className="nn-marketing-h2 text-balance text-[var(--palette-heading)]">
            Build the Foundation Before the Exam Pathway
          </h2>
          <p className="nn-marketing-body-sm mt-3 max-w-2xl text-pretty text-[var(--semantic-text-secondary)]">
            Pre-Nursing now connects prerequisite mastery, dosage calculation readiness, flashcards, practice quizzes, and
            study plans into the same NurseNest learning ecosystem used by RN, PN, NP, Allied Health, and New Grad learners.
          </p>
        </div>

        <div className="nn-pre-nursing-readiness-panel__metrics" aria-label="Pre-Nursing readiness signals">
          {[
            ["64%", "Readiness Score"],
            ["6 Days", "Study Streak"],
            ["72%", "Dosage Readiness"],
          ].map(([value, label]) => (
            <div key={label} className="nn-pre-nursing-readiness-metric">
              <TrendingUp className="h-4 w-4" aria-hidden />
              <span className="nn-pre-nursing-readiness-metric__value">{value}</span>
              <span className="nn-pre-nursing-readiness-metric__label">{label}</span>
            </div>
          ))}
        </div>
      </section>

      <h2 id="pre-nursing-quick-modes-heading" className="nn-marketing-h2 text-balance text-[var(--palette-heading)]">
        Lesson-First Study Flow
      </h2>
      <div className="grid gap-3 sm:grid-cols-4" aria-label="Pre-Nursing learning flow">
        {PRE_NURSING_LEARNING_FLOW.map((step, index) => (
          <div
            key={step.mode}
            className="rounded-2xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-4 shadow-[var(--semantic-shadow-soft)]"
          >
            <span className="text-xs font-semibold uppercase tracking-wide text-[var(--semantic-brand)]">
              {String(index + 1).padStart(2, "0")}
            </span>
            <h3 className="mt-1 text-sm font-semibold text-[var(--semantic-text-primary)]">{step.label}</h3>
            <p className="mt-1 text-xs leading-relaxed text-[var(--semantic-text-secondary)]">{step.description}</p>
          </div>
        ))}
      </div>
      <ul
        className="nn-pre-nursing-quick-mode-grid grid list-none gap-5 p-0 sm:grid-cols-3"
        aria-labelledby="pre-nursing-quick-modes-heading"
        data-nn-premium-prenursing-quick-modes
      >
        <li>
          <StudyCard
            surface="hub"
            variant="featured"
            className="nn-exam-hub-study-card--lessons"
            href={lessonsHref}
            icon={BookOpen}
            title="Lessons"
            description="Review prerequisites, anatomy, terminology, study skills, and nursing foundations by topic."
            cta="Start Lessons"
            ctaVariant="primary"
          />
        </li>
        <li>
          <StudyCard
            surface="hub"
            variant="featured"
            className="nn-exam-hub-study-card--flashcards"
            href={flashcardsHref}
            icon={Layers}
            title="Flashcards"
            description="Review anatomy, terminology, dosage calculations, pharmacology basics, and safety concepts."
            cta="View Flashcards"
            ctaVariant="primary"
          />
        </li>
        <li>
          <StudyCard
            surface="hub"
            variant="featured"
            className="nn-exam-hub-study-card--practice nn-qa-pre-nursing-hub-practice"
            prefetch={false}
            href={practiceHref}
            icon={Target}
            title="Practice Quizzes"
            description="Drill foundational quizzes, dosage calculations, A&P review, and nursing school prep tests."
            cta="Start Practice"
            ctaVariant="primary"
          />
        </li>
      </ul>
    </>
  );
}
