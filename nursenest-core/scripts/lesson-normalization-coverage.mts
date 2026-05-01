import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { ALLIED_PROFESSIONS } from "@/lib/allied/allied-professions-registry";
import { getExamPathwayById } from "@/lib/exam-pathways/exam-pathways-catalog";
import { isNNForcePublishValidRawLessons } from "@/lib/lessons/pathway-lesson-force-publish";
import {
  getCatalogLessonsRaw,
  getCatalogPathwayLessonsSync,
  listCatalogPathwayIdsWithLessonsSync,
  resetCatalogLessonsRawMergeCacheForTests,
  sortAndFilterLessonsForPathwayContext,
} from "@/lib/lessons/pathway-lesson-catalog-sync";
import { alliedHealthLessonsIndexPath, marketingPathwayLessonDetailPath } from "@/lib/lessons/lesson-routes";
import { getMarketingLessonsHubCatalogLessons } from "@/lib/lessons/marketing-lessons-hub-category";
import type { PathwayLessonRecord } from "@/lib/lessons/pathway-lesson-types";

export type ExclusionAllowlistEntry = {
  comment: string;
};

export const LESSON_NORMALIZATION_EXCLUSION_ALLOWLIST: Record<string, Record<string, ExclusionAllowlistEntry>> = {
  "us-rn-new-grad-transition": {
    // Placeholder/development copy must not leak onto public lesson pages.
    "ngn-first-hour-reality": {
      comment: "Contains explicit development/placeholder phrasing and must stay excluded until editorial cleanup.",
    },
  },
};

export type LessonNormalizationExclusion = {
  id: string;
  slug: string;
  title: string;
  reason: string;
  reasonCode: string;
  allowed: boolean;
  allowlistComment?: string;
};

export type LessonNormalizationPathwayCoverage = {
  pathwayId: string;
  publicLessonsPath: string | null;
  publicUrlPattern: string | null;
  rawCount: number;
  normalizedCount: number;
  renderableCount: number;
  excludedCount: number;
  rawToRenderableRatio: string;
  unexpectedExclusionRate: number;
  passesExclusionQualityGate: boolean;
  topExclusionReasons: Array<{ reasonCode: string; count: number }>;
  exclusions: LessonNormalizationExclusion[];
  unexpectedExclusionCount: number;
  sampleRenderableLessonPath: string | null;
  forcePublishEnabled: boolean;
  forcePublishedLessons: Array<{ slug: string; title: string }>;
};

export type AlliedProfessionCoverage = {
  professionKey: string;
  label: string;
  route: string;
  topicSlugsIn: string[];
  mappedLessonCount: number;
  mappedLessonSlugs: string[];
  status: "mapped" | "unmapped";
  notes: string;
};

export type LessonNormalizationCoverageReport = {
  generatedAt: string;
  pathways: LessonNormalizationPathwayCoverage[];
  alliedProfessionCoverage: AlliedProfessionCoverage[];
};

export const REQUIRED_ALLIED_PROFESSION_KEYS = [
  "mlt",
  "paramedic",
  "ota",
  "pta",
  "social-work",
  "mental-health-addictions",
  "psw-hca",
  "respiratory",
  "imaging",
  "pharmacy-tech",
] as const;

export function reportsRootDir(): string {
  return path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "reports");
}

export function lessonNormalizationCoverageJsonPath(): string {
  return path.join(reportsRootDir(), "lesson-normalization-coverage.json");
}

export function lessonNormalizationCoverageMarkdownPath(): string {
  return path.join(reportsRootDir(), "lesson-normalization-coverage.md");
}

function exclusionReasonForLesson(pathwayId: string, lesson: PathwayLessonRecord): {
  reasonCode: string;
  reason: string;
} {
  if (!lesson.structuralQuality?.publicComplete) {
    const issues = lesson.structuralQuality?.issues?.filter(Boolean) ?? [];
    const warnings = lesson.structuralQuality?.warnings?.filter(Boolean) ?? [];
    const detail = [...issues, ...warnings].join("; ").trim();
    return {
      reasonCode: "not_public_complete",
      reason: detail || "Lesson failed the marketing/public structural gate without a recorded issue.",
    };
  }
  return {
    reasonCode: "exam_country_context_mismatch",
    reason: `Lesson did not match the public route context for pathway "${pathwayId}" after normalization.`,
  };
}

function ratioString(rawCount: number, renderableCount: number): string {
  if (rawCount <= 0) return "0/0";
  return `${renderableCount}/${rawCount} (${Math.round((renderableCount / rawCount) * 100)}%)`;
}

function strictMarketingRenderableSlugs(pathwayId: string, normalized: PathwayLessonRecord[]): Set<string> {
  const prev = process.env.NN_FORCE_PUBLISH_VALID_RAW_LESSONS;
  delete process.env.NN_FORCE_PUBLISH_VALID_RAW_LESSONS;
  resetCatalogLessonsRawMergeCacheForTests();
  try {
    return new Set(sortAndFilterLessonsForPathwayContext(pathwayId, [...normalized]).map((l) => l.slug.trim()));
  } finally {
    if (prev === undefined) delete process.env.NN_FORCE_PUBLISH_VALID_RAW_LESSONS;
    else process.env.NN_FORCE_PUBLISH_VALID_RAW_LESSONS = prev;
    resetCatalogLessonsRawMergeCacheForTests();
  }
}

