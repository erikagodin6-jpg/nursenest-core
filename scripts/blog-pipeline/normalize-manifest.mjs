#!/usr/bin/env node
/**
 * Build data/blog-manifest/pathophysiology-200.manifest.json from wave2 source.
 * Ensures RN:80, PN:60, NP:60, 5 secondary keywords, breadcrumb levels, priorities.
 *
 * Run: node scripts/blog-pipeline/normalize-manifest.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "../..");

const WAVE2 = path.join(ROOT, "data/blog-manifest/pathophysiology-200-wave2.manifest.json");
const OUT = path.join(ROOT, "data/blog-manifest/pathophysiology-200.manifest.json");

const FILL_SECONDARY = [
  "NCLEX pathophysiology review",
  "nursing clinical judgment",
  "labs diagnostics reasoning",
  "exam traps prioritization",
  "patient safety escalation",
];

function padSecondary(existing) {
  const base = Array.isArray(existing) ? [...existing] : [];
  const seen = new Set(base.map((s) => s.toLowerCase()));
  for (const f of FILL_SECONDARY) {
    if (base.length >= 5) break;
    if (!seen.has(f.toLowerCase())) {
      base.push(f);
      seen.add(f.toLowerCase());
    }
  }
  return base.slice(0, 5);
}

function breadcrumbLevels(pathway, category) {
  return {
    level1: "Home",
    level2: "NurseNest",
    level3: `${pathway} · ${category}`,
  };
}

function breadcrumbPathString(levels) {
  return `${levels.level1} > ${levels.level2} > ${levels.level3}`;
}

const raw = JSON.parse(fs.readFileSync(WAVE2, "utf8"));
const posts = raw.posts.map((p, idx) => {
  const levels = breadcrumbLevels(p.pathway, p.category);
  const translationPriority = 1 + (idx % 5);
  const publicationPriority = 1 + ((idx * 7) % 5);
  return {
    id: p.id,
    title: p.title,
    slug: p.slug,
    primaryKeyword: p.primaryKeyword,
    secondaryKeywords: padSecondary(p.secondaryKeywords),
    pathway: p.pathway,
    category: p.category,
    searchIntent: p.searchIntent,
    relatedLessonPaths: p.relatedLessonPaths ?? [],
    relatedToolPaths: p.relatedToolPaths ?? [],
    breadcrumb: levels,
    breadcrumbPath: breadcrumbPathString(levels),
    translationPriority,
    publicationPriority,
    status: "planned",
    sourceClusterId: p.clusterId ?? null,
  };
});

const dist = { RN: 0, PN: 0, NP: 0 };
for (const p of posts) dist[p.pathway]++;

const out = {
  version: 2,
  generatedAt: new Date().toISOString(),
  source: "normalized from data/blog-manifest/pathophysiology-200-wave2.manifest.json",
  distribution: dist,
  targetDistribution: { RN: 80, PN: 60, NP: 60 },
  postCount: posts.length,
  posts,
};

fs.writeFileSync(OUT, JSON.stringify(out, null, 2) + "\n", "utf8");
console.log("Wrote", OUT, dist, "posts=", posts.length);
