import { useState, useEffect } from "react";
import { BookOpen, Brain, FlaskConical, Stethoscope, FileText, ArrowRight, Globe, Sparkles } from "lucide-react";
import { LocaleLink } from "@/lib/LocaleLink";

import { useI18n } from "@/lib/i18n";
interface RelatedResource {
  title: string;
  href: string;
  description: string;
  icon?: "lesson" | "flashcard" | "qbank" | "simulator" | "article" | "allied";
}

const ICON_MAP = {
  lesson: BookOpen,
  flashcard: Brain,
  qbank: FlaskConical,
  simulator: Stethoscope,
  article: FileText,
  allied: Globe,
};

interface RelatedResourcesProps {
  resources: RelatedResource[];
  title?: string;
  className?: string;
}

export function RelatedResources({ resources, title = "Related Resources", className = "" }: RelatedResourcesProps) {
  const { t } = useI18n();
  if (!resources || resources.length === 0) return null;

  return (
    <section className={`py-8 ${className}`} data-testid="related-resources-section">
      <h2 className="text-xl font-bold text-gray-900 mb-4" data-testid="text-related-title">{title}</h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {resources.map((resource, i) => {
          const IconComp = ICON_MAP[resource.icon || "lesson"];
          return (
            <LocaleLink
              key={i}
              href={resource.href}
              className="group flex items-start gap-3 p-4 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md hover:border-primary/20 transition-all"
              data-testid={`link-related-resource-${i}`}
            >
              <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/15 transition-colors">
                <IconComp className="w-4.5 h-4.5 text-primary" />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="text-sm font-semibold text-gray-900 group-hover:text-primary transition-colors line-clamp-1">{resource.title}</h3>
                <p className="text-xs text-gray-500 line-clamp-2 mt-0.5">{resource.description}</p>
              </div>
              <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-primary shrink-0 mt-0.5 transition-colors" />
            </LocaleLink>
          );
        })}
      </div>
    </section>
  );
}

interface CrossPlatformLink {
  title: string;
  href: string;
  description: string;
  source: string;
  track?: string;
}

interface CrossPlatformRelatedContentProps {
  slug: string;
  source?: "nursing" | "allied";
  className?: string;
}

