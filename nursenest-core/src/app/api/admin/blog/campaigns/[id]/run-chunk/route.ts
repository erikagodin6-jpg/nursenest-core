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
  Prisma,
} from "@prisma/client";
import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAdmin } from "@/lib/admin/ensure-admin";
import { adminAiGenerationHttpBlock } from "@/lib/ai/admin-ai-policy";
import { getBlogOpenAiChatModel } from "@/lib/ai/openai-env";
import { openAiChatCompletion } from "@/lib/ai/openai-chat-completions";
import { buildSchemaSummaryPayload } from "@/lib/blog/blog-seo-automation";
import {
  buildSeoBundleForSimpleAiDraft,
  clampSerpDescription,
  clampSerpTitle,
  mergeOpenGraphImageIntoSeoBundle,
  normalizeBlogTagsForStorage,
} from "@/lib/blog/blog-seo-package";
import { generateBlogSEOFromPostRow } from "@/lib/blog/blog-generate-seo";
import { findExistingBlogByCanonicalIntent, normalizeBlogTopicKey } from "@/lib/blog/blog-intent-dedupe";
import { blogPrimaryStudyCta } from "@/lib/blog/blog-study-cta";
import { buildOutline, detectRiskFlags, slugify, thinDraftWarning } from "@/lib/blog/seo-campaign-engine";
import { prisma } from "@/lib/db";
import { evaluateBlogGenerationOutputGate } from "@/lib/blog/blog-generation-output-gate";
import { logBlogGenerationRejected } from "@/lib/blog/blog-generation-log";
import { revalidateBlogPublishingSurfaces } from "@/lib/blog/blog-revalidate-publishing";

const schema = z.object({
  limit: z.number().int().min(1).max(10).default(3),
  mode: z.enum(["generate", "schedule_only"]).default("generate"),
  exactPublishAt: z.string().datetime().optional(),
  /** When true, creates a live `PUBLISHED` row (same visibility contract as automation immediate publish). */
  publishNow: z.boolean().optional(),
});

type Props = { params: Promise<{ id: string }> };