function buildPathwayCoverage(pathwayId: string): LessonNormalizationPathwayCoverage {
  const raw = getCatalogLessonsRaw(pathwayId);
  const normalized = getCatalogPathwayLessonsSync(pathwayId);
  const renderable = sortAndFilterLessonsForPathwayContext(pathwayId, normalized);
  const strictSlugs = strictMarketingRenderableSlugs(pathwayId, normalized);
  const forcePublishedLessons = renderable
    .filter((lesson) => !strictSlugs.has(lesson.slug.trim()))
    .map((lesson) => ({ slug: lesson.slug, title: lesson.title }));
  const kept = new Set(renderable.map((lesson) => lesson.slug.trim()));
  const allowlist = LESSON_NORMALIZATION_EXCLUSION_ALLOWLIST[pathwayId] ?? {};
  const reasonCounts = new Map<string, number>();
  const pathway = getExamPathwayById(pathwayId);

  const exclusions = normalized
    .filter((lesson) => !kept.has(lesson.slug.trim()))
    .map((lesson) => {
      const { reasonCode, reason } = exclusionReasonForLesson(pathwayId, lesson);
      const allowlisted = allowlist[lesson.slug];
      reasonCounts.set(reasonCode, (reasonCounts.get(reasonCode) ?? 0) + 1);
      return {
        id: lesson.slug,
        slug: lesson.slug,
        title: lesson.title,
        reason,
        reasonCode,
        allowed: Boolean(allowlisted),
        ...(allowlisted ? { allowlistComment: allowlisted.comment } : {}),
      } satisfies LessonNormalizationExclusion;
    });

  const unexpectedExclusionCount = exclusions.filter((entry) => !entry.allowed).length;
  const unexpectedExclusionRate = raw.length > 0 ? unexpectedExclusionCount / raw.length : 0;
  const sampleDetail = pathway && renderable[0] ? marketingPathwayLessonDetailPath(pathway, renderable[0].slug) : null;
  const urlTemplate =
    pathway && marketingPathwayLessonDetailPath(pathway, "__nn_lesson_slug__")
      ? marketingPathwayLessonDetailPath(pathway, "__nn_lesson_slug__")!.replace("__nn_lesson_slug__", "{lessonSlug}")
      : null;
  return {
    pathwayId,
    publicLessonsPath: pathway ? marketingPathwayLessonDetailPath(pathway, "")?.replace(/\/$/, "") ?? null : null,
    publicUrlPattern: urlTemplate,
    rawCount: raw.length,
    normalizedCount: normalized.length,
    renderableCount: renderable.length,
    excludedCount: exclusions.length,
    rawToRenderableRatio: ratioString(raw.length, renderable.length),
    unexpectedExclusionRate,
    passesExclusionQualityGate: raw.length === 0 || unexpectedExclusionRate <= 0.2,
    topExclusionReasons: [...reasonCounts.entries()]
      .map(([reasonCode, count]) => ({ reasonCode, count }))
      .sort((a, b) => b.count - a.count || a.reasonCode.localeCompare(b.reasonCode)),
    exclusions,
    unexpectedExclusionCount,
    sampleRenderableLessonPath: sampleDetail,
    forcePublishEnabled: isNNForcePublishValidRawLessons(),
    forcePublishedLessons,
  };
}

function buildRequiredAlliedProfessionCoverage(): AlliedProfessionCoverage[] {
  const lessons = getMarketingLessonsHubCatalogLessons("us-allied-core");
  return REQUIRED_ALLIED_PROFESSION_KEYS.map((professionKey) => {
    const profession = ALLIED_PROFESSIONS.find((candidate) => candidate.professionKey === professionKey);
    if (!profession) {
      return {
        professionKey,
        label: professionKey,
        route: alliedHealthLessonsIndexPath(professionKey),
        topicSlugsIn: [],
        mappedLessonCount: 0,
        mappedLessonSlugs: [],
        status: "unmapped",
        notes: "Profession exists in verification requirements but was not found in the allied profession registry.",
      } satisfies AlliedProfessionCoverage;
    }

    const topicSlugsIn = [...(profession.topicSlugsIn ?? [])];
    const mapped = topicSlugsIn.length
      ? lessons.filter((lesson) => topicSlugsIn.includes(lesson.topicSlug))
      : [];

    return {
      professionKey,
      label: profession.h1,
      route: alliedHealthLessonsIndexPath(profession.professionKey),
      topicSlugsIn,
      mappedLessonCount: mapped.length,
      mappedLessonSlugs: mapped.map((lesson) => lesson.slug),
      status: mapped.length > 0 ? "mapped" : "unmapped",
      notes:
        topicSlugsIn.length > 0
          ? mapped.length > 0
            ? "Profession page has a live lesson-source mapping through allied topic filters."
            : "Profession declares allied topic filters, but none of the public allied lessons match them yet."
          : "Profession page has no `topicSlugsIn` mapping, so it falls back to the generic allied hub.",
    } satisfies AlliedProfessionCoverage;
  });
}

