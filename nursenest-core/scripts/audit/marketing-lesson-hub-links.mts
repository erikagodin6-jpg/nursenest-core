#!/usr/bin/env npx tsx
/**
 * Release audit: full marketing hub inventory (`renderableAll` from page 1 hub fetch) after
 * {@link prepareLessonsForHubCurriculum} must pass {@link verifyMarketingHubLessonRowsResolve}
 * — same invariant as the lessons hub page (fresh detail load, `publicComplete`, pathway exam/country context).
 *
 * Requires DATABASE_URL when pathways use DB-backed lists. Uses default marketing content locale `en`
 * unless AUDIT_MARKETING_LESSON_LOCALE is set (BCP-47 / marketing locale code).
 *
 * Usage:
 *   cd nursenest-core && npx tsx scripts/audit/marketing-lesson-hub-links.mts
 *
 * Env:
 *   AUDIT_MARKETING_LESSON_LOCALE — content locale passed to hub loaders (default: en)
 *
 * Exit 1 when any prepared hub slug fails detail resolvability; exit 0 when all checked pathways pass.
 */
import { prepareLessonsForHubCurriculum } from "@/components/pathway-lessons/pathway-lessons-curriculum-hub";
import { listPublicExamPathways } from "@/lib/exam-pathways/exam-product-registry";
import type { ExamPathwayDefinition } from "@/lib/exam-pathways/types";
import { marketingPathwayLessonsIndexPath } from "@/lib/lessons/lesson-routes";
import {
  HubVerifyPreparedPositiveZeroKeptError,
  verifyMarketingHubLessonRowsResolve,
} from "@/lib/lessons/pathway-lesson-hub-link-integrity";
import {
  getPathwayLessonsPageFresh,
  PATHWAY_HUB_PAGE_SIZE_MAX,
} from "@/lib/lessons/pathway-lesson-loader";
import { pathwayLessonHasRenderableHubSlug } from "@/lib/lessons/pathway-lesson-types";

const locale = (process.env.AUDIT_MARKETING_LESSON_LOCALE ?? "en").trim() || "en";

type Failure = { pathwayId: string; page: number; prepared: number; kept: number; excluded: number };

async function auditPathway(pathway: ExamPathwayDefinition): Promise<Failure | null> {
  const base = marketingPathwayLessonsIndexPath(pathway);
  /** `getPathwayLessonsPageFresh` always resolves `renderableAll` for page 1 — same full list the hub verifies. */
  const pageResult = await getPathwayLessonsPageFresh(pathway.id, 1, PATHWAY_HUB_PAGE_SIZE_MAX, locale, undefined);
  const raw = (pageResult.renderableAll ?? pageResult.items).filter(pathwayLessonHasRenderableHubSlug);
  const prepared = prepareLessonsForHubCurriculum(raw, { pathwayId: pathway.id, lessonsBasePath: base });
  let kept: { length: number };
  let excluded: { length: number };
  try {
    const r = await verifyMarketingHubLessonRowsResolve(pathway, prepared, locale);
    kept = r.kept;
    excluded = r.excluded;
  } catch (e) {
    if (e instanceof HubVerifyPreparedPositiveZeroKeptError) {
      return {
        pathwayId: pathway.id,
        page: 1,
        prepared: e.preparedCount,
        kept: 0,
        excluded: -1,
      };
    }
    throw e;
  }
  if (kept.length !== prepared.length) {
    const sample = excluded
      .slice(0, 24)
      .map((e) => `${e.slug}:${e.reason}`)
      .join(" | ");
    console.error(`marketing-lesson-hub-links: pathway=${pathway.id} exclusion sample: ${sample}`);
    return {
      pathwayId: pathway.id,
      page: 1,
      prepared: prepared.length,
      kept: kept.length,
      excluded: excluded.length,
    };
  }
  return null;
}

async function main() {
  const pathways = listPublicExamPathways();
  const failures: Failure[] = [];

  for (const p of pathways) {
    try {
      const f = await auditPathway(p);
      if (f) failures.push(f);
    } catch (e) {
      console.error(`marketing-lesson-hub-links: error auditing ${p.id}:`, e);
      failures.push({
        pathwayId: p.id,
        page: 0,
        prepared: -1,
        kept: -1,
        excluded: -1,
      });
    }
  }

  if (failures.length) {
    console.error(`marketing-lesson-hub-links: ${failures.length} pathway failure(s)`);
    for (const f of failures) {
      console.error(
        `  pathway=${f.pathwayId} page=${f.page} prepared=${f.prepared} kept=${f.kept} excluded_unique=${f.excluded}`,
      );
    }
    process.exit(1);
  }

  console.log(`marketing-lesson-hub-links: OK — ${pathways.length} public pathway(s), locale=${locale}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
