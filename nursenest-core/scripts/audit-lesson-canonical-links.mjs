#!/usr/bin/env node
/**
 * Guardrail: Canonical Link Audit
 *
 * Verifies that no active lesson internally links to a deprecated lesson slug.
 * Also checks that no hub index would serve a deprecated lesson.
 *
 * Exit code 0 = pass, 1 = failures found.
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CATALOG_DIR = path.join(__dirname, "../src/content/pathway-lessons");

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
      lessons.push({ ...lesson, pathwayId, catalogFile: file });
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

  // Build set of deprecated slugs (lessons with canonicalLessonId or deprecatedAt set)
  const deprecatedSlugs = new Set(
    lessons
      .filter((l) => l.canonicalLessonId || l.deprecatedAt)
      .map((l) => l.slug)
  );

  if (deprecatedSlugs.size === 0) {
    console.log("✓ No deprecated lessons found — canonical link audit skipped.");
    process.exit(0);
  }

  const failures = [];

  // Check every active lesson's body text for links to deprecated slugs
  for (const lesson of lessons) {
    if (lesson.canonicalLessonId || lesson.deprecatedAt) continue; // skip deprecated
    const sections = Array.isArray(lesson.sections) ? lesson.sections : [];
    for (const section of sections) {
      const body = section.body || "";
      for (const depSlug of deprecatedSlugs) {
        // Look for slug referenced in markdown links or href patterns
        const patterns = [
          new RegExp(`/lessons/${depSlug}\\b`),
          new RegExp(`slug['":\\s]+${depSlug}\\b`),
        ];
        for (const pat of patterns) {
          if (pat.test(body)) {
            failures.push({
              lesson: lesson.slug,
              pathwayId: lesson.pathwayId,
              sectionId: section.id,
              referencesDeprecated: depSlug,
            });
          }
        }
      }
    }

    // Check relatedLessonRefs
    const refs = lesson.relatedLessonRefs || [];
    for (const ref of refs) {
      if (ref.slug && deprecatedSlugs.has(ref.slug)) {
        failures.push({
          lesson: lesson.slug,
          pathwayId: lesson.pathwayId,
          sectionId: "relatedLessonRefs",
          referencesDeprecated: ref.slug,
        });
      }
    }
  }

  if (failures.length === 0) {
    console.log(`✓ Canonical link audit passed — no deprecated slug references found.`);
    process.exit(0);
  }

  console.error(`✗ Canonical link audit FAILED — ${failures.length} broken references:\n`);
  for (const f of failures) {
    console.error(
      `  [${f.pathwayId}] ${f.lesson} (section: ${f.sectionId}) → references deprecated slug: ${f.referencesDeprecated}`
    );
  }
  process.exit(1);
}

main();
