import { BlogFunnelStage, BlogPostIntent, BlogPostTemplate, CountryCode } from "@prisma/client";
import { z } from "zod";
import { DRAFT_BATCH_MAX_TOPICS } from "@/lib/blog/blog-draft-generation-batch-constants";

export const blogDraftGenerationBatchCreateBodySchema = z.object({
  topicsText: z.string().min(1).max(500_000),
  exam: z.string().min(2).max(80),
  country: z.enum(["US", "CA", "unspecified"]).optional(),
  template: z.nativeEnum(BlogPostTemplate),
  intent: z.nativeEnum(BlogPostIntent).optional(),
  funnelStage: z.nativeEnum(BlogFunnelStage).optional(),
  tone: z.enum(["professional", "supportive", "direct"]).optional(),
  keywords: z.string().max(400).optional(),
  keywordCluster: z.string().max(200).optional(),
  countryTarget: z.nativeEnum(CountryCode).optional(),
  includeImage: z.boolean().optional(),
  includeAiImage: z.boolean().optional(),
  allowDuplicateCanonicalTopic: z.boolean().optional(),
});

export type BlogDraftGenerationBatchCreateBody = z.infer<typeof blogDraftGenerationBatchCreateBodySchema>;

export const blogGenerationJobCreateBodySchema = blogDraftGenerationBatchCreateBodySchema.extend({
  idempotencyKey: z.string().min(8).max(128).optional(),
});

export type BlogGenerationJobCreateBody = z.infer<typeof blogGenerationJobCreateBodySchema>;

export function assertTopicsWithinBatchLimit(topicsLength: number): string | null {
  if (topicsLength > DRAFT_BATCH_MAX_TOPICS) {
    return `Too many topics (max ${DRAFT_BATCH_MAX_TOPICS}). Split into multiple batches.`;
  }
  return null;
}
