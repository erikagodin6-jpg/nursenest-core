/**
 * RN lesson normalization + clinical expansion with validation + targeted retries.
 *
 * Run from nursenest-core:
 *   npx tsx scripts/rn-ai-expand-lessons.ts [--dry-run] [--slug SLUG] [--limit N] [--force]
 *
 * Env: AI_INTEGRATIONS_OPENAI_API_KEY (unless --dry-run).
 * Model: LESSON_OPENAI_MODEL → AI_INTEGRATIONS_OPENAI_MODEL → gpt-4.1-mini (see {@link getLessonOpenAiChatModel}).
 */
import OpenAI from "openai";
import * as fs from "node:fs";
import * as path from "node:path";
import { fileURLToPath } from "node:url";

import { getLessonOpenAiChatModel } from "@/lib/ai/openai-env";
import {
  RN_EXPAND_REQUIRED_SECTION_KINDS,
  sectionKindsNeedingRegeneration,
  validateExpandedLesson,
  type ExpandedLessonValidation,
} from "@/lib/lessons/rn-expanded-lesson-contract";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PKG_ROOT = path.resolve(__dirname, "..");
const CATALOG_DIR = path.join(PKG_ROOT, "src/content/pathway-lessons");
const PROGRESS_PATH = path.join(PKG_ROOT, "tmp/rn-expand-progress.json");

/** Return all catalog JSON files that contain at least one RN lesson. */
function getRnCatalogFiles(): Array<{ filePath: string; fileName: string }> {
  const skip = new Set([
    "rn-nclex-catalog-import-state.json",
    "rn-nclex-master-map.json",
    "rn-nclex-explicit-inventory-aliases.json",
    "nclex-rn-source-checklist.json",
  ]);
  const results: Array<{ filePath: string; fileName: string }> = [];
  for (const fname of fs.readdirSync(CATALOG_DIR).sort()) {
    if (!fname.endsWith(".json") || skip.has(fname)) continue;
    const fpath = path.join(CATALOG_DIR, fname);
    let data: unknown;
    try { data = JSON.parse(fs.readFileSync(fpath, "utf8")); } catch { continue; }
    if (!data || typeof data !== "object" || !("pathways" in data)) continue;
    const pathways = (data as Record<string, unknown>).pathways;
    if (!pathways || typeof pathways !== "object") continue;
    const hasRn = Object.keys(pathways as object).some(k => RN_PATHWAYS.has(k));
    if (hasRn) results.push({ filePath: fpath, fileName: fname });
  }
  return results;
}

const args = process.argv.slice(2);
const DRY_RUN = args.includes("--dry-run");
const FORCE = args.includes("--force");
const SLUG_FILTER = (() => {
  const i = args.indexOf("--slug");
  return i !== -1 ? args[i + 1] : null;
})();
const LIMIT = (() => {
  const i = args.indexOf("--limit");
  return i !== -1 ? parseInt(args[i + 1]!, 10) : Infinity;
})();
const SECTION_MIN = 150;
const RN_PATHWAYS = new Set(["ca-rn-nclex-rn", "us-rn-nclex-rn"]);
const SAVE_EVERY = 3;
const MAX_CLINICAL_REGEN_ROUNDS = 2;

const REQUIRED_KINDS = RN_EXPAND_REQUIRED_SECTION_KINDS;
type SectionKind = (typeof REQUIRED_KINDS)[number];

