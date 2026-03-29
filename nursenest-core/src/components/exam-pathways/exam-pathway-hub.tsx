import Link from "next/link";
import { BreadcrumbJsonLd } from "@/components/seo/breadcrumb-json-ld";
import { BreadcrumbTrail } from "@/components/seo/breadcrumb-trail";
import type { ExamPathwayDefinition } from "@/lib/exam-pathways/types";
import { buildExamPathwayPath } from "@/lib/exam-pathways/exam-product-registry";
import { pathwayOverviewBreadcrumbs } from "@/lib/seo/pathway-breadcrumbs";

export function ExamPathwayHub({ pathway }: { pathway: ExamPathwayDefinition }) {
  const isWaitlist = pathway.acquisitionMode === "waitlist" || pathway.status === "upcoming";
  const { crumbs, schemaItems } = pathwayOverviewBreadcrumbs(pathway);

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <BreadcrumbJsonLd items={schemaItems} />
      <div className="mb-6">
        <BreadcrumbTrail items={crumbs} />
      </div>
      <p className="text-xs font-semibold uppercase tracking-wide text-primary">
        {pathway.countrySlug === "canada" ? "Canada" : "United States"} · {pathway.boardLabel ?? pathway.roleTrack.toUpperCase()}
      </p>
      <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-[var(--theme-heading-text)]">{pathway.displayName}</h1>
      <p className="mt-3 text-lg text-[var(--theme-muted-text)]">{pathway.seoDescription}</p>

      {pathway.status === "upcoming" ? (
        <aside className="nn-card mt-8 border-amber-200/80 bg-amber-50/60 p-4 text-sm text-foreground">
          <p className="font-semibold">Upcoming / transitioning pathway</p>
          <p className="mt-1 text-muted">
            Requirements and exam branding may change (especially Canadian NP licensure integration). This hub will stay updated—
            subscribe to product news or start with a related active track if you test sooner.
          </p>
        </aside>
      ) : null}

      <ul className="mt-10 grid gap-3 sm:grid-cols-2">
        <li>
          <Link
            href={buildExamPathwayPath(pathway, "pricing")}
            className="block rounded-xl border border-[var(--theme-card-border)] bg-card p-4 font-semibold shadow-sm hover:border-primary/30"
          >
            Pricing & plans →
          </Link>
        </li>
        <li>
          <Link
            href={buildExamPathwayPath(pathway, "lessons")}
            className="block rounded-xl border border-[var(--theme-card-border)] bg-card p-4 font-semibold shadow-sm hover:border-primary/30"
          >
            Exam lessons →
          </Link>
        </li>
        <li>
          <Link
            href={buildExamPathwayPath(pathway, "questions")}
            className="block rounded-xl border border-[var(--theme-card-border)] bg-card p-4 font-semibold shadow-sm hover:border-primary/30"
          >
            Question bank hub →
          </Link>
        </li>
        <li>
          <Link href="/app/questions" className="block rounded-xl border border-[var(--theme-card-border)] bg-card p-4 text-sm font-semibold shadow-sm hover:border-primary/30">
            Open app question bank (sign in) →
          </Link>
        </li>
        <li>
          <Link href="/app/exams" className="block rounded-xl border border-[var(--theme-card-border)] bg-card p-4 text-sm font-semibold shadow-sm hover:border-primary/30">
            Timed practice exams (sign in) →
          </Link>
        </li>
      </ul>

      <div className="mt-10 rounded-xl border border-border bg-[var(--theme-muted-surface)] p-4 text-sm text-muted">
        <p>
          Content and checkout use your <strong className="text-foreground">{pathway.shortName}</strong> track with NurseNest’s{" "}
          <strong className="text-foreground">{pathway.stripeTier}</strong> tier for{" "}
          <strong className="text-foreground">{pathway.countryCode}</strong>. NP specialties share the NP subscription tier until
          per-pathway billing is enabled—your active track should be selected in your profile (learner pathway).
        </p>
        {isWaitlist ? (
          <Link href="/signup" className="mt-3 inline-block font-semibold text-primary">
            Join or sign in →
          </Link>
        ) : (
          <Link href="/pricing" className="mt-3 inline-block font-semibold text-primary">
            View all plans →
          </Link>
        )}
      </div>
    </div>
  );
}
