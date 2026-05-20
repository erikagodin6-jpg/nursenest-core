import { z } from "zod";

/** High-level lesson archetype for prompts and tagging. */
export const adminAiLessonTypeSchema = z.enum([
  "disease",
  "syndrome",
  "medication",
  "safety",
  "prioritization",
  "delegation",
  "diagnostics_labs",
  "intervention_procedure",
  "case_study",
]);

export type AdminAiLessonType = z.infer<typeof adminAiLessonTypeSchema>;

/** Pathway / exam track (aligned with blog admin exam options). */
export const adminAiLessonPathwaySchema = z.enum([
  "NCLEX-RN",
  "NCLEX-PN",
  "REx-PN",
  "NP-US",
  "CNPLE",
  "Allied",
]);

export type AdminAiLessonPathway = z.infer<typeof adminAiLessonPathwaySchema>;

export const adminAiLessonDifficultySchema = z.enum(["foundation", "intermediate", "advanced"]).optional();

const bodyBlockSchema = z.object({
  sectionTitle: z.string().min(2).max(200),
  /** HTML-safe teaching content (paragraphs, lists). No script tags. */
  content: z.string().min(40).max(50_000),
});

export const adminAiGeneratedLessonSchema = z.object({
  title: z.string().min(8).max(220),
  slug: z
    .string()
    .min(3)
    .max(120)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must be kebab-case"),
  shortDescription: z.string().min(40).max(600),
  pathwayAwareIntro: z.string().min(80).max(12_000),
  structuredBody: z.array(bodyBlockSchema).min(3).max(14),
  keyPoints: z.array(z.string().min(8).max(500)).min(3).max(16),
  redFlags: z.array(z.string().min(8).max(500)).min(2).max(12),
  priorities: z.array(z.string().min(8).max(500)).min(2).max(12),
  internalLinkSuggestions: z
    .array(
      z.object({
        label: z.string().min(2).max(200),
        suggestedPath: z.string().min(2).max(500),
        rationale: z.string().min(15).max(800),
      }),
    )
    .min(2)
    .max(12),
  endOfLessonCtas: z
    .array(
      z.object({
        label: z.string().min(2).max(120),
        suggestedHref: z.string().min(2).max(500),
        copy: z.string().min(20).max(400),
      }),
    )
    .min(1)
    .max(6),
  metadata: z.object({
    suggestedTags: z.array(z.string().min(2).max(80)).max(24),
    suggestedBodySystem: z.string().max(120).nullable().optional(),
    clinicalPearl: z.string().max(2000).nullable().optional(),
    safetyNote: z.string().max(2000).nullable().optional(),
  }),
});

export type AdminAiGeneratedLesson = z.infer<typeof adminAiGeneratedLessonSchema>;

/** Stored on `GeneratedLessonDraft.normalizedJson` with generation context. */
export type AdminAiLessonDraftNormalized = {
  version: 1;
  inputs: {
    topic: string;
    pathway: AdminAiLessonPathway;
    country: "CA" | "US";
    topicDomain: string;
    lessonType: AdminAiLessonType;
    difficulty?: "foundation" | "intermediate" | "advanced";
    relatedCategoryLabels: string[];
  };
  lesson: AdminAiGeneratedLesson;
  /** ISO timestamps for audit */
  generatedAt: string;
  lastSectionRegenAt?: string;
};

/** Sections the UI/API can regenerate independently. */
export const adminAiLessonRegenerateSectionSchema = z.discriminatedUnion("section", [
  z.object({ section: z.literal("title_slug_summary") }),
  z.object({ section: z.literal("intro") }),
  z.object({ section: z.literal("structured_body"), bodyIndex: z.number().int().min(0).max(20) }),
  z.object({ section: z.literal("structured_body_all") }),
  z.object({ section: z.literal("key_points") }),
  z.object({ section: z.literal("red_flags") }),
  z.object({ section: z.literal("priorities") }),
  z.object({ section: z.literal("internal_links") }),
  z.object({ section: z.literal("ctas") }),
  z.object({ section: z.literal("metadata") }),
]);

export type AdminAiLessonRegenerateSection = z.infer<typeof adminAiLessonRegenerateSectionSchema>;
