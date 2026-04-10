#!/usr/bin/env node
/**
 * Audit explicit RN NCLEX inventory topics against:
 * - rn-nclex-master-map.json (canonical plan)
 * - catalog.json pathways.us-rn-nclex-rn (authored bodies)
 * - rn-nclex-explicit-inventory-aliases.json (merge / synonym map)
 *
 * Run: node scripts/rn-nclex-explicit-inventory-audit.mjs
 * Writes: docs/rn-nclex-explicit-inventory-audit-report.md
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const MAP_PATH = path.join(ROOT, "src/content/pathway-lessons/rn-nclex-master-map.json");
const CAT_PATH = path.join(ROOT, "src/content/pathway-lessons/catalog.json");
const ALIAS_PATH = path.join(ROOT, "src/content/pathway-lessons/rn-nclex-explicit-inventory-aliases.json");
const TOPICS_PATH = path.join(ROOT, "src/content/pathway-lessons/rn-nclex-explicit-inventory-topics.txt");
const OUT_PATH = path.join(ROOT, "docs/rn-nclex-explicit-inventory-audit-report.md");

function wordEstimate(lesson) {
  if (!lesson?.sections?.length) return 0;
  let n = 0;
  for (const s of lesson.sections) {
    if (typeof s.body === "string") n += s.body.split(/\s+/).filter(Boolean).length;
  }
  return n;
}

function tierMin(tier) {
  const m = { A: 1800, B: 1200, C: 900, D: 600 };
  return m[tier] ?? 600;
}

function resolveTopic(raw, aliasMap, titleSet) {
  const t = raw.trim();
  if (!t) return null;
  if (aliasMap[t]) return aliasMap[t];
  if (titleSet.has(t)) return t;
  const lower = t.toLowerCase();
  for (const x of titleSet) {
    if (x.toLowerCase() === lower) return x;
  }
  return null;
}

function main() {
  const map = JSON.parse(fs.readFileSync(MAP_PATH, "utf8"));
  const cat = JSON.parse(fs.readFileSync(CAT_PATH, "utf8"));
  const aliasesDoc = JSON.parse(fs.readFileSync(ALIAS_PATH, "utf8"));
  const aliasMap = aliasesDoc.aliases ?? {};

  const titleToRow = new Map(map.lessons.map((l) => [l.canonicalTitle, l]));
  const titleSet = new Set(map.lessons.map((l) => l.canonicalTitle));

  const usLessons = cat.pathways["us-rn-nclex-rn"]?.lessons ?? [];
  const bySlug = new Map(usLessons.map((l) => [l.slug, l]));

  /** Validate alias targets */
  const badAlias = [];
  for (const [k, v] of Object.entries(aliasMap)) {
    if (!titleSet.has(v)) badAlias.push([k, v]);
  }
  if (badAlias.length) {
    console.error("Broken aliases (fix rn-nclex-explicit-inventory-aliases.json):");
    for (const [k, v] of badAlias) console.error(`  ${k} -> ${v}`);
    process.exit(1);
  }

  const topicLines = fs
    .readFileSync(TOPICS_PATH, "utf8")
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l && !l.startsWith("#"));

  const rows = [];
  for (const topic of topicLines) {
    const canonical = resolveTopic(topic, aliasMap, titleSet);
    if (!canonical) {
      rows.push({
        topic,
        canonical: "",
        slug: "",
        inMap: false,
        inCatalog: false,
        words: 0,
        tier: "",
        status: "UNRESOLVED_NO_MAP_MATCH",
      });
      continue;
    }
    const row = titleToRow.get(canonical);
    const slug = row.slug;
    const catalogLesson = bySlug.get(slug);
    const words = catalogLesson ? wordEstimate(catalogLesson) : 0;
    const hasBody = !!(catalogLesson?.sections?.length && words > 0);
    const stubMeta =
      catalogLesson && (!catalogLesson.sections?.length || !hasBody)
        ? "CATALOG_ROW_METADATA_ONLY_PENDING_FULL_BODY"
        : null;
    const tmin = tierMin(row.tier);
    let status = "MAP_ONLY_PLANNED_NOT_IN_CATALOG";
    if (catalogLesson) {
      if (stubMeta) status = stubMeta;
      else if (words >= Math.max(600, tmin * 0.35)) status = "EXISTS_STRONG_SKIP";
      else if (words >= 220) status = "EXISTS_REVIEW_MAY_UPGRADE";
      else status = "EXISTS_THIN_UPGRADE";
    }
    if (aliasMap[topic] && canonical) status = `${status}_ALIAS_MERGE`;
    rows.push({
      topic,
      canonical,
      slug,
      inMap: true,
      inCatalog: !!catalogLesson,
      words,
      tier: row.tier,
      status,
    });
  }

  const byStatus = {};
  for (const r of rows) {
    const k = r.status.replace(/_ALIAS_MERGE$/, "");
    byStatus[k] = (byStatus[k] ?? 0) + 1;
  }

  const lines = [];
  lines.push(`# RN NCLEX explicit inventory audit`);
  lines.push(``);
  lines.push(`Generated: ${new Date().toISOString()}`);
  lines.push(``);
  lines.push(`## Source note`);
  lines.push(
    `This audit reconciles **explicit topic lines** in \`src/content/pathway-lessons/rn-nclex-explicit-inventory-topics.txt\` with the canonical plan in \`rn-nclex-master-map.json\` and authored rows in \`catalog.json\` for **us-rn-nclex-rn**.`,
  );
  lines.push(`There is **no separate uploaded NCLEX PDF** in this monorepo; editorial sources are described in \`docs/rn-nclex-rn-lesson-library.md\` (premium curriculum markdown + checklist + master map).`);
  lines.push(``);
  lines.push(`## Summary counts`);
  lines.push(``);
  lines.push(`| Status | Count |`);
  lines.push(`| --- | ---: |`);
  for (const [k, v] of Object.entries(byStatus).sort((a, b) => a[0].localeCompare(b[0]))) {
    lines.push(`| ${k} | ${v} |`);
  }
  lines.push(``);
  lines.push(`## Topic table`);
  lines.push(``);
  lines.push(`| Requested topic | Canonical lesson | Slug | Tier | Catalog | Words (est.) | Audit status |`);
  lines.push(`| --- | --- | --- | --- | --- | ---: | --- |`);
  for (const r of rows) {
    lines.push(
      `| ${r.topic.replace(/\|/g, "\\|")} | ${(r.canonical || "—").replace(/\|/g, "\\|")} | ${r.slug || "—"} | ${r.tier || "—"} | ${r.inCatalog ? "yes" : "no"} | ${typeof r.words === "number" ? r.words : "—"} | ${r.status} |`,
    );
  }
  lines.push(``);
  lines.push(`## Alias / merge map (explicit file)`);
  lines.push(``);
  lines.push(`See \`src/content/pathway-lessons/rn-nclex-explicit-inventory-aliases.json\`.`);
  lines.push(``);
  lines.push(`## Master map scale`);
  lines.push(``);
  lines.push(`- Unique canonical lessons in map: **${map.lessons.length}**`);
  lines.push(`- US RN catalog lessons: **${usLessons.length}**`);
  lines.push(`- Slug overlap (map slug present in catalog): run \`node -e\` count separately if needed.`);

  fs.mkdirSync(path.dirname(OUT_PATH), { recursive: true });
  fs.writeFileSync(OUT_PATH, lines.join("\n") + "\n", "utf8");
  console.log(`Wrote ${OUT_PATH}`);
}

main();
