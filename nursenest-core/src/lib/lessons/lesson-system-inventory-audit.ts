import { getExamPathwayById } from "@/lib/exam-pathways/exam-pathways-catalog";
import {
  buildPathwayLessonSystemSections,
  classifyLessonForHub,
  type PathwayLessonSystemSection,
} from "@/lib/lessons/pathway-lesson-body-system-groups";
import { getEffectiveCatalogLessonsForPathwaySync } from "@/lib/lessons/pathway-lesson-catalog-sync";
import {
  lessonSystemTopicSlugCandidates,
  primaryLessonSystemTopicSlug,
  resolveLessonSystemNavigationTarget,
} from "@/lib/lessons/lesson-system-navigation";
import type { PathwayLessonRecord } from "@/lib/lessons/pathway-lesson-types";
import { learningConfigForPathwayId } from "@/lib/pathways/pathway-learning-structure";
import { normalizeTopicSlugInput } from "@/lib/study/topic-slug-normalize";

export const LESSON_SYSTEM_HARDENING_PATHWAY_IDS = [
  "ca-rn-nclex-rn",
  "us-rn-nclex-rn",
  "ca-rpn-rex-pn",
  "us-lpn-nclex-pn",
  "ca-np-cnple",
  "us-np-fnp",
  "us-np-agpcnp",
  "us-np-pmhnp",
  "us-np-whnp",
  "us-np-pnp-pc",
  "pre-nursing",
  "pre-nursing-ca",
  "ca-allied-core",
  "us-allied-core",
] as const;

export type LessonSystemHardeningGroup = "RN" | "RPN/PN" | "NP" | "Pre-Nursing" | "Allied";

export type LessonSystemCoverageRow = {
  pathwayId: string;
  pathwayLabel: string;
  group: LessonSystemHardeningGroup;
  displayLabel: string;
  systemLabel: string;
  routeSlug: string;
  aliases: string[];
  databaseMappings: string[];
  lessonCount: number;
  publishedCount: number;
  draftCount: number;
  hiddenCount: number;
  visible: boolean;
};

export type LessonConfiguredSystemRow = LessonSystemCoverageRow & {
  renderedSection: boolean;
};

export type LessonAliasConflictRow = {
  pathwayId: string;
  alias: string;
  systems: string[];
  routeSlugs: string[];
  lessonCounts: number[];
  conflict: boolean;
};

export type LessonZeroResultRow = {
  pathwayId: string;
  group: LessonSystemHardeningGroup;
  displayLabel: string;
  systemLabel: string;
  routeSlug: string;
  lessonCount: number;
  visible: boolean;
  status: "fail-visible-zero" | "not-rendered-empty-config";
};

export type OrphanLessonRow = {
  pathwayId: string;
  slug: string;
  title: string;
  topicSlug: string;
  bodySystem: string;
  system: string;
  classifiedSystem: string;
  issue: string;
};

export type LessonSystemHardeningAudit = {
  coverageRows: LessonSystemCoverageRow[];
  configuredRows: LessonConfiguredSystemRow[];
  aliasConflictRows: LessonAliasConflictRow[];
  zeroResultRows: LessonZeroResultRow[];
  orphanRows: OrphanLessonRow[];
};

function pathwayGroup(pathwayId: string): LessonSystemHardeningGroup {
  if (pathwayId.includes("-np-")) return "NP";
  if (pathwayId.includes("pre-nursing")) return "Pre-Nursing";
  if (pathwayId.includes("allied")) return "Allied";
  if (pathwayId.includes("rpn") || pathwayId.includes("lpn") || pathwayId.includes("pn")) return "RPN/PN";
  return "RN";
}

function pathwayLabel(pathwayId: string): string {
  const pathway = getExamPathwayById(pathwayId);
  return pathway?.shortName || pathway?.displayName || learningConfigForPathwayId(pathwayId).label || pathwayId;
}

function uniqueSorted(values: Iterable<string | null | undefined>): string[] {
  return [...new Set([...values].map((value) => (value ?? "").trim()).filter(Boolean))].sort((a, b) =>
    a.localeCompare(b, undefined, { sensitivity: "base" }),
  );
}

function normalizeKey(value: string | null | undefined): string {
  return normalizeTopicSlugInput(value).replace(/-/g, "_");
}

