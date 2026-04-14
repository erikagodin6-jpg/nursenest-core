/**
 * Full-site bundled-catalog lesson completeness audit.
 * Read-only. Writes under workspace data/audit/.
 *
 * Run: cd nursenest-core && npx tsx scripts/audit/run-lesson-completeness-audit.mts
 */
import { mkdirSync, writeFileSync, readdirSync, readFileSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { ExamFamily } from "@prisma/client";
import { TierCode } from "@prisma/client";
import { buildExamPathwayPath, getExamPathwayById, listPublicExamPathways } from "@/lib/exam-pathways/exam-product-registry";
import { stripToPlainText } from "@/lib/content-quality/plain-text";
import {
  getCatalogPathwayLessonsSync,
  listCatalogPathwayIdsWithLessonsSync,
  sortAndFilterLessonsForPathwayContext,
} from "@/lib/lessons/pathway-lesson-catalog-sync";
import { lessonCorpusForLinkCount } from "@/lib/lessons/pathway-lesson-premium";
import type { PathwayLessonRecord } from "@/lib/lessons/pathway-lesson-types";
import {
  buildRecommendedActions,
  deriveStatus,
  detectPlaceholderSignals,
  type LessonCompletenessStatus,
  lessonTotalWords,
  type OverlayIndex,
  scoreEducationalSubstance,
  scoreLinks,
  scoreLocalization,
  scoreStructuralFromGate,
  SCORE_WEIGHTS,
  weightedOverall,
} from "@/scripts/audit/lib/lesson-completeness-scoring";

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = join(__dirname, "../../..");
const OUT_DIR = join(REPO_ROOT, "data/audit");

function buildOverlayIndex(): OverlayIndex {
  const base = join(REPO_ROOT, "nursenest-core", "public", "i18n", "educational-overlays");
  const keysByLocale = new Map<string, Set<string>>();
  const localesScanned: string[] = [];
  if (!existsSync(base)) {
    return { keysByLocale, localesScanned: [] };
  }
  for (const dirent of readdirSync(base, { withFileTypes: true })) {
    if (!dirent.isDirectory()) continue;
    const loc = dirent.name;
    if (loc === "en") continue;
    const fp = join(base, loc, "lessons.json");
    if (!existsSync(fp)) continue;
    try {
      const raw = JSON.parse(readFileSync(fp, "utf8")) as Record<string, unknown>;
      keysByLocale.set(loc, new Set(Object.keys(raw)));
      localesScanned.push(loc);
    } catch {
      /* skip malformed */
    }
  }
  localesScanned.sort();
  return { keysByLocale, localesScanned };
}

function isAlliedPathway(p: { stripeTier?: TierCode; examFamily?: ExamFamily }): boolean {
  return p.stripeTier === TierCode.ALLIED || p.examFamily === ExamFamily.ALLIED;
}

function isRoutablePathway(p: { status?: string } | undefined): boolean {
  return p?.status === "active";
}

type LessonRow = {
  lessonId: string;
  slug: string;
  title: string;
  pathwayId: string;
  exam: string;
  country: string;
  sourceType: "bundled_catalog";
  routable: boolean;
  inEffectiveHub: boolean;
  structuralScore: number;
  educationalScore: number;
  linkScore: number;
  localizationScore: number;
  overallScore: number;
  status: LessonCompletenessStatus;
  reasons: string[];
  recommendedActions: string[];
  evidence: {
    structureMode: string;
    publicComplete: boolean;
    gateIssues: string[];
    gateWarnings: string[];
    internalStudyLinkCount: number;
    sectionCount: number;
    totalWords: number;
    placeholderSignals: string[];
    educationalBucketsSatisfied: string[];
    educationalBucketsMissing: string[];
    overlayLocalesWithDepth: string[];
    englishOnlyEducationalLikely: boolean;
    scoringWeights: typeof SCORE_WEIGHTS;
  };
};

type PathwayRollup = {
  pathwayId: string;
  country: string;
  exam: string;
  roleTrack: string;
  nursingPriority: boolean;
  totalLessons: number;
  productionReady: number;
  usableButThin: number;
  structurallyIncomplete: number;
  contentIncomplete: number;
  localizationIncomplete: number;
  notRoutable: number;
  duplicateOrUnclear: number;
  averageOverallScore: number;
  topReasons: Array<{ reason: string; count: number }>;
};

function processLesson(
  lesson: PathwayLessonRecord,
  pathwayId: string,
  exam: string,
  country: string,
  routable: boolean,
  inEffectiveHub: boolean,
  duplicateCandidate: boolean,
  overlayIndex: OverlayIndex,
): LessonRow {
  const gate = lesson.structuralQuality;
  const internalStudyLinkCount = gate?.internalStudyLinkCount ?? 0;
  const corpus = lessonCorpusForLinkCount(lesson);
  const placeholderFlags = detectPlaceholderSignals(corpus + "\n" + (lesson.title ?? ""));
  const totalWords = lessonTotalWords(lesson);
  const sectionCount = lesson.sections?.length ?? 0;

  const struct = scoreStructuralFromGate(
    Boolean(gate?.publicComplete),
    gate?.issues ?? [],
    gate?.warnings ?? [],
    totalWords,
    sectionCount,
  );
  const edu = scoreEducationalSubstance(lesson);
  const lk = scoreLinks(internalStudyLinkCount);
  const loc = scoreLocalization(pathwayId, lesson.slug, overlayIndex);

  const structuralScore = struct.score;
  const educationalScore = edu.score;
  const linkScore = lk.score;
  const localizationScore = loc.score;
  const overallScore = weightedOverall(structuralScore, educationalScore, linkScore, localizationScore);

  const status = deriveStatus({
    overallScore,
    structuralScore,
    educationalScore,
    localizationScore,
    linkScore,
    publicComplete: Boolean(gate?.publicComplete),
    routable,
    duplicateCandidate,
    placeholderFlags,
    totalWords,
    sectionCount,
  });

  const reasons: string[] = [
    ...struct.reasons,
    ...edu.missing.map((m) => `missing_educational:${m}`),
    ...lk.reasons.map((r) => `links:${r}`),
    ...loc.reasons,
  ];
  if (placeholderFlags.length) reasons.push(...placeholderFlags.map((p) => `placeholder:${p}`));
  if (!inEffectiveHub) reasons.push("not_in_exam_filtered_hub_list");

  const recommendedActions = buildRecommendedActions(status, edu.missing);

  return {
    lessonId: `${pathwayId}:${lesson.slug}`,
    slug: lesson.slug,
    title: lesson.title,
    pathwayId,
    exam,
    country,
    sourceType: "bundled_catalog",
    routable,
    inEffectiveHub,
    structuralScore,
    educationalScore,
    linkScore,
    localizationScore,
    overallScore,
    status,
    reasons: [...new Set(reasons)].slice(0, 24),
    recommendedActions,
    evidence: {
      structureMode: gate?.structureMode ?? "unknown",
      publicComplete: Boolean(gate?.publicComplete),
      gateIssues: gate?.issues ?? [],
      gateWarnings: gate?.warnings ?? [],
      internalStudyLinkCount,
      sectionCount,
      totalWords,
      placeholderSignals: placeholderFlags,
      educationalBucketsSatisfied: edu.satisfied,
      educationalBucketsMissing: edu.missing,
      overlayLocalesWithDepth: loc.overlayLocalesWithDepth,
      englishOnlyEducationalLikely: loc.englishOnlyEducationalLikely,
      scoringWeights: SCORE_WEIGHTS,
    },
  };
}

function sortPathwayIds(ids: string[]): string[] {
  return [...ids].sort((a, b) => {
    const pa = getExamPathwayById(a);
    const pb = getExamPathwayById(b);
    const aAllied = pa ? isAlliedPathway(pa) : false;
    const bAllied = pb ? isAlliedPathway(pb) : false;
    if (aAllied !== bAllied) return aAllied ? 1 : -1;
    const ca = getCatalogPathwayLessonsSync(a).length;
    const cb = getCatalogPathwayLessonsSync(b).length;
    return cb - ca;
  });
}

async function main() {
  mkdirSync(OUT_DIR, { recursive: true });
  const generatedAt = new Date().toISOString();
  const overlayIndex = buildOverlayIndex();

  const catalogIds = listCatalogPathwayIdsWithLessonsSync();
  const sortedPathwayIds = sortPathwayIds(catalogIds);

  const slugOccurrences = new Map<string, string[]>();
  const rows: LessonRow[] = [];

  for (const pathwayId of sortedPathwayIds) {
    const lessons = getCatalogPathwayLessonsSync(pathwayId);
    const effective = sortAndFilterLessonsForPathwayContext(pathwayId, lessons);
    const effectiveSlugs = new Set(effective.map((l) => l.slug));

    const pathway = getExamPathwayById(pathwayId);
    const routable = pathway ? isRoutablePathway(pathway) : false;
    const exam = pathway?.examCode ?? "unknown";
    const country = pathway?.countrySlug ?? "unknown";

    for (const lesson of lessons) {
      const key = lesson.slug;
      const arr = slugOccurrences.get(key) ?? [];
      arr.push(pathwayId);
      slugOccurrences.set(key, arr);
    }

    const batchSize = 80;
    for (let i = 0; i < lessons.length; i += batchSize) {
      const chunk = lessons.slice(i, i + batchSize);
      for (const lesson of chunk) {
        const dupList = slugOccurrences.get(lesson.slug) ?? [];
        const duplicateCandidate = dupList.length > 1;
        const row = processLesson(
          lesson,
          pathwayId,
          exam,
          country,
          routable,
          effectiveSlugs.has(lesson.slug),
          duplicateCandidate,
          overlayIndex,
        );
        rows.push(row);
      }
    }
  }

  const statusCounts: Record<LessonCompletenessStatus, number> = {
    production_ready: 0,
    usable_but_thin: 0,
    structurally_incomplete: 0,
    content_incomplete: 0,
    localization_incomplete: 0,
    not_routable: 0,
    duplicate_or_unclear_source: 0,
  };
  for (const r of rows) {
    statusCounts[r.status] += 1;
  }

  const byPathway = new Map<string, LessonRow[]>();
  for (const r of rows) {
    const list = byPathway.get(r.pathwayId) ?? [];
    list.push(r);
    byPathway.set(r.pathwayId, list);
  }

  const pathwayRollups: PathwayRollup[] = [];
  const reasonHistogram = new Map<string, number>();

  for (const [pid, list] of byPathway) {
    const p = getExamPathwayById(pid);
    const nursingPriority = p ? !isAlliedPathway(p) : true;
    const scores = list.map((x) => x.overallScore);
    const avg = scores.length ? scores.reduce((a, b) => a + b, 0) / scores.length : 0;
    for (const lesson of list) {
      for (const reason of lesson.reasons.slice(0, 6)) {
        reasonHistogram.set(reason, (reasonHistogram.get(reason) ?? 0) + 1);
      }
    }
    const topReasons = [...reasonHistogram.entries()]
      .filter(([k]) => list.some((l) => l.reasons.includes(k)))
      .map(([reason, count]) => ({ reason, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 8);

    pathwayRollups.push({
      pathwayId: pid,
      country: p?.countrySlug ?? "unknown",
      exam: p?.examCode ?? "unknown",
      roleTrack: p?.roleTrack ?? "unknown",
      nursingPriority,
      totalLessons: list.length,
      productionReady: list.filter((x) => x.status === "production_ready").length,
      usableButThin: list.filter((x) => x.status === "usable_but_thin").length,
      structurallyIncomplete: list.filter((x) => x.status === "structurally_incomplete").length,
      contentIncomplete: list.filter((x) => x.status === "content_incomplete").length,
      localizationIncomplete: list.filter((x) => x.status === "localization_incomplete").length,
      notRoutable: list.filter((x) => x.status === "not_routable").length,
      duplicateOrUnclear: list.filter((x) => x.status === "duplicate_or_unclear_source").length,
      averageOverallScore: Math.round(avg * 10) / 10,
      topReasons,
    });
  }

  pathwayRollups.sort((a, b) => {
    if (a.nursingPriority !== b.nursingPriority) return a.nursingPriority ? -1 : 1;
    return b.totalLessons - a.totalLessons;
  });

  const globalTopReasons = [...reasonHistogram.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 25)
    .map(([reason, count]) => ({ reason, count }));

  const byExam = new Map<string, number>();
  const byCountry = new Map<string, number>();
  const bySourceType = new Map<string, number>();
  for (const r of rows) {
    byExam.set(r.exam, (byExam.get(r.exam) ?? 0) + 1);
    byCountry.set(r.country, (byCountry.get(r.country) ?? 0) + 1);
    bySourceType.set(r.sourceType, (bySourceType.get(r.sourceType) ?? 0) + 1);
  }

  const priorityQueue = [...rows]
    .sort((a, b) => {
      const pa = getExamPathwayById(a.pathwayId);
      const pb = getExamPathwayById(b.pathwayId);
      const aAllied = pa ? isAlliedPathway(pa) : false;
      const bAllied = pb ? isAlliedPathway(pb) : false;
      if (aAllied !== bAllied) return aAllied ? 1 : -1;
      const va = byPathway.get(a.pathwayId)?.length ?? 0;
      const vb = byPathway.get(b.pathwayId)?.length ?? 0;
      if (vb !== va) return vb - va;
      if (a.routable !== b.routable) return a.routable ? -1 : 1;
      return a.overallScore - b.overallScore;
    })
    .filter((r) => r.status !== "production_ready")
    .slice(0, 400)
    .map((r) => ({
      lessonId: r.lessonId,
      pathwayId: r.pathwayId,
      slug: r.slug,
      title: r.title,
      status: r.status,
      overallScore: r.overallScore,
      reasons: r.reasons.slice(0, 8),
      recommendedActions: r.recommendedActions,
    }));

  const summaryJson = {
    generatedAt,
    methodology: {
      dataSource: "Bundled pathway catalog (catalog.json + allied-bundled + new-grad + scoped-gold merge via getCatalogPathwayLessonsSync). Does not enumerate Prisma-only lessons.",
      scoringWeights: SCORE_WEIGHTS,
      structuralBasis:
        "evaluatePathwayLessonStructuralGate (pathway-lesson-premium): premium spine vs legacy five-block; subscriber completeness hooks.",
      educationalBasis:
        "Heuristic buckets for intro/overview, core depth, application/scenario, summary, exam reasoning cues — not identical headings per lesson.",
      linkBasis: "countInternalStudyLinks — target band 3–8; low counts penalize linkScore.",
      localizationBasis:
        "Presence of lesson key in public/i18n/educational-overlays/{es,fr,tl,...}/lessons.json — absence implies English-primary educational body with localized shell elsewhere.",
      strictness:
        "Production-ready requires high overall, passing gate, educational depth, and sufficient word count. Catalog SEO padding is not treated as teaching substance.",
    },
    overlayLocalesScanned: overlayIndex.localesScanned,
    totals: {
      lessonsScanned: rows.length,
      pathwaysWithLessons: pathwayRollups.length,
      ...statusCounts,
      byPathway: Object.fromEntries(
        [...byPathway.entries()].map(([k, v]) => [k, v.length]).sort((a, b) => b[1] - a[1]),
      ),
      byExam: Object.fromEntries([...byExam.entries()].sort((a, b) => b[1] - a[1])),
      byCountry: Object.fromEntries([...byCountry.entries()].sort((a, b) => b[1] - a[1])),
      bySourceType: Object.fromEntries([...bySourceType.entries()]),
    },
    globalTopFailureReasons: globalTopReasons,
    limitations: [
      "Bundled catalog only; DB-published-only lessons are not in this scan.",
      "Localization score uses overlay file keys only — DB-backed overlays are not merged in this script.",
      "Duplicate slug detection is cross-pathway slug string match, not import provenance.",
      "inEffectiveHub=false means exam/country filter excluded the lesson from default hub ordering — it may still exist in JSON.",
    ],
  };

  writeFileSync(join(OUT_DIR, "lesson-completeness-audit.json"), JSON.stringify({ generatedAt, lessons: rows }, null, 2));
  writeFileSync(join(OUT_DIR, "lesson-completeness-summary.json"), JSON.stringify(summaryJson, null, 2));
  writeFileSync(
    join(OUT_DIR, "lesson-completeness-priority-queue.json"),
    JSON.stringify({ generatedAt, queue: priorityQueue }, null, 2),
  );
  writeFileSync(
    join(OUT_DIR, "lesson-completeness-pathway-rollup.json"),
    JSON.stringify({ generatedAt, pathways: pathwayRollups }, null, 2),
  );

  const md = buildMarkdownSummary({
    generatedAt,
    rows,
    summaryJson,
    pathwayRollups,
    priorityQueue,
  });
  writeFileSync(join(OUT_DIR, "lesson-completeness-summary.md"), md);

  console.log(`Wrote ${rows.length} lesson rows under ${OUT_DIR}`);
  console.log(
    `Status: production_ready=${statusCounts.production_ready} usable_but_thin=${statusCounts.usable_but_thin} structurally_incomplete=${statusCounts.structurally_incomplete}`,
  );
}

function buildMarkdownSummary(args: {
  generatedAt: string;
  rows: LessonRow[];
  summaryJson: Record<string, unknown>;
  pathwayRollups: PathwayRollup[];
  priorityQueue: ReturnType<typeof main> extends Promise<void> ? never : unknown;
}): string {
  const nursingRollups = args.pathwayRollups.filter((p) => p.nursingPriority).slice(0, 12);
  const topSystemic = (args.summaryJson.globalTopFailureReasons as { reason: string; count: number }[])?.slice(0, 15) ?? [];

  const lines: string[] = [];
  lines.push(`# Lesson completeness audit`);
  lines.push(``);
  lines.push(`Generated: ${args.generatedAt}`);
  lines.push(``);
  lines.push(`## What was scanned`);
  lines.push(
    `- Bundled pathway lesson catalog (merged JSON: main catalog, allied-bundled, new-grad transition, scoped-gold prepend).`,
  );
  lines.push(`- Per-lesson structural gate from \`evaluatePathwayLessonStructuralGate\` (premium vs legacy).`);
  lines.push(`- Educational substance heuristics (section depth + exam-reasoning cues).`);
  lines.push(`- Internal study links (LESSON: / root-relative markdown).`);
  lines.push(`- Educational overlay keys under \`public/i18n/educational-overlays/*/lessons.json\` (non-EN locales).`);
  lines.push(``);
  lines.push(`## Methodology`);
  lines.push(`- **Scores**: structural 0–100, educational 0–100, link 0–100, localization 0–100.`);
  lines.push(
    `- **Overall** = ${SCORE_WEIGHTS.structural}×structural + ${SCORE_WEIGHTS.educational}×educational + ${SCORE_WEIGHTS.links}×links + ${SCORE_WEIGHTS.localization}×localization.`,
  );
  lines.push(`- **Strictness**: A lesson is not “complete” merely because sections exist or SEO fields pass padding.`);
  lines.push(`- **Nursing-first reporting**: Pathways sorted with nursing tiers before allied in rollups and priority queue.`);
  lines.push(``);
  lines.push(`## Totals (from lesson-completeness-summary.json)`);
  lines.push(`- Lessons scanned: **${args.rows.length}**`);
  const t = args.summaryJson.totals as Record<string, unknown> | undefined;
  if (t && typeof t === "object") {
    lines.push(`- production_ready: **${String(t.production_ready)}**`);
    lines.push(`- usable_but_thin: **${String(t.usable_but_thin)}**`);
    lines.push(`- structurally_incomplete: **${String(t.structurally_incomplete)}**`);
    lines.push(`- content_incomplete: **${String(t.content_incomplete)}**`);
    lines.push(`- localization_incomplete: **${String(t.localization_incomplete)}**`);
    lines.push(`- not_routable: **${String(t.not_routable)}**`);
    lines.push(`- duplicate_or_unclear_source: **${String(t.duplicate_or_unclear_source)}**`);
  }
  lines.push(``);
  lines.push(`## Top failing pathways (nursing-first, by volume)`);
  for (const p of nursingRollups) {
    lines.push(
      `- **${p.pathwayId}** (${p.country}/${p.roleTrack}/${p.exam}): ${p.totalLessons} lessons · avg score ${p.averageOverallScore} · ready ${p.productionReady} · thin ${p.usableButThin} · structural gaps ${p.structurallyIncomplete}`,
    );
  }
  lines.push(``);
  lines.push(`## Top systemic issues (reason histogram)`);
  for (const x of topSystemic) {
    lines.push(`- ${x.reason}: **${x.count}**`);
  }
  lines.push(``);
  lines.push(`## Suggested remediation order`);
  lines.push(`1. Fix structural gate failures on high-volume nursing pathways (NCLEX-RN, NCLEX-PN, etc.).`);
  lines.push(`2. Add internal study links (3–8) and relatedLessonRefs where missing.`);
  lines.push(`3. Deepen educational buckets (intro, core, scenario, takeaways) for \`usable_but_thin\`.`);
  lines.push(`4. Expand educational overlays where marketing shell is localized but lesson body is EN-primary.`);
  lines.push(`5. Resolve duplicate slugs across pathways with documented canonical routing.`);
  lines.push(``);
  lines.push(`## Lessons that exist but are not actually complete`);
  lines.push(`- **Present in catalog**: Row exists in merged bundled JSON for a pathway.`);
  lines.push(`- **Routable**: Pathway registry status is \`active\` (marketing hub can exist).`);
  lines.push(`- **Structurally non-empty**: Sections array exists with bodies; may still fail premium/legacy gates.`);
  lines.push(`- **Educationally complete**: Substance buckets + word depth + reasoning cues — not just non-blank fields.`);
  lines.push(`- **Production ready**: High overall score, gate passes, links in band, sufficient depth — rare by design under strict scoring.`);
  lines.push(
    `Many lessons are **catalog-present** and **structurally non-empty** but still **not production-ready** because depth, links, or educational coverage fail the bar.`,
  );
  lines.push(``);
  lines.push(`## Honest limitations`);
  lines.push(`- DB-only lessons not in bundled JSON are omitted.`);
  lines.push(`- Overlay detection is file-key based; runtime DB overlays are not merged here.`);
  lines.push(`- \`inEffectiveHub=false\` flags lessons filtered by exam/country context — not “invalid”, just not listed on default hub slice.`);
  lines.push(`- Full repo TypeScript may still report unrelated errors; this audit is standalone.`);
  return lines.join("\n");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
