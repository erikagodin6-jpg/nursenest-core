import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { mergeSubscriberPrivateCacheHeaders } from "@/lib/http/subscriber-api-cache";
import { isPrintableStoreEnabledForLearners } from "@/lib/printables/printable-store-flags";

export const runtime = "nodejs";

const PRIVATE = { headers: mergeSubscriberPrivateCacheHeaders() } as const;

export async function GET(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  if (!isPrintableStoreEnabledForLearners()) {
    return NextResponse.json({ ok: false, code: "printable_store_locked" }, { status: 404, headers: PRIVATE.headers });
  }

  const session = await auth();
  const userId = (session?.user as { id?: string } | undefined)?.id;
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized", code: "unauthorized" }, { status: 401, headers: PRIVATE.headers });
  }

  const { id } = await ctx.params;
  const row = await prisma.printableProduct.findFirst({
    where: { id, isPublished: true },
    select: {
      id: true,
      slug: true,
      title: true,
      description: true,
      category: true,
      pathwayId: true,
      roleTrack: true,
      isFree: true,
      isPremiumIncluded: true,
      priceCents: true,
      currency: true,
      thumbnailAssetId: true,
    },
  });
  if (!row) return NextResponse.json({ ok: false, code: "not_found" }, { status: 404, headers: PRIVATE.headers });

  const { thumbnailAssetId, ...rest } = row;
  return NextResponse.json({ ok: true, product: { ...rest, hasThumbnail: Boolean(thumbnailAssetId) } }, { headers: PRIVATE.headers });
}
