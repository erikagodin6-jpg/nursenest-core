import { NextResponse } from "next/server";
import type { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";

import { requireAdmin } from "@/lib/admin/ensure-admin";
import { prisma } from "@/lib/db";
import { osceStationPatchSchema } from "@/lib/scenarios/osce-station-admin-schemas";

export const dynamic = "force-dynamic";

function revalidateOsceSurfaces() {
  try {
    revalidatePath("/app/osce");
    revalidatePath("/app/osce", "page");
  } catch {
    /* ignore revalidate failures in non-Next contexts */
  }
}

export async function PATCH(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const gate = await requireAdmin(req);
  if (!gate.ok) return gate.response;
  const { id } = await ctx.params;
  const existing = await prisma.osceStation.findUnique({ where: { id } });
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const parsed = osceStationPatchSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Validation failed", details: parsed.error.flatten() }, { status: 400 });
  }

  const p = parsed.data;
  const data: Prisma.OsceStationUpdateInput = {};
  if (p.slug !== undefined) data.slug = p.slug;
  if (p.title !== undefined) data.title = p.title;
  if (p.description !== undefined) data.description = p.description.trim();
  if (p.scenarioIntro !== undefined) data.scenarioIntro = p.scenarioIntro;
  if (p.candidateInstructions !== undefined) data.candidateInstructions = p.candidateInstructions ?? null;
  if (p.patientScript !== undefined) data.patientScript = p.patientScript ?? null;
  if (p.steps !== undefined) data.steps = p.steps as Prisma.InputJsonValue;
  if (p.examinerChecklist !== undefined) data.examinerChecklist = p.examinerChecklist as Prisma.InputJsonValue;
  if (p.criticalFails !== undefined) data.criticalFails = p.criticalFails;
  if (p.rationales !== undefined) data.rationales = p.rationales as Prisma.InputJsonValue;
  if (p.timeLimit !== undefined) data.timeLimit = p.timeLimit ?? null;
  if (p.difficulty !== undefined) data.difficulty = p.difficulty;
  if (p.category !== undefined) data.category = p.category;
  if (p.pathwayId !== undefined) data.pathwayId = p.pathwayId ?? null;
  if (p.isPublished !== undefined) data.isPublished = p.isPublished;
  if (p.domain !== undefined) data.domain = p.domain ?? null;
  if (p.roleTrack !== undefined) data.roleTrack = p.roleTrack ?? null;
  if (p.sourceLegacyPath !== undefined) data.sourceLegacyPath = p.sourceLegacyPath ?? null;
  if (p.extensions !== undefined) data.extensions = p.extensions as Prisma.InputJsonValue;

  const updated = await prisma.osceStation.update({
    where: { id },
    data,
  });
  revalidateOsceSurfaces();
  return NextResponse.json({ ok: true, station: updated });
}
