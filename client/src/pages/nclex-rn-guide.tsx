import { useState } from "react";
import { useParams } from "wouter";
import { Navigation } from "@/components/navigation";
import HeroFeatureStrip from "@/components/hero-feature-strip";
import HeroTrustIndicator from "@/components/hero-trust-indicator";
import { LocaleLink } from "@/lib/LocaleLink";
import { useI18n } from "@/lib/i18n";
import { useAuth } from "@/lib/auth";
import { SEO } from "@/components/seo";
import {
  BookOpen, CheckCircle, Clock, FileText, Award, Brain, Stethoscope,
  GraduationCap, ChevronRight, ArrowRight, Star, Target, AlertCircle,
  Calendar, HelpCircle, Globe, BarChart, Shield, Lightbulb, Users, Layers
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Footer } from "@/components/footer";
import { BreadcrumbNav } from "@/components/breadcrumb-nav";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { EndOfContentLeadCapture } from "@/components/lead-capture";
import { ContextualRelatedResources, CrossPlatformRelatedContent } from "@/components/related-resources";

const clusterData: Record<string, {
  title: string;
  seoTitle: string;
  description: string;
  icon: any;
  sections: { heading: string; content: string[] }[];
  faqs: { q: string; a: string }[];
}> = {
  "exam-format": {
    title: "NCLEX-RN Exam Format & Structure",
    seoTitle: "NCLEX-RN Exam Format: NGN Question Types, CAT, Timing & Structure (2025)",
    description: "Complete breakdown of the NCLEX-RN exam format including Next Generation NCLEX question types, Computer Adaptive Testing, and timing.",
    icon: FileText,
    sections: [
      {
        heading: "Exam Overview",
        content: [
          "The NCLEX-RN (National Council Licensure Examination for Registered Nurses) is administered by the National Council of State Boards of Nursing (NCSBN) and is required for RN licensure in all US states and territories. It is a computer-adaptive test (CAT) that adjusts question difficulty based on your performance.",
          "Since April 2023, the NCLEX-RN includes Next Generation NCLEX (NGN) item types designed to measure clinical judgment more precisely. These new question formats assess higher-order thinking beyond traditional multiple-choice.",
          "The exam is delivered at Pearson VUE testing centers worldwide. Candidates must receive authorization to test (ATT) from their state board of nursing after completing an approved nursing education program."
        ]
      },
      {
        heading: "Next Generation NCLEX (NGN) Question Types",
        content: [
          "Extended Multiple Response: Unlike traditional Select All That Apply (SATA), these questions may have a specified number of correct answers (e.g., 'Select 3 that apply') and may include partial credit scoring.",
          "Extended Drag and Drop: Candidates drag response options to designated targets to demonstrate understanding of sequences, categories, or relationships between clinical concepts.",
          "Cloze (Drop-Down): Sentences or clinical notes with embedded dropdown menus where candidates select the most appropriate word or phrase to complete clinical documentation or reasoning.",
          "Enhanced Hot Spot: Candidates click on specific areas of an image, chart, or exhibit to identify relevant findings. May require identifying multiple areas.",
          "Matrix/Grid: A table format where candidates make selections across multiple rows and columns, often used for assessment findings, medication parameters, or care planning.",
          "Trend Items: Present data that changes over time (vital signs, lab values) and require candidates to identify trends, evaluate significance, and determine appropriate nursing actions.",
          "Bowtie Items: Present a clinical scenario where candidates must identify the condition, risk factors, and appropriate interventions in a structured bowtie format.",
          "Case Studies: Unfolding case studies with 6 questions that follow a patient through a clinical scenario, testing the full clinical judgment process from recognition to evaluation."
        ]
      },
      {
        heading: "Computer Adaptive Testing (CAT)",
        content: [
          "The NCLEX-RN uses CAT, meaning the computer selects each subsequent question based on how you answered the previous one. If you answer correctly, the next question is more difficult. If you answer incorrectly, the next question is easier.",
          "The exam continues until the computer determines with 95% confidence that you are either above or below the passing standard, or until you reach the maximum number of questions or time limit.",
          "Minimum questions: 85 (including 15 pretest items). Maximum questions: 150. Maximum time: 5 hours. The number of questions you receive does not indicate pass or fail.",
          "Pretest items are unscored questions being validated for future exams. They appear identical to scored items and are distributed throughout the exam."
        ]
      },
      {
        heading: "Timing & Scheduling",
        content: [
          "Total appointment time is 6 hours, which includes a tutorial, two optional pre-scheduled breaks (after 2 hours and 3.5 hours), and the exam itself (5 hours maximum testing time).",
          "Candidates should arrive 30 minutes before their scheduled appointment. Government-issued photo ID and fingerprinting/palm vein scanning are required for security.",
          "Results are typically available within 48 hours through your state board of nursing. NCSBN offers an unofficial 'Quick Results' service for $7.95, available 2 business days after testing."
        ]
      }
    ],
    faqs: [
      { q: "How many questions are on the NCLEX-RN?", a: "Between 85 and 150 questions, including 15 pretest (unscored) items. The CAT stops when it determines your competency level with 95% confidence." },
      { q: "What percentage of the NCLEX-RN is NGN questions?", a: "Approximately 20-25% of scored items are NGN format. The remainder are traditional multiple-choice, SATA, fill-in-the-blank, ordered response, and hot spot items." },
      { q: "Does getting fewer questions mean I passed?", a: "Not necessarily. The exam stops when the computer is confident in its decision, whether pass or fail. Finishing at 85 questions can mean either result." },
      { q: "Can I go back and change answers?", a: "No. Once you confirm an answer and move to the next question, you cannot return to previous questions. This is a fundamental feature of CAT." },
      { q: "How is the NCLEX-RN scored?", a: "The NCLEX-RN is pass/fail. There is no percentage score. The CAT algorithm determines if your ability level is consistently above or below the passing standard." }
    ]
  },
  "blueprint": {
    title: "NCLEX-RN Content Blueprint & Client Needs",
    seoTitle: "NCLEX-RN Test Plan: Client Needs Categories & Content Weighting (2025)",
    description: "Detailed breakdown of the NCLEX-RN test plan content categories, Client Needs framework, and percentage weighting for each domain.",
    icon: Target,
    sections: [
      {
        heading: "Client Needs Framework",
        content: [
          "The NCLEX-RN organizes content into the Client Needs framework, which consists of 4 major categories and 8 subcategories. This framework is the foundation of the test plan and determines the distribution of questions on the exam.",
          "Understanding the percentage breakdown helps you allocate study time effectively. Categories with higher percentages deserve proportionally more preparation time."
        ]
      },
      {
        heading: "Safe and Effective Care Environment (26-38%)",
        content: [
          "Management of Care (17-23%): This is the largest single subcategory. It includes advance directives, advocacy, assignment/delegation/supervision, case management, informed consent, continuity of care, establishing priorities, ethical practice, legal rights, performance improvement, referrals, and collaboration with the interprofessional team.",
          "Safety and Infection Control (9-15%): Covers accident/error/injury prevention, emergency response, ergonomic principles, handling hazardous materials, home safety, reporting incidents, safe use of equipment, security plans, standard precautions, surgical asepsis, and use of restraints."
        ]
      },
      {
        heading: "Health Promotion and Maintenance (6-12%)",
        content: [
          "This category covers the entire lifespan from prenatal through aging. Content includes ante/intra/postpartum and newborn care, developmental stages, health promotion and disease prevention, health screening, high-risk behaviors, lifestyle choices, self-care, and techniques of physical assessment.",
          "Questions test your ability to provide anticipatory guidance, recognize developmental milestones, and promote wellness across all age groups."
        ]
      },
      {
        heading: "Psychosocial Integrity (6-12%)",
        content: [
          "Covers abuse/neglect, behavioral interventions, chemical dependency, coping mechanisms, crisis intervention, cultural awareness, end-of-life care, family dynamics, grief and loss, mental health concepts, religious/spiritual influences, sensory/perceptual alterations, stress management, support systems, and therapeutic communication.",
          "These questions often require understanding of therapeutic vs. non-therapeutic nursing responses and appropriate boundaries."
        ]
      },
      {
        heading: "Physiological Integrity (38-62%)",
        content: [
          "Basic Care and Comfort (6-12%): Assistive devices, elimination, mobility/immobility, non-pharmacological comfort interventions, nutrition, personal hygiene, rest and sleep.",
          "Pharmacological and Parenteral Therapies (13-19%): Adverse effects/interactions, blood products, central venous access, dosage calculation, expected outcomes, IV therapies, medication administration, parenteral/IV therapies, pharmacological agents, total parenteral nutrition.",
          "Reduction of Risk Potential (9-15%): Changes in body systems, diagnostic tests, lab values, potential complications, system-specific assessments, therapeutic procedures, vital signs.",
          "Physiological Adaptation (11-17%): Alterations in body systems, fluid/electrolyte imbalances, hemodynamics, illness management, medical emergencies, pathophysiology, unexpected response to therapies."
        ]
      }
    ],
    faqs: [
      { q: "Which NCLEX-RN content area is tested the most?", a: "Physiological Integrity is the largest category at 38-62% of the exam. Within it, Pharmacological and Parenteral Therapies (13-19%) is the most heavily weighted subcategory." },
      { q: "How should I allocate study time based on the blueprint?", a: "Spend roughly proportional time to each category's weight. Physiological Integrity and Management of Care together account for over 60% of the exam and deserve the most attention." },
      { q: "Does the test plan change?", a: "NCSBN reviews and updates the test plan every 3 years based on practice analysis surveys. The current plan reflects entry-level RN practice requirements." },
      { q: "Are all Client Needs categories tested equally?", a: "No. Physiological Integrity can be up to 62% while Health Promotion and Psychosocial are each 6-12%. The variable ranges allow CAT to adjust based on your performance pattern." }
    ]
  },
  "passing-standard": {
    title: "NCLEX-RN Passing Standard & Scoring",
    seoTitle: "How NCLEX-RN Scoring Works: Passing Standard, CAT Logic & Results (2025)",
    description: "Understanding the NCLEX-RN passing standard, how Computer Adaptive Testing determines pass/fail, and what your results mean.",
    icon: Award,
    sections: [
      {
        heading: "The Passing Standard",
        content: [
          "The NCLEX-RN passing standard (also called the 'cut score') is set by the NCSBN Board of Directors based on recommendations from an expert panel. It represents the minimum competency level expected of entry-level registered nurses.",
          "The passing standard is reviewed and potentially adjusted every 3 years based on current nursing practice requirements. The most recent adjustment occurred in April 2023 with the introduction of NGN items.",
          "The standard is expressed as a logit value on the NCLEX ability scale, not as a percentage of questions answered correctly. This means there is no fixed 'percentage to pass' — it depends on the difficulty of the questions you received."
        ]
      },
      {
        heading: "How CAT Determines Pass/Fail",
        content: [
          "The CAT algorithm continuously estimates your ability level as you answer questions. After each response, it recalculates your estimated ability and the confidence interval around that estimate.",
          "Three decision rules determine when the exam stops: (1) The 95% Confidence Interval Rule — when the confidence interval of your ability estimate no longer overlaps with the passing standard. (2) The Maximum Questions Rule — at 150 questions, the computer uses the final ability estimate. (3) The Maximum Time Rule — at 5 hours, the computer uses the ability estimate from the last 60 questions answered.",
          "If you run out of time before answering the minimum 85 questions, you fail regardless of performance."
        ]
      },
      {
        heading: "Understanding Your Results",
        content: [
          "The NCLEX-RN is strictly pass/fail. You will not receive a numerical score, percentile ranking, or breakdown by content area.",
          "If you do not pass, you will receive a Candidate Performance Report (CPR) that shows your performance relative to the passing standard in each Client Needs category. This helps guide your study focus for a retake.",
          "Retake policies vary by jurisdiction but generally require a 45-day waiting period. Some states limit the number of attempts per year."
        ]
      }
    ],
    faqs: [
      { q: "What percentage do you need to pass the NCLEX-RN?", a: "There is no fixed percentage. The CAT algorithm determines if your ability level is above the passing standard based on question difficulty and your response pattern." },
      { q: "Is the NCLEX-RN getting harder?", a: "The passing standard is periodically reviewed. When adjusted, it reflects current entry-level practice requirements. NGN items added complexity but also offer partial credit scoring." },
      { q: "How long do I wait for NCLEX-RN results?", a: "Official results come from your state board, typically within 2-6 weeks. Unofficial Quick Results are available from Pearson VUE within 2 business days for $7.95." }
    ]
  },
  "study-plan": {
    title: "NCLEX-RN Study Strategies & Plan",
    seoTitle: "How to Study for NCLEX-RN: Proven Study Plan & Strategies (2025)",
    description: "Evidence-based study strategies and a structured study plan for NCLEX-RN success, including NGN preparation techniques.",
    icon: Calendar,
    sections: [
      {
        heading: "Building Your Study Plan",
        content: [
          "Most successful candidates study for 6-12 weeks after graduation. Full-time studiers (6-8 hours/day) often use 4-6 week plans, while those working part-time may need 8-12 weeks. Consistency matters more than total hours.",
          "Structure your plan around the Client Needs blueprint percentages. Allocate more time to Physiological Integrity (38-62%) and Management of Care (17-23%) as these dominate the exam.",
          "Use the 60/30/10 rule: spend 60% of study time on practice questions with rationale review, 30% on content review (focusing on weak areas), and 10% on test-taking strategies and self-care."
        ]
      },
      {
        heading: "Mastering NGN Question Types",
        content: [
          "Practice with all NGN formats regularly. The Clinical Judgment Measurement Model (CJMM) underlies these items: Recognize Cues → Analyze Cues → Prioritize Hypotheses → Generate Solutions → Take Action → Evaluate Outcomes.",
          "For case studies: read the entire scenario before answering. Information revealed in early questions often provides context needed for later ones. Focus on what changed rather than what stayed the same.",
          "For trend items: look for patterns across time points. Is the patient improving, deteriorating, or staying stable? What triggered the change? What should you do next?",
          "For bowtie items: start with the central condition, then work outward to risk factors and interventions. Use your pathophysiology knowledge to connect the pieces."
        ]
      },
      {
        heading: "High-Yield Study Strategies",
        content: [
          "Active recall and spaced repetition are the most effective study methods. Use flashcards with increasing intervals rather than re-reading notes passively.",
          "Focus on 'priority' and 'first action' thinking. The NCLEX-RN tests your ability to prioritize, not just know facts. Ask yourself: What is the most important thing to do first? What is the biggest risk?",
          "Master delegation rules: RNs delegate to LPNs and UAPs based on the 5 Rights of Delegation. Know what tasks can be delegated and what cannot.",
          "Learn lab values in ranges and clinical significance, not just numbers. Know what to do when values are abnormal — this is what the exam tests."
        ]
      },
      {
        heading: "Test Day Strategies",
        content: [
          "Read every word of every question carefully. NCLEX questions are precisely written — one word can change the entire meaning.",
          "Use the process of elimination: if you can eliminate 2 options, your odds improve dramatically. Look for absolute words (always, never) which are usually incorrect.",
          "Manage your time and energy. Take both scheduled breaks even if you feel fine. Fatigue-related errors increase significantly after 3 hours of testing.",
          "Trust your preparation. If you have been consistently scoring above the passing standard on practice tests, you are ready."
        ]
      }
    ],
    faqs: [
      { q: "How long should I study for the NCLEX-RN?", a: "Most successful candidates study 6-12 weeks, with 4-6 weeks being common for full-time studiers. The key is consistent daily practice rather than cramming." },
      { q: "How many practice questions should I do?", a: "Aim for 2,000-3,000 practice questions total during your study period. Quality matters: always read rationales for both correct and incorrect answers." },
      { q: "Should I study content or do practice questions?", a: "Both, but weight toward practice questions (60% of study time). Practice questions with detailed rationales teach you both content and critical thinking simultaneously." },
      { q: "What's the best way to prepare for NGN questions?", a: "Practice with case studies and clinical scenarios that require multi-step reasoning. Focus on the Clinical Judgment Measurement Model and practice identifying cues, analyzing data, and prioritizing actions." }
    ]
  },
  "ngn-guide": {
    title: "Next Generation NCLEX (NGN) Complete Guide",
    seoTitle: "Next Generation NCLEX Guide: New Question Types, CJMM & How to Prepare (2025)",
    description: "Everything you need to know about Next Generation NCLEX changes, the Clinical Judgment Measurement Model, and how to prepare for NGN question types.",
    icon: Layers,
    sections: [
      {
        heading: "What Changed with NGN",
        content: [
          "The Next Generation NCLEX launched in April 2023, representing the most significant change to the NCLEX since computerized adaptive testing was introduced in 1994. NGN was developed because research showed that traditional multiple-choice questions alone could not adequately measure clinical judgment.",
          "NGN adds new item types that assess the full clinical judgment process, not just knowledge recall. These items can measure how candidates recognize relevant cues, analyze information, prioritize hypotheses, and evaluate outcomes.",
          "NGN items use a new scoring model called polytomous scoring (partial credit). Unlike traditional items that are scored 0/1 (right/wrong), NGN items can award partial credit for partially correct responses. This makes the exam more fair and precise."
        ]
      },
      {
        heading: "Clinical Judgment Measurement Model (CJMM)",
        content: [
          "The CJMM is the theoretical framework underlying all NGN items. It was developed by NCSBN through extensive research and describes the cognitive processes nurses use to make clinical decisions.",
          "Layer 3 (the testable layer) consists of 6 cognitive skills: (1) Recognize Cues — identify relevant information from assessment data. (2) Analyze Cues — connect data to determine what it means clinically. (3) Prioritize Hypotheses — rank the possible explanations or conditions by likelihood and urgency. (4) Generate Solutions — identify the appropriate nursing actions or interventions. (5) Take Action — implement the priority interventions. (6) Evaluate Outcomes — determine if the interventions were effective and what to do next.",
          "Each NGN item targets one or more of these cognitive skills. Understanding which skill is being tested helps you approach questions systematically."
        ]
      },
      {
        heading: "Unfolding Case Studies",
        content: [
          "Unfolding case studies are the signature NGN item type. Each case follows a single patient through a clinical scenario and consists of 6 questions that map to the CJMM cognitive skills.",
          "The cases unfold in phases: initial assessment → forming hypotheses → planning care → implementing interventions → evaluating outcomes. New information is revealed at each phase, and you must integrate previous data with new findings.",
          "Strategy: Read each phase carefully and note what has changed. The case tests whether you can adapt your clinical reasoning as the patient's condition evolves. Don't assume previous answers — the situation may have changed."
        ]
      },
      {
        heading: "Scoring and Impact",
        content: [
          "NGN items use polytomous scoring, meaning you can earn partial credit. For example, if a matrix item has 8 correct selections and you identify 6, you earn partial credit rather than zero.",
          "This scoring model reduces the impact of a single error and provides a more accurate measurement of your ability. However, completely wrong answers still receive zero credit.",
          "NGN items are weighted similarly to traditional items in the CAT algorithm. Getting NGN items wrong does not disproportionately hurt you — they simply provide more information to the algorithm about your clinical judgment ability."
        ]
      }
    ],
    faqs: [
      { q: "What percentage of the NCLEX-RN is NGN?", a: "Approximately 20-25% of scored items use NGN formats. The remainder are traditional item types (multiple-choice, SATA, fill-in-the-blank, ordered response, hot spot)." },
      { q: "Is partial credit given on NGN items?", a: "Yes. NGN items use polytomous scoring where you can earn partial credit for partially correct responses. This is different from traditional items which are scored all-or-nothing." },
      { q: "Are case studies on every NCLEX-RN exam?", a: "Yes. Every candidate receives 3 unfolding case studies with 6 questions each (18 case study items total), plus standalone NGN items." },
      { q: "Do I need special preparation for NGN?", a: "Practice with NGN-specific question types and focus on the Clinical Judgment Measurement Model. The key difference is that NGN tests process (how you think) not just product (what you know)." }
    ]
  }
};

