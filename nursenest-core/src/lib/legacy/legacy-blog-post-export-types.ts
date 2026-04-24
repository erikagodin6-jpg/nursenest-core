import { z } from "zod";

export const LEGACY_BLOG_POST_EXPORT_VERSION = 1 as const;

const legacyBlogPostRowSchema = z.object({
  legacyId: z.string().min(1),
  title: z.string().min(1),
  slug: z.string().min(1),
  body: z.string().optional().default(""),
  excerpt: z.string().optional().default(""),
  category: z.string().optional().nullable(),
  tags: z.array(z.string()).optional().default([]),
  template: z.string().optional().nullable(),
  legacySource: z.string().optional().nullable(),
  legacyUrl: z.string().optional().nullable(),
  status: z.string().optional().nullable(),
  publishAt: z.string().optional().nullable(),
});

export type LegacyBlogPostExportRow = z.infer<typeof legacyBlogPostRowSchema>;

export const legacyBlogPostExportSchema = z.object({
  version: z.literal(LEGACY_BLOG_POST_EXPORT_VERSION),
  blogPosts: z.array(legacyBlogPostRowSchema),
});

export type LegacyBlogPostExportV1 = z.infer<typeof legacyBlogPostExportSchema>;

export function parseLegacyBlogPostExportJson(raw: unknown): LegacyBlogPostExportV1 {
  return legacyBlogPostExportSchema.parse(raw);
}

export function parseLegacyBlogPostExportJsonText(text: string): LegacyBlogPostExportV1 {
  return parseLegacyBlogPostExportJson(JSON.parse(text) as unknown);
}
