import { BlogPostTemplate } from "@prisma/client";
import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAdmin } from "@/lib/admin/ensure-admin";
import { generateGeminiBlogDraft } from "@/lib/blog/generate-gemini-blog-draft";

const requestSchema = z.object({
  topic: z.string().trim().min(3).max(200),
  exam: z.string().trim().min(2).max(80),
  country: z.enum(["US", "CA", "unspecified"]).default("unspecified"),
  minWordCount: z.number().int().min(800).max(3000).default(1200),
  template: z.nativeEnum(BlogPostTemplate).default(BlogPostTemplate.TOPIC_EXPLAINED),
});

export async function GET(req: Request) {
  const gate = await requireAdmin(req);
  if (!gate.ok) return gate.response;
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  const model = process.env.GEMINI_MODEL?.trim() || "gemini-2.5-flash";
  const key = process.env.GEMINI_API_KEY?.trim() || "";
  return NextResponse.json(
    {
      ok: true,
      env: {
        geminiApiKeyPresent: key.length > 0,
        geminiApiKeyPrefix: key.length > 6 ? `${key.slice(0, 3)}***` : null,
        geminiApiKeyLength: key.length || 0,
        geminiModel: model,
      },
      note: "Local-development diagnostic only.",
    },
    { status: 200 },
  );
}

export async function POST(req: Request) {
  const gate = await requireAdmin(req);
  if (!gate.ok) return gate.response;

  let payload: unknown;
  try {
    payload = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON payload." }, { status: 400 });
  }

  const parsed = requestSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid payload", details: parsed.error.flatten() }, { status: 400 });
  }

  const result = await generateGeminiBlogDraft(parsed.data);
  if (!result.ok) {
    const status =
      result.code === "missing_api_key" ? 503
      : result.code === "quota" ? 429
      : result.code === "timeout" ? 504
      : result.code === "malformed_response" ? 502
      : 500;
    return NextResponse.json({ ok: false, error: result.error, code: result.code }, { status });
  }

  if (result.skipped) {
    return NextResponse.json(
      {
        ok: true,
        skipped: true,
        reason: result.reason,
        existingSlug: result.existingSlug,
        slug: result.slug,
      },
      { status: 200 },
    );
  }

  return NextResponse.json(
    {
      ok: true,
      skipped: false,
      post: result.post,
      wordCount: result.wordCount,
    },
    { status: 201 },
  );
}
