import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LabsCategoryPage } from "@/components/labs/labs-category-page";
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
      <LearnerBreadcrumbTrail
        kind="labs-category"
        categoryLabel={meta.heading}
        categorySlug={slug}
        pathname={`/app/labs/${slug}`}
      />
      <LabsCategoryPage
        heading={meta.heading}
        description={meta.description}
        categorySlug={slug}
        lessons={lessons}
        hasAccess={context.hasAccess}
        labTrack={context.track}
      />
    </div>
  );
}
