import type { Prisma } from "@prisma/client";
import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin/ensure-admin";
import { parseAdminJsonMutationIntent, stripAdminMutationControlFields } from "@/lib/admin/admin-mutation-intent";
import { prisma } from "@/lib/db";
import { assertPrintableAdminSurface } from "@/lib/printables/printable-admin-gate";
import { printableProductPricingValid } from "@/lib/printables/printable-entitlement";
import { slugifyPrintableTitle } from "@/lib/printables/slugify-printable-title";
import {
  validatePrintablePdfMediaAsset,
  validatePrintableThumbnailMediaAsset,
} from "@/lib/printables/printable-media-validation";
import { mergeSubscriberPrivateCacheHeaders } from "@/lib/http/subscriber-api-cache";

export const runtime = "nodejs";

const PRIVATE = { headers: mergeSubscriberPrivateCacheHeaders() } as const;

export async function GET(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const surface = assertPrintableAdminSurface();
  if (surface) return surface;
  const gate = await requireAdmin(req);
  if (!gate.ok) return gate.response;

  const { id } = await ctx.params;
  const row = await prisma.printableProduct.findUnique({
    where: { id },
    include: {
      fileAsset: { select: { id: true, filename: true, mimeType: true, kind: true, fileSizeBytes: true } },
      thumbnailAsset: { select: { id: true, filename: true, mimeType: true, kind: true, fileSizeBytes: true } },
    },
  });
  if (!row) return NextResponse.json({ ok: false, code: "not_found" }, { status: 404, headers: PRIVATE.headers });

  const { fileAsset, thumbnailAsset, ...rest } = row;
  return NextResponse.json({ ok: true, product: { ...rest, fileAsset, thumbnailAsset } }, { headers: PRIVATE.headers });
}

export async function PATCH(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const surface = assertPrintableAdminSurface();
  if (surface) return surface;
  const gate = await requireAdmin(req);
  if (!gate.ok) return gate.response;

  const { id } = await ctx.params;

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400, headers: PRIVATE.headers });
  }

  const intent = parseAdminJsonMutationIntent(body);
  if (intent instanceof NextResponse) return intent;
  if (intent.dryRun) return NextResponse.json({ ok: true, dryRun: true }, { headers: PRIVATE.headers });

  const data = stripAdminMutationControlFields(body as Record<string, unknown>);
  const existing = await prisma.printableProduct.findUnique({ where: { id } });
  if (!existing) return NextResponse.json({ ok: false, code: "not_found" }, { status: 404, headers: PRIVATE.headers });

  const patch: Prisma.PrintableProductUpdateInput = {
    updatedBy: { connect: { id: gate.admin.userId } },
  };

  if (typeof data.title === "string") patch.title = data.title.trim().slice(0, 512);
  if (typeof data.description === "string") patch.description = data.description.trim();
  if (typeof data.category === "string") patch.category = data.category.trim().slice(0, 128);
  if (typeof data.pathwayId === "string") patch.pathwayId = data.pathwayId.trim().slice(0, 64);
  if (typeof data.roleTrack === "string") patch.roleTrack = data.roleTrack.trim().slice(0, 64);
  if (typeof data.priceCents === "number" && Number.isFinite(data.priceCents)) patch.priceCents = Math.max(0, Math.floor(data.priceCents));
  if (typeof data.currency === "string") patch.currency = data.currency.trim().toLowerCase().slice(0, 8);
  if (data.isFree === true || data.isFree === false) patch.isFree = data.isFree;
  if (data.isPremiumIncluded === true || data.isPremiumIncluded === false) patch.isPremiumIncluded = data.isPremiumIncluded;
  if (data.isPublished === true || data.isPublished === false) patch.isPublished = data.isPublished;

  if (typeof data.slug === "string" && data.slug.trim().length > 0) {
    patch.slug = slugifyPrintableTitle(data.slug.trim().slice(0, 160));
  }

  if (typeof data.fileAssetId === "string" && data.fileAssetId.trim()) {
    const fileAsset = await prisma.mediaAsset.findUnique({ where: { id: data.fileAssetId.trim() } });
    if (!fileAsset || fileAsset.kind !== "pdf") {
      return NextResponse.json(
        { ok: false, code: "invalid_file_asset", error: "fileAssetId must reference MediaAsset kind pdf" },
        { status: 400, headers: PRIVATE.headers },
      );
    }
    const pdfCheck = validatePrintablePdfMediaAsset(fileAsset);
    if (!pdfCheck.ok) {
      return NextResponse.json({ ok: false, code: pdfCheck.code, error: pdfCheck.message }, { status: 400, headers: PRIVATE.headers });
    }
    patch.fileAsset = { connect: { id: fileAsset.id } };
    patch.version = existing.version + 1;
  }

  if (data.thumbnailAssetId === null) {
    patch.thumbnailAsset = { disconnect: true };
  } else if (typeof data.thumbnailAssetId === "string" && data.thumbnailAssetId.trim()) {
    const thumb = await prisma.mediaAsset.findUnique({ where: { id: data.thumbnailAssetId.trim() } });
    if (!thumb || thumb.kind !== "image") {
      return NextResponse.json(
        { ok: false, code: "invalid_thumbnail", error: "thumbnail must be MediaAsset kind image" },
        { status: 400, headers: PRIVATE.headers },
      );
    }
    const thumbCheck = validatePrintableThumbnailMediaAsset(thumb);
    if (!thumbCheck.ok) {
      return NextResponse.json({ ok: false, code: thumbCheck.code, error: thumbCheck.message }, { status: 400, headers: PRIVATE.headers });
    }
    patch.thumbnailAsset = { connect: { id: thumb.id } };
  }

  const mergedForCheck = {
    isFree: typeof patch.isFree === "boolean" ? patch.isFree : existing.isFree,
    isPremiumIncluded:
      typeof patch.isPremiumIncluded === "boolean" ? patch.isPremiumIncluded : existing.isPremiumIncluded,
    priceCents: typeof patch.priceCents === "number" ? patch.priceCents : existing.priceCents,
  };
  if (!printableProductPricingValid(mergedForCheck)) {
    return NextResponse.json(
      { ok: false, code: "invalid_pricing_mode", error: "Invalid combination of isFree, isPremiumIncluded, priceCents" },
      { status: 400, headers: PRIVATE.headers },
    );
  }

  if (typeof patch.slug === "string" && patch.slug !== existing.slug) {
    const clash = await prisma.printableProduct.findUnique({ where: { slug: patch.slug }, select: { id: true } });
    if (clash && clash.id !== id) {
      return NextResponse.json({ ok: false, code: "slug_taken" }, { status: 409, headers: PRIVATE.headers });
    }
  }

  const updated = await prisma.printableProduct.update({
    where: { id },
    data: patch,
    select: { id: true, slug: true, title: true, version: true, isPublished: true, updatedAt: true },
  });

  return NextResponse.json({ ok: true, product: updated }, { headers: PRIVATE.headers });
}
