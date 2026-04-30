/**
 * Extra validation for AI-generated blog articles at publish time (beyond {@link validateBlogPrePublish}).
 * Keeps paywall-safe copy, citation density, internal link coverage, and clinical section depth explicit.
 */

import type { BlogControlPanelPlan } from "@/lib/blog/blog-control-panel-schema";
import { splitBlogBodyByH2 } from "@/lib/blog/blog-content-quality-gate";
import { marketingStudyHubsForBlogExam, type BlogCountryContext } from "@/lib/blog/blog-study-cta";

/** Parenthetical APA-style in-text citations: text ending with comma + 4-digit year inside parens. */
const APA_INTEXT_PAREN_YEAR = /\([^)]{3,220},\s*\d{4}[a-z]?\)/g;

export function countApaStyleInTextCitations(html: string): number {
  const m = html.match(APA_INTEXT_PAREN_YEAR);
  return m?.length ?? 0;
}

export const BLOG_PAYWALL_UNSAFE_PHRASES: readonly string[] = [
  "free lesson",
  "full lesson for free",
  "lesson is free",
  "completely free lesson",
  "no paywall",
  "bypass the paywall",
  "get the full course free",
  "unlock everything free",
] as const;

/** Required fragments (lowercase) for the standard member CTA (exact wording may vary slightly). */
export const BLOG_PAYWALL_SAFE_CTA_FRAGMENTS: readonly string[] = [
  "want more practice",
  "nursenest members",
  "related lesson",
  "flashcards",
  "rationale",
] as const;

export type BlogLessonLinkRowLike = {
  reviewStatus?: "active" | "removed";
  replacementPath?: string | null;
  suggestedPath?: string;
};

function effectivePath(row: BlogLessonLinkRowLike): string {
  const r = (row.replacementPath ?? row.suggestedPath ?? "").trim().toLowerCase();
  return r;
}

/**
 * Validates internal link rows for publish: 2–5 active links and coverage of questions, flashcards, and lessons surfaces.
 */
export function collectGeneratedBlogInternalLinkCoverageIssues(
  lessons: BlogLessonLinkRowLike[],
): string[] {
  const active = lessons.filter((l) => l.reviewStatus !== "removed");
  const issues: string[] = [];
  if (active.length < 3) {
    issues.push(
      "At least three internal NurseNest links are required (combine lessons hub or lesson preview, practice questions, and flashcards).",
    );
  }
  if (active.length > 5) {
    issues.push(`Too many internal link rows for publish (${active.length}; maximum 5).`);
  }
  const paths = active.map(effectivePath);
  const hasQuestions = paths.some((p) => p.includes("/questions"));
  const hasFlashcards = paths.some((p) => p.includes("/flashcards"));
  const hasLessons = paths.some((p) => p.includes("/lessons"));
  if (!hasQuestions) issues.push("Internal link plan must include a practice questions destination (path containing /questions).");
  if (!hasFlashcards) issues.push("Internal link plan must include a flashcards destination (path containing /flashcards).");
  if (!hasLessons) issues.push("Internal link plan must include a lessons hub or lesson path (path containing /lessons).");
  return issues;
}

export function collectPaywallUnsafeBodyPhrases(html: string): string[] {
  const lower = html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").toLowerCase();
  const hits: string[] = [];
  for (const phrase of BLOG_PAYWALL_UNSAFE_PHRASES) {
    if (lower.includes(phrase)) hits.push(`Unsafe paywall copy: "${phrase}"`);
  }
  return hits;
}

export function collectPaywallSafeCtaIssues(html: string): string[] {
  const lower = html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").toLowerCase();
  const missing = BLOG_PAYWALL_SAFE_CTA_FRAGMENTS.filter((f) => !lower.includes(f));
  if (missing.length > 0) {
    return [
      `Paywall-safe member CTA is missing required phrasing (include a short paragraph like: "Want more practice? NurseNest members can review the related lesson, flashcards, and rationale-based questions." Missing: ${missing.join(", ")}).`,
    ];
  }
  return [];
}

/**
 * For generated articles: require several clinical teaching arcs visible in H2 headings (not only intro/conclusion).
 */
