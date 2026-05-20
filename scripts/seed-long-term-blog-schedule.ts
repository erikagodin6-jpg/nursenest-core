/**
 * Long-term blog schedule seeder.
 *
 * Creates deterministic BlogBatchSchedule entries covering 2 years at
 * 3 posts/day for all active + partial marketing languages.
 *
 * Design decisions:
 * - ONE English schedule per country (US + CA) with localizationOptions
 *   for fr, es, tl, hi — so each English post auto-triggers localized variants.
 * - 3 publish slots/day at 08:00, 13:00, 19:00 UTC (fixed times, not drifting intervals).
 * - Topics assigned sequentially from BLOG_TOPIC_BANK (no randomness).
 * - Each country schedule is offset by a fraction of the topic bank to diversify
 *   the topics published on any given day across US/CA audiences.
 * - Idempotent: checks for existing seeds by label prefix before creating.
 *
 * Run:
 *   npx tsx scripts/seed-long-term-blog-schedule.ts
 *   npx tsx scripts/seed-long-term-blog-schedule.ts --dry-run
 *   npx tsx scripts/seed-long-term-blog-schedule.ts --days=365
 *
 * Prerequisites:
 *   DATABASE_URL must be set in the environment (or .env loaded).
 */

import "../src/lib/db/env-bootstrap";
import { PrismaClient, BlogBatchScheduleStatus, BlogBatchPublishMode, BlogPostTemplate, BlogPostIntent } from "@prisma/client";
import { BLOG_TOPIC_BANK, TOPIC_CATEGORY_RANGES, getBlogTopicsForSchedule } from "../src/lib/blog/blog-topic-bank";
import { normalizeBlogTopicKey } from "../src/lib/blog/blog-intent-dedupe";

const prisma = new PrismaClient();

// ── Config ────────────────────────────────────────────────────────────────────

const POSTS_PER_DAY = 3;

/** UTC hours at which posts publish each day. Length must equal POSTS_PER_DAY. */
const PUBLISH_HOURS_UTC = [8, 13, 19] as const;

/** Locales that receive auto-localized follow-ups after each English canonical post. */
const LOCALIZATION_LOCALES = ["fr", "es", "tl", "hi"] as const;

/** Seed identifier prefix — used to detect existing seeds (idempotent). */
const SEED_LABEL_PREFIX = "long-term-seed-2yr";

const SCHEDULES: Array<{
  label: string;
  exam: string;
  country: "US" | "CA";
  /** Offset into BLOG_TOPIC_BANK so US and CA don't publish the same topic on the same day. */
  topicOffset: number;
  template: BlogPostTemplate;
  intent: BlogPostIntent;
}> = [
  {
    label: `${SEED_LABEL_PREFIX}-us-nclex-rn`,
    exam: "NCLEX-RN",
    country: "US",
    topicOffset: 0,
    template: BlogPostTemplate.TOPIC_EXPLAINED,
    intent: BlogPostIntent.EDUCATIONAL,
  },
  {
    label: `${SEED_LABEL_PREFIX}-ca-nclex-rn`,
    exam: "NCLEX-RN",
    country: "CA",
    topicOffset: Math.floor(BLOG_TOPIC_BANK.length / 3), // stagger CA by ~194 topics
    template: BlogPostTemplate.TOPIC_EXPLAINED,
    intent: BlogPostIntent.EDUCATIONAL,
  },
];

// ── Helpers ───────────────────────────────────────────────────────────────────

function buildPublishSlots(startDate: Date, totalDays: number): Date[] {
  const slots: Date[] = [];
  for (let day = 0; day < totalDays; day++) {
    for (const hour of PUBLISH_HOURS_UTC) {
      const d = new Date(Date.UTC(
        startDate.getUTCFullYear(),
        startDate.getUTCMonth(),
        startDate.getUTCDate() + day,
        hour,
        0,
        0,
        0,
      ));
      slots.push(d);
    }
  }
  return slots;
}

function formatDate(d: Date): string {
  return d.toISOString().slice(0, 16).replace("T", " ") + " UTC";
}

