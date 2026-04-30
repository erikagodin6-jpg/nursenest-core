import type { Prisma, PrismaClient } from "@prisma/client";
import { assessStructuralEligibility, parseBlogSourcesJson } from "@/lib/blog/blog-citation-safety";
import { parseInternalLinkPlanJson } from "@/lib/blog/blog-image-workflow";
import { blogReferenceLineLooksLikePlaceholder } from "@/lib/blog/blog-cli-publish-sniff";
import { BLOG_ARTICLE_TARGET_WORDS_FOR_PUBLISH, countWordsFromHtml } from "@/lib/blog/blog-word-count";
import {
  blogPrePublishValidationSelect,
  validateBlogPrePublish,
  type BlogPostPrePublishPayload,
  type PrePublishIssue,
} from "@/lib/blog/blog-pre-publish-validation";
import type { BlogCanonicalPublishContext, PublishBlogPostCanonicalResult } from "@/lib/blog/publish-blog-post-canonical";
import {
  collectGeneratedBlogInternalLinkCoverageIssues,
  collectGenericClinicalSurfaceIssues,
  collectPaywallSafeCtaIssues,
  collectPaywallUnsafeBodyPhrases,
  collectPaywallUnsafeLessonLabelIssues,
  countApaStyleInTextCitations,
} from "@/lib/blog/blog-generated-publish-gates";

export type PublishGeneratedBlogArticleOptions = {
  minWords?: number;
  requireApaReferences?: boolean;
  minReferences?: number;
  requireInternalLinks?: boolean;
  validateInternalLinks?: boolean;
  /** When true (default), block paywall-misleading copy and require the standard member practice CTA in the body. */
  paywallSafeLinks?: boolean;
  /** When true (default), block very thin H2 scaffolding typical of generic SEO drafts. */
  requireClinicalSectionDepth?: boolean;
  publishOnlyIfValid?: boolean;
  context?: BlogCanonicalPublishContext;
  publishAt?: Date;
  skipRevalidate?: boolean;
  prisma?: PrismaClient;
};

export type GeneratedBlogPublishEligibility = {
  ok: boolean;
  reasons: string[];
  blocking: PrePublishIssue[];
  warnings: PrePublishIssue[];
  wordCount: number;
  referenceCount: number;
  internalLinkCount: number;
};

const DEFAULT_MIN_REFERENCES = 4;
const MIN_APA_INTEXT_CITATIONS = 3;

function activeInternalLinks(raw: Prisma.JsonValue): ReturnType<typeof parseInternalLinkPlanJson>["lessons"] {
  const parsed = parseInternalLinkPlanJson(raw);
  return parsed.lessons.filter((row) => row.reviewStatus !== "removed");
}

function referenceLinesLookSafe(lines: string[]): boolean {
  return lines.every((line) => {
    const t = line.trim();
    return t.length >= 20 && !blogReferenceLineLooksLikePlaceholder(t);
  });
}

function verifiedReferenceCount(row: BlogPostPrePublishPayload): number {
  const parsed = parseBlogSourcesJson(row.sourcesJson);
  if (parsed.envelope) {
    return parsed.envelope.verified.filter((source) => assessStructuralEligibility(source).ok).length;
  }
  if (parsed.legacyRecords.length) {
    return parsed.legacyRecords.filter((source) => assessStructuralEligibility(source).ok).length;
  }
  return row.apaReferences.filter((line) => line.trim()).length;
}

