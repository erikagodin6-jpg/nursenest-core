export const PLATFORM_SECTIONS = ["exam_prep", "new_grad", "career_tools", "allied_health", "other"] as const;
export type PlatformSection = typeof PLATFORM_SECTIONS[number];

const ALLIED_PREFIXES = [
  "/mlt", "/imaging", "/paramedic", "/rrt", "/pharmacy-tech",
  "/social-worker", "/psychotherapist", "/occupational-therapy",
  "/physical-therapy", "/addictions-counsellor", "/critical-care",
  "/emergency-nursing",
];

const EXAM_PREP_PATTERNS = [
  "/lessons", "/flashcards", "/mock-exams", "/question-bank",
  "/nclex-rn", "/nclex-pn", "/rex-pn", "/canada-np", "/us-np",
  "/case-simulations", "/first-action-simulator", "/safety-hazard-simulator",
  "/deteriorating-patient-simulator", "/study-coaching", "/seo-quiz",
  "/qotd", "/exam", "/rpn", "/rn/", "/np/",
  "/anatomy", "/pre-nursing", "/encyclopedia",
  "/dashboard", "/exam-prep",
];

const NEW_GRAD_PATTERNS = [
  "/new-grad", "/new-graduate-support",
  "/nurse-first-year-survival-guide",
  "/paramedic-first-year-survival-guide", "/mlt-first-year-survival-guide",
  "/imaging-first-year-survival-guide", "/rrt-first-year-survival-guide",
];

const CAREER_TOOLS_PATTERNS = [
  "/career", "/resume", "/interview", "/job",
  "/applynest", "/apply-nest", "/healthcare-careers",
];

export function getPlatformSection(path: string): PlatformSection {
  const lowerPath = path.toLowerCase();

  if (lowerPath === "/" || lowerPath === "") {
    return "exam_prep";
  }

  if (lowerPath.startsWith("/admin") || lowerPath.startsWith("/auth") || lowerPath === "/pricing" || lowerPath === "/login" || lowerPath === "/register") {
    return "other";
  }

  if (lowerPath.includes("#career-tools") || CAREER_TOOLS_PATTERNS.some(p => lowerPath.startsWith(p))) {
    return "career_tools";
  }

  if (NEW_GRAD_PATTERNS.some(p => lowerPath.startsWith(p))) {
    return "new_grad";
  }

  for (const prefix of ALLIED_PREFIXES) {
    if (lowerPath.startsWith(prefix)) {
      return "allied_health";
    }
  }

  if (EXAM_PREP_PATTERNS.some(p => lowerPath.startsWith(p) || lowerPath.includes(p))) {
    return "exam_prep";
  }

  return "other";
}

export const SECTION_LABELS: Record<PlatformSection, string> = {
  exam_prep: "Exam Prep",
  new_grad: "New Grad",
  career_tools: "Career Tools",
  allied_health: "Allied Health",
  other: "Other",
};
