import {
  GENERATED_SCREENSHOT_FALLBACKS as FALLBACK_SHOTS,
  GENERATED_SCREENSHOT_PATHS as SHOTS,
} from "@/lib/marketing/generated-screenshot-registry";

export type TierValueKey =
  | "rn"
  | "pn"
  | "np"
  | "allied"
  | "newgrad"
  | "preNursing";

export type TierValueStageKey =
  | "learn"
  | "practice"
  | "assess"
  | "remediate"
  | "master";

export type TierValueStage = {
  key: TierValueStageKey;
  label: string;
  headline: string;
  body: string;
  outcome: string;
  screenshot: string;
  fallbackScreenshot: string;
  screenshotAlt: string;
  links: Array<{ label: string; href: string }>;
};

export type TierValueExperience = {
  key: TierValueKey;
  label: string;
  tagline: string;
  differentiation: string;
  stages: TierValueStage[];
};

const commonLinks = {
  lessons: { label: "Lessons", href: "/lessons" },
  questions: { label: "Question Bank", href: "/question-bank" },
  flashcards: { label: "Flashcards", href: "/flashcards" },
  cat: { label: "CAT Exams", href: "/cat-nclex-simulator" },
  clinical: { label: "Clinical Skills", href: "/clinical-modules" },
  ecg: { label: "ECG", href: "/ecg-interpretation" },
  readiness: { label: "Readiness", href: "/features" },
};

function stages(args: {
  label: string;
  learn: string;
  practice: string;
  assess: string;
  remediate: string;
  master: string;
  /** Override hub/dashboard screenshot for the learn stage. Defaults to core learner dashboard. */
  learnShot?: string;
  learnFallbackShot?: string;
  /** Override flashcard/practice screenshot for the practice stage. */
  practiceShot?: string;
  practiceFallbackShot?: string;
  /** Override for the assess stage (CAT / LOFT variant). */
  assessShot?: string;
  assessFallbackShot?: string;
}): TierValueStage[] {
  return [
    {
      key: "learn",
      label: "Learn",
      headline: `${args.label} learning starts with clinical context, not memorization.`,
      body: args.learn,
      outcome:
        "Learners build the language, safety habits, and decision frameworks they need before they start drilling questions.",
      screenshot: args.learnShot ?? SHOTS.coreDashboard,
      fallbackScreenshot: args.learnFallbackShot ?? FALLBACK_SHOTS.coreDashboard,
      screenshotAlt: `${args.label} learner dashboard with lesson progress and study streaks`,
      links: [
        commonLinks.lessons,
        commonLinks.flashcards,
        commonLinks.clinical,
      ],
    },
    {
      key: "practice",
      label: "Practice",
      headline: "Practice feels like the exam and teaches after every answer.",
      body: args.practice,
      outcome:
        "Every practice session turns mistakes into a visible next step instead of leaving learners to guess what to review.",
      screenshot: args.practiceShot ?? SHOTS.coreFlashcards,
      fallbackScreenshot: args.practiceFallbackShot ?? FALLBACK_SHOTS.coreFlashcards,
      screenshotAlt: `${args.label} active recall and practice interface`,
      links: [commonLinks.questions, commonLinks.flashcards],
    },
    {
      key: "assess",
      label: "Assess",
      headline:
        "Assessment shows whether performance is holding under exam conditions.",
      body: args.assess,
      outcome:
        "Timed exams, CAT-style progression, LOFT-style simulation where available, and review reports help learners separate familiarity from readiness.",
      screenshot: args.assessShot ?? SHOTS.coreCat,
      fallbackScreenshot: args.assessFallbackShot ?? FALLBACK_SHOTS.coreCat,
      screenshotAlt: `${args.label} CAT and exam trajectory view`,
      links: [commonLinks.cat, commonLinks.questions],
    },
    {
      key: "remediate",
      label: "Remediate",
      headline: "Weaknesses become a plan learners can act on today.",
      body: args.remediate,
      outcome:
        "Adaptive recommendations connect weak topics to lessons, question sets, flashcards, and review work so study time stays focused.",
      screenshot: SHOTS.coreCoaching,
      fallbackScreenshot: FALLBACK_SHOTS.coreCoaching,
      screenshotAlt: `${args.label} coaching panel with targeted recommendations`,
      links: [
        commonLinks.readiness,
        commonLinks.lessons,
        commonLinks.questions,
      ],
    },
    {
      key: "master",
      label: "Master",
      headline: "Progress becomes confidence learners can understand.",
      body: args.master,
      outcome:
        "Readiness scoring, trend tracking, analytics, and performance reports show whether the learner is becoming more consistent over time.",
      screenshot: SHOTS.coreReadiness,
      fallbackScreenshot: FALLBACK_SHOTS.coreReadiness,
      screenshotAlt: `${args.label} readiness score and analytics dashboard`,
      links: [commonLinks.readiness, commonLinks.cat],
    },
  ];
}

