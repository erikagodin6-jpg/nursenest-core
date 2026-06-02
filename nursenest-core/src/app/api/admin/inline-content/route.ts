import { NextResponse } from "next/server";
import { InlineContentKind } from "@prisma/client";
import { z } from "zod";
import { requireAdmin } from "@/lib/admin/ensure-admin";
import { prisma } from "@/lib/db";
import { sanitizeInlineRichHtml } from "@/lib/inline-content/sanitize-inline-html";
import { safeServerLog } from "@/lib/observability/safe-server-log";

const noStoreJsonInit = { headers: { "Cache-Control": "no-store" } } as const;

const patchSchema = z
  .object({
    key: z.string().min(1).max(512),
    body: z.string().max(200_000),
    kind: z.nativeEnum(InlineContentKind),
  })
  .strict();

export async function PATCH(req: Request) {
  const gate = await requireAdmin(req);
  if (!gate.ok) {
    const denied = gate.response.clone();
    denied.headers.set("Cache-Control", "no-store");
    return denied;
  }

  let raw: unknown;
  try {
    raw = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400, ...noStoreJsonInit });
  }

  const parsed = patchSchema.safeParse(raw);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400, ...noStoreJsonInit });
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

  safeServerLog("admin", "inline_content_patch_ok", {
    method: "PATCH",
    path: "/api/admin/inline-content",
    keyPrefix: key.slice(0, 64),
    userIdPrefix: admin.userId.slice(0, 8),
    kind,
  });

  return NextResponse.json({ ok: true, key, kind }, noStoreJsonInit);
}