function configSystemIds(pathwayId: string): string[] {
  const config = learningConfigForPathwayId(pathwayId);
  return config.categories.flatMap((category) =>
    category.subcategories?.length ? category.subcategories.map((sub) => sub.id) : [category.id],
  );
}

function configSystemTitle(pathwayId: string, systemId: string): string {
  const config = learningConfigForPathwayId(pathwayId);
  for (const category of config.categories) {
    if (category.id === systemId) return category.displayName || category.title;
    for (const sub of category.subcategories ?? []) {
      if (sub.id === systemId) return `${category.title} - ${sub.title}`;
    }
  }
  return systemId;
}

function routeSlugForSection(section: PathwayLessonSystemSection): string {
  const mapped = resolveLessonSystemNavigationTarget(section.systemLabel)?.primaryTopicSlug ?? null;
  const firstLessonTopic = section.lessons.find((lesson) => lesson.topicSlug?.trim())?.topicSlug?.trim() ?? null;
  return mapped ?? firstLessonTopic ?? primaryLessonSystemTopicSlug(section.systemLabel) ?? section.systemLabel;
}

function databaseMappingsForLessons(lessons: PathwayLessonRecord[]): string[] {
  return uniqueSorted(
    lessons.flatMap((lesson) => [
      lesson.topicSlug ? `topicSlug:${lesson.topicSlug}` : null,
      lesson.bodySystem ? `bodySystem:${lesson.bodySystem}` : null,
      lesson.system ? `system:${lesson.system}` : null,
    ]),
  );
}

function aliasesForSystem(systemLabel: string, routeSlug: string): string[] {
  return uniqueSorted([routeSlug, ...lessonSystemTopicSlugCandidates(systemLabel)]);
}

function buildCoverageRow(args: {
  pathwayId: string;
  section: PathwayLessonSystemSection;
  visible: boolean;
}): LessonSystemCoverageRow {
  const routeSlug = routeSlugForSection(args.section);
  return {
    pathwayId: args.pathwayId,
    pathwayLabel: pathwayLabel(args.pathwayId),
    group: pathwayGroup(args.pathwayId),
    displayLabel: args.section.label,
    systemLabel: args.section.systemLabel,
    routeSlug,
    aliases: aliasesForSystem(args.section.systemLabel, routeSlug),
    databaseMappings: databaseMappingsForLessons(args.section.lessons),
    lessonCount: args.section.lessons.length,
    publishedCount: args.section.lessons.length,
    draftCount: 0,
    hiddenCount: 0,
    visible: args.visible,
  };
}

function lessonMatchesAlias(pathwayId: string, lesson: PathwayLessonRecord, alias: string): boolean {
  const aliasCandidates = new Set(lessonSystemTopicSlugCandidates(alias).map(normalizeKey));
  if (aliasCandidates.size === 0) aliasCandidates.add(normalizeKey(alias));
  const classified = classifyLessonForHub(lesson, pathwayId);
  const values = [lesson.topicSlug, lesson.bodySystem, lesson.system, classified];
  return values.some((value) =>
    lessonSystemTopicSlugCandidates(value).some((candidate) => aliasCandidates.has(normalizeKey(candidate))),
  );
}

