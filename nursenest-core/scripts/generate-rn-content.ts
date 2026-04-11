#!/usr/bin/env npx tsx
/**
 * generate-rn-content.ts
 *
 * Generates 50 RN-level nursing lessons + 200 exam questions aligned with
 * PathwayLesson and ExamQuestion Prisma schemas.
 *
 * Exam coverage: NCLEX-RN (US) + Canadian RN (CA)
 * Category mix: med-surg, pharmacology, prioritization, safety, delegation
 * Difficulty: 20% easy / 40% medium / 40% hard (per topic spec)
 *
 * Output: output/rn-content-batch.json
 *   { lessons: GeneratedPathwayLesson[], questions: GeneratedExamQuestion[] }
 *
 * Usage:
 *   npx tsx scripts/generate-rn-content.ts [options]
 *
 * Options:
 *   --dry-run          Print topic list only, skip AI generation
 *   --from=N           Start from topic index N (0-based, default 0)
 *   --to=N             Stop after topic index N (inclusive, default 49)
 *   --questions-only   Skip lesson generation
 *   --lessons-only     Skip question generation
 *   --output=FILE      Override output file path
 *   --concurrency=N    Parallel topic requests (default 3)
 *
 * Environment:
 *   AI_INTEGRATIONS_OPENAI_API_KEY  — required
 *   AI_OPENAI_MODEL / AI_ADMIN_MODEL — optional, default gpt-4o-mini
 *   AI_INTEGRATIONS_OPENAI_BASE_URL  — optional, for Azure/proxy
 *
 * Resume from checkpoint:
 *   If the output file exists, completed topicSlugs are skipped automatically.
 */

import * as fs from "fs/promises";
import * as path from "path";
import { fileURLToPath } from "url";

// ---------------------------------------------------------------------------
// Env bootstrap — load .env.local if present
// ---------------------------------------------------------------------------
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const envPath = path.resolve(__dirname, "../.env.local");
try {
  // dotenv is an optional peer dep; load synchronously to avoid top-level await
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const dotenv = require("dotenv") as { config: (opts: object) => void };
  dotenv.config({ path: envPath });
} catch {
  // dotenv not installed or .env.local missing — continue with process.env
}

// ---------------------------------------------------------------------------
// Types (inline to avoid server-only import chain)
// ---------------------------------------------------------------------------
type PipelineDifficulty = "easy" | "medium" | "hard";
type PipelineCountry = "US" | "CA";

type TopicSpec = {
  topicSlug: string;
  topicLabel: string;
  bodySystem: string;
  tags: string[];
  difficulty: PipelineDifficulty;
  country: PipelineCountry;
  questionCount: number;
  /** Descriptive category for reporting. */
  category: "med-surg" | "pharmacology" | "prioritization" | "safety" | "delegation";
};

