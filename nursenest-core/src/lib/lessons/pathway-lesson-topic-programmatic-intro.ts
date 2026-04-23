import type { ExamPathwayDefinition } from "@/lib/exam-pathways/types";
import { pathwayCountryLabel } from "@/lib/lessons/pathway-lesson-hub-seo";

export const TOPIC_CLUSTER_PROGRAMMATIC_INTRO_TARGET_MIN = 300;
export const TOPIC_CLUSTER_PROGRAMMATIC_INTRO_TARGET_MAX = 500;

/**
 * Deterministic, crawlable long-form intro for marketing topic lesson clusters.
 * Complements per-lesson detail pages: this targets “{topic} + {exam} + lessons” head terms.
 *
 * URL shape: `/{countrySlug}/{roleTrack}/{examCode}/lessons?topicSlug={topicSlug}` (legacy `/lessons/topics/…` 301s here).
 * (countrySlug acts as the marketing region segment; `topicSlug` is the stable slug.)
 */
export function buildPathwayLessonTopicProgrammaticIntroParagraphs(
  pathway: ExamPathwayDefinition,
  topicLabel: string,
  topicSlug: string,
): readonly string[] {
  const country = pathwayCountryLabel(pathway);
  const exam = pathway.displayName;
  const short = pathway.shortName;
  const topic = topicLabel.trim() || topicSlug.replace(/-/g, " ");
  const slugPhrase = topicSlug.replace(/-/g, " ");
  const otherCountry = country === "Canada" ? "United States" : "Canada";

  const p1 = `This hub collects ${topic} lessons for ${exam} candidates in ${country}. Each page in this cluster stays inside the same ${short} pathway as the parent exam hub, so you are not mixing ${otherCountry} scope, a different license tier, or unrelated specialties. Use it for a reading-first pass on ${slugPhrase}, then carry the same clinical storyline into pathway-matched questions and adaptive CAT-style practice when you are ready for volume.`;

  const p2 = `Lessons here emphasize clinical reasoning: assessment cues, prioritization, therapeutic monitoring, and the decision forks that tend to appear in board-style vignettes. When ${topic} touches medications or labs, framing stays aligned with ${country} expectations for this exam family. Early in prep, skim titles and summaries to build a mental map; closer to test day, treat each lesson as a tight review block you can pair with short question bursts so reading time converts into reliable recognition.`;

  const p3 = `Scope discipline matters as much as knowledge breadth. A generic “nursing school” feed can bury the boundaries your exam cares about. Tagging content to ${topic} lets you repeat a simple loop—read, recall key rules out loud, then validate with items that still read like your licensure exam—so you are not re-learning context every time you switch modalities.`;

  const p4 = `After you scan the list below, continue on the same ${short} track in two ways. Rehearse board-style items at scale in the pathway question bank when you want breadth and repetition. Shift into CAT-style adaptive practice when you want difficulty to move with performance instead of hand-picking every topic. Both entry points are built to respect the same exam scope as these lessons.`;

  const p5 = `Jump across related clinical areas with the topic navigation on this page without losing pathway context. When you need depth beyond public previews, sign in from a lesson card to save progress and unlock full bodies where your plan allows. The lesson index stays paginated so hubs remain fast as the library grows—resume on any device without loading the entire catalog at once.`;

  return [p1, p2, p3, p4, p5] as const;
}