export function collectGenericClinicalSurfaceIssues(body: string): string[] {
  const segments = splitBlogBodyByH2(body);
  const h2s = segments.map((s) => s.heading.toLowerCase()).filter((h) => h && h !== "(body)");
  if (h2s.length < 5) {
    return [`Article structure is too shallow for publish (${h2s.length} H2 sections; need at least 5 substantive sections).`];
  }

  const buckets = {
    mechanism: h2s.some((h) => /pathophys|mechanism|physiology|disease process|why this/.test(h)),
    presentation: h2s.some((h) => /sign|symptom|clinical presentation|manifestation/.test(h)),
    diagnostic: h2s.some((h) => /diagnos|lab|stud(y|ies)|monitoring|work-?up/.test(h)),
    nursing: h2s.some((h) => /nursing|intervention|priorit|management|assessment/.test(h)),
    teaching: h2s.some((h) => /education|teach|client|patient|discharge/.test(h)),
    exam: h2s.some((h) => /nclex|rex-pn|exam relevance|clinical pearl|test-taking/.test(h)),
  };
  const n = Object.values(buckets).filter(Boolean).length;
  if (n < 4) {
    return [
      "Article reads as surface-level for publish: expand with clear H2 sections covering pathophysiology, signs/symptoms, diagnostics/labs, nursing priorities/interventions, client education, and NCLEX/exam relevance (clinical pearls).",
    ];
  }
  return [];
}

/** Paywall-safe anchor phrasing hints for plan rows (editorial, not a hard HTML parse). */
export function collectPaywallUnsafeLessonLabelIssues(lessons: BlogLessonLinkRowLike[]): string[] {
  const active = lessons.filter((l) => l.reviewStatus !== "removed");
  const issues: string[] = [];
  for (const row of active) {
    const label = ((row as { label?: string }).label ?? "").toLowerCase();
    if (!label) continue;
    if (/\bfree\b.*\blesson\b/.test(label) || /\bfull\b.*\blesson\b.*\bfree\b/.test(label)) {
      issues.push(`Internal link label must not promise free full lessons: "${label.slice(0, 120)}"`);
    }
  }
  return issues;
}

/**
 * Suggested internal-lesson rows for batch dry-run when the pipeline plan is not yet hydrated with four surfaces.
 */
export function buildDefaultBatchInternalLessonLinkStubs(
  plan: BlogControlPanelPlan,
  exam: string,
  country: BlogCountryContext,
): BlogControlPanelPlan["suggestedInternalLessons"] {
  const hubs = marketingStudyHubsForBlogExam(exam, country);
  const lessonsHub = hubs.lessonsHub;
  const questions = hubs.pathwayQuestionsHub ?? hubs.questionBankHub;
  const flashcards = hubs.flashcardsHub;
  const existing: BlogControlPanelPlan["suggestedInternalLessons"] = [...(plan.suggestedInternalLessons ?? [])];
  const paths = new Set(existing.map((r) => (r.replacementPath ?? r.suggestedPath).trim()));

  const push = (row: BlogControlPanelPlan["suggestedInternalLessons"][number]) => {
    const p = (row.replacementPath ?? row.suggestedPath).trim();
    if (paths.has(p)) return;
    paths.add(p);
    existing.push(row);
  };

  push({
    label: "Related NurseNest lesson hub",
    suggestedPath: lessonsHub,
    pathStatus: "skipped_non_lesson",
    linkKind: "lessons_hub",
    reviewStatus: "active",
    id: "batch-lessons-hub",
  });
  push({
    label: "Members can continue with rationale-based questions",
    suggestedPath: questions,
    pathStatus: "skipped_non_lesson",
    linkKind: "question_bank",
    reviewStatus: "active",
    id: "batch-questions",
  });
  push({
    label: "Related flashcards in NurseNest",
    suggestedPath: flashcards,
    pathStatus: "skipped_non_lesson",
    linkKind: "flashcards_hub",
    reviewStatus: "active",
    id: "batch-flashcards",
  });

  return existing.slice(0, 5);
}
