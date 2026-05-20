#!/usr/bin/env tsx
/**
 * Audit and clean duplicated lesson content across every lesson slice.
 *
 * Run from repo package root:
 *   cd nursenest-core
 *   npx tsx scripts/audit-and-clean-all-lesson-duplication.mts --dry-run
 *   npx tsx scripts/audit-and-clean-all-lesson-duplication.mts --fix
 *   npx tsx scripts/audit-and-clean-all-lesson-duplication.mts --fix --slug cardiac-catheterization
 *
 * Covers:
 * - src/content/pathway-lessons/**/*.json
 * - src/content/lessons/lesson-library.json
 * - data/**/*.json lesson-like records
 *
 * Fixes:
 * - duplicate section headings/kinds inside a lesson
 * - body text starting with repeated section heading
 * - body text starting with repeated lesson title
 * - repeated sentences inside a section
 * - duplicate sections with identical bodies
 * - repeated generic boilerplate/template footer paragraphs
 * - duplicate linked flashcard prompt sections
 *
 * This is data cleanup, not AI generation. It does not rewrite clinical content except by removing exact/redundant duplicate text.
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
  items?: string[];
  [key: string]: unknown;
};

type Lesson = {
  slug?: string;
  title?: string;
  tier?: string;
  bodySystem?: string;
  topic?: string;
  pathwayIds?: string[];
  sections?: Section[];
  linked_flashcard_prompts?: string[];
  content?: unknown;
  [key: string]: unknown;
};

type JsonRoot = Record<string, unknown> | unknown[];

type Finding = {
  file: string;
  location: string;
  slug: string;
  title: string;
  score: number;
  issues: string[];
};

type Repair = {
  file: string;
  location: string;
  slug: string;
  title: string;
  notes: string[];
};

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const pkgRoot = path.resolve(__dirname, "..");
const argv = process.argv.slice(2);
const FIX = argv.includes("--fix");
const DRY_RUN = argv.includes("--dry-run") || !FIX;
const slugFilter = valueAfter("--slug");

const CANONICAL_KIND_ORDER = [
  "overview",
  "pathophysiology",
  "risk_factors",
  "signs_symptoms",
  "diagnostics_labs",
  "exam_focus",
  "nursing_interventions",
  "red_flags",
  "complications",
  "patient_education",
  "clinical_pearls",
  "medical_treatments",
  "pharmacology",
  "clinical_decision_making",
  "case_based_application",
  "linked_flashcard_prompts",
];

const HEADING_TO_KIND: Record<string, string> = {
  "overview": "overview",
  "key concepts": "overview",
  "pathophysiology": "pathophysiology",
  "risk factors": "risk_factors",
  "signs symptoms": "signs_symptoms",
  "signs and symptoms": "signs_symptoms",
  "diagnostics labs": "diagnostics_labs",
  "labs diagnostics": "diagnostics_labs",
  "your exam focus": "exam_focus",
  "exam focus": "exam_focus",
  "nursing interventions": "nursing_interventions",
  "red flags": "red_flags",
  "red flags danger signs": "red_flags",
  "danger signs": "red_flags",
  "complications": "complications",
  "patient education": "patient_education",
  "patient client education": "patient_education",
  "clinical pearls": "clinical_pearls",
  "medical treatments": "medical_treatments",
  "management treatments": "medical_treatments",
  "pharmacology": "pharmacology",
  "clinical decision making priorities": "clinical_decision_making",
  "clinical decision making": "clinical_decision_making",
  "case based application": "case_based_application",
  "linked flashcard prompts": "linked_flashcard_prompts",
};

const KIND_TO_HEADING: Record<string, string> = {
  overview: "Overview",
  pathophysiology: "Pathophysiology",
  risk_factors: "Risk factors",
  signs_symptoms: "Signs & Symptoms",
  diagnostics_labs: "Diagnostics & Labs",
  exam_focus: "Your exam focus",
  nursing_interventions: "Nursing Interventions",
  red_flags: "Red Flags / Danger Signs",
  complications: "Complications",
  patient_education: "Patient & Client Education",
  clinical_pearls: "Clinical Pearls",
  medical_treatments: "Medical Treatments",
  pharmacology: "Pharmacology",
  clinical_decision_making: "Clinical Decision-Making & Priorities",
  case_based_application: "Case-Based Application",
  linked_flashcard_prompts: "Linked flashcard prompts",
};

