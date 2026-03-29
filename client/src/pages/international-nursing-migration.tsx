import { useState } from "react";
import { Link } from "wouter";
import { SEO } from "@/components/seo";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { BreadcrumbNav } from "@/components/breadcrumb-nav";
import { buildFaqStructuredData } from "@/lib/structured-data";
import { useI18n } from "@/lib/i18n";
import {
  ArrowRight, CheckCircle2, ChevronDown, Clock, FileText, Globe,
  GraduationCap, MapPin, AlertTriangle, DollarSign, Briefcase, Shield,
} from "lucide-react";

interface MigrationConfig {
  slug: string;
  fromCountry: string;
  fromFlag: string;
  toCountry: string;
  toFlag: string;
  title: string;
  description: string;
  seoKeywords: string;
  estimatedTimeline: string;
  estimatedCost: string;
  steps: { step: string; detail: string; timeline: string }[];
  credentialEvaluation: string;
  examRequirements: string[];
  languageTesting: string;
  registrationSteps: string;
  requiredDocuments: string[];
  commonMistakes: string[];
  faqs: { question: string; answer: string }[];
}

const MIGRATION_CONFIGS: Record<string, MigrationConfig> = {
  "philippines-to-canada": {
    slug: "philippines-to-canada",
    fromCountry: "Philippines",
    fromFlag: "🇵🇭",
    toCountry: "Canada",
    toFlag: "🇨🇦",
    title: "Philippines to Canada Nursing Migration Guide",
    description: "Step-by-step guide for Filipino nurses migrating to Canada. Learn about NNAS credential evaluation, NCLEX-RN preparation, provincial registration, and immigration pathways for Philippine-educated nurses.",
    seoKeywords: "Filipino nurse Canada, Philippines to Canada nursing, NNAS Philippines, NCLEX-RN Filipino nurse, nurse immigration Canada Philippines, IEN Philippines Canada",
    estimatedTimeline: "10-16 months",
    estimatedCost: "CAD $5,000 - $10,000",
    steps: [
      { step: "Gather Documents from PRC and Nursing School", detail: "Obtain your PRC nursing license verification, transcript of records from your nursing school, diploma/degree, board exam (NLE) results, and employment certificates. Request these early as Philippine institutions can take 2-4 weeks to process.", timeline: "2-4 weeks" },
      { step: "Apply to NNAS", detail: "Submit your application to the National Nursing Assessment Service. Include all educational documents, PRC license verification, identity documents, and English proficiency test scores. NNAS will verify credentials directly with Philippine institutions.", timeline: "3-6 months" },
      { step: "Complete English Proficiency Test", detail: "Take IELTS Academic (7.0+ in each band) or CELBAN. Most Filipino nurses find Reading and Writing the most challenging bands. Start preparation early — many candidates need 2-3 attempts to reach the required scores.", timeline: "1-3 months" },
      { step: "Receive NNAS Advisory Report", detail: "NNAS sends the advisory report to your chosen provincial regulatory body. The report details how your Philippine nursing education compares to Canadian standards and identifies any gaps.", timeline: "Included in NNAS processing" },
      { step: "Apply to Provincial Regulatory Body", detail: "Apply to the nursing college in your intended province (e.g., CNO for Ontario, BCCNM for BC). They review the NNAS report and determine if you need a bridging program.", timeline: "1-3 months" },
      { step: "Complete Bridging Program (if required)", detail: "Some applicants need to complete a bridging program to address gaps. Programs like George Brown College (Ontario) or BCIT (BC) offer IEN bridging programs with clinical placements.", timeline: "6-12 months" },
      { step: "Register for and Pass NCLEX-RN", detail: "Register with Pearson VUE for the NCLEX-RN. The exam is available at Pearson VUE centres in Manila (Philippines) or in Canada. Use NurseNest for comprehensive NCLEX preparation.", timeline: "2-4 months prep" },
      { step: "Apply for Immigration", detail: "Once registered, apply for immigration through Express Entry, Provincial Nominee Programs, or employer-sponsored work permits. Nurses score well in Express Entry due to education and language points.", timeline: "3-12 months" },
    ],
    credentialEvaluation: "NNAS evaluates your Philippine nursing education (typically a 4-year BSN) against Canadian standards. Philippine BSN programs are generally well-regarded, but some applicants may have gaps in specific clinical areas. The PRC (Professional Regulation Commission) license and NLE results are verified directly.",
    examRequirements: ["NCLEX-RN (available at Pearson VUE centres in Manila and across Canada)", "English Proficiency: IELTS Academic (7.0+ each band) or CELBAN"],
    languageTesting: "Most Filipino nurses have strong English skills but may need preparation for the IELTS Academic format. The Writing band (7.0 required) is typically the most challenging. Consider OET as an alternative — it's healthcare-specific and many nurses find it more relevant. CELBAN is also accepted in most Canadian provinces.",
    registrationSteps: "After passing the NCLEX-RN and completing all provincial requirements, apply for registration with your provincial nursing college. Processing typically takes 2-4 weeks. You'll receive your license and can begin practicing.",
    requiredDocuments: [
      "PRC Nursing License (authenticated/apostilled)",
      "Transcript of Records from nursing school",
      "BSN Diploma or Certificate of Completion",
      "NLE (Nursing Licensure Exam) results",
      "Employment certificates from all nursing positions",
      "Passport (valid for at least 6 months)",
      "IELTS/CELBAN/OET score reports",
      "Police clearance (NBI clearance from Philippines)",
      "Passport-size photos",
      "Professional references (2-3 from nursing supervisors)",
    ],
    commonMistakes: [
      "Not requesting documents from Philippine institutions early enough — PRC and schools can take weeks to process",
      "Underestimating IELTS preparation time — many Filipino nurses need 2-3 attempts for the 7.0 Writing band",
      "Applying to the wrong province without researching specific requirements and job markets",
      "Not budgeting for the full process — costs add up quickly between NNAS, exams, bridging programs, and immigration",
      "Waiting until NNAS is complete before starting NCLEX preparation — start studying during the evaluation period",
      "Not considering provincial nominee programs — many provinces have healthcare worker streams that fast-track immigration",
    ],
    faqs: [
      { question: "How long does it take for a Filipino nurse to get licensed in Canada?", answer: "The typical timeline is 10-16 months from initial application to practicing. NNAS processing takes 3-6 months, NCLEX preparation 2-4 months, and provincial processing 1-3 months. If a bridging program is required, add 6-12 months." },
      { question: "Is the Philippine BSN recognized in Canada?", answer: "The Philippine BSN (4-year program) is generally well-regarded by NNAS. However, individual assessment outcomes vary. Some applicants may have gaps identified, particularly in specific clinical areas, which may require bridging or additional education." },
      { question: "Can I take the NCLEX-RN in the Philippines?", answer: "Yes. Pearson VUE has testing centres in Manila where you can take the NCLEX-RN. You'll need an Authorization to Test (ATT) from a Canadian provincial regulatory body before you can register for the exam." },
      { question: "Which Canadian province is best for Filipino nurses?", answer: "Ontario has the largest Filipino nursing community and well-established support systems. Alberta and British Columbia also have significant demand. Consider factors like salary, cost of living, Filipino community size, and provincial nominee program availability." },
    ],
  },
  "india-to-canada": {
    slug: "india-to-canada",
    fromCountry: "India",
    fromFlag: "🇮🇳",
    toCountry: "Canada",
    toFlag: "🇨🇦",
    title: "India to Canada Nursing Migration Guide",
    description: "Step-by-step guide for Indian nurses migrating to Canada. Learn about NNAS credential evaluation, NCLEX-RN preparation, bridging programs, and immigration pathways for Indian-educated nurses.",
    seoKeywords: "Indian nurse Canada, India to Canada nursing, NNAS India, NCLEX-RN Indian nurse, nurse immigration Canada India, IEN India Canada, GNM Canada, BSc Nursing Canada",
    estimatedTimeline: "12-18 months",
    estimatedCost: "CAD $5,000 - $12,000",
    steps: [
      { step: "Gather Documents from Indian Nursing Council and University", detail: "Obtain your State Nursing Council registration, university transcripts, degree certificate (BSc Nursing or GNM), and employment certificates. Documents from Indian institutions may need to be sent directly to NNAS.", timeline: "3-6 weeks" },
      { step: "Apply to NNAS", detail: "Submit your NNAS application with all documents. NNAS will verify your qualifications directly with your Indian nursing school and regulatory body.", timeline: "3-6 months" },
      { step: "Complete English Proficiency Test", detail: "Take IELTS Academic (7.0+ in each band). Indian nurses typically find the Speaking and Writing bands most challenging. OET and CELBAN are alternatives.", timeline: "2-4 months" },
      { step: "Receive NNAS Advisory Report", detail: "The advisory report is sent to your chosen provincial regulatory body. Indian BSc Nursing graduates generally fare better than GNM graduates in the assessment.", timeline: "Included in NNAS" },
      { step: "Apply to Provincial Regulatory Body", detail: "Submit your application to the nursing college in your intended province. They determine additional requirements based on the NNAS report.", timeline: "1-3 months" },
      { step: "Complete Bridging Program (if required)", detail: "Many Indian-educated nurses need bridging programs, especially those with GNM qualifications. Programs range from 6-12 months with clinical placements.", timeline: "6-12 months" },
      { step: "Register for and Pass NCLEX-RN", detail: "Register for the NCLEX-RN through Pearson VUE. The exam is available at centres in India (Hyderabad, Bangalore, Mumbai). Use NurseNest for comprehensive preparation.", timeline: "2-4 months prep" },
      { step: "Apply for Immigration", detail: "Apply through Express Entry, Provincial Nominee Programs, or employer-sponsored routes. Indian nurses with Canadian registration are competitive candidates for Express Entry.", timeline: "4-12 months" },
    ],
    credentialEvaluation: "NNAS evaluates both BSc Nursing (4-year) and GNM (3.5-year) qualifications. BSc Nursing graduates typically receive more favorable assessments. GNM graduates may face additional requirements or bridging program mandates. The Indian Nursing Council registration and state council registration are verified.",
    examRequirements: ["NCLEX-RN (available at Pearson VUE centres in Hyderabad, Bangalore, and Mumbai)", "English Proficiency: IELTS Academic (7.0+ each band), OET (B grade), or CELBAN"],
    languageTesting: "English proficiency requirements can be challenging for Indian nurses, particularly the IELTS Speaking and Writing bands at the 7.0 level. Consider focused preparation courses. OET is often a better fit as it's healthcare-specific. Some provinces also accept CELBAN.",
    registrationSteps: "After meeting all requirements, apply for registration with your provincial nursing college. You'll need to provide evidence of exam completion, language scores, and any bridging program certificates.",
    requiredDocuments: [
      "State Nursing Council Registration Certificate",
      "Indian Nursing Council Registration",
      "University Degree Certificate (BSc Nursing or GNM Diploma)",
      "Mark sheets / Transcripts for all years",
      "Employment certificates from all positions",
      "Passport (valid for at least 6 months)",
      "IELTS/OET/CELBAN score reports",
      "Police clearance certificate",
      "Professional references (2-3)",
      "Passport-size photographs",
    ],
    commonMistakes: [
      "Not understanding the difference between BSc Nursing and GNM assessment outcomes — GNM holders should prepare for potential additional requirements",
      "Sending documents from unrecognized or non-accredited Indian nursing schools",
      "Underestimating IELTS preparation — the 7.0 score in all bands requires dedicated study",
      "Not exploring Ontario's or Alberta's specific IEN programs which have streamlined pathways",
      "Failing to get proper apostille/authentication on Indian documents",
      "Not starting NCLEX preparation during the NNAS waiting period",
    ],
    faqs: [
      { question: "Is GNM recognized in Canada?", answer: "GNM (General Nursing and Midwifery) qualifications are evaluated by NNAS but may result in identified gaps compared to the Canadian nursing standard. Many GNM graduates need to complete bridging programs. BSc Nursing qualifications generally have a smoother assessment process." },
      { question: "Can I take the NCLEX-RN in India?", answer: "Yes. Pearson VUE has testing centres in Hyderabad, Bangalore, and Mumbai where Indian nurses can take the NCLEX-RN after receiving their Authorization to Test." },
      { question: "Which province is most welcoming for Indian nurses?", answer: "Ontario has the largest Indian healthcare worker community. Alberta, British Columbia, and Manitoba also have strong demand for nurses and active provincial nominee programs that include healthcare worker streams." },
    ],
  },
  "philippines-to-usa": {
    slug: "philippines-to-usa",
    fromCountry: "Philippines",
    fromFlag: "🇵🇭",
    toCountry: "United States",
    toFlag: "🇺🇸",
    title: "Philippines to USA Nursing Migration Guide",
    description: "Complete guide for Filipino nurses seeking licensure in the United States. Learn about CGFNS evaluation, NCLEX-RN preparation, VisaScreen requirements, and immigration pathways.",
    seoKeywords: "Filipino nurse USA, Philippines to USA nursing, CGFNS Philippines, NCLEX-RN Filipino, nurse immigration USA Philippines, VisaScreen Filipino nurse",
    estimatedTimeline: "8-24 months",
    estimatedCost: "USD $5,000 - $15,000",
    steps: [
      { step: "Gather Documents", detail: "Collect PRC license, NLE results, transcript of records, diploma, employment certificates. Request official copies early.", timeline: "2-4 weeks" },
      { step: "Apply to CGFNS", detail: "Apply for a CGFNS certificate or Credentials Evaluation Service (CES). CGFNS verifies your Philippine nursing education and license.", timeline: "2-4 months" },
      { step: "Choose a State", detail: "Select which US state to apply for licensure. States like New York, California, Texas, and Florida are popular choices for Filipino nurses. Requirements vary by state.", timeline: "1-2 weeks research" },
      { step: "Apply to State Board of Nursing", detail: "Submit your application to the Board of Nursing in your chosen state with CGFNS evaluation results.", timeline: "1-3 months" },
      { step: "Obtain ATT and Pass NCLEX-RN", detail: "Receive your Authorization to Test and register for the NCLEX-RN through Pearson VUE. Available at Manila testing centres.", timeline: "2-4 months prep" },
      { step: "Obtain VisaScreen Certificate", detail: "Apply for a VisaScreen certificate through CGFNS — required for most healthcare worker immigration visas. Includes English proficiency verification.", timeline: "1-2 months" },
      { step: "Secure Employment & Immigration", detail: "Find a US employer willing to sponsor your visa. Apply for an EB-3 immigrant visa or H-1B work visa. Nurses qualify for Schedule A pre-certification.", timeline: "3-18 months" },
    ],
    credentialEvaluation: "CGFNS evaluates Philippine BSN programs against US nursing education standards. Philippine nursing programs are well-known to CGFNS due to the large volume of Filipino nurse applicants. The process involves direct verification with PRC and your nursing school.",
    examRequirements: ["NCLEX-RN (available at Pearson VUE Manila)", "TOEFL iBT or IELTS (varies by state — some states waive for Filipino nurses educated in English)", "CGFNS Qualifying Exam (some states require this in addition to NCLEX-RN)"],
    languageTesting: "Many US states waive the English proficiency requirement for Filipino nurses since nursing education in the Philippines is conducted in English. However, VisaScreen requires English proficiency verification. Check your target state's specific requirements.",
    registrationSteps: "After passing NCLEX-RN, your state board issues your nursing license. You'll also need the VisaScreen certificate for immigration purposes. The total time from NCLEX pass to starting work depends on immigration processing.",
    requiredDocuments: [
      "PRC Nursing License (authenticated)",
      "NLE results",
      "Transcript of Records",
      "BSN Diploma",
      "Employment certificates",
      "Passport",
      "English proficiency scores (if required by state)",
      "NBI Clearance",
      "Professional references",
    ],
    commonMistakes: [
      "Not researching state-specific requirements before applying — each state has different rules",
      "Underestimating the immigration timeline — EB-3 visa backlogs can extend the process significantly",
      "Not applying for VisaScreen early — it's needed for immigration and takes time to process",
      "Choosing a state solely based on salary without considering cost of living",
      "Not understanding the difference between H-1B and EB-3 visa pathways",
    ],
    faqs: [
      { question: "How long does it take for a Filipino nurse to work in the US?", answer: "The total timeline is 8-24 months. Credential evaluation and NCLEX typically take 6-8 months. Immigration processing adds 3-18 months depending on visa type and backlogs." },
      { question: "Which US state is best for Filipino nurses?", answer: "California, New York, Texas, and Florida have the largest Filipino nursing communities. Consider factors like salary (highest in CA, NY), cost of living, state licensing requirements, and community support." },
      { question: "Do Filipino nurses need TOEFL for US licensure?", answer: "Many states waive English proficiency tests for nurses educated in English-medium programs. However, VisaScreen still requires English verification. Check your specific state's requirements." },
    ],
  },
  "india-to-uk": {
    slug: "india-to-uk",
    fromCountry: "India",
    fromFlag: "🇮🇳",
    toCountry: "United Kingdom",
    toFlag: "🇬🇧",
    title: "India to UK Nursing Migration Guide",
    description: "Complete guide for Indian nurses seeking NMC registration in the United Kingdom. Learn about the CBT, OSCE exams, NHS recruitment, and Health and Care Worker visa.",
    seoKeywords: "Indian nurse UK, India to UK nursing, NMC registration India, CBT OSCE Indian nurse, NHS recruitment India, nurse immigration UK India",
    estimatedTimeline: "4-10 months",
    estimatedCost: "GBP £2,000 - £5,000",
    steps: [
      { step: "Create NMC Online Account", detail: "Register on the NMC portal and start your overseas registration application.", timeline: "1 day" },
      { step: "Gather and Submit Documents", detail: "Collect your Indian Nursing Council registration, state council registration, degree certificates, transcripts, and work experience letters.", timeline: "2-4 weeks" },
      { step: "Complete IELTS or OET", detail: "Take IELTS Academic (7.0 overall, 7.0 each band) or OET (B grade each sub-test). Many Indian nurses find OET more manageable.", timeline: "1-3 months" },
      { step: "Pass the CBT (Part 1)", detail: "Take the NMC Computer-Based Test at a Pearson VUE centre (available in India). Tests nursing knowledge across key domains.", timeline: "1-2 months prep" },
      { step: "Pass the OSCE (Part 2)", detail: "Complete the Objective Structured Clinical Examination at an NMC-approved centre. Practical exam assessing clinical skills. Most candidates travel to the UK for this.", timeline: "1-2 months" },
      { step: "Receive NMC Decision Letter", detail: "NMC confirms you meet all registration requirements and issues a decision letter.", timeline: "2-4 weeks" },
      { step: "Secure NHS Employment and Visa", detail: "Many NHS trusts actively recruit Indian nurses and sponsor Health and Care Worker visas. Recruitment often happens through agencies.", timeline: "1-3 months" },
    ],
    credentialEvaluation: "NMC evaluates both BSc Nursing and GNM qualifications from India. BSc Nursing graduates typically have a smoother process. NMC reviews the curriculum content, clinical hours, and competencies covered in your Indian nursing program.",
    examRequirements: ["NMC CBT (Computer-Based Test) — Part 1", "NMC OSCE (Objective Structured Clinical Examination) — Part 2", "IELTS Academic (7.0 each band) or OET (B grade each sub-test)"],
    languageTesting: "Indian nurses educated in English-medium programs still need to provide IELTS or OET scores. OET is often preferred as it's healthcare-specific. Many Indian nurses find the IELTS Speaking band at 7.0 challenging and benefit from focused preparation.",
    registrationSteps: "After passing both CBT and OSCE with acceptable language scores, NMC processes your registration. You receive your NMC PIN, allowing you to practice nursing in the UK.",
    requiredDocuments: [
      "Indian Nursing Council Registration",
      "State Nursing Council Registration",
      "BSc Nursing Degree or GNM Diploma",
      "University Transcripts / Mark Sheets",
      "Employment/Experience Certificates",
      "Passport",
      "IELTS or OET Scores",
      "Police Clearance Certificate",
      "Professional References",
    ],
    commonMistakes: [
      "Not preparing adequately for the OSCE — this practical exam requires hands-on practice",
      "Underestimating the IELTS 7.0 Speaking requirement",
      "Not researching NHS trusts that actively recruit from India",
      "Waiting to arrive in the UK before preparing for the OSCE",
      "Not joining OSCE preparation groups and practice sessions",
    ],
    faqs: [
      { question: "Do NHS trusts recruit directly from India?", answer: "Yes. Many NHS trusts run regular recruitment drives in India, often through recruitment agencies. They typically cover visa costs and may offer relocation support including temporary accommodation." },
      { question: "Is GNM recognized by the NMC?", answer: "GNM qualifications are reviewed by NMC, but BSc Nursing graduates generally have a smoother pathway. The NMC evaluates each application individually based on the specific curriculum and clinical hours completed." },
      { question: "Where can I take the OSCE?", answer: "The NMC OSCE is conducted at approved test centres, primarily in the UK. Some test centres are available internationally. Most Indian nurses take the OSCE after arriving in the UK, often with employer support." },
    ],
  },
  "philippines-to-uk": {
    slug: "philippines-to-uk",
    fromCountry: "Philippines",
    fromFlag: "🇵🇭",
    toCountry: "United Kingdom",
    toFlag: "🇬🇧",
    title: "Philippines to UK Nursing Migration Guide",
    description: "Step-by-step guide for Filipino nurses seeking NMC registration in the United Kingdom. Covers CBT, OSCE preparation, NHS recruitment, and visa pathways.",
    seoKeywords: "Filipino nurse UK, Philippines to UK nursing, NMC registration Philippines, CBT OSCE Filipino, NHS Filipino nurse, nurse immigration UK Philippines",
    estimatedTimeline: "4-8 months",
    estimatedCost: "GBP £2,000 - £4,000",
    steps: [
      { step: "Register on NMC Portal", detail: "Create your NMC online account and begin the overseas nursing registration process.", timeline: "1 day" },
      { step: "Prepare Documents", detail: "Gather PRC license, nursing school transcripts, diploma, employment certificates. PRC verification may need to be sent directly to NMC.", timeline: "2-4 weeks" },
      { step: "Complete IELTS or OET", detail: "Filipino nurses generally score well due to English-medium education. OET is popular as it's healthcare-specific. Target 7.0 IELTS or B grade OET.", timeline: "1-2 months" },
      { step: "Pass CBT", detail: "Take the Computer-Based Test at a Pearson VUE centre in Manila. Tests nursing theory and knowledge.", timeline: "1-2 months prep" },
      { step: "Pass OSCE", detail: "Complete the practical examination. Many Filipino nurses prepare through OSCE boot camps available in the Philippines and UK.", timeline: "1-2 months" },
      { step: "NMC Registration", detail: "Receive your NMC PIN and decision letter.", timeline: "2-4 weeks" },
      { step: "NHS Employment and Visa", detail: "NHS trusts actively recruit Filipino nurses. Health and Care Worker visa processing is fast-tracked for nurses.", timeline: "1-3 months" },
    ],
    credentialEvaluation: "NMC reviews Philippine BSN qualifications favorably. The 4-year BSN curriculum aligns well with NMC standards. PRC license verification is completed directly with the Professional Regulation Commission.",
    examRequirements: ["NMC CBT (Part 1)", "NMC OSCE (Part 2)", "IELTS Academic (7.0) or OET (B grade)"],
    languageTesting: "Filipino nurses educated in English typically perform well on IELTS/OET. Many achieve the required scores on the first attempt, especially if they take a preparatory course focused on the test format.",
    registrationSteps: "The NMC process for Filipino nurses is well-established with dedicated support from many NHS recruitment agencies. After passing CBT and OSCE, registration processing is typically straightforward.",
    requiredDocuments: [
      "PRC Nursing License",
      "BSN Transcript of Records",
      "BSN Diploma",
      "NLE Results",
      "Employment Certificates",
      "Passport",
      "IELTS/OET Scores",
      "NBI Clearance",
      "Professional References",
    ],
    commonMistakes: [
      "Not joining OSCE preparation programs — many are available in Manila",
      "Accepting recruitment agency offers without verifying their NMC-approved status",
      "Not negotiating relocation packages with NHS employers",
      "Skipping OSCE practice scenarios",
    ],
    faqs: [
      { question: "Is the Philippines-to-UK pathway popular?", answer: "Yes, it's one of the most established nursing migration pathways. The UK's NHS has been recruiting Filipino nurses for decades, and there are well-established support systems and Filipino nursing communities across the UK." },
      { question: "Do NHS trusts provide accommodation?", answer: "Many NHS trusts offer temporary accommodation (4-12 weeks) for newly arrived international nurses, along with relocation allowances and airport pickup services." },
    ],
  },
  "india-to-australia": {
    slug: "india-to-australia",
    fromCountry: "India",
    fromFlag: "🇮🇳",
    toCountry: "Australia",
    toFlag: "🇦🇺",
    title: "India to Australia Nursing Migration Guide",
    description: "Complete guide for Indian nurses seeking AHPRA registration in Australia. Covers ANMAC skills assessment, language requirements, visa pathways, and nursing career opportunities.",
    seoKeywords: "Indian nurse Australia, India to Australia nursing, ANMAC India, AHPRA Indian nurse, nurse immigration Australia India, nursing visa Australia India",
    estimatedTimeline: "8-14 months",
    estimatedCost: "AUD $5,000 - $10,000",
    steps: [
      { step: "ANMAC Skills Assessment", detail: "Apply to ANMAC for a skills assessment. Submit your Indian nursing qualifications (BSc Nursing preferred), transcripts, registration evidence, and work experience.", timeline: "8-12 weeks" },
      { step: "English Proficiency Test", detail: "Complete IELTS Academic (7.0 each band), OET (B grade), or PTE Academic (65 each skill). Indian nurses should prepare specifically for the speaking and writing components.", timeline: "2-4 months" },
      { step: "ANMAC Outcome Assessment", detail: "Receive your ANMAC assessment outcome — qualified, qualified with conditions, or not qualified. BSc Nursing graduates generally receive positive outcomes.", timeline: "Included in assessment" },
      { step: "Apply to AHPRA", detail: "Submit your AHPRA registration application with the positive ANMAC outcome and all supporting documents.", timeline: "4-8 weeks" },
      { step: "Supervised Practice (if required)", detail: "Some applicants complete an orientation or supervised practice programme at an approved healthcare facility.", timeline: "3-6 months if required" },
      { step: "Obtain Registration", detail: "AHPRA grants registration. You're listed on the public register and can practice nursing in Australia.", timeline: "2-4 weeks" },
      { step: "Immigration Application", detail: "Apply for a skilled migration visa (subclass 189, 190, or 482). Nursing is on the MLTSSL, providing strong visa prospects.", timeline: "3-9 months" },
    ],
    credentialEvaluation: "ANMAC evaluates Indian BSc Nursing (4-year) and GNM (3.5-year) qualifications. BSc Nursing graduates are more likely to receive a 'qualified' assessment. GNM holders may face additional requirements or a 'not qualified' outcome.",
    examRequirements: ["ANMAC Skills Assessment (not an exam — document-based assessment)", "IELTS Academic (7.0 each band) or OET (B grade) or PTE Academic (65)"],
    languageTesting: "The language requirements are strict — 7.0 in each IELTS band with no exceptions. Indian nurses often find the Writing and Speaking bands most challenging. PTE Academic is increasingly popular as an alternative.",
    registrationSteps: "AHPRA registration is the final step after ANMAC assessment. Processing is relatively efficient once all requirements are met.",
    requiredDocuments: [
      "Indian Nursing Council Registration",
      "State Nursing Council Registration",
      "BSc Nursing Degree Certificate",
      "University Transcripts",
      "Employment Certificates",
      "Passport",
      "IELTS/OET/PTE Scores",
      "Police Clearance",
      "Professional References",
    ],
    commonMistakes: [
      "Not understanding that GNM may not meet ANMAC standards",
      "Underestimating the IELTS 7.0 in each band requirement",
      "Not exploring state-nominated visa pathways which can be faster",
      "Ignoring PTE Academic as a potentially easier alternative to IELTS",
    ],
    faqs: [
      { question: "Is BSc Nursing from India recognized in Australia?", answer: "BSc Nursing (4-year) from recognized Indian universities generally receives a positive ANMAC assessment. GNM qualifications may not meet Australian standards, and holders may need additional education." },
      { question: "Can I get permanent residency as a nurse in Australia?", answer: "Yes. Registered Nurse is on the MLTSSL, making nurses eligible for permanent residency through the Skilled Independent (189) or Skilled Nominated (190) visa pathways." },
    ],
  },
  "nigeria-to-canada": {
    slug: "nigeria-to-canada",
    fromCountry: "Nigeria",
    fromFlag: "🇳🇬",
    toCountry: "Canada",
    toFlag: "🇨🇦",
    title: "Nigeria to Canada Nursing Migration Guide",
    description: "Step-by-step guide for Nigerian nurses migrating to Canada. Covers NNAS credential evaluation, NCLEX-RN preparation, and immigration pathways for Nigerian-educated nurses.",
    seoKeywords: "Nigerian nurse Canada, Nigeria to Canada nursing, NNAS Nigeria, NCLEX-RN Nigerian nurse, nurse immigration Canada Nigeria, IEN Nigeria",
    estimatedTimeline: "12-20 months",
    estimatedCost: "CAD $6,000 - $12,000",
    steps: [
      { step: "Gather Documents from Nigerian Institutions", detail: "Obtain your Nursing and Midwifery Council of Nigeria (NMCN) registration, university transcripts, degree certificate, and employment letters. Nigerian institutions may require in-person visits for document processing.", timeline: "3-6 weeks" },
      { step: "Apply to NNAS", detail: "Submit your NNAS application. NNAS verifies Nigerian nursing credentials directly with issuing institutions. Processing for Nigerian documents may take longer due to verification processes.", timeline: "4-8 months" },
      { step: "Complete IELTS or OET", detail: "Take IELTS Academic or OET. While Nigerian nurses study in English, the IELTS 7.0 requirement across all bands requires dedicated preparation.", timeline: "2-4 months" },
      { step: "Provincial Application", detail: "Apply to your chosen provincial regulatory body after receiving the NNAS advisory report.", timeline: "1-3 months" },
      { step: "Bridging Program (if required)", detail: "Many Nigerian nursing graduates are directed to bridging programs due to differences in curriculum and clinical practice standards.", timeline: "6-12 months" },
      { step: "Pass NCLEX-RN", detail: "Register for and pass the NCLEX-RN through Pearson VUE. Centres are available in select Nigerian cities and across Canada.", timeline: "2-4 months prep" },
      { step: "Immigration Application", detail: "Apply through Express Entry or Provincial Nominee Programs. Manitoba and Saskatchewan have active healthcare worker immigration programs.", timeline: "4-12 months" },
    ],
    credentialEvaluation: "NNAS evaluates Nigerian nursing education (typically BNSc or BSN) against Canadian standards. Verification with Nigerian institutions can take longer due to processing times. Some Nigerian programs may have identified gaps requiring bridging.",
    examRequirements: ["NCLEX-RN", "IELTS Academic (7.0 each band) or OET (B grade) or CELBAN"],
    languageTesting: "While Nigerian nursing education is in English, the IELTS Academic format requires specific preparation. The Writing band at 7.0 is the most common challenge. Consider OET as a healthcare-specific alternative.",
    registrationSteps: "Provincial registration follows standard Canadian processes once NCLEX-RN and all other requirements are met.",
    requiredDocuments: [
      "NMCN Registration Certificate",
      "University Degree Certificate (BNSc/BSN)",
      "University Transcripts",
      "Employment/Experience Letters",
      "International Passport",
      "IELTS/OET Scores",
      "Police Clearance",
      "Professional References",
    ],
    commonMistakes: [
      "Not planning for extended NNAS processing times for Nigerian documents",
      "Underestimating the IELTS preparation needed despite English-language education",
      "Not exploring provinces like Manitoba and Saskatchewan that have specific IEN-friendly programs",
      "Not requesting documents early from Nigerian institutions",
    ],
    faqs: [
      { question: "How long does NNAS processing take for Nigerian nurses?", answer: "NNAS processing for Nigerian-educated nurses typically takes 4-8 months, which may be longer than some other countries due to document verification processes with Nigerian institutions." },
      { question: "Is Nigerian BNSc recognized in Canada?", answer: "Nigerian BNSc qualifications are evaluated by NNAS against Canadian standards. Outcomes vary by institution and program. Some applicants may need bridging programs to address identified gaps." },
    ],
  },
  "nepal-to-uk": {
    slug: "nepal-to-uk",
    fromCountry: "Nepal",
    fromFlag: "🇳🇵",
    toCountry: "United Kingdom",
    toFlag: "🇬🇧",
    title: "Nepal to UK Nursing Migration Guide",
    description: "Complete guide for Nepali nurses seeking NMC registration in the United Kingdom. Covers CBT, OSCE preparation, NHS recruitment, and Health and Care Worker visa.",
    seoKeywords: "Nepali nurse UK, Nepal to UK nursing, NMC registration Nepal, CBT OSCE Nepali nurse, NHS Nepali nurse, nurse immigration UK Nepal",
    estimatedTimeline: "5-10 months",
    estimatedCost: "GBP £2,500 - £5,000",
    steps: [
      { step: "Register on NMC Portal", detail: "Create your NMC online account and begin the overseas registration application.", timeline: "1 day" },
      { step: "Gather Documents", detail: "Obtain Nepal Nursing Council (NNC) registration, university transcripts, degree certificate (BN/BScN or PCL Nursing), and employment certificates.", timeline: "2-4 weeks" },
      { step: "Complete IELTS or OET", detail: "Achieve IELTS Academic 7.0 in each band or OET B grade. Nepali nurses typically need focused preparation for IELTS, especially in Writing and Speaking.", timeline: "2-4 months" },
      { step: "Pass CBT (Part 1)", detail: "Take the NMC Computer-Based Test. Testing centres are available in Nepal through Pearson VUE.", timeline: "1-2 months prep" },
      { step: "Pass OSCE (Part 2)", detail: "Complete the Objective Structured Clinical Examination. Most Nepali nurses travel to the UK for this exam.", timeline: "1-2 months" },
      { step: "NMC Registration", detail: "Receive NMC PIN and decision letter after passing both exams.", timeline: "2-4 weeks" },
      { step: "Employment and Visa", detail: "NHS trusts recruit Nepali nurses through established pathways. Health and Care Worker visa is the standard route.", timeline: "1-3 months" },
    ],
    credentialEvaluation: "NMC reviews Nepali nursing qualifications including BN/BScN (4-year) and PCL Nursing programs. BN/BScN graduates generally have smoother pathways. NMC evaluates each application based on curriculum content and clinical hours.",
    examRequirements: ["NMC CBT (Part 1)", "NMC OSCE (Part 2)", "IELTS Academic (7.0) or OET (B grade)"],
    languageTesting: "English proficiency is a significant hurdle for many Nepali nurses. Dedicated IELTS/OET preparation is essential. Many successful candidates spend 3-6 months preparing for the language test.",
    registrationSteps: "NMC registration follows the standard overseas process. After CBT and OSCE completion, the NMC processes registration within 2-4 weeks.",
    requiredDocuments: [
      "Nepal Nursing Council Registration",
      "University Degree Certificate (BN/BScN)",
      "University Transcripts",
      "Employment Certificates",
      "Passport",
      "IELTS/OET Scores",
      "Police Clearance from Nepal Police",
      "Professional References",
    ],
    commonMistakes: [
      "Not investing enough time in English language preparation",
      "Not joining OSCE preparation groups available through recruitment agencies",
      "Underestimating the practical skills assessment in the OSCE",
      "Not researching NHS trusts that specifically recruit from Nepal",
    ],
    faqs: [
      { question: "Is PCL Nursing recognized by the NMC?", answer: "PCL Nursing qualifications may be reviewed by NMC, but BN/BScN (4-year bachelor's) graduates generally have a smoother registration pathway. Each application is assessed individually." },
      { question: "Do NHS trusts recruit from Nepal?", answer: "Yes. Several NHS trusts and recruitment agencies actively recruit from Nepal. The UK-Nepal nursing migration pathway is well-established with growing numbers of Nepali nurses in the NHS." },
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

const DESTINATION_COUNTRY_SLUGS: Record<string, string> = {
  "Canada": "canada",
  "United States": "united-states",
  "United Kingdom": "united-kingdom",
  "Australia": "australia",
  "New Zealand": "new-zealand",
  "Ireland": "ireland",
  "UAE": "uae",
  "Saudi Arabia": "saudi-arabia",
};

export default function InternationalNursingMigrationPage() {
  const { t } = useI18n();
  const rawPath = window.location.pathname.replace(/\/$/, '');
  const localeStripped = rawPath.replace(/^\/(en|fr|es|fil|hi|zh-tw|zh|ar|ko|pt|pa|vi|ht|ur|ja|fa|de|th|tr|id)(\/|$)/, '/');
  const pathSegments = localeStripped.replace(/^\//, '').split('/');
  const slug = pathSegments.length > 1 ? pathSegments[pathSegments.length - 1] : pathSegments[0];
  const config = MIGRATION_CONFIGS[slug];

  if (!config) return null;

  const faqStructuredData = buildFaqStructuredData(config.faqs.map(f => ({ question: f.question, answer: f.answer })));
  const migrationTitle = t("intlNursing.migration.heading", { from: config.fromCountry, to: config.toCountry });
  const howToStructuredData = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "name": migrationTitle,
    "description": t("intlNursing.migration.metaDesc", { from: config.fromCountry, to: config.toCountry }),
    "totalTime": `P${parseInt(config.estimatedTimeline)}M`,
    "estimatedCost": { "@type": "MonetaryAmount", "currency": "USD", "value": config.estimatedCost },
    "step": config.steps.map((s, i) => ({ "@type": "HowToStep", "position": i + 1, "name": s.step, "text": s.detail })),
  };

  return (
    <div data-testid={`page-migration-${config.slug}`}>
      <Navigation />
      <SEO
        title={`${migrationTitle} | NurseNest`}
        description={t("intlNursing.migration.metaDesc", { from: config.fromCountry, to: config.toCountry })}
        keywords={config.seoKeywords}
        canonicalPath={`/international-nurses/${config.slug}`}
        structuredData={howToStructuredData}
        additionalStructuredData={[faqStructuredData]}
        breadcrumbs={[
          { name: "Home", url: "https://www.nursenest.ca" },
          { name: t("intlNursing.hub.badge"), url: "https://www.nursenest.ca/international-nurses" },
          { name: `${config.fromCountry} → ${config.toCountry}`, url: `https://www.nursenest.ca/international-nurses/${config.slug}` },
        ]}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <BreadcrumbNav items={[
          { name: "Home", url: "https://www.nursenest.ca/" },
          { name: t("intlNursing.hub.badge"), url: "https://www.nursenest.ca/international-nurses" },
          { name: `${config.fromCountry} → ${config.toCountry}`, url: `https://www.nursenest.ca/international-nurses/${config.slug}` },
        ]} />
      </div>

      <section className="relative py-14 sm:py-20 overflow-hidden" data-testid="section-hero">
        <div className="absolute inset-0 bg-gradient-to-br from-teal-50 via-blue-50/30 to-white" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium bg-teal-100 text-teal-700 mb-4">
              {config.fromFlag} → {config.toFlag} {t("intlNursing.hub.sectionMigration")}
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4" data-testid="text-h1">{migrationTitle}</h1>
            <p className="text-lg text-gray-600 mb-4">{config.description}</p>
            <div className="flex flex-wrap gap-4 text-sm text-gray-500 mb-6">
              <span className="flex items-center gap-1"><Clock className="w-4 h-4 text-teal-500" /> {config.estimatedTimeline}</span>
              <span className="flex items-center gap-1"><DollarSign className="w-4 h-4 text-teal-500" /> {config.estimatedCost}</span>
            </div>
            <div className="flex flex-wrap gap-4">
              <Link href="/mock-exams" className="inline-flex items-center gap-2 px-6 py-3 bg-teal-600 text-white rounded-xl font-semibold hover:bg-teal-700 transition-colors" data-testid="button-start-prep">
                {t("intlNursing.country.startPrep")} <ArrowRight className="w-4 h-4" />
              </Link>
              <Link href="/applynest" className="inline-flex items-center gap-2 px-6 py-3 bg-white text-teal-700 rounded-xl font-semibold hover:bg-teal-50 transition-colors border border-teal-200" data-testid="button-find-jobs">
                Find Jobs in {config.toCountry} <Briefcase className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-14" data-testid="section-steps">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">{t("intlNursing.migration.stepsTitle")}</h2>
          <div className="space-y-4">
            {config.steps.map((step, i) => (
              <div key={i} className="bg-white rounded-xl border border-gray-100 p-5 flex gap-4" data-testid={`step-${i}`}>
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-teal-600 text-white text-sm font-bold flex items-center justify-center">{i + 1}</div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-semibold text-gray-900">{step.step}</h3>
                    <span className="text-xs text-teal-600 bg-teal-50 px-2 py-1 rounded-full">{step.timeline}</span>
                  </div>
                  <p className="text-sm text-gray-600">{step.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-14 bg-gray-50" data-testid="section-credential">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3"><Shield className="w-6 h-6 text-teal-500" /> {t("pages.internationalNursingMigration.credentialEvaluation")}</h2>
          <p className="text-gray-700 leading-relaxed">{config.credentialEvaluation}</p>
        </div>
      </section>

      <section className="py-14" data-testid="section-exams">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3"><GraduationCap className="w-6 h-6 text-teal-500" /> {t("pages.internationalNursingMigration.examRequirements")}</h2>
          <div className="space-y-3 mb-6">
            {config.examRequirements.map((exam, i) => (
              <div key={i} className="flex items-start gap-3 bg-white rounded-lg p-4 border border-gray-100">
                <CheckCircle2 className="w-5 h-5 text-teal-500 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700">{exam}</span>
              </div>
            ))}
          </div>
          <h3 className="font-semibold text-gray-900 mb-3">{t("pages.internationalNursingMigration.languageTestingNotes")}</h3>
          <p className="text-gray-600 text-sm">{config.languageTesting}</p>
        </div>
      </section>

      <section className="py-14 bg-gray-50" data-testid="section-documents">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3"><FileText className="w-6 h-6 text-teal-500" /> {t("pages.internationalNursingMigration.requiredDocuments")}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {config.requiredDocuments.map((doc, i) => (
              <div key={i} className="flex items-center gap-2 p-3 bg-white rounded-lg border border-gray-100">
                <CheckCircle2 className="w-4 h-4 text-teal-400 flex-shrink-0" />
                <span className="text-sm text-gray-700">{doc}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-14" data-testid="section-mistakes">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3"><AlertTriangle className="w-6 h-6 text-amber-500" /> {t("pages.internationalNursingMigration.commonMistakesToAvoid")}</h2>
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

      {DESTINATION_COUNTRY_SLUGS[config.toCountry] && (
        <section className="py-14 bg-gray-50" data-testid="section-destination-country">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-xl font-bold text-gray-900 mb-3">Learn More About Nursing in {config.toCountry}</h2>
            <p className="text-gray-600 mb-6">Read our comprehensive licensing guide for {config.toCountry} covering registration, exams, visa pathways, and salary expectations.</p>
            <Link href={`/international-nurses/${DESTINATION_COUNTRY_SLUGS[config.toCountry]}`} className="inline-flex items-center gap-2 px-6 py-3 bg-teal-600 text-white rounded-xl font-semibold hover:bg-teal-700 transition-colors" data-testid="link-destination-country">
              {config.toFlag} Nursing in {config.toCountry} Guide <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>
      )}

      <section className="py-14 bg-teal-600" data-testid="section-cta">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold text-white mb-4">{t("intlNursing.migration.heading", { from: config.fromCountry, to: config.toCountry })}</h2>
          <p className="text-teal-100 mb-8">{t("intlNursing.migration.metaDesc", { from: config.fromCountry, to: config.toCountry })}</p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/mock-exams" className="inline-flex items-center gap-2 px-6 py-3 bg-white text-teal-700 rounded-xl font-semibold hover:bg-teal-50" data-testid="button-cta-prep">
              {t("intlNursing.country.startPrep")} <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href="/applynest" className="inline-flex items-center gap-2 px-6 py-3 bg-teal-700 text-white rounded-xl font-semibold hover:bg-teal-800 border border-teal-500" data-testid="button-cta-jobs">
              Find Nursing Jobs <Briefcase className="w-4 h-4" />
            </Link>
            <Link href="/international-nurses" className="inline-flex items-center gap-2 px-6 py-3 bg-teal-700 text-white rounded-xl font-semibold hover:bg-teal-800 border border-teal-500" data-testid="button-cta-hub">
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

export const MIGRATION_SLUGS = Object.keys(MIGRATION_CONFIGS);
