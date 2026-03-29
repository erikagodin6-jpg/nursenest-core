import { useState, useEffect } from "react";
import { useRoute, Link } from "wouter";
import { SEO } from "@/components/seo";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { BreadcrumbNav } from "@/components/breadcrumb-nav";
import { buildFaqStructuredData } from "@/lib/structured-data";
import { useI18n } from "@/lib/i18n";
import { fetchInternationalStats, type InternationalExamStats } from "@/lib/qbank-api";
import {
  ArrowRight, CheckCircle2, ChevronDown, Clock, BookOpen,
  GraduationCap, Target, AlertTriangle, FileText, Globe, Shield,
} from "lucide-react";

interface ExamConfig {
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  seoKeywords: string;
  whoIsItFor: string[];
  whyRequired: string;
  examOverview: string;
  examFormat: string[];
  howToPrepare: { step: string; detail: string }[];
  commonMistakes: string[];
  studyPlanSummary: string;
  nursenestLink: string;
  nursenestCTA: string;
  faqs: { question: string; answer: string }[];
  examCode?: string;
}

const EXAM_CONFIGS: Record<string, ExamConfig> = {
  "nclex-for-international-nurses": {
    slug: "nclex-for-international-nurses",
    title: "NCLEX-RN for International Nurses",
    subtitle: "Everything internationally educated nurses need to know about the NCLEX-RN",
    description: "Complete NCLEX-RN guide for internationally educated nurses. Learn about eligibility, exam format, preparation strategies, and how NurseNest helps IENs pass the NCLEX on their first attempt.",
    seoKeywords: "NCLEX international nurses, NCLEX-RN IEN, NCLEX for foreign nurses, international NCLEX prep, NCLEX internationally educated nurse, NCLEX preparation guide",
    whoIsItFor: [
      "Internationally educated nurses seeking RN licensure in the US or Canada",
      "Filipino, Indian, Nigerian, and other IENs preparing for NCLEX-RN",
      "Nurses who have completed credential evaluation (CGFNS, NNAS) and have ATT",
      "IENs who need to understand CAT format and US/Canadian nursing standards",
    ],
    whyRequired: "The NCLEX-RN is the mandatory licensing exam for Registered Nurse registration in both the United States and Canada. All internationally educated nurses must pass this exam to practice as RNs in these countries, regardless of their qualifications or experience in their home country.",
    examOverview: "The NCLEX-RN uses Computer Adaptive Testing (CAT) with 85-145 questions over a maximum of 5 hours. Questions adapt to your ability level — correct answers lead to harder questions, incorrect answers lead to easier ones. The exam tests clinical judgment, patient safety, and nursing knowledge across all body systems.",
    examFormat: [
      "85-145 questions (adaptive length)",
      "Maximum 5 hours testing time",
      "Computer Adaptive Testing (CAT) format",
      "Question types: Multiple choice, Select All That Apply (SATA), ordered response, hot spot, fill-in-the-blank",
      "Content areas: Safe and Effective Care Environment, Health Promotion, Psychosocial Integrity, Physiological Integrity",
      "Available at Pearson VUE testing centres worldwide",
    ],
    howToPrepare: [
      { step: "Understand the CAT format", detail: "The NCLEX uses adaptive testing — the computer adjusts question difficulty based on your performance. Practice with CAT-simulation exams to get comfortable with this unique format." },
      { step: "Master clinical judgment", detail: "NCLEX questions test your ability to think like a nurse, not just memorize facts. Practice applying nursing knowledge to realistic clinical scenarios and prioritizing patient care." },
      { step: "Focus on high-yield topics", detail: "Prioritize pharmacology, safety/infection control, and physiological integrity — these are heavily weighted. Use the exam blueprint to allocate study time proportionally." },
      { step: "Practice with quality questions", detail: "Use NurseNest's 2,400+ NCLEX-style practice questions with detailed rationales. Focus on understanding WHY answers are correct, not just memorizing answers." },
      { step: "Take full-length mock exams", detail: "Complete timed mock exams under realistic conditions. This builds exam-day stamina and helps you identify weak areas. NurseNest's adaptive mock exams simulate the real CAT experience." },
      { step: "Review rationales thoroughly", detail: "After each practice question, read the rationale completely — including why incorrect answers are wrong. This builds the clinical reasoning patterns tested on the NCLEX." },
    ],
    commonMistakes: [
      "Studying content without practicing CAT-format questions — the exam format matters as much as the content",
      "Memorizing facts instead of developing clinical reasoning skills",
      "Spending too much time on low-yield topics instead of following the exam blueprint",
      "Not practicing time management — some IENs run out of time",
      "Using study materials from their home country that don't align with NCLEX standards",
      "Not familiarizing yourself with US/Canadian clinical terminology and medication names",
    ],
    studyPlanSummary: "Most IENs benefit from 8-12 weeks of dedicated NCLEX preparation. Start with a diagnostic assessment to identify weak areas, then follow a structured study plan focusing on high-yield topics. Complete at least 2,000 practice questions before your exam date.",
    nursenestLink: "/mock-exams",
    nursenestCTA: "Start NCLEX Prep with NurseNest",
    examCode: "NCLEX-RN",
    faqs: [
      { question: "Is the NCLEX-RN the same in the US and Canada?", answer: "Yes. The NCLEX-RN is developed by NCSBN and is the same exam used for RN licensure in both the United States and Canada. The exam content, format, and passing standard are identical regardless of where you take it." },
      { question: "What is the NCLEX pass rate for international nurses?", answer: "The NCLEX pass rate for internationally educated nurses is typically lower than for domestic graduates — around 30-50% on the first attempt depending on the source country. This makes thorough preparation essential. IENs who use structured prep programs significantly improve their pass rates." },
      { question: "Can I take the NCLEX in my home country?", answer: "Yes. The NCLEX-RN is available at Pearson VUE testing centres in many countries worldwide, including the Philippines, India, UK, Australia, and others. You need an Authorization to Test (ATT) from a US state board or Canadian provincial regulatory body." },
      { question: "How many times can I retake the NCLEX?", answer: "You can retake the NCLEX-RN with a mandatory 45-day waiting period between attempts. Most jurisdictions allow unlimited retakes, though some may impose additional requirements after multiple failed attempts." },
      { question: "How does NurseNest help international nurses prepare?", answer: "NurseNest offers 6,000+ lessons, 2,400+ NCLEX-style practice questions, adaptive CAT-simulation exams, clinical simulators, and study tools — all available in 15 languages. Our platform is specifically designed to support IENs with content aligned to the NCLEX exam blueprint." },
    ],
  },
  "rex-pn-for-international-nurses": {
    slug: "rex-pn-for-international-nurses",
    title: "REx-PN for International Nurses",
    subtitle: "Guide for internationally educated nurses seeking practical nursing registration in Canada",
    description: "Complete REx-PN guide for internationally educated nurses. Learn about the Canadian practical nursing exam, eligibility requirements, preparation strategies, and registration pathways.",
    seoKeywords: "REx-PN international nurses, REx-PN IEN, REx-PN foreign nurses, Canadian practical nursing exam international, RPN exam international, LPN exam Canada international",
    whoIsItFor: [
      "Internationally educated nurses seeking RPN/LPN registration in Canada",
      "Nurses with practical/vocational nursing qualifications from abroad",
      "IENs directed to the REx-PN pathway through NNAS credential evaluation",
    ],
    whyRequired: "The REx-PN (Regulatory Exam – Practical Nurse) is the mandatory licensing exam for practical nurse registration in Canada. IENs seeking to practice as Registered Practical Nurses (RPNs) or Licensed Practical Nurses (LPNs) in Canadian provinces must pass this exam.",
    examOverview: "The REx-PN uses Computer Adaptive Testing (CAT) with 85-150 questions over 5 hours. It assesses entry-level practical nursing competencies within the Canadian healthcare context, including patient safety, medication administration, and collaborative practice.",
    examFormat: [
      "85-150 questions (adaptive length)",
      "Maximum 5 hours",
      "CAT format (Computer Adaptive Testing)",
      "Available in English and French",
      "Content domains: Safe and Effective Care, Health Promotion, Psychosocial Integrity, Physiological Integrity",
      "Available at Pearson VUE centres in Canada",
    ],
    howToPrepare: [
      { step: "Understand Canadian nursing context", detail: "The REx-PN tests practical nursing within the Canadian healthcare system. Familiarize yourself with Canadian drug names, metric units, and clinical practice guidelines." },
      { step: "Master the RPN scope of practice", detail: "Know the boundaries of RPN practice — what you can and cannot do independently, when to escalate, and how to collaborate with RNs and the healthcare team." },
      { step: "Practice CAT-format questions", detail: "Use NurseNest's REx-PN practice exams to get comfortable with the adaptive testing format and question types." },
      { step: "Focus on pharmacology and safety", detail: "Medication administration and patient safety are heavily weighted. Review drug classifications, dosage calculations, and safety protocols." },
      { step: "Complete mock exams", detail: "Take full-length timed practice exams to build stamina and identify weak areas." },
    ],
    commonMistakes: [
      "Not understanding the RPN scope of practice vs RN scope",
      "Using US-focused study materials without Canadian context",
      "Ignoring Canadian-specific content (drug names, units, guidelines)",
      "Not practicing enough CAT-format questions",
    ],
    studyPlanSummary: "Plan for 8-10 weeks of dedicated preparation. Focus on understanding the Canadian practical nursing scope and practicing with REx-PN-specific questions.",
    nursenestLink: "/mock-exams",
    nursenestCTA: "Start REx-PN Prep with NurseNest",
    examCode: "REx-PN",
    faqs: [
      { question: "What is the difference between NCLEX-RN and REx-PN?", answer: "NCLEX-RN is for Registered Nurse (RN) licensure, while REx-PN is for practical nurse (RPN/LPN) registration. The REx-PN tests practical nursing competencies at the entry level, while NCLEX-RN covers a broader scope of registered nursing practice." },
      { question: "Can I take the REx-PN outside Canada?", answer: "The REx-PN is primarily available at Pearson VUE centres in Canada. International candidates may need to arrange to take the exam in Canada." },
    ],
  },
  "ielts-for-nurses": {
    slug: "ielts-for-nurses",
    title: "IELTS for Nurses: Complete Guide",
    subtitle: "Everything nurses need to know about IELTS Academic for nursing licensure",
    description: "Complete IELTS guide for nurses. Learn about required scores for nursing registration, preparation strategies, test format, and tips specific to healthcare professionals.",
    seoKeywords: "IELTS for nurses, IELTS nursing score, IELTS Academic nursing, IELTS 7.0 nursing, IELTS preparation nurses, nursing English proficiency, IELTS healthcare",
    whoIsItFor: [
      "Internationally educated nurses applying for licensure in English-speaking countries",
      "Nurses needing IELTS Academic scores for NMC, NNAS, AHPRA, or NCNZ registration",
      "Healthcare professionals preparing for the IELTS Academic test",
    ],
    whyRequired: "IELTS Academic is one of the most widely accepted English proficiency tests for nursing registration. Countries including Canada, UK, Australia, New Zealand, and Ireland require proof of English proficiency for internationally educated nurses. Most nursing regulatory bodies require a minimum score of 7.0 in each band.",
    examOverview: "IELTS Academic tests four skills: Listening (30 minutes), Reading (60 minutes), Writing (60 minutes), and Speaking (11-14 minutes). The test produces an overall band score and individual band scores from 1.0 to 9.0. Most nursing regulatory bodies require 7.0 in each individual band.",
    examFormat: [
      "Listening: 30 minutes, 40 questions, 4 sections",
      "Reading: 60 minutes, 40 questions, 3 passages (academic)",
      "Writing: 60 minutes, 2 tasks (report/graph description + essay)",
      "Speaking: 11-14 minutes, face-to-face interview, 3 parts",
      "Band score range: 1.0 to 9.0 (0.5 increments)",
      "Most nursing bodies require: 7.0 in each band",
    ],
    howToPrepare: [
      { step: "Know the required scores", detail: "Most nursing regulatory bodies require 7.0 in each band (Listening, Reading, Writing, Speaking). Some accept 6.5 in one band with a higher overall score. Verify your specific requirements." },
      { step: "Identify your weakest band", detail: "Most nurses find Writing the most challenging band. Take a diagnostic test to identify where you need the most improvement." },
      { step: "Practice academic writing", detail: "Focus on Task 2 essay structure, coherence, grammar range, and vocabulary. Practice writing about healthcare-related topics to build relevant vocabulary." },
      { step: "Build speaking confidence", detail: "Practice speaking about healthcare topics, your nursing experience, and current events. Record yourself and listen for pronunciation and fluency issues." },
      { step: "Use official practice materials", detail: "Complete official IELTS practice tests under timed conditions. Focus on question types and timing strategies." },
      { step: "Consider preparation courses", detail: "IELTS preparation courses designed for healthcare professionals can provide targeted practice and feedback on your weak areas." },
    ],
    commonMistakes: [
      "Not practicing under timed conditions — time management is crucial for Reading and Writing",
      "Focusing only on content knowledge and neglecting test technique",
      "Not practicing the speaking test format — many nurses lose marks due to unfamiliarity",
      "Attempting the test without adequate preparation — the 7.0 bar is high",
      "Not taking advantage of the 2-3 attempts that most candidates need",
    ],
    studyPlanSummary: "Plan for 6-12 weeks of preparation, depending on your current English level. Dedicate at least 1-2 hours daily to practice, with extra time on your weakest bands. Most nurses achieve the required scores within 2-3 attempts.",
    nursenestLink: "/international-nurses",
    nursenestCTA: "Explore International Nursing Guides",
    faqs: [
      { question: "What IELTS score do I need for nursing?", answer: "Most nursing regulatory bodies require IELTS Academic 7.0 in each band (Listening, Reading, Writing, Speaking). Some accept 6.5 in one band with 7.5 in another. Check your specific regulatory body's requirements." },
      { question: "Is OET easier than IELTS for nurses?", answer: "Many nurses find OET more accessible because it uses healthcare-specific content. However, 'easier' depends on your strengths. If you struggle with IELTS Writing, OET's healthcare-focused writing task may be more manageable." },
      { question: "How long are IELTS scores valid?", answer: "IELTS scores are typically valid for 2 years from the test date. You must complete your nursing registration application within this period." },
      { question: "Can I combine scores from different IELTS tests?", answer: "Some regulatory bodies accept combined scores from two tests taken within 6 months (e.g., AHPRA). Others require all bands to be achieved in a single test sitting. Check your specific requirements." },
    ],
  },
  "oet-for-nurses": {
    slug: "oet-for-nurses",
    title: "OET for Nurses: Complete Guide",
    subtitle: "The healthcare-specific English test preferred by many nursing regulatory bodies",
    description: "Complete OET guide for nurses. Learn why nurses prefer OET over IELTS, required scores for nursing registration, test format, and healthcare-specific preparation strategies.",
    seoKeywords: "OET for nurses, OET nursing score, OET vs IELTS nursing, Occupational English Test nursing, OET preparation nurses, OET healthcare, OET B grade nursing",
    whoIsItFor: [
      "Internationally educated nurses who prefer a healthcare-specific English test",
      "Nurses who have struggled with IELTS Academic and want an alternative",
      "Healthcare professionals seeking English proficiency certification for registration",
    ],
    whyRequired: "OET (Occupational English Test) is a healthcare-specific English language test accepted by nursing regulatory bodies in the UK (NMC), Australia (AHPRA), New Zealand (NCNZ), Ireland (NMBI), and several Canadian provinces. Many nurses prefer OET because the content is directly relevant to their clinical practice.",
    examOverview: "OET tests four skills using healthcare-specific content: Listening (about 40 minutes), Reading (60 minutes), Writing (45 minutes — a referral/discharge letter), and Speaking (about 20 minutes — a role-play clinical scenario). Results are graded from A (highest) to E (lowest). Most regulatory bodies require grade B.",
    examFormat: [
      "Listening: ~40 minutes, healthcare consultations and presentations",
      "Reading: 60 minutes, 3 parts, healthcare-related texts",
      "Writing: 45 minutes, write a referral/discharge/transfer letter based on clinical notes",
      "Speaking: ~20 minutes, 2 role-play scenarios with an interlocutor playing a patient/carer",
      "Grading: A (highest) to E, with B being the most common required grade",
      "Available at test centres worldwide and online",
    ],
    howToPrepare: [
      { step: "Understand the test format", detail: "OET's healthcare-specific format means the content is familiar to nurses. The writing task involves writing a clinical letter, and speaking involves patient communication scenarios." },
      { step: "Practice clinical letter writing", detail: "The Writing sub-test requires writing a referral, discharge, or transfer letter based on patient notes. Practice organizing information, using appropriate medical terminology, and writing concisely." },
      { step: "Prepare for speaking role-plays", detail: "Practice explaining diagnoses, providing patient education, breaking bad news, and discussing treatment plans in a clear, empathetic manner." },
      { step: "Use OET-specific materials", detail: "Official OET practice materials are available online. Practice with past papers and familiarize yourself with the marking criteria." },
      { step: "Build healthcare vocabulary", detail: "Review medical terminology, common abbreviations, and clinical communication phrases used in English-speaking healthcare settings." },
    ],
    commonMistakes: [
      "Treating OET like a general English test — it requires healthcare communication skills",
      "Not practicing the specific letter-writing format for the Writing sub-test",
      "Being too clinical in speaking scenarios — OET values empathetic patient communication",
      "Not managing time in the Writing sub-test — you have only 45 minutes",
    ],
    studyPlanSummary: "Plan for 4-8 weeks of OET-specific preparation. If you have strong clinical English skills, you may need less time. Focus on the Writing and Speaking sub-tests, which are most unique to OET.",
    nursenestLink: "/international-nurses",
    nursenestCTA: "Explore International Nursing Guides",
    faqs: [
      { question: "Is OET accepted everywhere IELTS is?", answer: "Not quite. OET is accepted by NMC (UK), AHPRA (Australia), NCNZ (New Zealand), NMBI (Ireland), and many Canadian provinces. However, some institutions and immigration authorities may only accept IELTS. Always verify with your specific regulatory body." },
      { question: "What OET grade do I need for nursing?", answer: "Most nursing regulatory bodies require grade B in each sub-test (Listening, Reading, Writing, Speaking). Grade B corresponds approximately to IELTS 7.0." },
      { question: "Is OET easier than IELTS for nurses?", answer: "Many nurses find OET more manageable because the content is healthcare-specific. The writing task (clinical letter) and speaking (patient role-play) feel more natural than IELTS's academic essay and general interview. However, achieving grade B still requires strong English skills." },
    ],
  },
  "nursing-credential-assessment-explained": {
    slug: "nursing-credential-assessment-explained",
    title: "Nursing Credential Assessment Explained",
    subtitle: "How nursing credential evaluation works and which agencies to use",
    description: "Complete guide to nursing credential assessment for internationally educated nurses. Learn about NNAS, CGFNS, NMC, ANMAC, and other agencies that evaluate nursing qualifications for international registration.",
    seoKeywords: "nursing credential assessment, credential evaluation nursing, NNAS credential evaluation, CGFNS credential evaluation, nursing qualification assessment, IEN credential evaluation, nursing credentials international",
    whoIsItFor: [
      "Internationally educated nurses starting the licensing process in any country",
      "Nurses who need to understand how their qualifications will be assessed",
      "Anyone comparing credential evaluation agencies across different countries",
    ],
    whyRequired: "Credential assessment is required because nursing education standards, curriculum content, and clinical hours vary between countries. Regulatory bodies need to verify that your qualifications meet the standards of your destination country before granting licensure. Without credential evaluation, there's no standardized way to compare nursing qualifications internationally.",
    examOverview: "Credential assessment is not an exam — it's a document-based evaluation of your nursing education, training, and qualifications. An authorized agency reviews your transcripts, curriculum content, clinical hours, and license verification against the standards of your destination country.",
    examFormat: [
      "NNAS (Canada): National Nursing Assessment Service — coordinates assessment for all Canadian provinces",
      "CGFNS (USA): Commission on Graduates of Foreign Nursing Schools — evaluates for US state boards",
      "NMC (UK): Nursing and Midwifery Council — performs its own assessment as part of registration",
      "ANMAC (Australia): Australian Nursing and Midwifery Accreditation Council — skills assessment",
      "NCNZ (New Zealand): Nursing Council of New Zealand — self-assessment as part of registration",
      "DataFlow (UAE/Saudi): Primary source verification of documents",
    ],
    howToPrepare: [
      { step: "Gather all required documents", detail: "Collect your nursing degree/diploma, transcripts, license verification, employment certificates, and identity documents. Request official copies early — processing times vary by institution." },
      { step: "Verify your documents are authentic", detail: "All documents must be official and verifiable. Some agencies require apostille or authentication. Ensure your nursing school can verify your records when contacted by the assessment agency." },
      { step: "Understand the assessment criteria", detail: "Each agency evaluates different criteria. NNAS looks at nursing theory, clinical practice, and professional practice hours. CGFNS evaluates against US nursing education standards. Research your agency's specific criteria." },
      { step: "Apply to the correct agency", detail: "Apply to the agency relevant to your destination country. Don't wait — processing times can be 3-6 months for NNAS and 2-4 months for CGFNS." },
      { step: "Prepare for potential gaps", detail: "If your credential evaluation identifies gaps, you may need additional education, bridging programs, or supervised practice. Understanding potential outcomes helps you plan ahead." },
    ],
    commonMistakes: [
      "Not applying early enough — credential evaluation is often the longest step in the licensing process",
      "Submitting unofficial or incomplete documents — this causes delays and rejections",
      "Not understanding the difference between credential evaluation and licensing",
      "Applying to the wrong agency for your destination country",
      "Not having nursing school records accessible for verification",
    ],
    studyPlanSummary: "While credential assessment doesn't require studying, thorough document preparation is essential. Start gathering documents 2-3 months before you plan to apply. Budget $300-$1,000+ for evaluation fees depending on the agency.",
    nursenestLink: "/international-nurses",
    nursenestCTA: "Explore Country-Specific Guides",
    faqs: [
      { question: "How long does credential evaluation take?", answer: "Processing times vary: NNAS (Canada) takes 3-6 months, CGFNS (USA) takes 2-4 months, NMC (UK) assessment takes 1-2 months, ANMAC (Australia) takes 8-12 weeks. Start early as these timelines can extend during peak periods." },
      { question: "What happens if my credentials don't meet standards?", answer: "If gaps are identified, you may be directed to complete additional education, a bridging program, or supervised clinical practice. This is common and not a dead end — it simply means additional steps are required before licensure." },
      { question: "Do I need credential evaluation for every country?", answer: "Yes. Each country has its own credential evaluation process and agency. You cannot use a credential evaluation from one country to apply in another — each assessment is country-specific." },
      { question: "How much does credential evaluation cost?", answer: "Costs vary: NNAS (Canada) is approximately CAD $650-$800, CGFNS (USA) is approximately USD $350-$550, NMC (UK) application fee is approximately GBP £140, ANMAC (Australia) is approximately AUD $500-$800. Additional document fees may apply." },
    ],
  },
  "how-to-transfer-nursing-license": {
    slug: "how-to-transfer-nursing-license",
    title: "How to Transfer Your Nursing License Internationally",
    subtitle: "Step-by-step guide to moving your nursing credentials to another country",
    description: "Complete guide to transferring your nursing license to another country. Learn the steps, requirements, timelines, and costs involved in international nursing license transfer.",
    seoKeywords: "transfer nursing license, international nursing license transfer, nursing license abroad, how to transfer nurse license, nursing credential transfer, move nursing license country",
    whoIsItFor: [
      "Licensed nurses planning to work in a different country",
      "Nurses relocating internationally and needing to transfer their credentials",
      "Anyone exploring the feasibility of practicing nursing in another country",
    ],
    whyRequired: "Nursing licenses are country-specific (and sometimes state/province-specific). You cannot practice nursing in another country using your home country's license. Each destination country requires you to complete their specific registration process, which typically includes credential evaluation, passing exams, and meeting language requirements.",
    examOverview: "License transfer is not a single process — it involves multiple steps including credential evaluation, exam preparation, language testing, and registration with the destination country's regulatory body. The specific steps depend on your destination country.",
    examFormat: [
      "Step 1: Research destination country requirements",
      "Step 2: Apply for credential evaluation with the appropriate agency",
      "Step 3: Meet language proficiency requirements (IELTS, OET, etc.)",
      "Step 4: Pass required licensing exams (NCLEX-RN, CBT/OSCE, Prometric, etc.)",
      "Step 5: Complete any bridging programs or supervised practice",
      "Step 6: Apply for registration with the destination regulatory body",
      "Step 7: Arrange immigration/work visa",
    ],
    howToPrepare: [
      { step: "Choose your destination", detail: "Research countries based on your goals — salary, quality of life, immigration pathways, and nursing demand. Our country comparison pages can help you decide." },
      { step: "Research specific requirements", detail: "Each country has unique requirements. Visit our country-specific guides for detailed information about the licensing process in your target country." },
      { step: "Start credential evaluation early", detail: "This is typically the longest step. Apply as soon as you've decided on your destination — don't wait until you've passed all exams." },
      { step: "Prepare for required exams", detail: "Whether it's NCLEX-RN, CBT/OSCE, or Prometric exams, use focused preparation resources. NurseNest offers comprehensive exam prep for NCLEX-RN and REx-PN." },
      { step: "Plan your timeline and budget", detail: "The full process typically takes 6-18 months and costs $3,000-$15,000 depending on the destination. Plan ahead for each step." },
    ],
    commonMistakes: [
      "Assuming your nursing license automatically transfers between countries — it doesn't",
      "Not researching destination-specific requirements before starting the process",
      "Underestimating the timeline and cost involved",
      "Waiting for one step to complete before starting the next — many steps can be done in parallel",
      "Not considering immigration requirements alongside licensing requirements",
    ],
    studyPlanSummary: "The timeline varies by destination: Canada (8-14 months), USA (6-12 months), UK (4-8 months), Australia (6-12 months), UAE/Saudi (2-6 months). Start with credential evaluation and language testing, then focus on exam preparation.",
    nursenestLink: "/international-nurses",
    nursenestCTA: "Explore Country-Specific Guides",
    faqs: [
      { question: "Can I transfer my nursing license directly?", answer: "No. Nursing licenses don't transfer directly between countries. You must complete the destination country's registration process, which includes credential evaluation, exams, and language testing. However, your existing license and experience are recognized as part of the evaluation." },
      { question: "Which country is fastest for license transfer?", answer: "UAE and Saudi Arabia generally have the fastest processing (2-6 months). The UK is also relatively quick (4-8 months). Canada (8-14 months) and USA (6-12 months) take longer due to more extensive evaluation processes." },
      { question: "Can I work while my license transfer is being processed?", answer: "This depends on the country. Some countries offer temporary or provisional permits that allow supervised practice while you complete licensing requirements. Others require full registration before you can work." },
      { question: "Do I need to take exams even with years of experience?", answer: "Yes. Most countries require licensing exams regardless of experience level. However, your experience may be considered during credential evaluation and may exempt you from some additional requirements like bridging programs." },
    ],
  },
};

