import { useState, useEffect } from "react";
import { useParams } from "wouter";
import { Navigation } from "@/components/navigation";
import { LocaleLink } from "@/lib/LocaleLink";
import { useI18n } from "@/lib/i18n";
import { useAuth } from "@/lib/auth";
import { AdminEditButton } from "@/components/admin-edit-button";
import { SEO } from "@/components/seo";
import {
  BookOpen, CheckCircle, Clock, MapPin, FileText, Award, Brain, Stethoscope,
  GraduationCap, ChevronRight, ArrowRight, Star, Target, AlertCircle, DollarSign,
  Calendar, HelpCircle, Globe, BarChart, Shield, Lightbulb, Users, Pill
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BreadcrumbNav } from "@/components/breadcrumb-nav";
import { EndOfContentLeadCapture } from "@/components/lead-capture";
import { ContextualRelatedResources, CrossPlatformRelatedContent } from "@/components/related-resources";
import { ExplanationPromoBanner } from "@/components/explanation-panel";
import { ComparisonTable, DifferentiatorCTA } from "@/components/competitive-differentiation";

const clusterData: Record<string, {
  title: string;
  seoTitle: string;
  description: string;
  icon: any;
  sections: { heading: string; content: string[] }[];
  faqs: { q: string; a: string }[];
}> = {
  "exam-format": {
    title: "Canadian NP Exam Format & Structure",
    seoTitle: "Canadian NP Licensing Exam Format: Questions, Timing & Structure (2025)",
    description: "Complete breakdown of the Canadian NP licensing exam format including question types, timing, and computer-based testing structure.",
    icon: FileText,
    sections: [
      {
        heading: "Exam Overview",
        content: [
          "The Canadian Nurse Practitioner Examination (CNPE) is a computer-based, standardized assessment administered by the Canadian Council of Registered Nurse Regulators (CCRNR). It serves as the national licensing examination for all nurse practitioner candidates in Canada, regardless of which province or territory they intend to practice in.",
          "The examination is delivered through Yardstick Assessment Strategies (formerly known as Assessment Strategies Inc.) at Prometric testing centres across Canada. The exam is available in both English and French, reflecting Canada's bilingual healthcare system.",
          "The CNPE replaced the previous provincial NP examinations to create a single, unified standard for NP licensure across Canada. This ensures consistent competency assessment regardless of where candidates completed their education or intend to practice."
        ]
      },
      {
        heading: "Question Types",
        content: [
          "The Canadian NP exam uses multiple-choice questions (MCQs) as its primary format. Each question presents a clinical scenario followed by four answer options, of which only one is the best or most correct answer. Questions are designed to test clinical reasoning rather than simple recall.",
          "Case-based question clusters are a significant component of the exam. These present an extended clinical scenario that unfolds across 3-5 related questions, simulating the progressive nature of real clinical encounters. Candidates must integrate information from each part of the case to answer subsequent questions effectively.",
          "Independent standalone questions test specific competencies in isolation. These cover a wide range of clinical presentations, pharmacological knowledge, diagnostic reasoning, and professional practice standards. The questions are written at the application and analysis cognitive levels, requiring candidates to apply their knowledge to realistic clinical situations.",
          "All questions are developed by experienced Canadian nurse practitioners and undergo rigorous psychometric validation to ensure they meet standards for fairness, clinical accuracy, and discrimination between candidates at different competency levels."
        ]
      },
      {
        heading: "Timing & Structure",
        content: [
          "The exam allows approximately 4 hours of testing time. Candidates receive a brief tutorial before the examination begins to familiarize themselves with the computer interface. The total appointment time, including check-in and the tutorial, is approximately 4.5 hours.",
          "The exam contains approximately 145-170 questions, though the exact number may vary. A portion of these are unscored pilot questions being validated for future use. Candidates cannot distinguish between scored and pilot questions during the exam.",
          "There are no mandatory breaks, but candidates may take unscheduled breaks as needed. Break time is deducted from the total exam time. The computer-based format allows candidates to flag questions for review and navigate back to previous questions within the exam.",
          "Questions are presented one at a time. Candidates can change their answers at any time before submitting the exam. Once the exam is submitted, no changes can be made."
        ]
      },
      {
        heading: "Computer-Based Testing Environment",
        content: [
          "The exam is administered at Prometric testing centres, which provide standardized, secure testing environments. Candidates must present valid government-issued photo identification upon arrival. Personal items, including phones, watches, and study materials, must be secured in designated lockers.",
          "The testing interface includes basic on-screen tools such as a calculator, a highlighting feature, and the ability to flag questions for review. Scratch paper or an erasable notepad is provided at the testing centre for calculations and note-taking during the exam.",
          "Special accommodations are available for candidates with documented disabilities or medical conditions. Requests for accommodations must be submitted well in advance of the exam date, along with supporting documentation from a qualified healthcare provider."
        ]
      }
    ],
    faqs: [
      { q: "How many questions are on the Canadian NP exam?", a: "The exam contains approximately 145-170 multiple-choice questions. Some questions are unscored pilot items being validated for future exams." },
      { q: "How long is the Canadian NP exam?", a: "Candidates have approximately 4 hours of testing time. Including check-in and tutorial, the total appointment is about 4.5 hours." },
      { q: "Can I go back and change answers?", a: "Yes. The computer-based format allows you to navigate freely between questions, flag items for review, and change answers before final submission." },
      { q: "Is the NP exam available in French?", a: "Yes. The Canadian NP exam is available in both English and French at all Prometric testing centres." },
      { q: "What question format does the exam use?", a: "The exam uses multiple-choice questions (MCQs) with four options each, including standalone questions and case-based question clusters." }
    ]
  },
  "blueprint": {
    title: "Canadian NP Exam Blueprint & Content Domains",
    seoTitle: "Canadian NP Exam Blueprint: Competency Domains & Content Breakdown (2025)",
    description: "Detailed breakdown of the Canadian NP exam blueprint competency domains, content weighting, and what to expect in each area.",
    icon: Target,
    sections: [
      {
        heading: "Competency Framework Overview",
        content: [
          "The Canadian NP exam blueprint is based on the Entry-Level Competencies for Nurse Practitioners in Canada, developed by the Canadian Council of Registered Nurse Regulators (CCRNR). This framework defines the knowledge, skills, and judgment expected of all entry-level nurse practitioners regardless of their practice setting.",
          "The competency framework is organized into distinct domains that reflect the scope of NP practice in Canada. Each domain is weighted proportionally on the exam based on its importance to entry-level practice. The weighting is determined through regular practice analysis surveys conducted with practicing NPs across Canada.",
          "Understanding the blueprint is essential for targeted exam preparation. Candidates should allocate study time proportionally to each domain's weighting rather than spending equal time on all areas."
        ]
      },
      {
        heading: "Health Assessment & Diagnosis (Approximately 30-35%)",
        content: [
          "This is the most heavily weighted domain, reflecting the foundational importance of clinical assessment skills in NP practice. Questions test the ability to conduct comprehensive and focused health assessments, interpret findings, and formulate differential diagnoses.",
          "Key content areas include: comprehensive health history taking, physical examination techniques, ordering and interpreting diagnostic tests (laboratory, imaging, ECG), formulating differential diagnoses based on clinical findings, applying clinical reasoning frameworks, and recognizing red flags that require urgent referral.",
          "Candidates should be prepared to integrate subjective and objective data from clinical scenarios to arrive at the most likely diagnosis. Questions often present multiple plausible diagnoses and require selection of the most appropriate next step in the diagnostic workup."
        ]
      },
      {
        heading: "Therapeutics & Pharmacology (Approximately 25-30%)",
        content: [
          "This domain covers pharmacological and non-pharmacological management of acute and chronic conditions. It tests knowledge of drug selection, dosing, monitoring, drug interactions, and evidence-based treatment guidelines.",
          "Pharmacology questions are particularly important and cover: first-line versus second-line treatments, contraindications and precautions, drug-drug interactions, pregnancy and lactation considerations, medication monitoring parameters, and patient education about prescribed therapies.",
          "Non-pharmacological interventions tested include lifestyle modifications, patient education, counseling, and referral for allied health services. Candidates should understand when to initiate therapy, when to adjust treatment, and when to refer to specialist care."
        ]
      },
      {
        heading: "Health Promotion & Disease Prevention (Approximately 15-20%)",
        content: [
          "Questions in this domain assess the NP's ability to promote health and prevent disease across the lifespan. Content includes screening guidelines, immunization schedules (Canadian National Advisory Committee on Immunization - NACI), risk factor modification, and anticipatory guidance.",
          "Key topics include: age-appropriate screening recommendations (cervical cancer, breast cancer, colorectal cancer, cardiovascular risk), Canadian immunization schedules and catch-up protocols, chronic disease prevention and management strategies, mental health promotion, substance use screening and brief interventions, and sexual health promotion.",
          "Candidates should be familiar with Canadian-specific guidelines, which may differ from American (USPSTF) guidelines. The exam tests application of Canadian clinical practice guidelines specifically."
        ]
      },
      {
        heading: "Professional Role & Responsibility (Approximately 15-20%)",
        content: [
          "This domain tests knowledge of the NP's professional, legal, and ethical responsibilities within the Canadian healthcare system. It covers scope of practice, collaborative practice models, professional accountability, and quality improvement.",
          "Content areas include: provincial/territorial scope of practice regulations, informed consent and capacity assessment, duty to report obligations, interprofessional collaboration and consultation, quality improvement and evidence-based practice, cultural safety and Indigenous health considerations, and healthcare system navigation.",
          "Questions in this domain often present ethical dilemmas or scope-of-practice scenarios that require candidates to identify the most appropriate professional action based on Canadian nursing standards and regulatory frameworks."
        ]
      }
    ],
    faqs: [
      { q: "What is the most heavily weighted domain on the NP exam?", a: "Health Assessment & Diagnosis is the most heavily weighted domain, comprising approximately 30-35% of the exam content." },
      { q: "Does the exam test Canadian-specific guidelines?", a: "Yes. The exam tests Canadian clinical practice guidelines, NACI immunization schedules, and provincial/territorial regulatory frameworks specifically." },
      { q: "How should I allocate study time based on the blueprint?", a: "Allocate study time proportionally: spend the most time on Health Assessment & Diagnosis (30-35%), followed by Therapeutics (25-30%), then Health Promotion and Professional Role (15-20% each)." },
      { q: "Are pharmacology questions a significant part of the exam?", a: "Yes. Pharmacology falls within the Therapeutics domain (25-30%) and is one of the most heavily tested areas. Know first-line treatments, interactions, and Canadian prescribing considerations." }
    ]
  },
  "passing-score": {
    title: "Canadian NP Exam Passing Score & Results",
    seoTitle: "Canadian NP Exam Passing Score: Cut Score, Results & What to Expect (2025)",
    description: "Understanding the Canadian NP exam passing score, how results are calculated, scoring methodology, and what happens after the exam.",
    icon: BarChart,
    sections: [
      {
        heading: "How the Passing Score Is Determined",
        content: [
          "The Canadian NP exam uses a criterion-referenced passing standard, meaning the passing score is based on the minimum level of competency required for safe entry-level NP practice, not on how other candidates perform. This is fundamentally different from a norm-referenced approach where a fixed percentage of candidates pass or fail.",
          "The passing standard is established through a rigorous process called the Angoff method (or a modified version of it). A panel of subject matter experts — experienced Canadian nurse practitioners — reviews each exam question and determines the probability that a minimally competent entry-level NP would answer it correctly. The passing score is derived from these expert judgments.",
          "Because each exam form may contain questions of varying difficulty, the raw passing score may differ slightly between exam administrations. Equating procedures are used to ensure that the difficulty level remains consistent across different exam versions, so no candidate is advantaged or disadvantaged by the particular exam form they receive.",
          "The CCRNR does not publish the exact numerical passing score or the percentage of questions that must be answered correctly. This is standard practice for licensure examinations to maintain exam security."
        ]
      },
      {
        heading: "Results Reporting",
        content: [
          "Exam results are typically available 8-10 weeks after the exam date. Results are reported to the candidate's provincial or territorial nursing regulatory body, which then communicates the outcome to the candidate.",
          "Results are reported as pass or fail. Candidates who do not pass receive a diagnostic profile that indicates their performance in each competency domain relative to the passing standard. This feedback helps guide preparation for a subsequent attempt.",
          "The diagnostic profile categorizes performance in each domain as 'above the passing standard,' 'near the passing standard,' or 'below the passing standard.' This provides targeted guidance for future study without revealing specific scores.",
          "Candidates who pass do not receive a numerical score — only confirmation that they met the passing standard. This is consistent with the exam's purpose as a licensing threshold, not a ranking tool."
        ]
      },
      {
        heading: "What Happens After Passing",
        content: [
          "Upon receiving a passing result, candidates must complete any remaining requirements for registration with their provincial or territorial regulatory body. These requirements may include criminal record checks, evidence of malpractice insurance, and completion of any outstanding practice hours.",
          "Registration as a nurse practitioner is a provincial/territorial process. Each jurisdiction has its own timeline for processing registration applications after exam results are released. Candidates should contact their regulatory body for specific timelines.",
          "Once registered, NPs must meet ongoing continuing competency requirements established by their regulatory body. These typically include continuing education hours, practice hours, and reflective practice activities."
        ]
      },
      {
        heading: "Retaking the Exam",
        content: [
          "Candidates who do not pass may retake the exam. The specific policies regarding the number of attempts allowed and waiting periods between attempts are determined by the candidate's provincial or territorial nursing regulatory body.",
          "Most jurisdictions allow multiple attempts, typically with a required waiting period between each attempt. Some jurisdictions may require candidates to complete additional education or supervised practice hours after a certain number of unsuccessful attempts.",
          "When preparing for a retake, candidates should use the diagnostic profile from their previous attempt to focus their study on areas where they performed below the passing standard."
        ]
      }
    ],
    faqs: [
      { q: "What is the passing score for the Canadian NP exam?", a: "The exact numerical passing score is not publicly disclosed. It is determined through a criterion-referenced standard-setting process based on the minimum competency required for safe entry-level NP practice." },
      { q: "How long until I get my NP exam results?", a: "Results are typically available 8-10 weeks after the exam date, reported through your provincial/territorial nursing regulatory body." },
      { q: "Do I get a score if I pass?", a: "No. Results are reported as pass or fail only. Candidates who do not pass receive a diagnostic profile showing performance in each competency domain." },
      { q: "How many times can I retake the NP exam?", a: "Retake policies vary by province/territory. Most jurisdictions allow multiple attempts with required waiting periods. Contact your regulatory body for specific policies." }
    ]
  },
  "study-plan": {
    title: "Canadian NP Exam Study Plan: 12-Week Strategy",
    seoTitle: "Canadian NP Exam Study Plan: 12-Week Prep Strategy That Works (2025)",
    description: "Structured 12-week study plan for the Canadian NP licensing exam with weekly goals, resource recommendations, and exam-day strategies.",
    icon: Calendar,
    sections: [
      {
        heading: "12-Week Study Framework",
        content: [
          "A structured 12-week study plan is recommended for most candidates preparing for the Canadian NP exam. This timeline allows sufficient depth across all competency domains while maintaining manageable daily study loads. Candidates who have been out of their NP program for an extended period may benefit from starting 16 weeks before their exam date.",
          "The study plan is divided into three phases: Foundation Building (Weeks 1-4), Clinical Application (Weeks 5-8), and Exam Readiness (Weeks 9-12). Each phase has distinct objectives and study strategies that build progressively toward exam-day performance.",
          "Consistent daily study of 2-3 hours is more effective than irregular marathon sessions. Research on adult learning demonstrates that spaced repetition and distributed practice produce superior long-term retention compared to massed practice."
        ]
      },
      {
        heading: "Phase 1: Foundation Building (Weeks 1-4)",
        content: [
          "During weeks 1-4, focus on reviewing core content across all competency domains. Begin with Health Assessment & Diagnosis (the most heavily weighted domain) and work through each domain systematically. Use your program textbooks and Canadian clinical practice guidelines as primary references.",
          "Week 1-2: Comprehensive health assessment review — history-taking frameworks, systematic physical examination, common and uncommon clinical findings, vital signs interpretation, and documentation standards. Review cardiac, respiratory, abdominal, neurological, and musculoskeletal examination techniques.",
          "Week 3: Diagnostic test interpretation — laboratory values (complete with Canadian SI units), ECG interpretation, imaging indications and basic interpretation, point-of-care testing. Focus on understanding when to order tests and how results change clinical management.",
          "Week 4: Differential diagnosis practice — work through clinical scenarios across body systems, listing differentials and identifying distinguishing features. Practice the skill of narrowing differentials based on presenting features and test results."
        ]
      },
      {
        heading: "Phase 2: Clinical Application (Weeks 5-8)",
        content: [
          "Weeks 5-8 shift focus from content review to clinical application. This is where you practice applying knowledge to realistic clinical scenarios similar to exam questions. Begin integrating practice questions into your daily study routine.",
          "Week 5-6: Therapeutics deep dive — review pharmacology systematically by drug class, focusing on first-line treatments for common conditions, contraindications, drug interactions, and monitoring parameters. Create comparison tables for drugs within the same class.",
          "Week 7: Health promotion and prevention — review Canadian-specific screening guidelines, NACI immunization schedules, lifestyle counseling, and chronic disease management strategies. This domain is frequently tested and often involves straightforward questions that reward candidates who have studied guidelines.",
          "Week 8: Professional role and practice — review scope of practice, ethical decision-making frameworks, informed consent, duty to report, interprofessional collaboration, and cultural safety. These questions often involve judgment and professional reasoning rather than factual recall."
        ]
      },
      {
        heading: "Phase 3: Exam Readiness (Weeks 9-12)",
        content: [
          "The final four weeks focus exclusively on exam-readiness activities: practice exams, targeted weak-area review, and exam-day preparation.",
          "Week 9-10: Complete full-length practice exams under timed conditions. Analyze performance by domain and identify persistent weak areas. Focus study time on domains where you score below 70%.",
          "Week 11: Targeted review of weak areas identified through practice exams. Use active recall techniques (flashcards, self-testing) rather than passive re-reading. Review high-yield topics that appear frequently on practice exams.",
          "Week 12: Light review and exam logistics. Reduce study intensity to avoid burnout. Review your summary notes and flashcards. Confirm exam logistics: testing centre location, required identification, arrival time. Prepare physically: adequate sleep, nutrition, and stress management in the days before the exam."
        ]
      },
      {
        heading: "Daily Study Structure",
        content: [
          "Each study session should include three components: content review (45 minutes), practice questions (60 minutes), and active recall/self-testing (30-45 minutes). This balanced approach addresses all learning modalities and keeps study sessions engaging.",
          "Practice questions should be completed in exam-like conditions: timed, no references, and with full rationale review after completion. Reviewing rationales for both correct and incorrect answers is essential — understanding why wrong answers are wrong deepens clinical reasoning.",
          "End each study day by creating 5-10 flashcards covering key concepts you struggled with. Use these for spaced repetition review throughout your preparation period. NurseNest's flashcard system supports this approach with customizable, tier-specific decks."
        ]
      }
    ],
    faqs: [
      { q: "How long should I study for the Canadian NP exam?", a: "Most candidates benefit from 12 weeks of structured preparation with 2-3 hours of daily study. Those further from their NP program may need 16 weeks." },
      { q: "How many practice questions should I do?", a: "Aim for a minimum of 1,000-1,500 practice questions over your preparation period. Focus on reviewing rationales for both correct and incorrect answers." },
      { q: "What study resources should I use?", a: "Use your NP program textbooks, Canadian clinical practice guidelines, NurseNest practice questions, and flashcards. Prioritize Canadian-specific resources over American ones." },
      { q: "Should I study every day?", a: "Consistent daily study of 2-3 hours is more effective than irregular marathon sessions. Plan rest days to prevent burnout, typically one day per week." }
    ]
  },
  "how-to-prepare": {
    title: "How to Prepare for the Canadian NP Exam",
    seoTitle: "How to Prepare for the Canadian NP Exam: Evidence-Based Strategies (2025)",
    description: "Evidence-based preparation strategies for the Canadian NP licensing exam including study techniques, resource selection, and test-taking skills.",
    icon: Lightbulb,
    sections: [
      {
        heading: "Evidence-Based Study Strategies",
        content: [
          "Successful preparation for the Canadian NP exam requires a strategic approach grounded in evidence-based learning principles. Research consistently shows that active learning strategies — practice testing, self-explanation, and distributed practice — produce significantly better outcomes than passive review methods like re-reading notes or highlighting textbooks.",
          "Spaced repetition is one of the most effective techniques for long-term retention of clinical knowledge. Rather than reviewing all cardiovascular content in a single session, distribute your cardiovascular study across multiple sessions over several weeks. This approach strengthens memory consolidation and reduces the forgetting curve.",
          "Interleaving — mixing different topics within a single study session — is more effective than blocking (studying one topic completely before moving to the next). For example, alternate between pharmacology questions, diagnostic interpretation, and health promotion scenarios within a single practice session.",
          "Self-testing is the single most powerful study technique available. After reviewing content, close your resources and try to recall key points from memory. Use flashcards, practice questions, or simply write down everything you remember about a topic. The effort of retrieval strengthens the memory far more than passive review."
        ]
      },
      {
        heading: "Choosing Study Resources",
        content: [
          "Prioritize Canadian-specific resources. The NP exam tests Canadian clinical practice guidelines, Canadian immunization schedules (NACI), and Canadian regulatory frameworks. American resources can supplement your preparation but should not be your primary study material.",
          "Essential resources include: your NP program textbooks, Canadian clinical practice guidelines (available through CMA Joule and individual specialty societies), the CCRNR exam competency framework document, and a reliable question bank with Canadian-specific content.",
          "NurseNest provides NP-tier practice questions specifically designed for the Canadian NP exam, including case-based question clusters, pharmacology review with Canadian drug references, and flashcard decks organized by competency domain.",
          "Avoid using too many resources. It is better to thoroughly master 3-4 high-quality resources than to superficially review a dozen different books and question banks. Select your core resources early in your preparation and commit to them."
        ]
      },
      {
        heading: "Clinical Reasoning Development",
        content: [
          "The NP exam tests clinical reasoning at the application and analysis levels, not simple recall. Developing strong clinical reasoning skills requires deliberate practice with case-based scenarios.",
          "For each clinical scenario you study, practice the full reasoning chain: identify relevant history and physical findings → generate a differential diagnosis list → determine the most appropriate diagnostic workup → select the best management approach → identify follow-up and monitoring requirements.",
          "Use a systematic approach to differential diagnosis. When presented with a chief complaint, organize your differentials by category: life-threatening conditions first, then common conditions, then less common conditions. The exam often tests the ability to identify serious conditions that require immediate action.",
          "Practice thinking like an entry-level NP, not a specialist. The exam tests the knowledge and judgment expected of a new graduate NP in a primary care or acute care setting. Focus on first-line management, recognition of when to refer, and understanding of your scope of practice."
        ]
      },
      {
        heading: "Test-Taking Strategies",
        content: [
          "Read each question stem carefully before looking at the answer options. Identify the clinical context, the specific question being asked, and any qualifying words (best, first, most important, priority). Many errors occur from misreading the question rather than from knowledge gaps.",
          "For case-based question clusters, read the entire initial scenario carefully and note key details before answering the first question. Information from the initial scenario is often critical for answering subsequent questions in the cluster.",
          "Use the process of elimination. Even if you are unsure of the correct answer, you can often eliminate one or two options that are clearly incorrect. This improves your probability of selecting the correct answer from the remaining options.",
          "Manage your time effectively. With approximately 145-170 questions in 4 hours, you have roughly 1.4-1.7 minutes per question. Flag difficult questions and move on rather than spending excessive time on a single question. Return to flagged questions after completing the full exam."
        ]
      }
    ],
    faqs: [
      { q: "What is the most effective way to study for the NP exam?", a: "Active recall, spaced repetition, and practice questions are the most evidence-based strategies. Avoid passive review methods like re-reading notes." },
      { q: "Should I use American NP resources?", a: "American resources can supplement your preparation but should not be primary. The exam tests Canadian-specific guidelines, immunization schedules, and regulatory frameworks." },
      { q: "How do I improve my clinical reasoning for the exam?", a: "Practice the full reasoning chain with case-based scenarios: history analysis → differential diagnosis → diagnostic workup → management → follow-up. Deliberate, repeated practice is key." },
      { q: "What if I run out of time on the exam?", a: "Budget approximately 1.5 minutes per question. Flag difficult questions and move on. Complete all questions first, then return to flagged items. Never leave questions unanswered." }
    ]
  },
  "prescribing-competencies": {
    title: "Canadian NP Prescribing Competencies",
    seoTitle: "Canadian NP Prescribing Competencies: Pharmacology & Exam Prep (2025)",
    description: "Comprehensive review of prescribing competencies tested on the Canadian NP exam including pharmacology, drug interactions, and prescribing authority.",
    icon: Pill,
    sections: [
      {
        heading: "NP Prescribing Authority in Canada",
        content: [
          "Nurse practitioner prescribing authority in Canada varies by province and territory. Each jurisdiction defines the scope of NP prescribing through legislation and regulatory frameworks. Understanding these differences is important for exam preparation and for clinical practice.",
          "In most Canadian jurisdictions, NPs have independent prescribing authority for a defined list of medications (formulary) or for all medications within their scope of practice. Some provinces use an open formulary (prescribe anything within scope), while others use a restricted formulary approach.",
          "The exam tests prescribing competency at a national level, focusing on principles of safe prescribing that apply across all jurisdictions: drug selection rationale, dosing considerations, contraindications, drug interactions, monitoring requirements, and patient education.",
          "Key prescribing concepts tested include: evidence-based drug selection, risk-benefit analysis, special population considerations (pediatric, geriatric, pregnancy, renal impairment, hepatic impairment), polypharmacy management, and adverse drug reaction recognition and management."
        ]
      },
      {
        heading: "High-Yield Pharmacology Topics",
        content: [
          "Cardiovascular medications represent one of the most heavily tested pharmacology areas. Key drug classes include: ACE inhibitors/ARBs, beta-blockers, calcium channel blockers, thiazide diuretics, statins, anticoagulants (warfarin, DOACs), and antiplatelet agents. Know first-line selections for hypertension, heart failure, atrial fibrillation, and acute coronary syndromes.",
          "Antimicrobial therapy is frequently tested. Know first-line antibiotics for common infections (UTI, pneumonia, cellulitis, otitis media, pharyngitis), empiric therapy selection principles, narrow- versus broad-spectrum choices, and when to use culture-directed therapy. Be aware of antimicrobial resistance patterns relevant to Canadian practice.",
          "Psychotropic medications are important for the exam. Know SSRIs, SNRIs, and atypical antidepressants for depression and anxiety; mood stabilizers for bipolar disorder; antipsychotics for schizophrenia and acute agitation; and benzodiazepine prescribing considerations including risks of dependence.",
          "Endocrine pharmacology: insulin types and regimens for diabetes management, oral hypoglycemics (metformin as first-line, SGLT2 inhibitors, GLP-1 agonists), thyroid hormone replacement, and corticosteroid prescribing considerations."
        ]
      },
      {
        heading: "Drug Interaction Management",
        content: [
          "The exam tests the ability to identify clinically significant drug interactions and make appropriate management decisions. Key interaction categories include: pharmacokinetic interactions (absorption, metabolism via CYP enzymes, elimination) and pharmacodynamic interactions (additive, synergistic, antagonistic effects).",
          "High-yield drug interactions for the exam include: warfarin interactions (numerous — antibiotics, NSAIDs, amiodarone), methotrexate and trimethoprim, SSRIs and MAOIs, QT-prolonging drug combinations, serotonin syndrome risk combinations, and drugs requiring renal dose adjustment.",
          "When faced with a drug interaction question, identify the clinical significance: Does the interaction require stopping a medication, adjusting the dose, adding monitoring, or can it be managed with patient education? The exam tests practical management decisions, not just identification of interactions."
        ]
      },
      {
        heading: "Controlled Substance Prescribing",
        content: [
          "NP authority to prescribe controlled substances varies significantly by province and territory. Some jurisdictions grant full prescribing authority for all schedules, while others restrict NPs from prescribing certain controlled substances or require collaborative agreements.",
          "The exam tests principles of safe controlled substance prescribing: risk assessment tools (e.g., ORT, SOAPP), treatment agreements, monitoring strategies (urine drug testing, prescription monitoring programs), and non-pharmacological alternatives for pain management.",
          "Opioid prescribing guidelines are particularly important given the opioid crisis in Canada. Know the Canadian guideline recommendations for opioid initiation, dose limits, monitoring, and tapering strategies."
        ]
      }
    ],
    faqs: [
      { q: "What pharmacology topics are most tested on the NP exam?", a: "Cardiovascular medications, antimicrobials, psychotropics, and endocrine pharmacology are the most heavily tested areas. Know first-line selections and key drug interactions." },
      { q: "Does the exam test provincial prescribing differences?", a: "The exam tests national prescribing principles rather than province-specific formularies. Focus on safe prescribing principles, drug selection rationale, and monitoring requirements." },
      { q: "How should I study pharmacology for the NP exam?", a: "Study by drug class, focusing on mechanism of action, indications, contraindications, key interactions, and monitoring. Create comparison tables for drugs within the same class." },
      { q: "Are controlled substance questions on the exam?", a: "Yes. The exam tests principles of safe controlled substance prescribing, including risk assessment, monitoring, and guideline-based practice." }
    ]
  },
  "clinical-decision-making": {
    title: "Clinical Decision-Making for the Canadian NP Exam",
    seoTitle: "NP Exam Clinical Decision-Making: Frameworks & Case-Based Strategies (2025)",
    description: "Master clinical decision-making frameworks tested on the Canadian NP exam including diagnostic reasoning, treatment selection, and evidence-based practice.",
    icon: Brain,
    sections: [
      {
        heading: "Diagnostic Reasoning Frameworks",
        content: [
          "Clinical decision-making on the NP exam requires systematic approaches to patient assessment and diagnosis. The hypothetico-deductive model is the most commonly used framework: generate hypotheses early based on presenting symptoms, then systematically gather data to confirm or rule out each hypothesis.",
          "Pattern recognition becomes more reliable with clinical experience, but entry-level NPs should supplement it with analytical reasoning. The exam tests whether candidates can move beyond pattern recognition to systematic evaluation of clinical data.",
          "Bayesian reasoning — updating the probability of a diagnosis based on new information — is implicitly tested throughout the exam. Pre-test probability (based on demographics, risk factors, and presentation) should guide diagnostic test selection and interpretation of results.",
          "Red flag recognition is critical. Many exam questions test the ability to identify presentations that require immediate action or urgent referral. Know the red flags for common chief complaints: chest pain, headache, abdominal pain, back pain, and shortness of breath."
        ]
      },
      {
        heading: "Evidence-Based Treatment Selection",
        content: [
          "Treatment selection questions require candidates to apply current Canadian clinical practice guidelines to specific clinical scenarios. The exam rewards candidates who know first-line treatments and can articulate why a particular treatment is preferred over alternatives.",
          "When selecting a treatment, consider: effectiveness (what does the evidence show?), safety (contraindications, drug interactions, side effects), patient factors (age, comorbidities, preferences, cost), and monitoring requirements.",
          "The exam frequently tests the difference between first-line and second-line treatments. Know why first-line treatments are preferred (better evidence, fewer side effects, lower cost) and when second-line agents are indicated (treatment failure, contraindication to first-line, specific patient factors).",
          "Non-pharmacological interventions are tested alongside drug therapy. Many conditions are best managed with a combination of lifestyle modifications and medication. Know when non-pharmacological management alone is appropriate and when medication should be initiated."
        ]
      },
      {
        heading: "Consultation and Referral Decisions",
        content: [
          "Knowing when to consult or refer is a critical competency for entry-level NPs. The exam tests the ability to recognize conditions that exceed the NP's scope of practice or expertise and require specialist involvement.",
          "General referral indicators include: conditions not responding to first-line treatment, diagnostic uncertainty after appropriate workup, procedures beyond NP scope, conditions requiring specialist monitoring, and emergency presentations requiring acute care management.",
          "Consultation versus referral: consultation means seeking specialist advice while retaining primary management responsibility; referral means transferring management to the specialist. The exam may test which approach is most appropriate for a given scenario.",
          "Document your clinical reasoning. While not directly tested on the exam, the questions often reflect documentation-quality thinking: clear assessment, differential diagnosis, rationale for testing and treatment, and follow-up plan."
        ]
      }
    ],
    faqs: [
      { q: "How does the exam test clinical decision-making?", a: "Through case-based scenarios requiring diagnostic reasoning, treatment selection, and management decisions. Questions test application and analysis, not simple recall." },
      { q: "What diagnostic reasoning framework should I use?", a: "The hypothetico-deductive model works well: generate hypotheses early, then systematically gather data to confirm or rule out diagnoses. Supplement with red flag recognition." },
      { q: "How do I answer 'best next step' questions?", a: "Identify the most urgent clinical need first (safety, then diagnosis, then treatment). Consider pre-test probability and choose the most informative or necessary next action." },
      { q: "When should an NP refer vs consult?", a: "Refer when the condition exceeds your scope or expertise. Consult when you want specialist input while retaining management responsibility. The exam tests recognizing these boundaries." }
    ]
  },
  "practice-questions": {
    title: "Free Canadian NP Practice Questions",
    seoTitle: "Free Canadian NP Practice Questions: Test Your Exam Readiness (2025)",
    description: "Free NP-level practice questions aligned with Canadian NP exam competency domains. Test your knowledge with case-based scenarios and detailed rationales.",
    icon: BookOpen,
    sections: [
      {
        heading: "Why Practice Questions Are Essential",
        content: [
          "Practice questions are the single most effective study tool for the Canadian NP exam. Research on testing effect demonstrates that the act of retrieving information from memory during practice testing strengthens long-term retention more effectively than passive review.",
          "Effective practice question use requires: completing questions under timed conditions, reviewing rationales for ALL answer options (correct and incorrect), tracking your performance by competency domain, and focusing additional study on consistently weak areas.",
          "Aim to complete 1,000-1,500 practice questions over your 12-week preparation period. Begin with untimed questions to build content knowledge, then transition to timed conditions that simulate the exam environment.",
          "Quality matters more than quantity. Questions should reflect the cognitive level, clinical realism, and Canadian context of the actual exam. Avoid questions that test simple recall of isolated facts — the exam emphasizes clinical application and analysis."
        ]
      },
      {
        heading: "Sample Question: Health Assessment",
        content: [
          "A 58-year-old male presents with a 3-week history of progressive exertional dyspnea and bilateral ankle edema. His medical history includes type 2 diabetes and hypertension. On examination, heart rate is 92 bpm, blood pressure is 148/88 mmHg, JVP is elevated, and bilateral basilar crackles are noted. BNP is elevated at 890 pg/mL. What is the most appropriate initial diagnostic test? (A) Chest X-ray (B) Echocardiogram (C) Cardiac catheterization (D) Stress test.",
          "Correct answer: (B) Echocardiogram. Rationale: This presentation is consistent with new-onset heart failure (exertional dyspnea, peripheral edema, elevated JVP, crackles, elevated BNP). An echocardiogram is the most appropriate initial diagnostic test to evaluate cardiac structure and function, determine ejection fraction, and identify the type and etiology of heart failure. While a chest X-ray would provide supporting information, the echocardiogram provides the most clinically useful data for management decisions."
        ]
      },
      {
        heading: "Sample Question: Therapeutics",
        content: [
          "A 45-year-old female is diagnosed with community-acquired pneumonia (CAP) with no comorbidities and no recent antibiotic use. She has a penicillin allergy (rash only, no anaphylaxis). Vital signs are stable and she is able to tolerate oral medications. What is the most appropriate first-line outpatient treatment? (A) Amoxicillin 1g TID for 5 days (B) Azithromycin 500mg day 1, then 250mg days 2-5 (C) Levofloxacin 750mg daily for 5 days (D) Amoxicillin-clavulanate 875mg BID for 7 days.",
          "Correct answer: (B) Azithromycin. Rationale: For outpatient CAP in a patient with no comorbidities and a penicillin allergy (non-anaphylactic rash), a macrolide (azithromycin) is an appropriate first-line choice per Canadian guidelines. While amoxicillin would be first-line in a patient without penicillin allergy, the rash history makes this a less appropriate choice. Levofloxacin (respiratory fluoroquinolone) is reserved for patients with comorbidities or those failing initial therapy. Amoxicillin-clavulanate should also be avoided given the penicillin allergy."
        ]
      },
      {
        heading: "Sample Question: Professional Role",
        content: [
          "An NP is managing a 78-year-old patient with moderate dementia who refuses a recommended cardiac procedure. The patient's daughter, who is not the substitute decision-maker, insists the procedure should be done. What is the NP's most appropriate initial action? (A) Proceed with the procedure based on the family's wishes (B) Assess the patient's decision-making capacity regarding this specific decision (C) Contact the substitute decision-maker to obtain consent (D) Obtain a court order to proceed with the procedure.",
          "Correct answer: (B) Assess the patient's decision-making capacity. Rationale: A diagnosis of dementia does not automatically mean a patient lacks decision-making capacity. Capacity is decision-specific and must be assessed for each clinical decision. The NP should first determine whether this patient has the capacity to understand and appreciate the consequences of refusing the procedure. Only if the patient lacks capacity should the substitute decision-maker be consulted. The daughter's wishes are not relevant unless she is the legally designated substitute decision-maker."
        ]
      },
      {
        heading: "Access More Practice Questions",
        content: [
          "NurseNest offers hundreds of NP-tier practice questions specifically designed for the Canadian NP licensing exam. Our question bank includes case-based question clusters, pharmacology scenarios, and detailed rationales for every answer option.",
          "Create a free account to access your first set of practice questions with full rationales. Premium subscribers get unlimited access to the complete NP question bank, customizable practice exams, and performance analytics by competency domain."
        ]
      }
    ],
    faqs: [
      { q: "How many practice questions should I do for the NP exam?", a: "Aim for 1,000-1,500 practice questions over your preparation period. Focus on quality (Canadian-specific, case-based, with rationales) over quantity." },
      { q: "Should I review rationales for questions I got right?", a: "Yes. Reviewing rationales for all options (correct and incorrect) deepens your understanding and helps you recognize why wrong answers are wrong." },
      { q: "What difficulty level should practice questions be?", a: "Use questions at the application and analysis cognitive levels, similar to the actual exam. Simple recall questions are useful for building foundational knowledge but don't adequately prepare you for exam-level reasoning." },
      { q: "Where can I find Canadian NP practice questions?", a: "NurseNest offers NP-tier practice questions specifically designed for the Canadian NP exam. Create a free account to start practicing with detailed rationales." }
    ]
  },
  "eligibility": {
    title: "Canadian NP Exam Eligibility Requirements",
    seoTitle: "Canadian NP Exam Eligibility: Requirements, Education & Application (2025)",
    description: "Complete guide to Canadian NP licensing exam eligibility including education requirements, application process, and provincial considerations.",
    icon: Shield,
    sections: [
      {
        heading: "Education Requirements",
        content: [
          "To be eligible for the Canadian NP exam, candidates must have completed a graduate-level nurse practitioner education program that meets the standards set by the Canadian Association of Schools of Nursing (CASN). This is typically a Master of Nursing (MN) or Master of Science in Nursing (MScN) degree with an NP focus.",
          "The NP program must include both didactic coursework and supervised clinical practice hours. The minimum clinical practice hours vary by program and province but typically range from 600-700 hours of direct patient care under the supervision of a qualified preceptor.",
          "Programs must cover the competencies outlined in the CCRNR Entry-Level Competencies for Nurse Practitioners in Canada. This includes health assessment, diagnosis, therapeutics, health promotion, and professional role competencies.",
          "Internationally educated nurse practitioners may be eligible if their education is assessed as substantially equivalent to Canadian NP programs. Each provincial/territorial regulatory body has its own process for evaluating international credentials."
        ]
      },
      {
        heading: "Registration Requirements",
        content: [
          "Before writing the NP exam, candidates must hold active registration as a registered nurse (RN) in a Canadian province or territory. The RN registration must be in good standing with no practice restrictions that would preclude NP practice.",
          "Candidates must apply to write the exam through their provincial or territorial nursing regulatory body. The regulatory body verifies the candidate's eligibility, including education completion, RN registration status, and any additional provincial requirements.",
          "Some provinces require candidates to hold a temporary NP registration or license while awaiting exam results. Others require the exam to be passed before NP registration is granted. Check with your specific regulatory body for the process in your jurisdiction.",
          "Criminal record checks and evidence of fitness to practice are typically required as part of the registration process. These requirements are determined by the provincial/territorial regulatory body."
        ]
      },
      {
        heading: "Application Process",
        content: [
          "The application process generally involves: completing your NP education program, applying to your provincial/territorial regulatory body for exam eligibility assessment, receiving confirmation of eligibility, registering for the exam through the testing vendor (Yardstick Assessment Strategies), and selecting your preferred exam date and testing centre.",
          "Application deadlines exist for each exam administration. Candidates should submit their applications well in advance of these deadlines to allow time for eligibility verification and testing centre selection.",
          "Required documentation typically includes: official transcripts from your NP program, evidence of clinical practice hours, proof of current RN registration, government-issued photo identification, and any additional documents required by your regulatory body.",
          "Processing times for eligibility assessment vary by province/territory and by time of year. Many candidates apply immediately after program completion, creating peak processing periods."
        ]
      }
    ],
    faqs: [
      { q: "What degree do I need to write the Canadian NP exam?", a: "You need a graduate-level NP education (typically MN or MScN with NP focus) from a CASN-accredited program that meets CCRNR competency standards." },
      { q: "Do I need to be a registered nurse first?", a: "Yes. You must hold active RN registration in good standing in a Canadian province or territory before you can apply for the NP exam." },
      { q: "Can internationally educated NPs write the exam?", a: "Potentially, if their education is assessed as substantially equivalent to Canadian NP programs. Contact your regulatory body for the international credential evaluation process." },
      { q: "When should I apply for the exam?", a: "Apply as early as possible after completing your NP program. Application deadlines exist for each exam administration and processing times vary by jurisdiction." }
    ]
  },
  "cost": {
    title: "Canadian NP Exam Cost & Fees",
    seoTitle: "Canadian NP Exam Cost: Fees, Registration & Financial Planning (2025)",
    description: "Complete breakdown of Canadian NP licensing exam costs including exam fees, registration fees, and study resource investments.",
    icon: DollarSign,
    sections: [
      {
        heading: "Exam Fees",
        content: [
          "The Canadian NP exam fee is set by the exam provider and is subject to periodic adjustment. As of recent administrations, the exam fee is approximately $600-700 CAD. This fee covers the exam administration, scoring, and results reporting.",
          "The exam fee is typically non-refundable once registration is confirmed, though policies for date changes and cancellations vary. Candidates who cancel or reschedule within a certain window of their exam date may forfeit their fee or incur additional charges.",
          "Candidates who need to retake the exam must pay the full exam fee for each subsequent attempt. There is no discounted rate for repeat examinations.",
          "Some employers, especially those actively recruiting NPs, may reimburse exam fees upon successful completion. Check with your employer or prospective employer about professional development funding."
        ]
      },
      {
        heading: "Registration & Licensing Fees",
        content: [
          "In addition to the exam fee, candidates must pay registration and licensing fees to their provincial or territorial nursing regulatory body. These fees vary significantly by jurisdiction and may include: application processing fees, NP registration or licensing fees, and annual renewal fees.",
          "Provincial/territorial registration fees typically range from $300-800 CAD annually, depending on the jurisdiction. Some provinces charge separate application processing fees in addition to the annual registration fee.",
          "Professional liability (malpractice) insurance is required for NP practice and represents an additional annual cost. Insurance can be obtained through the Canadian Nurses Protective Society (CNPS) or private insurers. Costs vary based on practice setting and coverage level.",
          "Continuing competency requirements (mandatory for maintaining NP registration) may involve additional costs for courses, conferences, and professional development activities."
        ]
      },
      {
        heading: "Study Resource Costs",
        content: [
          "Study resources represent a variable but important investment. Costs can range from minimal (using program textbooks and free resources) to several hundred dollars for comprehensive review courses and question banks.",
          "NurseNest offers NP-tier study resources starting at $4.99 CAD per month, including practice questions, flashcards, and study guides specifically designed for the Canadian NP exam. This represents one of the most affordable options for comprehensive NP exam preparation.",
          "Review courses from other providers can range from $200-1,500 CAD depending on format (self-paced vs. live instruction) and duration. While not required, some candidates find structured review courses valuable for exam preparation.",
          "Total preparation costs (exam fee + registration + study resources) typically range from $1,000-2,000 CAD, depending on study resource choices and provincial registration fees."
        ]
      }
    ],
    faqs: [
      { q: "How much does the Canadian NP exam cost?", a: "The exam fee is approximately $600-700 CAD per attempt. Additional costs include provincial registration fees ($300-800/year) and study resources." },
      { q: "Is the exam fee refundable?", a: "Generally no. The exam fee is typically non-refundable once registration is confirmed, with limited exceptions for medical emergencies or other extraordinary circumstances." },
      { q: "What is the cheapest way to prepare?", a: "NurseNest offers NP-tier study resources starting at $4.99 CAD/month, making it one of the most affordable comprehensive prep options for the Canadian NP exam." },
      { q: "Do employers reimburse exam fees?", a: "Some employers, especially those recruiting NPs, may reimburse exam fees upon successful completion. Ask about professional development funding before your exam." }
    ]
  },
  "registration": {
    title: "Canadian NP Exam Registration Process",
    seoTitle: "How to Register for the Canadian NP Exam: Step-by-Step Guide (2025)",
    description: "Step-by-step guide to registering for the Canadian NP licensing exam including timelines, documentation, and testing centre selection.",
    icon: FileText,
    sections: [
      {
        heading: "Registration Steps",
        content: [
          "Registering for the Canadian NP exam involves multiple steps and interactions with both your provincial/territorial regulatory body and the exam vendor. Planning ahead and understanding the timeline is essential to avoid delays.",
          "Step 1: Complete your NP education program and obtain official documentation of program completion, including transcripts and evidence of clinical practice hours.",
          "Step 2: Apply to your provincial/territorial nursing regulatory body for NP exam eligibility assessment. Submit all required documentation including transcripts, proof of RN registration, and any jurisdiction-specific requirements.",
          "Step 3: Once your regulatory body confirms your eligibility, you will receive authorization to register for the exam through Yardstick Assessment Strategies. This authorization typically includes a registration code or link.",
          "Step 4: Register with Yardstick and select your preferred exam date and Prometric testing centre. Popular dates and centres fill up quickly, so register as early as possible after receiving your authorization.",
          "Step 5: Pay the exam fee and receive confirmation of your exam appointment. Review the exam-day instructions provided by Yardstick and Prometric."
        ]
      },
      {
        heading: "Exam Dates & Testing Windows",
        content: [
          "The Canadian NP exam is offered during specific testing windows throughout the year. The number of testing windows and specific dates may vary by year. Candidates should check with their regulatory body and Yardstick for current scheduling information.",
          "Testing windows are typically available multiple times per year, allowing candidates some flexibility in scheduling. However, specific dates within each window may have limited availability at popular testing centres.",
          "Early registration is strongly recommended. Testing centre seats are allocated on a first-come, first-served basis, and candidates who register later may have fewer options for preferred dates and locations.",
          "If you need to change your exam date, contact Yardstick as soon as possible. Date changes may be subject to fees and are dependent on availability. Policies for date changes and cancellations are outlined in the registration materials."
        ]
      },
      {
        heading: "Exam Day Requirements",
        content: [
          "Arrive at the testing centre at least 30 minutes before your scheduled appointment time. Late arrivals may be refused entry and may forfeit their exam fee.",
          "Bring two forms of identification, including at least one government-issued photo ID. The name on your identification must match the name on your exam registration exactly. Acceptable forms of ID typically include a valid passport, driver's license, or provincial/territorial photo ID card.",
          "Personal items must be secured in testing centre lockers. This includes phones, watches, study materials, food, and beverages. The testing centre will provide scratch paper or an erasable notepad for use during the exam.",
          "The testing centre will provide a brief tutorial on the computer interface before the exam begins. This tutorial time is not counted against your exam time."
        ]
      }
    ],
    faqs: [
      { q: "How do I register for the Canadian NP exam?", a: "Apply to your provincial/territorial regulatory body for eligibility assessment, then register through Yardstick Assessment Strategies after receiving authorization." },
      { q: "How far in advance should I register?", a: "Register as soon as you receive eligibility authorization. Popular testing centres and dates fill up quickly. Plan for at least 2-3 months of lead time." },
      { q: "What ID do I need on exam day?", a: "Two forms of identification, with at least one being a government-issued photo ID. The name must match your exam registration exactly." },
      { q: "Can I change my exam date after registering?", a: "Date changes may be possible depending on availability and timing. Contact Yardstick as soon as possible. Changes may be subject to fees." }
    ]
  },
  "exam-changes": {
    title: "Canadian NP Exam Updates & Changes",
    seoTitle: "Canadian NP Exam Changes 2025: Latest Updates & What's New",
    description: "Stay current with the latest changes and updates to the Canadian NP licensing exam including format changes, blueprint revisions, and policy updates.",
    icon: AlertCircle,
    sections: [
      {
        heading: "Recent Exam Updates",
        content: [
          "The Canadian NP exam undergoes periodic review and updates to ensure it reflects current clinical practice standards and evolving NP competencies. The CCRNR conducts regular practice analyses to inform exam content updates.",
          "Recent years have seen increased emphasis on evidence-based practice, interprofessional collaboration, and cultural safety competencies, reflecting broader trends in Canadian healthcare education and practice standards.",
          "The transition to the CCRNR as the national coordinating body for NP exam development has resulted in greater consistency in exam standards across provinces and territories. This unified approach has strengthened the exam's role as a national licensing standard.",
          "Content updates are informed by practice analysis surveys conducted with practicing NPs across Canada. These surveys ensure that exam content reflects the actual day-to-day competencies required in NP practice."
        ]
      },
      {
        heading: "Blueprint Revisions",
        content: [
          "The exam blueprint is reviewed and updated periodically based on practice analysis data and changes in clinical practice guidelines. Blueprint revisions may adjust the weighting of competency domains to reflect evolving practice patterns.",
          "Candidates should always refer to the most current version of the exam blueprint, which is available through the CCRNR website. Outdated study materials may not accurately reflect current exam content weighting.",
          "When blueprint changes are announced, they are typically implemented with advance notice to allow candidates and education programs time to adjust their preparation approaches.",
          "Understanding the blueprint is essential because it tells you where to focus your study time. Even small changes in domain weighting can affect optimal study allocation over a 12-week preparation period."
        ]
      },
      {
        heading: "Technology & Delivery Changes",
        content: [
          "The exam continues to be delivered through computer-based testing at Prometric centres. As testing technology evolves, the exam delivery platform may be updated to include new features or interface improvements.",
          "Remote proctoring has been explored by various licensing examination programs, but the Canadian NP exam currently maintains in-person testing at Prometric centres to ensure exam security and standardized testing conditions.",
          "Candidates should familiarize themselves with the current testing interface through any tutorials or practice materials provided by the exam vendor before exam day."
        ]
      }
    ],
    faqs: [
      { q: "Has the NP exam format changed recently?", a: "The exam undergoes periodic updates based on practice analysis. Check the CCRNR website for the most current exam blueprint and format information." },
      { q: "How often is the exam blueprint updated?", a: "The blueprint is reviewed periodically (typically every 3-5 years) based on practice analysis surveys. Changes are announced with advance notice." },
      { q: "Is the exam moving to online/remote testing?", a: "Currently, the exam is administered in-person at Prometric testing centres. There are no confirmed plans for remote proctoring at this time." },
      { q: "Where can I find the latest exam information?", a: "The CCRNR website and your provincial/territorial regulatory body are the authoritative sources for current exam information, dates, and policies." }
    ]
  },
  "faq": {
    title: "Canadian NP Exam FAQ: Complete Answers",
    seoTitle: "Canadian NP Exam FAQ: Top Questions Answered (2025)",
    description: "Comprehensive FAQ for the Canadian NP licensing exam covering eligibility, format, scoring, preparation, and registration.",
    icon: HelpCircle,
    sections: [
      {
        heading: "General Exam Questions",
        content: [
          "The Canadian Nurse Practitioner Examination (CNPE) is the national licensing exam required for NP registration in all Canadian provinces and territories. It is administered by the CCRNR through Yardstick Assessment Strategies at Prometric testing centres.",
          "The exam tests entry-level competencies across four main domains: Health Assessment & Diagnosis, Therapeutics & Pharmacology, Health Promotion & Disease Prevention, and Professional Role & Responsibility.",
          "The exam is available in English and French and uses a computer-based multiple-choice format with approximately 145-170 questions over 4 hours of testing time.",
          "Results are reported as pass or fail through your provincial/territorial regulatory body, typically 8-10 weeks after the exam date."
        ]
      },
      {
        heading: "Preparation Questions",
        content: [
          "Most candidates benefit from 12 weeks of structured preparation with 2-3 hours of daily study. Use a balanced approach: content review, practice questions, and active recall techniques.",
          "Prioritize Canadian-specific resources including clinical practice guidelines, NACI immunization schedules, and practice questions written for the Canadian context. American resources can supplement but should not replace Canadian materials.",
          "Practice questions are the most effective study tool. Aim for 1,000-1,500 questions over your preparation period. Always review rationales for all answer options, not just the correct answer.",
          "Create a study plan that allocates time proportionally to each domain's exam weighting. Spend the most time on Health Assessment & Diagnosis (30-35%) and Therapeutics (25-30%)."
        ]
      },
      {
        heading: "Registration & Logistics",
        content: [
          "Apply to your provincial/territorial regulatory body for eligibility assessment after completing your NP program. Once approved, register through Yardstick Assessment Strategies and select your testing date and centre.",
          "The exam fee is approximately $600-700 CAD per attempt. Additional costs include provincial registration fees and study resources. Some employers reimburse exam fees upon successful completion.",
          "On exam day, arrive 30 minutes early with two forms of ID (at least one government-issued photo ID). Personal items must be stored in testing centre lockers.",
          "If you do not pass, use the diagnostic profile to identify weak areas and focus your preparation for a retake. Contact your regulatory body for specific retake policies and timelines."
        ]
      }
    ],
    faqs: [
      { q: "Who administers the Canadian NP exam?", a: "The exam is coordinated by the Canadian Council of Registered Nurse Regulators (CCRNR) and administered through Yardstick Assessment Strategies at Prometric testing centres." },
      { q: "How many questions are on the NP exam?", a: "Approximately 145-170 multiple-choice questions, including some unscored pilot items. The exam allows 4 hours of testing time." },
      { q: "What is the passing rate for the Canadian NP exam?", a: "The CCRNR does not publicly release pass rates for the exam. The passing standard is criterion-referenced and based on minimum entry-level competency, not relative performance." },
      { q: "Can I use a calculator on the exam?", a: "Yes. An on-screen calculator is provided as part of the computer-based testing interface." },
      { q: "What happens if I fail the exam?", a: "You receive a diagnostic profile indicating your performance relative to the passing standard in each competency domain. Contact your regulatory body for retake policies and timelines." },
      { q: "How soon can I retake the exam?", a: "Retake policies and waiting periods are determined by your provincial/territorial regulatory body. Most jurisdictions allow retakes at the next available testing window." }
    ]
  },
  "difficulty": {
    title: "How Hard Is the Canadian NP Exam?",
    seoTitle: "How Hard Is the Canadian NP Exam? Difficulty, Pass Rates & Reality (2025)",
    description: "Honest assessment of Canadian NP exam difficulty including cognitive demands, common challenges, and strategies for candidates who find the exam challenging.",
    icon: BarChart,
    sections: [
      {
        heading: "Exam Difficulty Assessment",
        content: [
          "The Canadian NP exam is considered a challenging licensure examination that tests clinical reasoning at the application and analysis cognitive levels. Unlike undergraduate nursing exams that may test recall and comprehension, the NP exam requires candidates to apply knowledge to complex clinical scenarios and make judgment-based decisions.",
          "The difficulty is amplified by the breadth of content covered. The exam spans all areas of primary care and acute care NP practice, including populations across the lifespan (pediatric, adult, geriatric), multiple body systems, pharmacology, diagnostics, and professional practice standards.",
          "Case-based question clusters add complexity because information builds across multiple questions. Candidates must track evolving clinical information and adjust their clinical reasoning as new data is presented, similar to real clinical encounters.",
          "Many candidates report that the exam is more difficult than their program exit exams. This is expected because the licensing exam must ensure a consistent national standard that may be higher than any individual program's internal assessment standards."
        ]
      },
      {
        heading: "Common Challenges",
        content: [
          "Pharmacology depth: The exam tests pharmacology at a deeper level than many candidates expect. Knowing drug names and basic indications is not sufficient — candidates must understand drug selection rationale, dosing considerations, interactions, and monitoring parameters.",
          "Diagnostic reasoning complexity: Questions often present scenarios with multiple plausible diagnoses. Selecting the correct answer requires systematic evaluation of clinical data rather than pattern matching. Candidates who rely heavily on pattern recognition may struggle with atypical presentations.",
          "Time management: With approximately 1.5 minutes per question, candidates must read, analyze, and answer efficiently. Case-based questions require more time to process the evolving scenario, leaving less time for standalone questions.",
          "Canadian-specific content: Candidates who prepared primarily with American resources may find Canadian-specific content (screening guidelines, immunization schedules, regulatory frameworks) unfamiliar. This is a common and avoidable source of difficulty."
        ]
      },
      {
        heading: "Strategies for Difficult Questions",
        content: [
          "When you encounter a difficult question, stay calm and use a systematic approach. Re-read the question stem to make sure you understand exactly what is being asked. Identify the clinical context and the specific decision or action required.",
          "Use process of elimination. Even if you cannot identify the correct answer immediately, you can often eliminate one or two options that are clearly incorrect. This improves your odds significantly, from 25% to 33% or 50%.",
          "For case-based clusters, take brief notes on your scratch paper to track key clinical data as the case unfolds. This prevents you from having to re-read the entire scenario for each question.",
          "If you are truly stuck, make your best guess, flag the question, and move on. Spending excessive time on a single question reduces time available for questions you may answer correctly. Return to flagged questions after completing the exam."
        ]
      },
      {
        heading: "Setting Realistic Expectations",
        content: [
          "It is normal to leave the exam feeling uncertain about your performance. The exam is designed to challenge candidates, and feeling unsure about some questions does not necessarily indicate poor performance.",
          "Many successful candidates report feeling uncertain about 20-30% of questions. This is expected given the complexity of the scenarios and the quality of the distractor options.",
          "Adequate preparation significantly reduces exam difficulty. Candidates who follow a structured study plan, complete sufficient practice questions, and use Canadian-specific resources generally report feeling more confident and better prepared.",
          "The exam is passable with diligent preparation. While it is challenging, it is designed to assess entry-level competency — not specialist-level expertise. Focus your preparation on the competencies expected of a newly graduated NP."
        ]
      }
    ],
    faqs: [
      { q: "Is the Canadian NP exam harder than the NCLEX?", a: "The NP exam tests at a higher cognitive level (application/analysis for advanced practice) and covers a broader scope. Most candidates find it more challenging than the NCLEX-RN." },
      { q: "What percentage of people pass the NP exam?", a: "The CCRNR does not publish official pass rates. The passing standard is criterion-referenced and based on minimum competency for safe entry-level NP practice." },
      { q: "What is the hardest part of the NP exam?", a: "Most candidates report pharmacology depth, diagnostic reasoning complexity, and time management as the most challenging aspects." },
      { q: "How can I tell if I'm ready for the exam?", a: "If you're consistently scoring above 70% on practice exams that use Canadian-specific, case-based questions at the application/analysis cognitive level, you are likely well-prepared." }
    ]
  },
  "canadian-vs-us-np": {
    title: "Canadian NP vs American NP Exam: Key Differences",
    seoTitle: "Canadian NP vs US NP Exam: Differences, Scope & Comparison (2025)",
    description: "Compare the Canadian NP licensing exam with American NP certification exams (AANP, ANCC) including scope, format, and practice differences.",
    icon: Globe,
    sections: [
      {
        heading: "Exam Structure Comparison",
        content: [
          "The Canadian NP exam (CNPE) and American NP certification exams (AANP and ANCC) serve similar purposes — validating entry-level NP competency — but differ in several important ways.",
          "The Canadian exam is a single national exam administered by the CCRNR, while the US has two separate certification bodies: the American Association of Nurse Practitioners (AANP) and the American Nurses Credentialing Center (ANCC). American NP candidates choose which certification exam to take.",
          "The Canadian exam tests competency for general NP practice, while the American exams are specialty-specific (Family NP, Adult-Gerontology Primary Care NP, Psychiatric-Mental Health NP, etc.). Canadian NPs typically enter practice with a broader scope that may encompass multiple specialties.",
          "Both Canadian and American exams use computer-based, multiple-choice formats. The Canadian exam has approximately 145-170 questions in 4 hours, while the AANP has 150 questions in 3 hours and the ANCC has 175 questions in 3.5 hours."
        ]
      },
      {
        heading: "Scope of Practice Differences",
        content: [
          "NP scope of practice differs significantly between Canada and the United States, and these differences are reflected in the exam content.",
          "In Canada, NP scope of practice is regulated at the provincial/territorial level. Most Canadian jurisdictions grant NPs the authority to diagnose, order and interpret tests, prescribe medications, and perform specific procedures within their scope. Some provinces have more restrictive scopes than others.",
          "In the United States, NP scope of practice varies by state. Full practice authority states allow NPs to practice independently, while reduced or restricted practice states require physician collaboration or supervision agreements. The American exams test competency for the broadest scope of practice available.",
          "Canadian NPs often work in primary care, acute care, and specialty settings. The Canadian healthcare system's structure (single-payer, universal coverage) influences the NP role differently than the American multi-payer system."
        ]
      },
      {
        heading: "Content Differences",
        content: [
          "The most significant content differences relate to healthcare system knowledge, guidelines, and drug formularies. The Canadian exam tests Canadian clinical practice guidelines, NACI immunization schedules, and Canadian regulatory frameworks. American exams test USPSTF guidelines, CDC immunization schedules, and state regulatory knowledge.",
          "Pharmacology questions reflect differences in drug availability and prescribing norms between the two countries. Some medications available in one country may not be available in the other. Prescribing conventions (brand names, dosing standards) may also differ.",
          "Laboratory reference values may differ between Canadian and American exams. Canadian practice uses SI (International System) units for many lab values, while American practice uses conventional units. Candidates should be familiar with the units used in their country.",
          "Cultural competency and health equity content reflects the different population health priorities of each country. The Canadian exam emphasizes Indigenous health, cultural safety, and the unique healthcare needs of Canada's diverse populations."
        ]
      },
      {
        heading: "Credential Transferability",
        content: [
          "Canadian NP certification does not automatically transfer to the United States, and vice versa. NPs seeking to practice in the other country must meet that country's specific education, examination, and registration requirements.",
          "Canadian NPs moving to the US typically need to obtain American NP certification (AANP or ANCC) and meet state-specific licensing requirements. Educational credential evaluation may be required.",
          "American NPs moving to Canada must have their credentials assessed by the provincial/territorial regulatory body. They may need to complete additional education or supervised practice hours and must pass the Canadian NP exam.",
          "The Mutual Recognition Agreement (MRA) between some Canadian provinces does not extend to international credential recognition. Each jurisdiction assesses international credentials independently."
        ]
      }
    ],
    faqs: [
      { q: "Is the Canadian NP exam the same as the AANP or ANCC?", a: "No. The Canadian NP exam (CNPE) is a separate national exam administered by the CCRNR. It differs from American exams in content, guidelines, and scope." },
      { q: "Can I use my Canadian NP credential to practice in the US?", a: "Not directly. You would need to obtain American NP certification (AANP or ANCC) and meet state-specific licensing requirements." },
      { q: "Can I use American study resources for the Canadian exam?", a: "American resources can supplement your study but should not be primary. The Canadian exam tests Canadian-specific guidelines, immunization schedules, and regulatory frameworks." },
      { q: "Which exam is harder — Canadian or American NP?", a: "Direct comparison is difficult as they test different content. The Canadian exam covers a broader scope (general NP), while American exams are specialty-specific. Both are challenging." }
    ]
  }
};