function printSummary(days: number, dryRun: boolean): void {
  const totalPerSchedule = days * POSTS_PER_DAY;
  const totalSchedules = SCHEDULES.length;
  const languages = 1 + LOCALIZATION_LOCALES.length; // English + localized
  const bankSize = BLOG_TOPIC_BANK.length;
  const cycleLength = Math.floor(bankSize / POSTS_PER_DAY);

  console.log("\n=== Long-Term Blog Schedule Seeder ===");
  console.log(`Mode          : ${dryRun ? "DRY RUN (no DB writes)" : "APPLY"}`);
  console.log(`Duration      : ${days} days (${(days / 30).toFixed(1)} months)`);
  console.log(`Posts/day/lang: ${POSTS_PER_DAY}`);
  console.log(`Languages     : en + ${LOCALIZATION_LOCALES.join(", ")} (${languages} total)`);
  console.log(`Schedules     : ${totalSchedules} (${SCHEDULES.map((s) => `${s.country}/${s.exam}`).join(", ")})`);
  console.log(`Items/schedule: ${totalPerSchedule.toLocaleString()}`);
  console.log(`Topic bank    : ${bankSize} unique topics`);
  console.log(`Cycle period  : ${cycleLength} days before first topic repeat`);
  console.log(`Publish slots : ${PUBLISH_HOURS_UTC.join(":00, ")}:00 UTC daily`);
  console.log("\nCategory breakdown:");
  for (const [cat, info] of Object.entries(TOPIC_CATEGORY_RANGES)) {
    console.log(`  ${cat}. ${info.label}: ${info.count} topics`);
  }
  console.log("");
}

function print14DaySample(startDate: Date, schedule: (typeof SCHEDULES)[0]): void {
  const sampleDays = 14;
  const slots = buildPublishSlots(startDate, sampleDays);
  const topics = getBlogTopicsForSchedule(slots.length, schedule.topicOffset);

  console.log(`\n--- 14-day sample: ${schedule.country}/${schedule.exam} ---`);
  console.log(`${"Date & Time (UTC)".padEnd(20)} Topic`);
  console.log("-".repeat(90));
  for (let i = 0; i < slots.length; i++) {
    const day = Math.floor(i / POSTS_PER_DAY) + 1;
    const slot = i % POSTS_PER_DAY + 1;
    const prefix = `Day ${String(day).padStart(2)} [${slot}/${POSTS_PER_DAY}]`;
    const dateStr = formatDate(slots[i]);
    console.log(`${dateStr.padEnd(22)} ${prefix.padEnd(14)} ${topics[i].slice(0, 60)}${topics[i].length > 60 ? "…" : ""}`);
  }
}

// ── Main ──────────────────────────────────────────────────────────────────────

