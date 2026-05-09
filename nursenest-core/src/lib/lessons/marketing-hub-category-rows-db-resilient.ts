import type { ExamPathwayDefinition } from "@/lib/exam-pathways/types";
import { HubLessonsListDatabaseError } from "@/lib/lessons/hub-lessons-database-error";
import type { HubCurriculumPrepareStageDiagnostics } from "@/lib/lessons/pathway-lesson-marketing-link-integrity-reasons";
import { getPathwayLessonListWarehouseLocaleForHub } from "@/lib/lessons/pathway-lesson-loader";
import { verifyMarketingHubLessonRowsResolve } from "@/lib/lessons/pathway-lesson-hub-link-integrity";
import type { PathwayLessonRecord } from "@/lib/lessons/pathway-lesson-types";
import { rethrowNextNavigationControlFlow } from "@/lib/next/navigation-abort";
import { safeServerLog } from "@/lib/observability/safe-server-log";

/** Test seams — defaults mirror production imports (avoid circular deps). */
export type MarketingHubCategoryRowsDbResilientDeps = {
  getWarehouseLocale?: typeof getPathwayLessonListWarehouseLocaleForHub;
  verifyRows?: typeof verifyMarketingHubLessonRowsResolve;
};

/**
 * Category-first marketing hubs: resolve optional DB-backed verify without letting
 * {@link HubLessonsListDatabaseError} bubble to the marketing error boundary.
 *
 * - When `skipDbVerify` (anonymous public hub): returns prepared rows only — no Prisma list locale / verify.
 * - When verify or warehouse-locale fails with hub DB errors: returns prepared catalog rows (index-first).
 */
export async function resolveMarketingHubCategoryLessonRowsWithDbResilience(args: {
  pathway: ExamPathwayDefinition;
  lessonContentLocale: string;
  skipDbVerify: boolean;
  preparedLessons: PathwayLessonRecord[];
  prepareStages?: HubCurriculumPrepareStageDiagnostics;
  maxUniqueSlugsToVerify: number;
  surface: "category_first_index" | "category_lessons_surface";
}, deps?: MarketingHubCategoryRowsDbResilientDeps): Promise<PathwayLessonRecord[]> {
  if (args.skipDbVerify) {
    return args.preparedLessons;
  }

  const getLocale = deps?.getWarehouseLocale ?? getPathwayLessonListWarehouseLocaleForHub;
  const verify = deps?.verifyRows ?? verifyMarketingHubLessonRowsResolve;

  let listWarehouseLocale = args.lessonContentLocale;
  try {
    listWarehouseLocale = await getLocale(args.pathway.id, args.lessonContentLocale);
  } catch (e) {
    rethrowNextNavigationControlFlow(e);
    const hubDb = e instanceof HubLessonsListDatabaseError ? e.category : undefined;
    safeServerLog("pathway_lessons", "marketing_hub_category_warehouse_locale_fallback", {
      pathway_id: args.pathway.id,
      surface: args.surface,
      fallback_locale: args.lessonContentLocale,
      ...(hubDb ? { hub_db_error_category: hubDb } : {}),
      severity: "warning",
    });
    listWarehouseLocale = args.lessonContentLocale;
  }

  try {
    const vr = await verify(args.pathway, args.preparedLessons, args.lessonContentLocale, {
      listWarehouseLocale,
      prepareStages: args.prepareStages,
      maxUniqueSlugsToVerify: args.maxUniqueSlugsToVerify,
    });
    return vr.kept;
  } catch (e) {
    rethrowNextNavigationControlFlow(e);
    if (e instanceof HubLessonsListDatabaseError) {
      safeServerLog("pathway_lessons", "marketing_hub_category_verify_fallback_prepared_rows", {
        pathway_id: args.pathway.id,
        surface: args.surface,
        hub_db_error_category: e.category,
        severity: "warning",
      });
      return args.preparedLessons;
    }
    throw e;
  }
}
