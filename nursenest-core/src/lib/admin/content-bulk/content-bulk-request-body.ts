import { z } from "zod";
import {
  blogBulkFilterSchema,
  blogBulkOperationSchema,
  blogBulkTaxonomySchema,
} from "@/lib/admin/content-bulk/blog-bulk-schema";

export const contentBulkBlogBodySchema = z
  .object({
    operation: blogBulkOperationSchema,
    filters: blogBulkFilterSchema,
    taxonomy: blogBulkTaxonomySchema.optional(),
  })
  .superRefine((val, ctx) => {
    if (val.operation === "blog_assign_taxonomy") {
      const t = val.taxonomy;
      const hasTags = (t?.tags?.length ?? 0) > 0;
      const hasCategory = t !== undefined && "category" in t;
      if (!t || (!hasTags && !hasCategory)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message:
            "blog_assign_taxonomy requires taxonomy with tags and/or an explicit category field (null clears category on replace).",
          path: ["taxonomy"],
        });
      }
    }
  });

export type ContentBulkBlogBody = z.infer<typeof contentBulkBlogBodySchema>;

export const contentBulkEnqueueBodySchema = contentBulkBlogBodySchema.extend({
  /** Must be sent on enqueue to acknowledge destructive / wide writes. */
  confirmation: z.literal("CONFIRM_BULK_WRITE"),
});

export const contentBulkUtilityEnqueueSchema = z.object({
  kind: z.enum(["sitemap_revalidate", "question_stem_hashes"]),
  confirmation: z.literal("CONFIRM_BULK_WRITE"),
});
