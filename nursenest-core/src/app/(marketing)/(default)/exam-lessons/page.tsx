import type { Metadata } from "next";
import Link from "next/link";
import { BreadcrumbJsonLd } from "@/components/seo/breadcrumb-json-ld";
import { BreadcrumbTrail } from "@/components/seo/breadcrumb-trail";
import { buildExamPathwayPath, getExamPathwayById } from "@/lib/exam-pathways/exam-product-registry";
import { listPathwayIdsWithLessons } from "@/lib/lessons/pathway-lesson-loader";
import { examLessonsIndexBreadcrumbs } from "@/lib/seo/pathway-breadcrumbs";

export const metadata: Metadata = {
  title: "Exam-scoped clinical lessons | NurseNest",
  description:
    "Browse nursing lessons by country, role, and exam track—REx-PN, NCLEX-RN, NCLEX-PN, NP specialties, and more. Previews are free; full depth unlocks with the matching subscription.",
  alternates: { canonical: "/exam-lessons" },
};

export default function ExamLessonsIndexPage() {
  const rows = listPathwayIdsWithLessons()
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
      <p className="mt-10 text-sm text-muted">
        Looking for the app lesson list (subscriber)?{" "}
        <Link href="/app/lessons" className="font-semibold text-primary">
          Go to app lessons
        </Link>
      </p>
    </div>
  );
}
