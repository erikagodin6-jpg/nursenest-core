import { config as loadEnv } from "dotenv";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { BlogPostStatus, BlogWorkflowStatus, PrismaClient } from "@prisma/client";
import { z } from "zod";
import { openAiChatCompletion } from "../src/lib/ai/openai-chat-completions";
import {
  buildAdaptationSystemPrompt,
  buildAdaptationUserPrompt,
  extractCanonicalBrief,
  postProcessAiOutput,
} from "../src/lib/blog/generate-localized-blog";
import type { LocalizedBlogAiOutput } from "../src/lib/blog/blog-localization-types";
import { GLOBAL_LOCALE_CODES } from "../src/lib/i18n/global-regions";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
loadEnv({ path: path.join(__dirname, "../.env") });
loadEnv({ path: path.join(__dirname, "../../.env") });

const prisma = new PrismaClient();
const DEFAULT_MAX_POSTS = 3;
const SOURCE_LOCALE = "en";

const localizedAiOutputSchema = z.object({
  localizedTitle: z.string().min(10),
  localizedExcerpt: z.string().min(40),
  localizedBody: z.string().min(400),
  localizedSlug: z.string().min(3),
  localizedMetaTitle: z.string().min(10),
  localizedMetaDescription: z.string().min(20),
  seoKeywordPrimary: z.string().nullable(),
  seoKeywordSecondary: z.array(z.string()).default([]),
  searchIntent: z.string().nullable(),
  ctaVariant: z.string().nullable(),
  ctaText: z.string().nullable(),
  ctaHref: z.string().nullable(),
  internalLinkTargets: z.array(z.object({ anchorText: z.string(), href: z.string(), context: z.string() })).default([]),
  reviewFlags: z.array(z.string()).default([]),
  complianceReviewRequired: z.boolean().default(false),
  medicalReviewRequired: z.boolean().default(false),
  faqSuggestions: z.array(z.object({ question: z.string(), answer: z.string() })).default([]),
  snippetSummary: z.string().nullable(),
  referenceLines: z.array(z.string()).default([]),
  sourceSelectionNotes: z.string().nullable(),
});

function argValue(name: string): string | null {
  const raw = process.argv.find((a) => a.startsWith(`${name}=`));
  return raw ? raw.slice(name.length + 1) : null;
}

function hasFlag(name: string): boolean {
  return process.argv.includes(name);
}

function toJsonObject(text: string): unknown {
  const trimmed = text.trim();
  const start = trimmed.indexOf("{");
  const end = trimmed.lastIndexOf("}");
  if (start < 0 || end <= start) throw new Error("AI response did not contain JSON object.");
  return JSON.parse(trimmed.slice(start, end + 1));
}

function normalizeSlug(seed: string): string {
  return seed
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 120);
}

async function uniqueSlug(base: string): Promise<string> {
  let candidate = normalizeSlug(base);
  let n = 0;
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const exists = await prisma.blogPost.findUnique({ where: { slug: candidate }, select: { id: true } });
    if (!exists) return candidate;
    n += 1;
    candidate = normalizeSlug(`${base}-${n}`);
  }
}

async function hasBlogColumn(column: string): Promise<boolean> {
  const rows = await prisma.$queryRawUnsafe<Array<{ present: number }>>(
    `SELECT 1 AS present
       FROM information_schema.columns
      WHERE table_schema = 'public'
        AND table_name = 'BlogPost'
        AND column_name = $1
      LIMIT 1`,
    column,
  );
  return rows.length > 0;
}

