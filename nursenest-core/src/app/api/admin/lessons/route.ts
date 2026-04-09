import { NextRequest, NextResponse } from "next/server";
import { ContentStatus } from "@prisma/client";
import { z } from "zod";
import {
  buildContentLessonWhere,
  regionScopeToCountryLabel,
  tierDbToPathwayLabel,
  type AdminContentLessonListQuery,
} from "@/lib/admin/admin-content-lessons-query";
import { requireAdmin } from "@/lib/admin/ensure-admin";
import { validateLessonForPublish } from "@/lib/content/publish-validation";
import { prisma } from "@/lib/db";
import { bodyStringToContentJson } from "@/lib/prisma/content-item-body";
import { contentStatusToDb } from "@/lib/prisma/content-status";
import { tierCodeToContentItemTier } from "@/lib/prisma/exam-question-maps";

const createSchema = z.object({
  title: z.string().min(4),
  slug: z.string().min(4),
  summary: z.string().min(10),
  body: z.string().min(20),
  country: z.enum(["CA", "US"]),
  tier: z.enum(["RPN", "LVN_LPN", "RN", "NP", "ALLIED"]),
  categoryId: z.string().min(5),
  status: z.nativeEnum(ContentStatus).default(ContentStatus.DRAFT),
  examFamily: z.enum(["NCLEX_RN", "NCLEX_PN", "REX_PN", "NP", "ALLIED", "GENERIC"]).optional(),
  difficulty: z.enum(["FOUNDATION", "INTERMEDIATE", "ADVANCED"]).optional(),
  topicTag: z.string().optional(),
  systemTag: z.string().optional(),
  tags: z.array(z.string()).optional(),
  sourceNotes: z.string().optional(),
  /** Shared-core key when this row is a scoped variant of canonical content. */
  versionKey: z.string().max(200).nullable().optional(),
});

function parseListQuery(sp: URLSearchParams): AdminContentLessonListQuery {
  const page = Math.max(1, Number(sp.get("page") ?? "1"));
  const pageSize = Math.min(100, Math.max(10, Number(sp.get("pageSize") ?? "50")));
  const statusRaw = sp.get("status");
  const status =
    statusRaw && Object.values(ContentStatus).includes(statusRaw as ContentStatus)
      ? (statusRaw as ContentStatus)
      : null;
  const tierParam = sp.get("tier")?.toLowerCase() ?? null;
  const tier =
    tierParam && ["rpn", "lvn", "rn", "np", "allied"].includes(tierParam) ? tierParam : tierParam === "lvn_lpn" ? "lvn" : null;
  const countryRaw = sp.get("country")?.toLowerCase() ?? null;
  const country =
    countryRaw === "ca" ? "CA" : countryRaw === "us" ? "US" : countryRaw === "both" ? "both" : null;
  const topicDomain = sp.get("topicDomain")?.trim() || null;
  const search = sp.get("q")?.trim() || sp.get("search")?.trim() || null;
  return { page, pageSize, status, tier, country, topicDomain, search };
}

