import { useState } from "react";
import { Link } from "wouter";
import { SEO } from "@/components/seo";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { BreadcrumbNav } from "@/components/breadcrumb-nav";
import { buildFaqStructuredData } from "@/lib/structured-data";
import { useI18n } from "@/lib/i18n";
import {
  ArrowRight, CheckCircle2, ChevronDown, Clock, BookOpen,
  GraduationCap, Globe, Shield, DollarSign, FileText,
  MapPin, AlertTriangle, Languages, Scale, Briefcase,
} from "lucide-react";

interface ClusterSection {
  heading: string;
  content: string;
  bullets?: string[];
}

interface ClusterConfig {
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  seoKeywords: string;
  icon: typeof Globe;
  sections: ClusterSection[];
  tips?: string[];
  faqs: { question: string; answer: string }[];
  relatedLinks: { href: string; label: string }[];
}

const CLUSTER_CONFIGS: Record<string, ClusterConfig> = {
  "international-nurses/nursing-english-requirements": {
    slug: "international-nurses/nursing-english-requirements",
    title: "Nursing English Language Requirements by Country",
    subtitle: "Every English proficiency requirement for international nurse registration worldwide",
    description: "Complete guide to English language requirements for nursing registration. Compare IELTS, OET, CELBAN, PTE, and TOEFL requirements across Canada, USA, UK, Australia, New Zealand, Ireland, and more.",
    seoKeywords: "nursing English requirements, English proficiency nursing, IELTS nursing requirements, OET nursing requirements, English test nursing registration, language requirements international nurses",
    icon: Languages,
    sections: [
      { heading: "Why English Proficiency Is Required", content: "English proficiency is a mandatory requirement for nursing registration in English-speaking countries. Patient safety depends on clear communication — nurses must be able to understand physician orders, document accurately, educate patients, and communicate effectively with the healthcare team. Regulatory bodies set minimum language standards to protect the public and ensure safe, competent nursing practice." },
      { heading: "Accepted English Tests", content: "Different countries accept different English proficiency tests. The most commonly accepted tests for nursing registration are:", bullets: ["IELTS Academic — the most widely accepted test, required by Canada, UK, Australia, New Zealand, and Ireland", "OET (Occupational English Test) — healthcare-specific test accepted in UK, Australia, New Zealand, Ireland, and many Canadian provinces", "CELBAN (Canadian English Language Benchmark Assessment for Nurses) — Canada-specific test designed for nursing professionals", "PTE Academic — accepted by Australia (AHPRA) and some other countries", "TOEFL iBT — accepted by some US state boards of nursing", "Each test assesses Listening, Reading, Writing, and Speaking skills"] },
      { heading: "Canada — English Requirements", content: "Canadian nursing regulatory bodies accept three English proficiency tests:", bullets: ["IELTS Academic: minimum 7.0 in each band (Listening, Reading, Writing, Speaking)", "OET: minimum Grade B in each sub-test (accepted by most provinces)", "CELBAN: Listening 10, Reading 8, Writing 7, Speaking 8 (Canada-only test)", "Scores must be from a single test sitting (no combining scores from multiple attempts)", "Scores are valid for 2 years from the test date", "Quebec requires French proficiency for nursing practice in French-speaking settings", "Some provinces may accept slightly lower scores with additional conditions"] },
      { heading: "United Kingdom — English Requirements", content: "The Nursing and Midwifery Council (NMC) accepts:", bullets: ["IELTS Academic: minimum 7.0 in each band (achieved in a single sitting or combined from two tests taken within 6 months)", "OET: minimum Grade B in each sub-test (single sitting or two tests within 6 months)", "The NMC uniquely allows combining scores from two test sittings within 6 months", "Exemptions for nurses who trained in a majority English-speaking country with English-medium instruction", "Scores must be within 2 years of NMC application", "No CELBAN, PTE, or TOEFL accepted"] },
      { heading: "Australia — English Requirements", content: "AHPRA (Australian Health Practitioner Regulation Agency) accepts:", bullets: ["IELTS Academic: minimum 7.0 in each band (single sitting or combined from two tests within 6 months)", "OET: minimum Grade B in each sub-test (single sitting or two tests within 6 months)", "PTE Academic: minimum 65 in each communicative skill (single sitting or two tests within 6 months)", "TOEFL iBT: minimum scores of Listening 24, Reading 24, Writing 27, Speaking 23 (single sitting or two tests within 6 months)", "Australia allows combining scores from two sittings within 6 months for all accepted tests", "Some pathways accept slightly lower scores with additional English courses"] },
      { heading: "New Zealand — English Requirements", content: "The Nursing Council of New Zealand (NCNZ) accepts:", bullets: ["IELTS Academic: minimum 7.0 in each band", "OET: minimum Grade B in each sub-test", "Scores must be achieved in a single test sitting", "Scores valid for 2 years", "Exemptions may apply for nurses from English-speaking countries"] },
      { heading: "United States — English Requirements", content: "US English requirements vary by state:", bullets: ["Requirements are set by individual state boards of nursing", "Common accepted tests: TOEFL iBT, IELTS Academic", "Some states accept OET", "Minimum scores vary by state — check your specific state board", "CGFNS VisaScreen requires English proficiency verification", "Some states waive English testing for nurses from English-speaking countries", "No universal minimum score — ranges from IELTS 6.5 to 7.0 depending on state"] },
      { heading: "Tips for Meeting English Requirements", content: "Strategies to help you achieve the required scores:", bullets: ["Start language preparation early — ideally 6-12 months before your planned test date", "Take a diagnostic test first to identify your weakest areas", "Consider OET if you struggle with IELTS — healthcare-specific content may feel more natural", "Practice with official test materials and past papers", "Focus on your weakest band — most candidates struggle with Writing", "Join English conversation groups or find a language exchange partner", "Read healthcare journals and articles in English regularly", "Watch medical dramas and healthcare documentaries in English for listening practice", "Consider a test preparation course specifically for healthcare professionals"] },
    ],
    tips: [
      "Check if your destination country allows combining scores from two test sittings — this can be easier than achieving all bands in one attempt",
      "Book your test 2-3 months before you need the results — popular test dates fill up quickly",
      "If you're choosing between IELTS and OET, try sample questions from both before deciding",
      "Many nurses pass OET faster because the healthcare context is familiar",
    ],
    faqs: [
      { question: "Which English test is easiest for nurses?", answer: "Many nurses find OET more manageable because it uses healthcare-specific content. The writing task involves writing a clinical letter (familiar to nurses), and the speaking test involves patient communication scenarios. However, 'easiest' depends on your individual strengths." },
      { question: "Can I combine scores from multiple test attempts?", answer: "Some countries allow it: the UK (NMC) and Australia (AHPRA) allow combining scores from two test sittings within 6 months. Canada and New Zealand generally require all bands to be achieved in a single sitting." },
      { question: "How long are English test scores valid?", answer: "Most nursing regulatory bodies accept scores that are within 2 years of your application date. Plan your test timing accordingly to avoid scores expiring before you complete the registration process." },
      { question: "Are there exemptions from English testing?", answer: "Some regulatory bodies exempt nurses who trained and qualified in majority English-speaking countries with English-medium instruction. Examples include nurses from the Philippines, India (English-medium programs), Nigeria, and Caribbean English-speaking countries. Check your specific regulatory body for exemption criteria." },
    ],
    relatedLinks: [
      { href: "/ielts-for-nurses", label: "IELTS for Nurses Guide" },
      { href: "/oet-for-nurses", label: "OET for Nurses Guide" },
      { href: "/international-nurses/ielts-vs-oet", label: "IELTS vs OET Comparison" },
      { href: "/international-nurses", label: "International Nursing Hub" },
    ],
  },
  "international-nurses/ielts-vs-oet": {
    slug: "international-nurses/ielts-vs-oet",
    title: "IELTS vs OET for Nurses: Which Should You Choose?",
    subtitle: "Detailed comparison to help you pick the right English proficiency test",
    description: "IELTS vs OET comparison for nurses. Compare test formats, scoring, acceptance, difficulty, and preparation strategies to choose the best English proficiency test for your nursing registration.",
    seoKeywords: "IELTS vs OET, IELTS or OET nursing, compare IELTS OET, best English test nursing, IELTS vs OET difficulty, OET vs IELTS nurses, which test nurses",
    icon: Scale,
    sections: [
      { heading: "Overview: Two Different Approaches", content: "IELTS Academic and OET are both accepted for nursing registration in many countries, but they take fundamentally different approaches. IELTS is a general academic English test, while OET is designed specifically for healthcare professionals. Understanding their differences helps you choose the test that best suits your strengths." },
      { heading: "Test Format Comparison", content: "Both tests assess Listening, Reading, Writing, and Speaking, but the content and format differ significantly:", bullets: ["IELTS Listening: 30 min, general topics (conversations, lectures) vs OET Listening: 40 min, healthcare consultations and presentations", "IELTS Reading: 60 min, academic passages on any topic vs OET Reading: 60 min, healthcare-related texts and articles", "IELTS Writing: 60 min, graph description + academic essay vs OET Writing: 45 min, write a referral/discharge letter from clinical notes", "IELTS Speaking: 11-14 min, general interview topics vs OET Speaking: 20 min, 2 clinical role-play scenarios with a patient/carer", "IELTS uses a 1-9 band score system vs OET uses letter grades (A-E)"] },
      { heading: "Scoring and Required Grades", content: "The scoring systems are different but equivalent standards apply:", bullets: ["IELTS: Band 1.0-9.0 (0.5 increments). Most nursing bodies require 7.0 in each band.", "OET: Grades A (highest) to E (lowest). Most nursing bodies require Grade B in each sub-test.", "Grade B in OET is broadly equivalent to IELTS 7.0", "IELTS provides a more granular score (0.5 increments) vs OET's broader letter grades", "Some nurses find it frustrating to score 6.5 repeatedly on IELTS — OET's pass/fail-style grading can feel less ambiguous"] },
      { heading: "Where Each Test Is Accepted", content: "Both tests are widely accepted but not universally interchangeable:", bullets: ["Both accepted: UK (NMC), Australia (AHPRA), New Zealand (NCNZ), Ireland (NMBI), most Canadian provinces", "IELTS only: Some US state boards, some Canadian immigration programs (Express Entry)", "OET only: Not accepted for immigration purposes in most countries (only for professional registration)", "Important: IELTS counts for both professional registration AND immigration points. OET typically only counts for professional registration.", "If you plan to use Express Entry (Canada), you may need IELTS even if you've passed OET for nursing registration"] },
      { heading: "Which Is Better for Nurses?", content: "The answer depends on your individual strengths:", bullets: ["Choose OET if: Writing is your weakest skill (clinical letter vs academic essay), you prefer healthcare-specific content, you're comfortable with clinical communication scenarios", "Choose IELTS if: You need scores for immigration purposes too (Express Entry, skilled migration), you want a test accepted by more institutions worldwide, you're comfortable with academic writing", "Choose OET if: You struggle with IELTS despite strong clinical English — many nurses score higher on OET", "Choose IELTS if: OET is not available in your location or your regulatory body doesn't accept OET", "Many nurses who score IELTS 6.5 in Writing achieve OET Grade B — the clinical context helps"] },
      { heading: "Preparation Strategies", content: "Preparation approaches differ between the two tests:", bullets: ["IELTS preparation: Focus on academic vocabulary, essay structure (introduction-body-conclusion), graph description skills, and general discussion topics for speaking", "OET preparation: Focus on clinical letter writing (organize information from case notes), role-play communication (empathy, explanation, reassurance), and healthcare-specific reading comprehension", "Both tests: Practice under timed conditions, identify your weakest area and focus there, use official practice materials", "OET advantage: If you're already working in healthcare, your daily English use is closer to OET content", "IELTS advantage: More preparation materials and courses are available worldwide"] },
      { heading: "Cost and Availability", content: "Practical considerations for test selection:", bullets: ["IELTS: Approximately USD $240-$260 per attempt. Available at 1,600+ test centres in 140+ countries. Computer-delivered and paper-based options.", "OET: Approximately USD $390-$590 per attempt (higher cost). Available at 150+ test centres in 40+ countries. Also available online.", "OET is more expensive and available in fewer locations", "Both offer online testing options, though availability varies by location", "Consider the total cost including potential retakes — if you're more likely to pass one test, the overall cost may be lower"] },
    ],
    faqs: [
      { question: "Is OET easier than IELTS for nurses?", answer: "Many nurses find OET more accessible because the content is healthcare-specific. The writing task (clinical letter) and speaking test (patient role-play) feel more natural for healthcare professionals. However, achieving Grade B still requires strong English skills. Statistically, some nurses who score IELTS 6.5 in Writing achieve OET Grade B." },
      { question: "Can I take both IELTS and OET?", answer: "Yes. Many nurses take both tests to maximize their chances. You might take IELTS first for immigration purposes and OET for professional registration, or try OET if you're struggling to achieve IELTS 7.0 in Writing." },
      { question: "Does OET count for immigration points?", answer: "In most countries, OET does not count for immigration points (Express Entry, skilled migration). IELTS is typically required for immigration purposes. Check your specific immigration program's requirements." },
      { question: "How long should I prepare for each test?", answer: "Preparation time depends on your current English level. Generally: IELTS 6-12 weeks of focused preparation, OET 4-8 weeks if you have strong clinical English. If switching from IELTS to OET, you may need only 2-4 weeks to adjust to the healthcare-specific format." },
    ],
    relatedLinks: [
      { href: "/ielts-for-nurses", label: "IELTS for Nurses Guide" },
      { href: "/oet-for-nurses", label: "OET for Nurses Guide" },
      { href: "/international-nurses/nursing-english-requirements", label: "English Requirements by Country" },
      { href: "/international-nurses", label: "International Nursing Hub" },
    ],
  },
  "international-nurses/bridging-programs": {
    slug: "international-nurses/bridging-programs",
    title: "Nursing Bridging Programs for International Nurses",
    subtitle: "Everything you need to know about bridging programs, who needs them, and how to choose",
    description: "Complete guide to nursing bridging programs for internationally educated nurses. Learn what bridging programs involve, which countries require them, how long they take, costs, and how to choose the right program.",
    seoKeywords: "nursing bridging program, IEN bridging program, nursing bridge course, internationally educated nurse bridging, nursing transition program, nursing gap program, bridging program international nurses",
    icon: BookOpen,
    sections: [
      { heading: "What Is a Nursing Bridging Program?", content: "A nursing bridging program is an educational program designed to help internationally educated nurses (IENs) meet the nursing standards of their destination country. These programs fill the gaps between your existing nursing education and the requirements of the country where you want to practice. They typically combine classroom instruction with supervised clinical placements in local healthcare settings, giving you hands-on experience in the destination country's healthcare system." },
      { heading: "Who Needs a Bridging Program?", content: "Not all internationally educated nurses need a bridging program. The requirement depends on the outcome of your credential evaluation:", bullets: ["Nurses whose credential evaluation identifies educational gaps in theory or clinical hours", "Nurses with diploma-level qualifications (e.g., GNM) rather than bachelor's degrees", "Nurses who have been out of practice for extended periods (typically 5+ years)", "Nurses from countries with significantly different nursing curricula than the destination country", "Nurses directed to bridging by their regulatory body after NNAS, ANMAC, or similar assessment", "Some nurses with bachelor's degrees from well-recognized programs may be exempt from bridging"] },
      { heading: "Bridging Programs by Country", content: "Different countries have different approaches to bridging:", bullets: ["Canada: Well-established programs at colleges like George Brown (ON), BCIT (BC), Mount Royal (AB), Mohawk College (ON). Duration: 6-12 months. Include clinical placements and often exam preparation. Cost: CAD $5,000-$15,000.", "United Kingdom: No formal bridging programs. NHS trusts offer supervised practice periods (3-6 months) and preceptorship. OSCE preparation courses available privately.", "Australia: Limited formal programs. Some universities offer transition courses. ANMAC may recommend specific education modules.", "New Zealand: Competence Assessment Programme (CAP) serves as a bridge for some IENs. Typically 4-12 weeks of supervised clinical practice.", "Ireland: Adaptation periods arranged through healthcare employers, similar to the UK model.", "United States: Some states require additional coursework. Community colleges and universities offer nursing transition programs."] },
      { heading: "What Bridging Programs Cover", content: "Bridging programs are tailored to address specific gaps, but commonly include:", bullets: ["Clinical practice standards and protocols specific to the destination country", "Pharmacology and medication management (local drug names, dosing, and administration)", "Clinical skills assessment and competency demonstration", "Healthcare system orientation (how the system works, documentation requirements)", "Cultural competence and professional communication in the local context", "Supervised clinical placements in hospitals, long-term care, or community settings", "Exam preparation (NCLEX-RN, REx-PN, CBT/OSCE) integrated into the curriculum", "Patient safety and quality improvement frameworks"] },
      { heading: "How to Choose a Bridging Program", content: "Key factors to consider when selecting a program:", bullets: ["Accreditation — ensure the program is recognized by your regulatory body", "Clinical placement quality — look for programs with established hospital partnerships and adequate placement hours", "Exam pass rates — ask about licensing exam pass rates for program graduates", "Duration and schedule — programs range from 4-12 months; some offer part-time or evening options", "Cost and financial aid — tuition ranges from $5,000-$15,000; some programs offer scholarships or employer-sponsored options", "Support services — look for programs with IEN-specific support (language, cultural transition, settlement services)", "Employment connections — many programs have partnerships with healthcare employers for post-graduation hiring", "Location — consider living costs and proximity to potential employers"] },
      { heading: "Financial Considerations", content: "Bridging programs represent a significant investment. Here's what to budget:", bullets: ["Tuition: $5,000-$15,000 depending on program length and country", "Living expenses during the program period", "Clinical placement costs (uniforms, equipment, liability insurance, health clearances)", "Transportation to clinical sites", "Some employers offer tuition reimbursement or sponsorship for bridging programs", "Government funding may be available in some provinces/countries (e.g., Ontario Bridge Training Program)", "Some programs offer scholarships specifically for IENs", "Return on investment: bridging graduates have significantly higher exam pass rates and employment rates"] },
    ],
    tips: [
      "Start researching bridging programs while waiting for your credential evaluation — don't wait for the outcome",
      "Contact program alumni to learn about their experience and post-graduation outcomes",
      "Ask about employment connections — many programs have partnerships with healthcare employers",
      "If cost is a barrier, explore employer-sponsored bridging options or government funding",
      "Begin exam preparation alongside your bridging program for maximum efficiency",
    ],
    faqs: [
      { question: "Are bridging programs mandatory?", answer: "Not always. Bridging programs are required only if your credential evaluation identifies gaps. Many nurses with bachelor's degrees from well-recognized programs may proceed directly to licensing exams. The requirement is determined by your regulatory body based on your credential evaluation outcome." },
      { question: "How long do bridging programs take?", answer: "Most bridging programs run 6-12 months for full-time students, with some shorter programs available (4-6 months) for nurses with minor gaps. Part-time options may extend to 12-18 months. The duration depends on the gaps identified in your credential evaluation." },
      { question: "Can I work while completing a bridging program?", answer: "Some programs offer part-time or evening schedules that allow you to work. However, clinical placement hours typically require daytime availability. Some students work weekends or casual/agency shifts while studying. Check with your specific program about scheduling flexibility." },
      { question: "Do bridging programs guarantee licensure?", answer: "No. Bridging programs prepare you for the licensing process and exams, but passing the licensing exam and meeting all registration requirements is still your responsibility. However, bridging program graduates typically have significantly higher exam pass rates than IENs who study independently." },
    ],
    relatedLinks: [
      { href: "/nursing-credential-assessment-explained", label: "Credential Assessment Guide" },
      { href: "/international-nurses/credential-evaluation", label: "Credential Evaluation Process" },
      { href: "/nclex-for-international-nurses", label: "NCLEX for International Nurses" },
      { href: "/international-nurses", label: "International Nursing Hub" },
    ],
  },
  "international-nurses/credential-evaluation": {
    slug: "international-nurses/credential-evaluation",
    title: "Nursing Credential Evaluation: Complete Process Guide",
    subtitle: "How your nursing qualifications are assessed for international registration",
    description: "Step-by-step guide to nursing credential evaluation for internationally educated nurses. Learn about NNAS, CGFNS, NMC, ANMAC, and other agencies, required documents, timelines, and costs.",
    seoKeywords: "nursing credential evaluation, credential assessment nursing, NNAS credential evaluation, CGFNS evaluation, nursing qualification assessment, IEN credential evaluation, nursing credentials international",
    icon: Shield,
    sections: [
      { heading: "What Is Credential Evaluation?", content: "Credential evaluation is the process by which an authorized agency reviews your nursing education, training, and qualifications against the standards of your destination country. It's a mandatory step in the licensing process for internationally educated nurses in virtually every English-speaking country. The evaluation determines whether your qualifications are substantially equivalent to the destination country's nursing education requirements." },
      { heading: "Why Is It Required?", content: "Nursing education standards, curriculum content, clinical hours, and practice scopes vary significantly between countries. Credential evaluation provides a standardized way to compare nursing qualifications internationally. It protects public safety by ensuring that all nurses practicing in the destination country meet minimum educational standards, regardless of where they trained." },
      { heading: "Credential Evaluation Agencies by Country", content: "Each country has designated agencies for nursing credential evaluation:", bullets: ["Canada — NNAS (National Nursing Assessment Service): Centralized assessment for all Canadian provinces. Evaluates nursing theory, clinical practice, and professional practice hours. Cost: CAD $650-$800. Processing time: 3-6 months.", "United States — CGFNS (Commission on Graduates of Foreign Nursing Schools): Evaluates nursing education against US standards. Required by most state boards. Also offers VisaScreen for immigration. Cost: USD $350-$550. Processing time: 2-4 months.", "United Kingdom — NMC (Nursing and Midwifery Council): Performs its own assessment as part of the registration process. Self-contained — no separate agency needed. Cost: GBP £140 (application fee). Processing time: 1-2 months.", "Australia — ANMAC (Australian Nursing and Midwifery Accreditation Council): Skills assessment for AHPRA registration. Document-intensive process. Cost: AUD $500-$800. Processing time: 8-12 weeks.", "New Zealand — NCNZ (Nursing Council of New Zealand): Direct assessment as part of registration. May require CAP (Competence Assessment Programme). Cost: NZD $500-$700.", "Gulf States — DataFlow: Primary source verification service used by DHA, DOH, HAAD, and Saudi MOH. Cost: AED 400-800. Processing time: 4-8 weeks."] },
      { heading: "What Gets Evaluated", content: "Credential evaluation typically assesses:", bullets: ["Nursing theory education — classroom/theoretical hours and curriculum content coverage", "Clinical practice hours — supervised clinical placement hours, settings, and specialties", "Professional practice — professional development, continuing education, and leadership experience", "License verification — confirmation of active nursing license in your home country", "Education institution accreditation — verification that your nursing school is recognized", "Curriculum comparison — how your coursework maps to the destination country's competency framework"] },
      { heading: "Step-by-Step Process", content: "The general credential evaluation process follows these steps:", bullets: ["Step 1: Research your destination country's requirements and identify the correct evaluation agency", "Step 2: Create an account and start your application online", "Step 3: Request official documents from your nursing school (transcripts sent directly to the agency)", "Step 4: Request license verification from your nursing regulatory body (sent directly to the agency)", "Step 5: Submit English language test scores (IELTS, OET, or equivalent)", "Step 6: Upload supporting documents (passport, employment certificates, curriculum details)", "Step 7: Pay the application fee", "Step 8: Monitor your application through the online portal — respond promptly to any requests", "Step 9: Receive your evaluation report and forward to your regulatory body", "Step 10: Based on the outcome, proceed to exams, bridging programs, or registration"] },
      { heading: "Common Outcomes", content: "Your credential evaluation can result in several outcomes:", bullets: ["Substantially equivalent — your qualifications meet the standards. Proceed directly to licensing exams.", "Minor gaps identified — you may need to complete specific courses or supervised practice before exams.", "Significant gaps identified — you may be directed to a bridging program to address educational deficiencies.", "Assessment incomplete — missing documents or information. You'll need to provide additional documentation.", "An unfavorable outcome is not a dead end — bridging programs and additional education can address most gaps."] },
    ],
    tips: [
      "Apply for credential evaluation as early as possible — it's typically the longest step in the licensing process",
      "Request documents from your nursing school and regulatory body simultaneously to save time",
      "Keep copies of everything you submit — you may need them for future applications",
      "Start exam preparation while waiting for your evaluation — don't wait for the results",
      "Check your evaluation portal weekly for updates and respond promptly to any document requests",
    ],
    faqs: [
      { question: "How long does credential evaluation take?", answer: "Processing times vary: NNAS (Canada) takes 3-6 months, CGFNS (USA) takes 2-4 months, NMC (UK) assessment takes 1-2 months, ANMAC (Australia) takes 8-12 weeks, DataFlow (Gulf states) takes 4-8 weeks. Peak periods and document delays can extend these timelines." },
      { question: "What if my credentials don't meet standards?", answer: "If gaps are identified, you may be directed to complete additional education, a bridging program, or supervised clinical practice. This is common and not a dead end — most gaps can be addressed. The evaluation report typically specifies exactly what additional requirements you need to meet." },
      { question: "Can I use one country's evaluation for another?", answer: "No. Each country has its own credential evaluation process and agency. You cannot use a credential evaluation from one country to apply in another — each assessment is country-specific and evaluates against different standards." },
      { question: "What if my nursing school has closed?", answer: "If your nursing school has closed, contact the national nursing regulatory body or education authority in your home country. They may hold archived records or can provide verification. The evaluation agency can advise on alternative documentation options." },
    ],
    relatedLinks: [
      { href: "/nursing-credential-assessment-explained", label: "Credential Assessment Explained" },
      { href: "/nnas-application-guide", label: "NNAS Application Guide" },
      { href: "/international-nurses/required-documents", label: "Required Documents Checklist" },
      { href: "/international-nurses", label: "International Nursing Hub" },
    ],
  },
  "international-nurses/required-documents": {
    slug: "international-nurses/required-documents",
    title: "Required Documents for International Nursing Registration",
    subtitle: "Complete checklist of documents needed for nursing credential evaluation and registration",
    description: "Comprehensive document checklist for internationally educated nurses. Covers all required documents for NNAS, CGFNS, NMC, ANMAC, and other nursing registration processes with preparation tips.",
    seoKeywords: "documents nursing registration, NNAS documents, CGFNS documents, nursing credential documents, IEN required documents, international nurse documents, nursing registration checklist",
    icon: FileText,
    sections: [
      { heading: "Universal Documents", content: "These documents are required by virtually every nursing credential evaluation agency and regulatory body:", bullets: ["Valid passport (unexpired) — clear color copies of the bio-data page", "Official nursing school transcripts — must be sent directly from the institution to the evaluation agency (sealed, original transcripts)", "Nursing degree or diploma certificate — certified true copy or notarized", "Current nursing license or registration certificate from your home country", "License verification letter — issued by your home country's nursing regulatory body, sent directly to the evaluation agency", "Passport-size photographs (recent, taken within 6 months)", "Name change documents (if applicable) — marriage certificate, court order, etc."] },
      { heading: "Education Documents", content: "Detailed educational documentation is critical for credential evaluation:", bullets: ["Complete academic transcripts showing all courses, grades, and credit hours", "Curriculum content outline — detailed description of each nursing course (theory and clinical components)", "Clinical hours log — documentation of supervised clinical placement hours by specialty area", "Course syllabi — some agencies request detailed syllabi for comparison against local curricula", "Proof of program accreditation — documentation that your nursing school is recognized/accredited", "Postgraduate certificates or specialty training documentation (if applicable)", "Continuing education certificates (may support your application)"] },
      { heading: "Professional Documents", content: "Documentation of your nursing practice and professional standing:", bullets: ["Employment certificates from all nursing positions — include dates, title, duties, and employer letterhead", "Reference letters from nursing supervisors or managers (typically 2-3 required)", "Professional portfolio or logbook of clinical competencies (if available)", "Disciplinary record verification — confirmation of good standing from your regulatory body", "Professional development and continuing education records", "Specialty certifications (ACLS, BLS, NRP, oncology certification, etc.)"] },
      { heading: "Language Test Documents", content: "English proficiency test results:", bullets: ["Official IELTS Academic, OET, CELBAN, PTE, or TOEFL score report", "Scores must be sent directly from the testing organization to the evaluation agency or regulatory body", "Ensure scores are within the validity period (typically 2 years)", "Keep a personal copy of your scores for reference"] },
      { heading: "Country-Specific Documents", content: "Additional documents required by specific countries:", bullets: ["Canada (NNAS): Nursing school curriculum content outline, statutory declaration (if documents are in a language other than English/French)", "USA (CGFNS): State-specific application forms, Social Security Number (upon arrival), visa documents for VisaScreen", "UK (NMC): Character reference, criminal record check (DBS), occupational health clearance", "Australia (ANMAC): Certified document translations (if not in English), Australian Federal Police check (upon arrival)", "New Zealand (NCNZ): Police clearance certificates from all countries where you've lived for 12+ months", "Gulf States (DataFlow): Authenticated copies of all documents, employer verification letters"] },
      { heading: "Document Preparation Tips", content: "How to prepare and organize your documents:", bullets: ["Start gathering documents 3-6 months before you plan to apply — institutions in some countries are slow to respond", "Create a master checklist specific to your destination country and track each document's status", "Request multiple certified copies — you may need originals for different agencies", "Get non-English documents translated by a certified translator and notarized", "Ensure your nursing school and regulatory body can respond to verification requests", "Keep digital scans of all documents in a secure cloud storage location", "If your nursing school has closed, contact your national education authority for archived records", "Have documents apostilled if required by your destination country", "Create a cover page with your full name, application reference number, and a list of enclosed documents"] },
    ],
    tips: [
      "Request documents from your nursing school and regulatory body simultaneously — don't wait for one before starting the other",
      "Contact the evaluation agency if you're unsure about any document requirement — it's better to ask than to submit incorrectly",
      "Some agencies accept scanned copies initially while originals are in transit — ask about their policy",
      "Keep a tracking spreadsheet with document names, request dates, and receipt confirmations",
    ],
    faqs: [
      { question: "What if my documents are not in English?", answer: "Documents in languages other than English must be translated by a certified/accredited translator. The translation must include a certification statement with the translator's credentials. Some agencies require notarized translations. Always submit both the original language document and the certified English translation." },
      { question: "How long do documents take to process?", answer: "Document processing varies significantly. Nursing schools may take 2-8 weeks to issue official transcripts. Regulatory bodies may take 2-6 weeks for license verification. Factor in postal delivery time for international mail. Using courier services can speed up document delivery." },
      { question: "What if I can't obtain a specific document?", answer: "Contact the evaluation agency immediately to discuss alternatives. They may accept statutory declarations, alternative evidence, or waive certain requirements in exceptional circumstances (e.g., documents destroyed due to natural disaster, school closure)." },
      { question: "Can I submit copies instead of originals?", answer: "Most agencies require official/original documents sent directly from the issuing institution. However, for identity documents, certified copies are usually acceptable. Check your specific agency's requirements — submitting incorrect document formats causes delays." },
    ],
    relatedLinks: [
      { href: "/international-nurses/credential-evaluation", label: "Credential Evaluation Guide" },
      { href: "/nnas-application-guide", label: "NNAS Application Guide" },
      { href: "/international-nurses/common-delays", label: "Common Delays & How to Avoid Them" },
      { href: "/international-nurses", label: "International Nursing Hub" },
    ],
  },
  "international-nurses/common-delays": {
    slug: "international-nurses/common-delays",
    title: "Common Delays in International Nursing Registration",
    subtitle: "Why your nursing license process gets delayed and how to avoid or overcome each obstacle",
    description: "Identify and overcome common delays in international nursing registration. Learn about document processing delays, credential evaluation bottlenecks, exam scheduling issues, and immigration timeline challenges.",
    seoKeywords: "nursing registration delays, IEN delays, slow nursing license, NNAS processing time, credential evaluation delay, nursing registration timeline, international nurse waiting time",
    icon: Clock,
    sections: [
      { heading: "Overview of Common Delays", content: "The international nursing registration process typically takes 6-18 months, but delays can extend this significantly. Understanding common bottlenecks helps you plan ahead and take proactive steps to minimize waiting time. Most delays occur in credential evaluation, document processing, and exam scheduling — areas where advance preparation can make a significant difference." },
      { heading: "Document-Related Delays", content: "Document issues are the most common cause of delays:", bullets: ["Slow institutional response — nursing schools and regulatory bodies in some countries take 4-12 weeks to process document requests. Solution: Request documents as early as possible, follow up regularly, and use courier services.", "Missing or incomplete documents — submitting without all required documents causes applications to be placed on hold. Solution: Use the evaluation agency's checklist and double-check before submitting.", "Document authentication delays — apostille or authentication processes can take 2-6 weeks. Solution: Start the authentication process immediately after obtaining documents.", "Translation delays — certified translation can take 1-4 weeks. Solution: Identify a certified translator early and have documents translated as soon as they arrive.", "Closed institutions — if your nursing school has closed, obtaining records can take months. Solution: Contact your national education authority early for archived records.", "Documents lost in transit — international mail can be unreliable. Solution: Use tracked courier services and keep copies of everything."] },
      { heading: "Credential Evaluation Delays", content: "Evaluation processing itself can be slow:", bullets: ["Peak period backlogs — evaluation agencies experience high volume at certain times of year. NNAS processing can extend to 6+ months during peaks. Solution: Apply during off-peak periods if possible.", "Additional information requests — agencies may request supplementary documents not originally listed. Solution: Provide comprehensive documentation upfront, including detailed curriculum information.", "Verification failures — if the agency cannot verify your documents with the issuing institution, processing stalls. Solution: Ensure your school/regulatory body is responsive to verification requests.", "Application errors — mistakes in your application cause it to be returned for correction. Solution: Review your application thoroughly before submitting, and have someone else review it too.", "Payment issues — failed payments or incomplete fee payments delay processing. Solution: Verify payment has been processed and keep confirmation receipts."] },
      { heading: "Exam-Related Delays", content: "Scheduling and preparation delays:", bullets: ["Limited exam availability — NCLEX-RN and other exams may have limited appointment slots in some locations. Solution: Book your exam slot as soon as you receive your Authorization to Test (ATT).", "Failed attempts — retaking exams adds 45+ days (NCLEX waiting period) plus additional preparation time. Solution: Invest in thorough preparation before your first attempt.", "OSCE scheduling — NMC OSCE appointments may have 2-4 month wait times. Solution: Book as soon as you pass the CBT.", "ATT expiration — Authorization to Test is time-limited. If it expires before you take the exam, you must reapply. Solution: Book your exam promptly after receiving ATT.", "Language test retakes — not achieving required scores means retaking the test after preparation. Solution: Take a diagnostic test first and prepare thoroughly before the official test."] },
      { heading: "Immigration and Visa Delays", content: "Immigration processing can add significant time:", bullets: ["Work permit processing — LMIA processing (Canada) can take 3-6 months. Solution: Explore LMIA-exempt work permit options.", "Visa backlogs — US EB-3 green card has multi-year backlogs for some countries of origin. Solution: Consider alternative visa categories or countries with faster processing.", "Background check delays — police clearance certificates from multiple countries can take 2-8 weeks each. Solution: Request police clearances from all countries simultaneously.", "Medical examination delays — immigration medical exams must be done by designated physicians, who may have wait times. Solution: Book your medical appointment early.", "Spousal/dependent processing — processing dependents adds time. Solution: Submit all family applications simultaneously."] },
      { heading: "How to Minimize Delays", content: "Proactive strategies to keep your process on track:", bullets: ["Start gathering documents 3-6 months before applying", "Begin credential evaluation and language testing simultaneously — don't wait for one to finish before starting the other", "Create a detailed timeline with milestones and deadlines", "Follow up with agencies and institutions regularly (weekly check-ins)", "Prepare for exams while waiting for credential evaluation results", "Join online IEN forums and groups for real-time information about processing times", "Consider hiring an immigration consultant for complex cases", "Keep all application reference numbers and correspondence organized", "Have backup plans — if one step is delayed, work on parallel steps"] },
    ],
    faqs: [
      { question: "What is the average total processing time?", answer: "The full process from initial application to practicing as a nurse typically takes: Canada 8-14 months, USA 6-12 months, UK 4-8 months, Australia 6-12 months, New Zealand 4-8 months. These timelines assume no significant delays. Add 3-6 months if delays occur." },
      { question: "Can I speed up the NNAS process?", answer: "While you can't speed up NNAS processing directly, you can avoid delays by: submitting complete documentation from the start, ensuring your nursing school and regulatory body respond promptly to verification requests, using courier services for document delivery, and checking your portal weekly for update requests." },
      { question: "What if my application is delayed beyond the expected timeline?", answer: "Contact the evaluation agency directly to inquire about the status. Ask specifically what is causing the delay and what you can do to resolve it. Document all communications. If the delay is on the agency's end, politely but persistently follow up. If the delay is due to third parties (schools, regulatory bodies), contact them directly." },
      { question: "Should I start exam preparation while waiting?", answer: "Absolutely. Begin NCLEX-RN, REx-PN, or CBT/OSCE preparation while waiting for your credential evaluation. This is the most productive use of waiting time and ensures you're ready to take the exam as soon as you're eligible. NurseNest offers comprehensive exam prep for international nurses." },
    ],
    relatedLinks: [
      { href: "/international-nurses/required-documents", label: "Required Documents Checklist" },
      { href: "/international-nurses/credential-evaluation", label: "Credential Evaluation Guide" },
      { href: "/international-nurses/registration-timelines", label: "Registration Timelines by Country" },
      { href: "/international-nurses", label: "International Nursing Hub" },
    ],
  },
  "international-nurses/registration-timelines": {
    slug: "international-nurses/registration-timelines",
    title: "Nursing Registration Timelines by Country",
    subtitle: "Realistic timelines for international nursing registration in every major destination",
    description: "Detailed nursing registration timelines for internationally educated nurses. Country-by-country breakdown of processing times for credential evaluation, exams, immigration, and total time to practice.",
    seoKeywords: "nursing registration timeline, how long nursing license international, IEN registration time, NNAS processing time, nursing license timeline, international nurse timeline, registration time by country",
    icon: Clock,
    sections: [
      { heading: "Understanding Registration Timelines", content: "The total time from decision to practice varies significantly by destination country and individual circumstances. This guide provides realistic timelines based on current processing times, including credential evaluation, exam preparation, immigration, and registration. Note that these are estimates — individual experiences vary based on document availability, exam pass rates, and immigration processing." },
      { heading: "Canada — 8-14 Months", content: "Canada's multi-step process involves NNAS, provincial registration, and immigration:", bullets: ["Months 1-2: Gather documents, request transcripts and license verification from home country", "Months 2-3: Submit NNAS application and supporting documents", "Months 3-8: NNAS processing (3-6 months) — use this time for exam preparation and language testing", "Month 8-9: Receive NNAS advisory report, submit to provincial regulatory body", "Month 9-10: Provincial assessment and decision (may require bridging or direct-to-exam)", "Month 10-12: Complete exam (NCLEX-RN or REx-PN) and any additional requirements", "Month 12-14: Receive registration, arrange work permit/immigration", "Fast track: Express Entry with a job offer can reduce immigration time significantly", "Bottleneck: NNAS processing is typically the longest single step"] },
      { heading: "United States — 6-12 Months", content: "US registration is state-specific with federal immigration:", bullets: ["Months 1-2: Research state requirements, gather documents, apply for CGFNS evaluation", "Months 2-4: CGFNS processing (2-4 months) — prepare for NCLEX-RN during this time", "Month 4-5: Receive CGFNS report, apply to state board of nursing", "Month 5-6: Receive Authorization to Test (ATT), schedule NCLEX-RN", "Month 6-7: Take NCLEX-RN exam", "Month 7-8: Receive license upon passing", "Month 8-12: Immigration processing (H-1B or EB-3 green card) — significant variation", "Bottleneck: Immigration processing, especially EB-3 green card backlogs for some countries", "Note: Some recruiters begin the process in parallel to speed up the overall timeline"] },
      { heading: "United Kingdom — 4-8 Months", content: "The UK's NMC process is relatively streamlined:", bullets: ["Month 1: Gather documents, take IELTS/OET if not already done", "Month 1-2: Submit NMC application online with supporting documents", "Month 2-3: NMC processes application and issues decision letter", "Month 3-4: Take NMC CBT (Computer-Based Test) — available worldwide at Pearson VUE", "Month 4-5: Apply for OSCE appointment (can book before arriving in UK)", "Month 5-6: Take NMC OSCE in the UK", "Month 6-7: NMC registration issued upon passing both parts", "Month 7-8: Start employment (if not already on a supervised practice placement)", "Advantage: NHS employers often sponsor the entire process and support with OSCE preparation", "Fastest option: If your employer provides sponsored support, the process can be as quick as 4 months"] },
      { heading: "Australia — 6-12 Months", content: "Australia's ANMAC assessment is document-intensive:", bullets: ["Months 1-2: Gather documents, complete English proficiency test", "Months 2-3: Submit ANMAC skills assessment application", "Months 3-5: ANMAC processing (8-12 weeks)", "Month 5-6: Receive outcome — may be directed to additional requirements or approved for registration", "Month 6-7: Apply to AHPRA for registration", "Month 7-8: AHPRA processing and registration", "Month 8-10: Apply for visa (Skilled Worker visa subclass 482 or 189)", "Month 10-12: Visa processing and arrival", "Note: Australia is piloting NCLEX-RN for some applicants, which may change timelines", "Regional areas may offer faster visa processing through regional visa pathways"] },
      { heading: "New Zealand — 4-8 Months", content: "New Zealand offers one of the simpler processes:", bullets: ["Month 1: Gather documents, complete IELTS/OET", "Month 1-2: Submit application to NCNZ", "Month 2-4: NCNZ assessment (may include review of clinical competencies)", "Month 4-5: Outcome — may be registered directly or directed to CAP (Competence Assessment Programme)", "Month 5-6: Complete CAP if required (4-12 weeks supervised practice)", "Month 6-7: Receive full registration", "Month 7-8: Apply for work visa (Green List occupation — streamlined processing)", "Advantage: No universal licensing exam for most applicants", "Advantage: Nursing is on the Green List for fast-track residency"] },
      { heading: "Gulf States (UAE, Saudi Arabia) — 2-6 Months", content: "Gulf states have the fastest processing:", bullets: ["Month 1: Apply through employer or recruitment agency, submit documents for DataFlow verification", "Month 1-2: DataFlow verification (4-8 weeks)", "Month 2-3: Licensing exam (DHA/DOH/HAAD exam for UAE, Prometric for Saudi Arabia)", "Month 3-4: License issued upon passing", "Month 4-5: Visa processing (employer handles — typically 2-4 weeks)", "Month 5-6: Arrival and start of employment", "Advantage: Employer handles virtually the entire process", "Note: All employment is employer-sponsored — you cannot freelance or change employers without transfer process"] },
    ],
    faqs: [
      { question: "Which country has the fastest registration process?", answer: "Gulf states (UAE, Saudi Arabia) are typically fastest at 2-6 months, followed by the UK (4-8 months) and New Zealand (4-8 months). Canada (8-14 months) and the USA (6-12 months, excluding immigration backlogs) take longer. Australia is in the middle at 6-12 months." },
      { question: "Can I work while my registration is being processed?", answer: "This varies by country. The UK allows supervised practice while completing the registration process. Some Canadian provinces offer temporary permits. The USA generally requires full licensure before practice. Gulf states require completed licensing before starting work." },
      { question: "What can I do to speed up the process?", answer: "Start gathering documents 3-6 months before applying. Begin credential evaluation, language testing, and exam preparation simultaneously. Use courier services for document delivery. Follow up with agencies regularly. Have all documents translated and authenticated in advance." },
    ],
    relatedLinks: [
      { href: "/international-nurses/common-delays", label: "Common Delays & Solutions" },
      { href: "/international-nurses/credential-evaluation", label: "Credential Evaluation Guide" },
      { href: "/how-to-transfer-nursing-license", label: "License Transfer Guide" },
      { href: "/international-nurses", label: "International Nursing Hub" },
    ],
  },
  "international-nurses/best-countries": {
    slug: "international-nurses/best-countries",
    title: "Best Countries for International Nurses in 2025",
    subtitle: "Ranked by salary, immigration ease, work-life balance, and career growth",
    description: "Discover the best countries for international nurses. Comprehensive ranking considering salary, immigration pathways, quality of life, career opportunities, and nursing demand for internationally educated nurses.",
    seoKeywords: "best countries international nurses, best country nursing, where to work as nurse abroad, top countries nursing, best nursing destination, international nursing destinations, best country IEN",
    icon: Globe,
    sections: [
      { heading: "How We Rank Countries", content: "Our ranking considers multiple factors that matter most to internationally educated nurses: salary and compensation, immigration accessibility, licensing process difficulty, quality of life, career growth opportunities, and nursing demand. No single country is 'best' for everyone — the right choice depends on your priorities, qualifications, and personal circumstances." },
      { heading: "1. Canada", content: "Canada consistently ranks as one of the best destinations for international nurses, offering a balanced combination of salary, immigration, and quality of life.", bullets: ["Salary: CAD $65,000-$95,000/year with strong benefits and pension", "Immigration: Express Entry and Provincial Nominee Programs provide fast permanent residency pathways", "Nursing demand: Severe nursing shortage across all provinces — over 100,000 unfilled positions", "Quality of life: Universal healthcare, safe communities, excellent education system", "Licensing: NCLEX-RN (same as USA) through NNAS credential evaluation", "Languages: English and French (French an asset in Quebec and bilingual regions)", "Best for: Nurses seeking permanent residency, work-life balance, and long-term career stability"] },
      { heading: "2. United States", content: "The USA offers the highest earning potential for nurses globally, with diverse career paths.", bullets: ["Salary: USD $60,000-$120,000/year (travel nursing: $80,000-$150,000+)", "Immigration: Schedule A recognition, but EB-3 green card backlogs for some countries", "Nursing demand: 1.2 million projected vacancies by 2030 — massive shortage", "Career diversity: Travel nursing, specialized units, advanced practice (NP/CRNA/CNM)", "Licensing: NCLEX-RN through CGFNS credential evaluation (state-specific)", "Best for: Nurses seeking maximum earnings, career advancement, and diverse specialization options"] },
      { heading: "3. United Kingdom", content: "The UK offers fast processing and strong employer support through the NHS.", bullets: ["Salary: GBP £28,000-£50,000/year (Band 5-7) with NHS pension and 27+ days leave", "Immigration: Health and Care Worker visa with reduced fees and fast processing", "Licensing: NMC CBT + OSCE — practical exam many nurses find manageable", "Employer support: NHS trusts actively recruit internationally and provide comprehensive support", "Career ladder: Clear Band 5-8 progression with structured career development", "Best for: Nurses wanting fast processing, employer sponsorship, and structured career progression"] },
      { heading: "4. Australia", content: "Australia combines high salaries with excellent lifestyle and diverse career opportunities.", bullets: ["Salary: AUD $70,000-$110,000/year with penalty rates and superannuation", "Immigration: Skilled migration via MLTSSL, regional visa pathways offer faster processing", "Quality of life: Excellent climate, outdoor lifestyle, multicultural society", "Job market: Large and diverse — urban hospitals, rural health, aged care, research", "Licensing: ANMAC skills assessment through AHPRA (piloting NCLEX-RN)", "Best for: Nurses seeking high salaries, lifestyle quality, and diverse career options in a large market"] },
      { heading: "5. New Zealand", content: "New Zealand offers simplicity, quality of life, and a welcoming environment.", bullets: ["Salary: NZD $60,000-$90,000/year with public sector benefits", "Immigration: Green List fast-track for nurses — streamlined residency pathway", "Licensing: No universal exam (NCNZ assessment, possible CAP)", "Quality of life: Consistently ranked among the world's most liveable countries", "Trans-Tasman: Can move to Australia through mutual recognition agreement", "Best for: Nurses prioritizing quality of life, simple licensing, and pathway to Australia/NZ residency"] },
      { heading: "6. Ireland", content: "Ireland offers EU access, English-speaking environment, and growing healthcare sector.", bullets: ["Salary: EUR €33,000-€55,000/year with HSE pay scale benefits", "Immigration: Critical Skills Employment Permit for nurses", "EU access: Irish registration can facilitate working across the EU", "Healthcare growth: Expanding healthcare system with increasing demand", "Licensing: NMBI registration with skills assessment", "Best for: Nurses interested in EU career mobility and English-speaking European lifestyle"] },
      { heading: "7. UAE and Saudi Arabia", content: "Gulf states offer tax-free income and comprehensive benefit packages.", bullets: ["Salary: Tax-free — UAE: AED 8,000-20,000/month; Saudi: SAR 6,000-15,000/month", "Benefits: Accommodation, health insurance, annual flights home — total package significantly exceeds base salary", "Processing speed: Fastest registration (2-6 months from application to working)", "Savings potential: Highest savings potential due to tax-free income and employer-covered living expenses", "Limitations: Employer-tied visas, limited permanent residency options, cultural adjustment required", "Best for: Nurses focused on saving money quickly and experiencing international healthcare"] },
      { heading: "Choosing the Right Country for You", content: "Consider these factors when making your decision:", bullets: ["For maximum earnings: USA (especially travel nursing) or Gulf states (tax-free)", "For fastest immigration: Canada (Express Entry) or New Zealand (Green List)", "For fastest licensing: UK (4-8 months) or Gulf states (2-6 months)", "For best work-life balance: Canada, New Zealand, or Australia", "For career advancement: USA (NP pathways) or UK (Band progression)", "For simplest licensing process: New Zealand (no universal exam)", "For saving money: Gulf states (tax-free with employer-covered expenses)", "For family-friendly immigration: Canada (includes dependents in PR application)"] },
    ],
    faqs: [
      { question: "Which country is easiest for international nurses?", answer: "In terms of registration process, New Zealand is among the easiest (no universal exam). The UK is also relatively straightforward with strong employer support. For immigration, Canada's Express Entry provides a clear pathway. For overall ease, the Gulf states have the fastest end-to-end process." },
      { question: "Which country has the highest demand for nurses?", answer: "All major destination countries face nursing shortages. The USA has the largest projected shortfall (1.2 million by 2030), followed by Canada (over 100,000 unfilled positions). The UK's NHS consistently recruits internationally to fill vacancies. Australia and New Zealand also have nursing on their skilled migration lists." },
      { question: "Can I apply to multiple countries simultaneously?", answer: "Yes, and it's a smart strategy. You can pursue credential evaluation and language testing for multiple countries at the same time. Since many countries accept the same exams (NCLEX-RN for USA/Canada, IELTS/OET for most English-speaking countries), preparation often overlaps." },
      { question: "Should I go where the salary is highest?", answer: "Not necessarily. Consider the total package: salary, cost of living, tax rates, benefits, immigration pathways, and quality of life. A high salary in a high-cost-of-living area may leave you with less savings than a moderate salary in a lower-cost area with tax-free income (Gulf states)." },
    ],
    relatedLinks: [
      { href: "/international-nurses/highest-paying-countries", label: "Highest Paying Countries for Nurses" },
      { href: "/international-nurses/compare-canada-vs-united-states", label: "Canada vs USA Comparison" },
      { href: "/international-nurses/compare-canada-vs-united-kingdom", label: "Canada vs UK Comparison" },
      { href: "/international-nurses", label: "International Nursing Hub" },
    ],
  },
  "international-nurses/highest-paying-countries": {
    slug: "international-nurses/highest-paying-countries",
    title: "Highest Paying Countries for Nurses in 2025",
    subtitle: "Where nurses earn the most — comparing salaries, benefits, and real purchasing power",
    description: "Discover the highest paying countries for nurses worldwide. Compare nursing salaries, benefits packages, tax rates, cost of living, and real purchasing power across major nursing destinations.",
    seoKeywords: "highest paying countries nurses, best nurse salary, top nurse pay, nurse salary comparison, highest nurse salary world, best paying nursing countries, nurse salary by country 2025",
    icon: DollarSign,
    sections: [
      { heading: "Understanding Nurse Compensation", content: "Nursing salaries vary dramatically worldwide — but raw salary numbers don't tell the full story. This guide compares total compensation including base salary, benefits, tax implications, cost of living, and real purchasing power to give you an accurate picture of where nurses actually earn the most." },
      { heading: "1. United States — Highest Base Salary", content: "The USA offers the highest nominal nursing salaries globally.", bullets: ["Average RN salary: USD $89,000/year (Bureau of Labor Statistics 2024)", "Top states: California ($130,000+), Hawaii ($113,000), Massachusetts ($104,000)", "Travel nursing: $80,000-$150,000+ per year with housing stipends", "Critical care/OR/ER specialties: 10-30% above average", "Nurse Practitioners: $120,000-$180,000/year", "Tax rate: 22-37% federal + state income tax", "Benefits: Employer-provided health insurance (worth $7,000-$20,000/year), 401(k) retirement plans", "High variance: Rural areas pay $55,000 while urban centres pay $120,000+"] },
      { heading: "2. Australia — Strong Salary + Benefits", content: "Australia offers competitive salaries with additional penalty rates.", bullets: ["Average RN salary: AUD $85,000/year ($55,000-$110,000 range)", "Penalty rates: Weekend, evening, and night shifts pay 25-75% extra", "Superannuation: Employer contributes 11.5% of salary to retirement (mandatory)", "Remote/rural bonuses: Additional $5,000-$15,000 allowances for regional areas", "Tax rate: 19-45% (higher brackets)", "Benefits: 4 weeks annual leave + long service leave + sick leave", "Real earning potential: Penalty rates can add $10,000-$25,000 to base salary"] },
      { heading: "3. Canada — Competitive With Strong Benefits", content: "Canadian nursing salaries come with excellent benefits and work-life balance.", bullets: ["Average RN salary: CAD $80,000/year ($65,000-$95,000 range)", "Overtime: 1.5x-2x base rate, readily available due to nursing shortage", "Shift differentials: Evening and night premiums add 10-20% to base", "Benefits: Comprehensive health/dental coverage, defined benefit pension plans", "Tax rate: 25-35% combined federal/provincial", "Unionized workplaces: Strong labor protections, guaranteed raises, and job security", "Northern/remote premiums: Significant allowances ($10,000-$30,000+) for remote locations"] },
      { heading: "4. UAE — Tax-Free With Full Benefits Package", content: "UAE nursing compensation is unique due to tax-free income and employer-provided benefits.", bullets: ["Base salary: AED 10,000-20,000/month (USD $2,700-$5,400)", "Tax rate: 0% — no personal income tax", "Employer-provided accommodation: Worth $12,000-$24,000/year", "Health insurance: Fully covered by employer", "Annual flights home: Return flights for nurse + dependents (worth $1,000-$3,000)", "End-of-service gratuity: Lump sum payment based on years of service", "Total package value: Often 40-60% higher than base salary when benefits included", "Best for savings: Tax-free income + employer-covered expenses = highest savings potential"] },
      { heading: "5. Saudi Arabia — Tax-Free + Growing Demand", content: "Saudi Arabia offers tax-free income with Vision 2030 increasing healthcare investment.", bullets: ["Base salary: SAR 8,000-15,000/month (USD $2,100-$4,000)", "Tax rate: 0% — no personal income tax", "Employer benefits: Accommodation, transportation, insurance, annual flights", "Growing demand: Vision 2030 healthcare expansion creating thousands of positions", "Contract bonuses: Some employers offer sign-on and completion bonuses", "Total package: Similar to UAE in overall value with strong savings potential"] },
      { heading: "6. United Kingdom — NHS Structure", content: "UK nursing salaries follow the structured NHS pay bands.", bullets: ["Band 5 (entry): GBP £29,000-£36,000/year", "Band 6 (senior): GBP £37,000-£44,000/year", "Band 7 (advanced): GBP £46,000-£53,000/year", "London weighting: Additional £3,000-£5,000 for London-based roles", "Unsociable hours: 30% premium for night, weekend, and bank holiday shifts", "NHS pension: One of the best public sector pensions in the world", "Annual leave: 27 days + 8 bank holidays (increases with service)", "Tax rate: 20-40% (depends on earnings band)"] },
      { heading: "Real Purchasing Power Comparison", content: "Adjusting for taxes, benefits, and cost of living gives a more accurate picture:", bullets: ["Highest savings potential: UAE/Saudi Arabia (tax-free + employer-covered living expenses)", "Highest gross income: USA (especially California, travel nursing)", "Best total package: Canada (salary + pension + universal healthcare + immigration)", "Best entry-level: Australia (penalty rates make entry-level earning potential high)", "Most undervalued: UK salaries appear lower but NHS pension + 35 days leave + universal healthcare add significant value", "For remittances: Gulf states offer the best value for nurses sending money home", "Key insight: A $60,000 salary in a tax-free country with free housing can equal $100,000+ in a taxed country with housing expenses"] },
    ],
    faqs: [
      { question: "Where do nurses earn the most after taxes?", answer: "In absolute post-tax terms, US nurses in high-paying states earn the most. However, when including employer-provided benefits (housing, insurance, flights), Gulf states nurses often have the highest disposable income due to zero income tax and covered living expenses." },
      { question: "Is travel nursing really worth it?", answer: "US travel nursing can be extremely lucrative ($80,000-$150,000+) with housing stipends. However, it involves frequent relocation, potential for isolation, and variable job security. It's best suited for adaptable nurses without school-age children or geographic constraints." },
      { question: "Do specializations increase salary abroad?", answer: "Yes, significantly. Critical care (ICU), operating room, emergency, and oncology nurses command 10-30% premiums in most countries. Nurse practitioners and clinical nurse specialists earn 50-80% above base RN salary where these roles exist." },
      { question: "Should I choose a country based on salary alone?", answer: "No. Consider total compensation (salary + benefits + tax + cost of living), immigration pathways, career advancement opportunities, quality of life, and personal factors like proximity to family. A lower salary with permanent residency and good quality of life may be more valuable long-term." },
    ],
    relatedLinks: [
      { href: "/international-nurses/best-countries", label: "Best Countries for International Nurses" },
      { href: "/international-nurses/compare-canada-vs-united-states", label: "Canada vs USA Comparison" },
      { href: "/international-nurses/visa-sponsorship-jobs", label: "Visa Sponsorship Jobs" },
      { href: "/international-nurses", label: "International Nursing Hub" },
    ],
  },
  "international-nurses/visa-sponsorship-jobs": {
    slug: "international-nurses/visa-sponsorship-jobs",
    title: "Visa Sponsorship Nursing Jobs: How to Find Them",
    subtitle: "Where to find employers who sponsor international nurses and how to secure a position",
    description: "Find nursing jobs with visa sponsorship. Learn which employers sponsor international nurses, how to search effectively, what to expect from the sponsorship process, and how to evaluate offers.",
    seoKeywords: "nursing visa sponsorship jobs, sponsored nursing jobs, nurse work visa jobs, employer sponsor nursing, international nurse jobs visa, healthcare visa sponsorship, nurse job sponsorship abroad",
    icon: Briefcase,
    sections: [
      { heading: "Understanding Visa Sponsorship", content: "Visa sponsorship means a healthcare employer in a foreign country supports your work visa application. The employer confirms they have a legitimate job offer and need your skills. In most countries, you need a job offer and employer sponsorship before you can obtain a work visa. This guide helps you find sponsoring employers and navigate the process successfully." },
      { heading: "Countries Actively Sponsoring Nurses", content: "These countries have established programs for sponsoring international nurses:", bullets: ["United Kingdom: NHS trusts are the largest sponsors globally. Health and Care Worker visa with reduced fees. Over 40,000 international nurses recruited annually.", "Canada: Employers apply for LMIA (Labour Market Impact Assessment) to sponsor. Provincial Nominee Programs also provide pathways. Some provinces have dedicated healthcare worker streams.", "United States: H-1B visa sponsorship (specialty occupation) and EB-3 green card sponsorship. Schedule A pre-certification means no labor certification needed for nurses. Hospital chains and staffing agencies sponsor regularly.", "Australia: Employer-sponsored visas (subclass 482 TSS, subclass 494 regional). Skilled Employer Sponsored Regional (SESR) for rural areas. Large hospital networks actively recruit.", "UAE/Saudi Arabia: All employment is employer-sponsored by default. Healthcare facilities handle the entire visa process. Very fast processing (2-6 weeks).", "Ireland: Critical Skills Employment Permit for nurses. Healthcare employers regularly sponsor international nurses."] },
      { heading: "Where to Find Sponsored Positions", content: "Best resources for finding nursing jobs with visa sponsorship:", bullets: ["NHS Jobs (UK): nhsjobs.com — filter for international recruitment positions", "Job Bank Canada: jobbank.gc.ca — search for nursing positions with LMIA support", "US hospital systems: Major systems like HCA, Kaiser Permanente, Mayo Clinic, and academic medical centers have international recruitment programs", "International recruitment agencies: Connetics USA, O'Grady Peyton International, MedPro International, Bayshore Healthcare (Canada)", "ApplyNest (NurseNest): Our job platform connects nurses with sponsoring employers across multiple countries", "LinkedIn: Search 'visa sponsorship' + 'registered nurse' in your target country. Follow international recruitment managers.", "Indeed: Filter by visa sponsorship in the advanced search options", "Direct hospital websites: Check the careers/international recruitment section of major hospitals", "Healthcare job fairs: Virtual and in-person events specifically for international nurse recruitment"] },
      { heading: "What Employers Look For", content: "To secure visa sponsorship, you typically need:", bullets: ["Valid nursing license or documented eligibility for licensure in the destination country", "Minimum 1-2 years of recent clinical experience (some employers require 3+ years)", "English language proficiency demonstrated through IELTS, OET, or equivalent test scores", "Credential evaluation completed or in progress (NNAS, CGFNS, etc.)", "In-demand specialty skills — ICU, OR, ER, oncology, and dialysis nurses are in highest demand", "Strong professional references from current or recent nursing supervisors", "Willingness to commit to a minimum contract period (typically 2-3 years)", "Cultural adaptability and willingness to relocate", "Current BLS/ACLS certification (preferred)"] },
      { heading: "The Sponsorship Process", content: "What to expect after securing a sponsored position:", bullets: ["Step 1: Interview and receive conditional job offer", "Step 2: Employer initiates sponsorship paperwork (Certificate of Sponsorship for UK, LMIA for Canada, petition for US)", "Step 3: Complete licensing requirements (if not already done) — some employers support you through this", "Step 4: Attend immigration medical examination with designated physician", "Step 5: Submit visa/work permit application with supporting documents", "Step 6: Receive visa approval and arrange travel", "Step 7: Arrive and complete employer orientation program", "Step 8: Begin supervised practice or full nursing duties", "Timeline: 2-12 months depending on country and visa type"] },
      { heading: "Evaluating Sponsorship Offers", content: "How to assess whether a sponsorship offer is fair and legitimate:", bullets: ["Salary: Should be at or above the prevailing wage for the region — not discounted because you're international", "Contract length: 2-3 years is standard. Anything longer may be restrictive.", "Relocation support: Good employers provide flights, temporary housing, and orientation assistance", "Licensing support: Many employers cover exam fees, preparation resources, and give study time", "Penalty clauses: Review carefully — some contracts have unreasonable penalties for early termination", "Agency fees: You should not pay recruitment fees. Ethical agencies are paid by the employer.", "Benefits: Should include health insurance, pension/retirement, and paid leave comparable to local employees", "Career development: Look for employers offering continuing education, specialty training, and promotion pathways", "Get contract reviewed: Have an independent immigration lawyer or union representative review your contract before signing"] },
      { heading: "Red Flags to Avoid", content: "Warning signs in sponsorship offers:", bullets: ["Large upfront fees charged to the nurse — ethical recruitment is employer-funded", "Unrealistically high salary promises that seem too good to be true", "Pressure to sign quickly without time to review the contract", "Excessive penalty clauses ($10,000+ for early contract termination)", "Unlicensed or unverifiable recruitment agencies", "No clear visa sponsorship timeline or commitment", "Requirements to use specific (and expensive) training or language programs owned by the agency", "No references from previously sponsored nurses", "Contract terms that restrict your ability to change employers after the initial period"] },
    ],
    tips: [
      "Start building your profile on LinkedIn and international nursing job boards 6-12 months before you plan to move",
      "Get your credential evaluation and language testing done before applying — employers prefer candidates who are 'license-ready'",
      "Network with nurses who have successfully been sponsored — they can refer you and share experience",
      "Apply to multiple employers and countries simultaneously to maximize your options",
      "Join NurseNest's ApplyNest platform to access curated visa sponsorship nursing positions",
    ],
    faqs: [
      { question: "Do I have to pay for visa sponsorship?", answer: "No. In reputable arrangements, the employer or recruitment agency covers sponsorship costs. Be extremely cautious of any arrangement that requires you to pay large fees upfront. In the UK, employers are legally required to pay the Immigration Skills Charge. Some minor costs (language testing, document processing) are typically your responsibility." },
      { question: "Can I change employers after arriving?", answer: "This depends on the country and visa type. In the UK, you can change employers with a new Certificate of Sponsorship. In the US, H-1B transfer to a new employer is possible. In Canada, changing employers may require a new LMIA. In Gulf states, visa transfer processes exist but can be complex. Check your specific visa conditions." },
      { question: "What if I get fired or laid off on a sponsored visa?", answer: "Most work visas provide a grace period (typically 60-90 days) to find a new employer or depart the country. Some countries offer more protections — the UK's Health and Care Worker visa has provisions for this. It's important to understand your visa conditions and have a financial safety net." },
      { question: "Is it better to use a recruitment agency or apply directly?", answer: "Both approaches can work. Agencies simplify the process by handling paperwork and have established relationships with employers. Direct applications show initiative and avoid any potential agency issues. Many nurses use both strategies simultaneously. If using an agency, verify they are licensed and have a positive track record." },
    ],
    relatedLinks: [
      { href: "/international-nurses/best-countries", label: "Best Countries for Nurses" },
      { href: "/international-nurses/highest-paying-countries", label: "Highest Paying Countries" },
      { href: "/applynest", label: "Find Jobs on ApplyNest" },
      { href: "/international-nurses", label: "International Nursing Hub" },
    ],
  },
};

