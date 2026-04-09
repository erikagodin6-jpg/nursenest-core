import {
  BlogFunnelStage,
  BlogImageStatus,
  BlogPostIntent,
  BlogPostStatus,
  BlogPostTemplate,
  BlogWorkflowStatus,
  CountryCode,
  Prisma,
} from "@prisma/client";
import { z } from "zod";
import { openAiChatCompletion } from "@/lib/ai/openai-chat-completions";
import type { BlogSourceRecord } from "@/lib/blog/apa7";
import { coerceBlogSourceRows, validateSources } from "@/lib/blog/apa7";
import {
  buildCitationEnvelope,
  evaluateCitationGate,
  partitionCitationsForBlog,
} from "@/lib/blog/blog-citation-safety";
import { findExistingBlogByCanonicalIntent, normalizeBlogTopicKey } from "@/lib/blog/blog-intent-dedupe";
import {
  blogControlPanelPlanSchema,
  blogLessonLinkRowSchema,
  type BlogControlPanelPlan,
} from "@/lib/blog/blog-control-panel-schema";
import {
  getBlogInternalLinkPathHintsForPrompt,
  lessonRowsToRelatedPaths,
  normalizePlanSuggestedLessonRows,
} from "@/lib/blog/blog-internal-lesson-links";
import { buildPersistedSeoBundle, buildSchemaSummaryPayload } from "@/lib/blog/blog-seo-automation";
import {
  buildArticleBodySystemPrompt,
  buildArticleBodyUserPrompt,
  buildStructuredPlanSystemPrompt,
  buildStructuredPlanUserPrompt,
} from "@/lib/blog/blog-article-pipeline-prompts";
import type { BlogImageSlotAttachment } from "@/lib/blog/blog-image-workflow";
import { seedBlogAdminPublishLog } from "@/lib/blog/blog-admin-publish-log";
import { blogPrimaryStudyCta } from "@/lib/blog/blog-study-cta";
import { detectRiskFlags, thinDraftWarning } from "@/lib/blog/seo-campaign-engine";
import { prisma } from "@/lib/db";

export type ControlPanelGenerateInput = {
  topic: string;
  exam: string;
  country: "US" | "CA" | "unspecified";
  keywords?: string;
  targetKeyword?: string;
  keywordCluster?: string;
  template: BlogPostTemplate;
  intent: BlogPostIntent;
  funnelStage: BlogFunnelStage;
  tone: "professional" | "supportive" | "direct";
  includeImage: boolean;
  includeAiImage: boolean;
  sourceRecordsJson?: BlogSourceRecord[];
  /** When set, skips AI stub generation and uses these as APA inputs. */
  fixedSlug?: string;
  /**
   * Allow saving high-risk drafts with zero verified admin citations (not recommended).
   * Default false: {@link evaluateCitationGate} blocks persist.
   */
  allowInsufficientCitations?: boolean;
};

function extractJsonObject(raw: string): unknown {
  let t = raw.trim();
  const fence = /^```(?:json)?\s*([\s\S]*?)```$/m.exec(t);
  if (fence) t = fence[1].trim();
  const start = t.indexOf("{");
  const end = t.lastIndexOf("}");
  if (start >= 0 && end > start) t = t.slice(start, end + 1);
  return JSON.parse(t) as unknown;
}

async function uniqueSlug(base: string): Promise<string> {
  let candidate = base.slice(0, 120);
  let n = 0;
  while (await prisma.blogPost.findUnique({ where: { slug: candidate }, select: { id: true } })) {
    n += 1;
    candidate = `${base}-${n}`.slice(0, 120);
  }
  return candidate;
}

function sanitizeSlugInput(s: string, exam: string, topic: string): string {
  const fromAi = s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 100);
  if (fromAi.length >= 3) return fromAi;
  const fallback = `${exam}-${topic}`
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 100);
  return fallback || "blog-draft";
}

