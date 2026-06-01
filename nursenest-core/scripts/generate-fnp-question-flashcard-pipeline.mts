#!/usr/bin/env npx tsx
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import crypto from "node:crypto";
import { config as loadDotenv } from "dotenv";
import OpenAI from "openai";
import { z } from "zod";
import {
  ContentStatus,
  CountryCode,
  ExamFamily,
  FlashcardDeckVisibility,
  PrismaClient,
  TierCode,
  type Prisma,
} from "@prisma/client";

type Lesson = {
  id?: string;
  slug: string;
  title: string;
  topic: string;
  topicSlug: string;
  bodySystem: string;
  sections: LessonSection[];
  sortOrder?: number;
  structuralPublicComplete?: boolean;
};

type LessonSection = {
  id: string;
  heading: string;
  kind: string;
  body: string;
};

type GeneratedQuestion = {
  stem: string;
  questionType: "MCQ" | "SATA";
  options: string[];
  correctAnswer: string | string[];
  rationale: string;
  distractorRationales: Record<string, string>;
  clinicalPearl: string;
  keyTakeaway: string;
  examStrategy: string;
  cognitiveLevel: "apply" | "analyze" | "evaluate";
  difficulty: 2 | 3 | 4 | 5;
  blueprintDomain: FnpBlueprintDomain;
  lifespanFocus: "adult" | "pediatrics" | "women" | "geriatrics" | "family";
};

type GeneratedFlashcard = {
  front: string;
  back: string;
  hint: string;
  blueprintDomain: FnpBlueprintDomain;
};

type FnpBlueprintDomain =
  | "assessment"
  | "diagnosis"
  | "planning"
  | "evaluation"
  | "pediatrics"
  | "adult"
  | "women"
  | "geriatrics"
  | "pharmacology"
  | "professional role";

type LessonGeneration = {
  slug: string;
  questions: GeneratedQuestion[];
  flashcards: GeneratedFlashcard[];
};

type PipelineStats = {
  selectedLessons: number;
  productionReadyLessonsFirst: number;
  questionsCreated: number;
  questionsUpdated: number;
  flashcardsCreated: number;
  flashcardsUpdated: number;
  lessonsCompleted: number;
  failures: Array<{ lessonSlug: string; error: string }>;
};

const APPLY = process.argv.includes("--apply");
const OVERWRITE = process.argv.includes("--overwrite");
const QUESTION_TARGET = readNumberFlag("--question-target", 5000);
const FLASHCARD_TARGET = readNumberFlag("--flashcard-target", 2000);
const QUESTIONS_PER_LESSON = readNumberFlag("--questions-per-lesson", 25);
const FLASHCARDS_PER_LESSON = readNumberFlag("--flashcards-per-lesson", 20);
const PRODUCTION_READY_FIRST = readNumberFlag("--production-ready-first", 104);
const BATCH_SIZE = readNumberFlag("--batch-size", 5);
const MODEL = readStringFlag("--model", process.env.FNP_GENERATION_MODEL ?? "gpt-4.1-mini");

const PATHWAY_ID = "us-np-fnp";
const REPORT_PATH = resolve(process.cwd(), "docs/reports/fnp-question-generation-pipeline.md");
const CHECKPOINT_PATH = resolve(process.cwd(), ".cache/fnp-question-generation-pipeline.json");

const BLUEPRINT_DOMAINS: FnpBlueprintDomain[] = [
  "assessment",
  "diagnosis",
  "planning",
  "evaluation",
  "pediatrics",
  "adult",
  "women",
  "geriatrics",
  "pharmacology",
  "professional role",
];