// ---------------------------------------------------------------------------
// 50 RN Topics
//
// Difficulty distribution (200 questions total, 4 per topic):
//   easy   → 10 topics × 4q = 40  (20%)
//   medium → 20 topics × 4q = 80  (40%)
//   hard   → 20 topics × 4q = 80  (40%)
//
// Country split: 30 US, 20 CA
// ---------------------------------------------------------------------------
const TOPICS: TopicSpec[] = [
  // ── MED-SURG (25 topics) ──────────────────────────────────────────────────

  // Hard × 10
  {
    topicSlug: "myocardial-infarction",
    topicLabel: "Myocardial Infarction (STEMI / NSTEMI)",
    bodySystem: "cardiovascular",
    tags: ["cardiac", "emergency", "priority-setting", "pharmacology"],
    difficulty: "hard",
    country: "US",
    questionCount: 4,
    category: "med-surg",
  },
  {
    topicSlug: "ischemic-stroke",
    topicLabel: "Ischemic Stroke and tPA Administration",
    bodySystem: "neurological",
    tags: ["neuro", "emergency", "time-sensitive", "thrombolytics"],
    difficulty: "hard",
    country: "US",
    questionCount: 4,
    category: "med-surg",
  },
  {
    topicSlug: "hypertensive-crisis",
    topicLabel: "Hypertensive Crisis and Emergency",
    bodySystem: "cardiovascular",
    tags: ["cardiac", "emergency", "priority-setting"],
    difficulty: "hard",
    country: "CA",
    questionCount: 4,
    category: "med-surg",
  },
  {
    topicSlug: "pulmonary-embolism",
    topicLabel: "Deep Vein Thrombosis and Pulmonary Embolism",
    bodySystem: "respiratory",
    tags: ["respiratory", "emergency", "anticoagulation", "clots"],
    difficulty: "hard",
    country: "US",
    questionCount: 4,
    category: "med-surg",
  },
  {
    topicSlug: "acute-respiratory-distress-syndrome",
    topicLabel: "Acute Respiratory Distress Syndrome (ARDS)",
    bodySystem: "respiratory",
    tags: ["respiratory", "ICU", "ventilator", "emergency"],
    difficulty: "hard",
    country: "US",
    questionCount: 4,
    category: "med-surg",
  },
  {
    topicSlug: "diabetic-ketoacidosis",
    topicLabel: "Diabetic Ketoacidosis (DKA)",
    bodySystem: "endocrine",
    tags: ["endocrine", "emergency", "fluids-electrolytes", "insulin"],
    difficulty: "hard",
    country: "CA",
    questionCount: 4,
    category: "med-surg",
  },
  {
    topicSlug: "hyperosmolar-hyperglycemic-state",
    topicLabel: "Hyperosmolar Hyperglycemic State (HHS)",
    bodySystem: "endocrine",
    tags: ["endocrine", "emergency", "fluids-electrolytes", "type2-diabetes"],
    difficulty: "hard",
    country: "US",
    questionCount: 4,
    category: "med-surg",
  },
  {
    topicSlug: "acute-kidney-injury",
    topicLabel: "Acute Kidney Injury (AKI)",
    bodySystem: "renal",
    tags: ["renal", "fluids-electrolytes", "monitoring", "pharmacology"],
    difficulty: "hard",
    country: "CA",
    questionCount: 4,
    category: "med-surg",
  },
  {
    topicSlug: "liver-cirrhosis-hepatic-encephalopathy",
    topicLabel: "Liver Cirrhosis and Hepatic Encephalopathy",
    bodySystem: "gastrointestinal",
    tags: ["GI", "liver", "neuro", "fluids-electrolytes"],
    difficulty: "hard",
    country: "US",
    questionCount: 4,
    category: "med-surg",
  },
  {
    topicSlug: "gastrointestinal-bleeding",
    topicLabel: "Upper and Lower Gastrointestinal Bleeding",
    bodySystem: "gastrointestinal",
    tags: ["GI", "emergency", "blood-loss", "priority-setting"],
    difficulty: "hard",
    country: "US",
    questionCount: 4,
    category: "med-surg",
  },

  // Medium × 8
  {
    topicSlug: "heart-failure",
    topicLabel: "Heart Failure (Systolic and Diastolic)",
    bodySystem: "cardiovascular",
    tags: ["cardiac", "fluids-electrolytes", "pharmacology", "monitoring"],
    difficulty: "medium",
    country: "CA",
    questionCount: 4,
    category: "med-surg",
  },
  {
    topicSlug: "atrial-fibrillation",
    topicLabel: "Atrial Fibrillation and Rhythm Management",
    bodySystem: "cardiovascular",
    tags: ["cardiac", "ECG", "anticoagulation", "pharmacology"],
    difficulty: "medium",
    country: "US",
    questionCount: 4,
    category: "med-surg",
  },
  {
    topicSlug: "pneumonia",
    topicLabel: "Community-Acquired and Hospital-Acquired Pneumonia",
    bodySystem: "respiratory",
    tags: ["respiratory", "infection", "antibiotics", "oxygenation"],
    difficulty: "medium",
    country: "CA",
    questionCount: 4,
    category: "med-surg",
  },
  {
    topicSlug: "chronic-obstructive-pulmonary-disease",
    topicLabel: "Chronic Obstructive Pulmonary Disease (COPD) Exacerbation",
    bodySystem: "respiratory",
    tags: ["respiratory", "oxygen-therapy", "pharmacology", "monitoring"],
    difficulty: "medium",
    country: "CA",
    questionCount: 4,
    category: "med-surg",
  },
  {
    topicSlug: "asthma-acute-exacerbation",
    topicLabel: "Asthma: Acute Exacerbation and Status Asthmaticus",
    bodySystem: "respiratory",
    tags: ["respiratory", "emergency", "bronchodilators", "inhaler-therapy"],
    difficulty: "medium",
    country: "US",
    questionCount: 4,
    category: "med-surg",
  },
  {
    topicSlug: "chronic-kidney-disease",
    topicLabel: "Chronic Kidney Disease and Renal Replacement Therapy",
    bodySystem: "renal",
    tags: ["renal", "dialysis", "fluids-electrolytes", "pharmacology"],
    difficulty: "medium",
    country: "CA",
    questionCount: 4,
    category: "med-surg",
  },
  {
    topicSlug: "acute-pancreatitis",
    topicLabel: "Acute Pancreatitis",
    bodySystem: "gastrointestinal",
    tags: ["GI", "pain", "fluids", "nutrition"],
    difficulty: "medium",
    country: "US",
    questionCount: 4,
    category: "med-surg",
  },
  {
    topicSlug: "inflammatory-bowel-disease",
    topicLabel: "Inflammatory Bowel Disease: Crohn's and Ulcerative Colitis",
    bodySystem: "gastrointestinal",
    tags: ["GI", "chronic-illness", "pharmacology", "nutrition"],
    difficulty: "medium",
    country: "CA",
    questionCount: 4,
    category: "med-surg",
  },

  // Easy × 7
  {
    topicSlug: "fractures-and-orthopedic-care",
    topicLabel: "Fractures and Orthopedic Nursing Care",
    bodySystem: "musculoskeletal",
    tags: ["ortho", "safety", "pain", "mobility"],
    difficulty: "easy",
    country: "US",
    questionCount: 4,
    category: "med-surg",
  },
  {
    topicSlug: "hip-replacement-post-op",
    topicLabel: "Total Hip Replacement: Post-operative Nursing Care",
    bodySystem: "musculoskeletal",
    tags: ["ortho", "post-op", "safety", "mobility", "DVT-prevention"],
    difficulty: "easy",
    country: "CA",
    questionCount: 4,
    category: "med-surg",
  },
  {
    topicSlug: "wound-care-pressure-injuries",
    topicLabel: "Wound Care and Pressure Injury Prevention",
    bodySystem: "integumentary",
    tags: ["skin", "wound-care", "safety", "documentation"],
    difficulty: "easy",
    country: "CA",
    questionCount: 4,
    category: "med-surg",
  },
  {
    topicSlug: "urinary-tract-infection",
    topicLabel: "Urinary Tract Infection and Catheter-Associated UTI",
    bodySystem: "renal",
    tags: ["renal", "infection", "catheter-care", "antibiotics"],
    difficulty: "easy",
    country: "US",
    questionCount: 4,
    category: "med-surg",
  },
  {
    topicSlug: "appendicitis-and-peritonitis",
    topicLabel: "Appendicitis and Peritonitis",
    bodySystem: "gastrointestinal",
    tags: ["GI", "surgical", "emergency", "pre-op-post-op"],
    difficulty: "medium",
    country: "US",
    questionCount: 4,
    category: "med-surg",
  },
  {
    topicSlug: "burns-thermal-injury",
    topicLabel: "Burns: Thermal Injury Assessment and Care",
    bodySystem: "integumentary",
    tags: ["skin", "emergency", "fluids", "wound-care"],
    difficulty: "hard",
    country: "US",
    questionCount: 4,
    category: "med-surg",
  },
  {
    topicSlug: "sepsis-and-septic-shock",
    topicLabel: "Sepsis and Septic Shock (Sepsis-3 Bundle)",
    bodySystem: "immunological",
    tags: ["emergency", "infection", "shock", "antibiotics", "lactate"],
    difficulty: "hard",
    country: "CA",
    questionCount: 4,
    category: "med-surg",
  },

  // ── PHARMACOLOGY (10 topics) ──────────────────────────────────────────────

  {
    topicSlug: "anticoagulation-therapy",
    topicLabel: "Anticoagulation: Heparin, Warfarin, and DOACs",
    bodySystem: "hematological",
    tags: ["pharmacology", "bleeding-risk", "lab-monitoring", "safety", "anticoagulation", "thrombosis"],
    difficulty: "hard",
    country: "US",
    questionCount: 4,
    category: "pharmacology",
  },
  {
    topicSlug: "insulin-management",
    topicLabel: "Insulin Types, Administration, and Hypoglycemia Management",
    bodySystem: "endocrine",
    tags: ["pharmacology", "insulin", "blood-glucose", "safety"],
    difficulty: "medium",
    country: "CA",
    questionCount: 4,
    category: "pharmacology",
  },
  {
    topicSlug: "diuretic-therapy",
    topicLabel: "Diuretic Therapy: Loop, Thiazide, and Potassium-Sparing",
    bodySystem: "renal",
    tags: ["pharmacology", "fluids-electrolytes", "monitoring", "cardiac"],
    difficulty: "medium",
    country: "US",
    questionCount: 4,
    category: "pharmacology",
  },
  {
    topicSlug: "opioid-analgesics",
    topicLabel: "Opioid Analgesics: Pain Management and Monitoring",
    bodySystem: "neurological",
    tags: ["pharmacology", "pain", "safety", "respiratory-depression"],
    difficulty: "medium",
    country: "CA",
    questionCount: 4,
    category: "pharmacology",
  },
  {
    topicSlug: "antihypertensive-medications",
    topicLabel: "Antihypertensive Drug Classes and Nursing Considerations",
    bodySystem: "cardiovascular",
    tags: ["pharmacology", "cardiac", "safety", "monitoring"],
    difficulty: "easy",
    country: "US",
    questionCount: 4,
    category: "pharmacology",
  },
  {
    topicSlug: "antibiotic-selection-and-safety",
    topicLabel: "Antibiotic Selection, Safety, and Allergy Management",
    bodySystem: "immunological",
    tags: ["pharmacology", "infection", "allergy", "culture-sensitivity"],
    difficulty: "medium",
    country: "CA",
    questionCount: 4,
    category: "pharmacology",
  },
  {
    topicSlug: "corticosteroid-therapy",
    topicLabel: "Corticosteroid Therapy: Uses, Risks, and Nursing Care",
    bodySystem: "endocrine",
    tags: ["pharmacology", "immunosuppression", "side-effects", "safety"],
    difficulty: "medium",
    country: "US",
    questionCount: 4,
    category: "pharmacology",
  },
  {
    topicSlug: "digoxin-cardiac-glycosides",
    topicLabel: "Digoxin and Cardiac Glycosides: Safety and Toxicity",
    bodySystem: "cardiovascular",
    tags: ["pharmacology", "cardiac", "toxicity", "narrow-therapeutic-index"],
    difficulty: "hard",
    country: "CA",
    questionCount: 4,
    category: "pharmacology",
  },
  {
    topicSlug: "anticonvulsant-medications",
    topicLabel: "Anticonvulsant Medications and Seizure Management",
    bodySystem: "neurological",
    tags: ["pharmacology", "neuro", "safety", "therapeutic-monitoring"],
    difficulty: "medium",
    country: "US",
    questionCount: 4,
    category: "pharmacology",
  },
  {
    topicSlug: "antipsychotic-medications",
    topicLabel: "Antipsychotic Medications: Typical, Atypical, and EPS",
    bodySystem: "neurological",
    tags: ["pharmacology", "psych", "EPS", "metabolic-syndrome", "safety"],
    difficulty: "medium",
    country: "CA",
    questionCount: 4,
    category: "pharmacology",
  },

  // ── PRIORITIZATION (8 topics) ─────────────────────────────────────────────

  {
    topicSlug: "emergency-triage-principles",
    topicLabel: "Emergency Department Triage: START / CTAS Principles",
    bodySystem: "multi-system",
    tags: ["triage", "emergency", "priority-setting", "SATA"],
    difficulty: "hard",
    country: "US",
    questionCount: 4,
    category: "prioritization",
  },
  {
    topicSlug: "post-operative-complications",
    topicLabel: "Post-operative Complications: Recognition and Priority Response",
    bodySystem: "multi-system",
    tags: ["post-op", "priority-setting", "complications", "safety"],
    difficulty: "hard",
    country: "CA",
    questionCount: 4,
    category: "prioritization",
  },
  {
    topicSlug: "deteriorating-patient-rapid-response",
    topicLabel: "Identifying the Deteriorating Patient and Rapid Response",
    bodySystem: "multi-system",
    tags: ["emergency", "RRT", "early-warning", "priority-setting"],
    difficulty: "hard",
    country: "US",
    questionCount: 4,
    category: "prioritization",
  },
  {
    topicSlug: "multiple-patient-assignment",
    topicLabel: "Multiple Patient Assignment: Prioritization and Workload",
    bodySystem: "multi-system",
    tags: ["priority-setting", "delegation", "time-management", "safety"],
    difficulty: "hard",
    country: "CA",
    questionCount: 4,
    category: "prioritization",
  },
  {
    topicSlug: "airway-management-priority",
    topicLabel: "Airway Management and Priority Interventions",
    bodySystem: "respiratory",
    tags: ["emergency", "airway", "priority-setting", "oxygenation"],
    difficulty: "hard",
    country: "US",
    questionCount: 4,
    category: "prioritization",
  },
  {
    topicSlug: "shock-recognition-and-response",
    topicLabel: "Shock: Recognition, Types, and Priority Response",
    bodySystem: "cardiovascular",
    tags: ["emergency", "shock", "priority-setting", "hemodynamics"],
    difficulty: "hard",
    country: "US",
    questionCount: 4,
    category: "prioritization",
  },
  {
    topicSlug: "fluid-and-electrolyte-imbalances",
    topicLabel: "Fluid and Electrolyte Imbalances: Assessment and Intervention",
    bodySystem: "renal",
    tags: ["fluids-electrolytes", "monitoring", "pharmacology", "labs"],
    difficulty: "medium",
    country: "CA",
    questionCount: 4,
    category: "prioritization",
  },
  {
    topicSlug: "pain-assessment-and-management",
    topicLabel: "Pain Assessment, Scales, and Nursing Management",
    bodySystem: "neurological",
    tags: ["pain", "assessment", "pharmacology", "non-pharmacological"],
    difficulty: "easy",
    country: "US",
    questionCount: 4,
    category: "prioritization",
  },

  // ── SAFETY (4 topics) ─────────────────────────────────────────────────────

  {
    topicSlug: "fall-prevention-and-safety",
    topicLabel: "Fall Prevention: Risk Assessment and Safety Interventions",
    bodySystem: "multi-system",
    tags: ["safety", "fall-risk", "environment", "patient-education"],
    difficulty: "easy",
    country: "CA",
    questionCount: 4,
    category: "safety",
  },
  {
    topicSlug: "medication-administration-safety",
    topicLabel: "Medication Administration Safety: Rights, Errors, and Reporting",
    bodySystem: "multi-system",
    tags: ["safety", "medication-errors", "rights-of-medication", "reporting"],
    difficulty: "easy",
    country: "US",
    questionCount: 4,
    category: "safety",
  },
  {
    topicSlug: "infection-control-and-precautions",
    topicLabel: "Infection Control: Standard and Transmission-Based Precautions",
    bodySystem: "immunological",
    tags: ["infection-control", "PPE", "hand-hygiene", "isolation"],
    difficulty: "easy",
    country: "CA",
    questionCount: 4,
    category: "safety",
  },
  {
    topicSlug: "surgical-site-infection-prevention",
    topicLabel: "Surgical Site Infection Prevention and Wound Assessment",
    bodySystem: "integumentary",
    tags: ["surgical", "infection-control", "wound-care", "safety"],
    difficulty: "medium",
    country: "US",
    questionCount: 4,
    category: "safety",
  },

  // ── DELEGATION (3 topics) ─────────────────────────────────────────────────

  {
    topicSlug: "delegation-to-uap",
    topicLabel: "Delegation to Unlicensed Assistive Personnel (UAP/PSW)",
    bodySystem: "multi-system",
    tags: ["delegation", "scope-of-practice", "safety", "supervision"],
    difficulty: "medium",
    country: "US",
    questionCount: 4,
    category: "delegation",
  },
  {
    topicSlug: "lpn-rpn-scope-of-practice",
    topicLabel: "LPN/RPN Scope of Practice and RN Collaboration",
    bodySystem: "multi-system",
    tags: ["delegation", "scope-of-practice", "collaboration", "safety"],
    difficulty: "medium",
    country: "CA",
    questionCount: 4,
    category: "delegation",
  },
  {
    topicSlug: "interprofessional-collaboration-sbar",
    topicLabel: "Interprofessional Collaboration and SBAR Communication",
    bodySystem: "multi-system",
    tags: ["delegation", "communication", "SBAR", "teamwork", "safety"],
    difficulty: "medium",
    country: "CA",
    questionCount: 4,
    category: "delegation",
  },
];

