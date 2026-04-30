import {
  DEFAULT_PRACTICE_COUNT,
  DEFAULT_PRACTICE_MODE,
  DEFAULT_PRACTICE_SOURCE,
  DEFAULT_SHUFFLE,
  PRACTICE_CATEGORY_SLUGS,
  PRACTICE_QUESTION_COUNTS,
  PRACTICE_SESSION_MODES,
  PRACTICE_SESSION_SOURCES,
  PRACTICE_SESSION_STUDY_FILTERS,
  type PracticeCategorySlug,
  type PracticeSessionMode,
  type PracticeSessionSource,
  type PracticeSessionStudyFilter,
} from "@/lib/practice-question-session/constants";

export type ParsedPracticeSessionParams = {
  pathwayId: string | null;
  source: PracticeSessionSource;
  categorySlug: PracticeCategorySlug | null;
  count: number;
  mode: PracticeSessionMode;
  shuffle: boolean;
  /** Comma-separated practice hub ids forwarded to `GET /api/questions` when set. */
  practiceHubIds: string | null;
  /** Hub filter chip / launch intent (defaults to `all`). */
  studyFilter: PracticeSessionStudyFilter;
};

function parseEnum<T extends string>(raw: string | null, allowed: readonly T[], fallback: T): T {
  const v = raw?.trim().toLowerCase() ?? "";
  return (allowed as readonly string[]).includes(v) ? (v as T) : fallback;
}

export function parsePracticeSessionSearchParams(sp: URLSearchParams): ParsedPracticeSessionParams {
  const pathwayId = sp.get("pathwayId")?.trim() || null;
  const source = parseEnum(sp.get("source"), PRACTICE_SESSION_SOURCES, DEFAULT_PRACTICE_SOURCE);
  const catRaw = sp.get("category")?.trim().toLowerCase() ?? "";
  const categorySlug = (PRACTICE_CATEGORY_SLUGS as readonly string[]).includes(catRaw)
    ? (catRaw as PracticeCategorySlug)
    : null;

  const countRaw = Number(sp.get("count"));
  const count =
    Number.isInteger(countRaw) && (PRACTICE_QUESTION_COUNTS as readonly number[]).includes(countRaw)
      ? countRaw
      : DEFAULT_PRACTICE_COUNT;

  const mode = parseEnum(sp.get("mode"), PRACTICE_SESSION_MODES, DEFAULT_PRACTICE_MODE);
  const shuffleRaw = sp.get("shuffle");
  const shuffle =
    shuffleRaw === null || shuffleRaw === ""
      ? DEFAULT_SHUFFLE
      : shuffleRaw === "1" || shuffleRaw.toLowerCase() === "true";

  const practiceHubIdsRaw = sp.get("practiceHubIds")?.trim();
  const practiceHubIds = practiceHubIdsRaw && practiceHubIdsRaw.length > 0 ? practiceHubIdsRaw : null;

  const studyFilterRaw = sp.get("studyFilter")?.trim().toLowerCase() ?? "";
  const studyFilter = parseEnum(studyFilterRaw || "all", PRACTICE_SESSION_STUDY_FILTERS, "all");

  return { pathwayId, source, categorySlug, count, mode, shuffle, practiceHubIds, studyFilter };
}

export function practiceSessionUrl(args: {
  pathwayId: string | null;
  source: PracticeSessionSource;
  categorySlug: PracticeCategorySlug | null;
  count: number;
  mode: PracticeSessionMode;
  shuffle: boolean;
  practiceHubIds?: string | null;
  studyFilter?: PracticeSessionStudyFilter;
}): string {
  const qs = new URLSearchParams();
  if (args.pathwayId) qs.set("pathwayId", args.pathwayId);
  qs.set("source", args.source);
  if (args.categorySlug) qs.set("category", args.categorySlug);
  qs.set("count", String(args.count));
  qs.set("mode", args.mode);
  qs.set("shuffle", args.shuffle ? "true" : "false");
  if (args.practiceHubIds && args.practiceHubIds.trim().length > 0) {
    qs.set("practiceHubIds", args.practiceHubIds.trim());
  }
  const sf = args.studyFilter ?? "all";
  if (sf !== "all") qs.set("studyFilter", sf);
  return `/app/questions/session?${qs.toString()}`;
}
