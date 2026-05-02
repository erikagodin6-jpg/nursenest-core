import type { LessonContent, QuizQuestion } from "@legacy-client/data/lessons/types";
import type { CheckpointQuestion } from "@/lib/lessons/lesson-recall-types";
import type { PathwayLessonRecord, PathwayLessonSection } from "@/lib/lessons/pathway-lesson-types";
import { ContentStatus } from "@prisma/client";
import { countWords, stripToPlainText } from "@/lib/content-quality/plain-text";
import { enrichLegacyFiveBlockSectionsForSubscriberGates } from "@/lib/lessons/pathway-lesson-subscriber-completeness";
import { evaluatePathwayLessonStructuralGate } from "@/lib/lessons/pathway-lesson-premium";
import { marketingPathwayLessonDetailPath } from "@/lib/lessons/lesson-routes";
import type { ExamPathwayDefinition } from "@/lib/exam-pathways/types";
import { getExamPathwayById } from "@/lib/exam-pathways/exam-product-registry";
import { appLearnerLessonDetailPath } from "@/lib/lessons/lesson-routes";
import type { MedMathPathwayLessonCreatePayload } from "./types";

const MED_MATH_TOPIC = "Pharmacology & dosage safety";
const MED_MATH_TOPIC_SLUG = "pharmacology";
const MED_MATH_BODY_SYSTEM = "pharmacology";

function cellularBody(lesson: LessonContent): string {
  const c = lesson.cellular;
  if (typeof c === "string") return c.trim();
  return `### ${c.title}\n\n${c.content}`.trim();
}

function bulletList(title: string, items: string[] | undefined): string {
  if (!items?.length) return "";
  return `### ${title}\n\n${items.map((x) => `- ${x}`).join("\n")}`;
}

function formatMedications(lesson: LessonContent): string {
  if (!lesson.medications?.length) return "";
  const blocks = lesson.medications.map((m) => {
    if ("action" in m) {
      return `#### ${m.name} (${m.type})\n\n**Worked example / teaching point:** ${m.action}\n\n**Adverse / monitoring:** ${String(m.sideEffects)}\n\n**Contraindications / cautions:** ${m.contra}\n\n**Pearl:** ${m.pearl}`;
    }
    return `#### ${m.name}\n\n${m.dose} · ${m.route} · ${m.purpose}`;
  });
  return `### Worked examples (medication math)\n\n${blocks.join("\n\n")}`;
}

function formatSigns(lesson: LessonContent): string {
  const s = lesson.signs;
  if (!s) return "";
  if (Array.isArray(s)) return bulletList("Key comparisons", s);
  const left = s.left.map((x) => `- ${x}`).join("\n");
  const right = s.right.map((x) => `- ${x}`).join("\n");
  return `### Comparison table\n\n**Left column (inputs / concepts)**\n\n${left}\n\n**Right column (outputs / implications)**\n\n${right}`;
}

function quizToCheckpointQuestions(quiz: Array<QuizQuestion | undefined> | undefined): CheckpointQuestion[] {
  if (!quiz?.length) return [];
  const out: CheckpointQuestion[] = [];
  let i = 0;
  for (const q of quiz) {
    if (!q?.question || !q.options?.length) continue;
    const letters = ["a", "b", "c", "d", "e", "f"] as const;
    const options = q.options.map((text, idx) => ({
      id: letters[idx] ?? `opt-${idx}`,
      text: String(text),
    }));
    const correctIdx = Math.min(Math.max(0, q.correct), options.length - 1);
    const correctId = options[correctIdx]!.id;
    const rationale = Array.isArray(q.rationale) ? q.rationale.join(" ") : (q.rationale ?? "");
    out.push({
      id: `mm-cq-${i}`,
      question: q.question.trim(),
      options,
      correctId,
      explanation: rationale.trim() || "See rationale in lesson narrative.",
    });
    i += 1;
  }
  return out;
}

