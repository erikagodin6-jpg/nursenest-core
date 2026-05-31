#!/usr/bin/env tsx
import { existsSync, mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { basename, join, resolve } from "node:path";

import {
  INTERNATIONAL_RECOVERY_DUPLICATE_FINDINGS,
  INTERNATIONAL_TRANSLATION_READY_QUEUE,
  RECOVERED_INTERNATIONAL_CONTENT_REGISTRY,
  buildInternationalInheritanceMap,
  buildInternationalRecoveryDashboard,
  buildInternationalReuseOpportunities,
  classifyInternationalContentCandidateForInheritance,
  type InternationalInheritanceLayer,
} from "../src/lib/international-content/international-content-recovery-classification-engine";

type RecoveredFileAsset = {
  readonly contentId: string;
  readonly sourceFile: string;
  readonly contentType: string;
  readonly layer: InternationalInheritanceLayer;
  readonly topic: string;
  readonly country: string | null;
  readonly exam: string | null;
  readonly language: string | null;
  readonly inheritancePath: string;
  readonly status: "draft";
  readonly published: false;
  readonly adminOnly: true;
  readonly visibleInNavigation: false;
  readonly learnerAccessible: false;
  readonly launchReady: false;
  readonly noindex: true;
};

const ROOT = process.cwd();
const OUT_DIR = resolve(ROOT, "docs/reports/international-content-recovery");
const SCAN_ROOTS = [
  "src/content/blog-static-longtail",
  "src/content/pathway-lessons",
  "src/content/questions",
  "src/content/clinical-case-studies.json",
  "src/content/cases",
  "src/content/flashcards",
  "output",
  "data/blog-content",
  "data/blog-manifest",
  "tools/i18n",
  "scripts/i18n",
] as const;

function walk(path: string, out: string[], limit: number): void {
  if (out.length >= limit || !existsSync(path)) return;
  const stat = statSync(path);
  if (stat.isFile()) {
    if (/\.(json|ts|tsx|md|mdx|mjs|mts|csv|txt)$/i.test(path)) out.push(path);
    return;
  }
  if (!stat.isDirectory()) return;
  for (const entry of readdirSync(path)) {
    if (entry === "node_modules" || entry === ".next") continue;
    walk(join(path, entry), out, limit);
    if (out.length >= limit) return;
  }
}

function readSample(file: string): string {
  try {
    return readFileSync(file, "utf8").slice(0, 2_000);
  } catch {
    return "";
  }
}

function slug(value: string): string {
  return value
    .toLowerCase()
    .replace(/\.[^.]+$/, "")
    .replace(/^(fr|es|pt|hi|tl|ar|de|ja|ko|zh|zh-hans|zh-tw)-intl-/, "")
    .replace(/^(intl|uk|au|nz|ca|us|india|philippines|qatar|saudi|middle-east)-/, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function inferContentType(file: string): string {
  const normalized = file.replace(/\\/g, "/").toLowerCase();
  if (normalized.includes("blog")) return "blog";
  if (normalized.includes("pathway-lessons") || normalized.includes("lesson")) return "lesson";
  if (normalized.includes("question")) return "question";
  if (normalized.includes("flashcard")) return "flashcard";
  if (normalized.includes("simulation")) return "simulation";
  if (normalized.includes("case")) return "clinical_case";
  if (normalized.includes("i18n") || normalized.includes("local")) return "localization";
  if (normalized.includes("output")) return "draft_generation";
  if (normalized.includes("manifest")) return "import_pipeline";
  return "generated_batch";
}

function inferLanguage(text: string): string | null {
  const lower = text.toLowerCase();
  const file = basename(lower);
  if (/(^|[-_/])(fr|french)([-_.]|$)/.test(file)) return "fr";
  if (/(^|[-_/])(es|spanish)([-_.]|$)/.test(file)) return "es";
  if (/(^|[-_/])(hi|hindi)([-_.]|$)/.test(file)) return "hi";
  if (/(^|[-_/])(pt|portuguese)([-_.]|$)/.test(file)) return "pt";
  if (/(^|[-_/])(tl|tagalog)([-_.]|$)/.test(file)) return "tl";
  if (/(^|[-_/])(ar|arabic)([-_.]|$)/.test(file)) return "ar";
  if (/(^|[-_/])(ja|japanese)([-_.]|$)/.test(file)) return "ja";
  if (/(^|[-_/])(ko|korean)([-_.]|$)/.test(file)) return "ko";
  if (/(^|[-_/])(zh|zh-hans|zh-tw|chinese)([-_.]|$)/.test(file)) return "zh";
  return null;
}

function inferCountry(text: string): string | null {
  const lower = text.toLowerCase();
  if (/\buk\b|united kingdom|nmc|nhs|news2/.test(lower)) return "United Kingdom";
  if (/\bau\b|australia|ahpra|nmba|aboriginal|torres strait/.test(lower)) return "Australia";
  if (/\bnz\b|new zealand|ncnz|te tiriti/.test(lower)) return "New Zealand";
  if (/\bcanada\b|\bca\b|cno|bccnm|rex-pn|cnple/.test(lower)) return "Canada";
  if (/\bunited states\b|\bus\b|nclex-rn-us|nclex governance|ncsbn/.test(lower)) return "United States";
  if (/philippines|pnle/.test(lower)) return "Philippines";
  if (/india|norcet|aiims/.test(lower)) return "India";
  if (/saudi|scfhs/.test(lower)) return "Saudi Arabia";
  if (/qatar/.test(lower)) return "Qatar";
  if (/uae|dha|haad|moh/.test(lower)) return "United Arab Emirates";
  return null;
}

function inferExam(text: string): string | null {
  const lower = text.toLowerCase();
  if (/nclex-rn|nclex rn/.test(lower)) return "NCLEX-RN";
  if (/nclex-pn|nclex pn/.test(lower)) return "NCLEX-PN";
  if (/rex-pn|rex pn/.test(lower)) return "REx-PN";
  if (/cnple/.test(lower)) return "CNPLE";
  if (/fnp/.test(lower)) return "FNP";
  if (/agpcnp/.test(lower)) return "AGPCNP";
  if (/pmhnp/.test(lower)) return "PMHNP";
  if (/pnp-pc/.test(lower)) return "PNP-PC";
  if (/whnp/.test(lower)) return "WHNP";
  if (/nmc|cbt|osce/.test(lower)) return "NMC CBT/OSCE";
  if (/ahpra|nmba/.test(lower)) return "AHPRA RN";
  if (/ncnz/.test(lower)) return "NCNZ RN";
  if (/pnle/.test(lower)) return "PNLE";
  if (/norcet|aiims/.test(lower)) return "NORCET/AIIMS";
  return null;
}

function inferTopic(file: string, sample: string): string {
  const text = `${file} ${sample}`.toLowerCase();
  if (/heart-failure|heart failure|chf/.test(text)) return "Heart Failure";
  if (/copd/.test(text)) return "COPD";
  if (/sepsis/.test(text)) return "Sepsis";
  if (/shock/.test(text)) return "Shock";
  if (/\becg\b|telemetry|arrhythmia|stemi/.test(text)) return "ECG";
  if (/\babg\b|arterial blood gas|anion gap|laboratory|labs?/.test(text)) return "Labs";
  if (/pharm|medication|drug|prescribing|insulin|anticoag/.test(text)) return "Pharmacology";
  if (/assessment|deterioration|news2|vital signs/.test(text)) return "Clinical Assessment";
  return slug(basename(file)).split("-").slice(0, 6).join(" ") || "Unclassified";
}

function recoverFiles(limit = Number.parseInt(process.env.NN_INTERNATIONAL_RECOVERY_SCAN_LIMIT ?? "6000", 10)): RecoveredFileAsset[] {
  const files: string[] = [];
  for (const root of SCAN_ROOTS) walk(resolve(ROOT, root), files, limit);
  return files.map((abs) => {
    const rel = abs.replace(`${ROOT}/`, "");
    const sample = readSample(abs);
    const signal = `${rel}\n${sample}`;
    const layer = classifyInternationalContentCandidateForInheritance(signal);
    const topic = inferTopic(rel, sample);
    return {
      contentId: `recovered-file:${slug(rel)}`,
      sourceFile: rel,
      contentType: inferContentType(rel),
      layer,
      topic,
      country: inferCountry(signal),
      exam: inferExam(signal),
      language: inferLanguage(signal),
      inheritancePath: "Global Core -> Role Overlay -> Country Overlay -> Exam Overlay -> Language Overlay",
      status: "draft",
      published: false,
      adminOnly: true,
      visibleInNavigation: false,
      learnerAccessible: false,
      launchReady: false,
      noindex: true,
    };
  });
}

function countBy<T extends string>(rows: readonly RecoveredFileAsset[], key: (row: RecoveredFileAsset) => T): Record<T, number> {
  return rows.reduce<Record<T, number>>((acc, row) => {
    const k = key(row);
    acc[k] = (acc[k] ?? 0) + 1;
    return acc;
  }, {} as Record<T, number>);
}

function detectedDuplicates(rows: readonly RecoveredFileAsset[]) {
  const groups = new Map<string, RecoveredFileAsset[]>();
  for (const row of rows) {
    const key = `${row.topic.toLowerCase()}::${row.contentType}`;
    groups.set(key, [...(groups.get(key) ?? []), row]);
  }
  return [...groups.entries()]
    .filter(([, group]) => group.length > 1)
    .map(([key, group]) => ({
      key,
      count: group.length,
      topic: group[0]?.topic ?? "Unknown",
      contentType: group[0]?.contentType ?? "unknown",
      layers: [...new Set(group.map((row) => row.layer))],
      sampleFiles: group.slice(0, 8).map((row) => row.sourceFile),
    }))
    .sort((a, b) => b.count - a.count);
}

function translationReady(rows: readonly RecoveredFileAsset[]) {
  return rows.filter((row) => row.layer === "GLOBAL_SHARED_CORE" || row.layer === "LANGUAGE_OVERLAY");
}

function mdTable(rows: string[][]): string[] {
  if (rows.length === 0) return [];
  const header = rows[0]!;
  return [
    `| ${header.join(" | ")} |`,
    `| ${header.map(() => "---").join(" | ")} |`,
    ...rows.slice(1).map((row) => `| ${row.map((cell) => cell.replace(/\|/g, "\\|")).join(" | ")} |`),
  ];
}

function writeReports(rows: readonly RecoveredFileAsset[]): void {
  mkdirSync(OUT_DIR, { recursive: true });
  const dashboard = buildInternationalRecoveryDashboard();
  const layerCounts = countBy(rows, (row) => row.layer);
  const contentTypeCounts = countBy(rows, (row) => row.contentType);
  const duplicates = detectedDuplicates(rows);
  const translationQueue = translationReady(rows);
  const inheritanceMap = buildInternationalInheritanceMap();
  const reuse = buildInternationalReuseOpportunities();

  writeFileSync(
    resolve(OUT_DIR, "international-content-recovery-audit.json"),
    JSON.stringify(
      {
        generatedAt: new Date().toISOString(),
        scannedAssets: rows.length,
        layerCounts,
        contentTypeCounts,
        dashboard,
        registryAssets: RECOVERED_INTERNATIONAL_CONTENT_REGISTRY,
        fileAssets: rows,
        duplicateFindings: INTERNATIONAL_RECOVERY_DUPLICATE_FINDINGS,
        detectedDuplicates: duplicates,
        translationReadyQueue: translationQueue,
        curatedTranslationReadyQueue: INTERNATIONAL_TRANSLATION_READY_QUEUE,
        inheritanceMap,
        reuseOpportunities: reuse,
      },
      null,
      2,
    ),
  );

  writeFileSync(
    resolve(OUT_DIR, "international-content-recovery-report.md"),
    [
      "# International Content Recovery, Classification, and Inheritance Report",
      "",
      `Generated: ${new Date().toISOString()}`,
      "",
      "## Executive Summary",
      "",
      `- Scanned file assets: ${rows.length}`,
      `- Registry recovery count: ${dashboard.recoveryCount}`,
      `- Global core assets detected: ${layerCounts.GLOBAL_SHARED_CORE ?? 0}`,
      `- Country overlays detected: ${layerCounts.COUNTRY_OVERLAY ?? 0}`,
      `- Role overlays detected: ${layerCounts.ROLE_OVERLAY ?? 0}`,
      `- Exam overlays detected: ${layerCounts.EXAM_OVERLAY ?? 0}`,
      `- Language overlays detected: ${layerCounts.LANGUAGE_OVERLAY ?? 0}`,
      `- Requires review detected: ${layerCounts.REQUIRES_REVIEW ?? 0}`,
      `- Duplicate groups detected from filenames/topics: ${duplicates.length}`,
      `- Translation-ready file assets: ${translationQueue.length}`,
      "",
      "All recovered assets remain draft, admin-only, hidden, noindex, not learner accessible, and not launch ready until review is complete.",
      "",
      "## Layer Counts",
      "",
      ...mdTable([
        ["Layer", "Count"],
        ...Object.entries(layerCounts).sort((a, b) => b[1] - a[1]).map(([layer, count]) => [layer, String(count)]),
      ]),
      "",
      "## Content Type Counts",
      "",
      ...mdTable([
        ["Content Type", "Count"],
        ...Object.entries(contentTypeCounts).sort((a, b) => b[1] - a[1]).map(([type, count]) => [type, String(count)]),
      ]),
      "",
      "## Reuse Opportunities",
      "",
      ...mdTable([
        ["Topic", "Reusable Assets", "Overlay Assets", "Recommended Action", "Rationale"],
        ...reuse.map((item) => [
          item.topic,
          String(item.reusableAssetCount),
          String(item.overlayAssetCount),
          item.recommendedAction,
          item.rationale,
        ]),
      ]),
      "",
      "## Duplicate Content Report",
      "",
      ...mdTable([
        ["Topic", "Content Type", "Count", "Layers", "Sample Files"],
        ...duplicates.slice(0, 50).map((item) => [
          item.topic,
          item.contentType,
          String(item.count),
          item.layers.join(", "),
          item.sampleFiles.join("; "),
        ]),
      ]),
      "",
      "## Translation Readiness Report",
      "",
      ...mdTable([
        ["Content ID", "Layer", "Topic", "Language", "Source"],
        ...translationQueue.slice(0, 75).map((item) => [
          item.contentId,
          item.layer,
          item.topic,
          item.language ?? "inherit",
          item.sourceFile,
        ]),
      ]),
      "",
      "## Inheritance Map",
      "",
      ...mdTable([
        ["Topic", "Global Core", "Role Overlay", "Country Overlay", "Exam Overlay", "Language Overlay", "Path"],
        ...inheritanceMap.map((entry) => [
          entry.topic,
          String(entry.globalCoreAssets.length),
          String(entry.roleOverlayAssets.length),
          String(entry.countryOverlayAssets.length),
          String(entry.examOverlayAssets.length),
          String(entry.languageOverlayAssets.length),
          entry.inheritancePath,
        ]),
      ]),
      "",
      "## Enforcement Rule",
      "",
      "Future country expansion must begin with recovery, classification, inheritance mapping, duplicate review, and translation readiness review. New educational assets require proof that Global Core -> Role Overlay -> Country Overlay -> Exam Overlay -> Language Overlay inheritance is insufficient.",
      "",
    ].join("\n"),
  );
}

const rows = recoverFiles();
writeReports(rows);
console.log(`Scanned ${rows.length} international recovery assets.`);