export const TIER_VALUE_EXPERIENCES: Record<TierValueKey, TierValueExperience> =
  {
    rn: {
      key: "rn",
      label: "RN",
      tagline:
        "NCLEX-RN preparation built around clinical judgment, NGN practice, and CAT readiness.",
      differentiation:
        "RN learners see how lessons, NGN items, rationales, CAT performance, and readiness analytics work together.",
      stages: stages({
        label: "RN",
        learnShot: SHOTS.rnMarketingHub,
        learnFallbackShot: FALLBACK_SHOTS.rnMarketingHub,
        practiceShot: SHOTS.rnQuestionsMarketing,
        practiceFallbackShot: FALLBACK_SHOTS.rnQuestionsMarketing,
        assessShot: SHOTS.rnCat,
        assessFallbackShot: FALLBACK_SHOTS.rnCat,
        learn:
          "RN lessons, flashcards, clinical skills, pharmacology, and ECG content frame the concepts behind safe entry-to-practice decisions.",
        practice:
          "Learners practice NCLEX-RN style questions with NGN formats including case studies, SATA, bowtie, and matrix items, supported by hints and teaching rationales.",
        assess:
          "CAT readiness and timed exams help learners check whether clinical judgment holds when item difficulty adapts and pacing matters.",
        remediate:
          "Weak-topic analysis points RN learners back to focused rationales, question drills, lesson refreshers, and study plans tied to their misses.",
        master:
          "Readiness scores, performance analytics, trends, and streaks show whether the learner is moving toward exam confidence.",
      }),
    },
    pn: {
      key: "pn",
      label: "RPN / PN",
      tagline:
        "REx-PN, CPNRE, and PN preparation focused on foundational nursing safety and scope.",
      differentiation:
        "PN learners get a guided pathway that reinforces fundamentals while still preparing them for modern item formats.",
      stages: stages({
        label: "RPN / PN",
        learnShot: SHOTS.pnMarketingHub,
        learnFallbackShot: FALLBACK_SHOTS.pnMarketingHub,
        practiceShot: SHOTS.pnMarketingHub,
        practiceFallbackShot: FALLBACK_SHOTS.pnMarketingHub,
        assessShot: SHOTS.pnCat,
        assessFallbackShot: FALLBACK_SHOTS.pnCat,
        learn:
          "Foundational nursing lessons, flashcards, pharmacology, and clinical skills reinforce safe practical-nursing scope before exam drilling.",
        practice:
          "REx-PN and CPNRE-style practice connects fundamentals to patient safety, delegation, prioritization, and common entry-level scenarios.",
        assess:
          "Timed practice and adaptive checks help PN learners measure whether foundational knowledge is stable enough for exam day.",
        remediate:
          "Missed topics become targeted review sets, lesson refreshers, flashcard work, and guided study plans without overwhelming the learner.",
        master:
          "Readiness and trend views show whether practical-nursing performance is getting more consistent across core content areas.",
      }),
    },
    np: {
      key: "np",
      label: "NP",
      tagline:
        "Advanced preparation for CNPLE-style reasoning, decision-making, and LOFT simulation.",
      differentiation:
        "NP learners see advanced clinical reasoning as a connected loop: cases, assessment, remediation, and readiness.",
      stages: stages({
        label: "NP",
        learnShot: SHOTS.npMarketingHub,
        learnFallbackShot: FALLBACK_SHOTS.npMarketingHub,
        practiceShot: SHOTS.npMarketingHub,
        practiceFallbackShot: FALLBACK_SHOTS.npMarketingHub,
        assessShot: SHOTS.npMarketingHub,
        assessFallbackShot: FALLBACK_SHOTS.npMarketingHub,
        learn:
          "Advanced lessons and pharmacology refreshers support diagnostic reasoning, management decisions, and scope-aware clinical planning.",
        practice:
          "NP practice questions and cases focus on advanced decision-making, prioritization, medication choices, and patient-management tradeoffs.",
        assess:
          "CNPLE-oriented assessment and LOFT-style simulation help learners rehearse clinical reasoning under realistic constraints.",
        remediate:
          "Performance gaps feed targeted review, weak-topic analysis, and study recommendations tied to the learner’s actual misses.",
        master:
          "Readiness scoring and analytics help NP learners see whether advanced reasoning is becoming reliable across domains.",
      }),
    },
    allied: {
      key: "allied",
      label: "Allied Health",
      tagline:
        "Profession-specific preparation for competency, safety, and applied clinical performance.",
      differentiation:
        "Allied learners get profession-aware practice instead of a generic nursing-only experience.",
      stages: stages({
        label: "Allied Health",
        learnShot: SHOTS.alliedMarketingHub,
        learnFallbackShot: FALLBACK_SHOTS.alliedMarketingHub,
        learn:
          "Profession-specific lessons and skill refreshers build the vocabulary, safety expectations, and applied concepts for each allied pathway.",
        practice:
          "Question practice targets the competencies learners actually need, from respiratory therapy and MLT to pharmacy tech and support roles.",
        assess:
          "Timed practice and simulation-style review show whether skills transfer into realistic testing and workplace scenarios.",
        remediate:
          "Weak competencies become targeted study actions so learners know which profession-specific areas need attention next.",
        master:
          "Analytics and trend tracking help allied learners build confidence before certification, placement, or role transition.",
      }),
    },
    newgrad: {
      key: "newgrad",
      label: "New Grad",
      tagline:
        "Transition-to-practice support for confidence, specialty preparation, and safe early-career decisions.",
      differentiation:
        "New grads get exam-style structure plus real-world support for the first year of practice.",
      stages: stages({
        label: "New Grad",
        learnShot: SHOTS.newGradMarketingHub,
        learnFallbackShot: FALLBACK_SHOTS.newGradMarketingHub,
        assessFallbackShot: FALLBACK_SHOTS.coreCatReadiness,
        learn:
          "Specialty preparation, clinical skills, communication, SBAR, pharmacology, and safety lessons support the jump from school to practice.",
        practice:
          "Scenario-based questions help new nurses rehearse prioritization, delegation, documentation, and patient-teaching decisions.",
        assess:
          "Simulation and timed scenarios help new grads test whether they can organize care when the situation is moving quickly.",
        remediate:
          "Weak-topic analysis turns early-career uncertainty into specific study actions and confidence-building review.",
        master:
          "Trends, streaks, readiness signals, and performance reports show growth across clinical confidence and specialty preparation.",
      }),
    },
    preNursing: {
      key: "preNursing",
      label: "Pre-Nursing",
      tagline:
        "Foundations and confidence-building before nursing school starts.",
      differentiation:
        "Pre-nursing learners see what nursing study feels like before they commit to a full exam pathway.",
      stages: stages({
        label: "Pre-Nursing",
        learn:
          "Foundational lessons introduce anatomy, terminology, study habits, medication basics, and clinical thinking in a low-pressure path.",
        practice:
          "Starter questions and flashcards build confidence with nursing-style language before high-stakes exam prep begins.",
        assess:
          "Mini assessments show which foundations are ready and which concepts need review before school or bridge programs.",
        remediate:
          "Simple study plans turn gaps into next steps so learners can build momentum without feeling behind.",
        master:
          "Progress tracking and confidence milestones help future nurses see that they are building real preparation habits.",
      }),
    },
  };

export const TIER_VALUE_ORDER: TierValueKey[] = [
  "rn",
  "pn",
  "np",
  "allied",
  "newgrad",
  "preNursing",
];
