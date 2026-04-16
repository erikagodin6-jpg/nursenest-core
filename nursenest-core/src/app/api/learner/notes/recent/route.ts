import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { requireSubscriberSession } from "@/lib/entitlements/require-subscriber-session";
import { runWithApiTelemetry } from "@/lib/observability/api-route-telemetry";
import { setSentryServerContext, SERVER_FEATURE } from "@/lib/observability/sentry-server-context";
import { enforceLearnerNotesProtection } from "@/lib/http/api-protection";
import { hrefForLearnerNote, labelForLearnerNoteScope } from "@/lib/learner/learner-note-href";

const DEFAULT_TAKE = 8;
const MAX_TAKE = 20;

export async function GET(req: NextRequest) {
  return runWithApiTelemetry(req, "GET /api/learner/notes/recent", "content", async () => {
  const gate = await requireSubscriberSession();
  if (!gate.ok) return gate.response;

  const blocked = await enforceLearnerNotesProtection(req, gate.userId);
  if (blocked) return blocked;

  setSentryServerContext({ route: "/api/learner/notes/recent", feature: SERVER_FEATURE.other, userId: gate.userId });

  const { searchParams } = new URL(req.url);
  const takeRaw = searchParams.get("take");
  const take = Math.min(MAX_TAKE, Math.max(1, takeRaw ? Number(takeRaw) || DEFAULT_TAKE : DEFAULT_TAKE));

  try {
    const rows = await prisma.learnerNote.findMany({
      where: { userId: gate.userId },
      orderBy: { updatedAt: "desc" },
      take,
      select: {
        scope: true,
        contextId: true,
        title: true,
        updatedAt: true,
      },
    });

    const notes = rows.map((r) => ({
      scope: r.scope,
      contextId: r.contextId,
      title: r.title,
      updatedAt: r.updatedAt.toISOString(),
      href: hrefForLearnerNote(r.scope, r.contextId),
      scopeLabel: labelForLearnerNoteScope(r.scope),
    }));

    return NextResponse.json({ notes });
  } catch {
    return NextResponse.json({ error: "Unable to load notes" }, { status: 503 });
  }
  });
}
