import { notFound, permanentRedirect } from "next/navigation";
import { resolveExamPathwaySafe } from "@/lib/exam-pathways/resolve-exam-pathway-safe";
import {
  marketingPathwayLessonsIndexPath,
  normalizeMarketingLessonsHubTopicSlug,
} from "@/lib/lessons/lesson-routes";

export const dynamic = "force-dynamic";
export const dynamicParams = true;

type Props = {
  params: Promise<{ locale: string; slug: string; examCode: string; topicSlug: string }>;
  searchParams: Promise<{ page?: string; pageSize?: string }>;
};

/**
 * Legacy topic URLs (`…/lessons/topics/{slug}`) permanently redirect to the single pathway
 * lessons hub with the same filter (`…/lessons?topicSlug={slug}`).
 */
export default async function PathwayLessonTopicClusterLegacyRedirect({ params, searchParams }: Props) {
  const { locale: countrySlug, slug: roleTrack, examCode, topicSlug: rawTopic } = await params;
  const pathname = `/${countrySlug}/${roleTrack}/${examCode}/lessons/topics/${rawTopic}`;
  const pathway = await resolveExamPathwaySafe(countrySlug, roleTrack, examCode, { pathname });
  if (!pathway) notFound();

  const normalized = normalizeMarketingLessonsHubTopicSlug(rawTopic);
  if (!normalized) {
    permanentRedirect(marketingPathwayLessonsIndexPath(pathway));
  }

  const base = marketingPathwayLessonsIndexPath(pathway);
  const qs = new URLSearchParams();
  qs.set("topicSlug", normalized);
  const sp = await searchParams;
  const page = Math.max(1, Number(sp.page ?? "1") || 1);
  if (page > 1) qs.set("page", String(page));
  const ps = Number(sp.pageSize ?? "");
  if (Number.isFinite(ps) && ps > 0) qs.set("pageSize", String(Math.floor(ps)));

  permanentRedirect(`${base}?${qs.toString()}`);
}