const BOILERPLATE_PATTERNS: Array<{ label: string; regex: RegExp }> = [
  {
    label: "generic-bedside-practice-footer",
    regex: /In bedside practice,\s+[^.]{0,260}?should always be interpreted in the context of trend data, focused reassessment, communication with the provider, and escalation[^.]*\./gi,
  },
  {
    label: "generic-topic-deterioration-priority",
    regex: /[^.]{0,160}?is clinically important because it requires early recognition, careful trend assessment, and rapid prioritization when the patient begins to deteriorate\./gi,
  },
  {
    label: "generic-pathophysiology-template",
    regex: /These mechanisms explain why patients with [^.]{0,180}? develop recognizable changes in tissue perfusion, oxygen delivery, inflammation, compensatory responses, and downstream organ stress\./gi,
  },
  {
    label: "generic-critical-values-template",
    regex: /Examples of clinically important numeric patterns include SpO2 <90%, SBP <90 mm Hg, MAP <65 mm Hg, temperature >38\.3 C, heart rate >120 bpm[^.]*\./gi,
  },
  {
    label: "generic-medical-treatment-template",
    regex: /Treatment decisions for [^.]{0,180}? should focus on the medical goal: improving oxygenation, perfusion, rhythm stability, infection control, hemostasis, decompression, pain control, or organ support depending on the cause\./gi,
  },
];

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

function candidateJsonFiles(): string[] {
  const files = [
    ...walkJsonFiles(path.join(pkgRoot, "src", "content", "pathway-lessons")),
    path.join(pkgRoot, "src", "content", "lessons", "lesson-library.json"),
    ...walkJsonFiles(path.join(pkgRoot, "data")),
  ];
  return files.filter((p, i, arr) => fs.existsSync(p) && arr.indexOf(p) === i);
}