const SECTION_META: Record<SectionKind, { heading: string; prompt: string }> = {
  introduction: {
    heading: "Overview",
    prompt:
      "Write a clinical overview (150–200 words). Cover: what this condition/topic is, clinical significance, incidence/prevalence where relevant, and which nursing settings encounter it (ICU, med-surg, ED, community, primary care). Be specific to this exact topic — no generic sentences. Do NOT start with the topic name.",
  },
  pathophysiology_overview: {
    heading: "Pathophysiology",
    prompt:
      "Write detailed pathophysiology (250–350 words). Go cellular → organ → systemic. Use step-by-step cause-and-effect chains. Explain compensatory mechanisms the body uses. Include specific cellular/molecular mechanisms (receptor types, enzymes, mediators). Must be detailed enough for a student to explain the disease progression aloud without notes.",
  },
  signs_symptoms: {
    heading: "Signs & Symptoms",
    prompt:
      "Write Signs & Symptoms (200–250 words). TWO subsections: EARLY SIGNS and LATE/RED FLAG SIGNS. For EACH sign explain WHY it occurs physiologically (link to pathophysiology). Include at least 3 early and 3 late findings. Red flags that require immediate nursing action must be explicitly labeled. Distinguish subjective (patient-reported) from objective (nurse-observed) findings.",
  },
  labs_diagnostics: {
    heading: "Diagnostics & Labs",
    prompt:
      "Write Diagnostics & Labs (180–220 words). List key tests with specific normal vs abnormal values (e.g., troponin >0.04 ng/mL = abnormal, BNP >100 pg/mL). Include critical/panic values that require immediate notification. Cover labs, imaging, and bedside tests relevant to this specific condition. Explain clinical significance of each finding.",
  },
  treatments: {
    heading: "Medical Treatments",
    prompt:
      "Write Medical Treatments (200–250 words). Focus on the MEDICAL management: procedures (e.g., cardioversion, intubation, surgery), IV fluid protocols, oxygen therapy strategies, device therapies, non-pharmacological interventions. Be specific to this condition — mention exact protocols (e.g., Surviving Sepsis Hour-1 Bundle, STEMI door-to-balloon time). Explain rationale for each treatment.",
  },
  pharmacology: {
    heading: "Pharmacology",
    prompt:
      "Write Pharmacology (200–250 words). List the primary drug classes used for this condition. For each class: mechanism of action, clinical purpose, key side effects, contraindications, and ONE nursing pearl. Format each drug entry clearly. Include specific examples (e.g., furosemide for diuresis, metoprolol for rate control). Flag high-alert medications.",
  },
  nursing_assessment_interventions: {
    heading: "Nursing Interventions",
    prompt:
      "Write Nursing Interventions (250–300 words). Focus on what the nurse DOES: monitoring parameters and frequency, safety precautions, positioning, IV management, specimen collection, documentation requirements. Include ESCALATION TRIGGERS — specific findings that require calling the provider immediately. Explain the rationale for each major intervention.",
  },
  clinical_decision_making: {
    heading: "Clinical Decision-Making & Priorities",
    prompt:
      "Write Clinical Decision-Making (150–200 words). Apply ABC framework first. What should the nurse do in the FIRST 15 MINUTES of recognizing this problem? How to prioritize when multiple problems compete (use Maslow + ABCs). Real bedside clinical thinking. Include: when to call rapid response, how to communicate findings (SBAR). No textbook theory — only bedside application.",
  },
  complications: {
    heading: "Complications",
    prompt:
      "Write Complications (150–200 words). Separate ACUTE (immediate, hours to days) from CHRONIC (weeks to years) complications. For each complication: what happens physiologically, timeline if relevant, and the specific nursing implication (what to monitor, when to escalate). Include at least 3 acute and 2 chronic complications specific to this condition.",
  },
  clinical_pearls: {
    heading: "Clinical Pearls",
    prompt:
      "Write Clinical Pearls (150–200 words). Include: (1) NCLEX-style common trap — what students INCORRECTLY pick vs the correct answer and why; (2) a memory anchor or mnemonic specific to this topic; (3) how to distinguish this condition from the most commonly confused similar condition; (4) one NEVER DO THIS safety pearl. Make every pearl specific — zero generic exam advice.",
  },
  client_education: {
    heading: "Patient & Client Education",
    prompt:
      "Write Patient Education (150–200 words). Include: when to call 911 (list 3–4 specific symptoms), when to call the provider/clinic (list 3–4 symptoms), medication adherence teaching with specific safety points, lifestyle modifications with rationale, and a teach-back example sentence appropriate for this condition. Be condition-specific throughout.",
  },
  case_study: {
    heading: "Case-Based Application",
    prompt:
      "Write a Case-Based Application (200–250 words). Use a realistic patient name, age, and setting. Present with: 2–3 specific vital sign abnormalities, relevant history, chief complaint. Ask TWO questions: (1) 'What is most likely happening and why?' (2) 'What should the nurse do FIRST, in priority order?' Provide detailed answers with clinical rationale for each action. End with one 'Key Teaching Point' sentence.",
  },
};