export async function validateGeneratedBlogPublishEligibility(
  row: BlogPostPrePublishPayload,
  postId: string,
  options: PublishGeneratedBlogArticleOptions = {},
): Promise<GeneratedBlogPublishEligibility> {
  const prismaClient = options.prisma ?? (await import("@/lib/db")).prisma;
  const minWords = Math.max(BLOG_ARTICLE_TARGET_WORDS_FOR_PUBLISH, Math.floor(options.minWords ?? 0));
  const minReferences = Math.max(0, Math.floor(options.minReferences ?? DEFAULT_MIN_REFERENCES));
  const pre = await validateBlogPrePublish(row, postId, { prisma: prismaClient });
  const reasons = pre.blocking.map((issue) => issue.message);

  const wordCount = countWordsFromHtml(row.body);
  if (wordCount < minWords) {
    reasons.push(`Article body is too short (${wordCount} words; minimum ${minWords}).`);
  }

  const references = row.apaReferences.map((line) => line.trim()).filter(Boolean);
  const verifiedCount = verifiedReferenceCount(row);
  if (options.requireApaReferences !== false) {
    if (references.length < minReferences) {
      reasons.push(`APA 7 references are required (${references.length}/${minReferences}).`);
    }
    if (verifiedCount < minReferences) {
      reasons.push(`Verified structured references are required (${verifiedCount}/${minReferences}).`);
    }
    if (!referenceLinesLookSafe(references)) {
      reasons.push("APA references include placeholder or fake-looking entries.");
    }
    const intext = countApaStyleInTextCitations(row.body);
    if (intext < MIN_APA_INTEXT_CITATIONS) {
      reasons.push(
        `APA-style in-text citations are required for substantive clinical claims (found ${intext}; minimum ${MIN_APA_INTEXT_CITATIONS} parenthetical citations with a year, e.g., (National Institute of Nursing Research, 2021)).`,
      );
    }
  }

  if (options.requireClinicalSectionDepth !== false) {
    reasons.push(...collectGenericClinicalSurfaceIssues(row.body));
  }

  const links = activeInternalLinks(row.internalLinkPlan);
  if (options.requireInternalLinks !== false) {
    reasons.push(...collectGeneratedBlogInternalLinkCoverageIssues(links));
  }
  if (options.validateInternalLinks !== false) {
    const broken = links.filter((link) => link.pathStatus === "not_found" || link.pathStatus === "invalid_allowlist");
    if (broken.length > 0) {
      reasons.push(`Broken internal links block publish (${broken.length}).`);
    }
    const uncheckedLesson = links.filter((link) => {
      const candidate = (link.replacementPath ?? link.suggestedPath ?? "").trim();
      return candidate.includes("/lessons/") && (!link.pathStatus || link.pathStatus === "unchecked");
    });
    if (uncheckedLesson.length > 0) {
      reasons.push(`Lesson links must be verified before publish (${uncheckedLesson.length} unchecked).`);
    }
  }

  if (options.paywallSafeLinks !== false) {
    reasons.push(...collectPaywallUnsafeBodyPhrases(row.body));
    reasons.push(...collectPaywallSafeCtaIssues(row.body));
    reasons.push(...collectPaywallUnsafeLessonLabelIssues(links));
  }

  if (!row.category?.trim()) reasons.push("Pathway/category mapping is missing.");
  if (!row.title.trim() || !row.slug.trim() || !(row.seoDescription ?? "").trim()) {
    reasons.push("Title, slug, and meta description are required.");
  }

  return {
    ok: reasons.length === 0,
    reasons,
    blocking: pre.blocking,
    warnings: pre.warnings,
    wordCount,
    referenceCount: references.length,
    internalLinkCount: links.length,
  };
}

/**
 * Authoritative generated-article publish boundary.
 *
 * Generated posts become public only through this function: strict generated-content validation first,
 * then canonical status/publishAt/revalidation/visibility verification in `publishBlogPostCanonical`.
 */
export async function publishGeneratedBlogArticle(
  article: { id: string },
  options: PublishGeneratedBlogArticleOptions = {},
): Promise<PublishBlogPostCanonicalResult & { eligibility: GeneratedBlogPublishEligibility }> {
  const prismaClient = options.prisma ?? (await import("@/lib/db")).prisma;
  const row = await prismaClient.blogPost.findUnique({
    where: { id: article.id },
    select: blogPrePublishValidationSelect,
  });
  if (!row) throw new Error(`publishGeneratedBlogArticle: post not found (${article.id})`);

  const eligibility = await validateGeneratedBlogPublishEligibility(row, article.id, {
    ...options,
    prisma: prismaClient,
  });
  if (!eligibility.ok) {
    if (options.publishOnlyIfValid === false) {
      throw new Error(`publishGeneratedBlogArticle: invalid generated article (${eligibility.reasons.join("; ")})`);
    }
    throw new Error(`publishGeneratedBlogArticle: publish blocked (${eligibility.reasons.join("; ")})`);
  }

  const { publishBlogPostCanonical } = await import("@/lib/blog/publish-blog-post-canonical");
  const published = await publishBlogPostCanonical({
    postId: article.id,
    publishAt: options.publishAt ?? new Date(),
    clearScheduledAt: true,
    context: options.context ?? "automation_engine",
    acknowledgePrePublishWarnings: true,
    skipRevalidate: options.skipRevalidate,
    setLegacySourceIfEmpty: "control_panel_ai",
  });
  return { ...published, eligibility };
}
