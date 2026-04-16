import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireAdmin } from "@/lib/admin/ensure-admin";
import { prisma } from "@/lib/db";

// @ts-expect-error — available after prisma generate + migration
const localizedModel = () => prisma.localizedBlogArticle as Record<string, (...args: unknown[]) => Promise<unknown>>;
import {
  getTransitionTarget,
  isTransitionAllowed,
  evaluatePublishGate,
  createLogEntry,
  appendGenerationLog,
  type TransitionAction,
} from "@/lib/blog/blog-publish-workflow-localized";

const patchSchema = z.object({
  localizedTitle: z.string().min(3).max(220).optional(),
  localizedExcerpt: z.string().min(10).max(500).optional(),
  localizedBody: z.string().min(20).optional(),
  localizedSlug: z.string().min(3).max(200).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/).optional(),
  localizedMetaTitle: z.string().max(220).nullable().optional(),
  localizedMetaDescription: z.string().max(500).nullable().optional(),
  seoKeywordPrimary: z.string().max(200).nullable().optional(),
  seoKeywordSecondary: z.array(z.string().max(200)).max(10).optional(),
  searchIntent: z.string().max(48).nullable().optional(),
  targetAudience: z.string().max(64).nullable().optional(),
  ctaVariant: z.string().max(48).nullable().optional(),
  ctaText: z.string().max(500).nullable().optional(),
  ctaHref: z.string().max(500).nullable().optional(),
  internalLinkTargets: z.unknown().optional(),
  editorialNotes: z.string().max(5000).nullable().optional(),
  reviewFlags: z.array(z.string().max(500)).max(50).optional(),
  complianceReviewRequired: z.boolean().optional(),
  medicalReviewRequired: z.boolean().optional(),
  editorialReviewRequired: z.boolean().optional(),
  scheduledAt: z.string().datetime().nullable().optional(),
  rejectionReason: z.string().max(2000).optional(),

  action: z
    .enum([
      "generate",
      "adapt",
      "submit_for_review",
      "approve",
      "reject",
      "schedule",
      "publish_now",
      "promote",
      "unschedule",
      "unpublish",
      "revert_to_draft",
      "regenerate",
    ] as const)
    .optional(),
});

type Props = { params: Promise<{ id: string }> };

const adminFullSelect = {
  id: true,
  canonicalArticleId: true,
  locale: true,
  region: true,
  profession: true,
  exam: true,
  sourceLanguage: true,
  adaptationType: true,
  contentStatus: true,
  aiModelVersion: true,
  aiPromptVersion: true,
  localizedTitle: true,
  localizedExcerpt: true,
  localizedBody: true,
  canonicalSlug: true,
  localizedSlug: true,
  localizedMetaTitle: true,
  localizedMetaDescription: true,
  seoKeywordPrimary: true,
  seoKeywordSecondary: true,
  searchIntent: true,
  hreflangJson: true,
  canonicalUrl: true,
  targetAudience: true,
  ctaVariant: true,
  ctaText: true,
  ctaHref: true,
  internalLinkTargets: true,
  complianceReviewRequired: true,
  medicalReviewRequired: true,
  editorialReviewRequired: true,
  reviewFlags: true,
  editorialNotes: true,
  publishedAt: true,
  scheduledAt: true,
  rejectedAt: true,
  rejectionReason: true,
  generationLog: true,
  createdAt: true,
  updatedAt: true,
} as const;

export async function GET(_req: Request, { params }: Props) {
  const gate = await requireAdmin(_req);
  if (!gate.ok) return gate.response;

  const { id } = await params;
  const article = await localizedModel().findUnique({ where: { id }, select: adminFullSelect });
  if (!article) return NextResponse.json({ error: "Localized article not found" }, { status: 404 });
  return NextResponse.json({ article });
}