const FLASHCARD_TOPIC_MAP: Array<{ section: SectionKind; prompt: string }> = [
  { section: "pathophysiology_overview", prompt: "What is the cellular/molecular mechanism of {title}?" },
  { section: "pathophysiology_overview", prompt: "Describe the compensatory mechanisms activated in {title}." },
  { section: "signs_symptoms", prompt: "What are the early vs late signs of {title}?" },
  { section: "signs_symptoms", prompt: "What red flags in {title} require immediate nursing action?" },
  { section: "labs_diagnostics", prompt: "What are the key diagnostic labs and critical values for {title}?" },
  { section: "pharmacology", prompt: "What drug classes are used for {title} and what is their mechanism?" },
  {
    section: "nursing_assessment_interventions",
    prompt: "What are the priority nursing interventions for {title} and why?",
  },
  { section: "complications", prompt: "What are the acute complications of {title} and how should the nurse respond?" },
  { section: "clinical_decision_making", prompt: "What does the nurse do in the first 15 minutes of recognizing {title}?" },
  { section: "client_education", prompt: "What should a patient with {title} know before discharge?" },
];

function countWords(body: string): number {
  return (body || "").trim().split(/\s+/).filter(Boolean).length;
}

function lessonWordCount(sections: { body?: string }[]): number {
  return (sections || []).reduce((n, s) => n + countWords(s?.body || ""), 0);
}

function getThinSections(sections: { kind?: string; body?: string }[]): SectionKind[] {
  const map = new Map<string, number>((sections || []).map((s) => [String(s.kind), countWords(s?.body || "")]));
  return REQUIRED_KINDS.filter((k) => !map.has(k) || (map.get(k) ?? 0) < SECTION_MIN);
}

