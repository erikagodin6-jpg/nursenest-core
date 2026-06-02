import type { BlogFunnelStage, BlogPostIntent, BlogPostTemplate } from "@prisma/client";
import { z } from "zod";
import { ADMIN_BLOG_GENERATE_AI_MAX_TOPICS_PER_RUN } from "@/lib/admin/blog-generate-ai-constants";
import { GLOBAL_LOCALE_CODES, GLOBAL_REGION_SLUGS } from "@/lib/i18n/global-regions";

const BLOG_POST_TEMPLATE_ENUM = {
  HOW_TO_PASS: "HOW_TO_PASS",
  TOPIC_EXPLAINED: "TOPIC_EXPLAINED",
  TOP_MISTAKES: "TOP_MISTAKES",
  PRACTICE_QUESTIONS: "PRACTICE_QUESTIONS",
  STUDY_PLAN: "STUDY_PLAN",
  EXAM_GUIDE: "EXAM_GUIDE",
  MEDICATION_REVIEW: "MEDICATION_REVIEW",
  LAB_VALUES_GUIDE: "LAB_VALUES_GUIDE",
  DISEASE_PROCESS_EXPLAINER: "DISEASE_PROCESS_EXPLAINER",
  PRIORITIZATION_ARTICLE: "PRIORITIZATION_ARTICLE",
  COMPARISON_ARTICLE: "COMPARISON_ARTICLE",
  CHECKLIST_ARTICLE: "CHECKLIST_ARTICLE",
  FAQ_STYLE: "FAQ_STYLE",
  GLOSSARY: "GLOSSARY",
} as const satisfies Record<BlogPostTemplate, BlogPostTemplate>;

const BLOG_POST_INTENT_ENUM = {
  INFORMATIONAL: "INFORMATIONAL",
  EXAM_PREP: "EXAM_PREP",
  STUDY_STRATEGY: "STUDY_STRATEGY",
  COMPARISON: "COMPARISON",
  CONVERSION: "CONVERSION",
  PRACTICE_QUESTIONS: "PRACTICE_QUESTIONS",
  CHECKLIST: "CHECKLIST",
  CONCEPT_EXPLAINER: "CONCEPT_EXPLAINER",
} as const satisfies Record<BlogPostIntent, BlogPostIntent>;

const BLOG_FUNNEL_STAGE_ENUM = {
  AWARENESS: "AWARENESS",
  CONSIDERATION: "CONSIDERATION",
  CONVERSION: "CONVERSION",
  RETENTION: "RETENTION",
} as const satisfies Record<BlogFunnelStage, BlogFunnelStage>;

const adminBlogTopicSchema = z.preprocess(
  (v) => (typeof v === "string" ? v.replace(/\s+/g, " ").trim() : v),
  z.string().min(3, "Topic must be at least 3 non-whitespace characters.").max(500),
);

/** Shared body schema for legacy single-post AI draft + automation-log retries. */
export const blogSimpleAiDraftBodySchema = z.object({
  topic: adminBlogTopicSchema,
  keywords: z.string().max(400).optional(),
  exam: z.string().min(2).max(80),
  country: z.enum(["US", "CA", "unspecified"]).optional(),
  template: z.nativeEnum(BLOG_POST_TEMPLATE_ENUM),
  intent: z.nativeEnum(BLOG_POST_INTENT_ENUM).optional(),
  funnelStage: z.nativeEnum(BLOG_FUNNEL_STAGE_ENUM).optional(),
  tone: z.enum(["professional", "supportive", "direct"]).optional(),
  includeImage: z.boolean().optional(),
  includeAiImage: z.boolean().optional(),
  targetKeyword: z.string().max(200).optional(),
  keywordCluster: z.string().max(200).optional(),
  countryTarget: z.enum(["CA", "US"]).optional(),
  sourceRecords: z.array(
    z.object({
      authors: z.array(z.string()).optional(),
      year: z.string().optional(),
      title: z.string().optional(),
      source: z.string().optional(),
      publisher: z.string().optional(),
      /**
       * Hand-pasted JSON often has placeholders or partial URLs; strict `z.string().url()` surfaces as
       * opaque validation errors in admin. Accept empty/omit, otherwise require a parseable http(s) URL.
       */
      url: z
        .preprocess((v) => {
          if (v === undefined || v === null) return undefined;
          if (typeof v !== "string") return undefined;
          const t = v.trim();
          return t === "" ? undefined : t;
        }, z.union([z.undefined(), z.string().max(2048)]))
        .superRefine((val, ctx) => {
          if (val === undefined) return;
          try {
            const u = new URL(val);
            if (u.protocol !== "http:" && u.protocol !== "https:") {
              ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "Structured sources: each url must start with http:// or https:// (or omit url).",
              });
            }
          } catch {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message:
                "Structured sources: url must be a full valid link (e.g. https://cdc.gov/…) or remove the url field. Clear the JSON box if you are not using sources.",
            });
          }
        }),
      doi: z.string().optional(),
      authority: z
        .enum([
          "regulator",
          "guideline_body",
          "peer_reviewed",
          "academic_hospital",
          "association",
          "general_web",
          "low_authority",
        ])
        .optional(),
    }),
  ).optional(),
  /** Raw optional slug or title-like hint; server coerces via `coerceAdminOptionalSlugFromRawInput`. */
  slug: z.preprocess((v) => {
    if (v === undefined || v === null) return undefined;
    if (typeof v !== "string") return v;
    const t = v.trim();
    return t === "" ? undefined : t;
  }, z.string().max(500).optional()),
  allowDuplicateCanonicalTopic: z.boolean().optional(),
  /** Admin trigger default: publish immediately (PUBLISHED). */
  publishNow: z.boolean().optional(),
  /** Auto-generate localized variants from canonical post. */
  generateTranslations: z.boolean().optional(),
  /** Up to 4 locale variants per run for safety/cost control. */
  translationLocales: z
    .array(z.enum(GLOBAL_LOCALE_CODES))
    .min(1)
    .max(4)
    .optional(),
  translationRegion: z.enum(GLOBAL_REGION_SLUGS).optional(),
  translationProfession: z.string().max(32).optional(),
  translationExam: z.string().max(48).optional(),
});

export type BlogSimpleAiDraftBody = z.infer<typeof blogSimpleAiDraftBodySchema>;

/** Admin API payload: single topic or bounded multi-topic batch (one server job per POST). */
export const blogGenerateByTopicRequestSchema = z
  .object({
    topic: adminBlogTopicSchema.optional(),
    topics: z
      .array(adminBlogTopicSchema)
      .min(1)
      .max(ADMIN_BLOG_GENERATE_AI_MAX_TOPICS_PER_RUN)
      .optional(),
  })
  .and(blogSimpleAiDraftBodySchema.omit({ topic: true }))
  .superRefine((data, ctx) => {
    const topicCount = data.topics?.length ?? (data.topic ? 1 : 0);
    if (!data.topic && (!data.topics || data.topics.length === 0)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["topic"],
        message: `Provide \`topic\` or \`topics\` (max ${ADMIN_BLOG_GENERATE_AI_MAX_TOPICS_PER_RUN}).`,
      });
    }
    if (topicCount > 1 && data.generateTranslations === true) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["generateTranslations"],
        message: "Use generateTranslations only with a single topic per request.",
      });
    }
    if (data.topic && data.topics && data.topics.length > 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["topics"],
        message: "Provide either `topic` or `topics`, not both.",
      });
    }
  });

export type BlogGenerateByTopicRequest = z.infer<typeof blogGenerateByTopicRequestSchema>;
