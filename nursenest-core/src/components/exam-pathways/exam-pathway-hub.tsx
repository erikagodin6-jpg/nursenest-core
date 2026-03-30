import Link from "next/link";
import { ArrowRight, BookOpen, ClipboardList, GraduationCap, LayoutList } from "lucide-react";
import { BreadcrumbJsonLd } from "@/components/seo/breadcrumb-json-ld";
import { BreadcrumbTrail } from "@/components/seo/breadcrumb-trail";
import { FaqJsonLd } from "@/components/seo/faq-json-ld";
import type { ExamPathwayDefinition } from "@/lib/exam-pathways/types";
import { buildExamPathwayPath } from "@/lib/exam-pathways/exam-product-registry";
import { pathwayOverviewBreadcrumbs } from "@/lib/seo/pathway-breadcrumbs";
import { pathwayHubFaqSchema } from "@/lib/seo/pathway-hub-faq-schema";

export function ExamPathwayHub({ pathway }: { pathway: ExamPathwayDefinition }) {
  const isWaitlist = pathway.acquisitionMode === "waitlist" || pathway.status === "upcoming";
  const { crumbs, schemaItems } = pathwayOverviewBreadcrumbs(pathway);
  const questionsHref = buildExamPathwayPath(pathway, "questions");
  const lessonsHref = buildExamPathwayPath(pathway, "lessons");
  const pricingHref = buildExamPathwayPath(pathway, "pricing");
  const countryLine =
    pathway.countrySlug === "canada" ? "Canada" : "United States";

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:py-14">
      <BreadcrumbJsonLd items={schemaItems} />
      <FaqJsonLd items={pathwayHubFaqSchema(pathway)} />
      <div className="mb-8">
        <BreadcrumbTrail items={crumbs} />
      </div>
      <p className="text-xs font-semibold uppercase tracking-wide text-primary">
        {countryLine} · {pathway.boardLabel ?? pathway.roleTrack.toUpperCase()}
      </p>
      <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-[var(--theme-heading-text)] sm:text-4xl">
        {pathway.displayName}
      </h1>
      <p className="mt-4 max-w-2xl text-base leading-relaxed text-[var(--theme-muted-text)] sm:text-lg">{pathway.seoDescription}</p>

      {pathway.status === "upcoming" ? (
        <aside className="nn-card mt-8 border-amber-200/80 bg-amber-50/60 p-4 text-sm text-foreground">
          <p className="font-semibold">Upcoming or transitioning pathway</p>
          <p className="mt-1 text-[var(--theme-muted-text)]">
            Exam branding and registration rules can change (especially Canadian NP integration). This hub stays updated—join the list or
            start from an active track if you test sooner.
          </p>
        </aside>
      ) : null}

      <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
        <Link
          href="/signup"
          className="inline-flex min-h-[52px] w-full items-center justify-center rounded-full bg-primary px-8 py-3 text-base font-semibold text-primary-foreground shadow-sm transition hover:brightness-110 sm:w-auto sm:min-h-[56px]"
        >
          {isWaitlist ? "Join or sign in" : "Create free account"}
          <ArrowRight className="ml-2 h-5 w-5" />
        </Link>
        <Link
          href={questionsHref}
          className="inline-flex min-h-[52px] w-full items-center justify-center rounded-full border-2 border-primary/35 bg-primary/5 px-8 py-3 text-base font-semibold text-primary transition hover:bg-primary/10 sm:w-auto sm:min-h-[56px]"
        >
          Try {pathway.shortName} questions
        </Link>
        <Link
          href={pricingHref}
          className="inline-flex min-h-[48px] w-full items-center justify-center rounded-full border border-[var(--theme-input-border)] px-6 py-2.5 text-sm font-semibold text-[var(--theme-heading-text)] hover:bg-[var(--theme-muted-surface)] sm:w-auto"
        >
          Plans & pricing
        </Link>
      </div>

      <h2 className="mt-14 text-lg font-bold text-[var(--theme-heading-text)] sm:text-xl">Everything for this exam in one place</h2>
      <p className="mt-2 text-sm text-[var(--theme-muted-text)]">
        Same pathway everywhere below—so your bank, lessons, and checkout stay aligned to {pathway.shortName}.
      </p>

      <ul className="mt-6 grid gap-4 sm:grid-cols-2">
        <li>
          <Link
            href={questionsHref}
            className="flex h-full flex-col rounded-2xl border border-[var(--theme-card-border)] bg-card p-5 shadow-sm transition hover:border-primary/30 hover:shadow-[var(--shadow-card)]"
          >
            <LayoutList className="h-5 w-5 text-primary" aria-hidden />
            <span className="mt-3 text-base font-bold text-[var(--theme-heading-text)]">Question bank hub</span>
            <span className="mt-2 text-sm text-[var(--theme-body-text)]">
              Topic runs, rationales, and pathway filters—start here if you only have ten minutes.
            </span>
            <span className="mt-4 inline-flex items-center text-sm font-semibold text-primary">
              Open bank
              <ArrowRight className="ml-1 h-4 w-4" />
            </span>
          </Link>
        </li>
        <li>
          <Link
            href={lessonsHref}
            className="flex h-full flex-col rounded-2xl border border-[var(--theme-card-border)] bg-card p-5 shadow-sm transition hover:border-primary/30 hover:shadow-[var(--shadow-card)]"
          >
            <BookOpen className="h-5 w-5 text-primary" aria-hidden />
            <span className="mt-3 text-base font-bold text-[var(--theme-heading-text)]">Exam lessons</span>
            <span className="mt-2 text-sm text-[var(--theme-body-text)]">
              Structured hubs for the blueprint areas that show up most on your form of the exam.
            </span>
            <span className="mt-4 inline-flex items-center text-sm font-semibold text-primary">
              Open lessons
              <ArrowRight className="ml-1 h-4 w-4" />
            </span>
          </Link>
        </li>
        <li>
          <Link
            href={pricingHref}
            className="flex h-full flex-col rounded-2xl border border-[var(--theme-card-border)] bg-card p-5 shadow-sm transition hover:border-primary/30 hover:shadow-[var(--shadow-card)]"
          >
            <ClipboardList className="h-5 w-5 text-primary" aria-hidden />
            <span className="mt-3 text-base font-bold text-[var(--theme-heading-text)]">Pricing & plans</span>
            <span className="mt-2 text-sm text-[var(--theme-body-text)]">
              See the NurseNest tier for this pathway in {pathway.countryCode}. NP specialties may share the NP tier until per-pathway
              billing ships.
            </span>
            <span className="mt-4 inline-flex items-center text-sm font-semibold text-primary">
              Compare plans
              <ArrowRight className="ml-1 h-4 w-4" />
            </span>
          </Link>
        </li>
        <li>
          <Link
            href="/app/exams"
            className="flex h-full flex-col rounded-2xl border border-[var(--theme-card-border)] bg-card p-5 shadow-sm transition hover:border-primary/30 hover:shadow-[var(--shadow-card)]"
          >
            <GraduationCap className="h-5 w-5 text-primary" aria-hidden />
            <span className="mt-3 text-base font-bold text-[var(--theme-heading-text)]">Timed practice exams</span>
            <span className="mt-2 text-sm text-[var(--theme-body-text)]">
              Full-length and half-length mocks live in the app after sign-in—use them once your category scores stabilize.
            </span>
            <span className="mt-4 inline-flex items-center text-sm font-semibold text-primary">
              Go to exams
              <ArrowRight className="ml-1 h-4 w-4" />
            </span>
          </Link>
        </li>
      </ul>

      <h2 className="mt-14 text-lg font-bold text-[var(--theme-heading-text)] sm:text-xl">Already studying inside NurseNest?</h2>
      <ul className="mt-4 grid gap-3 sm:grid-cols-2">
        <li>
          <Link
            href="/app/questions"
            className="block rounded-xl border border-[var(--theme-card-border)] bg-[var(--theme-muted-surface)] px-4 py-3 text-sm font-semibold text-[var(--theme-heading-text)] hover:border-primary/25"
          >
            In-app question bank (sign in) →
          </Link>
        </li>
        <li>
          <Link
            href="/exam-lessons"
            className="block rounded-xl border border-[var(--theme-card-border)] bg-[var(--theme-muted-surface)] px-4 py-3 text-sm font-semibold text-[var(--theme-heading-text)] hover:border-primary/25"
          >
            All exam lesson hubs →
          </Link>
        </li>
      </ul>

      <div className="mt-12 rounded-2xl border border-[var(--theme-card-border)] bg-[var(--theme-muted-surface)] p-5 text-sm text-[var(--theme-body-text)]">
        <p>
          Checkout and content entitlements use your <strong className="text-[var(--theme-heading-text)]">{pathway.shortName}</strong> track with
          NurseNest&apos;s <strong className="text-[var(--theme-heading-text)]">{pathway.stripeTier}</strong> tier for{" "}
          <strong className="text-[var(--theme-heading-text)]">{pathway.countryCode}</strong>. Pick the correct pathway in your profile so
          lessons and banks stay exam-specific.
        </p>
        {isWaitlist ? (
          <Link href="/signup" className="mt-4 inline-flex items-center font-semibold text-primary">
            Join or sign in →
          </Link>
        ) : (
          <Link href="/pricing" className="mt-4 inline-flex items-center font-semibold text-primary">
            View all plans →
          </Link>
        )}
      </div>
    </div>
  );
}
