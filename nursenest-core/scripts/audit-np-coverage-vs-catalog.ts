/**
 * Offline audit: canonical NP coverage map ↔ merged static catalog (catalog.json + scoped gold injection).
 * Does not query the database — production DB may supersede catalog; re-run against DB when available.
 *
 * Run: npm run audit:np-coverage
 */
import * as fs from "node:fs";
import * as path from "node:path";
import { fileURLToPath } from "node:url";
import catalog from "../src/content/pathway-lessons/catalog.json";
import {
  evaluatePathwayLessonStructuralGate,
  lessonUsesPremiumStructure,
  validatePathwayLessonPremium,
} from "../src/lib/lessons/pathway-lesson-premium";
import { prependScopedGoldCatalogLessons } from "../src/lib/lessons/scoped-lessons/scoped-gold-registry";
import type { PathwayLessonRecord } from "../src/lib/lessons/pathway-lesson-types";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");

const NP_PATHWAY_IDS = [
  "ca-np-cnple",
  "us-np-fnp",
  "us-np-agpcnp",
  "us-np-whnp",
  "us-np-pnp-pc",
] as const;

type CoverageTopic = {
  id: string;
  title: string;
  exams: string[];
  auditDefault?: string;
  mergeInto?: string;
  dedupeNote?: string;
};

type CoverageFile = {
  systems: Array<{ id: string; name: string; topics: CoverageTopic[] }>;
  totals?: { mergeHints?: { id: string; mergeInto: string }[] };
};

const STOP = new Set([
  "the",
  "and",
  "for",
  "with",
  "from",
  "that",
  "this",
  "are",
  "not",
  "you",
  "all",
  "can",
  "may",
  "use",
  "per",
  "via",
  "out",
  "who",
  "how",
  "why",
  "its",
  "any",
  "one",
  "two",
  "basics",
  "basic",
  "overview",
  "level",
  "care",
  "primary",
  "clinical",
  "initial",
  "acute",
  "chronic",
]);

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 2 && !STOP.has(w));
}

type CatalogLesson = PathwayLessonRecord;

type CatalogShape = {
  pathways: Record<string, { lessons: CatalogLesson[] }>;
};

const data = catalog as CatalogShape;

function getMergedLessons(pathwayId: string): CatalogLesson[] {
  const raw = data.pathways[pathwayId]?.lessons ?? [];
  return prependScopedGoldCatalogLessons(pathwayId, raw as never) as unknown as CatalogLesson[];
}

function haystack(l: Pick<CatalogLesson, "title" | "slug" | "topic" | "bodySystem">): string {
  return `${l.title} ${l.slug} ${l.topic} ${l.bodySystem}`;
}

function matchScore(topicTitle: string, l: Pick<CatalogLesson, "title" | "slug" | "topic" | "bodySystem">): number {
  const toks = tokenize(topicTitle);
  if (toks.length === 0) return 0;
  const h = tokenize(haystack(l));
  const set = new Set(h);
  let s = 0;
  for (const t of toks) {
    if (set.has(t)) s += 1;
  }
  return s;
}

function scoreThreshold(topicTitle: string): number {
  const n = tokenize(topicTitle).length;
  return Math.max(2, Math.min(n, Math.ceil(n * 0.45)));
}

type Classification = "EXISTS_STRONG_SKIP" | "EXISTS_UPGRADE" | "CREATE_NEW" | "MERGE_INTO_EXISTING";

type AuditRow = {
  topicId: string;
  systemId: string;
  systemName: string;
  topicTitle: string;
  classification: Classification;
  mergeTarget?: string;
  bestMatch?: { slug: string; pathwayId: string; score: number };
  premiumOk?: boolean;
  usesPremiumStructure?: boolean;
  premiumIssueCount?: number;
  publishReady?: boolean;
  structureMode?: string;
  notes?: string;
};

function classifyLesson(l: CatalogLesson): {
  premiumOk: boolean;
  issueCount: number;
  usesPremium: boolean;
  publishReady: boolean;
  structureMode: string;
} {
  const usesPremium = lessonUsesPremiumStructure(l.sections);
  const v = validatePathwayLessonPremium(l);
  const gate = evaluatePathwayLessonStructuralGate(l);
  return {
    premiumOk: v.ok,
    issueCount: v.issues.length,
    usesPremium,
    publishReady: gate.publicComplete,
    structureMode: gate.structureMode,
  };
}

