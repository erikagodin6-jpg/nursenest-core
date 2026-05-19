#!/usr/bin/env tsx
/**
 * CI guard for lesson duplication and generic AI-template content.
 *
 * Run from package root:
 *   cd nursenest-core
 *   npx tsx scripts/verify-lesson-duplication-guard.mts
 *   npx tsx scripts/verify-lesson-duplication-guard.mts --tier rn
 *   npx tsx scripts/verify-lesson-duplication-guard.mts --max-findings 0
 *
 * Exits non-zero when duplication/template regressions exceed threshold.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

type Section = {
  id?: string;
  kind?: string;
  heading?: string;
  title?: string;
  body?: string;
  text?: string;
  [key: string]: unknown;
};

type Lesson = {
  slug?: string;
  title?: string;
  tier?: string;
  topic?: string;
  bodySystem?: string;
  pathwayIds?: string[];
  sections?: Section[];
  linked_flashcard_prompts?: string[];
  content?: unknown;
  [key: string]: unknown;
};

type Finding = {
  severity: "error" | "warning";
  code: string;
  file: string;
  location: string;
  pathway?: string;
  slug: string;
  title: string;
  sectionKind?: string;
  detail: string;
};

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const pkgRoot = path.resolve(__dirname, "..");
const argv = process.argv.slice(2);
const targetTier = valueAfter("--tier")?.toLowerCase() || "all";
const maxFindings = Number(valueAfter("--max-findings") ?? "0");
const reportOnly = argv.includes("--report-only");

const BOILERPLATE_PATTERNS: Array<{ code: string; regex: RegExp }> = [
  {
    code: "boilerplate-bedside-practice-footer",
    regex: /In bedside practice,\s+[^.]{0,320}?should always be interpreted in the context of trend data, focused reassessment, communication with the provider, and escalation[^.]*\./i,
  },
  {
    code: "boilerplate-generic-deterioration",
    regex: /requires early recognition, careful trend assessment, and rapid prioritization when the patient begins to deteriorate/i,
  },
  {
    code: "boilerplate-generic-pathophysiology",
    regex: /These mechanisms explain why patients with [^.]{0,220}? develop recognizable changes in tissue perfusion, oxygen delivery, inflammation, compensatory responses, and downstream organ stress/i,
  },
  {
    code: "boilerplate-generic-critical-values",
    regex: /Examples of clinically important numeric patterns include SpO2 <90%, SBP <90 mm Hg, MAP <65 mm Hg/i,
  },
  {
    code: "boilerplate-generic-treatment-goals",
    regex: /Treatment decisions for [^.]{0,220}? should focus on the medical goal: improving oxygenation, perfusion, rhythm stability/i,
  },
];

const SECTION_KIND_ALIASES: Record<string, string> = {
  introduction: "introduction",
  overview: "introduction",
  pathophysiology: "pathophysiology_overview",
  pathophysiology_overview: "pathophysiology_overview",
  signs_symptoms: "signs_symptoms",
  signs_and_symptoms: "signs_symptoms",
  labs_diagnostics: "labs_diagnostics",
  diagnostics_labs: "labs_diagnostics",
  treatments: "treatments",
  medical_treatments: "treatments",
  pharmacology: "pharmacology",
  nursing_interventions: "nursing_assessment_interventions",
  nursing_assessment_interventions: "nursing_assessment_interventions",
  red_flags: "red_flags",
  complications: "complications",
  clinical_decision_making: "clinical_decision_making",
  clinical_pearls: "clinical_pearls",
  client_education: "client_education",
  patient_education: "client_education",
  case_study: "case_study",
  case_based_application: "case_study",
  linked_flashcard_prompts: "linked_flashcard_prompts",
};

const CLINICAL_SECTION_KINDS = new Set([
  "introduction",
  "pathophysiology_overview",
  "signs_symptoms",
  "labs_diagnostics",
  "treatments",
  "pharmacology",
  "nursing_assessment_interventions",
  "red_flags",
  "complications",
  "clinical_decision_making",
  "clinical_pearls",
  "client_education",
  "case_study",
]);

const STOP_TOKENS = new Set([
  "about", "acute", "adult", "after", "before", "care", "client", "clinical", "complications", "diagnosis", "disease", "disorder", "exam", "focus", "fundamentals", "health", "management", "medical", "nclex", "nursing", "patient", "patients", "post", "pre", "priority", "procedure", "review", "signs", "symptoms", "system", "therapy", "treatment", "treatments", "with", "without", "overview", "registered", "nurse",
]);

function valueAfter(flag: string): string | null {
  const i = argv.indexOf(flag);
  return i >= 0 ? argv[i + 1] ?? null : null;
}

function walkJsonFiles(dir: string): string[] {
  if (!fs.existsSync(dir)) return [];
  const out: string[] = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name.startsWith(".")) continue;
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walkJsonFiles(p));
    else if (entry.isFile() && entry.name.endsWith(".json")) out.push(p);
  }
  return out;
}

function candidateFiles(): string[] {
  return [
    ...walkJsonFiles(path.join(pkgRoot, "src", "content", "pathway-lessons")),
    path.join(pkgRoot, "src", "content", "lessons", "lesson-library.json"),
    ...walkJsonFiles(path.join(pkgRoot, "data")),
  ].filter((p, i, arr) => fs.existsSync(p) && arr.indexOf(p) === i);
}

function normalizeText(value: string): string {
  return String(value || "")
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function normalizeKind(value: string): string {
  const k = normalizeText(value).replace(/\s+/g, "_");
  return SECTION_KIND_ALIASES[k] || k;
}

function sectionKind(section: Section): string {
  return normalizeKind(String(section.kind || section.id || section.heading || section.title || "unknown"));
}

function titleRegex(title: string): RegExp | null {
  const t = String(title || "").trim();
  if (t.length < 12) return null;
  return new RegExp(t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "gi");
}

function fullTitleCount(text: string, title: string): number {
  const r = titleRegex(title);
  return r ? (String(text || "").match(r) || []).length : 0;
}

function titleTokens(lesson: Lesson): string[] {
  const base = `${lesson.topic || ""} ${lesson.title || ""} ${lesson.slug || ""}`;
  return normalizeText(base)
    .split(" ")
    .filter((t) => t.length >= 5)
    .filter((t) => !STOP_TOKENS.has(t))
    .filter((t, i, arr) => arr.indexOf(t) === i)
    .slice(0, 12);
}

function wordCount(text: string): number {
  return String(text || "").trim().split(/\s+/).filter(Boolean).length;
}

function splitSentences(text: string): string[] {
  return String(text || "")
    .replace(/\s+/g, " ")
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 45);
}

function isLessonLike(value: unknown): value is Lesson {
  if (!value || typeof value !== "object" || Array.isArray(value)) return false;
  const row = value as Lesson;
  if (typeof row.title !== "string" && typeof row.slug !== "string") return false;
  return Array.isArray(row.sections) || Array.isArray(row.linked_flashcard_prompts) || Array.isArray(row.content);
}

function pathwayTier(pathway: string): string {
  const p = pathway.toLowerCase();
  if (p.includes("rn") || p.includes("nclex-rn")) return "rn";
  if (p.includes("rpn") || p.includes("lpn") || p.includes("pn")) return "rpn";
  if (p.includes("np") || p.includes("cnple")) return "np";
  return "unknown";
}

function lessonTier(lesson: Lesson, pathway: string): string {
  const direct = String(lesson.tier || "").toLowerCase();
  if (direct) return direct;
  const fromPath = pathwayTier(pathway);
  if (fromPath !== "unknown") return fromPath;
  const ids = Array.isArray(lesson.pathwayIds) ? lesson.pathwayIds : [];
  for (const id of ids) {
    const t = pathwayTier(String(id));
    if (t !== "unknown") return t;
  }
  return "unknown";
}

function targetIncludes(lesson: Lesson, pathway: string): boolean {
  if (targetTier === "all") return true;
  return lessonTier(lesson, pathway) === targetTier;
}

function extractSections(lesson: Lesson): Section[] {
  if (Array.isArray(lesson.sections)) return lesson.sections;
  if (!Array.isArray(lesson.content)) return [];

  const out: Section[] = [];
  for (const block of lesson.content as Array<Record<string, unknown>>) {
    const type = String(block?.type || "");
    if (["heading", "subheading"].includes(type)) {
      const heading = String(block.text || block.title || block.heading || "Section");
      out.push({ kind: normalizeKind(heading), heading, body: "" });
    } else if (out.length && ["paragraph", "callout", "clinical-pearl", "warning"].includes(type)) {
      const text = String(block.text || block.body || block.content || "").trim();
      if (text) out[out.length - 1]!.body = [out[out.length - 1]!.body, text].filter(Boolean).join("\n\n");
    } else if (out.length && ["list", "bulletList", "numberedList", "numbered-list"].includes(type)) {
      const items = Array.isArray(block.items) ? block.items.map(String) : [];
      if (items.length) out[out.length - 1]!.body = [out[out.length - 1]!.body, items.join("\n")].filter(Boolean).join("\n");
    }
  }
  return out;
}

function hasLowSpecificity(section: Section, lesson: Lesson): boolean {
  const kind = sectionKind(section);
  if (!CLINICAL_SECTION_KINDS.has(kind)) return false;
  const body = String(section.body || section.text || "");
  if (wordCount(body) < 80) return false; // handled by depth validator elsewhere

  const title = String(lesson.title || "");
  const bodyWithoutTitle = normalizeText(title ? body.replace(titleRegex(title) ?? /$a/, " ") : body);
  const tokens = titleTokens(lesson);
  if (tokens.length === 0) return false;
  const hits = tokens.filter((t) => bodyWithoutTitle.includes(t)).length;
  return hits < Math.min(2, tokens.length);
}

function auditLesson(file: string, location: string, pathway: string, lesson: Lesson): Finding[] {
  const findings: Finding[] = [];
  const rel = path.relative(pkgRoot, file);
  const title = String(lesson.title || "");
  const slug = String(lesson.slug || "");
  const sections = extractSections(lesson);
  const kindCounts = new Map<string, number>();
  const headingCounts = new Map<string, number>();
  const bodyCounts = new Map<string, number>();
  const sentenceCounts = new Map<string, number>();

  for (const section of sections) {
    const kind = sectionKind(section);
    const heading = String(section.heading || section.title || "");
    const body = String(section.body || section.text || "");
    kindCounts.set(kind, (kindCounts.get(kind) || 0) + 1);
    const headingKey = normalizeText(heading);
    if (headingKey) headingCounts.set(headingKey, (headingCounts.get(headingKey) || 0) + 1);
    const bodyKey = normalizeText(body);
    if (bodyKey.length > 120) bodyCounts.set(bodyKey, (bodyCounts.get(bodyKey) || 0) + 1);

    for (const p of BOILERPLATE_PATTERNS) {
      if (p.regex.test(body)) {
        findings.push({ severity: "error", code: p.code, file: rel, location, pathway, slug, title, sectionKind: kind, detail: `Template boilerplate detected in ${kind}` });
      }
    }

    const titleUses = fullTitleCount(body, title);
    if (titleUses > 1) {
      findings.push({ severity: "error", code: "full-title-stuffing", file: rel, location, pathway, slug, title, sectionKind: kind, detail: `Full lesson title appears ${titleUses} times in section body` });
    }

    const promptUses = Array.isArray(lesson.linked_flashcard_prompts)
      ? lesson.linked_flashcard_prompts.reduce((n, p) => n + fullTitleCount(String(p), title), 0)
      : 0;
    if (promptUses > 1) {
      findings.push({ severity: "error", code: "flashcard-title-stuffing", file: rel, location, pathway, slug, title, detail: `Full lesson title appears ${promptUses} times in flashcard prompts` });
    }

    if (heading && new RegExp(`^${heading.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}(\\s*[:—-]|\\s*\\n)`, "i").test(body.trim())) {
      findings.push({ severity: "warning", code: "section-heading-repeated-in-body", file: rel, location, pathway, slug, title, sectionKind: kind, detail: `Body starts by repeating heading '${heading}'` });
    }

    if (hasLowSpecificity(section, lesson)) {
      findings.push({ severity: "warning", code: "low-topic-specificity", file: rel, location, pathway, slug, title, sectionKind: kind, detail: "Section has insufficient topic-specific terms after removing title text" });
    }

    for (const sentence of splitSentences(body)) {
      const key = normalizeText(sentence);
      if (key.length > 50) sentenceCounts.set(key, (sentenceCounts.get(key) || 0) + 1);
    }
  }

  for (const [kind, n] of kindCounts) {
    if (n > 1) findings.push({ severity: "error", code: "duplicate-section-kind", file: rel, location, pathway, slug, title, sectionKind: kind, detail: `Section kind '${kind}' appears ${n} times` });
  }
  for (const [heading, n] of headingCounts) {
    if (n > 1) findings.push({ severity: "error", code: "duplicate-section-heading", file: rel, location, pathway, slug, title, detail: `Heading '${heading}' appears ${n} times` });
  }
  for (const [, n] of bodyCounts) {
    if (n > 1) findings.push({ severity: "error", code: "duplicate-section-body", file: rel, location, pathway, slug, title, detail: `A section body appears ${n} times` });
  }
  for (const [, n] of sentenceCounts) {
    if (n > 1) findings.push({ severity: "warning", code: "repeated-sentence", file: rel, location, pathway, slug, title, detail: `A long sentence appears ${n} times` });
  }

  return findings;
}

function visitLessons(root: unknown, visitor: (lesson: Lesson, location: string, pathway: string) => void): void {
  const seen = new WeakSet<object>();
  function walk(value: unknown, location: string, pathway = "unknown"): void {
    if (!value || typeof value !== "object") return;
    if (seen.has(value as object)) return;
    seen.add(value as object);

    if (isLessonLike(value)) {
      visitor(value, location, pathway);
      return;
    }
    if (Array.isArray(value)) {
      value.forEach((v, i) => walk(v, `${location}[${i}]`, pathway));
      return;
    }

    const obj = value as Record<string, unknown>;
    if (obj.pathways && typeof obj.pathways === "object") {
      for (const [pw, raw] of Object.entries(obj.pathways as Record<string, unknown>)) {
        if (Array.isArray(raw)) raw.forEach((v, i) => walk(v, `${location}.pathways.${pw}[${i}]`, pw));
        else if (raw && typeof raw === "object") walk((raw as { lessons?: unknown }).lessons, `${location}.pathways.${pw}.lessons`, pw);
      }
    }

    for (const [k, v] of Object.entries(obj)) {
      if (k === "pathways" || k === "sections" || k === "content") continue;
      walk(v, `${location}.${k}`, pathway);
    }
  }
  walk(root, "$root");
}

function main(): void {
  const findings: Finding[] = [];
  let scannedLessons = 0;
  let parseFailures = 0;

  for (const file of candidateFiles()) {
    let root: unknown;
    try {
      root = JSON.parse(fs.readFileSync(file, "utf8"));
    } catch {
      parseFailures++;
      continue;
    }
    visitLessons(root, (lesson, location, pathway) => {
      if (!targetIncludes(lesson, pathway)) return;
      scannedLessons++;
      findings.push(...auditLesson(file, location, pathway, lesson));
    });
  }

  const errors = findings.filter((f) => f.severity === "error");
  const warnings = findings.filter((f) => f.severity === "warning");
  const report = {
    targetTier,
    scannedLessons,
    parseFailures,
    findings: findings.length,
    errors: errors.length,
    warnings: warnings.length,
    topFindings: findings.slice(0, 300),
    byCode: findings.reduce<Record<string, number>>((acc, f) => {
      acc[f.code] = (acc[f.code] || 0) + 1;
      return acc;
    }, {}),
  };

  const reportDir = path.join(pkgRoot, "reports");
  fs.mkdirSync(reportDir, { recursive: true });
  const reportPath = path.join(reportDir, `lesson-duplication-guard-${targetTier}.json`);
  fs.writeFileSync(reportPath, `${JSON.stringify(report, null, 2)}\n`);

  console.log(JSON.stringify(report, null, 2));
  console.log(`\nReport written: ${path.relative(pkgRoot, reportPath)}`);

  if (!reportOnly && errors.length + warnings.length > maxFindings) {
    console.error(`\nLesson duplication guard failed: ${errors.length} errors, ${warnings.length} warnings, threshold ${maxFindings}.`);
    process.exit(1);
  }
}

main();
