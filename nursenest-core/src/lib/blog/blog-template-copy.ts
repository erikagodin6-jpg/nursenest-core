import { BlogPostTemplate } from "@prisma/client";

/** Title / SEO patterns for structured generators (editorial + automation). */
export const BLOG_TEMPLATE_TITLE_PATTERNS: Record<BlogPostTemplate, (ctx: { exam: string; topic: string }) => string> = {
  [BlogPostTemplate.HOW_TO_PASS]: ({ exam, topic }) => `How to pass ${exam}: ${topic} focus areas that move the needle`,
  [BlogPostTemplate.TOPIC_EXPLAINED]: ({ exam, topic }) => `${topic} explained for ${exam} exams (what NCLEX-style items reward)`,
  [BlogPostTemplate.TOP_MISTAKES]: ({ exam, topic }) => `Top mistakes in ${topic} on ${exam} practice (and how to fix them)`,
  [BlogPostTemplate.PRACTICE_QUESTIONS]: ({ exam, topic }) => `Practice questions: ${topic} (${exam} drill plan)`,
  [BlogPostTemplate.STUDY_PLAN]: ({ exam, topic }) => `Study plan for ${exam}: ${topic} without burning out`,
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
  }
}
