#!/usr/bin/env node
/**
 * Guardrail: Redirect Coverage Audit
 *
 * Verifies that every deprecated lesson slug has a configured redirect
 * pointing to its canonical lesson. Checks both the lesson record's
 * `redirectToSlug` field and the Next.js redirects config.
 *
 * Exit code 0 = pass, 1 = failures found.
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CATALOG_DIR = path.join(__dirname, "../src/content/pathway-lessons");
// Next.js redirect config — may be next.config.js or a separate redirects file
const NEXT_CONFIG_PATHS = [
  path.join(__dirname, "../next.config.js"),
  path.join(__dirname, "../next.config.mjs"),
  path.join(__dirname, "../next.config.ts"),
];

function loadAllLessons() {
  const files = fs
    .readdirSync(CATALOG_DIR)
    .filter(
      (f) =>
        f.endsWith(".json") &&
        !f.includes("master-map") &&
        !f.includes("import-state") &&
        !f.includes("aliases") &&
        !f.includes("checklist")
    );

  const lessons = [];
  for (const file of files) {
    let raw;
    try {
      raw = JSON.parse(fs.readFileSync(path.join(CATALOG_DIR, file), "utf8"));
    } catch {
      continue;
    }

    const extract = (lesson, pathwayId) => {
      if (!lesson.slug) return;
      lessons.push({ ...lesson, pathwayId });
    };

    if (raw.pathways) {
      for (const [pwId, pw] of Object.entries(raw.pathways)) {
        const arr = pw.lessons || pw;
        if (Array.isArray(arr)) arr.forEach((l) => extract(l, pwId));
      }
    } else if (Array.isArray(raw.lessons)) {
      raw.lessons.forEach((l) => extract(l, path.basename(file, ".json")));
    }
  }
  return lessons;
}

function loadNextConfigRedirects() {
  for (const configPath of NEXT_CONFIG_PATHS) {
    if (fs.existsSync(configPath)) {
      const content = fs.readFileSync(configPath, "utf8");
      const sources = [];
      for (const match of content.matchAll(/source:\s*['"`]([^'"`]+)['"`]/g)) {
        sources.push(match[1]);
      }
      return new Set(sources);
    }
  }
  return new Set();
}

/**
 * Load in-app slug redirect registry (pathway-lesson-slug-redirects.ts).
 * Lesson redirects are handled at app-router level via resolvePathwayLessonSlugRedirectChain,
 * not via next.config redirects. Both coverage paths are valid.
 */
function loadInAppSlugRedirects() {
  const registryPath = path.join(
    __dirname,
    "../src/lib/lessons/pathway-lesson-slug-redirects.ts"
  );
  if (!fs.existsSync(registryPath)) return new Set();
  const content = fs.readFileSync(registryPath, "utf8");
  const fromSlugs = new Set();
  for (const match of content.matchAll(/fromSlug:\s*['"`]([^'"`]+)['"`]/g)) {
    fromSlugs.add(match[1]);
  }
  return fromSlugs;
}

function main() {
  const lessons = loadAllLessons();
  const nextConfigRedirects = loadNextConfigRedirects();
  const inAppRedirects = loadInAppSlugRedirects();

  const deprecated = lessons.filter((l) => l.canonicalLessonId || l.deprecatedAt);

  if (deprecated.length === 0) {
    console.log("✓ No deprecated lessons — redirect coverage audit skipped.");
    process.exit(0);
  }

  const failures = [];
  for (const lesson of deprecated) {
    const hasRedirectSlug = !!lesson.redirectToSlug;
    // Coverage = in next.config OR in the in-app slug-redirect registry
    const hasCoverage =
      nextConfigRedirects.has(`/*/lessons/${lesson.slug}`) ||
      inAppRedirects.has(lesson.slug);

    if (!hasRedirectSlug) {
      failures.push({
        type: "MISSING_REDIRECT_SLUG",
        slug: lesson.slug,
        pathwayId: lesson.pathwayId,
        detail: "redirectToSlug field not set on deprecated lesson",
      });
    }
    if (!hasCoverage) {
      failures.push({
        type: "MISSING_REDIRECT_COVERAGE",
        slug: lesson.slug,
        pathwayId: lesson.pathwayId,
        detail: `Not in next.config OR pathway-lesson-slug-redirects.ts — add redirect coverage`,
      });
    }
  }

  if (failures.length === 0) {
    console.log(
      `✓ Redirect coverage audit passed — all ${deprecated.length} deprecated lessons have redirects.`
    );
    process.exit(0);
  }

  console.error(
    `✗ Redirect coverage audit FAILED — ${failures.length} issues across ${deprecated.length} deprecated lessons:\n`
  );
  for (const f of failures) {
    console.error(`  [${f.type}] [${f.pathwayId}] ${f.slug}`);
    console.error(`    ${f.detail}`);
  }
  process.exit(1);
}

main();
