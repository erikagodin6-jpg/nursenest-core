import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { flashcardAccessWhere } from "@/lib/entitlements/content-access-scope";
import { requireSubscriberSession } from "@/lib/entitlements/require-subscriber-session";
import { prisma } from "@/lib/db";
import { logLargeApiResponse } from "@/lib/observability/perf-log";
import { safeServerLogCritical } from "@/lib/observability/safe-server-log";
import { estimateJsonUtf8Bytes } from "@/lib/questions/question-payload-metrics";
import { setSentryServerContext } from "@/lib/observability/sentry-server-context";
import { withRetry } from "@/lib/resilience/with-retry";

/**
 * Subscriber-only flashcard list (backend-enforced; no freemium bypass of full backs).
 */
export async function GET(req: NextRequest) {
  const session = await auth();
  const userId = (session?.user as { id?: string } | undefined)?.id;
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const page = Math.max(1, Number(req.nextUrl.searchParams.get("page") ?? "1"));
  const pageSize = Math.min(30, Math.max(5, Number(req.nextUrl.searchParams.get("pageSize") ?? "12")));

  const gate = await requireSubscriberSession();
  if (!gate.ok) return gate.response;

  setSentryServerContext({ route: "/api/flashcards", feature: "flashcard", userId: gate.userId });

  try {
    const where = flashcardAccessWhere(gate.entitlement);
    const [flashcards, total] = await Promise.all([
      withRetry(() =>
        prisma.flashcard.findMany({
          where,
          select: {
            id: true,
            front: true,
            back: true,
            examFamily: true,
            category: { select: { name: true, slug: true } },
          },
          orderBy: { updatedAt: "desc" },
          skip: (page - 1) * pageSize,
          take: pageSize,
        }),
      ),
      withRetry(() => prisma.flashcard.count({ where })),
    ]);

    const pageCount = Math.max(1, Math.ceil(total / pageSize));

    const body = {
      page,
      pageSize,
      total,
      pageCount,
      flashcards,
      mode: "subscriber" as const,
    };
    logLargeApiResponse("/api/flashcards", estimateJsonUtf8Bytes(body));
    return NextResponse.json(body);
  } catch (e) {
    safeServerLogCritical("api_flashcards", "find_failed", { page }, e);
    return NextResponse.json({ error: "Unable to load flashcards" }, { status: 503 });
  }
}
