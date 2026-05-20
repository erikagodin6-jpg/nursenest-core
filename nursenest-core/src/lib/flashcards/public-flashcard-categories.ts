import { formatTitleCase } from "@/lib/format/text-case";
type DeckInput = {
  title: string;
  description: string | null;
  tags: Array<{ slug: string; name: string }>;
  pathwayId?: string | null;
};

import {
  classifyLearningTopic,
  learningConfigForPathwayId,
  type LearningCategory,
} from "@/lib/pathways/pathway-learning-structure";

export type PublicFlashcardCategoryDefinition = LearningCategory;
export const PUBLIC_FLASHCARD_CATEGORIES = (pathwayId: string): PublicFlashcardCategoryDefinition[] =>
  learningConfigForPathwayId(pathwayId).categories;

function haystackFromDeck(deck: DeckInput): string {
  const tags = deck.tags.map((t) => `${t.slug} ${t.name}`).join(" ");
  return `${deck.title} ${deck.description ?? ""} ${tags}`.toLowerCase();
}

function hasAny(text: string, patterns: RegExp[]): boolean {
  return patterns.some((p) => p.test(text));
}

export function classifyPublicFlashcardDeck(deck: DeckInput): {
  categoryId: string;
  subcategoryId?: string;
  highYield: boolean;
} {
  const text = haystackFromDeck(deck);

  const highYield = hasAny(text, [/must[-\s]?know/i, /high[-\s]?yield/i, /priority/i, /urgent/i]);
  const classified = classifyLearningTopic(text, deck.pathwayId);
  return { ...classified, highYield };
}

export function lessonSlugFromSourceKey(sourceKey: string | null | undefined): string | null {
  if (!sourceKey || !sourceKey.startsWith("lesson:")) return null;
  const parts = sourceKey.split(":");
  const slug = parts[1]?.trim();
  return slug && slug.length > 0 ? slug : null;
}

export function lessonNameFromSlug(slug: string): string {
  const spaced = slug
    .split("-")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
  return formatTitleCase(spaced);
}

