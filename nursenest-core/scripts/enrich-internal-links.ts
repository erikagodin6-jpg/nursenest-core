#!/usr/bin/env npx tsx
/**
 * enrich-internal-links.ts
 *
 * Post-processing pass: adds internal linking metadata to generated lesson + question JSON
 * without any AI calls. Matching is purely deterministic, scored by:
 *   - Same bodySystem   : +3 pts
 *   - Each shared tag   : +2 pts
 *   - Same category     : +1 pt
 *
 * Adds to each lesson:
 *   relatedTopicSlugs[]       – other lesson slugs (max 5–8, ranked by score)
 *   suggestedQuestionTopics[] – topic slugs whose questions pair well with this lesson
 *
 * Adds to each question:
 *   relatedLessonSlugs[]      – lesson slugs that match the question's topic + bodySystem
 *
 * Usage:
 *   npx tsx scripts/enrich-internal-links.ts [options]
 *
 * Options:
 *   --input=FILE      Batch JSON to enrich (default: output/rn-content-batch.json)
 *   --manifest=FILE   Topic manifest used as fallback index (default: output/rn-topic-manifest.json)
 *   --output=FILE     Output path (default: replaces input with -linked.json suffix)
 *   --max-links=N     Max links per item, 5–8 (default: 6)
 *   --dry-run         Print link counts only, do not write output
 */

import * as fs from "fs/promises";
import * as path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type TopicEntry = {
  topicSlug: string;
  topicLabel: string;
  bodySystem: string;
  tags: string[];
  category: string;
  difficulty?: string;
  country?: string;
};

type TopicManifest = {
  topics: Array<{
    index: number;
    topicSlug: string;
    topicLabel: string;
    bodySystem: string;
    tags: string[];
    category: string;
    difficulty: string;
    country: string;
  }>;
};

type RawLesson = Record<string, unknown> & {
  topicSlug: string;
  slug: string;
  bodySystem: string;
  _meta?: {
    tags?: string[];
    category?: string;
    [key: string]: unknown;
  };
};

type RawQuestion = Record<string, unknown> & {
  topicSlug: string;
  bodySystem: string;
  tags?: string[];
};

type BatchFile = {
  lessons?: RawLesson[];
  questions?: RawQuestion[];
  completedTopicSlugs?: string[];
  errors?: unknown[];
};

// ---------------------------------------------------------------------------
// Scoring
// ---------------------------------------------------------------------------

/**
 * Score how related `candidate` is to `source`.
 * Higher = more related. Returns 0 for self (slug equality).
 */
function scoreRelatedness(source: TopicEntry, candidate: TopicEntry): number {
  if (source.topicSlug === candidate.topicSlug) return -1;

  let score = 0;

  if (
    source.bodySystem &&
    candidate.bodySystem &&
    source.bodySystem.toLowerCase() === candidate.bodySystem.toLowerCase()
  ) {
    score += 3;
  }

  // multi-system matches everything at half weight
  if (
    source.bodySystem === "multi-system" ||
    candidate.bodySystem === "multi-system"
  ) {
    score += 1;
  }

  const srcTags = new Set(source.tags.map((t) => t.toLowerCase()));
  for (const tag of candidate.tags) {
    if (srcTags.has(tag.toLowerCase())) score += 2;
  }

  if (
    source.category &&
    candidate.category &&
    source.category === candidate.category
  ) {
    score += 1;
  }

  return score;
}

/**
 * Return top N candidate slugs for `source` from `pool`, sorted by score desc.
 * Candidates with score ≤ 0 are excluded.
 *
 * Tie-breaking (same score):
 *   1. Prefer same bodySystem as source — ensures same-system topics at higher
 *      array indices beat cross-system topics at lower indices.
 *   2. Prefer fewer shared tags with already-chosen items (diversity fallback).
 */
