import { NextResponse } from "next/server";
import { LearnerNoteScope } from "@prisma/client";
import { z } from "zod";
import type { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { requireSubscriberSession } from "@/lib/entitlements/require-subscriber-session";
import { runWithApiTelemetry } from "@/lib/observability/api-route-telemetry";
import { setSentryServerContext, SERVER_FEATURE } from "@/lib/observability/sentry-server-context";
import { enforceLearnerNotesProtection } from "@/lib/http/api-protection";
import { recordLearnerNoteMutationRollup } from "@/lib/premium-protection/telemetry-db";

const scopeSchema = z.nativeEnum(LearnerNoteScope);

const upsertSchema = z.object({
  scope: scopeSchema,
  contextId: z.string().min(4).max(128),
  pathwayId: z.string().max(64).optional(),
  topic: z.string().max(200).optional(),
  title: z.string().max(200).optional(),
  body: z.string().max(80_000),
});

export async function GET(req: NextRequest) {
  return runWithApiTelemetry(req, "GET /api/learner/notes", "content", async () => {
  const gate = await requireSubscriberSession();
  if (!gate.ok) return gate.response;

  const blocked = await enforceLearnerNotesProtection(req, gate.userId);
  if (blocked) return blocked;

  setSentryServerContext({ route: "/api/learner/notes", feature: SERVER_FEATURE.other, userId: gate.userId });

  const { searchParams } = new URL(req.url);
  const scope = searchParams.get("scope");
  const contextId = searchParams.get("contextId");
  const parsed = z.object({ scope: scopeSchema, contextId: z.string().min(4) }).safeParse({ scope, contextId });
  if (!parsed.success) {
    return NextResponse.json({ error: "scope and contextId required" }, { status: 400 });
  }

  try {
    const note = await prisma.learnerNote.findUnique({
      where: {
        userId_scope_contextId: {
          userId: gate.userId,
          scope: parsed.data.scope,
          contextId: parsed.data.contextId,
        },
      },
      select: { title: true, body: true, updatedAt: true },
    });
    return NextResponse.json({ note });
  } catch {
    return NextResponse.json({ error: "Unable to load notes" }, { status: 503 });
  }
  });
}

export async function POST(req: NextRequest) {
  return runWithApiTelemetry(req, "POST /api/learner/notes", "content", async () => {
  const gate = await requireSubscriberSession();
  if (!gate.ok) return gate.response;

  const blocked = await enforceLearnerNotesProtection(req, gate.userId);
  if (blocked) return blocked;

  setSentryServerContext({ route: "/api/learner/notes", feature: SERVER_FEATURE.other, userId: gate.userId });

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = upsertSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  try {
    const row = await prisma.learnerNote.upsert({
      where: {
        userId_scope_contextId: {
          userId: gate.userId,
          scope: parsed.data.scope,
          contextId: parsed.data.contextId,
        },
      },
      create: {
        userId: gate.userId,
        scope: parsed.data.scope,
        contextId: parsed.data.contextId,
        body: parsed.data.body,
        title: parsed.data.title ?? null,
        pathwayId: parsed.data.pathwayId ?? null,
        topic: parsed.data.topic ?? null,
      },
      update: {
        body: parsed.data.body,
        title: parsed.data.title ?? null,
        pathwayId: parsed.data.pathwayId ?? null,
        topic: parsed.data.topic ?? null,
      },
      select: { id: true, updatedAt: true },
    });
    void recordLearnerNoteMutationRollup("note_upsert", gate.userId).catch(() => {});
    return NextResponse.json({ ok: true, id: row.id, updatedAt: row.updatedAt.toISOString() });
  } catch {
    return NextResponse.json({ error: "Unable to save notes" }, { status: 503 });
  }
  });
}

export async function DELETE(req: NextRequest) {
  return runWithApiTelemetry(req, "DELETE /api/learner/notes", "content", async () => {
  const gate = await requireSubscriberSession();
  if (!gate.ok) return gate.response;

  const blocked = await enforceLearnerNotesProtection(req, gate.userId);
  if (blocked) return blocked;

  const { searchParams } = new URL(req.url);
  const scope = searchParams.get("scope");
  const contextId = searchParams.get("contextId");
  const parsed = z.object({ scope: scopeSchema, contextId: z.string().min(4) }).safeParse({ scope, contextId });
  if (!parsed.success) {
    return NextResponse.json({ error: "scope and contextId required" }, { status: 400 });
  }

  try {
    await prisma.learnerNote.deleteMany({
      where: {
        userId: gate.userId,
        scope: parsed.data.scope,
        contextId: parsed.data.contextId,
      },
    });
    void recordLearnerNoteMutationRollup("note_delete", gate.userId).catch(() => {});
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Unable to delete" }, { status: 503 });
  }
  });
}
