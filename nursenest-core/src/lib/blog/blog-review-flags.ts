/**
 * Content safety scanning for localized blog articles.
 *
 * Scans AI-generated blog content for claims that require human review before
 * publication: regulatory, medical, immigration, salary, pass-rate, legal, and
 * competitive comparison claims.
 *
 * Returns structured review flags rather than silently allowing risky content.
 */

export type ReviewFlagCategory =
  | "regulatory"
  | "medical"
  | "immigration"
  | "salary"
  | "pass_rate"
  | "legal"
  | "eligibility"
  | "exam_change"
  | "competitor_comparison";

export type ReviewFlag = {
  category: ReviewFlagCategory;
  pattern: string;
  severity: "must_review" | "should_review" | "advisory";
  description: string;
};

type PatternRule = {
  regex: RegExp;
  category: ReviewFlagCategory;
  severity: ReviewFlag["severity"];
  description: string;
};

const REVIEW_PATTERNS: PatternRule[] = [
  // Regulatory claims
  {
    regex: /\b(board of nursing|state board|nursing council|regulatory body|NCSBN|CGFNS|VisaScreen)\b/i,
    category: "regulatory",
    severity: "must_review",
    description: "References a regulatory body — verify accuracy for the target country",
  },
  {
    regex: /\b(licensed?|licensure|registration|accredit(?:ed|ation)|certified?|certification)\b.*\b(require|mandatory|must|need to)\b/i,
    category: "regulatory",
    severity: "must_review",
    description: "Makes a claim about licensing or certification requirements",
  },
  // Immigration / licensure pathway claims
  {
    regex: /\b(visa|immigration|work permit|green card|skilled worker|points system|IELTS|OET)\b/i,
    category: "immigration",
    severity: "must_review",
    description: "References immigration or visa processes — high risk of outdated or inaccurate info",
  },
  {
    regex: /\b(retrogression|priority date|petition|sponsor(?:ship)?|labor certification)\b/i,
    category: "immigration",
    severity: "must_review",
    description: "References specific immigration processes or statuses",
  },
  // Pass rate claims
  {
    regex: /\b(\d{1,3})\s*%\s*(pass|passing|success)\s*(rate|ratio)/i,
    category: "pass_rate",
    severity: "must_review",
    description: "Claims a specific pass rate percentage — must be verified with source",
  },
  {
    regex: /\b(first[- ]?time|first[- ]?attempt)\s*(pass|passing)\s*(rate|ratio)/i,
    category: "pass_rate",
    severity: "should_review",
    description: "References first-time pass rates — verify data is current",
  },
  // Salary claims
  {
    regex: /\$\s*[\d,]+(?:\.\d{2})?\s*(?:per|\/)\s*(?:year|month|hour|annum)/i,
    category: "salary",
    severity: "must_review",
    description: "States a specific salary figure — verify for accuracy and currency",
  },
  {
    regex: /\b(salary|wage|compensation|earning|income)\s*(?:of|is|range|between)\s*[\$₹₱€£]\s*[\d,]/i,
    category: "salary",
    severity: "must_review",
    description: "Claims specific compensation amounts",
  },
  {
    regex: /\b(average|median|starting|typical)\s+(salary|wage|pay|compensation)\b/i,
    category: "salary",
    severity: "should_review",
    description: "References average or typical salary — should be sourced",
  },
  // Legal advice tone
  {
    regex: /\b(you must|you are required to|legally required|by law|it is illegal|violat(?:e|ion)|sue|lawsuit|malpractice)\b/i,
    category: "legal",
    severity: "must_review",
    description: "Uses legal language or gives legal-sounding advice",
  },
  // Medical advice tone
  {
    regex: /\b(diagnos(?:e|is|tic)|prescri(?:be|ption)|treat(?:ment)?|administer|dosage|contraindication)\b.*\b(should|must|always|never)\b/i,
    category: "medical",
    severity: "must_review",
    description: "Appears to give specific medical guidance beyond exam prep context",
  },
  // Country-specific eligibility claims
  {
    regex: /\b(eligible|eligibility|qualify|qualification)\b.*\b(exam|test|licensure|registration|credential)\b/i,
    category: "eligibility",
    severity: "should_review",
    description: "Makes eligibility claims about exams or credentials — verify for target country",
  },
  // Exam change claims
  {
    regex: /\b(new format|format change|exam change|updated exam|new version|NGN|Next Generation)\b/i,
    category: "exam_change",
    severity: "should_review",
    description: "References exam format changes — verify information is current",
  },
  {
    regex: /\b(as of|starting|beginning|effective)\s+(?:20\d{2}|January|February|March|April|May|June|July|August|September|October|November|December)\b/i,
    category: "exam_change",
    severity: "advisory",
    description: "References a specific date for changes — may become stale",
  },
  // Competitor comparisons
  {
    regex: /\b(UWorld|Archer|Kaplan|Hurst|Saunders|ATI|Mark Klimek|Simple Nursing|Nurse Achieve|NRSNG|Lecturio|Picmonic)\b/i,
    category: "competitor_comparison",
    severity: "should_review",
    description: "Mentions a competitor — review for fairness and accuracy",
  },
];

export type ContentReviewResult = {
  flags: ReviewFlag[];
  complianceReviewRequired: boolean;
  medicalReviewRequired: boolean;
  editorialReviewRequired: boolean;
};

/**
 * Scan blog content (title + excerpt + body) for claims requiring human review.
 *
 * Returns structured flags with categories and severity levels rather than
 * a simple boolean. Downstream publish workflows can gate on these flags.
 */
export function scanForReviewFlags(content: {
  title: string;
  excerpt: string;
  body: string;
}): ContentReviewResult {
  const combined = `${content.title}\n${content.excerpt}\n${content.body}`;
  const flags: ReviewFlag[] = [];
  const seen = new Set<string>();

  for (const rule of REVIEW_PATTERNS) {
    const match = rule.regex.exec(combined);
    if (match) {
      const key = `${rule.category}:${rule.description}`;
      if (seen.has(key)) continue;
      seen.add(key);
      flags.push({
        category: rule.category,
        pattern: match[0].slice(0, 100),
        severity: rule.severity,
        description: rule.description,
      });
    }
  }

  const complianceReviewRequired = flags.some(
    (f) =>
      f.severity === "must_review" &&
      (f.category === "regulatory" || f.category === "immigration" || f.category === "legal" || f.category === "eligibility"),
  );

  const medicalReviewRequired = flags.some(
    (f) => f.severity === "must_review" && f.category === "medical",
  );

  const editorialReviewRequired =
    complianceReviewRequired ||
    medicalReviewRequired ||
    flags.some((f) => f.severity === "must_review");

  return {
    flags,
    complianceReviewRequired,
    medicalReviewRequired,
    editorialReviewRequired,
  };
}
