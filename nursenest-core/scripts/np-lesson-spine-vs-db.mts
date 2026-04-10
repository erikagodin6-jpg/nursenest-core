#!/usr/bin/env npx tsx
/**
 * NP canonical spine ↔ PathwayLesson DB alignment (read-only).
 *
 * Usage:
 *   npx tsx scripts/np-lesson-spine-vs-db.mts              # run alignment, write report, print summary
 *   npx tsx scripts/np-lesson-spine-vs-db.mts --dry-run    # no DB; all MISSING (validates spine + report shape)
 *   npx tsx scripts/np-lesson-spine-vs-db.mts --pathway us-np-fnp
 *   npx tsx scripts/np-lesson-spine-vs-db.mts --include-content-items
 *
 * Output: data/reports/pathway-lessons/np-db-alignment-report.json
 *   --dry-run defaults to np-db-alignment-report.dry-run.json so real DB reports are not overwritten.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { ContentStatus } from "@prisma/client";
import { prisma } from "@/lib/db";
import {
  buildFullNpAlignmentReport,
  loadNpSpineJson,
  type ContentItemMatchRow,
  type PathwayLessonMatchRow,
} from "@/lib/pathway-lessons/np-spine-db-alignment";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const DEFAULT_SPINE = path.join(ROOT, "data/reports/pathway-lessons/np-canonical-coverage-map.json");
const DEFAULT_OUT = path.join(ROOT, "data/reports/pathway-lessons/np-db-alignment-report.json");
const DRY_RUN_OUT = path.join(ROOT, "data/reports/pathway-lessons/np-db-alignment-report.dry-run.json");

const NP_PATHWAY_IDS = [
  "ca-np-cnple",
  "us-np-fnp",
  "us-np-agpcnp",
  "us-np-whnp",
  "us-np-pnp-pc",
  "us-np-pmhnp",
];

function parseArgs() {
  const argv = process.argv.slice(2);
  const dryRun = argv.includes("--dry-run");
  const includeContentItems = argv.includes("--include-content-items");
  let spine = DEFAULT_SPINE;
  let outExplicit = false;
  let out = dryRun ? DRY_RUN_OUT : DEFAULT_OUT;
  let pathwayFilter: string | null = null;
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === "--spine" && argv[i + 1]) {
      spine = path.resolve(argv[i + 1]!);
      i++;
    } else if (argv[i] === "--out" && argv[i + 1]) {
      out = path.resolve(argv[i + 1]!);
      outExplicit = true;
      i++;
    } else if (argv[i] === "--pathway" && argv[i + 1]) {
      pathwayFilter = argv[i + 1]!;
      i++;
    }
  }
  if (dryRun && !outExplicit) {
    out = DRY_RUN_OUT;
  }
  return { dryRun, includeContentItems, spine, out, pathwayFilter };
}

function printSummaryTable(report: ReturnType<typeof buildFullNpAlignmentReport>) {
  console.log("\n=== NP spine ↔ DB alignment summary (by pathway) ===\n");
  for (const pid of Object.keys(report.summaryByPathway).sort()) {
    const s = report.summaryByPathway[pid]!;
    console.log(
      `${pid.padEnd(16)} STRONG=${String(s.EXISTS_STRONG).padStart(4)} WEAK=${String(s.EXISTS_WEAK).padStart(4)} DUP=${String(s.DUPLICATE_CLUSTER).padStart(3)} MISS=${String(s.MISSING).padStart(4)} (topics=${s.spineTopicsEvaluated})`,
    );
  }
  console.log("\n=== By spine system category (aggregated across pathways) ===\n");
  for (const sid of Object.keys(report.summaryBySystemCategory).sort()) {
    const s = report.summaryBySystemCategory[sid]!;
    const t = s.EXISTS_STRONG + s.EXISTS_WEAK + s.DUPLICATE_CLUSTER + s.MISSING;
    console.log(
      `${sid.padEnd(28)} STRONG=${String(s.EXISTS_STRONG).padStart(4)} WEAK=${String(s.EXISTS_WEAK).padStart(4)} DUP=${String(s.DUPLICATE_CLUSTER).padStart(3)} MISS=${String(s.MISSING).padStart(4)} (rows=${t})`,
    );
  }
  console.log("");
}

async function loadPathwayLessons(pathwayFilter: string | null): Promise<PathwayLessonMatchRow[]> {
  const ids = pathwayFilter ? NP_PATHWAY_IDS.filter((id) => id === pathwayFilter) : NP_PATHWAY_IDS;
  if (pathwayFilter && ids.length === 0) {
    throw new Error(`Unknown pathway ${pathwayFilter}. Expected one of: ${NP_PATHWAY_IDS.join(", ")}`);
  }
  const rows = await prisma.pathwayLesson.findMany({
    where: {
      pathwayId: { in: ids },
      locale: "en",
      status: ContentStatus.PUBLISHED,
    },
    select: {
      id: true,
      pathwayId: true,
      slug: true,
      title: true,
      topic: true,
      topicSlug: true,
      bodySystem: true,
      status: true,
      sections: true,
    },
  });
  return rows as PathwayLessonMatchRow[];
}

async function loadNpContentItems(): Promise<ContentItemMatchRow[]> {
  const rows = await prisma.contentItem.findMany({
    where: {
      type: "lesson",
      tier: { equals: "np", mode: "insensitive" },
    },
    select: {
      id: true,
      slug: true,
      title: true,
      tags: true,
      bodySystem: true,
      tier: true,
      category: true,
    },
    take: 8000,
  });
  return rows as ContentItemMatchRow[];
}

async function main() {
  const { dryRun, includeContentItems, spine, out, pathwayFilter } = parseArgs();
  if (process.argv.includes("--help") || process.argv.includes("-h")) {
    console.log(`np-lesson-spine-vs-db.mts — read-only NP spine ↔ PathwayLesson alignment

Options:
  --dry-run                 Skip Prisma; emit report with all MISSING (schema check)
  --spine <path>            Spine JSON (default: data/reports/pathway-lessons/np-canonical-coverage-map.json)
  --out <path>              Report output (default: data/reports/pathway-lessons/np-db-alignment-report.json)
  --pathway <id>            Limit to one pathway (e.g. us-np-fnp)
  --include-content-items   Add legacy ContentItem tier=np hints in row notes
`);
    process.exit(0);
  }

  if (!fs.existsSync(spine)) {
    console.error("Spine file not found:", spine);
    process.exit(2);
  }

  const map = loadNpSpineJson(spine);
  let lessons: PathwayLessonMatchRow[] = [];
  let contentItems: ContentItemMatchRow[] | undefined;

  if (dryRun) {
    console.log("[dry-run] Skipping database; PathwayLesson list empty → expect all MISSING.");
  } else {
    lessons = await loadPathwayLessons(pathwayFilter);
    console.log(`Loaded ${lessons.length} published PathwayLesson rows (en).`);
    if (includeContentItems) {
      contentItems = await loadNpContentItems();
      console.log(`Loaded ${contentItems.length} ContentItem lesson rows (tier np) for hint pass.`);
    }
  }

  let report = buildFullNpAlignmentReport({
    map,
    lessons,
    spineFile: path.relative(ROOT, spine),
    contentItems,
  });

  if (pathwayFilter) {
    const rows = report.rows.filter((r) => r.pathwayId === pathwayFilter);
    const summaryByPathway: typeof report.summaryByPathway = {};
    const summaryBySystemCategory: typeof report.summaryBySystemCategory = {};
    for (const r of rows) {
      summaryByPathway[r.pathwayId] ??= {
        EXISTS_STRONG: 0,
        EXISTS_WEAK: 0,
        DUPLICATE_CLUSTER: 0,
        MISSING: 0,
        spineTopicsEvaluated: 0,
      };
      summaryByPathway[r.pathwayId]![r.classification] += 1;
      summaryByPathway[r.pathwayId]!.spineTopicsEvaluated += 1;
      summaryBySystemCategory[r.spineSystemId] ??= {
        EXISTS_STRONG: 0,
        EXISTS_WEAK: 0,
        DUPLICATE_CLUSTER: 0,
        MISSING: 0,
      };
      summaryBySystemCategory[r.spineSystemId]![r.classification] += 1;
    }
    report = { ...report, rows, summaryByPathway, summaryBySystemCategory };
  }

  fs.mkdirSync(path.dirname(out), { recursive: true });
  fs.writeFileSync(out, JSON.stringify(report, null, 2), "utf8");
  console.log(`Wrote ${path.relative(ROOT, out)} (${report.rows.length} alignment rows).`);
  printSummaryTable(report);

  if (!dryRun) {
    await prisma.$disconnect();
  }
}

main().catch((e) => {
  console.error(e);
  void prisma.$disconnect();
  process.exit(1);
});
