import {
  BlogCampaignItemStatus,
  BlogCampaignStatus,
  BlogFunnelStage,
  BlogImageStatus,
  BlogPostIntent,
  BlogPostStatus,
  BlogPostTemplate,
  BlogWorkflowStatus,
  CountryCode,
} from "@prisma/client";
import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAdmin } from "@/lib/admin/ensure-admin";
import { isAdminAiGenerationEnabled } from "@/lib/ai/admin-ai-policy";
import { openAiChatCompletion } from "@/lib/ai/openai-chat-completions";
import { findExistingBlogByCanonicalIntent, normalizeBlogTopicKey } from "@/lib/blog/blog-intent-dedupe";
import { blogPrimaryStudyCta } from "@/lib/blog/blog-study-cta";
import { buildOutline, detectRiskFlags, slugify, thinDraftWarning } from "@/lib/blog/seo-campaign-engine";
import { prisma } from "@/lib/db";

const schema = z.object({
  limit: z.number().int().min(1).max(10).default(3),
  mode: z.enum(["generate", "schedule_only"]).default("generate"),
  exactPublishAt: z.string().datetime().optional(),
});

type Props = { params: Promise<{ id: string }> };

export async function POST(req: Request, { params }: Props) {
  const gate = await requireAdmin();
  if (!gate.ok) return gate.response;
  const { id } = await params;
  const parsed = schema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid payload", details: parsed.error.flatten() }, { status: 400 });
  }
  const d = parsed.data;
  const campaign = await prisma.blogCampaign.findUnique({ where: { id } });
  if (!campaign) return NextResponse.json({ error: "Campaign not found" }, { status: 404 });

  const items = await prisma.blogCampaignItem.findMany({
    where: { campaignId: id, status: BlogCampaignItemStatus.QUEUED },
    orderBy: { ordinal: "asc" },
    take: d.limit,
  });
  if (items.length === 0) {
    return NextResponse.json({ ok: true, processed: 0, message: "No queued items remaining." });
  }

  const aiEnabled = isAdminAiGenerationEnabled();
  const out: Array<{ itemId: string; status: string; slug?: string; error?: string }> = [];
  for (const item of items) {
    try {
      await prisma.blogCampaignItem.update({
        where: { id: item.id },
        data: { status: d.mode === "generate" ? BlogCampaignItemStatus.GENERATING : BlogCampaignItemStatus.SCHEDULED },
      });

      const template = item.preferredTemplate ?? campaign.templateMix[0] ?? BlogPostTemplate.TOPIC_EXPLAINED;
      const intent = item.preferredIntent ?? campaign.intentMix[0] ?? BlogPostIntent.EXAM_PREP;
      const funnel = item.preferredFunnel ?? campaign.funnelStage ?? BlogFunnelStage.CONSIDERATION;
      const title = item.plannedTitle ?? `${campaign.targetExam ?? "Exam"} ${campaign.keywordCluster} ${item.ordinal}`;
      const slugBase = item.plannedSlug ?? slugify(title);
      let slug = slugBase;
      let suffix = 1;
      while (await prisma.blogPost.findUnique({ where: { slug }, select: { id: true } })) {
        suffix += 1;
        slug = `${slugBase}-${suffix}`.slice(0, 170);
      }

      /** Per-item intent (not the whole campaign cluster) so a queue can emit multiple distinct posts. */
      const normIntent = normalizeBlogTopicKey(item.plannedKeyword ?? item.plannedTitle ?? title);
      if (normIntent.length >= 3) {
        const dupIntent = await findExistingBlogByCanonicalIntent({
          exam: campaign.targetExam ?? null,
          normalizedTopic: normIntent,
        });
        if (dupIntent) {
          await prisma.blogCampaignItem.update({
            where: { id: item.id },
            data: {
              status: BlogCampaignItemStatus.FAILED,
              error: `duplicate_topic_intent:existing_slug=${dupIntent.slug}`,
            },
          });
          out.push({ itemId: item.id, status: "failed", error: "duplicate_topic_intent" });
          continue;
        }
      }

      let body = `<p>${title}</p><p>Draft generated from campaign queue item ${item.ordinal}.</p>`;
      if (d.mode === "generate" && aiEnabled) {
        const prompt = `Write SEO-ready HTML for nursing exam prep. Topic: ${item.plannedKeyword ?? campaign.keywordCluster}. Template: ${template}. Intent: ${intent}. Include practical advice, FAQs, and key takeaways.`;
        const ai = await openAiChatCompletion({
          messages: [{ role: "system", content: "Return HTML only with h2/h3/p/ul/li tags." }, { role: "user", content: prompt }],
          maxTokens: 2800,
          temperature: 0.45,
        });
        body = ai.content.trim();
      }
      const excerpt = body.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim().slice(0, 420);
      const countryCtx =
        campaign.countryTarget === CountryCode.CA ? "CA" : campaign.countryTarget === CountryCode.US ? "US" : "unspecified";
      const cta = blogPrimaryStudyCta({
        exam: campaign.targetExam ?? "NCLEX-RN",
        country: countryCtx,
        intent,
        funnel,
        template,
      });
      const risks = detectRiskFlags({ template, keyword: item.plannedKeyword });
      const thin = thinDraftWarning(body);
      const publishAt = d.exactPublishAt ? new Date(d.exactPublishAt) : item.plannedPublishAt;
      const post = await prisma.blogPost.create({
        data: {
          campaignId: campaign.id,
          slug,
          title,
          excerpt: excerpt || title,
          body,
          exam: campaign.targetExam ?? null,
          category: campaign.keywordCluster,
          postTemplate: template,
          intent,
          funnelStage: funnel,
          targetKeyword: item.plannedKeyword ?? campaign.keywordCluster,
          keywordCluster: campaign.keywordCluster,
          countryTarget: campaign.countryTarget ?? null,
          postStatus: publishAt ? BlogPostStatus.SCHEDULED : BlogPostStatus.DRAFT,
          publishAt,
          seoTitle: title.slice(0, 200),
          seoDescription: excerpt.slice(0, 280),
          workflowStatus: risks.length > 0 ? BlogWorkflowStatus.NEEDS_MEDICAL_REVIEW : BlogWorkflowStatus.GENERATED,
          outlineJson: buildOutline({ title, targetKeyword: item.plannedKeyword ?? campaign.keywordCluster, intent, template }),
          ctaType: cta.type,
          ctaText: cta.text,
          ctaHref: cta.href,
          medicalRiskFlags: risks,
          requiresReferences: campaign.requireReferences || risks.length > 0,
          imageStatus: item.includeImage ? (item.includeAiImage ? BlogImageStatus.REQUESTED : BlogImageStatus.NONE) : BlogImageStatus.NONE,
          coverImagePrompt: item.includeAiImage ? `Create a nursing education hero image for "${title}".` : null,
          updateNeeded: Boolean(thin),
          rankingNote: thin ?? null,
        },
        select: { id: true, slug: true },
      });

      await prisma.blogCampaignItem.update({
        where: { id: item.id },
        data: {
          status: publishAt ? BlogCampaignItemStatus.SCHEDULED : BlogCampaignItemStatus.GENERATED,
          postId: post.id,
          error: null,
        },
      });
      out.push({ itemId: item.id, status: "ok", slug: post.slug });
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      await prisma.blogCampaignItem.update({
        where: { id: item.id },
        data: { status: BlogCampaignItemStatus.FAILED, error: msg.slice(0, 1200) },
      });
      out.push({ itemId: item.id, status: "failed", error: msg });
    }
  }

  const counts = await prisma.blogCampaignItem.groupBy({
    by: ["status"],
    where: { campaignId: id },
    _count: { _all: true },
  });
  const done = counts.every((c) => c.status !== BlogCampaignItemStatus.QUEUED && c.status !== BlogCampaignItemStatus.GENERATING);
  await prisma.blogCampaign.update({
    where: { id },
    data: {
      status: done ? BlogCampaignStatus.COMPLETED : BlogCampaignStatus.RUNNING,
      progressJson: counts.reduce<Record<string, number>>((acc, c) => {
        acc[c.status] = c._count._all;
        return acc;
      }, {}),
    },
  });
  return NextResponse.json({ ok: true, processed: out.length, items: out });
}
