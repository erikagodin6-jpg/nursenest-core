import { notFound, permanentRedirect } from "next/navigation";
import {
  getAlliedProfessionByHeroSegment,
  getAlliedProfessionByProfessionKey,
  isAlliedHeroExamPrepSlug,
} from "@/lib/allied/allied-professions-registry";
import { alliedHealthLessonsIndexPath } from "@/lib/lessons/lesson-routes";
import { normalizePathwayHubSearchQuery } from "@/lib/lessons/pathway-lesson-loader";
import { PATHWAY_HUB_PAGE_SIZE_MAX } from "@/lib/lessons/pathway-lesson-scale";
import { ALLIED_LESSON_HUB_PAGE_SIZE } from "@/lib/allied/allied-marketing-constants";

export const dynamic = "force-dynamic";
export const dynamicParams = true;

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string; pageSize?: string; q?: string }>;
};

function resolveProfession(slug: string) {
  if (isAlliedHeroExamPrepSlug(slug)) {
    const byHero = getAlliedProfessionByHeroSegment(slug);
    return byHero ? { prof: byHero, mode: "hero" as const } : null;
  }
  const byKey = getAlliedProfessionByProfessionKey(slug);
  return byKey ? { prof: byKey, mode: "key" as const } : null;
}

/**
 * Legacy allied lesson **hub** URLs permanently redirect to the single canonical pathway lessons index
 * (`/{country}/allied/allied-health/lessons?alliedProfession=…`), preserving pagination and search.
 */
export default async function AlliedHealthSlugLessonsLegacyRedirect({ params, searchParams }: Props) {
  const { slug } = await params;
  const resolved = resolveProfession(slug);
  if (!resolved) notFound();

  const canonical = alliedHealthLessonsIndexPath(resolved.prof.professionKey);
  const qIdx = canonical.indexOf("?");
  const pathOnly = qIdx === -1 ? canonical : canonical.slice(0, qIdx);
  const baseQs = qIdx === -1 ? "" : canonical.slice(qIdx + 1);
  const u = new URLSearchParams(baseQs);

  const sp = await searchParams;
  const page = Math.max(1, Number(sp.page ?? "1") || 1);
  if (page > 1) u.set("page", String(page));
  const rawSize = Number(sp.pageSize ?? String(ALLIED_LESSON_HUB_PAGE_SIZE)) || ALLIED_LESSON_HUB_PAGE_SIZE;
  const pageSize = Math.min(PATHWAY_HUB_PAGE_SIZE_MAX, Math.max(8, Math.floor(rawSize)));
  if (pageSize !== ALLIED_LESSON_HUB_PAGE_SIZE) u.set("pageSize", String(pageSize));
  const qEff = normalizePathwayHubSearchQuery(sp.q);
  if (qEff) u.set("q", qEff);

  const tail = u.toString();
  permanentRedirect(tail ? `${pathOnly}?${tail}` : pathOnly);
}
