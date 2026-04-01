import { BlogPostStatus, BlogPostTemplate } from "@prisma/client";
import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAdmin } from "@/lib/admin/ensure-admin";
import { isAdminAiGenerationEnabled } from "@/lib/ai/admin-ai-policy";
import { openAiChatCompletion } from "@/lib/ai/openai-chat-completions";
import { assertOpenAiKeyConfigured } from "@/lib/ai/openai-env";
import { BLOG_TEMPLATE_TITLE_PATTERNS } from "@/lib/blog/blog-template-copy";
import { prisma } from "@/lib/db";

const schema = z.object({
  topic: z.string().min(3).max(200),
  keywords: z.string().max(400).optional(),
  exam: z.string().min(2).max(80),
  country: z.enum(["US", "CA", "unspecified"]).optional(),
  template: z.nativeEnum(BlogPostTemplate),
  tone: z.enum(["professional", "supportive", "direct"]).optional(),
  slug: z
    .string()
    .min(3)
    .max(180)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
    .optional(),
});

/**
 * Single-post AI draft generation (one model call per request — batch uses /api/admin/blog/batch-chunk).
 */
export async function POST(req: Request) {
  const gate = await requireAdmin();
  if (!gate.ok) return gate.response;

  if (!isAdminAiGenerationEnabled()) {
    return NextResponse.json(
      { error: "AI admin generation disabled", hint: "Set AI_ADMIN_GENERATION_ENABLED=true" },
      { status: 403 },
    );
  }
  const keyCheck = assertOpenAiKeyConfigured();
  if (!keyCheck.ok) {
    return NextResponse.json({ error: keyCheck.message }, { status: 503 });
  }

  const parsed = schema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid payload", details: parsed.error.flatten() }, { status: 400 });
  }
  const d = parsed.data;

  const titleFn = BLOG_TEMPLATE_TITLE_PATTERNS[d.template];
  const title = titleFn({ exam: d.exam, topic: d.topic });
  const slug =
    d.slug ??
    (await (async () => {
      const base = `${d.exam}-${d.topic}`
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "")
        .slice(0, 100);
      let candidate = base;
      let n = 0;
      while (await prisma.blogPost.findUnique({ where: { slug: candidate }, select: { id: true } })) {
        n += 1;
        candidate = `${base}-${n}`.slice(0, 120);
      }
      return candidate;
    })());

  const system = `You write SEO-aware HTML for NurseNest nursing education blog posts. Output valid HTML only: use <h2>, <h3>, <p>, <ul>, <li>, <strong>. No markdown. No fabricated statistics or pass-rate claims. Be accurate and conservative. Audience: nursing students preparing for licensure exams.`;

  const user = `Write the article body (HTML only, no outer <html>).

Template: ${d.template}
Exam focus: ${d.exam}
${d.country && d.country !== "unspecified" ? `Country context: ${d.country}` : ""}
Topic: ${d.topic}
${d.keywords ? `Keywords / phrases: ${d.keywords}` : ""}
Tone: ${d.tone ?? "professional"}

Include:
- A short intro paragraph
- 3–5 H2 sections with practical, exam-relevant guidance
- One short bullet list where helpful
- A closing paragraph with a soft CTA to practice (no fake guarantees)

Title (for context only, do not repeat as H1 in body): ${title}`;

  let bodyHtml: string;
  try {
    const response = await openAiChatCompletion({
      messages: [
        { role: "system", content: system },
        { role: "user", content: user },
      ],
      temperature: 0.45,
      maxTokens: 3600,
    });
    bodyHtml = response.content.trim();
    if (bodyHtml.length < 200) {
      return NextResponse.json({ error: "Model returned too little content" }, { status: 502 });
    }
  } catch (e) {
    return NextResponse.json(
      { error: "Generation failed", detail: e instanceof Error ? e.message : String(e) },
      { status: 502 },
    );
  }

  const excerpt = bodyHtml.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim().slice(0, 480);
  const seoDescription = excerpt.slice(0, 320);

  const post = await prisma.blogPost.create({
    data: {
      slug,
      title,
      excerpt: excerpt.length >= 10 ? excerpt : `${title.slice(0, 200)} — draft excerpt; edit before publish.`,
      body: bodyHtml,
      exam: d.exam,
      postTemplate: d.template,
      postStatus: BlogPostStatus.DRAFT,
      seoTitle: title.slice(0, 200),
      seoDescription,
      tags: d.keywords ? d.keywords.split(",").map((s) => s.trim()).filter(Boolean).slice(0, 12) : [],
    },
    select: { id: true, slug: true, title: true, postStatus: true, updatedAt: true },
  });

  return NextResponse.json({ post }, { status: 201 });
}
