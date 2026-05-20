import { NextRequest, NextResponse } from "next/server";
import { ContentStatus, CountryCode, Prisma, TierCode } from "@prisma/client";
import { requireAdmin } from "@/lib/admin/ensure-admin";
import { prisma } from "@/lib/db";
import { ADMIN_API_LIST_PAGE, parseBoundedPageSize, parseListPage } from "@/lib/api/api-pagination-limits";

/**
 * Admin list for marketing `PathwayLesson` rows (scoped variants per pathway + locale).
 * Editing remains script/ops-heavy; this surface is for visibility, filters, and deep links.
 */
export async function GET(req: NextRequest) {
  const gate = await requireAdmin(req);
  if (!gate.ok) return gate.response;

  const sp = req.nextUrl.searchParams;
  const pageParsed = parseListPage(sp.get("page"));
  if (!pageParsed.ok) {
    return NextResponse.json({ error: pageParsed.error, code: "invalid_page" }, { status: 400 });
  }
  const sizeParsed = parseBoundedPageSize(sp.get("pageSize"), ADMIN_API_LIST_PAGE);
  if (!sizeParsed.ok) {
    return NextResponse.json(
      {
        error: sizeParsed.error.message,
        code: sizeParsed.error.code,
        ...(sizeParsed.error.maxPageSize !== undefined ? { maxPageSize: sizeParsed.error.maxPageSize } : {}),
      },
      { status: 400 },
    );
  }
  const page = pageParsed.page;
  const pageSize = sizeParsed.pageSize;
  const pathwayId = sp.get("pathwayId")?.trim() || null;
  const q = sp.get("q")?.trim() || null;
  const statusParam = sp.get("status") as ContentStatus | null;
  const countryParam = sp.get("country") as CountryCode | null;
  const tierParam = sp.get("tier") as TierCode | null;
  const topicSlug = sp.get("topicSlug")?.trim() || null;

  const where: Prisma.PathwayLessonWhereInput = {};
  if (pathwayId) where.pathwayId = pathwayId;
  if (statusParam && Object.values(ContentStatus).includes(statusParam)) {
    where.status = statusParam;
  }
  if (countryParam && Object.values(CountryCode).includes(countryParam)) {
    where.countryCode = countryParam;
  }
  if (tierParam && Object.values(TierCode).includes(tierParam)) {
    where.tierCode = tierParam;
  }
  if (topicSlug) {
    where.topicSlug = { contains: topicSlug, mode: "insensitive" };
  }
  if (q) {
    where.OR = [
      { title: { contains: q, mode: "insensitive" } },
      { slug: { contains: q, mode: "insensitive" } },
      { topic: { contains: q, mode: "insensitive" } },
    ];
  }

  const skip = (page - 1) * pageSize;

  const [total, rows] = await Promise.all([
    prisma.pathwayLesson.count({ where }),
    prisma.pathwayLesson.findMany({
      where,
      select: {
        id: true,
        pathwayId: true,
        slug: true,
        title: true,
        topic: true,
        topicSlug: true,
        bodySystem: true,
        countryCode: true,
        tierCode: true,
        status: true,
        locale: true,
        sortOrder: true,
        updatedAt: true,
      },
      orderBy: [{ pathwayId: "asc" }, { sortOrder: "asc" }, { slug: "asc" }],
      skip,
      take: pageSize,
    }),
  ]);

  const synthIds = rows.map((r) => `pathway:${r.pathwayId}:${r.slug}`);
  const [opened, completed] = await Promise.all([
    synthIds.length
      ? prisma.progress.groupBy({
          by: ["lessonId"],
          where: { lessonId: { in: synthIds } },
          _count: { _all: true },
        })
      : Promise.resolve([]),
    synthIds.length
      ? prisma.progress.groupBy({
          by: ["lessonId"],
          where: { lessonId: { in: synthIds }, completed: true },
          _count: { _all: true },
        })
      : Promise.resolve([]),
  ]);
  const openedMap = new Map(opened.map((g) => [g.lessonId, g._count._all]));
  const completedMap = new Map(completed.map((g) => [g.lessonId, g._count._all]));

  const lessons = rows.map((r) => {
    const sid = `pathway:${r.pathwayId}:${r.slug}`;
    return {
      ...r,
      updatedAt: r.updatedAt.toISOString(),
      progressSyntheticId: sid,
      progressUsersOpened: openedMap.get(sid) ?? 0,
      progressUsersCompleted: completedMap.get(sid) ?? 0,
      publicPathHint: `/${r.locale}/…/${r.pathwayId}/lessons/…/${r.slug}`,
    };
  });

  return NextResponse.json({
    page,
    pageSize,
    total,
    lessons,
    filters: {
      statusOptions: Object.values(ContentStatus),
      countryOptions: Object.values(CountryCode),
      tierOptions: Object.values(TierCode),
    },
  });
}
