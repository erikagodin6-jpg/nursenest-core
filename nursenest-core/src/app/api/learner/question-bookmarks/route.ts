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
  QUESTION_BOOKMARK_CATEGORIES,
  QUESTION_BOOKMARK_SOURCE_TYPES,
  buildQuestionBookmarkContextId,
  decodeQuestionBookmarkBody,
  encodeQuestionBookmarkBody,
  normalizeQuestionBookmarkCategory,
  questionBookmarkNotebookSourceType,
  type QuestionBookmarkCategory,
  type QuestionBookmarkSourceType,
} from "@/lib/bookmarks/question-bookmarks";
import { notebookScopeForSource } from "@/lib/learner/personal-study-notebook";

const bookmarkSaveSchema = z.object({
  sourceType: z.enum(QUESTION_BOOKMARK_SOURCE_TYPES),
  sourceId: z.string().min(1).max(1_000),
  title: z.string().min(1).max(200),
  topic: z.string().max(200).optional().nullable(),
  difficulty: z.string().max(80).optional().nullable(),
  sourceHref: z.string().max(400).optional().nullable(),
  pathwayId: z.string().max(64).optional().nullable(),
  category: z.enum(QUESTION_BOOKMARK_CATEGORIES).optional(),
});

const bookmarkDeleteSchema = z.object({
  ids: z.array(z.string().min(1)).max(100).optional(),
  sources: z.array(z.object({
    sourceType: z.enum(QUESTION_BOOKMARK_SOURCE_TYPES),
    sourceId: z.string().min(1).max(1_000),
  })).max(100).optional(),
});

export async function GET(req: NextRequest) {
  return runWithApiTelemetry(req, "GET /api/learner/question-bookmarks", "content", async () => {
    const gate = await requireSubscriberSession();
    if (!gate.ok) return gate.response;

    const blocked = await enforceLearnerNotesProtection(req, gate.userId);
    if (blocked) return blocked;

    setSentryServerContext({ route: "/api/learner/question-bookmarks", feature: SERVER_FEATURE.other, userId: gate.userId });

    try {
      const rows = await prisma.learnerNote.findMany({
        where: {
          userId: gate.userId,
          scope: { in: [LearnerNoteScope.QUESTION_BANK, LearnerNoteScope.PRACTICE_TEST, LearnerNoteScope.FLASHCARD_DECK, LearnerNoteScope.PATHWAY_LESSON] },
          contextId: { startsWith: "nb:saved_questions:" },
        },
        orderBy: { updatedAt: "desc" },
        take: 500,
        select: {
          id: true,
          contextId: true,
          title: true,
          body: true,
          topic: true,
          pathwayId: true,
          createdAt: true,
          updatedAt: true,
        },
      });
      return NextResponse.json({ bookmarks: rows.map(decodeQuestionBookmarkBody).filter(Boolean) });
    } catch {
      return NextResponse.json({ error: "Unable to load question bookmarks" }, { status: 503 });
    }
  });
}

export async function POST(req: NextRequest) {
  return runWithApiTelemetry(req, "POST /api/learner/question-bookmarks", "content", async () => {
    const gate = await requireSubscriberSession();
    if (!gate.ok) return gate.response;

    const blocked = await enforceLearnerNotesProtection(req, gate.userId);
    if (blocked) return blocked;

    setSentryServerContext({ route: "/api/learner/question-bookmarks", feature: SERVER_FEATURE.other, userId: gate.userId });

    let body: unknown;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
    }

    const parsed = bookmarkSaveSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid bookmark payload" }, { status: 400 });
    }

    const sourceType = parsed.data.sourceType as QuestionBookmarkSourceType;
    const category = normalizeQuestionBookmarkCategory(parsed.data.category) as QuestionBookmarkCategory;
    const notebookSourceType = questionBookmarkNotebookSourceType(sourceType);
    const scope = notebookScopeForSource(notebookSourceType, "saved_questions") as LearnerNoteScope;
    const contextId = buildQuestionBookmarkContextId(sourceType, parsed.data.sourceId);
    const encodedBody = encodeQuestionBookmarkBody({
      sourceType,
      sourceId: parsed.data.sourceId,
      title: parsed.data.title,
      category,
      topic: parsed.data.topic ?? null,
      difficulty: parsed.data.difficulty ?? null,
      sourceHref: parsed.data.sourceHref ?? null,
      pathwayId: parsed.data.pathwayId ?? null,
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
          topic: parsed.data.topic ?? null,
          title: parsed.data.title,
          body: encodedBody,
        },
        update: {
          pathwayId: parsed.data.pathwayId ?? null,
          topic: parsed.data.topic ?? null,
          title: parsed.data.title,
          body: encodedBody,
        },
        select: { id: true, updatedAt: true },
      });
      void recordLearnerNoteMutationRollup("note_upsert", gate.userId).catch(() => {});
      return NextResponse.json({ ok: true, id: row.id, contextId, updatedAt: row.updatedAt.toISOString() });
    } catch {
      return NextResponse.json({ error: "Unable to save question bookmark" }, { status: 503 });
    }
  });
}

export async function DELETE(req: NextRequest) {
  return runWithApiTelemetry(req, "DELETE /api/learner/question-bookmarks", "content", async () => {
    const gate = await requireSubscriberSession();
    if (!gate.ok) return gate.response;

    const blocked = await enforceLearnerNotesProtection(req, gate.userId);
    if (blocked) return blocked;

    let body: unknown;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
    }

    const parsed = bookmarkDeleteSchema.safeParse(body);
    if (!parsed.success || (!parsed.data.ids?.length && !parsed.data.sources?.length)) {
      return NextResponse.json({ error: "ids or sources required" }, { status: 400 });
    }

    const contextIds = (parsed.data.sources ?? []).map((source) =>
      buildQuestionBookmarkContextId(source.sourceType as QuestionBookmarkSourceType, source.sourceId),
    );

    try {
      const deleted = await prisma.learnerNote.deleteMany({
        where: {
          userId: gate.userId,
          OR: [
            ...(parsed.data.ids?.length ? [{ id: { in: parsed.data.ids } }] : []),
            ...(contextIds.length ? [{ contextId: { in: contextIds } }] : []),
          ],
        },
      });
      void recordLearnerNoteMutationRollup("note_delete", gate.userId).catch(() => {});
      return NextResponse.json({ ok: true, deleted: deleted.count });
    } catch {
      return NextResponse.json({ error: "Unable to delete question bookmarks" }, { status: 503 });
    }
  });
}
