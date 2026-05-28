export type SeoTierValueKey =
  | "rn"
  | "rpn"
  | "np"
  | "allied"
  | "newGrad"
  | "preNursing";

export type TierComparisonMetricKey =
  | "questions"
  | "lessons"
  | "flashcards"
  | "clinicalSkills"
  | "pharmacology"
  | "ecg"
  | "advancedEcg"
  | "caseStudies"
  | "catExams"
  | "loftExams"
  | "ngnQuestions"
  | "adaptiveLearning"
  | "readinessTracking"
  | "analytics"
  | "dailyQuestions";

export type MarketingMetricSource =
  | "databaseInventory"
  | "pricingCatalog"
  | "pathwayCatalog"
  | "featureRegistry"
  | "plannedRoadmap";

export type TierMetricValue = {
  label: string;
  source: MarketingMetricSource;
  evidencePath: string;
  isPlanned?: boolean;
};

export type SeoTierValueProfile = {
  key: SeoTierValueKey;
  label: string;
  canonicalPath: string;
  primaryKeywords: string[];
  examSpecificContent: string[];
  countrySpecificContent: string[];
  includedFeatures: string[];
  internalLinks: Array<{ label: string; href: string; intent: string }>;
};

export type SeoFaqCategory =
  | "Subscriptions"
  | "Billing"
  | "Refunds"
  | "Exam Prep"
  | "NCLEX"
  | "REx-PN"
  | "CNPLE"
  | "NP Exams"
  | "Clinical Skills"
  | "Pharmacology"
  | "ECG"
  | "Adaptive Learning"
  | "Flashcards"
  | "CAT Exams"
  | "Simulations"
  | "Mobile Access"
  | "Study Plans"
  | "Question Types"
  | "Readiness Scores"
  | "Progress Tracking";

export type SeoFaqItem = {
  id: string;
  category: SeoFaqCategory;
  question: string;
  answer: string;
  tierKeys: SeoTierValueKey[];
};

export type ScreenshotProofTarget = {
  key: string;
  route: string;
  audience: "guest" | "authenticated";
  requiredViews: Array<"desktop" | "mobile" | "tablet">;
};

export const SEO_TIER_VALUE_KEYS: SeoTierValueKey[] = [
  "rn",
  "rpn",
  "np",
  "allied",
  "newGrad",
  "preNursing",
];

export const TIER_COMPARISON_METRIC_KEYS: TierComparisonMetricKey[] = [
  "questions",
  "lessons",
  "flashcards",
  "clinicalSkills",
  "pharmacology",
  "ecg",
  "advancedEcg",
  "caseStudies",
  "catExams",
  "loftExams",
  "ngnQuestions",
  "adaptiveLearning",
  "readinessTracking",
  "analytics",
  "dailyQuestions",
];

const inventory = (label: string, evidencePath: string): TierMetricValue => ({
  label,
  source: "databaseInventory",
  evidencePath,
});

const feature = (label: string, evidencePath: string): TierMetricValue => ({
  label,
  source: "featureRegistry",
  evidencePath,
});

const planned = (label: string, evidencePath: string): TierMetricValue => ({
  label,
  source: "plannedRoadmap",
  evidencePath,
  isPlanned: true,
});

export const SEO_TIER_VALUE_PROFILES: Record<
  SeoTierValueKey,
  SeoTierValueProfile
