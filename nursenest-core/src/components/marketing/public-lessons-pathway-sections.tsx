import Link from "next/link";
import { unstable_cache } from "next/cache";
import type { ExamPathwayDefinition } from "@/lib/exam-pathways/types";
import { buildExamPathwayPath, getExamPathwayById } from "@/lib/exam-pathways/exam-product-registry";
import { DEFAULT_MARKETING_LOCALE } from "@/lib/i18n/marketing-locale-policy";
import {
  loadMarketingMessageShards,
  loadMarketingMessageShardsSync,
} from "@/lib/marketing-i18n/load-marketing-message-shards";
import {
  MARKETING_DEFAULT_LAYOUT_MESSAGE_SHARDS,
  MARKETING_PAGE_BODY_MESSAGE_SHARDS,
} from "@/lib/marketing-i18n/marketing-i18n-shard-groups";
import { formatMarketingMessage } from "@/lib/marketing-i18n-core";
import type { MarketingRegionToggle } from "@/lib/marketing/marketing-entry-routes";
import { MarketingBlogLatestLinks } from "@/components/marketing/marketing-blog-latest-links";
import {
  pathwayMatchesMarketingRegion,
  publicLessonsHubSectionHeadingAllied,
  publicLessonsHubSectionHeadingNp,
  publicLessonsHubSectionHeadingPn,
  publicLessonsHubSectionHeadingRn,
  publicLessonsHubSectionLeadAllied,
  publicLessonsHubSectionLeadNp,
  publicLessonsHubSectionLeadPn,
  publicLessonsHubSectionLeadRn,
} from "@/lib/marketing/nursing-tier-public-labels";
import {
  getCatalogLessonPreviewTitlesForPublicSurface,
  listPathwayIdsWithLessonsForPublicSurface,
} from "@/lib/lessons/pathway-lesson-public-metadata";

const cachedPathwayIdsWithLessons = unstable_cache(
  () => listPathwayIdsWithLessonsForPublicSurface(),
  ["public-lessons-pathway-sections-v1"],
  { revalidate: 600, tags: ["pathway-lesson-index"] },
);
const MARKETING_BUILD_PHASE = "phase-production-build";
const LESSONS_BUILD_MESSAGE_SHARDS = [...MARKETING_PAGE_BODY_MESSAGE_SHARDS, "billing"] as const;

function lessonsPageMessageShards() {
  return process.env.NEXT_PHASE === MARKETING_BUILD_PHASE
    ? LESSONS_BUILD_MESSAGE_SHARDS
    : MARKETING_DEFAULT_LAYOUT_MESSAGE_SHARDS;
}

function roleGroup(p: ExamPathwayDefinition): "rn" | "pn" | "np" | "allied" | null {
  if (p.roleTrack === "rn") return "rn";
  if (p.roleTrack === "lpn" || p.roleTrack === "rpn") return "pn";
  if (p.roleTrack === "np") return "np";
  if (p.roleTrack === "allied") return "allied";
  return null;
}

