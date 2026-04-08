/**
 * Public marketing URLs for blog CTAs (no app-only or API routes; no rationales).
 * Prefer canonical exam pathway hubs over programmatic SEO slugs.
 */
export function defaultPracticeHubForExam(exam: string | null | undefined): string {
  switch (exam) {
    case "RN":
      return "/us/rn/nclex-rn/questions";
    case "PN":
      return "/us/lpn/nclex-pn/questions";
    case "NP":
      return "/us/np/fnp/questions";
    case "ALLIED":
      return "/us/allied/allied-health/questions";
    default:
      return "/lessons";
  }
}

export function defaultLessonsHubForExam(exam: string | null | undefined): string {
  switch (exam) {
    case "RN":
      return "/us/rn/nclex-rn/lessons";
    case "PN":
      return "/us/lpn/nclex-pn/lessons";
    case "NP":
      return "/us/np/fnp/lessons";
    case "ALLIED":
      return "/us/allied/allied-health/lessons";
    default:
      return "/lessons";
  }
}

/** Map tool slug from BlogPost.relatedTools to a public path */
export function toolPathForSlug(slug: string): string {
  const s = slug.replace(/^\//, "").trim();
  if (!s) return "/tools";
  return `/tools/${s}`;
}
