import { ContentAutomationLogCategory, ContentAutomationLogStatus, Prisma } from "@prisma/client";
import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin/ensure-admin";
import { prisma } from "@/lib/db";

const MAX_HOURS = 24 * 90;

function parseEnumValue<T extends string>(raw: string | null, allowed: readonly T[]): T | undefined {
  if (!raw) return undefined;
  return allowed.includes(raw as T) ? (raw as T) : undefined;
}

/**
 * Admin-only list of content automation / blog generation logs (newest first).
 * Optional: `hours` (1–2160) filters createdAt; `search` matches summary/error/topic (min 2 chars); `id` for one row.
 */
export async function GET(req: Request) {
  const gate = await requireAdmin();
  if (!gate.ok) return gate.response;

  const { searchParams } = new URL(req.url);
  const logId = searchParams.get("id")?.trim() ?? "";
  const limit = Math.min(100, Math.max(1, Number(searchParams.get("limit") ?? "50") || 50));
  const offset = Math.max(0, Number(searchParams.get("offset") ?? "0") || 0);
  const category = parseEnumValue(searchParams.get("category"), Object.values(ContentAutomationLogCategory));
  const status = parseEnumValue(searchParams.get("status"), Object.values(ContentAutomationLogStatus));
  const hoursRaw = searchParams.get("hours");
  const hours =
    hoursRaw != null && hoursRaw !== ""
      ? Math.min(MAX_HOURS, Math.max(1, Math.floor(Number(hoursRaw) || 0)))
      : undefined;
  const searchRaw = searchParams.get("search")?.trim() ?? "";

  const since =
    hours != null ? new Date(Date.now() - hours * 60 * 60 * 1000) : undefined;

  const searchFilter: Prisma.ContentAutomationLogWhereInput | undefined =
    searchRaw.length >= 2
      ? {
          OR: [
            { summary: { contains: searchRaw, mode: "insensitive" } },
            { error: { contains: searchRaw, mode: "insensitive" } },
            { topic: { contains: searchRaw, mode: "insensitive" } },
          ],
        }
      : undefined;

  const where: Prisma.ContentAutomationLogWhereInput =
    logId.length > 0
      ? { id: logId }
      : {
          ...(category ? { category } : {}),
          ...(status ? { status } : {}),
          ...(since ? { createdAt: { gte: since } } : {}),
          ...(searchFilter ? searchFilter : {}),
        };

  const [rows, total] = await Promise.all([
    prisma.contentAutomationLog.findMany({
      where,
      orderBy: [{ createdAt: "desc" }, { id: "desc" }],
      skip: offset,
      take: limit,
      select: {
        id: true,
        category: true,
        jobType: true,
        status: true,
        topic: true,
        summary: true,
        error: true,
        metadata: true,
        blogPostId: true,
        correlationId: true,
        sourceItemId: true,
        retryOfId: true,
        completedAt: true,
        createdAt: true,
        blogPost: { select: { id: true, slug: true, title: true, postStatus: true } },
      },
    }),
    prisma.contentAutomationLog.count({ where }),
  ]);

  return NextResponse.json({ ok: true, logs: rows, total, limit, offset });
}