// ---------------------------------------------------------------------------
// Validate topic count and difficulty distribution
// ---------------------------------------------------------------------------
function validateTopics() {
  const easy = TOPICS.filter((t) => t.difficulty === "easy");
  const medium = TOPICS.filter((t) => t.difficulty === "medium");
  const hard = TOPICS.filter((t) => t.difficulty === "hard");
  const us = TOPICS.filter((t) => t.country === "US");
  const ca = TOPICS.filter((t) => t.country === "CA");
  const totalQ = TOPICS.reduce((acc, t) => acc + t.questionCount, 0);

  console.log("\n📋 Topic manifest:");
  console.log(`   Total topics   : ${TOPICS.length}`);
  console.log(`   Total questions: ${totalQ}`);
  console.log(`   Country split  : US=${us.length} CA=${ca.length}`);
  console.log(`   Difficulty     : easy=${easy.length} medium=${medium.length} hard=${hard.length}`);
  console.log(`   Questions      : easy=${easy.reduce((a, t) => a + t.questionCount, 0)} medium=${medium.reduce((a, t) => a + t.questionCount, 0)} hard=${hard.reduce((a, t) => a + t.questionCount, 0)}`);

  const byCategory = ["med-surg", "pharmacology", "prioritization", "safety", "delegation"] as const;
  for (const cat of byCategory) {
    const ct = TOPICS.filter((t) => t.category === cat);
    console.log(`   ${cat.padEnd(16)}: ${ct.length} topics`);
  }
}