export async function POST(req: Request, { params }: Props) {
  const gate = await requireAdmin(req);
  if (!gate.ok) return gate.response;
  const { id } = await params;
  const parsed = schema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid payload", details: parsed.error.flatten() }, { status: 400 });
  }
  const d = parsed.data;
  if (d.mode === "generate") {
    const aiBlock = adminAiGenerationHttpBlock({ pipeline: "blog" });
    if (aiBlock) return aiBlock;
  }
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

  const out: Array<{
    itemId: string;
    status: string;
    postId?: string;
    slug?: string;
    publicUrl?: string;
    scheduledFor?: string;
    error?: string;
  }> = [];
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
          out.push({
            itemId: item.id,
            status: "failed",
            error: `duplicate_topic_intent (existing /blog/${dupIntent.slug})`,
          });
          continue;
        }
      }

      let body = `<p>${title}</p><p>Draft generated from campaign queue item ${item.ordinal}.</p>`;
      if (d.mode === "generate") {
        const prompt = `Write SEO-ready HTML for nursing exam prep. Topic: ${item.plannedKeyword ?? campaign.keywordCluster}. Template: ${template}. Intent: ${intent}. Include practical advice, FAQs, and key takeaways.`;
        const ai = await openAiChatCompletion({
          useBlogOpenAiApiKey: true,
          model: getBlogOpenAiChatModel(),
          messages: [{ role: "system", content: "Return HTML only with h2/h3/p/ul/li tags." }, { role: "user", content: prompt }],
          maxTokens: 2800,
          temperature: 0.45,
        });
        body = ai.content.trim();
      }
      const excerpt = body.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim().slice(0, 420);
      const pk = (item.plannedKeyword ?? campaign.keywordCluster ?? "").trim();
      const tags = normalizeBlogTagsForStorage(pk ? [pk] : [], [campaign.keywordCluster].filter(Boolean) as string[]);
      const excerptFinal = (excerpt || title).trim().slice(0, 500);
      const auto = generateBlogSEOFromPostRow({
        title,
        slug,
        category: campaign.keywordCluster ?? null,
        tags,
        exam: campaign.targetExam ?? null,
        countryTarget: campaign.countryTarget ?? null,
      });
      const seoTitleDb = clampSerpTitle(auto.seoTitle, 70);
      const seoDescDb = clampSerpDescription(auto.metaDescription, 120, 155);
      if (d.mode === "generate") {
        const gate = evaluateBlogGenerationOutputGate({
          title,
          slug,
          seoTitle: seoTitleDb,
          seoDescription: seoDescDb,
          bodyHtml: body,
          template,
          intent,
          mode: "publish_or_schedule",
        });
        if (!gate.ok) {
          const reason = gate.reasons.join("; ");
          logBlogGenerationRejected(slug, `campaign_chunk:${reason}`);
          await prisma.blogCampaignItem.update({
            where: { id: item.id },
            data: {
              status: BlogCampaignItemStatus.FAILED,
              error: `generation_output_gate:${reason}`.slice(0, 1200),
            },
          });
          out.push({
            itemId: item.id,
            status: "failed",
            error: `generation_output_gate: ${reason}`.slice(0, 800),
          });
          continue;
        }
      }
      const primaryKw = (pk || title).trim().slice(0, 160);
      const seoBundle = mergeOpenGraphImageIntoSeoBundle(
        buildSeoBundleForSimpleAiDraft({
          slug,
          h1: title.slice(0, 220),
          seoTitle: seoTitleDb,
          seoDescription: seoDescDb,
          excerpt: excerptFinal,
          tags,
          primaryKeyword: primaryKw,
          emitFaqSchema: false,
        }),
        null,
      );
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
      const publishNow = d.publishNow === true;
      let publishAt: Date | null = d.exactPublishAt != null && d.exactPublishAt !== "" ? new Date(d.exactPublishAt) : item.plannedPublishAt ?? null;
      if (publishNow) {
        publishAt = new Date();
      }
      /**
       * Public `/blog/[slug]` visibility ({@link blogLiveWhere} / {@link blogPostIsLive}): scheduled rows must
       * not stay in `BLOG_WORKFLOW_PIPELINE_IN_PROGRESS` (e.g. GENERATED) or they never unlock at `publishAt`.
       * Aligns with {@link resolvePublishState} in `blog-automation-engine.ts`.
       */
      const postStatus = publishNow
        ? BlogPostStatus.PUBLISHED
        : publishAt
          ? BlogPostStatus.SCHEDULED
          : BlogPostStatus.DRAFT;
      const workflowStatus = publishNow
        ? BlogWorkflowStatus.PUBLISHED
        : publishAt
          ? BlogWorkflowStatus.SCHEDULED
          : risks.length > 0
            ? BlogWorkflowStatus.NEEDS_MEDICAL_REVIEW
            : BlogWorkflowStatus.GENERATED;
      const post = await prisma.blogPost.create({
        data: {
          campaignId: campaign.id,
          slug,
          title,
          excerpt: excerpt || title,
          body,
          exam: campaign.targetExam ?? null,
          category: campaign.keywordCluster,
          tags,
          postTemplate: template,
          intent,
          funnelStage: funnel,
          targetKeyword: item.plannedKeyword ?? campaign.keywordCluster,
          keywordCluster: campaign.keywordCluster,
          countryTarget: campaign.countryTarget ?? null,
          postStatus,
          publishAt,
          seoTitle: seoTitleDb,
          seoDescription: seoDescDb,
          metaTitleVariant: seoTitleDb,
          metaDescriptionVariant: seoDescDb,
          internalLinkPlan: {
            lessons: [],
            imagePlacements: [],
            imageAttachments: [],
            seo: seoBundle,
          } as Prisma.InputJsonValue,
          schemaSummary: buildSchemaSummaryPayload(seoBundle),
          workflowStatus,
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
          status: publishNow
            ? BlogCampaignItemStatus.PUBLISHED
            : publishAt
              ? BlogCampaignItemStatus.SCHEDULED
              : BlogCampaignItemStatus.GENERATED,
          postId: post.id,
          error: null,
        },
      });
      const liveNow =
        publishNow ||
        (postStatus === BlogPostStatus.SCHEDULED && publishAt != null && publishAt.getTime() <= Date.now());
      if (liveNow) {
        revalidateBlogPublishingSurfaces({ slug: post.slug });
      }
      out.push({
        itemId: item.id,
        status: "ok",
        postId: post.id,
        slug: post.slug,
        publicUrl: liveNow ? `/blog/${post.slug}` : undefined,
        scheduledFor: !liveNow && publishAt ? publishAt.toISOString() : undefined,
      });
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
