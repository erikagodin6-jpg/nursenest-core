/**
 * rn-ai-expand-lessons.ts
 *
 * RN lesson normalization + clinical expansion (Phases 2–5).
 *
 * For each RN lesson (ca-rn-nclex-rn + us-rn-nclex-rn) that fails any gate:
 *   1. Ensures all 12 required sections are present with ≥150w of clinical content
 *   2. Expands thin sections using topic-specific AI generation
 *   3. Adds linked_flashcard_prompts array (8 prompts per lesson)
 *
 * Preserves sections already ≥150w — only expands thin/missing ones.
 *
 * Usage:
 *   npx tsx scripts/rn-ai-expand-lessons.ts
 *   npx tsx scripts/rn-ai-expand-lessons.ts --dry-run
 *   npx tsx scripts/rn-ai-expand-lessons.ts --slug stroke-assessment-tpa-window
 *   npx tsx scripts/rn-ai-expand-lessons.ts --limit 20
 *   npx tsx scripts/rn-ai-expand-lessons.ts --force   (re-process already-done lessons)
 *
 * Env:
 *   AI_INTEGRATIONS_OPENAI_API_KEY  (required unless --dry-run)
 *   AI_INTEGRATIONS_OPENAI_BASE_URL (optional)
 *   UPGRADE_MODEL                   (default: gpt-4o)
 */

import OpenAI from "openai";
import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);

const CATALOG_PATH  = path.join(__dirname, "../nursenest-core/src/content/pathway-lessons/catalog.json");
const PROGRESS_PATH = path.join(__dirname, "../tmp/rn-expand-progress.json");

// ── CLI ──────────────────────────────────────────────────────────────────────
const args         = process.argv.slice(2);
const DRY_RUN      = args.includes("--dry-run");
const FORCE        = args.includes("--force");
const SLUG_FILTER  = (() => { const i = args.indexOf("--slug"); return i !== -1 ? args[i+1] : null; })();
const LIMIT        = (() => { const i = args.indexOf("--limit"); return i !== -1 ? parseInt(args[i+1],10) : Infinity; })();
const MIN_WORDS    = 1200;
const SECTION_MIN  = 150;
const MODEL        = process.env.UPGRADE_MODEL || "gpt-4o";
const RN_PATHWAYS  = new Set(["ca-rn-nclex-rn", "us-rn-nclex-rn"]);
const SAVE_EVERY   = 3;

// ── Required sections (12 total) ──────────────────────────────────────────────
const REQUIRED_KINDS = [
  "introduction",
  "pathophysiology_overview",
  "signs_symptoms",
  "labs_diagnostics",
  "treatments",
  "pharmacology",
  "nursing_assessment_interventions",
  "clinical_decision_making",
  "complications",
  "clinical_pearls",
  "client_education",
  "case_study",
] as const;

type SectionKind = typeof REQUIRED_KINDS[number];

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

// Flashcard prompt templates per section
const FLASHCARD_TOPIC_MAP: Array<{ section: SectionKind; prompt: string }> = [
  { section: "pathophysiology_overview", prompt: "What is the cellular/molecular mechanism of {title}?" },
  { section: "pathophysiology_overview", prompt: "Describe the compensatory mechanisms activated in {title}." },
  { section: "signs_symptoms",           prompt: "What are the early vs late signs of {title}?" },
  { section: "signs_symptoms",           prompt: "What red flags in {title} require immediate nursing action?" },
  { section: "labs_diagnostics",         prompt: "What are the key diagnostic labs and critical values for {title}?" },
  { section: "pharmacology",             prompt: "What drug classes are used for {title} and what is their mechanism?" },
  { section: "nursing_assessment_interventions", prompt: "What are the priority nursing interventions for {title} and why?" },
  { section: "complications",            prompt: "What are the acute complications of {title} and how should the nurse respond?" },
  { section: "clinical_decision_making", prompt: "What does the nurse do in the first 15 minutes of recognizing {title}?" },
  { section: "client_education",         prompt: "What should a patient with {title} know before discharge?" },
];