const hubFaqs = [
  { q: "What is the Canadian NP licensing exam?", a: "The Canadian Nurse Practitioner Examination (CNPE) is the national licensing exam administered by the CCRNR for all NP candidates in Canada. It tests entry-level NP competencies through computer-based multiple-choice questions." },
  { q: "How many questions are on the Canadian NP exam?", a: "The exam contains approximately 145-170 multiple-choice questions, including scored and unscored pilot items, with 4 hours of testing time." },
  { q: "What is the passing score?", a: "The passing score is criterion-referenced and not publicly disclosed. It is based on the minimum competency required for safe entry-level NP practice, determined through expert panel review." },
  { q: "How much does the Canadian NP exam cost?", a: "The exam fee is approximately $600-700 CAD per attempt, plus provincial/territorial registration fees and study resource costs." },
  { q: "How long should I study for the NP exam?", a: "Most candidates benefit from 12 weeks of structured preparation with 2-3 hours of daily study, following a phased approach of foundation building, clinical application, and exam readiness." },
  { q: "Is the exam available in French?", a: "Yes. The Canadian NP exam is available in both English and French at Prometric testing centres across Canada." },
  { q: "How are NP exam results reported?", a: "Results are reported as pass or fail through your provincial/territorial regulatory body, typically 8-10 weeks after the exam date. Candidates who do not pass receive a diagnostic profile." },
  { q: "What competency domains does the exam cover?", a: "The exam covers four main domains: Health Assessment & Diagnosis (30-35%), Therapeutics & Pharmacology (25-30%), Health Promotion & Disease Prevention (15-20%), and Professional Role & Responsibility (15-20%)." },
  { q: "Can I retake the exam if I fail?", a: "Yes, but retake policies and waiting periods vary by province/territory. Most jurisdictions allow multiple attempts. Contact your regulatory body for specific policies." },
  { q: "Do I need to be an RN before writing the NP exam?", a: "Yes. Active RN registration in good standing in a Canadian province or territory is required before applying for the NP exam." },
  { q: "Can internationally educated NPs write the exam?", a: "Potentially, if their education is assessed as substantially equivalent to Canadian NP programs by the provincial/territorial regulatory body." },
  { q: "Where can I find NP practice questions?", a: "NurseNest offers NP-tier practice questions specifically designed for the Canadian NP exam, including case-based scenarios and detailed rationales. Start with a free account." }
];

