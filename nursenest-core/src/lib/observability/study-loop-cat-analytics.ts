import { buildGlobalExamContext } from "@/lib/exam-context/exam-registry";
import { examContextAnalyticsProps } from "@/lib/exam-context/global-exam-context";

export type StudyLoopCatSurface =
  | "adaptive_study_overview_primary"
  | "adaptive_study_overview_secondary"
  | "dashboard_quick_actions"
  | "lesson_study_loop_primary"
  | "lesson_study_loop_secondary"
  | "learner_overview_quick_link"
  | "practice_test_results_retest_weak"
  | "practice_test_results_same_pathway"
  | "question_bank_session_panel"
  | "report_card_summary"
  | "study_quick_links";

type StudyLoopCatEntryType = "pathway_scoped_start" | "weak_focus" | "pathway_chooser" | "history" | "other";

function pathnameFromHref(href: string): string {
  try {
    return new URL(href, "https://nursenest.local").pathname;
  } catch {
    return href;
  }
}

function searchParamsFromHref(href: string): URLSearchParams {
  try {
    return new URL(href, "https://nursenest.local").searchParams;
  } catch {
    return new URLSearchParams();
  }
}

function entryTypeForHref(href: string): StudyLoopCatEntryType {
  const pathname = pathnameFromHref(href);
  const searchParams = searchParamsFromHref(href);
  if (pathname === "/app/practice-tests/start") {
    return searchParams.get("pathwayId") ? "pathway_scoped_start" : "pathway_chooser";
  }
  if (pathname === "/app/practice-tests" && searchParams.get("cat") === "1") {
    return "weak_focus";
  }
  if (pathname === "/app/practice-tests/cat-insights") return "history";
  return "other";
}

export function buildStudyLoopCatClickProps(args: {
  href: string;
  sourceSurface: StudyLoopCatSurface;
  pathwayId?: string | null;
  allowed?: boolean;
}) {
  const pathname = pathnameFromHref(args.href);
  const searchParams = searchParamsFromHref(args.href);
  const resolvedPathwayId = searchParams.get("pathwayId")?.trim() || args.pathwayId?.trim() || null;
  return {
    source_surface: args.sourceSurface,
    cat_entry_type: entryTypeForHref(args.href),
    cat_entry_surface: pathname.startsWith("/app/") ? "app" : "public",
    allowed: args.allowed ?? true,
    pathway_id: resolvedPathwayId ?? undefined,
    ...examContextAnalyticsProps(buildGlobalExamContext(resolvedPathwayId, "en")),
  };
}
