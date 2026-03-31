/**
 * Public marketing URLs for blog CTAs (no app-only or API routes; no rationales).
 */
export function defaultPracticeHubForExam(exam: string | null | undefined): string {
  switch (exam) {
    case "RN":
      return "/nclex-rn-practice-questions";
    case "PN":
      return "/rex-pn-practice-questions";
    case "NP":
      return "/np-exam-practice-questions";
    case "ALLIED":
      return "/allied-health";
    default:
      return "/exam-lessons";
  }
}

export function defaultLessonsHubForExam(exam: string | null | undefined): string {
  switch (exam) {
    case "RN":
      return "/exam-lessons";
    case "PN":
      return "/exam-lessons";
    case "NP":
      return "/np-exam-practice-questions";
    case "ALLIED":
      return "/allied-health";
    default:
      return "/exam-lessons";
  }
}

/** Map tool slug from BlogPost.relatedTools to a public path */
export function toolPathForSlug(slug: string): string {
  const s = slug.replace(/^\//, "").trim();
  if (!s) return "/tools";
  return `/tools/${s}`;
}
