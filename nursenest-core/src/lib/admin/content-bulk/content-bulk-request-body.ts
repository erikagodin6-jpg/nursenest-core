import { z } from "zod";
import {
  blogBulkFilterSchema,
  blogBulkOperationSchema,
  blogBulkTaxonomySchema,
} from "@/lib/admin/content-bulk/blog-bulk-schema";

/** Plain object schema — `.extend()` only exists on `ZodObject`, not on `ZodEffects` from `.superRefine()`. */
const contentBulkBlogBodyBaseSchema = z.object({
  operation: blogBulkOperationSchema,
  filters: blogBulkFilterSchema,
  taxonomy: blogBulkTaxonomySchema.optional(),
});

type ContentBulkBlogBodyRefinementInput = {
  operation: z.infer<typeof blogBulkOperationSchema>;
  filters: z.infer<typeof blogBulkFilterSchema>;
  taxonomy?: z.infer<typeof blogBulkTaxonomySchema>;
};

function refineContentBulkBlogBody(val: ContentBulkBlogBodyRefinementInput, ctx: z.RefinementCtx) {
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
}

export const contentBulkBlogBodySchema = contentBulkBlogBodyBaseSchema.superRefine(refineContentBulkBlogBody);

export type ContentBulkBlogBody = z.infer<typeof contentBulkBlogBodySchema>;

export const contentBulkEnqueueBodySchema = contentBulkBlogBodyBaseSchema
  .extend({
    /** Must be sent on enqueue to acknowledge destructive / wide writes. */
    confirmation: z.literal("CONFIRM_BULK_WRITE"),
  })
  .superRefine(refineContentBulkBlogBody);

export const contentBulkUtilityEnqueueSchema = z.object({
  kind: z.enum(["sitemap_revalidate", "question_stem_hashes"]),
  confirmation: z.literal("CONFIRM_BULK_WRITE"),
});
