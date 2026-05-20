import type React from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, BookOpen, Brain, CheckCircle, Users, Zap } from "lucide-react";
import type { ExamPathwayDefinition } from "@/lib/exam-pathways/types";
import type { PathwayQuestionBankSnapshot } from "@/lib/exam-pathways/pathway-question-bank-snapshot";
import type { PathwayLessonRecord } from "@/lib/lessons/pathway-lesson-types";
import { NpQuestionsHubBoardLinks } from "@/components/exam-pathways/np-questions-hub-board-links";
import { PathwayQuestionHubRelatedLessons } from "@/components/pathway-lessons/pathway-question-hub-related-lessons";
import { HUB } from "@/lib/marketing/marketing-entry-routes";
import type { NpQuestionsHubBoardLinkContext } from "@/components/exam-pathways/np-questions-hub-board-links";
import { CAT_MIN_COMPLETE_POOL } from "@/lib/practice-tests/cat-readiness-floor";

function formatCount(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1).replace(/\.0$/, "")}k+`;
  return String(n);
}

function cleanExamName(examName: string): string {
  return examName
    .replace(/NCLEX_RN/g, "NCLEX-RN")
    .replace(/NCLEX_PN/g, "NCLEX-PN")
    .replace(/\s*\/\s*(NCLEX-RN|NCLEX-PN)\s*/g, " / $1 ")
    .replace(/\b(NCLEX-RN)\s*\/\s*\1\b/g, "$1")
    .replace(/\b(NCLEX-PN)\s*\/\s*\1\b/g, "$1")
    .replace(/\s{2,}/g, " ")
    .trim();
}

function StatTile({
  label,
  value,
  helper,
  accent,
}: {
  label: string;
  value: string;
  helper?: string;
  accent: "success" | "info" | "brand";
}) {
  const accentVar =
    accent === "success"
      ? "var(--semantic-success)"
      : accent === "info"
        ? "var(--semantic-info)"
        : "var(--semantic-brand)";

  return (
    <div
      className="rounded-2xl border border-[var(--semantic-border-soft)] bg-white/80 px-4 py-4 shadow-sm ring-1 ring-white/70"
      style={{ borderTop: `3px solid ${accentVar}` }}
    >
      <span className="block text-2xl font-extrabold leading-none tabular-nums" style={{ color: accentVar }}>
        {value}
      </span>
      <span className="mt-1 block text-xs font-semibold uppercase tracking-wide text-[var(--semantic-text-primary)]">
        {label}
      </span>
      {helper ? (
        <span className="mt-1 block text-xs leading-relaxed text-[var(--semantic-text-muted)]">{helper}</span>
      ) : null}
    </div>
  );
}

function InfoCard({
  icon: Icon,
  title,
  body,
  variant,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  body: string;
  variant: "positive" | "cool" | "warm" | "muted";
}) {
  const cls =
    variant === "positive"
      ? "bg-[var(--semantic-panel-positive)]"
      : variant === "cool"
        ? "bg-[var(--semantic-panel-cool)]"
        : variant === "warm"
          ? "bg-[var(--semantic-panel-warm)]"
          : "bg-[var(--semantic-surface-muted)]";

  const iconColor =
    variant === "positive"
      ? "text-[var(--semantic-success)]"
      : variant === "cool"
        ? "text-[var(--semantic-info)]"
        : variant === "warm"
          ? "text-[var(--semantic-warning)]"
          : "text-[var(--semantic-brand)]";

  return (
    <div className={`${cls} rounded-2xl border border-[var(--semantic-border-soft)] p-5`}>
      <div className={`mb-3 flex h-9 w-9 items-center justify-center rounded-xl bg-white/70 ${iconColor}`}>
        <Icon className="h-4 w-4" />
      </div>
      <p className="text-sm font-bold text-[var(--semantic-text-primary)]">{title}</p>
      <p className="mt-1.5 text-sm leading-relaxed text-[var(--semantic-text-secondary)]">{body}</p>
    </div>
  );
}

function StudyModeCard({
  icon: Icon,
  title,
  description,
  ctaLabel,
  ctaHref,
  accentClass,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  ctaLabel: string;
  ctaHref: string;
  accentClass: "success" | "info" | "brand";
}) {
  const accentColor =
    accentClass === "success"
      ? "var(--semantic-success)"
      : accentClass === "info"
        ? "var(--semantic-info)"
        : "var(--semantic-brand)";

  const btnBg =
    accentClass === "success"
      ? "bg-[var(--semantic-success)] text-[var(--semantic-success-contrast)] hover:opacity-90"
      : accentClass === "info"
        ? "bg-[var(--semantic-info)] text-[var(--semantic-info-contrast)] hover:opacity-90"
        : "bg-primary text-primary-foreground hover:opacity-90";

  return (
    <div className="group flex flex-1 flex-col rounded-3xl border border-[var(--semantic-border-soft)] bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md sm:p-6">
      <div className="flex items-start gap-4">
        <div
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl"
          style={{
            background: `color-mix(in srgb, ${accentColor} 14%, white)`,
            color: accentColor,
          }}
        >
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <p className="text-base font-bold text-[var(--semantic-text-primary)]">{title}</p>
          <p className="mt-1 text-sm leading-relaxed text-[var(--semantic-text-secondary)]">{description}</p>
        </div>
      </div>
      <Link
        href={ctaHref}
        className={`mt-5 inline-flex min-h-[42px] items-center justify-center rounded-full px-5 py-2 text-sm font-bold transition ${btnBg}`}
      >
        {ctaLabel}
      </Link>
    </div>
  );
}

export function PathwayQuestionsHubView({
  pathway,
  questionSnapshot,
  lessonCount,
  isTopicNarrowed,
  displayTopicLabel,
  questionsHubPath,
  overviewHref,
  lessonsHref,
  catHref,
  appQuestionsScoped,
  countryLabel,
  examName,
  relatedLessonsForTopic,
  boardLinkContext,
}: {
  pathway: ExamPathwayDefinition;
  questionSnapshot?: PathwayQuestionBankSnapshot | null;
  lessonCount?: number;
  isTopicNarrowed: boolean;
  displayTopicLabel: string;
  questionsHubPath: string;
  overviewHref: string;
  lessonsHref: string;
  catHref: string;
  appQuestionsScoped: string;
  countryLabel: string;
  examName: string;
  relatedLessonsForTopic: PathwayLessonRecord[];
  boardLinkContext?: NpQuestionsHubBoardLinkContext;
}) {
  const snap = questionSnapshot?.status === "ok" ? questionSnapshot : null;
  const totalQuestions = snap ? formatCount(snap.pathwayScopedCount) : "—";
  const totalLessons = typeof lessonCount === "number" ? String(lessonCount) : "—";
  const hasQuestions = snap ? snap.pathwayScopedCount > 0 : false;
  const catPoolUsable = snap ? snap.adaptiveEligibleCount >= CAT_MIN_COMPLETE_POOL : false;
  const everyQuestionCatEligible = snap ? snap.adaptiveEligibleCount === snap.pathwayScopedCount && snap.pathwayScopedCount > 0 : false;
  const catEligibleValue = everyQuestionCatEligible ? "All" : snap ? formatCount(snap.adaptiveEligibleCount) : "—";
  const cleanName = cleanExamName(examName);

  return (
    <div className="space-y-9">
      <section className="overflow-hidden rounded-[2rem] border border-[var(--semantic-border-soft)] bg-gradient-to-br from-white via-[var(--semantic-surface)] to-[var(--semantic-panel-cool)] p-6 shadow-sm sm:p-8">
        {isTopicNarrowed ? (
          <div className="mb-4 inline-flex items-center gap-1.5 rounded-full border border-[var(--semantic-border-soft)] bg-white/80 px-3 py-1 text-xs font-semibold text-[var(--semantic-brand)]">
            Narrowed to {displayTopicLabel}
          </div>
        ) : null}

        <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
          <div>
            <Link
              href={overviewHref}
              className="mb-4 inline-flex items-center gap-2 text-sm font-semibold text-[var(--semantic-brand)] hover:underline"
            >
              <ArrowLeft className="h-4 w-4" /> {pathway.shortName} overview
            </Link>
            <h1 className="max-w-3xl text-3xl font-extrabold leading-tight tracking-tight text-[var(--theme-heading-text)] sm:text-4xl">
              {pathway.shortName} {countryLabel} practice questions
            </h1>
            <p className="mt-3 max-w-2xl text-base leading-relaxed text-[var(--semantic-text-secondary)]">
              {isTopicNarrowed
                ? `Practice ${displayTopicLabel} items within ${pathway.shortName}. Sign in to keep this same filter in your study dashboard.`
                : `Clinical vignettes, rationales, and exam-style practice scoped to ${cleanName} for the ${countryLabel} track.`}
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              {hasQuestions ? (
                <Link
                  href={appQuestionsScoped}
                  className="inline-flex min-h-[46px] items-center justify-center rounded-full bg-primary px-7 py-2.5 text-sm font-bold text-primary-foreground shadow-sm transition-opacity hover:opacity-90"
                >
                  Start practicing
                </Link>
              ) : (
                <Link
                  href={lessonsHref}
                  className="inline-flex min-h-[46px] items-center justify-center rounded-full bg-primary px-7 py-2.5 text-sm font-bold text-primary-foreground shadow-sm transition-opacity hover:opacity-90"
                >
                  View lessons
                </Link>
              )}
              {catPoolUsable ? (
                <Link
                  href={catHref}
                  className="inline-flex min-h-[46px] items-center justify-center rounded-full border border-[var(--semantic-border-soft)] bg-white/80 px-6 py-2.5 text-sm font-semibold text-[var(--semantic-text-primary)] hover:bg-white"
                >
                  Open CAT intro
                </Link>
              ) : null}
              <Link
                href={lessonsHref}
                className="inline-flex min-h-[46px] items-center justify-center rounded-full border border-[var(--semantic-border-soft)] bg-white/60 px-6 py-2.5 text-sm font-semibold text-[var(--semantic-text-primary)] hover:bg-white"
              >
                Browse lessons
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 lg:grid-cols-1">
            {snap && snap.pathwayScopedCount > 0 ? (
              <StatTile label="Practice questions" value={totalQuestions} accent="brand" helper="Pathway-scoped" />
            ) : null}
            <StatTile label="Clinical lessons" value={totalLessons} accent="info" helper="Available now" />
            {snap && snap.adaptiveEligibleCount > 0 ? (
              <StatTile label="CAT-ready pool" value={catEligibleValue} accent="success" helper={everyQuestionCatEligible ? "All scored items" : "Adaptive-eligible"} />
            ) : null}
          </div>
        </div>
      </section>

      {snap && !hasQuestions ? (
        <div className="rounded-3xl border border-[color-mix(in_srgb,var(--semantic-info)_22%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-panel-cool)_88%,var(--semantic-surface))] p-5 shadow-sm sm:p-6">
          <p className="text-sm font-bold text-[var(--semantic-text-primary)]">
            Start with lessons while this bank expands
          </p>
          <p className="mt-2 text-sm leading-relaxed text-[var(--semantic-text-secondary)]">
            This pathway is live, but the scored linear question count is still ramping. Use lessons and adaptive study routes first; question counts will appear as publishing expands.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link href={lessonsHref} className="inline-flex min-h-11 items-center rounded-full bg-[var(--semantic-brand)] px-5 text-sm font-semibold text-[var(--semantic-brand-contrast)]">
              Browse lessons
            </Link>
            {catPoolUsable ? (
              <Link href={catHref} className="inline-flex min-h-11 items-center rounded-full border border-[var(--semantic-border-soft)] bg-white px-5 text-sm font-semibold text-[var(--semantic-text-primary)] shadow-sm">
                Try CAT exam
              </Link>
            ) : null}
            <Link href="/signup" className="inline-flex min-h-11 items-center rounded-full px-3 text-sm font-semibold text-[var(--semantic-brand)] underline underline-offset-2">
              Create account
            </Link>
          </div>
        </div>
      ) : null}

      {!isTopicNarrowed ? (
        <section className="rounded-3xl border border-[var(--semantic-border-soft)] bg-white p-5 shadow-sm sm:p-6">
          <div className="mb-5">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--semantic-brand)]">What is included</p>
            <h2 className="mt-1 text-xl font-extrabold text-[var(--semantic-text-primary)]">Clean exam prep, not a generic question dump</h2>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <InfoCard
              icon={CheckCircle}
              variant="positive"
              title="Scoped question bank"
              body={`Board-style vignettes written for ${cleanName} and your ${countryLabel} region. Each item includes a rationale and distractor explanation.`}
            />
            <InfoCard
              icon={Zap}
              variant="cool"
              title="Fast entry point"
              body="Start with a short practice set, then move into a full tracked session when you want analytics and topic filters."
            />
            <InfoCard
              icon={Brain}
              variant="muted"
              title={catPoolUsable ? "Adaptive CAT available" : "Adaptive CAT pathway"}
              body={
                catPoolUsable
                  ? everyQuestionCatEligible
                    ? "The full scored pool is CAT-ready, so adaptive sessions can adjust difficulty from your answer pattern."
                    : `${catEligibleValue} items are CAT-ready for adaptive sessions that adjust difficulty from your answers.`
                  : "CAT-style runs need a larger completed adaptive pool. Use linear practice and lessons until this pathway reaches the readiness floor."
              }
            />
            <InfoCard
              icon={Users}
              variant="warm"
              title="Signed-in continuity"
              body={`When you sign in, practice stays locked to ${pathway.shortName}. Rationales, filters, and topic drill stay inside your plan scope.`}
            />
          </div>
        </section>
      ) : null}

      {isTopicNarrowed ? (
        <>
          <aside className="rounded-3xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-panel-cool)] p-5 sm:p-6">
            <p className="text-sm font-bold text-[var(--semantic-text-primary)]">Narrowed to one clinical topic</p>
            <p className="mt-1 text-sm text-[var(--semantic-text-secondary)]">
              You landed here from a lesson or topic link. Open the full hub anytime to see every topic in this pathway.
            </p>
            <Link href={questionsHubPath} className="mt-3 inline-flex text-sm font-semibold text-[var(--semantic-info)] underline underline-offset-2 hover:no-underline">
              Clear topic — full practice hub
            </Link>
          </aside>
          <PathwayQuestionHubRelatedLessons topicLabel={displayTopicLabel} lessonsBasePath={lessonsHref} lessons={relatedLessonsForTopic} />
        </>
      ) : null}

      {pathway.roleTrack === "np" && boardLinkContext ? (
        <div className="rounded-3xl border border-[var(--semantic-border-soft)] bg-white p-5 shadow-sm sm:p-6">
          <NpQuestionsHubBoardLinks pathwayId={pathway.id} linkContext={boardLinkContext} />
        </div>
      ) : null}

      <section>
        <div className="mb-4 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--semantic-brand)]">Start studying</p>
            <h2 className="text-xl font-extrabold text-[var(--semantic-text-primary)]">Choose your next step</h2>
          </div>
        </div>
        <div className="grid gap-4 lg:grid-cols-3">
          {hasQuestions ? (
            <>
              <StudyModeCard
                icon={Zap}
                accentClass="success"
                title="Quick practice"
                description={`Run a focused set of ${pathway.shortName} items and jump straight into rationales.`}
                ctaLabel="Start items"
                ctaHref={appQuestionsScoped}
              />
              <StudyModeCard
                icon={BookOpen}
                accentClass="info"
                title="Full session"
                description="Open the in-app bank with all filters, topic drill, rationale tracking, and performance history."
                ctaLabel="Open practice"
                ctaHref={appQuestionsScoped}
              />
            </>
          ) : (
            <StudyModeCard
              icon={BookOpen}
              accentClass="info"
              title="Clinical lessons"
              description="Use structured objectives and lesson links while the scored question bank for this pathway grows."
              ctaLabel="View lessons"
              ctaHref={lessonsHref}
            />
          )}
          {catPoolUsable ? (
            <StudyModeCard
              icon={Brain}
              accentClass="brand"
              title="Adaptive CAT"
              description="One question at a time. Difficulty adjusts from your answers using the pathway-scoped pool."
              ctaLabel="Open CAT intro"
              ctaHref={catHref}
            />
          ) : null}
        </div>
      </section>

      <nav aria-label="Page navigation" className="rounded-3xl border border-[var(--semantic-border-soft)] bg-white p-5 shadow-sm sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <Link href={overviewHref} className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--semantic-text-primary)] hover:text-primary">
            <ArrowLeft className="h-4 w-4 shrink-0" />
            <span>Previous: Exam overview</span>
          </Link>
          <Link href={lessonsHref} className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--semantic-text-primary)] hover:text-primary">
            <span>Next: Clinical lessons</span>
            <ArrowRight className="h-4 w-4 shrink-0" />
          </Link>
        </div>
        <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 border-t border-[var(--semantic-border-soft)] pt-4 text-sm">
          <span className="text-xs font-bold uppercase tracking-wide text-[var(--semantic-text-muted)]">Related</span>
          {catPoolUsable ? (
            <Link href={catHref} className="font-medium text-primary hover:underline">CAT prep</Link>
          ) : null}
          <Link href={HUB.practiceExams} className="font-medium text-primary hover:underline">Practice exams</Link>
          <Link href="/signup" className="font-medium text-primary hover:underline">Create account</Link>
        </div>
      </nav>
    </div>
  );
}
