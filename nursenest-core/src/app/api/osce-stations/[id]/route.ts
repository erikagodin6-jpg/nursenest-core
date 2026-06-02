import { NextResponse } from "next/server";

import { loadPublicOsceStationDtoByIdOrSlug } from "@/lib/scenarios/osce-stations-resolve.server";

export const dynamic = "force-dynamic";

/**
 * Public read: single published OSCE station by DB `id` or learner `slug`.
 */
export async function GET(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  const { readSource, station } = await loadPublicOsceStationDtoByIdOrSlug(id);
  if (!station) {
    return NextResponse.json({ readSource, error: "Not found" }, { status: 404 });
  }
  return NextResponse.json({ readSource, station });
}
