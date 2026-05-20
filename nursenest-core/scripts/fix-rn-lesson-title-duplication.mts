#!/usr/bin/env tsx
/**
 * RN lesson title / heading duplication audit + repair.
 *
 * Run from repo root:
 *   cd nursenest-core
 *   npx tsx scripts/fix-rn-lesson-title-duplication.mts --dry-run
 *   npx tsx scripts/fix-rn-lesson-title-duplication.mts --fix
 *   npx tsx scripts/fix-rn-lesson-title-duplication.mts --fix --slug cardiac-catheterization
 *
 * Fixes:
 * - duplicate section headings/kinds in the same RN lesson
 * - body text that starts by repeating the section heading
 * - body text that starts by repeating the lesson title
 * - repeated display labels such as "Pathophysiology\nPathophysiology" after import/render serialization
 * - duplicate linked flashcard prompt sections
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
  [key: string]: unknown;
};

type Catalog = {
  pathways?: Record<string, { lessons?: Lesson[] } | Lesson[]>;
  lessons?: Lesson[];
  [key: string]: unknown;
};

type Finding = {
  file: string;
  pathway: string;
  slug: string;
  title: string;
  issues: string[];
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
  "signs & symptoms": "signs_symptoms",
  "signs and symptoms": "signs_symptoms",
  "diagnostics & labs": "diagnostics_labs",
  "labs & diagnostics": "diagnostics_labs",
  "your exam focus": "exam_focus",
  "exam focus": "exam_focus",
  "nursing interventions": "nursing_interventions",
  "red flags": "red_flags",
  "red flags / danger signs": "red_flags",
  "complications": "complications",
  "patient education": "patient_education",
  "patient & client education": "patient_education",
  "clinical pearls": "clinical_pearls",
  "medical treatments": "medical_treatments",
  "management & treatments": "medical_treatments",
  "pharmacology": "pharmacology",
  "clinical decision-making & priorities": "clinical_decision_making",
  "clinical decision making & priorities": "clinical_decision_making",
  "case-based application": "case_based_application",
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

function valueAfter(flag: string): string | null {
  const i = argv.indexOf(flag);
  return i >= 0 ? argv[i + 1] ?? null : null;
}

function walkJsonFiles(dir: string): string[] {
  if (!fs.existsSync(dir)) return [];
  const out: string[] = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walkJsonFiles(p));
    else if (entry.isFile() && entry.name.endsWith(".json")) out.push(p);
  }
  return out;
}

function isRnPathway(pathway: string): boolean {
  return /(^|[-_])rn($|[-_])|nclex-rn/i.test(pathway);
}

function isRnLesson(lesson: Lesson, pathway: string): boolean {
  if (isRnPathway(pathway)) return true;
  if (String(lesson.tier || "").toLowerCase() === "rn") return true;
  return Array.isArray(lesson.pathwayIds) && lesson.pathwayIds.some(isRnPathway);
}

function normalizeLabel(value: string): string {
  return String(value || "")
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function kindForSection(section: Section): string {
  const rawKind = String(section.kind || "").trim();
  if (rawKind) return normalizeKind(rawKind);
  const heading = normalizeLabel(String(section.heading || section.title || ""));
  return HEADING_TO_KIND[heading] || heading.replace(/\s+/g, "_") || "unknown";
}

function normalizeKind(kind: string): string {
  const k = String(kind || "").trim().toLowerCase().replace(/-/g, "_");
  if (k === "labs_diagnostics") return "diagnostics_labs";
  if (k === "signs_and_symptoms") return "signs_symptoms";
  if (k === "patient_client_education") return "patient_education";
  if (k === "danger_signs") return "red_flags";
  if (k === "decision_making" || k === "priorities") return "clinical_decision_making";
  return k;
}

function escapeRegex(text: string): string {
  return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function stripRepeatedLabelPrefix(body: string, labels: string[]): { body: string; removed: string[] } {
  let next = String(body || "").trim();
  const removed: string[] = [];

  for (const label of labels.filter(Boolean)) {
    const escaped = escapeRegex(label.trim());
    if (!escaped) continue;

    // Handles: "Pathophysiology\nPathophysiology\nThese..." and "Pathophysiology: These..."
    const repeatedLabel = new RegExp(`^(?:${escaped})(?:\\s*[:—-]?\\s*(?:\\r?\\n|\\s+)){1,}(?:${escaped})(?:\\s*[:—-]?\\s*)+`, "i");
    if (repeatedLabel.test(next)) {
      next = next.replace(repeatedLabel, "").trim();
      removed.push(`${label} repeated prefix`);
    }

    const singleLabel = new RegExp(`^(?:${escaped})(?:\\s*[:—-]\\s+|\\s*\\r?\\n+)`, "i");
    if (singleLabel.test(next)) {
      next = next.replace(singleLabel, "").trim();
      removed.push(`${label} heading prefix`);
    }
  }

  return { body: next, removed };
}

function mergeSections(primary: Section, duplicate: Section): Section {
  const primaryBody = String(primary.body || "").trim();
  const duplicateBody = String(duplicate.body || "").trim();
  if (!duplicateBody) return primary;
  if (!primaryBody) return { ...primary, body: duplicateBody };
  if (normalizeLabel(primaryBody) === normalizeLabel(duplicateBody)) return primary;
  if (primaryBody.includes(duplicateBody)) return primary;
  if (duplicateBody.includes(primaryBody)) return { ...primary, body: duplicateBody };
  return { ...primary, body: `${primaryBody}\n\n${duplicateBody}` };
}

function auditLesson(file: string, pathway: string, lesson: Lesson): Finding | null {
  const sections = Array.isArray(lesson.sections) ? lesson.sections : [];
  const issues: string[] = [];
  const kindCounts = new Map<string, number>();
  const headingCounts = new Map<string, number>();

  for (const section of sections) {
    const kind = kindForSection(section);
    kindCounts.set(kind, (kindCounts.get(kind) || 0) + 1);
    const headingKey = normalizeLabel(String(section.heading || section.title || ""));
    if (headingKey) headingCounts.set(headingKey, (headingCounts.get(headingKey) || 0) + 1);

    const heading = String(section.heading || section.title || KIND_TO_HEADING[kind] || "").trim();
    const body = String(section.body || "").trim();
    const title = String(lesson.title || "").trim();
    const labels = [heading, KIND_TO_HEADING[kind], title].filter(Boolean);
    const stripped = stripRepeatedLabelPrefix(body, labels);
    if (stripped.removed.length) issues.push(`${kind}: ${stripped.removed.join(", ")}`);
  }

  const duplicateKinds = [...kindCounts.entries()].filter(([, n]) => n > 1);
  const duplicateHeadings = [...headingCounts.entries()].filter(([, n]) => n > 1);
  if (duplicateKinds.length) issues.push(`duplicate section kinds: ${duplicateKinds.map(([k, n]) => `${k}x${n}`).join(", ")}`);
  if (duplicateHeadings.length) issues.push(`duplicate headings: ${duplicateHeadings.map(([k, n]) => `${k}x${n}`).join(", ")}`);

  if (!issues.length) return null;
  return {
    file: path.relative(pkgRoot, file),
    pathway,
    slug: String(lesson.slug || ""),
    title: String(lesson.title || ""),
    issues,
  };
}

function repairLesson(lesson: Lesson): { changed: boolean; notes: string[] } {
  const sections = Array.isArray(lesson.sections) ? lesson.sections : [];
  if (!sections.length) return { changed: false, notes: [] };

  let changed = false;
  const notes: string[] = [];
  const byKind = new Map<string, Section>();
  const originalOrder: string[] = [];

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
    const stripped = stripRepeatedLabelPrefix(String(cleaned.body || ""), labels);
    if (stripped.removed.length) {
      cleaned.body = stripped.body;
      changed = true;
      notes.push(`${kind}: removed ${stripped.removed.join(", ")}`);
    }

    if (cleaned.heading !== raw.heading || cleaned.kind !== raw.kind || cleaned.id !== raw.id) {
      changed = true;
      notes.push(`${kind}: normalized heading/kind/id`);
    }

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
    lesson.sections = order.filter((k) => byKind.has(k)).map((k) => byKind.get(k)!);
  }

  return { changed, notes };
}

function visitLessons(catalog: Catalog, visitor: (lesson: Lesson, pathway: string) => void): void {
  if (catalog.pathways && typeof catalog.pathways === "object") {
    for (const [pathway, raw] of Object.entries(catalog.pathways)) {
      const lessons = Array.isArray(raw) ? raw : raw.lessons || [];
      for (const lesson of lessons) if (isRnLesson(lesson, pathway)) visitor(lesson, pathway);
    }
  }
  if (Array.isArray(catalog.lessons)) {
    for (const lesson of catalog.lessons) if (isRnLesson(lesson, "lesson-library")) visitor(lesson, "lesson-library");
  }
}

function main(): void {
  const targetFiles = [
    ...walkJsonFiles(path.join(pkgRoot, "src", "content", "pathway-lessons")),
    path.join(pkgRoot, "src", "content", "lessons", "lesson-library.json"),
  ].filter((p, i, arr) => fs.existsSync(p) && arr.indexOf(p) === i);

  const findings: Finding[] = [];
  const repaired: Array<{ file: string; pathway: string; slug: string; title: string; notes: string[] }> = [];
  let scanned = 0;

  for (const file of targetFiles) {
    const catalog = JSON.parse(fs.readFileSync(file, "utf8")) as Catalog;
    let dirty = false;

    visitLessons(catalog, (lesson, pathway) => {
      if (slugFilter && lesson.slug !== slugFilter && !String(lesson.title || "").toLowerCase().includes(slugFilter.toLowerCase())) return;
      scanned++;
      const finding = auditLesson(file, pathway, lesson);
      if (finding) findings.push(finding);
      if (FIX && finding) {
        const result = repairLesson(lesson);
        if (result.changed) {
          dirty = true;
          repaired.push({
            file: path.relative(pkgRoot, file),
            pathway,
            slug: String(lesson.slug || ""),
            title: String(lesson.title || ""),
            notes: result.notes,
          });
        }
      }
    });

    if (FIX && dirty) fs.writeFileSync(file, `${JSON.stringify(catalog, null, 2)}\n`);
  }

  const report = {
    mode: DRY_RUN ? "dry-run" : "fix",
    scannedRnLessons: scanned,
    findings: findings.length,
    repaired: repaired.length,
    topFindings: findings.slice(0, 100),
    repairedLessons: repaired,
  };

  const reportDir = path.join(pkgRoot, "reports");
  fs.mkdirSync(reportDir, { recursive: true });
  const reportPath = path.join(reportDir, "rn-lesson-title-duplication-audit.json");
  fs.writeFileSync(reportPath, `${JSON.stringify(report, null, 2)}\n`);

  console.log(JSON.stringify(report, null, 2));
  console.log(`\nReport written: ${path.relative(pkgRoot, reportPath)}`);
  if (DRY_RUN) console.log("\nDry run only. Re-run with --fix to write repairs.");
}

main();
