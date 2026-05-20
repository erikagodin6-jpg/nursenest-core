import { NextResponse } from "next/server";
import type { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";

import { requireAdmin } from "@/lib/admin/ensure-admin";
import { prisma } from "@/lib/db";
import {
  LEGACY_OSCE_SKILL_DATA_SOURCES,
  getMergedLegacyOsceSkillStations,
} from "@/lib/scenarios/legacy-osce-stations-runtime";
import { osceStationPostSchema } from "@/lib/scenarios/osce-station-admin-schemas";
import { prismaOsceRowToPublicDto } from "@/lib/scenarios/osce-station-mapper";
import { isOsceDatabasePopulated } from "@/lib/scenarios/osce-stations-resolve.server";

export const dynamic = "force-dynamic";

function revalidateOsceSurfaces() {
  try {
    revalidatePath("/app/osce");
    revalidatePath("/app/osce", "page");
  } catch {
    /* ignore */
  }
}

/**
 * Admin inventory: DB-backed OSCE stations when the table is populated; otherwise legacy preview.
 * Write path: `POST` creates rows; `PATCH /api/admin/osce-stations/[id]` updates by DB id.
 */
export async function GET(req: Request) {
  const gate = await requireAdmin(req);
  if (!gate.ok) return gate.response;

  const dbPopulated = await isOsceDatabasePopulated();
  if (dbPopulated) {
    const rows = await prisma.osceStation.findMany({
      orderBy: { title: "asc" },
      take: 200,
    });
    return NextResponse.json({
      readSource: "db",
      legacySourcePaths: [...LEGACY_OSCE_SKILL_DATA_SOURCES],
      pathwayScope: "nursing-non-allied-shared-bank",
      count: rows.length,
      stations: rows.map(prismaOsceRowToPublicDto),
    });
  }

  const merged = getMergedLegacyOsceSkillStations();
  return NextResponse.json({
    readSource: "legacy-bundled",
    legacySourcePaths: [...LEGACY_OSCE_SKILL_DATA_SOURCES],
    pathwayScope: "nursing-non-allied-shared-bank",
    count: merged.length,
    stations: merged.map((s) => ({
      dbId: "",
      id: s.id,
      title: s.title,
      category: s.category,
      difficulty: s.difficulty,
    })),
  });
}

export async function POST(req: Request) {
  const gate = await requireAdmin(req);
  if (!gate.ok) return gate.response;

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const parsed = osceStationPostSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Validation failed", details: parsed.error.flatten() }, { status: 400 });
  }
  const p = parsed.data;
  const data: Prisma.OsceStationCreateInput = {
    slug: p.slug,
    title: p.title,
    description: p.description?.trim() ?? "",
    scenarioIntro: p.scenarioIntro,
    candidateInstructions: p.candidateInstructions ?? null,
    patientScript: p.patientScript ?? null,
    steps: p.steps as Prisma.InputJsonValue,
    examinerChecklist: (p.examinerChecklist ?? []) as Prisma.InputJsonValue,
    criticalFails: p.criticalFails ?? [],
    rationales: (p.rationales ?? []) as Prisma.InputJsonValue,
    timeLimit: p.timeLimit ?? null,
    difficulty: p.difficulty,
    category: p.category,
    pathwayId: p.pathwayId ?? null,
    isPublished: p.isPublished ?? true,
    domain: p.domain ?? null,
    roleTrack: p.roleTrack ?? null,
    sourceLegacyPath: p.sourceLegacyPath ?? null,
    extensions: (p.extensions ?? {}) as Prisma.InputJsonValue,
  };

  try {
    const created = await prisma.osceStation.create({ data });
    revalidateOsceSurfaces();
    return NextResponse.json({ ok: true, station: created }, { status: 201 });
  } catch (e) {
    const msg = String(e);
    if (msg.includes("Unique constraint") || msg.includes("unique constraint")) {
      return NextResponse.json({ error: "Slug already exists" }, { status: 409 });
    }
    throw e;
  }
}