const clusterList = [
  { slug: "exam-format", icon: FileText, title: "Exam Format & NGN", desc: "CAT, NGN question types, timing, and structure" },
  { slug: "blueprint", icon: Target, title: "Content Blueprint", desc: "Client Needs categories and percentage weighting" },
  { slug: "passing-standard", icon: Award, title: "Passing Standard", desc: "How scoring works and what results mean" },
  { slug: "study-plan", icon: Calendar, title: "Study Strategies", desc: "Proven study plan and high-yield techniques" },
  { slug: "ngn-guide", icon: Layers, title: "NGN Complete Guide", desc: "Next Generation NCLEX deep dive" },
];

function ClusterDetailView({ slug }: { slug: string }) {
  const { t } = useI18n();
  const cluster = clusterData[slug];
  if (!cluster) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">{t("pages.nclexRnGuide.topicNotFound")}</h1>
        <p className="text-gray-600 mb-6">{t("pages.nclexRnGuide.theNclexrnGuideTopicYoure")}</p>
        <LocaleLink href="/nclex-rn-guide">
          <Button variant="outline" data-testid="button-back-nclex-rn">{t("pages.nclexRnGuide.backToNclexrnGuide")}</Button>
        </LocaleLink>
      </div>
    );
  }

  const ClusterIcon = cluster.icon;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <BreadcrumbNav title={cluster.title} />
      <LocaleLink href="/nclex-rn-guide">
        <Button variant="ghost" className="mb-6 text-sm text-gray-500 hover:text-primary" data-testid="button-back-nclex-rn">
          <ChevronRight className="w-4 h-4 mr-1 rotate-180" /> Back to NCLEX-RN Guide
        </Button>
      </LocaleLink>

      <div className="flex items-center gap-3 mb-8">
        <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center">
          <ClusterIcon className="w-6 h-6 text-blue-600" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-900" data-testid="text-cluster-title">{cluster.title}</h1>
          <p className="text-sm text-gray-500 mt-1">{cluster.description}</p>
        </div>
      </div>

      <div className="space-y-8">
        {cluster.sections.map((section, i) => (
          <div key={i} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8" data-testid={`section-cluster-${i}`}>
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span className="w-7 h-7 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-bold">{i + 1}</span>
              {section.heading}
            </h2>
            <div className="space-y-4">
              {section.content.map((para, j) => (
                <p key={j} className="text-gray-600 leading-relaxed text-[15px]">{para}</p>
              ))}
            </div>
          </div>
        ))}
      </div>

      {cluster.faqs.length > 0 && (
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6" data-testid="text-cluster-faq-heading">{t("pages.nclexRnGuide.frequentlyAskedQuestions")}</h2>
          <Accordion type="single" collapsible className="space-y-3">
            {cluster.faqs.map((faq, i) => (
              <AccordionItem key={i} value={`faq-${i}`} className="bg-white rounded-xl border border-gray-100 shadow-sm px-6" data-testid={`faq-cluster-${i}`}>
                <AccordionTrigger className="text-left text-gray-900 font-medium text-[15px] hover:no-underline py-5">
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent className="text-gray-600 leading-relaxed text-[14px] pb-5">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      )}

      <div className="mt-12 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border border-blue-100 p-8 text-center" data-testid="section-cluster-cta">
        <h3 className="text-xl font-bold text-gray-900 mb-3">{t("pages.nclexRnGuide.readyToStartPracticing")}</h3>
        <p className="text-gray-600 mb-6 max-w-lg mx-auto">{t("pages.nclexRnGuide.applyWhatYouveLearnedWith")}</p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <LocaleLink href="/lessons">
            <Button className="rounded-full px-6" data-testid="button-cluster-lessons">
              <BookOpen className="w-4 h-4 mr-2" /> Browse Lessons
            </Button>
          </LocaleLink>
          <LocaleLink href="/start-free">
            <Button variant="outline" className="rounded-full px-6" data-testid="button-cluster-start-free">
              Start Free <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </LocaleLink>
        </div>
      </div>
    </div>
  );
}

export default function NclexRnGuide() {
  const params = useParams<{ slug?: string }>();
  const slug = params?.slug;

  if (slug && clusterData[slug]) {
    return (
      <div className="min-h-screen bg-warmwhite flex flex-col">
        <SEO
          title={clusterData[slug].seoTitle}
          description={clusterData[slug].description}
          keywords="NCLEX-RN, NCLEX prep, nursing exam, Next Generation NCLEX, NGN, clinical judgment, RN licensure, nursing board exam"
          canonicalPath={`/nclex-rn-guide/${slug}`}
        />
        <Navigation />
        <main className="flex-grow">
          <ClusterDetailView slug={slug} />
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-warmwhite flex flex-col">
      <SEO
        title={t("pages.nclexRnGuide.nclexrnExamPrepGuideFormat")}
        description={t("pages.nclexRnGuide.completeNclexrnPreparationGuideCovering")}
        keywords="NCLEX-RN, NCLEX prep, nursing exam, RN licensure, Next Generation NCLEX, NGN, clinical judgment, NCSBN, nursing board exam, NCLEX study plan"
        canonicalPath="/nclex-rn-guide"
        structuredData={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          "mainEntity": [
            { "@type": "Question", "name": "How many questions are on the NCLEX-RN?", "acceptedAnswer": { "@type": "Answer", "text": "Between 85 and 150 questions, including 15 pretest items. The CAT stops when it determines your competency with 95% confidence." } },
            { "@type": "Question", "name": "What are Next Generation NCLEX (NGN) question types?", "acceptedAnswer": { "@type": "Answer", "text": "NGN includes extended drag-and-drop, cloze, enhanced hot spot, matrix/grid, trend items, bowtie items, and unfolding case studies with 6 questions each." } },
            { "@type": "Question", "name": "What is the NCLEX-RN passing rate?", "acceptedAnswer": { "@type": "Answer", "text": "First-time pass rates for US-educated candidates are approximately 85-90%. International candidates pass at approximately 50-55%." } },
          ]
        }}
      />
      <Navigation />

      <main className="flex-grow">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
          <BreadcrumbNav />
        </div>
        <section className="relative overflow-hidden py-20 lg:py-24" data-testid="section-nclex-rn-hero">
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
            <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] rounded-full bg-blue-100/40 blur-3xl" />
            <div className="absolute bottom-[10%] left-[-10%] w-[600px] h-[600px] rounded-full bg-indigo-100/30 blur-3xl" />
          </div>
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-200 mb-6">
              <span className="text-xl" role="img" aria-label={t("pages.nclexRnGuide.unitedStates")}>🇺🇸</span>
              <span className="text-xs font-bold text-blue-700 uppercase tracking-wider">{t("pages.nclexRnGuide.nclexrnExamPreparation")}</span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-gray-900 leading-[1.1] mb-6" data-testid="text-nclex-rn-heading">
              Learn Deeper. Remember Longer. Pass the NCLEX-RN.
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed mb-8" data-testid="text-nclex-rn-subtitle">
              Our retention-focused NCLEX preparation system uses active recall, spaced repetition, and clinical decision training — covering Next Generation NCLEX question types and the Clinical Judgment Measurement Model.
            </p>
            <div className="flex flex-wrap justify-center gap-3 mb-8">
              <div className="flex items-center gap-2 px-4 py-2.5 bg-white/70 rounded-full border border-blue-100 shadow-sm">
                <CheckCircle className="w-4 h-4 text-blue-600" />
                <span className="text-sm text-gray-700">{t("pages.nclexRnGuide.ngnQuestionTypes")}</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2.5 bg-white/70 rounded-full border border-blue-100 shadow-sm">
                <CheckCircle className="w-4 h-4 text-blue-600" />
                <span className="text-sm text-gray-700">{t("pages.nclexRnGuide.clinicalJudgmentModel")}</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2.5 bg-white/70 rounded-full border border-blue-100 shadow-sm">
                <CheckCircle className="w-4 h-4 text-blue-600" />
                <span className="text-sm text-gray-700">{t("pages.nclexRnGuide.ncsbnStandards")}</span>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <LocaleLink href="/start-free">
                <Button size="lg" className="h-12 px-8 text-base rounded-full shadow-lg" data-testid="button-nclex-rn-start">
                  Start NCLEX-RN Prep Free <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </LocaleLink>
              <LocaleLink href="/lessons">
                <Button size="lg" variant="outline" className="h-12 px-8 text-base rounded-full" data-testid="button-nclex-rn-browse">
                  <BookOpen className="mr-2 w-5 h-5" /> Browse Content
                </Button>
              </LocaleLink>
            </div>
          </div>
        </section>

        <HeroFeatureStrip />
        <HeroTrustIndicator />

        <section className="py-16 bg-white border-y border-gray-100" data-testid="section-nclex-rn-clusters">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold text-gray-900 mb-3" data-testid="text-nclex-rn-explore">{t("pages.nclexRnGuide.exploreTheNclexrn")}</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">{t("pages.nclexRnGuide.everythingYouNeedToKnow")}</p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {clusterList.map((cluster) => {
                const Icon = cluster.icon;
                return (
                  <LocaleLink key={cluster.slug} href={`/nclex-rn-guide/${cluster.slug}`}>
                    <Card className="h-full cursor-pointer hover:shadow-lg hover:border-blue-200 transition-all duration-300 hover:-translate-y-1 group" data-testid={`card-cluster-${cluster.slug}`}>
                      <CardContent className="p-5">
                        <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                          <Icon className="w-5 h-5 text-blue-600" />
                        </div>
                        <h3 className="font-semibold text-gray-900 mb-1">{cluster.title}</h3>
                        <p className="text-sm text-gray-500">{cluster.desc}</p>
                      </CardContent>
                    </Card>
                  </LocaleLink>
                );
              })}
            </div>
          </div>
        </section>

        <section className="py-16 bg-gradient-to-b from-white to-blue-50/50" data-testid="section-nclex-rn-stats">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold text-gray-900 mb-3">{t("pages.nclexRnGuide.nclexrnAtAGlance")}</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: "Questions", value: "85–150", icon: FileText, color: "blue" },
                { label: "Time Limit", value: "5 hours", icon: Clock, color: "indigo" },
                { label: "Format", value: "CAT + NGN", icon: Brain, color: "purple" },
                { label: "Results", value: "Pass/Fail", icon: Award, color: "emerald" },
              ].map((stat, i) => (
                <Card key={i} className="text-center" data-testid={`stat-nclex-${i}`}>
                  <CardContent className="p-5">
                    <stat.icon className={`w-6 h-6 text-${stat.color}-600 mx-auto mb-2`} />
                    <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                    <div className="text-xs text-gray-500 font-medium uppercase tracking-wide mt-1">{stat.label}</div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 bg-white" data-testid="section-nclex-rn-why">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold text-gray-900 mb-3">{t("pages.nclexRnGuide.whyPrepareWithNursenest")}</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">{t("pages.nclexRnGuide.ourContentIsSpecificallyDesigned")}</p>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                { icon: Brain, title: "Clinical Judgment Focus", desc: "Practice questions built around the CJMM framework — the same model the NCLEX uses to measure your readiness." },
                { icon: Layers, title: "NGN Question Practice", desc: "Full library of Next Generation NCLEX question types including case studies, trend items, bowtie, and matrix questions." },
                { icon: Target, title: "Blueprint-Aligned Content", desc: "All lessons and practice questions mapped to the NCLEX-RN Client Needs categories with proper weighting." },
              ].map((feature, i) => (
                <Card key={i} className="border-blue-100 hover:shadow-lg transition-shadow" data-testid={`card-why-${i}`}>
                  <CardContent className="p-6">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center mb-4">
                      <feature.icon className="w-5 h-5 text-blue-600" />
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2">{feature.title}</h3>
                    <p className="text-sm text-gray-600 leading-relaxed">{feature.desc}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 bg-gradient-to-br from-blue-600 to-indigo-700 text-white" data-testid="section-nclex-rn-cta">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold mb-4">{t("pages.nclexRnGuide.startYourNclexrnJourneyToday")}</h2>
            <p className="text-blue-100 text-lg mb-8 max-w-2xl mx-auto">{t("pages.nclexRnGuide.joinThousandsOfNursingStudents")}</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <LocaleLink href="/start-free">
                <Button size="lg" className="h-12 px-8 text-base rounded-full bg-white text-blue-700 hover:bg-blue-50" data-testid="button-nclex-rn-final-cta">
                  Start Free — No Credit Card <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </LocaleLink>
              <LocaleLink href="/pricing">
                <Button size="lg" variant="outline" className="h-12 px-8 text-base rounded-full border-white/30 text-white hover:bg-white/10" data-testid="button-nclex-rn-pricing">
                  See Plans
                </Button>
              </LocaleLink>
            </div>
          </div>
        </section>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <ContextualRelatedResources
            pageType="examGuide"
            tags={["nclex-rn", "exam-prep"]}
            profession="rn"
            currentPath="/nclex-rn-guide"
            className="border-t border-gray-200"
          />
          <CrossPlatformRelatedContent
            slug="nclex-rn"
            source="nursing"
          />
        </div>
        <EndOfContentLeadCapture
          leadMagnetType="practice_questions"
          professionContext="NCLEX-RN"
          source="nclex_rn_guide"
        />
      </main>

      <Footer />
    </div>
  );
}
