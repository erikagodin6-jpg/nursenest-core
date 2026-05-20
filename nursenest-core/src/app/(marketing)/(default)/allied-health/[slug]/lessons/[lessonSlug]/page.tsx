import { notFound, permanentRedirect } from "next/navigation";
import {
  getAlliedProfessionByHeroSegment,
  getAlliedProfessionByProfessionKey,
  isAlliedHeroExamPrepSlug,
} from "@/lib/allied/allied-professions-registry";
import { alliedHealthLessonDetailPath, marketingLessonSlugFromRouteParam } from "@/lib/lessons/lesson-routes";

export const dynamic = "force-dynamic";
export const dynamicParams = true;

type Props = { params: Promise<{ slug: string; lessonSlug: string }> };

function resolveProfession(slug: string) {
  if (isAlliedHeroExamPrepSlug(slug)) {
    const byHero = getAlliedProfessionByHeroSegment(slug);
    return byHero ? { prof: byHero, mode: "hero" as const } : null;
  }
  const byKey = getAlliedProfessionByProfessionKey(slug);
  return byKey ? { prof: byKey, mode: "key" as const } : null;
}

/** Legacy allied lesson detail URLs 301 to the canonical pathway lesson page. */
export default async function AlliedHealthLessonDetailLegacyRedirect({ params }: Props) {
  const { slug, lessonSlug: lessonSlugRaw } = await params;
  const resolved = resolveProfession(slug);
  if (!resolved) notFound();
  const lessonSlug = marketingLessonSlugFromRouteParam(lessonSlugRaw) || lessonSlugRaw;
  permanentRedirect(alliedHealthLessonDetailPath(resolved.prof.professionKey, lessonSlug));
}