// ---------------------------------------------------------------------------
// OpenAI client (standalone — no server-only import chain)
// ---------------------------------------------------------------------------

type ChatMessage = { role: "system" | "user" | "assistant"; content: string };

async function openAiChat(messages: ChatMessage[], maxTokens: number): Promise<string> {
  const key = process.env.AI_INTEGRATIONS_OPENAI_API_KEY?.trim();
  if (!key) throw new Error("AI_INTEGRATIONS_OPENAI_API_KEY is not set");

  const model =
    process.env.AI_OPENAI_MODEL?.trim() ||
    process.env.AI_ADMIN_MODEL?.trim() ||
    "gpt-4o-mini";

  const baseUrl =
    process.env.AI_INTEGRATIONS_OPENAI_BASE_URL?.trim() || "https://api.openai.com/v1";

  const res = await fetch(`${baseUrl}/chat/completions`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      messages,
      temperature: 0.35,
      max_tokens: maxTokens,
    }),
  });

  if (!res.ok) {
    const err = await res.text().catch(() => res.statusText);
    throw new Error(`OpenAI API error ${res.status}: ${err}`);
  }

  const json = (await res.json()) as {
    choices?: Array<{ message?: { content?: string } }>;
    error?: { message: string };
  };

  if (json.error) throw new Error(`OpenAI: ${json.error.message}`);
  const content = json.choices?.[0]?.message?.content;
  if (!content) throw new Error("OpenAI returned empty content");
  return content;
}

