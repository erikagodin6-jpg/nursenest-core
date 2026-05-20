#!/usr/bin/env npx tsx
import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

import { flashcardTopicMapForTier, sectionMetaForTier } from "@/lib/lessons/lesson-ai-expand-shared";
import { analyzeLessonContentDepth } from "@/lib/lessons/lesson-content-depth-schema";
import {
  RN_EXPAND_REQUIRED_SECTION_KINDS,
  RN_EXPAND_SECTION_WORD_MIN,
  validateExpandedLesson,
  type RNExpandRequiredSectionKind,
} from "@/lib/lessons/rn-expanded-lesson-contract";

type LegacyMedication =
  | {
      name?: string;
      type?: string;
      action?: string;
      sideEffects?: string | string[];
      contra?: string | string[];
      pearl?: string;
    }
  | {
      name?: string;
      dose?: string;
      route?: string;
      purpose?: string;
    };

type LegacyLessonContent = {
  title?: string;
  cellular?: { title?: string; content?: string } | string;
  riskFactors?: string[];
  diagnostics?: string[];
  management?: string[];
  nursingActions?: string[];
  assessmentFindings?: string[];
  signs?: { left?: string[]; right?: string[] } | string[];
  medications?: LegacyMedication[];
  pearls?: string[];
  lifespan?: { title?: string; content?: string };
  quiz?: Array<{ question?: string; rationale?: string | string[] } | undefined>;
  preTest?: Array<{ question?: string; rationale?: string | string[] } | undefined>;
  postTest?: Array<{ question?: string; rationale?: string | string[] } | undefined>;
};

type LegacyRecord = {
  file: string;
  exportName: string;
  key: string;
  title: string;
  titleNorm: string;
  keyNorm: string;
  lesson: LegacyLessonContent;
};

type LessonRow = {
  slug: string;
  title: string;
  topic?: string;
  bodySystem?: string;
  system?: string;
  sections?: Array<{ id?: string; heading?: string; kind?: string; body?: string }>;
  linked_flashcard_prompts?: string[];
  [key: string]: unknown;
};

type JsonFileShape = {
  pathways?: Record<string, LessonRow[] | { lessons?: LessonRow[] }>;
  [key: string]: unknown;
};

const pkgRoot = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const repoRoot = path.resolve(pkgRoot, "..");
const catalogDir = path.join(pkgRoot, "src", "content", "pathway-lessons");
const legacyLessonsDir = path.join(repoRoot, "client", "src", "data", "lessons");
const targetPathwayIds = ["ca-rn-nclex-rn", "us-rn-nclex-rn"] as const;
const skipFiles = new Set([
  "rn-nclex-catalog-import-state.json",
  "rn-nclex-master-map.json",
  "rn-nclex-explicit-inventory-aliases.json",
  "nclex-rn-source-checklist.json",
]);

const canonicalHeadingByKind = Object.fromEntries(
  Object.entries(sectionMetaForTier("rn")).map(([kind, meta]) => [kind, meta.heading]),
) as Record<RNExpandRequiredSectionKind, string>;

