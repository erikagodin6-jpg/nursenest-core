#!/usr/bin/env tsx
/**
 * AI-assisted RN editorial repair for generic lesson sections.
 *
 * Use after mechanical duplicate cleanup. This script does NOT guess clinical detail
 * mechanically. It asks the configured OpenAI model to rewrite only low-specificity
 * RN sections and then validates that the rewrite removed boilerplate/title stuffing
 * and added topic-specific clinical cues.
 *
 * Run from package root:
 *   cd nursenest-core
 *   npx tsx scripts/rn-rewrite-generic-clinical-sections.mts --dry-run
 *   npx tsx scripts/rn-rewrite-generic-clinical-sections.mts --fix --limit 25
 *   npx tsx scripts/rn-rewrite-generic-clinical-sections.mts --fix --slug cardiac-catheterization
 *
 * Env:
 *   AI_INTEGRATIONS_OPENAI_API_KEY
 *   AI_INTEGRATIONS_OPENAI_BASE_URL optional
 *   LESSON_OPENAI_MODEL or AI_INTEGRATIONS_OPENAI_MODEL optional
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import OpenAI from "openai";

type Section = {
  id?: string;
  kind?: string;
  heading?: string;
  body?: string;
  [key: string]: unknown;
};

type Lesson = {
  slug?: string;
  title?: string;
  topic?: string;
  bodySystem?: string;
  pathwayIds?: string[];
  sections?: Section[];
  linked_flashcard_prompts?: string[];
  [key: string]: unknown;
};

type Catalog = {
  pathways?: Record<string, { lessons?: Lesson[] } | Lesson[]>;
  [key: string]: unknown;
};

type Finding = {
  file: string;
  pathway: string;
  slug: string;
  title: string;
  sectionKind: string;
  heading: string;
  reasons: string[];
};

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const pkgRoot = path.resolve(__dirname, "..");
const argv = process.argv.slice(2);
const FIX = argv.includes("--fix");
const DRY_RUN = argv.includes("--dry-run") || !FIX;
const slugFilter = valueAfter("--slug");
const LIMIT = Number(valueAfter("--limit") || "Infinity");

const RN_PATHWAYS = new Set(["ca-rn-nclex-rn", "us-rn-nclex-rn"]);
const TARGET_KINDS = new Set([
  "introduction",
  "overview",
  "pathophysiology_overview",
  "pathophysiology",
  "risk_factors",
  "signs_symptoms",
  "labs_diagnostics",
  "diagnostics_labs",
  "treatments",
  "medical_treatments",
  "pharmacology",
  "nursing_assessment_interventions",
  "nursing_interventions",
  "red_flags",
  "complications",
  "clinical_decision_making",
  "clinical_pearls",
  "client_education",
  "patient_education",
  "case_study",
  "case_based_application",
]);

const BOILERPLATE_PATTERNS = [
  /In bedside practice,\s+[^.]{0,260}?should always be interpreted in the context of trend data, focused reassessment, communication with the provider, and escalation[^.]*\./i,
  /is clinically important because it requires early recognition, careful trend assessment, and rapid prioritization when the patient begins to deteriorate/i,
  /These mechanisms explain why patients with [^.]{0,180}? develop recognizable changes in tissue perfusion, oxygen delivery, inflammation, compensatory responses, and downstream organ stress/i,
  /Examples of clinically important numeric patterns include SpO2 <90%, SBP <90 mm Hg, MAP <65 mm Hg/i,
  /Treatment decisions for [^.]{0,180}? should focus on the medical goal: improving oxygenation, perfusion, rhythm stability/i,
];

const STOP_TOKENS = new Set([
  "about", "acute", "adult", "after", "before", "care", "client", "clinical", "complications", "diagnosis", "disease", "disorder", "exam", "focus", "fundamentals", "health", "management", "medical", "nursing", "patient", "patients", "post", "pre", "priority", "procedure", "review", "signs", "symptoms", "system", "therapy", "treatment", "treatments", "with", "without", "overview",
]);

const SECTION_REQUIREMENTS: Record<string, string[]> = {
  introduction: ["what the topic is", "where RN sees it", "why it matters for NCLEX clinical judgment"],
  overview: ["what the topic is", "where RN sees it", "why it matters for NCLEX clinical judgment"],
  pathophysiology_overview: ["specific mechanism", "organ/system effect", "why bedside findings occur"],
  pathophysiology: ["specific mechanism", "organ/system effect", "why bedside findings occur"],
  risk_factors: ["specific patient risks", "why risk increases", "high-risk context"],
  signs_symptoms: ["early cues", "late/red-flag cues", "why each cue happens"],
  labs_diagnostics: ["specific tests", "numeric or concrete abnormal examples", "what result changes urgency"],
  diagnostics_labs: ["specific tests", "numeric or concrete abnormal examples", "what result changes urgency"],
  treatments: ["specific medical/procedural treatments", "rationale", "what failure looks like"],
  medical_treatments: ["specific medical/procedural treatments", "rationale", "what failure looks like"],
  pharmacology: ["drug classes/examples", "mechanism", "side effects/contraindications/nursing monitoring"],
  nursing_assessment_interventions: ["specific RN assessments", "interventions", "escalation triggers"],
  nursing_interventions: ["specific RN assessments", "interventions", "escalation triggers"],
  red_flags: ["emergent cues", "why dangerous", "immediate RN action"],
  complications: ["acute complications", "chronic/delayed complications", "monitoring/escalation"],
  clinical_decision_making: ["first 15 minutes", "priority rationale", "SBAR/escalation"],
  clinical_pearls: ["NCLEX trap", "specific memory hook", "never-do-this safety pearl"],
  client_education: ["when to call 911/ED", "when to call provider", "teach-back"],
  patient_education: ["when to call 911/ED", "when to call provider", "teach-back"],
  case_study: ["realistic vitals", "what is happening", "first actions with rationale"],
  case_based_application: ["realistic vitals", "what is happening", "first actions with rationale"],
};

function valueAfter(flag: string): string | null {
  const i = argv.indexOf(flag);
  return i >= 0 ? argv[i + 1] ?? null : null;
}

function getOpenAI(): OpenAI {
  return new OpenAI({
    apiKey: process.env.AI_INTEGRATIONS_OPENAI_API_KEY,
    baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL,
  });
}

function getModel(): string {
  return process.env.LESSON_OPENAI_MODEL?.trim()
    || process.env.AI_INTEGRATIONS_OPENAI_MODEL?.trim()
    || "gpt-4.1-mini";
}

function walkJsonFiles(dir: string): string[] {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) return walkJsonFiles(p);
    return entry.isFile() && entry.name.endsWith(".json") ? [p] : [];
  });
}

function catalogFiles(): string[] {
  const dir = path.join(pkgRoot, "src", "content", "pathway-lessons");
  return walkJsonFiles(dir).filter((p) => !p.endsWith("rn-nclex-catalog-import-state.json"));
}

function normalizeKind(kind: string): string {
  return String(kind || "").toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_+|_+$/g, "");
}

function normalizeText(value: string): string {
  return String(value || "").toLowerCase().replace(/[^a-z0-9]+/g, " ").replace(/\s+/g, " ").trim();
}

function topicLabel(lesson: Lesson): string {
  const source = String(lesson.topic || lesson.title || lesson.slug || "topic").trim();
  const beforeColon = source.split(":")[0]!.trim();
  return beforeColon
    .replace(/\b(pre|post|procedure|nursing care|management|overview|priorities|assessment|treatment)\b/gi, " ")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase() || source.toLowerCase();
}

function topicTokens(lesson: Lesson): string[] {
  const base = `${lesson.topic || ""} ${lesson.title || ""} ${lesson.slug || ""}`;
  const tokens = normalizeText(base).split(" ")
    .filter((t) => t.length >= 5)
    .filter((t) => !STOP_TOKENS.has(t))
    .filter((t, i, arr) => arr.indexOf(t) === i);
  return tokens.slice(0, 10);
}

function fullTitleCount(body: string, lesson: Lesson): number {
  const title = String(lesson.title || "").trim();
  if (!title || title.length < 12) return 0;
  const escaped = title.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return (body.match(new RegExp(escaped, "gi")) || []).length;
}

function hasBoilerplate(body: string): boolean {
  return BOILERPLATE_PATTERNS.some((p) => p.test(body));
}

function hasSpecificity(body: string, lesson: Lesson): boolean {
  const title = String(lesson.title || "");
  const withoutTitle = normalizeText(body.replaceAll(title, " "));
  const tokens = topicTokens(lesson);
  if (tokens.length === 0) return true;
  const hits = tokens.filter((t) => withoutTitle.includes(t)).length;
  return hits >= Math.min(2, tokens.length);
}

function wordCount(body: string): number {
  return String(body || "").trim().split(/\s+/).filter(Boolean).length;
}

function sectionFinding(file: string, pathway: string, lesson: Lesson, section: Section): Finding | null {
  const kind = normalizeKind(String(section.kind || section.id || section.heading || ""));
  if (!TARGET_KINDS.has(kind)) return null;

  const body = String(section.body || "").trim();
  if (!body) return null;

  const reasons: string[] = [];
  if (hasBoilerplate(body)) reasons.push("boilerplate template paragraph");
  const titleUses = fullTitleCount(body, lesson);
  if (titleUses > 1) reasons.push(`full title repeated ${titleUses}x`);
  if (!hasSpecificity(body, lesson)) reasons.push("low topic specificity after title removal");
  if (wordCount(body) < 90) reasons.push(`thin section (${wordCount(body)} words)`);

  if (!reasons.length) return null;
  return {
    file: path.relative(pkgRoot, file),
    pathway,
    slug: String(lesson.slug || ""),
    title: String(lesson.title || ""),
    sectionKind: kind,
    heading: String(section.heading || section.id || kind),
    reasons,
  };
}

function buildPrompt(lesson: Lesson, section: Section, pathway: string): string {
  const kind = normalizeKind(String(section.kind || section.id || section.heading || ""));
  const label = topicLabel(lesson);
  const requirements = SECTION_REQUIREMENTS[kind] || ["topic-specific RN clinical content", "rationale", "escalation or safety implications"];
  const original = String(section.body || "").slice(0, 1800);

  return `Rewrite this RN / NCLEX-RN lesson section so it is clinically specific and not generic.

Lesson title: ${lesson.title}
Short topic label to use in prose: ${label}
Body system: ${lesson.bodySystem || "unknown"}
Pathway: ${pathway}
Section kind: ${kind}
Section heading: ${section.heading || kind}

Must include:
${requirements.map((r) => `- ${r}`).join("\n")}

Strict style rules:
- Do NOT repeat the full lesson title except at most once if absolutely needed.
- Prefer the short topic label, e.g. "${label}".
- Do NOT use the boilerplate phrase about trend data, focused reassessment, communication with the provider, and escalation.
- Do NOT write generic lines that could apply to any condition.
- Use concrete clinical nouns, cues, procedures, labs, medications, complications, or nursing actions specific to this topic.
- Keep it accurate for RN scope and NCLEX-RN clinical judgment.
- Return only the revised section body, no heading.

Original section:
${original}`;
}

function validateRewrite(body: string, lesson: Lesson): string[] {
  const errors: string[] = [];
  if (wordCount(body) < 120) errors.push("rewrite too short");
  if (hasBoilerplate(body)) errors.push("rewrite still has boilerplate");
  const titleUses = fullTitleCount(body, lesson);
  if (titleUses > 1) errors.push(`rewrite still repeats full title ${titleUses}x`);
  if (!hasSpecificity(body, lesson)) errors.push("rewrite still lacks topic specificity");
  return errors;
}

async function rewriteSection(openai: OpenAI, lesson: Lesson, section: Section, pathway: string): Promise<string | null> {
  const prompt = buildPrompt(lesson, section, pathway);
  for (let attempt = 1; attempt <= 3; attempt++) {
    const resp = await openai.chat.completions.create({
      model: getModel(),
      temperature: 0.2,
      max_tokens: 900,
      messages: [
        {
          role: "system",
          content: "You are a senior RN educator and clinical editor. You rewrite lesson sections to be accurate, topic-specific, concise, and NCLEX-RN useful. Return only the section body.",
        },
        { role: "user", content: prompt },
      ],
    });
    const body = (resp.choices[0]?.message?.content || "").trim();
    const errors = validateRewrite(body, lesson);
    if (body && errors.length === 0) return body;
    console.warn(`    retry ${attempt}: ${errors.join(", ") || "empty response"}`);
  }
  return null;
}

function refreshFlashcardPrompts(lesson: Lesson): boolean {
  if (!Array.isArray(lesson.linked_flashcard_prompts)) return false;
  const label = topicLabel(lesson);
  const old = JSON.stringify(lesson.linked_flashcard_prompts);
  lesson.linked_flashcard_prompts = lesson.linked_flashcard_prompts.map((p) => {
    const title = String(lesson.title || "").trim();
    return title ? p.replaceAll(title, label) : p;
  });

  const flashcardSection = lesson.sections?.find((s) => normalizeKind(String(s.kind || s.id || "")) === "linked_flashcard_prompts");
  if (flashcardSection?.body) {
    const title = String(lesson.title || "").trim();
    if (title) flashcardSection.body = String(flashcardSection.body).replaceAll(title, label);
  }
  return JSON.stringify(lesson.linked_flashcard_prompts) !== old;
}

function shouldProcessLesson(lesson: Lesson): boolean {
  if (!slugFilter) return true;
  const haystack = `${lesson.slug || ""} ${lesson.title || ""} ${lesson.topic || ""}`.toLowerCase();
  return haystack.includes(slugFilter.toLowerCase());
}

async function main(): Promise<void> {
  if (FIX && !process.env.AI_INTEGRATIONS_OPENAI_API_KEY) {
    throw new Error("AI_INTEGRATIONS_OPENAI_API_KEY is required with --fix");
  }

  const openai = FIX ? getOpenAI() : null;
  const findings: Finding[] = [];
  const repaired: Array<Finding & { status: "rewritten" | "failed" | "flashcards-only" }> = [];
  let processedSections = 0;
  let scannedLessons = 0;

  for (const file of catalogFiles()) {
    if (processedSections >= LIMIT) break;
    const catalog = JSON.parse(fs.readFileSync(file, "utf8")) as Catalog;
    let dirty = false;

    for (const [pathway, raw] of Object.entries(catalog.pathways || {})) {
      if (!RN_PATHWAYS.has(pathway)) continue;
      const lessons = Array.isArray(raw) ? raw : raw.lessons || [];
      for (const lesson of lessons) {
        if (processedSections >= LIMIT) break;
        if (!shouldProcessLesson(lesson)) continue;
        scannedLessons++;

        if (FIX && refreshFlashcardPrompts(lesson)) {
          dirty = true;
        }

        for (const section of lesson.sections || []) {
          if (processedSections >= LIMIT) break;
          const finding = sectionFinding(file, pathway, lesson, section);
          if (!finding) continue;
          findings.push(finding);

          if (!FIX || !openai) continue;
          console.log(`[rewrite] ${pathway} ${lesson.slug} ${finding.sectionKind}: ${finding.reasons.join("; ")}`);
          const body = await rewriteSection(openai, lesson, section, pathway);
          processedSections++;
          if (body) {
            section.body = body;
            dirty = true;
            repaired.push({ ...finding, status: "rewritten" });
          } else {
            repaired.push({ ...finding, status: "failed" });
          }
        }
      }
    }

    if (FIX && dirty) fs.writeFileSync(file, `${JSON.stringify(catalog, null, 2)}\n`);
  }

  const report = {
    mode: DRY_RUN ? "dry-run" : "fix",
    model: FIX ? getModel() : null,
    scannedLessons,
    findings: findings.length,
    rewrittenOrAttemptedSections: repaired.length,
    topFindings: findings.slice(0, 250),
    repaired,
  };

  const reportDir = path.join(pkgRoot, "reports");
  fs.mkdirSync(reportDir, { recursive: true });
  const reportPath = path.join(reportDir, "rn-generic-clinical-section-rewrite-report.json");
  fs.writeFileSync(reportPath, `${JSON.stringify(report, null, 2)}\n`);

  console.log(JSON.stringify(report, null, 2));
  console.log(`\nReport written: ${path.relative(pkgRoot, reportPath)}`);
  if (DRY_RUN) console.log("\nDry run only. Re-run with --fix to rewrite flagged sections.");
}

void main().catch((err) => {
  console.error(err);
  process.exit(1);
});
