import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth/guards";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

type PageProps = { searchParams: Promise<{ pathwayId?: string | string[]; slug?: string | string[] }> };

function firstString(v: string | string[] | undefined): string {
  if (typeof v === "string") return v.trim();
  if (Array.isArray(v) && typeof v[0] === "string") return v[0].trim();
  return "";
}

/**
 * Resolve a pathway lesson editor URL from stable routing keys (`pathwayId` + `slug`)
 * without requiring the internal `pathway_lessons.id` in bookmarks.
 */
export default async function AdminPathwayLessonOpenPage({ searchParams }: PageProps) {
  await requireAdmin();
  const sp = await searchParams;
  const pathwayId = firstString(sp.pathwayId);
  const slug = firstString(sp.slug);
  if (!pathwayId || !slug) {
    redirect("/admin/pathway-lessons");
  }

  const row = await prisma.pathwayLesson.findFirst({
    where: { pathwayId, slug, locale: "en" },
    select: { id: true },
  });
  if (!row) {
    redirect("/admin/pathway-lessons");
  }

  redirect(`/admin/pathway-lessons/${encodeURIComponent(row.id)}`);
}
