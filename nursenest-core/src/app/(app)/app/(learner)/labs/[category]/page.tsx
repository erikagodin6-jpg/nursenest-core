import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { LearnerBreadcrumbTrail } from "@/components/navigation/learner-breadcrumb-trail";
import type { LabCategorySlug } from "@/lib/labs/labs-engine";
import { LABS_CATEGORIES, listLabLessonsForTrack } from "@/lib/labs/labs-engine";
import { loadLabsRouteContext } from "@/lib/labs/labs-route-loader";

type Props = { params: Promise<{ category: string }> };

function categoryMeta(slug: string): { heading: string; title: string; description: string } | null {
  const c = LABS_CATEGORIES.find((x) => x.slug === slug);
  if (!c) return null;
  return {
    heading: c.title,
    title: `${c.title} labs | NurseNest`,
    description: c.description,
  };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category } = await params;
  const meta = categoryMeta(category);
  if (!meta) return { title: "Labs | NurseNest" };
  return { title: meta.title, description: meta.description };
}

export default async function LabsCategoryRoute({ params }: Props) {
  const { category } = await params;
  const slug = category as LabCategorySlug;
  const meta = categoryMeta(category);
  if (!meta) notFound();

  const context = await loadLabsRouteContext("(student).app.(learner).labs.[category]");
  const entitlementScope = context.entitlement !== "error" ? context.entitlement : undefined;
  const lessons = listLabLessonsForTrack(context.track, entitlementScope).filter((l) => l.category === slug);
  if (lessons.length === 0) notFound();

  return (
    <div className="space-y-6">
      <LearnerBreadcrumbTrail kind="labs-category" categoryLabel={meta.heading} pathname="/app/labs" />
      <header className="nn-learner-page-hero space-y-2">
        <p className="text-xs font-semibold uppercase tracking-[0.1em] text-[var(--semantic-brand)]">Labs</p>
        <h1 className="text-3xl font-bold text-[var(--semantic-text-primary)]">{meta.heading}</h1>
        <p className="max-w-3xl text-sm text-[var(--semantic-text-secondary)]">{meta.description}</p>
        <Link href="/app/labs" className="inline-block text-sm font-semibold text-primary hover:underline">
          All lab categories
        </Link>
      </header>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {lessons.map((lesson) => (
          <article key={lesson.slug} className="rounded-lg border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-4">
            <h2 className="text-base font-semibold text-[var(--semantic-text-primary)]">{lesson.shortTitle}</h2>
            <p className="mt-1 text-sm text-[var(--semantic-text-secondary)]">{lesson.description}</p>
            <Link
              href={`/app/labs/${lesson.category}/${lesson.slug}`}
              className="mt-3 inline-flex text-sm font-semibold text-primary hover:underline"
            >
              Open lesson
            </Link>
          </article>
        ))}
      </div>
    </div>
  );
}