> = {
  rn: {
    key: "rn",
    label: "RN / NCLEX-RN",
    canonicalPath: "/rn",
    primaryKeywords: [
      "RN question bank",
      "NCLEX-RN question bank",
      "NCLEX-RN prep",
    ],
    examSpecificContent: [
      "NCLEX-RN",
      "Next Generation NCLEX",
      "SATA",
      "bowtie",
      "matrix",
    ],
    countrySpecificContent: ["United States RN", "Canadian RN readiness"],
    includedFeatures: [
      "Practice questions with rationales",
      "CAT exams",
      "Lessons",
      "Flashcards",
      "Clinical skills",
      "Pharmacology",
      "ECG",
      "Readiness analytics",
    ],
    internalLinks: [
      { label: "Pricing", href: "/pricing", intent: "subscription comparison" },
      {
        label: "Questions",
        href: "/rn/questions",
        intent: "RN practice question discovery",
      },
      { label: "Lessons", href: "/rn/lessons", intent: "RN lesson discovery" },
      {
        label: "Flashcards",
        href: "/flashcards",
        intent: "retrieval practice",
      },
      {
        label: "Clinical Skills",
        href: "/clinical-skills",
        intent: "clinical readiness",
      },
      {
        label: "Pharmacology",
        href: "/pharmacology",
        intent: "medication readiness",
      },
      { label: "ECG", href: "/modules/ecg", intent: "rhythm interpretation" },
      { label: "Blog", href: "/blog", intent: "authority content" },
    ],
  },
  rpn: {
    key: "rpn",
    label: "RPN / PN",
    canonicalPath: "/pn",
    primaryKeywords: [
      "REx-PN prep",
      "CNPLE preparation",
      "practical nursing question bank",
    ],
    examSpecificContent: ["REx-PN", "CNPLE", "NCLEX-PN", "LOFT"],
    countrySpecificContent: ["Canada RPN", "United States PN/LVN/LPN"],
    includedFeatures: [
      "Practical nursing questions",
      "CAT exams",
      "LOFT exam support where applicable",
      "Lessons",
      "Flashcards",
      "Clinical skills",
      "Pharmacology",
      "Readiness analytics",
    ],
    internalLinks: [
      { label: "Pricing", href: "/pricing", intent: "subscription comparison" },
      {
        label: "Questions",
        href: "/pn/questions",
        intent: "PN practice question discovery",
      },
      { label: "Lessons", href: "/pn/lessons", intent: "PN lesson discovery" },
      {
        label: "Flashcards",
        href: "/flashcards",
        intent: "retrieval practice",
      },
      {
        label: "Clinical Skills",
        href: "/clinical-skills",
        intent: "clinical readiness",
      },
      {
        label: "Pharmacology",
        href: "/pharmacology",
        intent: "medication readiness",
      },
      { label: "ECG", href: "/modules/ecg", intent: "rhythm interpretation" },
      { label: "Blog", href: "/blog", intent: "authority content" },
    ],
  },
  np: {
    key: "np",
    label: "Nurse Practitioner",
    canonicalPath: "/np",
    primaryKeywords: [
      "Nurse practitioner exam prep",
      "NP exam questions",
      "NP certification prep",
    ],
    examSpecificContent: [
      "CNPLE",
      "AANP-style review",
      "ANCC-style review",
      "primary care cases",
    ],
    countrySpecificContent: ["Canada NP", "United States NP"],
    includedFeatures: [
      "NP-level clinical questions",
      "Case-based lessons",
      "Flashcards",
      "Clinical decision-making",
      "Pharmacology",
      "ECG",
      "Advanced ECG add-on clarity",
      "Readiness analytics",
    ],
    internalLinks: [
      { label: "Pricing", href: "/pricing", intent: "subscription comparison" },
      {
        label: "Questions",
        href: "/np/questions",
        intent: "NP practice question discovery",
      },
      { label: "Lessons", href: "/np/lessons", intent: "NP lesson discovery" },
      {
        label: "Flashcards",
        href: "/flashcards",
        intent: "retrieval practice",
      },
      {
        label: "Clinical Skills",
        href: "/clinical-skills",
        intent: "clinical readiness",
      },
      {
        label: "Pharmacology",
        href: "/pharmacology",
        intent: "medication readiness",
      },
      { label: "ECG", href: "/modules/ecg", intent: "rhythm interpretation" },
      { label: "Blog", href: "/blog", intent: "authority content" },
    ],
  },
  allied: {
    key: "allied",
    label: "Allied Health",
    canonicalPath: "/allied-health",
    primaryKeywords: [
      "Respiratory therapy practice questions",
      "paramedic practice questions",
      "pharmacy technician practice questions",
    ],
    examSpecificContent: [
      "RRT",
      "MLT",
      "Paramedic",
      "Pharmacy Technician",
      "Medical Imaging",
    ],
    countrySpecificContent: [
      "Canada allied health",
      "United States allied health",
    ],
    includedFeatures: [
      "Career-scoped questions",
      "Lessons",
      "Flashcards",
      "Clinical scenarios",
      "Pharmacology where relevant",
      "ECG for applicable careers",
      "Profession-specific pathways",
    ],
    internalLinks: [
      { label: "Pricing", href: "/pricing", intent: "subscription comparison" },
      {
        label: "Questions",
        href: "/allied-health/questions",
        intent: "allied practice question discovery",
      },
      {
        label: "Lessons",
        href: "/allied-health/lessons",
        intent: "allied lesson discovery",
      },
      {
        label: "Flashcards",
        href: "/allied-health/flashcards",
        intent: "retrieval practice",
      },
      {
        label: "Clinical Skills",
        href: "/clinical-skills",
        intent: "clinical readiness",
      },
      {
        label: "Pharmacology",
        href: "/pharmacology",
        intent: "medication readiness",
      },
      { label: "ECG", href: "/modules/ecg", intent: "rhythm interpretation" },
      { label: "Blog", href: "/blog", intent: "authority content" },
    ],
  },
  newGrad: {
    key: "newGrad",
    label: "New Grad",
    canonicalPath: "/new-grad",
    primaryKeywords: [
      "new grad nurse program",
      "new nurse transition support",
      "nursing residency prep",
    ],
    examSpecificContent: [
      "Transition to practice",
      "first-year nursing",
      "clinical judgment",
    ],
    countrySpecificContent: ["Canada new grad", "United States new grad"],
    includedFeatures: [
      "Transition-to-practice lessons",
      "Clinical scenarios",
      "Flashcards",
      "Clinical skills",
      "Pharmacology refreshers",
      "Readiness and progress support",
    ],
    internalLinks: [
      { label: "Pricing", href: "/pricing", intent: "subscription comparison" },
      {
        label: "Questions",
        href: "/new-grad/questions",
        intent: "new grad scenario discovery",
      },
      {
        label: "Lessons",
        href: "/new-grad/lessons",
        intent: "new grad lesson discovery",
      },
      {
        label: "Flashcards",
        href: "/flashcards",
        intent: "retrieval practice",
      },
      {
        label: "Clinical Skills",
        href: "/clinical-skills",
        intent: "clinical readiness",
      },
      {
        label: "Pharmacology",
        href: "/pharmacology",
        intent: "medication readiness",
      },
      { label: "ECG", href: "/modules/ecg", intent: "rhythm interpretation" },
      { label: "Blog", href: "/blog", intent: "authority content" },
    ],
  },
  preNursing: {
    key: "preNursing",
    label: "Pre-Nursing",
    canonicalPath: "/pre-nursing",
    primaryKeywords: [
      "pre nursing prep",
      "nursing school readiness",
      "pre nursing study guide",
    ],
    examSpecificContent: [
      "Foundational nursing readiness",
      "study skills",
      "prerequisite review",
    ],
    countrySpecificContent: ["Canada pre-nursing", "United States pre-nursing"],
    includedFeatures: [
      "Free readiness orientation",
      "Foundational study support",
      "Pathway guidance",
      "Upgrade path into exam-specific tiers",
    ],
    internalLinks: [
      { label: "Pricing", href: "/pricing", intent: "subscription comparison" },
      {
        label: "Questions",
        href: "/practice-exams",
        intent: "question discovery",
      },
      { label: "Lessons", href: "/lessons", intent: "lesson discovery" },
      {
        label: "Flashcards",
        href: "/flashcards",
        intent: "retrieval practice",
      },
      {
        label: "Clinical Skills",
        href: "/clinical-skills",
        intent: "clinical readiness",
      },
      {
        label: "Pharmacology",
        href: "/pharmacology",
        intent: "medication readiness",
      },
      { label: "ECG", href: "/modules/ecg", intent: "rhythm interpretation" },
      { label: "Blog", href: "/blog", intent: "authority content" },
    ],
  },
};