const generatedQuestionSchema = z.object({
  stem: z.string().min(45).max(1500),
  questionType: z.enum(["MCQ", "SATA"]),
  options: z.array(z.string().min(3).max(500)).min(4).max(5),
  correctAnswer: z.union([z.string().min(1), z.array(z.string().min(1)).min(2).max(4)]),
  rationale: z.string().min(220),
  distractorRationales: z.record(z.string().min(20).max(700)),
  clinicalPearl: z.string().min(20).max(500),
  keyTakeaway: z.string().min(20).max(500),
  examStrategy: z.string().min(20).max(500),
  cognitiveLevel: z.enum(["apply", "analyze", "evaluate"]),
  difficulty: z.union([z.literal(2), z.literal(3), z.literal(4), z.literal(5)]),
  blueprintDomain: z.enum(BLUEPRINT_DOMAINS as [FnpBlueprintDomain, ...FnpBlueprintDomain[]]),
  lifespanFocus: z.enum(["adult", "pediatrics", "women", "geriatrics", "family"]),
});

const generatedFlashcardSchema = z.object({
  front: z.string().min(18).max(180),
  back: z.string().min(35).max(650),
  hint: z.string().min(3).max(120),
  blueprintDomain: z.enum(BLUEPRINT_DOMAINS as [FnpBlueprintDomain, ...FnpBlueprintDomain[]]),
});

const lessonGenerationSchema = z.object({
  questions: z.array(generatedQuestionSchema),
  flashcards: z.array(generatedFlashcardSchema),
});

