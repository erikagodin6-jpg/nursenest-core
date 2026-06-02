/**
 * Bulk-create SCHEDULED BlogPost rows from the master topic map (RN track).
 * Creates editorial shells with SEO + linking fields — replace body in CMS before go-live.
 *
 *   node scripts/blog-bulk-schedule.mjs --dry-run
 *   node scripts/blog-bulk-schedule.mjs --apply --limit=30
 */
import fs from "node:fs";
import path from "node:path";

const root = path.join(import.meta.dirname, "..");
const mapPath = path.join(root, "src/content/topic-maps/master-topic-map.json");

function addDays(d, n) {
  const x = new Date(d);
  x.setUTCDate(x.getUTCDate() + n);
  return x;
}

function slugify(s) {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function parseLimit() {
  const raw = process.argv.find((a) => a.startsWith("--limit="));
  if (!raw) return 500;
  const n = Number.parseInt(raw.split("=")[1], 10);
  return Number.isFinite(n) && n > 0 ? n : 500;
}

async function main() {
  const apply = process.argv.includes("--apply");
  const dry = !apply;
  const limit = parseLimit();

  const map = JSON.parse(fs.readFileSync(mapPath, "utf8"));
  const rn = map.exams?.RN;
  if (!rn) throw new Error("master-topic-map.json missing exams.RN");

  const postsPerWeek = 3;
  const intervalDays = Math.max(1, Math.round(7 / postsPerWeek));
  const start = addDays(new Date(), 1);
  start.setUTCHours(14, 0, 0, 0);

  const templates = ["HOW_TO_PASS", "TOPIC_EXPLAINED", "TOP_MISTAKES", "PRACTICE_QUESTIONS", "STUDY_PLAN"];
  const rows = [];
  let dayCursor = 0;
  let tIdx = 0;

  outer: for (const cat of rn.categories) {
    for (const topic of cat.topics) {
      if (rows.length >= limit) break outer;
      const tmpl = templates[tIdx % templates.length];
      tIdx += 1;
      const slug = `rn-${topic.id}-${slugify(tmpl)}`.slice(0, 120);
      const title =
        tmpl === "HOW_TO_PASS"
          ? `How to pass NCLEX-RN: ${topic.name}`
          : tmpl === "TOPIC_EXPLAINED"
            ? `${topic.name} for NCLEX-RN (exam-style)`
            : tmpl === "TOP_MISTAKES"
              ? `Top mistakes: ${topic.name} on NCLEX-RN`
              : tmpl === "PRACTICE_QUESTIONS"
                ? `Practice focus: ${topic.name} (NCLEX-RN)`
                : `Study plan slice: ${topic.name} (NCLEX-RN)`;

      const publishAt = addDays(start, dayCursor);
      dayCursor += intervalDays;

      const lessonPath = `/us/rn/nclex-rn/lessons/${topic.id}`;
      rows.push({
        slug,
        title,
        excerpt: `High-yield ${cat.name} topic: ${topic.name}. Links to lessons and practice — replace with final copy in admin.`,
        body: `<p><strong>Scheduled shell.</strong> Replace with structured HTML (H2 sections, traps, prioritization). Do not paste full bank rationales here.</p><h2>What to do first</h2><p>Outline clinical judgment hooks for ${topic.name}.</p>`,
        category: cat.name,
        tags: [slugify(cat.name), slugify(topic.name), "NCLEX-RN", topic.priority === "high_yield" ? "high-yield" : "secondary"],
        postStatus: "SCHEDULED",
        publishAt,
        exam: "RN",
        seoTitle: `${title} | NurseNest`,
        seoDescription: `Exam-focused ${topic.name}: prioritization, traps, and practice links for NCLEX-RN candidates.`,
        postTemplate: tmpl,
        relatedLessonPaths: [lessonPath],
        relatedQuestionIds: [],
        relatedTools: ["labs-reference"],
      });
    }
  }

  console.log(`Prepared ${rows.length} scheduled posts (limit ${limit}, ${dry ? "dry-run" : "apply"}).`);
  if (dry) {
    console.log("Sample:", rows.slice(0, 2));
    return;
  }

  const dotenv = await import("dotenv");
  dotenv.config({ path: path.join(root, ".env") });
  const { PrismaClient } = await import("@prisma/client");
  const prisma = new PrismaClient();
  let created = 0;
  for (const r of rows) {
    try {
      await prisma.blogPost.create({
        data: {
          slug: r.slug,
          title: r.title,
          excerpt: r.excerpt,
          body: r.body,
          category: r.category,
          tags: r.tags,
          postStatus: r.postStatus,
          publishAt: r.publishAt,
          exam: r.exam,
          seoTitle: r.seoTitle,
          seoDescription: r.seoDescription,
          postTemplate: r.postTemplate,
          relatedLessonPaths: r.relatedLessonPaths,
          relatedQuestionIds: r.relatedQuestionIds,
          relatedTools: r.relatedTools,
        },
      });
      created += 1;
    } catch (e) {
      if (String(e).includes("Unique constraint")) {
        console.warn("Skip duplicate slug:", r.slug);
      } else {
        throw e;
      }
    }
  }
  await prisma.$disconnect();
  console.log("Created:", created);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
