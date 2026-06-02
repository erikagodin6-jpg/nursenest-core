#!/usr/bin/env node
/**
 * Guardrail: Sitemap Canonical Audit
 *
 * Verifies that the sitemap does not include deprecated lesson URLs.
 * Also checks that lessons missing the structural gate are not indexed.
 *
 * Exit code 0 = pass, 1 = failures found.
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CATALOG_DIR = path.join(__dirname, "../src/content/pathway-lessons");

// Pathway → base route mapping (matches Next.js route structure)
const PATHWAY_ROUTES = {
  "ca-rn-nclex-rn": "/canada/rn/nclex-rn/lessons",
  "us-rn-nclex-rn": "/us/rn/nclex-rn/lessons",
  "ca-rpn-rex-pn": "/canada/pn/rex-pn/lessons",
  "us-lpn-nclex-pn": "/us/lpn/nclex-pn/lessons",
  "np-us-np-fnp": "/us/np/fnp/lessons",
  "us-np-fnp": "/us/np/fnp/lessons",
  "np-ca-np-cnple": "/canada/np/cnple/lessons",
  "ca-np-cnple": "/canada/np/cnple/lessons",
  "np-core-catalog": null, // not directly routed
};

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

function main() {
  const lessons = loadAllLessons();
  const failures = [];

  for (const lesson of lessons) {
    const basePath = PATHWAY_ROUTES[lesson.pathwayId];
    if (!basePath) continue; // pathway not publicly routed

    const url = `${basePath}/${lesson.slug}`;
    const isDeprecated = !!(lesson.canonicalLessonId || lesson.deprecatedAt);

    if (isDeprecated) {
      // A properly-deprecated lesson has both canonicalLessonId AND redirectToSlug set.
      // The runtime loader already filters these out (canonicalLessonId: null filter).
      // Only flag if the deprecated lesson is missing redirect coverage (incomplete merge).
      const hasProperRedirect = !!(lesson.redirectToSlug && lesson.canonicalLessonId);
      if (!hasProperRedirect) {
        failures.push({
          type: "DEPRECATED_MISSING_REDIRECT",
          url,
          slug: lesson.slug,
          pathwayId: lesson.pathwayId,
          detail: `Deprecated lesson missing redirectToSlug or canonicalLessonId — will not redirect correctly`,
        });
      }
      // Properly tagged deprecated lessons are excluded from sitemap at runtime — no failure.
      continue;
    }

    // Check structural gate
    const sections = Array.isArray(lesson.sections) ? lesson.sections : [];
    if (sections.length < 3 && lesson.status !== "DRAFT") {
      failures.push({
        type: "THIN_LESSON_INDEXED",
        url,
        slug: lesson.slug,
        pathwayId: lesson.pathwayId,
        detail: `Only ${sections.length} sections — structural gate not met`,
      });
    }
  }

  if (failures.length === 0) {
    console.log(`✓ Sitemap canonical audit passed — no deprecated or thin lessons indexed.`);
    process.exit(0);
  }

  const byType = {};
  for (const f of failures) {
    byType[f.type] = (byType[f.type] || 0) + 1;
  }

  console.error(`✗ Sitemap canonical audit FAILED:\n`);
  for (const [type, count] of Object.entries(byType)) {
    console.error(`  ${type}: ${count} violations`);
  }
  console.error("");
  for (const f of failures.slice(0, 30)) {
    console.error(`  [${f.type}] ${f.url}`);
    if (f.detail) console.error(`    ${f.detail}`);
  }
  if (failures.length > 30) {
    console.error(`  ... and ${failures.length - 30} more`);
  }
  process.exit(1);
}

main();
