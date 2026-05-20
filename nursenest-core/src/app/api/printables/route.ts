import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { mergeSubscriberPrivateCacheHeaders } from "@/lib/http/subscriber-api-cache";
import { isPrintableStoreEnabledForLearners } from "@/lib/printables/printable-store-flags";

export const runtime = "nodejs";

const PRIVATE = { headers: mergeSubscriberPrivateCacheHeaders() } as const;

export async function GET(req: Request) {
  if (!isPrintableStoreEnabledForLearners()) {
    return NextResponse.json({ ok: false, code: "printable_store_locked" }, { status: 404, headers: PRIVATE.headers });
  }

  const session = await auth();
  const userId = (session?.user as { id?: string } | undefined)?.id;
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized", code: "unauthorized" }, { status: 401, headers: PRIVATE.headers });
  }

  const url = new URL(req.url);
  const pathwayId = url.searchParams.get("pathwayId")?.trim();
  const take = Math.min(80, Math.max(1, Math.floor(Number(url.searchParams.get("take") ?? "40") || 40)));

  const items = await prisma.printableProduct.findMany({
    where: {
      isPublished: true,
      ...(pathwayId ? { OR: [{ pathwayId }, { pathwayId: "all" }, { pathwayId: "*" }] } : {}),
    },
    orderBy: { updatedAt: "desc" },
    take,
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

  const safe = items.map(({ thumbnailAssetId, ...rest }) => ({
    ...rest,
    hasThumbnail: Boolean(thumbnailAssetId),
  }));

  return NextResponse.json({ ok: true, items: safe }, { headers: PRIVATE.headers });
}
