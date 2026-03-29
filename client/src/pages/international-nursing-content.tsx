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
  GraduationCap, AlertTriangle, Globe, Shield, DollarSign,
  Heart, Users, Briefcase, FileText, MapPin,
} from "lucide-react";

interface ContentSection {
  heading: string;
  content: string;
  bullets?: string[];
}

interface ContentConfig {
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  seoKeywords: string;
  icon: typeof Globe;
  sections: ContentSection[];
  tips?: string[];
  faqs: { question: string; answer: string }[];
  relatedLinks: { href: string; label: string }[];
}

const CONTENT_CONFIGS: Record<string, ContentConfig> = {
  "nursing-bridging-programs-explained": {
    slug: "nursing-bridging-programs-explained",
    title: "Nursing Bridging Programs Explained",
    subtitle: "What bridging programs are, who needs them, and how to choose the right one",
    description: "Complete guide to nursing bridging programs for internationally educated nurses. Learn what bridging programs involve, which countries require them, how to choose the right program, and what to expect.",
    seoKeywords: "nursing bridging program, IEN bridging program, nursing bridge course, internationally educated nurse bridging, nursing gap program, nursing transition program",
    icon: BookOpen,
    sections: [
      { heading: "What Is a Nursing Bridging Program?", content: "A nursing bridging program is an educational program designed to help internationally educated nurses (IENs) meet the nursing standards of their destination country. These programs bridge the gap between your existing nursing education and the requirements of the country where you want to practice. They typically combine classroom instruction with supervised clinical placements in local healthcare settings." },
      { heading: "Who Needs a Bridging Program?", content: "Not all internationally educated nurses need a bridging program. The requirement depends on the outcome of your credential evaluation. If the evaluation identifies gaps between your nursing education and the destination country's standards, you may be directed to complete a bridging program.", bullets: ["Nurses whose credential evaluation identifies educational gaps", "Nurses with diplomas (e.g., GNM) rather than bachelor's degrees in some countries", "Nurses who have been out of practice for extended periods", "Nurses from countries with significantly different nursing curricula"] },
      { heading: "What Do Bridging Programs Cover?", content: "Bridging programs are tailored to address the specific gaps identified in your credential evaluation. Common areas covered include:", bullets: ["Canadian/US/UK clinical practice standards and protocols", "Pharmacology and medication management specific to the destination country", "Clinical skills and competencies (hands-on practice)", "Healthcare system orientation and cultural competence", "Professional communication and documentation", "Supervised clinical placements in hospitals or healthcare facilities", "Exam preparation (NCLEX-RN, REx-PN, CBT/OSCE)"] },
      { heading: "Bridging Programs by Country", content: "Different countries have different approaches to bridging programs:", bullets: ["Canada: Well-established programs at colleges like George Brown (ON), BCIT (BC), Mount Royal (AB). Duration: 6-12 months. Often include clinical placements.", "United Kingdom: No formal bridging programs. NHS trusts offer supervised practice periods and preceptorship. OSCE preparation courses available privately.", "Australia: Limited formal programs. Some universities offer transition courses. ANMAC may recommend specific education.", "New Zealand: Competence Assessment Programme (CAP) serves as a bridge for some IENs.", "Ireland: Adaptation periods arranged through healthcare employers."] },
      { heading: "How to Choose a Bridging Program", content: "When selecting a bridging program, consider these factors:", bullets: ["Accreditation — ensure the program is recognized by your regulatory body", "Clinical placement quality — look for programs with established hospital partnerships", "NCLEX/exam preparation — many programs include exam prep as part of the curriculum", "Duration and schedule — programs range from 4-12 months; some offer part-time options", "Cost — bridging programs typically cost $5,000-$15,000; some offer financial assistance", "Support services — look for programs with IEN-specific support (language, cultural transition)", "Pass rates — ask about licensing exam pass rates for program graduates"] },
      { heading: "Financial Considerations", content: "Bridging programs represent a significant financial investment. Here's what to budget for:", bullets: ["Tuition: $5,000-$15,000 depending on program and country", "Living expenses during the program period", "Clinical placement costs (uniforms, equipment, insurance)", "Some employers offer tuition reimbursement for bridging programs", "Government funding may be available in some provinces/countries", "Some programs offer scholarships specifically for IENs"] },
    ],
    tips: [
      "Start researching bridging programs while waiting for your credential evaluation — don't wait for the outcome",
      "Contact program alumni to learn about their experience",
      "Ask about employment connections — many programs have partnerships with healthcare employers",
      "If cost is a barrier, explore employer-sponsored bridging options",
    ],
    faqs: [
      { question: "Are bridging programs mandatory?", answer: "Not always. Bridging programs are required only if your credential evaluation identifies gaps. Many nurses with bachelor's degrees from well-recognized programs may not need bridging. The requirement is determined by your regulatory body based on your credential evaluation outcome." },
      { question: "How long do bridging programs take?", answer: "Most bridging programs run 6-12 months, with some shorter programs available (4-6 months) for nurses with minor gaps. Full-time and part-time options may be available depending on the institution." },
      { question: "Can I work while completing a bridging program?", answer: "Some programs offer part-time schedules that allow you to work. However, clinical placement hours typically require full-time commitment. Check with your specific program about scheduling flexibility." },
    ],
    relatedLinks: [
      { href: "/international-nurses/canada", label: "Nursing in Canada" },
      { href: "/international-nurses", label: "International Nursing Hub" },
      { href: "/nursing-credential-assessment-explained", label: "Credential Assessment Guide" },
    ],
  },
  "international-nurse-salary-comparison": {
    slug: "international-nurse-salary-comparison",
    title: "International Nurse Salary Comparison",
    subtitle: "Compare nursing salaries across countries to make informed career decisions",
    description: "Compare nursing salaries in Canada, USA, UK, Australia, New Zealand, UAE, Saudi Arabia, and Ireland. Includes salary ranges, tax considerations, benefits, and purchasing power analysis.",
    seoKeywords: "nurse salary comparison, international nursing salary, nursing salary by country, nurse pay comparison, highest paying countries nurses, nursing salary worldwide",
    icon: DollarSign,
    sections: [
      { heading: "Nursing Salaries by Country", content: "Nursing salaries vary dramatically around the world. Here's a comprehensive comparison of what you can expect in the most popular destination countries for international nurses." },
      { heading: "North America", content: "North American nursing salaries are among the highest globally.", bullets: ["Canada: CAD $65,000-$95,000/year (staff nurse). Overtime and shift differentials add 10-20%. Benefits include pension, health coverage, and paid vacation.", "United States: USD $60,000-$120,000/year depending on state. California, New York, and Massachusetts pay highest. Travel nursing can pay $80,000-$150,000+. No universal healthcare — employer-provided insurance."] },
      { heading: "United Kingdom & Ireland", content: "UK and Irish salaries are structured through public pay scales.", bullets: ["United Kingdom: GBP £28,000-£50,000/year (NHS Band 5-7). London weighting adds £3,000-5,000. NHS pension, 27+ days annual leave, and full benefits package.", "Ireland: EUR €33,000-€55,000/year (HSE pay scale). Premium payments for weekends and nights. Public sector pension and benefits."] },
      { heading: "Oceania", content: "Australian and New Zealand salaries reflect the region's high cost of living.", bullets: ["Australia: AUD $70,000-$110,000/year. Remote/rural positions offer higher salaries + allowances. Superannuation (pension) and penalty rates for unsociable hours.", "New Zealand: NZD $60,000-$90,000/year. Rural incentives available. Government pension scheme and paid leave."] },
      { heading: "Gulf States", content: "Gulf state salaries are tax-free with substantial benefits packages.", bullets: ["UAE: AED 8,000-20,000/month (USD $2,200-$5,400) — tax-free. Benefits: accommodation, health insurance, annual flights home. Total package value is significantly higher than base salary.", "Saudi Arabia: SAR 6,000-15,000/month (USD $1,600-$4,000) — tax-free. Benefits: accommodation, transportation, insurance, flights. Vision 2030 creating increased demand."] },
      { heading: "Purchasing Power Considerations", content: "Raw salary numbers don't tell the full story. Consider these factors when comparing:", bullets: ["Tax rates: Canada (25-35%), USA (22-37%), UK (20-40%), Australia (19-45%), Gulf states (0%)", "Cost of living: Varies significantly within countries (NYC vs rural USA, London vs Northern England)", "Benefits value: NHS pension, universal healthcare, housing allowances can be worth $10,000-$30,000+", "Exchange rates: Fluctuations can significantly impact the value of your earnings", "Remittance potential: For nurses sending money home, tax-free Gulf salaries may offer the most sending power"] },
      { heading: "Salary Growth and Specialization", content: "Your earning potential increases with experience and specialization:", bullets: ["Senior/charge nurse roles: 20-40% above base salary", "Clinical nurse specialists: 30-50% above base", "Nurse practitioners (where applicable): 50-80% above base", "Overtime and agency/travel nursing: Can double base earnings", "Management roles: Significant salary increase with career progression"] },
    ],
    faqs: [
      { question: "Which country pays nurses the most?", answer: "In absolute terms, the United States offers the highest nursing salaries, especially in high-cost states like California. However, when accounting for tax-free income and benefits packages, Gulf states (UAE, Saudi Arabia) can offer equivalent or higher total compensation. Canada and Australia also offer competitive salaries with strong benefits." },
      { question: "Are Gulf state nursing salaries really tax-free?", answer: "Yes. The UAE and Saudi Arabia have no personal income tax. Additionally, most employment packages include accommodation, health insurance, and annual flights — making the total compensation package very attractive, especially for nurses focused on saving money." },
      { question: "Does specialization increase nursing salary abroad?", answer: "Yes. Specialized nurses (ICU, OR, ER, oncology) command higher salaries in most countries. In the US, specialization can add $10,000-$30,000 to base salary. In the UK, specialist roles are Band 6-7 versus Band 5 for general staff nurses." },
    ],
    relatedLinks: [
      { href: "/international-nurses", label: "International Nursing Hub" },
      { href: "/canada-vs-usa-nursing", label: "Canada vs USA Comparison" },
      { href: "/canada-vs-uk-nursing", label: "Canada vs UK Comparison" },
    ],
  },
  "nursing-visa-sponsorship-guide": {
    slug: "nursing-visa-sponsorship-guide",
    title: "Nursing Visa Sponsorship Guide",
    subtitle: "How to find nursing jobs with visa sponsorship and navigate immigration",
    description: "Complete guide to nursing visa sponsorship. Learn which countries sponsor international nurses, how the visa process works, what employers look for, and how to find sponsored positions.",
    seoKeywords: "nursing visa sponsorship, nurse work visa, sponsored nursing jobs, international nurse visa, nurse immigration visa, healthcare worker visa, nurse employer sponsorship",
    icon: Globe,
    sections: [
      { heading: "What Is Visa Sponsorship for Nurses?", content: "Visa sponsorship is when a healthcare employer in a foreign country supports your work visa application. The employer essentially vouches for you, confirming that you have a legitimate job offer and that they need your skills. Most countries require nurses to have a job offer before issuing a work visa — making employer sponsorship essential for international nurse migration." },
      { heading: "Countries That Sponsor International Nurses", content: "The following countries actively recruit and sponsor international nurses:", bullets: ["United Kingdom: NHS trusts are the largest sponsors. Health and Care Worker visa with reduced fees. Nursing on Shortage Occupation List.", "Canada: LMIA-based work permits through employers. Provincial Nominee Programs with employer support. Some provinces have dedicated healthcare worker streams.", "United States: H-1B and EB-3 green card sponsorship. Schedule A pre-certification for nurses. Hospital chains and staffing agencies as primary sponsors.", "Australia: Employer-sponsored visas (subclass 482, 494). Skilled worker visas don't always require sponsorship. Regional areas offer additional visa pathways.", "UAE/Saudi Arabia: All employment is employer-sponsored. Facilities handle the entire visa process. Fast processing (2-6 weeks)."] },
      { heading: "How to Find Sponsored Nursing Positions", content: "Finding employers who sponsor work visas requires a targeted approach:", bullets: ["NHS Jobs (UK) — uk.indeed.com and nhsjobs.com list sponsored positions", "Job Bank Canada — filter for LMIA-approved positions", "US hospital chains — large systems like HCA, Kaiser, and academic medical centres regularly sponsor", "Recruitment agencies — agencies like O'Grady Peyton, MedPro, and Connetics specialize in international nurse placement", "ApplyNest (NurseNest) — our job platform connects nurses with sponsoring employers", "LinkedIn — search for 'visa sponsorship' + 'registered nurse' in your target country", "Direct hospital websites — check the international recruitment section"] },
      { heading: "What Employers Look For", content: "To secure visa sponsorship, employers typically require:", bullets: ["Valid nursing license or eligibility for licensure in the destination country", "Minimum 1-2 years of clinical experience (some require 3+ years)", "English language proficiency (IELTS/OET scores)", "Credential evaluation completion or in progress", "Specialty skills (ICU, OR, ER nurses are in highest demand)", "Strong professional references", "Willingness to commit to a minimum contract period (usually 2-3 years)"] },
      { heading: "Red Flags in Sponsored Positions", content: "Watch out for these warning signs when evaluating sponsored opportunities:", bullets: ["Agencies that charge large upfront fees to the nurse (reputable agencies are paid by employers)", "Contracts with excessive penalty clauses for early termination", "Unrealistically high salary promises", "Agencies that are not licensed or accredited", "Employers who won't provide clear contract terms before you commit", "Positions that require you to pay for your own visa processing"] },
    ],
    faqs: [
      { question: "Do I have to pay for visa sponsorship?", answer: "In most reputable arrangements, the employer or recruitment agency covers visa sponsorship costs. Be cautious of any agency that asks you to pay large fees upfront. In the UK, employers are legally required to pay the Immigration Skills Charge." },
      { question: "Can I change employers after arriving on a sponsored visa?", answer: "This depends on the country and visa type. In the UK, you can change employers but need a new Certificate of Sponsorship. In the US, changing employers on an H-1B requires a new petition. In the Gulf states, visa transfer processes exist but can be complex." },
      { question: "How long does visa processing take?", answer: "Processing times vary: UK Health and Care Worker visa (2-8 weeks), US H-1B (3-6 months), Canada work permit (1-4 months), Australia employer-sponsored visa (1-6 months), Gulf states (2-6 weeks)." },
    ],
    relatedLinks: [
      { href: "/international-nurses", label: "International Nursing Hub" },
      { href: "/applynest", label: "Find Nursing Jobs (ApplyNest)" },
      { href: "/how-to-transfer-nursing-license", label: "License Transfer Guide" },
    ],
  },
  "working-as-a-nurse-in-canada": {
    slug: "working-as-a-nurse-in-canada",
    title: "Working as a Nurse in Canada: What to Expect",
    subtitle: "Real-world insights into the Canadian nursing work environment for IENs",
    description: "Practical guide to working as a nurse in Canada for internationally educated nurses. Covers work culture, healthcare system, typical schedules, professional expectations, and settling in.",
    seoKeywords: "working as nurse Canada, nursing work environment Canada, Canadian nursing culture, IEN working Canada, nurse life Canada, nursing career Canada, healthcare system Canada nurse",
    icon: Heart,
    sections: [
      { heading: "The Canadian Healthcare System", content: "Canada has a publicly funded universal healthcare system (Medicare) administered by each province/territory. Key things international nurses should know:", bullets: ["Healthcare is publicly funded through taxation — patients don't pay at point of care", "Each province/territory manages its own healthcare system", "Hospitals are a mix of public and private ownership, but all provide publicly funded care", "Primary care is delivered through family physicians, nurse practitioners, and community health centres", "Long-term care and home care are growing sectors with significant nursing demand"] },
      { heading: "Typical Work Schedule", content: "Canadian nursing schedules vary by employer and setting:", bullets: ["Hospital nursing: Usually 12-hour shifts (0700-1900, 1900-0700) in a rotation", "Long-term care: Often 8-hour shifts with rotating days/evenings/nights", "Community health: Usually Monday-Friday daytime hours", "Home care: Flexible scheduling, often Monday-Friday", "Full-time is typically 37.5-40 hours/week", "Overtime is paid at 1.5x-2x regular rate", "Most unionized positions include shift differentials for evenings, nights, and weekends"] },
      { heading: "Work Culture and Professional Expectations", content: "Canadian nursing work culture may differ from what you're used to:", bullets: ["Collaborative, team-based approach — nurses work closely with physicians, allied health, and support staff", "Strong emphasis on patient advocacy — nurses are expected to speak up for patient safety", "Documentation is extensive — electronic health records (EHR) are standard", "Scope of practice is clearly defined — know what you can and cannot do independently", "Professional development is expected — continuing education requirements for license renewal", "Workplace safety is prioritized — zero tolerance for workplace violence policies exist", "Unionized workplaces are common — unions negotiate salaries, benefits, and working conditions"] },
      { heading: "Settling In as an IEN", content: "Practical considerations for international nurses starting work in Canada:", bullets: ["Most employers provide orientation (1-4 weeks) for new hires", "Preceptorship or buddy systems pair you with an experienced nurse during transition", "Join your professional association for networking and support", "Connect with IEN support networks in your community", "Provincial settlement services offer free support for newcomers", "Banking, housing, and transportation will need to be arranged — your employer or immigration consultant can advise", "Winter preparation — Canadian winters are intense; invest in proper clothing"] },
    ],
    faqs: [
      { question: "Is nursing in Canada stressful?", answer: "Like nursing anywhere, it can be demanding. However, Canada offers strong labour protections, unionized workplaces with fair scheduling, comprehensive benefits, and a culture that values work-life balance. Many IENs find the work environment supportive compared to their home countries." },
      { question: "Do Canadian nurses work overtime?", answer: "Overtime is available and paid at premium rates (1.5x-2x). Many nurses choose to work overtime for additional income. However, it's not typically mandatory in most workplaces, though staffing shortages can create pressure to accept extra shifts." },
    ],
    relatedLinks: [
      { href: "/international-nurses/canada", label: "Nursing in Canada Guide" },
      { href: "/international-nurse-salary-comparison", label: "Salary Comparison" },
      { href: "/applynest", label: "Find Nursing Jobs" },
    ],
  },
  "nnas-application-guide": {
    slug: "nnas-application-guide",
    title: "NNAS Application Guide: Step-by-Step",
    subtitle: "How to navigate the NNAS credential evaluation process successfully",
    description: "Detailed guide to applying to the National Nursing Assessment Service (NNAS) for internationally educated nurses seeking nursing registration in Canada. Step-by-step instructions, documents, timelines, and tips.",
    seoKeywords: "NNAS application, NNAS guide, NNAS credential evaluation, NNAS documents, NNAS processing time, National Nursing Assessment Service, NNAS IEN, NNAS Canada nursing",
    icon: FileText,
    sections: [
      { heading: "What Is NNAS?", content: "The National Nursing Assessment Service (NNAS) is the centralized credential evaluation service for internationally educated nurses (IENs) seeking nursing registration in Canada. NNAS assesses your nursing education against Canadian nursing standards and sends an advisory report to your chosen provincial/territorial regulatory body. Almost all provinces require NNAS assessment as the first step in the licensing process." },
      { heading: "Before You Apply", content: "Prepare these before starting your NNAS application:", bullets: ["Identify your target province — NNAS sends reports to the regulatory body you specify", "Gather all educational documents — transcripts, diplomas, curriculum details", "Obtain license verification — your home country's nursing regulatory body must verify your license", "Take your language test — IELTS, OET, or CELBAN scores are required", "Budget approximately CAD $650-$800 for NNAS fees", "Plan for 3-6 months processing time"] },
      { heading: "Step-by-Step Application Process", content: "Follow these steps to complete your NNAS application:", bullets: ["Step 1: Create an account at nnas.ca and start your application online", "Step 2: Complete the personal information section — name, contact, nursing education details", "Step 3: Select your target province/territory — this determines where your report is sent", "Step 4: Pay the application fee (approximately CAD $650)", "Step 5: Request documents from your nursing school — transcripts must be sent directly from the institution to NNAS", "Step 6: Request license verification — your nursing council/board must send verification directly to NNAS", "Step 7: Submit language test scores — arrange for IELTS/OET/CELBAN to send scores to NNAS", "Step 8: Upload supporting documents — passport copies, employment certificates, and other required documents", "Step 9: Monitor your application — track document receipt through your NNAS online portal"] },
      { heading: "Documents Required", content: "NNAS requires the following documents:", bullets: ["Nursing school transcripts (sent directly from the institution)", "Diploma/degree certificate", "Curriculum content outline or course descriptions", "License/registration verification from home country (sent directly from regulatory body)", "Employment/experience certificates from all nursing positions", "English/French language test scores (IELTS, OET, or CELBAN)", "Valid passport or identity document", "Passport-size photographs", "Any additional documents requested based on your specific situation"] },
      { heading: "NNAS Advisory Report", content: "After evaluating your documents, NNAS produces an advisory report that is sent to your chosen provincial regulatory body. The report compares your nursing education in four areas:", bullets: ["Nursing theory — classroom/theoretical education hours and content", "Clinical practice — supervised clinical placement hours and settings", "Professional practice — professional development and continuing education", "Additional competencies — specialty training, certifications, and unique skills"] },
      { heading: "Common NNAS Issues and Solutions", content: "Frequently encountered problems during the NNAS process:", bullets: ["Slow document receipt — institutions in some countries take weeks to respond. Follow up directly with your school and nursing council.", "Missing curriculum information — NNAS may request detailed course descriptions. Contact your nursing school for curriculum documents.", "Application on hold — usually due to missing documents. Check your portal regularly and respond promptly to requests.", "Extended processing — peak periods can extend processing to 6+ months. Apply as early as possible.", "Report unfavorable — if gaps are identified, don't panic. Bridging programs can address most deficiencies."] },
    ],
    tips: [
      "Start gathering documents 2-3 months before applying — institution processing times vary",
      "Request documents from your nursing school and regulatory body simultaneously",
      "Keep copies of everything you submit",
      "Check your NNAS portal weekly for updates and document requests",
      "Begin NCLEX/REx-PN preparation while waiting for NNAS processing",
      "Join online IEN forums for NNAS tips and support from others going through the process",
    ],
    faqs: [
      { question: "How long does NNAS processing take?", answer: "Typical processing time is 3-6 months from when NNAS receives all required documents. Processing can take longer during peak periods. The most common delay is waiting for institutions to send documents to NNAS." },
      { question: "Can I change my target province after applying?", answer: "Yes, you can request to send your advisory report to a different province, but additional fees may apply. Contact NNAS directly to make changes." },
      { question: "What happens if NNAS identifies gaps?", answer: "If gaps are identified, your provincial regulatory body will determine the next steps, which may include a bridging program, additional coursework, or supervised practice. This is common and doesn't mean you can't become registered — it just means additional steps are required." },
    ],
    relatedLinks: [
      { href: "/international-nurses/canada", label: "Nursing in Canada Guide" },
      { href: "/nursing-credential-assessment-explained", label: "Credential Assessment Explained" },
      { href: "/nclex-for-international-nurses", label: "NCLEX for International Nurses" },
    ],
  },
  "cgfns-certification-guide": {
    slug: "cgfns-certification-guide",
    title: "CGFNS Certification Guide for Nurses",
    subtitle: "Navigate the CGFNS credential evaluation for US nursing licensure",
    description: "Complete guide to CGFNS certification for internationally educated nurses seeking US nursing licensure. Covers the application process, VisaScreen, credential evaluation, and costs.",
    seoKeywords: "CGFNS certification, CGFNS guide, CGFNS credential evaluation, VisaScreen nursing, CGFNS application, CGFNS cost, CGFNS processing time, CGFNS IEN",
    icon: Shield,
    sections: [
      { heading: "What Is CGFNS?", content: "The Commission on Graduates of Foreign Nursing Schools (CGFNS International) is a non-profit organization that evaluates and validates the credentials of internationally educated healthcare professionals seeking to practice in the United States. CGFNS offers several programs, with the CGFNS Certification Program and VisaScreen being the most relevant for international nurses." },
      { heading: "CGFNS Programs for Nurses", content: "CGFNS offers multiple services relevant to international nurses:", bullets: ["CGFNS Certification Program — comprehensive credential evaluation including a qualifying exam (some states require this)", "Credentials Evaluation Service (CES) — document-based evaluation without the qualifying exam (accepted by many states)", "VisaScreen — verification of credentials and English proficiency required for most healthcare worker immigration visas", "Certificate of Analysis — detailed analysis of your nursing education for state boards"] },
      { heading: "The Application Process", content: "Follow these steps to apply for CGFNS services:", bullets: ["Step 1: Determine which CGFNS program your target state requires — check with the state Board of Nursing", "Step 2: Create an account at cgfns.org and select your program", "Step 3: Complete the application and pay fees", "Step 4: Request official documents — transcripts, license verification, and other documents must be sent to CGFNS", "Step 5: Complete English proficiency requirements (if applicable)", "Step 6: Take the CGFNS qualifying exam (if required by your program)", "Step 7: Receive your CGFNS certificate or CES report"] },
      { heading: "VisaScreen Certificate", content: "The VisaScreen certificate is required for most healthcare worker immigration visas to the US. It verifies:", bullets: ["Your nursing education meets US standards", "You have a valid nursing license in your home country", "You have passed an English proficiency test", "Your credentials are genuine and verified", "Processing takes 4-8 weeks after all documents are received", "Cost is approximately USD $540", "Valid for 5 years from date of issuance"] },
      { heading: "Costs and Processing Times", content: "Budget for the following CGFNS-related expenses:", bullets: ["CGFNS Certification Program: approximately USD $445-$550", "Credentials Evaluation Service (CES): approximately USD $350", "VisaScreen: approximately USD $540", "CGFNS Qualifying Exam: approximately USD $295 (if required)", "Document verification fees: vary by institution", "Processing time: 2-4 months for credential evaluation; 4-8 weeks for VisaScreen", "Total CGFNS-related costs: approximately USD $800-$1,500"] },
    ],
    faqs: [
      { question: "Do all US states require CGFNS?", answer: "No. Requirements vary by state. Some states accept the CES (Credentials Evaluation Service) instead of the full CGFNS certificate. A few states, like California, accept evaluations from other agencies. Always check with your target state's Board of Nursing." },
      { question: "What is the difference between CGFNS and VisaScreen?", answer: "CGFNS certification evaluates your nursing credentials for state board licensing. VisaScreen is a separate immigration requirement that verifies your credentials and English proficiency for healthcare worker visas. You may need both — CGFNS for licensing and VisaScreen for immigration." },
      { question: "Can I take the CGFNS qualifying exam outside the US?", answer: "Yes. The CGFNS qualifying exam is available at testing centres in select international locations. Check cgfns.org for current test centre locations." },
    ],
    relatedLinks: [
      { href: "/international-nurses/united-states", label: "Nursing in the USA Guide" },
      { href: "/nclex-for-international-nurses", label: "NCLEX for International Nurses" },
      { href: "/nursing-credential-assessment-explained", label: "Credential Assessment Explained" },
    ],
  },
  "nmc-registration-guide-international-nurses": {
    slug: "nmc-registration-guide-international-nurses",
    title: "NMC Registration Guide for International Nurses",
    subtitle: "Complete guide to registering with the UK Nursing and Midwifery Council",
    description: "Step-by-step guide to NMC registration for internationally educated nurses. Covers the CBT exam, OSCE exam, document requirements, and the full registration process.",
    seoKeywords: "NMC registration guide, NMC international nurse, NMC CBT guide, NMC OSCE guide, NMC overseas registration, UK nursing registration, NMC application process",
    icon: Shield,
    sections: [
      { heading: "Overview of NMC Registration", content: "The Nursing and Midwifery Council (NMC) is the regulatory body for nurses and midwives in the UK. All nurses must be registered with the NMC to practice. For internationally educated nurses, the registration process involves document verification, passing the CBT (Part 1), and passing the OSCE (Part 2), along with meeting English language requirements." },
      { heading: "NMC CBT (Computer-Based Test) — Part 1", content: "The CBT is a computer-based multiple-choice test that assesses nursing knowledge:", bullets: ["120 questions in total", "Two parts: Numeracy (15 questions, 30 minutes) and Clinical (100 questions, 2.5 hours)", "Covers: professional values, communication, nursing practice, leadership, and management", "Available at Pearson VUE centres worldwide (including in your home country)", "Pass mark is 60%", "Can be retaken after a 10-day waiting period", "Cost: approximately GBP £83 per attempt", "Tip: Focus on UK-specific nursing standards, NMC Code of Conduct, and medication calculations"] },
      { heading: "NMC OSCE — Part 2", content: "The OSCE is a practical examination assessing clinical competence:", bullets: ["10 stations (scenarios) testing different clinical skills", "Each station is typically 15-20 minutes", "Skills assessed include: patient assessment, vital signs, medication administration, wound care, communication, and clinical decision-making", "Available at NMC-approved test centres (primarily in the UK)", "Must demonstrate competence in all assessed areas", "Can be retaken — individual stations can be repeated", "Cost: approximately GBP £794 per attempt", "Tip: Practice the practical skills extensively — many nurses use OSCE boot camps for preparation"] },
      { heading: "English Language Requirements", content: "The NMC accepts:", bullets: ["IELTS Academic: minimum 7.0 overall, minimum 7.0 in each band (Listening, Reading, Writing, Speaking)", "OET: minimum Grade B in each sub-test (Listening, Reading, Writing, Speaking)", "Scores must be achieved in a single test sitting (no combining)", "Scores must be within 2 years of NMC application", "Some applicants may be exempt if they trained and qualified in a majority English-speaking country"] },
      { heading: "Timeline and Costs", content: "Plan for the following:", bullets: ["Total timeline: 4-8 months from application to registration", "NMC application fee: approximately GBP £140", "CBT fee: approximately GBP £83", "OSCE fee: approximately GBP £794", "IELTS/OET test fee: approximately GBP £195-£300", "NMC annual registration fee: approximately GBP £120", "Total cost: approximately GBP £1,300-£2,000 (excluding language test preparation courses)"] },
    ],
    faqs: [
      { question: "Can I take the CBT in my home country?", answer: "Yes. The CBT is available at Pearson VUE testing centres worldwide. You can take it in your home country before moving to the UK. The OSCE, however, must typically be taken at an NMC-approved centre in the UK." },
      { question: "How many times can I retake the OSCE?", answer: "You can retake the OSCE, and you only need to repeat the stations you failed. There is a waiting period between attempts. Many candidates pass on their second attempt after additional practice." },
      { question: "Do NHS employers help with NMC registration?", answer: "Yes. Many NHS trusts provide support throughout the NMC registration process, including OSCE preparation, supervised practice, and covering some fees. This support is often part of international recruitment packages." },
    ],
    relatedLinks: [
      { href: "/international-nurses/united-kingdom", label: "Nursing in the UK Guide" },
      { href: "/india-to-uk", label: "India to UK Migration" },
      { href: "/ielts-for-nurses", label: "IELTS for Nurses" },
    ],
  },
  "nursing-recruitment-agencies-guide": {
    slug: "nursing-recruitment-agencies-guide",
    title: "Nursing Recruitment Agencies: How to Choose",
    subtitle: "Navigate international nursing recruitment agencies safely and effectively",
    description: "Guide to choosing international nursing recruitment agencies. Learn how agencies work, what to look for, red flags to avoid, and how to protect yourself during the international recruitment process.",
    seoKeywords: "nursing recruitment agency, international nurse recruitment, nurse staffing agency international, nurse recruitment company, how to choose nursing agency, ethical nurse recruitment",
    icon: Users,
    sections: [
      { heading: "How International Nursing Recruitment Works", content: "International nursing recruitment agencies act as intermediaries between healthcare employers (hospitals, health systems) and internationally educated nurses. Reputable agencies are paid by the employer — not the nurse. They handle job matching, credential verification, visa processing support, and relocation assistance. The best agencies provide end-to-end support from initial application through your first months of employment." },
      { heading: "What Reputable Agencies Offer", content: "Good recruitment agencies provide:", bullets: ["Job matching based on your qualifications, experience, and preferences", "Credential evaluation guidance and support", "Visa and immigration assistance", "Relocation support (housing, travel, orientation)", "Pre-departure training and cultural orientation", "Post-arrival support and mentoring", "License/exam preparation resources", "Transparent contract terms and conditions", "Connection with established healthcare employers"] },
      { heading: "Red Flags to Watch For", content: "Be cautious of agencies that:", bullets: ["Charge large upfront fees to the nurse — ethical agencies are paid by employers", "Guarantee specific job placements or salaries before evaluation", "Pressure you to sign contracts quickly without review time", "Have excessive penalty clauses for contract termination", "Are not licensed or registered with relevant authorities", "Have poor online reviews or no verifiable track record", "Won't provide references from nurses they've previously placed", "Require you to use their affiliated services (language schools, training) at high cost", "Make unrealistic promises about timeline or income"] },
      { heading: "How to Evaluate an Agency", content: "Before committing to an agency, check:", bullets: ["Licensing/registration — verify the agency is registered with relevant authorities in both countries", "Track record — how long have they been operating? How many nurses have they placed?", "Employer partnerships — do they work with reputable, named healthcare employers?", "Reviews — check online reviews from nurses who have used their services", "Contracts — have the contract reviewed by an independent party before signing", "Communication — are they responsive, transparent, and willing to answer questions?", "WHO Code compliance — ethical agencies follow the WHO Global Code of Practice on International Recruitment of Health Personnel"] },
      { heading: "Major Reputable Agencies", content: "Well-known international nursing recruitment agencies include:", bullets: ["Connetics USA — large-scale US nurse recruitment with visa sponsorship", "O'Grady Peyton International — established agency placing nurses in the US, UK, and Middle East", "MedPro International — US-focused with comprehensive support programs", "NHS International Recruitment — UK NHS trust-level recruitment", "Alafiya Health Partners — ethical recruitment to Canada and UK", "Bayshore HealthCare International — Canadian recruitment specialist", "Note: This is not an endorsement — always conduct your own due diligence"] },
    ],
    faqs: [
      { question: "Should I pay a recruitment agency to find me a nursing job?", answer: "No. Reputable agencies are paid by the employer, not the nurse. If an agency asks for significant upfront fees, it's a major red flag. Some minor costs (document processing, language testing) may be your responsibility, but job placement fees should be paid by the employer." },
      { question: "Can I apply directly to hospitals without an agency?", answer: "Yes. Many hospitals and health systems accept direct applications from international nurses through their websites. However, agencies can simplify the process by handling visa paperwork, credential verification, and relocation logistics." },
      { question: "How long do recruitment agency contracts typically last?", answer: "Most contracts require a 2-3 year commitment to the sponsoring employer. This is standard for visa-sponsored positions. After the contract period, you're typically free to change employers. Review contract terms carefully before signing." },
    ],
    relatedLinks: [
      { href: "/nursing-visa-sponsorship-guide", label: "Visa Sponsorship Guide" },
      { href: "/international-nurses", label: "International Nursing Hub" },
      { href: "/applynest", label: "Find Nursing Jobs (ApplyNest)" },
    ],
  },
  "cultural-adjustment-international-nurses": {
    slug: "cultural-adjustment-international-nurses",
    title: "Cultural Adjustment Guide for International Nurses",
    subtitle: "Navigating cultural differences in your new nursing workplace and community",
    description: "Practical guide to cultural adjustment for internationally educated nurses. Covers workplace culture, communication styles, patient care differences, and strategies for successful integration.",
    seoKeywords: "cultural adjustment nurse, international nurse culture shock, nursing culture differences, IEN cultural adaptation, nurse workplace culture, international nurse integration",
    icon: Heart,
    sections: [
      { heading: "Understanding Culture Shock", content: "Culture shock is a normal experience for international nurses moving to a new country. It typically follows four stages:", bullets: ["Honeymoon phase (first few weeks) — excitement about the new environment", "Frustration phase (2-6 months) — difficulties with language, customs, and workplace differences become apparent", "Adjustment phase (6-12 months) — you begin to understand and adapt to the new culture", "Acceptance phase (12+ months) — you feel comfortable and integrated in your new environment"] },
      { heading: "Workplace Communication Differences", content: "Communication styles vary significantly between healthcare cultures:", bullets: ["Direct communication — in Western countries, nurses are expected to speak up, question orders, and advocate for patients. This may differ from hierarchical communication in your home country.", "First-name basis — many workplaces use first names between nurses and physicians, which may feel informal", "Assertiveness is valued — speaking up about patient safety concerns is expected and protected", "Written communication — extensive documentation requirements in EHR (electronic health records)", "Phone/verbal orders — specific protocols for receiving and verifying physician orders", "Interdisciplinary communication — nurses participate actively in care planning discussions"] },
      { heading: "Patient Care Differences", content: "Patient care approaches may differ from your training:", bullets: ["Patient autonomy — patients have the right to refuse treatment, even life-saving interventions", "Informed consent — detailed consent processes for procedures", "Pain management — different cultural approaches to pain assessment and management", "End-of-life care — advance directives, DNR orders, and palliative care approaches", "Family involvement — family dynamics in patient care vary by culture", "Privacy and confidentiality — strict HIPAA/privacy legislation requirements", "Patient education — emphasis on teaching patients to manage their own health"] },
      { heading: "Strategies for Successful Adjustment", content: "These strategies can help ease your transition:", bullets: ["Connect with other IENs — they understand your experience and can share practical tips", "Ask questions — it's better to ask than to assume", "Learn the local healthcare terminology — drug names, abbreviations, and clinical terms may differ", "Seek a mentor — many workplaces offer mentorship programs for new international staff", "Access cultural orientation programs — many employers and community organizations offer these", "Be patient with yourself — adjustment takes time", "Maintain connections with home — regular communication with family and friends helps", "Explore your new community — finding familiar foods, cultural events, and communities helps create a sense of belonging", "Take care of your mental health — seek support if you're struggling"] },
    ],
    faqs: [
      { question: "How long does cultural adjustment take?", answer: "Most international nurses report feeling comfortable in their new environment within 12-18 months. The first 3-6 months are typically the most challenging. Having a supportive employer, connecting with other IENs, and actively engaging with your community can speed up the adjustment process." },
      { question: "What if I'm struggling with cultural adjustment?", answer: "Struggling is normal and doesn't mean you've made a wrong decision. Seek support through employee assistance programs, connect with IEN support groups, talk to your manager about any workplace concerns, and don't hesitate to access mental health services. Many employers have specific support programs for international nurses." },
    ],
    relatedLinks: [
      { href: "/international-nurses", label: "International Nursing Hub" },
      { href: "/working-as-a-nurse-in-canada", label: "Working in Canada" },
      { href: "/international-nurses/united-kingdom", label: "Nursing in the UK" },
    ],
  },
  "international-nurse-interview-tips": {
    slug: "international-nurse-interview-tips",
    title: "Interview Tips for International Nurses",
    subtitle: "How to prepare for nursing job interviews in your destination country",
    description: "Interview preparation guide for internationally educated nurses. Learn common interview questions, how to discuss your international experience, cultural interview norms, and tips for video interviews.",
    seoKeywords: "international nurse interview, nursing interview tips, IEN interview preparation, nurse job interview abroad, international nursing interview questions, nurse interview preparation",
    icon: Briefcase,
    sections: [
      { heading: "Interview Formats", content: "International nursing interviews may be conducted in several formats:", bullets: ["Video interview (Zoom/Teams) — most common for international recruitment", "Phone interview — initial screening calls", "In-person panel interview — after arrival or during recruitment events", "Skills assessment — some employers include clinical scenario questions", "Behavioral interview — questions about past experience and how you handled situations", "Group interviews — less common but used by some NHS trusts and large hospital systems"] },
      { heading: "Common Interview Questions", content: "Prepare answers for these frequently asked questions:", bullets: ["Tell us about your nursing experience and specialties", "Why do you want to work in [country/hospital]?", "How do you handle conflict with colleagues or physicians?", "Describe a challenging patient situation and how you managed it", "How do you prioritize care when you have multiple patients?", "What do you know about our healthcare system?", "How will you adapt to a new clinical environment?", "What are your strengths and areas for development?", "Where do you see yourself in 5 years?", "Do you have any questions for us? (Always have questions prepared)"] },
      { heading: "How to Discuss International Experience", content: "Your international experience is an asset — frame it positively:", bullets: ["Highlight the diversity of your clinical experience", "Discuss how you've worked with diverse patient populations", "Show how your cultural background enhances patient care", "Demonstrate adaptability by sharing examples of working in different settings", "Connect your experience to the needs of the employer", "Be honest about areas where you'll need to learn (local protocols, medication names) — this shows self-awareness"] },
      { heading: "Cultural Interview Norms", content: "Interview customs vary by country:", bullets: ["Western countries (Canada, US, UK, Australia) — direct eye contact, firm handshake (in person), confident but not arrogant, ask questions at the end", "Professional dress — business professional unless told otherwise", "Be specific with examples — use the STAR method (Situation, Task, Action, Result)", "Express genuine interest in the organization — research them beforehand", "Follow up with a thank-you email after the interview", "Be on time — for video interviews, test your technology beforehand"] },
      { heading: "Video Interview Tips", content: "Since most international nursing interviews are virtual:", bullets: ["Test your internet connection, camera, and microphone before the interview", "Choose a quiet, well-lit location with a neutral background", "Dress professionally from head to toe (you might need to stand up)", "Look at the camera, not the screen, to maintain 'eye contact'", "Have your resume, the job description, and notes visible but off-screen", "Minimize distractions — close other applications, silence your phone", "If there's a technical issue, stay calm and reconnect professionally"] },
    ],
    faqs: [
      { question: "What should I wear for a video interview?", answer: "Dress in business professional attire — a blouse/shirt with a blazer or professional top. Choose solid colors over patterns. Even though it's a video call, dressing professionally shows respect and helps you feel more confident." },
      { question: "Should I mention salary in the first interview?", answer: "It's generally best to wait until the employer raises salary discussions. For international recruitment, salary and benefits packages are often standardized. If asked about salary expectations, you can say you're open to discussing the standard package offered to international nurses." },
    ],
    relatedLinks: [
      { href: "/applynest", label: "Find Nursing Jobs (ApplyNest)" },
      { href: "/nursing-recruitment-agencies-guide", label: "Recruitment Agencies Guide" },
      { href: "/international-nurses", label: "International Nursing Hub" },
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

export function ContentPageBySlug({ slug }: { slug: string }) {
  const { t } = useI18n();
  const config = CONTENT_CONFIGS[slug];
  if (!config) return null;

  const IconComponent = config.icon;
  const faqStructuredData = buildFaqStructuredData(config.faqs.map(f => ({ question: f.question, answer: f.answer })));

  return (
    <div data-testid={`page-content-${config.slug}`}>
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
              <IconComponent className="w-4 h-4" /> International Nursing
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4" data-testid="text-h1">{config.title}</h1>
            <p className="text-lg text-gray-600">{config.subtitle}</p>
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
            <h2 className="text-xl font-bold text-gray-900 mb-4">{t("pages.internationalNursingContent.proTips")}</h2>
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
          <h2 className="text-2xl font-bold text-white mb-4">{t("pages.internationalNursingContent.exploreMoreInternationalNursingResources")}</h2>
          <div className="flex flex-wrap gap-4 justify-center">
            {config.relatedLinks.map((link, i) => (
              <Link key={i} href={link.href} className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-teal-700 rounded-xl font-medium hover:bg-teal-50 text-sm" data-testid={`link-related-${i}`}>
                {link.label} <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            ))}
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

export default function InternationalNursingContentPage() {
  const rawPath = window.location.pathname.replace(/\/$/, '');
  const localeStripped = rawPath.replace(/^\/(en|fr|es|fil|hi|zh-tw|zh|ar|ko|pt|pa|vi|ht|ur|ja|fa|de|th|tr|id)(\/|$)/, '/');
  const slug = localeStripped.replace(/^\//, '');
  return <ContentPageBySlug slug={slug} />;
}

export const CONTENT_SLUGS = Object.keys(CONTENT_CONFIGS);
