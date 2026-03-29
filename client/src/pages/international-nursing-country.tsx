import { useState } from "react";
import { useRoute, Link } from "wouter";
import { SEO } from "@/components/seo";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { BreadcrumbNav } from "@/components/breadcrumb-nav";
import { buildFaqStructuredData } from "@/lib/structured-data";
import { useI18n } from "@/lib/i18n";
import {
  ArrowRight, BookOpen, Globe, GraduationCap, FileText, CheckCircle2,
  ChevronDown, MapPin, Stethoscope, Shield, Clock, DollarSign,
  Building2, AlertTriangle, Briefcase, Languages, Award,
} from "lucide-react";

interface CountryConfig {
  name: string;
  flag: string;
  slug: string;
  regulatoryBody: string;
  regulatoryBodyFull: string;
  requiredExams: string[];
  languageTests: string[];
  credentialAgency: string;
  registrationSteps: { step: string; detail: string }[];
  bridgingPrograms: string;
  visaImmigration: string[];
  timeline: string;
  salaryRange: string;
  workSettings: string[];
  commonBarriers: string[];
  description: string;
  seoKeywords: string;
  relatedMigrationPaths: { slug: string; label: string }[];
  faqs: { question: string; answer: string }[];
}

const COUNTRY_CONFIGS: Record<string, CountryConfig> = {
  canada: {
    name: "Canada",
    flag: "🇨🇦",
    slug: "canada",
    regulatoryBody: "Provincial/Territorial Nursing Colleges",
    regulatoryBodyFull: "National Nursing Assessment Service (NNAS) coordinates initial assessment; registration is completed through provincial/territorial regulatory bodies such as the College of Nurses of Ontario (CNO), BCCNM (British Columbia), or CARNA (Alberta).",
    requiredExams: ["NCLEX-RN (for Registered Nurses)", "REx-PN (for Practical Nurses)"],
    languageTests: ["IELTS Academic (minimum 7.0 overall, 7.0 in speaking)", "OET (minimum B grade in all sub-tests)", "CELBAN (Canadian English Language Benchmark Assessment for Nurses)"],
    credentialAgency: "National Nursing Assessment Service (NNAS) — performs the initial credential evaluation for all internationally educated nurses applying to Canadian provinces/territories.",
    registrationSteps: [
      { step: "Apply to NNAS", detail: "Submit your application to the National Nursing Assessment Service with required documents including nursing transcripts, license verification, and identity documents." },
      { step: "Credential Evaluation", detail: "NNAS evaluates your nursing education against Canadian standards. This typically takes 3-6 months. You'll receive an advisory report sent to your chosen provincial regulatory body." },
      { step: "Provincial Application", detail: "Apply to the nursing regulatory body in your intended province of practice. They review the NNAS report and determine additional requirements." },
      { step: "Language Proficiency", detail: "Complete an approved English or French language proficiency test (IELTS, OET, or CELBAN) and submit scores to the regulatory body." },
      { step: "Bridging Program (if required)", detail: "Some applicants may need to complete a bridging program to address gaps identified in the credential evaluation." },
      { step: "Licensing Exam", detail: "Register for and pass the NCLEX-RN (for RN registration) or REx-PN (for RPN/LPN registration) through Pearson VUE." },
      { step: "Registration", detail: "Once all requirements are met, apply for registration with your provincial regulatory body. You'll receive your license to practice." },
    ],
    bridgingPrograms: "Several Canadian institutions offer bridging programs for IENs, including George Brown College (Ontario), BCIT (British Columbia), Mount Royal University (Alberta), and others. These programs typically run 6-12 months and include clinical placements. Some provinces require bridging for applicants with significant gaps in their credential evaluation.",
    visaImmigration: [
      "Express Entry (Federal Skilled Worker) — nurses score well due to education, language, and work experience points",
      "Provincial Nominee Programs (PNPs) — many provinces have healthcare worker streams that fast-track nursing professionals",
      "Atlantic Immigration Program — for nurses relocating to Atlantic provinces (NB, NS, PEI, NL)",
      "Temporary Work Permits — some employers can sponsor work permits through LMIA process",
      "Post-registration, nurses are eligible for permanent residency pathways",
    ],
    timeline: "8-14 months on average (from NNAS application to registration). Credential evaluation takes 3-6 months, exam preparation 2-4 months, and provincial processing 1-3 months.",
    salaryRange: "CAD $65,000 - $95,000/year for staff nurses. Varies by province — Ontario and Alberta tend to offer higher salaries. Overtime, shift differentials, and benefits are standard in most positions.",
    workSettings: ["Hospitals (acute care)", "Long-term care facilities", "Community health centres", "Home care agencies", "Public health units", "Mental health facilities", "Remote/Northern nursing stations"],
    commonBarriers: [
      "Long NNAS processing times (3-6 months for credential evaluation)",
      "High IELTS/language test score requirements (7.0 overall)",
      "NCLEX-RN pass rate for IENs is lower than domestic graduates",
      "Provincial variation in requirements can be confusing",
      "Finding clinical placement sites for bridging programs",
      "Cost of the full licensing process ($3,000-$7,000+)",
    ],
    description: "Complete guide to becoming a licensed nurse in Canada as an internationally educated nurse. Learn about NNAS credential evaluation, NCLEX-RN preparation, provincial registration, and immigration pathways.",
    seoKeywords: "nursing in Canada, internationally educated nurse Canada, NNAS, NCLEX-RN Canada, nurse immigration Canada, nursing license Canada, IEN Canada, nurse credential evaluation Canada",
    relatedMigrationPaths: [
      { slug: "philippines-to-canada", label: "Philippines → Canada" },
      { slug: "india-to-canada", label: "India → Canada" },
      { slug: "nigeria-to-canada", label: "Nigeria → Canada" },
    ],
    faqs: [
      { question: "How long does it take to get a nursing license in Canada?", answer: "The typical timeline is 8-14 months from NNAS application to provincial registration. The NNAS credential evaluation takes 3-6 months, exam preparation 2-4 months, and provincial processing 1-3 months. Delays can occur if bridging programs are required." },
      { question: "Do I need to pass the NCLEX-RN to nurse in Canada?", answer: "Yes, internationally educated nurses seeking RN registration in Canada must pass the NCLEX-RN. Those seeking RPN/LPN registration must pass the REx-PN. Both exams are administered at Pearson VUE testing centres across Canada." },
      { question: "What IELTS score do I need for nursing in Canada?", answer: "Most provinces require IELTS Academic with a minimum score of 7.0 in each band (Listening, Reading, Writing, Speaking) and 7.0 overall. Some provinces accept OET with a minimum B grade or CELBAN as alternatives." },
      { question: "Can I work as a nurse in Canada while waiting for registration?", answer: "Some provinces offer temporary or provisional permits that allow IENs to work under supervision while completing licensing requirements. Check with your provincial regulatory body for specific options." },
    ],
  },
  "united-states": {
    name: "United States",
    flag: "🇺🇸",
    slug: "united-states",
    regulatoryBody: "State Boards of Nursing",
    regulatoryBodyFull: "Each US state has its own Board of Nursing that grants licensure. The Commission on Graduates of Foreign Nursing Schools (CGFNS) performs initial credential evaluation for most states. NCSBN administers the NCLEX-RN exam nationally.",
    requiredExams: ["NCLEX-RN (National Council Licensure Examination)"],
    languageTests: ["TOEFL iBT (minimum scores vary by state)", "IELTS Academic (accepted by some states)", "Some states waive language tests for nurses educated in English-speaking countries"],
    credentialAgency: "Commission on Graduates of Foreign Nursing Schools (CGFNS) — most states require a CGFNS certificate or VisaScreen certificate. Some states accept credential evaluation from other agencies.",
    registrationSteps: [
      { step: "Choose a State", detail: "Select the state where you plan to work. Requirements vary by state — some are more IEN-friendly than others. Popular states include California, New York, Texas, and Florida." },
      { step: "Apply to CGFNS", detail: "Apply for a CGFNS certificate (Credentials Evaluation) or VisaScreen. This involves verifying your nursing education, license, and English proficiency." },
      { step: "Credential Evaluation", detail: "CGFNS evaluates your nursing education against US standards. Processing typically takes 2-4 months." },
      { step: "Apply to State Board", detail: "Submit your application to the Board of Nursing in your chosen state along with the CGFNS evaluation." },
      { step: "Authorization to Test (ATT)", detail: "Once approved, you'll receive an Authorization to Test letter allowing you to schedule the NCLEX-RN." },
      { step: "Pass NCLEX-RN", detail: "Register with Pearson VUE and pass the NCLEX-RN. The exam is available at testing centres worldwide." },
      { step: "Obtain License", detail: "After passing the NCLEX-RN, your state board issues your nursing license. You may also need a VisaScreen certificate for immigration." },
    ],
    bridgingPrograms: "The US does not have a formal bridging program system like Canada. However, some states may require additional coursework if credential evaluation identifies deficiencies. Several universities offer NCLEX preparation programs specifically designed for IENs.",
    visaImmigration: [
      "VisaScreen Certificate — required for most healthcare worker immigration visas",
      "H-1B Visa — employer-sponsored temporary work visa (limited annual cap)",
      "EB-3 Visa — employment-based green card for skilled workers (nurses qualify)",
      "TN Visa — for Canadian and Mexican nurses under USMCA trade agreement",
      "Schedule A — nurses are pre-certified for labor shortage, expediting green card process",
    ],
    timeline: "6-12 months on average. Credential evaluation takes 2-4 months, NCLEX preparation 2-3 months, and state processing 1-3 months. Immigration processing adds 3-12 months depending on visa type.",
    salaryRange: "USD $60,000 - $120,000/year depending on state and specialty. Travel nursing contracts can pay significantly more. California, New York, and Massachusetts tend to have the highest salaries.",
    workSettings: ["Hospitals (acute care)", "Outpatient clinics", "Long-term care/skilled nursing facilities", "Home health agencies", "Physician offices", "Travel nursing assignments", "Government/VA hospitals"],
    commonBarriers: [
      "State-by-state variation in requirements",
      "CGFNS/VisaScreen processing times",
      "Immigration visa backlogs (especially EB-3)",
      "Cost of credentialing and immigration ($5,000-$15,000+)",
      "Social Security Number required for some state applications",
      "Adjusting to the US healthcare system differences",
    ],
    description: "Complete guide to becoming a licensed nurse in the United States as an internationally educated nurse. Learn about CGFNS credential evaluation, NCLEX-RN preparation, state board licensing, and immigration pathways.",
    seoKeywords: "nursing in USA, internationally educated nurse USA, CGFNS, NCLEX-RN USA, nurse immigration USA, nursing license United States, IEN USA, VisaScreen",
    relatedMigrationPaths: [
      { slug: "philippines-to-usa", label: "Philippines → USA" },
    ],
    faqs: [
      { question: "Which US state is best for international nurses?", answer: "States like New York, California, Texas, and Florida have large IEN populations and established processes. Some states process applications faster than others. Consider factors like salary, cost of living, nursing demand, and immigration-friendly policies." },
      { question: "Do I need a CGFNS certificate to work as a nurse in the US?", answer: "Most states require either a CGFNS certificate or a VisaScreen certificate. Some states (like California) accept alternative credential evaluation services. Check your target state's Board of Nursing for specific requirements." },
      { question: "Can I take the NCLEX-RN outside the United States?", answer: "Yes. The NCLEX-RN is available at Pearson VUE testing centres in many countries worldwide, including the Philippines, India, UK, Australia, and others. You need an Authorization to Test (ATT) from a US state board to register." },
      { question: "How much does it cost to become a nurse in the US as an IEN?", answer: "Total costs typically range from $5,000 to $15,000+ including CGFNS evaluation ($350+), NCLEX registration ($200), state board application ($100-400), English proficiency tests ($200-300), VisaScreen ($540+), and immigration attorney fees." },
    ],
  },
  "united-kingdom": {
    name: "United Kingdom",
    flag: "🇬🇧",
    slug: "united-kingdom",
    regulatoryBody: "Nursing and Midwifery Council (NMC)",
    regulatoryBodyFull: "The Nursing and Midwifery Council (NMC) is the sole regulatory body for nurses and midwives in England, Scotland, Wales, and Northern Ireland. All nurses must be registered with the NMC to practice in the UK.",
    requiredExams: ["NMC Computer-Based Test (CBT) — Part 1", "NMC Objective Structured Clinical Examination (OSCE) — Part 2"],
    languageTests: ["IELTS Academic (minimum 7.0 overall, 7.0 in each band)", "OET (minimum B grade in each sub-test)"],
    credentialAgency: "The NMC itself performs credential evaluation as part of the registration process. No separate credential evaluation agency is required.",
    registrationSteps: [
      { step: "Create NMC Online Account", detail: "Register on the NMC Online portal and begin your application for overseas registration." },
      { step: "Submit Documents", detail: "Upload nursing qualifications, transcripts, current registration/license, and identity documents. The NMC reviews these against UK nursing standards." },
      { step: "English Language Test", detail: "Complete IELTS Academic or OET and submit scores. Scores must meet the minimum requirements (7.0 IELTS or B grade OET in each component)." },
      { step: "Pass CBT (Part 1)", detail: "Take the Computer-Based Test at a Pearson VUE centre. This tests nursing knowledge across multiple domains." },
      { step: "Pass OSCE (Part 2)", detail: "Complete the Objective Structured Clinical Examination at an NMC-approved test centre. This practical exam assesses clinical skills through simulated scenarios." },
      { step: "Decision Letter", detail: "The NMC issues a decision letter confirming you've met all requirements. This is needed by employers for sponsorship." },
      { step: "Registration", detail: "Pay the registration fee and receive your NMC PIN. You're now eligible to practice as a nurse in the UK." },
    ],
    bridgingPrograms: "The UK does not have formal bridging programs like Canada. However, many NHS trusts offer supervised practice periods (typically 2-4 weeks) and preceptorship programs for newly registered international nurses. OSCE preparation courses are widely available from private providers.",
    visaImmigration: [
      "Health and Care Worker Visa — the primary route for international nurses, with reduced fees and faster processing",
      "Tier 2 (Skilled Worker) Visa — standard work visa route with employer sponsorship",
      "Nursing is on the UK Shortage Occupation List — benefits include lower salary thresholds and reduced visa fees",
      "NHS trusts commonly sponsor international nurses directly",
      "Indefinite Leave to Remain (ILR) available after 5 years",
    ],
    timeline: "4-8 months typically. Document review 1-2 months, CBT 1-2 months, OSCE 1-2 months, NMC processing 1-2 months. Many employers fast-track the process with dedicated support teams.",
    salaryRange: "£28,000 - £50,000/year (Band 5-7 on NHS Agenda for Change). London weighting adds £3,000-5,000. Overtime and unsociable hours payments are additional. NHS pension scheme is included.",
    workSettings: ["NHS hospitals", "NHS community services", "Private hospitals", "Care homes", "GP practices", "Mental health trusts", "Agency/bank nursing"],
    commonBarriers: [
      "OSCE exam can be challenging — practical skills assessment under time pressure",
      "IELTS 7.0 speaking requirement is a common hurdle",
      "Adjusting to NHS systems, documentation, and protocols",
      "NMC processing delays during peak periods",
      "Cost of relocation to the UK",
      "Understanding UK clinical terminology and medication names",
    ],
    description: "Complete guide to becoming a licensed nurse in the United Kingdom as an internationally educated nurse. Learn about NMC registration, CBT and OSCE exams, NHS career opportunities, and immigration pathways.",
    seoKeywords: "nursing in UK, internationally educated nurse UK, NMC registration, NMC CBT, NMC OSCE, nurse immigration UK, nursing license UK, NHS nursing, IEN UK",
    relatedMigrationPaths: [
      { slug: "india-to-uk", label: "India → UK" },
      { slug: "philippines-to-uk", label: "Philippines → UK" },
      { slug: "nepal-to-uk", label: "Nepal → UK" },
    ],
    faqs: [
      { question: "How long does NMC registration take for international nurses?", answer: "The typical timeline is 4-8 months from application to registration. This includes document review, CBT exam, OSCE exam, and NMC processing. Many NHS employers provide support that can speed up the process." },
      { question: "What is the NMC OSCE exam?", answer: "The OSCE (Objective Structured Clinical Examination) is a practical exam with simulated clinical scenarios. You demonstrate skills including patient assessment, medication administration, clinical procedures, and professional communication. It's conducted at NMC-approved test centres." },
      { question: "Do NHS employers sponsor international nurses?", answer: "Yes. Many NHS trusts actively recruit international nurses and sponsor Health and Care Worker visas. Some trusts cover recruitment costs, provide accommodation support, and offer relocation packages. Nursing is on the UK Shortage Occupation List." },
      { question: "What salary can I expect as a nurse in the UK?", answer: "NHS Band 5 (newly registered) starts at approximately £28,000-£35,000/year. Band 6 (experienced) ranges from £35,000-£43,000. London weighting adds £3,000-5,000. Private sector and agency rates may be higher." },
    ],
  },
  australia: {
    name: "Australia",
    flag: "🇦🇺",
    slug: "australia",
    regulatoryBody: "AHPRA / ANMAC",
    regulatoryBodyFull: "The Australian Health Practitioner Regulation Agency (AHPRA) manages registration. The Australian Nursing and Midwifery Accreditation Council (ANMAC) performs skills assessments for immigration and registration purposes.",
    requiredExams: ["NCLEX-RN (being piloted as of 2024-2025 for some applicants)", "No universal national exam — assessment is skills-based through ANMAC"],
    languageTests: ["IELTS Academic (minimum 7.0 in each band)", "OET (minimum B grade in each sub-test)", "PTE Academic (minimum 65 in each communicative skill)"],
    credentialAgency: "Australian Nursing and Midwifery Accreditation Council (ANMAC) — performs full skills assessment for internationally qualified nurses and midwives.",
    registrationSteps: [
      { step: "ANMAC Skills Assessment", detail: "Apply for a skills assessment through ANMAC. Submit nursing qualifications, transcripts, registration evidence, employment references, and identity documents." },
      { step: "English Language Test", detail: "Complete an approved English proficiency test (IELTS, OET, or PTE Academic) and submit scores meeting the minimum requirements." },
      { step: "ANMAC Outcome", detail: "ANMAC determines whether your qualifications meet Australian standards. Outcomes include: qualified, qualified with conditions, or not qualified. Processing takes 8-12 weeks." },
      { step: "Apply to AHPRA", detail: "If your ANMAC assessment is positive, apply for registration with AHPRA. Submit the ANMAC outcome letter and additional documents." },
      { step: "Orientation Program (if required)", detail: "Some applicants may need to complete a supervised practice or orientation program, typically 3-6 months at an approved healthcare facility." },
      { step: "Registration", detail: "AHPRA grants registration once all requirements are met. You'll be listed on the public register and can practice nursing in Australia." },
    ],
    bridgingPrograms: "Australia does not have widespread formal bridging programs. However, some universities offer transition programs for internationally qualified nurses. Supervised practice placements may be arranged through healthcare employers. ANMAC may recommend specific additional education based on assessment outcomes.",
    visaImmigration: [
      "Skilled Independent Visa (subclass 189) — nurses often qualify due to skills shortage",
      "Skilled Nominated Visa (subclass 190) — state/territory sponsored",
      "Employer-Sponsored Visa (subclass 482/494) — employer nomination",
      "Nursing is on the Medium and Long-term Strategic Skills List (MLTSSL)",
      "Permanent residency pathways available after 2-3 years on temporary visas",
    ],
    timeline: "6-12 months on average. ANMAC assessment takes 8-12 weeks, language testing 1-2 months, AHPRA processing 4-8 weeks. Immigration processing adds 3-9 months.",
    salaryRange: "AUD $70,000 - $110,000/year depending on state and specialty. Remote and rural positions often offer higher salaries and relocation allowances. Penalty rates for weekends and nights are standard.",
    workSettings: ["Public hospitals", "Private hospitals", "Aged care facilities", "Community health services", "General practices", "Remote/rural health services", "Defence Force nursing"],
    commonBarriers: [
      "ANMAC skills assessment can be lengthy (8-12 weeks)",
      "High language proficiency requirements (IELTS 7.0 in each band)",
      "Limited bridging programs compared to Canada/UK",
      "Immigration processing times can be unpredictable",
      "State/territory registration variations",
      "Adjusting to Australian healthcare terminology and protocols",
    ],
    description: "Complete guide to becoming a licensed nurse in Australia as an internationally educated nurse. Learn about ANMAC skills assessment, AHPRA registration, visa options, and nursing career opportunities.",
    seoKeywords: "nursing in Australia, internationally educated nurse Australia, ANMAC, AHPRA, nurse immigration Australia, nursing license Australia, IEN Australia, nursing visa Australia",
    relatedMigrationPaths: [
      { slug: "india-to-australia", label: "India → Australia" },
    ],
    faqs: [
      { question: "Do I need to pass an exam to nurse in Australia?", answer: "Australia has been piloting the NCLEX-RN for some applicants, but the primary pathway is through ANMAC skills assessment rather than a single national exam. Your nursing education and experience are evaluated against Australian standards." },
      { question: "What IELTS score do I need for nursing in Australia?", answer: "You need a minimum of 7.0 in each band (Listening, Reading, Writing, Speaking) on IELTS Academic. Alternatives include OET (B grade in each sub-test) or PTE Academic (65 in each communicative skill)." },
      { question: "Is nursing on Australia's skilled occupation list?", answer: "Yes. Registered Nurse is on the Medium and Long-term Strategic Skills List (MLTSSL), making nurses eligible for various skilled migration visas including the Skilled Independent Visa (subclass 189)." },
    ],
  },
  "new-zealand": {
    name: "New Zealand",
    flag: "🇳🇿",
    slug: "new-zealand",
    regulatoryBody: "Nursing Council of New Zealand (NCNZ)",
    regulatoryBodyFull: "The Nursing Council of New Zealand (NCNZ) is the regulatory authority responsible for registering nurses and ensuring competence standards are met.",
    requiredExams: ["Competence Assessment Programme (CAP) — for some applicants", "No universal licensing exam — assessment-based pathway"],
    languageTests: ["IELTS Academic (minimum 7.0 overall, 7.0 in each band)", "OET (minimum B grade in each sub-test)"],
    credentialAgency: "The Nursing Council of New Zealand (NCNZ) performs its own credential evaluation as part of the registration process.",
    registrationSteps: [
      { step: "Apply to NCNZ", detail: "Submit your application to the Nursing Council of New Zealand with required documents including nursing qualifications, registration evidence, and identity documents." },
      { step: "English Language Test", detail: "Complete IELTS Academic or OET and submit scores meeting minimum requirements." },
      { step: "NCNZ Assessment", detail: "The NCNZ evaluates your qualifications and determines whether you can proceed directly to registration or need to complete additional requirements." },
      { step: "Competence Assessment Programme (if required)", detail: "Some applicants must complete the CAP, which includes a supervised clinical placement and assessment period at an approved healthcare facility." },
      { step: "Registration", detail: "Once all requirements are met, NCNZ grants registration. You receive your Annual Practising Certificate (APC) to practice nursing." },
    ],
    bridgingPrograms: "New Zealand offers the Competence Assessment Programme (CAP) for IENs who need to demonstrate clinical competence. This programme includes supervised practice in a New Zealand healthcare setting. Some polytechnics and universities offer transition programmes for international nurses.",
    visaImmigration: [
      "Essential Skills Work Visa — for nurses with a job offer from a New Zealand employer",
      "Accredited Employer Work Visa (AEWV) — primary work visa pathway",
      "Skilled Migrant Category Resident Visa — for nurses meeting points-based criteria",
      "Nursing is on the Green List for fast-track residency",
      "Residence pathways available after 2 years on work visa",
    ],
    timeline: "4-8 months on average. NCNZ assessment takes 4-8 weeks, CAP (if required) 3-6 months. Immigration processing adds 2-6 months.",
    salaryRange: "NZD $60,000 - $90,000/year. Senior nurses and specialists can earn more. Rural and remote positions may offer additional allowances.",
    workSettings: ["District Health Boards (public hospitals)", "Private hospitals", "Aged residential care", "Primary health organisations", "Community health", "Mental health services"],
    commonBarriers: [
      "CAP programme can be competitive with limited places",
      "High language proficiency requirements",
      "Smaller job market compared to larger countries",
      "Geographic isolation — cost of relocation",
      "Adjusting to New Zealand healthcare system",
    ],
    description: "Complete guide to becoming a licensed nurse in New Zealand as an internationally educated nurse. Learn about NCNZ registration, the CAP programme, visa options, and nursing career opportunities.",
    seoKeywords: "nursing in New Zealand, internationally educated nurse NZ, NCNZ registration, nurse immigration New Zealand, nursing license NZ, IEN New Zealand",
    relatedMigrationPaths: [],
    faqs: [
      { question: "Is nursing on New Zealand's Green List?", answer: "Yes. Registered Nurse is on the Green List, which provides a fast-track pathway to residence for qualified nurses with a job offer in New Zealand." },
      { question: "What is the CAP programme in New Zealand?", answer: "The Competence Assessment Programme (CAP) is a supervised clinical placement programme that some internationally educated nurses must complete to demonstrate their competence in the New Zealand healthcare context." },
      { question: "What salary can nurses expect in New Zealand?", answer: "Registered nurses in New Zealand typically earn NZD $60,000-$90,000 per year, with senior positions and specialists earning more. Rural positions may include additional allowances." },
    ],
  },
  ireland: {
    name: "Ireland",
    flag: "🇮🇪",
    slug: "ireland",
    regulatoryBody: "Nursing and Midwifery Board of Ireland (NMBI)",
    regulatoryBodyFull: "The Nursing and Midwifery Board of Ireland (NMBI) is the regulatory body for nurses and midwives in the Republic of Ireland.",
    requiredExams: ["NMBI Aptitude Test (clinical competence assessment)", "Some applicants may be exempt based on qualifications"],
    languageTests: ["IELTS Academic (minimum 7.0 overall)", "OET (minimum B grade)"],
    credentialAgency: "The NMBI performs its own assessment of overseas nursing qualifications.",
    registrationSteps: [
      { step: "Apply to NMBI", detail: "Submit your application for registration to the Nursing and Midwifery Board of Ireland." },
      { step: "Document Submission", detail: "Provide nursing qualifications, transcripts, registration evidence, and English proficiency test scores." },
      { step: "NMBI Assessment", detail: "NMBI evaluates your qualifications against Irish nursing standards and determines if additional requirements apply." },
      { step: "Aptitude Test (if required)", detail: "Complete the NMBI Aptitude Test, which assesses clinical competence through written and practical components." },
      { step: "Adaptation Period (if required)", detail: "Some applicants complete a supervised practice period at an approved healthcare facility." },
      { step: "Registration", detail: "NMBI grants registration and adds you to the register. You can then practice nursing in Ireland." },
    ],
    bridgingPrograms: "Ireland offers adaptation periods through approved healthcare employers rather than formal university-based bridging programs. The NMBI may require supervised practice for applicants with identified gaps.",
    visaImmigration: [
      "Critical Skills Employment Permit — available for nurses with job offers",
      "General Employment Permit — alternative work permit route",
      "Stamp 4 (after 2 years on Critical Skills permit) — allows unrestricted work",
      "Nursing is on Ireland's Critical Skills Occupation List",
      "EU/EEA nurses have automatic recognition rights",
    ],
    timeline: "3-6 months on average. NMBI assessment and aptitude test processing takes 2-4 months. Immigration adds 1-3 months.",
    salaryRange: "€33,000 - €55,000/year in the public health system (HSE). Private sector salaries may be higher. Premium payments for nights, weekends, and public holidays.",
    workSettings: ["HSE public hospitals", "Private hospitals", "Nursing homes", "Community health services", "Primary care", "Agency nursing"],
    commonBarriers: [
      "Aptitude test can be challenging",
      "Cost of living in Dublin area",
      "HSE recruitment process can be slow",
      "Adjusting to Irish healthcare system",
    ],
    description: "Complete guide to becoming a licensed nurse in Ireland as an internationally educated nurse. Learn about NMBI registration, aptitude test requirements, and immigration pathways.",
    seoKeywords: "nursing in Ireland, internationally educated nurse Ireland, NMBI registration, nurse immigration Ireland, nursing license Ireland, IEN Ireland",
    relatedMigrationPaths: [],
    faqs: [
      { question: "Is nursing on Ireland's Critical Skills list?", answer: "Yes. Registered Nurse is on Ireland's Critical Skills Occupation List, which provides access to the Critical Skills Employment Permit — a fast-track work permit with a path to unrestricted work rights after 2 years." },
      { question: "Do I need to take the NMBI Aptitude Test?", answer: "Not all applicants are required to take the aptitude test. NMBI assesses each application individually and determines whether the test is needed based on your qualifications and training." },
    ],
  },
  uae: {
    name: "United Arab Emirates",
    flag: "🇦🇪",
    slug: "uae",
    regulatoryBody: "DHA / DOH / MOH",
    regulatoryBodyFull: "The UAE has multiple health authorities: Dubai Health Authority (DHA), Department of Health Abu Dhabi (DOH/HAAD), and Ministry of Health (MOH). Each has its own licensing process.",
    requiredExams: ["DHA exam (Dubai)", "DOH/HAAD exam (Abu Dhabi)", "MOH/Prometric exam (other emirates)"],
    languageTests: ["English proficiency varies by authority — some require IELTS/OET, others assess during interview"],
    credentialAgency: "DataFlow Group performs primary source verification of credentials for all UAE health authorities.",
    registrationSteps: [
      { step: "Choose Your Emirate", detail: "Determine where you plan to work — Dubai (DHA), Abu Dhabi (DOH), or other emirates (MOH). Each has different requirements and processes." },
      { step: "DataFlow Verification", detail: "Apply for primary source verification through DataFlow Group. They verify your nursing qualifications, registration, and work experience directly with issuing institutions." },
      { step: "Apply to Health Authority", detail: "Submit your application to the relevant health authority (DHA, DOH, or MOH) with DataFlow verification results." },
      { step: "Licensing Exam", detail: "Take the authority-specific licensing exam (DHA, HAAD/DOH, or MOH/Prometric). These are multiple-choice exams covering nursing knowledge." },
      { step: "License Issuance", detail: "Once you pass the exam and all documents are verified, the health authority issues your nursing license." },
    ],
    bridgingPrograms: "The UAE does not typically require bridging programs. The licensing process is primarily exam-based. Some employers offer orientation programs for newly hired international nurses.",
    visaImmigration: [
      "Employment Visa — sponsored by your employer/healthcare facility",
      "No independent visa route — nursing licenses are tied to employer sponsorship",
      "Golden Visa available for highly qualified healthcare professionals",
      "Free zone vs mainland employment affects visa type",
    ],
    timeline: "2-6 months on average. DataFlow verification takes 4-8 weeks, exam scheduling 2-4 weeks, license processing 2-4 weeks.",
    salaryRange: "AED 8,000 - 20,000/month (USD $2,200 - $5,400/month) tax-free. Accommodation, health insurance, and annual flights home often included. Salary varies by emirate, employer, and experience level.",
    workSettings: ["Government hospitals", "Private hospitals and clinics", "Healthcare free zones", "Home healthcare", "Military hospitals"],
    commonBarriers: [
      "Employer-tied visa system limits job mobility",
      "Multiple licensing authorities create confusion",
      "Cultural adjustment and work environment differences",
      "Contract terms and labor laws differ from Western countries",
      "DataFlow verification can reveal document issues",
    ],
    description: "Complete guide to becoming a licensed nurse in the UAE as an internationally educated nurse. Learn about DHA, DOH, and MOH licensing, Prometric exams, and employment opportunities in Dubai and Abu Dhabi.",
    seoKeywords: "nursing in UAE, nurse license UAE, DHA exam, HAAD exam, MOH exam, Prometric nursing, nurse Dubai, nurse Abu Dhabi, nursing salary UAE",
    relatedMigrationPaths: [],
    faqs: [
      { question: "Are nursing salaries in the UAE tax-free?", answer: "Yes. The UAE has no personal income tax, so your nursing salary is tax-free. Additionally, many employers provide accommodation, health insurance, and annual return flights as part of the employment package." },
      { question: "Which UAE health authority should I apply to?", answer: "It depends on where you want to work. DHA covers Dubai, DOH (formerly HAAD) covers Abu Dhabi, and MOH covers the remaining emirates. Each has its own exam and licensing process." },
      { question: "How hard are the DHA/HAAD/MOH exams?", answer: "The exams are multiple-choice tests covering nursing knowledge. Difficulty is comparable to other international nursing exams. DHA and DOH are generally considered slightly more rigorous than MOH. Preparation resources are available online." },
    ],
  },
  "saudi-arabia": {
    name: "Saudi Arabia",
    flag: "🇸🇦",
    slug: "saudi-arabia",
    regulatoryBody: "Saudi Commission for Health Specialties (SCFHS)",
    regulatoryBodyFull: "The Saudi Commission for Health Specialties (SCFHS) is the regulatory body for healthcare professionals in Saudi Arabia. SCFHS accredits, classifies, and registers all healthcare practitioners.",
    requiredExams: ["Prometric/SCFHS exam (nursing)", "SCFHS Classification Assessment"],
    languageTests: ["English proficiency generally assessed during recruitment", "Some positions require IELTS scores"],
    credentialAgency: "DataFlow Group performs primary source verification, similar to the UAE. SCFHS reviews qualifications for professional classification.",
    registrationSteps: [
      { step: "Secure Employment", detail: "Most international nurses secure a job offer first. Employers typically handle the licensing process. Government and private hospitals actively recruit internationally." },
      { step: "DataFlow Verification", detail: "Apply for primary source verification of your nursing qualifications, registration, and experience through DataFlow Group." },
      { step: "SCFHS Classification", detail: "Submit your credentials to SCFHS for professional classification. This determines your grade/level in the Saudi healthcare system." },
      { step: "Prometric Exam", detail: "Take the SCFHS/Prometric nursing exam. This multiple-choice exam tests nursing knowledge relevant to Saudi healthcare practice." },
      { step: "License Issuance", detail: "Once classification and exam requirements are met, SCFHS issues your professional license to practice nursing in Saudi Arabia." },
    ],
    bridgingPrograms: "Saudi Arabia does not have formal bridging programs for international nurses. Employers typically provide orientation and training programs upon arrival.",
    visaImmigration: [
      "Work Visa — employer-sponsored, arranged by your hiring facility",
      "Iqama (Residency Permit) — issued through your employer after arrival",
      "Saudi Vision 2030 healthcare expansion creating significant demand for nurses",
      "Premium Residency available for highly qualified professionals",
    ],
    timeline: "2-4 months on average. DataFlow verification takes 4-6 weeks, SCFHS processing 2-4 weeks, visa processing 2-4 weeks. Employer-managed processes can be faster.",
    salaryRange: "SAR 6,000 - 15,000/month (USD $1,600 - $4,000/month) tax-free. Accommodation, transportation, health insurance, and annual flights typically provided. Salary varies by employer and experience.",
    workSettings: ["Government hospitals (MOH)", "Military hospitals", "Private hospitals", "Saudi Aramco medical facilities", "University hospitals", "Primary healthcare centres"],
    commonBarriers: [
      "Cultural adjustment and social norms",
      "Employer-dependent visa system",
      "Gender-segregated work environments in some facilities",
      "Limited social life compared to Western countries",
      "Contract disputes can complicate exit",
      "Extreme climate in some regions",
    ],
    description: "Complete guide to becoming a licensed nurse in Saudi Arabia as an internationally educated nurse. Learn about SCFHS registration, Prometric exam, salary expectations, and employment opportunities.",
    seoKeywords: "nursing in Saudi Arabia, nurse license Saudi, SCFHS exam, Prometric nursing Saudi, nurse salary Saudi Arabia, nursing jobs Saudi, healthcare careers Saudi Arabia",
    relatedMigrationPaths: [],
    faqs: [
      { question: "Are nursing salaries in Saudi Arabia tax-free?", answer: "Yes. Saudi Arabia has no personal income tax. Most employment packages also include accommodation, health insurance, transportation, and annual return flights — making the total compensation package very attractive." },
      { question: "Is Saudi Arabia actively hiring international nurses?", answer: "Yes. Saudi Vision 2030 includes significant healthcare expansion, creating strong demand for qualified nurses. Both government and private hospitals actively recruit internationally, particularly from the Philippines, India, and other Asian countries." },
      { question: "What is the SCFHS classification?", answer: "SCFHS classifies healthcare professionals based on their qualifications and experience. Your classification determines your professional grade, which affects your salary, responsibilities, and career progression in the Saudi healthcare system." },
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

export default function InternationalNursingCountryPage() {
  const { t, language } = useI18n();
  const [, params] = useRoute("/international-nurses/:country");
  const country = params?.country || "";
  const config = COUNTRY_CONFIGS[country];

  if (!config) {
    return (
      <div data-testid="page-country-not-found">
        <Navigation />
        <div className="max-w-2xl mx-auto px-4 py-20 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">{t("pages.internationalNursingCountry.countryGuideNotFound")}</h1>
          <p className="text-gray-600 mb-4">{t("pages.internationalNursingCountry.theCountryGuideYoureLooking")}</p>
          <Link href="/international-nurses" className="inline-block px-6 py-2.5 bg-teal-600 text-white rounded-xl text-sm font-medium hover:bg-teal-700" data-testid="link-back-hub">
            {t("intlNursing.country.backToHub")}
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const countryKey = config.slug.replace(/-([a-z])/g, (_: string, l: string) => l.toUpperCase());
  const countryName = t(`intlNursing.countries.${countryKey}`) !== `intlNursing.countries.${countryKey}` ? t(`intlNursing.countries.${countryKey}`) : config.name;

  const faqStructuredData = buildFaqStructuredData(config.faqs.map(f => ({ question: f.question, answer: f.answer })));

  const howToStructuredData = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "name": t("intlNursing.country.heading", { country: countryName }),
    "description": config.description,
    "step": config.registrationSteps.map((s, i) => ({
      "@type": "HowToStep",
      "position": i + 1,
      "name": s.step,
      "text": s.detail,
    })),
  };

  return (
    <div data-testid={`page-international-nursing-${config.slug}`}>
      <Navigation />
      <SEO
        title={`${t("intlNursing.country.heading", { country: countryName })} | NurseNest`}
        description={t("intlNursing.country.metaDesc", { country: countryName })}
        keywords={config.seoKeywords}
        canonicalPath={`/international-nurses/${config.slug}`}
        structuredData={howToStructuredData}
        additionalStructuredData={[faqStructuredData]}
        breadcrumbs={[
          { name: "Home", url: "https://www.nursenest.ca" },
          { name: t("intlNursing.hub.badge"), url: "https://www.nursenest.ca/international-nurses" },
          { name: countryName, url: `https://www.nursenest.ca/international-nurses/${config.slug}` },
        ]}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <BreadcrumbNav items={[
          { name: "Home", url: "https://www.nursenest.ca/" },
          { name: t("intlNursing.hub.badge"), url: "https://www.nursenest.ca/international-nurses" },
          { name: countryName, url: `https://www.nursenest.ca/international-nurses/${config.slug}` },
        ]} />
      </div>

      <section className="relative py-14 sm:py-20 overflow-hidden" data-testid="section-hero">
        <div className="absolute inset-0 bg-gradient-to-br from-teal-50 via-blue-50/30 to-white" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium bg-teal-100 text-teal-700 mb-4">
              <span className="text-lg">{config.flag}</span> {t("intlNursing.country.heading", { country: countryName })}
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4" data-testid="text-h1">
              {t("intlNursing.country.heading", { country: countryName })}
            </h1>
            <p className="text-lg text-gray-600 mb-6" data-testid="text-description">{config.description}</p>
            <div className="flex flex-wrap gap-4">
              <Link href="/mock-exams" className="inline-flex items-center gap-2 px-6 py-3 bg-teal-600 text-white rounded-xl font-semibold hover:bg-teal-700 transition-colors shadow-lg shadow-teal-200" data-testid="button-start-prep">
                {t("intlNursing.country.startPrep")} <ArrowRight className="w-4 h-4" />
              </Link>
              <Link href="/applynest" className="inline-flex items-center gap-2 px-6 py-3 bg-white text-teal-700 rounded-xl font-semibold hover:bg-teal-50 transition-colors border border-teal-200" data-testid="button-find-jobs">
                {t("intlNursing.hub.startFree")}
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 bg-white border-y border-gray-100" data-testid="section-quick-facts">
        <div className="max-w-5xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-gray-50 rounded-xl">
              <Shield className="w-6 h-6 text-teal-500 mx-auto mb-2" />
              <div className="text-xs text-gray-500">{t("intlNursing.country.regulatoryBody")}</div>
              <div className="text-sm font-semibold text-gray-900">{config.regulatoryBody}</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-xl">
              <GraduationCap className="w-6 h-6 text-teal-500 mx-auto mb-2" />
              <div className="text-xs text-gray-500">{t("intlNursing.country.requiredExams")}</div>
              <div className="text-sm font-semibold text-gray-900">{config.requiredExams[0]}</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-xl">
              <Clock className="w-6 h-6 text-teal-500 mx-auto mb-2" />
              <div className="text-xs text-gray-500">{t("intlNursing.country.timeline")}</div>
              <div className="text-sm font-semibold text-gray-900">{config.timeline.split('.')[0]}</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-xl">
              <DollarSign className="w-6 h-6 text-teal-500 mx-auto mb-2" />
              <div className="text-xs text-gray-500">{t("intlNursing.country.salaryRange")}</div>
              <div className="text-sm font-semibold text-gray-900">{config.salaryRange.split('.')[0]}</div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-14" data-testid="section-regulatory">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3"><Shield className="w-6 h-6 text-teal-500" /> {t("intlNursing.country.regulatoryBody")}</h2>
          <p className="text-gray-700 leading-relaxed">{config.regulatoryBodyFull}</p>
        </div>
      </section>

      <section className="py-14 bg-gray-50" data-testid="section-registration-steps">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3"><FileText className="w-6 h-6 text-teal-500" /> {t("intlNursing.country.registrationSteps")}</h2>
          <div className="space-y-4">
            {config.registrationSteps.map((step, i) => (
              <div key={i} className="bg-white rounded-xl border border-gray-100 p-5 flex gap-4" data-testid={`step-${i}`}>
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-teal-600 text-white text-sm font-bold flex items-center justify-center">{i + 1}</div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">{step.step}</h3>
                  <p className="text-sm text-gray-600">{step.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-14" data-testid="section-credential">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3"><Award className="w-6 h-6 text-teal-500" /> {t("intlNursing.country.credentialAgency")}</h2>
          <p className="text-gray-700 leading-relaxed">{config.credentialAgency}</p>
        </div>
      </section>

      <section className="py-14 bg-gray-50" data-testid="section-exams">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3"><GraduationCap className="w-6 h-6 text-teal-500" /> {t("intlNursing.country.requiredExams")}</h2>
          <div className="space-y-3 mb-6">
            {config.requiredExams.map((exam, i) => (
              <div key={i} className="flex items-start gap-3 bg-white rounded-lg p-4 border border-gray-100">
                <CheckCircle2 className="w-5 h-5 text-teal-500 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700">{exam}</span>
              </div>
            ))}
          </div>
          <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2"><Languages className="w-5 h-5 text-teal-500" /> {t("intlNursing.country.languageTests")}</h3>
          <div className="space-y-2">
            {config.languageTests.map((test, i) => (
              <div key={i} className="flex items-start gap-3 bg-white rounded-lg p-3 border border-gray-100">
                <CheckCircle2 className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                <span className="text-sm text-gray-700">{test}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-14" data-testid="section-bridging">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3"><BookOpen className="w-6 h-6 text-teal-500" /> {t("intlNursing.country.bridgingPrograms")}</h2>
          <p className="text-gray-700 leading-relaxed">{config.bridgingPrograms}</p>
        </div>
      </section>

      <section className="py-14 bg-gray-50" data-testid="section-immigration">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3"><Globe className="w-6 h-6 text-teal-500" /> {t("intlNursing.country.visaImmigration")}</h2>
          <div className="space-y-3">
            {config.visaImmigration.map((pathway, i) => (
              <div key={i} className="flex items-start gap-3 bg-white rounded-lg p-4 border border-gray-100">
                <MapPin className="w-5 h-5 text-teal-500 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700">{pathway}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-14" data-testid="section-salary">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3"><DollarSign className="w-6 h-6 text-teal-500" /> {t("intlNursing.country.salaryRange")}</h2>
          <p className="text-gray-700 leading-relaxed mb-6">{config.salaryRange}</p>
          <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2"><Building2 className="w-5 h-5 text-teal-500" /> {t("intlNursing.country.workSettings")}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {config.workSettings.map((setting, i) => (
              <div key={i} className="flex items-center gap-2 p-2 text-sm text-gray-700">
                <CheckCircle2 className="w-4 h-4 text-teal-400 flex-shrink-0" />
                {setting}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-14 bg-gray-50" data-testid="section-barriers">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3"><AlertTriangle className="w-6 h-6 text-amber-500" /> {t("intlNursing.country.commonBarriers")}</h2>
          <div className="space-y-3">
            {config.commonBarriers.map((barrier, i) => (
              <div key={i} className="flex items-start gap-3 bg-white rounded-lg p-4 border border-gray-100">
                <AlertTriangle className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700">{barrier}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {config.relatedMigrationPaths.length > 0 && (
        <section className="py-14" data-testid="section-migration-paths">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">{t("intlNursing.country.relatedPaths")}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {config.relatedMigrationPaths.map(mp => (
                <Link key={mp.slug} href={`/international-nurses/${mp.slug}`} className="group" data-testid={`link-migration-${mp.slug}`}>
                  <div className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md hover:border-teal-200 transition-all text-center">
                    <h3 className="font-semibold text-gray-900 group-hover:text-teal-700">{mp.label}</h3>
                    <span className="text-sm text-teal-600">{t("intlNursing.hub.viewGuide")} →</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="py-14 bg-teal-600" data-testid="section-cta">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold text-white mb-4">{t("intlNursing.hub.whyNurseNest")}</h2>
          <p className="text-teal-100 mb-8">{t("intlNursing.country.subtitle", { country: countryName })}</p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/mock-exams" className="inline-flex items-center gap-2 px-6 py-3 bg-white text-teal-700 rounded-xl font-semibold hover:bg-teal-50" data-testid="button-cta-prep">
              {t("intlNursing.country.startPrep")} <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href="/applynest" className="inline-flex items-center gap-2 px-6 py-3 bg-teal-700 text-white rounded-xl font-semibold hover:bg-teal-800 border border-teal-500" data-testid="button-cta-jobs">
              {t("intlNursing.hub.startFree")} <Briefcase className="w-4 h-4" />
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

      <section className="py-10 bg-gray-50" data-testid="section-other-countries">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">{t("pages.internationalNursingCountry.exploreOtherCountries")}</h2>
          <div className="flex flex-wrap gap-2">
            {Object.values(COUNTRY_CONFIGS).filter(c => c.slug !== config.slug).map(c => (
              <Link key={c.slug} href={`/international-nurses/${c.slug}`}>
                <span className="inline-flex items-center gap-1 px-4 py-2 rounded-full bg-white border border-gray-200 text-sm text-gray-700 hover:border-teal-400 hover:text-teal-600 transition-colors cursor-pointer" data-testid={`link-country-${c.slug}`}>
                  {c.flag} {c.name}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

export const INTERNATIONAL_COUNTRY_SLUGS = Object.keys(COUNTRY_CONFIGS);
