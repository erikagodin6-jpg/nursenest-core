import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");

const TITLE_LIKE_KEY_RE = /(?:^|\.)(?:title|metaTitle|seoTitle|headline|heading|h1|h2|label|titleHint|cta|name)$/i;
const RAW_KEY_RE = /\b(?:pages|nav|footer|components|learner|marketing)\.[A-Za-z0-9_.-]+\b/;
const FORBIDDEN_VALUE_RE = /\b(?:missing key|placeholder|todo)\b/i;
const BANNED_OLD_TITLES = [
  "CABG Post-Op Complications",
  "CABG and Postoperative CABG Complications",
] as const;

const ALLOWED_DUPLICATE_TITLES = new Set<string>([]);

type Finding = { file: string; path: string; value: string; reason: string };

function readJson(file: string): unknown {
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

function rel(file: string): string {
  return path.relative(ROOT, file);
}

function walkJson(value: unknown, visit: (jsonPath: string, value: string) => void, jsonPath = "$"): void {
  if (typeof value === "string") {
    visit(jsonPath, value);
    return;
  }
  if (Array.isArray(value)) {
    value.forEach((item, i) => walkJson(item, visit, `${jsonPath}[${i}]`));
    return;
  }
  if (value && typeof value === "object") {
    for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
      walkJson(v, visit, `${jsonPath}.${k}`);
    }
  }
}

function shouldInspectPublicI18nValue(jsonPath: string): boolean {
  if (jsonPath.includes(".nav.") || jsonPath.includes(".footer.")) return true;
  return TITLE_LIKE_KEY_RE.test(jsonPath);
}

function addForbiddenFindings(findings: Finding[], file: string, jsonPath: string, raw: string): void {
  const value = raw.replace(/\s+/g, " ").trim();
  if (!value) return;
  if (RAW_KEY_RE.test(value)) {
    findings.push({ file: rel(file), path: jsonPath, value, reason: "raw i18n key leaked into public copy" });
  }
  if (FORBIDDEN_VALUE_RE.test(value)) {
    findings.push({ file: rel(file), path: jsonPath, value, reason: "forbidden placeholder marker" });
  }
  if (BANNED_OLD_TITLES.some((title) => value === title || value.startsWith(`${title} |`) || value.startsWith(`${title}:`))) {
    findings.push({ file: rel(file), path: jsonPath, value, reason: "banned old public title" });
  }
}

function validatePublicI18n(findings: Finding[]): void {
  const enDir = path.join(ROOT, "public/i18n/en");
  for (const shard of ["pages.json", "nav.json", "footer.json", "marketing.json", "components.json", "learner.json"]) {
    const file = path.join(enDir, shard);
    if (!fs.existsSync(file)) continue;
    walkJson(readJson(file), (jsonPath, value) => {
      if (shouldInspectPublicI18nValue(jsonPath)) addForbiddenFindings(findings, file, jsonPath, value);
    });
  }
}

function validateCatalog(findings: Finding[]): void {
  const file = path.join(ROOT, "src/content/pathway-lessons/catalog.json");
  const data = readJson(file) as {
    pathways?: Record<string, { lessons?: Array<Record<string, unknown>> }>;
  };
  for (const [pathwayId, bucket] of Object.entries(data.pathways ?? {})) {
    const byTitle = new Map<string, string[]>();
    for (const [index, lesson] of (bucket.lessons ?? []).entries()) {
      const slug = typeof lesson.slug === "string" ? lesson.slug : `index-${index}`;
      for (const key of ["title", "seoTitle", "titleHint"]) {
        const value = lesson[key];
        if (typeof value === "string") addForbiddenFindings(findings, file, `$.pathways.${pathwayId}.lessons[${index}].${key}`, value);
      }
      const title = typeof lesson.title === "string" ? lesson.title.trim() : "";
      if (title) {
        const k = title.toLowerCase();
        const list = byTitle.get(k) ?? [];
        list.push(slug);
        byTitle.set(k, list);
      }
      walkJson(lesson.relatedLessonRefs, (jsonPath, value) => {
        addForbiddenFindings(findings, file, `$.pathways.${pathwayId}.lessons[${index}].relatedLessonRefs${jsonPath.slice(1)}`, value);
      });
    }
    for (const [title, slugs] of byTitle) {
      if (slugs.length > 1 && !ALLOWED_DUPLICATE_TITLES.has(`${pathwayId}:${title}`)) {
        findings.push({
          file: rel(file),
          path: `$.pathways.${pathwayId}.lessons.title`,
          value: `${title} => ${slugs.join(", ")}`,
          reason: "duplicate lesson title within pathway",
        });
      }
    }
  }
}

function validateGeneratedReports(findings: Finding[]): void {
  for (const report of ["reports/nursing-lesson-inventory.json", "reports/nursing-lesson-inventory.md", "reports/rn-lesson-inventory.md"]) {
    const file = path.join(ROOT, report);
    if (!fs.existsSync(file)) continue;
    const raw = fs.readFileSync(file, "utf8");
    for (const banned of BANNED_OLD_TITLES) {
      if (raw.includes(banned)) {
        findings.push({ file: rel(file), path: "$", value: banned, reason: "banned old public title in generated report" });
      }
    }
    if (/missing key/i.test(raw) || /\bTODO\b/.test(raw)) {
      findings.push({ file: rel(file), path: "$", value: "missing key/TODO", reason: "forbidden marker in generated report" });
    }
  }
}

const findings: Finding[] = [];
validatePublicI18n(findings);
validateCatalog(findings);
validateGeneratedReports(findings);

if (findings.length > 0) {
  console.error("[validate:public-copy] public copy validation failed:");
  for (const f of findings.slice(0, 80)) {
    console.error(`- ${f.file} ${f.path}: ${f.reason}: ${JSON.stringify(f.value.slice(0, 240))}`);
  }
  if (findings.length > 80) console.error(`...and ${findings.length - 80} more finding(s)`);
  process.exit(1);
}

console.log("[validate:public-copy] OK");
