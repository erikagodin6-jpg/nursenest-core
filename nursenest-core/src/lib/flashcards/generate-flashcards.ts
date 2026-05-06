import { ContentStatus, CountryCode, ExamFamily, Prisma, TierCode, type PrismaClient } from "@prisma/client";
import type { AccessScope } from "@/lib/entitlements/resolve-entitlement";
import { getCanonicalExamQuestionWhere } from "@/lib/study-question-pool/canonical-exam-question-where";
import {
  FLASHCARD_BUILDER_UNCATEGORIZED_ID,
  builderCategoryTitleForId,
  resolveBuilderCategoryId,
} from "@/lib/flashcards/flashcard-builder-taxonomy";

export const MIN_FLASHCARDS_PER_CATEGORY = 50;

const AUTO_FLASHCARD_SOURCE_PREFIX = "auto_exam_q";

type ExamQuestionForAutoFlashcard = {
  id: string;
  stem: string;
  correctAnswer: Prisma.JsonValue;
  rationale: string | null;
  bodySystem: string | null;
  topic: string | null;
  tags: string[];
  countryCode: string | null;
  tier: string;
  exam: string;
};

export type GeneratedQuestionFlashcard = {
  front: string;
  back: string;
  sourceType: "concept_recall" | "key_clinical_fact" | "clinical_pearl";
};

export type FlashcardCategoryGenerationLog = {
  category: string;
  existingCount: number;
  generated: number;
  total: number;
};

export type FlashcardGenerationSummary = {
  totalGenerated: number;
  categoriesFilled: string[];
  categoriesStillBelowThreshold: Array<{ category: string; total: number; minimum: number }>;
  logs: FlashcardCategoryGenerationLog[];
};

export type EnforceFlashcardCategoryMinimumsInput = {
  prisma: PrismaClient;
  entitlement: AccessScope;
  minimumPerCategory?: number;
  dryRun?: boolean;
};

function normalizeWhitespace(value: string): string {
  return value.replace(/\s+/g, " ").trim();
}

function truncate(value: string, max: number): string {
  const normalized = normalizeWhitespace(value);
  return normalized.length > max ? `${normalized.slice(0, max - 1)}…` : normalized;
}

function formatCorrectAnswer(value: Prisma.JsonValue): string {
  if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
    return String(value);
  }
  if (Array.isArray(value)) {
    return value
      .map((item) => {
        if (typeof item === "string" || typeof item === "number" || typeof item === "boolean") return String(item);
        return JSON.stringify(item);
      })
      .join(", ");
  }
  if (value && typeof value === "object") return JSON.stringify(value);
  return "";
}

function extractKeyConcept(rationale: string): string {
  const firstSentence = rationale
    .replace(/\s+/g, " ")
    .split(/(?<=[.!?])\s+/)
    .map((part) => part.trim())
    .find((part) => part.length >= 24);
  return truncate(firstSentence ?? rationale, 96);
}

export function generateFlashcardsFromQuestion(q: ExamQuestionForAutoFlashcard): GeneratedQuestionFlashcard[] {
  const rationale = q.rationale?.trim();
  if (!q.stem.trim() || !rationale) return [];

  const cards: GeneratedQuestionFlashcard[] = [];
  const correctAnswer = formatCorrectAnswer(q.correctAnswer);

  cards.push({
    sourceType: "concept_recall",
    front: q.stem,
    back: [correctAnswer ? `Correct answer: ${correctAnswer}` : null, rationale].filter(Boolean).join("\n\n"),
  });

  cards.push({
    sourceType: "key_clinical_fact",
    front: `Key concept: ${extractKeyConcept(rationale)}`,
    back: rationale,
  });

  const firstTag = q.tags.map((tag) => tag.trim()).find(Boolean);
  if (firstTag) {
    cards.push({
      sourceType: "clinical_pearl",
      front: `Clinical pearl (${firstTag})`,
      back: rationale,
    });
  }

  return cards;
}

function resolveQuestionCategory(q: Pick<ExamQuestionForAutoFlashcard, "bodySystem" | "topic" | "stem" | "rationale">): string {
  return (
    resolveBuilderCategoryId({
      label: q.bodySystem?.trim() || q.topic?.trim() || "General",
      examBodySystem: q.bodySystem,
      examTopic: q.topic,
      front: q.stem,
      back: q.rationale,
    }) || FLASHCARD_BUILDER_UNCATEGORIZED_ID
  );
}

