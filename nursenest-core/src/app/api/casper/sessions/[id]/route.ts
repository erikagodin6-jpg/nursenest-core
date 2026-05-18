import { NextResponse } from "next/server";

import {
  getCasperSessionById,
  saveCasperSession,
} from "@/lib/casper/casper-storage";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{ id: string }>;
};

type UpdateCasperSessionBody = {
  status?: "draft" | "in-progress" | "completed";
  responses?: Array<{
    scenarioId: string;
    responseText: string;
  }>;
};

export async function GET(
  _request: Request,
  { params }: PageProps,
): Promise<Response> {
  const { id } = await params;

  const session = await getCasperSessionById(id);

  if (!session) {
    return NextResponse.json(
      { ok: false, error: "CASPer session not found." },
      { status: 404 },
    );
  }

  return NextResponse.json({ ok: true, session });
}

export async function PATCH(
  request: Request,
  { params }: PageProps,
): Promise<Response> {
  const { id } = await params;

  const existing = await getCasperSessionById(id);

  if (!existing) {
    return NextResponse.json(
      { ok: false, error: "CASPer session not found." },
      { status: 404 },
    );
  }

  const body = (await request.json().catch(() => ({}))) as UpdateCasperSessionBody;

  const updated = {
    ...existing,
    status: body.status ?? existing.status,
    responses:
      body.responses?.map((response) => ({
        ...response,
        createdAtIso: new Date().toISOString(),
        updatedAtIso: new Date().toISOString(),
      })) ?? existing.responses,
  };

  await saveCasperSession(updated);

  return NextResponse.json({ ok: true, session: updated });
}
