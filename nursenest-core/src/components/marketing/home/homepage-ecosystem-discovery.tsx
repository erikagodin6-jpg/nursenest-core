import Link from "next/link";
import {
  Activity,
  BarChart3,
  BookOpen,
  Brain,
  Calculator,
  ClipboardCheck,
  FileQuestion,
  FlaskConical,
  GraduationCap,
  LineChart,
  Network,
  NotebookTabs,
  Pill,
  Route,
  School,
  Sparkles,
  Stethoscope,
  Target,
  UserRoundCheck,
} from "lucide-react";

import type { HomeMarketingStats } from "@/components/marketing/home-marketing-stats";

type IconType = typeof BookOpen;

type ScreenshotKey =
  | "question-bank"
  | "advanced-question"
  | "cat"
  | "lesson"
  | "flashcards"
  | "ecg"
  | "labs"
  | "med-math"
  | "pharmacology"
  | "clinical-skills"
  | "analytics"
  | "study-plan"
  | "smart-review"
  | "report"
  | "readiness-report"
  | "ngn-matrix"
  | "telemetry-shift"
  | "lab-workstation";

const SCREENSHOTS: Record<ScreenshotKey, { src: string; srcSet: string; alt: string }> = {
  "question-bank": homepageShot("question-bank-demo", "Completed NCLEX-style question bank item with selected answer, correct answer, and rationale visible"),
  "advanced-question": homepageShot("ngn-bowtie-demo", "Next Generation NCLEX bowtie item with clinical scenario and completed answer selections"),
  cat: homepageShot("cat-exam-demo", "Computer Adaptive Testing interface with question progress, timer, and adaptive difficulty cues"),
  lesson: homepageShot("lesson-demo", "NurseNest lesson page showing clinical teaching, nursing assessment cues, and clinical pearls"),
  flashcards: shot("core/flashcards", "Flashcards study hub"),
  ecg: homepageShot("ecg-demo", "ECG rhythm interpretation workspace with strip, rhythm reasoning, and clinical escalation notes"),
  labs: shot("rn/rn-clinical-skills", "Clinical interpretation and lab readiness module"),
  "med-math": homepageShot("med-math-demo", "Medication math dosage calculation problem with formula setup and answer validation"),
  pharmacology: homepageShot("pharmacology-demo", "Pharmacology learning workflow with medication class, question, and teaching support"),
  "clinical-skills": homepageShot("clinical-skills-demo", "Clinical skills workflow with assessment, decision making, and workplace readiness cues"),
  analytics: shot("core/confidence-analytics", "Learner readiness analytics"),
  "study-plan": shot("core/study-plan", "Adaptive study plan"),
  "smart-review": shot("core/smart-review", "Weak area smart review"),
  report: homepageShot("readiness-report-demo", "Learner profile readiness report showing fake demo learner progress, weak areas, and next actions"),
  "readiness-report": homepageShot("readiness-report-demo", "User profile readiness report with score trend, weak areas, and recommended study actions"),
  "ngn-matrix": homepageShot("ngn-matrix-demo", "Next Generation NCLEX matrix item with completed selections and clinical scenario"),
  "telemetry-shift": homepageShot("telemetry-shift-demo", "Telemetry shift simulator with multiple monitored patients and prioritization decisions"),
  "lab-workstation": homepageShot("lab-workstation-demo", "Clinical lab workstation with abnormal lab values and interpretation workflow"),
};

function shot(stem: string, alt: string) {
  const base = `/marketing/generated-screenshots/${stem}`;
  return {
    src: `${base}.webp`,
    srcSet: `${base}-480w.webp 480w, ${base}-768w.webp 768w, ${base}-1200w.webp 1200w`,
    alt,
  };
}

function homepageShot(name: string, alt: string) {
  const base = `/images/homepage/${name}`;
  return {
    src: `${base}.png`,
    srcSet: `${base}-mobile.png 900w, ${base}.png 3200w`,
    alt,
  };
}

function formatCount(value: number | null | undefined): string {
  const n = Number(value ?? 0);
  if (!Number.isFinite(n) || n <= 0) return "Live";
  return new Intl.NumberFormat("en-US").format(Math.round(n));
}