export const TIER_FEATURE_COMPARISON: Record<
  TierComparisonMetricKey,
  Record<Exclude<SeoTierValueKey, "preNursing">, TierMetricValue>
> = {
  questions: {
    rn: inventory(
      "Inventory-backed NCLEX-RN question count",
      "prisma.examQuestion.count where tier=RN",
    ),
    rpn: inventory(
      "Inventory-backed RPN/PN question count",
      "prisma.examQuestion.count where tier in RPN/LVN_LPN",
    ),
    np: inventory(
      "Inventory-backed NP question count",
      "prisma.examQuestion.count where tier=NP",
    ),
    allied: inventory(
      "Inventory-backed allied career question counts",
      "allied profession registry + question inventory",
    ),
    newGrad: inventory(
      "Inventory-backed new grad scenario/question count",
      "new-grad content inventory",
    ),
  },
  lessons: {
    rn: inventory(
      "Inventory-backed RN lesson count",
      "prisma.pathwayLesson.count for RN pathways",
    ),
    rpn: inventory(
      "Inventory-backed RPN/PN lesson count",
      "prisma.pathwayLesson.count for PN pathways",
    ),
    np: inventory(
      "Inventory-backed NP lesson count",
      "prisma.pathwayLesson.count for NP pathways",
    ),
    allied: inventory(
      "Inventory-backed allied lesson count by career",
      "allied lesson inventory",
    ),
    newGrad: inventory(
      "Inventory-backed new grad lesson count",
      "new-grad lesson inventory",
    ),
  },
  flashcards: {
    rn: inventory(
      "Inventory-backed RN flashcard count",
      "flashcard_bank scope RN",
    ),
    rpn: inventory(
      "Inventory-backed RPN/PN flashcard count",
      "flashcard_bank scope RPN/LVN_LPN",
    ),
    np: inventory(
      "Inventory-backed NP flashcard count",
      "flashcard_bank scope NP",
    ),
    allied: inventory(
      "Inventory-backed allied flashcard count",
      "flashcard_bank allied scopes",
    ),
    newGrad: inventory(
      "Inventory-backed new grad flashcard count",
      "flashcard_bank new grad scope",
    ),
  },
  clinicalSkills: {
    rn: feature(
      "Role-scoped clinical skills pathway",
      "src/components/marketing/pricing-clinical-skills-workstation-feature.tsx",
    ),
    rpn: feature(
      "Practical nursing clinical skills pathway",
      "src/components/marketing/pricing-clinical-skills-workstation-feature.tsx",
    ),
    np: feature(
      "Advanced clinical decision support",
      "src/components/marketing/pricing-clinical-skills-workstation-feature.tsx",
    ),
    allied: feature(
      "Profession-scoped clinical skills where applicable",
      "src/components/marketing/allied-health-pathway-hub.tsx",
    ),
    newGrad: feature(
      "Transition-to-practice clinical skills",
      "src/components/marketing/new-grad-marketing-landing.tsx",
    ),
  },
  pharmacology: {
    rn: feature(
      "RN pharmacology training",
      "src/components/marketing/pricing-clinical-readiness-ecosystem.tsx",
    ),
    rpn: feature(
      "PN pharmacology training",
      "src/components/marketing/pricing-clinical-readiness-ecosystem.tsx",
    ),
    np: feature(
      "NP pharmacology and prescribing readiness",
      "src/components/marketing/np-premium-hub-workstation.tsx",
    ),
    allied: feature(
      "Career-relevant pharmacology",
      "client/src/allied/pages/rrt-pharmacology-hub.tsx",
    ),
    newGrad: feature(
      "New grad medication safety refreshers",
      "src/components/marketing/new-grad-marketing-landing.tsx",
    ),
  },
  ecg: {
    rn: feature(
      "Core ECG module",
      "src/components/marketing/pricing-ecg-clarity-block.tsx",
    ),
    rpn: feature(
      "Core ECG module where in scope",
      "src/components/marketing/pricing-ecg-clarity-block.tsx",
    ),
    np: feature(
      "Core ECG module plus advanced add-on positioning",
      "src/components/marketing/pricing-advanced-ecg-add-on.tsx",
    ),
    allied: feature(
      "ECG for applicable allied careers",
      "client/src/allied/pages/paramedic/ecg-library.tsx",
    ),
    newGrad: feature(
      "Core ECG learning path",
      "src/components/marketing/pricing-ecg-clarity-block.tsx",
    ),
  },
  advancedEcg: {
    rn: feature(
      "Separate advanced ECG add-on clarity",
      "src/components/marketing/pricing-advanced-ecg-add-on.tsx",
    ),
    rpn: feature(
      "Separate advanced ECG add-on clarity",
      "src/components/marketing/pricing-advanced-ecg-add-on.tsx",
    ),
    np: feature(
      "Separate advanced ECG add-on clarity",
      "src/components/marketing/pricing-advanced-ecg-add-on.tsx",
    ),
    allied: feature(
      "Separate advanced ECG add-on when applicable",
      "src/components/marketing/pricing-advanced-ecg-add-on.tsx",
    ),
    newGrad: feature(
      "Separate advanced ECG add-on clarity",
      "src/components/marketing/pricing-advanced-ecg-add-on.tsx",
    ),
  },
  caseStudies: {
    rn: inventory(
      "Inventory-backed RN case study count",
      "exam question inventory by case-study type",
    ),
    rpn: inventory(
      "Inventory-backed PN case study count",
      "exam question inventory by case-study type",
    ),
    np: inventory(
      "Inventory-backed NP case study count",
      "exam question inventory by case-study type",
    ),
    allied: inventory(
      "Inventory-backed allied scenario/case count",
      "allied scenario inventory",
    ),
    newGrad: inventory(
      "Inventory-backed new grad scenario count",
      "new-grad scenario inventory",
    ),
  },
  catExams: {
    rn: feature("RN CAT exams", "src/app/api/cat/start/route.ts"),
    rpn: feature("PN CAT exams", "src/app/api/cat/start/route.ts"),
    np: feature("NP CAT exams", "src/app/api/cat/start/route.ts"),
    allied: feature(
      "Allied adaptive practice/CAT where career supports it",
      "client/src/allied/pages/mlt/mlt-admin-cat.tsx",
    ),
    newGrad: planned(
      "Readiness-style adaptive assessment planned",
      "docs/premium-differentiation-retention-program.md",
    ),
  },
  loftExams: {
    rn: feature(
      "Not the RN primary exam model",
      "src/lib/testing-model-presentation",
    ),
    rpn: feature(
      "LOFT support for CNPLE-style readiness",
      "tests/contracts/np-loft-exam-shell-rollout.contract.test.ts",
    ),
    np: feature(
      "LOFT support for CNPLE/NP surfaces",
      "tests/contracts/np-loft-exam-shell-rollout.contract.test.ts",
    ),
    allied: planned(
      "No broad allied LOFT claim until career inventory supports it",
      "docs/governance/ecosystem-platform-guardrails.mdc",
    ),
    newGrad: planned(
      "No public LOFT claim for new grad",
      "docs/governance/ecosystem-platform-guardrails.mdc",
    ),
  },
  ngnQuestions: {
    rn: inventory(
      "Inventory-backed NGN item count",
      "exam question inventory by NGN type",
    ),
    rpn: inventory(
      "Inventory-backed NGN/PN item count where applicable",
      "exam question inventory by item type",
    ),
    np: inventory(
      "Inventory-backed case-format item count",
      "exam question inventory by item type",
    ),
    allied: inventory(
      "Inventory-backed career-specific item type count",
      "allied question inventory",
    ),
    newGrad: inventory(
      "Inventory-backed scenario item count",
      "new-grad question inventory",
    ),
  },
  adaptiveLearning: {
    rn: feature(
      "Adaptive study loops and remediation",
      "src/lib/learner/rn-coaching-intelligence",
    ),
    rpn: feature(
      "Adaptive practice and remediation",
      "src/app/api/cat/start/route.ts",
    ),
    np: feature(
      "Adaptive practice and specialty scoping",
      "src/lib/exam-pathways/np-practice-test-segments.ts",
    ),
    allied: feature(
      "Adaptive practice where career supports it",
      "client/src/allied/pages/mlt/mlt-adaptive-practice.tsx",
    ),
    newGrad: feature(
      "Adaptive learning hooks through shared learner pathways",
      "src/components/marketing/new-grad-marketing-landing.tsx",
    ),
  },
  readinessTracking: {
    rn: feature(
      "Readiness/progress surfaces",
      "src/app/(student)/app/(learner)/account/readiness/page.tsx",
    ),
    rpn: feature(
      "Readiness/progress surfaces",
      "src/app/(student)/app/(learner)/account/readiness/page.tsx",
    ),
    np: feature(
      "Readiness/progress surfaces",
      "src/app/(student)/app/(learner)/account/readiness/page.tsx",
    ),
    allied: feature(
      "Readiness/progress surfaces where learner path supports it",
      "src/app/(student)/app/(learner)/account/readiness/page.tsx",
    ),
    newGrad: feature(
      "Transition readiness support",
      "src/components/marketing/new-grad-marketing-landing.tsx",
    ),
  },
  analytics: {
    rn: feature(
      "Learner analytics and report-card surfaces",
      "src/app/(student)/app/(learner)/account/analytics/page.tsx",
    ),
    rpn: feature(
      "Learner analytics and report-card surfaces",
      "src/app/(student)/app/(learner)/account/analytics/page.tsx",
    ),
    np: feature(
      "Learner analytics and report-card surfaces",
      "src/app/(student)/app/(learner)/account/analytics/page.tsx",
    ),
    allied: feature(
      "Allied analytics where implemented",
      "client/src/allied/allied-analytics.ts",
    ),
    newGrad: feature(
      "Progress analytics through shared learner account",
      "src/app/(student)/app/(learner)/account/analytics/page.tsx",
    ),
  },
  dailyQuestions: {
    rn: planned(
      "Daily learning ecosystem source required before public counts",
      "docs/premium-differentiation-retention-program.md",
    ),
    rpn: planned(
      "Daily learning ecosystem source required before public counts",
      "docs/premium-differentiation-retention-program.md",
    ),
    np: planned(
      "Daily learning ecosystem source required before public counts",
      "docs/premium-differentiation-retention-program.md",
    ),
    allied: planned(
      "Daily learning ecosystem source required before public counts",
      "docs/premium-differentiation-retention-program.md",
    ),
    newGrad: planned(
      "Daily learning ecosystem source required before public counts",
      "docs/premium-differentiation-retention-program.md",
    ),
  },
};