async function main() {
  const apply = hasFlag("--apply");
  const maxPosts = Number(argValue("--max-posts") ?? `${DEFAULT_MAX_POSTS}`);
  const requestedLocales = (argValue("--locales") ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  const locales = (requestedLocales.length > 0 ? requestedLocales : GLOBAL_LOCALE_CODES.filter((l) => l !== SOURCE_LOCALE))
    .filter((l): l is string => l !== SOURCE_LOCALE)
    .slice(0, 24);
  const supports = {
    careerSlug: await hasBlogColumn("careerSlug"),
    locale: await hasBlogColumn("locale"),
    translationGroupId: await hasBlogColumn("translationGroupId"),
    canonicalPostId: await hasBlogColumn("canonicalPostId"),
    isAutoTranslated: await hasBlogColumn("isAutoTranslated"),
    translationSource: await hasBlogColumn("translationSource"),
  };

  const candidateRows = await prisma.blogPost.findMany({
    where: {
      OR: [
        { exam: { contains: "allied", mode: "insensitive" } },
        { tags: { has: "allied-health" } },
        ...(supports.careerSlug
          ? [{ careerSlug: { in: ["paramedic", "mlt", "imaging", "respiratory", "pta", "ota", "pharmacy-tech", "social-work"] } }]
          : []),
      ],
      ...(supports.locale ? { locale: SOURCE_LOCALE } : {}),
      ...(supports.careerSlug ? { careerSlug: { not: null } } : {}),
    },
    orderBy: { createdAt: "desc" },
    take: Math.max(1, Math.min(200, maxPosts)),
    select: {
      id: true,
      slug: true,
      title: true,
      excerpt: true,
      body: true,
      exam: true,
      targetKeyword: true,
      postStatus: true,
      publishAt: true,
      tags: true,
      category: true,
      ...(supports.careerSlug ? { careerSlug: true } : {}),
      ...(supports.translationGroupId ? { translationGroupId: true } : {}),
      sourcesJson: true,
      apaReferences: true,
      seoTitle: true,
      seoDescription: true,
      countryTarget: true,
      legacySource: true,
    },
  });

  const byLocale: Record<string, { existing: number; generated: number; failed: number }> = {};
  const byProfession: Record<string, { existing: number; generated: number; failed: number }> = {};
  const errors: string[] = [];

  const register = (locale: string, profession: string, kind: "existing" | "generated" | "failed") => {
    byLocale[locale] = byLocale[locale] ?? { existing: 0, generated: 0, failed: 0 };
    byLocale[locale][kind] += 1;
    byProfession[profession] = byProfession[profession] ?? { existing: 0, generated: 0, failed: 0 };
    byProfession[profession][kind] += 1;
  };

  for (const canonical of candidateRows) {
    const derivedCareer =
      ("careerSlug" in canonical && typeof canonical.careerSlug === "string" && canonical.careerSlug) ||
      (canonical.tags.includes("paramedic")
        ? "paramedic"
        : canonical.tags.includes("mlt")
          ? "mlt"
          : canonical.tags.includes("medical-imaging")
            ? "imaging"
            : null);
    const profession = derivedCareer ?? "unspecified";
    const region = canonical.countryTarget === "CA" ? "canada" : "us";
    const groupId =
      (supports.translationGroupId && "translationGroupId" in canonical && typeof canonical.translationGroupId === "string"
        ? canonical.translationGroupId
        : null) ?? normalizeSlug(canonical.slug);

    for (const locale of locales) {
      const existing = supports.translationGroupId && supports.locale
        ? await prisma.blogPost.findFirst({
            where: { translationGroupId: groupId, locale },
            select: { id: true },
          })
        : null;
      if (existing) {
        register(locale, profession, "existing");
        continue;
      }
      if (!apply) {
        register(locale, profession, "generated");
        continue;
      }
      if (!supports.locale || !supports.translationGroupId || !supports.canonicalPostId) {
        register(locale, profession, "failed");
        errors.push(
          `${canonical.slug}:${locale}:Database schema is missing locale/translation columns. Apply blog migrations before --apply.`,
        );
        continue;
      }
      try {
        const brief = extractCanonicalBrief({
          id: canonical.id,
          title: canonical.title,
          slug: canonical.slug,
          excerpt: canonical.excerpt,
          body: canonical.body,
          exam: canonical.exam,
          targetLocale: locale,
          targetRegion: region,
          targetProfession: profession,
          targetExam: canonical.exam,
          seoKeywordPrimary: canonical.targetKeyword ?? null,
          seoKeywordSecondary: canonical.tags.slice(0, 8),
          searchIntent: "exam_prep",
          targetAudience: `${profession} students`,
          canonicalSourcesJson: canonical.sourcesJson,
          canonicalApaReferences: canonical.apaReferences,
        });
        const ai = await openAiChatCompletion({
          messages: [
            { role: "system", content: buildAdaptationSystemPrompt(brief) },
            { role: "user", content: buildAdaptationUserPrompt(brief) },
          ],
          temperature: 0.35,
          maxTokens: 8192,
        });
        const parsed = localizedAiOutputSchema.parse(toJsonObject(ai.content)) as LocalizedBlogAiOutput;
        const processed = postProcessAiOutput(parsed, brief);
        if (!processed.ok) throw new Error(processed.error);

        const variantSlug = await uniqueSlug(`${canonical.slug}-${locale}`);
        const status =
          canonical.postStatus === BlogPostStatus.PUBLISHED || canonical.postStatus === BlogPostStatus.SCHEDULED
            ? BlogPostStatus.PUBLISHED
            : BlogPostStatus.DRAFT;
        await prisma.blogPost.create({
          data: {
            slug: variantSlug,
            title: processed.aiOutput.localizedTitle,
            excerpt: processed.aiOutput.localizedExcerpt.slice(0, 500),
            body: processed.aiOutput.localizedBody,
            tags: [...new Set([...canonical.tags, ...processed.aiOutput.seoKeywordSecondary])].slice(0, 16),
            category: canonical.category,
            exam: canonical.exam,
            postStatus: status,
            publishAt: status === BlogPostStatus.PUBLISHED ? canonical.publishAt ?? new Date() : null,
            legacySource: canonical.legacySource ?? "allied-translation-backfill",
            seoTitle: processed.aiOutput.localizedMetaTitle.slice(0, 200),
            seoDescription: processed.aiOutput.localizedMetaDescription.slice(0, 500),
            locale,
            sourceLocale: SOURCE_LOCALE,
            isAutoTranslated: true,
            translationSource: "ai-backfill",
            translationGroupId: groupId,
            canonicalPostId: canonical.id,
            ...(supports.careerSlug ? { careerSlug: profession } : {}),
            targetKeyword: processed.aiOutput.seoKeywordPrimary ?? canonical.targetKeyword ?? canonical.title,
            countryTarget: canonical.countryTarget,
            workflowStatus: status === BlogPostStatus.PUBLISHED ? BlogWorkflowStatus.PUBLISHED : BlogWorkflowStatus.GENERATED,
          },
        });
        register(locale, profession, "generated");
      } catch (e) {
        register(locale, profession, "failed");
        errors.push(`${canonical.slug}:${locale}:${e instanceof Error ? e.message : String(e)}`);
      }
    }
  }

  console.log(
    JSON.stringify(
      {
        apply,
        maxPosts,
        locales,
        schemaSupport: supports,
        canonicalRowsScanned: candidateRows.length,
        byLocale,
        byProfession,
        errors,
      },
      null,
      2,
    ),
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
