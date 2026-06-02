/**
 * Pure planning for hidden full-body blog content → canonical {@link BlogPost} drafts (testable, no I/O).
 */
import { BlogPostStatus, BlogWorkflowStatus } from "@prisma/client";
import { blogPostIsLive } from "@/lib/blog/blog-visibility";
import { BLOG_ARTICLE_MIN_WORDS } from "@/lib/blog/blog-word-count";
import { classifyBlogCorpus, collectClassificationViolations } from "@/lib/taxonomy/content-write-taxonomy";

/** Inventory `sourceType` values eligible for canonical BlogPost import (file-backed full bodies). */
export const HIDDEN_BLOG_IMPORT_SOURCE_TYPES = [
  "manifest_import_ready",
  "newgrad_batch_file",
  "long_form_post_ts",
  "long_form_post_ts_chunk2",
] as const;

export type HiddenBlogImportSourceType = (typeof HIDDEN_BLOG_IMPORT_SOURCE_TYPES)[number];

export type HiddenBlogImportSourceFilter = "batch01" | "newgrad" | "longform" | "all";

export function parseHiddenBlogImportSourceFilter(value: string): HiddenBlogImportSourceFilter | null {
  const v = value.trim().toLowerCase();
  if (v === "batch01" || v === "newgrad" || v === "longform" || v === "all") return v;
  return null;
}

export function hiddenBlogImportSourceTypeMatchesFilter(
  sourceType: string,
  filter: HiddenBlogImportSourceFilter,
): boolean {
  if (filter === "all") return HIDDEN_BLOG_IMPORT_SOURCE_TYPES.includes(sourceType as HiddenBlogImportSourceType);
  if (filter === "batch01") return sourceType === "manifest_import_ready";
  if (filter === "newgrad") return sourceType === "newgrad_batch_file";
  if (filter === "longform") return sourceType === "long_form_post_ts" || sourceType === "long_form_post_ts_chunk2";
  return false;
}

export type HiddenBlogImportPlanFlags = {
  updateExisting: boolean;
  allowPublishedUpdate: boolean;
  publish: boolean;
};

export type HiddenBlogImportPlanInput = {
  sourceType: string;
  title: string;
  slug: string;
  excerpt: string;
  bodyHtml: string;
  wordCount: number;
  seoTitle: string;
  seoDescription: string;
  category: string | null;
  tags: string[];
  careerSlug: string | null;
  exam: string | null;
  locale: string;
  /** Reasons from inventory row (e.g. metadata_only). */
  inventoryReasons: string[];
  existing: {
    id: string;
    postStatus: BlogPostStatus;
    workflowStatus: BlogWorkflowStatus;
    publishAt: Date | null;
    scheduledAt: Date | null;
  } | null;
  flags: HiddenBlogImportPlanFlags;
  now: Date;
};

export type HiddenBlogImportPlanOutcome =
  | "create_draft"
  | "update_draft"
  | "skip"
  | "would_publish_new"
  | "would_publish_update";

export type HiddenBlogImportPlanResult = {
  outcome: HiddenBlogImportPlanOutcome;
  reasons: string[];
  /** Normalized SEO fields after fallbacks. */
  resolvedSeoTitle: string;
  resolvedSeoDescription: string;
  resolvedExcerpt: string;
  taxonomyCategory: string | null;
};

