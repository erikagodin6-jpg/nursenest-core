/**
 * Deterministic minimal editorial plan when the LLM plan JSON cannot be validated.
 * Used only when {@link fetchControlPanelPlan} sets `allowMinimalPlanFallback` after retries exhaust.
 */

import type { BlogControlPanelPlan } from "@/lib/blog/blog-control-panel-schema";
import { safeParseBlogControlPanelPlan } from "@/lib/blog/blog-control-panel-plan-normalize";

function lessonHubForExam(exam: string, country: "US" | "CA" | "unspecified"): string {
  const e = exam.toLowerCase();
  if (/rex-?pn/.test(e)) return "/canada/rpn/rex-pn/lessons";
  if (country === "CA" && /nclex|rn/.test(e)) return "/canada/rn/nclex-rn/lessons";
  if (/allied/.test(e)) return "/us/allied/lessons";
  return "/us/rn/nclex-rn/lessons";
}

/**
 * Builds a schema-valid {@link BlogControlPanelPlan} so body generation and DB draft can proceed.
 * The row is tagged via `needsReviewFlags` for editor follow-up.
 */
export function buildReliableFallbackBlogControlPanelPlan(params: {
  topic: string;
  exam: string;
  country: "US" | "CA" | "unspecified";
  recommendedSlug: string;
}): BlogControlPanelPlan {
  const h1 = params.topic.replace(/\s+/g, " ").trim().slice(0, 200) || "Clinical nursing review";
  const slug = params.recommendedSlug.replace(/\s+/g, "-").trim().slice(0, 120);
  const hub = lessonHubForExam(params.exam, params.country);
  const examShort = params.exam.slice(0, 40);
  const metaTitle = `${h1}: Nursing review (${examShort})`.slice(0, 60);
  let metaDescription = `${h1}: Clinical nursing review, assessment priorities, safety, and exam-style decision rules for ${examShort}. NurseNest education-only overview.`
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 155);
  if (metaDescription.length < 120) {
    metaDescription = `${metaDescription} Additional focus on delegation, prioritization, and therapeutic communication as commonly tested on licensure exams.`
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, 155);
  }
  const raw = {
    titleOptions: [h1, `${h1} — ${examShort}`.slice(0, 200), `${examShort}: ${h1}`.slice(0, 200)],
    h1,
    recommendedSlug: slug,
    metaTitle,
    metaDescription,
    outline: [
      { h2: "Clinical overview and why this topic matters", bullets: ["Scope", "Safety framing"] },
      { h2: "Assessment priorities and nursing surveillance", bullets: ["Bedside cues", "Escalation"] },
      { h2: "Interventions, client education, and documentation", bullets: ["Teaching", "Handoff"] },
      { h2: "Medication classes and monitoring (education-only)", bullets: ["Monitoring", "Red flags"] },
      { h2: "Exam-style traps and best-next-action practice", bullets: ["Prioritization", "Distractors"] },
    ],
    suggestedInternalLessons: [
      { label: "Pathway lessons hub", suggestedPath: hub, linkKind: "lessons_hub" as const },
    ],
    faqs: [
      {
        q: "What should a nurse prioritize when a client is unstable?",
        a: "Follow airway, breathing, circulation, and neurologic status in line with training; escalate using facility policy when findings worsen or are outside your scope.",
      },
      {
        q: "How do nursing exams usually test this kind of content?",
        a: "Items often emphasize prioritization, therapeutic boundaries, delegation rules, and safe patient education rather than memorized trivia.",
      },
      {
        q: "What home-care teaching reduces preventable harm?",
        a: "Clear return precautions, medication adherence cues, and when to contact the care team help clients stay safe between visits.",
      },
      {
        q: "What supports a safe handoff?",
        a: "Objective findings, pending tasks, and outstanding orders give the oncoming nurse enough context to continue care without gaps.",
      },
    ],
    breadcrumbs: [
      { label: "Home", href: "/" },
      { label: "Blog", href: "/blog" },
      { label: "Clinical nursing", href: "/blog" },
      { label: h1.slice(0, 40), href: `/blog/${slug}` },
    ],
    imagePlacements: [
      {
        section: "Article overview",
        promptIdea: "clinical nursing education illustration showing patient assessment and care planning",
        altIdea: "Educational nursing illustration supporting article content",
      },
    ],
    apaSourceStubs: [],
    keyTakeaways: [
      "Tie assessment data to likely causes before choosing actions.",
      "Prioritize safety and escalation when red flags appear.",
      "Use exam-style decision rules without inventing facility-specific policies.",
    ],
    internalAnchorOpportunities: [
      { phrase: "practice questions", suggestedAnchorText: "question bank", targetSuggestedPath: "/questions", rationale: "Practice hub" },
      { phrase: "practice exams", suggestedAnchorText: "practice exams", targetSuggestedPath: "/practice-exams", rationale: "Exam directory" },
      { phrase: "flashcards", suggestedAnchorText: "flashcards", targetSuggestedPath: "/flashcards", rationale: "Study tools" },
      { phrase: "lessons", suggestedAnchorText: "lessons", targetSuggestedPath: hub, rationale: "Lesson hub" },
    ],
    primaryKeyword: params.topic.slice(0, 160),
    secondaryKeywordPhrases: ["nursing assessment", "patient safety", "exam preparation"],
    searchIntent: "exam-prep",
    schemaOpportunities: [
      { type: "BlogPosting" as const, rationale: "Primary article entity for public pages when published." },
      { type: "BreadcrumbList" as const, rationale: "Navigation trail for marketing blog." },
      { type: "FAQPage" as const, rationale: "Structured FAQs are present in the plan." },
    ],
    recommendedInternalLinks: [
      { targetType: "question_bank", suggestedPath: "/questions", anchorText: "practice questions", needsReview: false },
      { targetType: "practice_exams", suggestedPath: "/practice-exams", anchorText: "practice exams", needsReview: false },
    ],
    sourceCandidates: [
      { title: "CDC clinical guidelines", notes: "Institutional framing until verified in CMS." },
      { title: "NCSBN test plan", notes: "High-level exam blueprint context." },
      { title: "Professional nursing standards", notes: "Scope and safety framing." },
    ],
    needsReviewFlags: ["minimal_fallback_plan_used", "apa_source_review_required"],
    suggestedExcerpt: `${h1} — clinical nursing review, assessment, safety, and exam prep for ${examShort}.`.slice(0, 220),
  };

  const parsed = safeParseBlogControlPanelPlan(raw, { title: params.topic, slug });
  if (!parsed.success) {
    const detail = parsed.normalizeError ?? (parsed.zodError ? String(parsed.zodError.message) : "unknown");
    throw new Error(`buildReliableFallbackBlogControlPanelPlan: parse failed (${detail})`);
  }
  return parsed.data;
}
