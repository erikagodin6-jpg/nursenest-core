import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import {
  clearPrismaQueryLog,
  getPrismaQueryLog,
} from "@/lib/db/prisma-query-capture";
import {
  clearPrismaQueryViolations,
  getPrismaQueryViolations,
} from "@/lib/db/prisma-query-audit";
import "@/lib/db";

export const dynamic = "force-dynamic";

/**
 * Authenticated diagnostic: bounded-read / full-table-scan heuristics from `prisma-query-audit.ts`
 * (fed by `$on('query')` when query logging is enabled — dev/test or `PRISMA_QUERY_AUDIT=1`).
 *
 * - **GET** — current violation list + query capture count.
 * - **POST** `{ "clear": true }` — reset violations + ring buffer before a navigation-heavy E2E step.
 */
export async function GET() {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const violations = getPrismaQueryViolations();
  return NextResponse.json({
    violations,
    violationsCount: violations.length,
    queriesCaptured: getPrismaQueryLog().length,
  });
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: { clear?: boolean } = {};
  try {
    body = (await req.json()) as { clear?: boolean };
  } catch {
    body = {};
  }

  if (body.clear === true) {
    clearPrismaQueryViolations();
    clearPrismaQueryLog();
  }

  return NextResponse.json({
    cleared: body.clear === true,
    violations: getPrismaQueryViolations(),
    violationsCount: getPrismaQueryViolations().length,
    queriesCaptured: getPrismaQueryLog().length,
  });
}