type SeoFaqTuple = readonly [
  id: string,
  category: SeoFaqCategory,
  question: string,
  answer: string,
  tierKeys: readonly SeoTierValueKey[],
];

const allTiers = SEO_TIER_VALUE_KEYS;

export const SEO_PRICING_FAQ_BANK: SeoFaqItem[] = (
  [
    [
      "subscriptions-1",
      "Subscriptions",
      "What is included with a NurseNest subscription?",
      "A paid subscription unlocks the learner pathway for the selected tier, including the scoped question bank, lessons, flashcards, analytics, remediation, and clinical learning modules that are available for that tier.",
      allTiers,
    ],
    [
      "subscriptions-2",
      "Subscriptions",
      "Can I switch tiers after subscribing?",
      "Tier changes should follow the account and billing flow so exam scope, country scope, and entitlement behavior remain consistent.",
      allTiers,
    ],
    [
      "subscriptions-3",
      "Subscriptions",
      "Is Pre-Nursing a paid subscription?",
      "Pre-Nursing is positioned separately from Stripe-billed paid exam tiers and should not be marketed as a paid pricing-card plan unless billing rules change.",
      ["preNursing"],
    ],
    [
      "billing-1",
      "Billing",
      "Can I cancel anytime?",
      "Cancellation should be handled through the account billing flow. Access rules after cancellation must match the live subscription and entitlement policy.",
      allTiers,
    ],
    [
      "billing-2",
      "Billing",
      "Are prices shown monthly or by term?",
      "Pricing cards should use the centralized pricing catalog so monthly, multi-month, and yearly labels match Stripe-backed plan configuration.",
      allTiers,
    ],
    [
      "billing-3",
      "Billing",
      "Does Allied Health pricing cover every profession?",
      "Allied Health billing is career-scoped. Marketing must make clear when a subscription applies to one selected allied pathway rather than every allied profession.",
      ["allied"],
    ],
    [
      "refunds-1",
      "Refunds",
      "What is the refund policy?",
      "Refund language should link to the current policy and avoid unsupported pass-guarantee claims.",
      allTiers,
    ],
    [
      "refunds-2",
      "Refunds",
      "Do you guarantee that I will pass?",
      "NurseNest can support preparation and readiness tracking, but public copy should not promise a passing outcome.",
      allTiers,
    ],
    [
      "exam-prep-1",
      "Exam Prep",
      "How many questions are included?",
      "Public counts should be generated from the content inventory at build time or request time instead of hardcoded into marketing copy.",
      allTiers,
    ],
    [
      "exam-prep-2",
      "Exam Prep",
      "How often is content updated?",
      "Content-update claims should reference the active content pipeline, recent release notes, or verified inventory reports.",
      allTiers,
    ],
    [
      "exam-prep-3",
      "Exam Prep",
      "Can I study by weak topic?",
      "Learners should be guided by performance history, missed topics, and remediation pathways where those signals exist for the tier.",
      allTiers,
    ],
    [
      "nclex-1",
      "NCLEX",
      "Does NurseNest include NCLEX-RN practice questions?",
      "The RN pathway should describe NCLEX-RN scoped practice, rationales, CAT exams, NGN-style formats, and readiness analytics when backed by inventory.",
      ["rn"],
    ],
    [
      "nclex-2",
      "NCLEX",
      "Does NurseNest include NGN question types?",
      "NGN claims should list only item types present in the verified question inventory, such as SATA, bowtie, matrix, or case-study items.",
      ["rn", "rpn"],
    ],
    [
      "nclex-3",
      "NCLEX",
      "How are CAT exams different from practice exams?",
      "CAT exams adapt selection and scoring around exam readiness, while practice exams can be fixed-form review sets or topic-targeted drills.",
      ["rn", "rpn", "np", "allied"],
    ],
    [
      "rex-pn-1",
      "REx-PN",
      "Does NurseNest support REx-PN preparation?",
      "The PN/RPN pathway should explain Canada-specific practical nursing scope, REx-PN readiness, and practical nursing clinical judgment.",
      ["rpn"],
    ],
    [
      "rex-pn-2",
      "REx-PN",
      "Is REx-PN content separate from RN content?",
      "REx-PN marketing should emphasize tier scoping so practical nursing learners are not shown RN-only content as a core promise.",
      ["rpn"],
    ],
    [
      "cnple-1",
      "CNPLE",
      "Does NurseNest support CNPLE preparation?",
      "CNPLE claims should be tied to verified NP/RPN content and any LOFT-style surfaces that are present for that pathway.",
      ["rpn", "np"],
    ],
    [
      "cnple-2",
      "CNPLE",
      "What is LOFT?",
      "LOFT copy should describe the applicable exam-style learning model without borrowing CAT psychometric language where the platform intentionally separates those concepts.",
      ["rpn", "np"],
    ],
    [
      "np-exams-1",
      "NP Exams",
      "What is included for nurse practitioner learners?",
      "NP marketing should emphasize primary care reasoning, case-based practice, advanced pharmacology, ECG relevance, and specialty scoping backed by the NP inventory.",
      ["np"],
    ],
    [
      "np-exams-2",
      "NP Exams",
      "Does NP include entry-level nursing questions?",
      "NP pathways should avoid positioning entry-level RN or PN questions as the core NP experience unless they are explicitly marked as prerequisite remediation.",
      ["np"],
    ],
    [
      "clinical-skills-1",
      "Clinical Skills",
      "What is included in Clinical Skills?",
      "Clinical Skills should be described as lessons, practice, simulations or remediation only where the implemented tier path provides those assets.",
      allTiers,
    ],
    [
      "clinical-skills-2",
      "Clinical Skills",
      "Are clinical skills tied to exam readiness?",
      "Clinical skill activity can feed readiness messaging only when learner performance events are captured by the readiness system.",
      allTiers,
    ],
    [
      "clinical-skills-3",
      "Clinical Skills",
      "Does Clinical Skills include documentation and SBAR?",
      "Documentation, SBAR, communication, medication administration, and safety claims should be surfaced only when backed by module inventory.",
      allTiers,
    ],
    [
      "pharmacology-1",
      "Pharmacology",
      "How does pharmacology training work?",
      "Pharmacology should connect medication classes, clinical application, flashcards, questions, and remediation where those resources exist for the learner's tier.",
      allTiers,
    ],
    [
      "pharmacology-2",
      "Pharmacology",
      "Does pharmacology include natural supplements?",
      "Natural supplement claims should be published only from a verified pharmacology inventory that includes supplement lessons, cards, or questions.",
      ["rn", "rpn", "np", "allied"],
    ],
    [
      "pharmacology-3",
      "Pharmacology",
      "Is pharmacology different for NP learners?",
      "NP pharmacology can be positioned around advanced clinical decision-making and prescribing readiness when backed by NP-specific lessons and cases.",
      ["np"],
    ],
    [
      "ecg-1",
      "ECG",
      "What is included in the ECG module?",
      "Core ECG copy should mention rhythm interpretation and clinical response only where the route and module inventory support it.",
      ["rn", "rpn", "np", "allied", "newGrad"],
    ],
    [
      "ecg-2",
      "ECG",
      "Is Advanced ECG included?",
      "Advanced ECG must remain clearly positioned as a separate premium capability or add-on unless entitlement policy changes.",
      ["rn", "rpn", "np", "allied", "newGrad"],
    ],
    [
      "ecg-3",
      "ECG",
      "Does ECG include telemetry and pacemakers?",
      "Telemetry, pacemakers, STEMI localization, hemodynamics, and medication implications should be listed only from verified Advanced ECG inventory.",
      ["rn", "np", "allied"],
    ],
    [
      "adaptive-1",
      "Adaptive Learning",
      "How does adaptive learning work?",
      "Adaptive learning should be described as question selection, remediation, weak-topic detection, and study planning based on longitudinal learner activity.",
      allTiers,
    ],
    [
      "adaptive-2",
      "Adaptive Learning",
      "Will my study plan adjust automatically?",
      "Automatic adjustment should be claimed only where learner state, study-plan orchestration, and completion telemetry are wired together.",
      allTiers,
    ],
    [
      "adaptive-3",
      "Adaptive Learning",
      "Does NurseNest detect weak topics?",
      "Weak-topic detection should reference performance history, missed domains, flashcard mastery, lesson completion, and remediation signals where available.",
      allTiers,
    ],
    [
      "flashcards-1",
      "Flashcards",
      "How do flashcards fit into exam prep?",
      "Flashcards support spaced retrieval and should feed readiness copy only when mastery data is captured for the learner.",
      allTiers,
    ],
    [
      "flashcards-2",
      "Flashcards",
      "How many flashcards are included?",
      "Flashcard counts should be generated from flashcard_bank inventory filters by tier, country, and pathway rather than written manually.",
      allTiers,
    ],
    [
      "flashcards-3",
      "Flashcards",
      "Are flashcards separate from lessons?",
      "Flashcards should be linked back to lessons, topics, and remediation pathways so they feel like one learning loop.",
      allTiers,
    ],
    [
      "cat-1",
      "CAT Exams",
      "What is a CAT exam?",
      "CAT exams adapt to learner performance and should be scoped by exam and tier before adaptive selection occurs.",
      ["rn", "rpn", "np", "allied"],
    ],
    [
      "cat-2",
      "CAT Exams",
      "How many CAT exams can I take?",
      "Attempt and availability claims should come from current product rules, not static copy.",
      ["rn", "rpn", "np", "allied"],
    ],
    [
      "cat-3",
      "CAT Exams",
      "Does CAT determine my full readiness score?",
      "No single exam should determine readiness; readiness should combine CAT, practice, flashcards, lessons, skills, pharmacology, ECG, trend, and consistency.",
      ["rn", "rpn", "np", "allied"],
    ],
    [
      "simulations-1",
      "Simulations",
      "Does NurseNest include simulations?",
      "Simulation claims must be tied to real implemented modules and should avoid placeholder language.",
      allTiers,
    ],
    [
      "simulations-2",
      "Simulations",
      "Are simulations included in every tier?",
      "Simulation access should be listed per tier only when the route, entitlement, and content inventory support it.",
      allTiers,
    ],
    [
      "mobile-1",
      "Mobile Access",
      "Can I study on mobile?",
      "Marketing may state mobile access only after route-level responsive checks confirm no clipping, overflow, hidden controls, or inaccessible buttons.",
      allTiers,
    ],
    [
      "mobile-2",
      "Mobile Access",
      "Does CAT work on mobile?",
      "CAT mobile claims should be backed by Playwright/mobile audit evidence for launch, question interaction, completion, and results.",
      ["rn", "rpn", "np", "allied"],
    ],
    [
      "study-plans-1",
      "Study Plans",
      "Does NurseNest create study plans?",
      "Study-plan copy should describe implemented daily, weekly, countdown, or remediation plans only when generated by platform logic.",
      allTiers,
    ],
    [
      "study-plans-2",
      "Study Plans",
      "Can I use NurseNest if my exam is soon?",
      "Countdown planning can be described when the app has exam-date preferences and study-plan adjustment logic wired to the learner state.",
      allTiers,
    ],
    [
      "question-types-1",
      "Question Types",
      "What question types are included?",
      "Question-type lists should be generated from the question inventory and can include multiple choice, SATA, matrix, bowtie, case studies, prioritization, and delegation when present.",
      allTiers,
    ],
    [
      "question-types-2",
      "Question Types",
      "Are rationales included?",
      "Rationale claims should be made only for inventories that include answer explanations for the selected tier.",
      allTiers,
    ],
    [
      "question-types-3",
      "Question Types",
      "Are hints included?",
      "Hint claims should be limited to question modes that actually render hints.",
      allTiers,
    ],
    [
      "readiness-1",
      "Readiness Scores",
      "What is exam readiness?",
      "Readiness should be a longitudinal score using multiple learning signals, not just a recent practice-test percentage.",
      allTiers,
    ],
    [
      "readiness-2",
      "Readiness Scores",
      "What do Not Ready, Developing, Near Ready, and Exam Ready mean?",
      "Readiness labels should map to a documented scoring band and should be presented as learning guidance, not a pass guarantee.",
      allTiers,
    ],
    [
      "readiness-3",
      "Readiness Scores",
      "Does readiness include flashcards and lessons?",
      "Readiness can include flashcard mastery and lesson completion when those signals are captured and weighted in the readiness calculation.",
      allTiers,
    ],
    [
      "progress-1",
      "Progress Tracking",
      "What progress does NurseNest track?",
      "Progress tracking can include questions answered, lessons completed, flashcards reviewed, CAT performance, streaks, remediation, and module activity when available.",
      allTiers,
    ],
    [
      "progress-2",
      "Progress Tracking",
      "Can I see historical improvement?",
      "Historical comparison should use stored learner activity and report-card snapshots rather than only current-session percentages.",
      allTiers,
    ],
    [
      "progress-3",
      "Progress Tracking",
      "Can admins see learner engagement?",
      "Admin analytics and chargeback evidence claims should be limited to server-side tracked activity, subscription, and access history.",
      allTiers,
    ],
    [
      "subscriptions-4",
      "Subscriptions",
      "What makes upgrading valuable?",
      "Upgrading should unlock deeper exam-specific scope, adaptive readiness tools, clinical modules, analytics, and remediation pathways that are verified for the selected tier.",
      allTiers,
    ],
    [
      "exam-prep-4",
      "Exam Prep",
      "Which countries are supported?",
      "Country support should follow route, exam, and entitlement configuration so Canada, United States, and allied pathways are not mixed accidentally.",
      allTiers,
    ],
    [
      "np-exams-3",
      "NP Exams",
      "Does NP include CNPLE-specific support?",
      "CNPLE-specific claims should link to Canada NP pages and the verified CNPLE/LOFT inventory where available.",
      ["np"],
    ],
    [
      "clinical-skills-4",
      "Clinical Skills",
      "Do clinical skills include patient teaching?",
      "Patient teaching should be promoted only where skills content includes teaching objectives, practice, or remediation assets.",
      allTiers,
    ],
    [
      "pharmacology-4",
      "Pharmacology",
      "Can I practice medication safety?",
      "Medication safety claims should be tied to pharmacology questions, medication administration skills, and clinical application cases.",
      allTiers,
    ],
    [
      "ecg-4",
      "ECG",
      "Does ECG connect to clinical response?",
      "Clinical response claims should connect rhythm recognition to prioritization, escalation, medication implications, and hemodynamics where implemented.",
      ["rn", "np", "allied", "newGrad"],
    ],
    [
      "adaptive-4",
      "Adaptive Learning",
      "Does adaptive learning replace studying?",
      "Adaptive learning organizes practice and remediation, but learners still need consistent study, lessons, flashcards, and clinical reasoning practice.",
      allTiers,
    ],
    [
      "billing-4",
      "Billing",
      "Can institutions purchase NurseNest?",
      "Institutional pricing should route to sales or enterprise workflows rather than individual Stripe checkout when cohort licensing is needed.",
      allTiers,
    ],
    [
      "refunds-3",
      "Refunds",
      "Can I access content after cancelling?",
      "Post-cancellation access should follow the active subscription period and entitlement policy shown in account billing.",
      allTiers,
    ],
  ] satisfies SeoFaqTuple[]
).map(([id, category, question, answer, tierKeys]) => ({
  id,
  category,
  question,
  answer,
  tierKeys: [...tierKeys],
}));