export async function PublicLessonsPathwaySections({
  locale,
  region,
}: {
  locale: string;
  region: MarketingRegionToggle;
}) {
  const pathwayIds = await cachedPathwayIdsWithLessons();
  const pathways = pathwayIds
    .map((id) => getExamPathwayById(id))
    .filter(
      (p): p is ExamPathwayDefinition =>
        !!p && p.status !== "hidden" && pathwayMatchesMarketingRegion(p.countrySlug, region),
    )
    .sort((a, b) => {
      const c = a.countrySlug.localeCompare(b.countrySlug);
      if (c !== 0) return c;
      return a.displayName.localeCompare(b.displayName);
    });

  const pathwaysWithPreviews = await Promise.all(
    pathways.map(async (pathway) => ({
      pathway,
      previews: await getCatalogLessonPreviewTitlesForPublicSurface(pathway.id, 4),
    })),
  );

  const grouped: Record<
    "rn" | "pn" | "np" | "allied",
    Array<{ pathway: ExamPathwayDefinition; previews: string[] }>
  > = {
    rn: [],
    pn: [],
    np: [],
    allied: [],
  };
  for (const row of pathwaysWithPreviews) {
    const g = roleGroup(row.pathway);
    if (g) grouped[g].push(row);
  }

  const shards = lessonsPageMessageShards();
  let m: Awaited<ReturnType<typeof loadMarketingMessageShards>>;
  let en: Awaited<ReturnType<typeof loadMarketingMessageShards>>;
  try {
    m = await loadMarketingMessageShards(locale, shards);
  } catch {
    m = loadMarketingMessageShardsSync(locale, shards);
  }
  try {
    en = await loadMarketingMessageShards(DEFAULT_MARKETING_LOCALE, shards);
  } catch {
    en = loadMarketingMessageShardsSync(DEFAULT_MARKETING_LOCALE, shards);
  }
  const t = (key: string, params?: Record<string, string | number>) => formatMarketingMessage(m, key, params, en);

  const regionLabel = (slug: string) =>
    slug === "canada" ? t("pages.pricing.country.ca") : t("pages.pricing.country.us");

  const sectionTitle: Record<"rn" | "pn" | "np" | "allied", string> = {
    rn: publicLessonsHubSectionHeadingRn(region),
    pn: publicLessonsHubSectionHeadingPn(region),
    np: publicLessonsHubSectionHeadingNp(region),
    allied: publicLessonsHubSectionHeadingAllied(region),
  };

  const sectionLead: Record<"rn" | "pn" | "np" | "allied", string> = {
    rn: publicLessonsHubSectionLeadRn(region),
    pn: publicLessonsHubSectionLeadPn(region),
    np: publicLessonsHubSectionLeadNp(region),
    allied: publicLessonsHubSectionLeadAllied(region),
  };

  const order: Array<"rn" | "pn" | "np" | "allied"> = ["rn", "pn", "np", "allied"];

  return (
    <div id="exam-pathways" className="scroll-mt-8">
      {order.map((key) => {
        const rows = grouped[key];
        if (rows.length === 0) return null;
        return (
          <section key={key} className="mb-10 scroll-mt-8" aria-labelledby={`lessons-section-${key}`}>
            <h2 id={`lessons-section-${key}`} className="nn-marketing-h2">
              {sectionTitle[key]}
            </h2>
            <p className="mt-1 nn-marketing-body-sm text-muted">{sectionLead[key]}</p>
            <ul className="mt-4 flex flex-col gap-3 sm:gap-[var(--nn-rhythm-card-grid-gap)]">
              {rows.map(({ pathway: p, previews }) => {
                return (
                  <li key={p.id} className="nn-card p-4">
                    <p className="nn-marketing-label nn-marketing-label--accent">
                      {t("pages.examLessons.pathwayBadge", { region: regionLabel(p.countrySlug), shortName: p.shortName })}
                    </p>
                    <h3 className="mt-1 nn-marketing-h3">{p.displayName}</h3>
                    <p className="mt-2 nn-marketing-body-sm text-muted">{p.seoDescription}</p>
                    {previews.length > 0 ? (
                      <div className="mt-3">
                        <p className="nn-marketing-label text-[var(--theme-muted-text)]">
                          {t("pages.examLessons.sampleTopicsLabel")}
                        </p>
                        <ul className="mt-2 list-inside list-disc nn-marketing-body-sm text-[var(--theme-muted-text)]">
                          {previews.map((title) => (
                            <li key={title}>{title}</li>
                          ))}
                        </ul>
                      </div>
                    ) : (
                      <p className="mt-3 nn-marketing-body-sm text-[var(--theme-muted-text)]">
                        {t("pages.examLessons.emptyPreviewTopicsHint")}
                      </p>
                    )}
                    <Link
                      href={buildExamPathwayPath(p, "lessons")}
                      className="mt-3 inline-block nn-marketing-body-sm font-medium text-primary hover:underline"
                    >
                      {t("pages.examLessons.openLessonHubNamed", { examName: p.displayName })}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </section>
        );
      })}
      <section className="mt-2 border-t border-[var(--border-subtle)] pt-6" aria-labelledby="lessons-blog-latest">
        <h2 id="lessons-blog-latest" className="nn-marketing-h3">
          Latest study articles
        </h2>
        <p className="mt-1 nn-marketing-body-sm text-muted">
          Recently published guides linked from this public lessons hub.
        </p>
        <MarketingBlogLatestLinks take={3} className="mt-3" />
        <Link href="/blog" className="mt-3 inline-block nn-marketing-body-sm font-semibold text-primary hover:underline">
          View all blog posts
        </Link>
      </section>
    </div>
  );
}
