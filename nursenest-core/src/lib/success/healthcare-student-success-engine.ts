export type SuccessProfession =
  | "Nursing"
  | "RPN/LPN"
  | "NP"
  | "Respiratory Therapy"
  | "Paramedicine"
  | "Occupational Therapy"
  | "Physiotherapy"
  | "Medical Laboratory Technology"
  | "PSW"
  | "Pre-Nursing";

export type SuccessExam =
  | "NCLEX-RN"
  | "REx-PN"
  | "CNPLE"
  | "FNP"
  | "PMHNP"
  | "HESI A2"
  | "ATI TEAS"
  | "CASPER"
  | "Program Completion"
  | "Clinical Placement"
  | "Employment";

export type SuccessOutcomeCategory =
  | "nclex_pass"
  | "rex_pn_pass"
  | "cnple_pass"
  | "fnp_pass"
  | "pmhnp_pass"
  | "hesi_a2_success"
  | "ati_teas_success"
  | "casper_success"
  | "nursing_school_completion"
  | "rt_program_completion"
  | "paramedic_program_completion"
  | "clinical_placement_success"
  | "first_healthcare_job"
  | "program_admission";

export type SuccessStoryStatus = "draft" | "submitted" | "verification_pending" | "verified" | "rejected" | "published";

export type SuccessStoryConsent = {
  mayUseForMarketing: boolean;
  mayUseName: boolean;
  mayUsePhoto: boolean;
  mayUseSchool: boolean;
  mayUseLocation: boolean;
  mayUseSeoPage: boolean;
};

export type SuccessStorySubmission = {
  id: string;
  learnerId?: string | null;
  displayName?: string | null;
  photoUrl?: string | null;
  school?: string | null;
  country?: string | null;
  provinceOrState?: string | null;
  profession: SuccessProfession;
  exam?: SuccessExam | null;
  category: SuccessOutcomeCategory;
  outcome: string;
  studyTimeWeeks?: number | null;
  preparationStrategy: string;
  featuresUsed: readonly string[];
  adviceForFutureLearners: string;
  story: string;
  submittedAt: string;
  verifiedAt?: string | null;
  status: SuccessStoryStatus;
  consent: SuccessStoryConsent;
  verificationEvidence?: readonly string[];
  videoUrl?: string | null;
};

export type SuccessStoryPrompt = {
  id: string;
  category: SuccessOutcomeCategory;
  title: string;
  trigger: string;
  professionScope: readonly SuccessProfession[];
  exam?: SuccessExam;
  collectionPrompt: string;
};

export type SuccessStoryQualityScore = {
  completeness: number;
  authenticity: number;
  specificity: number;
  educationalValue: number;
  conversionValue: number;
  eeatValue: number;
  total: number;
  missingFields: readonly string[];
};

export type SeoSuccessPage = {
  slug: string;
  title: string;
  description: string;
  indexable: boolean;
  canonicalPath: string;
  sections: readonly string[];
  relatedResources: readonly string[];
};

export type SuccessWallItem = {
  id: string;
  label: string;
  category: SuccessOutcomeCategory;
  profession: SuccessProfession;
  locationLabel: string;
  occurredAt: string;
  verified: boolean;
  shareHeadline: string;
};

export type OutcomesDashboard = {
  totalVerifiedStories: number;
  nclexPasses: number;
  rexPnPasses: number;
  npCertifications: number;
  admissionsSuccesses: number;
  rtCertifications: number;
  paramedicCertifications: number;
  programCompletions: number;
  placementSuccesses: number;
  employmentOutcomes: number;
  byProfession: Record<SuccessProfession, number>;
  byCategory: Record<SuccessOutcomeCategory, number>;
};

export type ShareableSuccessGraphic = {
  headline: string;
  subline: string;
  altText: string;
  recommendedChannels: readonly ("linkedin" | "instagram" | "facebook" | "x" | "email")[];
};

export type InstitutionalOutcomeSummary = {
  school: string;
  verifiedStories: number;
  examPasses: number;
  admissions: number;
  placements: number;
  employment: number;
  professionsRepresented: readonly SuccessProfession[];
  strongestOutcome: string;
};