export function CrossPlatformRelatedContent({ slug, source = "nursing", className = "" }: CrossPlatformRelatedContentProps) {
  const [links, setLinks] = useState<CrossPlatformLink[]>([]);

  useEffect(() => {
    if (!slug) return;
    fetch(`/api/cross-platform-related?slug=${encodeURIComponent(slug)}&source=${source}`)
      .then(r => r.ok ? r.json() : { related: [] })
      .then(data => setLinks(data.related || []))
      .catch(() => {});
  }, [slug, source]);

  if (links.length === 0) return null;

  const trackColors: Record<string, string> = {
    "respiratory-therapy": "bg-blue-100 text-blue-700",
    "pharmacy-tech": "bg-green-100 text-green-700",
    "paramedic": "bg-red-100 text-red-700",
    "medical-lab-technologist": "bg-purple-100 text-purple-700",
    "medical-imaging": "bg-amber-100 text-amber-700",
    "ultrasound": "bg-cyan-100 text-cyan-700",
    "physical-therapy-assistant": "bg-teal-100 text-teal-700",
    "occupational-therapy-assistant": "bg-indigo-100 text-indigo-700",
    "nursing": "bg-violet-100 text-violet-700",
  };

  return (
    <section className={`py-6 ${className}`} data-testid="cross-platform-related">
      <h2 className="text-lg font-bold text-gray-900 mb-3" data-testid="text-cross-platform-title">
        {source === "nursing" ? "Related Allied Health Content" : "Related Nursing Content"}
      </h2>
      <div className="grid sm:grid-cols-2 gap-3">
        {links.map((link, i) => (
          <LocaleLink
            key={i}
            href={link.href}
            className="group flex items-start gap-3 p-3 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md hover:border-primary/20 transition-all"
            data-testid={`link-cross-platform-${i}`}
          >
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/15 transition-colors">
              <Globe className="w-4 h-4 text-primary" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 mb-0.5">
                <h3 className="text-sm font-semibold text-gray-900 group-hover:text-primary transition-colors line-clamp-1">{link.title}</h3>
                {link.track && (
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full whitespace-nowrap ${trackColors[link.track] || "bg-gray-100 text-gray-600"}`}>
                    {link.track.replace(/-/g, " ")}
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-500 line-clamp-1">{link.description}</p>
            </div>
            <ArrowRight className="w-3.5 h-3.5 text-gray-300 group-hover:text-primary shrink-0 mt-1 transition-colors" />
          </LocaleLink>
        ))}
      </div>
    </section>
  );
}

export const STUDY_CROSS_LINKS: Record<string, RelatedResource[]> = {
  lessons: [
    { title: "Practice Flashcards", href: "/flashcards", description: "Reinforce lesson concepts with pharmacology and clinical flashcards.", icon: "flashcard" },
    { title: "Test Bank", href: "/free-practice", description: "Test your knowledge with practice questions organized by body system.", icon: "qbank" },
    { title: "Clinical Simulations", href: "/case-simulations", description: "Apply your learning in branching clinical case scenarios.", icon: "simulator" },
    { title: "Med Math Practice", href: "/med-math", description: "Practice dosage calculations and medication math problems.", icon: "qbank" },
    { title: "Lab Values Review", href: "/lab-values", description: "Master abnormal lab value interpretation and clinical correlations.", icon: "lesson" },
    { title: "Mock Exams", href: "/mock-exams", description: "Take timed practice tests simulating the real exam experience.", icon: "qbank" },
  ],
  flashcards: [
    { title: "Clinical Lessons", href: "/lessons", description: "Deepen your understanding with pathophysiology and clinical lessons.", icon: "lesson" },
    { title: "Medication Mastery", href: "/medication-mastery", description: "Explore drug mechanisms of action at the receptor level.", icon: "lesson" },
    { title: "Test Bank", href: "/free-practice", description: "Apply flashcard knowledge to practice questions.", icon: "qbank" },
    { title: "Clinical Clarity", href: "/clinical-clarity", description: "Understand the 'why' behind clinical phenomena.", icon: "article" },
  ],
  qbank: [
    { title: "Clinical Lessons", href: "/lessons", description: "Review pathophysiology topics for questions you missed.", icon: "lesson" },
    { title: "Flashcards", href: "/flashcards", description: "Memorize key concepts with spaced repetition flashcards.", icon: "flashcard" },
    { title: "Mock Exams", href: "/mock-exams", description: "Simulate the real exam with timed, adaptive mock tests.", icon: "qbank" },
    { title: "Case Simulations", href: "/case-simulations", description: "Practice clinical decision-making in scenario-based learning.", icon: "simulator" },
  ],
  mockExams: [
    { title: "Test Bank", href: "/free-practice", description: "Practice more questions organized by body system and difficulty.", icon: "qbank" },
    { title: "Clinical Lessons", href: "/lessons", description: "Review topics where you scored lower on the mock exam.", icon: "lesson" },
    { title: "Flashcards", href: "/flashcards", description: "Quick review of pharmacology and clinical concepts.", icon: "flashcard" },
    { title: "Lab Values", href: "/lab-values", description: "Strengthen lab interpretation skills tested on exams.", icon: "lesson" },
  ],
  simulators: [
    { title: "Clinical Lessons", href: "/lessons", description: "Build foundational knowledge for clinical simulations.", icon: "lesson" },
    { title: "Test Bank", href: "/free-practice", description: "Practice NCLEX-style questions after simulations.", icon: "qbank" },
    { title: "Mock Exams", href: "/mock-exams", description: "Test your readiness with full-length practice exams.", icon: "qbank" },
    { title: "Medication Mastery", href: "/medication-mastery", description: "Review drug actions relevant to clinical scenarios.", icon: "lesson" },
  ],
  blog: [
    { title: "Clinical Lessons", href: "/lessons", description: "Explore structured lessons covering every exam domain.", icon: "lesson" },
    { title: "Practice Flashcards", href: "/flashcards", description: "Study key concepts with spaced repetition flashcards.", icon: "flashcard" },
    { title: "Test Bank", href: "/free-practice", description: "Test your understanding with NCLEX-style practice questions.", icon: "qbank" },
    { title: "Mock Exams", href: "/mock-exams", description: "Simulate the real exam with full-length timed tests.", icon: "qbank" },
    { title: "Clinical Clarity", href: "/clinical-clarity", description: "Understand the 'why' behind clinical phenomena.", icon: "article" },
    { title: "Med Math Practice", href: "/med-math", description: "Practice dosage calculations and IV drip rates.", icon: "qbank" },
  ],
  examGuide: [
    { title: "Mock Exams", href: "/mock-exams", description: "Practice with full-length timed exams that mirror the real test.", icon: "qbank" },
    { title: "Test Bank", href: "/free-practice", description: "Study with thousands of practice questions by topic.", icon: "qbank" },
    { title: "Clinical Lessons", href: "/lessons", description: "Master core clinical content organized by body system.", icon: "lesson" },
    { title: "Flashcards", href: "/flashcards", description: "Quick recall practice for pharmacology and clinical facts.", icon: "flashcard" },
    { title: "Study Plan", href: "/study-plan", description: "Get a personalized daily study plan targeting weak areas.", icon: "lesson" },
    { title: "Case Simulations", href: "/case-simulations", description: "Practice clinical judgment with branching case scenarios.", icon: "simulator" },
  ],
  professionHub: [
    { title: "Clinical Lessons", href: "/lessons", description: "Structured pathophysiology and clinical nursing lessons.", icon: "lesson" },
    { title: "Practice Questions", href: "/free-practice", description: "Thousands of practice questions organized by exam domain.", icon: "qbank" },
    { title: "Flashcards", href: "/flashcards", description: "Spaced repetition cards for key pharmacology and clinical concepts.", icon: "flashcard" },
    { title: "Mock Exams", href: "/mock-exams", description: "Full-length timed practice tests with performance analytics.", icon: "qbank" },
    { title: "Clinical Simulations", href: "/case-simulations", description: "Branching patient scenarios for clinical judgment practice.", icon: "simulator" },
    { title: "Study Plan", href: "/study-plan", description: "Personalized daily study schedules based on your progress.", icon: "lesson" },
  ],
};

const TOPIC_RESOURCE_MAP: Record<string, RelatedResource[]> = {
  pharmacology: [
    { title: "Medication Mastery", href: "/medication-mastery", description: "Master drug mechanisms, side effects, and nursing considerations.", icon: "lesson" },
    { title: "Pharmacology Flashcards", href: "/flashcards", description: "Review drug classes with spaced repetition flashcards.", icon: "flashcard" },
    { title: "Med Math Practice", href: "/med-math", description: "Practice dosage calculations and IV drip rate problems.", icon: "qbank" },
  ],
  "lab-interpretation": [
    { title: "Lab Values Reference", href: "/lab-values", description: "Complete reference for normal ranges and clinical significance.", icon: "lesson" },
    { title: "Electrolyte & ABG Simulator", href: "/electrolyte-abg-simulator", description: "Practice interpreting ABGs and electrolyte panels.", icon: "simulator" },
  ],
  "clinical-reasoning": [
    { title: "Case Simulations", href: "/case-simulations", description: "Apply clinical reasoning in branching patient scenarios.", icon: "simulator" },
    { title: "First Action Simulator", href: "/first-action-simulator", description: "Practice prioritization and first-action clinical decisions.", icon: "simulator" },
    { title: "Clinical Clarity", href: "/clinical-clarity", description: "Understand the pathophysiology behind clinical decisions.", icon: "article" },
  ],
  "exam-prep": [
    { title: "Mock Exams", href: "/mock-exams", description: "Simulate the real exam with full-length timed practice tests.", icon: "qbank" },
    { title: "Test Bank", href: "/free-practice", description: "Practice with thousands of NCLEX-style questions.", icon: "qbank" },
    { title: "Study Plan", href: "/study-plan", description: "Get a personalized daily study plan for exam readiness.", icon: "lesson" },
    { title: "Diagnostic Assessment", href: "/diagnostic-assessment", description: "Identify your strengths and weaknesses with an initial assessment.", icon: "qbank" },
  ],
  "patient-safety": [
    { title: "Safety Hazard Simulator", href: "/safety-hazard-simulator", description: "Identify and mitigate patient safety hazards in clinical settings.", icon: "simulator" },
    { title: "IV Complications Simulator", href: "/iv-complications-simulator", description: "Recognize and manage IV therapy complications.", icon: "simulator" },
    { title: "Blood Transfusion Simulator", href: "/blood-transfusion-simulator", description: "Practice safe blood administration procedures.", icon: "simulator" },
  ],
  pathophysiology: [
    { title: "Clinical Lessons", href: "/lessons", description: "In-depth pathophysiology lessons organized by body system.", icon: "lesson" },
    { title: "Anatomy & Physiology", href: "/anatomy", description: "Review normal anatomy and physiology fundamentals.", icon: "lesson" },
    { title: "Clinical Clarity", href: "/clinical-clarity", description: "Understand disease processes and clinical correlations.", icon: "article" },
  ],
};

const PROFESSION_RESOURCES: Record<string, RelatedResource[]> = {
  nclex: [
    { title: "NCLEX-RN Study Guide", href: "/nclex-rn-guide", description: "Comprehensive NCLEX-RN exam preparation guide.", icon: "article" },
    { title: "NCLEX-RN Practice Questions", href: "/nclex-rn-practice-questions", description: "Thousands of NCLEX-RN style practice questions.", icon: "qbank" },
  ],
  "rex-pn": [
    { title: "REx-PN Study Guide", href: "/rex-pn-guide", description: "Complete REx-PN exam preparation and strategies.", icon: "article" },
    { title: "REx-PN Practice Questions", href: "/rex-pn-practice-questions", description: "Practice questions for the REx-PN exam.", icon: "qbank" },
  ],
  rn: [
    { title: "NCLEX-RN Guide", href: "/nclex-rn-guide", description: "Everything you need for NCLEX-RN preparation.", icon: "article" },
    { title: "RN Practice Questions", href: "/nclex-rn-practice-questions", description: "NCLEX-RN style practice questions.", icon: "qbank" },
    { title: "RN Flashcards", href: "/flashcards", description: "Spaced repetition flashcards for RN students.", icon: "flashcard" },
  ],
  rpn: [
    { title: "REx-PN Guide", href: "/rex-pn-guide", description: "Complete guide for REx-PN exam success.", icon: "article" },
    { title: "RPN Practice Questions", href: "/rex-pn-practice-questions", description: "Practice questions tailored for RPN students.", icon: "qbank" },
  ],
  np: [
    { title: "NP Exam Guide", href: "/np-exam-guide", description: "Study guide for Nurse Practitioner certification exams.", icon: "article" },
    { title: "NP Practice Questions", href: "/np-exam-practice-questions", description: "Practice questions for NP exams.", icon: "qbank" },
  ],
  nursing: [
    { title: "NCLEX-RN Guide", href: "/nclex-rn-guide", description: "Comprehensive NCLEX-RN exam preparation.", icon: "article" },
    { title: "REx-PN Guide", href: "/rex-pn-guide", description: "Complete REx-PN exam preparation guide.", icon: "article" },
  ],
  "respiratory-therapy": [
    { title: "Respiratory Therapy Lessons", href: "/allied/respiratory-therapy/lessons", description: "RRT exam prep lessons and clinical content.", icon: "lesson" },
    { title: "RRT Practice Questions", href: "/allied/respiratory-therapy/qbank", description: "Practice questions for respiratory therapy exams.", icon: "qbank" },
  ],
  "pharmacy-tech": [
    { title: "Pharmacy Tech Lessons", href: "/allied/pharmacy-tech/lessons", description: "PTCB exam prep lessons and study material.", icon: "lesson" },
    { title: "Pharmacy Tech Questions", href: "/allied/pharmacy-tech/qbank", description: "Practice questions for pharmacy technician exams.", icon: "qbank" },
  ],
  paramedic: [
    { title: "Paramedic Lessons", href: "/allied/paramedic/lessons", description: "NREMT and paramedic certification prep content.", icon: "lesson" },
    { title: "Paramedic Practice Questions", href: "/allied/paramedic/qbank", description: "Practice questions for paramedic certification.", icon: "qbank" },
  ],
  mlt: [
    { title: "MLT Lessons", href: "/allied/medical-lab-technologist/lessons", description: "Medical lab technologist exam prep content.", icon: "lesson" },
    { title: "MLT Practice Questions", href: "/allied/medical-lab-technologist/qbank", description: "CSMLS exam practice questions.", icon: "qbank" },
  ],
};

interface ContextualRelatedResourcesProps {
  pageType: "lesson" | "blog" | "examGuide" | "professionHub" | "flashcards" | "qbank" | "mockExams" | "simulators" | "studyGuide" | "content";
  category?: string | null;
  tags?: string[];
  profession?: string;
  currentPath?: string;
  className?: string;
}

export function ContextualRelatedResources({
  pageType,
  category,
  tags = [],
  profession,
  currentPath,
  className = "",
}: ContextualRelatedResourcesProps) {
  const { t } = useI18n();
  const baseKey = pageType === "content" || pageType === "studyGuide" ? "lessons" : pageType;
  const baseResources = STUDY_CROSS_LINKS[baseKey] || STUDY_CROSS_LINKS.lessons;

  const topicResources: RelatedResource[] = [];
  const lowerCategory = (category || "").toLowerCase();
  const lowerTags = tags.map(t => t.toLowerCase());
  const allTopicKeys = [lowerCategory, ...lowerTags];

  for (const key of Object.keys(TOPIC_RESOURCE_MAP)) {
    if (allTopicKeys.some(t => t.includes(key) || key.includes(t))) {
      topicResources.push(...TOPIC_RESOURCE_MAP[key]);
    }
  }

  const professionResources: RelatedResource[] = [];
  if (profession) {
    const profLower = profession.toLowerCase();
    for (const [key, resources] of Object.entries(PROFESSION_RESOURCES)) {
      if (profLower.includes(key) || key.includes(profLower)) {
        professionResources.push(...resources);
        break;
      }
    }
    if (professionResources.length === 0) {
      const crossProfKeys = Object.keys(PROFESSION_RESOURCES).filter(k => k !== profLower);
      const crossKey = crossProfKeys.find(k => ["nursing", "rn", "rpn"].includes(k));
      if (crossKey) {
        professionResources.push(...(PROFESSION_RESOURCES[crossKey] || []).slice(0, 2));
      }
    }
  }

  const seenHrefs = new Set<string>();
  if (currentPath) seenHrefs.add(currentPath);

  const combined: RelatedResource[] = [];

  for (const r of professionResources) {
    if (!seenHrefs.has(r.href)) {
      seenHrefs.add(r.href);
      combined.push(r);
    }
  }

  for (const r of topicResources) {
    if (!seenHrefs.has(r.href)) {
      seenHrefs.add(r.href);
      combined.push(r);
    }
  }

  for (const r of baseResources) {
    if (!seenHrefs.has(r.href)) {
      seenHrefs.add(r.href);
      combined.push(r);
    }
  }

  const maxItems = 6;
  const finalResources = combined.slice(0, maxItems);

  if (finalResources.length === 0) return null;

  return (
    <RelatedResources
      resources={finalResources}
      title={t("components.relatedResources.continueYourLearning")}
      className={className}
    />
  );
}

interface FlashcardStudyCTAProps {
  topic?: string;
  className?: string;
}

export function FlashcardStudyCTA({ topic, className = "" }: FlashcardStudyCTAProps) {
  const { t } = useI18n();
  const href = topic ? `/flashcards?topic=${encodeURIComponent(topic)}` : "/flashcards";
  const description = topic
    ? `Reinforce your understanding of ${topic} with spaced repetition flashcards.`
    : "Boost retention with smart flashcard review.";

  return (
    <div className={`p-4 bg-gradient-to-r from-violet-50 to-indigo-50 rounded-xl border border-violet-100 ${className}`} data-testid="flashcard-study-cta">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-lg bg-violet-100 flex items-center justify-center shrink-0">
          <Sparkles className="w-5 h-5 text-violet-600" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold text-gray-900" data-testid="text-flashcard-cta-title">{t("components.relatedResources.reviewThisConceptWithFlashcards")}</h3>
          <p className="text-xs text-gray-600 mt-0.5" data-testid="text-flashcard-cta-desc">{description}</p>
          <LocaleLink
            href={href}
            className="inline-flex items-center gap-1.5 mt-2 px-3 py-1.5 bg-violet-600 text-white text-xs font-medium rounded-lg hover:bg-violet-700 transition-colors"
            data-testid="link-flashcard-cta"
          >
            <Brain className="w-3.5 h-3.5" /> Study
          </LocaleLink>
        </div>
      </div>
    </div>
  );
}