export function buildLessonNormalizationCoverageReport(): LessonNormalizationCoverageReport {
  const generatedAt = new Date().toISOString();
  const pathways = listCatalogPathwayIdsWithLessonsSync()
    .map((pathwayId) => buildPathwayCoverage(pathwayId))
    .sort((a, b) => a.pathwayId.localeCompare(b.pathwayId));

  return {
    generatedAt,
    pathways,
    alliedProfessionCoverage: buildRequiredAlliedProfessionCoverage(),
  };
}

function renderPathwayMarkdown(pathway: LessonNormalizationPathwayCoverage): string {
  const lines = [
    `### \`${pathway.pathwayId}\``,
    "",
    `- Raw lessons: ${pathway.rawCount}`,
    `- Normalized lessons: ${pathway.normalizedCount}`,
    `- Renderable lessons: ${pathway.renderableCount}`,
    `- Excluded lessons: ${pathway.excludedCount}`,
    `- Raw to renderable ratio: ${pathway.rawToRenderableRatio}`,
    `- Unexpected exclusions: ${pathway.unexpectedExclusionCount} (${(pathway.unexpectedExclusionRate * 100).toFixed(1)}% of raw)`,
    `- Passes exclusion quality gate (≤20% unexpected): ${pathway.passesExclusionQualityGate ? "yes" : "no"}`,
    `- Public URL pattern: ${pathway.publicUrlPattern ?? "None"}`,
    `- Sample public lesson path: ${pathway.sampleRenderableLessonPath ?? "None"}`,
    `- Force publish mode: ${pathway.forcePublishEnabled ? "on" : "off"}`,
    ...(pathway.forcePublishedLessons.length > 0
      ? [
          "",
          "Force-published lessons (included only when NN_FORCE_PUBLISH_VALID_RAW_LESSONS is enabled):",
          ...pathway.forcePublishedLessons.slice(0, 40).map((l) => `- \`${l.slug}\` — ${l.title}`),
          ...(pathway.forcePublishedLessons.length > 40
            ? [`- …and ${pathway.forcePublishedLessons.length - 40} more`]
            : []),
        ]
      : ["", "Force-published lessons: None"]),
    "",
    "Top exclusion reasons:",
    ...(
      pathway.topExclusionReasons.length > 0
        ? pathway.topExclusionReasons.map((entry) => `- \`${entry.reasonCode}\`: ${entry.count}`)
        : ["- None"]
    ),
    "",
    "Exclusions:",
    ...(
      pathway.exclusions.length > 0
        ? pathway.exclusions.map(
            (entry) =>
              `- \`${entry.slug}\` | ${entry.title} | ${entry.reasonCode} | ${
                entry.allowed ? `allowed (${entry.allowlistComment})` : "unexpected"
              } | ${entry.reason}`,
          )
        : ["- None"]
    ),
    "",
  ];
  return lines.join("\n");
}

function renderAlliedMarkdown(rows: AlliedProfessionCoverage[]): string {
  const lines = [
    "## Allied Profession Mapping",
    "",
    ...rows.flatMap((row) => [
      `### \`${row.professionKey}\``,
      "",
      `- Label: ${row.label}`,
      `- Route: ${row.route}`,
      `- Status: ${row.status}`,
      `- topicSlugsIn: ${row.topicSlugsIn.length > 0 ? row.topicSlugsIn.join(", ") : "None"}`,
      `- Mapped lesson count: ${row.mappedLessonCount}`,
      `- Mapped lesson slugs: ${row.mappedLessonSlugs.length > 0 ? row.mappedLessonSlugs.join(", ") : "None"}`,
      `- Notes: ${row.notes}`,
      "",
    ]),
  ];
  return lines.join("\n");
}

export function renderLessonNormalizationCoverageMarkdown(report: LessonNormalizationCoverageReport): string {
  return [
    "# Lesson Normalization Coverage",
    "",
    `Generated at: ${report.generatedAt}`,
    "",
    "## Pathway Coverage",
    "",
    ...report.pathways.map((pathway) => renderPathwayMarkdown(pathway)),
    renderAlliedMarkdown(report.alliedProfessionCoverage),
  ].join("\n");
}

export function writeLessonNormalizationCoverageReports(report: LessonNormalizationCoverageReport): void {
  const reportsDir = reportsRootDir();
  fs.mkdirSync(reportsDir, { recursive: true });
  fs.writeFileSync(lessonNormalizationCoverageJsonPath(), `${JSON.stringify(report, null, 2)}\n`, "utf8");
  fs.writeFileSync(
    lessonNormalizationCoverageMarkdownPath(),
    `${renderLessonNormalizationCoverageMarkdown(report)}\n`,
    "utf8",
  );
}