function FAQItem({ question, answer, index }: { question: string; answer: string; index: number }) {
  const { t } = useI18n();
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

export function ClusterPageBySlug({ slug }: { slug: string }) {
  const config = CLUSTER_CONFIGS[slug];
  if (!config) return null;

  const IconComponent = config.icon;
  const faqStructuredData = buildFaqStructuredData(config.faqs.map(f => ({ question: f.question, answer: f.answer })));

  return (
    <div data-testid={`page-cluster-${config.slug.replace(/\//g, '-')}`}>
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
          { name: "International Nurses", url: "https://www.nursenest.ca/international-nurses" },
          { name: config.title, url: `https://www.nursenest.ca/${config.slug}` },
        ]}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <BreadcrumbNav items={[
          { name: "Home", url: "https://www.nursenest.ca/" },
          { name: "International Nurses", url: "https://www.nursenest.ca/international-nurses" },
          { name: config.title, url: `https://www.nursenest.ca/${config.slug}` },
        ]} />
      </div>

      <section className="relative py-14 sm:py-20 overflow-hidden" data-testid="section-hero">
        <div className="absolute inset-0 bg-gradient-to-br from-teal-50 via-blue-50/30 to-white" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium bg-teal-100 text-teal-700 mb-4">
              <IconComponent className="w-4 h-4" /> International Nursing
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4" data-testid="text-h1">{config.title}</h1>
            <p className="text-lg text-gray-600 mb-6">{config.subtitle}</p>
            <div className="flex flex-wrap gap-3">
              <Link href="/mock-exams" className="inline-flex items-center gap-2 px-5 py-2.5 bg-teal-600 text-white rounded-xl font-semibold hover:bg-teal-700 transition-colors text-sm" data-testid="button-cta-exam-prep">
                Start Exam Prep <ArrowRight className="w-4 h-4" />
              </Link>
              <Link href="/applynest" className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-teal-700 rounded-xl font-semibold hover:bg-teal-50 border border-teal-200 transition-colors text-sm" data-testid="button-cta-applynest">
                Find Nursing Jobs <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {config.sections.map((section, i) => (
          <section key={i} className={`py-10 ${i < config.sections.length - 1 ? 'border-b border-gray-100' : ''}`} data-testid={`section-${i}`}>
            <h2 className="text-xl font-bold text-gray-900 mb-4">{section.heading}</h2>
            <p className="text-gray-700 leading-relaxed mb-4">{section.content}</p>
            {section.bullets && (
              <div className="space-y-2">
                {section.bullets.map((bullet, j) => (
                  <div key={j} className="flex items-start gap-3 bg-gray-50 rounded-lg p-3">
                    <CheckCircle2 className="w-4 h-4 text-teal-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-gray-700">{bullet}</span>
                  </div>
                ))}
              </div>
            )}
          </section>
        ))}

        {config.tips && config.tips.length > 0 && (
          <section className="py-10 border-b border-gray-100" data-testid="section-tips">
            <h2 className="text-xl font-bold text-gray-900 mb-4">{t("pages.internationalNursingCluster.proTips")}</h2>
            <div className="space-y-2">
              {config.tips.map((tip, i) => (
                <div key={i} className="flex items-start gap-3 bg-teal-50 rounded-lg p-3 border border-teal-100">
                  <CheckCircle2 className="w-4 h-4 text-teal-600 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-teal-800">{tip}</span>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>

      <section className="py-14 bg-teal-600 mt-10" data-testid="section-cta">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold text-white mb-3">{t("pages.internationalNursingCluster.readyToStartYourInternational")}</h2>
          <p className="text-teal-100 mb-6 max-w-2xl mx-auto">{t("pages.internationalNursingCluster.nursenestProvidesComprehensiveExamPrep")}</p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/mock-exams" className="inline-flex items-center gap-2 px-6 py-3 bg-white text-teal-700 rounded-xl font-semibold hover:bg-teal-50" data-testid="button-cta-bottom-exam">
              Explore Exam Prep <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href="/applynest" className="inline-flex items-center gap-2 px-6 py-3 bg-teal-700 text-white rounded-xl font-semibold hover:bg-teal-800 border border-teal-500" data-testid="button-cta-bottom-jobs">
              Find Jobs on ApplyNest <ArrowRight className="w-4 h-4" />
            </Link>
            {config.relatedLinks.map((link, i) => (
              <Link key={i} href={link.href} className="inline-flex items-center gap-2 px-5 py-2.5 bg-teal-500/30 text-white rounded-xl font-medium hover:bg-teal-500/50 text-sm" data-testid={`link-related-${i}`}>
                {link.label} <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {config.faqs.length > 0 && (
        <section className="py-14" data-testid="section-faq">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">{t("pages.internationalNursingCluster.frequentlyAskedQuestions")}</h2>
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

export default function InternationalNursingClusterPage() {
  const rawPath = window.location.pathname.replace(/\/$/, '');
  const localeStripped = rawPath.replace(/^\/(en|fr|es|fil|hi|zh-tw|zh|ar|ko|pt|pa|vi|ht|ur|ja|fa|de|th|tr|id)(\/|$)/, '/');
  const slug = localeStripped.replace(/^\//, '');
  return <ClusterPageBySlug slug={slug} />;
}

export const CLUSTER_SLUGS = Object.keys(CLUSTER_CONFIGS);
