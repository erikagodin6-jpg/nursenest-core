#!/usr/bin/env npx tsx
/**
 * Backfill patho/pharm classification for **already public** posts (blogLiveWhere) so
 * `blog-public-patho-pharm-counts.mts` topical SQL can see them.
 *
 * Default DRY_RUN=true. Skips rows that already satisfy `hasStrongPathoPharmClassification`.
 * Uses clinical keyword scan on title, excerpt, body (prefix), category, tags, targetKeyword, keywordPlan.
 *
 *   DRY_RUN=true npx tsx scripts/blog/repair-patho-pharm-blog-classification.mts
 *   DRY_RUN=false npx tsx scripts/blog/repair-patho-pharm-blog-classification.mts
 */
import { config } from "dotenv";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { BlogPostTemplate, PrismaClient } from "@prisma/client";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
config({ path: path.join(root, ".env.local") });

import "../../src/lib/db/env-bootstrap";
import { blogLiveWhere } from "../../src/lib/blog/blog-visibility";
import {
  hasStrongPathoPharmClassification,
  rowMatchesPathoPharmTopicalCriteria,
  textHasClinicalPathoPharmSignal,
} from "../../src/lib/blog/blog-patho-pharm-detection";

const prisma = new PrismaClient();
const BODY_SCAN_CHARS = 16_000;

const WEAK_TEMPLATES = new Set<BlogPostTemplate | null>([
  null,
  BlogPostTemplate.HOW_TO_PASS,
  BlogPostTemplate.TOPIC_EXPLAINED,
  BlogPostTemplate.TOP_MISTAKES,
  BlogPostTemplate.PRACTICE_QUESTIONS,
  BlogPostTemplate.STUDY_PLAN,
  BlogPostTemplate.EXAM_GUIDE,
  BlogPostTemplate.PRIORITIZATION_ARTICLE,
  BlogPostTemplate.COMPARISON_ARTICLE,
  BlogPostTemplate.CHECKLIST_ARTICLE,
  BlogPostTemplate.FAQ_STYLE,
  BlogPostTemplate.GLOSSARY,
]);

function envBool(name: string, defaultValue: boolean): boolean {
  const v = process.env[name]?.trim().toLowerCase();
  if (v === undefined || v === "") return defaultValue;
  if (["1", "true", "yes", "on"].includes(v)) return true;
  if (["0", "false", "no", "off"].includes(v)) return false;
  return defaultValue;
}

function scanBlob(row: {
  title: string;
  excerpt: string;
  body: string;
  category: string | null;
  tags: string[];
  targetKeyword: string | null;
  keywordPlan: string[];
}): string {
  const kw = [row.targetKeyword, ...row.keywordPlan].filter(Boolean).join(" ");
  return `${row.title}\n${row.excerpt}\n${row.body.slice(0, BODY_SCAN_CHARS)}\n${row.category ?? ""}\n${row.tags.join(" ")}\n${kw}`.toLowerCase();
}

/** Only fill category when empty — avoids overwriting editorial taxonomy like "Cardiac Nursing". */
function shouldFillCategory(cat: string | null): boolean {
  return !cat?.trim();
}

function suggestTemplate(blob: string): BlogPostTemplate {
  if (
    /\b(dosage|drug|pharmacolog|medication|medications|adverse|contraindication|mechanism of action|opio|antibiotic|insulin|diuretic|nsaid|vasopressor|chemotherapy)\b/.test(
      blob,
    )
  ) {
    return BlogPostTemplate.MEDICATION_REVIEW;
  }
  if (/\b(lab value|lab values|electrolyte|cbc|bmp|abg|coagulation|inr|troponin)\b/.test(blob)) {
    return BlogPostTemplate.LAB_VALUES_GUIDE;
  }
  return BlogPostTemplate.DISEASE_PROCESS_EXPLAINER;
}

function mergeTags(existing: string[], additions: string[]): string[] {
  const lower = new Set(existing.map((t) => t.toLowerCase()));
  const out = [...existing];
  for (const a of additions) {
    const k = a.toLowerCase();
    if (!k || lower.has(k)) continue;
    lower.add(k);
    out.push(a);
  }
  return out;
}