function normalizeLabel(value: string): string {
  return String(value || "")
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function normalizeKind(kind: string): string {
  const k = normalizeLabel(kind).replace(/\s+/g, "_");
  if (k === "labs_diagnostics") return "diagnostics_labs";
  if (k === "diagnostics_and_labs") return "diagnostics_labs";
  if (k === "signs_and_symptoms") return "signs_symptoms";
  if (k === "patient_client_education") return "patient_education";
  if (k === "red_flags_danger_signs") return "red_flags";
  if (k === "danger_signs") return "red_flags";
  if (k === "management_treatments") return "medical_treatments";
  if (k === "clinical_decision_making_priorities") return "clinical_decision_making";
  return k;
}

function kindForSection(section: Section): string {
  const rawKind = String(section.kind || "").trim();
  if (rawKind) return normalizeKind(rawKind);
  const heading = normalizeLabel(String(section.heading || section.title || ""));
  return HEADING_TO_KIND[heading] || normalizeKind(heading) || "unknown";
}

function escapeRegex(text: string): string {
  return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function splitSentences(text: string): string[] {
  return String(text || "")
    .replace(/\s+/g, " ")
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 35);
}

function normalizeSentence(s: string): string {
  return normalizeLabel(s)
    .replace(/\b[a-z]+ catheterization pre and post procedure nursing care\b/g, "topic")
    .replace(/\b[a-z]+ nursing care\b/g, "topic")
    .trim();
}

function stripRepeatedLabelPrefix(body: string, labels: string[]): { body: string; removed: string[] } {
  let next = String(body || "").trim();
  const removed: string[] = [];

  for (const label of labels.filter(Boolean)) {
    const cleanLabel = label.trim();
    const escaped = escapeRegex(cleanLabel);
    if (!escaped) continue;

    const repeatedLabel = new RegExp(`^(?:${escaped})(?:\\s*[:—-]?\\s*(?:\\r?\\n|\\s+)){1,}(?:${escaped})(?:\\s*[:—-]?\\s*)+`, "i");
    if (repeatedLabel.test(next)) {
      next = next.replace(repeatedLabel, "").trim();
      removed.push(`${cleanLabel} repeated prefix`);
    }

    const singleLabel = new RegExp(`^(?:${escaped})(?:\\s*[:—-]\\s+|\\s*\\r?\\n+)`, "i");
    if (singleLabel.test(next)) {
      next = next.replace(singleLabel, "").trim();
      removed.push(`${cleanLabel} heading prefix`);
    }
  }

  return { body: next, removed };
}

function dedupeSentences(body: string): { body: string; removed: number } {
  const original = String(body || "").trim();
  const sentences = splitSentences(original);
  if (sentences.length <= 1) return { body: original, removed: 0 };

  const seen = new Set<string>();
  let removed = 0;
  let next = original;

  for (const sentence of sentences) {
    const key = normalizeSentence(sentence);
    if (!key || key.length < 20) continue;
    if (seen.has(key)) {
      const sentenceRegex = new RegExp(`${escapeRegex(sentence)}\\s*`, "g");
      next = next.replace(sentenceRegex, "");
      removed++;
    } else {
      seen.add(key);
    }
  }

  return { body: next.replace(/\s{2,}/g, " ").trim(), removed };
}

function stripBoilerplate(body: string): { body: string; removed: string[] } {
  let next = String(body || "");
  const removed: string[] = [];
  for (const pattern of BOILERPLATE_PATTERNS) {
    let count = 0;
    next = next.replace(pattern.regex, () => {
      count++;
      return "";
    });
    if (count > 0) removed.push(`${pattern.label}x${count}`);
  }
  return { body: next.replace(/\s{2,}/g, " ").trim(), removed };
}

function isLessonLike(value: unknown): value is Lesson {
  if (!value || typeof value !== "object" || Array.isArray(value)) return false;
  const row = value as Lesson;
  if (typeof row.title !== "string" && typeof row.slug !== "string") return false;
  if (Array.isArray(row.sections)) return true;
  if (Array.isArray(row.linked_flashcard_prompts)) return true;
  if (row.content && typeof row.content === "object") return true;
  return false;
}

function normalizeContentBlocksToSections(lesson: Lesson): Section[] | null {
  if (Array.isArray(lesson.sections)) return lesson.sections;
  if (!Array.isArray(lesson.content)) return null;

  const maybeSections: Section[] = [];
  for (const block of lesson.content as Array<Record<string, unknown>>) {
    if (!block || typeof block !== "object") continue;
    const type = String(block.type || "");
    if (["heading", "subheading"].includes(type)) {
      maybeSections.push({
        id: normalizeKind(String(block.text || block.title || block.heading || "section")),
        kind: normalizeKind(String(block.text || block.title || block.heading || "section")),
        heading: String(block.text || block.title || block.heading || "Section"),
        body: "",
      });
    } else if (maybeSections.length && ["paragraph", "callout", "clinical-pearl", "warning"].includes(type)) {
      const last = maybeSections[maybeSections.length - 1]!;
      const text = String(block.text || block.body || block.content || "").trim();
      if (text) last.body = [last.body, text].filter(Boolean).join("\n\n");
    } else if (maybeSections.length && ["list", "bulletList", "numberedList", "numbered-list"].includes(type)) {
      const last = maybeSections[maybeSections.length - 1]!;
      const items = Array.isArray(block.items) ? block.items.map(String) : [];
      if (items.length) last.body = [last.body, items.map((i) => `- ${i}`).join("\n")].filter(Boolean).join("\n\n");
    }
  }

  return maybeSections.length ? maybeSections : null;
}

function writeSectionsBackIfContentBlocks(lesson: Lesson, cleanedSections: Section[]): void {
  if (Array.isArray(lesson.sections)) {
    lesson.sections = cleanedSections;
    return;
  }
  // For content-block only lessons, keep the original shape to avoid renderer surprises.
  // The audit still reports these. They can be migrated separately if needed.
}

function auditLesson(file: string, location: string, lesson: Lesson): Finding | null {
  const sections = normalizeContentBlocksToSections(lesson) || [];
  if (!sections.length) return null;

  const issues: string[] = [];
  let score = 0;
  const kindCounts = new Map<string, number>();
  const headingCounts = new Map<string, number>();
  const bodyCounts = new Map<string, number>();
  const sentenceCounts = new Map<string, number>();

  for (const section of sections) {
    const kind = kindForSection(section);
    kindCounts.set(kind, (kindCounts.get(kind) || 0) + 1);

    const headingKey = normalizeLabel(String(section.heading || section.title || ""));
    if (headingKey) headingCounts.set(headingKey, (headingCounts.get(headingKey) || 0) + 1);

    const body = String(section.body || section.text || "").trim();
    const bodyKey = normalizeSentence(body);
    if (bodyKey.length > 40) bodyCounts.set(bodyKey, (bodyCounts.get(bodyKey) || 0) + 1);

    for (const sentence of splitSentences(body)) {
      const key = normalizeSentence(sentence);
      if (key.length > 25) sentenceCounts.set(key, (sentenceCounts.get(key) || 0) + 1);
    }

    const labels = [String(section.heading || ""), String(section.title || ""), KIND_TO_HEADING[kind], String(lesson.title || "")]
      .filter(Boolean)
      .filter((v, i, arr) => arr.indexOf(v) === i);
    const stripped = stripRepeatedLabelPrefix(body, labels);
    if (stripped.removed.length) {
      score += stripped.removed.length * 2;
      issues.push(`${kind}: ${stripped.removed.join(", ")}`);
    }

    const boilerplate = stripBoilerplate(body);
    if (boilerplate.removed.length) {
      score += boilerplate.removed.length * 3;
      issues.push(`${kind}: ${boilerplate.removed.join(", ")}`);
    }
  }

  const duplicateKinds = [...kindCounts.entries()].filter(([, n]) => n > 1);
  const duplicateHeadings = [...headingCounts.entries()].filter(([, n]) => n > 1);
  const duplicateBodies = [...bodyCounts.entries()].filter(([, n]) => n > 1);
  const repeatedSentences = [...sentenceCounts.values()].filter((n) => n > 1).reduce((sum, n) => sum + n - 1, 0);

  if (duplicateKinds.length) {
    score += duplicateKinds.length * 4;
    issues.push(`duplicate section kinds: ${duplicateKinds.map(([k, n]) => `${k}x${n}`).join(", ")}`);
  }
  if (duplicateHeadings.length) {
    score += duplicateHeadings.length * 3;
    issues.push(`duplicate headings: ${duplicateHeadings.map(([k, n]) => `${k}x${n}`).join(", ")}`);
  }
  if (duplicateBodies.length) {
    score += duplicateBodies.length * 5;
    issues.push(`duplicate section bodies: ${duplicateBodies.length}`);
  }
  if (repeatedSentences > 0) {
    score += repeatedSentences;
    issues.push(`repeated sentences: ${repeatedSentences}`);
  }

  if (!issues.length) return null;
  return {
    file: path.relative(pkgRoot, file),
    location,
    slug: String(lesson.slug || ""),
    title: String(lesson.title || ""),
    score,
    issues,
  };
}

function mergeSections(primary: Section, duplicate: Section): Section {
  const primaryBody = String(primary.body || primary.text || "").trim();
  const duplicateBody = String(duplicate.body || duplicate.text || "").trim();
  if (!duplicateBody) return primary;
  if (!primaryBody) return { ...primary, body: duplicateBody };
  if (normalizeSentence(primaryBody) === normalizeSentence(duplicateBody)) return primary;
  if (primaryBody.includes(duplicateBody)) return primary;
  if (duplicateBody.includes(primaryBody)) return { ...primary, body: duplicateBody };
  return { ...primary, body: `${primaryBody}\n\n${duplicateBody}` };
}

function repairLesson(lesson: Lesson): { changed: boolean; notes: string[] } {
  const sections = normalizeContentBlocksToSections(lesson);
  if (!sections?.length) return { changed: false, notes: [] };

  let changed = false;
  const notes: string[] = [];
  const byKind = new Map<string, Section>();
  const originalOrder: string[] = [];
  const seenBodies = new Set<string>();

  for (const raw of sections) {
    const kind = kindForSection(raw);
    const canonicalHeading = KIND_TO_HEADING[kind] || String(raw.heading || raw.title || kind).trim();
    const cleaned: Section = {
      ...raw,
      id: String(raw.id || kind),
      kind,
      heading: canonicalHeading,
    };

    const labels = [canonicalHeading, String(raw.heading || ""), String(raw.title || ""), String(lesson.title || "")]
      .filter(Boolean)
      .filter((v, i, arr) => arr.indexOf(v) === i);
    const strippedPrefix = stripRepeatedLabelPrefix(String(cleaned.body || cleaned.text || ""), labels);
    if (strippedPrefix.removed.length) {
      cleaned.body = strippedPrefix.body;
      delete cleaned.text;
      changed = true;
      notes.push(`${kind}: removed ${strippedPrefix.removed.join(", ")}`);
    }

    const strippedBoilerplate = stripBoilerplate(String(cleaned.body || cleaned.text || ""));
    if (strippedBoilerplate.removed.length) {
      cleaned.body = strippedBoilerplate.body;
      delete cleaned.text;
      changed = true;
      notes.push(`${kind}: removed ${strippedBoilerplate.removed.join(", ")}`);
    }

    const deduped = dedupeSentences(String(cleaned.body || cleaned.text || ""));
    if (deduped.removed > 0) {
      cleaned.body = deduped.body;
      delete cleaned.text;
      changed = true;
      notes.push(`${kind}: removed ${deduped.removed} repeated sentence(s)`);
    }

    if (cleaned.heading !== raw.heading || cleaned.kind !== raw.kind || cleaned.id !== raw.id) {
      changed = true;
      notes.push(`${kind}: normalized heading/kind/id`);
    }

    const bodyKey = normalizeSentence(String(cleaned.body || cleaned.text || ""));
    if (bodyKey.length > 40 && seenBodies.has(bodyKey)) {
      changed = true;
      notes.push(`${kind}: dropped duplicate section body`);
      continue;
    }
    if (bodyKey.length > 40) seenBodies.add(bodyKey);

    if (!byKind.has(kind)) {
      byKind.set(kind, cleaned);
      originalOrder.push(kind);
    } else {
      byKind.set(kind, mergeSections(byKind.get(kind)!, cleaned));
      changed = true;
      notes.push(`${kind}: merged duplicate section`);
    }
  }

  if (changed) {
    const order = [...CANONICAL_KIND_ORDER, ...originalOrder.filter((k) => !CANONICAL_KIND_ORDER.includes(k))];
    const cleanedSections = order.filter((k) => byKind.has(k)).map((k) => byKind.get(k)!);
    writeSectionsBackIfContentBlocks(lesson, cleanedSections);
  }

  return { changed, notes };
}

function visitLessons(root: JsonRoot, visitor: (lesson: Lesson, location: string) => void): void {
  const seen = new WeakSet<object>();

  function walk(value: unknown, location: string): void {
    if (!value || typeof value !== "object") return;
    if (seen.has(value as object)) return;
    seen.add(value as object);

    if (isLessonLike(value)) {
      visitor(value, location);
      return;
    }

    if (Array.isArray(value)) {
      value.forEach((item, i) => walk(item, `${location}[${i}]`));
      return;
    }

    const obj = value as Record<string, unknown>;
    if (obj.pathways && typeof obj.pathways === "object") {
      for (const [pathway, raw] of Object.entries(obj.pathways as Record<string, unknown>)) {
        if (Array.isArray(raw)) raw.forEach((item, i) => walk(item, `${location}.pathways.${pathway}[${i}]`));
        else if (raw && typeof raw === "object") walk((raw as { lessons?: unknown }).lessons, `${location}.pathways.${pathway}.lessons`);
      }
    }

    for (const [key, child] of Object.entries(obj)) {
      if (key === "pathways") continue;
      if (key === "sections") continue;
      walk(child, `${location}.${key}`);
    }
  }

  walk(root, "$root");
}

function shouldIncludeLesson(lesson: Lesson): boolean {
  if (!slugFilter) return true;
  const haystack = `${lesson.slug || ""} ${lesson.title || ""} ${lesson.topic || ""}`.toLowerCase();
  return haystack.includes(slugFilter.toLowerCase());
}

function main(): void {
  const files = candidateJsonFiles();
  const findings: Finding[] = [];
  const repaired: Repair[] = [];
  let scanned = 0;
  let parseFailures = 0;

  for (const file of files) {
    let root: JsonRoot;
    try {
      root = JSON.parse(fs.readFileSync(file, "utf8")) as JsonRoot;
    } catch {
      parseFailures++;
      continue;
    }

    let dirty = false;
    visitLessons(root, (lesson, location) => {
      if (!shouldIncludeLesson(lesson)) return;
      scanned++;
      const finding = auditLesson(file, location, lesson);
      if (finding) findings.push(finding);
      if (FIX && finding) {
        const result = repairLesson(lesson);
        if (result.changed) {
          dirty = true;
          repaired.push({
            file: path.relative(pkgRoot, file),
            location,
            slug: String(lesson.slug || ""),
            title: String(lesson.title || ""),
            notes: result.notes,
          });
        }
      }
    });

    if (FIX && dirty) fs.writeFileSync(file, `${JSON.stringify(root, null, 2)}\n`);
  }

  findings.sort((a, b) => b.score - a.score || a.file.localeCompare(b.file));

  const report = {
    mode: DRY_RUN ? "dry-run" : "fix",
    scannedLessons: scanned,
    filesScanned: files.length,
    parseFailures,
    findings: findings.length,
    repaired: repaired.length,
    topFindings: findings.slice(0, 250),
    repairedLessons: repaired,
  };

  const reportDir = path.join(pkgRoot, "reports");
  fs.mkdirSync(reportDir, { recursive: true });
  const reportPath = path.join(reportDir, "all-lesson-duplication-audit.json");
  fs.writeFileSync(reportPath, `${JSON.stringify(report, null, 2)}\n`);

  console.log(JSON.stringify(report, null, 2));
  console.log(`\nReport written: ${path.relative(pkgRoot, reportPath)}`);
  if (DRY_RUN) console.log("\nDry run only. Re-run with --fix to write repairs.");
}

main();
