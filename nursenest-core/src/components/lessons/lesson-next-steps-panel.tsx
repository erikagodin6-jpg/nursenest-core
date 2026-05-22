"use client";

import Link from "next/link";
import {
  BookOpen,
  ClipboardList,
  Layers,
  Brain,
  BarChart2,
  Stethoscope,
  GraduationCap,
  FileText,
  ArrowRight,
  ChevronRight,
} from "lucide-react";
import { trackProductEvent } from "@/lib/observability/product-analytics";
import { PH } from "@/lib/observability/posthog-conversion-events";

type NextLesson = { href: string; title: string; reason?: string } | null;

export type LessonNextStepsPanelProps = {
  pathwayId: string;
  topicSlug: string | null;
  topicLabel: string | null;
  lessonSlug: string;
  nextLesson: NextLesson;
  flashcardsHref: string;
  practiceQuestionsHref: string;
  allLessonsHref: string;
  practiceExamsHref: string;
  catHref?: string | null;
  questionBankHref: string;
  studyPlanHref?: string;
  blogHref?: string;
  hasAccess: boolean;
};

function SectionHeader({ eyebrow, title, description }: { eyebrow: string; title: string; description?: string }) {
  return (
    <div className="mb-5">
      <p className="text-[11px] font-semibold uppercase tracking-widest text-[var(--semantic-brand)] opacity-80">
        {eyebrow}
      </p>
      <h2 className="mt-1 text-base font-semibold text-[var(--semantic-text-primary)]">{title}</h2>
      {description ? (
        <p className="mt-1 text-sm text-[var(--semantic-text-secondary)]">{description}</p>
      ) : null}
    </div>
  );
}