const requiredSubmissionFields = [
  "profession",
  "category",
  "outcome",
  "preparationStrategy",
  "featuresUsed",
  "adviceForFutureLearners",
  "story",
] as const;

export const SUCCESS_STORY_CATEGORIES: readonly SuccessOutcomeCategory[] = [
  "nclex_pass",
  "rex_pn_pass",
  "cnple_pass",
  "fnp_pass",
  "pmhnp_pass",
  "hesi_a2_success",
  "ati_teas_success",
  "casper_success",
  "nursing_school_completion",
  "rt_program_completion",
  "paramedic_program_completion",
  "clinical_placement_success",
  "first_healthcare_job",
  "program_admission",
] as const;

export const SUCCESS_STORY_PROMPTS: readonly SuccessStoryPrompt[] = [
  {
    id: "passed-nclex-rn",
    category: "nclex_pass",
    title: "Passed NCLEX-RN",
    trigger: "Learner reports NCLEX-RN pass or completes post-exam check-in.",
    professionScope: ["Nursing"],
    exam: "NCLEX-RN",
    collectionPrompt: "Share what changed your readiness, which NurseNest tools helped most, and what you would tell the next NCLEX-RN learner.",
  },
  {
    id: "passed-rex-pn",
    category: "rex_pn_pass",
    title: "Passed REx-PN",
    trigger: "Learner reports REx-PN pass.",
    professionScope: ["RPN/LPN"],
    exam: "REx-PN",
    collectionPrompt: "Share your practical nursing exam strategy, weak-area improvements, and the tools that helped you feel ready.",
  },
  {
    id: "passed-cnple",
    category: "cnple_pass",
    title: "Passed CNPLE",
    trigger: "Learner reports CNPLE pass.",
    professionScope: ["NP"],
    exam: "CNPLE",
    collectionPrompt: "Share how you prepared for NP-level clinical judgment, diagnostics, and professional practice questions.",
  },
  {
    id: "passed-fnp",
    category: "fnp_pass",
    title: "Passed FNP",
    trigger: "Learner reports FNP certification pass.",
    professionScope: ["NP"],
    exam: "FNP",
    collectionPrompt: "Share your study timeline, advanced assessment strategy, and which cases or questions helped most.",
  },
  {
    id: "passed-pmhnp",
    category: "pmhnp_pass",
    title: "Passed PMHNP",
    trigger: "Learner reports PMHNP certification pass.",
    professionScope: ["NP"],
    exam: "PMHNP",
    collectionPrompt: "Share how you prepared for psychiatric assessment, diagnosis, therapeutic communication, and psychopharmacology.",
  },
  {
    id: "hesi-a2-success",
    category: "hesi_a2_success",
    title: "Passed HESI A2",
    trigger: "Learner reports HESI A2 score or admission milestone.",
    professionScope: ["Pre-Nursing"],
    exam: "HESI A2",
    collectionPrompt: "Share your admissions prep strategy, score improvement, and what helped you stay organized.",
  },
  {
    id: "ati-teas-success",
    category: "ati_teas_success",
    title: "Passed ATI TEAS",
    trigger: "Learner reports ATI TEAS score or admission milestone.",
    professionScope: ["Pre-Nursing"],
    exam: "ATI TEAS",
    collectionPrompt: "Share your TEAS prep timeline, subject strategy, and advice for future applicants.",
  },
  {
    id: "casper-success",
    category: "casper_success",
    title: "Completed CASPER",
    trigger: "Learner reports CASPER completion or admission milestone.",
    professionScope: ["Pre-Nursing"],
    exam: "CASPER",
    collectionPrompt: "Share how you prepared for situational judgment, ethics, communication, and timed responses.",
  },
  {
    id: "completed-nursing-school",
    category: "nursing_school_completion",
    title: "Completed Nursing School",
    trigger: "Learner reports graduation or program completion.",
    professionScope: ["Nursing", "RPN/LPN"],
    exam: "Program Completion",
    collectionPrompt: "Share how NurseNest supported coursework, clinical placement, and exam preparation across your program.",
  },
  {
    id: "completed-rt-program",
    category: "rt_program_completion",
    title: "Completed RT Program",
    trigger: "Learner reports respiratory therapy program completion.",
    professionScope: ["Respiratory Therapy"],
    exam: "Program Completion",
    collectionPrompt: "Share what helped you with ABGs, ventilation, clinical placement, and respiratory assessment.",
  },
  {
    id: "completed-paramedic-program",
    category: "paramedic_program_completion",
    title: "Completed Paramedic Program",
    trigger: "Learner reports paramedic program completion.",
    professionScope: ["Paramedicine"],
    exam: "Program Completion",
    collectionPrompt: "Share how you prepared for emergency assessment, trauma, ECGs, and scenario-based decision-making.",
  },
  {
    id: "completed-clinical-placement",
    category: "clinical_placement_success",
    title: "Completed Clinical Placement",
    trigger: "Learner logs final placement reflection or completes placement hours.",
    professionScope: ["Nursing", "RPN/LPN", "NP", "Respiratory Therapy", "Paramedicine", "Occupational Therapy", "Physiotherapy", "Medical Laboratory Technology", "PSW"],
    exam: "Clinical Placement",
    collectionPrompt: "Share the placement setting, skills you strengthened, and what helped you feel prepared on shift.",
  },
  {
    id: "first-healthcare-job",
    category: "first_healthcare_job",
    title: "Obtained First Healthcare Job",
    trigger: "Learner reports accepted job offer.",
    professionScope: ["Nursing", "RPN/LPN", "NP", "Respiratory Therapy", "Paramedicine", "Occupational Therapy", "Physiotherapy", "Medical Laboratory Technology", "PSW"],
    exam: "Employment",
    collectionPrompt: "Share how NurseNest helped you build confidence, interview examples, and readiness for practice.",
  },
  {
    id: "program-admission",
    category: "program_admission",
    title: "Received Program Admission",
    trigger: "Learner reports admission offer.",
    professionScope: ["Pre-Nursing", "Respiratory Therapy", "Paramedicine", "Occupational Therapy", "Physiotherapy", "Medical Laboratory Technology", "PSW"],
    collectionPrompt: "Share the program, admissions path, study strategy, and what helped you earn your offer.",
  },
] as const;