export async function PATCH(req: NextRequest, { params }: Props) {
  const gate = await requireAdmin(req);
  if (!gate.ok) return gate.response;

  const { id } = await params;
  const body = await req.json();
  const parsed = patchSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Validation failed", issues: parsed.error.issues }, { status: 400 });
  }

  const d = parsed.data;

  const existing = await localizedModel().findUnique({
    where: { id },
    select: {
      id: true,
      contentStatus: true,
      localizedTitle: true,
      localizedBody: true,
      localizedSlug: true,
      localizedMetaTitle: true,
      localizedMetaDescription: true,
      complianceReviewRequired: true,
      medicalReviewRequired: true,
      editorialReviewRequired: true,
      reviewFlags: true,
      generationLog: true,
    },
  }) as {
    id: string; contentStatus: string; localizedTitle: string; localizedBody: string;
    localizedSlug: string; localizedMetaTitle: string | null; localizedMetaDescription: string | null;
    complianceReviewRequired: boolean; medicalReviewRequired: boolean; editorialReviewRequired: boolean;
    reviewFlags: string[]; generationLog: unknown;
  } | null;

  if (!existing) {
    return NextResponse.json({ error: "Localized article not found" }, { status: 404 });
  }

  // ── Handle workflow action ─────────────────────────────────────────────
  if (d.action) {
    const action = d.action as TransitionAction;
    if (!isTransitionAllowed(existing.contentStatus as never, action)) {
      return NextResponse.json(
        { error: `Action "${action}" is not allowed from status "${existing.contentStatus}"` },
        { status: 422 },
      );
    }

    const targetStatus = getTransitionTarget(existing.contentStatus as never, action);
    if (!targetStatus) {
      return NextResponse.json({ error: `No target status for action "${action}"` }, { status: 422 });
    }

    // Publish gate check for publish_now and schedule
    if (action === "publish_now" || action === "schedule") {
      const gateResult = evaluatePublishGate({
        contentStatus: existing.contentStatus as never,
        complianceReviewRequired: d.complianceReviewRequired ?? existing.complianceReviewRequired,
        medicalReviewRequired: d.medicalReviewRequired ?? existing.medicalReviewRequired,
        editorialReviewRequired: d.editorialReviewRequired ?? existing.editorialReviewRequired,
        reviewFlags: d.reviewFlags ?? existing.reviewFlags,
        hasTitle: !!(d.localizedTitle ?? existing.localizedTitle),
        hasBody: !!(d.localizedBody ?? existing.localizedBody),
        hasSlug: !!(d.localizedSlug ?? existing.localizedSlug),
        hasMetaTitle: !!(d.localizedMetaTitle ?? existing.localizedMetaTitle),
        hasMetaDescription: !!(d.localizedMetaDescription ?? existing.localizedMetaDescription),
      });

      if (!gateResult.allowed) {
        return NextResponse.json(
          { error: "Publish gate blocked", blockers: gateResult.blockers },
          { status: 422 },
        );
      }
    }

    const logEntry = createLogEntry(action, `Status transition: ${existing.contentStatus} → ${targetStatus}`);
    const updatedLog = appendGenerationLog(existing.generationLog, logEntry);

    const updateData: Record<string, unknown> = {
      contentStatus: targetStatus,
      generationLog: updatedLog,
    };

    if (action === "publish_now") {
      updateData.publishedAt = new Date();
    }
    if (action === "reject") {
      updateData.rejectedAt = new Date();
      if (d.rejectionReason) updateData.rejectionReason = d.rejectionReason;
    }
    if (action === "schedule" && d.scheduledAt) {
      updateData.scheduledAt = new Date(d.scheduledAt);
    }
    if (action === "unpublish") {
      updateData.publishedAt = null;
    }

    const updated = await localizedModel().update({ where: { id }, data: updateData, select: adminFullSelect });

    return NextResponse.json({ article: updated });
  }

  // ── Handle field updates (no action) ───────────────────────────────────
  const updateData: Record<string, unknown> = {};
  if (d.localizedTitle !== undefined) updateData.localizedTitle = d.localizedTitle;
  if (d.localizedExcerpt !== undefined) updateData.localizedExcerpt = d.localizedExcerpt;
  if (d.localizedBody !== undefined) updateData.localizedBody = d.localizedBody;
  if (d.localizedSlug !== undefined) updateData.localizedSlug = d.localizedSlug;
  if (d.localizedMetaTitle !== undefined) updateData.localizedMetaTitle = d.localizedMetaTitle;
  if (d.localizedMetaDescription !== undefined) updateData.localizedMetaDescription = d.localizedMetaDescription;
  if (d.seoKeywordPrimary !== undefined) updateData.seoKeywordPrimary = d.seoKeywordPrimary;
  if (d.seoKeywordSecondary !== undefined) updateData.seoKeywordSecondary = d.seoKeywordSecondary;
  if (d.searchIntent !== undefined) updateData.searchIntent = d.searchIntent;
  if (d.targetAudience !== undefined) updateData.targetAudience = d.targetAudience;
  if (d.ctaVariant !== undefined) updateData.ctaVariant = d.ctaVariant;
  if (d.ctaText !== undefined) updateData.ctaText = d.ctaText;
  if (d.ctaHref !== undefined) updateData.ctaHref = d.ctaHref;
  if (d.internalLinkTargets !== undefined) updateData.internalLinkTargets = d.internalLinkTargets;
  if (d.editorialNotes !== undefined) updateData.editorialNotes = d.editorialNotes;
  if (d.reviewFlags !== undefined) updateData.reviewFlags = d.reviewFlags;
  if (d.complianceReviewRequired !== undefined) updateData.complianceReviewRequired = d.complianceReviewRequired;
  if (d.medicalReviewRequired !== undefined) updateData.medicalReviewRequired = d.medicalReviewRequired;
  if (d.editorialReviewRequired !== undefined) updateData.editorialReviewRequired = d.editorialReviewRequired;
  if (d.scheduledAt !== undefined) updateData.scheduledAt = d.scheduledAt ? new Date(d.scheduledAt) : null;

  if (Object.keys(updateData).length === 0) {
    return NextResponse.json({ error: "No fields to update" }, { status: 400 });
  }

  const updated = await localizedModel().update({ where: { id }, data: updateData, select: adminFullSelect });

  return NextResponse.json({ article: updated });
}

export async function DELETE(_req: Request, { params }: Props) {
  const gate = await requireAdmin(_req);
  if (!gate.ok) return gate.response;

  const { id } = await params;
  const existingDel = await localizedModel().findUnique({
    where: { id },
    select: { id: true, contentStatus: true },
  }) as { id: string; contentStatus: string } | null;

  if (!existingDel) {
    return NextResponse.json({ error: "Localized article not found" }, { status: 404 });
  }

  if (existingDel.contentStatus === "PUBLISHED") {
    return NextResponse.json({ error: "Cannot delete a published article — unpublish first" }, { status: 422 });
  }

  await localizedModel().delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
