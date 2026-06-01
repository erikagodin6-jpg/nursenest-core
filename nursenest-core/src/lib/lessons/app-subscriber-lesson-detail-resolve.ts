import type { CountryCode, TierCode } from "@prisma/client";
import { ContentStatus } from "@prisma/client";
import type { AccessScope } from "@/lib/entitlements/resolve-entitlement";
import { appPathwayLessonVisibleToSubscriber } from "@/lib/lessons/app-pathway-lesson-list-scope";
import { filterLearnerPresentablePathwaySections } from "@/lib/lessons/lesson-section-presentability";
import { shouldRenderPathwayLessonSection } from "@/lib/lessons/lesson-section-page-layout";
import { pathwayLessonMatchesMarketingPathwayContext } from "@/lib/lessons/pathway-lesson-catalog-sync";
import { getPathwayLesson, getPublishedPathwayLessonRecordById } from "@/lib/lessons/pathway-lesson-loader";
import { lessonsPerfMark } from "@/lib/lessons/lessons-perf";
import { visibleSectionsForLesson } from "@/lib/lessons/pathway-lesson-access";
import type { PathwayLessonRecord } from "@/lib/lessons/pathway-lesson-types";
import { safeServerLog } from "@/lib/observability/safe-server-log";
import { classifyPathwayLessonRecordForHub } from "@/lib/taxonomy/classifier";
import { shouldSuppressProfessionalPracticeHubLesson } from "@/lib/taxonomy/nursing-taxonomy-validation";
import { REVIEW_REQUIRED } from "@/lib/taxonomy/taxonomy";
import {
  getLessonManifest,
  setLessonManifest,
  incrementReliabilityCounter,
} from "@/lib/server/content-cache";

/** Minimal `pathway_lessons` row fields used by `/app/lessons/[id]` pathway resolution. */
export type AppSubscriberPathwayLessonDetailRow = Pick<
  {
    id: string;
    pathwayId: string;
    slug: string;
    status: ContentStatus | null;
    countryCode: CountryCode | null;
    tierCode: TierCode | null;
    alliedProfessionKey?: string | null;
  },
  "id" | "pathwayId" | "slug" | "status" | "countryCode" | "tierCode"
> & { alliedProfessionKey?: string | null };

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

function classifyAppSubscriberPathwayLessonRecord(args: {
  pathwayId: string;
  slug: string;
  record: PathwayLessonRecord;
}): AppSubscriberPathwayLessonDetailResolution {
  if (!args.record.structuralQuality?.publicComplete) {
    safeServerLog("page_lessons", "app_pathway_detail_contract_not_public_complete", {
      pathwayId: args.pathwayId,
      slug: args.slug.slice(0, 160),
    });
    return { kind: "not_found" };
  }
  if (!pathwayLessonMatchesMarketingPathwayContext(args.pathwayId, args.record)) {
    safeServerLog("page_lessons", "app_pathway_detail_contract_pathway_context_mismatch", {
      pathwayId: args.pathwayId,
      slug: args.slug.slice(0, 160),
    });
    return { kind: "not_found" };
  }
  if (shouldSuppressProfessionalPracticeHubLesson(args.record)) {
    safeServerLog("page_lessons", "app_pathway_detail_contract_professional_hub_guard", {
      pathwayId: args.pathwayId,
      slug: args.slug.slice(0, 160),
    });
    return { kind: "not_found" };
  }
  if (classifyPathwayLessonRecordForHub(args.record).categoryId === REVIEW_REQUIRED) {
    safeServerLog("page_lessons", "app_pathway_detail_contract_taxonomy_review_required", {
      pathwayId: args.pathwayId,
      slug: args.slug.slice(0, 160),
    });
    return { kind: "not_found" };
  }
  if (!pathwayLessonRecordHasAppSubscriberDetailPresentableSections(args.record)) {
    safeServerLog("page_lessons", "app_pathway_detail_contract_no_presentable_sections", {
      pathwayId: args.pathwayId,
      slug: args.slug.slice(0, 160),
    });
    return { kind: "not_found" };
  }
  return { kind: "pathway_ok", record: args.record, pathwayId: args.pathwayId };
}

/**
 * Same pathway contract as `/app/lessons/[id]`: entitlement + learner path gate, then
 * **prefer** {@link getPublishedPathwayLessonRecordById} (single DB row by primary key — matches hub list rows),
 * falling back to {@link getPathwayLesson} when catalog/warehouse slug resolution is required.
 * Post-hydration gates match the hub so list rows never diverge from the detail surface.
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

  lessonsPerfMark("detail_lookup_start", { pathwayId: args.pwRow.pathwayId });

  // Tier A — Redis manifest cache (60 min TTL, survives deployments)
  // The lesson record is content-only — not user-specific. The entitlement gate above
  // already ran, so the cached record can be served directly if valid.
  try {
    const cached = await getLessonManifest<PathwayLessonRecord>(args.pwRow.id);
    if (cached) {
      const fast = classifyAppSubscriberPathwayLessonRecord({
        pathwayId: args.pwRow.pathwayId,
        slug,
        record: cached,
      });
      if (fast.kind === "pathway_ok") {
        lessonsPerfMark("detail_lookup_end", { pathwayId: args.pwRow.pathwayId, source: "redis_manifest" });
        void incrementReliabilityCounter("lesson", "tier_a");
        return fast;
      }
    }
  } catch {
    // Redis failure — fall through to DB
  }

  // Tier B — DB lookup by primary key
  const byId = await getPublishedPathwayLessonRecordById(args.pwRow.id, args.marketingLocale);
  if (byId) {
    const fast = classifyAppSubscriberPathwayLessonRecord({
      pathwayId: args.pwRow.pathwayId,
      slug,
      record: byId,
    });
    if (fast.kind === "pathway_ok") {
      lessonsPerfMark("detail_lookup_end", { pathwayId: args.pwRow.pathwayId, source: "db_by_id" });
      // Populate Redis cache for future requests and resilience (fire-and-forget)
      void setLessonManifest(args.pwRow.id, byId);
      void incrementReliabilityCounter("lesson", "tier_b");
      return fast;
    }
  }

  // Tier B slug fallback — warehouse/catalog resolution when primary key miss
  const bySlug = await getPathwayLesson(args.pwRow.pathwayId, slug, args.marketingLocale);
  lessonsPerfMark("detail_lookup_end", { pathwayId: args.pwRow.pathwayId, source: bySlug ? "slug_resolver" : "miss" });
  if (!bySlug) return { kind: "not_found" };
  const slugResult = classifyAppSubscriberPathwayLessonRecord({
    pathwayId: args.pwRow.pathwayId,
    slug,
    record: bySlug,
  });
  if (slugResult.kind === "pathway_ok") {
    void setLessonManifest(args.pwRow.id, bySlug);
    void incrementReliabilityCounter("lesson", "tier_b");
  }
  return slugResult;
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
