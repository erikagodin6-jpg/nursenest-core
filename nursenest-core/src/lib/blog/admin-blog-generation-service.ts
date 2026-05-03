import { BlogPostStatus } from "@prisma/client";
import { findExistingBlogByCanonicalIntent, normalizeBlogTopicKey } from "@/lib/blog/blog-intent-dedupe";
import { BLOG_SLUG_FORMAT_RE } from "@/lib/blog/blog-optional-slug";
import { ensureUniqueBlogPostSlug } from "@/lib/blog/blog-optional-slug.server";
import { expectedCanonicalBlogPath } from "@/lib/blog/generated-blog-post-publish";
import {
  normalizeBlogGenerationInput,
  sanitizeAiReturnedSlug,
  sanitizeAiSeoOutput,
  type NormalizedBlogGenerationInput,
} from "@/lib/blog/normalize-blog-generation-input";

export type AdminBlogPublishMode = "draft" | "publish_now" | "schedule";

export type AdminBlogFieldError = {
  field: string;
  sanitizedValue: string | null;
  message: string;
  suggestedFix: string;
};

export class AdminBlogValidationError extends Error {
  readonly fieldError: AdminBlogFieldError;

  constructor(fieldError: AdminBlogFieldError) {
    super(fieldError.message);
    this.name = "AdminBlogValidationError";
    this.fieldError = fieldError;
  }
}

export type PreparedAdminBlogGenerationInput = {
  normalized: NormalizedBlogGenerationInput;
  topic: string;
  targetKeyword: string;
  normalizedTopic: string;
  slugBase: string;
  uniqueSlug: string;
  seo: ReturnType<typeof sanitizeAiSeoOutput>;
  canonicalPath: string;
  publicUrl: string;
  editUrl: string | null;
  publish: {
    mode: AdminBlogPublishMode;
    scheduledAt: Date | null;
    postStatus: BlogPostStatus;
    publishAt: Date | null;
  };
};

export type PrepareAdminBlogGenerationInputArgs = {
  rawTitle: string;
  exam?: string | null;
  targetKeyword?: string | null;
  fixedSlug?: string | null;
  aiTitle?: string | null;
  aiSlug?: string | null;
  aiSeoTitle?: string | null;
  aiMetaDescription?: string | null;
  aiCategory?: string | null;
  aiTags?: unknown;
  publishMode?: AdminBlogPublishMode | null;
  scheduledAt?: string | Date | null;
  existingPostId?: string | null;
};

export function adminBlogEditUrl(postId: string | null | undefined): string | null {
  return postId ? `/admin/blog?id=${encodeURIComponent(postId)}` : null;
}

export function adminBlogPublicUrl(slug: string, careerSlug?: string | null): string {
  const path = expectedCanonicalBlogPath(slug, careerSlug ?? null);
  const trimmed = path.replace(/^\/+/, "").split("/");
  /** Encode each segment; path always starts with `/`. */
  return `/${trimmed.map((s) => encodeURIComponent(s)).join("/")}`;
}

export function adminBlogStructuredFieldError(
  field: string,
  sanitizedValue: string | null,
  message: string,
  suggestedFix: string,
): AdminBlogFieldError {
  return { field, sanitizedValue, message, suggestedFix };
}

function throwAdminBlogFieldError(
  field: string,
  sanitizedValue: string | null,
  message: string,
  suggestedFix: string,
): never {
  throw new AdminBlogValidationError(adminBlogStructuredFieldError(field, sanitizedValue, message, suggestedFix));
}

export function resolveAdminBlogPublishIntent(args: {
  publishMode?: AdminBlogPublishMode | null;
  publishImmediately?: boolean | null;
  scheduledAt?: string | Date | null;
  now?: Date;
}): PreparedAdminBlogGenerationInput["publish"] {
  const now = args.now ?? new Date();
  const mode: AdminBlogPublishMode =
    args.publishMode ?? (args.publishImmediately ? "publish_now" : args.scheduledAt ? "schedule" : "draft");
  if (mode === "publish_now") {
    return { mode, scheduledAt: null, postStatus: BlogPostStatus.PUBLISHED, publishAt: now };
  }
  if (mode === "schedule") {
    const date = args.scheduledAt instanceof Date ? args.scheduledAt : new Date(String(args.scheduledAt ?? ""));
    if (!Number.isFinite(date.getTime())) {
      throwAdminBlogFieldError(
        "scheduledAt",
        null,
        "Schedule date/time is invalid.",
        "Choose a valid future date/time before scheduling.",
      );
    }
    return { mode, scheduledAt: date, postStatus: BlogPostStatus.SCHEDULED, publishAt: date };
  }
  return { mode: "draft", scheduledAt: null, postStatus: BlogPostStatus.DRAFT, publishAt: null };
}

export async function prepareAdminBlogGenerationInput(
  args: PrepareAdminBlogGenerationInputArgs,
): Promise<PreparedAdminBlogGenerationInput> {
  const normalized = normalizeBlogGenerationInput(args.rawTitle);
  if (!normalized.cleanTitle || normalized.cleanTitle === "Untitled") {
    throwAdminBlogFieldError(
      "topic",
      normalized.cleanTitle,
      "Title/topic is required.",
      "Enter a real article title or topic before generating.",
    );
  }

  const seo = sanitizeAiSeoOutput({
    title: args.aiTitle ?? normalized.cleanTitle,
    seoTitle: args.aiSeoTitle ?? normalized.seoTitle,
    metaDescription: args.aiMetaDescription ?? normalized.metaDescription,
    category: args.aiCategory,
    tags: args.aiTags ?? normalized.topicKeywords,
  });
  const fallbackTitle = seo.title ?? normalized.cleanTitle;
  const slugBase = sanitizeAiReturnedSlug(args.fixedSlug ?? args.aiSlug ?? normalized.slug, fallbackTitle);
  if (!BLOG_SLUG_FORMAT_RE.test(slugBase)) {
    throwAdminBlogFieldError(
      "slug",
      slugBase,
      "Slug could not be normalized safely.",
      "Use words, numbers, and hyphens, or leave the slug hint blank.",
    );
  }
  const uniqueSlug = await ensureUniqueBlogPostSlug(slugBase);
  const targetKeyword = args.targetKeyword?.trim() || normalized.topicKeywords[0] || normalized.cleanTitle;
  const normalizedTopic = normalizeBlogTopicKey(targetKeyword || normalized.cleanTitle) || "";
  const publish = resolveAdminBlogPublishIntent({ publishMode: args.publishMode, scheduledAt: args.scheduledAt });

  return {
    normalized,
    topic: normalized.cleanTitle,
    targetKeyword,
    normalizedTopic,
    slugBase,
    uniqueSlug,
    seo,
    canonicalPath: adminBlogPublicUrl(uniqueSlug),
    publicUrl: adminBlogPublicUrl(uniqueSlug),
    editUrl: adminBlogEditUrl(args.existingPostId),
    publish,
  };
}

export async function findDuplicateAdminBlogIntent(args: {
  exam: string;
  normalizedTopic: string;
  allowDuplicate?: boolean | null;
}) {
  if (args.allowDuplicate || !args.normalizedTopic) return null;
  return findExistingBlogByCanonicalIntent({ exam: args.exam, normalizedTopic: args.normalizedTopic });
}
