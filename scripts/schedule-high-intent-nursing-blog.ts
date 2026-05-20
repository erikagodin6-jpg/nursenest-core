#!/usr/bin/env npx tsx
/**
 * High-intent nursing query scheduler (idempotent).
 *
 * Goals:
 * - Schedule provided high-intent query set at 4 posts/day (default).
 * - Keep replay safe: only schedule topics not already present in batch items/posts.
 * - Optional immediate first batch generation for "live now" launch.
 *
 * Usage:
 *   npx tsx scripts/schedule-high-intent-nursing-blog.ts --dry-run
 *   npx tsx scripts/schedule-high-intent-nursing-blog.ts --apply
 *   npx tsx scripts/schedule-high-intent-nursing-blog.ts --apply --generate-due
 */
import "../src/lib/db/env-bootstrap";
import {
  BlogBatchPublishMode,
  BlogBatchScheduleStatus,
  BlogPostIntent,
  BlogPostTemplate,
} from "@prisma/client";
import { prisma } from "@/lib/db";
import { normalizeBlogTopicKey } from "@/lib/blog/blog-intent-dedupe";

const RAW_QUERIES = [
  // Pathophysiology WHY
  "Why do burns cause hyperkalemia",
  "Why does sepsis cause hypotension",
  "Why does DKA cause Kussmaul respirations",
  "Why does heart failure cause edema",
  "Why does liver failure cause ascites",
  "Why does kidney failure cause anemia",
  "Why does COPD cause barrel chest",
  "Why does hypocalcemia cause tetany",
  "Why does hyperkalemia cause arrhythmias",
  "Why does anemia cause fatigue",
  "Why does shock cause lactic acidosis",
  "Why does pneumonia cause hypoxia",
  "Why does pulmonary embolism cause chest pain",
  "Why does diabetes cause polyuria",
  "Why does SIADH cause hyponatremia",
  "Why does DI cause hypernatremia",
  "Why does Addison’s cause hyperkalemia",
  "Why does Cushing’s cause hyperglycemia",
  "Why does pancreatitis cause hypocalcemia",
  "Why does hypothyroidism cause weight gain",

  // Medication WHY/HOW
  "Why is potassium never given IV push",
  "Why do ACE inhibitors cause cough",
  "Why do beta blockers cause bradycardia",
  "Why do diuretics cause electrolyte imbalance",
  "Why is insulin given with potassium in DKA",
  "Why do opioids cause respiratory depression",
  "Why do steroids cause hyperglycemia",
  "Why do anticoagulants increase bleeding risk",
  "Why do antibiotics cause diarrhea",
  "Why do calcium channel blockers cause edema",
  "Why is warfarin monitored with INR",
  "Why is heparin monitored with aPTT",
  "Why do NSAIDs cause GI bleeding",
  "Why does digoxin toxicity cause vision changes",
  "Why do SSRIs take weeks to work",
  "Why do benzodiazepines cause sedation",
  "Why is metformin held before contrast",
  "Why do statins cause muscle pain",
  "Why is vancomycin given slowly",
  "Why do diuretics lower potassium",

  // Comparison
  "SIADH vs diabetes insipidus",
  "DKA vs HHS",
  "COPD vs asthma",
  "Hyperkalemia vs hypokalemia",
  "Hyponatremia vs hypernatremia",
  "Addison’s vs Cushing’s",
  "Crohn’s vs ulcerative colitis",
  "Angina vs myocardial infarction",
  "Pneumonia vs tuberculosis",
  "Stroke vs TIA",
  "Iron deficiency vs B12 anemia",
  "Left vs right sided heart failure",
  "Metabolic vs respiratory acidosis",
  "Septic vs hypovolemic shock",
  "Atelectasis vs pneumonia",

  // Labs & interpretation
  "How to interpret ABGs nursing",
  "Normal lab values nursing students need",
  "How to remember potassium levels",
  "What does high creatinine mean",
  "What does low sodium mean",
  "What does high potassium mean",
  "What does low hemoglobin mean",
  "What labs indicate sepsis",
  "What labs indicate kidney failure",
  "How to read CBC nursing",
  "What does elevated troponin mean",
  "What does BNP indicate",
  "What labs indicate DKA",
  "What labs indicate liver failure",
  "What labs indicate dehydration",

  // NCLEX / strategy
  "How to pass NCLEX in 30 days",
  "Best NCLEX study plan",
  "How many questions are on NCLEX RN",
  "How CAT works NCLEX",
  "NCLEX prioritization strategies",
  "How to answer SATA questions NCLEX",
  "NCLEX test taking strategies",
  "How to improve NCLEX scores",
  "What is a good NCLEX readiness score",
  "How to study for pharmacology nursing",
  "How to memorize lab values fast",
  "Best way to study nursing school",
  "How to pass nursing exams",
  "How to improve critical thinking nursing",
  "How to avoid NCLEX mistakes",

  // Nursing interventions / reasoning
  "What to do for hyperkalemia nursing",
  "What to do for hypokalemia nursing",
  "Nursing interventions for sepsis",
  "Nursing care for heart failure",
  "Nursing care for stroke patients",
  "Nursing priorities for DKA",
  "Nursing interventions for shock",
  "What to monitor after giving insulin",
  "What to monitor with diuretics",
  "What to monitor with digoxin",
  "What to monitor with heparin",
  "Nursing interventions for pneumonia",
  "Nursing care for COPD",
  "What are priority nursing assessments",
  "How to identify patient deterioration",
] as const;