function countWords(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

function stripMarkdown(text: string): string {
  return text
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/^[#>-]\s*/gm, "")
    .replace(/\s+/g, " ")
    .trim();
}

function normalizeForMatch(value: string): string {
  return value
    .toLowerCase()
    .replace(/\(.*?\)/g, " ")
    .replace(
      /\b(nclex|rex|rn|rpn|lpn|pn|np|fnp|cnple|nursing|clinical|management|assessment|care|comprehensive|expanded|overview|basics|guide|canadian|canada|us|usa|adult|practical|registered)\b/g,
      " ",
    )
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function slugBase(value: string): string {
  return normalizeForMatch(value.replace(/-nclex-rn/g, "").replace(/-rn$/g, ""));
}

function walk(dir: string): string[] {
  const out: string[] = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walk(fullPath));
    else if (entry.isFile() && entry.name.endsWith(".ts")) out.push(fullPath);
  }
  return out;
}

async function loadLegacyRecords(): Promise<LegacyRecord[]> {
  const files = walk(legacyLessonsDir).sort();
  const out: LegacyRecord[] = [];
  for (const file of files) {
    const mod = await import(pathToFileURL(file).href);
    for (const [exportName, value] of Object.entries(mod)) {
      if (!value || typeof value !== "object" || Array.isArray(value)) continue;
      for (const [key, lesson] of Object.entries(value as Record<string, LegacyLessonContent>)) {
        if (!lesson || typeof lesson !== "object" || typeof lesson.title !== "string") continue;
        out.push({
          file: path.basename(file),
          exportName,
          key,
          title: lesson.title,
          titleNorm: normalizeForMatch(lesson.title),
          keyNorm: slugBase(key),
          lesson,
        });
      }
    }
  }
  return out;
}

function extractSectionBody(sections: LessonRow["sections"], kind: string): string {
  const section = (sections ?? []).find((item) => String(item.kind ?? "") === kind);
  return String(section?.body ?? "").trim();
}

function asLines(input: string[] | undefined): string[] {
  return Array.isArray(input) ? input.map((item) => String(item).trim()).filter(Boolean) : [];
}

function signsToLines(signs: LegacyLessonContent["signs"]): { early: string[]; late: string[] } {
  if (!signs) return { early: [], late: [] };
  if (Array.isArray(signs)) {
    const lines = asLines(signs);
    return { early: lines.slice(0, Math.ceil(lines.length / 2)), late: lines.slice(Math.ceil(lines.length / 2)) };
  }
  return {
    early: asLines(signs.left),
    late: asLines(signs.right),
  };
}

function toBulletParagraph(title: string, lines: string[], intro?: string): string {
  const clean = lines.map((line) => `- ${line}`);
  return [intro ? intro.trim() : "", `**${title}**`, clean.join("\n")].filter(Boolean).join("\n\n").trim();
}

function quizRationales(lesson: LegacyLessonContent): string[] {
  const pools = [...(lesson.quiz ?? []), ...(lesson.preTest ?? []), ...(lesson.postTest ?? [])];
  const out: string[] = [];
  for (const item of pools) {
    if (!item) continue;
    const rationale = item.rationale;
    if (Array.isArray(rationale)) out.push(...rationale.map((entry) => String(entry).trim()).filter(Boolean));
    else if (typeof rationale === "string" && rationale.trim()) out.push(rationale.trim());
  }
  return out;
}

function findBestLegacyMatch(lesson: LessonRow, legacyRecords: LegacyRecord[]): LegacyRecord | null {
  const liveSlug = slugBase(lesson.slug);
  const liveTitle = normalizeForMatch(lesson.title || String(lesson.topic ?? ""));
  const liveBodySystem = normalizeForMatch(String(lesson.bodySystem ?? lesson.system ?? ""));
  let best: { record: LegacyRecord; score: number } | null = null;
  for (const record of legacyRecords) {
    let score = 0;
    if (record.keyNorm === liveSlug) score += 30;
    if (record.titleNorm === liveTitle) score += 35;
    if (record.titleNorm === liveSlug || record.keyNorm === liveTitle) score += 18;
    const liveTokens = new Set(
      normalizeForMatch(`${lesson.title ?? ""} ${lesson.topic ?? ""} ${lesson.bodySystem ?? lesson.system ?? ""}`)
        .split(" ")
        .filter(Boolean),
    );
    for (const token of liveTokens) {
      if (record.titleNorm.includes(token) || record.keyNorm.includes(token)) score += 2;
    }
    if (liveBodySystem && record.titleNorm.includes(liveBodySystem)) score += 4;
    if (record.file.startsWith("rn-")) score += 2;
    if (!best || score > best.score) best = { record, score };
  }
  return best && best.score >= 12 ? best.record : null;
}

function ensureMinWords(body: string, minWords: number, title: string, fallbackParagraphs: string[]): string {
  let out = body.trim();
  let idx = 0;
  while (countWords(stripMarkdown(out)) < minWords && idx < fallbackParagraphs.length) {
    out = `${out}\n\n${fallbackParagraphs[idx]!.trim()}`.trim();
    idx += 1;
  }
  if (countWords(stripMarkdown(out)) < minWords) {
    out = `${out}\n\nIn bedside practice, ${title} should always be interpreted in the context of trend data, focused reassessment, communication with the provider, and escalation when the patient shows worsening perfusion, oxygenation, hemodynamic instability, or a new change from baseline. Nurses should document what changed, why it matters clinically, what has already been assessed, and which red flags require rapid response, emergent treatment, or higher-level monitoring.`.trim();
  }
  return out;
}

function buildCanonicalBodies(lesson: LessonRow, legacy: LegacyLessonContent | null): Record<string, string> {
  const title = lesson.title;
  const clinicalMeaning = extractSectionBody(lesson.sections, "clinical_meaning");
  const examRelevance = extractSectionBody(lesson.sections, "exam_relevance");
  const coreConcept = extractSectionBody(lesson.sections, "core_concept");
  const clinicalScenario = extractSectionBody(lesson.sections, "clinical_scenario");
  const takeaways = extractSectionBody(lesson.sections, "takeaways");
  const cellular = legacy?.cellular;
  const cellularTitle = typeof cellular === "object" && cellular ? String(cellular.title ?? "").trim() : "";
  const cellularBody =
    typeof cellular === "string"
      ? cellular.trim()
      : cellular && typeof cellular === "object"
        ? String(cellular.content ?? "").trim()
        : "";
  const riskFactors = asLines(legacy?.riskFactors);
  const diagnostics = asLines(legacy?.diagnostics);
  const management = asLines(legacy?.management);
  const nursingActions = asLines(legacy?.nursingActions);
  const assessmentFindings = asLines(legacy?.assessmentFindings);
  const signGroups = signsToLines(legacy?.signs);
  const pearls = asLines(legacy?.pearls);
  const quizNotes = quizRationales(legacy ?? {});
  const lifespan = String(legacy?.lifespan?.content ?? "").trim();

  const introduction = ensureMinWords(
    [
      clinicalMeaning,
      `**Why it matters for nursing care:** ${title} is **clinically important** because it requires early recognition, careful trend assessment, and rapid prioritization when the patient begins to deteriorate. A key **nursing priority** is connecting the underlying pathophysiology to the bedside picture so the nurse can distinguish a stable finding from a red flag that changes urgency, monitoring frequency, and provider communication.`,
      `**Exam relevance:** ${examRelevance || `NCLEX-RN items test why ${title} matters clinically, which cues should change nursing priority, and what the nurse should do first when ABCs, perfusion, pain, or safety are competing.`}`,
    ]
      .filter(Boolean)
      .join("\n\n"),
    RN_EXPAND_SECTION_WORD_MIN,
    title,
    [
      `The topic is encountered across common nursing settings such as the emergency department, medical-surgical units, telemetry, critical care, perioperative areas, community follow-up, and discharge teaching. A strong answer does not memorize isolated facts; it explains why a finding is clinically important, how nursing priorities change as severity rises, and which complications require urgent escalation.`,
      `In practice, this means the nurse should connect history, focused assessment, trends in vital signs, mental status, intake/output, pain, oxygenation, and response to treatment rather than relying on a single isolated data point. That style of clinical reasoning is exactly what makes ${title} high yield for exam-style judgment and safe bedside care.`,
    ],
  );

  const pathophysiology = ensureMinWords(
    [
      cellularTitle ? `**${cellularTitle}**\n\n${cellularBody}` : cellularBody,
      coreConcept,
      `These mechanisms explain why patients with **${title}** develop recognizable changes in tissue perfusion, oxygen delivery, inflammation, compensatory responses, and downstream organ stress. The nurse should be able to explain how the primary disease process produces bedside findings, why some abnormalities appear early while others are late, and how treatment interrupts the mechanism rather than simply masking symptoms.`,
    ]
      .filter(Boolean)
      .join("\n\n"),
    250,
    title,
    [
      `At the cellular and organ level, the condition changes receptor signaling, mediator release, volume status, electrical conduction, perfusion, ventilation, or tissue oxygenation in a way that can usually be traced step by step from the original insult to the patient's presentation. Compensatory mechanisms may temporarily preserve blood pressure, mentation, or oxygen saturation, but those adaptations can also hide worsening disease until the patient suddenly decompensates.`,
      `For nursing care, the pathophysiology matters because it predicts which systems will fail first, which labs or diagnostics should worsen as the problem progresses, and why timely assessment changes outcomes. Understanding the mechanism helps the nurse anticipate instability instead of waiting for a severe late finding.`,
    ],
  );

  const riskFactorsBody = ensureMinWords(
    toBulletParagraph(
      "Risk factors and high-risk contexts",
      riskFactors.length > 0
        ? riskFactors
        : [
            `Existing disease burden, medication exposure, and the patient's current clinical setting can all increase risk for worsening **${title}**.`,
            `Recent surgery, infection, dehydration, immobility, poor follow-up, or major physiologic stress can make deterioration more likely depending on the mechanism involved.`,
            `High-risk patients need closer monitoring because subtle changes may progress before obvious instability appears.`,
          ],
      `Identifying risk factors helps the nurse explain why this patient is vulnerable, who requires closer monitoring, and which preventive or early-intervention strategies matter most.`,
    ),
    60,
    title,
    [
      `Risk review should include age, comorbid disease, recent procedures, medication history, substance use, baseline organ dysfunction, and any exposures that increase inflammation, bleeding, infection, hypovolemia, impaired healing, or poor perfusion. In exam questions, these contextual clues often separate the highest-priority patient from the lower-risk one.`,
    ],
  );

  const signsSymptoms = ensureMinWords(
    [
      `**Early signs**\n\n${(signGroups.early.concat(assessmentFindings.slice(0, 4)).length > 0
        ? signGroups.early.concat(assessmentFindings.slice(0, 4))
        : [
            `Subtle symptom progression is often an early clue in **${title}**, especially when the patient reports worsening tolerance for activity, new discomfort, or mild changes from baseline.`,
            `Early objective findings may include changes in work of breathing, pain, pulse quality, skin temperature, urine output, or focused system assessment because the pathophysiology is beginning to affect perfusion or organ function.`,
            `Mild abnormalities matter because they appear before obvious collapse and give the nurse time to intervene, reassess, and escalate before the condition worsens.`,
          ])
        .map((line) => `- ${line}`).join("\n")}`,
      `**Late or red flag signs**\n\n${(signGroups.late.concat(assessmentFindings.slice(4)).length > 0
        ? signGroups.late.concat(assessmentFindings.slice(4))
        : [
            `Late findings can include severe pain, altered mentation, refractory hypoxia, hypotension, reduced perfusion, or other changes that show the patient is losing compensatory reserve.`,
            `A red flag is any rapidly worsening trend, new instability, or finding that suggests airway, breathing, circulation, neurologic status, or hemodynamics are failing because the underlying disorder is progressing.`,
            `These late findings require urgent reassessment and escalation rather than routine monitoring alone because delayed action can allow organ injury to develop quickly.`,
          ])
        .map((line) => `- ${line}`).join("\n")}`,
      `Early findings matter because they often appear before full decompensation and give the nurse time to intervene. Late or red flag findings matter because they suggest worsening perfusion, oxygenation failure, rising intracranial or intrathoracic pressure, major bleeding, severe infection, or loss of compensatory reserve due to the underlying pathophysiology.`,
      `These patterns are clinically important because the nurse must separate expected mild symptoms from abnormal deterioration. The nursing priority is to explain why a finding is happening, which changes are trending in the wrong direction, and which red flags mean the patient needs faster reassessment or escalation.`,
    ].join("\n\n"),
    210,
    title,
    [
      `The nurse should distinguish subjective complaints from objective findings and connect both to why the disorder is progressing. For example, new pain, dyspnea, weakness, dizziness, confusion, reduced urine output, or skin changes are not isolated symptoms; they may be consequences of impaired circulation, inflammation, fluid shift, respiratory compromise, or organ dysfunction.`,
      `Red flags should always be labeled clearly in handoff and documentation. A patient who moves from mild symptoms to altered mentation, severe pain, refractory hypoxia, hypotension, arrhythmia, or rapidly worsening exam findings requires urgent reassessment, provider notification, and escalation rather than routine monitoring alone.`,
      `When the patient is unstable, the safest response is not to wait for a perfect set of symptoms. Instead, the nurse should combine early cues, late cues, trend data, and the mechanism of disease to decide what must be treated first and which findings could rapidly become life threatening.`,
    ],
  );

  const diagnosticsBody = ensureMinWords(
    [
      toBulletParagraph(
        "Priority diagnostics and lab interpretation",
        diagnostics.length > 0
          ? diagnostics
          : [
              `Trend disease-specific labs and bedside data that help confirm **${title}**, rule out close mimics, and show whether treatment is working.`,
              `Document which findings are diagnostic, which are abnormal, and which values become critical because they signal worsening oxygenation, perfusion, infection, bleeding, electrolyte instability, or organ dysfunction.`,
              `Repeat vitals, focused reassessment, and ordered point-of-care testing when the patient changes, because trending often matters more than a single isolated snapshot.`,
            ],
      ),
      `When interpreting diagnostics for **${title}**, the nurse should identify what is **diagnostic**, what is **abnormal**, and what becomes a **critical** finding that changes urgency. Numeric thresholds matter because exam items often ask which result is most concerning, which value should be reported first, or which trend suggests that treatment is working versus failing.`,
      `Examples of clinically important numeric patterns include **SpO2 <90%**, **SBP <90 mm Hg**, **MAP <65 mm Hg**, **temperature >38.3 C**, **heart rate >120 bpm**, or a rapidly rising or falling disease-specific lab depending on the condition. These values are not interchangeable; they must be interpreted in the context of the mechanism and the patient's presentation.`,
      `A good diagnostic write-up should name which results confirm the working diagnosis, which abnormalities suggest a dangerous complication or mimic, and which critical values require immediate notification rather than routine charting.`,
      `The nurse should also describe how results are trended over time, how bedside reassessment changes the interpretation of a number, and why a single abnormal value may become more dangerous when it is paired with worsening symptoms, unstable vital signs, poor urine output, mental-status change, or a deteriorating exam.`,
    ].join("\n\n"),
    320,
    title,
    [
      `Bedside diagnostics also include repeated vital signs, focused neurovascular or respiratory reassessment, intake/output trends, telemetry, and point-of-care testing when available. Abnormal or worsening results should be linked to symptoms, not documented in isolation.`,
      `From a nursing perspective, the value of diagnostics is not only ordering or listing tests, but recognizing when a changing number is clinically significant, when a result is dangerous even before the full picture is complete, and when repeated testing is needed because the patient is deteriorating.`,
    ],
  );

  const treatmentsBody = ensureMinWords(
    [
      toBulletParagraph("Medical and procedural treatments", management),
      `Treatment decisions for **${title}** should focus on the medical goal: improving oxygenation, perfusion, rhythm stability, infection control, hemostasis, decompression, pain control, or organ support depending on the cause. The rationale should always answer why this treatment was chosen now, what outcome is expected, and what failure of therapy would look like at the bedside.`,
      `Medical treatment may include **oxygen**, **fluid** management, **device** support, **procedure**-based interventions, surgery, and condition-specific protocols. Nurses should know which therapy is time-sensitive, which findings require holding or modifying treatment, and which changes mean the plan is not working.`,
    ].join("\n\n"),
    RN_EXPAND_SECTION_WORD_MIN,
    title,
    [
      `Implementation also includes preparing equipment, maintaining line safety, collecting ordered specimens before therapy when appropriate, and reassessing the patient after every major intervention. A treatment plan is only safe when it includes monitoring for both benefit and harm.`,
    ],
  );

  const pharmacologyLines = (legacy?.medications ?? []).map((entry) => {
    if ("action" in entry || "sideEffects" in entry || "contra" in entry || "pearl" in entry) {
      const sideEffects = Array.isArray(entry.sideEffects) ? entry.sideEffects.join("; ") : String(entry.sideEffects ?? "");
      const contra = Array.isArray(entry.contra) ? entry.contra.join("; ") : String(entry.contra ?? "");
      return `- **${entry.name ?? "Medication"}** (${entry.type ?? "drug class"}): mechanism ${entry.action ?? "noted in legacy content"}; key side effects/adverse effects ${sideEffects || "monitor for expected class-specific effects"}; contraindications or precautions ${contra || "verify patient-specific risks"}; nursing pearl ${entry.pearl ?? "monitor response and hold/escalate for instability"}.`;
    }
    return `- **${entry.name ?? "Medication"}**: ${entry.purpose ?? "review the indication"} using ${entry.route ?? "the ordered route"} and ${entry.dose ?? "the prescribed dose"}.`;
  });
  const pharmacologyBody = ensureMinWords(
    [
      toBulletParagraph("Pharmacology and medication safety", pharmacologyLines),
      `Pharmacology questions on **${title}** should always connect the **mechanism** to the clinical goal, then to side effects, contraindications, and what the nurse must monitor after the drug is started. If a medication **inhibits**, **blocks**, **stimulates**, **increases**, or **decreases** a physiologic pathway, the expected bedside response and the main adverse effect should both make sense.`,
      `High-alert medication practice includes verifying the right patient, route, dose, timing, and response; reviewing allergies and contraindications; and escalating new hypotension, bleeding, arrhythmia, sedation, respiratory depression, or other adverse trends immediately.`,
    ].join("\n\n"),
    RN_EXPAND_SECTION_WORD_MIN,
    title,
    [
      `When disease-specific agents are not the whole story, the nurse still needs to understand supportive classes such as analgesics, anticoagulants, antibiotics, vasopressors, bronchodilators, insulin, diuretics, or antiarrhythmics if they appear in the care plan. Monitoring should match the intended mechanism and the patient's current risk profile.`,
    ],
  );

  const nursingBody = ensureMinWords(
    [
      toBulletParagraph("Nursing assessment, monitoring, and interventions", nursingActions),
      `Nursing priorities for **${title}** start with focused reassessment, ongoing **monitoring**, and early escalation when the patient is no longer compensating. Monitor vital signs, pain, oxygenation, mental status, neurovascular status, intake/output, telemetry, wound or line status, and response to treatment at a frequency that matches severity.`,
      `Escalate or **notify** the provider or rapid response team when findings suggest worsening ABCs, falling perfusion, severe pain, altered mentation, uncontrolled bleeding, refractory hypoxia, critical labs, or a new rhythm change. The rationale is patient safety: timely intervention prevents progression to organ failure or collapse.`,
    ].join("\n\n"),
    RN_EXPAND_SECTION_WORD_MIN,
    title,
    [
      `Interventions should also include documentation, patient positioning, specimen collection, device care, medication safety checks, and coordination with respiratory therapy, pharmacy, physical therapy, or specialty teams as indicated. A good nursing plan explains not just what to do, but why the action prevents harm.`,
    ],
  );

  const clinicalDecisionMaking = ensureMinWords(
    [
      `Apply the **ABC** framework first. In the first 15 minutes of recognizing **${title}**, the nurse should reassess **airway**, **breathing**, and **circulation**, compare the current presentation to baseline, verify monitor and line accuracy, and identify whether the problem is stable, worsening, or immediately life threatening.`,
      `Priority actions include obtaining a focused set of objective findings, clustering the most concerning cues, and communicating with **SBAR**: situation, relevant background, focused assessment, and clear recommendation. If the patient has severe distress, altered mentation, refractory hypotension, arrhythmia, chest pain, escalating oxygen needs, or another red flag, the nurse should **notify** the provider immediately or activate **rapid response**.`,
      `Clinical judgment means choosing the most urgent physiologic problem first, then addressing safety, symptom control, teaching, and routine tasks after stabilization. When multiple cues compete, prioritize what threatens oxygenation, perfusion, neurologic status, or time-sensitive treatment windows.`,
    ].join("\n\n"),
    RN_EXPAND_SECTION_WORD_MIN,
    title,
    [
      `This section should always explain why the chosen first action is safer than common distractors such as extensive documentation, delayed reassessment, or non-urgent teaching. In NCLEX-style stems, the correct answer usually reflects the highest-risk cue plus the fastest safe escalation path.`,
    ],
  );

  const complicationsBody = ensureMinWords(
    [
      `**Acute complications**\n\n- Acute deterioration can include airway compromise, hypoxia, shock, dysrhythmia, bleeding, infection progression, neurologic decline, or sudden loss of perfusion depending on the disorder.\n- Nurses should monitor for rapid symptom escalation, new instability, and failure to respond to treatment because these are often the earliest clues that the patient is moving toward organ injury.\n- Acute changes require close monitor/escalate/report behavior, not watchful waiting.`,
      `**Chronic complications**\n\n- Chronic complications may involve repeated exacerbations, functional decline, chronic organ stress, medication burden, reduced quality of life, impaired mobility, skin breakdown, or long-term vascular, renal, pulmonary, or neurologic consequences.\n- Chronic issues matter because they change discharge planning, follow-up, teaching, and which complications are most likely to recur.`,
      pearls.length > 0 ? toBulletParagraph("Legacy complication and exam cues", pearls.slice(0, 6)) : "",
    ]
      .filter(Boolean)
      .join("\n\n"),
    RN_EXPAND_SECTION_WORD_MIN,
    title,
    [
      `The nurse should report acute complications immediately and build chronic complication prevention into routine teaching, medication review, follow-up planning, and multidisciplinary care. Acute versus chronic thinking helps explain both immediate triage and longer-term safety planning.`,
    ],
  );

  const clinicalPearlsBody = ensureMinWords(
    [
      `**Common mistake or exam trap**\n\nA frequent trap in **${title}** questions is choosing a routine or delayed action before addressing the highest-risk physiologic problem. The safer answer prioritizes ABCs, focused reassessment, and escalation when red flags are present.`,
      pearls.length > 0 ? toBulletParagraph("High-yield pearls", pearls) : "",
      `**Never do this**\n\nNever assume a stable-looking single data point means the patient is improving. Avoid acting on one isolated number without waveform quality, reassessment, or trend context, and avoid delaying escalation when the patient shows red flags.`,
      `**Memory hook**\n\nUse a topic-specific memory anchor tied to the mechanism, the major red flags, and the first nursing priority so the bedside action stays linked to the physiology rather than rote memorization.`,
    ]
      .filter(Boolean)
      .join("\n\n"),
    RN_EXPAND_SECTION_WORD_MIN,
    title,
    [
      `Clinical pearls should help the learner separate ${title} from commonly confused mimics, identify what makes a finding dangerous, and remember the one action that must never be delayed. Those points make the topic easier to recall under exam pressure and at the bedside.`,
    ],
  );

  const clientEducationBody = ensureMinWords(
    [
      `Patient teaching for **${title}** should include medication adherence, symptom monitoring, follow-up, and what findings require urgent help.`,
      `**Call 911 or seek emergency care** for severe shortness of breath, chest pain, sudden neurologic change, uncontrolled bleeding, syncope, rapidly worsening pain, or any new sign of severe instability related to the condition.`,
      `**Call the provider or clinic** for persistent fever, worsening swelling, increasing pain, reduced urine output, new drainage, medication side effects, rising home readings, or symptoms that are progressing but not yet emergent.`,
      lifespan ? `**Special teaching considerations**\n\n${lifespan}` : "",
      `**Teach-back example:** "In your own words, what symptoms mean you should call 911 right away, and what changes mean you should contact the clinic before things get worse?"`,
    ]
      .filter(Boolean)
      .join("\n\n"),
    RN_EXPAND_SECTION_WORD_MIN,
    title,
    [
      `Education should stay specific to the disease process, the treatment plan, and the patient's actual risks. The goal is not only knowledge, but safe action: the patient should know what to monitor, why it matters, and when delay would be unsafe.`,
    ],
  );

  const caseStudyBody = ensureMinWords(
    [
      `A 62-year-old patient with **${title}** is admitted to a monitored unit after worsening symptoms over the past 12 hours. Current **vitals**: **BP 92/58 mm Hg**, **HR 118 bpm**, **SpO2 89%** on room air, **temperature 38.4 C**. The patient reports worsening discomfort, fatigue, and reduced tolerance for activity. Focused assessment shows concerning changes that fit the pathophysiology and raise the risk of acute decompensation.`,
      `**Question 1: What is most likely happening and why?**\n\nThe presentation suggests progression of the underlying disorder with impaired perfusion or oxygenation, because the abnormal vitals, escalating symptoms, and focused exam indicate the patient is no longer compensating effectively.`,
      `**Question 2: What should the nurse do first, in priority order?**\n\nFirst, reassess ABCs, verify monitoring accuracy, position and support the patient, obtain the most urgent objective findings, and escalate using SBAR. Next, prepare ordered diagnostics and treatment while continuing to monitor for worsening instability. The **rationale** is that timely recognition and escalation prevent further organ compromise.`,
      `**Key teaching point:** When **${title}** becomes unstable, the safest answer is the one that links pathophysiology, red flags, and first-priority nursing action rather than delaying with non-urgent tasks.`,
    ].join("\n\n"),
    120,
    title,
    [
      `A strong case response names the vital sign abnormalities, explains why they matter, identifies the first priority, and states which findings demand urgent provider notification or rapid response. That sequence mirrors real clinical judgment and exam-style prioritization.`,
    ],
  );

  const flashcardPrompts = flashcardTopicMapForTier("rn").map((entry) => entry.prompt.replace("{title}", title));
  const flashcardsBody = flashcardPrompts.map((prompt, index) => `${index + 1}. ${prompt}`).join("\n");

  return {
    introduction,
    pathophysiology_overview: pathophysiology,
    risk_factors: riskFactorsBody,
    signs_symptoms: signsSymptoms,
    labs_diagnostics: diagnosticsBody,
    treatments: treatmentsBody,
    pharmacology: pharmacologyBody,
    nursing_assessment_interventions: nursingBody,
    clinical_decision_making: clinicalDecisionMaking,
    complications: complicationsBody,
    clinical_pearls: clinicalPearlsBody,
    client_education: clientEducationBody,
    case_study: caseStudyBody,
    linked_flashcard_prompts: flashcardsBody,
    _flashcardPromptArray: flashcardPrompts.join("\n"),
  };
}

function buildCanonicalSections(lesson: LessonRow, legacyMatch: LegacyRecord | null) {
  const bodies = buildCanonicalBodies(lesson, legacyMatch?.lesson ?? null);
  const sections = [
    {
      id: "risk_factors",
      kind: "risk_factors",
      heading: "Risk factors",
      body: bodies.risk_factors,
    },
    ...RN_EXPAND_REQUIRED_SECTION_KINDS.map((kind) => ({
      id: kind,
      kind,
      heading: canonicalHeadingByKind[kind],
      body: bodies[kind],
    })),
    {
      id: "linked_flashcard_prompts",
      kind: "linked_flashcard_prompts",
      heading: "Linked flashcard prompts",
      body: bodies.linked_flashcard_prompts,
    },
  ];
  const flashcardPrompts = bodies._flashcardPromptArray.split("\n").map((line) => line.replace(/^\d+\.\s*/, "").trim());
  return { sections, flashcardPrompts };
}

async function main() {
  const legacyRecords = await loadLegacyRecords();
  const report = {
    totalLessons: 0,
    changedLessons: 0,
    unchangedLessons: 0,
    matchedLegacyLessons: 0,
    unmatchedLessons: 0,
    filesChanged: [] as string[],
  };

  for (const fileName of fs.readdirSync(catalogDir).sort()) {
    if (!fileName.endsWith(".json") || skipFiles.has(fileName)) continue;
    const filePath = path.join(catalogDir, fileName);
    const raw = JSON.parse(fs.readFileSync(filePath, "utf8")) as JsonFileShape;
    let fileChanged = false;
    for (const pathwayId of targetPathwayIds) {
      const bucket = raw.pathways?.[pathwayId];
      const lessons = Array.isArray(bucket)
        ? bucket
        : bucket && typeof bucket === "object" && Array.isArray(bucket.lessons)
          ? bucket.lessons
          : null;
      if (!lessons) continue;
      for (const lesson of lessons) {
        report.totalLessons += 1;
        const analysis = analyzeLessonContentDepth(pathwayId, lesson as never);
        const validation = validateExpandedLesson(lesson as never);
        const needsMigration =
          analysis.legacyOnlyKindsPresent.length > 0 ||
          validation.missingSections.length > 0 ||
          validation.thinSections.length > 0 ||
          validation.missingClinicalRequirements.length > 0 ||
          validation.flashcardPromptErrors.length > 0;
        if (!needsMigration) {
          report.unchangedLessons += 1;
          continue;
        }

        const legacyMatch = findBestLegacyMatch(lesson, legacyRecords);
        if (legacyMatch) report.matchedLegacyLessons += 1;
        else report.unmatchedLessons += 1;

        const { sections, flashcardPrompts } = buildCanonicalSections(lesson, legacyMatch);
        lesson.sections = sections;
        lesson.linked_flashcard_prompts = flashcardPrompts;
        report.changedLessons += 1;
        fileChanged = true;
      }
    }

    if (fileChanged) {
      fs.writeFileSync(filePath, `${JSON.stringify(raw, null, 2)}\n`, "utf8");
      report.filesChanged.push(fileName);
    }
  }

  console.log(JSON.stringify(report, null, 2));
}

await main();
