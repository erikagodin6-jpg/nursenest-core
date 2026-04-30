#!/usr/bin/env node
/**
 * Generates `src/content/pathway-lessons/rn-nclex-exam-notes-integration-batch4-catalog.json`.
 *
 * Batch 4 rows are derived from the batch 3 catalog on disk with **distinct slugs**
 * (`…-exam-notes-b4-nclex-rn`) so catalog merge dedupe keeps batch 3 and batch 4 separate.
 * Replace this pipeline with curated batch-4-only defs when net-new inventory is ready.
 *
 * Run: node scripts/generate-exam-notes-integration-batch4-catalog.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outPath = path.join(__dirname, "../src/content/pathway-lessons/rn-nclex-exam-notes-integration-batch4-catalog.json");
const batch3Path = path.join(__dirname, "../src/content/pathway-lessons/rn-nclex-exam-notes-integration-batch3-catalog.json");

function batch4SlugFromBatch3(slug) {
  const s = String(slug || "").trim();
  if (!s) return s;
  if (/-exam-notes-b4-nclex-rn$/i.test(s)) return s;
  if (/-nclex-rn$/i.test(s)) return s.replace(/-nclex-rn$/i, "-exam-notes-b4-nclex-rn");
  return `${s}-exam-notes-b4`;
}

function transformLesson(lesson) {
  const titleBase = String(lesson.title || "").trim();
  const newSlug = batch4SlugFromBatch3(lesson.slug);
  const seoTitleRaw = String(lesson.seoTitle || "");
  const seoTitle = /\| NCLEX-RN \| NurseNest/.test(seoTitleRaw)
    ? seoTitleRaw.replace(" | NCLEX-RN | NurseNest", " | Batch 4 | NCLEX-RN | NurseNest")
    : `${titleBase} | Batch 4 | NCLEX-RN | NurseNest`;
  const seoDescription =
    typeof lesson.seoDescription === "string" && !lesson.seoDescription.startsWith("Batch 4 — ")
      ? `Batch 4 — ${lesson.seoDescription}`
      : lesson.seoDescription;
  return {
    ...lesson,
    slug: newSlug,
    title: titleBase.includes("(Exam notes batch 4)") ? titleBase : `${titleBase} (Exam notes batch 4)`,
    seoTitle,
    seoDescription,
  };
}

function transformRows(rows) {
  if (!Array.isArray(rows)) return [];
  return rows.map(transformLesson);
}

const batch3Raw = JSON.parse(fs.readFileSync(batch3Path, "utf8"));
const pathways = {
  "us-rn-nclex-rn": transformRows(batch3Raw.pathways?.["us-rn-nclex-rn"]),
  "ca-rn-nclex-rn": transformRows(batch3Raw.pathways?.["ca-rn-nclex-rn"]),
};

fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(
  outPath,
  JSON.stringify(
    {
      version: 1,
      generatedAt: new Date().toISOString(),
      source: "scripts/generate-exam-notes-integration-batch4-catalog.mjs",
      pathways,
    },
    null,
    2,
  ) + "\n",
);
console.log(
  "wrote",
  outPath,
  "lessons per pathway us=",
  pathways["us-rn-nclex-rn"]?.length ?? 0,
  "ca=",
  pathways["ca-rn-nclex-rn"]?.length ?? 0,
);