function escapeHtmlMinimal(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** Deterministic Markdown-ish section body → HTML for BlogPost.body. */
export function longFormSectionsToHtml(sections: Array<{ heading: string; body: string }>): string {
  const parts: string[] = [];
  for (const sec of sections) {
    const h = escapeHtmlMinimal(sec.heading.trim());
    if (h) parts.push(`<h2>${h}</h2>`);
    const paras = sec.body
      .split(/\n{2,}/)
      .map((p) => p.trim())
      .filter(Boolean);
    for (const p of paras) {
      parts.push(`<p>${escapeHtmlMinimal(p)}</p>`);
    }
  }
  return parts.join("\n");
}

export function planHiddenBlogImport(input: HiddenBlogImportPlanInput): HiddenBlogImportPlanResult {
  const reasons: string[] = [];
  const flags = input.flags;

  if (!HIDDEN_BLOG_IMPORT_SOURCE_TYPES.includes(input.sourceType as HiddenBlogImportSourceType)) {
    return {
      outcome: "skip",
      reasons: [`source_type_not_importable:${input.sourceType}`],
      resolvedSeoTitle: "",
      resolvedSeoDescription: "",
      resolvedExcerpt: "",
      taxonomyCategory: null,
    };
  }

  if (input.inventoryReasons.some((r) => r.includes("metadata_only") || r.includes("missing_full_body"))) {
    return {
      outcome: "skip",
      reasons: ["metadata_only_or_manifest_without_body"],
      resolvedSeoTitle: "",
      resolvedSeoDescription: "",
      resolvedExcerpt: "",
      taxonomyCategory: null,
    };
  }

  const title = input.title.trim();
  const slug = input.slug.trim();
  const body = input.bodyHtml.trim();
  let excerpt = input.excerpt.trim();

  if (!title) reasons.push("missing_title");
  if (!slug) reasons.push("missing_slug");
  if (!body) reasons.push("missing_body");
  if (input.wordCount < BLOG_ARTICLE_MIN_WORDS) {
    reasons.push(`body_below_min_words:${input.wordCount}_min_${BLOG_ARTICLE_MIN_WORDS}`);
  }

  let seoTitle = input.seoTitle.trim();
  let seoDescription = input.seoDescription.trim();
  if (!seoTitle) seoTitle = title.slice(0, 220);
  if (!seoDescription) {
    seoDescription = excerpt ? excerpt.slice(0, 500) : `${title.slice(0, 120)}. Study guide on NurseNest.`.slice(0, 500);
  }
  if (!excerpt) excerpt = seoDescription.slice(0, 500);

  const blogTax = classifyBlogCorpus({
    title,
    body,
    category: input.category,
    tags: input.tags,
  });
  const taxViolations = collectClassificationViolations(blogTax);
  if (taxViolations.length > 0) {
    reasons.push(`taxonomy_invalid:${taxViolations[0]!.slice(0, 160)}`);
  }

  const taxonomyCategory = blogTax.category;

  if (reasons.length > 0) {
    return {
      outcome: "skip",
      reasons,
      resolvedSeoTitle: seoTitle,
      resolvedSeoDescription: seoDescription,
      resolvedExcerpt: excerpt,
      taxonomyCategory,
    };
  }

  const existing = input.existing;
  if (existing) {
    const live = blogPostIsLive(
      {
        postStatus: existing.postStatus,
        publishAt: existing.publishAt,
        scheduledAt: existing.scheduledAt,
        workflowStatus: existing.workflowStatus,
      },
      input.now,
    );

    if (!flags.updateExisting) {
      return {
        outcome: "skip",
        reasons: ["slug_exists_use_update_existing"],
        resolvedSeoTitle: seoTitle,
        resolvedSeoDescription: seoDescription,
        resolvedExcerpt: excerpt,
        taxonomyCategory,
      };
    }

    if (live && !flags.allowPublishedUpdate) {
      return {
        outcome: "skip",
        reasons: ["existing_published_live_requires_allow_published_update"],
        resolvedSeoTitle: seoTitle,
        resolvedSeoDescription: seoDescription,
        resolvedExcerpt: excerpt,
        taxonomyCategory,
      };
    }

    if (flags.publish) {
      return {
        outcome: "would_publish_update",
        reasons: [],
        resolvedSeoTitle: seoTitle,
        resolvedSeoDescription: seoDescription,
        resolvedExcerpt: excerpt,
        taxonomyCategory,
      };
    }
    return {
      outcome: "update_draft",
      reasons: [],
      resolvedSeoTitle: seoTitle,
      resolvedSeoDescription: seoDescription,
      resolvedExcerpt: excerpt,
      taxonomyCategory,
    };
  }

  if (flags.publish) {
    return {
      outcome: "would_publish_new",
      reasons: [],
      resolvedSeoTitle: seoTitle,
      resolvedSeoDescription: seoDescription,
      resolvedExcerpt: excerpt,
      taxonomyCategory,
    };
  }

  return {
    outcome: "create_draft",
    reasons: [],
    resolvedSeoTitle: seoTitle,
    resolvedSeoDescription: seoDescription,
    resolvedExcerpt: excerpt,
    taxonomyCategory,
  };
}
