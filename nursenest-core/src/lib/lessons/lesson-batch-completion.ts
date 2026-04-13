import { ContentStatus, type Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";
import { resolveLessonContextForPathwayId } from "@/lib/lessons/lesson-region-exam";
import { examRowToLessonBankItem, type LessonBankQuizItem } from "@/lib/lessons/exam-question-to-lesson-quiz-item";
import { PREMIUM_SECTION_HEADINGS, PREMIUM_SECTION_KINDS } from "@/lib/lessons/pathway-lesson-premium";
import type {
  PathwayLessonFigure,
  PathwayLessonPremiumSectionKind,
  PathwayLessonQuizItem,
  PathwayLessonSection,
} from "@/lib/lessons/pathway-lesson-types";

function lessonsHref(topic: string, topicSlug: string, pathwayId: string): string {
  const q = new URLSearchParams();
  if (topicSlug.trim()) q.set("topicSlug", topicSlug.trim().toLowerCase());
  else q.set("topic", topic.trim());
  q.set("pathwayId", pathwayId);
  return `/app/lessons?${q.toString()}`;
}

function topicDrillHref(topic: string, pathwayId: string): string {
  const q = new URLSearchParams({
    preset: "topic_drill",
    topic: topic.trim(),
    pathwayId,
  });
  return `/app/questions?${q.toString()}`;
}

function catHref(topic: string, pathwayId: string): string {
  const q = new URLSearchParams({
    pathwayId,
    intent: "weak_focus",
    topic: topic.trim(),
  });
  return `/app/readiness?${q.toString()}`;
}

type CompletionStatus = "COMPLETE" | "PARTIAL" | "EMPTY";
type PriorityBand = "core_systems" | "high_yield" | "remaining";

type BatchItemResult = {
  lessonId: string;
  slug: string;
  title: string;
  topic: string;
  bodySystem: string;
  priorityBand: PriorityBand;
  statusBefore: CompletionStatus;
  statusAfter: CompletionStatus;
  updated: boolean;
  relatedQuestionCount: number;
  preQuestionCount: number;
  postQuestionCount: number;
  gaps: string[];
};

export type LessonCompletionBatchReport = {
  pathwayId: string;
  batchSize: number;
  write: boolean;
  selectedAt: string;
  lessonsCompleted: number;
  lessonsUpdated: number;
  lessonsStillPartial: number;
  majorGapsRemaining: string[];
  items: BatchItemResult[];
};

type BatchInput = {
  pathwayId: string;
  batchSize: number;
  write?: boolean;
};

type LessonRow = {
  id: string;
  slug: string;
  title: string;
  topic: string;
  topicSlug: string;
  bodySystem: string;
  sections: Prisma.JsonValue;
};

const CORE_SYSTEM_KEYS = ["cardio", "cardiovascular", "respir", "renal", "kidney", "endocr", "neuro"];
const HIGH_YIELD_KEYS = ["pharm", "medication", "priorit", "triage", "delegat", "safety", "infection"];
const REMAINING_KEYS = ["gastro", "gi", "hemat", "matern", "obst", "pedi", "child", "mental", "psych"];

const MIN_BATCH_SIZE = 20;
const MAX_BATCH_SIZE = 50;
const MAX_QUESTION_ROWS = 24;

const REQUIRED_SECTIONS: PathwayLessonPremiumSectionKind[] = [
  "introduction",
  "pathophysiology_overview",
  "signs_symptoms",
  "red_flags",
  "labs_diagnostics",
  "nursing_assessment_interventions",
  "clinical_pearls",
  "client_education",
  "tier_specific_relevance",
  "country_specific_notes",
  "related_next_steps",
];

function words(s: string): number {
  const t = s.trim();
  if (!t) return 0;
  return t.split(/\s+/).length;
}

function paragraphs(s: string): string[] {
  return s
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter(Boolean);
}

function rankBand(lesson: Pick<LessonRow, "title" | "topic" | "bodySystem">): PriorityBand {
  const text = `${lesson.title} ${lesson.topic} ${lesson.bodySystem}`.toLowerCase();
  if (CORE_SYSTEM_KEYS.some((k) => text.includes(k))) return "core_systems";
  if (HIGH_YIELD_KEYS.some((k) => text.includes(k))) return "high_yield";
  if (REMAINING_KEYS.some((k) => text.includes(k))) return "remaining";
  return "remaining";
}

function bandOrder(band: PriorityBand): number {
  if (band === "core_systems") return 0;
  if (band === "high_yield") return 1;
  return 2;
}

function normalizeSections(raw: Prisma.JsonValue): PathwayLessonSection[] {
  if (!Array.isArray(raw)) return [];
  const out: PathwayLessonSection[] = [];
  for (let i = 0; i < raw.length; i += 1) {
    const x = raw[i];
    if (!x || typeof x !== "object") continue;
    const item = x as Record<string, unknown>;
    const kind = typeof item.kind === "string" ? item.kind.trim() : "";
    const body = typeof item.body === "string" ? item.body.trim() : "";
    if (!kind || !body) continue;
    out.push({
      id: typeof item.id === "string" && item.id.trim() ? item.id : `${kind}-${i}`,
      heading: typeof item.heading === "string" && item.heading.trim() ? item.heading : "Section",
      kind: kind as PathwayLessonSection["kind"],
      body,
      ...(Array.isArray(item.figures) ? { figures: item.figures as PathwayLessonFigure[] } : {}),
    });
  }
  return out;
}

function sectionMap(sections: PathwayLessonSection[]): Map<string, PathwayLessonSection> {
  return new Map(sections.map((s) => [s.kind, s]));
}

function extractImagesFromQuestionRows(rows: Array<{ images: Prisma.JsonValue | null }>): PathwayLessonFigure[] {
  const out: PathwayLessonFigure[] = [];
  const seen = new Set<string>();
  for (const row of rows) {
    if (!Array.isArray(row.images)) continue;
    for (let i = 0; i < row.images.length; i += 1) {
      const candidate = row.images[i];
      if (!candidate || typeof candidate !== "object") continue;
      const rec = candidate as Record<string, unknown>;
      const rawUrl = typeof rec.url === "string" ? rec.url.trim() : "";
      if (!rawUrl.startsWith("https://") || seen.has(rawUrl)) continue;
      seen.add(rawUrl);
      out.push({
        id: `img-${out.length + 1}`,
        url: rawUrl,
        alt: typeof rec.alt === "string" && rec.alt.trim() ? rec.alt.trim() : "Clinical reference image",
        kind: "clinical_reference",
      });
      if (out.length >= 3) return out;
    }
  }
  return out;
}

function buildQuestionBackedParagraphs(items: LessonBankQuizItem[]): string[] {
  return items
    .map((i) => i.rationale?.trim() ?? "")
    .filter((x) => x.length >= 50)
    .slice(0, 6)
    .map((r) => r.replace(/\s+/g, " "));
}

function ensureSection(
  kind: PathwayLessonPremiumSectionKind,
  body: string,
  figures?: PathwayLessonFigure[],
): PathwayLessonSection {
  return {
    id: kind,
    kind,
    heading: PREMIUM_SECTION_HEADINGS[kind],
    body: body.trim(),
    ...(figures?.length ? { figures } : {}),
  };
}

function isLikelyClinicalTopic(lesson: Pick<LessonRow, "title" | "topic" | "bodySystem">): boolean {
  const t = `${lesson.title} ${lesson.topic} ${lesson.bodySystem}`.toLowerCase();
  if (t.includes("priorit") || t.includes("delegat") || t.includes("safety")) return false;
  return true;
}

function sectionTextOrFallback(map: Map<string, PathwayLessonSection>, ...kinds: string[]): string {
  for (const k of kinds) {
    const body = map.get(k)?.body?.trim();
    if (body) return body;
  }
  return "";
}

function buildPremiumSections(args: {
  lesson: LessonRow;
  current: PathwayLessonSection[];
  quizRationaleParagraphs: string[];
  mediaFigures: PathwayLessonFigure[];
}): PathwayLessonSection[] {
  const m = sectionMap(args.current);
  const intro = sectionTextOrFallback(m, "introduction", "clinical_meaning", "intro");
  const pathoBase = sectionTextOrFallback(m, "pathophysiology_overview", "core_concept", "core");
  const signs = sectionTextOrFallback(m, "signs_symptoms", "clinical_scenario");
  const redFlags = sectionTextOrFallback(m, "red_flags", "exam_relevance", "exam_tips");
  const labs = sectionTextOrFallback(m, "labs_diagnostics");
  const nursing = sectionTextOrFallback(m, "nursing_assessment_interventions", "clinical_application", "core_concept");
  const pearls = sectionTextOrFallback(m, "clinical_pearls", "takeaways", "exam_relevance");
  const education = sectionTextOrFallback(m, "client_education", "takeaways");

  const pathoParagraphs = paragraphs(pathoBase);
  const rationaleParagraphs = args.quizRationaleParagraphs;
  const pathoCombined = [...pathoParagraphs, ...rationaleParagraphs].slice(0, 4);
  const pathoBody = pathoCombined.join("\n\n");

  const lessonLinks = [
    `[Topic lessons](${lessonsHref(args.lesson.topic, args.lesson.topicSlug, args.lesson.id)})`,
    `[Topic drill](${topicDrillHref(args.lesson.topic, args.lesson.id)})`,
    `[Readiness CAT](${catHref(args.lesson.topic, args.lesson.id)})`,
  ].join("\n");

  const out: PathwayLessonSection[] = [];
  out.push(ensureSection("introduction", intro || sectionTextOrFallback(m, "exam_relevance", "takeaways")));
  out.push(ensureSection("pathophysiology_overview", pathoBody));
  out.push(ensureSection("signs_symptoms", signs || rationaleParagraphs.slice(0, 2).join("\n\n")));
  out.push(ensureSection("red_flags", redFlags || rationaleParagraphs.slice(0, 2).join("\n\n")));
  out.push(ensureSection("labs_diagnostics", labs || "[not applicable]", args.mediaFigures));
  out.push(ensureSection("nursing_assessment_interventions", nursing || rationaleParagraphs.slice(0, 3).join("\n\n")));
  out.push(ensureSection("clinical_pearls", pearls || rationaleParagraphs.slice(0, 2).join("\n\n")));
  out.push(ensureSection("client_education", education || sectionTextOrFallback(m, "takeaways")));
  out.push(
    ensureSection(
      "tier_specific_relevance",
      sectionTextOrFallback(m, "exam_relevance") || "For RN boards, prioritize immediate safety actions, escalation timing, and delegation boundaries.",
    ),
  );
  out.push(ensureSection("country_specific_notes", "US NCLEX-RN framing and US standard terminology are used in this lesson."));
  out.push(ensureSection("related_next_steps", lessonLinks));
  return out;
}

function evaluateCompletion(args: {
  lesson: LessonRow;
  sections: PathwayLessonSection[];
  preQuestions: PathwayLessonQuizItem[];
  postQuestions: PathwayLessonQuizItem[];
}): { status: CompletionStatus; gaps: string[] } {
  const gaps: string[] = [];
  const m = sectionMap(args.sections);

  for (const kind of REQUIRED_SECTIONS) {
    const body = m.get(kind)?.body?.trim() ?? "";
    if (!body) gaps.push(`Missing section: ${kind}`);
  }

  if (isLikelyClinicalTopic(args.lesson)) {
    const patho = m.get("pathophysiology_overview")?.body ?? "";
    if (paragraphs(patho).length < 3) gaps.push("Pathophysiology requires at least 3 strong paragraphs.");
  }

  if (args.preQuestions.length < 3) gaps.push("Needs at least 3 pre-lesson questions.");
  if (args.postQuestions.length < 5) gaps.push("Needs at least 5 post-lesson questions.");
  if (args.postQuestions.filter((q) => !!q.rationale?.trim()).length < 5) {
    gaps.push("Post-lesson questions need rationales for at least 5 items.");
  }

  const totalWords = args.sections.reduce((sum, sec) => sum + words(sec.body), 0);
  if (totalWords < 280) return { status: "EMPTY", gaps: gaps.length ? gaps : ["Lesson body is too thin."] };
  if (gaps.length === 0) return { status: "COMPLETE", gaps: [] };
  return { status: "PARTIAL", gaps };
}

async function relatedQuestionRowsForLesson(pathwayId: string, lesson: LessonRow): Promise<
  Array<{
    id: string;
    stem: string;
    options: Prisma.JsonValue | null;
    correctAnswer: Prisma.JsonValue | null;
    questionType: string;
    rationale: string | null;
    images: Prisma.JsonValue | null;
  }>
> {
  const context = resolveLessonContextForPathwayId(pathwayId);
  const normalizedTopic = lesson.topic.trim();
  const slugPhrase = lesson.topicSlug.replace(/-/g, " ").trim();
  const tier =
    pathwayId.includes("-rn-") ? "RN" : pathwayId.includes("-pn-") || pathwayId.includes("-lpn-") || pathwayId.includes("-rpn-") ? "PN" : undefined;
  const examList =
    context.exam === "NCLEX_RN" || context.exam === "NCLEX_PN"
      ? [context.exam, "NCLEX"]
      : [context.exam];
  const where: Prisma.ExamQuestionWhereInput = {
    status: "published",
    exam: { in: examList },
    ...(tier ? { tier } : {}),
    ...(context.country !== "GLOBAL"
      ? {
          OR: [{ countryCode: context.country }, { countryCode: null }, { countryCode: "" }],
        }
      : {}),
    AND: [
      {
        OR: [
          { topic: { equals: normalizedTopic, mode: "insensitive" } },
          { subtopic: { equals: normalizedTopic, mode: "insensitive" } },
          { topic: { equals: slugPhrase, mode: "insensitive" } },
          { subtopic: { equals: slugPhrase, mode: "insensitive" } },
          { topic: { contains: slugPhrase, mode: "insensitive" } },
          { subtopic: { contains: slugPhrase, mode: "insensitive" } },
          { bodySystem: { contains: lesson.bodySystem, mode: "insensitive" } },
          { tags: { has: lesson.topicSlug } },
        ],
      },
    ],
  };
  return prisma.examQuestion.findMany({
    where,
    orderBy: [{ updatedAt: "desc" }],
    take: MAX_QUESTION_ROWS,
    select: {
      id: true,
      stem: true,
      options: true,
      correctAnswer: true,
      questionType: true,
      rationale: true,
      images: true,
    },
  });
}

function pickPrePost(quizItems: LessonBankQuizItem[]): { pre: PathwayLessonQuizItem[]; post: PathwayLessonQuizItem[] } {
  const pre = quizItems.slice(0, 4).map((q) => ({
    examQuestionId: q.examQuestionId,
    question: q.question,
    options: q.options,
    correct: q.correct,
    ...(q.rationale ? { rationale: q.rationale } : {}),
  }));
  const post = quizItems.slice(4, 12).map((q) => ({
    examQuestionId: q.examQuestionId,
    question: q.question,
    options: q.options,
    correct: q.correct,
    ...(q.rationale ? { rationale: q.rationale } : {}),
  }));
  return { pre, post };
}

function majorGapSummary(items: BatchItemResult[]): string[] {
  const counts = new Map<string, number>();
  for (const item of items) {
    for (const gap of item.gaps) {
      counts.set(gap, (counts.get(gap) ?? 0) + 1);
    }
  }
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([gap, n]) => `${gap} (${n})`);
}