function ActionCard({
  href,
  icon: Icon,
  label,
  sublabel,
  variant = "default",
  onClick,
}: {
  href: string;
  icon: React.ElementType;
  label: string;
  sublabel?: string;
  variant?: "primary" | "default" | "muted";
  onClick?: () => void;
}) {
  const base =
    "group flex items-center gap-3.5 rounded-xl border p-4 transition-all duration-150 hover:shadow-[var(--semantic-shadow-soft)]";
  const styles = {
    primary:
      "border-[color-mix(in_srgb,var(--semantic-brand)_20%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-brand)_5%,var(--semantic-surface))] hover:border-[color-mix(in_srgb,var(--semantic-brand)_35%,transparent)] hover:bg-[color-mix(in_srgb,var(--semantic-brand)_8%,var(--semantic-surface))]",
    default:
      "border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] hover:border-[color-mix(in_srgb,var(--semantic-brand)_25%,var(--semantic-border-soft))] hover:bg-[color-mix(in_srgb,var(--semantic-brand)_3%,var(--semantic-surface))]",
    muted:
      "border-[var(--semantic-border-soft)] bg-[var(--semantic-panel-muted)] hover:border-[color-mix(in_srgb,var(--semantic-brand)_20%,var(--semantic-border-soft))]",
  };

  return (
    <Link href={href} className={`${base} ${styles[variant]}`} onClick={onClick}>
      <span
        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
          variant === "primary"
            ? "bg-[var(--semantic-brand)] text-white"
            : "bg-[color-mix(in_srgb,var(--semantic-brand)_10%,var(--semantic-surface))] text-[var(--semantic-brand)]"
        }`}
      >
        <Icon className="h-4 w-4" strokeWidth={1.8} />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-[var(--semantic-text-primary)] leading-snug">{label}</p>
        {sublabel ? (
          <p className="mt-0.5 text-xs text-[var(--semantic-text-muted)] leading-snug">{sublabel}</p>
        ) : null}
      </div>
      <ArrowRight
        className="h-4 w-4 shrink-0 text-[var(--semantic-text-muted)] opacity-0 transition-opacity group-hover:opacity-100"
        strokeWidth={1.8}
      />
    </Link>
  );
}

function SmallLinkRow({ href, icon: Icon, label, onClick }: { href: string; icon: React.ElementType; label: string; onClick?: () => void }) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="group flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium text-[var(--semantic-text-secondary)] transition-colors hover:bg-[color-mix(in_srgb,var(--semantic-brand)_5%,var(--semantic-surface))] hover:text-[var(--semantic-brand)]"
    >
      <Icon className="h-3.5 w-3.5 shrink-0 opacity-60 group-hover:opacity-100" strokeWidth={1.8} />
      <span>{label}</span>
      <ChevronRight className="ml-auto h-3.5 w-3.5 opacity-0 transition-opacity group-hover:opacity-60" strokeWidth={1.8} />
    </Link>
  );
}

export function LessonNextStepsPanel({
  pathwayId,
  topicSlug,
  topicLabel,
  nextLesson,
  flashcardsHref,
  practiceQuestionsHref,
  allLessonsHref,
  practiceExamsHref,
  catHref,
  questionBankHref,
  studyPlanHref = "/app/exam-plan",
  blogHref = "/blog",
  hasAccess,
}: LessonNextStepsPanelProps) {
  const track = (variant: string, dest: string) =>
    trackProductEvent(PH.conversionCtaClick, {
      pathway_id: pathwayId,
      surface: "app_lesson",
      contextual_variant: variant,
      destination_kind: dest,
    });

  const topicDisplay = topicLabel ?? topicSlug?.replace(/-/g, " ") ?? null;

  return (
    <div className="mt-10 space-y-8 border-t border-[var(--semantic-border-soft)] pt-8">
      {/* ── Section 1: Continue Studying ── */}
      <section aria-labelledby="next-steps-continue">
        <SectionHeader
          eyebrow="1 of 3"
          title="Continue Studying"
          description="Keep your momentum — choose the most relevant next step."
        />
        <div className="grid gap-3 sm:grid-cols-2">
          {nextLesson ? (
            <ActionCard
              href={nextLesson.href}
              icon={BookOpen}
              label={nextLesson.title}
              sublabel={nextLesson.reason ?? "Recommended next lesson"}
              variant="primary"
              onClick={() => track("post_lesson_next_lesson", "lesson")}
            />
          ) : (
            <ActionCard
              href={allLessonsHref}
              icon={BookOpen}
              label="Browse All Lessons"
              sublabel="Explore the full lesson library for this pathway"
              variant="primary"
              onClick={() => track("post_lesson_all_lessons", "lessons")}
            />
          )}
          <ActionCard
            href={flashcardsHref}
            icon={Layers}
            label={topicDisplay ? `Flashcards — ${topicDisplay}` : "Review Flashcards"}
            sublabel="Active recall on this topic"
            onClick={() => track("post_lesson_flashcards", "flashcards")}
          />
          <ActionCard
            href={practiceQuestionsHref}
            icon={ClipboardList}
            label={topicDisplay ? `Practice Questions — ${topicDisplay}` : "Practice Related Questions"}
            sublabel="Test your understanding"
            onClick={() => track("post_lesson_practice_questions", "questions")}
          />
          {catHref ? (
            <ActionCard
              href={catHref}
              icon={Brain}
              label="Take a Readiness Quiz"
              sublabel="Adaptive CAT — identify your weak areas"
              onClick={() => track("post_lesson_readiness_quiz", "cat")}
            />
          ) : null}
        </div>
      </section>

      {/* ── Section 2: Practice This Topic ── */}
      {hasAccess ? (
        <section aria-labelledby="next-steps-practice">
          <SectionHeader
            eyebrow="2 of 3"
            title="Practice This Topic"
            description="Reinforce learning with targeted practice and active recall."
          />
          <div className="grid gap-3 sm:grid-cols-3">
            <ActionCard
              href={flashcardsHref}
              icon={Layers}
              label="Flashcards"
              sublabel="Same topic"
              variant="muted"
              onClick={() => track("post_lesson_topic_flashcards", "flashcards")}
            />
            <ActionCard
              href={practiceQuestionsHref}
              icon={ClipboardList}
              label="Topic Practice Tests"
              sublabel="Targeted questions"
              variant="muted"
              onClick={() => track("post_lesson_topic_practice", "questions")}
            />
            {catHref ? (
              <ActionCard
                href={catHref}
                icon={Brain}
                label="Adaptive Practice"
                sublabel="Weak areas only"
                variant="muted"
                onClick={() => track("post_lesson_adaptive_practice", "cat")}
              />
            ) : (
              <ActionCard
                href={questionBankHref}
                icon={BarChart2}
                label="Question Bank"
                sublabel="Full question library"
                variant="muted"
                onClick={() => track("post_lesson_question_bank", "questions")}
              />
            )}
          </div>
        </section>
      ) : null}

      {/* ── Section 3: Strengthen Readiness ── */}
      <section aria-labelledby="next-steps-readiness">
        <SectionHeader
          eyebrow="3 of 3"
          title="Strengthen Readiness"
          description="Build broader exam confidence with these supporting tools."
        />
        <div className="rounded-xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-panel-muted)] divide-y divide-[var(--semantic-border-soft)]">
          <SmallLinkRow
            href={questionBankHref}
            icon={BarChart2}
            label="Question Bank Overview"
            onClick={() => track("post_lesson_question_bank_overview", "questions")}
          />
          <SmallLinkRow
            href={practiceExamsHref}
            icon={GraduationCap}
            label="Practice Exams"
            onClick={() => track("post_lesson_practice_exams", "practice_tests")}
          />
          <SmallLinkRow
            href="/tools"
            icon={Stethoscope}
            label="Clinical Tools (free)"
            onClick={() => track("post_lesson_clinical_tools", "tools")}
          />
          {hasAccess ? null : (
            <SmallLinkRow
              href={studyPlanHref}
              icon={FileText}
              label="Study Plans & Pricing"
              onClick={() => track("post_lesson_study_plan", "pricing")}
            />
          )}
          <SmallLinkRow
            href={blogHref}
            icon={BookOpen}
            label="Blog — Clinical Insights"
            onClick={() => track("post_lesson_blog", "blog")}
          />
        </div>
      </section>

      {/* ── Keep Building Readiness CTA ── */}
      {hasAccess && (
        <div className="flex items-center justify-between gap-4 rounded-xl border border-[var(--semantic-border-soft)] bg-[color-mix(in_srgb,var(--semantic-brand)_4%,var(--semantic-surface))] px-5 py-4">
          <div>
            <p className="text-sm font-semibold text-[var(--semantic-text-primary)]">Keep building readiness</p>
            <p className="mt-0.5 text-xs text-[var(--semantic-text-secondary)]">
              Pair reading with structured lessons, then move into the question bank or practice exams on your pathway.
            </p>
          </div>
          <Link
            href={studyPlanHref}
            className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-[var(--semantic-brand)] px-4 py-2 text-xs font-semibold text-[var(--semantic-brand)] transition-colors hover:bg-[var(--semantic-brand)] hover:text-white"
            onClick={() => track("post_lesson_view_study_plan", "study_plan")}
          >
            <FileText className="h-3.5 w-3.5" strokeWidth={1.8} />
            View Study Plan
          </Link>
        </div>
      )}

      {/* ── Editorial Footer ── */}
      <footer className="border-t border-[var(--semantic-border-soft)] pt-5 text-xs text-[var(--semantic-text-muted)]">
        <p className="leading-relaxed">
          NurseNest lessons are written for exam preparation, reviewed under our editorial standards, and updated when
          exam emphasis changes.
        </p>
        <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1">
          <Link href="/editorial-policy" className="hover:text-[var(--semantic-brand)] hover:underline">
            Editorial policy
          </Link>
          <Link href="/content-review-policy" className="hover:text-[var(--semantic-brand)] hover:underline">
            Content review policy
          </Link>
          <Link href="/disclaimer" className="hover:text-[var(--semantic-brand)] hover:underline">
            Disclaimer
          </Link>
        </div>
      </footer>
    </div>
  );
}
