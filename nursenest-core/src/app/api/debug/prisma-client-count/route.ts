import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import "@/lib/db";

export const dynamic = "force-dynamic";

/**
 * Authenticated diagnostic: `globalThis.__PRISMA_CLIENT_COUNT__` increments each time `new PrismaClient()`
 * runs in `src/lib/db.ts`. Value `1` is expected; `>1` indicates duplicate construction (see server
 * warning containing "Multiple Prisma clients detected").
 *
 * Same-origin + session only — not for anonymous callers.
 */
export async function GET() {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const g = globalThis as typeof globalThis & { __PRISMA_CLIENT_COUNT__?: number };
  const instantiationCount = g.__PRISMA_CLIENT_COUNT__ ?? 0;

  return NextResponse.json({
    instantiationCount,
    multipleDetected: instantiationCount > 1,
  });
}
