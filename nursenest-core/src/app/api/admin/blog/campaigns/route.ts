import { BlogCampaignStatus, BlogFunnelStage, BlogPostIntent, BlogPostTemplate } from "@prisma/client";
import { type NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireAdmin } from "@/lib/admin/ensure-admin";
import { prisma } from "@/lib/db";
import { computeCadenceDates, slugify } from "@/lib/blog/seo-campaign-engine";

const createCampaignSchema = z.object({
  name: z.string().min(3).max(160),
  keywordCluster: z.string().min(2).max(200),
  targetExam: z.string().max(100).optional(),
  targetProfession: z.string().max(100).optional(),
  targetPathway: z.string().max(100).optional(),
  countryTarget: z.enum(["US", "CA"]).optional(),
  desiredPostCount: z.number().int().min(1).max(200),
  postsPerWeek: z.number().int().min(1).max(14).optional(),
  preferredWeekdays: z.array(z.number().int().min(0).max(6)).max(7).optional(),
  startDate: z.string().datetime().optional(),
  templateMix: z.array(z.nativeEnum(BlogPostTemplate)).max(20).optional(),
  intentMix: z.array(z.nativeEnum(BlogPostIntent)).max(20).optional(),
  funnelStage: z.nativeEnum(BlogFunnelStage).optional(),
  includeImages: z.boolean().optional(),
  includeAiImages: z.boolean().optional(),
  requireReferences: z.boolean().optional(),
});

export async function GET(req: NextRequest) {
  const gate = await requireAdmin(req);
  if (!gate.ok) return gate.response;

  const campaigns = await prisma.blogCampaign.findMany({
    orderBy: { updatedAt: "desc" },
    take: 100,
    include: {
      _count: { select: { items: true, posts: true } },
      items: {
        select: { status: true },
        take: 400,
      },
    },
  });

  const summaries = campaigns.map((c) => {
    const byStatus = c.items.reduce<Record<string, number>>((acc, item) => {
      acc[item.status] = (acc[item.status] ?? 0) + 1;
      return acc;
    }, {});
    return {
      id: c.id,
      name: c.name,
      keywordCluster: c.keywordCluster,
      desiredPostCount: c.desiredPostCount,
      status: c.status,
      postsPerWeek: c.postsPerWeek,
      startDate: c.startDate,
      counts: byStatus,
      postsLinked: c._count.posts,
      queueItems: c._count.items,
      updatedAt: c.updatedAt,
    };
  });
  return NextResponse.json({ campaigns: summaries });
}

export async function POST(req: Request) {
  const gate = await requireAdmin(req);
  if (!gate.ok) return gate.response;

  const parsed = createCampaignSchema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid campaign payload", details: parsed.error.flatten() }, { status: 400 });
  }
  const d = parsed.data;
  const start = d.startDate ? new Date(d.startDate) : null;
  const cadenceDates = start && d.postsPerWeek
    ? computeCadenceDates({
        startDate: start,
        count: d.desiredPostCount,
        postsPerWeek: d.postsPerWeek,
        preferredWeekdays: d.preferredWeekdays,
      })
    : [];

  const campaign = await prisma.blogCampaign.create({
    data: {
      name: d.name,
      keywordCluster: d.keywordCluster,
      targetExam: d.targetExam ?? null,
      targetProfession: d.targetProfession ?? null,
      targetPathway: d.targetPathway ?? null,
      countryTarget: d.countryTarget ?? null,
      desiredPostCount: d.desiredPostCount,
      postsPerWeek: d.postsPerWeek ?? null,
      preferredWeekdays: d.preferredWeekdays ?? [],
      startDate: start,
      templateMix: d.templateMix ?? [],
      intentMix: d.intentMix ?? [],
      funnelStage: d.funnelStage ?? null,
      includeImages: d.includeImages ?? false,
      includeAiImages: d.includeAiImages ?? false,
      requireReferences: d.requireReferences ?? false,
      status: BlogCampaignStatus.QUEUED,
      progressJson: { planned: d.desiredPostCount, generated: 0, scheduled: 0, published: 0, failed: 0 },
      items: {
        create: Array.from({ length: d.desiredPostCount }).map((_, i) => {
          const keyword = `${d.keywordCluster} ${i + 1}`;
          const title = `${d.targetExam ?? "Exam"} ${d.keywordCluster}: ${i + 1}`;
          return {
            ordinal: i + 1,
            plannedKeyword: keyword,
            plannedTitle: title,
            plannedSlug: slugify(title),
            plannedPublishAt: cadenceDates[i] ?? null,
            preferredTemplate: (d.templateMix?.length ? d.templateMix[i % d.templateMix.length] : null) ?? undefined,
            preferredIntent: (d.intentMix?.length ? d.intentMix[i % d.intentMix.length] : null) ?? undefined,
            preferredFunnel: d.funnelStage ?? null,
            includeImage: d.includeImages ?? false,
            includeAiImage: d.includeAiImages ?? false,
          };
        }),
      },
    },
    select: { id: true, name: true, status: true, desiredPostCount: true },
  });

  return NextResponse.json({ campaign }, { status: 201 });
}
