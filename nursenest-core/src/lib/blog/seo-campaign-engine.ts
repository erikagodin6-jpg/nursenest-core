import { BlogFunnelStage, BlogPostIntent, BlogPostTemplate } from "@prisma/client";

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 150);
}

export function buildOutline(params: {
  title: string;
  targetKeyword: string;
  intent: BlogPostIntent;
  template: BlogPostTemplate;
}): { h2: string; points: string[] }[] {
  const base = [
    { h2: "What this topic means for exam performance", points: ["Core concept", "Common test trap", "What to prioritize"] },
    { h2: "How to apply this in questions", points: ["Step-by-step approach", "Prioritization logic", "Safety checkpoints"] },
    { h2: "Mistakes to avoid", points: ["Frequent confusion", "Why answers look tempting", "How to recover quickly"] },
    { h2: "Exam-day memory anchors", points: ["Quick mnemonic", "Red flags", "One-minute recap"] },
  ];
  if (params.template === BlogPostTemplate.CHECKLIST_ARTICLE || params.intent === BlogPostIntent.CHECKLIST) {
    base.unshift({ h2: "Pre-exam checklist", points: ["Must-know items", "Verification pass", "Last-minute review"] });
  }
  if (params.template === BlogPostTemplate.COMPARISON_ARTICLE || params.intent === BlogPostIntent.COMPARISON) {
    base.unshift({ h2: "Side-by-side comparison", points: ["Key differences", "Clinical cues", "Exam elimination strategy"] });
  }
  return base;
}

export function computeCadenceDates(params: {
  startDate: Date;
  count: number;
  postsPerWeek: number;
  preferredWeekdays?: number[];
}): Date[] {
  const out: Date[] = [];
  const weekdays = (params.preferredWeekdays ?? []).filter((d) => d >= 0 && d <= 6);
  const slots = weekdays.length > 0 ? weekdays.slice(0, params.postsPerWeek) : [1, 3, 5].slice(0, Math.max(1, params.postsPerWeek));
  const cursor = new Date(params.startDate);
  cursor.setHours(14, 0, 0, 0);
  while (out.length < params.count) {
    for (const wd of slots) {
      const d = new Date(cursor);
      const delta = (wd - d.getDay() + 7) % 7;
      d.setDate(d.getDate() + delta);
      if (d >= params.startDate) out.push(d);
      if (out.length >= params.count) break;
    }
    cursor.setDate(cursor.getDate() + 7);
  }
  return out.sort((a, b) => a.getTime() - b.getTime());
}

export function ctaFor(params: {
  intent?: BlogPostIntent | null;
  funnel?: BlogFunnelStage | null;
  template?: BlogPostTemplate | null;
}): { type: string; text: string; href: string } {
  if (params.intent === BlogPostIntent.PRACTICE_QUESTIONS || params.template === BlogPostTemplate.PRACTICE_QUESTIONS) {
    return { type: "start_questions", text: "Start a focused question set", href: "/app/questions" };
  }
  if (params.intent === BlogPostIntent.CONVERSION || params.funnel === BlogFunnelStage.CONVERSION) {
    return { type: "premium_access", text: "Unlock premium exam prep", href: "/pricing" };
  }
  if (params.intent === BlogPostIntent.STUDY_STRATEGY || params.template === BlogPostTemplate.STUDY_PLAN) {
    return { type: "build_study_plan", text: "Build your personalized study plan", href: "/app/study-plan" };
  }
  return { type: "read_related", text: "Read a related exam-prep article", href: "/blog" };
}

export function detectRiskFlags(input: { template?: BlogPostTemplate | null; keyword?: string | null }): string[] {
  const flags: string[] = [];
  const kw = (input.keyword ?? "").toLowerCase();
  if (kw.includes("dosage") || kw.includes("medication")) flags.push("medication_safety");
  if (kw.includes("emergency") || kw.includes("code blue")) flags.push("emergency_care");
  if (input.template === BlogPostTemplate.MEDICATION_REVIEW) flags.push("medication_safety");
  if (kw.includes("intervention") || kw.includes("clinical management")) flags.push("clinical_intervention");
  return [...new Set(flags)];
}

export function thinDraftWarning(body: string): string | null {
  const words = body.replace(/<[^>]+>/g, " ").trim().split(/\s+/).filter(Boolean).length;
  if (words < 500) return "Thin draft: fewer than 500 words.";
  return null;
}
