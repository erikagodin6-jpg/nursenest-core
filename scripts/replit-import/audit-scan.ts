import * as fs from "fs";
import * as path from "path";
import { describeTopLevel, loadJsonRows } from "./json-load";
import { getRegistryEntry, type ExportDomain } from "./file-registry";
import { iterateAiCacheOutputItems, normalizeOptionsForExamQuestion } from "./field-maps/exam-question-from-legacy";
import { normalizeAiCacheOutputJson } from "./nursing-ai-cache-extract";

export type AuditedFile = {
  fileName: string;
  filePath: string;
  topLevelStructure: string;
  topLevelObjectKeys: string[];
  recordCount: number;
  /** Extra counts e.g. nested questions in ai_cache */
  nestedEstimates?: Record<string, number>;
  sampleKeys: string[];
  detectedContentType: string;
  domain: ExportDomain | "unknown";
  targetTable: string;
  registryConfidence: "high" | "medium" | "low" | "unmapped";
  importPriority: number | null;
  notes: string;
};

export type AuditReport = {
  generatedAt: string;
  repoRoot: string;
  sourceDir: string;
  files: AuditedFile[];
  summary: {
    totalFiles: number;
    byDomain: Record<string, number>;
    nursingQuestionCandidatesInAiCache: number;
    filesReadyHighConfidence: string[];
    filesNeedManualMapping: string[];
    translationLikelyFiles: string[];
    obsoleteOrSkipRecommended: string[];
  };
};

function analyzeAiCacheNested(rows: Record<string, unknown>[]): Record<string, number> {
  let questionLike = 0;
  let flashcardLike = 0;
  let outputArrays = 0;
  for (const row of rows) {
    const oj = normalizeAiCacheOutputJson(row.output_json ?? row.outputJson);
    if (Array.isArray(oj)) outputArrays += 1;
    for (const item of iterateAiCacheOutputItems(oj)) {
      const hasStem = typeof item.stem === "string" || typeof item.question === "string";
      const optNorm = normalizeOptionsForExamQuestion(item.options ?? item.choices);
      const hasOpts = optNorm.options.length >= 2 && !optNorm.error;
      const hasFrontBack = typeof item.front === "string" && typeof item.back === "string";
      if (hasStem && hasOpts) questionLike += 1;
      else if (hasFrontBack) flashcardLike += 1;
    }
  }
  return {
    ai_cache_rows: rows.length,
    output_json_arrays: outputArrays,
    nested_question_like_items: questionLike,
    nested_flashcard_like_items: flashcardLike,
  };
}

export function scanReplitExportsDir(repoRoot: string, sourceDirRel: string): AuditReport {
  const sourceDir = path.resolve(repoRoot, sourceDirRel);
  const names = fs
    .readdirSync(sourceDir)
    .filter((f) => f.endsWith(".json"))
    .sort();

  const files: AuditedFile[] = [];
  for (const fileName of names) {
    const filePath = path.join(sourceDir, fileName);
    const { kind, rawKeys } = describeTopLevel(filePath);
    const rows = loadJsonRows(filePath);
    const sampleKeys = rows.length > 0 ? Object.keys(rows[0]).slice(0, 24) : [];

    let nested: Record<string, number> | undefined;
    if (fileName.toLowerCase() === "ai_cache.json") {
      nested = analyzeAiCacheNested(rows);
    }

    const reg = getRegistryEntry(fileName);
    const topLevelStructure =
      kind === "array" ? "array_of_objects" : kind === "object" ? `object{${rawKeys.slice(0, 8).join(",")}}` : kind;

    const domain = (reg?.domain as ExportDomain) ?? ("unknown" as const);
    const targetTable = reg?.targetTable ?? "unknown — not in registry";
    const detectedContentType = reg
      ? `registry:${reg.domain}`
      : "unmapped_filename";

    files.push({
      fileName,
      filePath,
      topLevelStructure,
      topLevelObjectKeys: rawKeys,
      recordCount: rows.length,
      nestedEstimates: nested,
      sampleKeys,
      detectedContentType,
      domain: reg ? domain : "unknown",
      targetTable,
      registryConfidence: reg ? reg.confidence : "unmapped",
      importPriority: reg ? reg.importPriority : null,
      notes: reg?.notes ?? "Add to scripts/replit-import/file-registry.ts if this is a known export.",
    });
  }

  const byDomain: Record<string, number> = {};
  for (const f of files) {
    const d = f.domain;
    byDomain[d] = (byDomain[d] ?? 0) + 1;
  }

  const ai = files.find((x) => x.fileName === "ai_cache.json");
  const nursingCandidates = ai?.nestedEstimates?.nested_question_like_items ?? 0;

  const filesReadyHighConfidence = files
    .filter((f) => f.registryConfidence === "high" && f.domain !== "users_auth" && f.domain !== "ops_analytics")
    .map((f) => f.fileName);

  const filesNeedManualMapping = files
    .filter((f) => f.registryConfidence === "low" || f.registryConfidence === "unmapped" || f.registryConfidence === "medium")
    .map((f) => f.fileName);

  const translationLikelyFiles = files
    .filter((f) => f.fileName === "seo_pages.json" || f.domain === "translations")
    .map((f) => f.fileName);

  const obsoleteOrSkipRecommended = files
    .filter((f) => f.domain === "ops_analytics" || (f.importPriority ?? 0) >= 90)
    .map((f) => f.fileName);

  return {
    generatedAt: new Date().toISOString(),
    repoRoot,
    sourceDir,
    files,
    summary: {
      totalFiles: files.length,
      byDomain,
      nursingQuestionCandidatesInAiCache: nursingCandidates,
      filesReadyHighConfidence,
      filesNeedManualMapping,
      translationLikelyFiles,
      obsoleteOrSkipRecommended,
    },
  };
}

