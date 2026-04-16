import { NextResponse } from "next/server";
import { InlineContentKind } from "@prisma/client";
import { z } from "zod";
import { requireAdmin } from "@/lib/admin/ensure-admin";
import { prisma } from "@/lib/db";
import { sanitizeInlineRichHtml } from "@/lib/inline-content/sanitize-inline-html";

const patchSchema = z
  .object({
    key: z.string().min(1).max(512),
    body: z.string().max(200_000),
    kind: z.nativeEnum(InlineContentKind),
  })
  .strict();

export async function PATCH(req: Request) {
  const gate = await requireAdmin(req);
  if (!gate.ok) return gate.response;

  let raw: unknown;
  try {
    raw = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = patchSchema.safeParse(raw);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const { key, kind } = parsed.data;
  let { body } = parsed.data;
  if (kind === "RICH_HTML") {
    body = sanitizeInlineRichHtml(body);
  }

  const admin = gate.admin;

  await prisma.inlineContentEntry.upsert({
    where: { key },
    create: {
      key,
      body,
      kind,
      updatedById: admin.userId,
    },
    update: {
      body,
      kind,
      updatedById: admin.userId,
    },
  });

  return NextResponse.json({ ok: true, key, kind });
}
