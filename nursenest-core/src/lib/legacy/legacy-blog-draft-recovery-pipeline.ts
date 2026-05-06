import { randomUUID } from "node:crypto";

import type { Prisma, PrismaClient } from "@prisma/client";
import { BlogPostStatus as BlogPostStatusEnum, BlogWorkflowStatus } from "@prisma/client";

import {
  blogPrePublishValidationSelect,
  validateBlogPrePublish,
  type BlogPostPrePublishPayload,
} from "@/lib/blog/blog-pre-publish-validation";
import { blogRecoveryRevalidationTargets } from "@/lib/legacy/legacy-blog-recovery-revalidate";
import { buildBlogRecoveryAutoFix } from "@/lib/legacy/legacy-blog-draft-recovery-fix";
import {
  BLOG_RECOVERY_HARD_MIN_WORDS,
  filterBlockingForEmergencyPublish,
  hardGateInvalidSlug,
  hardGateTitleMissing,
  hasObviousPlaceholderText,
  hasUnsafeHtml,
  recoveryBodyWordCount,
} from "@/lib/legacy/legacy-blog-draft-recovery-gates";
import type {
  BlogDraftRecoveryAuditReport,
  BlogDraftRecoveryImportResult,
  BlogDraftRecoveryPipelineOptions,
  BlogRecoveryChangeLogEntry,
  LegacyBlogExportV1,
  LegacyBlogExportRow,
} from "@/lib/legacy/legacy-blog-draft-recovery-types";
import { approximatePlainTextFromHtmlForAudit } from "@/lib/blog/blog-word-count";

const CANDIDATE_TAKE = 400;
const BLOCK_SAMPLE_CAP = 40;

function omitUndefined<T extends Record<string, unknown>>(o: T): Record<string, unknown> {
  return Object.fromEntries(Object.entries(o).filter(([, v]) => v !== undefined));
}

function appendPublishLog(
  current: Prisma.JsonValue,
  entry: Record<string, unknown>,
): Prisma.InputJsonValue {
  const arr = Array.isArray(current) ? [...(current as unknown[])] : [];
  arr.push(entry);
  return arr as Prisma.InputJsonValue;
}

function emptyAudit(): BlogDraftRecoveryAuditReport {
  return {
    totalExportPosts: 0,
    currentDraftsFound: 0,
    currentScheduledFound: 0,
    currentWorkflowPromotableFound: 0,
    legacyPostsMissingFromDb: 0,
    postsBlockedByVerification: 0,
    blockedSamples: [],
    postsSafeToPublish: 0,
    duplicateSlugConflicts: 0,
    postsWithEmptyOrThinBody: 0,
    postsWithBrokenInternalLinks: 0,
    postsMissingMetaTitleOrDescription: 0,
    postsByCategory: {},
    postsByTemplate: {},
    postsByTopicTag: {},
  };
}

function bump(map: Record<string, number>, key: string) {
  map[key] = (map[key] ?? 0) + 1;
}

async function loadCandidates(prisma: PrismaClient): Promise<BlogPostPrePublishPayload[]> {
  return prisma.blogPost.findMany({
    where: {
      postStatus: { notIn: [BlogPostStatusEnum.PUBLISHED, BlogPostStatusEnum.FAILED] },
    },
    select: blogPrePublishValidationSelect,
    take: CANDIDATE_TAKE,
    orderBy: { updatedAt: "desc" },
  });
}