// ── Helpers ───────────────────────────────────────────────────────────────────
function countWords(body: string): number {
  return (body || "").trim().split(/\s+/).filter(Boolean).length;
}
function lessonWordCount(sections: any[]): number {
  return (sections || []).reduce((n: number, s: any) => n + countWords(s?.body || ""), 0);
}
function getThinSections(sections: any[]): SectionKind[] {
  const map = new Map<string, number>(
    (sections || []).map((s: any) => [s.kind, countWords(s?.body || "")])
  );
  return REQUIRED_KINDS.filter(k => !map.has(k) || (map.get(k) ?? 0) < SECTION_MIN);
}
function sleep(ms: number): Promise<void> {
  return new Promise(r => setTimeout(r, ms));
}
interface Progress { done: string[]; failed: string[] }
function loadProgress(): Progress {
  try { if (fs.existsSync(PROGRESS_PATH)) return JSON.parse(fs.readFileSync(PROGRESS_PATH,"utf8")); } catch {}
  return { done: [], failed: [] };
}
function saveProgress(p: Progress): void {
  fs.mkdirSync(path.dirname(PROGRESS_PATH), { recursive: true });
  fs.writeFileSync(PROGRESS_PATH, JSON.stringify(p, null, 2));
}

// ── System prompt ────────────────────────────────────────────────────────────
const SYSTEM_PROMPT = `You are a clinical nursing educator writing NCLEX-RN lesson content for NurseNest, a premium nursing exam prep platform.

CRITICAL RULES:
- Write ONLY the requested section body — no headings, no section labels, no preamble
- Every sentence must be specific to the given topic — zero generic filler
- Clinical accuracy is mandatory: correct drug names, doses, lab values, mechanisms
- Use markdown bold (**text**) for: drug names, critical lab values, red flags, key terms
- Do NOT begin with the topic name as the first word or sentence
- Write at RN/NCLEX-RN level: bedside focus, ABCs, clinical judgment, NCLEX Next Gen alignment
- Return ONLY the section body text — nothing else`;

async function generateSection(
  openai: OpenAI,
  title: string,
  bodySystem: string,
  kind: SectionKind,
  existingBody: string,
  region: "ca" | "us"
): Promise<string | null> {
  const meta = SECTION_META[kind];
  const regionNote = region === "ca"
    ? " (Canadian context: reference CNA standards, Canadian pharmacopoeia, provincial scope)"
    : " (US context: reference ANA, NCLEX Next Gen, CMS/Joint Commission standards)";

  const userMsg = `Topic: **${title}** — Body System: ${bodySystem}${regionNote}
Section: ${meta.heading}
Task: ${meta.prompt}${existingBody.trim() ? `\n\nExisting thin content (expand it — do not copy verbatim):\n${existingBody.slice(0, 300)}` : ""}`;

  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const resp = await openai.chat.completions.create({
        model: MODEL,
        max_tokens: 900,
        temperature: 0.25,
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user",   content: userMsg },
        ],
      });
      const content = (resp.choices[0]?.message?.content || "").trim();
      if (content && countWords(content) >= 100) return content;
      console.log(`    [attempt ${attempt}] Short response (${countWords(content)}w), retrying...`);
    } catch (e: any) {
      if (attempt < 3) { await sleep(2000 * attempt); continue; }
      console.error(`    API error: ${e.message}`);
      return null;
    }
  }
  return null;
}

function buildFlashcardPrompts(title: string): string[] {
  return FLASHCARD_TOPIC_MAP.map(t => t.prompt.replace("{title}", title));
}

