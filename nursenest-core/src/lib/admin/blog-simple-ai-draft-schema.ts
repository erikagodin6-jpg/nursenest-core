import { BlogFunnelStage, BlogPostIntent, BlogPostTemplate } from "@prisma/client";
import { z } from "zod";

/** Shared body schema for legacy single-post AI draft + automation-log retries. */
export const blogSimpleAiDraftBodySchema = z.object({
  topic: z.string().min(3).max(200),
  keywords: z.string().max(400).optional(),
  exam: z.string().min(2).max(80),
  country: z.enum(["US", "CA", "unspecified"]).optional(),
  template: z.nativeEnum(BlogPostTemplate),
  intent: z.nativeEnum(BlogPostIntent).optional(),
  funnelStage: z.nativeEnum(BlogFunnelStage).optional(),
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
      url: z.string().url().optional(),
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
  slug: z
    .string()
    .min(3)
    .max(180)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
    .optional(),
  allowDuplicateCanonicalTopic: z.boolean().optional(),
  /** Admin trigger default: publish immediately (PUBLISHED). */
  publishNow: z.boolean().optional(),
});

export type BlogSimpleAiDraftBody = z.infer<typeof blogSimpleAiDraftBodySchema>;

/** Admin API payload: single topic or up to 3 topics per run for cost control. */
export const blogGenerateByTopicRequestSchema = z
  .object({
    topic: z.string().min(3).max(200).optional(),
    topics: z.array(z.string().min(3).max(200)).min(1).max(3).optional(),
  })
  .and(blogSimpleAiDraftBodySchema.omit({ topic: true }))
  .superRefine((data, ctx) => {
    if (!data.topic && (!data.topics || data.topics.length === 0)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["topic"],
        message: "Provide `topic` or `topics` (max 3).",
      });
    }
  });

export type BlogGenerateByTopicRequest = z.infer<typeof blogGenerateByTopicRequestSchema>;