function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function compactName(story: SuccessStorySubmission): string {
  if (story.consent.mayUseName && story.displayName?.trim()) return story.displayName.trim().split(/\s+/)[0] ?? "Learner";
  return "A NurseNest Learner";
}

function publicLocation(story: SuccessStorySubmission): string {
  const parts = [story.consent.mayUseSchool ? story.school : null, story.consent.mayUseLocation ? story.provinceOrState : null, story.consent.mayUseLocation ? story.country : null]
    .map((part) => part?.trim())
    .filter(Boolean);
  return parts.length ? parts.join(", ") : "Verified NurseNest learner";
}

function labelForCategory(category: SuccessOutcomeCategory): string {
  return category
    .split("_")
    .map((word) => (word === "nclex" ? "NCLEX" : word === "rex" ? "REx" : word === "pn" ? "PN" : word === "cnple" ? "CNPLE" : word === "fnp" ? "FNP" : word === "pmhnp" ? "PMHNP" : word === "hesi" ? "HESI" : word === "a2" ? "A2" : word === "ati" ? "ATI" : word === "teas" ? "TEAS" : word === "rt" ? "RT" : word.charAt(0).toUpperCase() + word.slice(1)))
    .join(" ");
}

function isPubliclyUsable(story: SuccessStorySubmission): boolean {
  return (story.status === "verified" || story.status === "published") && story.consent.mayUseForMarketing;
}

