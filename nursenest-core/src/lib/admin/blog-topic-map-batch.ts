/**
 * Expand RN topics from master-topic-map.json for scheduled blog shells (same source as scripts/blog-bulk-schedule.mjs).
 * Server-only — reads from repo at runtime.
 */
import fs from "node:fs";
import path from "node:path";
import { BlogPostTemplate } from "@prisma/client";

export type TopicMapBatchRow = {
  slug: string;
  title: string;
  excerpt: string;
  body: string;
  category: string;
  tags: string[];
  exam: string;
  postTemplate: BlogPostTemplate;
  relatedLessonPath: string;
};

const TEMPLATES_ROTATE: BlogPostTemplate[] = [
  BlogPostTemplate.HOW_TO_PASS,
  BlogPostTemplate.TOPIC_EXPLAINED,
  BlogPostTemplate.TOP_MISTAKES,
  BlogPostTemplate.PRACTICE_QUESTIONS,
  BlogPostTemplate.STUDY_PLAN,
];

function slugify(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function mapPath(): string {
  return path.join(process.cwd(), "src/content/topic-maps/master-topic-map.json");
}

export function loadRnTopicMapBatchRows(limit: number): TopicMapBatchRow[] {
  const p = mapPath();
  if (!fs.existsSync(p)) return [];
  const raw = JSON.parse(fs.readFileSync(p, "utf8")) as {
    exams?: { RN?: { categories?: Array<{ name: string; topics: Array<{ id: string; name: string; priority?: string }> }> } };
  };
  const rn = raw.exams?.RN;
  if (!rn?.categories) return [];

  const rows: TopicMapBatchRow[] = [];
  let tIdx = 0;
  outer: for (const cat of rn.categories) {
    for (const topic of cat.topics) {
      if (rows.length >= limit) break outer;
      const tmpl = TEMPLATES_ROTATE[tIdx % TEMPLATES_ROTATE.length]!;
      tIdx += 1;
      const slug = `rn-${topic.id}-${slugify(tmpl)}`.slice(0, 120);
      const title =
        tmpl === BlogPostTemplate.HOW_TO_PASS
          ? `NCLEX questions for ${topic.name} (${cat.name} high-yield)`
          : tmpl === BlogPostTemplate.TOPIC_EXPLAINED
            ? `Priority nursing interventions for ${topic.name} on NCLEX-RN (${cat.name})`
            : tmpl === BlogPostTemplate.TOP_MISTAKES
              ? `${topic.name} vs common NCLEX traps (${cat.name})`
              : tmpl === BlogPostTemplate.PRACTICE_QUESTIONS
                ? `NCLEX-style practice stems for ${topic.name} (${cat.name})`
                : `What should the nurse do first in ${topic.name} scenarios? (NCLEX-RN · ${cat.name})`;

      const excerpt = `High-yield ${cat.name} topic: ${topic.name}. Links to lessons and practice. Replace with final copy in admin.`;
      const body = `<p><strong>Scheduled shell.</strong> Replace with structured HTML (H2 sections, traps, prioritization). Do not paste full bank rationales here.</p><h2>What to do first</h2><p>Outline clinical judgment hooks for ${topic.name}.</p>`;
      rows.push({
          slug,
          title,
          excerpt,
          body,
          category: cat.name,
          tags: [
            slugify(cat.name),
            slugify(topic.name),
            "NCLEX-RN",
            topic.priority === "high_yield" ? "high-yield" : "secondary",
          ],
          exam: "NCLEX-RN",
          postTemplate: tmpl,
          relatedLessonPath: `/us/rn/nclex-rn/lessons/${topic.id}`,
        });
    }
  }
  return rows;
}

/** One batch row per RN topic (template rotates per row). */
export function totalRnTopicMapRowsEstimate(): number {
  const p = mapPath();
  if (!fs.existsSync(p)) return 0;
  const raw = JSON.parse(fs.readFileSync(p, "utf8")) as {
    exams?: { RN?: { categories?: Array<{ topics: unknown[] }> } };
  };
  const rn = raw.exams?.RN;
  if (!rn?.categories) return 0;
  let n = 0;
  for (const cat of rn.categories) {
    n += cat.topics.length;
  }
  return n;
}