export async function GET(req: NextRequest) {
  const gate = await requireAdmin();
  if (!gate.ok) return gate.response;

  const q = parseListQuery(req.nextUrl.searchParams);
  const where = buildContentLessonWhere(q);
  const skip = (q.page - 1) * q.pageSize;

  const [total, lessons] = await Promise.all([
    prisma.contentItem.count({ where }),
    prisma.contentItem.findMany({
      where,
      select: {
        id: true,
        title: true,
        slug: true,
        status: true,
        tier: true,
        regionScope: true,
        category: true,
        bodySystem: true,
        type: true,
        versionKey: true,
        summary: true,
        updatedAt: true,
        publishedAt: true,
      },
      orderBy: { updatedAt: "desc" },
      skip,
      take: q.pageSize,
    }),
  ]);

  const ids = lessons.map((l) => l.id);

  const [openedGroup, completedGroup] = await Promise.all([
    ids.length
      ? prisma.progress.groupBy({
          by: ["lessonId"],
          where: { lessonId: { in: ids } },
          _count: { _all: true },
        })
      : Promise.resolve([]),
    ids.length
      ? prisma.progress.groupBy({
          by: ["lessonId"],
          where: { lessonId: { in: ids }, completed: true },
          _count: { _all: true },
        })
      : Promise.resolve([]),
  ]);

  const openedMap = new Map(openedGroup.map((g) => [g.lessonId, g._count._all]));
  const completedMap = new Map(completedGroup.map((g) => [g.lessonId, g._count._all]));

  const rows = lessons.map((l) => {
    const summaryLen = (l.summary ?? "").trim().length;
    return {
      id: l.id,
      title: l.title,
      slug: l.slug,
      pathwayLabel: tierDbToPathwayLabel(l.tier),
      countryLabel: regionScopeToCountryLabel(l.regionScope),
      topicDomain: l.bodySystem ?? l.category ?? null,
      category: l.category,
      bodySystem: l.bodySystem,
      lessonType: l.type,
      versionKey: l.versionKey,
      status: l.status,
      updatedAt: l.updatedAt.toISOString(),
      publishedAt: l.publishedAt?.toISOString() ?? null,
      gapWeakSummary: summaryLen > 0 && summaryLen < 40,
      gapNoSummary: summaryLen === 0,
      progressUsersOpened: openedMap.get(l.id) ?? 0,
      progressUsersCompleted: completedMap.get(l.id) ?? 0,
    };
  });

  return NextResponse.json({
    page: q.page,
    pageSize: q.pageSize,
    total,
    lessons: rows,
    filters: {
      tierOptions: [
        { value: "rn", label: "RN" },
        { value: "rpn", label: "RPN" },
        { value: "lvn", label: "LPN/LVN" },
        { value: "np", label: "NP" },
        { value: "allied", label: "Allied" },
      ],
      statusOptions: ["DRAFT", "PUBLISHED", "IN_REVIEW", "ARCHIVED"] as const,
      countryOptions: [
        { value: "ca", label: "Canada (CA_ONLY)" },
        { value: "us", label: "United States (US_ONLY)" },
        { value: "both", label: "Both regions" },
      ],
    },
  });
}

export async function POST(req: Request) {
  const gate = await requireAdmin();
  if (!gate.ok) return gate.response;

  const parsed = createSchema.safeParse(await req.json());
  if (!parsed.success) return NextResponse.json({ error: "Invalid payload" }, { status: 400 });

  const data = parsed.data;
  if (data.status === ContentStatus.PUBLISHED) {
    const v = validateLessonForPublish({ title: data.title, summary: data.summary, body: data.body });
    if (!v.ok) return NextResponse.json({ error: "Publish validation failed", reasons: v.reasons }, { status: 400 });
  }

  const clash = await prisma.contentItem.findUnique({ where: { slug: data.slug }, select: { id: true } });
  if (clash) {
    return NextResponse.json({ error: "Slug already in use", slug: data.slug }, { status: 409 });
  }

  const cat = await prisma.category.findUnique({ where: { id: data.categoryId } });
  const lesson = await prisma.contentItem.create({
    data: {
      title: data.title,
      slug: data.slug,
      summary: data.summary,
      type: "lesson",
      content: bodyStringToContentJson(data.body),
      tier: tierCodeToContentItemTier(data.tier),
      status: contentStatusToDb(data.status),
      regionScope: data.country === "CA" ? "CA_ONLY" : "US_ONLY",
      tags: data.tags ?? [],
      category: cat?.name ?? cat?.slug,
      bodySystem: data.systemTag ?? data.topicTag,
      versionKey: data.versionKey ?? undefined,
    },
  });

  return NextResponse.json({ lesson }, { status: 201 });
}