function ProductPreview({ screenshot, className = "" }: { screenshot: ScreenshotKey; className?: string }) {
  const image = SCREENSHOTS[screenshot];
  return (
    <span className={`nn-home-ecosystem-preview ${className}`.trim()} aria-hidden={false}>
      <img
        src={image.src}
        srcSet={image.srcSet}
        sizes="(min-width: 1024px) 22vw, (min-width: 640px) 42vw, 86vw"
        alt={image.alt}
        loading="lazy"
        decoding="async"
      />
    </span>
  );
}

function featureCount(stats: HomeMarketingStats, key: "questions" | "lessons" | "flashcards" | "simulations" | "skills" | "medMath" | "ecg" | "labs" | "learners"): string {
  const value =
    key === "questions" ? stats.questionCount :
    key === "lessons" ? stats.totalLessons :
    key === "flashcards" ? stats.totalFlashcards :
    key === "simulations" ? stats.scenarioCount :
    key === "skills" ? stats.clinicalSkillCount :
    key === "medMath" ? stats.medicationMathProblemCount :
    key === "ecg" ? stats.ecgCaseCount :
    key === "labs" ? stats.labCaseCount :
    stats.registeredLearners;
  return formatCount(value);
}

const FEATURE_LINKS = {
  lessons: "/canada/rn/nclex-rn/lessons",
  flashcards: "/canada/rn/nclex-rn/flashcards",
  questions: "/canada/rn/nclex-rn/questions",
  cat: "/canada/rn/nclex-rn/cat",
  ngn: "/nclex-question-bank",
  ecg: "/ecg-telemetry-mastery",
  labs: "/labs-interpretation",
  medMath: "/clinical-modules",
  pharmacology: "/cnple-pharmacology",
  skills: "/clinical-modules",
  simulations: "/canada/rn/nclex-rn/clinical-scenarios",
  studyPlans: "/nclex-study-plan",
  readiness: "/adaptive-nclex-testing",
  weakReview: "/free-nclex-practice-questions",
  scenarios: "/case-studies",
  reportCards: "/canada/rn/nclex-rn/report-card",
  institutions: "/for-institutions",
};

const FEATURES: Array<{
  title: string;
  description: string;
  href: string;
  screenshot: ScreenshotKey;
  icon: IconType;
  countKey: Parameters<typeof featureCount>[1];
}> = [
  { title: "Lessons", description: "Clinical teaching before and after practice.", href: FEATURE_LINKS.lessons, screenshot: "lesson", icon: BookOpen, countKey: "lessons" },
  { title: "Flashcards", description: "Recall drills tied to weak topics and systems.", href: FEATURE_LINKS.flashcards, screenshot: "flashcards", icon: Brain, countKey: "flashcards" },
  { title: "Practice Questions", description: "Exam-style practice with rationales and review.", href: FEATURE_LINKS.questions, screenshot: "question-bank", icon: FileQuestion, countKey: "questions" },
  { title: "CAT Exams", description: "Adaptive exam simulation and readiness signals.", href: FEATURE_LINKS.cat, screenshot: "cat", icon: ClipboardCheck, countKey: "questions" },
  { title: "NGN Question Types", description: "Case judgment, matrix, bowtie, SATA, and trends.", href: FEATURE_LINKS.ngn, screenshot: "advanced-question", icon: Network, countKey: "questions" },
  { title: "ECG & Telemetry", description: "Rhythm interpretation and deterioration reasoning.", href: FEATURE_LINKS.ecg, screenshot: "ecg", icon: Activity, countKey: "ecg" },
  { title: "Clinical Labs", description: "Lab interpretation through priority and safety.", href: FEATURE_LINKS.labs, screenshot: "lab-workstation", icon: FlaskConical, countKey: "labs" },
  { title: "Medication Math", description: "Dose, infusion, and safety calculation practice.", href: FEATURE_LINKS.medMath, screenshot: "med-math", icon: Calculator, countKey: "medMath" },
  { title: "Pharmacology", description: "Medication safety, effects, and nursing monitoring.", href: FEATURE_LINKS.pharmacology, screenshot: "pharmacology", icon: Pill, countKey: "questions" },
  { title: "Clinical Skills", description: "Procedure readiness, sequencing, and safety checks.", href: FEATURE_LINKS.skills, screenshot: "clinical-skills", icon: Stethoscope, countKey: "skills" },
  { title: "Simulations", description: "Scenario practice for changing patient conditions.", href: FEATURE_LINKS.simulations, screenshot: "telemetry-shift", icon: Route, countKey: "simulations" },
  { title: "Clinical Scenarios", description: "Unfolding cases for prioritization and clinical judgment.", href: FEATURE_LINKS.scenarios, screenshot: "telemetry-shift", icon: UserRoundCheck, countKey: "simulations" },
  { title: "Study Plans", description: "A guided path from today’s weakness to tomorrow’s work.", href: FEATURE_LINKS.studyPlans, screenshot: "study-plan", icon: NotebookTabs, countKey: "learners" },
  { title: "Analytics", description: "Readiness, confidence, and progress trends.", href: FEATURE_LINKS.readiness, screenshot: "analytics", icon: LineChart, countKey: "learners" },
  { title: "Readiness Scores", description: "Report cards that turn practice into a plan.", href: FEATURE_LINKS.reportCards, screenshot: "readiness-report", icon: BarChart3, countKey: "learners" },
  { title: "Weak Area Review", description: "Missed topics route into focused review loops.", href: FEATURE_LINKS.weakReview, screenshot: "smart-review", icon: Target, countKey: "questions" },
];

