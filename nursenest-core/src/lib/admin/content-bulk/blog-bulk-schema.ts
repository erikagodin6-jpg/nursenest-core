import { BlogPostStatus } from "@prisma/client";
import { z } from "zod";

/** Hard caps to keep admin bulk paths bounded (see global-engineering-constraints). */
export const BLOG_BULK_MAX_RESOLVE = 500;
export const BLOG_BULK_CHUNK_SIZE = 20;

export const blogBulkFilterSchema = z
  .object({
    postIds: z.array(z.string().min(8)).max(BLOG_BULK_MAX_RESOLVE).optional(),
    slugs: z.array(z.string().min(1).max(200)).max(200).optional(),
    postStatusIn: z.array(z.nativeEnum(BlogPostStatus)).max(8).optional(),
    exam: z.string().trim().max(64).optional(),
    /** Rows missing seoTitle OR seoDescription (after trim). */
    missingSerpFieldsOnly: z.boolean().optional(),
    /** Max rows to include in this bulk run (preview + enqueue). */
    maxPosts: z.number().int().min(1).max(BLOG_BULK_MAX_RESOLVE).optional(),
  })
  .refine((v) => !v.postIds || v.postIds.length > 0, { message: "postIds, when set, must be non-empty." })
  .refine(
    (v) =>
      Boolean(
        (v.postIds && v.postIds.length > 0) ||
          (v.slugs && v.slugs.length > 0) ||
          (v.postStatusIn && v.postStatusIn.length > 0) ||
          (v.exam && v.exam.length > 0) ||
          v.missingSerpFieldsOnly === true,
      ),
    { message: "Provide at least one filter (postIds, slugs, postStatusIn, exam, or missingSerpFieldsOnly)." },
  );

export type BlogBulkFilters = z.infer<typeof blogBulkFilterSchema>;

export const blogBulkOperationSchema = z.enum([
  "blog_seo_bundle_refresh",
  "blog_seo_columns_force",
  "blog_seo_columns_fill_missing",
  "blog_publish",
  "blog_unpublish_draft",
  "blog_assign_taxonomy",
  "blog_metadata_backfill_light",
]);

export type BlogBulkOperation = z.infer<typeof blogBulkOperationSchema>;

export const blogBulkTaxonomySchema = z.object({
  category: z.string().trim().max(120).nullable().optional(),
  tags: z.array(z.string().trim().min(1).max(64)).max(24).default([]),
  mode: z.enum(["replace", "append"]).default("replace"),
});

export type BlogBulkTaxonomy = z.infer<typeof blogBulkTaxonomySchema>;

export const blogBulkChunkPayloadSchema = z.object({
  operation: blogBulkOperationSchema,
  postIds: z.array(z.string().min(8)).min(1).max(BLOG_BULK_CHUNK_SIZE),
  correlationId: z.string().min(8).max(64),
  chunkIndex: z.number().int().min(0),
  totalChunks: z.number().int().min(1),
  createdById: z.string().min(1),
  taxonomy: blogBulkTaxonomySchema.optional(),
});

export type BlogBulkChunkPayload = z.infer<typeof blogBulkChunkPayloadSchema>;
