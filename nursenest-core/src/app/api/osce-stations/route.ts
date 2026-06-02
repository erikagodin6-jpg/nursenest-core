import { NextResponse } from "next/server";

import { loadPublicOsceStationsDtos } from "@/lib/scenarios/osce-stations-resolve.server";

export const dynamic = "force-dynamic";

/**
 * Public read: OSCE stations from DB when populated, otherwise legacy JSON (same shape).
 * Bounded list (≤200) for client hydration / diagnostics.
 */
export async function GET() {
  const { readSource, stations } = await loadPublicOsceStationsDtos();
  return NextResponse.json({
    readSource,
    count: stations.length,
    stations,
  });
}
