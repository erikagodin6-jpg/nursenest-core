export type PreviewKind =
  | "marketing"
  | "pricing"
  | "faq"
  | "lesson"
  | "dashboard"
  | "flashcards"
  | "flashcard-session"
  | "practice-builder"
  | "practice-runner"
  | "cat"
  | "blog-index"
  | "blog-detail"
  | "admin"
  | "report"
  | "analytics"
  | "tools"
  | "pathway-hub";

export type PreviewSurface = {
  slug: string;
  title: string;
  eyebrow: string;
  description: string;
  kind: PreviewKind;
};

const surfaces = [
  ["homepage", "Homepage", "Marketing", "Premium public entry with image-led hero, trust strip, and pathway CTAs.", "marketing"],
  ["pricing", "Pricing", "Marketing", "Trust-forward plans, comparison cards, reassurance copy, and purchase actions.", "pricing"],
  ["faq", "FAQ", "Support", "Searchable categories, polished accordions, and concise support CTAs.", "faq"],
  ["lesson", "Lesson Detail", "Clinical Study Cockpit", "Sticky study rail, semantic section cards, utilities, and rapid review.", "lesson"],
  ["dashboard", "Learner Dashboard", "Study Cockpit", "Daily plan, readiness, weak areas, momentum, and next actions.", "dashboard"],
  ["flashcards", "Flashcards Hub", "Study Tools", "Deck cards, filters, progress, confidence, and spaced review states.", "flashcards"],
  ["flashcard-session", "Flashcard Session", "Focused Study", "Large recall card, reveal state, confidence controls, and rationale.", "flashcard-session"],
  ["practice-tests", "Practice Test Builder", "Exam Prep", "Pathway/topic filters, question counts, difficulty, and session setup.", "practice-builder"],
  ["practice-runner", "Practice Test Runner", "Exam Prep", "Question card, answer options, progress, rationale, and review actions.", "practice-runner"],
  ["cat", "CAT Exam", "Adaptive Exam", "Timed adaptive shell with readiness indicators and rationale restrictions.", "cat"],
  ["blog", "Blog Index", "Clinical Library", "Article cards, category filters, semantic study links, and trust cues.", "blog-index"],
  ["blog-detail", "Blog Detail", "Clinical Article", "Readable article, sticky TOC, key takeaways, and clinical callouts.", "blog-detail"],
  ["admin", "Admin Dashboard", "Operations", "Dense QA panels, content queues, tables, and staff-safe actions.", "admin"],
  ["report-cards", "Report Cards", "Performance", "Score summary, domain breakdown, and prioritized next steps.", "report"],
  ["analytics", "Analytics", "Progress Intelligence", "Mastery trends, weak-area heatmaps, and study velocity.", "analytics"],
  ["tools", "Tools and Calculators", "Clinical Tools", "Input panels, result cards, interpretation, and safe explanations.", "tools"],
  ["pre-nursing", "Pre-Nursing Hub", "Pathway Hub", "Prereq roadmap, checklists, readiness, and study path CTAs.", "pathway-hub"],
  ["np-hub", "NP Hub", "Pathway Hub", "Specialty cards, board readiness, clinical practice domains, and review flow.", "pathway-hub"],
  ["rn-hub", "RN Hub", "Pathway Hub", "NCLEX readiness, body-system lessons, practice entry, and study plan.", "pathway-hub"],
  ["allied-hub", "Allied Health Hub", "Pathway Hub", "Occupation cards, modality-aware prep, and shared learning rails.", "pathway-hub"],
] as const;

export const previewSurfaces: PreviewSurface[] = surfaces.map(([slug, title, eyebrow, description, kind]) => ({
  slug,
  title,
  eyebrow,
  description,
  kind: kind as PreviewKind,
}));

export const previewSurfaceSlugs = previewSurfaces.map((surface) => surface.slug);

export function resolvePreviewSurface(slug: string): PreviewSurface | null {
  return previewSurfaces.find((surface) => surface.slug === slug) ?? null;
}
