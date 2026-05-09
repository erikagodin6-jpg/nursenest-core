"use client";

import Link from "next/link";
import { Activity, ArrowRight, BookOpen, Layers, Target } from "lucide-react";
import { StudyCard } from "@/components/ui/study-card";

/**
 * Client island: Lucide icons and StudyCard must not cross the Server to Client boundary from the hub shell.
 */
export function PreNursingMarketingHubActions({
  heroTitle,
  heroSubtitle,
  lessonsHref,
  flashcardsHref,
  practiceHref,
  examsHref,
}: {
  heroTitle: string;
  heroSubtitle: string;
  lessonsHref: string;
  flashcardsHref: string;
  practiceHref: string;
  examsHref: string;
}) {
  return (
    <>
      <div className="nn-pre-nursing-hub-hero">
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

      <h2 id="pre-nursing-quick-modes-heading" className="nn-marketing-h2 text-balance text-[var(--palette-heading)]">
        Quick study modes
      </h2>
      <ul className="grid list-none gap-5 p-0 sm:grid-cols-2 lg:grid-cols-4" aria-labelledby="pre-nursing-quick-modes-heading">
        <li>
          <StudyCard
            surface="hub"
            variant="featured"
            className="nn-exam-hub-study-card--lessons"
            href={lessonsHref}
            icon={BookOpen}
            title="Lessons"
            description="Review concepts by topic."
            cta="Lessons"
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
            description="Strengthen recall quickly."
            cta="Flashcards"
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
            title="Practice"
            description="Drill by topic or weakness."
            cta="Practice"
            ctaVariant="primary"
          />
        </li>
        <li>
          <StudyCard
            surface="hub"
            variant="featured"
            className="nn-exam-hub-study-card--cat"
            href={examsHref}
            icon={Activity}
            title="Exams"
            description="Take longer exam-style sessions."
            cta="Exams"
            ctaVariant="primary"
          />
        </li>
      </ul>
    </>
  );
}
