import type { Metadata } from "next";
import Link from "next/link";
import { unstable_cache } from "next/cache";
import { BreadcrumbJsonLd } from "@/components/seo/breadcrumb-json-ld";
import { BreadcrumbTrail } from "@/components/seo/breadcrumb-trail";
import { MarketingStudyCrossLinks } from "@/components/seo/marketing-study-cross-links";
import { buildExamPathwayPath, getExamPathwayById } from "@/lib/exam-pathways/exam-product-registry";
import { listPathwayIdsWithLessons } from "@/lib/lessons/pathway-lesson-loader";
import { examLessonsIndexBreadcrumbs } from "@/lib/seo/pathway-breadcrumbs";
import { absoluteUrl } from "@/lib/seo/site-origin";

export const revalidate = 600;

const cachedPathwayIdsWithLessons = unstable_cache(
  () => listPathwayIdsWithLessons(),
  ["exam-lessons-pathway-ids-v1"],
  { revalidate: 600, tags: ["pathway-lesson-index"] },
);

export const metadata: Metadata = {
  title: "Exam-scoped clinical lessons | NurseNest",
  description:
    "Browse nursing lessons by country, role, and exam track—REx-PN, NCLEX-RN, NCLEX-PN, NP specialties, and more. Previews are free; full depth unlocks with the matching subscription.",
  alternates: { canonical: absoluteUrl("/exam-lessons") },
  openGraph: {
    title: "Exam-scoped clinical lessons | NurseNest",
    url: absoluteUrl("/exam-lessons"),
    type: "website",
  },
};

export default async function ExamLessonsIndexPage() {
  const pathwayIds = await cachedPathwayIdsWithLessons();
  const rows = pathwayIds
    .map((id) => getExamPathwayById(id))
    .filter((p): p is NonNullable<typeof p> => !!p && p.status !== "hidden");

  const { crumbs, schemaItems } = examLessonsIndexBreadcrumbs();

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <BreadcrumbJsonLd items={schemaItems} />
      <div className="mb-6">
        <BreadcrumbTrail items={crumbs} />
      </div>
      <h1 className="text-3xl font-extrabold text-[var(--theme-heading-text)]">Lessons by exam pathway</h1>
      <p className="mt-3 text-[var(--theme-muted-text)]">
        Every hub below is scoped to one country + license track + exam—no mixed terminology, no cross-leak between NP
        specialties when you set your learner pathway. Start with a preview, then unlock the full lesson with a matching plan.
      </p>
      <div className="mt-6 flex flex-wrap gap-3">
        <Link
          href="/pricing"
          className="inline-flex min-h-[44px] items-center justify-center rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm transition hover:brightness-110"
        >
          View plans & pricing
        </Link>
        <Link
          href="/blog"
          className="inline-flex min-h-[44px] items-center justify-center rounded-full border border-[var(--theme-card-border)] bg-[var(--theme-card-bg)] px-5 py-2.5 text-sm font-semibold text-[var(--theme-heading-text)] hover:border-primary/40"
        >
          Read the blog
        </Link>
        <Link
          href="/tools"
          className="inline-flex min-h-[44px] items-center justify-center rounded-full border border-primary/30 px-5 py-2.5 text-sm font-semibold text-primary hover:bg-primary/5"
        >
          Free clinical tools
        </Link>
      </div>
      <ul className="mt-8 space-y-4">
        {rows.map((p) => (
          <li key={p.id} className="nn-card p-4">
            <p className="text-xs font-semibold uppercase text-primary">
              {p.countrySlug === "canada" ? "Canada" : "US"} · {p.shortName}
            </p>
            <h2 className="mt-1 text-lg font-semibold text-[var(--theme-heading-text)]">{p.displayName}</h2>
            <p className="mt-2 text-sm text-muted">{p.seoDescription}</p>
            <Link
              href={buildExamPathwayPath(p, "lessons")}
              className="mt-3 inline-block text-sm font-semibold text-primary hover:underline"
            >
              Open lesson hub →
            </Link>
          </li>
        ))}
      </ul>
      <MarketingStudyCrossLinks className="mt-12" />
      <p className="mt-10 text-sm text-muted">
        Looking for the app lesson list (subscriber)?{" "}
        <Link href="/app/lessons" className="font-semibold text-primary">
          Go to app lessons
        </Link>
      </p>
    </div>
  );
}
