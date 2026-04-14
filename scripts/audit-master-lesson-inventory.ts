#!/usr/bin/env npx tsx
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { EXAM_PATHWAYS } from "../src/lib/exam-pathways/exam-product-registry";
import { PRE_NURSING_MODULE_REGISTRY } from "../src/content/pre-nursing/pre-nursing-registry";
import { ALLIED_PROFESSIONS } from "../src/lib/allied/allied-professions-registry";
import { prependScopedGoldCatalogLessons } from "../src/lib/lessons/scoped-lessons/scoped-gold-registry";

type InventoryStatus =
  | "fully present"
  | "present but thin/incomplete"
  | "duplicated"
  | "implied/scaffolded but missing authored lesson content";

type InventoryGroup =
  | "Pre-nursing"
  | "Canada RPN / REx-PN"
  | "US LPN/LVN / NCLEX-PN"
  | "Canada RN"
  | "US RN / NCLEX-RN"
  | "NP"
  | "Allied Health";

type InventoryRow = {
  group: InventoryGroup;
  subgroup?: string;
  title: string;
  slug: string | null;
  source: string;
  status: InventoryStatus;
  notes?: string | null;
};

type CanonicalRow = {
  group: string;
  subgroup?: string;
  title: string;
  status: "already exists" | "needs completion" | "missing and should be added";
  evidence: string;
};

type JsonRecord = Record<string, unknown>;

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const REPORTS_DIR = path.join(ROOT, "reports");
const DOCS_DIR = path.join(ROOT, "docs");

const JSON_OUT = path.join(REPORTS_DIR, "lesson-inventory-audit.json");
const MD_OUT = path.join(DOCS_DIR, "lesson-inventory-audit.md");

const CATALOG_PATH = path.join(ROOT, "src/content/pathway-lessons/catalog.json");
const PRE_NURSING_STRINGS_PATH = path.join(ROOT, "src/content/pre-nursing/pre-nursing-strings-en.json");
const PN_AUDIT_PATH = path.join(ROOT, "data/reports/pn-practical-nursing-lesson-audit.json");
const NP_PHASE1_PATH = path.join(ROOT, "data/blueprints/np-phase1-lesson-outlines.json");
const NP_PHASE2_PATH = path.join(ROOT, "data/blueprints/np-phase2-lesson-outlines.json");
const NP_EXPANSION_PATH = path.join(ROOT, "data/blueprints/np-lesson-expansion-500.json");
const NP_BATCH1_PATH = path.join(ROOT, "data/phase2/np-advanced-batch-01-lessons.json");
const NP_BATCH2_PATH = path.join(ROOT, "data/phase2/np-advanced-batch-02-lessons.json");
const ALLIED_BATCH_PATH = path.join(ROOT, "output/allied-content-batch.json");
const NEW_GRAD_PATH = path.join(ROOT, "output/new-grad-transition-lessons.json");
const LAUNCH_MATRIX_PATH = path.join(ROOT, "data/reports/pathway-lesson-launch-matrix.json");