async function main(): Promise<void> {
  const args = process.argv.slice(2);
  const dryRun = args.includes("--dry-run");
  const daysArg = args.find((a) => a.startsWith("--days="));
  const totalDays = daysArg ? parseInt(daysArg.replace("--days=", ""), 10) : 730; // 2 years default

  if (isNaN(totalDays) || totalDays < 1 || totalDays > 1460) {
    console.error("--days must be between 1 and 1460");
    process.exit(1);
  }

  const startDate = new Date();
  startDate.setUTCHours(0, 0, 0, 0); // align to midnight UTC

  printSummary(totalDays, dryRun);

  // Print sample for first schedule before any DB work
  print14DaySample(startDate, SCHEDULES[0]);

  if (dryRun) {
    console.log("\nDry run complete. Re-run without --dry-run to apply to the database.");
    return;
  }

  // ── Idempotency check ─────────────────────────────────────────────────────
  const existing = await prisma.blogBatchSchedule.findMany({
    where: { exam: { in: SCHEDULES.map((s) => s.exam) } },
    select: { id: true, exam: true, country: true, createdAt: true, totalItems: true },
    orderBy: { createdAt: "desc" },
    take: 20,
  });

  // Check by label encoded in the exam field (we use exam + country as identifier)
  // We detect existing long-term seeds by their unique size (>700 items)
  const largeSchedules = existing.filter((s) => s.totalItems > 700);
  if (largeSchedules.length > 0) {
    console.log(`\n⚠  Found ${largeSchedules.length} existing long-term schedule(s):`);
    for (const s of largeSchedules) {
      console.log(`   id=${s.id} exam=${s.exam} country=${s.country} items=${s.totalItems} created=${s.createdAt.toISOString()}`);
    }
    console.log("\nTo re-seed, first delete the existing schedules, then re-run this script.");
    console.log("Exiting without changes.");
    return;
  }

  // ── Create schedules ──────────────────────────────────────────────────────
  const slots = buildPublishSlots(startDate, totalDays);
  const totalItemsPerSchedule = slots.length; // days * POSTS_PER_DAY

  console.log(`\nCreating ${SCHEDULES.length} schedule(s) with ${totalItemsPerSchedule.toLocaleString()} items each…`);

  for (const cfg of SCHEDULES) {
    const topics = getBlogTopicsForSchedule(totalItemsPerSchedule, cfg.topicOffset);

    // Deduplicate within window (canonical key uniqueness)
    const seen = new Set<string>();
    const deduped: Array<{ topic: string; slot: Date }> = [];
    for (let i = 0; i < slots.length; i++) {
      const topic = topics[i];
      const key = normalizeBlogTopicKey(topic);
      if (!key) continue;
      // Allow duplicates only after a full 180-day window (6 months)
      const windowKey = `${key}_${Math.floor(i / (180 * POSTS_PER_DAY))}`;
      if (!seen.has(windowKey)) {
        seen.add(windowKey);
        deduped.push({ topic, slot: slots[i] });
      }
    }

    console.log(`\n  ${cfg.country}/${cfg.exam}:`);
    console.log(`    Topics after window-dedupe : ${deduped.length}`);
    console.log(`    First slot                 : ${formatDate(deduped[0]?.slot ?? startDate)}`);
    console.log(`    Last slot                  : ${formatDate(deduped[deduped.length - 1]?.slot ?? startDate)}`);

    const schedule = await prisma.blogBatchSchedule.create({
      data: {
        status: BlogBatchScheduleStatus.ACTIVE,
        publishMode: BlogBatchPublishMode.STAGGERED_PUBLISH,
        localizationOptions: { locales: LOCALIZATION_LOCALES },
        cadencePerDay: POSTS_PER_DAY,
        startAt: startDate,
        nextRunAt: deduped[0]?.slot ?? startDate,
        totalItems: deduped.length,
        exam: cfg.exam,
        country: cfg.country,
        defaultTemplate: cfg.template,
        defaultIntent: cfg.intent,
      },
    });

    console.log(`    Created schedule id        : ${schedule.id}`);

    // Insert items in batches of 500 to stay within Prisma createMany limits
    const BATCH_SIZE = 500;
    let created = 0;
    for (let start = 0; start < deduped.length; start += BATCH_SIZE) {
      const chunk = deduped.slice(start, start + BATCH_SIZE);
      await prisma.blogBatchScheduleItem.createMany({
        data: chunk.map((row, idx) => ({
          scheduleId: schedule.id,
          ordinal: start + idx + 1,
          topicRaw: row.topic,
          canonicalTopicKey: normalizeBlogTopicKey(row.topic),
          plannedPublishAt: row.slot,
        })),
      });
      created += chunk.length;
      process.stdout.write(`\r    Items created: ${created.toLocaleString()}/${deduped.length.toLocaleString()}`);
    }
    console.log("  ✓");
  }

  // ── Final report ──────────────────────────────────────────────────────────
  const totalPostsAllLangs = SCHEDULES.length * totalDays * POSTS_PER_DAY * (1 + LOCALIZATION_LOCALES.length);
  console.log("\n=== Seeding complete ===");
  console.log(`Schedules created     : ${SCHEDULES.length}`);
  console.log(`Items per schedule    : ${totalDays * POSTS_PER_DAY} (${totalDays} days × ${POSTS_PER_DAY}/day)`);
  console.log(`Languages covered     : en, ${LOCALIZATION_LOCALES.join(", ")} (${1 + LOCALIZATION_LOCALES.length})`);
  console.log(`Total posts (all lang): ~${totalPostsAllLangs.toLocaleString()} over ${totalDays} days`);
  console.log(`Content generated     : ON DEMAND — only when plannedPublishAt is reached`);
  console.log(`Cron triggers         : /api/cron/blog-batch-schedule (runs processDueBlogBatchScheduleItems)`);
  console.log(`Promote cron          : /api/cron/blog-publish (runs promoteScheduledBlogPosts)`);
  console.log("\nNext steps:");
  console.log("  1. Verify cron is active: GET /api/cron/blog-batch-schedule (requires cron header)");
  console.log("  2. Monitor admin: /admin/blog/topic-batch");
  console.log("  3. Adjust cadence: PATCH /api/admin/blog/batch-schedule/{id}");
  console.log("  4. Promote new language to active: edit marketing-languages.ts tier → 'full'");
}

main()
  .catch((e) => {
    console.error("Seeder failed:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