/**
 * Maps monolith {@link LessonContent} (med-math bundle) into legacy five-block pathway sections
 * plus objectives, safety, formulas, and worked examples embedded in Markdown bodies.
 */
export function buildMedMathPathwaySections(
  legacySlug: string,
  lesson: LessonContent,
  pathwayId: string,
): PathwayLessonSection[] {
  const cell = cellularBody(lesson);
  const objectivesBlock = bulletList("Learning objectives", [
    "Apply dimensional analysis and formula methods with **units** at every step.",
    "Identify high-risk medication math situations (pediatrics, weight-based dosing, IV rates, reconstitution).",
    "Verify orders against safe dose ranges and escalate when results are implausible.",
  ]);

  const safetyBlock = bulletList("Safety", [
    ...(lesson.riskFactors ?? []).slice(0, 12),
    "Use two patient identifiers and the Five Rights before every administration.",
    "Double-check high-alert medications with a second nurse when policy requires.",
  ]);

  const formulasBlock = bulletList("Formulas & methods", lesson.management ?? []);
  const diagnosticsBlock = bulletList("Diagnostics & verification steps", lesson.diagnostics ?? []);

  const clinical_meaning: PathwayLessonSection = {
    id: `${legacySlug}-clinical-meaning`,
    kind: "clinical_meaning",
    heading: "Clinical meaning, objectives, and safety framing",
    body: [
      objectivesBlock,
      "",
      "### Clinical context",
      "",
      cell,
      "",
      safetyBlock,
    ]
      .filter(Boolean)
      .join("\n"),
  };

  const examCheckpoints = quizToCheckpointQuestions(lesson.quiz);

  const exam_relevance: PathwayLessonSection = {
    id: `${legacySlug}-exam-relevance`,
    kind: "exam_relevance",
    heading: "Exam relevance & practice checks",
    body: [
      "### How this is tested (NCLEX-style judgment)",
      "",
      "Items often pair **correct math** with **safe nursing action** (hold and clarify vs administer, verify units, choose the measuring device).",
      "",
      bulletList("High-yield traps", lesson.pearls?.slice(0, 8) ?? []),
    ]
      .filter(Boolean)
      .join("\n"),
    checkpointQuestions: examCheckpoints.length ? examCheckpoints : undefined,
  };

  const core_concept: PathwayLessonSection = {
    id: `${legacySlug}-core-concept`,
    kind: "core_concept",
    heading: "Core concepts, formulas, and diagnostics",
    body: [formulasBlock, "", diagnosticsBlock].filter(Boolean).join("\n"),
  };

  const scenarioIntro =
    "**Patient scenario (medication math).** You are caring for an adult patient on a medical-surgical unit. " +
    "Orders include weight-based and liquid doses; you must compute the amount to administer using the **ordered dose**, **available concentration**, and **route-appropriate units** (mg, mcg, mL, tablets). " +
    "You will verify the result against a reasonable range, identify when to hold the dose, and communicate with pharmacy when the math suggests an unsafe volume.\n\n";

  const clinical_scenario: PathwayLessonSection = {
    id: `${legacySlug}-clinical-scenario`,
    kind: "clinical_scenario",
    heading: "Clinical scenario & worked calculations",
    body: [scenarioIntro, formatMedications(lesson), "", formatSigns(lesson)].filter(Boolean).join("\n"),
  };

  const takeaways: PathwayLessonSection = {
    id: `${legacySlug}-takeaways`,
    kind: "takeaways",
    heading: "Takeaways & nursing actions",
    body: [
      bulletList("Nursing actions at the bedside", lesson.nursingActions ?? []),
      "",
      bulletList("Additional clinical pearls", lesson.pearls?.slice(8) ?? []),
    ]
      .filter(Boolean)
      .join("\n"),
  };

  const raw = [clinical_meaning, exam_relevance, core_concept, clinical_scenario, takeaways];
  return enrichLegacyFiveBlockSectionsForSubscriberGates(raw, {
    title: lesson.title,
    topic: MED_MATH_TOPIC,
    bodySystem: MED_MATH_BODY_SYSTEM,
    pathwayId,
  });
}