async function evaluatePostForAudit(
  _prisma: PrismaClient,
  row: BlogPostPrePublishPayload,
  opts: { emergencySeoPublish: boolean; overwriteBlogBody: boolean },
): Promise<{
  safe: boolean;
  blockedReasons: string[];
  thinBody: boolean;
  brokenLinks: boolean;
  missingMeta: boolean;
}> {
  const words = recoveryBodyWordCount(row.body);
  if (!row.body.trim() || words < BLOG_RECOVERY_HARD_MIN_WORDS) {
    return {
      safe: false,
      blockedReasons: [!row.body.trim() ? "empty_body" : "body_under_hard_word_floor"],
      thinBody: true,
      brokenLinks: false,
      missingMeta: false,
    };
  }
  if (hasUnsafeHtml(row.body) || hasObviousPlaceholderText(row.body, row.title)) {
    return {
      safe: false,
      blockedReasons: [hasUnsafeHtml(row.body) ? "unsafe_html" : "placeholder_text"],
      thinBody: false,
      brokenLinks: false,
      missingMeta: false,
    };
  }
  if (hardGateTitleMissing(row.title) || hardGateInvalidSlug(row.slug)) {
    return {
      safe: false,
      blockedReasons: [hardGateTitleMissing(row.title) ? "title" : "slug"],
      thinBody: false,
      brokenLinks: false,
      missingMeta: false,
    };
  }

  const { mergedForValidation } = buildBlogRecoveryAutoFix(row, {
    overwriteBlogBody: opts.overwriteBlogBody,
  });
  const v = await validateBlogPrePublish(mergedForValidation, row.id);
  const bodyWords = recoveryBodyWordCount(mergedForValidation.body);
  const blocking = filterBlockingForEmergencyPublish(v, bodyWords, opts.emergencySeoPublish);
  const brokenLinks = blocking.some((b) => b.id === "internal_links");
  const missingMeta =
    (row.seoTitle?.trim().length ?? 0) < 3 && (row.seoDescription?.trim().length ?? 0) < 50;

  return {
    safe: blocking.length === 0,
    blockedReasons: blocking.map((b) => b.id),
    thinBody: false,
    brokenLinks,
    missingMeta,
  };
}

export async function runBlogDraftRecoveryAudit(
  prisma: PrismaClient,
  exportV1: LegacyBlogExportV1 | null,
  opts: Pick<BlogDraftRecoveryPipelineOptions, "emergencySeoPublish" | "overwriteBlogBody">,
): Promise<BlogDraftRecoveryAuditReport> {
  const audit = emptyAudit();
  const candidates = await loadCandidates(prisma);
  audit.currentDraftsFound = await prisma.blogPost.count({ where: { postStatus: BlogPostStatusEnum.DRAFT } });
  audit.currentScheduledFound = await prisma.blogPost.count({
    where: { postStatus: BlogPostStatusEnum.SCHEDULED },
  });
  audit.currentWorkflowPromotableFound = await prisma.blogPost.count({
    where: {
      workflowStatus: {
        in: [
          "APPROVED",
          "SCHEDULED",
          "GENERATED",
          "NEEDS_SEO_REVIEW",
          "NEEDS_SOURCE_REVIEW",
          "NEEDS_MEDICAL_REVIEW",
        ],
      },
      postStatus: { not: BlogPostStatusEnum.PUBLISHED },
    },
  });

  const exportPosts = exportV1?.posts ?? [];
  audit.totalExportPosts = exportPosts.length;
  for (const p of exportPosts) {
    const hit = await prisma.blogPost.findUnique({ where: { slug: p.slug.trim() }, select: { id: true } });
    if (!hit) audit.legacyPostsMissingFromDb += 1;
  }

  const slugSet = new Map<string, number>();
  for (const row of candidates) {
    bump(audit.postsByCategory, row.category?.trim() || "(none)");
    bump(audit.postsByTemplate, row.postTemplate ?? "(none)");
    const tag0 = row.tags[0]?.trim() || "(none)";
    bump(audit.postsByTopicTag, tag0);
    const c = slugSet.get(row.slug) ?? 0;
    slugSet.set(row.slug, c + 1);
  }
  audit.duplicateSlugConflicts = [...slugSet.values()].filter((n) => n > 1).length;

  let blocked = 0;
  let safe = 0;
  for (const row of candidates) {
    const clash = await prisma.blogPost.findFirst({
      where: { slug: row.slug, NOT: { id: row.id } },
      select: { id: true },
    });
    if (clash) {
      blocked += 1;
      if (audit.blockedSamples.length < BLOCK_SAMPLE_CAP) {
        audit.blockedSamples.push({ id: row.id, slug: row.slug, reasons: ["slug_unique"] });
      }
      continue;
    }

    const ev = await evaluatePostForAudit(prisma, row, opts);
    if (ev.thinBody) audit.postsWithEmptyOrThinBody += 1;
    if (ev.brokenLinks) audit.postsWithBrokenInternalLinks += 1;
    if (ev.missingMeta) audit.postsMissingMetaTitleOrDescription += 1;
    if (ev.safe) safe += 1;
    else {
      blocked += 1;
      if (audit.blockedSamples.length < BLOCK_SAMPLE_CAP) {
        audit.blockedSamples.push({ id: row.id, slug: row.slug, reasons: ev.blockedReasons });
      }
    }
  }
  audit.postsBlockedByVerification = blocked;
  audit.postsSafeToPublish = safe;
  return audit;
}

