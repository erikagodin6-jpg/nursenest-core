import { requireAdmin } from "@/lib/auth/guards";
import { AdminPathwayLessonFormClient } from "@/components/admin/lessons/admin-pathway-lesson-form-client";

export const dynamic = "force-dynamic";

type PageProps = {
  searchParams: Promise<{ pathwayId?: string | string[]; slug?: string | string[]; locale?: string | string[] }>;
};

function firstString(v: string | string[] | undefined): string {
  if (typeof v === "string") return v.trim();
  if (Array.isArray(v) && typeof v[0] === "string") return v[0].trim();
  return "";
}

/**
 * Pathway lesson editor entry by stable keys (`pathwayId` + `slug`) without `pathway_lessons.id` in the URL.
 * Loads via {@link GET /api/admin/pathway-lessons/lookup} then persists through `PATCH /api/admin/pathway-lessons/[id]`.
 */
export default async function AdminPathwayLessonEditBySlugPage({ searchParams }: PageProps) {
  await requireAdmin();
  const sp = await searchParams;
  const pathwayId = firstString(sp.pathwayId);
  const slug = firstString(sp.slug);
  const locale = firstString(sp.locale) || undefined;

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <AdminPathwayLessonFormClient resolve={{ pathwayId, slug, locale }} />
    </main>
  );
}