function proposeTags(blob: string, existing: string[]): string[] {
  const add: string[] = [];
  if (/\b(pharmacolog|medication|drug|dosage|adverse|contraindication)\b/.test(blob)) {
    add.push("pharmacology");
  }
  if (/\b(pathophys|disease process|complication|assessment finding)\b/.test(blob)) {
    add.push("pathophysiology");
  }
  if (add.length === 0) add.push("pathophysiology");
  return mergeTags(existing, add);
}

async function main(): Promise<void> {
  if (!process.env.DATABASE_URL?.trim()) {
    console.error("[repair-patho-pharm-blog-classification] DATABASE_URL is not set.");
    process.exit(1);
  }

  const dryRun = envBool("DRY_RUN", true);
  const now = new Date();
  const liveWhere = blogLiveWhere(now);

  let cursor: { id: string } | undefined;
  let examined = 0;
  let skippedStrong = 0;
  let skippedNoSignal = 0;
  let wouldRepair = 0;
  const samples: unknown[] = [];

  for (;;) {
    const batch = await prisma.blogPost.findMany({
      where: liveWhere,
      take: 100,
      orderBy: { id: "asc" },
      ...(cursor ? { cursor, skip: 1 } : {}),
      select: {
        id: true,
        slug: true,
        title: true,
        excerpt: true,
        body: true,
        category: true,
        postTemplate: true,
        tags: true,
        targetKeyword: true,
        keywordPlan: true,
      },
    });
    if (!batch.length) break;

    for (const row of batch) {
      examined += 1;
      const shape = {
        postTemplate: row.postTemplate,
        category: row.category,
        title: row.title,
        tags: row.tags,
      };
      if (hasStrongPathoPharmClassification(shape)) {
        skippedStrong += 1;
        continue;
      }
      if (rowMatchesPathoPharmTopicalCriteria(shape)) {
        continue;
      }

      const blob = scanBlob(row);
      if (!textHasClinicalPathoPharmSignal(blob)) {
        skippedNoSignal += 1;
        continue;
      }

      const nextTemplate = suggestTemplate(blob);
      const nextTags = proposeTags(blob, row.tags);
      const nextCategory = shouldFillCategory(row.category)
        ? "Pathophysiology & Pharmacology"
        : (row.category ?? "");

      const resolvedTemplate = WEAK_TEMPLATES.has(row.postTemplate) ? nextTemplate : row.postTemplate!;
      const previewRow = {
        postTemplate: resolvedTemplate,
        category: nextCategory,
        title: row.title,
        tags: nextTags,
      };

      if (!rowMatchesPathoPharmTopicalCriteria(previewRow)) {
        continue;
      }

      const data: {
        postTemplate?: BlogPostTemplate;
        category?: string;
        tags?: string[];
      } = {};

      if (WEAK_TEMPLATES.has(row.postTemplate)) {
        data.postTemplate = nextTemplate;
      }
      if (shouldFillCategory(row.category)) {
        data.category = "Pathophysiology & Pharmacology";
      }
      if (JSON.stringify(row.tags) !== JSON.stringify(nextTags)) {
        data.tags = nextTags;
      }

      if (Object.keys(data).length === 0) {
        continue;
      }

      wouldRepair += 1;
      if (samples.length < 15) {
        samples.push({
          id: row.id,
          slug: row.slug,
          title: row.title.slice(0, 100),
          before: { postTemplate: row.postTemplate, category: row.category, tags: row.tags.slice(0, 8) },
          after: data,
        });
      }

      if (!dryRun) {
        await prisma.blogPost.update({
          where: { id: row.id },
          data,
        });
      }
    }

    cursor = { id: batch[batch.length - 1]!.id };
  }

  const summary = {
    dryRun,
    examined,
    skippedStrongClassification: skippedStrong,
    skippedNoClinicalKeywordSignal: skippedNoSignal,
    repairedOrWouldRepair: wouldRepair,
    sample: samples,
  };
  console.error(JSON.stringify({ phase: "repair-patho-pharm", ...summary }, null, 2));
  console.log(JSON.stringify(summary, null, 2));
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
