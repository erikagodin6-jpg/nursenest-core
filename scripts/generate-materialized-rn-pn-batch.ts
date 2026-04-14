#!/usr/bin/env npx tsx
/**
 * @deprecated **Do not use for production banks.** This script intentionally caps output at
 * **10 topics × (7 RN + 5 PN) = 120 questions** (`takeRn = slice(0,7)`, `takePn = slice(0,5)` per topic).
 * The Replit export holds **thousands** of valid items; use {@link ../generate-rn-pn-sprint2-batch.ts} instead.
 *
 * One-off content generator: reads Replit `exam_questions.json`, writes materialized batch files under
 * `data/materialized/rn-pn-replit-batch-2026/` (questions + flashcards + catalog lesson payloads).
 *
 *   npx tsx scripts/generate-materialized-rn-pn-batch.ts
 */
import fs from "node:fs";
import path from "node:path";
import { stemHash } from "@/lib/content/stem-hash";

const REPLIT = path.join(process.cwd(), "data/replit-exports/exam_questions.json");
const OUT_DIR = path.join(process.cwd(), "data/materialized/rn-pn-replit-batch-2026");

const MIXED_TAG = "mixed-practice-2026-rn-pn";

type RawQ = Record<string, unknown> & {
  id: string;
  stem: string;
  tier: string;
  exam: string;
  options: unknown;
  correct_answer?: unknown;
  rationale?: string;
  difficulty?: number;
  body_system?: string;
  topic?: string | null;
  status?: string;
};

function optArray(o: unknown): string[] | null {
  if (!o) return null;
  if (Array.isArray(o)) {
    const s = o.filter((x): x is string => typeof x === "string" && x.trim().length > 0);
    return s.length >= 2 ? s : null;
  }
  if (typeof o === "object") {
    const vals = Object.values(o as Record<string, unknown>).filter((x): x is string => typeof x === "string");
    return vals.length >= 2 ? vals : null;
  }
  return null;
}

function correctIdx(raw: RawQ, options: string[]): number | null {
  const ca = raw.correct_answer ?? raw.correctAnswer;
  if (Array.isArray(ca) && ca.length && typeof ca[0] === "number") {
    const i = ca[0] as number;
    if (i >= 0 && i < options.length) return i;
  }
  if (typeof ca === "number" && Number.isInteger(ca) && ca >= 0 && ca < options.length) return ca;
  return null;
}

function correctTexts(raw: RawQ, options: string[]): string[] | null {
  const ca = raw.correct_answer ?? raw.correctAnswer;
  if (Array.isArray(ca) && ca.length && typeof ca[0] === "number") {
    const texts: string[] = [];
    for (const x of ca as number[]) {
      if (typeof x !== "number" || x < 0 || x >= options.length) return null;
      texts.push(options[x]!);
    }
    return texts;
  }
  return null;
}

const TOPICS = [
  {
    key: "heart-failure",
    label: "Heart failure",
    topicSlug: "heart-failure",
    bodySystem: "Cardiovascular",
    test: /\bheart failure\b|CHF|HFrEF|HFpEF|volume overload.*heart/i,
  },
  {
    key: "myocardial-infarction",
    label: "Myocardial infarction",
    topicSlug: "acute-coronary",
    bodySystem: "Cardiovascular",
    test: /\bmyocardial infarction\b|\bSTEMI\b|\bNSTEMI\b|\bMI\b|acute coronary|heart attack/i,
  },
  {
    key: "shock",
    label: "Shock",
    topicSlug: "shock",
    bodySystem: "Cardiovascular",
    test: /\bshock\b|hypovolemic|cardiogenic|distributive|septic shock/i,
  },
  {
    key: "abg-interpretation",
    label: "ABG interpretation",
    topicSlug: "abg",
    bodySystem: "Respiratory",
    test: /\bABG\b|arterial blood gas|PaCO2|PaO2|HCO3|respiratory acidosis|metabolic acidosis/i,
  },
  {
    key: "copd-respiratory",
    label: "COPD & respiratory basics",
    topicSlug: "copd",
    bodySystem: "Respiratory",
    test: /\bCOPD\b|emphysema|chronic bronchitis/i,
  },
  {
    key: "insulin-hypoglycemia",
    label: "Insulin & hypoglycemia",
    topicSlug: "diabetes-meds",
    bodySystem: "Endocrine",
    test: /\binsulin\b|hypoglycemia|hyperglycemia|\bDKA\b/i,
  },
  {
    key: "sepsis",
    label: "Sepsis",
    topicSlug: "sepsis",
    bodySystem: "Immune",
    test: /\bsepsis\b|SIRS|qSOFA/i,
  },
  {
    key: "infection-control",
    label: "Infection control",
    topicSlug: "infection-control",
    bodySystem: "Infection control",
    test: /\binfection control\b|PPE|hand hygiene|Contact precautions|Droplet|Airborne|C\.diff|C diff/i,
  },
  {
    key: "fluid-balance",
    label: "Fluid deficit vs excess",
    topicSlug: "fluids-electrolytes",
    bodySystem: "Renal",
    test: /\bfluid (volume )?(deficit|overload|excess)\b|dehydration|hypervolemia|hypovolemia|\bFVE\b|\bFVD\b/i,
  },
  {
    key: "prioritization-abcs",
    label: "Prioritization, ABCs & safety",
    topicSlug: "prioritization",
    bodySystem: "General",
    test: /\bprioritiz|ABCs\b|Airway.*Breathing|Maslow|first action|see first|most urgent/i,
  },
] as const;