export function buildLessonSystemHardeningAudit(
  pathwayIds: readonly string[] = LESSON_SYSTEM_HARDENING_PATHWAY_IDS,
): LessonSystemHardeningAudit {
  const coverageRows: LessonSystemCoverageRow[] = [];
  const configuredRows: LessonConfiguredSystemRow[] = [];
  const zeroResultRows: LessonZeroResultRow[] = [];
  const orphanRows: OrphanLessonRow[] = [];
  const aliasConflictRows: LessonAliasConflictRow[] = [];

  for (const pathwayId of pathwayIds) {
    const lessons = getEffectiveCatalogLessonsForPathwaySync(pathwayId);
    const sections = buildPathwayLessonSystemSections(lessons, pathwayId);
    const sectionBySystem = new Map(sections.map((section) => [section.systemLabel, section]));
    const allowedSystemIds = new Set(configSystemIds(pathwayId));

    for (const section of sections) {
      coverageRows.push(buildCoverageRow({ pathwayId, section, visible: true }));
    }

    for (const systemId of configSystemIds(pathwayId)) {
      const rendered = sectionBySystem.get(systemId);
      const section =
        rendered ??
        ({
          id: systemId,
          label: configSystemTitle(pathwayId, systemId),
          systemLabel: systemId,
          description: "",
          lessons: [],
          count: 0,
        } satisfies PathwayLessonSystemSection);
      const row = {
        ...buildCoverageRow({ pathwayId, section, visible: Boolean(rendered) }),
        renderedSection: Boolean(rendered),
      };
      configuredRows.push(row);
      if (row.lessonCount === 0) {
        zeroResultRows.push({
          pathwayId,
          group: pathwayGroup(pathwayId),
          displayLabel: row.displayLabel,
          systemLabel: row.systemLabel,
          routeSlug: row.routeSlug,
          lessonCount: row.lessonCount,
          visible: row.visible,
          status: row.visible ? "fail-visible-zero" : "not-rendered-empty-config",
        });
      }
    }

    for (const lesson of lessons) {
      const classifiedSystem = classifyLessonForHub(lesson, pathwayId);
      const missingMapping = !lesson.topicSlug?.trim() && !lesson.bodySystem?.trim() && !lesson.system?.trim();
      const outsidePathwayGrid = !allowedSystemIds.has(classifiedSystem);
      if (missingMapping || outsidePathwayGrid) {
        orphanRows.push({
          pathwayId,
          slug: lesson.slug,
          title: lesson.title,
          topicSlug: lesson.topicSlug ?? "",
          bodySystem: lesson.bodySystem ?? "",
          system: lesson.system ?? "",
          classifiedSystem,
          issue: missingMapping
            ? "No topicSlug, bodySystem, or system mapping"
            : "Classifies outside the pathway learning grid",
        });
      }
    }

    const aliasBuckets = new Map<string, LessonSystemCoverageRow[]>();
    for (const row of coverageRows.filter((r) => r.pathwayId === pathwayId)) {
      if (!resolveLessonSystemNavigationTarget(row.systemLabel)) continue;
      for (const alias of row.aliases) {
        const key = normalizeKey(alias);
        const bucket = aliasBuckets.get(key) ?? [];
        if (!bucket.some((existing) => existing.pathwayId === row.pathwayId && existing.systemLabel === row.systemLabel)) {
          bucket.push(row);
        }
        aliasBuckets.set(key, bucket);
      }
    }
    for (const [alias, rows] of aliasBuckets.entries()) {
      const systems = uniqueSorted(rows.map((row) => row.systemLabel));
      const routeSlugs = uniqueSorted(rows.map((row) => row.routeSlug));
      const lessonCounts = rows.map((row) => {
        const aliasLessonCount = lessons.filter((lesson) => lessonMatchesAlias(pathwayId, lesson, alias)).length;
        return aliasLessonCount > 0 ? aliasLessonCount : row.lessonCount;
      });
      aliasConflictRows.push({
        pathwayId,
        alias: alias.replace(/_/g, "-"),
        systems,
        routeSlugs,
        lessonCounts,
        conflict: systems.length > 1 || routeSlugs.length > 1,
      });
    }
  }

  return {
    coverageRows,
    configuredRows,
    aliasConflictRows,
    zeroResultRows,
    orphanRows,
  };
}

function mdEscape(value: string | number | boolean): string {
  return String(value).replace(/\|/g, "\\|").replace(/\n/g, " ");
}

function markdownTable(headers: string[], rows: Array<Array<string | number | boolean>>): string {
  const header = `| ${headers.map(mdEscape).join(" | ")} |`;
  const divider = `| ${headers.map(() => "---").join(" | ")} |`;
  const body = rows.map((row) => `| ${row.map(mdEscape).join(" | ")} |`);
  return [header, divider, ...body].join("\n");
}

function generatedHeader(title: string): string {
  return `# ${title}\n\nGenerated by \`scripts/generate-lesson-system-hardening-reports.mts\`.\n`;
}