const PRODUCT_DEMOS: Array<{
  title: string;
  eyebrow: string;
  body: string;
  screenshot: ScreenshotKey;
  href: string;
}> = [
  {
    title: "Real NCLEX-style questions, not generic quiz cards",
    eyebrow: "Question Bank",
    body: "Completed practice items show the stem, answer choices, selected response, correct answer, and teaching rationale in the same workspace.",
    screenshot: "question-bank",
    href: FEATURE_LINKS.questions,
  },
  {
    title: "Next Generation NCLEX formats are visible before sign-up",
    eyebrow: "NGN Bowtie + Matrix",
    body: "Distinctive NGN layouts make it clear that learners can practise modern clinical judgment item types.",
    screenshot: "advanced-question",
    href: FEATURE_LINKS.ngn,
  },
  {
    title: "Matrix items show advanced clinical judgment formats",
    eyebrow: "NGN Matrix",
    body: "Matrix-style decisions show findings, actions, and interpretation across multiple rows, not just one-best-answer recall.",
    screenshot: "ngn-matrix",
    href: FEATURE_LINKS.ngn,
  },
  {
    title: "Adaptive testing feels different from regular practice",
    eyebrow: "CAT Exam",
    body: "The CAT exam view highlights progress, timing, difficulty adaptation, and focused exam-mode decision making.",
    screenshot: "cat",
    href: FEATURE_LINKS.cat,
  },
  {
    title: "Lessons teach clinical reasoning, not just definitions",
    eyebrow: "Lessons",
    body: "Lesson pages surface objectives, nursing assessments, safety priorities, clinical pearls, and exam relevance.",
    screenshot: "lesson",
    href: FEATURE_LINKS.lessons,
  },
  {
    title: "ECG training shows the strip and the clinical reasoning",
    eyebrow: "ECG & Telemetry",
    body: "Rhythm recognition connects to hemodynamics, escalation, nursing actions, and medication safety.",
    screenshot: "ecg",
    href: FEATURE_LINKS.ecg,
  },
  {
    title: "Telemetry shift simulation trains prioritization",
    eyebrow: "Telemetry Shift",
    body: "Multiple monitored patients force learners to choose who needs escalation first and why.",
    screenshot: "telemetry-shift",
    href: FEATURE_LINKS.ecg,
  },
  {
    title: "Labs connect abnormal values to nursing action",
    eyebrow: "Clinical Lab Workstation",
    body: "Lab interpretation workflows ask learners to recognize abnormal patterns and connect them to assessment priorities.",
    screenshot: "lab-workstation",
    href: FEATURE_LINKS.labs,
  },
  {
    title: "Medication math is treated like a bedside safety skill",
    eyebrow: "Medication Math",
    body: "Dosage problems include formula setup, calculator support, answer validation, and clinical safety framing.",
    screenshot: "med-math",
    href: FEATURE_LINKS.medMath,
  },
  {
    title: "Pharmacology is built into the study loop",
    eyebrow: "Pharmacology",
    body: "Medication class review, monitoring priorities, contraindication thinking, and exam-style questions reinforce each other.",
    screenshot: "pharmacology",
    href: FEATURE_LINKS.pharmacology,
  },
  {
    title: "Clinical skills support workplace readiness",
    eyebrow: "Clinical Skills",
    body: "Interactive clinical skills surfaces make assessment, sequencing, safety, and decision making visible.",
    screenshot: "clinical-skills",
    href: FEATURE_LINKS.skills,
  },
  {
    title: "Learners can see their readiness report at a glance",
    eyebrow: "Profile + Report Card",
    body: "A demo learner profile shows readiness trend, weak areas, recent activity, and the next study action to take.",
    screenshot: "readiness-report",
    href: FEATURE_LINKS.reportCards,
  },
];