export async function fetchControlPanelPlan(input: ControlPanelGenerateInput): Promise<BlogControlPanelPlan> {
  const system = buildStructuredPlanSystemPrompt();
  const user = `${buildStructuredPlanUserPrompt({
    topic: input.topic,
    exam: input.exam,
    country: input.country,
    template: input.template,
    intent: input.intent,
    funnelStage: input.funnelStage,
    tone: input.tone,
    keywords: input.keywords,
    targetKeyword: input.targetKeyword,
    keywordCluster: input.keywordCluster,
  })}\n\n${getBlogInternalLinkPathHintsForPrompt(input.exam, input.country)}`;

  const res = await openAiChatCompletion({
    messages: [
      { role: "system", content: system },
      { role: "user", content: user },
    ],
    temperature: 0.35,
    maxTokens: 4096,
  });

  let parsed: unknown;
  try {
    parsed = extractJsonObject(res.content);
  } catch {
    throw new Error("Model returned invalid JSON for the editorial plan");
  }

  const plan = blogControlPanelPlanSchema.safeParse(parsed);
  if (!plan.success) {
    throw new Error(`Plan JSON failed validation: ${plan.error.message}`);
  }
  return plan.data;
}

export async function fetchControlPanelBodyHtml(params: {
  plan: BlogControlPanelPlan;
  topic: string;
  exam: string;
  country: "US" | "CA" | "unspecified";
  template: BlogPostTemplate;
  intent: BlogPostIntent;
  funnelStage: BlogFunnelStage;
  tone: "professional" | "supportive" | "direct";
  keywords?: string;
  /** Overrides plan.h1 when admin picked a different title option. */
  selectedTitle?: string;
}): Promise<string> {
  const pageH1 = params.selectedTitle?.trim() || params.plan.h1;
  const system = buildArticleBodySystemPrompt();
  const user = buildArticleBodyUserPrompt({
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

  const response = await openAiChatCompletion({
    messages: [
      { role: "system", content: system },
      { role: "user", content: user },
    ],
    temperature: 0.42,
    maxTokens: 6000,
  });

  const bodyHtml = response.content.trim();
  if (bodyHtml.length < 400) {
    throw new Error("Model returned too little HTML for the article body");
  }
  return bodyHtml;
}

export type ControlPanelPersistResult =
  | {
      ok: true;
      skipped: false;
      post: {
        id: string;
        slug: string;
        title: string;
        postStatus: BlogPostStatus;
        updatedAt: Date;
      };
      plan: BlogControlPanelPlan;
      warnings: string[];
    }
  | {
      ok: true;
      skipped: true;
      reason: "duplicate_topic" | "duplicate_slug" | "duplicate_slug_race";
      existingSlug?: string;
      normalizedTopic?: string;
      slug?: string;
    }
  | { ok: false; error: string; code?: "INSUFFICIENT_CITATIONS"; riskFlags?: string[] };

export async function persistControlPanelDraft(
  input: ControlPanelGenerateInput,
  plan: BlogControlPanelPlan,
  bodyHtml: string,
): Promise<ControlPanelPersistResult> {
  const normalizedTopic = normalizeBlogTopicKey(input.targetKeyword ?? input.topic);
  const pageTitle = (plan.h1 || plan.titleOptions[0] || input.topic).slice(0, 220);
  const slugBase = sanitizeSlugInput(input.fixedSlug ?? plan.recommendedSlug, input.exam, input.topic);
  const slug = await uniqueSlug(slugBase);

  if (normalizedTopic) {
    const dupTopic = await findExistingBlogByCanonicalIntent({ exam: input.exam, normalizedTopic });
    if (dupTopic) {
      return {
        ok: true,
        skipped: true,
        reason: "duplicate_topic",
        existingSlug: dupTopic.slug,
        normalizedTopic,
      };
    }
  }

  const excerptFromBody = bodyHtml.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim().slice(0, 480);
  const excerpt =
    plan.suggestedExcerpt.trim().length >= 80
      ? plan.suggestedExcerpt.trim().slice(0, 500)
      : excerptFromBody.length >= 10
        ? excerptFromBody.slice(0, 500)
        : `${pageTitle.slice(0, 200)}. Draft excerpt; edit before publish.`;
  const adminSupplied = input.sourceRecordsJson ?? [];
  const aiSuggested = coerceBlogSourceRows(plan.apaSourceStubs as unknown[]);
  const partition = partitionCitationsForBlog(adminSupplied, aiSuggested);
  const citationEnvelope = buildCitationEnvelope(partition);
  const apaReferences = partition.apaLines;
  const sourceCheck = partition.sourceCheck;

  const cta = blogPrimaryStudyCta({
    exam: input.exam,
    country: input.country,
    intent: input.intent,
    funnel: input.funnelStage,
    template: input.template,
  });
  const riskFlags = detectRiskFlags({ template: input.template, keyword: input.targetKeyword ?? input.topic });
  const thinWarning = thinDraftWarning(bodyHtml);

  const citationGate = evaluateCitationGate({
    riskFlags,
    verifiedCount: partition.verified.length,
    allowInsufficientCitations: Boolean(input.allowInsufficientCitations),
  });
  if (!citationGate.ok) {
    return {
      ok: false,
      error: citationGate.message,
      code: citationGate.code,
      riskFlags: citationGate.riskFlags,
    };
  }
  const countryTarget: CountryCode | null =
    input.country === "US" ? CountryCode.US : input.country === "CA" ? CountryCode.CA : null;

  const relatedPaths = lessonRowsToRelatedPaths(plan.suggestedInternalLessons, input.country);

  const tagsForSeo = input.keywords
    ? input.keywords.split(",").map((s) => s.trim()).filter(Boolean).slice(0, 12)
    : [];

  const faqBlock = { items: plan.faqs };
  const seoBundle = buildPersistedSeoBundle(plan, slug, tagsForSeo);
  const internalLinkPlan = {
    lessons: plan.suggestedInternalLessons,
    imagePlacements: plan.imagePlacements,
    imageAttachments: [] as BlogImageSlotAttachment[],
    seo: seoBundle,
  };

  const hasAiCitationStubs = partition.excluded.some((e) => e.provenance === "ai_suggested");
  const workflowStatusBase =
    !plan.metaDescription || !pageTitle
      ? BlogWorkflowStatus.NEEDS_METADATA
      : partition.verified.length === 0 && riskFlags.length > 0
        ? BlogWorkflowStatus.NEEDS_SOURCE_REVIEW
        : riskFlags.length > 0
          ? BlogWorkflowStatus.NEEDS_MEDICAL_REVIEW
          : hasAiCitationStubs
            ? BlogWorkflowStatus.NEEDS_SOURCE_REVIEW
            : BlogWorkflowStatus.GENERATED;

  try {
    const post = await prisma.blogPost.create({
      data: {
        slug,
        title: pageTitle,
        excerpt: excerpt.length >= 10 ? excerpt : `${pageTitle.slice(0, 200)}. Draft excerpt; edit before publish.`,
        body: bodyHtml,
        exam: input.exam,
        targetKeyword: normalizedTopic || (input.targetKeyword ?? input.topic).slice(0, 200),
        keywordCluster: input.keywordCluster ?? null,
        countryTarget,
        intent: input.intent,
        funnelStage: input.funnelStage,
        postTemplate: input.template,
        postStatus: BlogPostStatus.DRAFT,
        publishAt: null,
        seoTitle: plan.metaTitle.slice(0, 200),
        seoDescription: plan.metaDescription.slice(0, 500),
        metaTitleVariant: plan.metaTitle.slice(0, 200),
        metaDescriptionVariant: plan.metaDescription.slice(0, 500),
        tags: tagsForSeo,
        outlineJson: plan.outline as unknown as Prisma.InputJsonValue,
        keyQuestions: plan.faqs.slice(0, 6).map((f) => f.q),
        keywordPlan: [
          input.targetKeyword ?? input.topic,
          ...(input.keywords ? input.keywords.split(",").map((s) => s.trim()).filter(Boolean).slice(0, 8) : []),
        ].filter(Boolean),
        titleAlternates: plan.titleOptions.filter((t) => t !== pageTitle).slice(0, 6),
        keyTakeaways: plan.keyTakeaways,
        faqBlock: faqBlock as unknown as Prisma.InputJsonValue,
        internalLinkPlan: internalLinkPlan as unknown as Prisma.InputJsonValue,
        relatedLessonPaths: relatedPaths,
        schemaSummary: buildSchemaSummaryPayload(seoBundle, {
          schemaOpportunities: plan.schemaOpportunities,
        }),
        ctaType: cta.type,
        ctaText: cta.text,
        ctaHref: cta.href,
        workflowStatus: workflowStatusBase,
        sourcesJson: citationEnvelope as unknown as Prisma.InputJsonValue,
        apaReferences,
        requiresReferences: Boolean(riskFlags.length > 0 || hasAiCitationStubs || partition.excluded.length > 0),
        sourceReliabilityScore: partition.verified.length ? sourceCheck.reliabilityScore : 0,
        medicalRiskFlags: riskFlags,
        imageStatus: input.includeImage ? (input.includeAiImage ? BlogImageStatus.REQUESTED : BlogImageStatus.NONE) : BlogImageStatus.NONE,
        coverImagePrompt:
          input.includeAiImage && plan.imagePlacements[0]
            ? plan.imagePlacements[0].promptIdea.slice(0, 2000)
            : input.includeImage
              ? plan.imagePlacements[0]?.promptIdea?.slice(0, 2000) ?? `Educational nursing blog hero about ${input.topic}.`
              : null,
        coverImageAlt: plan.imagePlacements[0]?.altIdea?.slice(0, 240) ?? null,
        coverImageCaption: plan.imagePlacements[0]?.captionIdea?.slice(0, 300) ?? null,
        featuredSnippet: plan.featuredSnippetHint?.slice(0, 2000) ?? null,
        shortSummary: plan.suggestedExcerpt.trim().slice(0, 220) || excerpt.slice(0, 220),
        socialCaption: `${pageTitle.slice(0, 120)}. ${(plan.suggestedExcerpt.trim().slice(0, 100) || excerpt.slice(0, 100))}…`,
        promoBlurb: cta.text,
        updateNeeded: Boolean(thinWarning),
        rankingNote: thinWarning ?? null,
        adminPublishLog: seedBlogAdminPublishLog("draft_created", "AI draft created and saved as DRAFT (control panel)."),
      },
      select: { id: true, slug: true, title: true, postStatus: true, updatedAt: true },
    });

    const warnings = [
      ...sourceCheck.warnings,
      ...(partition.verified.length === 0
        ? ["No verified bibliography entries yet — only admin-supplied, structurally complete sources are cited."]
        : []),
      ...(partition.excluded.filter((e) => e.provenance === "ai_suggested").length > 0
        ? [
            `${partition.excluded.filter((e) => e.provenance === "ai_suggested").length} AI reference stub(s) held for review (not in bibliography).`,
          ]
        : []),
      ...(partition.excluded.filter((e) => e.provenance === "admin_supplied").length > 0
        ? [
            `${partition.excluded.filter((e) => e.provenance === "admin_supplied").length} admin source row(s) excluded (incomplete URL/DOI/source fields).`,
          ]
        : []),
      ...(thinWarning ? [thinWarning] : []),
    ];

    return { ok: true, skipped: false, post, plan, warnings };
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002") {
      return { ok: true, skipped: true, reason: "duplicate_slug_race", slug };
    }
    throw e;
  }
}

export type RegenerateSection =
  | "title_options"
  | "meta"
  | "outline"
  | "article_html"
  | "faqs"
  | "internal_links"
  | "apa_sources"
  | "image_placements";

export async function regenerateControlPanelSection(params: {
  section: RegenerateSection;
  topic: string;
  exam: string;
  country: "US" | "CA" | "unspecified";
  template: BlogPostTemplate;
  intent: BlogPostIntent;
  funnelStage: BlogFunnelStage;
  tone: "professional" | "supportive" | "direct";
  keywords?: string;
  currentPlan?: BlogControlPanelPlan;
  currentBody?: string;
  currentTitle?: string;
}): Promise<
  | { section: "title_options"; titleOptions: string[] }
  | {
      section: "meta";
      metaTitle: string;
      metaDescription: string;
      recommendedSlug: string;
      suggestedExcerpt?: string;
      openGraphTitle?: string;
      openGraphDescription?: string;
      canonicalPath?: string | null;
      seoFocusKeywords?: string[];
    }
  | { section: "outline"; outline: BlogControlPanelPlan["outline"] }
  | { section: "article_html"; bodyHtml: string }
  | { section: "faqs"; faqs: BlogControlPanelPlan["faqs"] }
  | { section: "internal_links"; suggestedInternalLessons: BlogControlPanelPlan["suggestedInternalLessons"] }
  | { section: "apa_sources"; apaSourceStubs: BlogSourceRecord[] }
  | { section: "image_placements"; imagePlacements: BlogControlPanelPlan["imagePlacements"] }
> {
  const countryLine =
    params.country === "unspecified" ? "Country: general US/CA nursing exams." : `Country: ${params.country}.`;

  if (params.section === "article_html") {
    if (!params.currentPlan) throw new Error("Plan required to regenerate article HTML");
    const bodyHtml = await fetchControlPanelBodyHtml({
      plan: params.currentPlan,
      topic: params.topic,
      exam: params.exam,
      country: params.country,
      template: params.template,
      intent: params.intent,
      funnelStage: params.funnelStage,
      tone: params.tone,
      keywords: params.keywords,
      selectedTitle: params.currentTitle ?? params.currentPlan.h1 ?? params.currentPlan.titleOptions[0] ?? params.topic,
    });
    return { section: "article_html", bodyHtml };
  }

  const system = `You are a NurseNest blog editor. Return JSON only (no markdown). Be conservative; no fabricated stats.`;

  const sectionPrompts: Record<Exclude<RegenerateSection, "article_html">, string> = {
    title_options: `Return {"titleOptions": string[] } with 4 new title variants for:
Topic: ${params.topic}, exam: ${params.exam}, ${countryLine}, template ${params.template}.`,

    meta: `Return JSON only for topic "${params.topic}", exam ${params.exam}, primary keyword: ${params.keywords ?? params.topic}.
Keys:
- metaTitle: <=60 chars; name a concrete clinical or exam decision this article covers (no generic "nursing guide").
- metaDescription: 120-155 chars; promise must match the article body themes, not boilerplate.
- recommendedSlug: kebab-case, 3-80 chars.
- suggestedExcerpt: 140-220 chars; card/social blurb; must not copy metaDescription verbatim.
- optional openGraphTitle (<=60c), openGraphDescription (<=110c) if tighter than meta fields.
- optional canonicalPath: "/blog/{recommendedSlug}" only when identical to recommendedSlug; else omit.
- optional seoFocusKeywords: string[] length 3-8 (exam + specific clinical terms).
Current: metaTitle=${JSON.stringify(params.currentPlan?.metaTitle ?? "")}, metaDescription=${JSON.stringify((params.currentPlan?.metaDescription ?? "").slice(0, 160))}`,

    outline: `Return {"outline": same shape as before: array of {h2, h3?, bullets?} } with 4-6 sections for template ${params.template}, topic ${params.topic}, exam ${params.exam}.
Current outline for reference: ${JSON.stringify(params.currentPlan?.outline ?? [])}`,

    faqs: `Return {"faqs": array of {q,a} } with 4-6 new exam-prep FAQs for topic "${params.topic}" (${params.exam}).`,

    internal_links: `Return {"suggestedInternalLessons": array of { label, suggestedPath, rationale?, optional linkKind ("lesson"|"lessons_hub"|"question_bank"|"topic_cluster"|"practice_exams"|"practice_programmatic"|"general") } } — 5-12 **strictly relevant** destinations: lessons, question bank hub, /practice-exams, programmatic practice when applicable, topic clusters. No filler. Match audience country (/us/... vs /canada/...).

${getBlogInternalLinkPathHintsForPrompt(params.exam, params.country)}`,

    apa_sources: `Return {"apaSourceStubs": array of source objects } with 3-6 conservative references (authors[], year, title, source, url?, authority?) suitable for nursing exam prep on "${params.topic}".`,

    image_placements: `Return {"imagePlacements": array of objects with optional slotKey, optional role ("hero"|"inline"), section, promptIdea, altIdea, optional captionIdea }.
Hero + 1-3 inline ideas for "${params.topic}" (${params.exam}). NurseNest brand: educational, clinically relevant, dignified, inclusive representation in illustrations; no gore, no identifiable patients, no real hospital logos or watermarks, no sensational "stock nurse" clichés.
Current placements for reference: ${JSON.stringify(params.currentPlan?.imagePlacements ?? [])}`,
  };

  const user = sectionPrompts[params.section as Exclude<RegenerateSection, "article_html">];

  const res = await openAiChatCompletion({
    messages: [
      { role: "system", content: system },
      { role: "user", content: user },
    ],
    temperature: 0.4,
    maxTokens: 3000,
  });

  const json = extractJsonObject(res.content) as Record<string, unknown>;

  switch (params.section) {
    case "title_options": {
      const titles = Array.isArray(json.titleOptions) ? json.titleOptions.filter((t): t is string => typeof t === "string") : [];
      if (titles.length < 2) throw new Error("Invalid titleOptions array");
      return { section: "title_options", titleOptions: titles.slice(0, 6) };
    }
    case "meta": {
      const metaRegenSchema = z.object({
        metaTitle: z.string().min(3).max(70),
        metaDescription: z.string().min(20).max(340),
        recommendedSlug: z.string().min(3).max(120),
        suggestedExcerpt: z.string().max(360).optional(),
        openGraphTitle: z.string().max(90).optional(),
        openGraphDescription: z.string().max(200).optional(),
        canonicalPath: z.string().max(220).nullable().optional(),
        seoFocusKeywords: z.array(z.string().min(1).max(80)).max(10).optional(),
      });
      const parsed = metaRegenSchema.safeParse(json);
      if (!parsed.success) throw new Error("Invalid meta payload");
      const m = parsed.data;
      return {
        section: "meta",
        metaTitle: m.metaTitle,
        metaDescription: m.metaDescription,
        recommendedSlug: m.recommendedSlug,
        ...(m.suggestedExcerpt !== undefined ? { suggestedExcerpt: m.suggestedExcerpt } : {}),
        ...(m.openGraphTitle !== undefined ? { openGraphTitle: m.openGraphTitle } : {}),
        ...(m.openGraphDescription !== undefined ? { openGraphDescription: m.openGraphDescription } : {}),
        ...(m.canonicalPath !== undefined ? { canonicalPath: m.canonicalPath } : {}),
        ...(m.seoFocusKeywords !== undefined ? { seoFocusKeywords: m.seoFocusKeywords } : {}),
      };
    }
    case "outline": {
      const outline = json.outline;
      const parsed = z.array(z.object({ h2: z.string(), h3: z.array(z.string()).optional(), bullets: z.array(z.string()).optional() })).safeParse(outline);
      if (!parsed.success) throw new Error("Invalid outline payload");
      return { section: "outline", outline: parsed.data };
    }
    case "faqs": {
      const faqs = json.faqs;
      const parsed = z.array(z.object({ q: z.string(), a: z.string() })).safeParse(faqs);
      if (!parsed.success) throw new Error("Invalid faqs payload");
      return { section: "faqs", faqs: parsed.data };
    }
    case "internal_links": {
      const lessons = json.suggestedInternalLessons;
      const parsed = z.array(blogLessonLinkRowSchema).max(16).safeParse(lessons);
      if (!parsed.success) throw new Error("Invalid internal links payload");
      return {
        section: "internal_links",
        suggestedInternalLessons: normalizePlanSuggestedLessonRows(parsed.data) as BlogControlPanelPlan["suggestedInternalLessons"],
      };
    }
    case "apa_sources": {
      const stubs = Array.isArray(json.apaSourceStubs) ? json.apaSourceStubs : [];
      return { section: "apa_sources", apaSourceStubs: coerceBlogSourceRows(stubs) };
    }
    case "image_placements": {
      const placementRow = z.object({
        slotKey: z.string().min(2).max(48).optional(),
        role: z.enum(["hero", "inline"]).optional(),
        section: z.string().min(2).max(200),
        promptIdea: z.string().min(10).max(500),
        altIdea: z.string().min(5).max(240),
        captionIdea: z.string().max(300).optional(),
      });
      const parsed = z.array(placementRow).min(1).max(10).safeParse(json.imagePlacements);
      if (!parsed.success) throw new Error("Invalid imagePlacements payload");
      return { section: "image_placements", imagePlacements: parsed.data };
    }
    default:
      throw new Error("Unsupported section");
  }
}