function sleep(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

interface Progress {
  done: string[];
  failed: string[];
}

function loadProgress(): Progress {
  try {
    if (fs.existsSync(PROGRESS_PATH)) return JSON.parse(fs.readFileSync(PROGRESS_PATH, "utf8")) as Progress;
  } catch {
    /* ignore */
  }
  return { done: [], failed: [] };
}

function saveProgress(p: Progress): void {
  fs.mkdirSync(path.dirname(PROGRESS_PATH), { recursive: true });
  fs.writeFileSync(PROGRESS_PATH, JSON.stringify(p, null, 2));
}

const SYSTEM_PROMPT = `You are a clinical nursing educator writing NCLEX-RN lesson content for NurseNest, a premium nursing exam prep platform.

CRITICAL RULES:
- Write ONLY the requested section body — no headings, no section labels, no preamble
- Every sentence must be specific to the given topic — zero generic filler
- Clinical accuracy is mandatory: correct drug names, doses, lab values, mechanisms
- Use markdown bold (**text**) for: drug names, critical lab values, red flags, key terms
- Do NOT begin with the topic name as the first word or sentence
- Write at RN/NCLEX-RN level: bedside focus, ABCs, clinical judgment, NCLEX Next Gen alignment
- Return ONLY the section body text — nothing else`;

function buildRepairContext(kind: SectionKind, v: ExpandedLessonValidation): string {
  const lines: string[] = [];
  if (v.thinSections.some((t) => t.kind === kind)) {
    lines.push(`Section is below ${SECTION_MIN} words — expand substantially.`);
  }
  if (v.missingSections.includes(kind)) {
    lines.push("Section was missing or empty — write full clinical content.");
  }
  for (const m of v.missingClinicalRequirements) {
    if (m.kind === kind) lines.push(`Missing clinical requirement: ${m.requirement}`);
  }
  return lines.join("\n");
}

async function generateSection(
  openai: OpenAI,
  title: string,
  bodySystem: string,
  kind: SectionKind,
  existingBody: string,
  region: "ca" | "us",
  repairContext?: string,
): Promise<string | null> {
  const meta = SECTION_META[kind];
  const regionNote =
    region === "ca"
      ? " (Canadian context: reference CNA standards, Canadian pharmacopoeia, provincial scope)"
      : " (US context: reference ANA, NCLEX Next Gen, CMS/Joint Commission standards)";
  const repairBlock = repairContext?.trim()
    ? `\n\n--- VALIDATION FAILURES (fix all; preserve topic specificity; no headings) ---\n${repairContext.trim()}`
    : "";
  const userMsg = `Topic: **${title}** — Body System: ${bodySystem}${regionNote}
Section: ${meta.heading}
Task: ${meta.prompt}${existingBody.trim() ? `\n\nExisting thin content (expand it — do not copy verbatim):\n${existingBody.slice(0, 300)}` : ""}${repairBlock}`;

  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const resp = await openai.chat.completions.create({
        model: getLessonOpenAiChatModel(),
        max_tokens: 900,
        temperature: 0.25,
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: userMsg },
        ],
      });
      const content = (resp.choices[0]?.message?.content || "").trim();
      if (content && countWords(content) >= 100) return content;
      console.log(`    [attempt ${attempt}] Short response (${countWords(content)}w), retrying...`);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);
      if (attempt < 3) {
        await sleep(2000 * attempt);
        continue;
      }
      console.error(`    API error: ${msg}`);
      return null;
    }
  }
  return null;
}

/** `linked_flashcard_prompts` stays string[] for catalog / loader compatibility. TODO: structured objects when pipeline supports them. */
function buildFlashcardPrompts(title: string): string[] {
  return FLASHCARD_TOPIC_MAP.map((t) => t.prompt.replace("{title}", title));
}

function syncLinkedFlashcardSection(lesson: { sections?: unknown[] }, prompts: string[]): void {
  const body = prompts.map((p, i) => `${i + 1}. ${p}`).join("\n");
  const sections = [...((lesson.sections as object[]) || [])];
  const idx = sections.findIndex((s: { kind?: string }) => String((s as { kind?: string }).kind) === "linked_flashcard_prompts");
  const row = {
    id: "linked_flashcard_prompts",
    heading: "Linked flashcard prompts",
    kind: "linked_flashcard_prompts",
    body,
  };
  if (idx >= 0) sections[idx] = { ...(sections[idx] as object), ...row };
  else sections.push(row);
  lesson.sections = sections;
}

function logLessonOutcome(
  pathway: string,
  lesson: { slug: string; title: string },
  startWc: number,
  generatedSectionCount: number,
  v: ExpandedLessonValidation,
): void {
  console.log(
    JSON.stringify({
      pathway,
      slug: lesson.slug,
      title: lesson.title,
      startingWordCount: startWc,
      generatedSectionCount,
      finalWordCount: v.totalWords,
      validationPass: v.pass,
      missingSections: v.missingSections,
      thinSections: v.thinSections,
      missingClinicalRequirementsCount: v.missingClinicalRequirements.length,
      flashcardPromptErrorsCount: v.flashcardPromptErrors.length,
    }),
  );
}