function extractJson(raw: string): unknown {
  const fenceMatch = raw.match(/```(?:json)?\s*([\s\S]*?)```/);
  const cleaned = fenceMatch ? fenceMatch[1]! : raw;
  const start = cleaned.indexOf("{");
  const end = cleaned.lastIndexOf("}");
  if (start === -1 || end === -1) throw new Error("No JSON object in AI response");
  return JSON.parse(cleaned.slice(start, end + 1));
}

// ---------------------------------------------------------------------------
// Hash utilities (mirrors pipeline-hashes.ts exactly)
// ---------------------------------------------------------------------------

function stemHash(stem: string): string {
  const s = stem.replace(/\s+/g, " ").trim().toLowerCase();
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (Math.imul(31, h) + s.charCodeAt(i)) | 0;
  return `s${(h >>> 0).toString(16)}`;
}

function topicSlugToLessonSlug(slug: string): string {
  return slug
    .toLowerCase()
    .replace(/_/g, "-")
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");
}

function difficultyToInt(d: PipelineDifficulty): number {
  return d === "easy" ? 2 : d === "medium" ? 3 : 4;
}

function examToTier(country: PipelineCountry): string {
  return "RN";
}

function examCode(country: PipelineCountry): string {
  return country === "CA" ? "NCLEX-RN-CA" : "NCLEX-RN";
}

// ---------------------------------------------------------------------------
// Lesson generator
// ---------------------------------------------------------------------------

const LESSON_SYSTEM = `You are a senior nursing education content writer producing structured lessons for a nursing exam prep platform.

Rules:
- Output JSON ONLY — no prose, no markdown fences, no commentary.
- Every lesson MUST have exactly five sections in this order:
  1. overview        — what this condition is, epidemiology, quick clinical facts
  2. pathophysiology — mechanism of disease, cellular/organ-level changes
  3. assessment      — focused nursing assessment, priority signs/symptoms, lab/diagnostic cues  
  4. interventions   — SBAR-aligned nursing actions, delegation notes, priority order
  5. exam_tips       — NCLEX/exam strategy cues, common distractors, memory hooks, SATA traps
- Each section body must be substantive (≥ 120 words, 800–1200 words total lesson).
- HTML only: <p>, <ul>, <li>, <strong>, <em>. No script tags.
- seoTitle: 10–70 chars. seoDescription: 50–160 chars.
- internalLinkHints: 2–5 related lesson paths.`.trim();