export async function runBlogDraftRecoveryImport(
  prisma: PrismaClient,
  exportV1: LegacyBlogExportV1 | null,
  opts: BlogDraftRecoveryPipelineOptions,
): Promise<BlogDraftRecoveryImportResult> {
  const changes: BlogRecoveryChangeLogEntry[] = [];
  const errors: string[] = [];
  const audit = await runBlogDraftRecoveryAudit(prisma, exportV1, opts);
  const candidates = await loadCandidates(prisma);

  const logChange = (e: BlogRecoveryChangeLogEntry) => {
    changes.push(e);
    console.log(JSON.stringify({ blog_draft_recovery_change: e }));
  };

  for (const row of candidates) {
    const clash = await prisma.blogPost.findFirst({
      where: { slug: row.slug, NOT: { id: row.id } },
      select: { id: true },
    });
    if (clash) {
      errors.push(`slug_unique:${row.id}:${row.slug}`);
      continue;
    }

    const words0 = recoveryBodyWordCount(row.body);
    if (!row.body.trim() || words0 < BLOG_RECOVERY_HARD_MIN_WORDS) {
      errors.push(`hard_body:${row.id}`);
      continue;
    }
    if (hasUnsafeHtml(row.body) || hasObviousPlaceholderText(row.body, row.title)) {
      errors.push(`hard_safety:${row.id}`);
      continue;
    }
    if (hardGateTitleMissing(row.title)) {
      errors.push(`hard_title:${row.id}`);
      continue;
    }

    const importBody = exportV1?.posts?.find((p) => p.slug.trim() === row.slug.trim())?.body;
    const { prismaPatch, mergedForValidation } = buildBlogRecoveryAutoFix(row, {
      overwriteBlogBody: opts.overwriteBlogBody,
      importBody: importBody ?? undefined,
    });

    if (hardGateInvalidSlug(mergedForValidation.slug)) {
      errors.push(`hard_slug:${row.id}`);
      continue;
    }

    const v = await validateBlogPrePublish(mergedForValidation, row.id);
    const bodyWords = recoveryBodyWordCount(mergedForValidation.body);
    const blocking = filterBlockingForEmergencyPublish(v, bodyWords, opts.emergencySeoPublish);
    if (blocking.length > 0) {
      errors.push(`blocked:${row.id}:${blocking.map((b) => b.id).join(",")}`);
      continue;
    }

    const publishPatch: Prisma.BlogPostUpdateInput = {
      ...prismaPatch,
      postStatus: BlogPostStatusEnum.PUBLISHED,
      publishAt: new Date(),
      workflowStatus: BlogWorkflowStatus.PUBLISHED,
    };

    if (!opts.apply) {
      logChange({
        entity: "blog_post",
        id: row.id,
        action: "update",
        before: { postStatus: row.postStatus, slug: row.slug },
        after: { postStatus: "PUBLISHED", slug: mergedForValidation.slug, publishPatchKeys: Object.keys(publishPatch) },
      });
      console.log(JSON.stringify({ blog_recovery_revalidate: blogRecoveryRevalidationTargets(mergedForValidation.slug) }));
      continue;
    }

    const before = await prisma.blogPost.findUnique({
      where: { id: row.id },
      select: { postStatus: true, slug: true, publishAt: true, workflowStatus: true },
    });
    await prisma.blogPost.update({
      where: { id: row.id },
      data: omitUndefined(publishPatch as unknown as Record<string, unknown>) as Prisma.BlogPostUpdateInput,
    });
    const after = await prisma.blogPost.findUnique({
      where: { id: row.id },
      select: { postStatus: true, slug: true, publishAt: true, workflowStatus: true },
    });
    logChange({
      entity: "blog_post",
      id: row.id,
      action: "update",
      before: { ...(before as Record<string, unknown>) },
      after: { ...(after as Record<string, unknown>) },
    });
    console.log(JSON.stringify({ blog_recovery_revalidate: blogRecoveryRevalidationTargets(mergedForValidation.slug) }));
  }

  if (exportV1?.posts?.length) {
    for (const p of exportV1.posts) {
      const slug = p.slug.trim();
      if (!slug) continue;
      const exists = await prisma.blogPost.findUnique({ where: { slug }, select: { id: true } });
      if (exists) continue;
      const words = recoveryBodyWordCount(p.body ?? "");
      if (!p.body?.trim() || words < BLOG_RECOVERY_HARD_MIN_WORDS) {
        errors.push(`import_skip_body:${slug}`);
        continue;
      }
      const draftRow = exportRowToPrePublishPayload(p);
      const { prismaPatch, mergedForValidation } = buildBlogRecoveryAutoFix(draftRow, {
        overwriteBlogBody: true,
        importBody: p.body,
      });
      const tempId = randomUUID();
      const v = await validateBlogPrePublish(mergedForValidation, tempId);
      const bw = recoveryBodyWordCount(mergedForValidation.body);
      const blocking = filterBlockingForEmergencyPublish(v, bw, opts.emergencySeoPublish);
      if (blocking.length) {
        errors.push(`import_blocked:${slug}:${blocking.map((b) => b.id).join(",")}`);
        continue;
      }
      if (!opts.apply) {
        logChange({
          entity: "blog_post",
          id: "(dry-run-import)",
          action: "create",
          before: {},
          after: { slug: mergedForValidation.slug, title: mergedForValidation.title },
        });
        continue;
      }
      const created = await prisma.blogPost.create({
        data: {
          slug: mergedForValidation.slug,
          title: mergedForValidation.title,
          excerpt: mergedForValidation.excerpt,
          body: mergedForValidation.body,
          tags: mergedForValidation.tags,
          category: mergedForValidation.category,
          exam: mergedForValidation.exam,
          countryTarget: mergedForValidation.countryTarget,
          seoTitle: mergedForValidation.seoTitle,
          seoDescription: mergedForValidation.seoDescription,
          metaTitleVariant: mergedForValidation.metaTitleVariant,
          metaDescriptionVariant: mergedForValidation.metaDescriptionVariant,
          internalLinkPlan: mergedForValidation.internalLinkPlan as Prisma.InputJsonValue,
          schemaSummary: mergedForValidation.schemaSummary,
          postStatus: BlogPostStatusEnum.PUBLISHED,
          publishAt: new Date(),
          workflowStatus: BlogWorkflowStatus.PUBLISHED,
          legacySource: p.legacySource ?? "legacy-json-import",
          postTemplate: p.postTemplate ?? "TOPIC_EXPLAINED",
        },
      });
      logChange({
        entity: "blog_post",
        id: created.id,
        action: "create",
        before: {},
        after: { slug: created.slug, postStatus: created.postStatus },
      });
      console.log(JSON.stringify({ blog_recovery_revalidate: blogRecoveryRevalidationTargets(created.slug) }));
    }
  }

  return { dryRun: !opts.apply, changes, errors, audit };
}