function main() {
  const mapPath = path.join(ROOT, "data/reports/pathway-lessons/np-canonical-coverage-map.json");
  const coverage = JSON.parse(fs.readFileSync(mapPath, "utf8")) as CoverageFile;

  const pathwayLessons = new Map<string, CatalogLesson[]>();
  const slugToPathways = new Map<string, string[]>();
  const allLessonsFlat: { pathwayId: string; lesson: CatalogLesson }[] = [];

  for (const pid of NP_PATHWAY_IDS) {
    const list = getMergedLessons(pid);
    pathwayLessons.set(pid, list);
    for (const l of list) {
      allLessonsFlat.push({ pathwayId: pid, lesson: l });
      const cur = slugToPathways.get(l.slug) ?? [];
      if (!cur.includes(pid)) cur.push(pid);
      slugToPathways.set(l.slug, cur);
    }
  }

  const duplicateSlugs = [...slugToPathways.entries()].filter(([, pids]) => pids.length > 1);

  const rows: AuditRow[] = [];

  for (const sys of coverage.systems) {
    for (const topic of sys.topics) {
      if (topic.mergeInto) {
        rows.push({
          topicId: topic.id,
          systemId: sys.id,
          systemName: sys.name,
          topicTitle: topic.title,
          classification: "MERGE_INTO_EXISTING",
          mergeTarget: topic.mergeInto,
          notes: "Canonical spine: do not author a separate lesson; link or fold into target.",
        });
        continue;
      }

      let best: { slug: string; pathwayId: string; score: number; lesson: CatalogLesson } | null = null;
      const th = scoreThreshold(topic.title);

      for (const { pathwayId, lesson } of allLessonsFlat) {
        const sc = matchScore(topic.title, lesson);
        if (sc < th) continue;
        if (!best || sc > best.score || (sc === best.score && lesson.slug < best.slug)) {
          best = { slug: lesson.slug, pathwayId, score: sc, lesson };
        }
      }

      if (!best) {
        rows.push({
          topicId: topic.id,
          systemId: sys.id,
          systemName: sys.name,
          topicTitle: topic.title,
          classification: "CREATE_NEW",
          notes: "No merged-catalog lesson met token overlap threshold; verify DB before authoring.",
        });
        continue;
      }

      const { premiumOk, issueCount, usesPremium, publishReady, structureMode } = classifyLesson(best.lesson);
      const classification: Classification = publishReady ? "EXISTS_STRONG_SKIP" : "EXISTS_UPGRADE";

      rows.push({
        topicId: topic.id,
        systemId: sys.id,
        systemName: sys.name,
        topicTitle: topic.title,
        classification,
        bestMatch: { slug: best.slug, pathwayId: best.pathwayId, score: best.score },
        premiumOk,
        usesPremiumStructure: usesPremium,
        premiumIssueCount: issueCount,
        publishReady,
        structureMode,
        notes: publishReady
          ? `Publish-ready (${structureMode}); skip net-new for this topic unless clinical update.`
          : `Upgrade in place (${best.slug}, ${structureMode}): ${issueCount} structural/premium note(s).`,
      });
    }
  }

  const summary = {
    generatedAt: new Date().toISOString(),
    source: "np-canonical-coverage-map.json + catalog.json + scoped gold injection (no DB)",
    pathwayLessonCounts: Object.fromEntries(
      NP_PATHWAY_IDS.map((id) => [id, pathwayLessons.get(id)?.length ?? 0]),
    ),
    duplicateSlugsAcrossPathways: duplicateSlugs.map(([slug, pids]) => ({ slug, pathwayIds: pids })),
    classificationCounts: rows.reduce(
      (acc, r) => {
        acc[r.classification] = (acc[r.classification] ?? 0) + 1;
        return acc;
      },
      {} as Record<Classification, number>,
    ),
    bySystem: coverage.systems.map((s) => {
      const sysRows = rows.filter((r) => r.systemId === s.id);
      const c = sysRows.reduce(
        (acc, r) => {
          acc[r.classification] = (acc[r.classification] ?? 0) + 1;
          return acc;
        },
        {} as Partial<Record<Classification, number>>,
      );
      return { systemId: s.id, systemName: s.name, topicCount: s.topics.length, classifications: c };
    }),
    rows,
  };

  const outJson = path.join(ROOT, "data/reports/pathway-lessons/np-coverage-catalog-audit.json");
  fs.mkdirSync(path.dirname(outJson), { recursive: true });
  fs.writeFileSync(outJson, JSON.stringify(summary, null, 2), "utf8");

  const mdPath = path.join(ROOT, "data/reports/pathway-lessons/np-coverage-catalog-audit-summary.md");
  const lines: string[] = [
    "# NP coverage vs static catalog audit",
    "",
    `Generated: ${summary.generatedAt}`,
    "",
    "## Pathway lesson counts (merged catalog)",
    "",
    ...NP_PATHWAY_IDS.map((id) => `- **${id}:** ${summary.pathwayLessonCounts[id]}`),
    "",
    "## Classification counts (topic rows)",
    "",
    ...(["EXISTS_STRONG_SKIP", "EXISTS_UPGRADE", "CREATE_NEW", "MERGE_INTO_EXISTING"] as const).map(
      (k) => `- **${k}:** ${summary.classificationCounts[k] ?? 0}`,
    ),
    "",
    "## Duplicate slugs across pathways",
    "",
    summary.duplicateSlugsAcrossPathways.length
      ? summary.duplicateSlugsAcrossPathways.map((d) => `- \`${d.slug}\`: ${d.pathwayIds.join(", ")}`).join("\n")
      : "_None in audited NP pathways._",
    "",
    "## By system",
    "",
    ...summary.bySystem.map(
      (b) =>
        `### ${b.systemName} (\`${b.systemId}\`)\n\n- Topics: ${b.topicCount}\n- STRONG_SKIP: ${b.classifications.EXISTS_STRONG_SKIP ?? 0} · UPGRADE: ${b.classifications.EXISTS_UPGRADE ?? 0} · CREATE: ${b.classifications.CREATE_NEW ?? 0} · MERGE: ${b.classifications.MERGE_INTO_EXISTING ?? 0}`,
    ),
    "",
    `Full table: ${path.relative(ROOT, outJson)} (JSON rows array).`,
    "",
  ];
  fs.writeFileSync(mdPath, lines.join("\n"), "utf8");

  console.log("Wrote", outJson);
  console.log("Wrote", mdPath);
  console.log("Counts:", summary.classificationCounts);
}

main();