async function generateLesson(topic: TopicSpec, pathwayId: string): Promise<Record<string, unknown>> {
  const countryNote =
    topic.country === "CA"
      ? "Canadian context: metric units (mmol/L glucose, metric vitals), Canadian drug brand names, provincial health system."
      : "US context: mg/dL glucose, lb noted where relevant, US drug names.";

  const diffNote =
    topic.difficulty === "easy"
      ? "introductory — foundational nursing knowledge assumed"
      : topic.difficulty === "medium"
        ? "intermediate — clinical reasoning and prioritization expected"
        : "advanced — complex clinical judgment, multi-system, high-stakes scenarios";

  const userPrompt = `Generate a structured nursing lesson JSON for:

TOPIC: ${topic.topicLabel}
SLUG: ${topic.topicSlug}
BODY SYSTEM: ${topic.bodySystem}
TAGS: ${topic.tags.join(", ")}
DIFFICULTY: ${topic.difficulty} (${diffNote})
EXAM: NCLEX-RN
COUNTRY: ${topic.country}
CONTEXT: ${countryNote}

OUTPUT JSON SCHEMA:
{
  "title": "string (8–200 chars)",
  "seoTitle": "string (10–70 chars)",
  "seoDescription": "string (50–160 chars)",
  "sections": [
    { "kind": "overview",        "heading": "string", "body": "<p>HTML ≥120 words</p>" },
    { "kind": "pathophysiology", "heading": "string", "body": "<p>HTML ≥120 words</p>" },
    { "kind": "assessment",      "heading": "string", "body": "<p>HTML ≥120 words</p>" },
    { "kind": "interventions",   "heading": "string", "body": "<p>HTML ≥120 words</p>" },
    { "kind": "exam_tips",       "heading": "string", "body": "<p>HTML ≥120 words</p>" }
  ],
  "internalLinkHints": [
    { "label": "string", "suggestedPath": "/app/lessons/slug", "rationale": "string" }
  ]
}`;

  const raw = await openAiChat(
    [
      { role: "system", content: LESSON_SYSTEM },
      { role: "user", content: userPrompt },
    ],
    13_000,
  );

  const parsed = extractJson(raw) as {
    title: string;
    seoTitle: string;
    seoDescription: string;
    sections: Array<{ kind: string; heading: string; body: string }>;
    internalLinkHints: Array<{ label: string; suggestedPath: string; rationale: string }>;
  };

  const slug = topicSlugToLessonSlug(topic.topicSlug);

  return {
    pathwayId,
    slug,
    title: parsed.title,
    topic: topic.topicLabel,
    topicSlug: topic.topicSlug,
    bodySystem: topic.bodySystem,
    locale: "en",
    seoTitle: parsed.seoTitle,
    seoDescription: parsed.seoDescription,
    sections: parsed.sections.map((s) => ({
      id: `section-${s.kind.replace(/_/g, "-")}`,
      heading: s.heading,
      kind: s.kind,
      body: s.body,
    })),
    status: "DRAFT",
    sortOrder: 0,
    previewSectionCount: 1,
    tierCode: "RN",
    countryCode: topic.country,
    _meta: {
      difficulty: topic.difficulty,
      tags: topic.tags,
      category: topic.category,
      internalLinkHints: parsed.internalLinkHints ?? [],
    },
  };
}

// ---------------------------------------------------------------------------
// Question generator
// ---------------------------------------------------------------------------

const QUESTION_SYSTEM = `You are a senior nursing certification item writer producing exam questions.

Rules:
- Output JSON ONLY — no prose, no markdown fences, no commentary.
- MCQ: EXACTLY 4 options. SATA: EXACTLY 5 options.
- rationale: step-by-step (≥ 90 words) — why correct answer is right, the underlying principle, patient safety relevance.
- distractorRationales: per wrong option — why a student picks it, why it is incorrect.
- clinicalPearl: memorable one-sentence clinical fact (or null).
- keyTakeaway: one-sentence exam point (or null).
- examStrategy: test-taking tip (or null).
- cognitiveLevel: "remember" | "understand" | "apply" | "analyze" (Bloom's taxonomy).
- SATA: 2–4 correct answers. Never all 5 correct.
- No invented drug doses outside accepted textbook ranges. No PHI.`.trim();