// ── Main ─────────────────────────────────────────────────────────────────────
async function main() {
  console.log("═══════════════════════════════════════════════════════");
  console.log(" RN Clinical Expansion — Phases 2–5");
  console.log("═══════════════════════════════════════════════════════");
  console.log(`  Model:      ${MODEL}`);
  console.log(`  Dry run:    ${DRY_RUN}`);
  console.log(`  Force:      ${FORCE}`);
  console.log(`  Filter:     ${SLUG_FILTER || "all failing RN"}`);
  console.log(`  Limit:      ${isFinite(LIMIT) ? LIMIT : "none"}`);
  console.log("───────────────────────────────────────────────────────\n");

  if (!process.env.AI_INTEGRATIONS_OPENAI_API_KEY && !DRY_RUN) {
    console.error("ERROR: AI_INTEGRATIONS_OPENAI_API_KEY not set.");
    console.error("  export AI_INTEGRATIONS_OPENAI_API_KEY=<your-key>");
    console.error("  Or add --dry-run to preview what would be processed.");
    process.exit(1);
  }

  const catalog  = JSON.parse(fs.readFileSync(CATALOG_PATH, "utf8"));
  const progress = loadProgress();
  const openai   = DRY_RUN ? null! : new OpenAI({
    apiKey:   process.env.AI_INTEGRATIONS_OPENAI_API_KEY,
    baseURL:  process.env.AI_INTEGRATIONS_OPENAI_BASE_URL,
  });

  let totalExpanded = 0, totalSections = 0, totalSkipped = 0, totalFailed = 0, count = 0;

  for (const [pwKey, pwVal] of Object.entries<any>(catalog.pathways)) {
    if (!RN_PATHWAYS.has(pwKey)) continue;
    const region: "ca"|"us" = pwKey.startsWith("ca-") ? "ca" : "us";

    for (const lesson of (pwVal.lessons || [])) {
      if (SLUG_FILTER && lesson.slug !== SLUG_FILTER) continue;

      const sections: any[] = lesson.sections || [];
      const wc    = lessonWordCount(sections);
      const thin  = getThinSections(sections);
      const key   = `${pwKey}:${lesson.slug}`;

      // Already passing — skip (unless forced)
      if (wc >= MIN_WORDS && thin.length === 0 && !FORCE) {
        totalSkipped++;
        continue;
      }
      // Already processed this run — skip
      if (progress.done.includes(key) && !FORCE && !SLUG_FILTER) {
        totalSkipped++;
        continue;
      }

      if (count >= LIMIT) break;
      count++;

      console.log(`\n[${count}] [${pwKey}] ${lesson.slug}`);
      console.log(`  "${lesson.title}" | ${lesson.bodySystem || "?"} | ${wc}w | thin: ${thin.join(", ") || "none"}`);

      if (DRY_RUN) {
        console.log(`  [DRY] Would generate: ${thin.join(", ")}`);
        totalSkipped++;
        continue;
      }

      // Build section map
      const sectionMap = new Map<string, any>(sections.map((s: any) => [s.kind, { ...s }]));
      let generated = 0, failed = 0;

      for (const kind of thin) {
        const existing  = sectionMap.get(kind)?.body || "";
        const meta      = SECTION_META[kind];
        process.stdout.write(`  ↳ [${kind}] generating...`);

        const body = await generateSection(openai, lesson.title, lesson.bodySystem || "General", kind, existing, region);

        if (!body) {
          console.log(` ✗ failed`);
          failed++;
          continue;
        }
        console.log(` ✓ ${countWords(body)}w`);

        sectionMap.set(kind, {
          id:      kind,
          heading: meta.heading,
          kind,
          body,
        });
        generated++;
        totalSections++;
      }

      // Rebuild in canonical order
      const ORDER = REQUIRED_KINDS as readonly string[];
      const newSections: any[] = [];
      for (const k of ORDER) {
        if (sectionMap.has(k)) newSections.push(sectionMap.get(k));
      }
      // Preserve unknown section kinds (don't drop them)
      for (const [k, v] of sectionMap) {
        if (!ORDER.includes(k)) newSections.push(v);
      }
      lesson.sections = newSections;

      // Phase 5: add/update linked_flashcard_prompts
      lesson.linked_flashcard_prompts = buildFlashcardPrompts(lesson.title);

      const newWc = lessonWordCount(newSections);
      console.log(`  → ${wc}w → ${newWc}w | ${generated} generated, ${failed} failed`);

      if (generated > 0) {
        totalExpanded++;
        if (!progress.done.includes(key)) progress.done.push(key);
      } else if (failed > 0) {
        totalFailed++;
        if (!progress.failed.includes(key)) progress.failed.push(key);
      }

      if ((totalExpanded + totalFailed) % SAVE_EVERY === 0) {
        fs.writeFileSync(CATALOG_PATH, JSON.stringify(catalog, null, 2));
        saveProgress(progress);
        console.log(`  [checkpoint saved]`);
      }
    }
    if (count >= LIMIT) break;
  }

  if (!DRY_RUN) {
    fs.writeFileSync(CATALOG_PATH, JSON.stringify(catalog, null, 2));
    saveProgress(progress);
    console.log(`\nSaved: ${CATALOG_PATH}`);
  }

  console.log(`\n═══════════════════════════════════════════════════════`);
  console.log(` Done`);
  console.log(`═══════════════════════════════════════════════════════`);
  console.log(`  Expanded:          ${totalExpanded} lessons`);
  console.log(`  Sections generated:${totalSections}`);
  console.log(`  Skipped (OK):      ${totalSkipped}`);
  console.log(`  Failed:            ${totalFailed}`);
  if (DRY_RUN) console.log(`  [DRY RUN — no files written]`);
  console.log(`═══════════════════════════════════════════════════════\n`);
}

main().catch(e => { console.error(e); process.exit(1); });