export function renderLessonSystemHardeningReports(audit = buildLessonSystemHardeningAudit()): Record<string, string> {
  const visibleZeroRows = audit.zeroResultRows.filter((row) => row.visible);
  const conflictRows = audit.aliasConflictRows.filter((row) => row.conflict);
  const coverage = [
    generatedHeader("Lesson System Coverage Report"),
    `Visible lesson systems audited: ${audit.coverageRows.length}`,
    `Visible zero-result systems: ${visibleZeroRows.length}`,
    "",
    markdownTable(
      ["Pathway", "Group", "Display Label", "Route Slug", "Aliases", "Database Mappings", "Lesson Count"],
      audit.coverageRows.map((row) => [
        row.pathwayId,
        row.group,
        row.displayLabel,
        row.routeSlug,
        row.aliases.join(", "),
        row.databaseMappings.slice(0, 12).join(", ") + (row.databaseMappings.length > 12 ? " ..." : ""),
        row.lessonCount,
      ]),
    ),
    "",
  ].join("\n");

  const conflicts = [
    generatedHeader("Lesson Alias Conflict Report"),
    conflictRows.length === 0
      ? "No alias conflicts detected across visible lesson systems."
      : markdownTable(
          ["Pathway", "Alias", "Systems", "Route Slugs", "Lesson Counts"],
          conflictRows.map((row) => [
            row.pathwayId,
            row.alias,
            row.systems.join(", "),
            row.routeSlugs.join(", "),
            row.lessonCounts.join(", "),
          ]),
        ),
    "",
    "Alias inclusion sample:",
    markdownTable(
      ["Pathway", "Alias", "Systems", "Route Slugs", "Lesson Counts", "Conflict"],
      audit.aliasConflictRows
        .filter((row) =>
          ["renal", "renal-and-urinary", "fluids-electrolytes-and-acid-base", "mental-health", "maternity"].includes(
            row.alias,
          ),
        )
        .map((row) => [
          row.pathwayId,
          row.alias,
          row.systems.join(", "),
          row.routeSlugs.join(", "),
          row.lessonCounts.join(", "),
          row.conflict ? "Yes" : "No",
        ]),
    ),
    "",
  ].join("\n");

  const zeroResults = [
    generatedHeader("Lesson Zero Results Report"),
    visibleZeroRows.length === 0
      ? "PASS: No visible lesson system returns zero lessons."
      : markdownTable(
          ["Pathway", "Group", "Display Label", "Route Slug", "Status"],
          visibleZeroRows.map((row) => [row.pathwayId, row.group, row.displayLabel, row.routeSlug, row.status]),
        ),
    "",
    "Configured-but-not-rendered empty systems:",
    markdownTable(
      ["Pathway", "Group", "Display Label", "Route Slug", "Visible", "Status"],
      audit.zeroResultRows
        .filter((row) => !row.visible)
        .map((row) => [row.pathwayId, row.group, row.displayLabel, row.routeSlug, row.visible ? "Yes" : "No", row.status]),
    ),
    "",
  ].join("\n");

  const orphans = [
    generatedHeader("Orphan Lesson Report"),
    audit.orphanRows.length === 0
      ? "PASS: No orphan lessons detected in audited lesson pathway catalogs."
      : markdownTable(
          ["Pathway", "Slug", "Title", "Topic Slug", "Body System", "System", "Classified System", "Issue"],
          audit.orphanRows.map((row) => [
            row.pathwayId,
            row.slug,
            row.title,
            row.topicSlug,
            row.bodySystem,
            row.system,
            row.classifiedSystem,
            row.issue,
          ]),
        ),
    "",
  ].join("\n");

  const dashboard = [
    generatedHeader("Lesson Inventory Dashboard"),
    markdownTable(
      ["Pathway", "System", "Lesson Count", "Published Count", "Draft Count", "Hidden Count", "Rendered"],
      audit.configuredRows.map((row) => [
        row.pathwayId,
        row.displayLabel,
        row.lessonCount,
        row.publishedCount,
        row.draftCount,
        row.hiddenCount,
        row.renderedSection ? "Yes" : "No",
      ]),
    ),
    "",
  ].join("\n");

  return {
    "lesson-system-coverage-report.md": coverage,
    "lesson-alias-conflict-report.md": conflicts,
    "lesson-zero-results-report.md": zeroResults,
    "orphan-lesson-report.md": orphans,
    "lesson-inventory-dashboard.md": dashboard,
  };
}
