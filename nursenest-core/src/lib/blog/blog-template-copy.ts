import { BlogPostTemplate } from "@prisma/client";

/** Title / SEO patterns for structured generators (editorial + automation). */
export const BLOG_TEMPLATE_TITLE_PATTERNS: Record<BlogPostTemplate, (ctx: { exam: string; topic: string }) => string> = {
  [BlogPostTemplate.HOW_TO_PASS]: ({ exam, topic }) => `How to pass ${exam}: ${topic} focus areas that move the needle`,
  [BlogPostTemplate.TOPIC_EXPLAINED]: ({ exam, topic }) => `${topic} explained for ${exam} exams (what NCLEX-style items reward)`,
  [BlogPostTemplate.TOP_MISTAKES]: ({ exam, topic }) => `Top mistakes in ${topic} on ${exam} practice (and how to fix them)`,
  [BlogPostTemplate.PRACTICE_QUESTIONS]: ({ exam, topic }) => `Practice questions: ${topic} (${exam} drill plan)`,
  [BlogPostTemplate.STUDY_PLAN]: ({ exam, topic }) => `Study plan for ${exam}: ${topic} without burning out`,
  [BlogPostTemplate.EXAM_GUIDE]: ({ exam, topic }) => `${exam} exam guide: master ${topic} with high-yield strategy`,
  [BlogPostTemplate.MEDICATION_REVIEW]: ({ exam, topic }) => `${topic} medication review for ${exam}: safety, priorities, and pitfalls`,
  [BlogPostTemplate.LAB_VALUES_GUIDE]: ({ exam, topic }) => `${topic} lab values guide for ${exam}: interpretation that earns points`,
  [BlogPostTemplate.DISEASE_PROCESS_EXPLAINER]: ({ exam, topic }) => `${topic} disease process explained for ${exam} prep`,
  [BlogPostTemplate.PRIORITIZATION_ARTICLE]: ({ exam, topic }) => `Prioritization in ${topic} for ${exam}: who to see first and why`,
  [BlogPostTemplate.COMPARISON_ARTICLE]: ({ exam, topic }) => `${topic} comparison for ${exam}: key differences to remember`,
  [BlogPostTemplate.CHECKLIST_ARTICLE]: ({ exam, topic }) => `${topic} checklist for ${exam}: what to review before test day`,
  [BlogPostTemplate.FAQ_STYLE]: ({ exam, topic }) => `${topic} FAQ for ${exam}: concise answers to common question traps`,
  [BlogPostTemplate.GLOSSARY]: ({ exam, topic }) => `${topic} glossary for ${exam}: fast definitions with exam context`,
};

export function suggestedCategoryForTemplate(t: BlogPostTemplate): string {
  switch (t) {
    case BlogPostTemplate.HOW_TO_PASS:
      return "Exam strategy";
    case BlogPostTemplate.TOPIC_EXPLAINED:
      return "Clinical deep dives";
    case BlogPostTemplate.TOP_MISTAKES:
      return "NCLEX Tips";
    case BlogPostTemplate.PRACTICE_QUESTIONS:
      return "Practice";
    case BlogPostTemplate.STUDY_PLAN:
      return "Study planning";
    case BlogPostTemplate.EXAM_GUIDE:
      return "Exam guides";
    case BlogPostTemplate.MEDICATION_REVIEW:
      return "Medication safety";
    case BlogPostTemplate.LAB_VALUES_GUIDE:
      return "Lab values";
    case BlogPostTemplate.DISEASE_PROCESS_EXPLAINER:
      return "Pathophysiology";
    case BlogPostTemplate.PRIORITIZATION_ARTICLE:
      return "Prioritization";
    case BlogPostTemplate.COMPARISON_ARTICLE:
      return "Comparisons";
    case BlogPostTemplate.CHECKLIST_ARTICLE:
      return "Checklists";
    case BlogPostTemplate.FAQ_STYLE:
      return "FAQ";
    case BlogPostTemplate.GLOSSARY:
      return "Glossary";
  }
}