function topRelated(
  source: TopicEntry,
  pool: TopicEntry[],
  maxLinks: number,
): string[] {
  const topicBySlug = new Map(pool.map((t) => [t.topicSlug, t]));

  return pool
    .map((c) => ({
      slug: c.topicSlug,
      score: scoreRelatedness(source, c),
      sameSystem:
        c.bodySystem.toLowerCase() === source.bodySystem.toLowerCase() ? 1 : 0,
    }))
    .filter((x) => x.score > 0)
    .sort((a, b) => {
      // Primary: higher score first
      if (b.score !== a.score) return b.score - a.score;
      // Secondary: prefer same body system as source
      if (b.sameSystem !== a.sameSystem) return b.sameSystem - a.sameSystem;
      // Tertiary: stable alphabetical to avoid any remaining insertion-order bias
      return a.slug.localeCompare(b.slug);
    })
    .slice(0, maxLinks)
    .map((x) => x.slug);

  void topicBySlug; // referenced in validator cross-check; keep for future use
}

// ---------------------------------------------------------------------------
// CLI helpers
// ---------------------------------------------------------------------------

function parseArgs() {
  const args = process.argv.slice(2);
  const get = (flag: string) =>
    args.find((a) => a.startsWith(`--${flag}=`))?.split("=").slice(1).join("=");

  const maxLinksRaw = parseInt(get("max-links") ?? "6", 10);
  const maxLinks = Math.min(8, Math.max(5, isNaN(maxLinksRaw) ? 6 : maxLinksRaw));

  return {
    input:
      get("input") ??
      path.resolve(__dirname, "../output/rn-content-batch.json"),
    manifest:
      get("manifest") ??
      path.resolve(__dirname, "../output/rn-topic-manifest.json"),
    output: get("output"),
    maxLinks,
    dryRun: args.includes("--dry-run"),
  };
}

// ---------------------------------------------------------------------------
// Loaders
// ---------------------------------------------------------------------------