export function scoreSuccessStory(story: SuccessStorySubmission): SuccessStoryQualityScore {
  const missingFields = requiredSubmissionFields.filter((field) => {
    const value = story[field];
    return Array.isArray(value) ? value.length === 0 : !String(value ?? "").trim();
  });
  const completeness = Math.max(0, 100 - missingFields.length * 12 - (story.consent.mayUseSeoPage ? 0 : 8));
  const authenticity = Math.min(100, 50 + (story.verifiedAt ? 20 : 0) + Math.min(20, (story.verificationEvidence?.length ?? 0) * 10) + (story.school ? 5 : 0) + (story.provinceOrState ? 5 : 0));
  const specificity = Math.min(100, 45 + Math.min(25, story.featuresUsed.length * 5) + (story.studyTimeWeeks ? 10 : 0) + (story.story.length > 240 ? 20 : 0));
  const educationalValue = Math.min(100, 45 + (story.preparationStrategy.length > 120 ? 20 : 0) + (story.adviceForFutureLearners.length > 80 ? 20 : 0) + Math.min(15, story.featuresUsed.length * 3));
  const conversionValue = Math.min(100, 40 + Math.min(30, story.featuresUsed.length * 6) + (story.outcome.length > 20 ? 15 : 0) + (story.consent.mayUsePhoto && story.photoUrl ? 15 : 0));
  const eeatValue = Math.min(100, 35 + (story.verifiedAt ? 25 : 0) + (story.school ? 10 : 0) + (story.consent.mayUseLocation && story.provinceOrState ? 10 : 0) + (story.videoUrl ? 10 : 0) + (story.verificationEvidence?.length ? 10 : 0));
  const total = Math.round((completeness * 0.2) + (authenticity * 0.2) + (specificity * 0.15) + (educationalValue * 0.2) + (conversionValue * 0.1) + (eeatValue * 0.15));

  return { completeness, authenticity, specificity, educationalValue, conversionValue, eeatValue, total, missingFields };
}

export function selectSuccessStoryPrompts(args: {
  category?: SuccessOutcomeCategory;
  profession?: SuccessProfession;
  exam?: SuccessExam;
}): readonly SuccessStoryPrompt[] {
  return SUCCESS_STORY_PROMPTS.filter((prompt) => {
    const categoryOk = !args.category || prompt.category === args.category;
    const professionOk = !args.profession || prompt.professionScope.includes(args.profession);
    const examOk = !args.exam || prompt.exam === args.exam || !prompt.exam;
    return categoryOk && professionOk && examOk;
  });
}

export function buildSeoSuccessPage(story: SuccessStorySubmission): SeoSuccessPage {
  const name = compactName(story);
  const outcomeLabel = story.exam ?? labelForCategory(story.category);
  const title = `${name === "A NurseNest Learner" ? "How A NurseNest Learner" : `How ${name}`} ${story.outcome}`;
  const slug = slugify(title);
  const relatedResources = [
    `${outcomeLabel} Study Guide`,
    `${story.profession} Lessons`,
    `${story.profession} Flashcards`,
    `${story.profession} Practice Questions`,
    "Readiness Dashboard",
    "Study Plans",
  ];

  return {
    slug,
    title,
    description: `${name} shares the strategy, study timeline, NurseNest tools, and lessons learned behind this ${outcomeLabel} success story.`,
    indexable: isPubliclyUsable(story) && story.consent.mayUseSeoPage && scoreSuccessStory(story).total >= 75,
    canonicalPath: `/success-stories/${slug}`,
    sections: ["Story", "Strategy", "Study Plan", "Lessons Learned", "Recommended Resources"],
    relatedResources,
  };
}

export function buildSuccessWall(stories: readonly SuccessStorySubmission[], limit = 24): readonly SuccessWallItem[] {
  return stories
    .filter(isPubliclyUsable)
    .sort((a, b) => Date.parse(b.verifiedAt ?? b.submittedAt) - Date.parse(a.verifiedAt ?? a.submittedAt))
    .slice(0, limit)
    .map((story) => ({
      id: story.id,
      label: story.outcome,
      category: story.category,
      profession: story.profession,
      locationLabel: publicLocation(story),
      occurredAt: story.verifiedAt ?? story.submittedAt,
      verified: Boolean(story.verifiedAt),
      shareHeadline: buildShareableSuccessGraphic(story).headline,
    }));
}

