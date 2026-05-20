/**
 * Telemetry policy engine — study-loop and learner-surface event naming by testing model.
 */
import { PH } from "@/lib/observability/posthog-conversion-events";
import { getTestingModelForPathwayId } from "@/lib/testing/testing-model-pathway-map";
import type { TestingModel } from "@/lib/testing/testing-model-types";
import { toTestingModelPostHogFields } from "@/lib/testing/testing-telemetry-governance";

export type StudyLoopAssessmentSurface =
  | "study_quick_links"
  | "dashboard_quick_actions"
  | "practice_test_results_retest_weak"
  | "lesson_study_loop_primary"
  | "adaptive_study_overview"
  | "question_session_panel"
  | "learner_study_home"
  | string;

export type AssessmentEntryType =
  | "pathway_scoped_start"
  | "weak_focus"
  | "loft_simulation"
  | "other";

export type GovernedStudyLoopCapture = {
  eventName: string;
  properties: Record<string, string | number | boolean | undefined>;
};

function parsePathwayFromHref(href: string, explicit?: string | null): string | null {
  if (explicit?.trim()) return explicit.trim();
  try {
    const url = href.startsWith("http") ? new URL(href) : new URL(href, "https://nursenest.local");
    const fromQuery = url.searchParams.get("pathwayId") ?? url.searchParams.get("pathway_id");
    return fromQuery?.trim() || null;
  } catch {
    return null;
  }
}

function classifyEntry(href: string, pathwayId: string | null): AssessmentEntryType {
  const lower = href.toLowerCase();
  if (lower.includes("/cases/") || lower.includes("cnple")) return "loft_simulation";
  if (lower.includes("focus=weak") || lower.includes("weak=")) return "weak_focus";
  if (
    lower.includes("cat-launch") ||
    lower.includes("cat=1") ||
    lower.includes("/cat") ||
    lower.includes("startmode=practice_exam")
  ) {
    return "pathway_scoped_start";
  }
  if (pathwayId && getTestingModelForPathwayId(pathwayId) === "LOFT") return "loft_simulation";
  return "other";
}

function entrySurface(href: string): "app" | "public" {
  return href.startsWith("/app/") ? "app" : "public";
}

export function telemetryPolicyForModel(model: TestingModel): {
  studyLoopEventPrefix: "cat" | "loft" | "practice";
  allowsCatPrefixedProperties: boolean;
} {
  if (model === "LOFT") {
    return { studyLoopEventPrefix: "loft", allowsCatPrefixedProperties: false };
  }
  if (model === "CAT") {
    return { studyLoopEventPrefix: "cat", allowsCatPrefixedProperties: true };
  }
  return { studyLoopEventPrefix: "practice", allowsCatPrefixedProperties: false };
}

export function resolveStudyLoopCtaEventName(pathwayId: string | null | undefined): string {
  const model = getTestingModelForPathwayId(pathwayId);
  const policy = telemetryPolicyForModel(model);
  if (policy.studyLoopEventPrefix === "loft") return PH.learnerStudyLoopLoftCtaClicked;
  if (policy.studyLoopEventPrefix === "cat") return PH.learnerStudyLoopCatCtaClicked;
  return PH.learnerStudyLoopPracticeCtaClicked;
}

export function buildGovernedStudyLoopCapture(args: {
  href: string;
  sourceSurface: StudyLoopAssessmentSurface;
  pathwayId?: string | null;
  allowed?: boolean;
}): GovernedStudyLoopCapture {
  const pathwayId = parsePathwayFromHref(args.href, args.pathwayId);
  const model = getTestingModelForPathwayId(pathwayId);
  const policy = telemetryPolicyForModel(model);
  const entryType = classifyEntry(args.href, pathwayId);
  const surface = entrySurface(args.href);

  const base: Record<string, string | number | boolean | undefined> = {
    ...toTestingModelPostHogFields(pathwayId),
    source_surface: args.sourceSurface,
    assessment_entry_type: entryType,
    assessment_entry_surface: surface,
    href: args.href,
    allowed: args.allowed ?? true,
    pathway_id: pathwayId ?? undefined,
  };

  if (policy.allowsCatPrefixedProperties) {
    base.cat_entry_type = entryType;
    base.cat_entry_surface = surface;
  }

  return {
    eventName: resolveStudyLoopCtaEventName(pathwayId),
    properties: base,
  };
}

/** Legacy property shape for components still expecting cat_* keys on CAT pathways. */
export function buildStudyLoopClickPropsLegacy(args: {
  href: string;
  sourceSurface: StudyLoopAssessmentSurface;
  pathwayId?: string | null;
  allowed?: boolean;
}): Record<string, string | number | boolean | undefined> {
  return buildGovernedStudyLoopCapture(args).properties;
}