function exportRowToPrePublishPayload(p: LegacyBlogExportRow): BlogPostPrePublishPayload {
  const base = {
    id: "pending-import",
    slug: p.slug.trim(),
    title: p.title.trim(),
    excerpt:
      (p.excerpt ?? "").trim().length >= 10
        ? (p.excerpt ?? "").trim()
        : `${approximatePlainTextFromHtmlForAudit(p.body).slice(0, 240)}`.trim() || "Excerpt pending.",
    body: p.body.trim(),
    exam: p.exam ?? null,
    category: p.category ?? null,
    tags: p.tags ?? [],
    seoTitle: p.seoTitle ?? null,
    seoDescription: p.seoDescription ?? null,
    metaTitleVariant: null,
    metaDescriptionVariant: null,
    requiresReferences: false,
    apaReferences: [] as string[],
    sourcesJson: [] as Prisma.JsonValue,
    internalLinkPlan: {} as Prisma.JsonValue,
    outlineJson: {} as Prisma.JsonValue,
    faqBlock: {} as Prisma.JsonValue,
    schemaSummary: null,
    coverImage: null,
    coverImageAlt: null,
    coverImageCaption: null,
    coverImagePrompt: null,
    imageStatus: "NONE" as const,
    countryTarget: p.countryTarget ?? null,
    postStatus: BlogPostStatusEnum.DRAFT,
    postTemplate: p.postTemplate ?? null,
    targetKeyword: null,
    medicalRiskFlags: [] as string[],
  };
  return base as unknown as BlogPostPrePublishPayload;
}