export function buildMedMathPathwayLessonRecord(args: {
  legacySlug: string;
  lesson: LessonContent;
  pathwayId: string;
}): PathwayLessonRecord {
  const sections = buildMedMathPathwaySections(args.legacySlug, args.lesson, args.pathwayId);
  const plainIntro = stripToPlainText(cellularBody(args.lesson)).slice(0, 400);
  const seoDescription =
    `${args.lesson.title}: ${plainIntro}`.slice(0, 320).trim() ||
    `${args.lesson.title} — medication dosage calculations and safety for NCLEX-style preparation.`;

  return {
    slug: args.legacySlug,
    title: args.lesson.title.trim(),
    topic: MED_MATH_TOPIC,
    topicSlug: MED_MATH_TOPIC_SLUG,
    bodySystem: MED_MATH_BODY_SYSTEM,
    previewSectionCount: 1,
    seoTitle: `${args.lesson.title} | NurseNest`,
    seoDescription,
    sections,
  };
}

export function buildMedMathCreatePayload(args: {
  legacySlug: string;
  lesson: LessonContent;
  pathwayId: string;
  sortOrder?: number;
}): MedMathPathwayLessonCreatePayload {
  const record = buildMedMathPathwayLessonRecord(args);
  return {
    pathwayId: args.pathwayId,
    slug: args.legacySlug,
    locale: "en",
    title: record.title,
    topic: record.topic,
    topicSlug: record.topicSlug,
    bodySystem: record.bodySystem,
    previewSectionCount: record.previewSectionCount,
    seoTitle: record.seoTitle,
    seoDescription: record.seoDescription,
    sections: record.sections,
    status: ContentStatus.PUBLISHED,
    tierCode: null,
    sortOrder: typeof args.sortOrder === "number" ? args.sortOrder : 0,
    exams: [],
    countries: [],
    priority: "medium",
    examMeta: [],
  };
}

export function evaluateMedMathStructuralQuality(record: PathwayLessonRecord): ReturnType<typeof evaluatePathwayLessonStructuralGate> {
  return evaluatePathwayLessonStructuralGate(record);
}

export function buildMedMathMigrationUrls(pathwayId: string, slug: string, lessonDbId?: string): {
  pathway: ExamPathwayDefinition;
  marketingLessonUrl: string;
  adminEditUrl: string;
  learnerDetailUrlAfterWrite: string;
} {
  const pathway = getExamPathwayById(pathwayId);
  if (!pathway) {
    throw new Error(`Unknown exam pathway: ${pathwayId}`);
  }
  const marketingLessonUrl = marketingPathwayLessonDetailPath(pathway, slug) ?? `/lessons`;
  const adminEditUrl = `/admin/pathway-lessons/edit?pathwayId=${encodeURIComponent(pathwayId)}&slug=${encodeURIComponent(slug)}`;
  const learnerDetailUrlAfterWrite = lessonDbId
    ? appLearnerLessonDetailPath(lessonDbId)
    : "(after DB insert — /app/lessons/{pathwayLesson.id})";
  return { pathway, marketingLessonUrl, adminEditUrl, learnerDetailUrlAfterWrite };
}

export function countMedMathLessonWords(sections: PathwayLessonSection[]): number {
  let n = 0;
  for (const s of sections) {
    n += countWords(stripToPlainText(typeof s.body === "string" ? s.body : ""));
    for (const cq of s.checkpointQuestions ?? []) {
      n += countWords(stripToPlainText(cq.question));
      n += countWords(stripToPlainText(cq.explanation));
      for (const o of cq.options) n += countWords(stripToPlainText(o.text));
    }
  }
  return n;
}
