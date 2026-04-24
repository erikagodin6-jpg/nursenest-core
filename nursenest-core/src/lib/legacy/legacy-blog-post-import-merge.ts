import { BlogPostStatus, BlogPostTemplate } from "@prisma/client";

import { stemHash } from "@/lib/content/stem-hash";
import {
  explainMissingPathoPharmTopicalMatch,
  rowMatchesPathoPharmTopicalCriteria,
  textHasClinicalPathoPharmSignal,
} from "@/lib/blog/blog-patho-pharm-detection";

export function normalizeBlogSlug(raw: string): string {
  return raw
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export function normalizeTitleForHash(title: string): string {
  return title
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ")
    .replace(/[^\p{L}\p{N}\s-]/gu, "")
    .trim();
}

export function legacyBlogPostTitleHash(title: string): string {
  return stemHash(normalizeTitleForHash(title));
}

const PUBLISH_STATUSES = new Set(["published", "live", "public", "publish"]);

const REVIEW_BLOCK_STATUSES = new Set([
  "review_required",
  "needs_review",
  "needs-review",
  "draft",
  "pending_review",
  "pending",
]);

export function legacyBlogPostShouldPublish(statusRaw: string | null | undefined): boolean {
  const s = (statusRaw ?? "").trim().toLowerCase();
  if (!s) return false;
  if (REVIEW_BLOCK_STATUSES.has(s)) return false;
  return PUBLISH_STATUSES.has(s);
}

export function parseLegacyBlogPublishAt(raw: string | null | undefined): Date | null {
  if (!raw?.trim()) return null;
  const d = new Date(raw);
  return Number.isFinite(d.getTime()) ? d : null;
}

export function parseBlogPostTemplate(raw: string | null | undefined): BlogPostTemplate | null {
  if (!raw?.trim()) return null;
  const upper = raw.trim().toUpperCase();
  if (upper in BlogPostTemplate) {
    return BlogPostTemplate[upper as keyof typeof BlogPostTemplate];
  }
  return null;
}

export type PathoPharmClassificationPatch = {
  postTemplate: BlogPostTemplate;
  category: string;
  tagsToAdd: string[];
};

/**
 * When content has clinical patho/pharm signal but would not yet count as topical,
 * suggest template/category/tags so import aligns with `blog-public-patho-pharm-counts` heuristics.
 */
export function suggestPathoPharmClassificationFromContent(input: {
  title: string;
  excerpt: string;
  body: string;
  category: string | null;
  tags: string[];
  template: BlogPostTemplate | null;
}): PathoPharmClassificationPatch | null {
  const blob = `${input.title}\n${input.excerpt}\n${input.body}`.slice(0, 80_000);
  if (!textHasClinicalPathoPharmSignal(blob)) return null;

  const rowShape = {
    postTemplate: input.template,
    category: input.category,
    title: input.title,
    tags: input.tags,
  };
  if (rowMatchesPathoPharmTopicalCriteria(rowShape)) return null;

  const pharmHeavy =
    /\b(pharmacolog|pharmacology|medication|medications|dosage|dosing|drug|insulin|antibiotic|anticoag|adverse|contraindicat|interaction)\b/i.test(
      blob,
    );

  if (pharmHeavy) {
    return {
      postTemplate: BlogPostTemplate.MEDICATION_REVIEW,
      category:
        input.category && /pharm/i.test(input.category) ? input.category : "Pharmacology",
      tagsToAdd: ["pharmacology"],
    };
  }

  return {
    postTemplate: BlogPostTemplate.DISEASE_PROCESS_EXPLAINER,
    category:
      input.category && /patho/i.test(input.category) ? input.category : "Pathophysiology",
    tagsToAdd: ["pathophysiology"],
  };
}

export function legacyBlogPostMissingPathoPharmClassificationReason(input: {
  title: string;
  excerpt: string;
  body: string;
  category: string | null;
  tags: string[];
  template: BlogPostTemplate | null;
}): string[] | null {
  const blob = `${input.title}\n${input.excerpt}\n${input.body}`.slice(0, 80_000);
  if (!textHasClinicalPathoPharmSignal(blob)) return null;
  const rowShape = {
    postTemplate: input.template,
    category: input.category,
    title: input.title,
    tags: input.tags,
  };
  if (rowMatchesPathoPharmTopicalCriteria(rowShape)) return null;
  return explainMissingPathoPharmTopicalMatch(rowShape);
}

export function mergeLegacyBlogPostSource(
  existing: string | null | undefined,
  legacyId: string,
  incoming: string | null | undefined,
): string {
  const parts = [`legacyId:${legacyId}`];
  if (incoming?.trim()) parts.push(incoming.trim());
  if (existing?.trim()) parts.push(existing.trim());
  const merged = parts.join(" | ");
  return merged.length > 2000 ? merged.slice(0, 1997) + "..." : merged;
}

function stripHtmlToPlain(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/** Heuristic for “substantial” HTML already in DB — do not replace without explicit overwrite flag. */
export function isRichBlogBody(html: string): boolean {
  return stripHtmlToPlain(html).length >= 400;
}

export function pickBlogBodyForImport(input: {
  existingBody: string | null | undefined;
  legacyBody: string;
  legacyImportOverwriteBody: boolean;
}): string {
  const existing = input.existingBody ?? "";
  if (input.legacyImportOverwriteBody) return input.legacyBody || existing;
  if (isRichBlogBody(existing)) return existing;
  if (stripHtmlToPlain(existing).length >= 40) return existing;
  return input.legacyBody || existing;
}

export function mergePostStatusForUpdate(input: {
  existingStatus: BlogPostStatus;
  existingPublishAt: Date | null;
  legacyStatus: string | null | undefined;
  legacyPublishAtRaw: string | null | undefined;
}): { postStatus: BlogPostStatus; publishAt: Date | null } {
  if (input.existingStatus === BlogPostStatus.NEEDS_REVIEW) {
    return { postStatus: BlogPostStatus.NEEDS_REVIEW, publishAt: input.existingPublishAt };
  }
  if (!legacyBlogPostShouldPublish(input.legacyStatus)) {
    return { postStatus: input.existingStatus, publishAt: input.existingPublishAt };
  }
  const publishAt = parseLegacyBlogPublishAt(input.legacyPublishAtRaw) ?? new Date();
  return { postStatus: BlogPostStatus.PUBLISHED, publishAt };
}

export function initialPostStatusForCreate(input: {
  legacyStatus: string | null | undefined;
  legacyPublishAtRaw: string | null | undefined;
}): { postStatus: BlogPostStatus; publishAt: Date | null } {
  const s = (input.legacyStatus ?? "").trim().toLowerCase();
  if (["needs_review", "review_required", "review-required"].includes(s)) {
    return { postStatus: BlogPostStatus.NEEDS_REVIEW, publishAt: null };
  }
  if (!legacyBlogPostShouldPublish(input.legacyStatus)) {
    return { postStatus: BlogPostStatus.DRAFT, publishAt: null };
  }
  return {
    postStatus: BlogPostStatus.PUBLISHED,
    publishAt: parseLegacyBlogPublishAt(input.legacyPublishAtRaw) ?? new Date(),
  };
}