function categorySlug(categoryId: string): string {
  return (categoryId.trim() || FLASHCARD_BUILDER_UNCATEGORIZED_ID)
    .toLowerCase()
    .replace(/[^a-z0-9_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function mapCountryCode(raw: string | null): CountryCode {
  return raw === "US" ? CountryCode.US : CountryCode.CA;
}

function mapTierCode(raw: string): TierCode {
  const normalized = raw.trim().toLowerCase();
  if (normalized === "rn") return TierCode.RN;
  if (normalized === "np" || normalized === "fnp" || normalized === "agpcnp") return TierCode.NP;
  if (normalized === "lvn" || normalized === "lpn") return TierCode.LVN_LPN;
  if (normalized === "allied") return TierCode.ALLIED;
  if (normalized === "new_grad" || normalized === "new-grad") return TierCode.NEW_GRAD;
  if (normalized === "pre_nursing" || normalized === "pre-nursing") return TierCode.PRE_NURSING;
  return TierCode.RPN;
}

function mapExamFamily(raw: string): ExamFamily {
  const normalized = raw.trim().toLowerCase().replace(/_/g, "-");
  if (normalized === "nclex-rn") return ExamFamily.NCLEX_RN;
  if (normalized === "nclex-pn") return ExamFamily.NCLEX_PN;
  if (normalized === "rex-pn") return ExamFamily.REX_PN;
  if (normalized.includes("np")) return ExamFamily.NP;
  if (normalized === "allied") return ExamFamily.ALLIED;
  return ExamFamily.GENERIC;
}

function sourceKeyFor(questionId: string, sourceType: GeneratedQuestionFlashcard["sourceType"]): string {
  return `${AUTO_FLASHCARD_SOURCE_PREFIX}:${questionId}:${sourceType}`;
}

function tagFrequency(rows: readonly ExamQuestionForAutoFlashcard[]): Map<string, number> {
  const counts = new Map<string, number>();
  for (const row of rows) {
    for (const tag of row.tags) {
      const key = tag.trim().toLowerCase();
      if (!key) continue;
      counts.set(key, (counts.get(key) ?? 0) + 1);
    }
  }
  return counts;
}

function rankQuestion(q: ExamQuestionForAutoFlashcard, tagCounts: Map<string, number>): number {
  return q.tags.reduce((sum, tag) => sum + (tagCounts.get(tag.trim().toLowerCase()) ?? 0), 0);
}

export async function enforceFlashcardCategoryMinimums(
  input: EnforceFlashcardCategoryMinimumsInput,
): Promise<FlashcardGenerationSummary> {
  const { prisma } = input;
  const minimum = input.minimumPerCategory ?? MIN_FLASHCARDS_PER_CATEGORY;
  const where = getCanonicalExamQuestionWhere(input.entitlement);

  const questions = await prisma.examQuestion.findMany({
    where: {
      AND: [where, { rationale: { not: null } }, { NOT: { rationale: "" } }],
    },
    select: {
      id: true,
      stem: true,
      correctAnswer: true,
      rationale: true,
      bodySystem: true,
      topic: true,
      tags: true,
      countryCode: true,
      tier: true,
      exam: true,
    },
    orderBy: [{ createdAt: "asc" }, { id: "asc" }],
  });

  const grouped = new Map<string, ExamQuestionForAutoFlashcard[]>();
  for (const question of questions) {
    const category = resolveQuestionCategory(question);
    const group = grouped.get(category) ?? [];
    group.push(question);
    grouped.set(category, group);
  }

  const logs: FlashcardCategoryGenerationLog[] = [];
  const categoriesFilled: string[] = [];
  const categoriesStillBelowThreshold: FlashcardGenerationSummary["categoriesStillBelowThreshold"] = [];
  let totalGenerated = 0;

  for (const [category, rows] of [...grouped.entries()].sort(([a], [b]) => a.localeCompare(b))) {
    const slug = categorySlug(category);
    const existingCount = await prisma.flashcard.count({
      where: { status: ContentStatus.PUBLISHED, category: { slug } },
    });
    let generated = 0;

    if (existingCount < minimum) {
      const existingQuestionRows = await prisma.flashcard.findMany({
        where: {
          category: { slug },
          examQuestionId: { not: null },
        },
        select: { examQuestionId: true },
      });
      const existingFlashcardQuestionIds = new Set(
        existingQuestionRows
          .map((row) => row.examQuestionId)
          .filter((id): id is string => typeof id === "string" && id.length > 0),
      );
      const needed = minimum - existingCount;
      const tagCounts = tagFrequency(rows);
      const unused = rows
        .filter((q) => !existingFlashcardQuestionIds.has(q.id))
        .sort((a, b) => rankQuestion(b, tagCounts) - rankQuestion(a, tagCounts) || a.id.localeCompare(b.id));

      const categoryRow = input.dryRun
        ? null
        : await prisma.category.upsert({
            where: { slug },
            create: {
              slug,
              name: builderCategoryTitleForId(null, category),
              topicCode: category,
            },
            update: {
              name: builderCategoryTitleForId(null, category),
              topicCode: category,
            },
          });

      const data: Prisma.FlashcardCreateManyInput[] = [];
      for (const q of unused) {
        const generatedCards = generateFlashcardsFromQuestion(q);
        for (const card of generatedCards) {
          if (data.length >= needed) break;
          data.push({
            front: card.front,
            back: card.back,
            country: mapCountryCode(q.countryCode),
            tier: mapTierCode(q.tier),
            status: ContentStatus.PUBLISHED,
            examFamily: mapExamFamily(q.exam),
            categoryId: categoryRow?.id ?? "__dry_run_category__",
            sourceKey: sourceKeyFor(q.id, card.sourceType),
            examQuestionId: q.id,
            questionStem: q.stem,
            correctAnswer: formatCorrectAnswer(q.correctAnswer),
            rationaleCorrect: q.rationale,
          });
        }
        if (data.length >= needed) break;
      }

      if (input.dryRun) {
        generated = data.length;
      } else if (data.length > 0) {
        const result = await prisma.flashcard.createMany({ data, skipDuplicates: true });
        generated = result.count;
      }
    }

    const total = input.dryRun
      ? existingCount + generated
      : await prisma.flashcard.count({ where: { status: ContentStatus.PUBLISHED, category: { slug } } });
    const log = { category, existingCount, generated, total };
    logs.push(log);
    console.log(log);
    totalGenerated += generated;
    if (existingCount < minimum && total >= minimum) {
      categoriesFilled.push(category);
    }
    if (total < minimum) {
      categoriesStillBelowThreshold.push({ category, total, minimum });
    }
  }

  return { totalGenerated, categoriesFilled, categoriesStillBelowThreshold, logs };
}
