/**
 * Shared taxonomy enforcement for content writes (exam, blog, flashcards, legacy ContentItem lessons).
 * Uses only {@link classifyStrings} + {@link validateClassification}; no alternate sources.
 */

import type { PrismaClient } from "@prisma/client";
import type { ClassificationResult } from "@/lib/taxonomy/classifier";
import { classifyStrings } from "@/lib/taxonomy/classifier";
import { REVIEW_REQUIRED } from "@/lib/taxonomy/taxonomy";
import { validateClassification } from "@/lib/taxonomy/validate";

export function classifyExamQuestionCorpus(input: {
  stem: string;
  rationale?: string | null;
  topic?: string | null;
  subtopic?: string | null;
  tags?: string[] | null;
}): ClassificationResult {
  const content = [input.rationale, input.topic, input.subtopic].filter(Boolean).join("\n");
  return classifyStrings({
    title: input.stem,
    content,
    keywords: input.tags ?? [],
  });
}

export function classifyBlogCorpus(input: {
  title: string;
  body: string;
  category?: string | null;
  tags?: string[];
}): ClassificationResult {
  const kw = [...(input.tags ?? [])];
  if (input.category?.trim()) kw.push(input.category.trim());
  return classifyStrings({
    title: input.title,
    content: input.body,
    keywords: kw,
  });
}

export function classifyFlashcardCorpus(input: { front: string; back: string; extra?: string | null }): ClassificationResult {
  return classifyStrings({
    title: input.front,
    content: input.back,
    keywords: input.extra?.trim() ? [input.extra.trim()] : [],
  });
}

export function collectClassificationViolations(c: ClassificationResult): string[] {
  try {
    validateClassification(c);
    return [];
  } catch (e) {
    return [e instanceof Error ? e.message : String(e)];
  }
}

/** True when content must not go live (ambiguous corpus or structurally invalid classification). */
export function isPublishBlockedByTaxonomy(c: ClassificationResult): boolean {
  if (collectClassificationViolations(c).length > 0) return true;
  return c.domain === "REVIEW_PENDING" || c.category === REVIEW_REQUIRED;
}

export function normalizedTaxonomyCategory(c: ClassificationResult): string {
  return c.category;
}

export function slugifyTaxonomyLeafForCategoryRow(leaf: string): string {
  if (leaf === REVIEW_REQUIRED) return "review-required";
  return leaf
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

type CategoryDb = Pick<PrismaClient, "category">;

export async function resolveCategoryIdForTaxonomyLeaf(db: CategoryDb, leaf: string): Promise<string | null> {
  const slugKebab = slugifyTaxonomyLeafForCategoryRow(leaf);
  const slugUnderscore = leaf === REVIEW_REQUIRED ? null : leaf;
  return (
    (
      await db.category.findFirst({
        where: {
          OR: [
            { slug: slugKebab },
            ...(slugUnderscore ? [{ slug: slugUnderscore }, { topicCode: slugUnderscore }] : []),
            { topicCode: leaf },
          ],
        },
        select: { id: true },
      })
    )?.id ?? null
  );
}

/**
 * Ensures a `Category` row exists for FK writes (flashcards). Slug/topicCode align with classifier leaves.
 */
export async function ensureCategoryIdForTaxonomyLeaf(
  db: CategoryDb,
  leaf: string,
): Promise<{ id: string }> {
  const slug = slugifyTaxonomyLeafForCategoryRow(leaf);
  const name =
    leaf === REVIEW_REQUIRED
      ? "Review required"
      : leaf.replace(/_/g, " ").replace(/\b\w/g, (ch) => ch.toUpperCase());
  return db.category.upsert({
    where: { slug },
    create: { slug, name, topicCode: leaf },
    update: {},
    select: { id: true },
  });
}

export type ExamQuestionTaxonomyWriteResult = {
  classification: ClassificationResult;
  bodySystem: string;
  violations: string[];
  publishable: boolean;
};

export function examQuestionTaxonomyFromCorpus(input: {
  stem: string;
  rationale?: string | null;
  topic?: string | null;
  subtopic?: string | null;
  tags?: string[] | null;
}): ExamQuestionTaxonomyWriteResult {
  const classification = classifyExamQuestionCorpus(input);
  const violations = collectClassificationViolations(classification);
  const publishable = violations.length === 0 && !isPublishBlockedByTaxonomy(classification);
  return {
    classification,
    bodySystem: normalizedTaxonomyCategory(classification),
    violations,
    publishable,
  };
}

/** `ContentItem` lesson rows — title + summary + body + tags + optional authoring hints (not a second taxonomy). */
export function classifyContentItemLessonCorpus(input: {
  title: string;
  summary?: string | null;
  body: string;
  tags?: string[] | null;
  topicHint?: string | null;
  systemHint?: string | null;
  categoryHint?: string | null;
}): ClassificationResult {
  const kw = [...(input.tags ?? []), input.topicHint, input.systemHint, input.categoryHint].filter(
    (x): x is string => Boolean(x && String(x).trim()),
  ) as string[];
  return classifyStrings({
    title: input.title,
    content: [input.summary, input.body].filter(Boolean).join("\n"),
    keywords: kw,
  });
}

export function contentItemLessonTaxonomyFromCorpus(input: {
  title: string;
  summary?: string | null;
  body: string;
  tags?: string[] | null;
  topicHint?: string | null;
  systemHint?: string | null;
  categoryHint?: string | null;
}): ExamQuestionTaxonomyWriteResult {
  const classification = classifyContentItemLessonCorpus(input);
  const violations = collectClassificationViolations(classification);
  const publishable = violations.length === 0 && !isPublishBlockedByTaxonomy(classification);
  return {
    classification,
    bodySystem: normalizedTaxonomyCategory(classification),
    violations,
    publishable,
  };
}

export async function resolveFlashcardCategoryIdFromClassification(
  db: CategoryDb,
  c: ClassificationResult,
): Promise<{ ok: true; categoryId: string } | { ok: false; error: string }> {
  const viol = collectClassificationViolations(c);
  if (viol.length > 0) return { ok: false, error: viol[0] ?? "taxonomy_invalid" };
  const leaf = c.category;
  const existing = await resolveCategoryIdForTaxonomyLeaf(db, leaf);
  if (existing) return { ok: true, categoryId: existing };
  const created = await ensureCategoryIdForTaxonomyLeaf(db, leaf);
  return { ok: true, categoryId: created.id };
}