const clusterSlugs = Object.keys(clusterData);

function FaqSchema({ faqs }: { faqs: { q: string; a: string }[] }) {
  const { t } = useI18n();
  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(f => ({
      "@type": "Question",
      "name": f.q,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": f.a
      }
    }))
  };
  useEffect(() => {
    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.textContent = JSON.stringify(schema);
    script.id = "np-faq-schema";
    const existing = document.getElementById("np-faq-schema");
    if (existing) existing.remove();
    document.head.appendChild(script);
    return () => { script.remove(); };
  });
  return null;
}

function ClusterNav({ currentSlug }: { currentSlug?: string }) {
  return (
    <div className="bg-gray-50 rounded-xl p-6 mb-8">
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <BookOpen className="w-5 h-5 text-primary" />
        Canadian NP Exam Guide
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
        <LocaleLink
          href="/np-exam-guide"
          className={`text-sm px-3 py-2 rounded-lg transition-colors ${!currentSlug ? 'bg-primary text-white font-medium' : 'hover:bg-gray-100 text-gray-700'}`}
          data-testid="link-np-hub"
        >
          Hub Overview
        </LocaleLink>
        {clusterSlugs.map(slug => {
          const cluster = clusterData[slug];
          const Icon = cluster.icon;
          return (
            <LocaleLink
              key={slug}
              href={`/np-exam-guide/${slug}`}
              className={`text-sm px-3 py-2 rounded-lg transition-colors flex items-center gap-2 ${currentSlug === slug ? 'bg-primary text-white font-medium' : 'hover:bg-gray-100 text-gray-700'}`}
              data-testid={`link-np-cluster-${slug}`}
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              <span className="truncate">{cluster.title.replace("Canadian NP Exam ", "").replace("Canadian NP ", "").replace("How Hard Is the Canadian NP Exam?", "Difficulty").replace("Free Canadian NP Practice Questions", "Practice Questions").replace("Clinical Decision-Making for the Canadian NP Exam", "Clinical Decision-Making").replace("Canadian NP Prescribing Competencies", "Prescribing Competencies").replace("Canadian NP vs American NP Exam: Key Differences", "Canadian vs US NP")}</span>
            </LocaleLink>
          );
        })}
      </div>
    </div>
  );
}