async function main(): Promise<void> {
  console.log(`Model: ${getLessonOpenAiChatModel()}`);
  console.log("═══════════════════════════════════════════════════════");
  console.log(" RN Clinical Expansion — validate / retry / gate");
  console.log("═══════════════════════════════════════════════════════");
  console.log(`  Dry run:    ${DRY_RUN}`);
  console.log(`  Force:      ${FORCE}`);
  console.log(`  Filter:     ${SLUG_FILTER || "all RN lessons"}`);
  console.log(`  Limit:      ${Number.isFinite(LIMIT) ? LIMIT : "none"}`);
  console.log("───────────────────────────────────────────────────────\n");

  if (!process.env.AI_INTEGRATIONS_OPENAI_API_KEY && !DRY_RUN) {
    console.error("ERROR: AI_INTEGRATIONS_OPENAI_API_KEY not set.");
    process.exit(1);
  }

  const catalogFiles = getRnCatalogFiles();
  console.log(`  Catalog files with RN lessons: ${catalogFiles.length}`);
  catalogFiles.forEach(f => console.log(`    ${f.fileName}`));
  console.log("");

  const progress = loadProgress();
  const openai = DRY_RUN ? (null as unknown as OpenAI) : new OpenAI({ apiKey: process.env.AI_INTEGRATIONS_OPENAI_API_KEY, baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL });

  let totalExpanded = 0;
  let totalSections = 0;
  let totalSkipped = 0;
  let totalFailed = 0;
  let count = 0;

  for (const { filePath, fileName } of catalogFiles) {
    if (count >= LIMIT) break;

    const catalog = JSON.parse(fs.readFileSync(filePath, "utf8")) as { pathways: Record<string, { lessons: object[] } | object[]> };
    let fileDirty = false;

    console.log(`\n━━━ ${fileName} ━━━`);

    for (const [pwKey, pwValRaw] of Object.entries(catalog.pathways || {})) {
      if (!RN_PATHWAYS.has(pwKey)) continue;
      if (count >= LIMIT) break;

      const region: "ca" | "us" = pwKey.startsWith("ca-") ? "ca" : "us";
      // Handle both {lessons: [...]} and direct array shapes
      const lessonList: object[] = Array.isArray(pwValRaw)
        ? pwValRaw
        : (pwValRaw as { lessons?: object[] }).lessons || [];

      for (const lesson of lessonList) {
        if (SLUG_FILTER && (lesson as { slug?: string }).slug !== SLUG_FILTER) continue;

        const L = lesson as {
          slug: string;
          title: string;
          bodySystem?: string;
          sections?: { kind?: string; body?: string; heading?: string; id?: string }[];
          linked_flashcard_prompts?: string[];
        };
        const sections = L.sections || [];
        const startWc = lessonWordCount(sections);
        const key = `${pwKey}:${L.slug}`;

        const initialValidation = validateExpandedLesson(L);
        if (initialValidation.pass && !FORCE && !SLUG_FILTER) {
          totalSkipped++;
          continue;
        }
        if (progress.done.includes(key) && !FORCE && !SLUG_FILTER) {
          if (initialValidation.pass) { totalSkipped++; continue; }
          progress.done = progress.done.filter((x) => x !== key);
        }

        if (count >= LIMIT) break;
        count++;

        const thinInitial = getThinSections(sections);
        console.log(`\n[${count}] [${pwKey}] ${L.slug}`);
        console.log(`  "${L.title}" | ${L.bodySystem || "?"} | ${startWc}w | thin: ${thinInitial.join(", ") || "none"}`);

        if (DRY_RUN) {
          console.log(`  [DRY] Would process; pass=${initialValidation.pass}, missing=${initialValidation.missingSections.length}`);
          totalSkipped++;
          continue;
        }

        const sectionMap = new Map<string, { kind?: string; body?: string; heading?: string; id?: string }>(
          sections.map((s) => [String(s.kind), { ...s }]),
        );
        let generated = 0;
        let failedGen = 0;

        for (const kind of thinInitial) {
          const existing = sectionMap.get(kind)?.body || "";
          const meta = SECTION_META[kind];
          process.stdout.write(`  ↳ [${kind}] generating...`);
          const body = await generateSection(openai, L.title, L.bodySystem || "General", kind, existing, region);
          if (!body) { console.log(" ✗ failed"); failedGen++; continue; }
          console.log(` ✓ ${countWords(body)}w`);
          sectionMap.set(kind, { id: kind, heading: meta.heading, kind, body });
          generated++;
          totalSections++;
        }

        const ORDER = [...REQUIRED_KINDS] as readonly string[];
        const newSections: typeof sections = [];
        for (const k of ORDER) { if (sectionMap.has(k)) newSections.push(sectionMap.get(k)!); }
        for (const [k, val] of sectionMap) { if (!ORDER.includes(k)) newSections.push(val); }
        L.sections = newSections;

        L.linked_flashcard_prompts = buildFlashcardPrompts(L.title);
        syncLinkedFlashcardSection(L, L.linked_flashcard_prompts);

        let v = validateExpandedLesson(L);
        for (let regenRound = 0; regenRound < MAX_CLINICAL_REGEN_ROUNDS && !v.pass; regenRound++) {
          if (v.flashcardPromptCount < 8 || v.flashcardPromptErrors.length > 0) {
            L.linked_flashcard_prompts = buildFlashcardPrompts(L.title);
            syncLinkedFlashcardSection(L, L.linked_flashcard_prompts);
          }
          v = validateExpandedLesson(L);
          if (v.pass) break;

          const sm = new Map<string, { kind?: string; body?: string; heading?: string; id?: string }>(
            (L.sections || []).map((s) => [String(s.kind), { ...s }]),
          );
          const targetKinds = sectionKindsNeedingRegeneration(v);
          if (targetKinds.length === 0) break;

          for (const kind of targetKinds) {
            const existing = sm.get(kind)?.body || "";
            const meta = SECTION_META[kind];
            const ctx = buildRepairContext(kind, v);
            process.stdout.write(`  ↳ [repair ${regenRound + 1}] [${kind}] ...`);
            const body = await generateSection(openai, L.title, L.bodySystem || "General", kind, existing, region, ctx);
            if (!body) { console.log(" ✗"); failedGen++; }
            else {
              console.log(` ✓ ${countWords(body)}w`);
              sm.set(kind, { id: kind, heading: meta.heading, kind, body });
              generated++; totalSections++;
            }
          }
          const rebuilt: typeof sections = [];
          for (const k of ORDER) { if (sm.has(k)) rebuilt.push(sm.get(k)!); }
          for (const [k, row] of sm) { if (!ORDER.includes(k)) rebuilt.push(row); }
          L.sections = rebuilt;
          v = validateExpandedLesson(L);
        }

        logLessonOutcome(pwKey, L, startWc, generated, v);
        fileDirty = true;

        if (v.pass) {
          totalExpanded++;
          if (!progress.done.includes(key)) progress.done.push(key);
          progress.failed = progress.failed.filter((s) => s !== key);
        } else {
          totalFailed++;
          if (!progress.failed.includes(key)) progress.failed.push(key);
          console.error(JSON.stringify({
            event: "rn_expand_validation_failed", pathway: pwKey, slug: L.slug,
            missingSections: v.missingSections, thinSections: v.thinSections,
            missingClinicalCount: v.missingClinicalRequirements.length,
            flashcardErrors: v.flashcardPromptErrors.length,
          }));
        }

        if ((totalExpanded + totalFailed) % SAVE_EVERY === 0) {
          fs.writeFileSync(filePath, JSON.stringify(catalog, null, 2));
          saveProgress(progress);
          console.log("  [checkpoint saved]");
        }
      } // end lessons
    } // end pathways

    if (!DRY_RUN && fileDirty) {
      fs.writeFileSync(filePath, JSON.stringify(catalog, null, 2));
      saveProgress(progress);
      console.log(`\n  Saved: ${fileName}`);
    }
  } // end files

  console.log("\n═══════════════════════════════════════════════════════");
  console.log(` Done | expanded(valid): ${totalExpanded} | sections: ${totalSections} | skipped: ${totalSkipped} | failed: ${totalFailed}`);
  console.log("═══════════════════════════════════════════════════════\n");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
