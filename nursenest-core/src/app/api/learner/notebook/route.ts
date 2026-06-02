import { NextResponse } from "next/server";
import { LearnerNoteScope } from "@prisma/client";
import { z } from "zod";
import type { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { requireSubscriberSession } from "@/lib/entitlements/require-subscriber-session";
import { enforceLearnerNotesProtection } from "@/lib/http/api-protection";
import { runWithApiTelemetry } from "@/lib/observability/api-route-telemetry";
import { SERVER_FEATURE, setSentryServerContext } from "@/lib/observability/sentry-server-context";
import { recordLearnerNoteMutationRollup } from "@/lib/premium-protection/telemetry-db";
import {
  NOTEBOOK_CATEGORIES,
  NOTEBOOK_SOURCE_TYPES,
  buildNotebookContextId,
  encodeNotebookBody,
  notebookScopeForSource,
  normalizeNotebookTags,
} from "@/lib/learner/personal-study-notebook";

const notebookSaveSchema = z.object({
  category: z.enum(NOTEBOOK_CATEGORIES),
  sourceType: z.enum(NOTEBOOK_SOURCE_TYPES),
  sourceId: z.string().min(1).max(1_000),
  title: z.string().min(1).max(200),
  content: z.string().min(1).max(60_000),
  sourceHref: z.string().max(400).optional(),
  pathwayId: z.string().max(64).optional(),
  system: z.string().max(80).optional(),
  topic: z.string().max(200).optional(),
  tags: z.array(z.string().max(40)).max(12).optional(),
  favorite: z.boolean().optional(),
});

export async function POST(req: NextRequest) {
  return runWithApiTelemetry(req, "POST /api/learner/notebook", "content", async () => {
    const gate = await requireSubscriberSession();
    if (!gate.ok) return gate.response;

    const blocked = await enforceLearnerNotesProtection(req, gate.userId);
    if (blocked) return blocked;

    setSentryServerContext({ route: "/api/learner/notebook", feature: SERVER_FEATURE.other, userId: gate.userId });

    let body: unknown;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
    }

    const parsed = notebookSaveSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid notebook payload" }, { status: 400 });
    }

    const scope = notebookScopeForSource(parsed.data.sourceType, parsed.data.category) as LearnerNoteScope;
    const contextId = buildNotebookContextId({
      category: parsed.data.category,
      sourceType: parsed.data.sourceType,
      sourceId: parsed.data.sourceId,
    });
    const encodedBody = encodeNotebookBody({
      category: parsed.data.category,
      sourceType: parsed.data.sourceType,
      content: parsed.data.content,
      sourceTitle: parsed.data.title,
      sourceHref: parsed.data.sourceHref ?? null,
      system: parsed.data.system ?? null,
      topic: parsed.data.topic ?? null,
      tags: normalizeNotebookTags(parsed.data.tags),
      favorite: Boolean(parsed.data.favorite),
      createdByLabel: "Save to Notebook",
    });

    try {
      const row = await prisma.learnerNote.upsert({
        where: {
          userId_scope_contextId: {
            userId: gate.userId,
            scope,
            contextId,
          },
        },
        create: {
          userId: gate.userId,
          scope,
          contextId,
          pathwayId: parsed.data.pathwayId ?? null,
          topic: parsed.data.topic ?? parsed.data.system ?? null,
          title: parsed.data.title,
          body: encodedBody,
        },
        update: {
          pathwayId: parsed.data.pathwayId ?? null,
          topic: parsed.data.topic ?? parsed.data.system ?? null,
          title: parsed.data.title,
          body: encodedBody,
        },
        select: { id: true, updatedAt: true },
      });
      void recordLearnerNoteMutationRollup("note_upsert", gate.userId).catch(() => {});
      return NextResponse.json({ ok: true, id: row.id, contextId, updatedAt: row.updatedAt.toISOString() });
    } catch {
      return NextResponse.json({ error: "Unable to save notebook entry" }, { status: 503 });
    }
  });
}
