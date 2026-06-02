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
  Calendar, HelpCircle, Globe, BarChart, Shield, Lightbulb, Users, Scale
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BreadcrumbNav } from "@/components/breadcrumb-nav";
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
    title: "REX-PN Exam Format & Structure",
    seoTitle: "REX-PN Exam Format: CAT Testing, Question Types & Timing (2025)",
    description: "Complete breakdown of the Canadian REX-PN exam format including Computer Adaptive Testing (CAT), question types, timing, and testing environment.",
    icon: FileText,
    sections: [
      {
        heading: "Exam Overview",
        content: [
          "The Regulatory Exam – Practical Nurse (REX-PN) is the Canadian licensing examination for practical nurse candidates seeking registration as a Registered Practical Nurse (RPN) in Ontario or the equivalent designation in other provinces. The exam is developed and administered by the National Council of State Boards of Nursing (NCSBN) in partnership with Canadian nursing regulatory bodies.",
          "The REX-PN replaced the Canadian Practical Nurse Registration Examination (CPNRE) as the national entry-to-practice exam. This transition aligned the Canadian practical nursing examination with modern psychometric standards and Computer Adaptive Testing (CAT) technology.",
          "The exam is available in English and French and is administered at Pearson VUE testing centres across Canada. It assesses whether candidates possess the entry-level competencies required for safe and effective practical nursing practice in the Canadian healthcare system."
        ]
      },
      {
        heading: "Computer Adaptive Testing (CAT)",
        content: [
          "The REX-PN uses Computer Adaptive Testing (CAT), a sophisticated testing methodology that tailors the difficulty of questions to each candidate's demonstrated ability level. After each question is answered, the computer recalculates the candidate's estimated ability and selects the next question accordingly.",
          "If a candidate answers a question correctly, the next question will generally be more difficult. If a question is answered incorrectly, the next question will generally be easier. This adaptive process continues until the computer has enough statistical confidence to determine whether the candidate meets the passing standard.",
          "CAT is more efficient than traditional fixed-length exams because it focuses on questions near the candidate's ability level, providing a precise measurement with fewer questions. This means the exam length varies between candidates — some may finish in as few as 85 questions, while others may receive the maximum number.",
          "Each candidate receives a unique set of questions tailored to their performance. This makes direct comparison of exam experiences between candidates unreliable — the difficulty of questions received depends entirely on individual performance patterns."
        ]
      },
      {
        heading: "Question Types",
        content: [
          "The REX-PN primarily uses multiple-choice questions with four answer options and one correct answer. Questions are written at the application and analysis cognitive levels, requiring candidates to apply nursing knowledge to realistic clinical scenarios rather than simply recalling isolated facts.",
          "Select-all-that-apply (SATA) questions present multiple correct options from a list. Candidates must identify all correct options without partial credit — every correct option must be selected and no incorrect options can be selected for the item to be scored as correct.",
          "Ordered-response (drag-and-drop) questions require candidates to arrange items in a specific sequence, such as prioritizing nursing actions or ordering steps in a procedure. These questions test the ability to determine correct sequencing in clinical situations.",
          "Hot-spot questions present an image or diagram and require candidates to identify a specific location or area. Fill-in-the-blank calculation questions require candidates to perform dosage calculations and enter a numerical answer. All question types assess practical nursing competency within the Canadian context."
        ]
      },
      {
        heading: "Timing & Structure",
        content: [
          "The REX-PN allows a maximum of 5 hours of testing time. The exam has a minimum of 85 questions and a maximum of 150 questions. The actual number of questions each candidate receives depends on when the CAT algorithm reaches a pass/fail decision with sufficient statistical confidence.",
          "Of the questions received, 25 are unscored pretest items being validated for future exams. Candidates cannot distinguish between scored and pretest items during the exam. The remaining questions (60-125) are scored and contribute to the pass/fail decision.",
          "An optional break is offered after the first 2 hours of testing. Candidates may also request unscheduled breaks, though break time is deducted from the total 5-hour allowance. The exam does not have distinct sections — questions from all content areas are intermixed throughout.",
          "Once a question is answered and the candidate moves to the next question, it is not possible to go back and change previous answers. This is a key difference from traditional paper-based exams and is inherent to the CAT format, where each subsequent question depends on the response to the previous one."
        ]
      },
      {
        heading: "Testing Environment",
        content: [
          "The REX-PN is administered at Pearson VUE testing centres across Canada. Candidates must present valid government-issued photo identification and a secondary form of identification. A digital photograph and palm vein biometric scan are taken at check-in.",
          "Personal items including phones, watches, food, drinks, notes, and study materials are prohibited in the testing room and must be stored in a provided locker. The testing centre provides an erasable note board and marker for calculations.",
          "The testing workstation includes a basic on-screen calculator. Candidates receive a brief computer tutorial before the exam begins to familiarize themselves with the interface, question types, and navigation. The tutorial time does not count toward the 5-hour exam time.",
          "Special testing accommodations are available for candidates with documented disabilities. Accommodation requests must be submitted to the nursing regulatory body well in advance of the exam date, with supporting documentation from a qualified healthcare provider."
        ]
      }
    ],
    faqs: [
      { q: "How many questions are on the REX-PN?", a: "The REX-PN has a minimum of 85 questions and a maximum of 150 questions. The exact number depends on when the CAT algorithm determines pass or fail with sufficient confidence. Of these, 25 are unscored pretest items." },
      { q: "How long is the REX-PN exam?", a: "Candidates have a maximum of 5 hours of testing time. Most candidates finish in 2-4 hours depending on how quickly the CAT algorithm reaches a decision." },
      { q: "Can I go back and change answers on the REX-PN?", a: "No. The CAT format does not allow candidates to return to previous questions. Each subsequent question is selected based on the response to the previous one, so answers are final once submitted." },
      { q: "What question types are on the REX-PN?", a: "The REX-PN includes multiple-choice, select-all-that-apply (SATA), ordered-response (drag-and-drop), hot-spot, and fill-in-the-blank calculation questions." },
      { q: "Is the REX-PN available in French?", a: "Yes. The REX-PN is available in both English and French at Pearson VUE testing centres across Canada." }
    ]
  },
  "blueprint": {
    title: "REX-PN Content Blueprint & Domains",
    seoTitle: "REX-PN Content Blueprint: Domains, Weighting & What to Study (2025)",
    description: "Detailed breakdown of the REX-PN exam content blueprint including competency domains, percentage weighting, and key topics within each domain.",
    icon: Target,
    sections: [
      {
        heading: "Blueprint Overview",
        content: [
          "The REX-PN content blueprint is organized around the competencies required for safe and effective entry-level practical nursing practice in Canada. The blueprint is based on a comprehensive practice analysis conducted with practising RPNs across Canadian jurisdictions to identify the knowledge, skills, and judgment used in everyday practice.",
          "The exam tests four major Client Needs categories, each with defined subcategories. The weighting of each category reflects its importance to entry-level practical nursing practice. Understanding the blueprint is essential for effective exam preparation — study time should be allocated proportionally to each category's weighting.",
          "All questions are set within the Canadian healthcare context, using metric units (°C, kg, cm), Canadian drug names, Canadian clinical practice guidelines, and Canadian regulatory and legal frameworks. Questions reflect the RPN scope of practice specifically, not the RN or NP scope."
        ]
      },
      {
        heading: "Safe and Effective Care Environment (26-32%)",
        content: [
          "This is one of the most heavily weighted categories and is divided into two subcategories: Coordinated Care and Safety and Infection Control.",
          "Coordinated Care (6-12%): Tests the RPN's ability to collaborate with the healthcare team, understand delegation and assignment principles, advocate for clients, manage continuity of care, and apply ethical and legal principles of nursing practice. Key topics include informed consent, advance directives, confidentiality, mandatory reporting, and interprofessional collaboration within the Canadian healthcare system.",
          "Safety and Infection Control (10-16%): Tests knowledge of maintaining a safe environment for clients, staff, and visitors. Key topics include fall prevention, restraint use, safe medication administration, infection prevention and control practices (routine practices, additional precautions), surgical asepsis, safe handling of hazardous materials, and emergency response procedures.",
          "Patient safety is a cornerstone of Canadian practical nursing practice. Questions in this category often present scenarios where the candidate must identify the priority safety concern or the most appropriate action to prevent harm."
        ]
      },
      {
        heading: "Health Promotion and Maintenance (6-12%)",
        content: [
          "This category tests the RPN's role in promoting health and preventing illness across the lifespan. Content includes growth and development across age groups, health screening recommendations, immunization schedules, prenatal and postpartum care, aging-related changes, and self-care education.",
          "Questions often present scenarios involving client education, lifestyle modification counseling, disease prevention strategies, and recognition of developmental milestones or deviations from normal development. The Canadian context is important — know Canadian immunization schedules and screening guidelines.",
          "Practical nursing questions in this domain focus on the RPN's scope: providing client education within the care plan, reinforcing teaching provided by RNs or other team members, supporting clients in making informed health decisions, and recognizing when to escalate concerns about client health promotion needs."
        ]
      },
      {
        heading: "Psychosocial Integrity (6-12%)",
        content: [
          "This category covers mental health concepts, coping mechanisms, psychosocial support, and therapeutic communication. Key topics include crisis intervention, substance use and withdrawal, grief and loss, abuse and neglect recognition, cultural awareness and sensitivity, and mental health conditions.",
          "Therapeutic communication is heavily tested. Know the principles of active listening, empathetic responding, open-ended questioning, and recognizing barriers to effective communication. Questions often present a client statement and ask which nurse response is most therapeutic.",
          "Cultural safety in the Canadian context includes understanding the unique healthcare needs and historical experiences of Indigenous peoples (First Nations, Inuit, and Métis), newcomer populations, and diverse cultural communities. The Truth and Reconciliation Commission's Calls to Action related to healthcare are relevant to this domain."
        ]
      },
      {
        heading: "Physiological Integrity (38-44%)",
        content: [
          "This is the most heavily weighted category, reflecting the significant proportion of practical nursing practice devoted to physiological care. It is divided into four subcategories.",
          "Basic Care and Comfort (6-12%): Nutrition, hydration, elimination, mobility, rest and sleep, personal hygiene, and non-pharmacological comfort measures. Know therapeutic diets, fluid balance monitoring, pain assessment tools, and activity tolerance assessment.",
          "Pharmacological Therapies (10-16%): Medication administration, drug classifications, expected actions, side effects, adverse reactions, contraindications, drug interactions, and client education about medications. Know the rights of medication administration, high-alert medications, and dosage calculations using metric units.",
          "Reduction of Risk Potential (10-16%): Monitoring for complications, interpreting diagnostic test results, recognizing changes in client status, and implementing interventions to reduce risk. Key topics include vital signs interpretation, laboratory value analysis (using SI units where applicable), pre- and post-procedure care, and recognizing early signs of deterioration.",
          "Physiological Adaptation (10-16%): Managing acute and chronic conditions, medical emergencies, pathophysiology, fluid and electrolyte balance, and hemodynamic monitoring. Questions test the ability to prioritize care, recognize life-threatening conditions, and implement appropriate nursing interventions within the RPN scope."
        ]
      }
    ],
    faqs: [
      { q: "What is the most heavily weighted domain on the REX-PN?", a: "Physiological Integrity is the most heavily weighted category at 38-44% of the exam. Within this category, Pharmacological Therapies, Reduction of Risk Potential, and Physiological Adaptation each comprise 10-16%." },
      { q: "Does the REX-PN test Canadian-specific content?", a: "Yes. All questions use Canadian context including metric units (°C, kg), Canadian drug names, Canadian clinical practice guidelines, and Canadian regulatory frameworks. The exam reflects the RPN scope of practice." },
      { q: "How should I allocate study time based on the blueprint?", a: "Allocate the most time to Physiological Integrity (38-44%), followed by Safe and Effective Care Environment (26-32%), then Health Promotion and Psychosocial Integrity (6-12% each)." },
      { q: "Are pharmacology questions a major part of the REX-PN?", a: "Yes. Pharmacological Therapies accounts for 10-16% of the exam. Know medication administration, drug classifications, dosage calculations, side effects, and high-alert medications." }
    ]
  },
  "passing-score": {
    title: "REX-PN Passing Score & Results",
    seoTitle: "REX-PN Passing Score: How Scoring Works & Getting Your Results (2025)",
    description: "Understanding the REX-PN passing standard, how the CAT algorithm determines pass/fail, results timeline, and what happens after the exam.",
    icon: BarChart,
    sections: [
      {
        heading: "How the Passing Standard Works",
        content: [
          "The REX-PN uses a criterion-referenced passing standard, meaning the pass/fail decision is based on whether the candidate demonstrates the minimum competency required for safe entry-level practical nursing practice, not on how other candidates perform. There is no curve — theoretically, all candidates could pass or all could fail.",
          "The passing standard is established through a rigorous process involving panels of Canadian nursing experts — experienced RPNs and nursing educators — who review exam content and determine the level of competency expected of a minimally competent entry-level practical nurse.",
          "Because the REX-PN uses Computer Adaptive Testing (CAT), the pass/fail decision is made through a statistical process. After each question, the computer recalculates the candidate's estimated ability and its confidence interval. The exam continues until the confidence interval no longer overlaps with the passing standard — meaning the computer is 95% confident the candidate is either above or below the passing standard.",
          "The exact numerical passing standard (logit value) is not publicly disclosed. Candidates receive a pass or fail result, not a numerical score. This is standard practice for licensure examinations to maintain exam integrity and security."
        ]
      },
      {
        heading: "How the CAT Algorithm Determines Pass/Fail",
        content: [
          "There are three ways the REX-PN can end: (1) the CAT algorithm determines pass or fail with 95% confidence, (2) the candidate reaches the maximum number of questions (150), or (3) the candidate runs out of time (5 hours).",
          "If the exam ends because the algorithm reached a decision, the result is based on that decision regardless of the number of questions answered. A candidate who answers 85 questions and passes has demonstrated the same level of competency as one who answers 130 questions and passes.",
          "If the maximum number of questions is reached without the algorithm making a decision, the candidate's final ability estimate is compared to the passing standard. If the final estimate is at or above the passing standard, the candidate passes. If below, the candidate fails.",
          "If time runs out, the same rule applies — the candidate's ability estimate at the point time expired is compared to the passing standard. This is why time management is important even though most candidates finish well within the 5-hour limit.",
          "Important: The number of questions received does not indicate pass or fail. Some candidates who pass answer the minimum 85 questions, while others who pass answer many more. The length of the exam reflects how long it takes the algorithm to reach a confident decision, not the candidate's competency level."
        ]
      },
      {
        heading: "Results Timeline",
        content: [
          "REX-PN results are typically available within 2-4 business days after the exam through the nursing regulatory body. The exact timeline varies by jurisdiction and testing volume.",
          "Results are communicated through the candidate's provincial or territorial nursing regulatory body. In Ontario, the College of Nurses of Ontario (CNO) communicates results directly to candidates. Other provinces have their own communication processes.",
          "Candidates receive a pass or fail result. Those who do not pass receive a Candidate Performance Report (CPR) that provides diagnostic feedback on performance in each content area relative to the passing standard. This report is a valuable tool for directing study for a retake attempt.",
          "The CPR categorizes performance as 'above the passing standard' or 'below the passing standard' for each content area. This helps candidates identify specific areas that need additional study rather than attempting to review all content equally."
        ]
      },
      {
        heading: "Retaking the REX-PN",
        content: [
          "Candidates who do not pass may retake the REX-PN. A mandatory 45-day waiting period is required between attempts. This waiting period allows sufficient time for additional study and preparation.",
          "Retake policies, including the maximum number of attempts allowed and any additional requirements after multiple unsuccessful attempts, are determined by the candidate's provincial or territorial nursing regulatory body. Most jurisdictions allow multiple attempts.",
          "When preparing for a retake, use the Candidate Performance Report to focus study on areas identified as below the passing standard. Continuing to study areas of strength while neglecting weak areas is a common mistake that reduces the effectiveness of retake preparation.",
          "Some regulatory bodies may require candidates to complete additional education, supervised clinical hours, or a remediation program after a certain number of unsuccessful attempts. Contact your regulatory body for specific policies."
        ]
      }
    ],
    faqs: [
      { q: "What is the passing score for the REX-PN?", a: "The exact passing standard is not publicly disclosed. It is a criterion-referenced standard based on the minimum competency required for safe entry-level practical nursing practice, determined through expert panel review." },
      { q: "How long until I get my REX-PN results?", a: "Results are typically available within 2-4 business days after the exam through your provincial or territorial nursing regulatory body." },
      { q: "Does the number of questions I receive indicate if I passed?", a: "No. The number of questions (85-150) reflects how long it takes the CAT algorithm to reach a confident decision, not your competency level. Candidates can pass at any question count." },
      { q: "How many times can I retake the REX-PN?", a: "A mandatory 45-day waiting period is required between attempts. Maximum attempt limits and additional requirements vary by province/territory. Contact your regulatory body for specific policies." },
      { q: "Do I get a score if I pass the REX-PN?", a: "No. Results are reported as pass or fail only. Candidates who do not pass receive a Candidate Performance Report showing performance in each content area relative to the passing standard." }
    ]
  },
  "study-plan": {
    title: "REX-PN Study Plan: 10-Week Strategy",
    seoTitle: "REX-PN Study Plan: 10-Week Prep Strategy for Canadian RPN Candidates (2025)",
    description: "Structured 10-week study plan for the REX-PN exam with weekly goals, CAT-specific practice strategies, and exam-day preparation tips.",
    icon: Calendar,
    sections: [
      {
        heading: "10-Week Study Framework",
        content: [
          "A structured 10-week study plan is recommended for most candidates preparing for the REX-PN. This timeline allows thorough coverage of all content domains while building the clinical reasoning skills tested by the CAT format. Candidates who have been out of their practical nursing program for an extended period may benefit from starting 12-14 weeks before their exam date.",
          "The study plan is divided into three phases: Content Foundation (Weeks 1-4), Clinical Application (Weeks 5-7), and Exam Readiness (Weeks 8-10). Each phase builds progressively toward exam-day performance with specific learning objectives.",
          "Consistent daily study of 2-3 hours is more effective than irregular marathon sessions. Research on adult learning demonstrates that spaced repetition and distributed practice produce superior long-term retention compared to massed practice. Plan for one rest day per week to prevent burnout."
        ]
      },
      {
        heading: "Phase 1: Content Foundation (Weeks 1-4)",
        content: [
          "During weeks 1-4, focus on building a solid content foundation across all four Client Needs categories. Begin with Physiological Integrity (the most heavily weighted category) and work systematically through each domain.",
          "Week 1: Pharmacological Therapies — drug classifications, mechanisms of action, side effects, adverse reactions, contraindications, drug interactions, dosage calculations (using metric units), rights of medication administration, high-alert medications. Create drug comparison charts by classification.",
          "Week 2: Physiological Adaptation — management of acute and chronic conditions, fluid and electrolyte balance (electrolyte values in SI units), acid-base balance, hemodynamic monitoring, recognizing deterioration, emergency nursing interventions within the RPN scope.",
          "Week 3: Safe and Effective Care Environment — delegation principles, assignment and supervision, infection control (routine practices, additional precautions), fall prevention, restraint use, medication safety, legal and ethical principles of Canadian nursing practice, informed consent, confidentiality.",
          "Week 4: Health Promotion, Psychosocial Integrity, and Basic Care — growth and development, health screening, immunization schedules, therapeutic communication, mental health concepts, cultural safety (including Indigenous health), nutrition, elimination, mobility, pain management."
        ]
      },
      {
        heading: "Phase 2: Clinical Application (Weeks 5-7)",
        content: [
          "Weeks 5-7 shift focus from content review to clinical application. This is where you practice applying knowledge to realistic clinical scenarios similar to exam questions. Begin integrating practice questions into your daily study routine — aim for 50-75 questions per day.",
          "Week 5: Integration and prioritization — practice prioritizing nursing actions using frameworks such as ABCs (Airway, Breathing, Circulation), Maslow's hierarchy, and the nursing process. Work through multi-system scenarios that require you to identify the priority client and the priority intervention.",
          "Week 6: Alternate question formats — dedicate specific practice time to select-all-that-apply (SATA), ordered-response, hot-spot, and calculation questions. These question types require different strategies than standard multiple-choice. For SATA, evaluate each option independently as a true/false statement.",
          "Week 7: CAT simulation practice — complete practice exams in CAT format if available. Practice the discipline of not being able to return to previous questions. Focus on reading each question carefully, committing to your answer, and moving forward without dwelling on previous questions."
        ]
      },
      {
        heading: "Phase 3: Exam Readiness (Weeks 8-10)",
        content: [
          "The final three weeks focus on exam readiness: full-length practice exams, targeted weak-area review, and exam-day preparation.",
          "Week 8: Complete 2-3 full-length practice exams under timed conditions. Analyze performance by content area and identify persistent weak areas. Focus additional study on content areas where you score below 65%.",
          "Week 9: Targeted review of weak areas identified through practice exams. Use active recall techniques (flashcards, self-testing) rather than passive re-reading. Review high-yield topics: medication safety, delegation, infection control, vital signs interpretation, and priority-setting.",
          "Week 10: Light review and exam logistics. Reduce study intensity to avoid burnout. Review your summary notes and flashcards. Confirm exam logistics: Pearson VUE centre location, required identification documents (government photo ID plus secondary ID), arrival time (at least 30 minutes early). Ensure adequate sleep, nutrition, and stress management in the days before the exam."
        ]
      },
      {
        heading: "Daily Study Structure",
        content: [
          "Each study session should include three components: content review (40 minutes), practice questions (60-75 minutes), and active recall/self-testing (30 minutes). This balanced approach builds both knowledge and the ability to apply it under exam conditions.",
          "Practice questions should be completed in exam-like conditions: timed, no references, and with thorough rationale review after completion. Reviewing rationales for all answer options — correct and incorrect — is essential. Understanding why wrong answers are wrong deepens clinical reasoning and reduces errors on similar questions.",
          "End each study day by creating 5-10 flashcards covering key concepts you struggled with during practice questions. Use these for spaced repetition review throughout your preparation period. NurseNest's flashcard system supports this approach with RPN-tier, Canadian-specific decks.",
          "Track your performance by content area throughout your preparation. Use a simple spreadsheet or the analytics built into practice question platforms to monitor trends. Seeing improvement over time builds confidence, and persistent weak areas become clearly visible for targeted review."
        ]
      }
    ],
    faqs: [
      { q: "How long should I study for the REX-PN?", a: "Most candidates benefit from 10 weeks of structured preparation with 2-3 hours of daily study. Those further from their practical nursing program may need 12-14 weeks." },
      { q: "How many practice questions should I do for the REX-PN?", a: "Aim for a minimum of 1,500-2,000 practice questions over your preparation period. Focus on reviewing rationales for all answer options, not just the correct one." },
      { q: "What study resources should I use for the REX-PN?", a: "Use your practical nursing program textbooks, Canadian clinical practice guidelines, NurseNest RPN-tier practice questions and flashcards, and CAT-format practice exams. Prioritize Canadian-specific resources." },
      { q: "How do I prepare for the CAT format specifically?", a: "Practice answering questions without going back to change answers. Build confidence in your first-choice response. Complete practice exams in CAT format to develop the discipline of committing to answers and moving forward." }
    ]
  },
  "vs-nclex": {
    title: "REX-PN vs NCLEX-PN: Key Differences",
    seoTitle: "REX-PN vs NCLEX-PN: Key Differences Between Canadian & US Practical Nursing Exams (2025)",
    description: "Comprehensive comparison of the Canadian REX-PN and American NCLEX-PN exams including format differences, content variations, scoring, and credential transferability.",
    icon: Scale,
    sections: [
      {
        heading: "Overview: Two Exams, Different Systems",
        content: [
          "The REX-PN (Regulatory Exam – Practical Nurse) and NCLEX-PN (National Council Licensure Examination – Practical Nurse) are both entry-level licensing examinations for practical nursing, but they serve different healthcare systems with distinct regulatory frameworks, terminology, and clinical practice standards.",
          "The REX-PN is the Canadian exam for candidates seeking to become Registered Practical Nurses (RPNs) in Ontario or the equivalent designation in other Canadian provinces. The NCLEX-PN is the American exam for candidates seeking to become Licensed Practical Nurses (LPNs) or Licensed Vocational Nurses (LVNs) in the United States.",
          "While both exams use Computer Adaptive Testing (CAT) technology developed by the NCSBN, the content, clinical context, and regulatory frameworks tested are different. Understanding these differences is particularly important for internationally educated nurses or candidates considering practice in both countries."
        ]
      },
      {
        heading: "Format Comparison",
        content: [
          "Both exams use CAT technology, meaning the difficulty of questions adapts to each candidate's performance. Both have variable-length exams determined by the CAT algorithm. The REX-PN has 85-150 questions with a 5-hour time limit, while the NCLEX-PN has 85-150 questions with a 5-hour time limit — the structural format is very similar.",
          "Question types are also similar: both include multiple-choice, select-all-that-apply, ordered-response, hot-spot, and fill-in-the-blank items. Neither exam allows candidates to return to previous questions once answered.",
          "The content blueprint organization differs. The REX-PN blueprint follows four Client Needs categories (Safe and Effective Care Environment, Health Promotion and Maintenance, Psychosocial Integrity, and Physiological Integrity), which is the same framework used by the NCLEX-PN. However, the specific content within each category reflects the respective country's healthcare system.",
          "Both exams use a criterion-referenced passing standard determined by expert panels. Neither exam discloses the exact passing score. Results for both are reported as pass or fail."
        ]
      },
      {
        heading: "Content & Terminology Differences",
        content: [
          "The most significant differences between the REX-PN and NCLEX-PN are in clinical content, terminology, and healthcare system context.",
          "Terminology: The Canadian exam uses RPN (Registered Practical Nurse), while the American exam uses LPN (Licensed Practical Nurse) or LVN (Licensed Vocational Nurse). Clinical terminology may differ — for example, 'routine practices' in Canada versus 'standard precautions' in the US, and 'additional precautions' versus 'transmission-based precautions.'",
          "Units: The REX-PN uses metric units (°C for temperature, kg for weight, cm for height, mmol/L for many lab values). The NCLEX-PN uses imperial units (°F for temperature, lbs for weight, inches for height) and conventional units for lab values (mg/dL). Dosage calculations reflect the measurement system of each country.",
          "Guidelines and Frameworks: The REX-PN tests Canadian clinical practice guidelines, Canadian immunization schedules, and provincial/territorial regulatory frameworks. The NCLEX-PN tests American guidelines (CDC), American immunization schedules, and state nursing practice acts. Pharmacology questions may reference different drug names or availability between countries."
        ]
      },
      {
        heading: "Scope of Practice Differences",
        content: [
          "The RPN (Canada) and LPN (US) roles share many similarities but have notable differences in scope of practice that are reflected in their respective exams.",
          "In Canada, RPNs work within a regulated scope of practice defined by provincial nursing regulatory bodies (e.g., the College of Nurses of Ontario). The RPN scope includes medication administration, wound care, patient assessment within defined parameters, and collaboration with RNs and other healthcare team members. The REX-PN tests competencies within this Canadian scope.",
          "In the United States, LPN/LVN scope of practice varies significantly by state. Some states allow LPNs to perform IV therapy, administer certain medications via IV push, or supervise other LPNs, while others restrict these activities. The NCLEX-PN tests a generalized scope that represents the broadest common scope across states.",
          "The Canadian healthcare system (publicly funded, single-payer) creates a different practice context than the American system (multi-payer, mixed public-private). Questions about discharge planning, community resources, and access to care reflect these systemic differences."
        ]
      },
      {
        heading: "Credential Transferability",
        content: [
          "Passing the REX-PN does not qualify a candidate to practise as an LPN in the United States, and passing the NCLEX-PN does not qualify a candidate to practise as an RPN in Canada. Each country requires its own licensing examination and registration process.",
          "Canadian RPNs seeking to practise in the US must apply to the State Board of Nursing in the state where they wish to practise, have their educational credentials evaluated, and pass the NCLEX-PN. Additional requirements vary by state and may include English language proficiency testing (if applicable) and a criminal background check.",
          "American LPNs seeking to practise in Canada must apply to the provincial or territorial nursing regulatory body, have their credentials assessed for substantial equivalency to Canadian educational standards, and pass the REX-PN. Additional bridging education may be required if the credential assessment identifies gaps.",
          "The process of credential transfer between countries can take several months to over a year, depending on the jurisdiction and the candidate's specific educational background."
        ]
      }
    ],
    faqs: [
      { q: "Is the REX-PN the same as the NCLEX-PN?", a: "No. While both use CAT technology and similar question formats, they test different content, terminology, units, and regulatory frameworks. The REX-PN is Canadian and the NCLEX-PN is American." },
      { q: "Can I use my REX-PN credential to work as an LPN in the US?", a: "Not directly. You would need to apply to the State Board of Nursing, have your credentials evaluated, and pass the NCLEX-PN. Requirements vary by state." },
      { q: "Can I use NCLEX-PN study materials for the REX-PN?", a: "American NCLEX-PN resources can supplement your study but should not be primary. The REX-PN tests Canadian-specific content including metric units, Canadian guidelines, and Canadian regulatory frameworks." },
      { q: "Which exam is harder — REX-PN or NCLEX-PN?", a: "Direct comparison is difficult as they test different content in different contexts. Both are challenging, well-validated licensure examinations designed to assess minimum competency for safe practice." },
      { q: "Does the REX-PN use the same CAT system as the NCLEX-PN?", a: "Both exams use CAT technology developed by the NCSBN. The adaptive algorithm works similarly, but the question pools, content, and passing standards are distinct for each exam." }
    ]
  }
};