function FAQItem({ question, answer, index }: { question: string; answer: string; index: number }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden" data-testid={`faq-item-${index}`}>
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-gray-50 transition-colors" data-testid={`button-faq-toggle-${index}`}>
        <span className="font-medium text-gray-900 pr-4">{question}</span>
        <ChevronDown className={`w-5 h-5 flex-shrink-0 transition-transform duration-200 ${open ? 'rotate-180 text-teal-500' : 'text-gray-400'}`} />
      </button>
      {open && <div className="px-5 pb-4 text-sm text-gray-600 leading-relaxed" data-testid={`text-faq-answer-${index}`}>{answer}</div>}
    </div>
  );
}

export default function InternationalNursingExamPage() {
  const { t } = useI18n();
  const rawPath = window.location.pathname.replace(/\/$/, '');
  const localeStripped = rawPath.replace(/^\/(en|fr|es|fil|hi|zh-tw|zh|ar|ko|pt|pa|vi|ht|ur|ja|fa|de|th|tr|id)(\/|$)/, '/');
  const slug = localeStripped.replace(/^\//, '');
  const config = EXAM_CONFIGS[slug];

  const [intlStats, setIntlStats] = useState<Record<string, InternationalExamStats>>({});

  useEffect(() => {
    fetchInternationalStats().then(setIntlStats).catch(() => {});
  }, []);

  if (!config) return null;

  const examStat = config.examCode ? intlStats[config.examCode] : null;

  const faqStructuredData = buildFaqStructuredData(config.faqs.map(f => ({ question: f.question, answer: f.answer })));

  return (
    <div data-testid={`page-exam-${config.slug}`}>
      <Navigation />
      <SEO
        title={`${config.title} | NurseNest`}
        description={config.description}
        keywords={config.seoKeywords}
        canonicalPath={`/${config.slug}`}
        structuredData={{
          "@context": "https://schema.org",
          "@type": "Article",
          "headline": config.title,
          "description": config.description,
          "author": { "@type": "Organization", "name": "NurseNest" },
          "publisher": { "@type": "Organization", "name": "NurseNest" },
        }}
        additionalStructuredData={[faqStructuredData]}
        breadcrumbs={[
          { name: "Home", url: "https://www.nursenest.ca" },
          { name: t("intlNursing.hub.badge"), url: "https://www.nursenest.ca/international-nurses" },
          { name: config.title, url: `https://www.nursenest.ca/${config.slug}` },
        ]}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <BreadcrumbNav items={[
          { name: "Home", url: "https://www.nursenest.ca/" },
          { name: t("intlNursing.hub.badge"), url: "https://www.nursenest.ca/international-nurses" },
          { name: config.title, url: `https://www.nursenest.ca/${config.slug}` },
        ]} />
      </div>

      <section className="relative py-14 sm:py-20 overflow-hidden" data-testid="section-hero">
        <div className="absolute inset-0 bg-gradient-to-br from-teal-50 via-blue-50/30 to-white" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium bg-teal-100 text-teal-700 mb-4">
              <GraduationCap className="w-4 h-4" /> International Nursing
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4" data-testid="text-h1">{config.title}</h1>
            <p className="text-lg text-gray-600 mb-6">{config.subtitle}</p>
            {examStat && examStat.total > 0 && (
              <div className="flex flex-wrap gap-3 mb-6" data-testid="section-question-stats">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-teal-200 rounded-xl text-sm font-medium text-teal-700">
                  <BookOpen className="w-4 h-4" />
                  <span data-testid="text-question-count">{examStat.total.toLocaleString()}+ Practice Questions</span>
                </div>
                {examStat.mockEligible > 0 && (
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-blue-200 rounded-xl text-sm font-medium text-blue-700">
                    <Target className="w-4 h-4" />
                    <span data-testid="text-mock-count">{examStat.mockEligible} Mock Exam Questions</span>
                  </div>
                )}
              </div>
            )}
            <div className="flex flex-wrap gap-3">
              <Link href={config.nursenestLink} className="inline-flex items-center gap-2 px-6 py-3 bg-teal-600 text-white rounded-xl font-semibold hover:bg-teal-700 transition-colors" data-testid="button-cta">
                {config.nursenestCTA} <ArrowRight className="w-4 h-4" />
              </Link>
              {config.examCode && ["NMC-CBT", "AHPRA-RN", "GULF-NURSING"].includes(config.examCode) && (
                <Link href={`/qbank-exam?exam=${config.examCode}`} className="inline-flex items-center gap-2 px-6 py-3 bg-white text-teal-700 border border-teal-300 rounded-xl font-semibold hover:bg-teal-50 transition-colors" data-testid="button-practice-questions">
                  Practice Questions <ArrowRight className="w-4 h-4" />
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="py-14" data-testid="section-who">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">{t("pages.internationalNursingExam.whoIsThisFor")}</h2>
          <div className="space-y-2">
            {config.whoIsItFor.map((item, i) => (
              <div key={i} className="flex items-start gap-3 bg-gray-50 rounded-lg p-4">
                <CheckCircle2 className="w-5 h-5 text-teal-500 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-14 bg-gray-50" data-testid="section-why">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">{t("pages.internationalNursingExam.whyIsThisRequired")}</h2>
          <p className="text-gray-700 leading-relaxed">{config.whyRequired}</p>
        </div>
      </section>

      <section className="py-14" data-testid="section-overview">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">{t("pages.internationalNursingExam.overview")}</h2>
          <p className="text-gray-700 leading-relaxed mb-6">{config.examOverview}</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {config.examFormat.map((item, i) => (
              <div key={i} className="flex items-start gap-2 p-3 bg-white rounded-lg border border-gray-100">
                <CheckCircle2 className="w-4 h-4 text-teal-400 mt-0.5 flex-shrink-0" />
                <span className="text-sm text-gray-700">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-14 bg-gray-50" data-testid="section-prepare">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">{t("pages.internationalNursingExam.howToPrepare")}</h2>
          <div className="space-y-4">
            {config.howToPrepare.map((step, i) => (
              <div key={i} className="bg-white rounded-xl border border-gray-100 p-5 flex gap-4" data-testid={`prep-step-${i}`}>
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-teal-600 text-white text-sm font-bold flex items-center justify-center">{i + 1}</div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">{step.step}</h3>
                  <p className="text-sm text-gray-600">{step.detail}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 p-4 bg-teal-50 rounded-xl border border-teal-200">
            <p className="text-sm text-teal-800"><strong>{t("pages.internationalNursingExam.studyPlan")}</strong> {config.studyPlanSummary}</p>
          </div>
        </div>
      </section>

      <section className="py-14" data-testid="section-mistakes">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3"><AlertTriangle className="w-6 h-6 text-amber-500" /> {t("pages.internationalNursingExam.commonMistakes")}</h2>
          <div className="space-y-3">
            {config.commonMistakes.map((mistake, i) => (
              <div key={i} className="flex items-start gap-3 bg-white rounded-lg p-4 border border-gray-100">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-red-100 text-red-600 flex items-center justify-center font-bold text-xs">{i + 1}</div>
                <span className="text-gray-700 text-sm">{mistake}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-14 bg-teal-600" data-testid="section-cta">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold text-white mb-4">{t("intlNursing.hub.whyNurseNest")}</h2>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href={config.nursenestLink} className="inline-flex items-center gap-2 px-6 py-3 bg-white text-teal-700 rounded-xl font-semibold hover:bg-teal-50" data-testid="button-cta-bottom">
              {t("intlNursing.country.startPrep")} <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href="/international-nurses" className="inline-flex items-center gap-2 px-6 py-3 bg-teal-700 text-white rounded-xl font-semibold hover:bg-teal-800 border border-teal-500" data-testid="button-hub">
              {t("intlNursing.hub.exploreCountries")}
            </Link>
          </div>
        </div>
      </section>

      {config.faqs.length > 0 && (
        <section className="py-14" data-testid="section-faq">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">{t("intlNursing.country.faqTitle")}</h2>
            <div className="space-y-3">
              {config.faqs.map((faq, i) => (
                <FAQItem key={i} question={faq.question} answer={faq.answer} index={i} />
              ))}
            </div>
          </div>
        </section>
      )}

      <Footer />
    </div>
  );
}

export const EXAM_SLUGS = Object.keys(EXAM_CONFIGS);