export async function runLessonCompletionBatch(input: BatchInput): Promise<LessonCompletionBatchReport> {
  const batchSize = Math.max(MIN_BATCH_SIZE, Math.min(MAX_BATCH_SIZE, Math.floor(input.batchSize)));
  const write = Boolean(input.write);

  const lessonRows = await prisma.pathwayLesson.findMany({
    where: {
      pathwayId: input.pathwayId,
      locale: "en",
      status: ContentStatus.PUBLISHED,
    },
    select: {
      id: true,
      slug: true,
      title: true,
      topic: true,
      topicSlug: true,
      bodySystem: true,
      sections: true,
    },
    orderBy: [{ sortOrder: "asc" }, { slug: "asc" }],
    take: 2000,
  });

  const preScored: Array<{
    row: LessonRow;
    band: PriorityBand;
    status: CompletionStatus;
    score: number;
  }> = [];

  for (const row of lessonRows) {
    const sections = normalizeSections(row.sections);
    const roughWordCount = sections.reduce((sum, s) => sum + words(s.body), 0);
    const roughStatus: CompletionStatus = roughWordCount < 180 ? "EMPTY" : "PARTIAL";
    const band = rankBand(row);
    const score = bandOrder(band) * 100 + (roughStatus === "PARTIAL" ? 0 : 10);
    preScored.push({ row, band, status: roughStatus, score });
  }

  const selected = preScored
    .sort((a, b) => a.score - b.score || a.row.slug.localeCompare(b.row.slug))
    .slice(0, batchSize);

  const items: BatchItemResult[] = [];

  for (const pick of selected) {
    const currentSections = normalizeSections(pick.row.sections);
    const questionRows = await relatedQuestionRowsForLesson(input.pathwayId, pick.row);
    const quizItems = questionRows.map(examRowToLessonBankItem).filter((x): x is LessonBankQuizItem => Boolean(x));
    const { pre, post } = pickPrePost(quizItems);
    const rationaleParagraphs = buildQuestionBackedParagraphs(quizItems);
    const mediaFigures = extractImagesFromQuestionRows(questionRows);
    const upgradedSections = buildPremiumSections({
      lesson: pick.row,
      current: currentSections,
      quizRationaleParagraphs: rationaleParagraphs,
      mediaFigures,
    });

    const beforeEval = evaluateCompletion({ lesson: pick.row, sections: currentSections, preQuestions: pre, postQuestions: post });
    const afterEval = evaluateCompletion({ lesson: pick.row, sections: upgradedSections, preQuestions: pre, postQuestions: post });
    const updated = JSON.stringify(currentSections) !== JSON.stringify(upgradedSections);

    if (write && updated) {
      await prisma.pathwayLesson.update({
        where: { id: pick.row.id },
        data: {
          sections: upgradedSections as unknown as Prisma.InputJsonValue,
        },
      });
    }

    items.push({
      lessonId: pick.row.id,
      slug: pick.row.slug,
      title: pick.row.title,
      topic: pick.row.topic,
      bodySystem: pick.row.bodySystem,
      priorityBand: pick.band,
      statusBefore: beforeEval.status,
      statusAfter: afterEval.status,
      updated,
      relatedQuestionCount: questionRows.length,
      preQuestionCount: pre.length,
      postQuestionCount: post.length,
      gaps: afterEval.gaps,
    });
  }

  const lessonsCompleted = items.filter((i) => i.statusAfter === "COMPLETE").length;
  const lessonsUpdated = items.filter((i) => i.updated).length;
  const lessonsStillPartial = items.filter((i) => i.statusAfter !== "COMPLETE").length;

  return {
    pathwayId: input.pathwayId,
    batchSize: items.length,
    write,
    selectedAt: new Date().toISOString(),
    lessonsCompleted,
    lessonsUpdated,
    lessonsStillPartial,
    majorGapsRemaining: majorGapSummary(items),
    items,
  };
}
