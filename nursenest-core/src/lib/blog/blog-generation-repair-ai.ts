import type { BlogFunnelStage, BlogPostIntent, BlogPostTemplate } from "@prisma/client";
import { openAiChatCompletion } from "@/lib/ai/openai-chat-completions";
import type { BlogControlPanelPlan } from "@/lib/blog/blog-control-panel-schema";
import {
  buildArticleBodySystemPrompt,
  buildArticleBodyUserPrompt,
} from "@/lib/blog/blog-article-pipeline-prompts";
import {
  regenerateControlPanelSection,
  sanitizeControlPanelGeneratedSlugInput,
} from "@/lib/blog/blog-control-panel-generation";
import { prisma } from "@/lib/db";
import { ensureUniqueBlogPostSlug } from "@/lib/blog/blog-optional-slug.server";
import { assertSeoSafeToCreateBlog, SeoDuplicateBlockedError } from "@/lib/seo/seo-duplicate-guard";
import { countWordsFromHtml } from "@/lib/blog/blog-word-count";
import { BLOG_BODY_REPAIR_WORD_BUFFER } from "@/lib/blog/blog-generation-repair-classifier";

function sleepMs(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export type RepairBodyParams = {
  plan: BlogControlPanelPlan;
  topic: string;
  exam: string;
  country: "US" | "CA" | "unspecified";
  template: BlogPostTemplate;
  intent: BlogPostIntent;
  funnelStage: BlogFunnelStage;
  tone: "professional" | "supportive" | "direct";
  keywords?: string;
  selectedTitle?: string;
  currentHtml: string;
  validationMessages: string[];
  targetWordMin: number;
  openAiUser?: string;
};

/**
 * Expands or fixes HTML using the stored outline; adds nursing depth (assessment, pathophysiology,
 * NCLEX traps, safety) — not filler.
 */
export async function repairControlPanelArticleBodyHtml(params: RepairBodyParams): Promise<string> {
  const pageH1 = params.selectedTitle?.trim() || params.plan.h1;
  const system = buildArticleBodySystemPrompt({ template: params.template, intent: params.intent });
  const baseUser = buildArticleBodyUserPrompt({
    plan: params.plan,
    topic: params.topic,
    exam: params.exam,
    country: params.country,
    template: params.template,
    intent: params.intent,
    funnelStage: params.funnelStage,
    tone: params.tone,
    keywords: params.keywords,
    pageH1,
  });
  const repairUser = `REVISION PASS (keep topic and exam scope identical; do not change the clinical subject).

Validation issues to fix:
${params.validationMessages.map((m) => `- ${m}`).join("\n")}

Current article HTML (revise in place — return **full** replacement HTML only, same allowed tags as before):
${params.currentHtml.slice(0, 120_000)}

Requirements:
- Minimum **${params.targetWordMin}** words of substantive teaching after stripping HTML (aim clearly above this).
- Expand with: nursing assessment cues; concise pathophysiology where relevant; clinical significance; NCLEX-style exam traps; patient safety; key takeaways woven into sections (not generic filler).
- Preserve FAQ items from the plan; keep internal link intent from the outline.
- Do not add fabricated statistics or treatment orders for real patients.`;

  const res = await openAiChatCompletion({
    messages: [
      { role: "system", content: system },
      { role: "user", content: `${baseUser}\n\n${repairUser}` },
    ],
    temperature: 0.35,
    maxTokens: 8192,
    user: params.openAiUser,
  });
  return res.content.trim();
}

export type DistinctHeadlineParams = {
  plan: BlogControlPanelPlan;
  topic: string;
  exam: string;
  country: "US" | "CA" | "unspecified";
  template: BlogPostTemplate;
  intent: BlogPostIntent;
  funnelStage: BlogFunnelStage;
  tone: "professional" | "supportive" | "direct";
  keywords?: string;
  /** Prior failure text from assertSeoSafe / persist. */
  blockedReason: string;
  openAiUser?: string;
};

/**
 * Regenerates H1 + meta so titles pass {@link assertSeoSafeToCreateBlog} while staying on the same topic.
 */
export async function repairBlogPlanHeadlinesForSeoDistinctness(
  params: DistinctHeadlineParams,
): Promise<BlogControlPanelPlan | null> {
  let plan = params.plan;
  const baseH1 = (plan.h1 || plan.titleOptions[0] || params.topic).trim();

  for (let round = 0; round < 2; round++) {
    const titleOptsRaw = await regenerateControlPanelSection({
      section: "title_options",
      topic: params.topic,
      exam: params.exam,
      country: params.country,
      template: params.template,
      intent: params.intent,
      funnelStage: params.funnelStage,
      tone: params.tone,
      keywords: params.keywords,
      currentPlan: plan,
    });
    if (titleOptsRaw.section !== "title_options") {
      throw new Error(`Expected title_options from regenerateControlPanelSection, got ${titleOptsRaw.section}`);
    }
    const titleOpts = titleOptsRaw;
    const candidates = titleOpts.titleOptions
      .map((t) => t.trim())
      .filter((t) => t.length >= 8 && t.toLowerCase() !== baseH1.toLowerCase());

    for (const h1Try of candidates) {
      const metaBlockRaw = await regenerateControlPanelSection({
        section: "meta",
        topic: params.topic,
        exam: params.exam,
        country: params.country,
        template: params.template,
        intent: params.intent,
        funnelStage: params.funnelStage,
        tone: params.tone,
        keywords: params.keywords,
        currentPlan: { ...plan, h1: h1Try },
      });
      if (metaBlockRaw.section !== "meta") {
        throw new Error(`Expected meta from regenerateControlPanelSection, got ${metaBlockRaw.section}`);
      }
      const metaBlock = metaBlockRaw;
      const slugBase = sanitizeControlPanelGeneratedSlugInput(metaBlock.recommendedSlug, params.exam, params.topic);
      const slug = await ensureUniqueBlogPostSlug(slugBase);
      try {
        await assertSeoSafeToCreateBlog(prisma, {
          slug,
          metaTitle: metaBlock.metaTitle,
          h1: h1Try,
        });
        plan = {
          ...plan,
          h1: h1Try,
          metaTitle: metaBlock.metaTitle,
          metaDescription: metaBlock.metaDescription,
          recommendedSlug: metaBlock.recommendedSlug,
          titleOptions: titleOpts.titleOptions,
          ...(metaBlock.suggestedExcerpt ? { suggestedExcerpt: metaBlock.suggestedExcerpt } : {}),
        };
        return plan;
      } catch (e) {
        if (!(e instanceof SeoDuplicateBlockedError)) throw e;
        await sleepMs(400);
      }
    }

    const anglePrompt = await openAiChatCompletion({
      messages: [
        {
          role: "system",
          content:
            "You write distinct nursing-exam H1 headlines. Return JSON only: {\"h1\": string, \"metaTitle\": string, \"metaDescription\": string, \"recommendedSlug\": string}. H1 must stay on the same clinical topic; use a more specific angle (assessment, prioritization, complications, pharmacology nuance, or exam trap focus). No clickbait; max 110 chars for h1.",
        },
        {
          role: "user",
          content: `Topic: ${params.topic}\nExam: ${params.exam}\nPrior H1: ${baseH1}\nSEO block reason: ${params.blockedReason}\nProduce a clearly different H1 + matching meta (metaTitle <=60 chars, metaDescription 120-155 chars), kebab-case slug.`,
        },
      ],
      temperature: 0.45,
      maxTokens: 800,
      user: params.openAiUser,
    });
    try {
      const raw = anglePrompt.content.trim();
      const start = raw.indexOf("{");
      const end = raw.lastIndexOf("}");
      const parsed = JSON.parse(raw.slice(start, end + 1)) as {
        h1?: string;
        metaTitle?: string;
        metaDescription?: string;
        recommendedSlug?: string;
      };
      const h1Try = (parsed.h1 ?? "").trim().slice(0, 220);
      const metaTitle = (parsed.metaTitle ?? "").trim().slice(0, 70);
      const metaDescription = (parsed.metaDescription ?? "").trim().slice(0, 500);
      const recommendedSlug = (parsed.recommendedSlug ?? "").trim();
      if (h1Try.length >= 8 && metaTitle.length >= 10 && metaDescription.length >= 50 && recommendedSlug.length >= 3) {
        const slugBase = sanitizeControlPanelGeneratedSlugInput(recommendedSlug, params.exam, params.topic);
        const slug = await ensureUniqueBlogPostSlug(slugBase);
        await assertSeoSafeToCreateBlog(prisma, { slug, metaTitle, h1: h1Try });
        return {
          ...plan,
          h1: h1Try,
          metaTitle,
          metaDescription,
          recommendedSlug,
          titleOptions: [...new Set([h1Try, ...(plan.titleOptions ?? [])])].slice(0, 8),
        };
      }
    } catch {
      /* try next round */
    }
  }

  return null;
}

export type SimpleDraftTitleRepairParams = {
  topic: string;
  exam: string;
  template: BlogPostTemplate;
  country?: "US" | "CA" | "unspecified";
  blockedReason: string;
  priorH1: string;
  priorMetaTitle: string;
  openAiUser?: string;
};

/** Returns new h1 + metaTitle strings that should be re-checked with assertSeoSafe + slug derivation. */
export async function repairSimpleAiDraftHeadlines(params: SimpleDraftTitleRepairParams): Promise<{
  h1: string;
  metaTitle: string;
} | null> {
  const res = await openAiChatCompletion({
    messages: [
      {
        role: "system",
        content:
          'Return JSON only: {"h1": string, "metaTitle": string}. Nursing NCLEX prep blog; same topic as input but clearly different wording from the rejected titles. H1 <= 110 chars; metaTitle <= 60 chars, adds search-specific angle.',
      },
      {
        role: "user",
        content: `Topic: ${params.topic}\nExam: ${params.exam}\nTemplate: ${params.template}\nRejected H1: ${params.priorH1}\nRejected metaTitle: ${params.priorMetaTitle}\nReason: ${params.blockedReason}`,
      },
    ],
    temperature: 0.42,
    maxTokens: 500,
    user: params.openAiUser,
  });
  const raw = res.content.trim();
  const start = raw.indexOf("{");
  const end = raw.lastIndexOf("}");
  const parsed = JSON.parse(raw.slice(start, end + 1)) as { h1?: string; metaTitle?: string };
  const h1 = (parsed.h1 ?? "").trim().slice(0, 220);
  const metaTitle = (parsed.metaTitle ?? "").trim().slice(0, 70);
  if (h1.length < 10 || metaTitle.length < 10) return null;
  return { h1, metaTitle };
}

export type SimpleDraftBodyExpandParams = {
  topic: string;
  exam: string;
  template: BlogPostTemplate;
  intent?: BlogPostIntent;
  funnelStage?: BlogFunnelStage;
  country?: "US" | "CA" | "unspecified";
  keywords?: string;
  targetKeyword?: string;
  keywordCluster?: string;
  tone?: "professional" | "supportive" | "direct";
  currentHtml: string;
  currentWordCount: number;
  targetWordMin: number;
  openAiUser?: string;
};

export async function repairSimpleAiDraftBodyHtml(params: SimpleDraftBodyExpandParams): Promise<string> {
  const system = `You write SEO-aware HTML for NurseNest nursing education blog posts. Output valid HTML only: <h2>, <h3>, <p>, <ul>, <li>, <strong>. No markdown. No fabricated statistics.`;
  const user = `Expand this draft to at least ${params.targetWordMin} substantive words (current ~${params.currentWordCount}). Topic: ${params.topic}. Exam: ${params.exam}. Template: ${params.template}.

Add nursing assessment cues, pathophysiology where appropriate, clinical significance, NCLEX-style traps, and patient safety — no filler paragraphs.

Current HTML:
${params.currentHtml.slice(0, 100_000)}

Return full revised HTML only. Preserve any trailing "Study next in NurseNest" block verbatim if present.`;
  const res = await openAiChatCompletion({
    messages: [
      { role: "system", content: system },
      { role: "user", content: user },
    ],
    temperature: 0.35,
    maxTokens: 8192,
    user: params.openAiUser,
  });
  return res.content.trim();
}

export async function repairPlanForLongformContractIssues(params: {
  plan: BlogControlPanelPlan;
  topic: string;
  exam: string;
  country: "US" | "CA" | "unspecified";
  template: BlogPostTemplate;
  intent: BlogPostIntent;
  funnelStage: BlogFunnelStage;
  tone: "professional" | "supportive" | "direct";
  keywords?: string;
  issuesJoined: string;
}): Promise<BlogControlPanelPlan> {
  const t = params.issuesJoined.toLowerCase();
  const base = {
    topic: params.topic,
    exam: params.exam,
    country: params.country,
    template: params.template,
    intent: params.intent,
    funnelStage: params.funnelStage,
    tone: params.tone,
    keywords: params.keywords,
    currentPlan: params.plan,
  };
  if (t.includes("faq")) {
    const faqsRaw = await regenerateControlPanelSection({ ...base, section: "faqs" });
    if (faqsRaw.section !== "faqs") {
      throw new Error(`Expected faqs from regenerateControlPanelSection, got ${faqsRaw.section}`);
    }
    return { ...params.plan, faqs: faqsRaw.faqs };
  }
  const outlineRaw = await regenerateControlPanelSection({ ...base, section: "outline" });
  if (outlineRaw.section !== "outline") {
    throw new Error(`Expected outline from regenerateControlPanelSection, got ${outlineRaw.section}`);
  }
  return { ...params.plan, outline: outlineRaw.outline };
}
