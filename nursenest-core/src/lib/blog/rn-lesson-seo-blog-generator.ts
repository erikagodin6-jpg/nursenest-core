import { createHash } from "node:crypto";
import { countWords, stripToPlainText } from "@/lib/content-quality/plain-text";

export const RN_LESSON_BLOG_PATHWAY_IDS = ["us-rn-nclex-rn", "ca-rn-nclex-rn"] as const;

export type RnLessonBlogIntent =
  | "nclex_topic_questions"
  | "how_to_understand_topic_nursing"
  | "nclex_practice_questions_topic";

export type RnLessonBlogVariant = {
  intent: RnLessonBlogIntent;
  title: string;
};

export type RnLessonSource = {
  pathwayId: string;
  slug: string;
  title: string;
  topic: string;
  topicSlug: string;
  bodySystem: string;
  sections: unknown;
};

function normalizeTopicLabel(topic: string, fallbackTitle: string): string {
  const clean = topic.trim() || fallbackTitle.trim();
  return clean.replace(/\s+/g, " ").trim();
}

export function buildRnLessonSeoVariants(topic: string): RnLessonBlogVariant[] {
  const t = topic.trim().replace(/\s+/g, " ");
  return [
    { intent: "nclex_topic_questions", title: `NCLEX ${t} questions` },
    { intent: "how_to_understand_topic_nursing", title: `How to understand ${t} nursing` },
    { intent: "nclex_practice_questions_topic", title: `NCLEX practice questions ${t}` },
  ];
}

export function buildRnLessonBlogDuplicateHash(title: string, topicSlug: string): string {
  const payload = `${title.trim().toLowerCase()}|${topicSlug.trim().toLowerCase()}`;
  return createHash("sha256").update(payload).digest("hex");
}

export function keywordClusterFromDuplicateHash(hash: string): string {
  return `rn-lesson-seo-hash:${hash}`;
}

export function pathwayLessonPublicPath(pathwayId: string, lessonSlug: string): string {
  const routeBase = pathwayId.startsWith("ca-") ? "/canada/rn/nclex-rn/lessons" : "/us/rn/nclex-rn/lessons";
  return `${routeBase}/${encodeURIComponent(lessonSlug)}`;
}

export function rnLessonBlogPublicPath(slug: string): string {
  return `/blog/rn/${encodeURIComponent(slug.trim())}`;
}

function lessonSectionBodies(sections: unknown): string[] {
  if (!Array.isArray(sections)) return [];
  const out: string[] = [];
  for (const row of sections) {
    if (!row || typeof row !== "object") continue;
    const body = (row as { body?: unknown }).body;
    if (typeof body === "string" && body.trim()) out.push(body.trim());
  }
  return out;
}

export function lessonHasHighQualityBody(sections: unknown, minWords: number = 700): boolean {
  const bodies = lessonSectionBodies(sections);
  if (bodies.length < 3) return false;
  const totalWords = bodies.reduce((sum, body) => sum + countWords(stripToPlainText(body)), 0);
  return totalWords >= minWords;
}

/** Three to five NCLEX-style prompts per article (deterministic set). */
export function practiceQuestionSet(topicLabel: string): string[] {
  return [
    `1. A client with ${topicLabel} has a sudden change in assessment findings. Which cue should the nurse prioritize first, and why?`,
    `2. Which intervention is most appropriate as the initial nursing action for ${topicLabel} in an NCLEX-style scenario?`,
    `3. Which finding suggests the current plan of care for ${topicLabel} is effective, and which finding requires escalation?`,
    `4. When reviewing labs or diagnostics related to ${topicLabel}, which trend should prompt the nurse to reassess and notify the provider?`,
    `5. In a prioritization question about ${topicLabel}, which option best reflects safe sequencing (assessment → intervention → evaluation)?`,
  ];
}

function excerptForVariant(title: string, topicLabel: string): string {
  return `${title} with concise rationale, practice questions, and a direct pathway back to the full NurseNest lesson on ${topicLabel}.`;
}

export function buildRnLessonSeoBodyHtml(input: {
  topicLabel: string;
  lessonTitle: string;
  lessonPath: string;
  practiceQuestions: string[];
}): string {
  const topic = input.topicLabel;
  const lessonLink = input.lessonPath;
  const questionsHtml = input.practiceQuestions.map((q) => `<li>${q}</li>`).join("");
  return [
    `<p>${topic} is a recurring NCLEX testing surface where exam writers expect nursing judgment, prioritization, and safe escalation. This guide gives you high-yield framing and practice prompts you can use today.</p>`,
    `<h2>How to approach ${topic} for NCLEX</h2>`,
    `<p>Start with pattern recognition, then move to risk-ranked action. Focus on what must be assessed first, what can wait, and which findings require immediate provider notification.</p>`,
    `<h2>Practice questions for ${topic}</h2>`,
    `<ol>${questionsHtml}</ol>`,
    `<h2>Go deeper with the full RN lesson</h2>`,
    `<p>Read the complete lesson: <a href="${lessonLink}">${input.lessonTitle}</a>. Use it to reinforce pathophysiology, assessment priorities, and intervention rationale before your next question set.</p>`,
    `<h2>Start free trial</h2>`,
    `<p>Ready for more NCLEX practice? <a href="/pricing">Start your free trial</a> to unlock full lessons, adaptive practice questions, and exam-focused study tools.</p>`,
  ].join("\n");
}

export function buildRnLessonSeoDraft(input: {
  lesson: RnLessonSource;
  variant: RnLessonBlogVariant;
}): {
  title: string;
  slug: string;
  excerpt: string;
  body: string;
  topicLabel: string;
  lessonPath: string;
  hash: string;
} {
  const topicLabel = normalizeTopicLabel(input.lesson.topic, input.lesson.title);
  const lessonPath = pathwayLessonPublicPath(input.lesson.pathwayId, input.lesson.slug);
  const hash = buildRnLessonBlogDuplicateHash(input.variant.title, input.lesson.topicSlug);
  const short = hash.slice(0, 10);
  const slugBase = input.variant.title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  const slug = `rn-${slugBase}-${short}`;
  const questions = practiceQuestionSet(topicLabel);
  return {
    title: input.variant.title,
    slug,
    excerpt: excerptForVariant(input.variant.title, topicLabel).slice(0, 280),
    body: buildRnLessonSeoBodyHtml({
      topicLabel,
      lessonTitle: input.lesson.title,
      lessonPath,
      practiceQuestions: questions,
    }),
    topicLabel,
    lessonPath,
    hash,
  };
}