export const SCREENSHOT_PROOF_TARGETS: ScreenshotProofTarget[] = [
  {
    key: "questions",
    route: "/app/practice-tests",
    audience: "authenticated",
    requiredViews: ["desktop", "mobile"],
  },
  {
    key: "flashcards",
    route: "/app/flashcards",
    audience: "authenticated",
    requiredViews: ["desktop", "mobile"],
  },
  {
    key: "lessons",
    route: "/app/lessons",
    audience: "authenticated",
    requiredViews: ["desktop", "mobile"],
  },
  {
    key: "cat",
    route: "/app/cat",
    audience: "authenticated",
    requiredViews: ["desktop", "mobile"],
  },
  {
    key: "clinical-skills",
    route: "/app/clinical-skills",
    audience: "authenticated",
    requiredViews: ["desktop", "mobile"],
  },
  {
    key: "pharmacology",
    route: "/app/pharmacology",
    audience: "authenticated",
    requiredViews: ["desktop", "mobile"],
  },
  {
    key: "ecg",
    route: "/modules/ecg",
    audience: "guest",
    requiredViews: ["desktop", "mobile"],
  },
  {
    key: "analytics",
    route: "/app/account/analytics",
    audience: "authenticated",
    requiredViews: ["desktop", "mobile", "tablet"],
  },
];

export function buildSeoFaqPageJsonLd(items: SeoFaqItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}

export function buildTierBreadcrumbJsonLd(profile: SeoTierValueProfile) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "/" },
      { "@type": "ListItem", position: 2, name: "Pricing", item: "/pricing" },
      {
        "@type": "ListItem",
        position: 3,
        name: profile.label,
        item: profile.canonicalPath,
      },
    ],
  };
}

export function buildTierSoftwareApplicationJsonLd(
  profile: SeoTierValueProfile,
) {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: `NurseNest ${profile.label}`,
    applicationCategory: "EducationalApplication",
    operatingSystem: "Web",
    url: profile.canonicalPath,
    featureList: profile.includedFeatures,
  };
}

export function buildTierCourseJsonLd(profile: SeoTierValueProfile) {
  return {
    "@context": "https://schema.org",
    "@type": "Course",
    name: `${profile.label} preparation pathway`,
    description: `${profile.label} study pathway with questions, lessons, flashcards, remediation, and clinical readiness support.`,
    provider: {
      "@type": "Organization",
      name: "NurseNest",
      url: "/",
    },
  };
}
