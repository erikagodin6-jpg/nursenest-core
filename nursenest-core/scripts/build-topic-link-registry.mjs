#!/usr/bin/env node
/**
 * Audit + optional emit for catalog-backed link-target registry expansion.
 *
 * Usage:
 *   node scripts/build-topic-link-registry.mjs
 *   node scripts/build-topic-link-registry.mjs --write-audit reports/topic-link-registry-audit.json
 *
 * Runtime merge lives in src/lib/linking/catalog-derived-link-targets.ts (bootstrapped in link-target-registry.ts).
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CATALOG_DIR = path.join(__dirname, "../src/content/pathway-lessons");

const PATHWAY_ROUTES = {
  "us-rn-nclex-rn": { lessons: "/us/rn/nclex-rn/lessons", questions: "/us/rn/nclex-rn/questions" },
  "ca-rn-nclex-rn": { lessons: "/canada/rn/nclex-rn/lessons", questions: "/canada/rn/nclex-rn/questions" },
  "ca-rpn-rex-pn": { lessons: "/canada/pn/rex-pn/lessons", questions: "/canada/pn/rex-pn/questions" },
  "us-lpn-nclex-pn": { lessons: "/us/lpn/nclex-pn/lessons", questions: "/us/lpn/nclex-pn/questions" },
  "ca-np-cnple": { lessons: "/canada/np/cnple/lessons", questions: "/canada/np/cnple/questions" },
  "us-np-fnp": { lessons: "/us/np/fnp/lessons", questions: "/us/np/fnp/questions" },
};

function loadLessons() {
  const files = fs.readdirSync(CATALOG_DIR).filter((f) => f.endsWith(".json") && !f.includes("master-map"));
  const lessons = [];
  for (const file of files) {
    let raw;
    try {
      raw = JSON.parse(fs.readFileSync(path.join(CATALOG_DIR, file), "utf8"));
    } catch {
      continue;
    }
    const push = (lesson, pathwayId) => {
      if (!lesson?.slug) return;
      lessons.push({ ...lesson, pathwayId });
    };
    if (raw.pathways) {
      for (const [pwId, pw] of Object.entries(raw.pathways)) {
        const arr = pw.lessons || pw;
        if (Array.isArray(arr)) arr.forEach((l) => push(l, pwId));
      }
    } else if (Array.isArray(raw.lessons)) {
      raw.lessons.forEach((l) => push(l, path.basename(file, ".json")));
    }
  }
  return lessons;
}

function main() {
  const lessons = loadLessons();
  const topicByPathway = new Map();
  let publicComplete = 0;

  for (const lesson of lessons) {
    const route = PATHWAY_ROUTES[lesson.pathwayId];
    if (!route) continue;
    const topic = (lesson.topicSlug || lesson.topic || "").trim().toLowerCase().replace(/\s+/g, "-");
    if (!topic) continue;
    const complete = lesson.structuralQuality?.publicComplete === true || (lesson.sections?.length ?? 0) >= 3;
    if (complete) publicComplete += 1;
    const key = `${lesson.pathwayId}:${topic}`;
    const row = topicByPathway.get(key) ?? { pathwayId: lesson.pathwayId, topic, lessonSlugs: new Set() };
    row.lessonSlugs.add(lesson.slug);
    topicByPathway.set(key, row);
  }

  const audit = {
    generatedAt: new Date().toISOString(),
    lessonRows: lessons.length,
    publicCompleteLessons: publicComplete,
    uniqueTopicClusters: topicByPathway.size,
    estimatedRegistryTargets: topicByPathway.size * 3 + publicComplete,
    pathways: Object.keys(PATHWAY_ROUTES),
  };

  console.log(JSON.stringify(audit, null, 2));

  const writeFlag = process.argv.includes("--write-audit");
  if (writeFlag) {
    const outPath = process.argv[process.argv.indexOf("--write-audit") + 1] || "reports/topic-link-registry-audit.json";
    const abs = path.isAbsolute(outPath) ? outPath : path.join(__dirname, "..", outPath);
    fs.mkdirSync(path.dirname(abs), { recursive: true });
    fs.writeFileSync(abs, `${JSON.stringify(audit, null, 2)}\n`);
    console.error(`Wrote ${abs}`);
  }
}

main();
