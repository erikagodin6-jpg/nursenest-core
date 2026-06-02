#!/usr/bin/env node
/**
 * Safe long-tail blog campaign generator (draft-only, dry-run by default).
 * Outputs JSON to stdout; does not write to Prisma unless explicitly extended.
 */
const topics = [
  "pharmacology",
  "pathophysiology",
  "allied health test practice",
  "MLT test prep",
  "paramedic test prep",
  "pharmacy technician test prep",
  "respiratory therapy test prep",
  "imaging/radiology test prep",
  "OTA/PTA test prep",
  "social work exam prep",
  "psychotherapy/mental health exam prep",
  "PSW test prep",
];

const dryRun = !process.argv.includes("--write");
const batch = Math.min(
  50,
  Math.max(1, Number.parseInt(String(process.env.NN_LONGTAIL_BATCH ?? "5"), 10) || 5),
);

const drafts = topics.slice(0, batch).map((keyword, i) => ({
  reviewStatus: "needs_human_review",
  aiGenerated: true,
  targetKeyword: keyword,
  title: `Study guide: ${keyword} (draft)`,
  slug: `study-guide-${keyword.replace(/[^a-z0-9]+/gi, "-").replace(/^-|-$/g, "").toLowerCase()}-${i}`,
  metaTitle: `${keyword} — NurseNest draft`,
  metaDescription: `Draft long-tail SEO article for ${keyword}. Not published.`,
  pathwayTags: [],
  careerTags: [],
  internalLinks: ["/us/rn/nclex-rn/lessons", "/question-bank"],
  faqSection: [],
  canonicalRoutePreview: `/blog/study-guide-${keyword.replace(/\W+/g, "-").toLowerCase()}`,
}));

console.log(
  JSON.stringify(
    {
      dryRun,
      batchSize: drafts.length,
      drafts,
      note: dryRun
        ? "Dry run only. Pass --write only after wiring canonical BlogPost persistence."
        : "Write mode requested but persistence is not enabled in this script version.",
    },
    null,
    2,
  ),
);