async function generateQuestions(topic: TopicSpec): Promise<Record<string, unknown>[]> {
  const countryNote =
    topic.country === "CA"
      ? "Canadian context: metric (mmol/L, kPa), Canadian drug names, CTAS triage system where relevant."
      : "US context: mg/dL glucose, lb noted in stems, US drug names, START triage.";

  const diffNote =
    topic.difficulty === "easy"
      ? "FOUNDATION — recall/comprehension; safe basic nursing actions"
      : topic.difficulty === "medium"
        ? "INTERMEDIATE — application/situational judgment; prioritization cues"
        : "ADVANCED — analysis/synthesis; complex scenarios, SATA encouraged";

  const examHint =
    topic.difficulty === "hard"
      ? "Include at least 1 SATA question. Use complex patient scenarios with multiple competing priorities."
      : topic.difficulty === "medium"
        ? "Mix MCQ and SATA. Include at least 1 prioritization or delegation scenario."
        : "MCQ preferred. Focus on assessment, safety, and basic interventions.";

  const userPrompt = `Generate ${topic.questionCount} nursing exam question(s) for:

TOPIC: ${topic.topicLabel}
SLUG: ${topic.topicSlug}
BODY SYSTEM: ${topic.bodySystem}
TAGS: ${topic.tags.join(", ")}
DIFFICULTY: ${topic.difficulty.toUpperCase()} — ${diffNote}
EXAM: NCLEX-RN
COUNTRY: ${topic.country}
CONTEXT: ${countryNote}
ITEM STYLE: ${examHint}

OUTPUT JSON SCHEMA:
{
  "questions": [
    {
      "stem": "string (30–1200 chars)",
      "questionType": "MCQ" | "SATA",
      "options": ["string" × 4 or 5],
      "correctAnswer": "string" | ["string", ...],
      "rationale": "string (≥90 words step-by-step)",
      "distractorRationales": { "option text": "explanation why wrong" },
      "clinicalPearl": "string | null",
      "keyTakeaway": "string | null",
      "examStrategy": "string | null",
      "cognitiveLevel": "remember" | "understand" | "apply" | "analyze"
    }
  ]
}`;

  const raw = await openAiChat(
    [
      { role: "system", content: QUESTION_SYSTEM },
      { role: "user", content: userPrompt },
    ],
    10_000,
  );

  const parsed = extractJson(raw) as {
    questions: Array<{
      stem: string;
      questionType: string;
      options: string[];
      correctAnswer: string | string[];
      rationale: string;
      distractorRationales: Record<string, string>;
      clinicalPearl: string | null;
      keyTakeaway: string | null;
      examStrategy: string | null;
      cognitiveLevel: string;
    }>;
  };

  return parsed.questions.map((q) => ({
    tier: "RN",
    exam: examCode(topic.country),
    questionType: q.questionType,
    status: "draft",
    stem: q.stem,
    options: q.options,
    correctAnswer: q.correctAnswer,
    rationale: q.rationale,
    distractorRationales: q.distractorRationales ?? {},
    clinicalPearl: q.clinicalPearl ?? null,
    keyTakeaway: q.keyTakeaway ?? null,
    examStrategy: q.examStrategy ?? null,
    cognitiveLevel: q.cognitiveLevel,
    difficulty: difficultyToInt(topic.difficulty),
    tags: topic.tags,
    bodySystem: topic.bodySystem,
    topic: topic.topicLabel,
    topicSlug: topic.topicSlug,
    countryCode: topic.country,
    regionScope: topic.country === "US" ? "US" : topic.country === "CA" ? "CA" : "BOTH",
    stemHash: stemHash(q.stem),
    careerType: "nursing",
    isAdaptiveEligible: true,
    isMockExamEligible: true,
    languageCode: "en",
    sourceVersion: 1,
  }));
}

// ---------------------------------------------------------------------------
// Concurrency limiter
// ---------------------------------------------------------------------------

async function runWithConcurrency<T>(
  tasks: Array<() => Promise<T>>,
  concurrency: number,
): Promise<PromiseSettledResult<T>[]> {
  const results: PromiseSettledResult<T>[] = new Array(tasks.length);
  let idx = 0;

  async function worker() {
    while (idx < tasks.length) {
      const i = idx++;
      try {
        results[i] = { status: "fulfilled", value: await tasks[i]!() };
      } catch (e) {
        results[i] = { status: "rejected", reason: e };
      }
    }
  }

  await Promise.all(Array.from({ length: Math.min(concurrency, tasks.length) }, () => worker()));
  return results;
}

// ---------------------------------------------------------------------------
// Checkpoint helpers
// ---------------------------------------------------------------------------

type Checkpoint = {
  lessons: Record<string, unknown>[];
  questions: Record<string, unknown>[];
  completedTopicSlugs: string[];
  errors: Array<{ topicSlug: string; type: string; error: string }>;
};

async function loadCheckpoint(outFile: string): Promise<Checkpoint | null> {
  try {
    const content = await fs.readFile(outFile, "utf8");
    return JSON.parse(content) as Checkpoint;
  } catch {
    return null;
  }
}

async function saveCheckpoint(outFile: string, state: Checkpoint): Promise<void> {
  await fs.mkdir(path.dirname(outFile), { recursive: true });
  await fs.writeFile(outFile, JSON.stringify(state, null, 2), "utf8");
}

// ---------------------------------------------------------------------------
// CLI argument parsing
// ---------------------------------------------------------------------------