function matchesTopic(row: RawQ, re: RegExp): boolean {
  const opts = optArray(row.options) ?? [];
  const blob = [row.stem, ...opts, row.rationale, row.topic, row.body_system].filter(Boolean).join(" ");
  return re.test(blob);
}

function isRnTier(t: string) {
  return t.toLowerCase() === "rn";
}
function isPnTier(t: string) {
  const x = t.toLowerCase();
  return x === "rpn" || x === "lvn" || x === "lpn";
}

function toQuiz(row: RawQ, options: string[]): { question: string; options: string[]; correct: number; rationale?: string } {
  const ci = correctIdx(row, options);
  if (ci === null) throw new Error("bad correct");
  return {
    question: row.stem,
    options,
    correct: ci,
    rationale: typeof row.rationale === "string" ? row.rationale : undefined,
  };
}

function main() {
  const rawList = JSON.parse(fs.readFileSync(REPLIT, "utf8")) as RawQ[];
  const used = new Set<string>();
  const questionsOut: Record<string, unknown>[] = [];
  const sourceMap: Record<string, string[]> = {};
  const catalogRn: Record<string, unknown>[] = [];
  const catalogPn: Record<string, unknown>[] = [];

  for (const spec of TOPICS) {
    const pool = rawList.filter(
      (r) =>
        r.status === "published" &&
        matchesTopic(r, spec.test) &&
        optArray(r.options) &&
        correctTexts(r, optArray(r.options)!) &&
        !used.has(r.id),
    );
    const rnPool = pool.filter((r) => isRnTier(String(r.tier))).sort((a, b) => a.id.localeCompare(b.id));
    const pnPool = pool.filter((r) => isPnTier(String(r.tier))).sort((a, b) => a.id.localeCompare(b.id));
    const takeRn = rnPool.slice(0, 7);
    const takePn = pnPool.slice(0, 5);
    const combined = [...takeRn, ...takePn];
    sourceMap[spec.key] = combined.map((r) => r.id);

    let qIdx = 0;
    for (const row of combined) {
      used.add(row.id);
      const options = optArray(row.options)!;
      const ca = correctTexts(row, options)!;
      const tierLower = String(row.tier).toLowerCase();
      const isPn = isPnTier(tierLower);
      const exam = isPn ? "NCLEX-PN" : "NCLEX-RN";
      const tierDb = isPn ? "lvn" : "rn";
      const countryCode = "US";
      const regionScope = "US_ONLY";
      const id = `mat20260330_${spec.key}_${String(qIdx).padStart(2, "0")}_${tierDb}`;
      qIdx += 1;
      const tags = Array.from(
        new Set([
          MIXED_TAG,
          `topic:${spec.key}`,
          "source:replit-exam_questions.json",
          "batch:rn-pn-2026-03",
          isPn ? "overlay:pn-scope" : "overlay:rn-prioritization",
          typeof row.difficulty === "number" ? `difficulty:${row.difficulty}` : "difficulty:3",
          "priority:high",
        ]),
      );
      questionsOut.push({
        id,
        stem: row.stem,
        options,
        correctAnswer: ca,
        questionType: "multiple_choice",
        tier: tierDb,
        exam,
        status: "published",
        regionScope,
        countryCode,
        careerType: "nursing",
        rationale: row.rationale ?? "",
        topic: spec.label,
        bodySystem: spec.bodySystem,
        tags,
        difficulty: typeof row.difficulty === "number" ? row.difficulty : 3,
        stemHash: stemHash(row.stem),
      });
    }

    const preRaw = combined.slice(0, 4);
    const postRaw = combined.slice(4, 11);
    const preTest = preRaw.map((r) => toQuiz(r, optArray(r.options)!));
    const postTest = postRaw.map((r) => toQuiz(r, optArray(r.options)!));

    const fiveSections = [
      {
        id: "clinical_meaning",
        heading: "Clinical meaning",
        kind: "clinical_meaning",
        body: `**${spec.label}** shows up as “what to assess first,” which complication is emerging, and which order or teaching is unsafe. Link subjective symptoms to objective data before you pick an intervention.`,
      },
      {
        id: "exam_relevance",
        heading: "Exam relevance",
        kind: "exam_relevance",
        body: `Items reward **prioritization** and **safety**: unstable findings beat convenience tasks; scope-appropriate actions beat “doing everything alone.” Watch for distractors that skip assessment or delay escalation.`,
      },
      {
        id: "core_concept",
        heading: "Core concept",
        kind: "core_concept",
        body: `Anchor management to the pathophys pattern the stem implies (perfusion, gas exchange, infection burden, glucose–insulin balance, or fluid shift)—then match monitoring and teaching to that pattern.`,
      },
      {
        id: "clinical_scenario",
        heading: "Clinical scenario",
        kind: "clinical_scenario",
        body: `You are prioritizing among routine tasks when one patient shows a **change that can worsen quickly**. Your first move is assessment or escalation that protects airway, breathing, circulation, or infection risk—then documentation and delegation per policy.`,
      },
      {
        id: "takeaways",
        heading: "Takeaways",
        kind: "takeaways",
        body: `- Pair vitals, labs, and breath sounds with the client story.\n- Unsafe answers often **skip reassessment** after a change or **delegate** what must stay with the RN when unstable.\n- **Replit bank note:** questions tagged \`topic:${spec.key}\` in this batch mirror stems from imported Replit exports for drill and mixed practice.`,
      },
    ];

    catalogRn.push({
      slug: `us-rn-${spec.key}`,
      title: `${spec.label} (NCLEX-RN, US)`,
      topic: spec.label,
      topicSlug: spec.topicSlug,
      bodySystem: spec.bodySystem,
      previewSectionCount: 1,
      seoTitle: `${spec.label} | NCLEX-RN US | NurseNest`,
      seoDescription: `US RN prep: ${spec.label.toLowerCase()} prioritization, monitoring, and safety from Replit-sourced bank items.`,
      sections: fiveSections,
      preTest,
      postTest,
    });

    const pnScenario =
      spec.key === "prioritization-abcs"
        ? `PN items emphasize **stable** clients, **task-level** delegation, and **prompt RN report** when findings exceed PN scope or orders are unclear.`
        : `PN focus: perform authorized skills with clear orders, **observe and report** early change, and avoid independent actions that require RN judgment when the stem implies instability.`;

    catalogPn.push({
      slug: `us-pn-${spec.key}`,
      title: `${spec.label} — PN scope lens (NCLEX-PN, US)`,
      topic: spec.label,
      topicSlug: spec.topicSlug,
      bodySystem: spec.bodySystem,
      previewSectionCount: 1,
      seoTitle: `${spec.label} PN scope | NCLEX-PN US | NurseNest`,
      seoDescription: `US PN prep overlay for ${spec.label.toLowerCase()}: scope-safe sequencing with shared pathophys content.`,
      sections: fiveSections.map((s, i) =>
        i === 3
          ? { ...s, body: `${s.body}\n\n**PN overlay:** ${pnScenario}` }
          : { ...s },
      ),
      preTest: preTest.map((q) => ({ ...q, question: q.question })),
      postTest: postTest.slice(0, 6).map((q) => ({ ...q })),
    });
  }

  const flashcards: Record<string, unknown>[] = [];
  let fc = 0;
  for (const spec of TOPICS) {
    const ids = sourceMap[spec.key] ?? [];
    const rowsForTopic = rawList.filter((r) => ids.includes(r.id)).slice(0, 6);
    for (const r of rowsForTopic) {
      if (fc >= 52) break;
      const rat = typeof r.rationale === "string" ? r.rationale.trim() : "";
      if (rat.length < 40) continue;
      const stemShort = r.stem.length > 120 ? `${r.stem.slice(0, 117)}…` : r.stem;
      flashcards.push({
        id: `fc20260330_${spec.key}_${fc}`,
        front: stemShort,
        back: rat.slice(0, 900),
        country: "US",
        tier: fc % 2 === 0 ? "RN" : "LVN_LPN",
        topicKey: spec.key,
        categorySlug: "fundamentals",
        sourceQuestionId: r.id,
      });
      fc += 1;
    }
  }

  fs.mkdirSync(OUT_DIR, { recursive: true });
  fs.writeFileSync(path.join(OUT_DIR, "questions.json"), JSON.stringify(questionsOut, null, 2), "utf8");
  fs.writeFileSync(path.join(OUT_DIR, "flashcards.json"), JSON.stringify(flashcards, null, 2), "utf8");
  fs.writeFileSync(
    path.join(OUT_DIR, "source-map.json"),
    JSON.stringify({ file: "data/replit-exports/exam_questions.json", topics: sourceMap }, null, 2),
    "utf8",
  );
  fs.writeFileSync(
    path.join(OUT_DIR, "catalog-lessons.json"),
    JSON.stringify({ usRn: catalogRn, usPn: catalogPn }, null, 2),
    "utf8",
  );
  fs.writeFileSync(
    path.join(OUT_DIR, "practice-exam-preset.json"),
    JSON.stringify(
      {
        id: "preset_mixed_practice_2026_rn_pn",
        tag: MIXED_TAG,
        title: "Mixed clinical practice — RN/PN batch (20 items)",
        questionCount: 20,
        description: "Stratified random draw from published questions tagged mixed-practice-2026-rn-pn.",
      },
      null,
      2,
    ),
    "utf8",
  );

  console.log(
    JSON.stringify(
      {
        questions: questionsOut.length,
        flashcards: flashcards.length,
        lessonsRn: catalogRn.length,
        lessonsPn: catalogPn.length,
        preTests: catalogRn.length,
        postTests: catalogRn.length,
      },
      null,
      2,
    ),
  );
}

main();