const FILES_INSPECTED = [
  "src/content/pathway-lessons/catalog.json",
  "src/lib/lessons/scoped-lessons/scoped-gold-registry.ts",
  "src/lib/exam-pathways/exam-product-registry.ts",
  "src/lib/allied/allied-professions-registry.ts",
  "src/content/pre-nursing/pre-nursing-registry.ts",
  "src/content/pre-nursing/pre-nursing-strings-en.json",
  "data/reports/pn-practical-nursing-lesson-audit.json",
  "data/blueprints/np-phase1-lesson-outlines.json",
  "data/blueprints/np-phase2-lesson-outlines.json",
  "data/blueprints/np-lesson-expansion-500.json",
  "data/phase2/np-advanced-batch-01-lessons.json",
  "data/phase2/np-advanced-batch-02-lessons.json",
  "output/allied-content-batch.json",
  "output/new-grad-transition-lessons.json",
  "data/reports/pathway-lesson-launch-matrix.json",
  "src/app/(student)/app/(learner)/page.tsx",
  "src/app/(student)/app/(learner)/account/study-preferences/page.tsx",
  "src/app/(student)/app/(learner)/account/readiness/page.tsx",
  "src/app/(student)/app/(learner)/review/page.tsx",
  "src/app/(student)/app/(learner)/lessons/page.tsx",
  "src/app/(marketing)/(default)/[locale]/[slug]/[examCode]/lessons/page.tsx",
  "src/app/(marketing)/(default)/pre-nursing/lessons/page.tsx",
  "src/app/(marketing)/(default)/allied-health/[slug]/lessons/page.tsx",
  "src/lib/learner/next-best-action.ts",
  "src/lib/learner/load-study-settings.ts",
  "src/lib/lessons/pathway-lesson-loader.ts",
  "src/lib/lessons/pathway-lesson-access.ts",
  "src/lib/lessons/app-pathway-lesson-list-scope.ts",
  "src/lib/lessons/lesson-routes.ts",
  "src/lib/allied/allied-lesson-access.ts",
  "src/lib/marketing/canonical-pathway-hubs.ts",
];

function readJson<T>(filePath: string): T {
  return JSON.parse(fs.readFileSync(filePath, "utf8")) as T;
}

