import Link from "next/link";
import { BookOpen, Brain, Zap, CheckCircle, Users, ArrowLeft, ArrowRight } from "lucide-react";
import type { ExamPathwayDefinition } from "@/lib/exam-pathways/types";
import type { PathwayQuestionBankSnapshot } from "@/lib/exam-pathways/pathway-question-bank-snapshot";
import type { PathwayLessonRecord } from "@/lib/lessons/pathway-lesson-types";
import { NpQuestionsHubBoardLinks } from "@/components/exam-pathways/np-questions-hub-board-links";
import { PathwayQuestionHubRelatedLessons } from "@/components/pathway-lessons/pathway-question-hub-related-lessons";
import { ContentEmptyState } from "@/components/ui/content-empty-state";
import { HUB } from "@/lib/marketing/marketing-entry-routes";
import type { NpQuestionsHubBoardLinkContext } from "@/components/exam-pathways/np-questions-hub-board-links";

function formatCount(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1).replace(/\.0$/, "")}k+`;
  return String(n);
}

function StatTile({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent: "success" | "info" | "brand";
}) {
  const accentVar =
    accent === "success"
      ? "var(--semantic-success)"
      : accent === "info"
        ? "var(--semantic-info)"
        : "var(--semantic-brand)";

  return (
    <div className="nn-metric-tile flex flex-col gap-1 px-4 py-3 sm:px-5 sm:py-4" style={{ "--tile-accent": accentVar } as React.CSSProperties}>
      <span
        className="text-2xl font-extrabold tabular-nums leading-none"
        style={{ color: accentVar }}
      >
        {value}
      </span>
      <span className="text-xs font-medium text-[var(--semantic-text-secondary)]">{label}</span>
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
      ? "nn-semantic-inset nn-semantic-inset--positive"
      : variant === "cool"
        ? "nn-semantic-inset nn-semantic-inset--cool"
        : variant === "warm"
          ? "nn-semantic-inset nn-semantic-inset--warm"
          : "nn-semantic-inset";

  const iconColor =
    variant === "positive"
      ? "text-[var(--semantic-success)]"
      : variant === "cool"
        ? "text-[var(--semantic-info)]"
        : variant === "warm"
          ? "text-[var(--semantic-warning)]"
          : "text-[var(--semantic-brand)]";

  return (
    <div className={`${cls} flex flex-col gap-2 p-4 sm:p-5`}>
      <div className={`flex h-8 w-8 items-center justify-center rounded-lg bg-white/60 ${iconColor}`}>
        <Icon className="h-4 w-4" />
      </div>
      <p className="text-sm font-semibold text-[var(--semantic-text-primary)]">{title}</p>
      <p className="text-sm leading-relaxed text-[var(--semantic-text-secondary)]">{body}</p>
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
    <div
      className="flex flex-1 flex-col gap-3 rounded-2xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-5 shadow-[var(--semantic-shadow-soft)] sm:p-6"
      style={{ borderTop: `3px solid ${accentColor}` }}
    >
      <div
        className="flex h-10 w-10 items-center justify-center rounded-xl"
        style={{ background: `color-mix(in srgb, ${accentColor} 14%, var(--semantic-surface))` }}
      >
        <div style={{ color: accentColor }}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
      <div className="flex flex-col gap-1">
        <p className="text-sm font-bold text-[var(--semantic-text-primary)]">{title}</p>
        <p className="text-sm leading-relaxed text-[var(--semantic-text-secondary)]">{description}</p>
      </div>
      <div className="mt-auto pt-1">
        <Link
          href={ctaHref}
          className={`inline-flex min-h-[40px] items-center justify-center rounded-full px-5 py-2 text-sm font-semibold transition-opacity ${btnBg}`}
        >
          {ctaLabel}
        </Link>
      </div>
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
  const totalQuestions = snap ? formatCount(snap.pathwayScopedCount) : "–";
  const catEligible = snap ? formatCount(snap.adaptiveEligibleCount) : "–";
  const totalLessons = typeof lessonCount === "number" ? String(lessonCount) : "–";
  const hasQuestions = snap ? snap.pathwayScopedCount > 0 : true;

  return (
    <div className="space-y-10">
      {/* ── Hero ─────────────────────────────────────────── */}
      <section className="nn-learner-page-hero">
        {isTopicNarrowed ? (
          <div className="mb-4 inline-flex items-center gap-1.5 rounded-full border border-[var(--semantic-border-soft)] bg-white/50 px-3 py-1 text-xs font-semibold text-[var(--semantic-brand)]">
            Narrowed to: {displayTopicLabel}
          </div>
        ) : null}

        <h1 className="text-2xl font-extrabold leading-tight text-[var(--theme-heading-text)] sm:text-3xl">
          {pathway.shortName} {countryLabel} practice questions
        </h1>
        <p className="mt-2 max-w-xl text-sm leading-relaxed text-[var(--semantic-text-secondary)] sm:text-base">
          {isTopicNarrowed
            ? `Items scoped to ${displayTopicLabel} within ${pathway.shortName} and ${examName}. Sign in to run the same filter in the app.`
            : `Clinical vignettes and rationales written for ${examName} — same scope and language as test day for your ${countryLabel} track.`}
        </p>

        {/* Stat tiles */}
        <div className="mt-5 grid grid-cols-3 gap-3">
          <StatTile label="Practice questions" value={totalQuestions} accent="brand" />
          <StatTile label="Clinical lessons" value={totalLessons} accent="info" />
          <StatTile label="CAT-eligible" value={catEligible} accent="success" />
        </div>

        {/* CTAs */}
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <Link
            href={appQuestionsScoped}
            className="inline-flex min-h-[44px] items-center justify-center rounded-full bg-primary px-7 py-2.5 text-sm font-bold text-primary-foreground shadow-sm transition-opacity hover:opacity-90"
          >
            Start practice
          </Link>
          <Link
            href={catHref}
            className="inline-flex min-h-[44px] items-center justify-center rounded-full border border-[var(--semantic-border-soft)] bg-white/60 px-6 py-2.5 text-sm font-semibold text-[var(--semantic-text-primary)] hover:bg-white/80"
          >
            Open CAT intro
          </Link>
          <Link
            href={lessonsHref}
            className="inline-flex min-h-[44px] items-center justify-center rounded-full border border-[var(--semantic-border-soft)] bg-white/60 px-6 py-2.5 text-sm font-semibold text-[var(--semantic-text-primary)] hover:bg-white/80"
          >
            View lessons
          </Link>
        </div>
      </section>

      {/* ── Zero-question empty state ─────────────────────── */}
      {snap && !hasQuestions ? (
        <ContentEmptyState
          variant="questions"
          primaryCta={{ label: "Start available topics", href: lessonsHref }}
          secondaryCtas={[
            { label: "Try CAT exam", href: catHref },
            { label: "Create account", href: "/signup", variant: "ghost" },
          ]}
        />
      ) : null}

      {/* ── Info cards ───────────────────────────────────── */}
      {!isTopicNarrowed ? (
        <section>
          <h2 className="mb-4 text-base font-bold text-[var(--semantic-text-primary)]">
            What you get here
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <InfoCard
              icon={CheckCircle}
              variant="positive"
              title="What this bank includes"
              body={`Board-style vignettes scoped to ${examName} and your ${countryLabel} region. Every item includes a rationale and distractor explanation.`}
            />
            <InfoCard
              icon={Zap}
              variant="cool"
              title="Best way to start"
              body="Jump into a quick practice set right from this page, or sign in for a full session that tracks your history and filters by topic."
            />
            <InfoCard
              icon={Brain}
              variant="muted"
              title="Adaptive practice available"
              body={`${catEligible !== "–" ? `${catEligible} items are` : "Items are"} CAT-eligible — the adaptive engine adjusts difficulty based on your answers, mirroring computerized adaptive testing.`}
            />
            <InfoCard
              icon={Users}
              variant="warm"
              title="Signed-in experience"
              body={`When you're signed in, practice stays locked to ${pathway.shortName}. Rationales, filters, and topic drill all stay in scope for your plan.`}
            />
          </div>
        </section>
      ) : null}

      {/* ── Topic-narrowed aside ──────────────────────────── */}
      {isTopicNarrowed ? (
        <>
          <aside className="nn-semantic-inset nn-semantic-inset--cool p-4 sm:p-5">
            <p className="text-sm font-semibold text-[var(--semantic-text-primary)]">
              Narrowed to one clinical topic
            </p>
            <p className="mt-1 text-sm text-[var(--semantic-text-secondary)]">
              You landed here from a lesson or topic link. Open the full hub anytime to see every topic in this pathway.
            </p>
            <Link
              href={questionsHubPath}
              className="mt-3 inline-flex text-sm font-semibold text-[var(--semantic-info)] underline underline-offset-2 hover:no-underline"
            >
              Clear topic — full practice hub
            </Link>
          </aside>
          <PathwayQuestionHubRelatedLessons
            topicLabel={displayTopicLabel}
            lessonsBasePath={lessonsHref}
            lessons={relatedLessonsForTopic}
          />
        </>
      ) : null}

      {/* ── NP board specialty links ──────────────────────── */}
      {pathway.roleTrack === "np" && boardLinkContext ? (
        <div className="rounded-2xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-4 sm:p-5">
          <NpQuestionsHubBoardLinks pathwayId={pathway.id} linkContext={boardLinkContext} />
        </div>
      ) : null}

      {/* ── Choose how to study ──────────────────────────── */}
      <section>
        <h2 className="mb-4 text-base font-bold text-[var(--semantic-text-primary)]">
          Choose how you want to study
        </h2>
        <div className="flex flex-col gap-4 sm:flex-row">
          <StudyModeCard
            icon={Zap}
            accentClass="success"
            title="Quick practice questions"
            description={`Run a fast set of ${pathway.shortName} items. No login required to browse — sign in to save progress.`}
            ctaLabel="Start items"
            ctaHref={appQuestionsScoped}
          />
          <StudyModeCard
            icon={BookOpen}
            accentClass="info"
            title="Full question bank session"
            description="Open the in-app bank with all filters and topic drill. Tracks rationale reads, correct rate, and topic gaps."
            ctaLabel="Open practice"
            ctaHref="/app/questions"
          />
          <StudyModeCard
            icon={Brain}
            accentClass="brand"
            title="CAT-style adaptive run"
            description="One question at a time, difficulty adjusts from your answers. Pathway-scoped pool, requires an active plan."
            ctaLabel="Open CAT intro"
            ctaHref={catHref}
          />
        </div>
      </section>

      {/* ── Bottom navigation ─────────────────────────────── */}
      <nav
        aria-label="Page navigation"
        className="rounded-2xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-5 sm:p-6"
      >
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <Link
            href={overviewHref}
            className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--semantic-text-primary)] hover:text-primary"
          >
            <ArrowLeft className="h-4 w-4 shrink-0" />
            <span>Previous: Exam overview</span>
          </Link>
          <Link
            href={lessonsHref}
            className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--semantic-text-primary)] hover:text-primary"
          >
            <span>Next: Clinical lessons</span>
            <ArrowRight className="h-4 w-4 shrink-0" />
          </Link>
        </div>
        <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 border-t border-[var(--semantic-border-soft)] pt-4 text-sm">
          <span className="text-xs font-semibold uppercase tracking-wide text-[var(--semantic-text-muted)]">
            Related:
          </span>
          <Link href={catHref} className="font-medium text-primary hover:underline">
            CAT prep for this pathway
          </Link>
          <Link href={HUB.practiceExams} className="font-medium text-primary hover:underline">
            Practice exams
          </Link>
          <Link href="/signup" className="font-medium text-primary hover:underline">
            Create account
          </Link>
        </div>
      </nav>
    </div>
  );
}
