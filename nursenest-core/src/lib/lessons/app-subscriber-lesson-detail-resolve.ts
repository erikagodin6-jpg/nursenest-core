import type { CountryCode, TierCode } from "@prisma/client";
import { ContentStatus } from "@prisma/client";
import type { AccessScope } from "@/lib/entitlements/resolve-entitlement";
import { appPathwayLessonVisibleToSubscriber } from "@/lib/lessons/app-pathway-lesson-list-scope";
import { filterLearnerPresentablePathwaySections } from "@/lib/lessons/lesson-section-presentability";
import { shouldRenderPathwayLessonSection } from "@/lib/lessons/lesson-section-page-layout";
import { pathwayLessonMatchesMarketingPathwayContext } from "@/lib/lessons/pathway-lesson-catalog-sync";
import { getPathwayLesson } from "@/lib/lessons/pathway-lesson-loader";
import { visibleSectionsForLesson } from "@/lib/lessons/pathway-lesson-access";
import type { PathwayLessonRecord } from "@/lib/lessons/pathway-lesson-types";
import { safeServerLog } from "@/lib/observability/safe-server-log";
import { classifyPathwayLessonRecordForHub } from "@/lib/taxonomy/classifier";
import { shouldSuppressProfessionalPracticeHubLesson } from "@/lib/taxonomy/nursing-taxonomy-validation";
import { REVIEW_REQUIRED } from "@/lib/taxonomy/taxonomy";

/** Minimal `pathway_lessons` row fields used by `/app/lessons/[id]` pathway resolution. */
export type AppSubscriberPathwayLessonDetailRow = Pick<
  {
    id: string;
    pathwayId: string;
    slug: string;
    status: ContentStatus | null;
    countryCode: CountryCode | null;
    tierCode: TierCode | null;
  },
  "id" | "pathwayId" | "slug" | "status" | "countryCode" | "tierCode"
>;

export type AppSubscriberPathwayLessonDetailResolution =
  | { kind: "out_of_plan" }
  | { kind: "not_found" }
  | { kind: "pathway_ok"; record: PathwayLessonRecord; pathwayId: string };

/** Same presentable-spine gate as `/app/lessons/[id]` before rendering article sections (omitHy handled later on the page). */
export function pathwayLessonRecordHasAppSubscriberDetailPresentableSections(record: PathwayLessonRecord): boolean {
  const visibleRaw = visibleSectionsForLesson(record, true);
  const visible = filterLearnerPresentablePathwaySections(
    visibleRaw.filter((s) => shouldRenderPathwayLessonSection(s.kind)),
  );
  return visible.length > 0;
}

/**
 * Same pathway contract as `/app/lessons/[id]`: entitlement + learner path gate, then
 * {@link getPathwayLesson} for `pathwayId` + `slug` + marketing locale (canonical learner lesson identity),
 * then **the same post-hydration gates the hub uses** so list rows never diverge from the detail surface.
 */
export async function resolveAppSubscriberPathwayLessonForDetail(args: {
  entitlement: AccessScope;
  learnerPath: string | null;
  marketingLocale: string | undefined;
  pwRow: AppSubscriberPathwayLessonDetailRow;
}): Promise<AppSubscriberPathwayLessonDetailResolution> {
  if (!(await appPathwayLessonVisibleToSubscriber(args.entitlement, args.pwRow, args.learnerPath))) {
    return { kind: "out_of_plan" };
  }
  const slug = typeof args.pwRow.slug === "string" ? args.pwRow.slug.trim() : "";
  if (!slug) {
    safeServerLog("page_lessons", "app_pathway_detail_contract_empty_slug", { pathwayId: args.pwRow.pathwayId });
    return { kind: "not_found" };
  }
  const record = await getPathwayLesson(args.pwRow.pathwayId, slug, args.marketingLocale);
  if (!record) return { kind: "not_found" };
  if (!pathwayLessonMatchesMarketingPathwayContext(args.pwRow.pathwayId, record)) {
    safeServerLog("page_lessons", "app_pathway_detail_contract_pathway_context_mismatch", {
      pathwayId: args.pwRow.pathwayId,
      slug: slug.slice(0, 160),
    });
    return { kind: "not_found" };
  }
  if (shouldSuppressProfessionalPracticeHubLesson(record)) {
    safeServerLog("page_lessons", "app_pathway_detail_contract_professional_hub_guard", {
      pathwayId: args.pwRow.pathwayId,
      slug: slug.slice(0, 160),
    });
    return { kind: "not_found" };
  }
  if (classifyPathwayLessonRecordForHub(record).categoryId === REVIEW_REQUIRED) {
    safeServerLog("page_lessons", "app_pathway_detail_contract_taxonomy_review_required", {
      pathwayId: args.pwRow.pathwayId,
      slug: slug.slice(0, 160),
    });
    return { kind: "not_found" };
  }
  if (!pathwayLessonRecordHasAppSubscriberDetailPresentableSections(record)) {
    safeServerLog("page_lessons", "app_pathway_detail_contract_no_presentable_sections", {
      pathwayId: args.pwRow.pathwayId,
      slug: slug.slice(0, 160),
    });
    return { kind: "not_found" };
  }
  return { kind: "pathway_ok", record, pathwayId: args.pwRow.pathwayId };
}

export async function isAppSubscriberPathwayLessonRowResolvableForDetail(args: {
  entitlement: AccessScope;
  learnerPath: string | null;
  marketingLocale: string | undefined;
  row: AppSubscriberPathwayLessonDetailRow;
}): Promise<boolean> {
  const r = await resolveAppSubscriberPathwayLessonForDetail({
    entitlement: args.entitlement,
    learnerPath: args.learnerPath,
    marketingLocale: args.marketingLocale,
    pwRow: args.row,
  });
  return r.kind === "pathway_ok";
}

/** Hub card row shape — matches `/app/lessons` pathway branch `select`. */
export type AppSubscriberPathwayHubListRow = AppSubscriberPathwayLessonDetailRow & {
  title: string;
  seoDescription: string;
  topic: string;
  bodySystem: string;
  updatedAt: Date;
  topicSlug: string;
  previewSectionCount: number;
  seoTitle: string;
  locale: string;
};
