import { NextRequest, NextResponse } from "next/server";
import { ContentStatus } from "@prisma/client";
import { z } from "zod";
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
});

export async function GET(req: NextRequest) {
  const gate = await requireAdmin();
  if (!gate.ok) return gate.response;

  const sp = req.nextUrl.searchParams;
  const page = Math.max(1, Number(sp.get("page") ?? "1"));
  const pageSize = Math.min(100, Math.max(10, Number(sp.get("pageSize") ?? "50")));
  const statusParam = sp.get("status") as ContentStatus | null;

  const where: { type: string; status?: string } = { type: "lesson" };
  if (statusParam) where.status = contentStatusToDb(statusParam);

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
        updatedAt: true,
      },
      orderBy: { updatedAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
  ]);

  return NextResponse.json({ page, pageSize, total, lessons });
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
    },
  });

  return NextResponse.json({ lesson }, { status: 201 });
}