function parseArgs() {
  const dryRun = process.argv.includes("--dry-run");
  const apply = process.argv.includes("--apply");
  const get = (name: string): string | undefined => {
    const pref = `--${name}=`;
    const hit = process.argv.find((a) => a.startsWith(pref));
    return hit ? hit.slice(pref.length) : undefined;
  };
  const cadencePerDay = Math.max(1, Math.min(12, parseInt(get("cadence-per-day") ?? "4", 10) || 4));
  const immediateFirstBatch = Math.max(0, Math.min(24, parseInt(get("immediate-first-batch") ?? "4", 10) || 4));
  const exam = get("exam") ?? "NCLEX-RN";
  const country = (get("country")?.toUpperCase() === "CA" ? "CA" : "US") as "US" | "CA";
  return {
    dryRun: dryRun || !apply,
    apply,
    cadencePerDay,
    immediateFirstBatch,
    exam,
    country,
  };
}

function uniqueQueries(raw: readonly string[]): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const q of raw) {
    const text = q.trim();
    if (text.length < 3) continue;
    const key = normalizeBlogTopicKey(text);
    if (!key || seen.has(key)) continue;
    seen.add(key);
    out.push(text);
  }
  return out;
}

async function existingCanonicalTopicKeys(): Promise<Set<string>> {
  const keys = new Set<string>();
  const scheduled = await prisma.blogBatchScheduleItem.findMany({
    where: { canonicalTopicKey: { not: null } },
    select: { canonicalTopicKey: true },
  });
  for (const row of scheduled) {
    if (row.canonicalTopicKey) keys.add(row.canonicalTopicKey);
  }
  const posts = await prisma.blogPost.findMany({
    select: { title: true, targetKeyword: true },
  });
  for (const row of posts) {
    const t1 = normalizeBlogTopicKey(row.title);
    const t2 = normalizeBlogTopicKey(row.targetKeyword ?? "");
    if (t1) keys.add(t1);
    if (t2) keys.add(t2);
  }
  return keys;
}

function computePlannedAt(startAt: Date, index: number, immediateCount: number, cadencePerDay: number): Date {
  if (index < immediateCount) return new Date(startAt);
  const effectiveIndex = index - immediateCount;
  const ms = (24 * 60 * 60 * 1000) / cadencePerDay;
  return new Date(startAt.getTime() + effectiveIndex * ms);
}

