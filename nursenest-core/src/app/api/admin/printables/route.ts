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

function parseTake(raw: string | null): number {
  const n = Number(raw ?? "40");
  if (!Number.isFinite(n)) return 40;
  return Math.min(100, Math.max(1, Math.floor(n)));
}

async function ensureUniqueSlug(base: string): Promise<string> {
  let slug = base;
  for (let i = 0; i < 12; i++) {
    const clash = await prisma.printableProduct.findUnique({ where: { slug }, select: { id: true } });
    if (!clash) return slug;
    slug = `${base}-${Math.random().toString(36).slice(2, 8)}`;
  }
  throw new Error("slug_exhausted");
}

export async function GET(req: Request) {
  const surface = assertPrintableAdminSurface();
  if (surface) return surface;
  const gate = await requireAdmin(req);
  if (!gate.ok) return gate.response;

  const url = new URL(req.url);
  const take = parseTake(url.searchParams.get("take"));
  const rows = await prisma.printableProduct.findMany({
    orderBy: { updatedAt: "desc" },
    take,
    select: {
      id: true,
      slug: true,
      title: true,
      category: true,
      pathwayId: true,
      roleTrack: true,
      isFree: true,
      isPremiumIncluded: true,
      isPublished: true,
      priceCents: true,
      currency: true,
      version: true,
      updatedAt: true,
    },
  });

  return NextResponse.json({ ok: true, items: rows }, { headers: PRIVATE.headers });
}

export async function POST(req: Request) {
  const surface = assertPrintableAdminSurface();
  if (surface) return surface;
  const gate = await requireAdmin(req);
  if (!gate.ok) return gate.response;

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400, headers: PRIVATE.headers });
  }

  const intent = parseAdminJsonMutationIntent(body);
  if (intent instanceof NextResponse) return intent;
  if (intent.dryRun) {
    return NextResponse.json({ ok: true, dryRun: true }, { headers: PRIVATE.headers });
  }

  const data = stripAdminMutationControlFields(body as Record<string, unknown>);
  const title = typeof data.title === "string" ? data.title.trim().slice(0, 512) : "";
  const description = typeof data.description === "string" ? data.description.trim() : "";
  const category = typeof data.category === "string" ? data.category.trim().slice(0, 128) : "";
  const pathwayId = typeof data.pathwayId === "string" ? data.pathwayId.trim().slice(0, 64) : "";
  const roleTrack = typeof data.roleTrack === "string" ? data.roleTrack.trim().slice(0, 64) : "";
  const fileAssetId = typeof data.fileAssetId === "string" ? data.fileAssetId.trim() : "";
  const thumbnailAssetId =
    typeof data.thumbnailAssetId === "string" && data.thumbnailAssetId.trim().length > 0
      ? data.thumbnailAssetId.trim()
      : null;
  const priceCents = typeof data.priceCents === "number" && Number.isFinite(data.priceCents) ? Math.max(0, Math.floor(data.priceCents)) : 0;
  const currency = typeof data.currency === "string" ? data.currency.trim().toLowerCase().slice(0, 8) || "usd" : "usd";
  const isFree = data.isFree === true;
  const isPremiumIncluded = data.isPremiumIncluded === true;
  const isPublished = data.isPublished === true;
  const slugOverride = typeof data.slug === "string" && data.slug.trim().length > 0 ? data.slug.trim().slice(0, 160) : null;

  if (!title || !category || !pathwayId || !roleTrack || !fileAssetId) {
    return NextResponse.json(
      { ok: false, code: "invalid_body", error: "title, category, pathwayId, roleTrack, fileAssetId are required" },
      { status: 400, headers: PRIVATE.headers },
    );
  }

  const fileAsset = await prisma.mediaAsset.findUnique({ where: { id: fileAssetId } });
  if (!fileAsset || fileAsset.kind !== "pdf") {
    return NextResponse.json(
      { ok: false, code: "invalid_file_asset", error: "fileAssetId must reference an existing MediaAsset with kind pdf" },
      { status: 400, headers: PRIVATE.headers },
    );
  }
  const pdfCheck = validatePrintablePdfMediaAsset(fileAsset);
  if (!pdfCheck.ok) {
    return NextResponse.json({ ok: false, code: pdfCheck.code, error: pdfCheck.message }, { status: 400, headers: PRIVATE.headers });
  }

  if (thumbnailAssetId) {
    const thumb = await prisma.mediaAsset.findUnique({ where: { id: thumbnailAssetId } });
    if (!thumb || thumb.kind !== "image") {
      return NextResponse.json(
        { ok: false, code: "invalid_thumbnail", error: "thumbnailAssetId must reference an existing MediaAsset with kind image" },
        { status: 400, headers: PRIVATE.headers },
      );
    }
    const thumbCheck = validatePrintableThumbnailMediaAsset(thumb);
    if (!thumbCheck.ok) {
      return NextResponse.json({ ok: false, code: thumbCheck.code, error: thumbCheck.message }, { status: 400, headers: PRIVATE.headers });
    }
  }

  const draft = { isFree, isPremiumIncluded, priceCents };
  if (!printableProductPricingValid(draft)) {
    return NextResponse.json(
      {
        ok: false,
        code: "invalid_pricing_mode",
        error: "Use isFree (price 0), isPremiumIncluded (price 0), or paid (not free, not premium-included, priceCents > 0).",
      },
      { status: 400, headers: PRIVATE.headers },
    );
  }

  const baseSlug = slugOverride ? slugifyPrintableTitle(slugOverride) : slugifyPrintableTitle(title);
  const slug = await ensureUniqueSlug(baseSlug);

  const row = await prisma.printableProduct.create({
    data: {
      slug,
      title,
      description,
      category,
      pathwayId,
      roleTrack,
      fileAssetId,
      thumbnailAssetId,
      priceCents,
      currency,
      isFree,
      isPremiumIncluded,
      isPublished,
      version: 1,
      createdByUserId: gate.admin.userId,
      updatedByUserId: gate.admin.userId,
    },
    select: {
      id: true,
      slug: true,
      title: true,
      isPublished: true,
      version: true,
    },
  });

  return NextResponse.json({ ok: true, product: row }, { status: 201, headers: PRIVATE.headers });
}