function readNumberFlag(name: string, fallback: number): number {
  const prefix = `${name}=`;
  const arg = process.argv.find((value) => value.startsWith(prefix));
  if (!arg) return fallback;
  const parsed = Number.parseInt(arg.slice(prefix.length), 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

function readStringFlag(name: string, fallback: string): string {
  const prefix = `${name}=`;
  const arg = process.argv.find((value) => value.startsWith(prefix));
  return arg ? arg.slice(prefix.length) : fallback;
}

function hashStem(stem: string): string {
  return crypto
    .createHash("sha256")
    .update(stem.toLowerCase().replace(/\s+/g, " ").trim())
    .digest("hex");
}

function sourceKey(kind: "question" | "flashcard", lessonSlug: string, index: number): string {
  return `fnp:${kind}:${lessonSlug}:${index}`;
}

function ensureDir(filePath: string): void {
  mkdirSync(resolve(filePath, ".."), { recursive: true });
}

function loadCheckpoint(): Map<string, LessonGeneration> {
  if (!existsSync(CHECKPOINT_PATH)) return new Map();
  const raw = JSON.parse(readFileSync(CHECKPOINT_PATH, "utf8")) as Record<string, LessonGeneration>;
  return new Map(Object.entries(raw));
}

function saveCheckpoint(checkpoint: Map<string, LessonGeneration>): void {
  ensureDir(CHECKPOINT_PATH);
  writeFileSync(CHECKPOINT_PATH, `${JSON.stringify(Object.fromEntries(checkpoint), null, 2)}\n`, "utf8");
}

function stripHtml(input: string): string {
  return input.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

function lessonContext(lesson: Lesson): string {
  const sections = lesson.sections
    .slice(0, 8)
    .map((section) => `${section.heading}\n${stripHtml(section.body).slice(0, 1400)}`)
    .join("\n\n");
  return [
    `Lesson: ${lesson.title}`,
    `Slug: ${lesson.slug}`,
    `Topic: ${lesson.topic}`,
    `Body system: ${lesson.bodySystem}`,
    "",
    sections,
  ].join("\n");
}

function lessonPriority(lesson: Lesson): number {
  const haystack = `${lesson.title} ${lesson.topic} ${lesson.bodySystem} ${lesson.sections.map((s) => `${s.heading} ${s.body}`).join(" ")}`.toLowerCase();
  let score = lesson.structuralPublicComplete ? 50 : 0;
  if (/(diagnosis|differential|workup|red flag|diagnostic)/.test(haystack)) score += 20;
  if (/(prescribing|pharmacology|medication|drug|insulin|antibiotic|contraception)/.test(haystack)) score += 18;
  if (/(pediatric|child|adolescent|infant|newborn)/.test(haystack)) score += 10;
  if (/(women|pregnancy|contraception|prenatal|uterine|cervical|vaginitis)/.test(haystack)) score += 10;
  if (/(older adult|geriatric|elderly|frailty|dementia|polypharmacy)/.test(haystack)) score += 10;
  if (/(assessment|management|evaluation|planning|primary care)/.test(haystack)) score += 10;
  return score;
}

function selectLessons(lessons: Lesson[]): Lesson[] {
  const eligible = lessons.filter((lesson) => lesson.sections.length > 0 && lesson.sections.some((section) => stripHtml(section.body).length >= 250));
  const sorted = eligible.sort((a, b) => {
    const readyDelta = Number(Boolean(b.structuralPublicComplete)) - Number(Boolean(a.structuralPublicComplete));
    if (readyDelta) return readyDelta;
    return lessonPriority(b) - lessonPriority(a);
  });
  const neededForQuestions = Math.ceil(QUESTION_TARGET / QUESTIONS_PER_LESSON);
  const neededForCards = Math.ceil(FLASHCARD_TARGET / FLASHCARDS_PER_LESSON);
  return sorted.slice(0, Math.max(neededForQuestions, neededForCards, PRODUCTION_READY_FIRST));
}

async function loadDbLessons(prisma: PrismaClient): Promise<Lesson[]> {
  const rows = await prisma.pathwayLesson.findMany({
    where: {
      pathwayId: PATHWAY_ID,
      status: ContentStatus.PUBLISHED,
      deprecatedAt: null,
      locale: "en",
    },
    orderBy: [{ structuralPublicComplete: "desc" }, { sortOrder: "asc" }, { updatedAt: "desc" }],
    select: {
      id: true,
      slug: true,
      title: true,
      topic: true,
      topicSlug: true,
      bodySystem: true,
      sections: true,
      sortOrder: true,
      structuralPublicComplete: true,
    },
  });
  return rows.map((row) => ({
    ...row,
    sections: normalizeSections(row.sections),
  }));
}

function normalizeSections(value: Prisma.JsonValue): LessonSection[] {
  if (!Array.isArray(value)) return [];
  return value
    .map((section) => {
      if (!section || typeof section !== "object") return null;
      const row = section as Record<string, unknown>;
      return {
        id: String(row.id ?? row.heading ?? "section"),
        heading: String(row.heading ?? "Section"),
        kind: String(row.kind ?? "concept"),
        body: String(row.body ?? ""),
      };
    })
    .filter((section): section is LessonSection => Boolean(section?.body.trim()));
}

function loadStaticLessons(): Lesson[] {
  const files = [
    "src/content/pathway-lessons/np-core-catalog.json",
    "src/content/pathway-lessons/np-parity-expansion-catalog.json",
  ];
  const lessons: Lesson[] = [];
  const seen = new Set<string>();
  for (const file of files) {
    if (!existsSync(file)) continue;
    const data = JSON.parse(readFileSync(file, "utf8")) as {
      lessons?: unknown[];
      pathways?: Record<string, unknown[]>;
    };
    const rows = [
      ...(Array.isArray(data.lessons) ? data.lessons : []),
      ...(Array.isArray(data.pathways?.[PATHWAY_ID]) ? data.pathways[PATHWAY_ID] : []),
    ];
    for (const row of rows) {
      if (!row || typeof row !== "object") continue;
      const raw = row as Record<string, unknown>;
      const slug = String(raw.slug ?? "");
      if (!slug || seen.has(slug)) continue;
      seen.add(slug);
      lessons.push({
        slug,
        title: String(raw.title ?? slug),
        topic: String(raw.topic ?? raw.bodySystem ?? "FNP"),
        topicSlug: String(raw.topicSlug ?? raw.bodySystem ?? "fnp").toLowerCase().replace(/[^a-z0-9]+/g, "-"),
        bodySystem: String(raw.bodySystem ?? raw.topic ?? "FNP"),
        sections: normalizeSections(raw.sections as Prisma.JsonValue),
        structuralPublicComplete: true,
      });
    }
  }
  return lessons;
}

function promptForLesson(lesson: Lesson, questionCount: number, flashcardCount: number): string {
  return `Generate production-ready FNP certification study content from this existing NurseNest lesson only.

Required output:
- Exactly ${questionCount} questions.
- Exactly ${flashcardCount} flashcards.
- Every item must include one blueprintDomain from: ${BLUEPRINT_DOMAINS.join(", ")}.
- Use FNP scope: differential diagnosis, advanced assessment, diagnostics, pharmacology/prescribing safety, guideline-based management, follow-up, referral red flags, patient education, and professional role boundaries.
- Do not invent unsupported facts beyond standard primary care knowledge.
- No placeholder text. No generic "review this topic" cards.
- Questions must be board-style, clinically plausible, and tied to the lesson.
- MCQ must have exactly 4 options. SATA must have exactly 5 options and 2-4 correct answers.
- Correct answers must exactly match option text.
- Rationale must explain why the correct answer is best and why distractors are wrong.

Return JSON only:
{
  "questions": [
    {
      "stem": "string",
      "questionType": "MCQ" | "SATA",
      "options": ["string"],
      "correctAnswer": "string" | ["string"],
      "rationale": "string",
      "distractorRationales": { "wrong option text": "string" },
      "clinicalPearl": "string",
      "keyTakeaway": "string",
      "examStrategy": "string",
      "cognitiveLevel": "apply" | "analyze" | "evaluate",
      "difficulty": 2 | 3 | 4 | 5,
      "blueprintDomain": "assessment|diagnosis|planning|evaluation|pediatrics|adult|women|geriatrics|pharmacology|professional role",
      "lifespanFocus": "adult|pediatrics|women|geriatrics|family"
    }
  ],
  "flashcards": [
    {
      "front": "string",
      "back": "string",
      "hint": "string",
      "blueprintDomain": "assessment|diagnosis|planning|evaluation|pediatrics|adult|women|geriatrics|pharmacology|professional role"
    }
  ]
}

Existing lesson source:
${lessonContext(lesson)}`;
}

function parseJson(content: string): unknown {
  const cleaned = content.replace(/^```(?:json)?/i, "").replace(/```$/i, "").trim();
  const start = cleaned.indexOf("{");
  const end = cleaned.lastIndexOf("}");
  if (start < 0 || end < start) throw new Error("AI response did not contain a JSON object.");
  return JSON.parse(cleaned.slice(start, end + 1));
}

function containsPlaceholder(text: string): boolean {
  return /\b(?:placeholder|lorem ipsum|todo|tbd|insert|sample only|not for production)\b/i.test(text);
}

function validateGeneration(lesson: Lesson, generation: LessonGeneration): LessonGeneration {
  const stems = new Set<string>();
  for (const [index, question] of generation.questions.entries()) {
    const text = `${question.stem} ${question.rationale} ${question.options.join(" ")}`;
    if (containsPlaceholder(text)) throw new Error(`${lesson.slug} question ${index + 1} contains placeholder text.`);
    if (stems.has(question.stem.toLowerCase())) throw new Error(`${lesson.slug} has duplicate generated stems.`);
    stems.add(question.stem.toLowerCase());
    if (question.questionType === "MCQ" && question.options.length !== 4) throw new Error(`${lesson.slug} MCQ does not have 4 options.`);
    if (question.questionType === "SATA" && question.options.length !== 5) throw new Error(`${lesson.slug} SATA does not have 5 options.`);
    const answers = Array.isArray(question.correctAnswer) ? question.correctAnswer : [question.correctAnswer];
    for (const answer of answers) {
      if (!question.options.includes(answer)) throw new Error(`${lesson.slug} correct answer is not present in options.`);
    }
  }
  const fronts = new Set<string>();
  for (const [index, card] of generation.flashcards.entries()) {
    const text = `${card.front} ${card.back}`;
    if (containsPlaceholder(text)) throw new Error(`${lesson.slug} flashcard ${index + 1} contains placeholder text.`);
    if (fronts.has(card.front.toLowerCase())) throw new Error(`${lesson.slug} has duplicate generated flashcard fronts.`);
    fronts.add(card.front.toLowerCase());
  }
  return generation;
}

async function generateForLesson(client: OpenAI, lesson: Lesson, checkpoint: Map<string, LessonGeneration>): Promise<LessonGeneration> {
  const existing = checkpoint.get(lesson.slug);
  if (
    existing &&
    existing.questions.length >= QUESTIONS_PER_LESSON &&
    existing.flashcards.length >= FLASHCARDS_PER_LESSON
  ) {
    return existing;
  }

  const result = await client.chat.completions.create({
    model: MODEL,
    temperature: 0.25,
    response_format: { type: "json_object" },
    messages: [
      {
        role: "system",
        content:
          "You are a senior FNP certification item writer. Produce clinically accurate, production-ready JSON only. Never use placeholders.",
      },
      {
        role: "user",
        content: promptForLesson(lesson, QUESTIONS_PER_LESSON, FLASHCARDS_PER_LESSON),
      },
    ],
  });
  const parsed = lessonGenerationSchema.parse(parseJson(result.choices[0]?.message.content ?? ""));
  const generation = validateGeneration(lesson, {
    slug: lesson.slug,
    questions: parsed.questions as GeneratedQuestion[],
    flashcards: parsed.flashcards as GeneratedFlashcard[],
  });
  checkpoint.set(lesson.slug, generation);
  saveCheckpoint(checkpoint);
  return generation;
}

async function ensureDeckAndCategories(prisma: PrismaClient): Promise<{
  deckId: string;
  defaultCategoryId: string;
  categoryByName: Map<string, string>;
}> {
  const deck = await prisma.flashcardDeck.upsert({
    where: { slug: "fnp-us-2026-production-ready" },
    update: {
      title: "FNP Certification Flashcards - Production Ready",
      status: ContentStatus.PUBLISHED,
      cardCount: FLASHCARD_TARGET,
    },
    create: {
      slug: "fnp-us-2026-production-ready",
      title: "FNP Certification Flashcards - Production Ready",
      description: "FNP flashcards generated from production-ready NurseNest lessons and mapped to blueprint domains.",
      country: CountryCode.US,
      tier: TierCode.NP,
      examFamily: ExamFamily.NP,
      pathwayId: PATHWAY_ID,
      visibility: FlashcardDeckVisibility.SUBSCRIBER,
      status: ContentStatus.PUBLISHED,
      cardCount: FLASHCARD_TARGET,
      sortOrder: 0,
    },
  });

  const existingCategories = await prisma.category.findMany({ select: { id: true, name: true } });
  const categoryByName = new Map(existingCategories.map((category) => [category.name.toLowerCase(), category.id]));
  let defaultCategoryId = categoryByName.get("fnp") ?? categoryByName.get("nurse practitioner") ?? existingCategories[0]?.id;
  if (!defaultCategoryId) {
    const category = await prisma.category.create({
      data: { name: "FNP", slug: "fnp" } as never,
      select: { id: true, name: true },
    });
    defaultCategoryId = category.id;
    categoryByName.set(category.name.toLowerCase(), category.id);
  }
  return { deckId: deck.id, defaultCategoryId, categoryByName };
}

async function publishLessonGeneration(
  prisma: PrismaClient,
  lesson: Lesson,
  generation: LessonGeneration,
  deckId: string,
  defaultCategoryId: string,
  categoryByName: Map<string, string>,
): Promise<Pick<PipelineStats, "questionsCreated" | "questionsUpdated" | "flashcardsCreated" | "flashcardsUpdated">> {
  const stats = { questionsCreated: 0, questionsUpdated: 0, flashcardsCreated: 0, flashcardsUpdated: 0 };
  const categoryId =
    categoryByName.get(lesson.topic.toLowerCase()) ??
    categoryByName.get(lesson.bodySystem.toLowerCase()) ??
    defaultCategoryId;

  for (const [index, question] of generation.questions.entries()) {
    const stemHash = hashStem(question.stem);
    const existing = await prisma.examQuestion.findFirst({
      where: {
        OR: [
          { stemHash },
          {
            tags: { has: sourceKey("question", lesson.slug, index) },
          },
        ],
      },
      select: { id: true },
    });
    const options = question.options.map((text, optionIndex) => ({
      id: String.fromCharCode(65 + optionIndex),
      text,
    }));
    const correctAnswer = Array.isArray(question.correctAnswer)
      ? question.correctAnswer.map((answer) => String.fromCharCode(65 + question.options.indexOf(answer)))
      : String.fromCharCode(65 + question.options.indexOf(question.correctAnswer));
    const data = {
      tier: "NP",
      exam: "FNP",
      questionType: question.questionType,
      status: "PUBLISHED",
      publishAt: new Date(),
      publishedAt: new Date(),
      stem: question.stem,
      options,
      correctAnswer,
      rationale: question.rationale,
      difficulty: question.difficulty,
      tags: [
        "pathway:us-np-fnp",
        "exam:FNP",
        "source:fnp-question-generation-pipeline",
        `lesson:${lesson.slug}`,
        `blueprint:${question.blueprintDomain}`,
        `lifespan:${question.lifespanFocus}`,
        sourceKey("question", lesson.slug, index),
      ],
      bodySystem: lesson.bodySystem,
      topic: lesson.topic,
      subtopic: lesson.title,
      regionScope: "US",
      stemHash,
      careerType: "nursing",
      clinicalPearl: question.clinicalPearl,
      examStrategy: question.examStrategy,
      distractorRationales: question.distractorRationales,
      countryCode: "US",
      regionCode: "US",
      licensingBody: "AANP/ANCC",
      languageCode: "en",
      cognitiveLevel: question.cognitiveLevel,
      questionFormat: question.questionType,
      isScenario: true,
      isMockExamEligible: true,
      isAdaptiveEligible: true,
      isFlashcardSource: true,
      isStudyGuideLinked: true,
      keyTakeaway: question.keyTakeaway,
      blueprintWeight: 1,
      nclexClientNeedsCategory: question.blueprintDomain,
      nclexClientNeedsSubcategory: lesson.title.slice(0, 128),
      studyLinkPathwayId: PATHWAY_ID,
      studyLinkLessonSlug: lesson.slug,
    } satisfies Prisma.ExamQuestionUncheckedCreateInput;
    if (existing) {
      if (OVERWRITE) {
        await prisma.examQuestion.update({ where: { id: existing.id }, data });
        stats.questionsUpdated++;
      }
    } else {
      await prisma.examQuestion.create({ data });
      stats.questionsCreated++;
    }
  }

  for (const [index, card] of generation.flashcards.entries()) {
    const cardSourceKey = sourceKey("flashcard", lesson.slug, index);
    const existing = await prisma.flashcard.findUnique({
      where: { sourceKey: cardSourceKey },
      select: { id: true },
    });
    const data = {
      front: card.front,
      back: `${card.back}\n\nBlueprint: ${card.blueprintDomain}`,
      country: CountryCode.US,
      tier: TierCode.NP,
      status: ContentStatus.PUBLISHED,
      examFamily: ExamFamily.NP,
      categoryId,
      lessonId: lesson.id,
      deckId,
      positionInDeck: index,
      sourceKey: cardSourceKey,
    } satisfies Prisma.FlashcardUncheckedCreateInput;
    if (existing) {
      if (OVERWRITE) {
        await prisma.flashcard.update({ where: { id: existing.id }, data });
        stats.flashcardsUpdated++;
      }
    } else {
      await prisma.flashcard.create({ data });
      stats.flashcardsCreated++;
    }
  }
  return stats;
}

function writeReport(params: {
  generatedAt: Date;
  mode: "apply" | "dry-run";
  blocker: string | null;
  selectedLessons: Lesson[];
  stats: PipelineStats;
}) {
  const lines = [
    "# FNP Question Generation Pipeline",
    "",
    `Generated: ${params.generatedAt.toISOString()}`,
    `Mode: ${params.mode}`,
    params.blocker ? `Blocker: ${params.blocker}` : null,
    "",
    "## Targets",
    "",
    `- Existing FNP pathway: \`${PATHWAY_ID}\``,
    `- Questions per lesson: ${QUESTIONS_PER_LESSON}`,
    `- Flashcards per lesson: ${FLASHCARDS_PER_LESSON}`,
    `- Question target: ${QUESTION_TARGET}+`,
    `- Flashcard target: ${FLASHCARD_TARGET}+`,
    `- Production-ready lessons prioritized first: ${PRODUCTION_READY_FIRST}`,
    "",
    "## Blueprint Domains",
    "",
    ...BLUEPRINT_DOMAINS.map((domain) => `- ${domain}`),
    "",
    "## Results",
    "",
    `- Lessons selected: ${params.stats.selectedLessons}`,
    `- Production-ready first block: ${params.stats.productionReadyLessonsFirst}`,
    `- Lessons completed: ${params.stats.lessonsCompleted}`,
    `- Questions created: ${params.stats.questionsCreated}`,
    `- Questions updated: ${params.stats.questionsUpdated}`,
    `- Flashcards created: ${params.stats.flashcardsCreated}`,
    `- Flashcards updated: ${params.stats.flashcardsUpdated}`,
    `- Failures: ${params.stats.failures.length}`,
    "",
    "## Selected Lesson Order",
    "",
    ...params.selectedLessons.slice(0, 220).map((lesson, index) => `${index + 1}. ${lesson.slug} - ${lesson.title}`),
    "",
    "## Quality Gates",
    "",
    "- No placeholder text accepted.",
    "- Correct answers must match option text.",
    "- MCQ requires exactly 4 options.",
    "- SATA requires exactly 5 options with 2-4 correct answers.",
    "- Every question and flashcard must include a blueprint domain.",
    "- Questions are linked to `studyLinkPathwayId=us-np-fnp` and the source lesson slug.",
  ].filter((line): line is string => line !== null);
  ensureDir(REPORT_PATH);
  writeFileSync(REPORT_PATH, `${lines.join("\n")}\n`, "utf8");
}

async function main(): Promise<void> {
  const generatedAt = new Date();
  loadDotenv({ path: resolve(process.cwd(), ".env.local"), override: false, quiet: true });
  const stats: PipelineStats = {
    selectedLessons: 0,
    productionReadyLessonsFirst: 0,
    questionsCreated: 0,
    questionsUpdated: 0,
    flashcardsCreated: 0,
    flashcardsUpdated: 0,
    lessonsCompleted: 0,
    failures: [],
  };

  let prisma: PrismaClient | null = null;
  let selectedLessons: Lesson[] = [];
  try {
    prisma = new PrismaClient({ log: ["error"] });
    const dbLessons = await loadDbLessons(prisma);
    selectedLessons = selectLessons(dbLessons);
  } catch (error) {
    const staticLessons = selectLessons(loadStaticLessons());
    selectedLessons = staticLessons;
    const message = error instanceof Error ? error.message : String(error);
    writeReport({
      generatedAt,
      mode: APPLY ? "apply" : "dry-run",
      blocker: `Database-backed production lesson load failed; static lesson inventory was inspected only. Publish blocked: ${message}`,
      selectedLessons,
      stats: {
        ...stats,
        selectedLessons: selectedLessons.length,
        productionReadyLessonsFirst: Math.min(PRODUCTION_READY_FIRST, selectedLessons.length),
      },
    });
    console.error(message);
    console.log(JSON.stringify({ ok: false, report: REPORT_PATH, reason: "DATABASE_LOAD_FAILED" }, null, 2));
    await prisma?.$disconnect().catch(() => {});
    return;
  }

  stats.selectedLessons = selectedLessons.length;
  stats.productionReadyLessonsFirst = Math.min(PRODUCTION_READY_FIRST, selectedLessons.length);

  if (!APPLY) {
    writeReport({ generatedAt, mode: "dry-run", blocker: null, selectedLessons, stats });
    console.log(JSON.stringify({ ok: true, apply: false, selectedLessons: selectedLessons.length, report: REPORT_PATH }, null, 2));
    await prisma.$disconnect();
    return;
  }

  const apiKey = process.env.OPENAI_API_KEY?.trim() || process.env.BLOG_OPENAI_API_KEY?.trim();
  if (!apiKey) {
    writeReport({
      generatedAt,
      mode: "apply",
      blocker: "OPENAI_API_KEY or BLOG_OPENAI_API_KEY is required to generate non-placeholder FNP questions.",
      selectedLessons,
      stats,
    });
    console.log(JSON.stringify({ ok: false, report: REPORT_PATH, reason: "OPENAI_API_KEY_MISSING" }, null, 2));
    await prisma.$disconnect();
    return;
  }

  const openai = new OpenAI({ apiKey });
  const checkpoint = loadCheckpoint();
  const { deckId, defaultCategoryId, categoryByName } = await ensureDeckAndCategories(prisma);

  const questionLessonCount = Math.ceil(QUESTION_TARGET / QUESTIONS_PER_LESSON);
  const flashcardLessonCount = Math.ceil(FLASHCARD_TARGET / FLASHCARDS_PER_LESSON);
  const processingLimit = Math.max(questionLessonCount, flashcardLessonCount, PRODUCTION_READY_FIRST);

  for (const lesson of selectedLessons.slice(0, processingLimit)) {
    try {
      const generation = await generateForLesson(openai, lesson, checkpoint);
      const publishStats = await publishLessonGeneration(
        prisma,
        lesson,
        generation,
        deckId,
        defaultCategoryId,
        categoryByName,
      );
      stats.questionsCreated += publishStats.questionsCreated;
      stats.questionsUpdated += publishStats.questionsUpdated;
      stats.flashcardsCreated += publishStats.flashcardsCreated;
      stats.flashcardsUpdated += publishStats.flashcardsUpdated;
      stats.lessonsCompleted += 1;
      writeReport({ generatedAt, mode: "apply", blocker: null, selectedLessons, stats });
      if (stats.questionsCreated + stats.questionsUpdated >= QUESTION_TARGET && stats.flashcardsCreated + stats.flashcardsUpdated >= FLASHCARD_TARGET) {
        break;
      }
    } catch (error) {
      stats.failures.push({
        lessonSlug: lesson.slug,
        error: error instanceof Error ? error.message : String(error),
      });
      writeReport({ generatedAt, mode: "apply", blocker: null, selectedLessons, stats });
    }
  }

  await prisma.flashcardDeck.update({
    where: { slug: "fnp-us-2026-production-ready" },
    data: {
      cardCount: await prisma.flashcard.count({
        where: { deckId, status: ContentStatus.PUBLISHED },
      }),
    },
  });

  writeReport({ generatedAt, mode: "apply", blocker: null, selectedLessons, stats });
  await prisma.$disconnect();
  console.log(JSON.stringify({ ok: true, report: REPORT_PATH, stats }, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
