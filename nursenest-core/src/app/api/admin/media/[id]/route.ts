import { requireAdmin } from "@/lib/admin/ensure-admin";
import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

function normalizeTags(input: unknown): string[] | null {
  if (!Array.isArray(input)) return null;
  const out = input
    .filter((x): x is string => typeof x === "string")
    .map((s) => s.trim().toLowerCase().replace(/\s+/g, "-"))
    .filter((s) => s.length > 0 && s.length < 64);
  return Array.from(new Set(out)).slice(0, 24);
}

export async function PATCH(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const gate = await requireAdmin(req);
  if (!gate.ok) return gate.response;

  const { id } = await ctx.params;
  if (!id) {
    return NextResponse.json({ error: "Missing id" }, { status: 400 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  const b = body as Record<string, unknown>;
  const data: { altText?: string | null; tags?: string[] } = {};

  if ("altText" in b) {
    if (b.altText === null || b.altText === undefined) {
      data.altText = null;
    } else if (typeof b.altText === "string") {
      data.altText = b.altText.trim().slice(0, 2000) || null;
    } else {
      return NextResponse.json({ error: "altText must be string or null" }, { status: 400 });
    }
  }

  if ("tags" in b) {
    const tags = normalizeTags(b.tags);
    if (tags === null) {
      return NextResponse.json({ error: "tags must be string[]" }, { status: 400 });
    }
    data.tags = tags;
  }

  if (Object.keys(data).length === 0) {
    return NextResponse.json({ error: "No valid fields" }, { status: 400 });
  }

  try {
    const row = await prisma.mediaAsset.update({
      where: { id },
      data,
    });
    return NextResponse.json({
      asset: {
        id: row.id,
        altText: row.altText,
        tags: row.tags,
        updatedAt: row.updatedAt.toISOString(),
      },
    });
  } catch {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
}
