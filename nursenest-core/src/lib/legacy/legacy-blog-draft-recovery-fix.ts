import type { Prisma } from "@prisma/client";

import { parseInternalLinkPlanJson } from "@/lib/blog/blog-image-workflow";
import {
  mergeBlogPostForPrePublishPatch,
  type BlogPostPrePublishPayload,
} from "@/lib/blog/blog-pre-publish-validation";
import { rebuildSeoBundleFromStoredBlogPost } from "@/lib/blog/blog-seo-package";
import { isValidBlogSlug, slugifyBlogSeoSegment } from "@/lib/blog/blog-generate-seo";
import { approximatePlainTextFromHtmlForAudit } from "@/lib/blog/blog-word-count";

function faqItemCount(faqBlock: Prisma.JsonValue): number {
  if (!faqBlock || typeof faqBlock !== "object") return 0;
  const items = (faqBlock as { items?: unknown }).items;
  return Array.isArray(items) ? items.length : 0;
}

export function normalizeSlugForRecovery(slug: string, title: string): string {
  const t = slug.trim();
  if (isValidBlogSlug(t)) return t;
  return slugifyBlogSeoSegment(title || "nursing-blog");
}

export function buildExcerptFromBodyIfThin(excerpt: string, body: string, minLen = 10): string {
  const e = excerpt.trim();
  if (e.length >= minLen) return e;
  const plain = approximatePlainTextFromHtmlForAudit(body).slice(0, 280);
  const padded = plain.length >= minLen ? plain : `${plain} Study with NurseNest.`.replace(/\s+/g, " ").trim();
  return padded.slice(0, 500);
}

export type BlogRecoveryAutoFixResult = {
  prismaPatch: Prisma.BlogPostUpdateInput;
  mergedForValidation: ReturnType<typeof mergeBlogPostForPrePublishPatch>;
};

/**
 * Deterministic SEO bundle, excerpt backfill, slug repair, and schema summary for recovery publish.
 * Does not write to DB.
 */
export function buildBlogRecoveryAutoFix(
  row: BlogPostPrePublishPayload,
  opts: { overwriteBlogBody: boolean; importBody?: string },
): BlogRecoveryAutoFixResult {
  const bodyNext = opts.overwriteBlogBody && opts.importBody?.trim() ? opts.importBody.trim() : row.body;
  const slugNext = normalizeSlugForRecovery(row.slug, row.title);
  const excerptNext = buildExcerptFromBodyIfThin(row.excerpt, bodyNext);
  const faqCount = faqItemCount(row.faqBlock);

  const bundle = rebuildSeoBundleFromStoredBlogPost(
    {
      slug: slugNext,
      title: row.title,
      excerpt: excerptNext,
      seoTitle: row.seoTitle,
      seoDescription: row.seoDescription,
      tags: row.tags,
      category: row.category,
      exam: row.exam,
      countryTarget: row.countryTarget,
      coverImage: row.coverImage,
      targetKeyword: row.targetKeyword,
      faqItemCount: faqCount,
    },
    { ignoreStoredMeta: true },
  );

  parseInternalLinkPlanJson(row.internalLinkPlan);
  const planObj =
    row.internalLinkPlan && typeof row.internalLinkPlan === "object" && !Array.isArray(row.internalLinkPlan)
      ? ({ ...(row.internalLinkPlan as Record<string, unknown>) } as Record<string, unknown>)
      : ({} as Record<string, unknown>);
  planObj.seo = bundle as unknown as Record<string, unknown>;

  const schemaSummary = JSON.stringify({
    emitFaqSchema: Boolean(bundle.emitFaqSchema),
    breadcrumbs: bundle.normalizedBreadcrumbs,
  });

  const seoTitle = bundle.openGraphTitle;
  const seoDescription = bundle.openGraphDescription;

  const prePatch = {
    slug: slugNext,
    body: bodyNext,
    excerpt: excerptNext,
    seoTitle,
    seoDescription,
    metaTitleVariant: seoTitle,
    metaDescriptionVariant: seoDescription,
    internalLinkPlan: planObj,
    schemaSummary,
  };

  const mergedForValidation = mergeBlogPostForPrePublishPatch(row, prePatch);

  const prismaPatch: Prisma.BlogPostUpdateInput = {};
  if (slugNext !== row.slug) prismaPatch.slug = slugNext;
  if (bodyNext !== row.body) prismaPatch.body = bodyNext;
  if (excerptNext !== row.excerpt) prismaPatch.excerpt = excerptNext;
  prismaPatch.seoTitle = seoTitle;
  prismaPatch.seoDescription = seoDescription;
  prismaPatch.metaTitleVariant = seoTitle;
  prismaPatch.metaDescriptionVariant = seoDescription;
  prismaPatch.internalLinkPlan = planObj as Prisma.InputJsonValue;
  prismaPatch.schemaSummary = schemaSummary;

  return { prismaPatch, mergedForValidation };
}
