import Link from "next/link";
import {
  Activity,
  BarChart3,
  Beaker,
  BookOpen,
  Brain,
  Calculator,
  ClipboardCheck,
  FileQuestion,
  FlaskConical,
  GraduationCap,
  HeartPulse,
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
  | "clinical-skills"
  | "analytics"
  | "study-plan"
  | "smart-review"
  | "report";

const SCREENSHOTS: Record<ScreenshotKey, { src: string; srcSet: string; alt: string }> = {
  "question-bank": shot("core/question-bank", "Question bank practice dashboard"),
  "advanced-question": shot("core/question-bank-advanced", "Next generation question workspace"),
  cat: shot("core/cat-exam-session", "CAT exam session interface"),
  lesson: shot("core/lesson-detail", "Clinical lesson detail page"),
  flashcards: shot("core/flashcards", "Flashcards study hub"),
  ecg: shot("core/ecg-workstation", "ECG telemetry workstation"),
  labs: shot("rn/rn-clinical-skills", "Clinical interpretation and lab readiness module"),
  "med-math": shot("pn/pn-pharmacology", "Medication safety and calculation learning module"),
  "clinical-skills": shot("rn/rn-clinical-skills", "Clinical skills module"),
  analytics: shot("core/confidence-analytics", "Learner readiness analytics"),
  "study-plan": shot("core/study-plan", "Adaptive study plan"),
  "smart-review": shot("core/smart-review", "Weak area smart review"),
  report: shot("core/progress-report", "Learner report card"),
};

function shot(stem: string, alt: string) {
  const base = `/marketing/generated-screenshots/${stem}`;
  return {
    src: `${base}-768w.webp`,
    srcSet: `${base}-480w.webp 480w, ${base}-768w.webp 768w, ${base}-1200w.webp 1200w`,
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
}> = [
  { title: "Lessons", description: "Clinical teaching before and after practice.", href: FEATURE_LINKS.lessons, screenshot: "lesson", icon: BookOpen },
  { title: "Flashcards", description: "Recall drills tied to weak topics and systems.", href: FEATURE_LINKS.flashcards, screenshot: "flashcards", icon: Brain },
  { title: "Practice Questions", description: "Exam-style practice with rationales and review.", href: FEATURE_LINKS.questions, screenshot: "question-bank", icon: FileQuestion },
  { title: "CAT Exams", description: "Adaptive exam simulation and readiness signals.", href: FEATURE_LINKS.cat, screenshot: "cat", icon: ClipboardCheck },
  { title: "NGN Question Types", description: "Case judgment, matrix, bowtie, SATA, and trends.", href: FEATURE_LINKS.ngn, screenshot: "advanced-question", icon: Network },
  { title: "ECG & Telemetry", description: "Rhythm interpretation and deterioration reasoning.", href: FEATURE_LINKS.ecg, screenshot: "ecg", icon: Activity },
  { title: "Clinical Labs", description: "Lab interpretation through priority and safety.", href: FEATURE_LINKS.labs, screenshot: "labs", icon: FlaskConical },
  { title: "Medication Math", description: "Dose, infusion, and safety calculation practice.", href: FEATURE_LINKS.medMath, screenshot: "med-math", icon: Calculator },
  { title: "Pharmacology", description: "Medication safety, effects, and nursing monitoring.", href: FEATURE_LINKS.pharmacology, screenshot: "med-math", icon: Pill },
  { title: "Clinical Skills", description: "Procedure readiness, sequencing, and safety checks.", href: FEATURE_LINKS.skills, screenshot: "clinical-skills", icon: Stethoscope },
  { title: "Simulations", description: "Scenario practice for changing patient conditions.", href: FEATURE_LINKS.simulations, screenshot: "smart-review", icon: Route },
  { title: "Study Plans", description: "A guided path from today’s weakness to tomorrow’s work.", href: FEATURE_LINKS.studyPlans, screenshot: "study-plan", icon: NotebookTabs },
  { title: "Readiness Tracking", description: "Progress views that show exam and practice readiness.", href: FEATURE_LINKS.readiness, screenshot: "analytics", icon: LineChart },
  { title: "Weak Area Review", description: "Missed topics route into focused review loops.", href: FEATURE_LINKS.weakReview, screenshot: "smart-review", icon: Target },
  { title: "Clinical Scenarios", description: "Priority, delegation, and clinical judgment cases.", href: FEATURE_LINKS.scenarios, screenshot: "advanced-question", icon: HeartPulse },
  { title: "Report Cards", description: "Clear performance summaries after study and exams.", href: FEATURE_LINKS.reportCards, screenshot: "report", icon: BarChart3 },
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
  ["NP", "Nurse practitioner exam candidates", "Advanced clinical reasoning, pharmacology, cases, and practice.", "/np"],
  ["Allied Health", "Healthcare certification learners", "Occupation-aware lessons, questions, skills, and scenarios.", "/allied-health"],
  ["Pre-Nursing", "Future nursing students", "Foundations, prerequisite review, mini practice, and study planning.", "/pre-nursing"],
  ["New Graduate", "Early-career nurses", "Practice readiness, specialty tracks, ECG, pharmacology, and skills.", "/canada/new-grad"],
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
                <ProductPreview screenshot={index < 2 ? "question-bank" : "advanced-question"} />
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
            {PATHWAYS.map(([title, audience, included, href]) => (
              <Link key={title} href={href} className="nn-home-pathway-card">
                <GraduationCap className="h-5 w-5" aria-hidden />
                <h3>{title}</h3>
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
              ["NGN Matrix", "advanced-question"],
              ["CAT Exam", "cat"],
              ["Lesson", "lesson"],
              ["ECG Module", "ecg"],
              ["Lab Interpretation", "labs"],
              ["Medication Math", "med-math"],
              ["Clinical Skills", "clinical-skills"],
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

      <section className="nn-home-ecosystem-section nn-home-institutions-band" aria-labelledby="homepage-institutions-heading">
        <div className="nn-section-shell nn-home-institutions-panel">
          <School className="h-8 w-8" aria-hidden />
          <div>
            <p className="nn-premium-home-eyebrow">Institutions</p>
            <h2 id="homepage-institutions-heading" className="nn-marketing-h2">Built For Schools, Colleges, Universities, And Hospital Programs</h2>
            <p className="nn-marketing-body">Bring NurseNest’s learning ecosystem to cohorts, remediation programs, transition-to-practice teams, and clinical education groups.</p>
          </div>
          <Link href={FEATURE_LINKS.institutions} className="nn-home-institutions-cta">Explore institutional licensing</Link>
        </div>
      </section>
    </div>
  );
}