function ensureDir(dir: string) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function normalizeTitleForDupes(title: string): string {
  return title
    .toLowerCase()
    .replace(/\(.*?(canada|us|united states|nclex-rn|nclex-pn|rex-pn|pn, canada|pn, us).*?\)/gi, "")
    .replace(/\(unit\s+\d+\)/gi, "")
    .replace(/[:\-–—]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function quoteMd(text: string): string {
  return text.replace(/\|/g, "\\|");
}

function sortRows(rows: InventoryRow[]): InventoryRow[] {
  return [...rows].sort((a, b) => {
    const subgroupA = a.subgroup ?? "";
    const subgroupB = b.subgroup ?? "";
    return subgroupA.localeCompare(subgroupB) || a.title.localeCompare(b.title);
  });
}

function buildTable(rows: InventoryRow[]): string {
  const header = "| Lesson title | Slug | Source file/system | Status |\n|---|---|---|---|";
  const body = rows
    .map((row) => `| ${quoteMd(row.title)} | ${quoteMd(row.slug ?? "")} | ${quoteMd(row.source)} | ${row.status} |`)
    .join("\n");
  return `${header}\n${body || "| _None found_ |  |  |  |"}`;
}

function buildCanonicalTable(rows: CanonicalRow[]): string {
  const header = "| Lesson / topic | Status | Evidence |\n|---|---|---|";
  const body = rows
    .map((row) => `| ${quoteMd(row.title)} | ${row.status} | ${quoteMd(row.evidence)} |`)
    .join("\n");
  return `${header}\n${body || "| _None_ |  |  |"}`;
}

function main() {
  ensureDir(REPORTS_DIR);
  ensureDir(DOCS_DIR);

  const catalog = readJson<{ pathways: Record<string, { lessons: Array<JsonRecord> }> }>(CATALOG_PATH);
  const preNursingStrings = readJson<Record<string, string>>(PRE_NURSING_STRINGS_PATH);
  const pnAudit = readJson<{
    rows: Array<{
      requiredTopic: string;
      status: string;
      us: { slug: string; title: string } | null;
      ca: { slug: string; title: string } | null;
      mergeNote?: string | null;
    }>;
  }>(PN_AUDIT_PATH);
  const npPhase1 = readJson<{ lessons: Array<{ title: string; topicSlug: string; lessonId: string }> }>(NP_PHASE1_PATH);
  const npPhase2 = readJson<{ lessons: Array<{ title: string; topicSlug: string; lessonId: string }> }>(NP_PHASE2_PATH);
  const npExpansion = readJson<{ topics: Array<{ topicSlug: string; lessons: string[] }> }>(NP_EXPANSION_PATH);
  const npBatch1 = readJson<{ status?: string; lessons: Array<{ topicSlug: string; topicName: string }> }>(NP_BATCH1_PATH);
  const npBatch2 = readJson<{ lessonCount?: number; topics: Array<{ topicSlug: string; lessons: Array<{ lessonSlug: string; lessonTitle: string }> }> }>(NP_BATCH2_PATH);
  const alliedBatch = readJson<{
    _meta: { pathwayId: string; lessonsByCareerTrack: Record<string, number>; totalLessons: number };
    lessons: Array<{ title: string; slug: string; professionKey: string; careerTrack: string; pathwayId: string }>;
  }>(ALLIED_BATCH_PATH);
  const newGrad = readJson<{ _meta: { totalLessons: number }; lessons: Array<{ title: string; slug: string }> }>(NEW_GRAD_PATH);
  const launchMatrix = readJson<{
    pathways: Array<{ id: string; label: string; catalogCount: number; effectiveCountAfterScopedGold: number; scopeNotes: string }>;
  }>(LAUNCH_MATRIX_PATH);

  const inventory: InventoryRow[] = [];
  const canonical: CanonicalRow[] = [];

  const pnUpgradeSlugs = new Set<string>();
  const pnCreateNew = new Set<string>();
  for (const row of pnAudit.rows) {
    if (row.status === "EXISTS_UPGRADE") {
      if (row.us?.slug) pnUpgradeSlugs.add(row.us.slug);
      if (row.ca?.slug) pnUpgradeSlugs.add(row.ca.slug);
    }
    if (row.status === "CREATE_NEW") pnCreateNew.add(row.requiredTopic);
  }

  const groupForPathway = new Map<string, InventoryGroup>([
    ["ca-rpn-rex-pn", "Canada RPN / REx-PN"],
    ["us-lpn-nclex-pn", "US LPN/LVN / NCLEX-PN"],
    ["ca-rn-nclex-rn", "Canada RN"],
    ["us-rn-nclex-rn", "US RN / NCLEX-RN"],
    ["us-np-fnp", "NP"],
    ["us-np-agpcnp", "NP"],
    ["us-np-pmhnp", "NP"],
    ["us-np-whnp", "NP"],
    ["us-np-pnp-pc", "NP"],
    ["ca-np-cnple", "NP"],
  ]);

  const npPathways = EXAM_PATHWAYS.filter((p) => p.roleTrack === "np").map((p) => p.id);
  const authoredKeys = new Set<string>();

  for (const pathwayId of ["ca-rpn-rex-pn", "us-lpn-nclex-pn", "ca-rn-nclex-rn", "us-rn-nclex-rn", ...npPathways]) {
    const rawLessons = catalog.pathways[pathwayId]?.lessons ?? [];
    const mergedLessons = prependScopedGoldCatalogLessons(pathwayId, rawLessons as Parameters<typeof prependScopedGoldCatalogLessons>[1]);
    const rawSlugs = new Set(rawLessons.map((lesson) => String(lesson.slug ?? "")));
    for (const lesson of mergedLessons) {
      const group = groupForPathway.get(pathwayId);
      if (!group) continue;
      const slug = String(lesson.slug ?? "");
      const title = String(lesson.title ?? "");
      if (!slug || !title) continue;
      const source = rawSlugs.has(slug)
        ? `src/content/pathway-lessons/catalog.json → ${pathwayId}`
        : `scoped gold injection → ${pathwayId}`;
      const status: InventoryStatus = pnUpgradeSlugs.has(slug)
        ? "present but thin/incomplete"
        : "fully present";
      inventory.push({
        group,
        title,
        slug,
        source,
        status,
        notes: rawSlugs.has(slug) ? null : "Injected by shared scoped-gold provider rather than static catalog bucket.",
      });
      authoredKeys.add(`${group}::${slug}`);
    }
  }

  for (const module of PRE_NURSING_MODULE_REGISTRY) {
    const title = preNursingStrings[module.titleKey] ?? module.titleKey;
    inventory.push({
      group: "Pre-nursing",
      title,
      slug: module.slug,
      source: "src/content/pre-nursing/pre-nursing-registry.ts",
      status: "fully present",
      notes: `${module.lessons} embedded micro-lessons declared in registry metadata.`,
    });
  }

  for (const lesson of alliedBatch.lessons) {
    inventory.push({
      group: "Allied Health",
      subgroup: lesson.careerTrack,
      title: lesson.title,
      slug: lesson.slug,
      source: `output/allied-content-batch.json → ${lesson.pathwayId}`,
      status: "fully present",
      notes: "Static authored batch; exposure depends on allied pathway lesson import / DB publish state.",
    });
    authoredKeys.add(`Allied Health::${lesson.slug}`);
  }

  for (const lesson of npPhase1.lessons) {
    inventory.push({
      group: "NP",
      title: lesson.title,
      slug: lesson.lessonId || lesson.topicSlug,
      source: "data/blueprints/np-phase1-lesson-outlines.json",
      status: "implied/scaffolded but missing authored lesson content",
      notes: "Outline-level lesson plan, not a published pathway lesson row.",
    });
  }

  for (const lesson of npPhase2.lessons) {
    inventory.push({
      group: "NP",
      title: lesson.title,
      slug: lesson.lessonId || lesson.topicSlug,
      source: "data/blueprints/np-phase2-lesson-outlines.json",
      status: "implied/scaffolded but missing authored lesson content",
      notes: "Outline-level lesson plan, not a published pathway lesson row.",
    });
  }

  for (const lesson of npBatch1.lessons) {
    inventory.push({
      group: "NP",
      title: lesson.topicName,
      slug: lesson.topicSlug,
      source: "data/phase2/np-advanced-batch-01-lessons.json",
      status: "present but thin/incomplete",
      notes: "Draft batch lesson body exists in JSON, but the batch is not a routed pathway catalog source.",
    });
  }

  for (const topic of npBatch2.topics) {
    for (const lesson of topic.lessons) {
      inventory.push({
        group: "NP",
        title: lesson.lessonTitle,
        slug: lesson.lessonSlug,
        source: "data/phase2/np-advanced-batch-02-lessons.json",
        status: "present but thin/incomplete",
        notes: "Draft batch lesson exists in JSON, but the batch is not a routed pathway catalog source.",
      });
    }
  }

  for (const topic of npExpansion.topics) {
    for (const lessonTitle of topic.lessons) {
      inventory.push({
        group: "NP",
        title: lessonTitle,
        slug: null,
        source: "data/blueprints/np-lesson-expansion-500.json",
        status: "implied/scaffolded but missing authored lesson content",
        notes: `Expansion blueprint for topicSlug ${topic.topicSlug}.`,
      });
    }
  }

  const normalizedTitleCounts = new Map<string, number>();
  for (const row of inventory) {
    const key = `${row.group}::${row.subgroup ?? ""}::${normalizeTitleForDupes(row.title)}`;
    normalizedTitleCounts.set(key, (normalizedTitleCounts.get(key) ?? 0) + 1);
  }
  for (const row of inventory) {
    const key = `${row.group}::${row.subgroup ?? ""}::${normalizeTitleForDupes(row.title)}`;
    if (normalizedTitleCounts.get(key)! > 1 && row.status === "fully present") {
      row.status = "duplicated";
      row.notes = row.notes
        ? `${row.notes} Normalized title duplicates another row in the same group.`
        : "Normalized title duplicates another row in the same group.";
    }
  }

  const duplicates = [...new Map(
    inventory
      .map((row) => ({ key: normalizeTitleForDupes(row.title), row }))
      .filter(({ key }) => key.length > 0)
      .reduce<Map<string, InventoryRow[]>>((map, { key, row }) => {
        const list = map.get(key) ?? [];
        list.push(row);
        map.set(key, list);
        return map;
      }, new Map())
      .entries(),
  )]
    .filter(([, rows]) => rows.length > 1)
    .map(([key, rows]) => ({ key, rows }));

  const routeExposedButThin = [
    "ca-np-cnple route exists in `EXAM_PATHWAYS`, but `catalog.json` and the scoped-gold launch matrix show zero effective lessons in the inspected repo snapshot.",
    "us-np-agpcnp / us-np-pmhnp / us-np-whnp / us-np-pnp-pc routes are exposed in `EXAM_PATHWAYS`, but they do not have their own static catalog buckets in `catalog.json`; routed lesson depth relies on scoped-gold injections and/or imported DB rows.",
    "ca-allied-core is exposed in `EXAM_PATHWAYS`, but the inspected allied authored batch only targets `us-allied-core`.",
  ];

  const dataNotExposed = [
    `output/new-grad-transition-lessons.json contains ${newGrad._meta.totalLessons} structured transition-to-practice lessons that are not part of the requested tier buckets and are not wired through the pathway catalog inspected here.`,
    "NP phase outline files and NP batch JSON contain many named lessons, but they are blueprint/import artifacts rather than automatically exposed route inventories.",
    "Allied authored batch lessons live in `output/allied-content-batch.json`; exposure still depends on import into `pathway_lessons` and publish state.",
  ];

  const namingInconsistencies = [
    "Pre-nursing includes both `terminology` and `medical-terminology` modules, both titled `Medical Terminology` in the registry strings.",
    "Allied respiratory is named `respiratory` in the profession registry, `rrt-exam-prep` in marketing hero segments, and `rrt` in pricing / replit career mappings.",
    "Allied pharmacy technician is `pharmacy-tech` in profession routes, `pharmtech` in pricing, and `pharmacyTech` in source export data.",
    "Allied OTA/PTA are separate profession routes but merged into a single `ota_pta` pricing career key.",
    "PN audit rows show parallel naming drift such as `RPN vs RN Scope` and `PN/LPN vs RN Scope` pointing at the same matched lesson candidates.",
  ];

  const rnLaunchNotes = launchMatrix.pathways
    .filter((p) => ["ca-rn-nclex-rn", "us-rn-nclex-rn"].includes(p.id))
    .map((p) => `${p.label}: ${p.scopeNotes} Gap to 150 after scoped-gold = ${Math.max(0, 150 - p.effectiveCountAfterScopedGold)}.`);
  const pnLaunchNotes = launchMatrix.pathways
    .filter((p) => ["ca-rpn-rex-pn", "us-lpn-nclex-pn"].includes(p.id))
    .map((p) => `${p.label}: ${p.scopeNotes} Gap to 150 after scoped-gold = ${Math.max(0, 150 - p.effectiveCountAfterScopedGold)}.`);

  const preNursingModules = PRE_NURSING_MODULE_REGISTRY.map((module) => ({
    title: preNursingStrings[module.titleKey] ?? module.titleKey,
    evidence: `Registry module \`${module.slug}\` with ${module.lessons} embedded lessons`,
  }));
  const preNursingHasMedMathModule = PRE_NURSING_MODULE_REGISTRY.some((module) => module.slug.includes("math"));
  if (!preNursingHasMedMathModule && "pages.preNursing.medMath" in preNursingStrings) {
    canonical.push({
      group: "Pre-nursing",
      title: "Medication Math / Dosage Calculations",
      status: "missing and should be added",
      evidence: "Implied by `pages.preNursing.medMath` UI string but absent from `PRE_NURSING_MODULE_REGISTRY`.",
    });
  }
  for (const row of preNursingModules) {
    canonical.push({ group: "Pre-nursing", title: row.title, status: "already exists", evidence: row.evidence });
  }

  for (const row of pnAudit.rows) {
    canonical.push({
      group: "Canada RPN / REx-PN",
      title: row.requiredTopic,
      status:
        row.ca
          ? row.status === "EXISTS_UPGRADE"
            ? "needs completion"
            : "already exists"
          : "missing and should be added",
      evidence: row.ca
        ? `${row.ca.title} (${row.ca.slug}) via PN audit`
        : "No Canada PN lesson match in `pn-practical-nursing-lesson-audit.json`.",
    });
    canonical.push({
      group: "US LPN/LVN / NCLEX-PN",
      title: row.requiredTopic,
      status:
        row.us
          ? row.status === "EXISTS_UPGRADE"
            ? "needs completion"
            : "already exists"
          : "missing and should be added",
      evidence: row.us
        ? `${row.us.title} (${row.us.slug}) via PN audit`
        : "No US PN lesson match in `pn-practical-nursing-lesson-audit.json`.",
    });
  }

  const currentCatalogByGroup = new Map<InventoryGroup, InventoryRow[]>();
  for (const row of inventory.filter((item) => item.source.includes("catalog.json") || item.source.includes("scoped gold injection"))) {
    const list = currentCatalogByGroup.get(row.group) ?? [];
    list.push(row);
    currentCatalogByGroup.set(row.group, list);
  }
  for (const group of ["Canada RN", "US RN / NCLEX-RN"] as const) {
    for (const row of sortRows(currentCatalogByGroup.get(group) ?? [])) {
      canonical.push({
        group,
        title: row.title,
        status: row.status === "present but thin/incomplete" ? "needs completion" : "already exists",
        evidence: row.source,
      });
    }
  }

  const npCanonicalMap = new Map<string, CanonicalRow>();
  function upsertNpCanonical(title: string, status: CanonicalRow["status"], evidence: string) {
    const key = normalizeTitleForDupes(title);
    const existing = npCanonicalMap.get(key);
    const rank = { "already exists": 3, "needs completion": 2, "missing and should be added": 1 } as const;
    if (!existing || rank[status] > rank[existing.status]) {
      npCanonicalMap.set(key, { group: "NP", title, status, evidence });
    }
  }
  for (const row of inventory.filter((item) => item.group === "NP")) {
    const canonicalStatus =
      row.status === "fully present" || row.status === "duplicated"
        ? "already exists"
        : row.status === "present but thin/incomplete"
          ? "needs completion"
          : "missing and should be added";
    upsertNpCanonical(row.title, canonicalStatus, row.source);
  }
  canonical.push(...[...npCanonicalMap.values()].sort((a, b) => a.title.localeCompare(b.title)));

  const alliedCanonicalMap = new Map<string, CanonicalRow>();
  function upsertAlliedCanonical(subgroup: string, title: string, status: CanonicalRow["status"], evidence: string) {
    const key = `${subgroup}::${normalizeTitleForDupes(title)}`;
    const existing = alliedCanonicalMap.get(key);
    const rank = { "already exists": 3, "needs completion": 2, "missing and should be added": 1 } as const;
    if (!existing || rank[status] > rank[existing.status]) {
      alliedCanonicalMap.set(key, { group: "Allied Health", subgroup, title, status, evidence });
    }
  }
  for (const row of inventory.filter((item) => item.group === "Allied Health")) {
    upsertAlliedCanonical(row.subgroup ?? "General", row.title, "already exists", row.source);
  }
  for (const profession of ALLIED_PROFESSIONS) {
    const hasAny = inventory.some((row) => row.group === "Allied Health" && row.subgroup?.toLowerCase() === profession.professionKey);
    if (!hasAny) {
      upsertAlliedCanonical(
        profession.h1,
        `${profession.h1} lesson inventory`,
        "missing and should be added",
        `Profession route exists in allied registry (${profession.professionKey}) but no authored lesson titles were found in the inspected allied batch.`,
      );
    }
  }
  canonical.push(...[...alliedCanonicalMap.values()].sort((a, b) => (a.subgroup ?? "").localeCompare(b.subgroup ?? "") || a.title.localeCompare(b.title)));

  const groupedInventory = {
    "Pre-nursing": sortRows(inventory.filter((row) => row.group === "Pre-nursing")),
    "Canada RPN / REx-PN": sortRows(inventory.filter((row) => row.group === "Canada RPN / REx-PN")),
    "US LPN/LVN / NCLEX-PN": sortRows(inventory.filter((row) => row.group === "US LPN/LVN / NCLEX-PN")),
    "Canada RN": sortRows(inventory.filter((row) => row.group === "Canada RN")),
    "US RN / NCLEX-RN": sortRows(inventory.filter((row) => row.group === "US RN / NCLEX-RN")),
    NP: sortRows(inventory.filter((row) => row.group === "NP")),
    "Allied Health": sortRows(inventory.filter((row) => row.group === "Allied Health")),
  };

  const jsonOutput = {
    generatedAt: new Date().toISOString(),
    filesInspected: FILES_INSPECTED,
    masterInventory: groupedInventory,
    audits: {
      duplicateOrNearDuplicateLessonNames: duplicates.map((dup) => ({
        normalizedKey: dup.key,
        matches: dup.rows.map((row) => ({
          group: row.group,
          subgroup: row.subgroup ?? null,
          title: row.title,
          slug: row.slug,
          source: row.source,
        })),
      })),
      obviousGaps: {
        preNursing: [
          "Two separate registry modules normalize to the same title `Medical Terminology` (`terminology` and `medical-terminology`).",
          ...(!preNursingHasMedMathModule && "pages.preNursing.medMath" in preNursingStrings
            ? ["Medication math is implied by UI strings but missing from the pre-nursing module registry."]
            : []),
        ],
        practicalNurse: [
          ...pnLaunchNotes,
          ...pnAudit.rows.filter((row) => row.status === "CREATE_NEW").slice(0, 40).map((row) => row.requiredTopic),
        ],
        registeredNurse: rnLaunchNotes,
        nursePractitioner: [
          "Static catalog depth exists only for `us-np-fnp`; the other NP pathways are routed products with much thinner inspected static lesson inventories.",
          "Canada NP (`ca-np-cnple`) is exposed in the exam registry but remains waitlist / zero-content in the inspected launch matrix.",
        ],
        alliedHealth: [
          "Social work is exposed in the allied profession registry but has no authored lessons in the inspected allied batch.",
          "All inspected allied authored lessons target `us-allied-core`; no Canada-specific allied lesson batch was found.",
          "Profession-specific allied lesson filtering is weak because the registry rows do not declare `topicSlugsIn`.",
        ],
      },
      lessonsInDataButNotExposedInRoutes: dataNotExposed,
      lessonsExposedInRoutesButMissingContent: routeExposedButThin,
      inconsistentNamingAcrossTiers: namingInconsistencies,
      preNursingTopicsMissingFromFoundationalSequence: [
        ...(!preNursingHasMedMathModule && "pages.preNursing.medMath" in preNursingStrings
          ? ["Medication Math / Dosage Calculations"]
          : []),
      ],
      alliedProfessionsWithWeakOrSparseCoverage: [
        "social-work",
        "ota",
        "pta",
      ],
      outOfScopeButPresentLessonBanks: [
        `New-grad transition pathway JSON with ${newGrad._meta.totalLessons} lessons: ${path.relative(ROOT, NEW_GRAD_PATH)}`,
      ],
    },
    recommendedCanonicalLessonList: canonical,
  };

  fs.writeFileSync(JSON_OUT, JSON.stringify(jsonOutput, null, 2));

  const md = [
    "# NurseNest Lesson Inventory Audit",
    "",
    `Generated: ${jsonOutput.generatedAt}`,
    "",
    "## Exact Files Inspected",
    ...FILES_INSPECTED.map((file) => `- \`${file}\``),
    "",
    "## 1. Master Inventory",
    "",
    "### Pre-nursing",
    buildTable(groupedInventory["Pre-nursing"]),
    "",
    "### Canada RPN / REx-PN",
    buildTable(groupedInventory["Canada RPN / REx-PN"]),
    "",
    "### US LPN/LVN / NCLEX-PN",
    buildTable(groupedInventory["US LPN/LVN / NCLEX-PN"]),
    "",
    "### Canada RN",
    buildTable(groupedInventory["Canada RN"]),
    "",
    "### US RN / NCLEX-RN",
    buildTable(groupedInventory["US RN / NCLEX-RN"]),
    "",
    "### NP",
    buildTable(groupedInventory["NP"]),
    "",
    "### Allied Health",
    "",
    ...[...new Set(groupedInventory["Allied Health"].map((row) => row.subgroup ?? "General"))]
      .sort()
      .flatMap((subgroup) => {
        const rows = groupedInventory["Allied Health"].filter((row) => (row.subgroup ?? "General") === subgroup);
        return [`#### ${subgroup}`, buildTable(rows), ""];
      }),
    "## 2. Duplicate or Near-Duplicate Lesson Names",
    ...duplicates.map((dup) => `- \`${dup.key}\`: ${dup.rows.map((row) => `${row.group}${row.subgroup ? ` / ${row.subgroup}` : ""} → ${row.title}${row.slug ? ` (${row.slug})` : ""}`).join("; ")}`),
    "",
    "## 3. Obvious Gaps Inside Each Tier",
    "### Pre-nursing",
    ...jsonOutput.audits.obviousGaps.preNursing.map((line) => `- ${line}`),
    "",
    "### Canada RPN / REx-PN and US LPN/LVN / NCLEX-PN",
    ...jsonOutput.audits.obviousGaps.practicalNurse.map((line) => `- ${line}`),
    "",
    "### Canada RN and US RN / NCLEX-RN",
    ...jsonOutput.audits.obviousGaps.registeredNurse.map((line) => `- ${line}`),
    "",
    "### NP",
    ...jsonOutput.audits.obviousGaps.nursePractitioner.map((line) => `- ${line}`),
    "",
    "### Allied Health",
    ...jsonOutput.audits.obviousGaps.alliedHealth.map((line) => `- ${line}`),
    "",
    "## 4. Lessons That Exist in Data but Are Not Exposed in Routes",
    ...dataNotExposed.map((line) => `- ${line}`),
    "",
    "## 5. Lessons Exposed in Routes but Missing Content",
    ...routeExposedButThin.map((line) => `- ${line}`),
    "",
    "## 6. Inconsistent Naming Across Tiers",
    ...namingInconsistencies.map((line) => `- ${line}`),
    "",
    "## 7. Pre-nursing Topics Missing From Foundational Sequence",
    ...jsonOutput.audits.preNursingTopicsMissingFromFoundationalSequence.map((line) => `- ${line}`),
    "",
    "## 8. Allied Professions With Weak or Sparse Coverage",
    ...jsonOutput.audits.alliedProfessionsWithWeakOrSparseCoverage.map((line) => `- ${line}`),
    "",
    "## 9. Recommended Canonical Lesson List",
    "",
    "### Pre-nursing",
    buildCanonicalTable(canonical.filter((row) => row.group === "Pre-nursing")),
    "",
    "### Canada RPN / REx-PN",
    buildCanonicalTable(canonical.filter((row) => row.group === "Canada RPN / REx-PN")),
    "",
    "### US LPN/LVN / NCLEX-PN",
    buildCanonicalTable(canonical.filter((row) => row.group === "US LPN/LVN / NCLEX-PN")),
    "",
    "### Canada RN",
    buildCanonicalTable(canonical.filter((row) => row.group === "Canada RN")),
    "",
    "### US RN / NCLEX-RN",
    buildCanonicalTable(canonical.filter((row) => row.group === "US RN / NCLEX-RN")),
    "",
    "### NP",
    buildCanonicalTable(canonical.filter((row) => row.group === "NP")),
    "",
    "### Allied Health",
    "",
    ...[...new Set(canonical.filter((row) => row.group === "Allied Health").map((row) => row.subgroup ?? "General"))]
      .sort()
      .flatMap((subgroup) => {
        const rows = canonical.filter((row) => row.group === "Allied Health" && (row.subgroup ?? "General") === subgroup);
        return [`#### ${subgroup}`, buildCanonicalTable(rows), ""];
      }),
  ].join("\n");

  fs.writeFileSync(MD_OUT, `${md.trim()}\n`);

  console.log(`Wrote ${path.relative(ROOT, JSON_OUT)}`);
  console.log(`Wrote ${path.relative(ROOT, MD_OUT)}`);
}

main();