function ClusterPage({ slug }: { slug: string }) {
  const cluster = clusterData[slug];
  if (!cluster) return <HubPage />;

  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      <AdminEditButton />
      <FaqSchema faqs={cluster.faqs} />
      <SEO
        title={cluster.seoTitle}
        description={cluster.description}
        canonicalPath={`/np-exam-guide/${slug}`}
      />

      <main className="max-w-4xl mx-auto px-4 py-8 sm:py-12">
        <BreadcrumbNav title={cluster.title} />
        <div className="mb-6">
          <LocaleLink href="/np-exam-guide" className="text-primary hover:underline text-sm flex items-center gap-1" data-testid="link-back-np-hub">
            <ChevronRight className="w-4 h-4 rotate-180" /> Back to NP Exam Guide
          </LocaleLink>
        </div>

        <div className="mb-8">
          <Badge variant="secondary" className="mb-3">{t("pages.npExamHub.canadianNpExam")}</Badge>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4" data-testid="text-cluster-title">{cluster.title}</h1>
          <p className="text-lg text-gray-600">{cluster.description}</p>
        </div>

        <ClusterNav currentSlug={slug} />

        <article className="prose prose-lg max-w-none">
          {cluster.sections.map((section, i) => (
            <section key={i} className="mb-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">{section.heading}</h2>
              {section.content.map((para, j) => (
                <p key={j} className="text-gray-700 leading-relaxed mb-4">{para}</p>
              ))}
            </section>
          ))}
        </article>

        <div className="bg-gray-50 rounded-xl p-8 my-10">
          <h2 className="text-2xl font-bold mb-6">{t("pages.npExamHub.frequentlyAskedQuestions")}</h2>
          <div className="space-y-6">
            {cluster.faqs.map((faq, i) => (
              <div key={i} className="border-b border-gray-200 pb-4 last:border-0">
                <h3 className="font-semibold text-gray-900 mb-2">{faq.q}</h3>
                <p className="text-gray-600">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gradient-to-r from-primary/10 to-blue-50 rounded-xl p-8 text-center my-10">
          <GraduationCap className="w-12 h-12 text-primary mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-3">{t("pages.npExamHub.readyToStartPracticing")}</h2>
          <p className="text-gray-600 mb-6 max-w-lg mx-auto">
            Access NP-tier practice questions, flashcards, and study tools specifically designed for the Canadian NP licensing exam.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <LocaleLink href="/start-free">
              <Button size="lg" className="gap-2" data-testid="button-np-start-free">
                Start Free NP Practice <ArrowRight className="w-4 h-4" />
              </Button>
            </LocaleLink>
            <LocaleLink href="/flashcards">
              <Button size="lg" variant="outline" className="gap-2" data-testid="button-np-flashcards">
                <BookOpen className="w-4 h-4" /> Browse NP Flashcards
              </Button>
            </LocaleLink>
          </div>
          <div className="mt-4">
            <LocaleLink href="/exam-readiness">
              <span className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline" data-testid="link-readiness-cta">
                <Target className="w-4 h-4" /> See your probability of passing
              </span>
            </LocaleLink>
          </div>
        </div>

        <ClusterNav currentSlug={slug} />
      </main>
    </div>
  );
}

function HubPage() {
  const competencyDomains = [
    { name: "Health Assessment & Diagnosis", weight: "30-35%", icon: Stethoscope, desc: "Comprehensive assessment, physical examination, diagnostic test interpretation, differential diagnosis" },
    { name: "Therapeutics & Pharmacology", weight: "25-30%", icon: Pill, desc: "Drug selection, dosing, interactions, monitoring, evidence-based treatment guidelines" },
    { name: "Health Promotion & Prevention", weight: "15-20%", icon: Shield, desc: "Screening guidelines, immunization (NACI), risk factor modification, anticipatory guidance" },
    { name: "Professional Role & Responsibility", weight: "15-20%", icon: Users, desc: "Scope of practice, ethics, interprofessional collaboration, cultural safety" },
  ];

  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      <AdminEditButton />
      <FaqSchema faqs={hubFaqs} />
      <SEO
        title={t("pages.npExamHub.canadianNpLicensingExamComplete")}
        description={t("pages.npExamHub.everythingYouNeedToKnow")}
        canonicalPath="/np-exam-guide"
      />

      <main className="max-w-4xl mx-auto px-4 py-8 sm:py-12">
        <BreadcrumbNav />
        <div className="mb-8">
          <Badge variant="secondary" className="mb-3">{t("pages.npExamHub.completeGuide2025")}</Badge>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4" data-testid="text-np-hub-title">
            Canadian NP Licensing Exam: Complete Guide
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl">
            Everything you need to know about the Canadian Nurse Practitioner Examination (CNPE) — format, competency domains, eligibility, study strategies, and how to prepare effectively.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
          <div className="bg-blue-50 rounded-xl p-4 text-center">
            <FileText className="w-6 h-6 text-blue-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-blue-700">145-170</div>
            <div className="text-xs text-blue-600">{t("pages.npExamHub.questions")}</div>
          </div>
          <div className="bg-green-50 rounded-xl p-4 text-center">
            <Clock className="w-6 h-6 text-green-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-green-700">{t("pages.npExamHub.4Hours")}</div>
            <div className="text-xs text-green-600">{t("pages.npExamHub.testingTime")}</div>
          </div>
          <div className="bg-purple-50 rounded-xl p-4 text-center">
            <Target className="w-6 h-6 text-purple-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-purple-700">{t("pages.npExamHub.4Domains")}</div>
            <div className="text-xs text-purple-600">{t("pages.npExamHub.competencies")}</div>
          </div>
          <div className="bg-amber-50 rounded-xl p-4 text-center">
            <MapPin className="w-6 h-6 text-amber-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-amber-700">{t("pages.npExamHub.national")}</div>
            <div className="text-xs text-amber-600">{t("pages.npExamHub.allProvinces")}</div>
          </div>
        </div>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">{t("pages.npExamHub.whatIsTheCanadianNp")}</h2>
          <div className="prose prose-lg max-w-none text-gray-700">
            <p>
              The Canadian Nurse Practitioner Examination (CNPE) is the national licensing exam for all nurse practitioner candidates in Canada. Administered by the Canadian Council of Registered Nurse Regulators (CCRNR) through Yardstick Assessment Strategies at Prometric testing centres, it serves as the unified standard for NP licensure across all provinces and territories.
            </p>
            <p>
              The exam is a computer-based, multiple-choice assessment that tests entry-level NP competencies through standalone questions and case-based question clusters. It is available in both English and French, with approximately 145-170 questions and 4 hours of testing time.
            </p>
            <p>
              The CNPE replaced the previous provincial examinations to create a single, consistent standard for NP competency assessment. Passing the exam is required for NP registration in all Canadian jurisdictions, though each province and territory may have additional registration requirements.
            </p>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">{t("pages.npExamHub.competencyDomains")}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {competencyDomains.map((domain, i) => (
              <Card key={i} className="border-l-4 border-l-primary">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-3 text-lg">
                    <domain.icon className="w-5 h-5 text-primary" />
                    <span>{domain.name}</span>
                    <Badge variant="outline" className="ml-auto text-xs">{domain.weight}</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600">{domain.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">{t("pages.npExamHub.exploreTheCompleteGuide")}</h2>
          <ClusterNav />
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">{t("pages.npExamHub.examFormatStructure")}</h2>
          <div className="prose prose-lg max-w-none text-gray-700">
            <p>
              The CNPE uses a computer-based testing format at Prometric centres across Canada. Questions include standalone multiple-choice items and case-based question clusters that simulate progressive clinical encounters.
            </p>
            <p>
              Each question presents four answer options, with one best answer. Case-based clusters present an evolving clinical scenario across 3-5 related questions, testing the ability to integrate information and adjust clinical reasoning as new data becomes available.
            </p>
            <p>
              Candidates can navigate freely between questions, flag items for review, and change answers before final submission. An on-screen calculator and scratch paper are available during the exam.
            </p>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">{t("pages.npExamHub.studyStrategyOverview")}</h2>
          <div className="prose prose-lg max-w-none text-gray-700">
            <p>
              A structured 12-week study plan is recommended, divided into three phases: Foundation Building (Weeks 1-4), Clinical Application (Weeks 5-8), and Exam Readiness (Weeks 9-12). Consistent daily study of 2-3 hours with a balanced approach of content review, practice questions, and active recall produces the best outcomes.
            </p>
            <p>
              Prioritize Canadian-specific resources including clinical practice guidelines, NACI immunization schedules, and practice questions written for the Canadian context. Aim for 1,000-1,500 practice questions over your preparation period with thorough rationale review.
            </p>
          </div>
          <div className="flex gap-3 mt-4">
            <LocaleLink href="/np-exam-guide/study-plan">
              <Button variant="outline" className="gap-2" data-testid="button-np-study-plan">
                <Calendar className="w-4 h-4" /> View 12-Week Study Plan
              </Button>
            </LocaleLink>
            <LocaleLink href="/np-exam-guide/how-to-prepare">
              <Button variant="outline" className="gap-2" data-testid="button-np-how-to-prepare">
                <Lightbulb className="w-4 h-4" /> Preparation Strategies
              </Button>
            </LocaleLink>
          </div>
        </section>

        <div className="bg-gray-50 rounded-xl p-8 mb-12">
          <h2 className="text-2xl font-bold mb-6">{t("pages.npExamHub.frequentlyAskedQuestions2")}</h2>
          <div className="space-y-6">
            {hubFaqs.slice(0, 8).map((faq, i) => (
              <div key={i} className="border-b border-gray-200 pb-4 last:border-0">
                <h3 className="font-semibold text-gray-900 mb-2">{faq.q}</h3>
                <p className="text-gray-600">{faq.a}</p>
              </div>
            ))}
          </div>
          <LocaleLink href="/np-exam-guide/faq">
            <Button variant="link" className="mt-4 gap-1" data-testid="button-np-all-faqs">
              View All NP Exam FAQs <ChevronRight className="w-4 h-4" />
            </Button>
          </LocaleLink>
        </div>

        <div className="bg-gradient-to-r from-primary/10 to-blue-50 rounded-xl p-8 text-center mb-12">
          <GraduationCap className="w-12 h-12 text-primary mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-3">{t("pages.npExamHub.startYourCanadianNpExam")}</h2>
          <p className="text-gray-600 mb-6 max-w-lg mx-auto">
            Access NP-tier practice questions, flashcards, and clinical study tools designed specifically for the Canadian NP licensing exam.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <LocaleLink href="/start-free">
              <Button size="lg" className="gap-2" data-testid="button-np-hub-start-free">
                Start Free NP Practice <ArrowRight className="w-4 h-4" />
              </Button>
            </LocaleLink>
            <LocaleLink href="/np-exam-guide/practice-questions">
              <Button size="lg" variant="outline" className="gap-2" data-testid="button-np-hub-practice">
                <BookOpen className="w-4 h-4" /> Free Practice Questions
              </Button>
            </LocaleLink>
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <ContextualRelatedResources
            pageType="examGuide"
            tags={["np-exam", "exam-prep"]}
            profession="np"
            currentPath="/np-exam-guide"
            className="border-t border-gray-200"
          />
          <CrossPlatformRelatedContent
            slug="np-exam"
            source="nursing"
          />
        </div>
        <div className="mb-8">
          <ExplanationPromoBanner variant="compact" />
        </div>
        <section className="py-12 bg-gradient-to-br from-blue-50 via-indigo-50/50 to-purple-50/30" data-testid="section-new-grad-cta">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-xl font-bold text-gray-900 mb-3" data-testid="text-np-new-grad-cta">{t("pages.npExamHub.newToNpPracticeCareer")}</h2>
            <p className="text-gray-600 mb-5 max-w-2xl mx-auto text-sm">
              Transitioning from student to practitioner? Our New Grad Career Hub has interview prep, contract negotiation guides, and first-year confidence builders for new NPs.
            </p>
            <LocaleLink href="/newgrad">
              <Button className="gap-2" data-testid="link-np-new-grad">
                Explore New Grad Career Hub <ArrowRight className="w-4 h-4" />
              </Button>
            </LocaleLink>
          </div>
        </section>
        <ComparisonTable
          headline="How NurseNest Compares for NP Exam Prep"
          subtitle={t("pages.np_exam_hub.seeHowAModernClinical")}
        />
        <DifferentiatorCTA
          headline="Start Your NP Exam Prep Today"
          subtitle={t("pages.np_exam_hub.joinThousandsOfNursePractitioner")}
          primaryHref="/register"
          primaryLabel="Start Free"
          secondaryHref="/pricing"
          secondaryLabel="View Plans"
        />
        <EndOfContentLeadCapture
          leadMagnetType="mock_exam"
          professionContext="NP"
          source="np_exam_hub"
        />
      </main>
    </div>
  );
}

export default function NpExamHub() {
  const params = useParams<{ slug?: string }>();
  const slug = params?.slug;

  if (slug && clusterData[slug]) {
    return <ClusterPage slug={slug} />;
  }

  return <HubPage />;
}