export function buildOutcomesDashboard(stories: readonly SuccessStorySubmission[]): OutcomesDashboard {
  const verified = stories.filter((story) => story.status === "verified" || story.status === "published");
  const byProfession = Object.fromEntries(
    ["Nursing", "RPN/LPN", "NP", "Respiratory Therapy", "Paramedicine", "Occupational Therapy", "Physiotherapy", "Medical Laboratory Technology", "PSW", "Pre-Nursing"].map((profession) => [
      profession,
      verified.filter((story) => story.profession === profession).length,
    ]),
  ) as Record<SuccessProfession, number>;
  const byCategory = Object.fromEntries(
    SUCCESS_STORY_CATEGORIES.map((category) => [category, verified.filter((story) => story.category === category).length]),
  ) as Record<SuccessOutcomeCategory, number>;

  return {
    totalVerifiedStories: verified.length,
    nclexPasses: byCategory.nclex_pass,
    rexPnPasses: byCategory.rex_pn_pass,
    npCertifications: byCategory.cnple_pass + byCategory.fnp_pass + byCategory.pmhnp_pass,
    admissionsSuccesses: byCategory.program_admission + byCategory.hesi_a2_success + byCategory.ati_teas_success + byCategory.casper_success,
    rtCertifications: byCategory.rt_program_completion,
    paramedicCertifications: byCategory.paramedic_program_completion,
    programCompletions: byCategory.nursing_school_completion + byCategory.rt_program_completion + byCategory.paramedic_program_completion,
    placementSuccesses: byCategory.clinical_placement_success,
    employmentOutcomes: byCategory.first_healthcare_job,
    byProfession,
    byCategory,
  };
}

export function buildShareableSuccessGraphic(story: SuccessStorySubmission): ShareableSuccessGraphic {
  const outcome = story.exam ? `Passed ${story.exam}` : labelForCategory(story.category);
  const headline =
    story.category === "program_admission"
      ? "Accepted Into A Healthcare Program"
      : story.category === "clinical_placement_success"
        ? "Completed Clinical Placement"
        : story.category === "first_healthcare_job"
          ? "Obtained First Healthcare Job"
          : outcome;
  return {
    headline,
    subline: `${story.profession} success powered by focused study, clinical reasoning, and NurseNest practice.`,
    altText: `${headline} success story for ${story.profession}.`,
    recommendedChannels: ["linkedin", "instagram", "facebook", "email"],
  };
}

export function buildInstitutionalOutcomeSummaries(stories: readonly SuccessStorySubmission[]): readonly InstitutionalOutcomeSummary[] {
  const verified = stories.filter((story) => (story.status === "verified" || story.status === "published") && story.school?.trim());
  const schools = Array.from(new Set(verified.map((story) => story.school?.trim()).filter(Boolean))) as string[];
  return schools.map((school) => {
    const rows = verified.filter((story) => story.school?.trim() === school);
    const examPasses = rows.filter((story) => ["nclex_pass", "rex_pn_pass", "cnple_pass", "fnp_pass", "pmhnp_pass", "hesi_a2_success", "ati_teas_success", "casper_success"].includes(story.category)).length;
    const admissions = rows.filter((story) => story.category === "program_admission").length;
    const placements = rows.filter((story) => story.category === "clinical_placement_success").length;
    const employment = rows.filter((story) => story.category === "first_healthcare_job").length;
    const professionsRepresented = Array.from(new Set(rows.map((story) => story.profession)));
    const strongestOutcome = [
      { label: "Exam Passes", value: examPasses },
      { label: "Admissions", value: admissions },
      { label: "Clinical Placements", value: placements },
      { label: "Employment Outcomes", value: employment },
    ].sort((a, b) => b.value - a.value)[0]?.label ?? "Verified Stories";

    return {
      school,
      verifiedStories: rows.length,
      examPasses,
      admissions,
      placements,
      employment,
      professionsRepresented,
      strongestOutcome,
    };
  });
}

