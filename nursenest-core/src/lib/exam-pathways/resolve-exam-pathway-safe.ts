import type { ExamPathwayDefinition } from "@/lib/exam-pathways/types";
import { safeServerLog } from "@/lib/observability/safe-server-log";

export type PathwayResolutionLogContext = {
  pathname?: string;
  /** UI locale / cookie when known */
  uiLocale?: string;
};

/**
 * Single safe entry for marketing exam URL → pathway. Never throws; logs resolution failures.
 * Returns `null` when the segment triple does not resolve (caller should `notFound()`).
 *
 * Loads `exam-product-registry` lazily so this module does not statically depend on the full registry bundle.
 */
export async function resolveExamPathwaySafe(
  countrySlug: string,
  roleTrack: string,
  examCode: string,
  ctx?: PathwayResolutionLogContext,
): Promise<ExamPathwayDefinition | null> {
  try {
    const { resolveExamPathwayFromMarketingHubSegment } = await import("@/lib/exam-pathways/exam-product-registry");
    const pathway = resolveExamPathwayFromMarketingHubSegment(countrySlug, roleTrack, examCode);
    if (!pathway) {
      safeServerLog("exam_pathway_hub", "pathway_resolution_failed", {
        event: "pathway_resolution_failed",
        pathname: ctx?.pathname,
        locale: countrySlug,
        country: countrySlug,
        examCode,
        role_track: roleTrack,
        ui_locale: ctx?.uiLocale,
      });
    }
    return pathway ?? null;
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    safeServerLog("exam_pathway_hub", "pathway_resolution_failed", {
      event: "pathway_resolution_failed",
      pathname: ctx?.pathname,
      locale: countrySlug,
      country: countrySlug,
      examCode,
      role_track: roleTrack,
      ui_locale: ctx?.uiLocale,
      error_message: message.slice(0, 500),
    });
    return null;
  }
}
