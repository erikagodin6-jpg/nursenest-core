#!/usr/bin/env npx tsx
/**
 * Clinical content quality governance report.
 *
 * File-only by default: scans bundled pathway lesson catalogs and writes a
 * quality-over-quantity dashboard. Database-backed surfaces can be added to the
 * same input shape without changing the validator or publication gate.
 */
import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import {
  buildContentQualityDashboard,
  buildExpertReviewQueue,
  evaluateClinicalContentQuality,
  findNearDuplicateClinicalContent,
  renderContentQualityDashboardMarkdown,
  type ClinicalContentQualityInput,
  type ClinicalContentSection,
} from "../src/lib/content-quality/clinical-content-validator";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const appRoot = path.resolve(__dirname, "..");
const catalogDir = path.join(appRoot, "src/content/pathway-lessons");
const defaultOut = path.join(appRoot, "docs/reports/clinical-content-quality/content-quality-dashboard.md");

function argValue(name: string): string | null {
  const eq = process.argv.find((arg) => arg.startsWith(`${name}=`));
  if (eq) return eq.slice(name.length + 1);
  const i = process.argv.indexOf(name);
  return i >= 0 ? process.argv[i + 1] ?? null : null;
}

function clean(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function asSections(value: unknown): ClinicalContentSection[] {
  if (!Array.isArray(value)) return [];
  return value
    .filter((section) => section && typeof section === "object")
    .map((section) => {
      const row = section as Record<string, unknown>;
      return {
        kind: clean(row.kind),
        heading: clean(row.heading),
        body: clean(row.body),
      };
    });
}

function lessonInput(raw: Record<string, unknown>, pathwayId: string, file: string): ClinicalContentQualityInput | null {
  const slug = clean(raw.slug);
  if (!slug) return null;
  const sections = asSections(raw.sections);
  const sectionText = sections.map((section) => `${section.heading ?? ""}\n${section.body ?? ""}`).join("\n");
  const relatedLessonIds = sections
    .flatMap((section) => section.body?.match(/LESSON:([a-z0-9-]+)/gi) ?? [])
    .map((token) => token.replace(/^LESSON:/i, ""));
  const references = sections
    .flatMap((section) => section.body?.match(/\b(https?:\/\/\S+|AHA|CDC|WHO|RNAO|CNO|NCSBN|KDIGO|AHRQ)\b/g) ?? [])
    .slice(0, 12);

  return {
    id: `${pathwayId}:${slug}`,
    contentType: "lesson",
    title: clean(raw.title) || slug,
    body: sectionText,
    sections,
    topic: clean(raw.topic) || clean(raw.topicSlug),
    tier: clean(raw.tierCode),
    pathwayId,
    status: clean(raw.status) || "catalog",
    relatedLessonIds: [...new Set(relatedLessonIds)],
    references: [...new Set(references)],
    clinicalAccuracyReviewed: false,
  };
}

function pushLessonsFromContainer(out: ClinicalContentQualityInput[], value: unknown, pathwayId: string, file: string): void {
  if (!Array.isArray(value)) return;
  for (const item of value) {
    if (!item || typeof item !== "object") continue;
    const input = lessonInput(item as Record<string, unknown>, pathwayId, file);
    if (input) out.push(input);
  }
}

async function loadCatalogLessons(limit: number): Promise<ClinicalContentQualityInput[]> {
  const skip = new Set([
    "nclex-rn-source-checklist.json",
    "rn-nclex-catalog-import-state.json",
    "rn-nclex-master-map.json",
    "rn-nclex-explicit-inventory-aliases.json",
  ]);
  const out: ClinicalContentQualityInput[] = [];
  const files = (await fs.readdir(catalogDir)).filter((file) => file.endsWith(".json") && !skip.has(file)).sort();

  for (const file of files) {
    if (out.length >= limit) break;
    let data: unknown;
    try {
      data = JSON.parse(await fs.readFile(path.join(catalogDir, file), "utf8"));
    } catch {
      continue;
    }
    if (data && typeof data === "object" && !Array.isArray(data)) {
      const record = data as Record<string, unknown>;
      if (record.pathways && typeof record.pathways === "object") {
        for (const [pathwayId, pathway] of Object.entries(record.pathways as Record<string, unknown>)) {
          if (!pathway || typeof pathway !== "object") continue;
          pushLessonsFromContainer(out, (pathway as Record<string, unknown>).lessons, pathwayId, file);
        }
      } else {
        pushLessonsFromContainer(out, record.lessons, clean(record.pathwayId) || file.replace(/\.json$/, ""), file);
      }
    } else if (Array.isArray(data)) {
      for (const row of data) {
        if (!row || typeof row !== "object") continue;
        const record = row as Record<string, unknown>;
        if (Array.isArray(record.lessons)) {
          pushLessonsFromContainer(out, record.lessons, clean(record.pathwayId) || file.replace(/\.json$/, ""), file);
        } else {
          const input = lessonInput(record, file.replace(/\.json$/, ""), file);
          if (input) out.push(input);
        }
      }
    }
  }

  return out.slice(0, limit);
}

async function main(): Promise<void> {
  const limit = Math.max(1, Math.min(10000, Number.parseInt(argValue("--limit") ?? "10000", 10) || 10000));
  const outPath = path.resolve(appRoot, argValue("--out") ?? defaultOut);
  const inputs = await loadCatalogLessons(limit);
  const duplicates = findNearDuplicateClinicalContent(inputs);
  const dashboard = buildContentQualityDashboard(inputs, duplicates);
  const reviewQueue = buildExpertReviewQueue(inputs);
  const results = inputs.map(evaluateClinicalContentQuality);
  const blockerCount = results.filter((result) => result.issues.some((issue) => issue.severity === "blocker")).length;

  await fs.mkdir(path.dirname(outPath), { recursive: true });
  const md = [
    renderContentQualityDashboardMarkdown(dashboard, reviewQueue, duplicates),
    "## Governance Notes",
    "",
    "- This dashboard is generated from bundled pathway lesson catalogs in file-only mode.",
    "- Question, flashcard, simulation, ECG, lab, pharmacology, NP, and Allied inputs should use the same validator input shape as they enter generation, import, audit, and admin publish workflows.",
    "- Publication-ready means the validator gate passes; it does not imply automatic publishing.",
    "",
    `- Blocker findings: ${blockerCount}`,
    "",
  ].join("\n");
  await fs.writeFile(outPath, md, "utf8");
  console.log(`[clinical-content-quality-governance] Audited ${inputs.length} catalog lessons.`);
  console.log(`[clinical-content-quality-governance] Review backlog: ${dashboard.reviewBacklog}; ready: ${dashboard.publicationReady}.`);
  console.log(`[clinical-content-quality-governance] Wrote ${outPath}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