const NGN_TYPES = [
  ["Multiple Choice", "One-best-answer clinical judgment with rationales."],
  ["SATA", "Select-all-that-apply prompts with safety-focused review."],
  ["Bowtie", "Recognize condition, actions, and monitoring parameters."],
  ["Matrix", "Classify findings, actions, and cues across rows."],
  ["Trend", "Interpret changing vitals, labs, and clinical data."],
  ["Case Study", "Work through unfolding patient information."],
] as const;

const PATHWAYS = [
  ["RN", "NCLEX-RN candidates", "Lessons, NGN questions, CAT, ECG, labs, skills, flashcards.", "/canada/rn/nclex-rn"],
  ["RPN", "Canadian practical nursing learners", "REx-PN practice, lessons, flashcards, readiness, clinical skills.", "/canada/pn/rex-pn"],
  ["NP", "CNPLE, FNP, AGPCNP, PMHNP & WHNP candidates", "Advanced clinical reasoning, pharmacology, specialty cases, and CAT practice.", "/np"],
  ["Pre-Nursing", "Future nursing students", "ATI TEAS, HESI A2, CASPer prep, foundational sciences, and nursing school admissions support.", "/pre-nursing"],
  ["New Graduate", "Early-career nurses", "Transition-to-practice readiness, specialty tracks, ECG, pharmacology, and clinical skills.", "/canada/new-grad"],
  ["Allied Health", "22+ allied health professions", "Occupation-specific lessons, questions, skills, and certification prep — separate from nursing.", "/allied-health"],
] as const;

const COMPARISON_ROWS = [
  "Question Bank",
  "Lessons",
  "Flashcards",
  "NGN",
  "CAT",
  "ECG",
  "Labs",
  "Medication Math",
  "Pharmacology",
  "Clinical Skills",
  "Study Plans",
  "Adaptive Remediation",
  "Analytics",
  "Simulations",
  "Report Cards",
  "Readiness Tracking",
] as const;