export function auditReportToMarkdown(report: AuditReport): string {
  const lines: string[] = [];
  lines.push(`# Replit export audit`);
  lines.push(``);
  lines.push(`- **Generated:** ${report.generatedAt}`);
  lines.push(`- **Source:** \`${report.sourceDir}\``);
  lines.push(`- **Files scanned:** ${report.summary.totalFiles}`);
  lines.push(`- **Nursing-style question items (from ai_cache nested arrays):** ${report.summary.nursingQuestionCandidatesInAiCache}`);
  lines.push(``);
  lines.push(`## Domain counts`);
  lines.push(``);
  for (const [k, v] of Object.entries(report.summary.byDomain).sort((a, b) => a[0].localeCompare(b[0]))) {
    lines.push(`- **${k}:** ${v}`);
  }
  lines.push(``);
  lines.push(`## Files (detail)`);
  lines.push(``);
  lines.push(`| File | Records | Structure | Domain | Target | Priority |`);
  lines.push(`|------|---------|-----------|--------|--------|----------|`);
  for (const f of report.files.sort((a, b) => (a.importPriority ?? 999) - (b.importPriority ?? 999))) {
    const nest =
      f.nestedEstimates && Object.keys(f.nestedEstimates).length
        ? `; nested: ${JSON.stringify(f.nestedEstimates)}`
        : "";
    lines.push(
      `| ${f.fileName} | ${f.recordCount}${nest} | ${f.topLevelStructure} | ${f.domain} | ${f.targetTable.replace(/\|/g, "\\|")} | ${f.importPriority ?? "—"} |`,
    );
  }
  lines.push(``);
  lines.push(`## Ready to import (high confidence, not auth/ops)`);
  lines.push(``);
  for (const x of report.summary.filesReadyHighConfidence) lines.push(`- ${x}`);
  lines.push(``);
  lines.push(`## Needs manual mapping / lower confidence`);
  lines.push(``);
  for (const x of report.summary.filesNeedManualMapping) lines.push(`- ${x}`);
  lines.push(``);
  lines.push(`## Translation / locale SEO`);
  lines.push(``);
  for (const x of report.summary.translationLikelyFiles) lines.push(`- ${x}`);
  lines.push(``);
  lines.push(`## Obsolete or skip by default (analytics, user sessions, high priority number)`);
  lines.push(``);
  for (const x of report.summary.obsoleteOrSkipRecommended) lines.push(`- ${x}`);
  lines.push(``);
  lines.push(`## Commands`);
  lines.push(``);
  lines.push(`Dry-run validation (no DB writes):`);
  lines.push(``);
  lines.push(`\`\`\`bash`);
  lines.push(`npm run validate:replit-exports`);
  lines.push(`\`\`\``);
  lines.push(``);
  lines.push(`Legacy SQL import pipeline (separate tool):`);
  lines.push(``);
  lines.push(`\`\`\`bash`);
  lines.push(`npm run import:replit-exports -- import --dir data/replit-exports`);
  lines.push(`# add --apply only after review and with a safe DATABASE_URL`);
  lines.push(`\`\`\``);
  lines.push(``);
  return lines.join("\n");
}