async function main() {
  const args = parseArgs();
  const now = new Date();
  const sourceQueries = uniqueQueries(RAW_QUERIES);
  const existingKeys = await existingCanonicalTopicKeys();

  const pending = sourceQueries
    .map((topic) => ({ topic, key: normalizeBlogTopicKey(topic) }))
    .filter((row): row is { topic: string; key: string } => Boolean(row.key))
    .filter((row) => !existingKeys.has(row.key));

  const preview = pending.slice(0, 12).map((row, i) => ({
    topic: row.topic,
    plannedPublishAt: computePlannedAt(now, i, args.immediateFirstBatch, args.cadencePerDay).toISOString(),
  }));

  if (args.dryRun) {
    console.log(
      JSON.stringify(
        {
          dryRun: true,
          totalInputQueries: sourceQueries.length,
          alreadyScheduledOrPublished: sourceQueries.length - pending.length,
          toSchedule: pending.length,
          cadencePerDay: args.cadencePerDay,
          immediateFirstBatch: args.immediateFirstBatch,
          exam: args.exam,
          country: args.country,
          preview,
        },
        null,
        2,
      ),
    );
    return;
  }

  if (pending.length === 0) {
    console.log(
      JSON.stringify(
        {
          ok: true,
          createdSchedule: false,
          reason: "all_topics_already_scheduled_or_published",
          totalInputQueries: sourceQueries.length,
        },
        null,
        2,
      ),
    );
    return;
  }

  const schedule = await prisma.blogBatchSchedule.create({
    data: {
      status: BlogBatchScheduleStatus.ACTIVE,
      publishMode: BlogBatchPublishMode.STAGGERED_PUBLISH,
      cadencePerDay: args.cadencePerDay,
      startAt: now,
      nextRunAt: computePlannedAt(now, 0, args.immediateFirstBatch, args.cadencePerDay),
      totalItems: pending.length,
      exam: args.exam,
      country: args.country,
      defaultTemplate: BlogPostTemplate.TOPIC_EXPLAINED,
      defaultIntent: BlogPostIntent.EXAM_PREP,
      localizationOptions: undefined,
    },
  });

  await prisma.blogBatchScheduleItem.createMany({
    data: pending.map((row, i) => ({
      scheduleId: schedule.id,
      ordinal: i + 1,
      topicRaw: row.topic,
      canonicalTopicKey: row.key,
      plannedPublishAt: computePlannedAt(now, i, args.immediateFirstBatch, args.cadencePerDay),
    })),
  });

  const items = await prisma.blogBatchScheduleItem.findMany({
    where: { scheduleId: schedule.id },
    orderBy: { ordinal: "asc" },
    select: {
      ordinal: true,
      topicRaw: true,
      plannedPublishAt: true,
      status: true,
      blogPost: { select: { slug: true } },
    },
  });

  const publishedSlugs = items
    .filter((i) => i.blogPost?.slug)
    .map((i) => i.blogPost!.slug);

  console.log(
    JSON.stringify(
      {
        ok: true,
        createdSchedule: true,
        scheduleId: schedule.id,
        totalInputQueries: sourceQueries.length,
        scheduledNow: pending.length,
        cadencePerDay: args.cadencePerDay,
        immediateFirstBatch: args.immediateFirstBatch,
        exam: args.exam,
        country: args.country,
        firstPlannedAt: items[0]?.plannedPublishAt?.toISOString() ?? null,
        lastPlannedAt: items[items.length - 1]?.plannedPublishAt?.toISOString() ?? null,
        generationMode: "schedule_only (use /api/cron/blog-batch-schedule or admin runner to generate)",
        slugsGeneratedNow: publishedSlugs,
        access: {
          canonicalBlogIndex: "/blog",
          postPaths: publishedSlugs.map((slug) => `/blog/${slug}`),
          scheduleAdmin: "/admin/blog/topic-batch",
        },
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
  .finally(async () => {
    await prisma.$disconnect();
  });