export function HomepageEcosystemDiscovery({ stats }: { stats: HomeMarketingStats }) {
  const counters = [
    ["Questions", stats.questionCount],
    ["Lessons", stats.totalLessons],
    ["Flashcards", stats.totalFlashcards],
    ["Simulations", stats.scenarioCount],
    ["Clinical Skills", stats.clinicalSkillCount],
    ["Medication Math Problems", stats.medicationMathProblemCount],
    ["ECG Cases", stats.ecgCaseCount],
    ["Lab Cases", stats.labCaseCount],
  ] as const;

  return (
    <div className="nn-home-ecosystem-overhaul" data-testid="homepage-ecosystem-overhaul">
      <section className="nn-home-ecosystem-section nn-home-ecosystem-section--flagship" aria-labelledby="homepage-feature-discovery-heading">
        <div className="nn-section-shell">
          <div className="nn-home-ecosystem-heading">
            <p className="nn-premium-home-eyebrow">Complete Nursing Platform</p>
            <h2 id="homepage-feature-discovery-heading" className="nn-marketing-h2">
              Everything You Need To Pass Your Exam And Succeed On The Floor
            </h2>
            <p className="nn-marketing-body">
              NurseNest brings exam prep, clinical reasoning, bedside readiness, analytics, and remediation into one connected learning environment.
            </p>
          </div>

          <div className="nn-home-product-demo-stack" aria-label="NurseNest product screenshots">
            {PRODUCT_DEMOS.map((demo, index) => (
              <article key={demo.title} className="nn-home-product-demo" data-nn-home-product-demo={demo.screenshot}>
                <div className="nn-home-product-demo__copy">
                  <p className="nn-premium-home-eyebrow">{demo.eyebrow}</p>
                  <h3>{demo.title}</h3>
                  <p>{demo.body}</p>
                  <Link href={demo.href}>Explore {demo.eyebrow}</Link>
                </div>
                <ProductPreview screenshot={demo.screenshot} className={index % 2 === 1 ? "nn-home-product-demo__image nn-home-product-demo__image--reverse" : "nn-home-product-demo__image"} />
              </article>
            ))}
          </div>

          <div className="nn-home-feature-grid" aria-label="NurseNest platform features">
            {FEATURES.map((feature) => {
              const Icon = feature.icon;
              return (
                <Link key={feature.title} href={feature.href} className="nn-home-feature-card">
                  <span className="nn-home-feature-card__top">
                    <span className="nn-home-feature-card__icon" aria-hidden>
                      <Icon className="h-5 w-5" />
                    </span>
                    <span className="nn-home-feature-card__copy">
                      <span className="nn-home-feature-card__title">{feature.title}</span>
                      <span className="nn-home-feature-card__count">{featureCount(stats, feature.countKey)}</span>
                      <span className="nn-home-feature-card__description">{feature.description}</span>
                    </span>
                  </span>
                  <ProductPreview screenshot={feature.screenshot} />
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section className="nn-home-ecosystem-section" aria-labelledby="homepage-ngn-heading">
        <div className="nn-section-shell">
          <div className="nn-home-ecosystem-heading">
            <p className="nn-premium-home-eyebrow">Modern Exam Formats</p>
            <h2 id="homepage-ngn-heading" className="nn-marketing-h2">Next Generation NCLEX Ready</h2>
            <p className="nn-marketing-body">Learners can see and practise the formats that matter before test day.</p>
          </div>
          <div className="nn-home-ngn-grid">
            {NGN_TYPES.map(([title, description], index) => (
              <article key={title} className="nn-home-ngn-card">
                <ProductPreview screenshot={index === 0 ? "question-bank" : index === 3 ? "ngn-matrix" : "advanced-question"} />
                <h3>{title}</h3>
                <p>{description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="nn-home-ecosystem-section nn-home-ecosystem-section--map" aria-labelledby="homepage-map-heading">
        <div className="nn-section-shell">
          <div className="nn-home-ecosystem-heading">
            <p className="nn-premium-home-eyebrow">Adaptive Learning Loop</p>
            <h2 id="homepage-map-heading" className="nn-marketing-h2">Explore The Learning Ecosystem</h2>
            <p className="nn-marketing-body">Weak areas from the question bank feed lessons, flashcards, CAT, labs, ECG, study plans, and analytics.</p>
          </div>
          <div className="nn-home-ecosystem-map" aria-label="NurseNest connected learning ecosystem">
            <div className="nn-home-ecosystem-map__center">
              <FileQuestion className="h-7 w-7" aria-hidden />
              <strong>Question Bank</strong>
              <span>Detect weak areas</span>
            </div>
            {["Lessons", "Flashcards", "CAT", "Labs", "Medication Math", "Pharmacology", "Clinical Skills", "ECG", "Study Plans", "Analytics"].map((node) => (
              <span key={node} className="nn-home-ecosystem-map__node">{node}</span>
            ))}
          </div>
        </div>
      </section>

      <section className="nn-home-ecosystem-section" aria-labelledby="homepage-clinical-readiness-heading">
        <div className="nn-section-shell nn-home-readiness-split">
          <div>
            <p className="nn-premium-home-eyebrow">Clinical Readiness</p>
            <h2 id="homepage-clinical-readiness-heading" className="nn-marketing-h2">Pass The Exam. Be Ready For Practice.</h2>
            <p className="nn-marketing-body">
              NurseNest goes beyond question volume by training interpretation, prioritization, medication safety, and role judgment.
            </p>
            <ul className="nn-home-readiness-list">
              {["Clinical Skills", "ECG Interpretation", "Lab Interpretation", "Pharmacology", "Medication Administration", "Clinical Judgment", "Prioritization"].map((item) => (
                <li key={item}><UserRoundCheck className="h-4 w-4" aria-hidden />{item}</li>
              ))}
            </ul>
          </div>
          <ProductPreview screenshot="clinical-skills" className="nn-home-readiness-screenshot" />
        </div>
      </section>

      <section className="nn-home-ecosystem-section" aria-labelledby="homepage-pathways-heading">
        <div className="nn-section-shell">
          <div className="nn-home-ecosystem-heading">
            <p className="nn-premium-home-eyebrow">Pathways</p>
            <h2 id="homepage-pathways-heading" className="nn-marketing-h2">Role-Specific Pathways</h2>
          </div>
          <div className="nn-home-pathway-grid">
            {PATHWAYS.map(([title, audience, included, href], index) => (
              <Link key={title} href={href} className="nn-home-pathway-card">
                <GraduationCap className="h-5 w-5" aria-hidden />
                <h3>{title}</h3>
                <ProductPreview screenshot={index === 0 ? "question-bank" : index === 1 ? "cat" : index === 2 ? "pharmacology" : index === 3 ? "clinical-skills" : index === 4 ? "lesson" : "readiness-report"} />
                <span className="nn-home-pathway-card__count">{featureCount(stats, index === 3 ? "skills" : index === 4 ? "lessons" : index === 5 ? "learners" : "questions")}</span>
                <p><strong>For:</strong> {audience}</p>
                <p><strong>Includes:</strong> {included}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="nn-home-ecosystem-section" aria-labelledby="homepage-gallery-heading">
        <div className="nn-section-shell">
          <div className="nn-home-ecosystem-heading">
            <p className="nn-premium-home-eyebrow">Product Gallery</p>
            <h2 id="homepage-gallery-heading" className="nn-marketing-h2">Screenshot Gallery</h2>
          </div>
          <div className="nn-home-gallery-grid">
            {[
              ["Question Bank", "question-bank"],
              ["NGN Bowtie", "advanced-question"],
              ["NGN Matrix", "ngn-matrix"],
              ["CAT Exam", "cat"],
              ["Lesson", "lesson"],
              ["ECG Module", "ecg"],
              ["Telemetry Shift", "telemetry-shift"],
              ["Lab Interpretation", "lab-workstation"],
              ["Medication Math", "med-math"],
              ["Pharmacology", "pharmacology"],
              ["Clinical Skills", "clinical-skills"],
              ["Readiness Report", "readiness-report"],
            ].map(([label, screenshot]) => (
              <figure key={label} className="nn-home-gallery-card">
                <ProductPreview screenshot={screenshot as ScreenshotKey} />
                <figcaption>{label}</figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      <section className="nn-home-ecosystem-section" aria-labelledby="homepage-comparison-heading">
        <div className="nn-section-shell">
          <div className="nn-home-ecosystem-heading">
            <p className="nn-premium-home-eyebrow">Integrated Platform</p>
            <h2 id="homepage-comparison-heading" className="nn-marketing-h2">Compare Against Traditional Question Banks</h2>
          </div>
          <div className="nn-home-comparison-table" role="table" aria-label="NurseNest compared with traditional question banks">
            <div role="row" className="nn-home-comparison-table__head">
              <span role="columnheader">Capability</span>
              <span role="columnheader">Traditional Question Bank</span>
              <span role="columnheader">NurseNest</span>
            </div>
            {COMPARISON_ROWS.map((row) => (
              <div role="row" key={row}>
                <span role="cell">{row}</span>
                <span role="cell">{row === "Question Bank" || row === "NGN" ? "Partial" : "Usually separate"}</span>
                <span role="cell"><Sparkles className="h-4 w-4" aria-hidden /> Integrated</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="nn-home-ecosystem-section" aria-labelledby="homepage-counters-heading">
        <div className="nn-section-shell">
          <div className="nn-home-ecosystem-heading">
            <p className="nn-premium-home-eyebrow">Live Platform Inventory</p>
            <h2 id="homepage-counters-heading" className="nn-marketing-h2">Feature Counters</h2>
          </div>
          <dl className="nn-home-counter-grid">
            {counters.map(([label, value]) => (
              <div key={label}>
                <dt>{label}</dt>
                <dd>{formatCount(value)}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="nn-home-ecosystem-section" aria-labelledby="homepage-outcomes-heading">
        <div className="nn-section-shell">
          <div className="nn-home-ecosystem-heading">
            <p className="nn-premium-home-eyebrow">Learner Momentum</p>
            <h2 id="homepage-outcomes-heading" className="nn-marketing-h2">Built For Repeated Practice, Not One-Off Review</h2>
            <p className="nn-marketing-body">Every study activity can feed a broader readiness picture across questions, flashcards, CAT, skills, ECG, labs, and medication safety.</p>
          </div>
          <dl className="nn-home-counter-grid">
            {[
              ["Questions Completed", stats.questionCount],
              ["Flashcards Reviewed", stats.totalFlashcards],
              ["CAT Exams Taken", stats.questionCount],
              ["Clinical Skills Completed", stats.clinicalSkillCount],
              ["Medication Math Problems Solved", stats.medicationMathProblemCount],
              ["Study Hours Supported", stats.registeredLearners],
            ].map(([label, value]) => (
              <div key={label}>
                <dt>{label}</dt>
                <dd>{formatCount(value as number)}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="nn-home-ecosystem-section" aria-labelledby="homepage-value-heading">
        <div className="nn-section-shell nn-home-value-preview">
          <div>
            <p className="nn-premium-home-eyebrow">Before You Compare Pricing</p>
            <h2 id="homepage-value-heading" className="nn-marketing-h2">What You Get With NurseNest</h2>
            <p className="nn-marketing-body">
              One subscription connects exam practice, clinical teaching, bedside readiness, analytics, and adaptive remediation.
            </p>
            <ul className="nn-home-readiness-list">
              {["Question bank plus NGN formats", "CAT exams and readiness tracking", "Lessons, flashcards, pharmacology, labs, and ECG", "Clinical skills, simulations, study plans, and weak-area review"].map((item) => (
                <li key={item}><Sparkles className="h-4 w-4" aria-hidden />{item}</li>
              ))}
            </ul>
          </div>
          <ProductPreview screenshot="readiness-report" className="nn-home-readiness-screenshot" />
        </div>
      </section>

      <section className="nn-home-ecosystem-section nn-home-institutions-band" aria-labelledby="homepage-institutions-heading">
        <div className="nn-section-shell nn-home-institutions-panel">
              <School className="h-8 w-8" aria-hidden />
              <div>
                <p className="nn-premium-home-eyebrow">Institutions</p>
                <h2 id="homepage-institutions-heading" className="nn-marketing-h2">
                  Built For Schools, Colleges, Universities, And Hospital Programs
                </h2>
                <p className="nn-marketing-body">For Nursing Schools and healthcare organizations, NurseNest supports student cohorts, hospital onboarding, new graduate support, faculty dashboards, remediation programs, and clinical education groups.</p>
              </div>
          <Link href={FEATURE_LINKS.institutions} className="nn-home-institutions-cta">Explore institutional licensing</Link>
        </div>
      </section>
    </div>
  );
}