async function loadJsonFile<T>(filePath: string): Promise<T | null> {
  try {
    const raw = await fs.readFile(filePath, "utf8");
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  const opts = parseArgs();

  console.log("\n🔗 NurseNest Internal Link Enricher");
  console.log("=====================================");
  console.log(`   Max links per item : ${opts.maxLinks}`);
  console.log(`   Input              : ${opts.input}`);
  console.log(`   Manifest fallback  : ${opts.manifest}`);

  // --- Load topic index from manifest ----------------------------------
  const manifest = await loadJsonFile<TopicManifest>(opts.manifest);
  const manifestTopics: TopicEntry[] = (manifest?.topics ?? []).map((t) => ({
    topicSlug: t.topicSlug,
    topicLabel: t.topicLabel,
    bodySystem: t.bodySystem,
    tags: t.tags,
    category: t.category,
    difficulty: t.difficulty,
    country: t.country,
  }));

  if (manifestTopics.length === 0) {
    console.warn(
      `\n⚠️  Could not load manifest from ${opts.manifest}. Continuing with batch topics only.`,
    );
  } else {
    console.log(`   Manifest topics    : ${manifestTopics.length}`);
  }

  // --- Load batch file (optional) --------------------------------------
  const batch = await loadJsonFile<BatchFile>(opts.input);

  const lessons: RawLesson[] = batch?.lessons ?? [];
  const questions: RawQuestion[] = batch?.questions ?? [];

  // Build a merged topic index: manifest + anything in the batch not already covered
  const allTopicSlugsInManifest = new Set(manifestTopics.map((t) => t.topicSlug));

  const batchLessonTopics: TopicEntry[] = lessons
    .filter((l) => !allTopicSlugsInManifest.has(l.topicSlug))
    .map((l) => ({
      topicSlug: l.topicSlug,
      topicLabel: (l.topic as string) ?? l.topicSlug,
      bodySystem: l.bodySystem,
      tags: (l._meta?.tags as string[]) ?? [],
      category: (l._meta?.category as string) ?? "",
    }));

  const topicIndex: TopicEntry[] = [...manifestTopics, ...batchLessonTopics];

  // Supplement from questions if a topic isn't covered yet
  const allSlugsInIndex = new Set(topicIndex.map((t) => t.topicSlug));
  for (const q of questions) {
    if (!allSlugsInIndex.has(q.topicSlug)) {
      topicIndex.push({
        topicSlug: q.topicSlug,
        topicLabel: (q.topic as string) ?? q.topicSlug,
        bodySystem: q.bodySystem,
        tags: q.tags ?? [],
        category: "",
      });
      allSlugsInIndex.add(q.topicSlug);
    }
  }

  console.log(`   Effective topic index: ${topicIndex.length} topics`);
  console.log(`   Lessons in batch    : ${lessons.length}`);
  console.log(`   Questions in batch  : ${questions.length}`);

  // Build a map: topicSlug → lesson slug(s) (a topic may have one lesson slug)
  const topicSlugToLessonSlug = new Map<string, string>();
  for (const lesson of lessons) {
    topicSlugToLessonSlug.set(lesson.topicSlug, lesson.slug as string);
  }
  // Also map manifest slugs (same slug conversion for anything not yet generated)
  for (const t of manifestTopics) {
    if (!topicSlugToLessonSlug.has(t.topicSlug)) {
      topicSlugToLessonSlug.set(t.topicSlug, t.topicSlug);
    }
  }

  // Build a set: which topicSlugs have questions
  const topicsWithQuestions = new Set(questions.map((q) => q.topicSlug));
  // Add manifest topics (they all have planned questions)
  for (const t of manifestTopics) topicsWithQuestions.add(t.topicSlug);

  // -----------------------------------------------------------------------
  // Enrich lessons
  // -----------------------------------------------------------------------

  let lessonLinksAdded = 0;

  const enrichedLessons: RawLesson[] = lessons.map((lesson) => {
    const sourceEntry: TopicEntry = {
      topicSlug: lesson.topicSlug,
      topicLabel: (lesson.topic as string) ?? lesson.topicSlug,
      bodySystem: lesson.bodySystem,
      tags: (lesson._meta?.tags as string[]) ?? [],
      category: (lesson._meta?.category as string) ?? "",
    };

    const relatedTopicSlugs = topRelated(sourceEntry, topicIndex, opts.maxLinks);

    // suggestedQuestionTopics: among related, those that have questions
    const suggestedQuestionTopics = relatedTopicSlugs
      .filter((slug) => topicsWithQuestions.has(slug))
      .slice(0, opts.maxLinks);

    lessonLinksAdded += relatedTopicSlugs.length + suggestedQuestionTopics.length;

    return {
      ...lesson,
      relatedTopicSlugs,
      suggestedQuestionTopics,
    };
  });

  // If we have only a manifest (no batch lessons), emit manifest-level enrichment
  const manifestEnrichment: Array<{
    topicSlug: string;
    relatedTopicSlugs: string[];
    suggestedQuestionTopics: string[];
  }> = [];

  if (lessons.length === 0 && manifestTopics.length > 0) {
    console.log(
      "\n   No batch lessons found — computing manifest-level enrichment instead.",
    );
    for (const topic of manifestTopics) {
      const related = topRelated(topic, topicIndex, opts.maxLinks);
      const suggested = related
        .filter((slug) => topicsWithQuestions.has(slug))
        .slice(0, opts.maxLinks);
      manifestEnrichment.push({
        topicSlug: topic.topicSlug,
        relatedTopicSlugs: related,
        suggestedQuestionTopics: suggested,
      });
      lessonLinksAdded += related.length + suggested.length;
    }
  }

  // -----------------------------------------------------------------------
  // Enrich questions
  // -----------------------------------------------------------------------

  let questionLinksAdded = 0;

  const enrichedQuestions: RawQuestion[] = questions.map((question) => {
    const sourceEntry: TopicEntry = {
      topicSlug: question.topicSlug,
      topicLabel: (question.topic as string) ?? question.topicSlug,
      bodySystem: question.bodySystem,
      tags: question.tags ?? [],
      category: "",
    };

    const relatedLessonSlugs = topRelated(sourceEntry, topicIndex, opts.maxLinks)
      .map((slug) => topicSlugToLessonSlug.get(slug) ?? slug)
      .slice(0, opts.maxLinks);

    questionLinksAdded += relatedLessonSlugs.length;

    return {
      ...question,
      relatedLessonSlugs,
    };
  });

  // -----------------------------------------------------------------------
  // Summary
  // -----------------------------------------------------------------------

  console.log("\n📊 Enrichment summary:");
  console.log(
    `   Lessons enriched    : ${enrichedLessons.length} (+${lessonLinksAdded} link slots)`,
  );
  if (manifestEnrichment.length > 0) {
    console.log(
      `   Manifest entries    : ${manifestEnrichment.length} (no batch lessons yet)`,
    );
  }
  console.log(
    `   Questions enriched  : ${enrichedQuestions.length} (+${questionLinksAdded} link slots)`,
  );

  if (opts.dryRun) {
    console.log("\n✅ Dry run — no files written.");

    // Print a sample
    const sampleLesson = enrichedLessons[0] ?? manifestEnrichment[0];
    if (sampleLesson) {
      console.log("\n📋 Sample lesson entry:");
      console.log(
        JSON.stringify(
          {
            topicSlug: (sampleLesson as { topicSlug: string }).topicSlug,
            relatedTopicSlugs: (sampleLesson as { relatedTopicSlugs?: string[] })
              .relatedTopicSlugs,
            suggestedQuestionTopics: (
              sampleLesson as { suggestedQuestionTopics?: string[] }
            ).suggestedQuestionTopics,
          },
          null,
          2,
        ),
      );
    }

    const sampleQ = enrichedQuestions[0];
    if (sampleQ) {
      console.log("\n📋 Sample question entry:");
      console.log(
        JSON.stringify(
          {
            topicSlug: sampleQ.topicSlug,
            relatedLessonSlugs: (sampleQ as { relatedLessonSlugs?: string[] })
              .relatedLessonSlugs,
          },
          null,
          2,
        ),
      );
    }
    return;
  }

  // -----------------------------------------------------------------------
  // Write output
  // -----------------------------------------------------------------------

  const outputPath =
    opts.output ??
    (batch
      ? opts.input.replace(/\.json$/, "-linked.json")
      : path.resolve(__dirname, "../output/rn-topic-links.json"));

  await fs.mkdir(path.dirname(outputPath), { recursive: true });

  if (batch) {
    // Preserve the full checkpoint shape plus enriched lessons/questions
    const out: BatchFile & {
      _linksEnrichedAt: string;
      _linksMeta: { maxLinks: number; algorithm: string };
    } = {
      ...batch,
      lessons: enrichedLessons,
      questions: enrichedQuestions,
      _linksEnrichedAt: new Date().toISOString(),
      _linksMeta: {
        maxLinks: opts.maxLinks,
        algorithm: "bodySystem(+3) + sharedTags(+2ea) + sameCategory(+1)",
      },
    };
    await fs.writeFile(outputPath, JSON.stringify(out, null, 2), "utf8");
  } else {
    // Manifest-only mode: write a link overlay file
    const out = {
      _meta: {
        description: "Internal link metadata overlay for the RN topic manifest",
        generatedAt: new Date().toISOString(),
        maxLinks: opts.maxLinks,
        algorithm: "bodySystem(+3) + sharedTags(+2ea) + sameCategory(+1)",
        totalTopics: manifestEnrichment.length,
      },
      topicLinks: manifestEnrichment,
    };
    await fs.writeFile(outputPath, JSON.stringify(out, null, 2), "utf8");
  }

  console.log(`\n✅ Output written to: ${outputPath}`);
}

main().catch((e) => {
  console.error("\n💥 Fatal error:", e);
  process.exit(1);
});