function parseArgs() {
  const args = process.argv.slice(2);
  const get = (flag: string) =>
    args.find((a) => a.startsWith(`--${flag}=`))?.split("=").slice(1).join("=");

  return {
    dryRun: args.includes("--dry-run"),
    from: parseInt(get("from") ?? "0", 10),
    to: parseInt(get("to") ?? "49", 10),
    questionsOnly: args.includes("--questions-only"),
    lessonsOnly: args.includes("--lessons-only"),
    output: get("output") ?? path.resolve(__dirname, "../output/rn-content-batch.json"),
    concurrency: parseInt(get("concurrency") ?? "3", 10),
  };
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  const opts = parseArgs();

  console.log("\n🏥 NurseNest RN Content Batch Generator");
  console.log("=========================================");
  validateTopics();

  if (opts.dryRun) {
    console.log("\n✅ Dry run complete — no API calls made.");
    console.log("\nTopic list:");
    TOPICS.forEach((t, i) =>
      console.log(`  ${String(i + 1).padStart(2)}. [${t.difficulty.padEnd(6)}] [${t.country}] ${t.topicSlug}`),
    );
    return;
  }

  const selectedTopics = TOPICS.slice(opts.from, opts.to + 1);
  console.log(`\n⚙️  Generating topics ${opts.from}–${opts.to} (${selectedTopics.length} topics)`);
  console.log(`   Output file : ${opts.output}`);
  console.log(`   Concurrency : ${opts.concurrency}`);

  // Load checkpoint
  let state: Checkpoint = await loadCheckpoint(opts.output) ?? {
    lessons: [],
    questions: [],
    completedTopicSlugs: [],
    errors: [],
  };

  const skippedTopics = new Set<string>(state.completedTopicSlugs);
  const seenStemHashes = new Set<string>(
    state.questions.map((q) => (q as { stemHash: string }).stemHash),
  );

  console.log(
    `   Checkpoint  : ${skippedTopics.size} topics already done, resuming…\n`,
  );

  const todo = selectedTopics.filter((t) => !skippedTopics.has(t.topicSlug));
  let completed = 0;

  const tasks = todo.map((topic) => async () => {
    const topicStart = Date.now();
    console.log(`  [${String(completed + 1).padStart(2)}/${todo.length}] ${topic.topicSlug} (${topic.difficulty} | ${topic.country})`);

    const pathwayId = topic.country === "CA" ? "rn-ca" : "rn-us";

    // Lesson
    if (!opts.questionsOnly) {
      try {
        const lesson = await generateLesson(topic, pathwayId);
        state.lessons.push(lesson);
      } catch (e) {
        const msg = e instanceof Error ? e.message : String(e);
        console.error(`    ❌ lesson error: ${msg}`);
        state.errors.push({ topicSlug: topic.topicSlug, type: "lesson", error: msg });
      }
    }

    // Questions
    if (!opts.lessonsOnly) {
      try {
        const questions = await generateQuestions(topic);
        let deduped = 0;
        for (const q of questions) {
          const sh = (q as { stemHash: string }).stemHash;
          if (!seenStemHashes.has(sh)) {
            state.questions.push(q);
            seenStemHashes.add(sh);
          } else {
            deduped++;
          }
        }
        if (deduped > 0) console.log(`    ⚠️  ${deduped} duplicate stem(s) skipped`);
      } catch (e) {
        const msg = e instanceof Error ? e.message : String(e);
        console.error(`    ❌ question error: ${msg}`);
        state.errors.push({ topicSlug: topic.topicSlug, type: "question", error: msg });
      }
    }

    state.completedTopicSlugs.push(topic.topicSlug);
    await saveCheckpoint(opts.output, state);

    completed++;
    const elapsed = ((Date.now() - topicStart) / 1000).toFixed(1);
    console.log(`    ✅ done in ${elapsed}s — lessons: ${state.lessons.length}, questions: ${state.questions.length}`);
  });

  await runWithConcurrency(tasks, opts.concurrency);

  // Final output
  const final = {
    lessons: state.lessons,
    questions: state.questions,
  };

  await saveCheckpoint(opts.output, {
    ...state,
    ...final,
  });

  // Also write the clean format the user requested
  const cleanOutputPath = opts.output.replace(".json", "-clean.json");
  await fs.writeFile(cleanOutputPath, JSON.stringify(final, null, 2), "utf8");

  console.log("\n📦 Generation complete!");
  console.log(`   Lessons   : ${final.lessons.length} / ${selectedTopics.length}`);
  console.log(`   Questions : ${final.questions.length}`);
  console.log(`   Errors    : ${state.errors.length}`);
  console.log(`   Output    : ${opts.output}`);
  console.log(`   Clean     : ${cleanOutputPath}`);

  if (state.errors.length > 0) {
    console.log("\n❌ Errors:");
    state.errors.forEach((e) => console.log(`   - [${e.type}] ${e.topicSlug}: ${e.error}`));
  }

  // Difficulty distribution report
  const easyQ = final.questions.filter((q) => (q as { difficulty: number }).difficulty === 2).length;
  const medQ = final.questions.filter((q) => (q as { difficulty: number }).difficulty === 3).length;
  const hardQ = final.questions.filter((q) => (q as { difficulty: number }).difficulty === 4).length;
  const total = final.questions.length || 1;

  console.log("\n📊 Question difficulty distribution:");
  console.log(`   Easy   : ${easyQ}  (${Math.round((easyQ / total) * 100)}%) — target 20%`);
  console.log(`   Medium : ${medQ}  (${Math.round((medQ / total) * 100)}%) — target 40%`);
  console.log(`   Hard   : ${hardQ}  (${Math.round((hardQ / total) * 100)}%) — target 40%`);

  const mcq = final.questions.filter((q) => (q as { questionType: string }).questionType === "MCQ").length;
  const sata = final.questions.filter((q) => (q as { questionType: string }).questionType === "SATA").length;
  console.log(`\n📊 Question type distribution:`);
  console.log(`   MCQ  : ${mcq}  (${Math.round((mcq / total) * 100)}%)`);
  console.log(`   SATA : ${sata}  (${Math.round((sata / total) * 100)}%)`);
}

main().catch((e) => {
  console.error("\n💥 Fatal error:", e);
  process.exit(1);
});