const hubFaqs = [
  { q: "What is the REX-PN exam?", a: "The Regulatory Exam – Practical Nurse (REX-PN) is the Canadian licensing examination for practical nurse candidates seeking registration as a Registered Practical Nurse (RPN). It uses Computer Adaptive Testing (CAT) and is administered at Pearson VUE testing centres." },
  { q: "How many questions are on the REX-PN?", a: "The REX-PN has a minimum of 85 questions and a maximum of 150 questions. The actual number depends on when the CAT algorithm reaches a pass/fail decision with sufficient confidence." },
  { q: "What is the passing score for the REX-PN?", a: "The exact passing standard is not publicly disclosed. It is criterion-referenced, based on the minimum competency required for safe entry-level practical nursing practice, determined through expert panel review." },
  { q: "How much does the REX-PN cost?", a: "The REX-PN exam fee is approximately $360-400 CAD per attempt, plus any applicable provincial registration fees and study resource costs." },
  { q: "How long should I study for the REX-PN?", a: "Most candidates benefit from 10 weeks of structured preparation with 2-3 hours of daily study, following a phased approach of content foundation, clinical application, and exam readiness." },
  { q: "Is the REX-PN available in French?", a: "Yes. The REX-PN is available in both English and French at Pearson VUE testing centres across Canada." },
  { q: "How are REX-PN results reported?", a: "Results are typically available within 2-4 business days through your provincial or territorial nursing regulatory body. Results are reported as pass or fail." },
  { q: "What content areas does the REX-PN cover?", a: "The REX-PN covers four Client Needs categories: Safe and Effective Care Environment (26-32%), Health Promotion and Maintenance (6-12%), Psychosocial Integrity (6-12%), and Physiological Integrity (38-44%)." },
  { q: "Can I retake the REX-PN if I don't pass?", a: "Yes. A mandatory 45-day waiting period is required between attempts. Maximum attempt limits vary by province/territory. Contact your regulatory body for specific retake policies." },
  { q: "What replaced the CPNRE?", a: "The REX-PN replaced the Canadian Practical Nurse Registration Examination (CPNRE) as the national entry-to-practice exam for practical nurses in Canada. The REX-PN uses modern CAT technology." },
  { q: "Can I go back and change answers on the REX-PN?", a: "No. The CAT format does not allow returning to previous questions. Each subsequent question is selected based on your response to the previous one, so answers are final once submitted." },
  { q: "Where can I find REX-PN practice questions?", a: "NurseNest offers RPN-tier practice questions specifically designed for the REX-PN, including CAT-format practice, alternate question types, and detailed rationales with Canadian context. Start with a free account." }
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
    script.id = "rex-pn-faq-schema";
    const existing = document.getElementById("rex-pn-faq-schema");
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
        Canadian REX-PN Exam Guide
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
        <LocaleLink
          href="/rex-pn-guide"
          className={`text-sm px-3 py-2 rounded-lg transition-colors ${!currentSlug ? 'bg-primary text-white font-medium' : 'hover:bg-gray-100 text-gray-700'}`}
          data-testid="link-rex-pn-hub"
        >
          Hub Overview
        </LocaleLink>
        {clusterSlugs.map(slug => {
          const cluster = clusterData[slug];
          const Icon = cluster.icon;
          return (
            <LocaleLink
              key={slug}
              href={`/rex-pn-guide/${slug}`}
              className={`text-sm px-3 py-2 rounded-lg transition-colors flex items-center gap-2 ${currentSlug === slug ? 'bg-primary text-white font-medium' : 'hover:bg-gray-100 text-gray-700'}`}
              data-testid={`link-rex-pn-cluster-${slug}`}
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              <span className="truncate">{cluster.title.replace("REX-PN ", "").replace("REX-PN vs NCLEX-PN: ", "")}</span>
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
        canonicalPath={`/rex-pn-guide/${slug}`}
      />

      <main className="max-w-4xl mx-auto px-4 py-8 sm:py-12">
        <BreadcrumbNav title={cluster.title} />
        <div className="mb-6">
          <LocaleLink href="/rex-pn-guide" className="text-primary hover:underline text-sm flex items-center gap-1" data-testid="link-back-rex-pn-hub">
            <ChevronRight className="w-4 h-4 rotate-180" /> Back to REX-PN Exam Guide
          </LocaleLink>
        </div>

        <div className="mb-8">
          <Badge variant="secondary" className="mb-3">{t("pages.rexPnGuide.canadianRexpnExam")}</Badge>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4" data-testid="text-rex-pn-cluster-title">{cluster.title}</h1>
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
          <h2 className="text-2xl font-bold mb-6">{t("pages.rexPnGuide.frequentlyAskedQuestions")}</h2>
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
          <h2 className="text-2xl font-bold mb-3">{t("pages.rexPnGuide.readyToStartPracticing")}</h2>
          <p className="text-gray-600 mb-6 max-w-lg mx-auto">
            Access RPN-tier practice questions, flashcards, and study tools specifically designed for the Canadian REX-PN exam.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <LocaleLink href="/start-free">
              <Button size="lg" className="gap-2" data-testid="button-rex-pn-start-free">
                Start Free RPN Practice <ArrowRight className="w-4 h-4" />
              </Button>
            </LocaleLink>
            <LocaleLink href="/flashcards">
              <Button size="lg" variant="outline" className="gap-2" data-testid="button-rex-pn-flashcards">
                <BookOpen className="w-4 h-4" /> Browse RPN Flashcards
              </Button>
            </LocaleLink>
          </div>
        </div>

        <ClusterNav currentSlug={slug} />
      </main>
    </div>
  );
}

function HubPage() {
  const contentDomains = [
    { name: "Safe & Effective Care Environment", weight: "26-32%", icon: Shield, desc: "Coordinated care, delegation, infection control, safety, legal and ethical principles" },
    { name: "Health Promotion & Maintenance", weight: "6-12%", icon: Lightbulb, desc: "Growth and development, screening, immunization, self-care education" },
    { name: "Psychosocial Integrity", weight: "6-12%", icon: Users, desc: "Therapeutic communication, mental health, coping, cultural safety, crisis intervention" },
    { name: "Physiological Integrity", weight: "38-44%", icon: Stethoscope, desc: "Pharmacology, risk reduction, physiological adaptation, basic care and comfort" },
  ];

  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      <AdminEditButton />
      <FaqSchema faqs={hubFaqs} />
      <SEO
        title={t("pages.rexPnGuide.rexpnExamGuideCompleteCanadian")}
        description={t("pages.rexPnGuide.everythingYouNeedToKnow")}
        canonicalPath="/rex-pn-guide"
      />

      <main className="max-w-4xl mx-auto px-4 py-8 sm:py-12">
        <BreadcrumbNav />
        <div className="mb-8">
          <Badge variant="secondary" className="mb-3">{t("pages.rexPnGuide.completeGuide2025")}</Badge>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4" data-testid="text-rex-pn-hub-title">
            REX-PN Exam Guide: Canadian RPN Licensing
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl">
            Everything you need to know about the Regulatory Exam – Practical Nurse (REX-PN) — CAT format, content blueprint, passing standard, study strategies, and how to prepare effectively for your Canadian RPN licence.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
          <div className="bg-blue-50 rounded-xl p-4 text-center" data-testid="stat-rex-pn-questions">
            <FileText className="w-6 h-6 text-blue-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-blue-700">85-150</div>
            <div className="text-xs text-blue-600">{t("pages.rexPnGuide.questionsCat")}</div>
          </div>
          <div className="bg-green-50 rounded-xl p-4 text-center" data-testid="stat-rex-pn-time">
            <Clock className="w-6 h-6 text-green-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-green-700">{t("pages.rexPnGuide.5Hours")}</div>
            <div className="text-xs text-green-600">{t("pages.rexPnGuide.maximumTime")}</div>
          </div>
          <div className="bg-purple-50 rounded-xl p-4 text-center" data-testid="stat-rex-pn-domains">
            <Target className="w-6 h-6 text-purple-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-purple-700">{t("pages.rexPnGuide.4Domains")}</div>
            <div className="text-xs text-purple-600">{t("pages.rexPnGuide.clientNeeds")}</div>
          </div>
          <div className="bg-amber-50 rounded-xl p-4 text-center" data-testid="stat-rex-pn-scope">
            <MapPin className="w-6 h-6 text-amber-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-amber-700">{t("pages.rexPnGuide.national")}</div>
            <div className="text-xs text-amber-600">{t("pages.rexPnGuide.allProvinces")}</div>
          </div>
        </div>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">{t("pages.rexPnGuide.whatIsTheRexpn")}</h2>
          <div className="prose prose-lg max-w-none text-gray-700">
            <p>
              The Regulatory Exam – Practical Nurse (REX-PN) is the Canadian licensing examination for practical nurse candidates seeking registration as a Registered Practical Nurse (RPN). Developed by the National Council of State Boards of Nursing (NCSBN) in partnership with Canadian nursing regulatory bodies, it uses Computer Adaptive Testing (CAT) technology to assess entry-level competency.
            </p>
            <p>
              The REX-PN replaced the Canadian Practical Nurse Registration Examination (CPNRE) as the national entry-to-practice exam. It is administered at Pearson VUE testing centres across Canada in both English and French, with 85-150 questions and a maximum of 5 hours of testing time.
            </p>
            <p>
              The exam assesses whether candidates possess the minimum competencies required for safe and effective practical nursing practice in the Canadian healthcare system. All questions are set within the Canadian context, using metric units (°C, kg, cm), Canadian terminology, and Canadian clinical practice guidelines.
            </p>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">{t("pages.rexPnGuide.contentDomains")}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {contentDomains.map((domain, i) => (
              <Card key={i} className="border-l-4 border-l-primary" data-testid={`card-rex-pn-domain-${i}`}>
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
          <h2 className="text-2xl font-bold mb-6">{t("pages.rexPnGuide.exploreTheCompleteGuide")}</h2>
          <ClusterNav />
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">{t("pages.rexPnGuide.catFormatHowItWorks")}</h2>
          <div className="prose prose-lg max-w-none text-gray-700">
            <p>
              The REX-PN uses Computer Adaptive Testing (CAT), which tailors question difficulty to each candidate's demonstrated ability level. After each answer, the computer recalculates the candidate's estimated ability and selects the next question accordingly — harder questions after correct answers, easier questions after incorrect answers.
            </p>
            <p>
              The exam continues until the CAT algorithm is 95% confident that the candidate is either above or below the passing standard, or until the maximum of 150 questions is reached, or until the 5-hour time limit expires. This means exam length varies between candidates — some finish in 85 questions, others receive more.
            </p>
            <p>
              A key difference from traditional exams: once you answer a question and move forward, you cannot go back and change your answer. Each subsequent question depends on your previous response. This requires confidence in your clinical reasoning and the discipline to commit to your best answer.
            </p>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">{t("pages.rexPnGuide.studyStrategyOverview")}</h2>
          <div className="prose prose-lg max-w-none text-gray-700">
            <p>
              A structured 10-week study plan is recommended, divided into three phases: Content Foundation (Weeks 1-4), Clinical Application (Weeks 5-7), and Exam Readiness (Weeks 8-10). Consistent daily study of 2-3 hours with a balanced approach of content review, practice questions, and active recall produces the best outcomes.
            </p>
            <p>
              Prioritize Canadian-specific resources including clinical practice guidelines, practice questions written for the RPN scope, and flashcards using Canadian terminology and metric units. Aim for 1,500-2,000 practice questions over your preparation period with thorough rationale review.
            </p>
          </div>
          <div className="flex gap-3 mt-4">
            <LocaleLink href="/rex-pn-guide/study-plan">
              <Button variant="outline" className="gap-2" data-testid="button-rex-pn-study-plan">
                <Calendar className="w-4 h-4" /> View 10-Week Study Plan
              </Button>
            </LocaleLink>
            <LocaleLink href="/rex-pn-guide/vs-nclex">
              <Button variant="outline" className="gap-2" data-testid="button-rex-pn-vs-nclex">
                <Scale className="w-4 h-4" /> REX-PN vs NCLEX-PN
              </Button>
            </LocaleLink>
          </div>
        </section>

        <div className="bg-gray-50 rounded-xl p-8 mb-12">
          <h2 className="text-2xl font-bold mb-6">{t("pages.rexPnGuide.frequentlyAskedQuestions2")}</h2>
          <div className="space-y-6">
            {hubFaqs.slice(0, 8).map((faq, i) => (
              <div key={i} className="border-b border-gray-200 pb-4 last:border-0" data-testid={`faq-rex-pn-${i}`}>
                <h3 className="font-semibold text-gray-900 mb-2">{faq.q}</h3>
                <p className="text-gray-600">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gradient-to-r from-primary/10 to-blue-50 rounded-xl p-8 text-center mb-12">
          <GraduationCap className="w-12 h-12 text-primary mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-3">{t("pages.rexPnGuide.startYourRexpnExamPrep")}</h2>
          <p className="text-gray-600 mb-6 max-w-lg mx-auto">
            Access RPN-tier practice questions, flashcards, and clinical study tools designed specifically for the Canadian REX-PN licensing exam.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <LocaleLink href="/start-free">
              <Button size="lg" className="gap-2" data-testid="button-rex-pn-hub-start-free">
                Start Free RPN Practice <ArrowRight className="w-4 h-4" />
              </Button>
            </LocaleLink>
            <LocaleLink href="/rex-pn-guide/blueprint">
              <Button size="lg" variant="outline" className="gap-2" data-testid="button-rex-pn-hub-blueprint">
                <Target className="w-4 h-4" /> View Content Blueprint
              </Button>
            </LocaleLink>
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <ContextualRelatedResources
            pageType="examGuide"
            tags={["rex-pn", "exam-prep"]}
            profession="rpn"
            currentPath="/rex-pn-guide"
            className="border-t border-gray-200"
          />
          <CrossPlatformRelatedContent
            slug="rex-pn"
            source="nursing"
          />
        </div>
        <EndOfContentLeadCapture
          leadMagnetType="study_guide"
          professionContext="REX-PN"
          source="rex_pn_guide"
        />
      </main>
    </div>
  );
}

export default function RexPnGuide() {
  const params = useParams<{ slug?: string }>();
  const slug = params?.slug;

  if (slug && clusterData[slug]) {
    return <ClusterPage slug={slug} />;
  }

  return <HubPage />;
}